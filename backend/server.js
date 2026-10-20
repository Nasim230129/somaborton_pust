const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const fs = require('fs');
const http = require('http');
const express = require('express');
const app = require('./app');
const { connectDB } = require('./config/db');
const { initSocket } = require('./socket');

const PORT = process.env.PORT || 5000;

// Serve static frontend build in standalone production mode if dist exists
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const server = http.createServer(app);
initSocket(server);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`PUST Alumni Network Server running on port ${PORT}`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
    console.log(`Real-Time Socket.IO: Connected & Ready`);
    console.log(`====================================================`);
  });
});
