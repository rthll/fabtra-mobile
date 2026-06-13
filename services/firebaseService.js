import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../app/firebase';
import { getPrimaryLine, normalizeLineList } from '../utils/lineUtils';
import { getTodayDateKey } from '../utils/passValidation';

const PASSENGERS_COLLECTION = 'passengers';
const VALIDATIONS_COLLECTION = 'validations';

const sortByName = (items) => (
  [...items].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
);

const mapPassengerDoc = (snapshotDoc) => {
  const data = snapshotDoc.data();
  const lines = normalizeLineList(data.lines || data.line);

  return {
    firebaseId: snapshotDoc.id,
    id: data.id ?? snapshotDoc.id,
    ...data,
    lines,
    line: getPrimaryLine(lines) || data.line || '',
  };
};

export const getValidationTimeValue = (validation) => {
  const candidate = validation?.recordedAt || validation?.clientTimestamp || validation?.timestamp;

  if (!candidate) {
    return 0;
  }

  if (typeof candidate?.toDate === 'function') {
    return candidate.toDate().getTime();
  }

  if (candidate instanceof Date) {
    return candidate.getTime();
  }

  const parsed = new Date(candidate);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

export const formatValidationTimestamp = (validation) => {
  const timestamp = getValidationTimeValue(validation);
  return timestamp ? new Date(timestamp) : null;
};

export const buildValidationId = ({ date, line, passengerId }) => (
  [date, encodeURIComponent(line || 'sem-linha'), String(passengerId)].join('__')
);

export async function fetchPassengersSnapshot() {
  const snapshot = await getDocs(collection(db, PASSENGERS_COLLECTION));
  return sortByName(snapshot.docs.map(mapPassengerDoc));
}

export async function fetchValidationsSnapshot(lines) {
  const normalizedLines = normalizeLineList(lines);

  if (normalizedLines.length === 0) {
    return [];
  }

  const validationsRef = collection(db, VALIDATIONS_COLLECTION);
  const today = getTodayDateKey();
  const snapshots = await Promise.all(
    normalizedLines.map((line) => getDocs(query(
      validationsRef,
      where('line', '==', line),
      where('date', '==', today)
    )))
  );

  const validationMap = new Map();

  snapshots.flatMap((snapshot) => snapshot.docs).forEach((snapshotDoc) => {
    validationMap.set(snapshotDoc.id, {
      validationId: snapshotDoc.id,
      ...snapshotDoc.data(),
    });
  });

  return [...validationMap.values()].sort(
    (a, b) => getValidationTimeValue(b) - getValidationTimeValue(a)
  );
}

export async function createValidation(validation) {
  const validationPayload = { ...validation };
  delete validationPayload.pendingSync;
  delete validationPayload.syncError;
  delete validationPayload.syncStatus;

  const validationId = validationPayload.validationId || buildValidationId(validationPayload);
  const validationRef = doc(db, VALIDATIONS_COLLECTION, validationId);
  const payload = {
    ...validationPayload,
    validationId,
    recordedAt: serverTimestamp(),
    lastSyncedAt: serverTimestamp(),
  };

  try {
    await setDoc(validationRef, payload);

    return {
      status: 'created',
      validation: {
        ...validationPayload,
        validationId,
        pendingSync: false,
        syncStatus: 'synced',
      },
    };
  } catch (error) {
    if (error?.code === 'permission-denied') {
      try {
        const existing = await getDoc(validationRef);

        if (existing.exists()) {
          return {
            status: 'duplicate',
            validation: {
              validationId,
              ...existing.data(),
            },
          };
        }
      } catch (_lookupError) {
        // Ignore secondary lookup failures and preserve the original error below.
      }
    }

    throw error;
  }
}
