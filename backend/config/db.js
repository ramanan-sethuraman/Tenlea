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

  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://ramanansmaster_db_user:28082006@cluster28.uiwd4et.mongodb.net/tenlea_db?retryWrites=true&w=majority&appName=Cluster28';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[MongoDB Connected]: Live Host -> ${conn.connection.host}`);
    isConnecting = false;
    
    // Auto-seed initial demo dataset if database is fresh
    try {
      const populateDatabase = require('../seedData');
      await populateDatabase();
    } catch (e) {
      console.warn('[Auto-seed Warning]:', e.message);
    }
    
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`[MongoDB Error]: Database connection failed: ${error.message}`);
    
    // Attempt embedded in-memory fallback in local non-production environments
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        if (!global.__mongodInstance) {
          global.__mongodInstance = await MongoMemoryServer.create();
        }
        const memoryUri = global.__mongodInstance.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`[Embedded MongoDB Connected]: In-memory engine active at ${memoryUri}`);
        
        // Auto-seed initial demo dataset immediately
        try {
          const populateDatabase = require('../seedData');
          await populateDatabase();
        } catch (e) {
          console.warn('[Auto-seed Warning]:', e.message);
        }
        
        return conn;
      } catch (e) {
        console.warn(`[Embedded Mongo Fallback Failed]: ${e.message}`);
      }
    }
    throw error;
  }
};

module.exports = connectDB;
