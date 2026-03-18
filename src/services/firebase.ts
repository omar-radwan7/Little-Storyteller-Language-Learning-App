// ==========================================
// Firebase Configuration
// ==========================================
// Replace these with your actual Firebase config values

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  // @ts-ignore
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyDYf3sASmus5rorXNT58M4k5VJvjngVuTI',
  authDomain: 'language-learning-app-b67ea.firebaseapp.com',
  projectId: 'language-learning-app-b67ea',
  storageBucket: 'language-learning-app-b67ea.firebasestorage.app',
  messagingSenderId: '159187594133',
  appId: '1:159187594133:web:2eb199ae6d180f7c81649c',
  measurementId: 'G-3EXT1M4WG8',
};

const app = initializeApp(firebaseConfig);

// Use AsyncStorage persistence for React Native
let auth: ReturnType<typeof getAuth>;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

const db = getFirestore(app);

export { app, auth, db };
