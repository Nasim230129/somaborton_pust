const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    password: { type: String },
    role: {
      type: String,
      enum: ['alumni', 'student', 'faculty', 'employer', 'admin'],
      default: 'alumni',
    },
    avatar: { type: String, default: '' },
    dept: { type: String, default: '' },
    batch: { type: String, default: '' },
    location: { type: String, default: 'Pabna, Bangladesh' },
    headline: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    skills: [{ type: String }],
    company: { type: String, default: '' },
    mentorAvailable: { type: Boolean, default: false },
    industry: { type: String, default: '' },
    connections: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    status: { type: String, default: 'active' },
    joined: { type: String, default: '2026' },
  },
  { timestamps: true }
);

const DepartmentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    alumni: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    hod: { type: String, default: '' },
    established: { type: Number, default: 2008 },
    icon: { type: String, default: '🎓' },
    faculty: { type: String, default: '' },
  },
  { timestamps: true }
);

const EventSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, default: '10:00 AM' },
    location: { type: String, required: true },
    type: { type: String, default: 'Reunion' },
    online: { type: Boolean, default: false },
    spots: { type: Number, default: 500 },
    registered: { type: Number, default: 0 },
    img: { type: String, default: '' },
    desc: { type: String, default: '' },
    organizer: { type: String, default: 'PUST Alumni Association' },
    status: { type: String, default: 'upcoming' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const JobSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    logo: { type: String, default: '🏢' },
    location: { type: String, default: 'Dhaka, Bangladesh' },
    type: { type: String, default: 'Full-time' },
    salary: { type: String, default: 'Negotiable' },
    dept: { type: String, default: 'CSE' },
    posted: { type: String, default: 'Just now' },
    deadline: { type: String, default: 'Dec 31, 2026' },
    skills: [{ type: String }],
    applicants: { type: Number, default: 0 },
    postedBy: { type: String, default: 'PUST Alumni' },
    remote: { type: Boolean, default: false },
    desc: { type: String, default: '' },
    status: { type: String, default: 'approved' },
  },
  { timestamps: true }
);

const StorySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.Mixed, required: true },
    category: { type: String, default: 'Career Journey' },
    date: { type: String, default: 'Sept 2026' },
    readTime: { type: String, default: '5 min' },
    img: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GalleryItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    url: { type: String, required: true },
    thumb: { type: String, required: true },
    category: { type: String, default: 'Campus Life' },
    title: { type: String, required: true },
    year: { type: mongoose.Schema.Types.Mixed, default: 2026 },
    likes: { type: Number, default: 0 },
    stakeholder: { type: String, default: 'alumni' },
  },
  { timestamps: true }
);

const CommunityPostSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    author: { type: mongoose.Schema.Types.Mixed },
    channel: { type: String, default: 'General' },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    time: { type: String, default: 'Just now' },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MentorshipRequestSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    mentorId: { type: Number },
    mentorName: { type: String },
    menteeName: { type: String, required: true },
    menteeEmail: { type: String },
    dept: { type: String },
    batch: { type: String },
    topic: { type: String },
    goal: { type: String },
    message: { type: String },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

const DonationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    campaign: { type: String, required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, default: 'one-time' },
    donorName: { type: String, default: 'Anonymous Alumni' },
    donorEmail: { type: String, default: '' },
    batch: { type: String, default: '' },
    dept: { type: String, default: '' },
    paymentMethod: { type: String, default: 'bKash' },
    anonymous: { type: Boolean, default: false },
    message: { type: String, default: '' },
  },
  { timestamps: true }
);

const ContactMessageSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    dept: { type: String, default: '' },
    batch: { type: String, default: '' },
    topic: { type: String, default: 'general' },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, default: 'unread' },
  },
  { timestamps: true }
);

const NotificationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    type: { type: String, default: 'general' },
    msg: { type: String, required: true },
    time: { type: String, default: 'Just now' },
    read: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

const MessageSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    user: { type: mongoose.Schema.Types.Mixed, required: true },
    lastMsg: { type: String, default: '' },
    time: { type: String, default: 'Just now' },
    unread: { type: Number, default: 0 },
    online: { type: Boolean, default: false },
    thread: [{ from: String, text: String, time: String }],
  },
  { timestamps: true }
);

const VerificationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    dept: { type: String, required: true },
    batch: { type: String, required: true },
    avatar: { type: String, default: '' },
    submitted: { type: String, default: 'Just now' },
    docs: [{ type: String }],
    note: { type: String, default: '' },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.models.User || mongoose.model('User', UserSchema),
  Department: mongoose.models.Department || mongoose.model('Department', DepartmentSchema),
  Event: mongoose.models.Event || mongoose.model('Event', EventSchema),
  Job: mongoose.models.Job || mongoose.model('Job', JobSchema),
  Story: mongoose.models.Story || mongoose.model('Story', StorySchema),
  GalleryItem: mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema),
  CommunityPost: mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema),
  MentorshipRequest: mongoose.models.MentorshipRequest || mongoose.model('MentorshipRequest', MentorshipRequestSchema),
  Donation: mongoose.models.Donation || mongoose.model('Donation', DonationSchema),
  ContactMessage: mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema),
  Notification: mongoose.models.Notification || mongoose.model('Notification', NotificationSchema),
  Message: mongoose.models.Message || mongoose.model('Message', MessageSchema),
  Verification: mongoose.models.Verification || mongoose.model('Verification', VerificationSchema),
};
