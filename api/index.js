const { connectDB } = require('../backend/config/db');
const app = require('../backend/app');

/**
 * Serverless function entry point for Vercel deployment.
 * Handles /api/* routes seamlessly using cached database connections.
 */
module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('Serverless database connection warning:', err.message);
  }
  return app(req, res);
};
