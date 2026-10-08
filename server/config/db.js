const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cooksy';
    
    // Attempt standard connection first
    const options = {
      serverSelectionTimeoutMS: 3000,
    };

    try {
      const conn = await mongoose.connect(connUri, options);
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[Database] Standard MongoDB connection failed (${err.message}). Initializing MongoDB Memory Server fallback...`);
    }

    // Fallback: MongoDB Memory Server
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Memory Server Connected successfully at: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
