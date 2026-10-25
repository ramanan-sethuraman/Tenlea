const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const {
  initFirebase,
  isFirestoreReady,
  getDb,
  PROJECT_ID,
  DATABASE_ID,
  sanitizeForFirestore,
} = require('./config/firebase');
const bcrypt = require('bcryptjs');

async function run() {
  console.log('====================================================');
  console.log(`🔥 TENLEA Cloud Firestore Clean Database Initializer`);
  console.log(`🎯 Target Project: "${PROJECT_ID}" (Database: "${DATABASE_ID}")`);
  console.log('====================================================\n');

  initFirebase();

  if (!isFirestoreReady()) {
    console.error('❌ Firebase credentials not detected.');
    process.exit(1);
  }

  const db = getDb();

  // Ensure ONLY the Official Super Admin user exists
  const adminId = '6adc5b6d2ce035b95820c160';
  const adminRef = db.collection('users').doc(adminId);
  const adminSnap = await adminRef.get();

  if (!adminSnap.exists) {
    const adminUser = {
      _id: adminId,
      name: 'TENLEA Super Admin',
      email: 'admin@tenlea',
      phone: '+91 98765 00001',
      password: bcrypt.hashSync('admin28', 10),
      role: 'ADMIN',
      kycStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await adminRef.set(sanitizeForFirestore(adminUser));
    console.log('👑 [Initialized]: Official Super Admin created in "users" collection (admin@tenlea).');
  } else {
    console.log('ℹ️  [OK]: Official Super Admin already present in "users" collection.');
  }

  const collections = [
    'users',
    'lands',
    'parkingspaces',
    'vehicles',
    'bookings',
    'payments',
    'notifications',
    'reviews',
    'agreements',
    'kycs',
    'disputes',
  ];

  console.log('\n📊 Firestore Status (Clean Production State):');
  console.log('----------------------------------------------------');
  for (const col of collections) {
    const snap = await db.collection(col).get();
    console.log(`  • ${col.padEnd(16)}: ${snap.size} document(s)`);
  }
  console.log('----------------------------------------------------');
  console.log(`\n✅ Database is clean! Only real user actions will create records.`);
  console.log(`🔗 https://console.firebase.google.com/project/${PROJECT_ID}/firestore/databases/${DATABASE_ID}/data\n`);
  process.exit(0);
}

run().catch((err) => {
  console.error('\n❌ Firestore Error:', err.message);
  process.exit(1);
});
