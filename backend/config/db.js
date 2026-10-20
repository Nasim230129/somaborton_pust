const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const seedData = require('../data/seedData');
const models = require('../models/schemas');

const FALLBACK_FILE =
  process.env.NODE_ENV === 'test'
    ? path.join(__dirname, '../data/db_test_store.json')
    : path.join(__dirname, '../data/db_store.json');

let isMongoConnected = false;
let memoryStore = null;

function createInitialsAvatar(name = '', role = 'alumni') {
  const clean = (name || '').replace(/^(Dr\.|Prof\.|Engr\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  const initials = (parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0]?.slice(0, 2) || 'PA').toUpperCase();
  const palettes = {
    alumni: ['#0284c7', '#0369a1'],
    student: ['#0ea5e9', '#0284c7'],
    faculty: ['#7c3aed', '#4c1d95'],
    employer: ['#b45309', '#d97706'],
    admin: ['#d97706', '#b45309'],
  };
  const [c1, c2] = palettes[role] || ['#0284c7', '#0369a1'];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><defs><linearGradient id="g_${initials}_${role}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="120" height="120" rx="60" fill="url(#g_${initials}_${role})"/><circle cx="60" cy="60" r="56" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2"/><text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="44" fill="#ffffff" text-anchor="middle" dominant-baseline="central" letter-spacing="-1">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function initMemoryStore(forceReSeed = false) {
  if (!forceReSeed && fs.existsSync(FALLBACK_FILE)) {
    try {
      memoryStore = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
      if (!Array.isArray(memoryStore.reports)) {
        memoryStore.reports = [];
      }
      let needSave = false;
      if (!Array.isArray(memoryStore.conversations) || memoryStore.conversations.length === 0) {
        memoryStore.conversations = [
          {
            id: 101,
            participants: [1, 2],
            lastMessage: "Looking forward to seeing the PUST robotics showcase next week!",
            lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
            lastSenderId: 2,
            unreadCounts: { "1": 1, "2": 0 },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 102,
            participants: [1, 5],
            lastMessage: "I shared the product roadmap guide with you. Check your inbox!",
            lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
            lastSenderId: 5,
            unreadCounts: { "1": 0, "5": 0 },
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ];
        memoryStore.chatMessages = [
          {
            id: 1001,
            conversationId: 101,
            senderId: 1,
            senderName: "Dr. Rafiqul Islam",
            senderAvatar: createInitialsAvatar("Dr. Rafiqul Islam", "alumni"),
            text: "Hello Nusrat, congratulations on the renewable energy project in Pabna!",
            read: true,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: 1002,
            conversationId: 101,
            senderId: 2,
            senderName: "Nusrat Jahan Akter",
            senderAvatar: createInitialsAvatar("Nusrat Jahan Akter", "alumni"),
            text: "Thank you Dr. Rafiqul! We could not have done it without the PUST alumni engineering foundation.",
            read: true,
            createdAt: new Date(Date.now() - 5400000).toISOString(),
          },
          {
            id: 1003,
            conversationId: 101,
            senderId: 2,
            senderName: "Nusrat Jahan Akter",
            senderAvatar: createInitialsAvatar("Nusrat Jahan Akter", "alumni"),
            text: "Looking forward to seeing the PUST robotics showcase next week!",
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 1004,
            conversationId: 102,
            senderId: 1,
            senderName: "Dr. Rafiqul Islam",
            senderAvatar: createInitialsAvatar("Dr. Rafiqul Islam", "alumni"),
            text: "Hey Tahmid, how is everything going at Shopify?",
            read: true,
            createdAt: new Date(Date.now() - 90000000).toISOString(),
          },
          {
            id: 1005,
            conversationId: 102,
            senderId: 5,
            senderName: "Tahmid Chowdhury",
            senderAvatar: createInitialsAvatar("Tahmid Chowdhury", "alumni"),
            text: "I shared the product roadmap guide with you. Check your inbox!",
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ];
        needSave = true;
      }
      if (!Array.isArray(memoryStore.chatMessages)) {
        memoryStore.chatMessages = [];
      }
      if (Array.isArray(memoryStore.users)) {
        const seedMap = new Map();
        seedData.ALUMNI.forEach((u) => seedMap.set(u.id, u));
        memoryStore.users = memoryStore.users.map((u) => {
          const seed = seedMap.get(u.id);
          let avatar = u.avatar;
          if (!avatar || avatar.includes('unsplash.com')) {
            avatar = createInitialsAvatar(u.name, u.role || 'alumni');
            needSave = true;
          }
          if (seed) {
            return {
              ...u,
              avatar,
              experience: (Array.isArray(u.experience) && u.experience.length) ? u.experience : seed.experience || [],
              education: (Array.isArray(u.education) && u.education.length) ? u.education : seed.education || [],
              socialLinks: u.socialLinks && Object.keys(u.socialLinks).length ? u.socialLinks : seed.socialLinks || {},
            };
          }
          return { ...u, avatar };
        });
      }
      if (needSave) {
        saveMemoryStore();
      }
      return;
    } catch (e) {
      console.warn('Could not parse fallback store, re-seeding:', e.message);
    }
  }
  memoryStore = {
    users: [
      ...seedData.ALUMNI,
      ...seedData.STUDENTS,
      ...seedData.FACULTY,
      ...seedData.EMPLOYERS,
      ...(seedData.ADMINS || []),
    ],
    departments: [...seedData.DEPARTMENTS],
    events: [...seedData.EVENTS],
    jobs: [...seedData.JOBS],
    stories: [...seedData.STORIES],
    notifications: [...seedData.NOTIFICATIONS],
    messages: [...seedData.MESSAGES],
    gallery: [...seedData.GALLERY],
    awards: [...seedData.AWARDS],
    verifications: [...seedData.VERIFICATIONS],
    communityPosts: [...seedData.COMMUNITY_POSTS],
    mentorshipRequests: [],
    donations: [
      {
        id: 1,
        campaign: 'Merit Scholarship Fund',
        amount: 25000,
        frequency: 'one-time',
        donorName: 'Dr. Rafiqul Islam',
        batch: '2008',
        dept: 'CSE',
        paymentMethod: 'bKash',
        anonymous: false,
        message: 'Proud to support the next generation of PUSTians!',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        campaign: 'Research & Innovation Lab',
        amount: 50000,
        frequency: 'one-time',
        donorName: 'Tahmid Chowdhury',
        batch: '2015',
        dept: 'BBA',
        paymentMethod: 'Card',
        anonymous: false,
        message: 'For PUST research excellence.',
        createdAt: new Date().toISOString(),
      },
    ],
    contactMessages: [],
    reports: [],
    conversations: [],
    chatMessages: [],
  };
  saveMemoryStore();
}

function saveMemoryStore() {
  if (!memoryStore) return;
  try {
    fs.mkdirSync(path.dirname(FALLBACK_FILE), { recursive: true });
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (e) {
    // In serverless / read-only production environments (like Vercel), disk writes are not supported
    if (process.env.NODE_ENV !== 'production') {
      console.debug('Local storage persistence notice:', e.message);
    }
  }
}

async function seedMongoIfNeeded() {
  try {
    const deptCount = await models.Department.countDocuments();
    const userCount = await models.User.countDocuments();
    if (deptCount === 0) {
      console.log('Populating PUST academic departments, events, and jobs in mydatabase...');
      await models.Department.insertMany(seedData.DEPARTMENTS);
      await models.Event.insertMany(seedData.EVENTS);
      await models.Job.insertMany(seedData.JOBS);
      await models.Story.insertMany(seedData.STORIES);
      await models.Notification.insertMany(seedData.NOTIFICATIONS);
      await models.Message.insertMany(seedData.MESSAGES);
      await models.GalleryItem.insertMany(seedData.GALLERY);
      await models.Verification.insertMany(seedData.VERIFICATIONS);
      await models.CommunityPost.insertMany(seedData.COMMUNITY_POSTS);
    }
    if (userCount === 0) {
      console.log('Seeding initial alumni into empty users collection...');
      const allUsers = [
        ...seedData.ALUMNI,
        ...seedData.STUDENTS,
        ...seedData.FACULTY,
        ...seedData.EMPLOYERS,
        ...(seedData.ADMINS || []),
      ];
      await models.User.insertMany(allUsers);
    }

  } catch (err) {
    console.warn('MongoDB seed skipped or already populated:', err.message);
  }
}

// Global cached connection for serverless environments (Vercel / AWS Lambda)
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  initMemoryStore();
  if (process.env.NODE_ENV === 'test') {
    isMongoConnected = false;
    return;
  }
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const dbName = process.env.DB_NAME || 'mydatabase';


  if (!uri) {
    isMongoConnected = false;
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ MONGO_URI / MONGODB_URI is not defined in environment variables. Database operations will use in-memory store.');
    }
    return;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: process.env.MONGO_TIMEOUT ? Number(process.env.MONGO_TIMEOUT) : 5000,
      maxPoolSize: 10,
      socketTimeoutMS: 20000,
      bufferCommands: false,
      dbName: dbName,
    };
    cached.promise = mongoose.connect(uri, opts).then((m) => {
      isMongoConnected = true;
      console.log(`MongoDB Atlas Connected: ${m.connection.host} (DB: ${m.connection.name})`);
      seedMongoIfNeeded().catch((e) => console.warn('Seed notice:', e.message));
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    isMongoConnected = true;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    isMongoConnected = false;
    console.warn(`MongoDB connection notice: ${err.message}. Operating in fallback JSON document store mode.`);
  }
}

function getStatus() {
  return {
    mode: isMongoConnected ? 'mongodb-atlas' : 'json-document-store',
    connected: true,
    host: isMongoConnected ? mongoose.connection.host : 'local-json',
    database: isMongoConnected ? mongoose.connection.name : (process.env.DB_NAME || 'mydatabase'),
  };
}

module.exports = {
  connectDB,
  getStatus,
  isMongo: () => isMongoConnected,
  getStore: () => {
    if (!memoryStore) initMemoryStore();
    return memoryStore;
  },
  resetStore: () => {
    initMemoryStore(true);
  },
  saveStore: saveMemoryStore,
  models,
};
