const dotenv = require('dotenv');
const { seedInitialData } = require('./config/store');

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Populating TENLEA in-memory data store...');
    seedInitialData();
    console.log('✅ Database seeding complete!');
    console.log('--------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('👑 Admin:         admin@tenlea           / admin28');
    console.log('🏡 Landowner:     sanjay@landowner.com   / password123');
    console.log('🚗 Vehicle Owner: rahul@driver.com       / password123');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
