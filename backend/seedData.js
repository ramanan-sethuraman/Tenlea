const User = require('./models/User');
const Land = require('./models/Land');
const ParkingSpace = require('./models/ParkingSpace');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');
const Agreement = require('./models/Agreement');
const Dispute = require('./models/Dispute');

const populateDatabase = async () => {
  try {
    const existingUsersCount = await User.countDocuments();
    if (existingUsersCount > 0) {
      console.log(`[Database Engine]: ${existingUsersCount} user records already exist in store.`);
      return;
    }

    console.log('[Database Engine]: Ensuring admin account is configured in store...');

    // Only Seed Official Super Admin Account
    const admin = await User.create({
      name: 'TENLEA Super Admin',
      email: 'admin@tenlea',
      phone: '+91 98765 00001',
      password: 'admin28',
      role: 'ADMIN',
      kycStatus: 'VERIFIED',
    });

    console.log('[Database Engine]: Admin account initialized successfully. No demo accounts created.');
  } catch (err) {
    console.error('[Database Engine Error]: Failed to populate admin data:', err.message);
  }
};

module.exports = populateDatabase;
