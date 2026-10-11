const mongoose = require('mongoose');

// Disable buffering so queries fail immediately with the exact DB error instead of timing out after 10s
mongoose.set('bufferCommands', false);

let connectionPromise = null;

const connectDB = async () => {
  // Only state 1 is connected (0: disconnected, 1: connected, 2: connecting, 3: disconnecting)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return await connectionPromise;
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
      const conn = await connectionPromise;
      connectionPromise = null;
      console.log('[Database] Local MongoDB connected successfully');
      return conn;
    } catch (err) {
      console.warn(`[Database] Local MongoDB failed (${err.message}). Trying MongoDB Memory Server fallback...`);
      connectionPromise = null;
    }

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      connectionPromise = mongoose.connect(mongoUri);
      const conn = await connectionPromise;
      connectionPromise = null;
      console.log('[Database] MongoDB Memory Server fallback connected');
      return conn;
    } catch (memErr) {
      connectionPromise = null;
      console.error('[Database Error]', memErr.message);
      throw new Error(`Failed to initialize database: ${memErr.message}`);
    }
  }

  try {
    connectionPromise = mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 8000,
    });
    const conn = await connectionPromise;
    connectionPromise = null;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    connectionPromise = null;
    console.error(`[Database Error] ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;

