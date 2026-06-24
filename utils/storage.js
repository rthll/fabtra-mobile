import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayDateKey } from './passValidation';

const DRIVER_KEY = 'current-driver';
const PASSENGERS_KEY = 'passengers';
const PENDING_VALIDATIONS_KEY = 'pending-validations';
const LAST_SYNC_KEY = 'last-sync-at';

const scopedKey = (baseKey, scopeKey) => (
  scopeKey ? `${baseKey}::${encodeURIComponent(scopeKey)}` : null
);

export function getDriverDataScope(driver) {
  if (!driver?.uid) {
    return null;
  }

  return driver.uid;
}

export async function loadDriver() {
  const data = await AsyncStorage.getItem(DRIVER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function saveDriver(driver) {
  await AsyncStorage.setItem(DRIVER_KEY, JSON.stringify(driver));
}

export async function clearDriver() {
  await AsyncStorage.removeItem(DRIVER_KEY);
}

export async function loadPassengers(scopeKey) {
  const key = scopedKey(PASSENGERS_KEY, scopeKey);
  if (!key) return [];
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export async function savePassengers(scopeKey, passengers) {
  const key = scopedKey(PASSENGERS_KEY, scopeKey);
  if (!key) return;
  await AsyncStorage.setItem(key, JSON.stringify(passengers));
}

export async function loadValidationsForToday(scopeKey) {
  const prefix = scopedKey('validations', scopeKey);
  if (!prefix) return [];
  const today = getTodayDateKey();
  const data = await AsyncStorage.getItem(`${prefix}-${today}`);
  return data ? JSON.parse(data) : [];
}

export async function saveValidationsForToday(scopeKey, validations) {
  const prefix = scopedKey('validations', scopeKey);
  if (!prefix) return;
  const today = getTodayDateKey();
  await AsyncStorage.setItem(`${prefix}-${today}`, JSON.stringify(validations));
}

export async function loadPendingValidations(scopeKey) {
  const key = scopedKey(PENDING_VALIDATIONS_KEY, scopeKey);
  if (!key) return [];
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export async function savePendingValidations(scopeKey, validations) {
  const key = scopedKey(PENDING_VALIDATIONS_KEY, scopeKey);
  if (!key) return;
  await AsyncStorage.setItem(key, JSON.stringify(validations));
}

// As validacoes sao salvas em chaves diarias (validations::uid-YYYY-MM-DD). Sem
// limpeza, elas se acumulam indefinidamente no AsyncStorage. Mantemos apenas os
// ultimos dias e removemos as chaves mais antigas desse mesmo motorista.
const VALIDATIONS_SNAPSHOT_RETENTION_DAYS = 3;

export async function purgeOldValidationSnapshots(scopeKey) {
  const prefix = scopedKey('validations', scopeKey);
  if (!prefix) return;

  const cutoffDate = new Date(`${getTodayDateKey()}T00:00:00`);
  cutoffDate.setDate(cutoffDate.getDate() - VALIDATIONS_SNAPSHOT_RETENTION_DAYS);
  const pad = (value) => String(value).padStart(2, '0');
  const cutoff = `${cutoffDate.getFullYear()}-${pad(cutoffDate.getMonth() + 1)}-${pad(cutoffDate.getDate())}`;

  const allKeys = await AsyncStorage.getAllKeys();
  const staleKeys = allKeys.filter((key) => {
    if (!key.startsWith(`${prefix}-`)) return false;
    const datePart = key.slice(prefix.length + 1);
    return /^\d{4}-\d{2}-\d{2}$/.test(datePart) && datePart < cutoff;
  });

  if (staleKeys.length > 0) {
    await AsyncStorage.multiRemove(staleKeys);
  }
}

export async function loadLastSyncAt(scopeKey) {
  const key = scopedKey(LAST_SYNC_KEY, scopeKey);
  if (!key) return '';
  return (await AsyncStorage.getItem(key)) || '';
}

export async function saveLastSyncAt(scopeKey, value) {
  const key = scopedKey(LAST_SYNC_KEY, scopeKey);
  if (!key) return;
  await AsyncStorage.setItem(key, value || '');
}
