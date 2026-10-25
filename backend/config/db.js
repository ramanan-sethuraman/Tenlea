const { initDatabase, collections } = require('./store');

const connectDB = async () => {
  return await initDatabase();
};

module.exports = connectDB;
