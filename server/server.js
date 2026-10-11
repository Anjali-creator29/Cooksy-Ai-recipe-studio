const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Connect to Database
connectDB().catch((err) => {
  console.error('[Initial DB Connection Error]', err.message);
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Database connection readiness middleware for API requests
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB Request Handler Error]', err.message);
    return res.status(500).json({
      message: err.message || 'Database connection error. Please verify MONGODB_URI in Vercel environment variables.'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Cooksy AI Recipe Engine & Vault API' });
});

// Serve frontend static assets in production or if build directory exists
const clientDistPath = path.resolve(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
  console.log(`[Static Server] Serving Vite frontend assets from ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Cooksy API server running. Frontend build not detected yet (Run `npm run build` to build client assets).');
  });
}

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Cooksy Single Node Service active on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });
}

module.exports = app;

