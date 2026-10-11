const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const connUri = process.env.MONGODB_URI;

  if (!connUri) {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      throw new Error(
        'MONGODB_URI is not configured in Vercel. Please add MONGODB_URI in Vercel Project Settings -> Environment Variables.'
      );
    }

    // Fallback for local offline development only
    try {
      console.log('[Database] Connecting to local MongoDB instance...');
      connectionPromise = mongoose.connect('mongodb://127.0.0.1:27017/cooksy', {
        serverSelectionTimeoutMS: 3000,
      });
      await connectionPromise;
      connectionPromise = null;
      console.log('[Database] Local MongoDB connected successfully');
      return;
    } catch (err) {
      console.warn(`[Database] Local MongoDB failed (${err.message}). Trying MongoDB Memory Server fallback...`);
      connectionPromise = null;
    }

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      connectionPromise = mongoose.connect(mongoUri);
      await connectionPromise;
      connectionPromise = null;
      console.log('[Database] MongoDB Memory Server fallback connected');
      return;
    } catch (memErr) {
      connectionPromise = null;
      console.error('[Database Error]', memErr.message);
      throw new Error(`Failed to initialize database: ${memErr.message}`);
    }
  }

  try {
    connectionPromise = mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    const conn = await connectionPromise;
    connectionPromise = null;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    connectionPromise = null;
    console.error(`[Database Error] ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;

