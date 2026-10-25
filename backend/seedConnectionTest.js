const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const path = require('path');

const keyPath = path.join(__dirname, 'config', 'serviceAccountKey.json');
const app = initializeApp({
  credential: cert(require(keyPath)),
  projectId: 'tenlea',
});

const db = getFirestore(app, 'default');

async function main() {
  console.log('Writing verification document to collection "connection_test"...');
  const docRef = await db.collection('connection_test').add({
    appName: 'Tenlea',
    testType: 'Initial Setup Verification',
    verifiedAt: Timestamp.now(),
    status: 'ACTIVE_AND_VERIFIED',
    database: 'default',
    projectId: 'tenlea',
    message: 'Firestore connection is confirmed active and healthy.'
  });
  console.log('Successfully written document with ID:', docRef.id);

  const snapshot = await db.collection('connection_test').get();
  console.log(`Collection "connection_test" now contains ${snapshot.size} document(s).`);
  snapshot.forEach(doc => {
    console.log(` - Document [${doc.id}]:`, doc.data());
  });
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
