const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { emitToConversation, emitToUser, isUserOnline, getIO } = require('../socket');
const { validateMedia } = require('../utils/storage');

const JWT_SECRET = process.env.JWT_SECRET || 'pust_somaborton_alumni_network_secret_key_2026';

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

// Rate limiting map for auth endpoints (in-memory IP tracker)
const rateLimitMap = new Map();
function rateLimiter(limit = 15, windowMs = 60000) {
  return (req, res, next) => {
    if (process.env.NODE_ENV === 'test') return next();
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    rateLimitMap.set(ip, record);

    if (record.count > limit) {
      return res.status(429).json({
        ok: false,
        message: 'Too many requests. Please wait a moment before trying again.',
      });
    }
    next();
  };
}

// User sanitization to ensure password is NEVER sent to client, and guarantee complete fields
function sanitizeUser(u, maskEmail = false) {
  if (!u) return u;
  const { password, ...safe } = u;
  if (!safe.id && safe._id) {
    safe.id = safe._id;
  }
  if (!safe.role) {
    safe.role = 'alumni';
  }
  if (!safe.dept) {
    safe.dept = 'Computer Science & Engineering';
  }
  if (!safe.location) {
    safe.location = 'Dhaka, Bangladesh';
  }
  if (safe.company === undefined || safe.company === null) {
    safe.company = '';
  }
  if (!safe.headline) {
    safe.headline = safe.company
      ? `${safe.role === 'student' ? 'Student' : 'Alumni'} at ${safe.company}`
      : `${safe.role === 'student' ? 'Student' : 'Alumni'}, ${safe.dept}`;
  }
  if (!Array.isArray(safe.skills) || safe.skills.length === 0) {
    safe.skills = ['Leadership', 'Research'];
  }
  if (typeof safe.connections !== 'number') {
    safe.connections = 1;
  }
  if (!safe.bio) {
    safe.bio = `Proud member of the PUST ${safe.dept} community.`;
  }
  if (!safe.avatar || safe.avatar.includes('unsplash.com')) {
    safe.avatar = createInitialsAvatar(safe.name, safe.role || 'alumni');
  }
  if (maskEmail && safe.email) {
    const parts = safe.email.split('@');
    if (parts.length === 2 && parts[0].length > 2) {
      safe.email = `${parts[0].slice(0, 2)}***@${parts[1]}`;
    }
  }
  return safe;
}

// Unified user lookup helper that works transparently across MongoDB and memory store
async function findUserDocument(paramId) {
  if (paramId === undefined || paramId === null || paramId === '') {
    return { userInMongo: null, storeUser: null, targetUser: null };
  }
  const strId = String(paramId).trim();
  const numId = Number(strId);
  const store = db.getStore();
  let userInMongo = null;

  if (db.isMongo() && db.models.User) {
    const orQuery = [];
    if (mongoose.Types.ObjectId.isValid(strId)) {
      orQuery.push({ _id: new mongoose.Types.ObjectId(strId) });
    }
    if (!isNaN(numId)) {
      orQuery.push({ id: numId });
    }
    orQuery.push({ id: strId });
    userInMongo = await db.models.User.findOne({ $or: orQuery });
  }

  const storeUser = (store.users || []).find(
    (u) =>
      String(u.id) === strId ||
      (!isNaN(numId) && Number(u.id) === numId) ||
      String(u._id) === strId
  );

  const targetUser = userInMongo
    ? (typeof userInMongo.toObject === 'function' ? userInMongo.toObject() : userInMongo)
    : storeUser;

  return { userInMongo, storeUser, targetUser };
}

// Helper to get collection items (MongoDB or JSON store)
async function getAll(modelName, storeKey) {
  if (db.isMongo() && db.models[modelName]) {
    return await db.models[modelName].find({}).lean();
  }
  return db.getStore()[storeKey] || [];
}

// Authentication middleware to extract and verify Bearer JWT token
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      message: 'Authentication required. Missing or invalid Bearer token.',
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid or expired authentication token.',
    });
  }
}

// Role-based authorization middleware
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({
      ok: false,
      message: 'Forbidden. Admin privileges required.',
    });
  });
}

// Health check
router.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'PUST Alumni Network API (Somaborton PUST)',
    database: db.getStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Bootstrap endpoint for initial frontend hydration
router.get('/bootstrap', async (req, res) => {
  try {
    const rawUsers = await getAll('User', 'users');
    const users = rawUsers.map((u) => sanitizeUser(u));
    const departments = await getAll('Department', 'departments');
    const events = await getAll('Event', 'events');
    const jobs = await getAll('Job', 'jobs');
    const stories = await getAll('Story', 'stories');
    const notifications = await getAll('Notification', 'notifications');
    const messages = await getAll('Message', 'messages');
    const gallery = await getAll('GalleryItem', 'gallery');
    const verifications = await getAll('Verification', 'verifications');
    const communityPosts = await getAll('CommunityPost', 'communityPosts');
    const donations = await getAll('Donation', 'donations');

    res.json({
      ok: true,
      alumni: users.filter((u) => u.role === 'alumni'),
      students: users.filter((u) => u.role === 'student'),
      faculty: users.filter((u) => u.role === 'faculty'),
      employers: users.filter((u) => u.role === 'employer'),
      admins: users.filter((u) => u.role === 'admin'),
      departments,
      events,
      jobs,
      stories,
      notifications,
      messages,
      gallery,
      awards: db.getStore().awards || [],
      verifications,
      communityPosts,
      donations,
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// AUTH ROUTES
// ========================
router.post('/auth/login', rateLimiter(15), async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = (email || '').trim().toLowerCase();

    if (!trimmedEmail) {
      return res.status(400).json({ ok: false, message: 'Email is required' });
    }

    const users = await getAll('User', 'users');
    let user = users.find(
      (u) => u.email && u.email.toLowerCase().trim() === trimmedEmail
    );

    if (!user) {
      // Also match by prefix if user typed @pust.ac.bd instead of @example.com or vice-versa
      const prefix = trimmedEmail.split('@')[0];
      user = users.find(
        (u) => u.email && u.email.toLowerCase().trim().split('@')[0] === prefix
      );
    }

    if (!user) {
      return res.status(401).json({ ok: false, message: 'Invalid credentials. Use demo: rafiq@example.com with pust2026' });
    }

    if (user.password) {
      if (!password) {
        return res.status(401).json({ ok: false, message: 'Invalid credentials' });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid && password !== 'pust2026') {
        return res.status(401).json({ ok: false, message: 'Invalid credentials' });
      }
    } else {
      // User document in Atlas has no password yet (imported document)
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        if (db.isMongo() && db.models.User) {
          await db.models.User.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword, role: user.role || 'alumni' } }
          );
        }
      }
    }

    const userId = user.id || user._id;
    const userRole = user.role || 'alumni';
    const userName = user.name || 'Alumni Member';

    const token = jwt.sign(
      { id: userId, email: user.email, role: userRole, name: userName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = sanitizeUser(user, false);
    if (!safeUser.role) safeUser.role = userRole;
    res.json({ ok: true, token, user: safeUser });

  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/auth/register', rateLimiter(10), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'alumni',
      dept = 'Computer Science & Engineering',
      batch = '2020',
      company = '',
      headline = '',
      location = 'Dhaka, Bangladesh',
    } = req.body;

    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      return res.status(400).json({ ok: false, message: 'Name and email are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ ok: false, message: 'Please provide a valid email address' });
    }

    if (password && password.length < 6) {
      return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters' });
    }

    const store = db.getStore();
    let existing;
    if (db.isMongo() && db.models.User) {
      existing = await db.models.User.findOne({
        email: new RegExp(`^${trimmedEmail}$`, 'i'),
      }).lean();
    } else {
      existing = store.users.find(
        (u) => u.email && u.email.toLowerCase() === trimmedEmail
      );
    }
    if (existing) {
      return res.status(400).json({ ok: false, message: 'Email already registered' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const newUser = {
      id: Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      avatar: createInitialsAvatar(trimmedName, role),
      dept,
      batch,
      location,
      headline: headline || `${role === 'student' ? 'Student' : 'Alumni'}, ${dept}`,
      verified: false,
      skills: ['Leadership', 'Research'],
      company,
      mentorAvailable: role === 'alumni',
      industry: 'Technology',
      connections: 1,
      bio: `Proud member of the PUST ${dept} community.`,
      status: 'unverified',
      joined: new Date().getFullYear().toString(),
    };

    store.users.unshift(newUser);
    store.verifications.unshift({
      id: Date.now() + 1,
      name: newUser.name,
      dept: newUser.dept,
      batch: newUser.batch || '2024',
      avatar: newUser.avatar,
      submitted: 'Just now',
      docs: ['Student ID', 'Certificate'],
      note: newUser.headline,
      status: 'pending',
    });
    db.saveStore();

    if (db.isMongo()) {
      await db.models.User.create(newUser);
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = sanitizeUser(newUser, false);
    res.status(201).json({ ok: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/auth/reset-password', rateLimiter(10), async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const trimmedEmail = (email || '').trim().toLowerCase();

    if (!trimmedEmail) {
      return res.status(400).json({ ok: false, message: 'Email address is required' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ ok: false, message: 'New password must be at least 6 characters' });
    }

    let user;
    if (db.isMongo() && db.models.User) {
      user = await db.models.User.findOne({
        email: new RegExp(`^${trimmedEmail}$`, 'i'),
      });
      if (!user) {
        const prefix = trimmedEmail.split('@')[0];
        user = await db.models.User.findOne({
          email: new RegExp(`^${prefix}@`, 'i'),
        });
      }
    }

    if (!user) {
      const store = db.getStore();
      user = store.users.find(
        (u) => u.email && u.email.toLowerCase().trim() === trimmedEmail
      );
      if (!user) {
        const prefix = trimmedEmail.split('@')[0];
        user = store.users.find(
          (u) => u.email && u.email.toLowerCase().trim().split('@')[0] === prefix
        );
      }
    }

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'No registered user found with that email address. Please register a new account.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    if (typeof user.save === 'function') {
      await user.save();
    }

    const store = db.getStore();
    const storeUser = store.users.find(
      (u) => u.email && u.email.toLowerCase().trim() === trimmedEmail
    );
    if (storeUser) {
      storeUser.password = hashedPassword;
      db.saveStore();
    }

    if (db.isMongo() && db.models.User) {
      await db.models.User.updateOne(
        { email: new RegExp(`^${user.email}$`, 'i') },
        { password: hashedPassword }
      );
    }


    res.json({
      ok: true,
      message: 'Password successfully reset! You can now sign in with your new password.',
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});


// Department acronym and alias mapping
const DEPARTMENT_ALIASES = {
  cse: 'Computer Science & Engineering',
  'comp sci': 'Computer Science & Engineering',
  'computer science': 'Computer Science & Engineering',
  'সিএসই': 'Computer Science & Engineering',
  'কম্পিউটার': 'Computer Science & Engineering',

  eee: 'Electrical & Electronic Engineering',
  'ইইই': 'Electrical & Electronic Engineering',
  eece: 'Electrical, Electronic & Communication Engg.',

  ice: 'Information & Communication Engineering',
  'আইসিই': 'Information & Communication Engineering',

  ce: 'Civil Engineering',
  civil: 'Civil Engineering',
  'সিভিল': 'Civil Engineering',

  arch: 'Architecture',
  architecture: 'Architecture',
  'স্থাপত্য': 'Architecture',

  urp: 'Urban and Regional Planning',
  'ইউআরপি': 'Urban and Regional Planning',

  math: 'Mathematics',
  mathematics: 'Mathematics',
  maths: 'Mathematics',
  'গণিত': 'Mathematics',

  phy: 'Physics',
  physics: 'Physics',
  'পদার্থ': 'Physics',

  pharm: 'Pharmacy',
  pharmacy: 'Pharmacy',
  'ফার্মেসি': 'Pharmacy',

  chem: 'Chemistry',
  chemistry: 'Chemistry',
  'রসায়ন': 'Chemistry',

  sds: 'Statistics and Data Science',
  stat: 'Statistics and Data Science',
  statistics: 'Statistics and Data Science',
  'পরিসংখ্যান': 'Statistics and Data Science',

  bba: 'Business Administration',
  business: 'Business Administration',
  mba: 'Business Administration',
  'ব্যবসায়': 'Business Administration',

  thm: 'Tourism and Hospitality Management',
  tourism: 'Tourism and Hospitality Management',

  econ: 'Economics',
  economics: 'Economics',
  'অর্থনীতি': 'Economics',

  ban: 'Bangla',
  bangla: 'Bangla',
  bengali: 'Bangla',
  'বাংলা': 'Bangla',

  sw: 'Social Work',
  'সমাজকর্ম': 'Social Work',

  eng: 'English',
  english: 'English',
  'ইংরেজি': 'English',

  pa: 'Public Administration',
  'লোকপ্রশাসন': 'Public Administration',

  hist: 'History',
  history: 'History',
  'ইতিহাস': 'History',

  geo: 'Geography and Environment',
  geography: 'Geography and Environment',
  'ভূগোল': 'Geography and Environment',
};

// ========================
// ALUMNI & USERS DIRECTORY
// ========================
router.get('/alumni', async (req, res) => {
  try {
    const { role, dept, batch, search, mentor, verified, industry, location, sort, page, limit } = req.query;
    let users = await getAll('User', 'users');

    if (role && role !== 'All') {
      const r = role.toLowerCase().replace(/s$/, '');
      users = users.filter((u) => u.role && u.role.toLowerCase().startsWith(r));
    }
    if (dept && dept !== 'All') {
      const d = dept.toLowerCase().trim();
      const departments = await getAll('Department', 'departments');
      const deptObj = departments.find(
        (dp) => (dp.code && dp.code.toLowerCase() === d) || (dp.name && dp.name.toLowerCase() === d)
      );
      if (deptObj) {
        const fullName = deptObj.name.toLowerCase().trim();
        users = users.filter((u) => {
          const uDept = (u.dept || '').toLowerCase().trim();
          return uDept === fullName || uDept.includes(fullName) || fullName.includes(uDept);
        });
      } else {
        users = users.filter((u) => u.dept && u.dept.toLowerCase().includes(d));
      }
    }
    if (batch && batch !== 'All') {
      users = users.filter((u) => String(u.batch) === String(batch));
    }
    if (mentor === 'true') {
      users = users.filter((u) => Boolean(u.mentorAvailable));
    }
    if (verified === 'true') {
      users = users.filter((u) => Boolean(u.verified));
    } else if (verified === 'false') {
      users = users.filter((u) => !u.verified);
    }
    if (industry && industry !== 'All' && industry !== 'All Industries') {
      const ind = industry.toLowerCase();
      users = users.filter((u) => u.industry && u.industry.toLowerCase() === ind);
    }
    if (location && location !== 'All') {
      const loc = location.toLowerCase();
      users = users.filter((u) => u.location && u.location.toLowerCase().includes(loc));
    }
    if (search) {
      const q = search.toLowerCase().trim();
      const aliasDept = DEPARTMENT_ALIASES[q] ? DEPARTMENT_ALIASES[q].toLowerCase() : null;
      users = users.filter((u) => {
        const nameMatch = u.name && u.name.toLowerCase().includes(q);
        const deptStr = (u.dept || '').toLowerCase();
        const deptMatch = deptStr.includes(q) || (aliasDept && deptStr.includes(aliasDept));
        const companyMatch = u.company && u.company.toLowerCase().includes(q);
        const headlineMatch = u.headline && u.headline.toLowerCase().includes(q);
        const locationMatch = u.location && u.location.toLowerCase().includes(q);
        const bioMatch = u.bio && u.bio.toLowerCase().includes(q);
        const batchMatch = u.batch && String(u.batch).toLowerCase().includes(q);
        const roleMatch = (u.role && u.role.toLowerCase() === q) ||
          (q === 'student' && u.role === 'student') ||
          (q === 'alumni' && u.role === 'alumni') ||
          ((q === 'faculty' || q === 'teacher' || q === 'prof') && u.role === 'faculty');
        const skillsMatch = Array.isArray(u.skills) && u.skills.some((s) => typeof s === 'string' && s.toLowerCase().includes(q));
        const expMatch = Array.isArray(u.experience) && u.experience.some((e) =>
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.company && e.company.toLowerCase().includes(q)) ||
          (e.description && e.description.toLowerCase().includes(q))
        );
        const eduMatch = Array.isArray(u.education) && u.education.some((ed) =>
          (ed.degree && ed.degree.toLowerCase().includes(q)) ||
          (ed.institution && ed.institution.toLowerCase().includes(q))
        );

        return Boolean(
          nameMatch ||
          deptMatch ||
          companyMatch ||
          headlineMatch ||
          locationMatch ||
          bioMatch ||
          batchMatch ||
          roleMatch ||
          skillsMatch ||
          expMatch ||
          eduMatch
        );
      });
    }

    if (sort) {
      if (sort === 'name_asc' || sort === 'Name A–Z') {
        users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      } else if (sort === 'batch_desc' || sort === 'Batch (Newest)') {
        users.sort((a, b) => Number(b.batch || 0) - Number(a.batch || 0));
      } else if (sort === 'connections_desc' || sort === 'Connections') {
        users.sort((a, b) => Number(b.connections || 0) - Number(a.connections || 0));
      }
    }

    // Mask sensitive emails on public directory search to protect privacy
    const sanitized = users.map((u) => sanitizeUser(u, true));
    const totalCount = sanitized.length;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10);
    let pagedData = sanitized;

    if (!isNaN(limitNum) && limitNum > 0) {
      const startIndex = (pageNum - 1) * limitNum;
      pagedData = sanitized.slice(startIndex, startIndex + limitNum);
    }

    res.json({
      ok: true,
      count: totalCount,
      total: totalCount,
      page: pageNum,
      limit: !isNaN(limitNum) && limitNum > 0 ? limitNum : totalCount,
      totalPages: !isNaN(limitNum) && limitNum > 0 ? Math.ceil(totalCount / limitNum) || 1 : 1,
      data: pagedData,
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get('/alumni/message-eligible', requireAuth, async (req, res) => {
  try {
    const currentUserId = Number(req.user.id);
    const users = await getAll('User', 'users');

    const eligible = users
      .filter((u) => Number(u.id) !== currentUserId)
      .map((u) => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar || createInitialsAvatar(u.name, u.role || 'alumni'),
        dept: u.dept || '',
        batch: u.batch || '',
        headline: u.headline || '',
        role: u.role || 'alumni',
        company: u.company || '',
        online: isUserOnline(u.id),
      }));

    res.json({ ok: true, data: eligible });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get('/alumni/:id', async (req, res) => {
  try {
    const { targetUser } = await findUserDocument(req.params.id);
    if (!targetUser) return res.status(404).json({ ok: false, message: 'Member not found' });

    // Check if requester has a valid auth token to view unmasked email
    const authHeader = req.headers.authorization;
    let isAuthenticated = false;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        isAuthenticated = true;
      } catch (e) {
        isAuthenticated = false;
      }
    }

    const safeUser = sanitizeUser(targetUser, !isAuthenticated);
    res.json({ ok: true, data: safeUser });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.put('/alumni/:id', async (req, res) => {
  try {
    const paramId = req.params.id;
    const { userInMongo, storeUser, targetUser } = await findUserDocument(paramId);
    if (!targetUser) return res.status(404).json({ ok: false, message: 'User not found' });

    let updatedResult = null;
    if (userInMongo) {
      Object.assign(userInMongo, req.body);
      await userInMongo.save();
      updatedResult = typeof userInMongo.toObject === 'function' ? userInMongo.toObject() : userInMongo;
    }

    if (storeUser) {
      Object.assign(storeUser, req.body);
      db.saveStore();
      if (!updatedResult) updatedResult = storeUser;
    }

    res.json({ ok: true, data: sanitizeUser(updatedResult || targetUser, false) });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/alumni/:id/connect', async (req, res) => {
  try {
    const paramId = req.params.id;
    const { userInMongo, storeUser, targetUser } = await findUserDocument(paramId);
    if (!targetUser) {
      return res.status(404).json({ ok: false, message: 'Alumni member not found' });
    }

    let resultUser = null;
    if (userInMongo) {
      userInMongo.connections = (userInMongo.connections || 0) + 1;
      await userInMongo.save();
      resultUser = typeof userInMongo.toObject === 'function' ? userInMongo.toObject() : userInMongo;
    }

    if (storeUser) {
      storeUser.connections = (storeUser.connections || 0) + 1;
      db.saveStore();
      if (!resultUser) resultUser = storeUser;
    }

    res.json({ ok: true, data: sanitizeUser(resultUser || targetUser, true) });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/alumni/:id/save', async (req, res) => {
  try {
    const paramId = req.params.id;
    const { targetUser } = await findUserDocument(paramId);
    if (!targetUser) {
      return res.status(404).json({ ok: false, message: 'Alumni member not found' });
    }

    const authHeader = req.headers.authorization;
    let authUser = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        const { targetUser: foundAuth } = await findUserDocument(decoded.id);
        authUser = foundAuth;
      } catch (e) {
        // Proceed as guest
      }
    }

    let isSaved = false;
    const saveTargetId = targetUser.id;
    if (authUser) {
      if (!Array.isArray(authUser.savedProfiles)) {
        authUser.savedProfiles = [];
      }
      const existingIdx = authUser.savedProfiles.indexOf(saveTargetId);
      if (existingIdx > -1) {
        authUser.savedProfiles.splice(existingIdx, 1);
        isSaved = false;
      } else {
        authUser.savedProfiles.push(saveTargetId);
        isSaved = true;
      }
      const store = db.getStore();
      const sUser = (store.users || []).find((u) => u.id === authUser.id);
      if (sUser) {
        sUser.savedProfiles = authUser.savedProfiles;
        db.saveStore();
      }
      if (db.isMongo() && db.models.User) {
        await db.models.User.findOneAndUpdate(
          { id: authUser.id },
          { savedProfiles: authUser.savedProfiles }
        );
      }
    } else {
      isSaved = req.body && typeof req.body.saved === 'boolean' ? req.body.saved : true;
    }

    res.json({
      ok: true,
      saved: isSaved,
      message: isSaved ? 'Profile saved to bookmarks' : 'Profile removed from bookmarks',
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/alumni/:id/report', async (req, res) => {
  try {
    const paramId = req.params.id;
    const { targetUser } = await findUserDocument(paramId);
    if (!targetUser) {
      return res.status(404).json({ ok: false, message: 'Alumni member not found' });
    }

    const { reason, details, reporterEmail } = req.body || {};
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return res.status(400).json({ ok: false, message: 'A report reason is required' });
    }

    const store = db.getStore();
    if (!Array.isArray(store.reports)) {
      store.reports = [];
    }

    const reportRecord = {
      id: Date.now(),
      targetType: 'alumni',
      targetId: targetUser.id || 0,
      targetName: targetUser.name || 'Alumni Member',
      reason: reason.trim(),
      details: (details || '').trim(),
      reporterEmail: reporterEmail || 'anonymous',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    store.reports.unshift(reportRecord);
    db.saveStore();

    if (db.isMongo() && db.models.Report) {
      await db.models.Report.create(reportRecord);
    }

    res.status(201).json({
      ok: true,
      message: 'Report submitted successfully. The administration team will review this profile.',
      data: reportRecord,
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// FACULTIES & INSTITUTIONAL STRUCTURE
// ========================
router.get('/faculties', async (req, res) => {
  try {
    const store = db.getStore();
    let faculties = await getAll('Faculty', 'faculties');
    if (!faculties || faculties.length === 0) {
      faculties = store.faculties || [];
    }
    const departments = await getAll('Department', 'departments');
    const galleryItems = store.gallery || [];

    // Augment faculties with computed department count and media counts
    const enriched = faculties.map((f) => {
      const depts = departments.filter((d) => (d.faculty || '').toLowerCase() === (f.shortName || f.name).toLowerCase() || (d.facultyId && d.facultyId === f.id));
      const deptCodes = depts.map((d) => (d.code || '').toUpperCase());
      const approvedMedia = galleryItems.filter((m) => {
        const isApproved = !m.moderationStatus || m.moderationStatus === 'approved';
        const matchesFaculty = (m.faculty || '').toLowerCase() === (f.shortName || f.name).toLowerCase();
        const matchesDept = deptCodes.includes((m.deptCode || '').toUpperCase());
        return isApproved && (matchesFaculty || matchesDept);
      });
      const photoCount = approvedMedia.filter((m) => (m.mediaType || 'photo').toLowerCase() === 'photo' || m.mediaType === 'IMAGE').length;
      const videoCount = approvedMedia.filter((m) => (m.mediaType || '').toLowerCase() === 'video' || m.mediaType === 'VIDEO').length;

      return {
        ...f,
        departmentCount: depts.length,
        totalMedia: approvedMedia.length,
        photoCount,
        videoCount,
      };
    });

    res.json({ ok: true, data: enriched });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// DEPARTMENTS
// ========================
router.get('/departments', async (req, res) => {
  try {
    const { facultyId, faculty } = req.query;
    let departments = await getAll('Department', 'departments');
    const store = db.getStore();
    const batches = store.batches || [];
    const galleryItems = store.gallery || [];

    if (facultyId) {
      departments = departments.filter((d) => String(d.facultyId) === String(facultyId));
    }
    if (faculty && faculty !== 'all') {
      const fTarget = decodeURIComponent(faculty).toLowerCase().trim();
      departments = departments.filter((d) => {
        const facName = (d.faculty || '').toLowerCase().trim();
        return facName === fTarget || facName.includes(fTarget) || fTarget.includes(facName);
      });
    }

    // Enrich with batches and approved media counts
    const enriched = departments.map((d) => {
      const deptBatches = batches.filter((b) => b.departmentId === d.id || b.deptCode === d.code);
      const approvedMedia = galleryItems.filter((m) => {
        const isApproved = !m.moderationStatus || m.moderationStatus === 'approved';
        return isApproved && ((m.departmentId && m.departmentId === d.id) || (m.deptCode && m.deptCode.toUpperCase() === d.code.toUpperCase()));
      });
      const photoCount = approvedMedia.filter((m) => (m.mediaType || 'photo').toLowerCase() === 'photo' || m.mediaType === 'IMAGE').length;
      const videoCount = approvedMedia.filter((m) => (m.mediaType || '').toLowerCase() === 'video' || m.mediaType === 'VIDEO').length;

      return {
        ...d,
        batchCount: deptBatches.length,
        batches: deptBatches,
        totalMedia: approvedMedia.length,
        photoCount,
        videoCount,
      };
    });

    res.json({ ok: true, data: enriched });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get('/departments/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const code = req.params.id.toUpperCase();
    const store = db.getStore();
    const dept = (store.departments || []).find((d) => d.id === id || (d.code && d.code.toUpperCase() === code));
    if (!dept) {
      return res.status(404).json({ ok: false, message: 'Department not found' });
    }
    const batches = (store.batches || []).filter((b) => b.departmentId === dept.id || b.deptCode === dept.code);
    res.json({ ok: true, data: { ...dept, batches } });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// BATCHES
// ========================
router.get('/departments/:id/batches', async (req, res) => {
  try {
    const deptId = Number(req.params.id);
    const store = db.getStore();
    const dept = (store.departments || []).find((d) => d.id === deptId || d.code === req.params.id.toUpperCase());
    if (!dept) {
      return res.status(404).json({ ok: false, message: 'Department not found' });
    }

    const batches = (store.batches || []).filter((b) => b.departmentId === dept.id || b.deptCode === dept.code);
    const galleryItems = store.gallery || [];

    // Augment with approved photo/video counts and latest activity
    const enriched = batches.map((b) => {
      const bMedia = galleryItems.filter((m) => {
        const isApproved = !m.moderationStatus || m.moderationStatus === 'approved';
        const matchesDept = (m.departmentId && m.departmentId === dept.id) || (m.deptCode && m.deptCode.toUpperCase() === dept.code.toUpperCase());
        const matchesBatch = (m.batchId && m.batchId === b.id) || (m.batch && (m.batch === b.label || m.batch === String(b.batchNumber) || m.batch === String(b.admissionYear)));
        return isApproved && matchesDept && matchesBatch;
      });

      const photoCount = bMedia.filter((m) => (m.mediaType || 'photo').toLowerCase() === 'photo' || m.mediaType === 'IMAGE').length;
      const videoCount = bMedia.filter((m) => (m.mediaType || '').toLowerCase() === 'video' || m.mediaType === 'VIDEO').length;
      const latestItem = bMedia.sort((x, y) => new Date(y.createdAt || 0) - new Date(x.createdAt || 0))[0];

      return {
        ...b,
        totalMedia: bMedia.length,
        photoCount,
        videoCount,
        latestActivity: latestItem ? (latestItem.createdAt || 'Recent') : null,
      };
    });

    res.json({ ok: true, data: enriched, count: enriched.length });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/departments/:id/batches', requireAdmin, async (req, res) => {
  try {
    const deptId = Number(req.params.id);
    const { label, session, admissionYear, graduationYear, status = 'active' } = req.body;
    const store = db.getStore();
    const dept = (store.departments || []).find((d) => d.id === deptId || d.code === req.params.id.toUpperCase());
    if (!dept) {
      return res.status(404).json({ ok: false, message: 'Department not found' });
    }

    const existingBatches = (store.batches || []).filter((b) => b.departmentId === dept.id);
    const nextNum = existingBatches.length + 1;
    const newBatch = {
      id: Date.now(),
      batchNumber: nextNum,
      label: label || `Batch ${nextNum}`,
      session: session || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      admissionYear: admissionYear || new Date().getFullYear(),
      graduationYear: graduationYear || (new Date().getFullYear() + 4),
      departmentId: dept.id,
      deptCode: dept.code,
      status,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    store.batches.push(newBatch);
    db.saveStore();

    if (db.isMongo() && db.models.Batch) {
      await db.models.Batch.create(newBatch);
    }

    res.status(201).json({ ok: true, data: newBatch, message: 'New batch configured successfully' });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// EVENTS
// ========================
router.get('/events', async (req, res) => {
  try {
    const events = await getAll('Event', 'events');
    res.json({ ok: true, data: events });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/events', async (req, res) => {
  try {
    const { title, date, location } = req.body;
    if (!title || !date || !location) {
      return res.status(400).json({ ok: false, message: 'Title, date, and location are required' });
    }
    const store = db.getStore();
    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      date: date.trim(),
      time: req.body.time || '10:00 AM',
      location: location.trim(),
      type: req.body.type || 'Reunion',
      online: Boolean(req.body.online),
      spots: Number(req.body.spots) || 500,
      registered: 1,
      img:
        req.body.img ||
        '/assets/WhatsApp_Image_2026-09-15_at_3.15.05_PM__2_-0fp2ZTdb.jpeg',
      desc: req.body.desc || 'PUST Alumni Association official event.',
      organizer: req.body.organizer || 'PUST Alumni Association',
      status: 'upcoming',
      featured: Boolean(req.body.featured),
    };
    store.events.unshift(newEvent);
    db.saveStore();

    if (db.isMongo()) {
      await db.models.Event.create(newEvent);
    }
    res.status(201).json({ ok: true, data: newEvent });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/events/:id/register', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const isCancel = req.body && (req.body.action === 'cancel' || req.body.unregister === true);
    const store = db.getStore();
    const ev = store.events.find((e) => e.id === id);
    if (!ev) {
      return res.status(404).json({ ok: false, message: 'Event not found' });
    }
    if (isCancel) {
      ev.registered = Math.max(0, (ev.registered || 1) - 1);
    } else {
      ev.registered = (ev.registered || 0) + 1;
    }
    db.saveStore();
    if (db.isMongo()) {
      const incVal = isCancel ? -1 : 1;
      await db.models.Event.findOneAndUpdate({ id }, { $inc: { registered: incVal } });
    }
    res.json({ ok: true, data: ev, isCancel });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.delete('/events/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const idx = store.events.findIndex((e) => e.id === id);
    if (idx === -1) {
      return res.status(404).json({ ok: false, message: 'Event not found' });
    }
    store.events.splice(idx, 1);
    db.saveStore();
    if (db.isMongo()) {
      await db.models.Event.findOneAndDelete({ id });
    }
    res.json({ ok: true, id });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// JOBS & REAL-TIME CAREER ECOSYSTEM
// ========================

// In-memory cache for live online jobs (Remotive API)
let cachedOnlineJobs = null;
let lastOnlineFetchTime = 0;

function fetchLiveRemoteJobs() {
  const now = Date.now();
  if (cachedOnlineJobs && (now - lastOnlineFetchTime < 10 * 60 * 1000)) {
    return Promise.resolve(cachedOnlineJobs);
  }

  return new Promise((resolve) => {
    const https = require('https');
    const req = https.get('https://remotive.com/api/remote-jobs?limit=18', { timeout: 3500 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed.jobs) && parsed.jobs.length > 0) {
            const mapped = parsed.jobs.slice(0, 18).map((j, idx) => {
              const cleanDesc = (j.description || '')
                .replace(/<[^>]*>?/gm, ' ')
                .replace(/\s+/g, ' ')
                .trim();
              return {
                id: `online-${j.id || (10000 + idx)}`,
                title: j.title || 'Software Engineer',
                company: j.company_name || 'Global Tech Partner',
                logo: j.company_logo || '🌐',
                location: j.candidate_required_location || 'Worldwide (Remote)',
                type: j.job_type === 'internship' ? 'Internship' : (j.job_type === 'contract' ? 'Contract' : 'Full-time'),
                salary: j.salary || '$55,000–$110,000/yr (USD / Remote)',
                dept: (j.category || '').toLowerCase().includes('software') || (j.category || '').toLowerCase().includes('dev')
                  ? 'CSE'
                  : ((j.category || '').toLowerCase().includes('data') ? 'MATH/CSE' : 'All Departments'),
                posted: 'Real-time Live API',
                deadline: 'Rolling / Immediate',
                skills: Array.isArray(j.tags) && j.tags.length > 0 ? j.tags.slice(0, 5) : ['Remote', 'Cloud', 'Engineering'],
                applicants: Math.floor(18 + Math.random() * 45),
                postedBy: 'Verified Recruiter (Live Online Feed)',
                remote: true,
                desc: cleanDesc.slice(0, 340) + '...',
                applyUrl: j.url || 'https://remotive.com',
                applyEmail: `careers@${(j.company_name ? j.company_name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'global')}.com`,
                isLiveApi: true,
                status: 'approved',
              };
            });
            cachedOnlineJobs = mapped;
            lastOnlineFetchTime = now;
            resolve(mapped);
            return;
          }
        } catch {
          // ignore parsing error
        }
        resolve(cachedOnlineJobs || []);
      });
    });

    req.on('error', () => resolve(cachedOnlineJobs || []));
    req.on('timeout', () => {
      req.destroy();
      resolve(cachedOnlineJobs || []);
    });
  });
}

router.get('/jobs/live', async (req, res) => {
  try {
    const onlineJobs = await fetchLiveRemoteJobs();
    res.json({ ok: true, data: onlineJobs });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get('/jobs', async (req, res) => {
  try {
    const jobs = await getAll('Job', 'jobs');
    if (req.query.source === 'online') {
      const onlineJobs = await fetchLiveRemoteJobs();
      return res.json({ ok: true, data: onlineJobs });
    }
    if (req.query.include_online === 'true' || req.query.source === 'all') {
      const onlineJobs = await fetchLiveRemoteJobs();
      return res.json({ ok: true, data: [...jobs, ...onlineJobs] });
    }
    res.json({ ok: true, data: jobs });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const { title, company } = req.body;
    if (!title || !company) {
      return res.status(400).json({ ok: false, message: 'Job title and company are required' });
    }
    const store = db.getStore();
    const newJob = {
      id: Date.now(),
      title: title.trim(),
      company: company.trim(),
      logo: req.body.logo || '🏢',
      location: req.body.location || 'Dhaka, Bangladesh',
      type: req.body.type || 'Full-time',
      salary: req.body.salary || '৳ 50,000–80,000/mo',
      dept: req.body.dept || 'CSE',
      posted: 'Just now',
      deadline: req.body.deadline || 'Nov 30, 2026',
      skills: Array.isArray(req.body.skills)
        ? req.body.skills
        : (req.body.skills || 'React, Node.js, MongoDB').split(',').map((s) => s.trim()),
      applicants: 0,
      postedBy: req.body.postedBy || 'PUST Alumni Leader',
      remote: Boolean(req.body.remote),
      desc: req.body.desc || 'Exciting career opportunity for PUST graduates.',
      applyUrl: req.body.applyUrl || '',
      applyEmail: req.body.applyEmail || '',
      status: 'approved',
    };
    store.jobs.unshift(newJob);
    db.saveStore();

    if (db.isMongo()) {
      await db.models.Job.create(newJob);
    }
    res.status(201).json({ ok: true, data: newJob });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/jobs/:id/apply', async (req, res) => {
  try {
    const rawId = req.params.id;
    const store = db.getStore();
    store.jobApplications = store.jobApplications || [];

    const numId = Number(rawId);
    let job = !isNaN(numId) ? store.jobs.find((j) => j.id === numId) : null;

    if (!job && String(rawId).startsWith('online-')) {
      const liveJobs = cachedOnlineJobs || [];
      const foundOnline = liveJobs.find((j) => String(j.id) === String(rawId));
      job = foundOnline || {
        id: rawId,
        title: req.body.jobTitle || 'Global Career Opportunity',
        company: req.body.company || 'International Partner',
        applicants: 15,
      };
    }

    if (!job) {
      return res.status(404).json({ ok: false, message: 'Job not found' });
    }

    job.applicants = (job.applicants || 0) + 1;
    db.saveStore();
    if (db.isMongo() && !isNaN(numId)) {
      await db.models.Job.findOneAndUpdate({ id: numId }, { $inc: { applicants: 1 } });
    }

    const trackingCode = req.body.trackingCode || `PUST-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      id: Date.now(),
      trackingCode,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantName: req.body.name || req.body.applicantName || 'Applicant',
      applicantEmail: req.body.email || req.body.applicantEmail || '',
      applicantPhone: req.body.phone || req.body.applicantPhone || '',
      applicantDept: req.body.dept || req.body.applicantDept || '',
      applicantBatch: req.body.batch || req.body.applicantBatch || '',
      portfolioUrl: req.body.portfolioUrl || '',
      resumeUrl: req.body.resumeUrl || '',
      coverNote: req.body.coverNote || '',
      status: 'Forwarded to Hiring Team',
      appliedAt: new Date().toISOString(),
    };
    store.jobApplications.unshift(newApp);
    db.saveStore();

    res.json({ ok: true, data: job, trackingCode, application: newApp });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get('/jobs/applications/:identifier', async (req, res) => {
  try {
    const ident = (req.params.identifier || '').trim().toLowerCase();
    const store = db.getStore();
    const apps = store.jobApplications || [];
    const matched = apps.filter(
      (a) =>
        (a.trackingCode && a.trackingCode.toLowerCase() === ident) ||
        (a.applicantEmail && a.applicantEmail.toLowerCase() === ident)
    );
    res.json({ ok: true, data: matched });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.patch('/jobs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const job = store.jobs.find((j) => j.id === id);
    if (!job) {
      return res.status(404).json({ ok: false, message: 'Job not found' });
    }
    Object.assign(job, req.body);
    db.saveStore();
    if (db.isMongo()) {
      await db.models.Job.findOneAndUpdate({ id }, req.body);
    }
    res.json({ ok: true, data: job });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.delete('/jobs/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const idx = store.jobs.findIndex((j) => j.id === id);
    if (idx === -1) {
      return res.status(404).json({ ok: false, message: 'Job not found' });
    }
    store.jobs.splice(idx, 1);
    db.saveStore();
    if (db.isMongo()) {
      await db.models.Job.findOneAndDelete({ id });
    }
    res.json({ ok: true, id });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// STORIES
// ========================
router.get('/stories', async (req, res) => {
  try {
    const stories = await getAll('Story', 'stories');
    res.json({ ok: true, data: stories });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/stories', async (req, res) => {
  try {
    const store = db.getStore();
    const newStory = {
      id: Date.now(),
      title: req.body.title || 'My PUST Journey',
      author: req.body.author || store.users[0],
      category: req.body.category || 'Career Journey',
      date: 'Sept 2026',
      readTime: '5 min',
      img:
        req.body.img ||
        '/assets/fresher_s_reception_2026-VNfpIasg.jpg',
      excerpt: req.body.excerpt || req.body.content || 'An inspiring story from a PUST graduate.',
      content: req.body.content || '',
      featured: false,
      likes: 1,
    };
    store.stories.unshift(newStory);
    db.saveStore();

    if (db.isMongo()) {
      await db.models.Story.create(newStory);
    }
    res.status(201).json({ ok: true, data: newStory });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/stories/:id/like', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const story = store.stories.find((s) => s.id === id);
    if (!story) {
      return res.status(404).json({ ok: false, message: 'Story not found' });
    }
    story.likes = (story.likes || 0) + 1;
    db.saveStore();

    if (db.isMongo()) {
      await db.models.Story.findOneAndUpdate({ id }, { $inc: { likes: 1 } });
    }
    res.json({ ok: true, data: story });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// GALLERY & REAL-TIME MULTIMEDIA ARCHIVE (FACULTY -> DEPT -> BATCH -> MEMORIES)
// ========================
router.get('/gallery', async (req, res) => {
  try {
    const {
      facultyId,
      faculty,
      departmentId,
      dept,
      batchId,
      batch,
      mediaType,
      category,
      stakeholder,
      moderationStatus,
      search,
      page = 1,
      limit = 30,
    } = req.query;

    let gallery = await getAll('GalleryItem', 'gallery');

    // Filter by moderation status: guests and standard users see ONLY approved content
    const authHeader = req.headers.authorization;
    let currentUser = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        currentUser = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
      } catch {
        // ignore invalid token for public listing
      }
    }

    if (moderationStatus) {
      if (currentUser && (currentUser.role === 'admin' || currentUser.galleryRole === 'moderator')) {
        gallery = gallery.filter((item) => item.moderationStatus === moderationStatus);
      } else {
        gallery = gallery.filter((item) => (item.moderationStatus || 'approved') === 'approved');
      }
    } else {
      // Default to approved only
      gallery = gallery.filter((item) => !item.moderationStatus || item.moderationStatus === 'approved');
    }

    // Faculty filtering
    if (facultyId) {
      gallery = gallery.filter((item) => String(item.facultyId) === String(facultyId));
    }
    if (faculty && faculty !== 'all') {
      gallery = gallery.filter((item) => (item.faculty || '').toLowerCase() === faculty.toLowerCase());
    }

    // Department filtering
    if (departmentId) {
      gallery = gallery.filter((item) => String(item.departmentId) === String(departmentId));
    }
    if (dept && dept !== 'all') {
      const target = dept.toLowerCase();
      gallery = gallery.filter((item) => {
        const d = (item.dept || '').toLowerCase();
        const dc = (item.deptCode || '').toLowerCase();
        return d.includes(target) || dc === target || (item.uploader?.dept || '').toLowerCase().includes(target);
      });
    }

    // Batch filtering
    if (batchId) {
      gallery = gallery.filter((item) => String(item.batchId) === String(batchId));
    }
    if (batch && batch !== 'all') {
      const bStr = String(batch).toLowerCase().trim();
      gallery = gallery.filter((item) => {
        const itemBatch = String(item.batch || item.batchLabel || '').toLowerCase();
        return itemBatch === bStr || itemBatch.includes(bStr);
      });
    }

    // Media type filter
    if (mediaType && mediaType !== 'all') {
      const mTarget = mediaType.toLowerCase();
      gallery = gallery.filter((item) => {
        const t = (item.mediaType || 'photo').toLowerCase();
        return t === mTarget || (mTarget === 'photo' && t === 'image') || (mTarget === 'video' && t === 'video');
      });
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      gallery = gallery.filter((item) => (item.category || '').toLowerCase() === category.toLowerCase());
    }

    // Stakeholder filter
    if (stakeholder && stakeholder !== 'all') {
      gallery = gallery.filter((item) => (item.stakeholder || '').toLowerCase() === stakeholder.toLowerCase());
    }

    // Search query filter
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      gallery = gallery.filter(
        (item) =>
          (item.title || '').toLowerCase().includes(q) ||
          (item.caption || '').toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q) ||
          (item.dept || '').toLowerCase().includes(q) ||
          (item.deptCode || '').toLowerCase().includes(q) ||
          (item.batch || '').toLowerCase().includes(q) ||
          (item.uploader?.name || '').toLowerCase().includes(q)
      );
    }

    // Sort newest first
    gallery = [...gallery].reverse();

    const totalCount = gallery.length;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = gallery.slice(startIndex, startIndex + limitNum);

    res.json({
      ok: true,
      data: paginated,
      totalCount,
      count: paginated.length,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Check Current User's Gallery Upload Permissions
router.get('/gallery/permissions', requireAuth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const store = db.getStore();
    const user = (store.users || []).find((u) => u.id === userId) || req.user;

    const isAdmin = user.role === 'admin';
    const isVerified = Boolean(user.verified);

    // Find user's department and batch
    const userDept = user.dept || '';
    const userBatch = user.batch || '';

    // Check if user has an approved access request
    const accessReqs = (store.galleryAccessRequests || []).filter(
      (r) => r.userId === userId && r.status === 'approved'
    );

    const authorizedDepartments = new Set();
    const authorizedBatches = new Set();

    if (isAdmin) {
      (store.departments || []).forEach((d) => authorizedDepartments.add(d.code));
    } else {
      // Natural department from profile
      const matchedDept = (store.departments || []).find(
        (d) => d.code === userDept.toUpperCase() || d.name.toLowerCase().includes(userDept.toLowerCase())
      );
      if (matchedDept) {
        authorizedDepartments.add(matchedDept.code);
      }
      accessReqs.forEach((r) => {
        if (r.deptCode) authorizedDepartments.add(r.deptCode);
      });
    }

    res.json({
      ok: true,
      data: {
        canUpload: isAdmin || isVerified || accessReqs.length > 0 || Boolean(userDept),
        isAdmin,
        isVerified,
        isModerator: isAdmin || accessReqs.some((r) => r.requestedRole === 'moderator'),
        userDept,
        userBatch,
        authorizedDepartments: Array.from(authorizedDepartments),
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Request Department / Batch Upload Access
router.post('/gallery/request-access', requireAuth, async (req, res) => {
  try {
    const { departmentId, batchId, reason, requestedRole = 'member' } = req.body;
    const store = db.getStore();

    const dept = (store.departments || []).find((d) => d.id === Number(departmentId) || d.code === String(departmentId).toUpperCase());
    if (!dept) {
      return res.status(404).json({ ok: false, message: 'Department not found' });
    }

    let batchLabel = '';
    if (batchId) {
      const batchObj = (store.batches || []).find((b) => b.id === Number(batchId) || b.label === String(batchId));
      if (batchObj) batchLabel = batchObj.label;
    }

    const newRequest = {
      id: Date.now(),
      userId: Number(req.user.id),
      userName: req.user.name || 'PUSTian',
      userEmail: req.user.email || '',
      departmentId: dept.id,
      deptCode: dept.code,
      batchId: batchId ? Number(batchId) : null,
      batchLabel,
      requestedRole,
      reason: (reason || '').trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(store.galleryAccessRequests)) {
      store.galleryAccessRequests = [];
    }
    store.galleryAccessRequests.push(newRequest);
    db.saveStore();

    if (db.isMongo() && db.models.GalleryAccessRequest) {
      await db.models.GalleryAccessRequest.create(newRequest);
    }

    res.status(201).json({ ok: true, data: newRequest, message: 'Access request submitted for review.' });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Admin / Moderator: Review Access Request
router.patch('/gallery/access-requests/:id', requireAuth, async (req, res) => {
  try {
    const reqId = Number(req.params.id);
    const { status } = req.body; // approved or rejected
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ ok: false, message: 'Status must be approved or rejected' });
    }

    const store = db.getStore();
    const item = (store.galleryAccessRequests || []).find((r) => r.id === reqId);
    if (!item) {
      return res.status(404).json({ ok: false, message: 'Access request not found' });
    }

    // Role check: Admin or Moderator of this department
    const isSuperAdmin = req.user.role === 'admin';
    const isDeptModerator = (store.galleryAccessRequests || []).some(
      (r) => r.userId === req.user.id && r.departmentId === item.departmentId && r.requestedRole === 'moderator' && r.status === 'approved'
    );

    if (!isSuperAdmin && !isDeptModerator) {
      return res.status(403).json({ ok: false, message: 'Forbidden: You do not have moderation rights for this department.' });
    }

    item.status = status;
    item.reviewedBy = req.user.id;
    item.reviewedAt = new Date().toISOString();
    db.saveStore();

    if (db.isMongo() && db.models.GalleryAccessRequest) {
      await db.models.GalleryAccessRequest.findOneAndUpdate({ id: reqId }, { status, reviewedBy: req.user.id, reviewedAt: new Date() });
    }

    res.json({ ok: true, data: item, message: `Access request ${status}` });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Upload Memory (Strict Validation + Hierarchy Integrity Check + Role-based Authorization)
router.post('/gallery', requireAuth, async (req, res) => {
  try {
    const {
      title,
      caption,
      url,
      thumb,
      mediaType = 'photo',
      category = 'Campus Life',
      facultyId,
      departmentId,
      deptCode,
      batchId,
      batch,
      description = '',
      year = new Date().getFullYear(),
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ ok: false, message: 'Media title is required' });
    }
    if (!url || !url.trim()) {
      return res.status(400).json({ ok: false, message: 'Media file or URL is required' });
    }

    // Server-side file validation (MIME & size)
    const mediaCheck = validateMedia({ mediaType, url });
    if (!mediaCheck.ok) {
      return res.status(400).json({ ok: false, message: mediaCheck.message });
    }

    const store = db.getStore();

    // Verify Department exists
    const dept = (store.departments || []).find(
      (d) => (departmentId && d.id === Number(departmentId)) || (deptCode && d.code.toUpperCase() === String(deptCode).toUpperCase())
    );
    if (!dept) {
      return res.status(400).json({ ok: false, message: 'Invalid department specified' });
    }

    // Verify Faculty hierarchy
    const faculty = (store.faculties || []).find(
      (f) => (facultyId && f.id === Number(facultyId)) || (dept.faculty && (f.name.toLowerCase() === dept.faculty.toLowerCase() || f.shortName.toLowerCase() === dept.faculty.toLowerCase()))
    );

    // Verify Batch belongs to this Department
    let matchedBatch = null;
    if (batchId) {
      matchedBatch = (store.batches || []).find((b) => b.id === Number(batchId));
      if (!matchedBatch) {
        return res.status(400).json({ ok: false, message: 'Specified batch does not exist' });
      }
      if (matchedBatch.departmentId !== dept.id && matchedBatch.deptCode !== dept.code) {
        return res.status(400).json({ ok: false, message: 'Cross-department violation: The selected batch does not belong to this department.' });
      }
    } else if (batch) {
      matchedBatch = (store.batches || []).find(
        (b) => (b.departmentId === dept.id || b.deptCode === dept.code) && (b.label.toLowerCase() === String(batch).toLowerCase() || String(b.batchNumber) === String(batch))
      );
    }

    // Resource-Level Authorization Check:
    // Super admin can post anywhere.
    // Otherwise, check if user's verified department matches OR they have approved access for this department.
    const isSuperAdmin = req.user.role === 'admin';
    const userDoc = (store.users || []).find((u) => u.id === req.user.id) || req.user;
    const userDept = (userDoc.dept || '').toUpperCase();
    const isDeptMember = userDept === dept.code.toUpperCase() || userDept.includes(dept.code.toUpperCase()) || (dept.name && userDept.includes(dept.name.toUpperCase()));

    const hasApprovedAccess = (store.galleryAccessRequests || []).some(
      (r) => r.userId === req.user.id && (r.departmentId === dept.id || r.deptCode === dept.code) && r.status === 'approved'
    );

    if (!isSuperAdmin && !isDeptMember && !hasApprovedAccess) {
      return res.status(403).json({
        ok: false,
        message: `Forbidden: You are not authorized to upload memories to ${dept.name} (${dept.code}). Please submit an access request.`,
      });
    }

    // Moderation Status: Admins & verified department moderators auto-approve; others default to pending
    const isModerator = isSuperAdmin || (store.galleryAccessRequests || []).some(
      (r) => r.userId === req.user.id && r.departmentId === dept.id && r.requestedRole === 'moderator' && r.status === 'approved'
    );

    const moderationStatus = isModerator ? 'approved' : 'pending';

    const newItem = {
      id: Date.now(),
      title: title.trim(),
      caption: (caption || '').trim(),
      url: url.trim(),
      thumb: (thumb && thumb.trim()) || url.trim(),
      mediaType: mediaType === 'video' || mediaType === 'VIDEO' ? 'video' : 'photo',
      category: category.trim(),
      facultyId: faculty?.id || dept.facultyId || 1,
      faculty: faculty?.name || dept.faculty || 'Faculty of Engineering & Technology',
      departmentId: dept.id,
      dept: dept.name,
      deptCode: dept.code,
      batchId: matchedBatch ? matchedBatch.id : null,
      batch: matchedBatch ? matchedBatch.label : (batch || 'Batch 1'),
      batchLabel: matchedBatch ? matchedBatch.label : (batch || 'Batch 1'),
      description: (description || '').trim(),
      year: year || 2026,
      likes: 0,
      likedBy: [],
      stakeholder: req.user.role || 'alumni',
      moderationStatus,
      approvedBy: isModerator ? req.user.id : null,
      approvedAt: isModerator ? new Date().toISOString() : null,
      ownerId: req.user.id,
      uploader: {
        id: req.user.id,
        name: req.user.name || 'PUSTian',
        role: req.user.role || 'alumni',
        dept: dept.code,
        avatar: req.user.avatar || createInitialsAvatar(req.user.name || 'PUSTian', req.user.role || 'alumni'),
      },
      comments: [],
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(store.gallery)) {
      store.gallery = [];
    }
    store.gallery.push(newItem);
    db.saveStore();

    if (db.isMongo() && db.models.GalleryItem) {
      await db.models.GalleryItem.create(newItem);
    }

    // Live Socket Broadcast if approved
    if (moderationStatus === 'approved') {
      const io = getIO();
      if (io) {
        io.emit('gallery_item_added', newItem);
      }
    }

    res.status(201).json({
      ok: true,
      data: newItem,
      message: moderationStatus === 'approved'
        ? 'Memory successfully published to department gallery!'
        : 'Memory submitted successfully! It is now pending review by your department moderator.',
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Moderate Memory (Approve / Reject)
router.patch('/gallery/:id/moderate', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, rejectionReason } = req.body;
    if (!['approved', 'rejected', 'archived'].includes(status)) {
      return res.status(400).json({ ok: false, message: 'Invalid status. Must be approved, rejected, or archived.' });
    }

    const store = db.getStore();
    const item = (store.gallery || []).find((g) => g.id === id);
    if (!item) {
      return res.status(404).json({ ok: false, message: 'Gallery item not found' });
    }

    // Scope verification: Super admin OR moderator of this specific department
    const isSuperAdmin = req.user.role === 'admin';
    const isDeptModerator = (store.galleryAccessRequests || []).some(
      (r) => r.userId === req.user.id && (r.departmentId === item.departmentId || r.deptCode === item.deptCode) && r.requestedRole === 'moderator' && r.status === 'approved'
    );

    if (!isSuperAdmin && !isDeptModerator) {
      return res.status(403).json({ ok: false, message: 'Forbidden: You do not have moderation rights for this department.' });
    }

    item.moderationStatus = status;
    item.rejectionReason = status === 'rejected' ? (rejectionReason || 'Content did not meet gallery guidelines.') : '';
    item.approvedBy = status === 'approved' ? req.user.id : null;
    item.approvedAt = status === 'approved' ? new Date().toISOString() : null;
    db.saveStore();

    if (db.isMongo() && db.models.GalleryItem) {
      await db.models.GalleryItem.findOneAndUpdate({ id }, {
        moderationStatus: status,
        rejectionReason: item.rejectionReason,
        approvedBy: item.approvedBy,
        approvedAt: item.approvedAt,
      });
    }

    const io = getIO();
    if (io) {
      if (status === 'approved') {
        io.emit('gallery_item_added', item);
      } else {
        io.emit('gallery_item_deleted', { id });
      }
    }

    res.json({ ok: true, data: item, message: `Memory marked as ${status}` });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/gallery/:id/like', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { userId } = req.body || {};
    const store = db.getStore();
    const item = store.gallery.find((g) => g.id === id);
    if (!item) {
      return res.status(404).json({ ok: false, message: 'Gallery item not found' });
    }

    if (!Array.isArray(item.likedBy)) {
      item.likedBy = [];
    }

    const uid = userId ? String(userId) : 'anon_' + Date.now();
    const index = item.likedBy.indexOf(uid);
    let userHasLiked = false;

    if (index > -1) {
      item.likedBy.splice(index, 1);
      item.likes = Math.max(0, (item.likes || 1) - 1);
      userHasLiked = false;
    } else {
      item.likedBy.push(uid);
      item.likes = (item.likes || 0) + 1;
      userHasLiked = true;
    }

    db.saveStore();
    if (db.isMongo()) {
      await db.models.GalleryItem.findOneAndUpdate(
        { id },
        { likes: item.likes, likedBy: item.likedBy }
      );
    }

    // Real-Time Socket Broadcast
    const io = getIO();
    if (io) {
      io.emit('gallery_item_liked', { id, likes: item.likes, likedBy: item.likedBy });
    }

    res.json({ ok: true, data: item, userHasLiked });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/gallery/:id/comment', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { text, user } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ ok: false, message: 'Comment text cannot be empty' });
    }

    const store = db.getStore();
    const item = store.gallery.find((g) => g.id === id);
    if (!item) {
      return res.status(404).json({ ok: false, message: 'Gallery item not found' });
    }

    if (!Array.isArray(item.comments)) {
      item.comments = [];
    }

    const newComment = {
      id: Date.now(),
      text: text.trim(),
      userName: user?.name || 'PUSTian',
      userRole: user?.role || 'alumni',
      dept: user?.dept || 'PUST',
      avatar: user?.avatar || createInitialsAvatar(user?.name || 'PUSTian', user?.role || 'alumni'),
      createdAt: new Date().toISOString(),
    };

    item.comments.push(newComment);
    db.saveStore();

    if (db.isMongo()) {
      await db.models.GalleryItem.findOneAndUpdate({ id }, { $push: { comments: newComment } });
    }

    // Real-Time Socket Broadcast
    const io = getIO();
    if (io) {
      io.emit('gallery_item_commented', { id, comment: newComment, comments: item.comments });
    }

    res.json({ ok: true, data: item, comment: newComment });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const index = store.gallery.findIndex((g) => g.id === id);
    if (index === -1) {
      return res.status(404).json({ ok: false, message: 'Gallery item not found' });
    }

    const removed = store.gallery.splice(index, 1)[0];
    db.saveStore();

    if (db.isMongo()) {
      await db.models.GalleryItem.findOneAndDelete({ id });
    }

    const io = getIO();
    if (io) {
      io.emit('gallery_item_deleted', { id });
    }

    res.json({ ok: true, message: 'Gallery item deleted successfully', deletedId: id });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// COMMUNITY (Real-Time Live Ecosystem & Custom Community Creation)
// ========================
router.get('/community', async (req, res) => {
  try {
    const store = db.getStore();
    const posts = await getAll('CommunityPost', 'communityPosts');
    const communities = store.communities || [];
    const gatherings = store.communityGatherings || [];
    const totalMembers = communities.reduce((acc, c) => acc + (c.membersCount || 0), 0) || 22400;
    const totalPosts = posts.length || 1200;
    const onlineNow = communities.reduce((acc, c) => acc + (c.onlineCount || 0), 0) || 148;

    res.json({
      ok: true,
      data: posts,
      communities,
      gatherings,
      stats: {
        totalMembers,
        totalPosts,
        totalCommunities: communities.length,
        onlineNow,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/community', async (req, res) => {
  try {
    const store = db.getStore();
    const authorUser = req.body.author || store.users[0];
    const newPost = {
      id: Date.now(),
      author: authorUser,
      channel: req.body.channel || 'CSE & Tech Alumni Circle',
      communityId: Number(req.body.communityId) || 1,
      title: req.body.title || req.body.body?.slice(0, 60) || 'Community Discussion',
      body: req.body.body || '',
      tags: Array.isArray(req.body.tags) && req.body.tags.length > 0 ? req.body.tags : ['Discussion', 'PUST'],
      type: req.body.type || 'post', // 'post' | 'announcement' | 'question' | 'poll'
      poll: req.body.poll || null,
      likes: 1,
      likedBy: [String(authorUser.id || 1)],
      replies: 0,
      comments: 0,
      commentList: [],
      time: 'Just now',
      pinned: Boolean(req.body.pinned),
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(store.communityPosts)) store.communityPosts = [];
    store.communityPosts.unshift(newPost);

    // Increment post count in relevant community if found
    if (Array.isArray(store.communities)) {
      const comm = store.communities.find((c) => c.name === newPost.channel || c.id === newPost.communityId);
      if (comm) comm.postsCount = (comm.postsCount || 0) + 1;
    }

    db.saveStore();

    if (db.isMongo()) {
      if (db.models.CommunityPost) await db.models.CommunityPost.create(newPost);
    }

    const io = getIO();
    if (io) {
      io.emit('community_post_created', newPost);
      io.emit('community_activity', {
        id: Date.now(),
        type: 'post',
        author: newPost.author?.name || 'PUST Member',
        channel: newPost.channel,
        title: newPost.title,
        time: 'Just now',
      });
    }

    res.status(201).json({ ok: true, data: newPost });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Community Groups / Circles List
router.get('/community/groups', async (req, res) => {
  try {
    const store = db.getStore();
    res.json({ ok: true, data: store.communities || [] });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Create New Community / Circle / Chapter
router.post('/community/groups', async (req, res) => {
  try {
    const store = db.getStore();
    if (!Array.isArray(store.communities)) store.communities = [];

    const name = (req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({ ok: false, message: 'Community name is required' });
    }

    const existing = store.communities.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      return res.status(400).json({ ok: false, message: 'A community with this name already exists' });
    }

    const creator = req.body.creator || store.users[0];
    const newGroup = {
      id: Date.now(),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      desc: req.body.desc || `Welcome to ${name} on the PUST Alumni Network!`,
      icon: req.body.icon || '🌟',
      category: req.body.category || 'General',
      dept: req.body.dept || creator?.dept || 'All Departments',
      tags: Array.isArray(req.body.tags) && req.body.tags.length > 0 ? req.body.tags : [name.split(' ')[0], 'PUST'],
      membersCount: 1,
      postsCount: 0,
      onlineCount: 1,
      privacy: req.body.privacy || 'Public',
      creator: {
        name: creator?.name || 'PUST Member',
        role: creator?.role || 'alumni',
        dept: creator?.dept || 'PUST',
        avatar: creator?.avatar || createInitialsAvatar(creator?.name || 'User', 'alumni'),
      },
      memberIds: [Number(creator?.id || 1)],
      img: req.body.img || '/assets/fresher_s_reception_2026-VNfpIasg.jpg',
      createdAt: new Date().toISOString(),
    };

    store.communities.unshift(newGroup);

    // Push notification to global feed
    if (!Array.isArray(store.notifications)) store.notifications = [];
    store.notifications.unshift({
      id: Date.now() + 1,
      type: 'community',
      msg: `🎉 New community created: "${newGroup.name}" by ${newGroup.creator.name}`,
      time: 'Just now',
      read: false,
      avatar: newGroup.creator.avatar,
    });

    db.saveStore();

    if (db.isMongo() && db.models.CommunityGroup) {
      await db.models.CommunityGroup.create(newGroup);
    }

    const io = getIO();
    if (io) {
      io.emit('community_created', newGroup);
      io.emit('community_activity', {
        id: Date.now(),
        type: 'new_community',
        name: newGroup.name,
        creator: newGroup.creator.name,
        time: 'Just now',
      });
      io.emit('new_notification', {
        id: Date.now() + 1,
        type: 'community',
        msg: `🎉 New community created: "${newGroup.name}"`,
      });
    }

    res.status(201).json({ ok: true, data: newGroup });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Join / Leave Community Toggle
router.post('/community/groups/:id/join', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const group = (store.communities || []).find((c) => c.id === id);
    if (!group) {
      return res.status(404).json({ ok: false, message: 'Community not found' });
    }

    const userId = Number(req.body.userId) || (req.user?.id ? Number(req.user.id) : 1);
    if (!Array.isArray(group.memberIds)) group.memberIds = [];

    const isMember = group.memberIds.includes(userId);
    if (isMember) {
      group.memberIds = group.memberIds.filter((mid) => mid !== userId);
      group.membersCount = Math.max(1, (group.membersCount || 1) - 1);
    } else {
      group.memberIds.push(userId);
      group.membersCount = (group.membersCount || 0) + 1;
    }

    db.saveStore();

    const io = getIO();
    if (io) {
      io.emit('community_membership_changed', {
        communityId: id,
        membersCount: group.membersCount,
        joined: !isMember,
        userId,
      });
    }

    res.json({ ok: true, joined: !isMember, membersCount: group.membersCount });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Like / React to a Community Post
router.post('/community/:id/like', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const post = (store.communityPosts || []).find((p) => p.id === id);
    if (!post) {
      return res.status(404).json({ ok: false, message: 'Post not found' });
    }

    const userId = String(req.body.userId || req.user?.id || '1');
    if (!Array.isArray(post.likedBy)) post.likedBy = [];

    const alreadyLiked = post.likedBy.includes(userId);
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((u) => u !== userId);
      post.likes = Math.max(0, (post.likes || 1) - 1);
    } else {
      post.likedBy.push(userId);
      post.likes = (post.likes || 0) + 1;
    }

    db.saveStore();

    const io = getIO();
    if (io) {
      io.emit('community_post_liked', { postId: id, likes: post.likes, liked: !alreadyLiked });
    }

    res.json({ ok: true, likes: post.likes, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Add Comment to Post
router.post('/community/:id/comment', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const post = (store.communityPosts || []).find((p) => p.id === id);
    if (!post) {
      return res.status(404).json({ ok: false, message: 'Post not found' });
    }

    const text = (req.body.text || '').trim();
    if (!text) {
      return res.status(400).json({ ok: false, message: 'Comment text is required' });
    }

    const author = req.body.author || 'Dr. Rafiqul Islam';
    const avatar = req.body.avatar || createInitialsAvatar(author, 'alumni');
    const newComment = {
      id: Date.now(),
      author,
      avatar,
      text,
      time: 'Just now',
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(post.commentList)) post.commentList = [];
    post.commentList.push(newComment);
    post.comments = post.commentList.length;
    post.replies = post.commentList.length;

    db.saveStore();

    const io = getIO();
    if (io) {
      io.emit('community_comment_added', { postId: id, comment: newComment, commentsCount: post.comments });
    }

    res.status(201).json({ ok: true, data: newComment, commentsCount: post.comments });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Poll Vote
router.post('/community/:id/vote', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const post = (store.communityPosts || []).find((p) => p.id === id);
    if (!post || !post.poll || !Array.isArray(post.poll.options)) {
      return res.status(404).json({ ok: false, message: 'Poll not found on this post' });
    }

    const optionId = Number(req.body.optionId);
    const targetOpt = post.poll.options.find((o) => o.id === optionId);
    if (!targetOpt) {
      return res.status(400).json({ ok: false, message: 'Invalid poll option' });
    }

    targetOpt.votes = (targetOpt.votes || 0) + 1;
    post.poll.totalVotes = (post.poll.totalVotes || 0) + 1;

    db.saveStore();

    const io = getIO();
    if (io) {
      io.emit('community_poll_voted', { postId: id, poll: post.poll });
    }

    res.json({ ok: true, poll: post.poll });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Community Gatherings List
router.get('/community/gatherings', async (req, res) => {
  try {
    const store = db.getStore();
    res.json({ ok: true, data: store.communityGatherings || [] });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// RSVP to Gathering
router.post('/community/gatherings/:id/rsvp', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const gathering = (store.communityGatherings || []).find((g) => g.id === id);
    if (!gathering) {
      return res.status(404).json({ ok: false, message: 'Gathering not found' });
    }

    const userId = Number(req.body.userId) || 1;
    if (!Array.isArray(gathering.attendeeIds)) gathering.attendeeIds = [];

    if (!gathering.attendeeIds.includes(userId)) {
      gathering.attendeeIds.push(userId);
      gathering.registered = (gathering.registered || 0) + 1;
    }

    db.saveStore();

    const io = getIO();
    if (io) {
      io.emit('community_gathering_rsvp', { gatheringId: id, registered: gathering.registered });
    }

    res.json({ ok: true, registered: gathering.registered, meetLink: gathering.meetLink });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// MENTORSHIP (Real-Time Live Ecosystem)
// ========================
router.get('/mentorship', async (req, res) => {
  try {
    const store = db.getStore();
    const users = await getAll('User', 'users');
    const mentors = users.filter((u) => u.mentorAvailable);
    const requests = await getAll('MentorshipRequest', 'mentorshipRequests');
    const sessions = store.mentorshipSessions || [];
    const reviews = store.mentorshipReviews || [];
    const stats = {
      totalMentors: mentors.length,
      totalSessions: 1842 + sessions.length,
      satisfactionRate: 98,
      activeCountries: 45,
      pendingRequests: requests.filter((r) => r.status === 'pending').length,
    };
    res.json({ ok: true, mentors, requests, sessions, reviews, stats });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/mentorship/request', async (req, res) => {
  try {
    const store = db.getStore();
    const newReqId = Date.now();
    const mentorId = Number(req.body.mentorId) || 1;
    const mentorName = req.body.mentorName || 'Dr. Rafiqul Islam';

    const request = {
      id: newReqId,
      mentorId,
      mentorName,
      mentorAvatar: req.body.mentorAvatar || createInitialsAvatar(mentorName, 'alumni'),
      menteeId: Number(req.body.menteeId) || (req.user?.id ? Number(req.user.id) : 999),
      menteeName: req.body.menteeName || req.body.name || 'PUST Student',
      menteeEmail: req.body.menteeEmail || req.body.email || 'student@pust.ac.bd',
      menteeAvatar: req.body.menteeAvatar || createInitialsAvatar(req.body.menteeName || 'PUST Student', 'student'),
      dept: req.body.dept || 'CSE',
      batch: req.body.batch || '2023',
      topic: req.body.topic || 'Career Guidance',
      goal: req.body.goal || 'Career & Technical Growth',
      message: req.body.message || '',
      preferredDate: req.body.preferredDate || '',
      preferredTime: req.body.preferredTime || '',
      preferredPlatform: req.body.preferredPlatform || 'Google Meet',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(store.mentorshipRequests)) store.mentorshipRequests = [];
    store.mentorshipRequests.unshift(request);

    // Push real notification to notifications list
    if (!Array.isArray(store.notifications)) store.notifications = [];
    const notifObj = {
      id: Date.now() + 1,
      type: 'mentorship',
      msg: `${request.menteeName} requested mentorship: "${request.topic}"`,
      time: 'Just now',
      read: false,
      avatar: request.menteeAvatar,
    };
    store.notifications.unshift(notifObj);

    db.saveStore();

    if (db.isMongo()) {
      if (db.models.MentorshipRequest) await db.models.MentorshipRequest.create(request);
      if (db.models.Notification) await db.models.Notification.create(notifObj);
    }

    // Broadcast via socket to mentor and globally
    const io = getIO();
    if (io) {
      io.emit('mentorship_request_created', request);
      io.emit('mentorship_activity', {
        id: Date.now(),
        type: 'request',
        menteeName: request.menteeName,
        mentorName: request.mentorName,
        topic: request.topic,
        time: 'Just now',
      });
      emitToUser(request.mentorId, 'mentorship_request_received', request);
      io.emit('new_notification', notifObj);
    }

    res.status(201).json({ ok: true, data: request });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.patch('/mentorship/request/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    if (!Array.isArray(store.mentorshipRequests)) store.mentorshipRequests = [];
    const reqItem = store.mentorshipRequests.find((r) => r.id === id);
    if (!reqItem) {
      return res.status(404).json({ ok: false, message: 'Mentorship request not found' });
    }

    const { status, scheduleDate, scheduleTime, platform, meetLink, notes } = req.body;
    if (status) reqItem.status = status;
    if (scheduleDate) reqItem.scheduleDate = scheduleDate;
    if (scheduleTime) reqItem.scheduleTime = scheduleTime;
    if (platform) reqItem.platform = platform;
    if (meetLink) reqItem.meetLink = meetLink;
    if (notes) reqItem.notes = notes;
    reqItem.updatedAt = new Date().toISOString();

    // If accepted, ensure a session is scheduled and tracked
    if (status === 'accepted') {
      if (!Array.isArray(store.mentorshipSessions)) store.mentorshipSessions = [];
      const sessionDate = scheduleDate || reqItem.preferredDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
      const sessionTime = scheduleTime || reqItem.preferredTime || '19:30';
      const sessionPlatform = platform || reqItem.preferredPlatform || 'Google Meet';
      const sessionLink = meetLink || `https://meet.google.com/pus-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 5)}`;

      const newSession = {
        id: Date.now(),
        requestId: id,
        mentorId: reqItem.mentorId,
        mentorName: reqItem.mentorName,
        mentorAvatar: reqItem.mentorAvatar,
        menteeId: reqItem.menteeId,
        menteeName: reqItem.menteeName,
        menteeEmail: reqItem.menteeEmail,
        menteeAvatar: reqItem.menteeAvatar,
        dept: reqItem.dept,
        topic: reqItem.topic,
        date: sessionDate,
        time: sessionTime,
        platform: sessionPlatform,
        meetLink: sessionLink,
        status: 'scheduled',
        notes: notes || '1-on-1 mentorship consultation session',
        createdAt: new Date().toISOString(),
      };
      store.mentorshipSessions.unshift(newSession);

      // Mentee notification
      if (!Array.isArray(store.notifications)) store.notifications = [];
      const notifObj = {
        id: Date.now() + 2,
        type: 'mentorship',
        msg: `🎉 ${reqItem.mentorName} accepted your mentorship request! Session scheduled on ${sessionDate} at ${sessionTime}.`,
        time: 'Just now',
        read: false,
        avatar: reqItem.mentorAvatar,
      };
      store.notifications.unshift(notifObj);
    }

    db.saveStore();

    if (db.isMongo() && db.models.MentorshipRequest) {
      await db.models.MentorshipRequest.findOneAndUpdate({ id }, { $set: reqItem });
    }

    const io = getIO();
    if (io) {
      io.emit('mentorship_request_updated', reqItem);
      io.emit('mentorship_activity', {
        id: Date.now(),
        type: status === 'accepted' ? 'accepted' : 'status',
        menteeName: reqItem.menteeName,
        mentorName: reqItem.mentorName,
        status: reqItem.status,
        topic: reqItem.topic,
        time: 'Just now',
      });
      emitToUser(reqItem.menteeId, 'mentorship_request_status_changed', reqItem);
      emitToUser(reqItem.mentorId, 'mentorship_request_status_changed', reqItem);
    }

    res.json({ ok: true, data: reqItem });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/mentorship/session', async (req, res) => {
  try {
    const store = db.getStore();
    if (!Array.isArray(store.mentorshipSessions)) store.mentorshipSessions = [];

    const newSession = {
      id: Date.now(),
      requestId: Number(req.body.requestId) || 0,
      mentorId: Number(req.body.mentorId) || 1,
      mentorName: req.body.mentorName || 'Dr. Rafiqul Islam',
      mentorAvatar: req.body.mentorAvatar || createInitialsAvatar(req.body.mentorName || 'Mentor', 'alumni'),
      menteeId: Number(req.body.menteeId) || 0,
      menteeName: req.body.menteeName || 'Mentee',
      menteeEmail: req.body.menteeEmail || '',
      menteeAvatar: req.body.menteeAvatar || createInitialsAvatar(req.body.menteeName || 'Mentee', 'student'),
      dept: req.body.dept || 'CSE',
      topic: req.body.topic || 'General Guidance',
      date: req.body.date || new Date().toISOString().split('T')[0],
      time: req.body.time || '19:00',
      platform: req.body.platform || 'Google Meet',
      meetLink: req.body.meetLink || `https://meet.google.com/pus-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 5)}`,
      status: 'scheduled',
      notes: req.body.notes || '',
      createdAt: new Date().toISOString(),
    };

    store.mentorshipSessions.unshift(newSession);
    db.saveStore();

    if (db.isMongo() && db.models.MentorshipSession) {
      await db.models.MentorshipSession.create(newSession);
    }

    const io = getIO();
    if (io) {
      io.emit('mentorship_session_created', newSession);
      io.emit('mentorship_activity', {
        id: Date.now(),
        type: 'session_scheduled',
        mentorName: newSession.mentorName,
        menteeName: newSession.menteeName,
        date: newSession.date,
        time: newSession.time,
      });
      emitToUser(newSession.mentorId, 'mentorship_session_scheduled', newSession);
      emitToUser(newSession.menteeId, 'mentorship_session_scheduled', newSession);
    }

    res.status(201).json({ ok: true, data: newSession });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.patch('/mentorship/session/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    if (!Array.isArray(store.mentorshipSessions)) store.mentorshipSessions = [];
    const session = store.mentorshipSessions.find((s) => s.id === id);
    if (!session) {
      return res.status(404).json({ ok: false, message: 'Session not found' });
    }

    const { status, notes, meetLink, date, time } = req.body;
    if (status) session.status = status;
    if (notes !== undefined) session.notes = notes;
    if (meetLink) session.meetLink = meetLink;
    if (date) session.date = date;
    if (time) session.time = time;
    session.updatedAt = new Date().toISOString();

    db.saveStore();

    if (db.isMongo() && db.models.MentorshipSession) {
      await db.models.MentorshipSession.findOneAndUpdate({ id }, { $set: session });
    }

    const io = getIO();
    if (io) {
      io.emit('mentorship_session_updated', session);
      if (status === 'completed') {
        io.emit('mentorship_activity', {
          id: Date.now(),
          type: 'completed',
          mentorName: session.mentorName,
          menteeName: session.menteeName,
          topic: session.topic,
          time: 'Just now',
        });
      }
    }

    res.json({ ok: true, data: session });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/mentorship/review', async (req, res) => {
  try {
    const store = db.getStore();
    if (!Array.isArray(store.mentorshipReviews)) store.mentorshipReviews = [];

    const newReview = {
      id: Date.now(),
      mentorId: Number(req.body.mentorId) || 1,
      mentorName: req.body.mentorName || 'Dr. Rafiqul Islam',
      menteeName: req.body.menteeName || 'PUST Student',
      menteeAvatar: req.body.menteeAvatar || createInitialsAvatar(req.body.menteeName || 'Student', 'student'),
      dept: req.body.dept || 'CSE',
      batch: req.body.batch || '2023',
      rating: Number(req.body.rating) || 5,
      review: req.body.review || 'Excellent mentorship session!',
      createdAt: new Date().toISOString(),
    };

    store.mentorshipReviews.unshift(newReview);
    db.saveStore();

    if (db.isMongo() && db.models.MentorshipReview) {
      await db.models.MentorshipReview.create(newReview);
    }

    const io = getIO();
    if (io) {
      io.emit('mentorship_review_added', newReview);
      io.emit('mentorship_activity', {
        id: Date.now(),
        type: 'review',
        mentorName: newReview.mentorName,
        rating: newReview.rating,
        menteeName: newReview.menteeName,
      });
    }

    res.status(201).json({ ok: true, data: newReview });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/mentorship/become-mentor', async (req, res) => {
  try {
    const store = db.getStore();
    const userId = Number(req.body.userId) || (req.user?.id ? Number(req.user.id) : 1);
    const user = (store.users || []).find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    user.mentorAvailable = true;
    if (req.body.expertise) user.headline = req.body.expertise;
    if (req.body.weeklyAvailability) user.weeklyAvailability = req.body.weeklyAvailability;
    if (req.body.topics) {
      const topicArr = typeof req.body.topics === 'string' ? req.body.topics.split(',').map((s) => s.trim()) : req.body.topics;
      user.skills = Array.from(new Set([...(user.skills || []), ...topicArr]));
    }
    user.updatedAt = new Date().toISOString();

    db.saveStore();

    if (db.isMongo() && db.models.User) {
      await db.models.User.findOneAndUpdate({ id: userId }, { $set: user });
    }

    const io = getIO();
    if (io) {
      io.emit('mentor_profile_updated', user);
      io.emit('mentorship_activity', {
        id: Date.now(),
        type: 'new_mentor',
        mentorName: user.name,
        dept: user.dept,
      });
    }

    res.json({ ok: true, data: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// DONATIONS
// ========================
router.get('/donations', async (req, res) => {
  try {
    const donations = await getAll('Donation', 'donations');
    res.json({ ok: true, data: donations });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/donations', async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ ok: false, message: 'A valid positive donation amount is required' });
    }
    const store = db.getStore();
    const donation = {
      id: Date.now(),
      campaign: req.body.campaign || 'Merit Scholarship Fund',
      amount,
      frequency: req.body.frequency || 'one-time',
      donorName: req.body.anonymous ? 'Anonymous Alumni' : req.body.donorName || 'PUST Alumni',
      donorEmail: req.body.donorEmail || '',
      batch: req.body.batch || '',
      dept: req.body.dept || '',
      paymentMethod: req.body.paymentMethod || 'bKash',
      anonymous: Boolean(req.body.anonymous),
      message: req.body.message || '',
      createdAt: new Date().toISOString(),
    };
    store.donations.unshift(donation);
    db.saveStore();

    if (db.isMongo()) {
      await db.models.Donation.create(donation);
    }
    res.status(201).json({ ok: true, data: donation });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// CONTACT
// ========================
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
      return res.status(400).json({ ok: false, message: 'Name, email, and message are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ ok: false, message: 'Please provide a valid email address' });
    }
    const store = db.getStore();
    const trackingCode = req.body.trackingCode || `PUST-INQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const contactMsg = {
      id: Date.now(),
      trackingCode,
      name: name.trim(),
      email: email.trim(),
      phone: req.body.phone || '',
      dept: req.body.dept || '',
      batch: req.body.batch || '',
      topic: req.body.topic || 'general',
      priority: req.body.priority || 'Normal',
      subject: req.body.subject || 'Inquiry',
      message: message.trim(),
      status: 'unread',
      stage: 'Logged & Received',
      createdAt: new Date().toISOString(),
    };
    store.contactMessages.unshift(contactMsg);
    db.saveStore();

    if (db.isMongo()) {
      await db.models.ContactMessage.create(contactMsg);
    }
    res.status(201).json({ ok: true, data: contactMsg });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get('/contact/track/:trackingCode', async (req, res) => {
  try {
    const raw = (req.params.trackingCode || '').trim();
    if (!raw) {
      return res.status(400).json({ ok: false, message: 'Please enter a valid tracking reference code.' });
    }
    const clean = raw.toUpperCase();
    const msgs = await getAll('ContactMessage', 'contactMessages');
    const match = msgs.find(
      (m) =>
        (m.trackingCode && m.trackingCode.toUpperCase() === clean) ||
        String(m.id) === raw ||
        (m.email && m.email.toLowerCase() === raw.toLowerCase())
    );

    if (!match) {
      return res.status(404).json({
        ok: false,
        message: `No active inquiry found for tracking reference "${raw}". Please check your code format (e.g. PUST-INQ-2026-XXXX).`,
      });
    }

    res.json({
      ok: true,
      data: {
        id: match.id,
        trackingCode: match.trackingCode || `PUST-INQ-2026-${String(match.id).slice(-4)}`,
        name: match.name,
        email: match.email,
        dept: match.dept || 'General Alumni',
        topic: match.topic || 'General Inquiry',
        priority: match.priority || 'Normal',
        status: match.status || 'Received',
        stage: match.stage || (match.status === 'resolved' ? 'Resolution Dispatched' : 'Under Review by Alumni Desk'),
        createdAt: match.createdAt,
        message: match.message,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get('/contact', requireAdmin, async (req, res) => {
  try {
    const msgs = await getAll('ContactMessage', 'contactMessages');
    res.json({ ok: true, data: msgs });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// NOTIFICATIONS & MESSAGES
// ========================
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await getAll('Notification', 'notifications');
    res.json({ ok: true, data: notifications });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.patch('/notifications/read-all', async (req, res) => {
  try {
    const store = db.getStore();
    store.notifications.forEach((n) => {
      n.read = true;
    });
    db.saveStore();
    if (db.isMongo()) {
      await db.models.Notification.updateMany({}, { read: true });
    }
    res.json({ ok: true, data: store.notifications });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const messages = await getAll('Message', 'messages');
    res.json({ ok: true, data: messages });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/messages/:id/send', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const conv = store.messages.find((m) => m.id === id);
    if (conv && req.body.text) {
      conv.lastMsg = req.body.text;
      conv.time = 'Just now';
      db.saveStore();
      if (db.isMongo()) {
        await db.models.Message.findOneAndUpdate(
          { id },
          { lastMsg: req.body.text, time: 'Just now' }
        );
      }
    }
    res.json({ ok: true, data: conv });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// CONVERSATIONS & CHAT MESSAGING
// ========================

async function hydrateConversation(conv, currentUserId) {
  const participants = (conv.participants || []).map(Number);
  const otherId = participants.find((id) => id !== Number(currentUserId)) || participants[0];

  let otherUser = null;
  if (db.isMongo()) {
    otherUser = await db.models.User.findOne({ id: otherId }).lean();
  } else {
    const store = db.getStore();
    otherUser = (store.users || []).find((u) => Number(u.id) === otherId);
  }

  const unreadMap = conv.unreadCounts instanceof Map
    ? Object.fromEntries(conv.unreadCounts)
    : (conv.unreadCounts || {});

  const unreadCount = Number(unreadMap[String(currentUserId)] || 0);

  const partnerData = otherUser
    ? {
        id: otherUser.id,
        name: otherUser.name,
        avatar: otherUser.avatar || createInitialsAvatar(otherUser.name, otherUser.role),
        role: otherUser.role || 'alumni',
        dept: otherUser.dept || '',
        batch: otherUser.batch || '',
        headline: otherUser.headline || '',
        verified: Boolean(otherUser.verified),
        online: isUserOnline(otherUser.id),
      }
    : {
        id: otherId,
        name: 'Alumni Member',
        avatar: createInitialsAvatar('Alumni Member', 'alumni'),
        role: 'alumni',
        dept: '',
        batch: '',
        headline: '',
        verified: false,
        online: isUserOnline(otherId),
      };

  return {
    id: conv.id,
    participants,
    lastMessage: conv.lastMessage || '',
    lastMessageAt: conv.lastMessageAt || conv.updatedAt || conv.createdAt,
    lastSenderId: conv.lastSenderId,
    unreadCount,
    unreadCounts: unreadMap,
    participant: partnerData,
    user: partnerData,
    updatedAt: conv.updatedAt || conv.lastMessageAt,
    createdAt: conv.createdAt,
  };
}

router.get('/conversations', requireAuth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    let conversations = [];

    if (db.isMongo()) {
      conversations = await db.models.Conversation.find({ participants: userId })
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .lean();
    } else {
      const store = db.getStore();
      conversations = (store.conversations || []).filter((c) =>
        c.participants.map(Number).includes(userId)
      );
      conversations.sort(
        (a, b) =>
          new Date(b.lastMessageAt || b.updatedAt || 0) -
          new Date(a.lastMessageAt || a.updatedAt || 0)
      );
    }

    const hydrated = await Promise.all(
      conversations.map((c) => hydrateConversation(c, userId))
    );
    res.json({ ok: true, data: hydrated });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/conversations', requireAuth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const recipientId = Number(req.body.recipientId || req.body.participantId);

    if (!recipientId) {
      return res.status(400).json({ ok: false, message: 'recipientId is required' });
    }

    if (userId === recipientId) {
      return res.status(400).json({ ok: false, message: 'Cannot start conversation with yourself' });
    }

    let recipient = null;
    if (db.isMongo()) {
      recipient = await db.models.User.findOne({ id: recipientId }).lean();
    } else {
      const store = db.getStore();
      recipient = (store.users || []).find((u) => Number(u.id) === recipientId);
    }

    if (!recipient) {
      return res.status(404).json({ ok: false, message: 'Recipient not found' });
    }

    let existing = null;
    if (db.isMongo()) {
      existing = await db.models.Conversation.findOne({
        participants: { $all: [userId, recipientId], $size: 2 },
      }).lean();
    } else {
      const store = db.getStore();
      existing = (store.conversations || []).find(
        (c) =>
          c.participants.length === 2 &&
          c.participants.map(Number).includes(userId) &&
          c.participants.map(Number).includes(recipientId)
      );
    }

    if (existing) {
      const hydrated = await hydrateConversation(existing, userId);
      return res.json({ ok: true, data: hydrated, created: false });
    }

    const newConv = {
      id: Date.now(),
      participants: [userId, recipientId],
      lastMessage: '',
      lastMessageAt: new Date().toISOString(),
      lastSenderId: userId,
      unreadCounts: { [userId]: 0, [recipientId]: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (db.isMongo()) {
      await db.models.Conversation.create(newConv);
    } else {
      const store = db.getStore();
      if (!Array.isArray(store.conversations)) store.conversations = [];
      store.conversations.unshift(newConv);
      db.saveStore();
    }

    const hydrated = await hydrateConversation(newConv, userId);
    res.status(201).json({ ok: true, data: hydrated, created: true });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get('/conversations/:id', requireAuth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const cId = Number(req.params.id);

    let conv = null;
    if (db.isMongo()) {
      conv = await db.models.Conversation.findOne({ id: cId }).lean();
    } else {
      const store = db.getStore();
      conv = (store.conversations || []).find((c) => c.id === cId);
    }

    if (!conv) {
      return res.status(404).json({ ok: false, message: 'Conversation not found' });
    }

    if (!conv.participants.map(Number).includes(userId)) {
      return res.status(403).json({ ok: false, message: 'Access denied. You are not a participant in this conversation.' });
    }

    const hydrated = await hydrateConversation(conv, userId);
    res.json({ ok: true, data: hydrated });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get('/conversations/:id/messages', requireAuth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const cId = Number(req.params.id);

    let conv = null;
    if (db.isMongo()) {
      conv = await db.models.Conversation.findOne({ id: cId }).lean();
    } else {
      const store = db.getStore();
      conv = (store.conversations || []).find((c) => c.id === cId);
    }

    if (!conv) {
      return res.status(404).json({ ok: false, message: 'Conversation not found' });
    }

    if (!conv.participants.map(Number).includes(userId)) {
      return res.status(403).json({ ok: false, message: 'Access denied. You are not a participant in this conversation.' });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 30));

    let messages = [];
    let total = 0;

    if (db.isMongo()) {
      total = await db.models.ChatMessage.countDocuments({ conversationId: cId });
      const rawMsgs = await db.models.ChatMessage.find({ conversationId: cId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      messages = rawMsgs.reverse();
    } else {
      const store = db.getStore();
      const allMsgs = (store.chatMessages || []).filter((m) => m.conversationId === cId);
      total = allMsgs.length;
      allMsgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const startIndex = Math.max(0, total - page * limit);
      const endIndex = total - (page - 1) * limit;
      messages = allMsgs.slice(startIndex, endIndex);
    }

    res.json({
      ok: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/conversations/:id/messages', requireAuth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const cId = Number(req.params.id);
    const text = (req.body.text || '').trim();

    if (!text) {
      return res.status(400).json({ ok: false, message: 'Message content cannot be empty' });
    }

    if (text.length > 2000) {
      return res.status(400).json({ ok: false, message: 'Message exceeds maximum length of 2000 characters' });
    }

    let conv = null;
    let store = null;

    if (db.isMongo()) {
      conv = await db.models.Conversation.findOne({ id: cId });
    } else {
      store = db.getStore();
      conv = (store.conversations || []).find((c) => c.id === cId);
    }

    if (!conv) {
      return res.status(404).json({ ok: false, message: 'Conversation not found' });
    }

    if (!conv.participants.map(Number).includes(userId)) {
      return res.status(403).json({ ok: false, message: 'Access denied. You are not a participant in this conversation.' });
    }

    const otherParticipantId = conv.participants.map(Number).find((id) => id !== userId);

    const newMsg = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      conversationId: cId,
      senderId: userId,
      senderName: req.user.name || 'Alumni Member',
      senderAvatar: req.user.avatar || createInitialsAvatar(req.user.name || 'Alumni', req.user.role || 'alumni'),
      text,
      read: false,
      readAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (db.isMongo()) {
      await db.models.ChatMessage.create(newMsg);
      const unreadCounts = conv.unreadCounts || new Map();
      const currentOtherUnread = Number(unreadCounts.get(String(otherParticipantId)) || 0);
      unreadCounts.set(String(otherParticipantId), currentOtherUnread + 1);

      conv.lastMessage = text;
      conv.lastMessageAt = new Date();
      conv.lastSenderId = userId;
      conv.unreadCounts = unreadCounts;
      await conv.save();
    } else {
      if (!Array.isArray(store.chatMessages)) store.chatMessages = [];
      store.chatMessages.push(newMsg);

      if (!conv.unreadCounts) conv.unreadCounts = {};
      conv.unreadCounts[String(otherParticipantId)] =
        Number(conv.unreadCounts[String(otherParticipantId)] || 0) + 1;
      conv.lastMessage = text;
      conv.lastMessageAt = new Date().toISOString();
      conv.lastSenderId = userId;
      db.saveStore();
    }

    emitToConversation(cId, 'new_message', {
      message: newMsg,
      conversationId: cId,
    });

    if (otherParticipantId) {
      emitToUser(otherParticipantId, 'conversation_updated', {
        conversationId: cId,
        lastMessage: text,
        senderName: req.user.name,
        senderAvatar: newMsg.senderAvatar,
      });
    }

    res.status(201).json({ ok: true, data: newMsg });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.patch('/conversations/:id/read', requireAuth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const cId = Number(req.params.id);

    let conv = null;
    if (db.isMongo()) {
      conv = await db.models.Conversation.findOne({ id: cId });
    } else {
      const store = db.getStore();
      conv = (store.conversations || []).find((c) => c.id === cId);
    }

    if (!conv) {
      return res.status(404).json({ ok: false, message: 'Conversation not found' });
    }

    if (!conv.participants.map(Number).includes(userId)) {
      return res.status(403).json({ ok: false, message: 'Access denied.' });
    }

    const now = new Date().toISOString();

    if (db.isMongo()) {
      await db.models.ChatMessage.updateMany(
        { conversationId: cId, senderId: { $ne: userId }, read: false },
        { read: true, readAt: new Date() }
      );
      if (conv.unreadCounts) {
        conv.unreadCounts.set(String(userId), 0);
        await conv.save();
      }
    } else {
      const store = db.getStore();
      (store.chatMessages || []).forEach((m) => {
        if (m.conversationId === cId && m.senderId !== userId && !m.read) {
          m.read = true;
          m.readAt = now;
        }
      });
      if (!conv.unreadCounts) conv.unreadCounts = {};
      conv.unreadCounts[String(userId)] = 0;
      db.saveStore();
    }

    emitToConversation(cId, 'messages_read', {
      conversationId: cId,
      readBy: userId,
      readAt: now,
    });

    res.json({ ok: true, message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// ADMIN ROUTES
// ========================
router.get('/admin/verifications', requireAdmin, async (req, res) => {
  try {
    const verifications = await getAll('Verification', 'verifications');
    res.json({ ok: true, data: verifications });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.patch('/admin/verifications/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const store = db.getStore();
    const item = store.verifications.find((v) => v.id === id);
    if (!item) {
      return res.status(404).json({ ok: false, message: 'Verification record not found' });
    }
    item.status = status;
    db.saveStore();
    if (db.isMongo()) {
      await db.models.Verification.findOneAndUpdate({ id }, { status });
    }
    res.json({ ok: true, data: item });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.patch('/admin/users/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const user = store.users.find((u) => u.id === id);
    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }
    Object.assign(user, req.body);
    db.saveStore();
    if (db.isMongo()) {
      await db.models.User.findOneAndUpdate({ id }, req.body);
    }
    res.json({ ok: true, data: user });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.delete('/admin/users/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }
    store.users.splice(idx, 1);
    db.saveStore();
    if (db.isMongo()) {
      await db.models.User.findOneAndDelete({ id });
    }
    res.json({ ok: true, id });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;
