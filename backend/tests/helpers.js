process.env.NODE_ENV = 'test';
const http = require('http');
const jwt = require('jsonwebtoken');
const app = require('../app');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'pust_somaborton_alumni_network_secret_key_2026';

const { initSocket } = require('../socket');

let server;
let baseUrl;

async function startServer() {
  if (server) return baseUrl;
  
  // Ensure DB memory store is initialized with test isolation
  db.resetStore();
  await db.connectDB();
  
  return new Promise((resolve) => {
    server = http.createServer(app);
    initSocket(server);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve(baseUrl);
    });
  });
}

async function stopServer() {
  if (!server) return;
  return new Promise((resolve) => {
    server.close(() => {
      server = null;
      baseUrl = null;
      resolve();
    });
  });
}

function getAuthToken(userPayload = {}) {
  const defaultUser = {
    id: 99999,
    name: 'Test QA User',
    email: 'qa.tester@pust.ac.bd',
    role: 'alumni',
  };
  return jwt.sign({ ...defaultUser, ...userPayload }, JWT_SECRET, { expiresIn: '1h' });
}

function getAdminToken() {
  return getAuthToken({
    id: 10001,
    name: 'QA Admin Officer',
    email: 'admin.qa@pust.ac.bd',
    role: 'admin',
  });
}

async function apiRequest(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return {
    status: res.status,
    headers: res.headers,
    data,
  };
}

module.exports = {
  startServer,
  stopServer,
  getBaseUrl: () => baseUrl,
  getAuthToken,
  getAdminToken,
  apiRequest,
  JWT_SECRET,
};
