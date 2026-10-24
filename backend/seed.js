const dotenv = require('dotenv');
const { seedInitialData } = require('./config/store');

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Populating TENLEA in-memory data store...');
    seedInitialData();
    console.log('✅ Database initialization complete!');
    console.log('--------------------------------------------------');
    console.log('Admin Access:');
    console.log('👑 Admin ID:      admin@tenlea');
    console.log('🔑 Password:      admin28');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
