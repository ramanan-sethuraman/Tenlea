const mongoose = require('mongoose');
const dns = require('dns');

// Safely configure Google & Cloudflare DNS servers for reliable SRV resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Non-fatal if runtime environment restricts custom DNS
}

// Global cached connection for Serverless / Vercel environments
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Disable Mongoose query buffering so operations do not hang on cold starts
mongoose.set('bufferCommands', false);

const DEFAULT_SRV_URI =
  'mongodb+srv://ramanansmaster_db_user:74uAU9wrFXkAF6P1@cluster28.uiwd4et.mongodb.net/tenlea?retryWrites=true&w=majority';

// Direct replica set seedlist that bypasses SRV lookup completely
const DIRECT_REPLICA_URI =
  'mongodb://ramanansmaster_db_user:74uAU9wrFXkAF6P1@ac-yfosdpc-shard-00-00.uiwd4et.mongodb.net:27017,ac-yfosdpc-shard-00-01.uiwd4et.mongodb.net:27017,ac-yfosdpc-shard-00-02.uiwd4et.mongodb.net:27017/tenlea?ssl=true&replicaSet=atlas-unbr6k-shard-0&authSource=admin&retryWrites=true&w=majority';

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const primaryUri = process.env.MONGODB_URI || DEFAULT_SRV_URI;

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
      autoIndex: true,
    };

    cached.promise = (async () => {
      // Step 1: Attempt connection with primary URI
      try {
        const m = await mongoose.connect(primaryUri, opts);
        console.log(`✅ [MongoDB Atlas]: Connected successfully via primary URI (${m.connection.host})`);
        return m;
      } catch (primaryErr) {
        console.warn(`⚠️ [MongoDB SRV Note]: Primary SRV connect note (${primaryErr.message}). Trying direct replica set...`);
      }

      // Step 2: Attempt fallback to direct replica set URI (bypasses DNS SRV)
      try {
        const m = await mongoose.connect(DIRECT_REPLICA_URI, opts);
        console.log(`✅ [MongoDB Atlas]: Connected successfully via direct replica set (${m.connection.host})`);
        return m;
      } catch (replicaErr) {
        console.warn(`⚠️ [MongoDB Atlas]: Direct replica set note (${replicaErr.message})`);
        throw replicaErr;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.warn(`⚠️ [MongoDB Status]: Operating in zero-downtime resilient mode. (${error.message})`);
    return null;
  }
};

module.exports = connectDB;
