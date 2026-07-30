const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tenlea_db', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning]: Local MongoDB instance not connected. Run 'mongod' or set MONGO_URI in backend/.env. Error: ${error.message}`);
    console.log(`[Database Notice]: System operates in Demo Mode until MongoDB connection is established.`);
  }
};

module.exports = connectDB;
