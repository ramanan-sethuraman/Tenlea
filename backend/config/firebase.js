const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

let firestoreInstance = null;
let isConfigured = false;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'tenlea';
const DATABASE_ID = process.env.FIREBASE_DATABASE_ID || 'default';

/**
 * Initialize Firebase Admin SDK for project 'tenlea'
 */
function initFirebase() {
  if (firestoreInstance) {
    return { db: firestoreInstance, isConfigured };
  }

  const standardKeyPath = path.join(__dirname, 'serviceAccountKey.json');
  const customKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    ? path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
    : null;

  let credential = null;

  if (customKeyPath && fs.existsSync(customKeyPath)) {
    try {
      const keyData = JSON.parse(fs.readFileSync(customKeyPath, 'utf8'));
      credential = cert(keyData);
      console.log(`[Firebase]: Loaded service account from ${customKeyPath}`);
    } catch (err) {
      console.warn(`[Firebase]: Failed to read custom key from ${customKeyPath}:`, err.message);
    }
  } else if (fs.existsSync(standardKeyPath)) {
    try {
      const keyData = JSON.parse(fs.readFileSync(standardKeyPath, 'utf8'));
      credential = cert(keyData);
      console.log(`[Firebase]: Loaded service account from config/serviceAccountKey.json`);
    } catch (err) {
      console.warn(`[Firebase]: Failed to parse serviceAccountKey.json:`, err.message);
    }
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const keyData = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = cert(keyData);
      console.log(`[Firebase]: Authenticated using FIREBASE_SERVICE_ACCOUNT env variable`);
    } catch (err) {
      console.warn(`[Firebase]: Failed to parse FIREBASE_SERVICE_ACCOUNT env var:`, err.message);
    }
  } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      credential = cert({
        projectId: PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
      console.log(`[Firebase]: Authenticated using environment variables`);
    } catch (err) {
      console.warn(`[Firebase]: Environment variables failed to initialize:`, err.message);
    }
  }

  if (credential) {
    try {
      let app;
      if (getApps().length === 0) {
        app = initializeApp({
          credential,
          projectId: PROJECT_ID,
        });
      } else {
        app = getApps()[0];
      }

      // Initialize with databaseId ('default' for modern Firebase consoles)
      try {
        firestoreInstance = getFirestore(app, DATABASE_ID);
      } catch (e) {
        firestoreInstance = getFirestore(app);
      }

      firestoreInstance.settings({ ignoreUndefinedProperties: true });
      isConfigured = true;
      console.log(`🔥 [Firebase Firestore]: Successfully connected to database "${DATABASE_ID}" in project "${PROJECT_ID}"`);
    } catch (err) {
      console.error(`[Firebase Firestore Error]: Initialization failed:`, err.message);
      isConfigured = false;
    }
  } else {
    // If no credential provided yet, check if ADC is available
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        let app;
        if (getApps().length === 0) {
          app = initializeApp({ projectId: PROJECT_ID });
        } else {
          app = getApps()[0];
        }
        firestoreInstance = getFirestore(app, DATABASE_ID);
        firestoreInstance.settings({ ignoreUndefinedProperties: true });
        isConfigured = true;
        console.log(`🔥 [Firebase Firestore]: Connected via Application Default Credentials`);
      } catch (err) {
        isConfigured = false;
      }
    } else {
      isConfigured = false;
    }
  }

  return { db: firestoreInstance, isConfigured };
}

/**
 * Check if Firestore is actively configured and reachable
 */
function isFirestoreReady() {
  if (!firestoreInstance) {
    initFirebase();
  }
  return isConfigured && firestoreInstance !== null;
}

/**
 * Clean data for Firestore (convert Dates to Firestore Timestamps, remove functions)
 */
function sanitizeForFirestore(data) {
  if (!data || typeof data !== 'object') return data;
  
  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'function') continue;
    if (key.startsWith('$')) continue;
    if (value instanceof Date) {
      clean[key] = Timestamp.fromDate(value);
    } else if (Array.isArray(value)) {
      clean[key] = value.map((item) => (typeof item === 'object' && item !== null ? sanitizeForFirestore(item) : item));
    } else if (value && typeof value === 'object' && !(value instanceof Timestamp)) {
      clean[key] = sanitizeForFirestore(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Convert Firestore document snapshot to plain JavaScript object with standard Date objects
 */
function parseFromFirestore(docSnap) {
  if (!docSnap.exists) return null;
  const raw = docSnap.data();
  const result = { _id: docSnap.id, ...raw };

  for (const [key, val] of Object.entries(result)) {
    if (val && typeof val.toDate === 'function') {
      result[key] = val.toDate();
    }
  }

  return result;
}

module.exports = {
  PROJECT_ID,
  DATABASE_ID,
  initFirebase,
  isFirestoreReady,
  sanitizeForFirestore,
  parseFromFirestore,
  Timestamp,
  getDb: () => {
    if (!firestoreInstance) initFirebase();
    return firestoreInstance;
  },
};
