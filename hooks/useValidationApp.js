import { useCallback, useEffect, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Alert, AppState } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import {
  loginDriver,
  logoutDriver,
  refreshDriverProfile,
  subscribeDriverSession,
} from '../services/authService';
import {
  buildValidationId,
  createValidation,
  fetchPassengersSnapshot,
  fetchValidationsSnapshot,
  getValidationTimeValue,
} from '../services/firebaseService';
import {
  getTodayDateKey,
  isPassValid,
} from '../utils/passValidation';
import {
  getDriverDataScope,
  loadLastSyncAt,
  loadPassengers as loadCachedPassengers,
  loadPendingValidations,
  loadValidationsForToday,
  saveDriver,
  saveLastSyncAt,
  savePassengers,
  savePendingValidations,
  saveValidationsForToday,
} from '../utils/storage';
import { getPrimaryLine, normalizeLineList, supportsLine } from '../utils/lineUtils';
import { parsePassengerQrPayload } from '../utils/passengerIdentity';

const CACHE_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const IMMEDIATE_SYNC_TIMEOUT_MS = 3000;
const QR_LOOKUP_QUEUE_TYPE = 'qr-lookup';

const isQueuedQrLookup = (validation) => validation?.queueType === QR_LOOKUP_QUEUE_TYPE;

const buildQrLookupValidationId = ({ date, line, scannedPassenger }) => (
  [
    QR_LOOKUP_QUEUE_TYPE,
    date,
    encodeURIComponent(line || 'sem-linha'),
    encodeURIComponent(
      scannedPassenger?.passengerFirebaseId
      || scannedPassenger?.passengerId
      || 'sem-identificador'
    ),
  ].join('__')
);

const findPassengerFromQrPayload = (passengers, scannedPassenger) => (
  passengers.find((item) => (
    (scannedPassenger?.passengerFirebaseId
      && String(item.firebaseId) === scannedPassenger.passengerFirebaseId)
    || (scannedPassenger?.passengerId && String(item.id) === scannedPassenger.passengerId)
  ))
);

const isPassValidOnDate = (passenger, date) => (
  !!passenger?.startDate
  && !!passenger?.endDate
  && passenger.startDate <= date
  && passenger.endDate >= date
);

const hasExistingPassengerValidation = (validations, { date, line, passenger }) => {
  const validationId = buildValidationId({
    date,
    line,
    passengerId: passenger.id,
  });

  return validations.some((validation) => (
    validation.validationId === validationId
    || (
      validation.date === date
      && validation.line === line
      && (
        validation.passengerFirebaseId === passenger.firebaseId
        || validation.passengerId === passenger.id
      )
    )
  ));
};

const haveSameDriverSession = (currentDriver, nextDriver) => (
  currentDriver?.uid === nextDriver?.uid
  && currentDriver?.name === nextDriver?.name
  && currentDriver?.driverId === nextDriver?.driverId
  && currentDriver?.activeLine === nextDriver?.activeLine
  && normalizeLineList(currentDriver?.lines || currentDriver?.line).join('|')
    === normalizeLineList(nextDriver?.lines || nextDriver?.line).join('|')
);

const buildValidationPayload = ({
  passenger,
  driver,
  line,
  method,
  date,
  clientTimestamp,
}) => {
  const validationDate = date || getTodayDateKey();

  return {
    validationId: buildValidationId({
      date: validationDate,
      line,
      passengerId: passenger.id,
    }),
    passengerFirebaseId: passenger.firebaseId,
    passengerId: passenger.id,
    passengerName: passenger.name,
    driverUid: driver.uid,
    driverId: driver.driverId,
    driverName: driver.name,
    line,
    date: validationDate,
    valid: isPassValidOnDate(passenger, validationDate),
    method,
    clientTimestamp: clientTimestamp || new Date().toISOString(),
    source: 'mobile',
  };
};

const mergeValidationLists = (...lists) => {
  const validationMap = new Map();

  lists.flat().forEach((validation) => {
    const validationId = validation?.validationId || (
      validation?.date && validation?.line && validation?.passengerId
        ? buildValidationId(validation)
        : null
    );

    if (validationId) {
      validationMap.set(validationId, {
        ...validation,
        validationId,
      });
    }
  });

  return [...validationMap.values()].sort(
    (a, b) => getValidationTimeValue(b) - getValidationTimeValue(a)
  );
};

const normalizeAuthError = (error) => {
  if (!error) {
    return '';
  }

  if (
    error.message === 'unauthorized-driver' ||
    error.message === 'driver-login-failed'
  ) {
    return 'Sua conta nao possui perfil de motorista ativo.';
  }

  return 'Falha ao efetuar login. Verifique usuario e senha.';
};

const getFirebaseErrorCode = (error) => {
  if (!error) {
    return '';
  }

  return String(error.code || error.message || '').replace('FirebaseError: ', '');
};

const isRetryableSyncError = (error, isOnline = true) => {
  const code = getFirebaseErrorCode(error);
  const message = String(error?.message || '').toLowerCase();

  if (isOnline === false) {
    return true;
  }

  return [
    'unavailable',
    'deadline-exceeded',
    'resource-exhausted',
    'aborted',
    'cancelled',
    'network-request-failed',
  ].includes(code) || (
    message.includes('offline')
    || message.includes('network')
    || message.includes('fetch')
    || message.includes('failed to get document because the client is offline')
  );
};

const hasLineMismatch = (driverLine, passengerLines) => (
  !!driverLine
  && normalizeLineList(passengerLines).length > 0
  && !supportsLine(passengerLines, driverLine)
);

const getValidationSyncErrorMessage = (error) => {
  const code = getFirebaseErrorCode(error);

  if (code === 'permission-denied') {
    return 'A validacao foi recusada pelo Firestore. Verifique as regras publicadas, a linha do motorista e a linha do passageiro.';
  }

  if (code === 'failed-precondition') {
    return 'O Firestore pediu um indice para essa consulta ou gravacao. Revise a configuracao do projeto no console.';
  }

  if (code === 'unauthenticated') {
    return 'Sua sessao expirou. Entre novamente no aplicativo.';
  }

  if (code === 'not-found') {
    return 'O passageiro nao foi encontrado no Firestore para concluir a validacao.';
  }

  return 'Nao foi possivel sincronizar a validacao com o servidor.';
};

const getDriverLineSyncError = (validation, syncDriver) => {
  const driverLines = normalizeLineList(syncDriver?.lines || syncDriver?.line);

  if (!validation?.line) {
    return 'Validacao sem linha ativa. Selecione a linha do motorista e tente novamente.';
  }

  if (!driverLines.includes(validation.line)) {
    return `A linha "${validation.line}" nao pertence mais ao perfil atual deste motorista.`;
  }

  return '';
};

const getFirstFailedSyncError = (validations) => (
  validations.find((validation) => validation.syncStatus === 'failed' && validation.syncError)?.syncError
  || ''
);

const getQueuedValidation = (validation, overrides = {}) => ({
  ...validation,
  pendingSync: true,
  syncStatus: 'pending',
  syncError: '',
  ...overrides,
});

const createSyncTimeoutError = () => {
  const error = new Error('sync-timeout');
  error.code = 'sync-timeout';
  return error;
};

const hasNetworkConnection = (networkState) => (
  networkState.isConnected === true
  && networkState.isInternetReachable !== false
);

export function useValidationApp() {
  const [driver, setDriver] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cachedPassengers, setCachedPassengers] = useState([]);
  const [syncedValidations, setSyncedValidations] = useState([]);
  const [pendingValidations, setPendingValidations] = useState([]);
  const [lastSyncAt, setLastSyncAt] = useState('');
  const [selectedPassenger, setSelectedPassengerState] = useState(null);
  const [validationMethod, setValidationMethod] = useState('MANUAL');
  const [scannerActive, setScannerActive] = useState(false);
  const [showQRCode, setShowQRCode] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [permission, requestPermission] = useCameraPermissions();
  const [activeLine, setActiveLineState] = useState('');
  const [appState, setAppState] = useState(AppState.currentState);

  const pendingValidationsRef = useRef([]);
  const syncedValidationsRef = useRef([]);
  const cachedPassengersRef = useRef([]);
  const syncInFlightRef = useRef(false);
  const networkOnlineRef = useRef(null);

  const dataScope = getDriverDataScope(driver);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    pendingValidationsRef.current = pendingValidations;
  }, [pendingValidations]);

  useEffect(() => {
    syncedValidationsRef.current = syncedValidations;
  }, [syncedValidations]);

  useEffect(() => {
    cachedPassengersRef.current = cachedPassengers;
  }, [cachedPassengers]);

  useEffect(() => {
    const unsubscribe = subscribeDriverSession(({ driver: sessionDriver, error }) => {
      setDriver(sessionDriver);
      setActiveLineState((currentLine) => {
        const nextLines = normalizeLineList(sessionDriver?.lines || sessionDriver?.line);
        return nextLines.includes(currentLine) ? currentLine : getPrimaryLine(nextLines);
      });
      setAuthError(error || '');
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!driver) {
      if (activeLine) {
        setActiveLineState('');
      }
      return;
    }

    const nextLines = normalizeLineList(driver.lines || driver.line);
    const nextActiveLine = nextLines.includes(activeLine) ? activeLine : getPrimaryLine(nextLines);

    if (nextActiveLine !== activeLine) {
      setActiveLineState(nextActiveLine);
    }
  }, [activeLine, driver]);

  const getIdleSyncStatus = useCallback(() => {
    if (appState !== 'active') {
      return 'paused';
    }

    if (networkOnlineRef.current === false || pendingValidationsRef.current.length) {
      return 'offline';
    }

    return 'idle';
  }, [appState]);

  const persistPassengers = useCallback(async (passengers) => {
    cachedPassengersRef.current = passengers;
    setCachedPassengers(passengers);
    if (dataScope) {
      await savePassengers(dataScope, passengers);
    }
  }, [dataScope]);

  const persistSyncedValidations = useCallback(async (validations) => {
    syncedValidationsRef.current = validations;
    setSyncedValidations(validations);
    if (dataScope) {
      await saveValidationsForToday(dataScope, validations);
    }
  }, [dataScope]);

  const persistPendingQueue = useCallback(async (validations) => {
    pendingValidationsRef.current = validations;
    setPendingValidations(validations);
    if (dataScope) {
      await savePendingValidations(dataScope, validations);
    }
  }, [dataScope]);

  const persistLastSync = useCallback(async (value) => {
    setLastSyncAt(value);
    if (dataScope) {
      await saveLastSyncAt(dataScope, value);
    }
  }, [dataScope]);

  const hydrateCachedData = useCallback(async () => {
    if (!dataScope) {
      cachedPassengersRef.current = [];
      syncedValidationsRef.current = [];
      pendingValidationsRef.current = [];
      setCachedPassengers([]);
      setSyncedValidations([]);
      setPendingValidations([]);
      setLastSyncAt('');
      return;
    }

    const [passengers, validations, queuedValidations, cachedLastSyncAt] = await Promise.all([
      loadCachedPassengers(dataScope),
      loadValidationsForToday(dataScope),
      loadPendingValidations(dataScope),
      loadLastSyncAt(dataScope),
    ]);

    syncedValidationsRef.current = validations;
    pendingValidationsRef.current = queuedValidations;
    cachedPassengersRef.current = passengers;
    setCachedPassengers(passengers);
    setSyncedValidations(validations);
    setPendingValidations(queuedValidations);
    setLastSyncAt(cachedLastSyncAt);
  }, [dataScope]);

  const flushPendingQueue = useCallback(async (
    passengerCatalog = cachedPassengersRef.current,
    syncDriver = driver
  ) => {
    if (!syncDriver || !pendingValidationsRef.current.length) {
      return {
        syncedCount: 0,
        failedCount: 0,
        pendingCount: pendingValidationsRef.current.length,
        firstFailedError: '',
      };
    }

    const remaining = [];
    const synced = [];
    let knownSyncedValidations = syncedValidationsRef.current;

    for (const queuedValidation of pendingValidationsRef.current) {
      let validationToSync = {
        ...queuedValidation,
        driverUid: syncDriver.uid,
        driverId: syncDriver.driverId,
        driverName: syncDriver.name,
      };

      if (isQueuedQrLookup(queuedValidation)) {
        const passenger = findPassengerFromQrPayload(
          passengerCatalog,
          queuedValidation.passengerLookup || queuedValidation
        );

        if (!passenger) {
          remaining.push(getQueuedValidation(queuedValidation, {
            syncStatus: 'pending',
            syncError: '',
          }));
          continue;
        }

        if (hasLineMismatch(queuedValidation.line, passenger.lines || passenger.line)) {
          remaining.push(getQueuedValidation(queuedValidation, {
            syncStatus: 'failed',
            syncError: 'QR Code resolvido, mas o passageiro pertence a outra linha.',
          }));
          continue;
        }

        if (hasExistingPassengerValidation(knownSyncedValidations, {
          date: queuedValidation.date,
          line: queuedValidation.line,
          passenger,
        })) {
          continue;
        }

        validationToSync = buildValidationPayload({
          passenger,
          driver: syncDriver,
          line: queuedValidation.line,
          method: 'AUTOMATICO',
          date: queuedValidation.date,
          clientTimestamp: queuedValidation.clientTimestamp,
        });
      }

      const driverLineError = getDriverLineSyncError(validationToSync, syncDriver);

      if (driverLineError) {
        remaining.push(getQueuedValidation(queuedValidation, {
          syncStatus: 'failed',
          syncError: driverLineError,
        }));
        continue;
      }

      try {
        const result = await createValidation({
          ...validationToSync,
          pendingSync: false,
        });

        if (result.status === 'created' || result.status === 'duplicate') {
          const syncedValidation = {
            ...validationToSync,
            ...result.validation,
            pendingSync: false,
            syncStatus: 'synced',
            syncError: '',
          };

          synced.push(syncedValidation);
          knownSyncedValidations = mergeValidationLists(
            knownSyncedValidations,
            [syncedValidation]
          );
        }
      } catch (error) {
        if (isRetryableSyncError(error, networkOnlineRef.current)) {
          remaining.push(getQueuedValidation(queuedValidation, {
            syncStatus: 'pending',
            syncError: '',
          }));
        } else {
          remaining.push(getQueuedValidation(queuedValidation, {
            syncStatus: 'failed',
            syncError: getValidationSyncErrorMessage(error),
          }));
        }
      }
    }

    if (synced.length > 0) {
      await persistSyncedValidations(mergeValidationLists(syncedValidationsRef.current, synced));
    }

    await persistPendingQueue(remaining);

    const failedCount = remaining.filter((validation) => validation.syncStatus === 'failed').length;

    return {
      syncedCount: synced.length,
      failedCount,
      pendingCount: remaining.length,
      firstFailedError: getFirstFailedSyncError(remaining),
    };
  }, [driver, persistPendingQueue, persistSyncedValidations]);

  const syncCache = useCallback(async ({ interactive = false } = {}) => {
    if (!driver || !dataScope) {
      return false;
    }

    if (syncInFlightRef.current) {
      return false;
    }

    if (networkOnlineRef.current === false) {
      setSyncStatus(getIdleSyncStatus());

      if (interactive) {
        Alert.alert('Sincronizacao', 'Sem conexao com a internet no momento.');
      }

      return false;
    }

    syncInFlightRef.current = true;
    setSyncStatus('syncing');

    try {
      let syncDriver = driver;

      try {
        const refreshedDriver = await refreshDriverProfile(activeLine || driver.activeLine || driver.line);
        syncDriver = refreshedDriver;

        if (!haveSameDriverSession(driver, refreshedDriver)) {
          setDriver(refreshedDriver);
          setActiveLineState(refreshedDriver.activeLine || refreshedDriver.line);
        }
      } catch (profileError) {
        console.error('Erro ao atualizar perfil do motorista antes da sincronizacao:', profileError);
      }

      const driverLines = normalizeLineList(syncDriver.lines || syncDriver.line);
      const [passengers, validations] = await Promise.all([
        fetchPassengersSnapshot(),
        fetchValidationsSnapshot(driverLines),
      ]);

      await persistPassengers(passengers);
      await persistSyncedValidations(validations);
      await persistLastSync(new Date().toISOString());

      const queueResult = await flushPendingQueue(passengers, syncDriver);
      setSyncStatus(getIdleSyncStatus());

      if (interactive) {
        const message = queueResult.failedCount > 0
          ? `Cache atualizado. Algumas validacoes ainda falharam: ${queueResult.firstFailedError || 'verifique as pendencias.'}`
          : queueResult.pendingCount > 0
            ? 'Cache atualizado. Ainda existem validacoes aguardando nova tentativa.'
          : 'Cache sincronizado com sucesso.';
        Alert.alert('Sincronizacao', message);
      }

      return true;
    } catch (error) {
      console.error('Erro ao sincronizar cache local:', error);
      setSyncStatus(getIdleSyncStatus() === 'paused' ? 'paused' : 'offline');

      if (interactive) {
        Alert.alert('Sincronizacao', 'Nao foi possivel atualizar o cache agora.');
      }

      return false;
    } finally {
      syncInFlightRef.current = false;
    }
  }, [
    activeLine,
    dataScope,
    driver,
    flushPendingQueue,
    getIdleSyncStatus,
    persistLastSync,
    persistPassengers,
    persistSyncedValidations,
  ]);

  useEffect(() => {
    let mounted = true;

    const handleNetworkState = (state) => {
      const isOnline = hasNetworkConnection(state);
      const wasOnline = networkOnlineRef.current;
      networkOnlineRef.current = isOnline;

      if (!mounted) {
        return;
      }

      if (!isOnline) {
        if (driver) {
          setSyncStatus(appState === 'active' ? 'offline' : 'paused');
        }
        return;
      }

      if (appState !== 'active') {
        setSyncStatus('paused');
        return;
      }

      if (driver && dataScope) {
        if (wasOnline === false) {
          syncCache();
        } else if (!syncInFlightRef.current) {
          setSyncStatus(getIdleSyncStatus());
        }
      }
    };

    const unsubscribe = NetInfo.addEventListener(handleNetworkState);
    NetInfo.fetch().then(handleNetworkState).catch(() => {});

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [appState, dataScope, driver, getIdleSyncStatus, syncCache]);

  useEffect(() => {
    let cancelled = false;
    let syncTimer;

    const initializeData = async () => {
      if (!driver || !dataScope) {
        cachedPassengersRef.current = [];
        syncedValidationsRef.current = [];
        pendingValidationsRef.current = [];
        setCachedPassengers([]);
        setSyncedValidations([]);
        setPendingValidations([]);
        setLastSyncAt('');
        setDataLoading(false);
        setSyncStatus(appState === 'active' ? 'idle' : 'paused');
        return;
      }

      setDataLoading(true);
      await hydrateCachedData();

      if (cancelled) {
        return;
      }

      setDataLoading(false);

      if (appState !== 'active') {
        setSyncStatus('paused');
        return;
      }

      await syncCache();

      if (cancelled) {
        return;
      }

      syncTimer = setInterval(() => {
        syncCache();
      }, CACHE_REFRESH_INTERVAL_MS);
    };

    initializeData();

    return () => {
      cancelled = true;
      clearInterval(syncTimer);
    };
  }, [appState, dataScope, driver, hydrateCachedData, syncCache]);

  const setSelectedPassenger = (passenger, method = 'MANUAL') => {
    setSelectedPassengerState(passenger);
    if (passenger) {
      setValidationMethod(method);
    }
  };

  const login = async (email, password) => {
    setLoginLoading(true);
    setAuthError('');

    try {
      await loginDriver(email, password);
    } catch (error) {
      const friendlyError = normalizeAuthError(error);
      setAuthError(friendlyError);
      throw new Error(friendlyError);
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    await logoutDriver();
    setSearchTerm('');
    setSelectedPassengerState(null);
    setShowQRCode(null);
    setScannerActive(false);
  };

  const setActiveLine = async (nextLine) => {
    const normalizedLine = String(nextLine || '').trim();

    if (!driver || !normalizedLine || normalizedLine === activeLine) {
      return;
    }

    if (!normalizeLineList(driver.lines || driver.line).includes(normalizedLine)) {
      return;
    }

    const nextDriver = {
      ...driver,
      line: normalizedLine,
      activeLine: normalizedLine,
    };

    setDriver(nextDriver);
    setActiveLineState(normalizedLine);
    setSelectedPassengerState(null);
    setShowQRCode(null);
    setScannerActive(false);
    setSearchTerm('');
    await saveDriver(nextDriver);
  };

  const refreshCache = async () => {
    if (!driver) {
      return;
    }

    await syncCache({ interactive: true });
  };

  const syncValidationNow = useCallback(async (validation) => {
    const operation = createValidation(validation);
    operation.catch(() => {});

    return Promise.race([
      operation,
      new Promise((_, reject) => {
        setTimeout(() => reject(createSyncTimeoutError()), IMMEDIATE_SYNC_TIMEOUT_MS);
      }),
    ]);
  }, []);

  const allValidations = mergeValidationLists(syncedValidations, pendingValidations);

  const validatePass = async (passenger) => {
    if (!driver) {
      Alert.alert('Erro', 'Motorista nao autenticado.');
      return;
    }

    if (hasLineMismatch(activeLine, passenger?.lines || passenger?.line)) {
      Alert.alert('Linha divergente', 'Esse passageiro pertence a outra linha e nao pode ser validado neste aparelho.');
      setSelectedPassenger(null);
      setScannerActive(false);
      return;
    }

    const today = getTodayDateKey();

    if (hasExistingPassengerValidation(allValidations, {
      date: today,
      line: activeLine,
      passenger,
    })) {
      setSelectedPassenger(null);
      setScannerActive(false);
      Alert.alert('Ja validado', 'Este passe ja foi validado para esta linha hoje.');
      return;
    }

    const baseValidation = buildValidationPayload({
      passenger,
      driver,
      line: activeLine,
      method: validationMethod,
      date: today,
    });
    const validationId = baseValidation.validationId;
    const queuedValidation = getQueuedValidation(baseValidation);

    try {
      await persistPendingQueue(mergeValidationLists(
        pendingValidationsRef.current,
        [queuedValidation]
      ));

      setSelectedPassenger(null);
      setSearchTerm('');
      setScannerActive(false);

      if (networkOnlineRef.current === false) {
        const offlineError = new Error('network-request-failed');
        offlineError.code = 'network-request-failed';
        throw offlineError;
      }

      setSyncStatus('syncing');
      const result = await syncValidationNow(baseValidation);
      const syncedValidation = {
        ...baseValidation,
        ...result.validation,
        pendingSync: false,
        syncStatus: 'synced',
        syncError: '',
      };

      await persistPendingQueue(
        pendingValidationsRef.current.filter(
          (validation) => validation.validationId !== validationId
        )
      );
      await persistSyncedValidations(mergeValidationLists(syncedValidationsRef.current, [syncedValidation]));
      setSyncStatus(getIdleSyncStatus());

      if (result.status === 'duplicate') {
        Alert.alert('Ja validado', 'Este passe ja foi validado para esta linha hoje.');
      } else {
        Alert.alert('Sucesso', 'Passe validado com sucesso.');
      }
    } catch (error) {
      if (isRetryableSyncError(error, networkOnlineRef.current)) {
        await persistPendingQueue(mergeValidationLists(
          pendingValidationsRef.current.filter(
            (validation) => validation.validationId !== validationId
          ),
          [queuedValidation]
        ));
        setSyncStatus('offline');
        Alert.alert('Sem conexao', 'Validacao salva localmente e pendente de sincronizacao.');
      } else {
        console.error('Erro ao sincronizar validacao:', error);
        await persistPendingQueue(mergeValidationLists(
          pendingValidationsRef.current.filter(
            (validation) => validation.validationId !== validationId
          ),
          [getQueuedValidation(baseValidation, {
            syncStatus: 'failed',
            syncError: getValidationSyncErrorMessage(error),
          })]
        ));
        setSyncStatus(getIdleSyncStatus());
        Alert.alert('Erro de sincronizacao', getValidationSyncErrorMessage(error));
      }
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    const scannedPassenger = parsePassengerQrPayload(data);

    if (!scannedPassenger) {
      setScannerActive(false);
      Alert.alert('Erro', 'QR Code invalido.');
      return;
    }

    if (hasLineMismatch(activeLine, scannedPassenger.lines || scannedPassenger.line)) {
      setScannerActive(false);
      Alert.alert('Linha divergente', 'Esse QR Code pertence a outra linha.');
      return;
    }

    const passenger = findPassengerFromQrPayload(cachedPassengers, scannedPassenger);

    if (!passenger) {
      const today = getTodayDateKey();
      const queuedLookup = getQueuedValidation({
        validationId: buildQrLookupValidationId({
          date: today,
          line: activeLine,
          scannedPassenger,
        }),
        queueType: QR_LOOKUP_QUEUE_TYPE,
        passengerLookup: scannedPassenger,
        passengerFirebaseId: scannedPassenger.passengerFirebaseId || '',
        passengerId: scannedPassenger.passengerId || '',
        passengerName: 'QR Code pendente',
        driverUid: driver.uid,
        driverId: driver.driverId,
        driverName: driver.name,
        line: activeLine,
        date: today,
        valid: false,
        method: 'AUTOMATICO',
        clientTimestamp: new Date().toISOString(),
        source: 'mobile',
      });

      await persistPendingQueue(mergeValidationLists(
        pendingValidationsRef.current,
        [queuedLookup]
      ));

      setScannerActive(false);
      Alert.alert(
        'Passageiro nao encontrado no cache',
        'QR Code salvo na fila. O app tentara validar automaticamente quando atualizar os dados online.'
      );
      syncCache();
      return;
    }

    if (hasLineMismatch(activeLine, passenger?.lines || passenger?.line)) {
      setScannerActive(false);
      Alert.alert('Linha divergente', 'Esse QR Code pertence a outra linha.');
      return;
    }

    setSelectedPassenger(passenger, 'AUTOMATICO');
    setScannerActive(false);
  };

  const filteredPassengers = cachedPassengers.filter(
    (passenger) => supportsLine(passenger.lines || passenger.line, activeLine) && (
      (passenger.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      || String(passenger.id || '').includes(searchTerm)
      || String(passenger.phone || '').includes(searchTerm)
    )
  );

  const today = getTodayDateKey();
  const todayValidations = allValidations.filter(
    (validation) => validation.date === today && validation.line === activeLine
  );
  const availableLines = normalizeLineList(driver?.lines || driver?.line);

  return {
    activeLine,
    authError,
    authReady,
    availableLines,
    driver,
    filteredPassengers,
    handleBarCodeScanned,
    hasPermission: permission?.granted ?? false,
    isPassValid,
    lastSyncAt,
    loading: !authReady || dataLoading,
    login,
    loginLoading,
    logout,
    pendingSyncCount: pendingValidations.length,
    refreshCache,
    requestCameraPermission: requestPermission,
    scannerActive,
    searchTerm,
    selectedPassenger,
    setActiveLine,
    setScannerActive,
    setSearchTerm,
    setSelectedPassenger,
    showQRCode,
    setShowQRCode,
    syncStatus,
    todayValidations,
    validatePass,
  };
}
