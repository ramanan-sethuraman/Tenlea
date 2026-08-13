const mongoose = require('mongoose');
const dns = require('dns');

// Fix Windows DNS resolution issue for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback if DNS server custom override is unavailable
}

const populateDatabase = require('../seedData');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tenlea_db';

  // 1. Try external MONGO_URI if credentials are valid
  if (!mongoUri.includes('USERNAME') && !mongoUri.includes('YOUR_CLUSTER') && !mongoUri.includes('<db_password>')) {
    try {
      const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
      console.log(`[MongoDB Connected]: Live Host -> ${conn.connection.host}`);
      await populateDatabase();
      return;
    } catch (error) {
      console.warn(`[MongoDB Warning]: External MONGO_URI failed (${error.message}). Switching to Embedded Engine...`);
    }
  }

  // 2. Try local MongoDB instance
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/tenlea_db', { serverSelectionTimeoutMS: 2000 });
    console.log(`[MongoDB Connected]: Local Instance -> ${conn.connection.host}`);
    await populateDatabase();
    return;
  } catch (err) {
    console.log(`[Database Engine]: Initializing Embedded In-Memory MongoDB Server...`);
  }

  // 3. Embedded In-Memory MongoDB Engine Fallback
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[MongoDB Connected]: Embedded Live Mongo Engine -> ${conn.connection.host}`);
    await populateDatabase();
  } catch (error) {
    console.warn(`[Database Engine Warning]: Embedded Mongo failed (${error.message}). Operating in Demo API Mode.`);
    mongoose.set('bufferCommands', false);
  }
};

module.exports = connectDB;
