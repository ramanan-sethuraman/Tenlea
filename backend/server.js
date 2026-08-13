const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect Database
const connectDB = require('./config/db');
const app = express();

// Ensure Database Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB Middleware Error]:', err.message);
    res.status(503).json({
      success: false,
      message: 'Database connection currently initializing. Please try again in a few seconds.'
    });
  }
});

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static build files if available
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

// Import API Routes
const authRoutes = require('./routes/authRoutes');
const kycRoutes = require('./routes/kycRoutes');
const landRoutes = require('./routes/landRoutes');
const parkingRoutes = require('./routes/parkingRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const agreementRoutes = require('./routes/agreementRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount API Routes across standard prefixes
const mountRoutes = (prefix) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/kyc`, kycRoutes);
  app.use(`${prefix}/lands`, landRoutes);
  app.use(`${prefix}/parking`, parkingRoutes);
  app.use(`${prefix}/vehicles`, vehicleRoutes);
  app.use(`${prefix}/bookings`, bookingRoutes);
  app.use(`${prefix}/payments`, paymentRoutes);
  app.use(`${prefix}/agreements`, agreementRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.get(`${prefix}/health`, (req, res) => {
    res.status(200).json({
      success: true,
      message: 'TENLEA Service Operating Normally',
      systemTime: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  });
};

mountRoutes('/api/v1');
mountRoutes('/v1');
mountRoutes('/api');

// Fallback to client index.html for SPA routes or JSON info
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint ${req.originalUrl} not found on server.`
    });
  }
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).json({
      success: true,
      appName: 'TENLEA Fullstack Server',
      tagline: 'Monetize Your Space'
    });
  }
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 TENLEA Application running on http://localhost:${PORT}`);
    console.log(`🌐 API Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`==================================================`);
  });
}

module.exports = app;


