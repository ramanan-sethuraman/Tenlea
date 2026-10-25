import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Official Firebase Client Configuration for Tenlea
 * Project ID: tenlea
 * Database: default (Native Cloud Firestore)
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAHe3nIk7G-knJw12WVh_NCydBEJhorIGY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tenlea.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tenlea",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tenlea.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "341250949819",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:341250949819:web:98213885982da458325f9e",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://tenlea-default-rtdb.firebaseio.com"
};

// Initialize Firebase App once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore targeting database 'default' (matching Firebase Console)
export const db = getFirestore(app, 'default');

// Ensure NO emulator connection is active
// (connectFirestoreEmulator is NOT called here)

export default app;
