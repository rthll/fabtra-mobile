import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBRW-P3OwGAMibRpzsL47qmuapZRz36_rM",
  authDomain: "transporte-passes.firebaseapp.com",
  projectId: "transporte-passes",
  storageBucket: "transporte-passes.firebasestorage.app",
  messagingSenderId: "969225947658",
  appId: "1:969225947658:web:82483cf7aa7038ff79adf3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (_error) {
  auth = getAuth(app);
}

export { db, auth };
