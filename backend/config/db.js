const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Non-fatal if runtime disallows overriding DNS
}

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ [MongoDB]: MONGODB_URI not found. Running with In-Memory store.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });
    cachedConnection = conn;
    console.log(`✅ [MongoDB]: Connected successfully to ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
