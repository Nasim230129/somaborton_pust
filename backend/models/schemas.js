const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: { type: Number, default: () => Date.now() },
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
    experience: [
      {
        title: { type: String },
        company: { type: String },
        period: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        year: { type: String },
      },
    ],
    socialLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    savedProfiles: [{ type: Number }],
  },
  { timestamps: true }
);

const DepartmentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    slug: { type: String, default: '' },
    facultyId: { type: Number, default: 1 },
    alumni: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    hod: { type: String, default: '' },
    established: { type: Number, default: 2008 },
    icon: { type: String, default: '🎓' },
    coverImage: { type: String, default: '' },
    faculty: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
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

const FacultySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    shortName: { type: String, default: '' },
    bengali: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: '🏛️' },
    coverImage: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BatchSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    batchNumber: { type: Number, required: true },
    label: { type: String, required: true }, // e.g. "Batch 1", "Batch 18"
    session: { type: String, default: '' }, // e.g. "2008-2009", "2025-2026"
    admissionYear: { type: Number },
    graduationYear: { type: Number },
    departmentId: { type: Number, required: true },
    deptCode: { type: String, default: '' },
    status: { type: String, enum: ['active', 'graduated', 'archived'], default: 'graduated' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
BatchSchema.index({ departmentId: 1, batchNumber: 1 });

const GalleryAccessRequestSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    userId: { type: Number, required: true },
    userName: { type: String, default: '' },
    userEmail: { type: String, default: '' },
    departmentId: { type: Number, required: true },
    deptCode: { type: String, default: '' },
    batchId: { type: Number },
    batchLabel: { type: String, default: '' },
    requestedRole: { type: String, enum: ['member', 'moderator'], default: 'member' },
    reason: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: Number },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

const GalleryItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    url: { type: String, required: true },
    thumb: { type: String, required: true },
    mediaType: { type: String, enum: ['photo', 'video', 'IMAGE', 'VIDEO'], default: 'photo' },
    category: {
      type: String,
      enum: ['Reunion', 'Campus Life', 'Cultural Program', 'Sports', 'Convocation', 'Department Event', 'Research', 'Department Lab', 'Batch Day', 'Other'],
      default: 'Campus Life',
    },
    title: { type: String, required: true },
    caption: { type: String, default: '' },
    description: { type: String, default: '' },
    facultyId: { type: Number, default: 1 },
    faculty: { type: String, default: 'Engineering & Technology' },
    departmentId: { type: Number, default: 1 },
    dept: { type: String, default: 'Computer Science & Engineering' },
    deptCode: { type: String, default: 'CSE' },
    batchId: { type: Number },
    batch: { type: String, default: 'Batch 1' },
    batchLabel: { type: String, default: 'Batch 1' },
    year: { type: mongoose.Schema.Types.Mixed, default: 2026 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    stakeholder: { type: String, default: 'alumni' },
    moderationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'archived'],
      default: 'approved',
    },
    rejectionReason: { type: String, default: '' },
    approvedBy: { type: Number },
    approvedAt: { type: Date },
    ownerId: { type: Number },
    uploader: {
      id: { type: Number },
      name: { type: String, default: 'PUSTian' },
      role: { type: String, default: 'alumni' },
      dept: { type: String, default: 'CSE' },
      avatar: { type: String, default: '' },
    },
    comments: [
      {
        id: { type: Number, default: () => Date.now() },
        userName: { type: String, default: 'PUSTian' },
        userRole: { type: String, default: 'alumni' },
        dept: { type: String, default: '' },
        avatar: { type: String, default: '' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
GalleryItemSchema.index({ departmentId: 1, batchId: 1, moderationStatus: 1 });

const CommunityPostSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    author: { type: mongoose.Schema.Types.Mixed },
    channel: { type: String, default: 'General' },
    communityId: { type: Number, default: 1 },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    tags: [{ type: String }],
    type: { type: String, default: 'post' }, // post, announcement, question, poll
    poll: { type: mongoose.Schema.Types.Mixed, default: null },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    replies: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    commentList: [{ type: mongoose.Schema.Types.Mixed }],
    time: { type: String, default: 'Just now' },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CommunityGroupSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String },
    desc: { type: String, required: true },
    icon: { type: String, default: '🌐' },
    category: { type: String, default: 'Technology' },
    dept: { type: String, default: 'All' },
    tags: [{ type: String }],
    membersCount: { type: Number, default: 1 },
    postsCount: { type: Number, default: 0 },
    onlineCount: { type: Number, default: 1 },
    creator: { type: mongoose.Schema.Types.Mixed },
    privacy: { type: String, default: 'Public' },
    memberIds: [{ type: Number }],
    img: { type: String, default: '' },
  },
  { timestamps: true }
);

const CommunityChatSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    communityId: { type: Number, required: true, index: true },
    sender: { type: mongoose.Schema.Types.Mixed, required: true },
    text: { type: String, required: true },
    time: { type: String, default: 'Just now' },
  },
  { timestamps: true }
);
CommunityChatSchema.index({ communityId: 1, createdAt: 1 });

const CommunityResourceSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    communityId: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, default: 'General' },
    description: { type: String, default: '' },
    uploader: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);
CommunityResourceSchema.index({ communityId: 1 });

const MentorshipRequestSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    mentorId: { type: Number },
    mentorName: { type: String },
    mentorAvatar: { type: String, default: '' },
    menteeId: { type: Number, default: 0 },
    menteeName: { type: String, required: true },
    menteeEmail: { type: String },
    menteeAvatar: { type: String, default: '' },
    dept: { type: String },
    batch: { type: String },
    topic: { type: String },
    goal: { type: String },
    message: { type: String },
    preferredDate: { type: String, default: '' },
    preferredTime: { type: String, default: '' },
    preferredPlatform: { type: String, default: 'Google Meet' },
    scheduleDate: { type: String, default: '' },
    scheduleTime: { type: String, default: '' },
    platform: { type: String, default: 'Google Meet' },
    meetLink: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

const MentorshipSessionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    requestId: { type: Number, default: 0 },
    mentorId: { type: Number, required: true },
    mentorName: { type: String, required: true },
    mentorAvatar: { type: String, default: '' },
    menteeId: { type: Number, default: 0 },
    menteeName: { type: String, required: true },
    menteeEmail: { type: String, default: '' },
    menteeAvatar: { type: String, default: '' },
    dept: { type: String, default: 'CSE' },
    topic: { type: String, default: 'Career Guidance' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    platform: { type: String, default: 'Google Meet' },
    meetLink: { type: String, default: '' },
    status: { type: String, default: 'scheduled' }, // scheduled, in-progress, completed, cancelled
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const MentorshipReviewSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    mentorId: { type: Number, required: true },
    mentorName: { type: String, default: '' },
    menteeName: { type: String, required: true },
    menteeAvatar: { type: String, default: '' },
    dept: { type: String, default: 'CSE' },
    batch: { type: String, default: '2023' },
    rating: { type: Number, default: 5 },
    review: { type: String, required: true },
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
    trackingCode: { type: String, default: '' },
    stage: { type: String, default: 'Logged & Received' },
    priority: { type: String, default: 'Normal' },
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

const ReportSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    targetType: { type: String, default: 'alumni' },
    targetId: { type: Number, required: true },
    targetName: { type: String, default: '' },
    reporterEmail: { type: String, default: '' },
    reason: { type: String, required: true },
    details: { type: String, default: '' },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

const ConversationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    participants: [{ type: Number, required: true }],
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    lastSenderId: { type: Number },
    unreadCounts: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ updatedAt: -1 });

const ChatMessageSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    conversationId: { type: Number, required: true, index: true },
    senderId: { type: Number, required: true, index: true },
    senderName: { type: String, default: '' },
    senderAvatar: { type: String, default: '' },
    text: { type: String, required: true, maxlength: 2000 },
    read: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);
ChatMessageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = {
  User: mongoose.models.User || mongoose.model('User', UserSchema),
  Faculty: mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema),
  Department: mongoose.models.Department || mongoose.model('Department', DepartmentSchema),
  Batch: mongoose.models.Batch || mongoose.model('Batch', BatchSchema),
  GalleryAccessRequest: mongoose.models.GalleryAccessRequest || mongoose.model('GalleryAccessRequest', GalleryAccessRequestSchema),
  Event: mongoose.models.Event || mongoose.model('Event', EventSchema),
  Job: mongoose.models.Job || mongoose.model('Job', JobSchema),
  Story: mongoose.models.Story || mongoose.model('Story', StorySchema),
  GalleryItem: mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema),
  CommunityPost: mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema),
  CommunityGroup: mongoose.models.CommunityGroup || mongoose.model('CommunityGroup', CommunityGroupSchema),
  CommunityChat: mongoose.models.CommunityChat || mongoose.model('CommunityChat', CommunityChatSchema),
  CommunityResource: mongoose.models.CommunityResource || mongoose.model('CommunityResource', CommunityResourceSchema),
  MentorshipRequest: mongoose.models.MentorshipRequest || mongoose.model('MentorshipRequest', MentorshipRequestSchema),
  MentorshipSession: mongoose.models.MentorshipSession || mongoose.model('MentorshipSession', MentorshipSessionSchema),
  MentorshipReview: mongoose.models.MentorshipReview || mongoose.model('MentorshipReview', MentorshipReviewSchema),
  Donation: mongoose.models.Donation || mongoose.model('Donation', DonationSchema),
  ContactMessage: mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema),
  Notification: mongoose.models.Notification || mongoose.model('Notification', NotificationSchema),
  Message: mongoose.models.Message || mongoose.model('Message', MessageSchema),
  Conversation: mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema),
  ChatMessage: mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema),
  Verification: mongoose.models.Verification || mongoose.model('Verification', VerificationSchema),
  Report: mongoose.models.Report || mongoose.model('Report', ReportSchema),
};

