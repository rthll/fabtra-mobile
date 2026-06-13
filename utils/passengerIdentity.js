import { normalizeLineList } from './lineUtils';

export const buildPassengerQrPayload = (passenger) => JSON.stringify({
  type: 'fabtra-passenger',
  version: 1,
  passengerId: String(passenger.id),
  passengerFirebaseId: String(passenger.firebaseId || passenger.id),
  line: String(passenger.line || ''),
  lines: normalizeLineList(passenger.lines || passenger.line),
});

export const parsePassengerQrPayload = (rawValue) => {
  const fallbackValue = String(rawValue ?? '').trim();

  if (!fallbackValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(fallbackValue);

    if (parsed?.type !== 'fabtra-passenger' || parsed?.version !== 1) {
      return {
        passengerId: fallbackValue,
        passengerFirebaseId: fallbackValue,
      };
    }

    const passengerId = String(parsed.passengerId || '').trim();
    const passengerFirebaseId = String(
      parsed.passengerFirebaseId || parsed.passengerId || ''
    ).trim();
    const lines = normalizeLineList(parsed.lines || parsed.line);
    const line = String(parsed.line || lines[0] || '').trim();

    if (!passengerId && !passengerFirebaseId) {
      return null;
    }

    return {
      passengerId,
      passengerFirebaseId,
      line,
      lines,
    };
  } catch (_error) {
    return {
      passengerId: fallbackValue,
      passengerFirebaseId: fallbackValue,
      line: '',
      lines: [],
    };
  }
};
