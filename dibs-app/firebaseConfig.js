/**
 * Firebase configuration module.
 * Initializes the Firebase app and exports the Firestore database instance.
 * All sensitive configuration values are loaded from environment variables.
 *
 * @module firebaseConfig
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration object.
 * API key is loaded from environment variable EXPO_PUBLIC_FIREBASE_API_KEY.
 * Other values are non-secret project identifiers.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dibs-app-91806.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'dibs-app-91806',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dibs-app-91806.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '595370552825',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:595370552825:web:32ad1adad7fde7fe122128',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-CW07CVQMKY',
};

if (!firebaseConfig.apiKey) {
  console.warn(
    'Firebase API key is missing. Set EXPO_PUBLIC_FIREBASE_API_KEY in your .env file.'
  );
}

const app = initializeApp(firebaseConfig);

/** Firestore database instance for the app */
export const db = getFirestore(app);
