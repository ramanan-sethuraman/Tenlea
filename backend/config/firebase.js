const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

let firestoreInstance = null;
let isConfigured = false;
let lastInitError = null;
let credentialSource = 'none';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'tenlea';
const DATABASE_ID = process.env.FIREBASE_DATABASE_ID || 'default';

/**
 * Robust parsing of credentials from all possible environments (Vercel, Railway, Local)
 */
function parseCredentialObject() {
  // 1. Check BASE64 environment variable (safest and recommended for Vercel)
  const base64Env = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.FIREBASE_CREDENTIALS_BASE64;
  if (base64Env && base64Env.trim().length > 20) {
    try {
      const decoded = Buffer.from(base64Env.trim(), 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      return { credential: cert(parsed), source: 'FIREBASE_SERVICE_ACCOUNT_BASE64', error: null };
    } catch (e) {
      console.warn('[Firebase]: Failed to parse base64 env:', e.message);
      return { credential: null, source: 'FIREBASE_SERVICE_ACCOUNT_BASE64 (invalid)', error: e.message };
    }
  }

  // 2. Check JSON string in FIREBASE_SERVICE_ACCOUNT or FIREBASE_CREDENTIALS
  const saEnv = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_CREDENTIALS;
  if (saEnv && saEnv.trim().length > 20) {
    let raw = saEnv.trim();

    // Check if user accidentally pasted a base64 string directly into FIREBASE_SERVICE_ACCOUNT
    if (!raw.startsWith('{') && raw.length > 100) {
      try {
        const decoded = Buffer.from(raw, 'base64').toString('utf8');
        if (decoded.includes('private_key')) {
          return { credential: cert(JSON.parse(decoded)), source: 'FIREBASE_SERVICE_ACCOUNT (auto-base64)', error: null };
        }
      } catch (e) {}
    }

    // Strip leading/trailing single or double quotes
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      raw = raw.slice(1, -1);
    }

    try {
      let parsed = JSON.parse(raw);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed); // Handles double-stringified JSON
      }
      return { credential: cert(parsed), source: 'FIREBASE_SERVICE_ACCOUNT', error: null };
    } catch (e) {
      // Try unescaping escaped newlines and quotes
      try {
        const unescaped = raw.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        const parsed = JSON.parse(unescaped);
        return { credential: cert(parsed), source: 'FIREBASE_SERVICE_ACCOUNT (unescaped)', error: null };
      } catch (err2) {
        console.warn('[Firebase]: Failed to parse FIREBASE_SERVICE_ACCOUNT:', e.message);
        return { credential: null, source: 'FIREBASE_SERVICE_ACCOUNT (parse error)', error: e.message };
      }
    }
  }

  // 3. Check individual variables: FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      let pk = process.env.FIREBASE_PRIVATE_KEY.trim();
      if ((pk.startsWith('"') && pk.endsWith('"')) || (pk.startsWith("'") && pk.endsWith("'"))) {
        pk = pk.slice(1, -1);
      }
      pk = pk.replace(/\\n/g, '\n');

      const credObj = {
        projectId: PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL.trim(),
        privateKey: pk,
      };
      return { credential: cert(credObj), source: 'FIREBASE_CLIENT_EMAIL & FIREBASE_PRIVATE_KEY', error: null };
    } catch (e) {
      console.warn('[Firebase]: Failed to parse individual private key env vars:', e.message);
      return { credential: null, source: 'FIREBASE_PRIVATE_KEY (format error)', error: e.message };
    }
  }

  // 4. Check local serviceAccountKey.json (local dev environment)
  const standardKeyPath = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(standardKeyPath)) {
    try {
      const keyData = JSON.parse(fs.readFileSync(standardKeyPath, 'utf8'));
      return { credential: cert(keyData), source: 'backend/config/serviceAccountKey.json', error: null };
    } catch (e) {
      return { credential: null, source: 'serviceAccountKey.json (parse error)', error: e.message };
    }
  }

  // 5. Check custom key path if configured
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const customKeyPath = path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    if (fs.existsSync(customKeyPath)) {
      try {
        const keyData = JSON.parse(fs.readFileSync(customKeyPath, 'utf8'));
        return { credential: cert(keyData), source: customKeyPath, error: null };
      } catch (e) {
        return { credential: null, source: `${customKeyPath} (error)`, error: e.message };
      }
    }
  }

  return { credential: null, source: 'none', error: 'No Firebase service account credentials found in environment or disk' };
}

/**
 * Initialize Firebase Admin SDK for project 'tenlea'
 */
function initFirebase() {
  if (firestoreInstance) {
    return { db: firestoreInstance, isConfigured };
  }

  const { credential, source, error } = parseCredentialObject();
  credentialSource = source;

  if (error && !credential) {
    lastInitError = error;
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
      lastInitError = null;
      console.log(`🔥 [Firebase Firestore]: Successfully connected to database "${DATABASE_ID}" in project "${PROJECT_ID}" (Source: ${credentialSource})`);
    } catch (err) {
      console.error(`[Firebase Firestore Error]: Initialization failed:`, err.message);
      isConfigured = false;
      lastInitError = err.message;
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
        credentialSource = 'GOOGLE_APPLICATION_CREDENTIALS (ADC)';
        lastInitError = null;
        console.log(`🔥 [Firebase Firestore]: Connected via Application Default Credentials`);
      } catch (err) {
        isConfigured = false;
        lastInitError = err.message;
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
  getLastError: () => lastInitError,
  getCredentialSource: () => credentialSource,
  sanitizeForFirestore,
  parseFromFirestore,
  Timestamp,
  getDb: () => {
    if (!firestoreInstance) initFirebase();
    return firestoreInstance;
  },
};
