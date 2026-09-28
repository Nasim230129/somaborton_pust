const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pust_somaborton_alumni_network_secret_key_2026';

// Helper to get collection items (MongoDB or JSON store)
async function getAll(modelName, storeKey) {
  if (db.isMongo() && db.models[modelName]) {
    return await db.models[modelName].find({}).lean();
  }
  return db.getStore()[storeKey] || [];
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
    const users = await getAll('User', 'users');
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
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const users = await getAll('User', 'users');
    let user = users.find(
      (u) => u.email && email && u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      // Fallback to first matching role or primary alumni profile for demo convenience
      user =
        users.find((u) => role && u.role === role) ||
        users[0] || {
          id: 1,
          name: 'Dr. Rafiqul Islam',
          email: email || 'rafiq@example.com',
          role: role || 'alumni',
        };
    }

    if (user.password && password) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ ok: false, message: 'Invalid credentials' });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;
    res.json({ ok: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/auth/register', async (req, res) => {
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

    if (!name || !email) {
      return res.status(400).json({ ok: false, message: 'Name and email are required' });
    }

    const store = db.getStore();
    const existing = store.users.find(
      (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return res.status(400).json({ ok: false, message: 'Email already registered' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      role,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
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

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ ok: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ========================
// ALUMNI & USERS DIRECTORY
// ========================
router.get('/alumni', async (req, res) => {
  try {
    const { role, dept, batch, search, mentor } = req.query;
    let users = await getAll('User', 'users');

    if (role && role !== 'All') {
      const r = role.toLowerCase().replace(/s$/, '');
      users = users.filter((u) => u.role && u.role.toLowerCase().startsWith(r));
    }
    if (dept && dept !== 'All') {
      users = users.filter((u) => u.dept === dept);
    }
    if (batch && batch !== 'All') {
      users = users.filter((u) => u.batch === batch);
    }
    if (mentor === 'true') {
      users = users.filter((u) => u.mentorAvailable);
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.dept && u.dept.toLowerCase().includes(q)) ||
          (u.company && u.company.toLowerCase().includes(q)) ||
          (u.headline && u.headline.toLowerCase().includes(q))
      );
    }
    res.json({ ok: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get('/alumni/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const users = await getAll('User', 'users');
    const user = users.find((u) => u.id === id);
    if (!user) return res.status(404).json({ ok: false, message: 'Member not found' });
    res.json({ ok: true, data: user });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.put('/alumni/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx === -1) return res.status(404).json({ ok: false, message: 'User not found' });

    store.users[idx] = { ...store.users[idx], ...req.body };
    db.saveStore();

    if (db.isMongo()) {
      await db.models.User.findOneAndUpdate({ id }, req.body, { new: true });
    }
    res.json({ ok: true, data: store.users[idx] });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post('/alumni/:id/connect', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const user = store.users.find((u) => u.id === id);
    if (user) {
      user.connections = (user.connections || 0) + 1;
      db.saveStore();
      if (db.isMongo()) {
        await db.models.User.findOneAndUpdate({ id }, { $inc: { connections: 1 } });
      }
    }
    res.json({ ok: true, data: user });
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
    const store = db.getStore();
    const newEvent = {
      id: Date.now(),
      title: req.body.title || 'New PUST Alumni Event',
      date: req.body.date || 'Dec 15, 2026',
      time: req.body.time || '10:00 AM',
      location: req.body.location || 'PUST Main Auditorium',
      type: req.body.type || 'Reunion',
      online: Boolean(req.body.online),
      spots: Number(req.body.spots) || 500,
      registered: 1,
      img:
        req.body.img ||
        'https://images.unsplash.com/photo-1675716921224-e087a0cca69a?w=600&h=380&fit=crop&auto=format',
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
    if (ev) {
      ev.registered = (ev.registered || 0) + 1;
      db.saveStore();
      if (db.isMongo()) {
        await db.models.Event.findOneAndUpdate({ id }, { $inc: { registered: 1 } });
      }
    }
    res.json({ ok: true, data: ev || { id, registered: 1 } });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    store.events = store.events.filter((e) => e.id !== id);
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
    const store = db.getStore();
    const newJob = {
      id: Date.now(),
      title: req.body.title || 'Software Engineer',
      company: req.body.company || 'Partner Tech Company',
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
    if (job) {
      job.applicants = (job.applicants || 0) + 1;
      db.saveStore();
      if (db.isMongo()) {
        await db.models.Job.findOneAndUpdate({ id }, { $inc: { applicants: 1 } });
      }
    }
    res.json({ ok: true, data: job || { id } });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.patch('/jobs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const job = store.jobs.find((j) => j.id === id);
    if (job) {
      Object.assign(job, req.body);
      db.saveStore();
      if (db.isMongo()) {
        await db.models.Job.findOneAndUpdate({ id }, req.body);
      }
    }
    res.json({ ok: true, data: job });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.delete('/jobs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    store.jobs = store.jobs.filter((j) => j.id !== id);
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
        'https://images.unsplash.com/photo-1529148482759-b35b25c5f217?w=600&h=380&fit=crop&auto=format',
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
    if (item) {
      item.likes = (item.likes || 0) + 1;
      db.saveStore();
      if (db.isMongo()) {
        await db.models.GalleryItem.findOneAndUpdate({ id }, { $inc: { likes: 1 } });
      }
    }
    res.json({ ok: true, data: item || { id } });
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
    const store = db.getStore();
    const donation = {
      id: Date.now(),
      campaign: req.body.campaign || 'Merit Scholarship Fund',
      amount: Number(req.body.amount) || 5000,
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
    const store = db.getStore();
    const contactMsg = {
      id: Date.now(),
      name: req.body.name || 'Visitor',
      email: req.body.email || '',
      phone: req.body.phone || '',
      dept: req.body.dept || '',
      batch: req.body.batch || '',
      topic: req.body.topic || 'general',
      subject: req.body.subject || 'Inquiry',
      message: req.body.message || '',
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

router.get('/contact', async (req, res) => {
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
// ADMIN ROUTES
// ========================
router.get('/admin/verifications', async (req, res) => {
  try {
    const verifications = await getAll('Verification', 'verifications');
    res.json({ ok: true, data: verifications });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.patch('/admin/verifications/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const store = db.getStore();
    const item = store.verifications.find((v) => v.id === id);
    if (item) {
      item.status = status;
      db.saveStore();
      if (db.isMongo()) {
        await db.models.Verification.findOneAndUpdate({ id }, { status });
      }
    }
    res.json({ ok: true, data: item });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.patch('/admin/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    const user = store.users.find((u) => u.id === id);
    if (user) {
      Object.assign(user, req.body);
      db.saveStore();
      if (db.isMongo()) {
        await db.models.User.findOneAndUpdate({ id }, req.body);
      }
    }
    res.json({ ok: true, data: user });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.delete('/admin/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const store = db.getStore();
    store.users = store.users.filter((u) => u.id !== id);
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
