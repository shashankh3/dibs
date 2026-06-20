import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "dibs-app-91806.firebaseapp.com",
  projectId: "dibs-app-91806",
  storageBucket: "dibs-app-91806.firebasestorage.app",
  messagingSenderId: "595370552825",
  appId: "1:595370552825:web:32ad1adad7fde7fe122128",
  measurementId: "G-CW07CVQMKY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
