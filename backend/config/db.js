const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const seedData = require('../data/seedData');
const models = require('../models/schemas');

const FALLBACK_FILE = path.join(__dirname, '../data/db_store.json');

let isMongoConnected = false;
let memoryStore = null;

function initMemoryStore() {
  if (fs.existsSync(FALLBACK_FILE)) {
    try {
      memoryStore = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
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
  };
  saveMemoryStore();
}

function saveMemoryStore() {
  if (!memoryStore) return;
  try {
    fs.mkdirSync(path.dirname(FALLBACK_FILE), { recursive: true });
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save fallback store:', e.message);
  }
}

async function seedMongoIfNeeded() {
  const userCount = await models.User.countDocuments();
  if (userCount === 0) {
    console.log('Seeding MongoDB database with initial PUST Alumni Network data...');
    const allUsers = [
      ...seedData.ALUMNI,
      ...seedData.STUDENTS,
      ...seedData.FACULTY,
      ...seedData.EMPLOYERS,
    ];
    await models.User.insertMany(allUsers);
    await models.Department.insertMany(seedData.DEPARTMENTS);
    await models.Event.insertMany(seedData.EVENTS);
    await models.Job.insertMany(seedData.JOBS);
    await models.Story.insertMany(seedData.STORIES);
    await models.Notification.insertMany(seedData.NOTIFICATIONS);
    await models.Message.insertMany(seedData.MESSAGES);
    await models.GalleryItem.insertMany(seedData.GALLERY);
    await models.Verification.insertMany(seedData.VERIFICATIONS);
    await models.CommunityPost.insertMany(seedData.COMMUNITY_POSTS);
    if (memoryStore && memoryStore.donations && memoryStore.donations.length) {
      await models.Donation.insertMany(memoryStore.donations);
    }
    console.log('MongoDB seeded successfully!');
  }
}

const DEFAULT_URI =
  'mongodb+srv://nasimul230129_db_user:oBFdhmCE4VMQICP5@cluster0.r8w0jdo.mongodb.net/somaborton_pust?retryWrites=true&w=majority&appName=Cluster0';

async function connectDB() {
  const uri = process.env.MONGO_URI || DEFAULT_URI;
  initMemoryStore();
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    isMongoConnected = true;
    console.log(`MongoDB Atlas Connected: ${mongoose.connection.host} (DB: ${mongoose.connection.name})`);
    await seedMongoIfNeeded();
  } catch (err) {
    isMongoConnected = false;
    console.log(
      `MongoDB (${uri}) not reachable (${err.message}). Using synced JSON Document Store at backend/data/db_store.json.`
    );
  }
}

function getStatus() {
  return {
    mode: isMongoConnected ? 'mongodb-atlas' : 'json-document-store',
    connected: true,
    host: isMongoConnected ? mongoose.connection.host : 'local-json',
    database: isMongoConnected ? mongoose.connection.name : 'somaborton_pust',
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
  saveStore: saveMemoryStore,
  models,
};
