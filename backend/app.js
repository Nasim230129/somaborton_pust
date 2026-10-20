require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// Trust proxy for secure cookies and accurate client IP on Vercel / reverse proxies
app.set('trust proxy', 1);

// Production-ready security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

// CORS configuration: allow all in dev, allow origin in production
const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, curl, Postman, or same-origin requests (origin === undefined)
    if (!origin) return callback(null, true);
    
    // In development or if explicitly allowed, allow all
    if (process.env.NODE_ENV !== 'production') return callback(null, true);

    const allowedOrigins = [
      process.env.APP_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      'https://somaborton-pust.vercel.app',
      'https://alumni.pust.ac.bd',
    ].filter(Boolean);

    // If matches allowed origins or is a vercel preview deployment
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('pust.ac.bd')
    ) {
      return callback(null, true);
    }

    // Default allow for public GET/POST requests or allow with origin
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', apiRoutes);

// 404 handler for undefined /api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    ok: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred. Please try again later.' 
      : err.message,
  });
});

module.exports = app;
