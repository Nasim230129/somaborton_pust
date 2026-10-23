const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const seedData = require('../data/seedData');
const models = require('../models/schemas');
const { FACULTIES, generateDepartmentBatches } = require('../data/pustStructure');

function generateAllDepartmentBatches() {
  const allBatches = [];
  (seedData.DEPARTMENTS || []).forEach((dept) => {
    const batches = generateDepartmentBatches(dept.id, dept.code, dept.established || 2008);
    allBatches.push(...batches);
  });
  return allBatches;
}

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
      if (!Array.isArray(memoryStore.mentorshipSessions)) {
        memoryStore.mentorshipSessions = [
          {
            id: 201,
            requestId: 1792429111445,
            mentorId: 1,
            mentorName: "Dr. Rafiqul Islam",
            mentorAvatar: createInitialsAvatar("Dr. Rafiqul Islam", "alumni"),
            menteeId: 2,
            menteeName: "Ariful Islam",
            menteeEmail: "ariful.islam@pust.ac.bd",
            menteeAvatar: createInitialsAvatar("Ariful Islam", "student"),
            dept: "CSE",
            topic: "Cloud Architecture & Technical Interview",
            date: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
            time: "19:30",
            platform: "Google Meet",
            meetLink: "https://meet.google.com/pus-tmen-tor",
            status: "scheduled",
            notes: "Reviewing microservices design and mock technical questions.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 202,
            requestId: 1792427408731,
            mentorId: 1,
            mentorName: "Dr. Rafiqul Islam",
            mentorAvatar: createInitialsAvatar("Dr. Rafiqul Islam", "alumni"),
            menteeId: 3,
            menteeName: "Sumaiya Khatun",
            menteeEmail: "sumaiya.k@pust.ac.bd",
            menteeAvatar: createInitialsAvatar("Sumaiya Khatun", "student"),
            dept: "EEE",
            topic: "Higher Studies & Foreign Scholarship Preparation",
            date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
            time: "20:00",
            platform: "Google Meet",
            meetLink: "https://meet.google.com/pus-scho-lar",
            status: "scheduled",
            notes: "Preparing SOP draft and professor outreach email templates.",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: 203,
            requestId: 1792427395160,
            mentorId: 2,
            mentorName: "Nusrat Jahan Akter",
            mentorAvatar: createInitialsAvatar("Nusrat Jahan Akter", "alumni"),
            menteeId: 4,
            menteeName: "Nahid Hasan",
            menteeEmail: "nahid.h@pust.ac.bd",
            menteeAvatar: createInitialsAvatar("Nahid Hasan", "student"),
            dept: "MATH",
            topic: "Transition from Pure Math to Data Science & ML",
            date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
            time: "18:00",
            platform: "Google Meet",
            meetLink: "https://meet.google.com/pus-data-sci",
            status: "completed",
            notes: "Analyzed linear algebra applications in deep learning.",
            createdAt: new Date(Date.now() - 259200000).toISOString(),
          },
        ];
        needSave = true;
      }
      if (!Array.isArray(memoryStore.mentorshipReviews)) {
        memoryStore.mentorshipReviews = [
          {
            id: 1,
            mentorId: 1,
            mentorName: "Dr. Rafiqul Islam",
            menteeName: "Ariful Islam",
            menteeAvatar: createInitialsAvatar("Ariful Islam", "student"),
            dept: "CSE",
            batch: "2022",
            rating: 5,
            review: "Dr. Rafiqul gave me incredibly detailed feedback on my portfolio and system architecture questions. Helped me crack the interview at Brain Station 23!",
            createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
          },
          {
            id: 2,
            mentorId: 1,
            mentorName: "Dr. Rafiqul Islam",
            menteeName: "Sumaiya Khatun",
            menteeAvatar: createInitialsAvatar("Sumaiya Khatun", "student"),
            dept: "EEE",
            batch: "2023",
            rating: 5,
            review: "Extremely patient and structured guidance. Helped me identify high-impact master's programs in Germany with complete scholarship roadmaps.",
            createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
          },
          {
            id: 3,
            mentorId: 2,
            mentorName: "Nusrat Jahan Akter",
            menteeName: "Nahid Hasan",
            menteeAvatar: createInitialsAvatar("Nahid Hasan", "student"),
            dept: "MATH",
            batch: "2024",
            rating: 5,
            review: "Nusrat Apu showed me exactly how our mathematics curriculum maps to industrial data science roles. Priceless mentorship for junior PUSTians!",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: 4,
            mentorId: 5,
            mentorName: "Tahmid Chowdhury",
            menteeName: "Tanvir Hasan",
            menteeAvatar: createInitialsAvatar("Tanvir Hasan", "student"),
            dept: "CSE",
            batch: "2023",
            rating: 5,
            review: "Tahmid bhai conducted a mock system design interview with whiteboard sessions. It was 100x more valuable than generic online tutorials.",
            createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
          },
        ];
        needSave = true;
      }
      if (!Array.isArray(memoryStore.mentorshipRequests) || memoryStore.mentorshipRequests.length === 0) {
        memoryStore.mentorshipRequests = [
          {
            id: 1792429111445,
            mentorId: 1,
            mentorName: "Dr. Rafiqul Islam",
            mentorAvatar: createInitialsAvatar("Dr. Rafiqul Islam", "alumni"),
            menteeId: 2,
            menteeName: "Ariful Islam",
            menteeEmail: "ariful.islam@pust.ac.bd",
            menteeAvatar: createInitialsAvatar("Ariful Islam", "student"),
            dept: "CSE",
            batch: "2022",
            topic: "Technical Interview & Resume Review",
            goal: "Backend → Product Engineering at Brain Station 23",
            message: "I am a final year CSE student passionate about backend development. I would love guidance on transitioning to a product engineering role like yours.",
            preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            preferredTime: "19:30",
            preferredPlatform: "Google Meet",
            status: "pending",
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 1792427408731,
            mentorId: 1,
            mentorName: "Dr. Rafiqul Islam",
            mentorAvatar: createInitialsAvatar("Dr. Rafiqul Islam", "alumni"),
            menteeId: 3,
            menteeName: "Sumaiya Khatun",
            menteeEmail: "sumaiya.k@pust.ac.bd",
            menteeAvatar: createInitialsAvatar("Sumaiya Khatun", "student"),
            dept: "EEE",
            batch: "2023",
            topic: "Higher Studies & Scholarship Preparation",
            goal: "Embedded Systems & RTOS research in Europe",
            message: "I am working on my final year project in embedded systems and struggling with RTOS. Could you guide me from your academic and industry experience?",
            preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
            preferredTime: "20:00",
            preferredPlatform: "Google Meet",
            status: "pending",
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          },
        ];
        needSave = true;
      }
      if (!Array.isArray(memoryStore.communities) || memoryStore.communities.length === 0) {
        memoryStore.communities = [
          {
            id: 1,
            name: "CSE & Tech Alumni Circle",
            slug: "cse-tech",
            desc: "A collaborative hub for CSE, EEE, ICE, and technology graduates to share opportunities, open-source projects, and industry insights.",
            icon: "💻",
            category: "Technology",
            dept: "CSE/EEE/ICE",
            tags: ["Software", "AI/ML", "Cloud", "Networking"],
            membersCount: 3840,
            postsCount: 124,
            onlineCount: 42,
            privacy: "Public",
            creator: { name: "Dr. Rafiqul Islam", role: "alumni", dept: "CSE" },
            memberIds: [1, 2, 3, 5],
            img: "/assets/fresher_s_reception_2026-VNfpIasg.jpg",
            createdAt: "2024-01-10T00:00:00.000Z",
          },
          {
            id: 2,
            name: "Engineering & Architecture Chapter",
            slug: "eng-arch",
            desc: "Civil, Mechanical, Architecture, and URP alumni collaborating on mega-infrastructure, urban renewal, and architectural design.",
            icon: "📐",
            category: "Engineering",
            dept: "CE/ARCH/URP",
            tags: ["Civil", "Architecture", "URP", "BIM"],
            membersCount: 2210,
            postsCount: 87,
            onlineCount: 19,
            privacy: "Public",
            creator: { name: "Engr. Mahmudul Hasan", role: "alumni", dept: "CE" },
            memberIds: [1, 4],
            img: "/assets/WhatsApp_Image_2026-09-15_at_3.15.05_PM__1_-Ce5e4mLS.jpeg",
            createdAt: "2024-02-15T00:00:00.000Z",
          },
          {
            id: 3,
            name: "Science & Pharmaceutical Research",
            slug: "science-pharma",
            desc: "Physics, Chemistry, Mathematics, Pharmacy, and SDS graduates discussing frontier research, publications, and lab innovations.",
            icon: "🧪",
            category: "Research",
            dept: "PHYS/CHEM/MATH/PHARM",
            tags: ["Research", "Pharmacy", "Data Science"],
            membersCount: 1680,
            postsCount: 96,
            onlineCount: 23,
            privacy: "Public",
            creator: { name: "Dr. Nadia Hussain", role: "faculty", dept: "Physics" },
            memberIds: [3],
            img: "/assets/WhatsApp_Image_2026-09-15_at_3.15.04_PM__1_-MyA59s-v.jpeg",
            createdAt: "2024-03-01T00:00:00.000Z",
          },
          {
            id: 4,
            name: "Business & Entrepreneurship Hub",
            slug: "business-startups",
            desc: "BBA and THM alumni networking around venture capital, supply chain leadership, enterprise strategy, and startup acceleration.",
            icon: "📋",
            category: "Business",
            dept: "BBA/THM/ECON",
            tags: ["BBA", "Startups", "Fintech", "Venture Capital"],
            membersCount: 1920,
            postsCount: 73,
            onlineCount: 31,
            privacy: "Public",
            creator: { name: "Tahmid Chowdhury", role: "alumni", dept: "BBA" },
            memberIds: [5, 1],
            img: "/assets/1778991184DSC05122-DR5DHwQE.jpeg",
            createdAt: "2024-03-20T00:00:00.000Z",
          },
          {
            id: 5,
            name: "Humanities & Social Sciences Guild",
            slug: "humanities-social",
            desc: "Bangla, English, History, Social Work, Public Administration, and Economics alumni engaging in culture, literature, and policy analysis.",
            icon: "📜",
            category: "Humanities",
            dept: "ENG/BANGLA/HIST/PAD",
            tags: ["Literature", "History", "Public Policy"],
            membersCount: 1540,
            postsCount: 61,
            onlineCount: 14,
            privacy: "Public",
            creator: { name: "Fariha Sultana", role: "alumni", dept: "English" },
            memberIds: [6],
            img: "/assets/DSC05166-C3a58m-v.jpeg",
            createdAt: "2024-04-05T00:00:00.000Z",
          },
          {
            id: 6,
            name: "PUST Green Campus Initiative",
            slug: "green-campus",
            desc: "Students, alumni, and faculty dedicated to environmental sustainability, clean energy projects, and campus biodiversity.",
            icon: "🌿",
            category: "Environment",
            dept: "All Departments",
            tags: ["Environment", "Sustainability", "Green Tech"],
            membersCount: 840,
            postsCount: 45,
            onlineCount: 9,
            privacy: "Public",
            creator: { name: "Zahid Hasan", role: "student", dept: "EEE" },
            memberIds: [2, 3],
            img: "/assets/fresher_s_reception_2026-VNfpIasg.jpg",
            createdAt: "2024-05-12T00:00:00.000Z",
          },
          {
            id: 7,
            name: "Freshers & Young Graduates Forum",
            slug: "freshers-forum",
            desc: "A dedicated mentorship gateway for recent graduates and final-year students stepping into professional life and corporate careers.",
            icon: "🎓",
            category: "Career & Students",
            dept: "All Departments",
            tags: ["Freshers", "Students", "Career Prep"],
            membersCount: 2680,
            postsCount: 202,
            onlineCount: 78,
            privacy: "Public",
            creator: { name: "Ariful Islam", role: "student", dept: "CSE" },
            memberIds: [2, 1],
            img: "/assets/DSC05122-DR5DHwQE.jpeg",
            createdAt: "2024-06-01T00:00:00.000Z",
          },
          {
            id: 8,
            name: "PUST Global Diaspora Chapters",
            slug: "global-diaspora",
            desc: "Alumni living and working overseas — active chapters spanning North America, Europe, Australia, East Asia, and the Middle East.",
            icon: "🌍",
            category: "International",
            dept: "Global Chapters",
            tags: ["International", "Diaspora", "Higher Studies"],
            membersCount: 4320,
            postsCount: 310,
            onlineCount: 91,
            privacy: "Public",
            creator: { name: "Dr. Rafiqul Islam", role: "alumni", dept: "CSE" },
            memberIds: [1, 5, 2],
            img: "/assets/fresher_s_reception_2026-VNfpIasg.jpg",
            createdAt: "2024-01-01T00:00:00.000Z",
          },
        ];
        needSave = true;
      }
      if (!Array.isArray(memoryStore.communityGatherings) || memoryStore.communityGatherings.length === 0) {
        memoryStore.communityGatherings = [
          {
            id: 1,
            icon: "🏆",
            date: "Oct 28, 2026",
            time: "20:00 BST",
            title: "PUST Inter-Batch Alumni Quiz Night & Trivia",
            loc: "Online · Official Zoom Conference",
            meetLink: "https://meet.google.com/pus-quiz-2026",
            seats: 120,
            registered: 94,
            desc: "Friendly university trivia, historical PUST memories, and engineering knowledge contest with prizes.",
            attendeeIds: [1, 2],
          },
          {
            id: 2,
            icon: "🎤",
            date: "Nov 05, 2026",
            time: "15:00 BST",
            title: "PUST Career Talk Series — Navigating Big Tech",
            loc: "PUST Main Auditorium, Campus",
            meetLink: "https://meet.google.com/pus-career-talk",
            seats: 250,
            registered: 185,
            desc: "Keynote talks by PUST alumni working in European and North American enterprise organizations.",
            attendeeIds: [1],
          },
          {
            id: 3,
            icon: "🌐",
            date: "Nov 18, 2026",
            time: "21:00 BST",
            title: "Global Diaspora Chapter Virtual Assembly",
            loc: "Online · Regional Timezones",
            meetLink: "https://meet.google.com/pus-diaspora-live",
            seats: 500,
            registered: 360,
            desc: "Connecting alumni chapters across North America, UK, Europe, Australia, and the Middle East.",
            attendeeIds: [1, 5],
          },
          {
            id: 4,
            icon: "🎓",
            date: "Dec 01, 2026",
            time: "18:30 BST",
            title: "PUST Annual Alumni Gala Dinner 2026",
            loc: "Dhaka Officers Club, Dhaka",
            meetLink: "https://pust-alumni.ac.bd/gala-2026",
            seats: 400,
            registered: 320,
            desc: "Formal evening banquet bringing together faculty deans, distinguished alumni, and university leaders.",
            attendeeIds: [1],
          },
        ];
        needSave = true;
      }
      if (!Array.isArray(memoryStore.communityChats) || memoryStore.communityChats.length === 0) {
        memoryStore.communityChats = [
          {
            id: 1,
            communityId: 1,
            sender: {
              id: 1,
              name: "Dr. Rafiqul Islam",
              avatar: createInitialsAvatar("Dr. Rafiqul Islam", "alumni"),
              dept: "CSE",
              batch: "2008",
              role: "alumni",
            },
            text: "Welcome everyone to the CSE & Tech Alumni Circle live channel! 👋 Feel free to share project queries, tech opportunities, and discuss modern architectures.",
            time: "2 hours ago",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: 2,
            communityId: 1,
            sender: {
              id: 5,
              name: "Tahmid Chowdhury",
              avatar: createInitialsAvatar("Tahmid Chowdhury", "alumni"),
              dept: "BBA / Tech PM",
              batch: "2015",
              role: "alumni",
            },
            text: "Great to see this live stream active! For those preparing for system design interviews, focusing on Kafka streaming and distributed DB sharding will give you a big edge right now.",
            time: "1 hour ago",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 3,
            communityId: 1,
            sender: {
              id: 2,
              name: "Ariful Islam",
              avatar: createInitialsAvatar("Ariful Islam", "student"),
              dept: "CSE",
              batch: "2022",
              role: "student",
            },
            text: "Thank you Rafiq Sir and Tahmid Bhai! Could someone review our final-year distributed cache microservice repo when you have time?",
            time: "30 mins ago",
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
          {
            id: 4,
            communityId: 1,
            sender: {
              id: 1,
              name: "Dr. Rafiqul Islam",
              avatar: createInitialsAvatar("Dr. Rafiqul Islam", "alumni"),
              dept: "CSE",
              batch: "2008",
              role: "alumni",
            },
            text: "Sure Ariful! Post the GitHub link in the Shared Resources tab of this community, and our team will review the PRs.",
            time: "10 mins ago",
            createdAt: new Date(Date.now() - 600000).toISOString(),
          },
          {
            id: 5,
            communityId: 2,
            sender: {
              id: 4,
              name: "Engr. Mahmudul Hasan",
              avatar: createInitialsAvatar("Mahmudul Hasan", "alumni"),
              dept: "CE",
              batch: "2010",
              role: "alumni",
            },
            text: "Welcome to the Engineering & Architecture Chapter. We are coordinating on green building certifications and BIM modeling workshops for young engineers.",
            time: "3 hours ago",
            createdAt: new Date(Date.now() - 10800000).toISOString(),
          },
          {
            id: 6,
            communityId: 3,
            sender: {
              id: 3,
              name: "Dr. Nadia Hussain",
              avatar: createInitialsAvatar("Nadia Hussain", "faculty"),
              dept: "Physics",
              batch: "Faculty",
              role: "faculty",
            },
            text: "Greetings researchers! Our materials lab is opening collaborative simulation slots for PUST alumni in computational chemistry and condensed matter physics.",
            time: "4 hours ago",
            createdAt: new Date(Date.now() - 14400000).toISOString(),
          },
        ];
        needSave = true;
      }
      if (!Array.isArray(memoryStore.faculties) || memoryStore.faculties.length === 0) {
        memoryStore.faculties = [...FACULTIES];
        needSave = true;
      }
      if (!Array.isArray(memoryStore.batches) || memoryStore.batches.length === 0) {
        memoryStore.batches = generateAllDepartmentBatches();
        needSave = true;
      }
      if (!Array.isArray(memoryStore.galleryAccessRequests)) {
        memoryStore.galleryAccessRequests = [];
        needSave = true;
      }
      if (!Array.isArray(memoryStore.communityResources) || memoryStore.communityResources.length === 0) {
        memoryStore.communityResources = [
          {
            id: 1,
            communityId: 1,
            title: "PUST CSE Competitive Programming & Tech Interview Sheet 2026",
            url: "https://github.com/pust-alumni/tech-interview-prep-2026",
            category: "Code & Repository",
            description: "Curated 150 LeetCode patterns, system design cheatsheets, and backend interview questions compiled by senior alumni.",
            uploader: { name: "Dr. Rafiqul Islam", dept: "CSE '08" },
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
          {
            id: 2,
            communityId: 1,
            title: "Distributed Microservices & Cloud Architecture Starter Kit",
            url: "https://github.com/pust-alumni/cloud-microservices-template",
            category: "Code & Repository",
            description: "Go + Docker + Kubernetes starter template with JWT auth, gRPC service discovery, and Prometheus metrics.",
            uploader: { name: "Tahmid Chowdhury", dept: "BBA/CSE '15" },
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
          {
            id: 3,
            communityId: 1,
            title: "LaTeX Overleaf Resume Template for International Tech & Graduate Applications",
            url: "https://www.overleaf.com/latex/templates/pust-alumni-swe-resume/xyz",
            category: "Career & Resume",
            description: "Clean, ATS-optimized one-page resume template proven for European and US tech job screens.",
            uploader: { name: "Ariful Islam", dept: "CSE '22" },
            createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
          },
          {
            id: 4,
            communityId: 2,
            title: "BIM 360 Structural Modeling Guidelines & Standard Codes",
            url: "https://drive.google.com/drive/folders/pust-civil-bim-guidelines",
            category: "Engineering Standards",
            description: "Standard BNBC structural guidelines, Revit templates, and foundation calculation spreadsheets.",
            uploader: { name: "Engr. Mahmudul Hasan", dept: "CE '10" },
            createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
          },
          {
            id: 5,
            communityId: 3,
            title: "Peer-Reviewed Superconductor Simulation Dataset & Jupyter Notebooks",
            url: "https://github.com/pust-physics/superconductor-simulation-data",
            category: "Research Papers",
            description: "Open-access data files and Python scripts reproducing the Nature Materials paper findings.",
            uploader: { name: "Dr. Nadia Hussain", dept: "Physics (Faculty)" },
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
        ];
        needSave = true;
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
    faculties: [...FACULTIES],
    departments: [...seedData.DEPARTMENTS],
    batches: generateAllDepartmentBatches(),
    galleryAccessRequests: [],
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
    communityChats: [],
    communityResources: [],
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
    const facCount = models.Faculty ? await models.Faculty.countDocuments() : 0;
    if (facCount === 0 && models.Faculty) {
      console.log('Populating PUST 5 faculties and 18 batches per department in MongoDB...');
      await models.Faculty.insertMany(FACULTIES);
      if (models.Batch) {
        await models.Batch.insertMany(generateAllDepartmentBatches());
      }
    }

    const deptCount = await models.Department.countDocuments();
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

    const allUsers = [
      ...seedData.ALUMNI,
      ...seedData.STUDENTS,
      ...seedData.FACULTY,
      ...seedData.EMPLOYERS,
      ...(seedData.ADMINS || []),
    ];

    const usersColl = mongoose.connection.db ? mongoose.connection.db.collection('users') : null;
    if (usersColl) {
      // Ensure missing seeds are inserted
      for (const seed of allUsers) {
        const exists = await usersColl.findOne({
          $or: [{ id: seed.id }, { email: seed.email }],
        });
        if (!exists) {
          await usersColl.insertOne({
            ...seed,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // Ensure any document without id gets an id and default fields
      const withoutId = await usersColl.find({ id: { $exists: false } }).toArray();
      let genId = 100;
      for (const doc of withoutId) {
        await usersColl.updateOne(
          { _id: doc._id },
          {
            $set: {
              id: genId++,
              role: doc.role || 'alumni',
              dept: doc.dept || 'Computer Science & Engineering',
              location: doc.location || 'Dhaka, Bangladesh',
              headline: doc.headline || `${doc.role === 'student' ? 'Student' : 'Alumni'}, ${doc.dept || 'PUST'}`,
              skills: Array.isArray(doc.skills) && doc.skills.length ? doc.skills : ['Leadership', 'Research'],
              connections: typeof doc.connections === 'number' ? doc.connections : 1,
              status: doc.status || 'active',
              mentorAvailable: Boolean(doc.mentorAvailable),
              verified: Boolean(doc.verified),
            },
          }
        );
      }
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
