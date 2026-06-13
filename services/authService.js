import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../app/firebase';
import { clearDriver, loadDriver, saveDriver } from '../utils/storage';
import { getPrimaryLine, normalizeLineList } from '../utils/lineUtils';

const USERS_COLLECTION = 'users';

const getDriverLines = (profile) => normalizeLineList(profile?.lines || profile?.line);

const hasDriverAccessScope = (profile) => (
  !!profile?.active
  && profile.role === 'driver'
  && typeof profile.name === 'string'
  && profile.name.trim().length > 0
  && getDriverLines(profile).length > 0
);

const mapDriverProfile = (firebaseUser, profile, fallbackActiveLine = '') => {
  const lines = getDriverLines(profile);
  const activeLine = lines.includes(fallbackActiveLine)
    ? fallbackActiveLine
    : getPrimaryLine(lines);

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    role: profile.role,
    active: profile.active,
    name: profile.name || firebaseUser.email,
    lines,
    line: activeLine,
    activeLine,
    driverId: profile.driverId || firebaseUser.uid,
  };
};

const getUserProfile = async (uid) => {
  const profileRef = doc(db, USERS_COLLECTION, uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    return null;
  }

  return profileSnap.data();
};

const resolveDriverSession = async (firebaseUser) => {
  if (!firebaseUser) {
    await clearDriver();
    return { driver: null, error: '' };
  }

  try {
    const profile = await getUserProfile(firebaseUser.uid);
    const cachedDriver = await loadDriver();

    if (!hasDriverAccessScope(profile)) {
      await signOut(auth);
      await clearDriver();
      return {
        driver: null,
        error: 'Sua conta não possui perfil de motorista ativo.',
        errorCode: 'unauthorized-driver',
      };
    }

    const driver = mapDriverProfile(firebaseUser, profile, cachedDriver?.activeLine || cachedDriver?.line);
    await saveDriver(driver);
    return { driver, error: '' };
  } catch (error) {
    const cachedDriver = await loadDriver();

    if (
      cachedDriver?.uid === firebaseUser.uid
      && cachedDriver.active
      && normalizeLineList(cachedDriver.lines || cachedDriver.line).length > 0
      && cachedDriver.name
    ) {
      return { driver: cachedDriver, error: 'Perfil carregado do cache local.' };
    }

    return {
      driver: null,
      error: 'Não foi possível carregar o perfil do motorista.',
      errorCode: 'driver-profile-load-failed',
    };
  }
};

export const refreshDriverProfile = async (fallbackActiveLine = '') => {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    throw new Error('unauthenticated');
  }

  const profile = await getUserProfile(firebaseUser.uid);

  if (!hasDriverAccessScope(profile)) {
    await signOut(auth);
    await clearDriver();
    throw new Error('unauthorized-driver');
  }

  const driver = mapDriverProfile(firebaseUser, profile, fallbackActiveLine);
  await saveDriver(driver);
  return driver;
};

export const subscribeDriverSession = (onSessionChange) => onAuthStateChanged(
  auth,
  async (firebaseUser) => {
    const session = await resolveDriverSession(firebaseUser);
    onSessionChange(session);
  }
);

export const loginDriver = async (email, password) => {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  const session = await resolveDriverSession(credentials.user);

  if (!session.driver) {
    throw new Error(session.errorCode || 'driver-login-failed');
  }

  return session.driver;
};

export const logoutDriver = async () => {
  await signOut(auth);
  await clearDriver();
};
