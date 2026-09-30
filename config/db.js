const mongoose = require('mongoose');

let mongodInstance = null;

/**
 * Connect to MongoDB database
 * Uses MONGO_URI env variable, with automatic fallback to mongodb-memory-server if local daemon is offline.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aifittrack';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1500 // 1.5s fast timeout to test local MongoDB availability
    });
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.log(`Local MongoDB not running on ${mongoUri}. Starting in-memory MongoDB instance for automatic testing/demo...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`MongoDB Connected (In-Memory DB): ${conn.connection.host}`);
      return conn;
    } catch (memError) {
      console.error(`MongoDB connection error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
