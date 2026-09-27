const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

/**
 * Connect to MongoDB database with Mongoose
 * Falls back to an in-memory MongoDB instance when no external database is available.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://muhammadayaan01official_db_user:eThBiVLdYM2LmeOq@cluster0.7m3wybb.mongodb.net/Campus-Coin';
    const conn = await mongoose.connect(mongoURI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn('[Database] External MongoDB unreachable, trying local in-memory fallback...');

    try {
      memoryServer = await MongoMemoryServer.create();
      const mongoURI = memoryServer.getUri();
      const conn = await mongoose.connect(mongoURI);

      console.log(`[Database] Mongo Memory Connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (fallbackError) {
      console.error(`[Database Error] Connection failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
