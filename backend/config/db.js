const mongoose = require('mongoose');
const dns = require('dns');

// Fix Windows DNS resolution issue for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore DNS override errors in cloud environments
}

let isConnecting = false;

const connectDB = async () => {
  // Re-use active connection (Serverless Connection Pooling)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) return;
  isConnecting = true;

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tenlea_db';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB Connected]: Live Host -> ${conn.connection.host}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`[MongoDB Error]: Database connection failed: ${error.message}`);
    
    // Only attempt embedded fallback in local non-production environments
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        return await mongoose.connect(memoryUri);
      } catch (e) {
        console.warn(`[Embedded Mongo Fallback Failed]: ${e.message}`);
      }
    }
    throw error;
  }
};

module.exports = connectDB;
