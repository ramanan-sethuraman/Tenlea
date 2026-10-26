const mongoose = require('mongoose');
const dns = require('dns');

// Only override DNS servers on local Windows to resolve ISP SRV issues; never in production / Vercel
if (process.platform === 'win32' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch (e) {
    // Non-fatal
  }
}

// Global cached connection for Serverless / Vercel environments
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ [MongoDB]: MONGODB_URI not found.');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log(`✅ [MongoDB]: Connected successfully to ${m.connection.host}/${m.connection.name}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
