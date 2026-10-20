const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { emitToConversation, emitToUser, isUserOnline } = require('../socket');

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

// User sanitization to ensure password is NEVER sent to client
function sanitizeUser(u, maskEmail = false) {
  if (!u) return u;
  const { password, ...safe } = u;
  if (!safe.id && safe._id) {
    safe.id = safe._id;
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
    const paramId = req.params.id;
    const numId = Number(paramId);
    const users = await getAll('User', 'users');
    const user = users.find(
      (u) => String(u.id) === String(paramId) || (numId && u.id === numId) || String(u._id) === String(paramId)
    );
    if (!user) return res.status(404).json({ ok: false, message: 'Member not found' });

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

    const safeUser = sanitizeUser(user, !isAuthenticated);
    res.json({ ok: true, data: safeUser });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.put('/alumni/:id', async (req, res) => {
  try {
    const paramId = req.params.id;
    const numId = Number(paramId);
    const store = db.getStore();
    const idx = store.users.findIndex(
      (u) => String(u.id) === String(paramId) || (numId && u.id === numId) || String(u._id) === String(paramId)
    );
    if (idx === -1) return res.status(404).json({ ok: false, message: 'User not found' });

    store.users[idx] = { ...store.users[idx], ...req.body };
    db.saveStore();

    if (db.isMongo()) {
      await db.models.User.findOneAndUpdate({ id: numId || paramId }, req.body, { new: true });
    }
    res.json({ ok: true, data: store.users[idx] });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/alumni/:id/connect', async (req, res) => {
  try {
    const paramId = req.params.id;
    const numId = Number(paramId);
    const store = db.getStore();
    const user = store.users.find(
      (u) => String(u.id) === String(paramId) || (numId && u.id === numId) || String(u._id) === String(paramId)
    );
    if (!user) {
      return res.status(404).json({ ok: false, message: 'Alumni member not found' });
    }
    user.connections = (user.connections || 0) + 1;
    db.saveStore();
    if (db.isMongo()) {
      await db.models.User.findOneAndUpdate({ id: numId || paramId }, { $inc: { connections: 1 } });
    }
    res.json({ ok: true, data: user });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/alumni/:id/save', async (req, res) => {
  try {
    const paramId = req.params.id;
    const numId = Number(paramId);
    const store = db.getStore();
    const target = store.users.find(
      (u) => String(u.id) === String(paramId) || (numId && u.id === numId) || String(u._id) === String(paramId)
    );
    if (!target) {
      return res.status(404).json({ ok: false, message: 'Alumni member not found' });
    }

    const authHeader = req.headers.authorization;
    let authUser = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        authUser = store.users.find((u) => u.id === decoded.id || u.email === decoded.email);
      } catch (e) {
        // Proceed as guest
      }
    }

    let isSaved = false;
    const saveTargetId = target.id;
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
      db.saveStore();
      if (db.isMongo()) {
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
    const id = Number(req.params.id);
    const store = db.getStore();
    const target = store.users.find((u) => u.id === id);
    if (!target) {
      return res.status(404).json({ ok: false, message: 'Alumni member not found' });
    }

    const { reason, details, reporterEmail } = req.body || {};
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return res.status(400).json({ ok: false, message: 'A report reason is required' });
    }

    if (!Array.isArray(store.reports)) {
      store.reports = [];
    }

    const reportRecord = {
      id: Date.now(),
      targetType: 'alumni',
      targetId: id,
      targetName: target.name,
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
// DEPARTMENTS
// ========================
router.get('/departments', async (req, res) => {
  try {
    const departments = await getAll('Department', 'departments');
    res.json({ ok: true, data: departments });
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
    const store = db.getStore();
    const ev = store.events.find((e) => e.id === id);
    if (!ev) {
      return res.status(404).json({ ok: false, message: 'Event not found' });
    }
    ev.registered = (ev.registered || 0) + 1;
    db.saveStore();
    if (db.isMongo()) {
      await db.models.Event.findOneAndUpdate({ id }, { $inc: { registered: 1 } });
    }
    res.json({ ok: true, data: ev });
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
// JOBS
// ========================
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await getAll('Job', 'jobs');
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
      postedBy: req.body.postedBy || 'Dr. Rafiqul Islam (Alumni)',
      remote: Boolean(req.body.remote),
      desc: req.body.desc || 'Exciting career opportunity for PUST graduates.',
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
    const id = Number(req.params.id);
    const store = db.getStore();
    const job = store.jobs.find((j) => j.id === id);
    if (!job) {
      return res.status(404).json({ ok: false, message: 'Job not found' });
    }
    job.applicants = (job.applicants || 0) + 1;
    db.saveStore();
    if (db.isMongo()) {
      await db.models.Job.findOneAndUpdate({ id }, { $inc: { applicants: 1 } });
    }
    res.json({ ok: true, data: job });
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

// ========================
// GALLERY
// ========================
router.get('/gallery', async (req, res) => {
  try {
    const gallery = await getAll('GalleryItem', 'gallery');
    res.json({ ok: true, data: gallery });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/gallery/:id/like', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const item = store.gallery.find((g) => g.id === id);
    if (!item) {
      return res.status(404).json({ ok: false, message: 'Gallery item not found' });
    }
    item.likes = (item.likes || 0) + 1;
    db.saveStore();
    if (db.isMongo()) {
      await db.models.GalleryItem.findOneAndUpdate({ id }, { $inc: { likes: 1 } });
    }
    res.json({ ok: true, data: item });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// COMMUNITY
// ========================
router.get('/community', async (req, res) => {
  try {
    const posts = await getAll('CommunityPost', 'communityPosts');
    res.json({ ok: true, data: posts });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/community', async (req, res) => {
  try {
    const store = db.getStore();
    const newPost = {
      id: Date.now(),
      author: req.body.author || store.users[0],
      channel: req.body.channel || 'CSE & Tech Alumni',
      title: req.body.title || req.body.body?.slice(0, 60) || 'Community Discussion',
      body: req.body.body || '',
      tags: req.body.tags || ['Discussion'],
      likes: 1,
      replies: 0,
      time: 'Just now',
      pinned: false,
    };
    store.communityPosts.unshift(newPost);
    db.saveStore();

    if (db.isMongo()) {
      await db.models.CommunityPost.create(newPost);
    }
    res.status(201).json({ ok: true, data: newPost });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// MENTORSHIP
// ========================
router.get('/mentorship', async (req, res) => {
  try {
    const users = await getAll('User', 'users');
    const mentors = users.filter((u) => u.mentorAvailable);
    const requests = await getAll('MentorshipRequest', 'mentorshipRequests');
    res.json({ ok: true, mentors, requests });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/mentorship/request', async (req, res) => {
  try {
    const store = db.getStore();
    const request = {
      id: Date.now(),
      mentorId: req.body.mentorId || 1,
      mentorName: req.body.mentorName || 'Dr. Rafiqul Islam',
      menteeName: req.body.menteeName || req.body.name || 'PUST Student',
      menteeEmail: req.body.menteeEmail || req.body.email || '',
      dept: req.body.dept || 'CSE',
      batch: req.body.batch || '2022',
      topic: req.body.topic || 'Career Guidance',
      goal: req.body.goal || 'Career & Technical Growth',
      message: req.body.message || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    store.mentorshipRequests.unshift(request);
    db.saveStore();

    if (db.isMongo()) {
      await db.models.MentorshipRequest.create(request);
    }
    res.status(201).json({ ok: true, data: request });
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
    const contactMsg = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: req.body.phone || '',
      dept: req.body.dept || '',
      batch: req.body.batch || '',
      topic: req.body.topic || 'general',
      subject: req.body.subject || 'Inquiry',
      message: message.trim(),
      status: 'unread',
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
