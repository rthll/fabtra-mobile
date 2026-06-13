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
