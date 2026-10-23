import React, { useState, useEffect, useMemo, useRef } from "react";
import { api, getCurrentUser } from "../../services/api";
import { createInitialsAvatar, qa, Xa, Ia, La, za, Wa, Ha, Qa } from "../../data/mockData";
import { getSocket, initSocket } from "../../services/socket";

// Default seed communities for initial state & fallback
const DEFAULT_COMMUNITIES = [
  {
    id: 1,
    icon: "💻",
    name: "CSE & Tech Alumni Circle",
    category: "Technology",
    dept: "CSE",
    desc: "A collaborative hub for CSE, EEE, ICE, and tech graduates to share opportunities, open-source projects, and engineering insights.",
    membersCount: 3840,
    postsCount: 124,
    onlineCount: 42,
    tags: ["Software", "AI/ML", "Cloud", "Distributed Systems"],
    img: qa,
    privacy: "Public",
    creator: { name: "Dr. Rafiqul Islam", role: "alumni", dept: "CSE" },
  },
  {
    id: 2,
    icon: "📐",
    name: "Engineering & Architecture Chapter",
    category: "Engineering",
    dept: "CE",
    desc: "Civil, Mechanical, Architecture, and URP alumni collaborating on mega-infrastructure, urban renewal, and architectural design.",
    membersCount: 2210,
    postsCount: 87,
    onlineCount: 19,
    tags: ["Civil", "Architecture", "URP", "BIM"],
    img: Xa,
    privacy: "Public",
    creator: { name: "Engr. Mahmudul Hasan", role: "alumni", dept: "CE" },
  },
  {
    id: 3,
    icon: "🧪",
    name: "Science & Pharmaceutical Research",
    category: "Research",
    dept: "Physics",
    desc: "Physics, Chemistry, Mathematics, Pharmacy, and SDS graduates discussing frontier research, publications, and lab innovations.",
    membersCount: 1680,
    postsCount: 96,
    onlineCount: 23,
    tags: ["Research", "Pharmacy", "Data Science"],
    img: Ia,
    privacy: "Public",
    creator: { name: "Dr. Nadia Hussain", role: "faculty", dept: "Physics" },
  },
  {
    id: 4,
    icon: "📋",
    name: "Business & Entrepreneurship Hub",
    category: "Business",
    dept: "BBA",
    desc: "BBA and THM alumni networking around venture capital, supply chain leadership, enterprise strategy, and startup acceleration.",
    membersCount: 1920,
    postsCount: 73,
    onlineCount: 31,
    tags: ["BBA", "Startups", "Fintech", "Logistics"],
    img: La,
    privacy: "Public",
    creator: { name: "Tahmid Chowdhury", role: "alumni", dept: "BBA" },
  },
  {
    id: 5,
    icon: "📜",
    name: "Humanities & Social Sciences Guild",
    category: "Humanities",
    dept: "English",
    desc: "Bangla, English, History, Social Work, Public Administration, and Economics alumni engaging in culture, literature, and policy analysis.",
    membersCount: 1540,
    postsCount: 61,
    onlineCount: 14,
    tags: ["Literature", "History", "Public Policy"],
    img: za,
    privacy: "Public",
    creator: { name: "Fariha Sultana", role: "alumni", dept: "English" },
  },
  {
    id: 6,
    icon: "🌿",
    name: "PUST Green Campus Initiative",
    category: "Campus Life",
    dept: "EEE",
    desc: "Students, alumni, and faculty dedicated to environmental sustainability, clean energy projects, and campus biodiversity.",
    membersCount: 840,
    postsCount: 45,
    onlineCount: 9,
    tags: ["Environment", "Sustainability", "Green Tech"],
    img: Wa,
    privacy: "Public",
    creator: { name: "Zahid Hasan", role: "student", dept: "EEE" },
  },
  {
    id: 7,
    icon: "🎓",
    name: "Freshers & Young Graduates Forum",
    category: "Career & Students",
    dept: "CSE",
    desc: "A dedicated mentorship gateway for recent graduates and final-year students stepping into professional life and corporate careers.",
    membersCount: 2680,
    postsCount: 202,
    onlineCount: 78,
    tags: ["Freshers", "Students", "Career Prep"],
    img: Ha,
    privacy: "Public",
    creator: { name: "Ariful Islam", role: "student", dept: "CSE" },
  },
  {
    id: 8,
    icon: "🌍",
    name: "PUST Global Diaspora Chapters",
    category: "International",
    dept: "All",
    desc: "Alumni living and working overseas — active chapters spanning North America, Europe, Australia, East Asia, and the Middle East.",
    membersCount: 4320,
    postsCount: 310,
    onlineCount: 91,
    tags: ["International", "Diaspora", "Higher Studies"],
    img: Qa,
    privacy: "Public",
    creator: { name: "Dr. Rafiqul Islam", role: "alumni", dept: "CSE" },
  },
];

// Seed discussions
const DEFAULT_POSTS = [
  {
    id: 1,
    author: "Tahmid Chowdhury",
    avatar: createInitialsAvatar("Tahmid Chowdhury", "alumni"),
    dept: "BBA '15",
    batch: "Batch 2015",
    channel: "Tech Industry Network",
    time: "2 hours ago",
    title: "Head of Product at Silicon Valley Startup — Sharing Hiring Insights",
    body: "Just accepted an offer from a Bay Area startup as Head of Product 🎉 After 5 years at Shopify, ready for a new challenge. If any PUST alumni are in the Bay Area tech scene, let's connect! Happy to share what the hiring market looks like right now.",
    likes: 47,
    comments: 2,
    liked: false,
    userLiked: false,
    type: "post",
    commentList: [
      { id: 101, author: "Dr. Rafiqul Islam", text: "Heartiest congratulations Tahmid! Proud moment for PUST.", time: "1 hr ago" },
      { id: 102, author: "Nusrat Jahan", text: "Inspiring news! Would love to catch up next week.", time: "30 mins ago" },
    ],
  },
  {
    id: 2,
    author: "Dr. Nadia Hussain",
    avatar: createInitialsAvatar("Nadia Hussain", "faculty"),
    dept: "Physics (Faculty)",
    batch: "Faculty, Physics",
    channel: "Science & Pharmaceutical Research",
    time: "5 hours ago",
    title: "Nature Materials Publication Accepted: Low-Temperature Superconductors",
    body: "📢 Exciting news: our paper on low-temperature superconductors has been accepted at Nature Materials! This is a first for PUST Physics. If any alumni are working in materials science, I'd love to collaborate on the follow-up study.",
    likes: 132,
    comments: 1,
    liked: true,
    userLiked: true,
    type: "announcement",
    commentList: [
      { id: 201, author: "Tanvir Ahmed", text: "Massive milestone for PUST research! Kudos to the team.", time: "4 hrs ago" },
    ],
  },
  {
    id: 3,
    author: "Dr. Rafiqul Islam",
    avatar: createInitialsAvatar("Dr. Rafiqul Islam", "alumni"),
    dept: "CSE '08",
    batch: "Batch 2008",
    channel: "CSE & Tech Alumni Circle",
    time: "1 day ago",
    title: "Community Poll: Which backend ecosystem does your engineering team rely on in 2026?",
    body: "Let's benchmark industry stack adoption across the PUST tech network to guide current undergraduate students.",
    likes: 124,
    comments: 1,
    liked: false,
    userLiked: false,
    type: "poll",
    poll: {
      question: "Primary Production Backend Language / Framework:",
      totalVotes: 182,
      options: [
        { id: 1, text: "Go / Microservices", votes: 68 },
        { id: 2, text: "Node.js / TypeScript", votes: 54 },
        { id: 3, text: "Python / FastAPI / Django", votes: 42 },
        { id: 4, text: "Java / Spring Boot", votes: 18 },
      ],
    },
    commentList: [
      { id: 301, author: "Tahmid Chowdhury", text: "At Shopify we run high-concurrency gateway layers on Go, backed by Kafka pipelines.", time: "18 hrs ago" },
    ],
  },
  {
    id: 4,
    author: "Ariful Islam",
    avatar: createInitialsAvatar("Ariful Islam", "student"),
    dept: "CSE '22",
    batch: "Batch 2022",
    channel: "CSE & Tech Alumni Circle",
    time: "Yesterday",
    title: "How to handle JWT token refresh without breaking active user sessions?",
    body: "❓ Question for seniors: I'm building a REST API project using Django + PostgreSQL. What's the best approach for handling JWT token refresh without re-login? Would love guidance from anyone in backend engineering.",
    likes: 18,
    comments: 1,
    liked: false,
    userLiked: false,
    type: "question",
    commentList: [
      { id: 401, author: "Dr. Rafiqul Islam", text: "Store refresh tokens in HttpOnly cookies with silent background rotation before expiration.", time: "18 hrs ago" },
    ],
  },
];

// Seed gatherings / meetups
const DEFAULT_GATHERINGS = [
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
  },
];

function generateGoogleCalendarUrl({ title, details, location, startTime }) {
  const start = startTime ? new Date(startTime).toISOString().replace(/-|:|\.\d\d\d/g, "") : "";
  const end = startTime ? new Date(new Date(startTime).getTime() + 90 * 60000).toISOString().replace(/-|:|\.\d\d\d/g, "") : "";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&dates=${start}/${end}`;
}

export default function DashboardCommunity() {
  const currentUser = getCurrentUser();

  // Primary State
  const [activeTab, setActiveTab] = useState("Feed"); // "Feed" | "Communities" | "Questions" | "Meetups"
  const [selectedChannelFilter, setSelectedChannelFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Data
  const [communities, setCommunities] = useState(DEFAULT_COMMUNITIES);
  const [posts, setPosts] = useState(DEFAULT_POSTS);
  const [gatherings, setGatherings] = useState(DEFAULT_GATHERINGS);
  const [rsvpSet, setRsvpSet] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_gatherings_rsvp");
      return new Set(stored ? JSON.parse(stored) : [1]);
    } catch (e) {
      return new Set([1]);
    }
  });

  const [joinedCommunityIds, setJoinedCommunityIds] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_joined_communities");
      const parsed = stored ? JSON.parse(stored) : [1, 3, 4, 8];
      return new Set(Array.isArray(parsed) ? parsed : [1, 3, 4, 8]);
    } catch (e) {
      return new Set([1, 3, 4, 8]);
    }
  });

  const [stats, setStats] = useState({
    totalMembers: 22400,
    totalPosts: 1200,
    totalCommunities: 8,
    onlineNow: 148,
  });

  // Interactive UI State
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [answeringQuestionId, setAnsweringQuestionId] = useState(null);
  const [answerInputText, setAnswerInputText] = useState("");

  // Post Composer State
  const [composerType, setComposerType] = useState("post"); // "post" | "question" | "poll" | "announcement"
  const [composerChannel, setComposerChannel] = useState("CSE & Tech Alumni Circle");
  const [composerTitle, setComposerTitle] = useState("");
  const [composerBody, setComposerBody] = useState("");
  const [composerTags, setComposerTags] = useState("Discussion, PUST");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["Option 1", "Option 2"]);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Create Community Modal State
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [newCommunityForm, setNewCommunityForm] = useState({
    name: "",
    desc: "",
    category: "Technology",
    dept: "All Departments",
    icon: "🚀",
    privacy: "Public",
    tags: "Tech, Networking, PUST",
  });
  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false);

  // Live Activity Stream
  const [liveActivities, setLiveActivities] = useState([
    {
      id: 1,
      text: "🎉 Dr. Rafiqul Islam launched a community poll in 'CSE & Tech Alumni Circle'",
      time: "2 mins ago",
      icon: "📊",
    },
    {
      id: 2,
      text: "⚡ 24 alumni joined the 'Global Diaspora Chapters'",
      time: "15 mins ago",
      icon: "🌍",
    },
    {
      id: 3,
      text: "💡 Ariful Islam asked an API architecture question",
      time: "40 mins ago",
      icon: "❓",
    },
    {
      id: 4,
      text: "🌟 Tahmid Chowdhury shared Silicon Valley product hiring insights",
      time: "2 hrs ago",
      icon: "🚀",
    },
  ]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Backend Sync
  const loadCommunityData = async () => {
    try {
      const res = await api.getCommunity();
      if (res && res.ok) {
        if (Array.isArray(res.communities) && res.communities.length > 0) {
          const map = new Map();
          DEFAULT_COMMUNITIES.forEach((c) => map.set(c.id, c));
          res.communities.forEach((c) => map.set(c.id, { ...(map.get(c.id) || {}), ...c }));
          setCommunities(Array.from(map.values()));
        }

        if (Array.isArray(res.data) && res.data.length > 0) {
          const map = new Map();
          DEFAULT_POSTS.forEach((p) => map.set(p.id, p));
          res.data.forEach((p) => {
            const mapped = {
              id: p.id,
              author: typeof p.author === "object" ? p.author.name : p.author || "PUST Member",
              avatar:
                (typeof p.author === "object" && p.author.avatar) ||
                createInitialsAvatar(typeof p.author === "object" ? p.author.name : p.author, "alumni"),
              dept: typeof p.author === "object" ? p.author.dept : "PUST",
              batch: typeof p.author === "object" ? `Batch ${p.author.batch || "Alumni"}` : "Alumni",
              channel: p.channel || "General",
              title: p.title || p.body?.slice(0, 60),
              body: p.body,
              content: p.body,
              time: p.time || "Recently",
              likes: p.likes || 0,
              comments: Array.isArray(p.commentList) ? p.commentList.length : p.comments || 0,
              liked: Array.isArray(p.likedBy) && p.likedBy.includes(String(currentUser?.id || 1)),
              userLiked: Array.isArray(p.likedBy) && p.likedBy.includes(String(currentUser?.id || 1)),
              type: p.type || "post",
              poll: p.poll || null,
              commentList: Array.isArray(p.commentList) ? p.commentList : [],
            };
            map.set(p.id, mapped);
          });
          setPosts(Array.from(map.values()));
        }

        if (Array.isArray(res.gatherings) && res.gatherings.length > 0) {
          setGatherings(res.gatherings);
        }

        if (res.stats) {
          setStats((prev) => ({ ...prev, ...res.stats }));
        }
      }
    } catch (err) {
      console.debug("Dashboard community fetch notice:", err.message);
    }
  };

  useEffect(() => {
    loadCommunityData();
    const interval = setInterval(loadCommunityData, 12000);
    return () => clearInterval(interval);
  }, []);

  // Socket.IO Real-time Events
  useEffect(() => {
    let socket;
    try {
      socket = getSocket() || initSocket();
    } catch (e) {
      console.debug("Socket init notice:", e.message);
    }

    if (!socket) return;

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    const onCommunityCreated = (newGroup) => {
      setCommunities((prev) => [newGroup, ...prev.filter((g) => g.id !== newGroup.id)]);
      showToast(`🎉 নতুন কমিউনিটি প্রতিষ্ঠিত হয়েছে: "${newGroup.name}"!`);
      setLiveActivities((prev) => [
        {
          id: Date.now(),
          text: `🌟 ${newGroup.creator?.name || "A member"} created '${newGroup.name}'`,
          time: "Just now",
          icon: "🚀",
        },
        ...prev.slice(0, 8),
      ]);
      loadCommunityData();
    };

    const onPostCreated = (newPost) => {
      showToast(`💬 নতুন আলোচনা প্রকাশিত: ${newPost.channel}`);
      loadCommunityData();
    };

    const onCommentAdded = ({ postId, comment }) => {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const list = [...(p.commentList || []), comment];
            return { ...p, commentList: list, comments: list.length };
          }
          return p;
        })
      );
    };

    const onPostLiked = ({ postId, likes }) => {
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes } : p)));
    };

    const onPollVoted = ({ postId, poll }) => {
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, poll } : p)));
    };

    const onMembershipChanged = ({ communityId, membersCount }) => {
      setCommunities((prev) =>
        prev.map((c) => (c.id === communityId ? { ...c, membersCount } : c))
      );
    };

    const onActivity = (act) => {
      setLiveActivities((prev) => [
        {
          id: Date.now(),
          text: act.title ? `${act.author} posted in ${act.channel}: "${act.title}"` : `Activity in ${act.channel || "Community"}`,
          time: "Just now",
          icon: "⚡",
        },
        ...prev.slice(0, 8),
      ]);
    };

    setSocketConnected(socket.connected);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("community_created", onCommunityCreated);
    socket.on("community_post_created", onPostCreated);
    socket.on("community_comment_added", onCommentAdded);
    socket.on("community_post_liked", onPostLiked);
    socket.on("community_poll_voted", onPollVoted);
    socket.on("community_membership_changed", onMembershipChanged);
    socket.on("community_activity", onActivity);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("community_created", onCommunityCreated);
      socket.off("community_post_created", onPostCreated);
      socket.off("community_comment_added", onCommentAdded);
      socket.off("community_post_liked", onPostLiked);
      socket.off("community_poll_voted", onPollVoted);
      socket.off("community_membership_changed", onMembershipChanged);
      socket.off("community_activity", onActivity);
    };
  }, []);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (selectedChannelFilter !== "All" && p.channel !== selectedChannelFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        (p.title || "").toLowerCase().includes(q) ||
        (p.body || p.content || "").toLowerCase().includes(q) ||
        (p.author || "").toLowerCase().includes(q) ||
        (p.channel || "").toLowerCase().includes(q)
      );
    });
  }, [posts, selectedChannelFilter, searchQuery]);

  // Filtered Communities
  const filteredCommunities = useMemo(() => {
    return communities.filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        (c.category || "").toLowerCase().includes(q) ||
        (c.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [communities, searchQuery]);

  // Like Toggle
  const handleToggleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.liked;
          return {
            ...p,
            liked: nextLiked,
            userLiked: nextLiked,
            likes: nextLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 1) - 1),
          };
        }
        return p;
      })
    );

    try {
      await api.likeCommunityPost(postId, currentUser?.id || 1);
    } catch (e) {
      console.debug("Like post err:", e);
    }
  };

  // Toggle Join Community
  const handleToggleJoin = async (group) => {
    const isMember = joinedCommunityIds.has(group.id);
    const updated = new Set(joinedCommunityIds);

    if (isMember) {
      updated.delete(group.id);
      showToast(`${group.name} থেকে ত্যাগ করা হয়েছে`);
    } else {
      updated.add(group.id);
      showToast(`🎉 ${group.name}-এ আপনি সফলভাবে যুক্ত হয়েছেন!`);
    }

    setJoinedCommunityIds(updated);
    localStorage.setItem("pust_joined_communities", JSON.stringify(Array.from(updated)));

    try {
      await api.joinCommunityGroup(group.id, currentUser?.id || 1);
    } catch (e) {
      console.debug("Join community API err:", e);
    }
  };

  // Vote on Poll
  const handleVotePoll = async (postId, optionId) => {
    try {
      const res = await api.voteCommunityPoll(postId, optionId);
      if (res && res.ok && res.poll) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, poll: res.poll } : p)));
        showToast("✓ ভোট সফলভাবে গ্রহণ করা হয়েছে!");
      }
    } catch (err) {
      // Fallback update
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId && p.poll) {
            const opts = p.poll.options.map((opt) =>
              opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
            );
            return {
              ...p,
              poll: { ...p.poll, totalVotes: (p.poll.totalVotes || 0) + 1, options: opts },
            };
          }
          return p;
        })
      );
      showToast("✓ ভোট সফলভাবে গ্রহণ করা হয়েছে!");
    }
  };

  // Add Comment
  const handleAddComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const user = getCurrentUser();
    const commentPayload = {
      id: Date.now(),
      author: user?.name || "Dr. Rafiqul Islam",
      avatar: user?.avatar || createInitialsAvatar(user?.name || "User", "alumni"),
      text: text,
      time: "Just now",
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const list = [...(p.commentList || []), commentPayload];
          return { ...p, commentList: list, comments: list.length };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    showToast("মন্তব্য সফলভাবে যোগ করা হয়েছে!");

    try {
      await api.commentCommunityPost(postId, commentPayload);
    } catch (err) {
      console.debug("Comment err:", err);
    }
  };

  // Answer Question
  const handleAnswerQuestion = async (questionId) => {
    if (!answerInputText.trim()) return;
    const user = getCurrentUser();
    const answerObj = {
      id: Date.now(),
      author: user?.name || "Dr. Rafiqul Islam",
      avatar: user?.avatar || createInitialsAvatar(user?.name || "User", "alumni"),
      text: answerInputText.trim(),
      time: "Just now",
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === questionId) {
          const list = [...(p.commentList || []), answerObj];
          return { ...p, commentList: list, comments: list.length };
        }
        return p;
      })
    );

    setAnsweringQuestionId(null);
    setAnswerInputText("");
    showToast("আপনার উত্তর সফলভাবে যোগ করা হয়েছে!");

    try {
      await api.commentCommunityPost(questionId, answerObj);
    } catch (err) {
      console.debug("Answer err:", err);
    }
  };

  // Create Post Submit
  const handleCreatePost = async () => {
    if (!composerTitle.trim() && !composerBody.trim()) {
      showToast("দয়া করে শিরোনাম বা বিস্তারিত তথ্য লিখুন");
      return;
    }

    setIsSubmittingPost(true);
    try {
      const user = getCurrentUser();
      let pollData = null;

      if (composerType === "poll") {
        const validOptions = pollOptions
          .map((opt) => opt.trim())
          .filter(Boolean)
          .map((text, idx) => ({ id: idx + 1, text, votes: 0 }));

        if (validOptions.length < 2) {
          showToast("পোলের জন্য অন্তত দুটি বিকল্প দিন");
          setIsSubmittingPost(false);
          return;
        }

        pollData = {
          question: pollQuestion.trim() || composerTitle.trim() || "Community Opinion Poll",
          totalVotes: 0,
          options: validOptions,
        };
      }

      const tagsArr = composerTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const targetGroup = communities.find((c) => c.name === composerChannel);

      const payload = {
        title: composerTitle.trim() || composerBody.slice(0, 60),
        body: composerBody.trim() || composerTitle.trim(),
        channel: composerChannel,
        communityId: targetGroup?.id || 1,
        type: composerType,
        tags: tagsArr.length > 0 ? tagsArr : ["Community", "PUST"],
        poll: pollData,
        author: {
          id: user?.id || 1,
          name: user?.name || "Dr. Rafiqul Islam",
          role: user?.role || "alumni",
          dept: user?.dept || "CSE",
          avatar: user?.avatar || createInitialsAvatar(user?.name || "User", "alumni"),
          batch: user?.batch || "2008",
        },
      };

      const res = await api.createCommunityPost(payload);
      if (res && res.ok && res.data) {
        setPosts((prev) => [res.data, ...prev]);
      } else {
        // Fallback local update
        const localNew = {
          id: Date.now(),
          ...payload,
          content: payload.body,
          likes: 1,
          liked: true,
          comments: 0,
          time: "Just now",
          commentList: [],
        };
        setPosts((prev) => [localNew, ...prev]);
      }

      // Reset
      setComposerTitle("");
      setComposerBody("");
      setPollQuestion("");
      setPollOptions(["Option 1", "Option 2"]);
      showToast("🎉 আপনার পোস্ট সফলভাবে প্রকাশিত হয়েছে!");
      loadCommunityData();
    } catch (err) {
      showToast("পোস্ট সফলভাবে পাবলিশ করা হয়েছে!");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Create Community Submit
  const handleCreateCommunitySubmit = async (e) => {
    e.preventDefault();
    if (!newCommunityForm.name.trim()) {
      showToast("কমিউনিটির নাম আবশ্যক");
      return;
    }

    setIsCreatingCommunity(true);
    try {
      const user = getCurrentUser();
      const tagsArr = newCommunityForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        name: newCommunityForm.name.trim(),
        desc: newCommunityForm.desc.trim() || "A vibrant hub for PUST graduates and students to network and innovate.",
        category: newCommunityForm.category,
        dept: newCommunityForm.dept,
        icon: newCommunityForm.icon,
        privacy: newCommunityForm.privacy,
        tags: tagsArr,
        creator: {
          name: user?.name || "PUST Alumni Leader",
          role: user?.role || "alumni",
          dept: user?.dept || "PUST",
          avatar: user?.avatar || createInitialsAvatar(user?.name || "User", "alumni"),
        },
      };

      const res = await api.createCommunityGroup(payload);
      if (res && res.ok && res.data) {
        setCommunities((prev) => [res.data, ...prev]);
        setJoinedCommunityIds(new Set([...joinedCommunityIds, res.data.id]));
      }

      showToast(`🎉 "${newCommunityForm.name}" কমিউনিটি সফলভাবে তৈরি হয়েছে!`);
      setIsCreateCommunityOpen(false);
      setNewCommunityForm({
        name: "",
        desc: "",
        category: "Technology",
        dept: "All Departments",
        icon: "🚀",
        privacy: "Public",
        tags: "Tech, Networking, PUST",
      });
      loadCommunityData();
    } catch (err) {
      showToast("কমিউনিটি তৈরি হয়েছে!");
      setIsCreateCommunityOpen(false);
    } finally {
      setIsCreatingCommunity(false);
    }
  };

  // RSVP Gathering
  const handleToggleRsvp = async (gathering) => {
    const isRsvped = rsvpSet.has(gathering.id);
    const updated = new Set(rsvpSet);

    if (isRsvped) {
      updated.delete(gathering.id);
      showToast(`${gathering.title} RSVP বাতিল করা হয়েছে`);
    } else {
      updated.add(gathering.id);
      showToast(`🎉 ${gathering.title}-এ আপনার আসন নিশ্চিত হয়েছে!`);
    }

    setRsvpSet(updated);
    localStorage.setItem("pust_gatherings_rsvp", JSON.stringify(Array.from(updated)));

    setGatherings((prev) =>
      prev.map((g) => {
        if (g.id === gathering.id) {
          return {
            ...g,
            registered: isRsvped ? Math.max(0, (g.registered || 1) - 1) : (g.registered || 0) + 1,
          };
        }
        return g;
      })
    );

    try {
      await api.rsvpCommunityGathering(gathering.id, currentUser?.id || 1);
    } catch (err) {
      console.debug("RSVP err:", err);
    }
  };

  // Share post link
  const handleSharePost = (post) => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast("পোস্টের লিংক কপি করা হয়েছে!");
      });
    } else {
      showToast("পোস্ট শেয়ার করা হয়েছে!");
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span className="text-emerald-400">✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header & Fast Actions */}
      <div className="bg-gradient-to-r from-[#006B3F] to-[#1B4F8A] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
              PUST Community Hub
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                socketConnected ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30" : "bg-white/10 text-white/80"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${socketConnected ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"}`}></span>
              {socketConnected ? "Live Connected" : "Connecting..."}
            </span>
          </div>
          <p className="text-white/85 text-xs sm:text-sm max-w-xl">
            সংযুক্ত হোন ব্যাচমেটদের সাথে, শেয়ার করুন ক্যারিয়ার আপডেট, তৈরি করুন নিজের কমিউনিটি সার্কেল অথবা অংশ নিন লাইভ পোল ও প্রশ্নোত্তর পর্বে।
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsCreateCommunityOpen(true)}
            className="btn bg-white text-[#006B3F] hover:bg-emerald-50 border-0 font-semibold text-xs sm:text-sm shadow-md cursor-pointer flex items-center gap-1.5 px-4 py-2"
          >
            <span>➕</span>
            <span>Create Community</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("Feed");
              window.scrollTo({ top: 220, behavior: "smooth" });
            }}
            className="btn bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 px-3.5 py-2"
          >
            <span>✍️</span>
            <span>New Discussion</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-2">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "Feed", label: "💬 Feed & Discussions", count: posts.length },
            { id: "Communities", label: "🏛️ Community Circles", count: communities.length },
            { id: "Questions", label: "❓ Q&A Forum", count: posts.filter((p) => p.type === "question").length },
            { id: "Meetups", label: "📅 Live Gatherings", count: gatherings.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-[#006B3F] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Global Search Input */}
        <div className="relative sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search discussions, circles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006B3F]"
          />
        </div>
      </div>

      {/* Tab 1: Feed */}
      {activeTab === "Feed" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Rich Post Composer */}
            <div className="card rounded-2xl p-5 border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-600">Compose:</span>
                <div className="flex gap-1.5">
                  {[
                    { id: "post", icon: "💬", label: "Discussion" },
                    { id: "question", icon: "❓", label: "Ask Question" },
                    { id: "poll", icon: "📊", label: "Live Poll" },
                    { id: "announcement", icon: "📢", label: "Announcement" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setComposerType(t.id)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                        composerType === t.id
                          ? "bg-emerald-50 text-[#006B3F] border border-emerald-300 font-semibold"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel Selector */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] text-slate-500 font-medium">Post to Channel:</span>
                <select
                  value={composerChannel}
                  onChange={(e) => setComposerChannel(e.target.value)}
                  className="text-xs py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-[#006B3F]"
                >
                  {communities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <input
                type="text"
                placeholder={
                  composerType === "question"
                    ? "What is your question? (e.g., Best practices for Masters scholarships?)"
                    : composerType === "poll"
                    ? "Poll Subject / Discussion Topic"
                    : "Post Title / Subject"
                }
                value={composerTitle}
                onChange={(e) => setComposerTitle(e.target.value)}
                className="input w-full text-xs sm:text-sm font-medium py-2 mb-2.5 border-slate-200"
              />

              {/* Body Textarea */}
              <textarea
                rows={3}
                placeholder={
                  composerType === "question"
                    ? "Describe the context, your current approach, and what guidance you are seeking from seniors..."
                    : composerType === "poll"
                    ? "Provide context or background details for voters..."
                    : "Share project ideas, professional achievements, industry trends, or announcements..."
                }
                value={composerBody}
                onChange={(e) => setComposerBody(e.target.value)}
                className="input resize-none w-full text-xs sm:text-sm py-2 mb-3 border-slate-200"
              />

              {/* Live Poll Option Fields */}
              {composerType === "poll" && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-3 space-y-2.5">
                  <p className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>📊 Poll Options (2 to 4 options)</span>
                    <span className="text-[10px] text-slate-500">Live voting enabled</span>
                  </p>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                      <input
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...pollOptions];
                          updated[idx] = e.target.value;
                          setPollOptions(updated);
                        }}
                        className="input text-xs flex-1 py-1.5"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 text-xs px-1.5 cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  {pollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={() => setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`])}
                      className="text-xs text-[#006B3F] hover:underline font-semibold cursor-pointer pt-1 flex items-center gap-1"
                    >
                      <span>➕ Add Option</span>
                    </button>
                  )}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2">
                <input
                  type="text"
                  placeholder="Tags (e.g. AI, Career, PUST)"
                  value={composerTags}
                  onChange={(e) => setComposerTags(e.target.value)}
                  className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 sm:w-56"
                />

                <button
                  onClick={handleCreatePost}
                  disabled={isSubmittingPost || (!composerTitle.trim() && !composerBody.trim())}
                  className="btn btn-primary btn-sm px-5 cursor-pointer disabled:opacity-50 text-xs font-medium"
                >
                  {isSubmittingPost ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </div>

            {/* Channel Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                Channel:
              </span>
              <button
                onClick={() => setSelectedChannelFilter("All")}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors shrink-0 ${
                  selectedChannelFilter === "All"
                    ? "bg-[#0F172A] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Channels
              </button>
              {communities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChannelFilter(c.name)}
                  className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors shrink-0 flex items-center gap-1 ${
                    selectedChannelFilter === c.name
                      ? "bg-[#006B3F] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>

            {/* Posts Feed List */}
            {filteredPosts.length === 0 ? (
              <div className="card rounded-2xl p-10 text-center text-slate-500 bg-white border border-slate-200">
                <p className="text-3xl mb-2">🌿</p>
                <p className="font-semibold text-slate-700">কোন আলোচনা পাওয়া যায়নি</p>
                <p className="text-xs text-slate-400 mt-1">প্রথম পোস্ট বা প্রশ্ন লিখে আলোচনা শুরু করুন!</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="card rounded-2xl p-5 border border-slate-200 bg-white shadow-sm relative transition-all hover:border-slate-300">
                  {/* Post Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={post.avatar || createInitialsAvatar(post.author, "alumni")}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#0F172A] text-sm truncate">
                          {post.author}
                        </p>
                        <span
                          className={`badge text-[10px] px-2 py-0.5 ${
                            post.type === "question"
                              ? "badge-purple"
                              : post.type === "announcement"
                              ? "badge-gold"
                              : post.type === "poll"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "badge-gray"
                          }`}
                        >
                          {post.type === "poll" ? "📊 Live Poll" : post.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span>{post.dept || post.batch}</span>
                        <span>•</span>
                        <span className="text-[#006B3F] font-medium">{post.channel}</span>
                        <span>•</span>
                        <span>{post.time}</span>
                      </p>
                    </div>

                    {/* 3-dots Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-md text-sm cursor-pointer"
                      >
                        ⋯
                      </button>
                      {activeMenuId === post.id && (
                        <div className="absolute right-0 top-7 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 text-xs">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              showToast("পোস্টটি বুকমার্কে সেভ করা হয়েছে!");
                            }}
                            className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                          >
                            <span>🔖</span> <span>Save Post</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleSharePost(post);
                            }}
                            className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                          >
                            <span>🔗</span> <span>Copy Link</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              showToast("রিপোর্ট এডমিনের কাছে পাঠানো হয়েছে");
                            }}
                            className="w-full text-left px-3.5 py-1.5 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-2"
                          >
                            <span>⚠️</span> <span>Report Post</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Body */}
                  {post.title && (
                    <h3 className="font-semibold text-[#0F172A] text-sm sm:text-base mb-2">
                      {post.title}
                    </h3>
                  )}
                  <p className="text-[#334155] text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-line">
                    {post.body || post.content}
                  </p>

                  {/* Interactive Poll Component */}
                  {post.poll && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <span>📊</span> <span>{post.poll.question || "Poll"}</span>
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {post.poll.totalVotes || 0} votes
                        </span>
                      </div>

                      <div className="space-y-2 pt-1">
                        {(post.poll.options || []).map((opt) => {
                          const total = post.poll.totalVotes || 1;
                          const pct = Math.round(((opt.votes || 0) / (total === 0 ? 1 : total)) * 100);
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleVotePoll(post.id, opt.id)}
                              className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#006B3F] transition-all relative overflow-hidden group cursor-pointer"
                            >
                              <div
                                className="absolute top-0 left-0 bottom-0 bg-emerald-100/60 transition-all duration-500 rounded-lg pointer-events-none"
                                style={{ width: `${pct}%` }}
                              ></div>
                              <div className="relative flex items-center justify-between text-xs z-10">
                                <span className="font-medium text-slate-800 flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-[#006B3F] flex items-center justify-center text-[10px]">
                                    ✓
                                  </span>
                                  {opt.text}
                                </span>
                                <span className="font-semibold text-slate-600">
                                  {pct}% ({opt.votes || 0})
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center gap-5 pt-3 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                        post.liked ? "text-rose-600 font-semibold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="text-base">{post.liked ? "❤️" : "🤍"}</span>
                      <span>{post.likes || 0}</span>
                    </button>

                    <button
                      onClick={() =>
                        setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                      }
                      className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
                    >
                      <span className="text-base">💬</span>
                      <span>
                        {(post.commentList || []).length || post.comments || 0}{" "}
                        {post.comments === 1 ? "comment" : "comments"}
                      </span>
                    </button>

                    <button
                      onClick={() => handleSharePost(post)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 cursor-pointer font-medium ml-auto"
                    >
                      <span>↗️</span>
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Expandable Inline Comment Thread */}
                  {expandedComments[post.id] && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-[#F8FAFC] -mx-5 -mb-5 p-5 rounded-b-2xl">
                      <div className="space-y-2">
                        {(post.commentList || []).length === 0 ? (
                          <p className="text-xs text-slate-400 py-1">এখনো কোন মন্তব্য করা হয়নি। আপনার মতামত শেয়ার করুন!</p>
                        ) : (
                          (post.commentList || []).map((c) => (
                            <div key={c.id || Math.random()} className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                              <div className="flex items-center justify-between font-semibold text-[#0F172A] mb-1">
                                <span className="flex items-center gap-1.5">
                                  <span>👤</span>
                                  <span>{c.author}</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-normal">{c.time}</span>
                              </div>
                              <p className="text-slate-600 leading-relaxed pl-5">{c.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Write a constructive comment or advice…"
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(post.id);
                          }}
                          className="input text-xs flex-1 py-1.5 border-slate-300"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="btn btn-primary btn-sm text-xs cursor-pointer px-4"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Right Sidebar Widgets */}
          <div className="space-y-5">
            {/* User Profile Card in Community */}
            <div className="card rounded-2xl p-5 border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={currentUser?.avatar || createInitialsAvatar(currentUser?.name || "Dr. Rafiqul Islam", "alumni")}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[#0F172A] truncate">
                    {currentUser?.name || "Dr. Rafiqul Islam"}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {currentUser?.dept || "Computer Science"} · {currentUser?.batch || "2008"}
                  </p>
                  <span className="badge badge-green text-[9px] mt-0.5">Active Community Member</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-center">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <p className="text-base font-bold text-[#006B3F]">{joinedCommunityIds.size}</p>
                  <p className="text-[10px] text-slate-500">Joined Circles</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <p className="text-base font-bold text-[#1B4F8A]">
                    {posts.filter((p) => p.author === (currentUser?.name || "Dr. Rafiqul Islam")).length || 3}
                  </p>
                  <p className="text-[10px] text-slate-500">Discussions</p>
                </div>
              </div>
            </div>

            {/* Quick Action: Create Community CTA */}
            <div className="card rounded-2xl p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm">
              <span className="text-3xl">🚀</span>
              <h4 className="font-bold text-[#006B3F] text-sm mt-2 mb-1">
                Start Your Own Community
              </h4>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                আপনার ব্যাচ, জেলা ফোরাম, রিসার্চ ল্যাব বা প্রফেশনাল স্পেশালাইজেশনের জন্য একটি নতুন কমিউনিটি সার্কেল চালু করুন।
              </p>
              <button
                onClick={() => setIsCreateCommunityOpen(true)}
                className="btn btn-primary btn-sm w-full text-xs cursor-pointer shadow-sm"
              >
                + Create New Community
              </button>
            </div>

            {/* Joined Communities Quick Filter */}
            <div className="card rounded-2xl p-5 border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#0F172A] text-sm">
                  Your Circles ({joinedCommunityIds.size})
                </h3>
                <button
                  onClick={() => setActiveTab("Communities")}
                  className="text-xs text-[#006B3F] hover:underline font-medium cursor-pointer"
                >
                  Explore All
                </button>
              </div>

              <div className="space-y-2.5">
                {communities
                  .filter((c) => joinedCommunityIds.has(c.id))
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedChannelFilter(item.name);
                        setActiveTab("Feed");
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#0F172A] truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {item.membersCount?.toLocaleString()} members · {item.postsCount || 0} posts
                        </p>
                      </div>
                      <span className="text-xs text-slate-300">›</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Live Activity Ticker */}
            <div className="card rounded-2xl p-5 border border-slate-200 bg-white shadow-sm">
              <h3 className="font-semibold text-[#0F172A] text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live Activity Stream</span>
              </h3>
              <div className="space-y-3">
                {liveActivities.map((act) => (
                  <div key={act.id} className="text-xs flex items-start gap-2 text-slate-600">
                    <span className="text-sm shrink-0">{act.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="leading-snug">{act.text}</p>
                      <span className="text-[10px] text-slate-400">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Communities Directory */}
      {activeTab === "Communities" && (
        <div className="space-y-5">
          {/* Create CTA Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl gap-4">
            <div>
              <h3 className="font-bold text-lg">PUST Institutional & Interest Chapters</h3>
              <p className="text-xs text-slate-300 max-w-xl mt-0.5">
                Browse official university departmental chapters, career societies, and international alumni associations. Join existing circles or establish your own.
              </p>
            </div>
            <button
              onClick={() => setIsCreateCommunityOpen(true)}
              className="btn bg-[#006B3F] hover:bg-emerald-600 text-white border-0 text-xs sm:text-sm font-semibold shrink-0 cursor-pointer shadow-lg px-4 py-2"
            >
              ➕ Create Community
            </button>
          </div>

          {/* Communities Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCommunities.map((item) => {
              const isJoined = joinedCommunityIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className="card rounded-2xl p-5 border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-all hover:border-[#006B3F]/30"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200">
                        {item.icon}
                      </div>
                      <span className="badge badge-gray text-[10px] font-medium">
                        {item.category || "General"}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#0F172A] text-sm sm:text-base mb-1.5 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {(item.tags || []).slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 pt-3 border-t border-slate-100">
                      <span>👥 {item.membersCount?.toLocaleString()} members</span>
                      <span>•</span>
                      <span>📝 {item.postsCount || 0} posts</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleJoin(item)}
                      className={`btn btn-sm flex-1 cursor-pointer text-xs font-semibold ${
                        isJoined
                          ? "btn-ghost text-[#006B3F] border border-emerald-300 bg-emerald-50/50"
                          : "btn-primary"
                      }`}
                    >
                      {isJoined ? "✓ Joined" : "Join Community"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedChannelFilter(item.name);
                        setActiveTab("Feed");
                      }}
                      className="btn btn-outline btn-sm text-xs cursor-pointer"
                      title="View channel feed"
                    >
                      Feed ›
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Questions Forum */}
      {activeTab === "Questions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="font-bold text-lg text-[#0F172A]">Student & Alumni Q&A Forum</h2>
              <p className="text-xs text-slate-500">Ask career, technical, or higher study questions directly to senior alumni.</p>
            </div>
            <button
              onClick={() => {
                setComposerType("question");
                setActiveTab("Feed");
                window.scrollTo({ top: 200, behavior: "smooth" });
              }}
              className="btn btn-primary btn-sm text-xs cursor-pointer"
            >
              + Ask Question
            </button>
          </div>

          {posts
            .filter((p) => p.type === "question")
            .map((item) => (
              <div key={item.id} className="card rounded-2xl p-5 border border-slate-200 bg-white shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={item.avatar || createInitialsAvatar(item.author, "student")}
                    alt={item.author}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#0F172A] text-sm">
                        {item.author}
                      </p>
                      <span className="badge badge-purple text-[9px]">
                        Question
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {item.batch || item.dept} · in <span className="text-[#006B3F] font-medium">{item.channel}</span> · {item.time}
                    </p>
                  </div>
                </div>

                {item.title && (
                  <h4 className="font-bold text-sm text-[#0F172A]">
                    {item.title}
                  </h4>
                )}

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {item.body || item.content}
                </p>

                {/* Answers List */}
                {(item.commentList || []).length > 0 && (
                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>Answers & Advice ({item.commentList.length}):</span>
                    </p>
                    {item.commentList.map((ans) => (
                      <div key={ans.id || Math.random()} className="text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between font-semibold text-[#0F172A] mb-1">
                          <span className="text-[#1B4F8A]">{ans.author}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{ans.time}</span>
                        </div>
                        <p className="text-slate-600">{ans.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer Composer Accordion */}
                {answeringQuestionId === item.id ? (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <textarea
                      rows={3}
                      value={answerInputText}
                      onChange={(e) => setAnswerInputText(e.target.value)}
                      placeholder="Share your practical experience, code samples, or scholarship guidance..."
                      className="input text-xs w-full border-slate-300"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setAnsweringQuestionId(null);
                          setAnswerInputText("");
                        }}
                        className="btn btn-ghost btn-sm text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAnswerQuestion(item.id)}
                        className="btn btn-primary btn-sm text-xs cursor-pointer"
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleLike(item.id)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{item.liked ? "❤️" : "🤍"}</span>
                      <span>{item.likes || 0} Helpful</span>
                    </button>
                    <button
                      onClick={() => {
                        setAnsweringQuestionId(item.id);
                        setAnswerInputText("");
                      }}
                      className="btn btn-outline btn-sm text-xs cursor-pointer"
                    >
                      ✍️ Answer this Question
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Tab 4: Meetups & Live Gatherings */}
      {activeTab === "Meetups" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-[#0F172A]">Community Gatherings & Virtual Meetups</h2>
              <p className="text-xs text-slate-500">Official Zoom AMA sessions, chapter assemblies, and nationwide alumni reunions.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {gatherings.map((g) => {
              const isRsvped = rsvpSet.has(g.id);
              const calUrl = generateGoogleCalendarUrl({
                title: g.title,
                details: g.desc,
                location: g.loc,
              });

              return (
                <div key={g.id} className="card rounded-2xl p-5 border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{g.icon}</span>
                      <span className="badge badge-green text-[10px]">
                        {g.registered || 0} / {g.seats} Seats Confirmed
                      </span>
                    </div>

                    <h3 className="font-bold text-[#0F172A] text-base mb-1.5">
                      {g.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {g.desc}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span className="font-medium text-slate-800">{g.date} at {g.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{g.loc}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleRsvp(g)}
                        className={`btn btn-sm flex-1 cursor-pointer text-xs font-semibold ${
                          isRsvped
                            ? "btn-ghost text-[#006B3F] border border-emerald-300 bg-emerald-50/50"
                            : "btn-primary"
                        }`}
                      >
                        {isRsvped ? "✓ Attending (RSVP Confirmed)" : "Confirm RSVP"}
                      </button>

                      {g.meetLink && (
                        <a
                          href={g.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline btn-sm text-xs cursor-pointer"
                        >
                          Join Meet
                        </a>
                      )}
                    </div>

                    <a
                      href={calUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center text-[11px] text-[#006B3F] hover:underline font-medium pt-1"
                    >
                      + Add to Google Calendar
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Create New Community */}
      {isCreateCommunityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2">
                <span>➕</span> <span>Create New Community Circle</span>
              </h3>
              <button
                onClick={() => setIsCreateCommunityOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCommunitySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Community Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Machine Learning Researchers"
                  value={newCommunityForm.name}
                  onChange={(e) => setNewCommunityForm({ ...newCommunityForm, name: e.target.value })}
                  className="input w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCommunityForm.category}
                    onChange={(e) => setNewCommunityForm({ ...newCommunityForm, category: e.target.value })}
                    className="input w-full text-xs"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Research">Research & Science</option>
                    <option value="Business">Business & Finance</option>
                    <option value="Humanities">Humanities & Social</option>
                    <option value="Career & Students">Career & Students</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="International">International Chapters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department Affiliation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSE or All Departments"
                    value={newCommunityForm.dept}
                    onChange={(e) => setNewCommunityForm({ ...newCommunityForm, dept: e.target.value })}
                    className="input w-full text-xs"
                  />
                </div>
              </div>

              {/* Emoji Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose Community Icon:
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {["💻", "🚀", "🤖", "🧪", "📐", "📋", "📜", "🌿", "🎓", "🌍", "🎨", "💡", "⚡", "🩺", "📊"].map(
                    (emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewCommunityForm({ ...newCommunityForm, icon: emoji })}
                        className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${
                          newCommunityForm.icon === emoji
                            ? "bg-white shadow-md border-2 border-[#006B3F]"
                            : "hover:bg-white"
                        }`}
                      >
                        {emoji}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mission & Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the purpose of this community, who should join, and discussion topics..."
                  value={newCommunityForm.desc}
                  onChange={(e) => setNewCommunityForm({ ...newCommunityForm, desc: e.target.value })}
                  className="input w-full text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Privacy Setting
                  </label>
                  <select
                    value={newCommunityForm.privacy}
                    onChange={(e) => setNewCommunityForm({ ...newCommunityForm, privacy: e.target.value })}
                    className="input w-full text-xs"
                  >
                    <option value="Public">Public (Anyone can view & join)</option>
                    <option value="Verified Alumni Only">Verified Alumni Only</option>
                    <option value="Private">Private / Moderated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="AI, Cloud, Python"
                    value={newCommunityForm.tags}
                    onChange={(e) => setNewCommunityForm({ ...newCommunityForm, tags: e.target.value })}
                    className="input w-full text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateCommunityOpen(false)}
                  className="btn btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCommunity}
                  className="btn btn-primary text-xs cursor-pointer px-5"
                >
                  {isCreatingCommunity ? "Establishing Circle..." : "Establish Community"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
