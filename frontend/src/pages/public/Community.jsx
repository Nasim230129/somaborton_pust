import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Ia, La, za, Ha, Ua, Wa, Ka, qa, Xa, Qa, createInitialsAvatar } from "../../data/mockData";
import { api, getCurrentUser, useBackendSync } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";
import { getSocket, initSocket } from "../../services/socket";

// Default institutional community circles
const INITIAL_COMMUNITY_GROUPS = [
  {
    id: 1,
    icon: "💻",
    name: "CSE & Tech Alumni Circle",
    category: "Technology",
    desc: "A collaborative hub for CSE, EEE, ICE, and technology graduates to share opportunities, open-source projects, and industry insights.",
    membersCount: 3840,
    postsCount: 124,
    onlineCount: 42,
    tags: ["Software", "AI/ML", "Cloud", "Networking"],
    img: qa,
    privacy: "Public",
    creator: { name: "Dr. Rafiqul Islam", role: "alumni", dept: "CSE" },
  },
  {
    id: 2,
    icon: "📐",
    name: "Engineering & Architecture Chapter",
    category: "Engineering",
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
    desc: "BBA and THM alumni networking around venture capital, supply chain leadership, enterprise strategy, and startup acceleration.",
    membersCount: 1920,
    postsCount: 73,
    onlineCount: 31,
    tags: ["BBA", "Startups", "Fintech", "Tourism"],
    img: La,
    privacy: "Public",
    creator: { name: "Tahmid Chowdhury", role: "alumni", dept: "BBA" },
  },
  {
    id: 5,
    icon: "📜",
    name: "Humanities & Social Sciences Guild",
    category: "Humanities",
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
    category: "Environment",
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
const INITIAL_DISCUSSIONS = [
  {
    id: 1,
    channel: "CSE & Tech Alumni Circle",
    cat: "Career",
    type: "post",
    title: "Key technological skills needed for Bangladesh software engineers in 2026–2027?",
    body: "As distributed cloud services and LLMs become standard, junior developers often wonder which stack gives the strongest edge in both domestic tech firms and remote global contracts.",
    author: "Tanvir Ahmed",
    dept: "CSE '22",
    time: "2h ago",
    likes: 88,
    likedBy: [],
    userLiked: false,
    replies: [
      {
        author: "Dr. Rafiqul Islam",
        dept: "CSE '08",
        time: "1h ago",
        text: "Cloud native architecture and distributed systems fundamentals will set junior engineers apart from simple framework users.",
      },
      {
        author: "Nusrat Jahan",
        dept: "EEE '12",
        time: "45m ago",
        text: "Domain knowledge in fintech and telecom protocols is in massive demand locally as well.",
      },
    ],
  },
  {
    id: 2,
    channel: "Science & Pharmaceutical Research",
    cat: "Research",
    type: "announcement",
    title: "Looking for PUST alumni co-authors for a peer-reviewed paper on Renewable Energy microgrids",
    body: "Our lab team is finalizing empirical simulation data on hybrid solar-battery arrays for northwestern Bangladesh. Welcoming alumni researchers in EEE, Physics, and ICE to review methodology and co-author.",
    author: "Dr. Nasrin Akter",
    dept: "ICE (Faculty)",
    time: "5h ago",
    likes: 41,
    likedBy: [],
    userLiked: false,
    replies: [
      {
        author: "Zahid Hasan",
        dept: "EEE '16",
        time: "3h ago",
        text: "I am working on solar battery inverters at BPDB. Would love to contribute operational data from northern plants.",
      },
    ],
  },
  {
    id: 3,
    channel: "CSE & Tech Alumni Circle",
    cat: "Poll",
    type: "poll",
    title: "Community Poll: Which backend ecosystem does your engineering team rely on in 2026?",
    body: "Let's benchmark industry stack adoption across the PUST tech network.",
    author: "Dr. Rafiqul Islam",
    dept: "CSE '08",
    time: "1d ago",
    likes: 124,
    likedBy: [],
    userLiked: false,
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
    replies: [
      {
        author: "Tahmid Chowdhury",
        dept: "BBA '15",
        time: "18h ago",
        text: "At Shopify we run high-concurrency gateway layers on Go, backed by Kafka pipelines.",
      },
    ],
  },
  {
    id: 4,
    channel: "Business & Entrepreneurship Hub",
    cat: "Entrepreneurship",
    type: "post",
    title: "Bootstrapping an agritech supply startup after PUST — lessons from 3 years in the field",
    body: "From cold-storage logistics in Ishwardi to retail markets in Dhaka, here are 5 critical things our team learned about farmer credit, payment delays, and digital transparency.",
    author: "Rahnuma Islam",
    dept: "BBA '20",
    time: "2d ago",
    likes: 176,
    likedBy: [],
    userLiked: false,
    replies: [],
  },
  {
    id: 5,
    channel: "Freshers & Young Graduates Forum",
    cat: "Mentorship",
    type: "question",
    title: "Transitioning from undergraduate degree to international Ph.D. scholarships — AMA",
    body: "Final year students and recent graduates: feel free to ask about GRE preparation, contacting professors in Germany and the USA, and crafting a competitive statement of purpose.",
    author: "Mahfuz Khan",
    dept: "MATH '23",
    time: "3d ago",
    likes: 63,
    likedBy: [],
    userLiked: false,
    replies: [],
  },
];

const INITIAL_GATHERINGS = [
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

function downloadIcsFile({ title, description, location, startTime }) {
  const formatTime = (iso) => (iso ? new Date(iso).toISOString().replace(/-|:|\.\d\d\d/g, "") : "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PUST Alumni Network//Community Gatherings//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${formatTime(startTime)}`,
    `DTEND:${formatTime(new Date(new Date(startTime).getTime() + 90 * 60000).toISOString())}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `pust-gathering-${Date.now()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Community() {
  useBackendSync();
  usePageMeta(
    "Alumni Community & Circles — Real-Time Discussions & Chapters",
    "Join PUST interest groups, alumni chapters, and participate in scholarly and professional discussions with alumni worldwide."
  );

  const currentUser = getCurrentUser();

  // State
  const [activeTab, setActiveTab] = useState("groups"); // 'groups' | 'feed' | 'gatherings'
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCommunityFilter, setSelectedCommunityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Backend Data
  const [communities, setCommunities] = useState(INITIAL_COMMUNITY_GROUPS);
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
  const [gatherings, setGatherings] = useState(INITIAL_GATHERINGS);
  const [joinedCommunityIds, setJoinedCommunityIds] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_joined_communities");
      const parsed = stored ? JSON.parse(stored) : [1, 8];
      return new Set(Array.isArray(parsed) ? parsed : [1, 8]);
    } catch (e) {
      return new Set([1, 8]);
    }
  });

  const [stats, setStats] = useState({
    totalMembers: 22400,
    totalPosts: 1200,
    totalCommunities: 8,
    onlineNow: 148,
  });

  // Real-time live activity stream
  const [liveActivities, setLiveActivities] = useState([
    {
      id: 1,
      text: "🎉 Dr. Rafiqul Islam posted a new survey in 'CSE & Tech Alumni Circle'",
      time: "5 mins ago",
      icon: "📊",
    },
    {
      id: 2,
      text: "⚡ 18 members RSVP'd for 'PUST Inter-Batch Alumni Quiz Night'",
      time: "20 mins ago",
      icon: "🏆",
    },
    {
      id: 3,
      text: "🌟 Engr. Mahmudul Hasan created a new sub-group 'PUST Smart City Innovation'",
      time: "1 hr ago",
      icon: "🚀",
    },
    {
      id: 4,
      text: "💬 12 comments added to 'Renewable Energy Co-Authorship call'",
      time: "2 hrs ago",
      icon: "💬",
    },
  ]);

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

  // Create Post / Poll Modal State
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [postComposer, setPostComposer] = useState({
    type: "post", // 'post' | 'question' | 'poll' | 'announcement'
    channel: "CSE & Tech Alumni Circle",
    title: "",
    body: "",
    tags: "Discussion, PUST",
    pollQuestion: "",
    pollOptions: ["Option 1", "Option 2"],
  });
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Thread Discussion View Modal
  const [activeThread, setActiveThread] = useState(null);
  const [replyInput, setReplyInput] = useState("");

  // Gathering RSVP Modal
  const [rsvpGathering, setRsvpGathering] = useState(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Video State
  const [isMuted, setIsMuted] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const videoRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Fetch initial community data from backend
  const loadCommunityData = async () => {
    try {
      const res = await api.getCommunity();
      if (res && res.ok) {
        if (Array.isArray(res.communities) && res.communities.length > 0) {
          // Merge with initial defaults without losing custom created ones
          const map = new Map();
          INITIAL_COMMUNITY_GROUPS.forEach((c) => map.set(c.id, c));
          res.communities.forEach((c) => map.set(c.id, { ...(map.get(c.id) || {}), ...c }));
          setCommunities(Array.from(map.values()));
        }
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Merge posts
          const map = new Map();
          INITIAL_DISCUSSIONS.forEach((d) => map.set(d.id, d));
          res.data.forEach((p) => {
            const mapped = {
              id: p.id,
              channel: p.channel || "General",
              cat: p.tags?.[0] || "Discussion",
              type: p.type || "post",
              title: p.title,
              body: p.body,
              author: typeof p.author === "object" ? p.author.name : p.author || "PUST Member",
              dept: typeof p.author === "object" ? p.author.dept : "PUST",
              time: p.time || "Recently",
              likes: p.likes || 0,
              likedBy: p.likedBy || [],
              userLiked: Array.isArray(p.likedBy) && p.likedBy.includes(String(currentUser?.id || 1)),
              poll: p.poll || null,
              replies: Array.isArray(p.commentList)
                ? p.commentList.map((c) => ({
                    author: c.author,
                    dept: "Alumni",
                    time: c.time,
                    text: c.text,
                  }))
                : [],
            };
            map.set(p.id, mapped);
          });
          setDiscussions(Array.from(map.values()));
        }
        if (Array.isArray(res.gatherings) && res.gatherings.length > 0) {
          setGatherings(res.gatherings);
        }
        if (res.stats) {
          setStats((prev) => ({ ...prev, ...res.stats }));
        }
      }
    } catch (err) {
      console.debug("Community load notice:", err.message);
    }
  };

  useEffect(() => {
    loadCommunityData();
    const interval = setInterval(loadCommunityData, 12000);
    return () => clearInterval(interval);
  }, []);

  // Socket.IO Real-Time Event Subscriptions
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
      showToast(`🎉 New community established: "${newGroup.name}"!`);
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
      showToast(`💬 New discussion posted in ${newPost.channel}`);
      loadCommunityData();
    };

    const onCommentAdded = ({ postId, comment }) => {
      setDiscussions((prev) =>
        prev.map((d) => {
          if (d.id === postId) {
            return {
              ...d,
              replies: [...(d.replies || []), { author: comment.author, text: comment.text, time: comment.time }],
            };
          }
          return d;
        })
      );
      if (activeThread && activeThread.id === postId) {
        setActiveThread((prev) => ({
          ...prev,
          replies: [...(prev.replies || []), { author: comment.author, text: comment.text, time: comment.time }],
        }));
      }
    };

    const onPostLiked = ({ postId, likes }) => {
      setDiscussions((prev) => prev.map((d) => (d.id === postId ? { ...d, likes } : d)));
      if (activeThread && activeThread.id === postId) {
        setActiveThread((prev) => ({ ...prev, likes }));
      }
    };

    const onPollVoted = ({ postId, poll }) => {
      setDiscussions((prev) => prev.map((d) => (d.id === postId ? { ...d, poll } : d)));
      if (activeThread && activeThread.id === postId) {
        setActiveThread((prev) => ({ ...prev, poll }));
      }
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
          text: act.title ? `${act.author} posted in ${act.channel}: "${act.title}"` : `Activity in ${act.channel || "PUST Community"}`,
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
  }, [activeThread]);

  // Video Controls
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleFullscreenCinema = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen().catch(() => setIsTheaterMode(true));
      } else {
        setIsTheaterMode(true);
      }
    } else {
      setIsTheaterMode(true);
    }
  };

  // Filtered Communities
  const filteredCommunities = useMemo(() => {
    return communities.filter((grp) => {
      if (selectedCategory !== "All" && grp.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        grp.name.toLowerCase().includes(q) ||
        grp.desc.toLowerCase().includes(q) ||
        (grp.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [communities, selectedCategory, searchQuery]);

  // Filtered Discussions
  const filteredDiscussions = useMemo(() => {
    return discussions.filter((disc) => {
      if (selectedCommunityFilter !== "All" && disc.channel !== selectedCommunityFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        (disc.title || "").toLowerCase().includes(q) ||
        (disc.body || "").toLowerCase().includes(q) ||
        (disc.author || "").toLowerCase().includes(q) ||
        (disc.cat || "").toLowerCase().includes(q)
      );
    });
  }, [discussions, selectedCommunityFilter, searchQuery]);

  // Toggle Community Membership
  const handleToggleJoin = async (group, e) => {
    if (e) e.stopPropagation();
    const isMember = joinedCommunityIds.has(group.id);
    const updatedSet = new Set(joinedCommunityIds);

    if (isMember) {
      updatedSet.delete(group.id);
      showToast(`${group.name} থেকে ত্যাগ করা হয়েছে`);
    } else {
      updatedSet.add(group.id);
      showToast(`🎉 ${group.name}-এ আপনি সফলভাবে যুক্ত হয়েছেন!`);
    }

    setJoinedCommunityIds(updatedSet);
    localStorage.setItem("pust_joined_communities", JSON.stringify(Array.from(updatedSet)));

    try {
      await api.joinCommunityGroup(group.id, currentUser?.id || 1);
    } catch (err) {
      console.debug("Join community API sync notice:", err);
    }
  };

  // Like a post
  const handleToggleLike = async (discId, e) => {
    if (e) e.stopPropagation();
    setDiscussions((prev) =>
      prev.map((disc) => {
        if (disc.id === discId) {
          const nextLiked = !disc.userLiked;
          return {
            ...disc,
            userLiked: nextLiked,
            likes: nextLiked ? (disc.likes || 0) + 1 : Math.max(0, (disc.likes || 1) - 1),
          };
        }
        return disc;
      })
    );

    if (activeThread && activeThread.id === discId) {
      setActiveThread((prev) => ({
        ...prev,
        userLiked: !prev.userLiked,
        likes: !prev.userLiked ? (prev.likes || 0) + 1 : Math.max(0, (prev.likes || 1) - 1),
      }));
    }

    try {
      await api.likeCommunityPost(discId, currentUser?.id || 1);
    } catch (err) {
      console.debug("Like post notice:", err);
    }
  };

  // Vote on a Poll Option
  const handleVotePoll = async (postId, optionId, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.voteCommunityPoll(postId, optionId);
      if (res && res.ok && res.poll) {
        setDiscussions((prev) => prev.map((d) => (d.id === postId ? { ...d, poll: res.poll } : d)));
        if (activeThread && activeThread.id === postId) {
          setActiveThread((prev) => ({ ...prev, poll: res.poll }));
        }
        showToast("✓ ভোট গ্রহণ করা হয়েছে!");
      }
    } catch (err) {
      // Offline fallback
      setDiscussions((prev) =>
        prev.map((d) => {
          if (d.id === postId && d.poll) {
            const updatedOpts = d.poll.options.map((opt) =>
              opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
            );
            return {
              ...d,
              poll: { ...d.poll, totalVotes: (d.poll.totalVotes || 0) + 1, options: updatedOpts },
            };
          }
          return d;
        })
      );
      showToast("✓ ভোট গ্রহণ করা হয়েছে!");
    }
  };

  // Post Reply to Discussion
  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeThread) return;

    const user = getCurrentUser();
    const commentPayload = {
      author: user?.name || "Dr. Rafiqul Islam",
      avatar: user?.avatar || createInitialsAvatar(user?.name || "Dr. Rafiqul Islam", "alumni"),
      text: replyInput.trim(),
    };

    const newReplyItem = {
      author: commentPayload.author,
      dept: user?.dept || "Alumni",
      time: "Just now",
      text: commentPayload.text,
    };

    const updatedThread = {
      ...activeThread,
      replies: [...(activeThread.replies || []), newReplyItem],
    };

    setActiveThread(updatedThread);
    setDiscussions((prev) => prev.map((d) => (d.id === activeThread.id ? updatedThread : d)));
    setReplyInput("");

    try {
      await api.commentCommunityPost(activeThread.id, commentPayload);
      showToast("মন্তব্য সফলভাবে যোগ করা হয়েছে!");
    } catch (err) {
      showToast("মন্তব্য সফলভাবে যোগ করা হয়েছে!");
    }
  };

  // Create New Community Group
  const handleCreateCommunitySubmit = async (e) => {
    e.preventDefault();
    if (!newCommunityForm.name.trim()) return;

    setIsCreatingCommunity(true);
    try {
      const user = getCurrentUser();
      const tagsArr = newCommunityForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await api.createCommunityGroup({
        name: newCommunityForm.name.trim(),
        desc: newCommunityForm.desc.trim(),
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
      });

      if (res && res.ok && res.data) {
        setCommunities([res.data, ...communities]);
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

  // Create New Post / Poll / Question
  const handleCreatePostSubmit = async (e) => {
    e.preventDefault();
    if (!postComposer.title.trim()) return;

    setIsSubmittingPost(true);
    try {
      const user = getCurrentUser();
      const tagsArr = postComposer.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      let pollData = null;
      if (postComposer.type === "poll" && postComposer.pollQuestion.trim()) {
        pollData = {
          question: postComposer.pollQuestion.trim(),
          totalVotes: 1,
          options: postComposer.pollOptions
            .filter((o) => o.trim())
            .map((optText, idx) => ({ id: idx + 1, text: optText.trim(), votes: idx === 0 ? 1 : 0 })),
        };
      }

      const res = await api.createCommunityPost({
        channel: postComposer.channel,
        title: postComposer.title.trim(),
        body: postComposer.body.trim(),
        tags: tagsArr,
        type: postComposer.type,
        poll: pollData,
        author: user || { name: "Dr. Rafiqul Islam", role: "alumni", dept: "CSE" },
      });

      if (res && res.ok && res.data) {
        loadCommunityData();
      }

      showToast("🎉 আপনার আলোচনা কমিউনিটিতে পাবলিশ হয়েছে!");
      setIsCreatePostOpen(false);
      setPostComposer({
        type: "post",
        channel: "CSE & Tech Alumni Circle",
        title: "",
        body: "",
        tags: "Discussion, PUST",
        pollQuestion: "",
        pollOptions: ["Option 1", "Option 2"],
      });
      setActiveTab("feed");
    } catch (err) {
      showToast("পোস্ট সফলভাবে পাবলিশ করা হয়েছে!");
      setIsCreatePostOpen(false);
      setActiveTab("feed");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Handle Gathering RSVP
  const handleRsvpSubmit = async (gathering) => {
    setRsvpGathering(gathering);
    setRsvpSuccess(true);
    try {
      await api.rsvpCommunityGathering(gathering.id, currentUser?.id || 1);
    } catch (e) {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C]">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          1. STABLE FULL-PAGE CAMPUS REAL VIEW VIDEO HERO (Facebook Reel: 1647387283748762)
         ========================================================================= */}
      <section
        id="campus-real-view"
        data-no-reveal="true"
        aria-label="PUST Campus Community Video Reel"
        className="relative w-full overflow-hidden bg-black flex flex-col justify-between select-none"
        style={{
          height: "calc(100vh - 116px)",
          minHeight: "520px",
          maxHeight: "860px",
        }}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster="/assets/1778991184DSC05122-DR5DHwQE.jpeg"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-full h-full object-cover"
            style={{ filter: "brightness(0.95) contrast(1.05)" }}
          >
            <source src="/assets/videos/pust_community_reel.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Minimal Floating Top Controls & Real-Time Connection Badge */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 w-full flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-md flex items-center gap-1.5 transition-all ${
                socketConnected
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                  : "bg-black/70 text-amber-300 border-amber-500/40"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${socketConnected ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
              <span>{socketConnected ? "🟢 Live Real-Time Community Active" : "⚡ Synced with Server"}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute sound" : "Mute sound"}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-black/70 hover:bg-black/90 border border-white/25 backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            >
              <span>{isMuted ? "🔇 Unmute" : "🔊 Mute"}</span>
            </button>
            <button
              type="button"
              onClick={handleFullscreenCinema}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#7A1737]/90 hover:bg-[#7A1737] border border-[#C7A76C]/40 backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            >
              <span>⛶ Cinema View</span>
            </button>
          </div>
        </div>

        <div className="flex-1 pointer-events-none" />

        {/* Floating Bottom Navigation */}
        <div className="relative z-20 pb-5 sm:pb-7 text-center pointer-events-none flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("community-main-board");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/85 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-[#C7A76C]/40 backdrop-blur-md shadow-xl transition-all cursor-pointer active:scale-95 ring-1 ring-white/10"
          >
            <span className="text-[#DFCA9E]">🏛️</span>
            <span>Explore 8+ Circles & Join Live Discussions</span>
            <span className="text-sm text-[#DFCA9E]">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. INSTITUTIONAL METRICS RIBBON (Dynamic Live Backend Counts)
         ========================================================================= */}
      <div id="community-main-board" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-2 sm:pt-0 sm:px-4 text-center">
              <p className="font-display font-bold text-2xl sm:text-3xl text-[#DFCA9E] leading-none">
                {stats.totalMembers.toLocaleString()}+
              </p>
              <p className="text-[11px] sm:text-xs mt-2 uppercase tracking-wider text-slate-300 font-semibold">
                Community Members
              </p>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-4 text-center">
              <p className="font-display font-bold text-2xl sm:text-3xl text-emerald-400 leading-none">
                {communities.length}
              </p>
              <p className="text-[11px] sm:text-xs mt-2 uppercase tracking-wider text-slate-300 font-semibold">
                Active Circles & Chapters
              </p>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-4 text-center">
              <p className="font-display font-bold text-2xl sm:text-3xl text-[#DFCA9E] leading-none">
                {stats.totalPosts.toLocaleString()}+
              </p>
              <p className="text-[11px] sm:text-xs mt-2 uppercase tracking-wider text-slate-300 font-semibold">
                Discussions & Polls
              </p>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-4 text-center">
              <p className="font-display font-bold text-2xl sm:text-3xl text-cyan-400 leading-none">
                {stats.onlineNow}+
              </p>
              <p className="text-[11px] sm:text-xs mt-2 uppercase tracking-wider text-slate-300 font-semibold">
                Online Members Now
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. REAL-TIME LIVE ACTIVITY STREAM (Live Ticker)
         ========================================================================= */}
      <div className="bg-[#0D1522] border-b border-[#1E293B] text-slate-200 py-2.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0 bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Community Pulse</span>
          </div>
          <div className="overflow-hidden flex-1 relative whitespace-nowrap">
            <div className="inline-flex gap-8 items-center text-xs text-slate-300 animate-marquee">
              {liveActivities.map((act) => (
                <span key={act.id} className="inline-flex items-center gap-2">
                  <span>{act.icon}</span>
                  <span className="font-medium text-slate-200">{act.text}</span>
                  <span className="text-[10px] text-slate-400">({act.time})</span>
                  <span className="text-slate-600">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. COMMUNITY HEADER & ACTIONS
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] shadow-2xs py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-2 text-[#7A1737]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> · Alumni Circles & Chapters
          </p>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#17263C] mb-3 tracking-tight">
            PUST Global Alumni Communities
          </h1>

          <p className="mb-6 max-w-2xl mx-auto text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Connect by discipline, graduation year, or geographical location. Create your own specialized circle,
            participate in technical discussions, vote in community polls, and meet fellow alumni worldwide.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="max-w-2xl mx-auto relative group bg-[#F8FAFC] p-2 rounded-xl shadow-md border border-[#E2E8F0] focus-within:border-[#7A1737] focus-within:ring-2 focus-within:ring-[#7A1737]/20 flex items-center gap-2 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-white text-[#17263C] flex items-center justify-center font-bold text-base flex-shrink-0 border border-[#E2E8F0]">
              🔍
            </div>
            <input
              type="text"
              placeholder="Search circles, discussion topics, tags, or alumni authors…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-2 py-2 text-xs sm:text-sm text-[#17263C] outline-none bg-transparent placeholder-[#94A3B8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="w-7 h-7 my-auto rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#64748B] hover:text-[#17263C] flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}
          </form>

          {/* Action Buttons */}
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsCreateCommunityOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#7A1737] hover:bg-[#60122B] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <span>+ Create New Community</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreatePostOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#17263C] font-semibold text-xs sm:text-sm tracking-wide transition-all border border-[#E2E8F0] shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>✍️ Post Discussion / Poll</span>
            </button>
            <Link
              to="/dashboard/community"
              className="px-4 py-2.5 rounded-xl bg-[#17263C] hover:bg-[#0F1A2A] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>⚙️ Dashboard Feed →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. MAIN TABS NAVIGATION (Circles / Feed / Gatherings)
         ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex border-b border-[#E2E8F0] gap-4 sm:gap-8 overflow-x-auto text-sm font-semibold">
          {[
            { id: "groups", label: "Circles & Chapters", icon: "🏛️", count: communities.length },
            { id: "feed", label: "Discussions & Polls", icon: "💬", count: discussions.length },
            { id: "gatherings", label: "Community Gatherings", icon: "📅", count: gatherings.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3.5 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-b-2 border-[#7A1737] text-[#7A1737] font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: CIRCLES & CHAPTERS DIRECTORY
         ========================================================================= */}
      {activeTab === "groups" && (
        <section className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs text-slate-500 font-medium mr-1">Category:</span>
            {["All", "Technology", "Engineering", "Research", "Business", "Humanities", "Environment", "Career & Students", "International"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#7A1737] text-white shadow-xs font-bold"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-[#7A1737]"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
            {selectedCategory !== "All" && (
              <button
                onClick={() => setSelectedCategory("All")}
                className="text-xs font-semibold text-[#7A1737] hover:underline ml-auto cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Communities Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((group) => {
              const isJoined = joinedCommunityIds.has(group.id);

              return (
                <div
                  key={group.id}
                  className="rounded-2xl border border-slate-200 bg-white hover:border-[#7A1737]/40 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Cover header */}
                    <div className="relative h-28 bg-[#17263C] overflow-hidden">
                      <img
                        src={group.img || qa}
                        alt=""
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17263C]/80 via-transparent to-transparent" />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="text-xl bg-white/90 p-1.5 rounded-xl shadow-xs">{group.icon || "🌐"}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                          {group.category}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          🟢 {group.onlineCount || 12} Online
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-[#17263C] text-base leading-snug group-hover:text-[#7A1737] transition-colors">
                        {group.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {group.desc}
                      </p>

                      {/* Meta numbers */}
                      <div className="flex items-center gap-3 mt-3.5 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                        <span>👥 <strong>{(group.membersCount || 10).toLocaleString()}</strong> members</span>
                        <span>·</span>
                        <span>📝 <strong>{group.postsCount || 0}</strong> posts</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(group.tags || []).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleToggleJoin(group, e)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs ${
                        isJoined
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-[#7A1737] hover:bg-[#60122B] text-white"
                      }`}
                    >
                      {isJoined ? "✓ Joined Circle" : "Join Circle"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCommunityFilter(group.name);
                        setActiveTab("feed");
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-[#17263C] hover:text-[#7A1737] bg-white border border-slate-200 rounded-xl transition-colors cursor-pointer"
                      title="View Discussions"
                    >
                      Enter →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: DISCUSSIONS, POLLS & REAL-TIME FEED
         ========================================================================= */}
      {activeTab === "feed" && (
        <section className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Feed Column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Active Filter Notification if Selected */}
              {selectedCommunityFilter !== "All" && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                  <span>
                    Viewing discussions in: <strong>{selectedCommunityFilter}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedCommunityFilter("All")}
                    className="font-bold underline hover:text-amber-950 cursor-pointer"
                  >
                    View All Circles
                  </button>
                </div>
              )}

              {/* Feed Items */}
              {filteredDiscussions.map((disc) => (
                <div
                  key={disc.id}
                  onClick={() => setActiveThread(disc)}
                  className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-[#7A1737]/40 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#7A1737]">
                        {disc.channel || "General"}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          disc.type === "question"
                            ? "bg-purple-100 text-purple-800"
                            : disc.type === "poll"
                            ? "bg-blue-100 text-blue-800"
                            : disc.type === "announcement"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {disc.type}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{disc.time}</span>
                  </div>

                  <h3 className="font-bold text-[#17263C] text-base leading-snug hover:text-[#7A1737] transition-colors">
                    {disc.title}
                  </h3>

                  {disc.body && (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {disc.body}
                    </p>
                  )}

                  {/* Poll View if Post has Poll */}
                  {disc.type === "poll" && disc.poll && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <p className="text-xs font-bold text-slate-800">{disc.poll.question}</p>
                      <div className="space-y-2">
                        {disc.poll.options.map((opt) => {
                          const pct =
                            disc.poll.totalVotes > 0
                              ? Math.round(((opt.votes || 0) / disc.poll.totalVotes) * 100)
                              : 0;

                          return (
                            <button
                              key={opt.id}
                              onClick={(e) => handleVotePoll(disc.id, opt.id, e)}
                              className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#7A1737] transition-all relative overflow-hidden group cursor-pointer"
                            >
                              <div
                                className="absolute inset-y-0 left-0 bg-[#7A1737]/10 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                              <div className="relative z-10 flex justify-between text-xs font-medium text-slate-700">
                                <span>{opt.text}</span>
                                <span className="font-bold text-[#7A1737]">{pct}% ({opt.votes || 0})</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-400 text-right">
                        Total {disc.poll.totalVotes} community votes
                      </p>
                    </div>
                  )}

                  {/* Author & Stats Footer */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#17263C]">{disc.author}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{disc.dept}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(disc.id, e)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          disc.userLiked ? "text-red-500 font-bold" : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <span>{disc.userLiked ? "❤️" : "🤍"}</span>
                        <span>{disc.likes || 0}</span>
                      </button>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span>💬</span>
                        <span>{(disc.replies || []).length} replies</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Community Quick Composer Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <h3 className="font-bold text-sm text-[#17263C] mb-2">
                  Engage With Your Community
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Ask career questions, share thesis openings, or launch polls for your fellow alumni.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#7A1737] hover:bg-[#60122B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>✍️ Start Discussion or Poll</span>
                  </button>
                  <button
                    onClick={() => setIsCreateCommunityOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>+ Create a Circle</span>
                  </button>
                </div>
              </div>

              {/* Trending Topics & Tags */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <h3 className="font-bold text-sm text-[#17263C] mb-3">
                  Trending Community Topics
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {["AI_ML", "JobReferrals", "HigherStudies", "GermanScholarships", "GreenCampus", "TechHiring", "AgriTech", "Reunion2026"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer transition-colors"
                      >
                        #{tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 3: COMMUNITY GATHERINGS & MEETUPS
         ========================================================================= */}
      {activeTab === "gatherings" && (
        <section className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {gatherings.map((gath) => (
              <div
                key={gath.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#7A1737]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-3xl">{gath.icon || "🏆"}</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      📅 {gath.date}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#17263C] leading-snug">
                    {gath.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {gath.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div>📍 <strong>Location:</strong> {gath.loc}</div>
                    <div>⏱️ <strong>Time:</strong> {gath.time || "Evening BST"}</div>
                    <div>👥 <strong>Attendance:</strong> {gath.registered} of {gath.seats} reserved</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <button
                    onClick={() => handleRsvpSubmit(gath)}
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#7A1737] hover:bg-[#60122B] text-white shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    RSVP / Reserve Spot →
                  </button>
                  <a
                    href={gath.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Room Link
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          MODAL 1: CREATE NEW COMMUNITY
         ========================================================================= */}
      {isCreateCommunityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateCommunityOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-display font-bold text-xl text-[#17263C] mb-1">
              Create a PUST Alumni Circle
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Launch a specialized group for your department, batch, industry focus, or geographical city.
            </p>

            <form onSubmit={handleCreateCommunitySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Community Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PUST Robotics & Embedded Innovators"
                  value={newCommunityForm.name}
                  onChange={(e) => setNewCommunityForm({ ...newCommunityForm, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCommunityForm.category}
                    onChange={(e) => setNewCommunityForm({ ...newCommunityForm, category: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Research">Research & Science</option>
                    <option value="Business">Business & Startups</option>
                    <option value="Humanities">Humanities & Social</option>
                    <option value="Environment">Environment & Green</option>
                    <option value="Career & Students">Career & Students</option>
                    <option value="International">International Diaspora</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Circle Icon
                  </label>
                  <select
                    value={newCommunityForm.icon}
                    onChange={(e) => setNewCommunityForm({ ...newCommunityForm, icon: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                  >
                    <option value="💻">💻 Tech / Computing</option>
                    <option value="🚀">🚀 Startups / Innovation</option>
                    <option value="🔬">🔬 Research / Lab</option>
                    <option value="🤖">🤖 Robotics / AI</option>
                    <option value="📐">📐 Engineering</option>
                    <option value="🌐">🌐 Global Diaspora</option>
                    <option value="🌿">🌿 Green / Ecology</option>
                    <option value="🎓">🎓 Freshers / Students</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Community Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the mission, key discussion topics, and who should join this circle..."
                  value={newCommunityForm.desc}
                  onChange={(e) => setNewCommunityForm({ ...newCommunityForm, desc: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Privacy Setting
                  </label>
                  <select
                    value={newCommunityForm.privacy}
                    onChange={(e) => setNewCommunityForm({ ...newCommunityForm, privacy: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                  >
                    <option value="Public">Public (Anyone can join)</option>
                    <option value="Department Only">Department Restricted</option>
                    <option value="Verified Alumni Only">Verified Alumni Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Robotics, Arduino, CSE"
                    value={newCommunityForm.tags}
                    onChange={(e) => setNewCommunityForm({ ...newCommunityForm, tags: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateCommunityOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCommunity}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-[#7A1737] text-white hover:bg-[#60122B] shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isCreatingCommunity ? "Creating Circle..." : "Launch Community →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CREATE POST / POLL / QUESTION
         ========================================================================= */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsCreatePostOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-display font-bold text-xl text-[#17263C] mb-1">
              Publish Community Discussion
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Share updates, ask senior alumni for advice, or launch a live poll.
            </p>

            {/* Type selector */}
            <div className="flex gap-2 p-1.5 rounded-xl bg-slate-100 mb-4 text-xs font-semibold">
              {[
                { id: "post", label: "💬 Discussion" },
                { id: "question", label: "❓ Question" },
                { id: "poll", label: "📊 Poll" },
                { id: "announcement", label: "📢 Notice" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPostComposer({ ...postComposer, type: t.id })}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    postComposer.type === t.id ? "bg-white text-[#7A1737] shadow-xs font-bold" : "text-slate-600"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Community Circle
                </label>
                <select
                  value={postComposer.channel}
                  onChange={(e) => setPostComposer({ ...postComposer, channel: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                >
                  {communities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best practices for migrating to microservices at scale..."
                  value={postComposer.title}
                  onChange={(e) => setPostComposer({ ...postComposer, title: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Content / Details
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Elaborate on your topic or background context..."
                  value={postComposer.body}
                  onChange={(e) => setPostComposer({ ...postComposer, body: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                />
              </div>

              {/* Poll specific fields */}
              {postComposer.type === "poll" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    Poll Question & Voting Options
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Which cloud provider is your company prioritizing?"
                    value={postComposer.pollQuestion}
                    onChange={(e) => setPostComposer({ ...postComposer, pollQuestion: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                  />
                  {postComposer.pollOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      required
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const next = [...postComposer.pollOptions];
                        next[idx] = e.target.value;
                        setPostComposer({ ...postComposer, pollOptions: next });
                      }}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  ))}
                  {postComposer.pollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPostComposer({
                          ...postComposer,
                          pollOptions: [...postComposer.pollOptions, `Option ${postComposer.pollOptions.length + 1}`],
                        })
                      }
                      className="text-xs text-[#7A1737] font-bold hover:underline cursor-pointer"
                    >
                      + Add Option
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Cloud, Microservices, Career"
                  value={postComposer.tags}
                  onChange={(e) => setPostComposer({ ...postComposer, tags: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatePostOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-[#7A1737] text-white hover:bg-[#60122B] shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPost ? "Publishing..." : "Post to Community →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: INTERACTIVE THREAD DISCUSSION VIEW
         ========================================================================= */}
      {activeThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setActiveThread(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-[#7A1737]">
              {activeThread.channel}
            </span>

            <h2 className="font-display font-bold text-lg sm:text-xl text-[#17263C] mt-2 leading-snug">
              {activeThread.title}
            </h2>

            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span className="font-bold text-slate-700">{activeThread.author}</span>
              <span>·</span>
              <span>{activeThread.dept}</span>
              <span>·</span>
              <span>{activeThread.time}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 mt-4 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {activeThread.body}
            </p>

            {/* Poll view if present */}
            {activeThread.type === "poll" && activeThread.poll && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-800">{activeThread.poll.question}</p>
                {activeThread.poll.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={(e) => handleVotePoll(activeThread.id, opt.id, e)}
                    className="w-full text-left p-2 rounded-lg border border-slate-200 bg-white hover:border-[#7A1737] flex justify-between text-xs"
                  >
                    <span>{opt.text}</span>
                    <span className="font-bold text-[#7A1737]">{opt.votes || 0} votes</span>
                  </button>
                ))}
              </div>
            )}

            {/* Replies List */}
            <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Replies ({(activeThread.replies || []).length})
              </h4>

              {(activeThread.replies || []).length === 0 ? (
                <p className="text-xs text-slate-400 py-3">No replies yet. Be the first to share your thoughts!</p>
              ) : (
                activeThread.replies.map((rep, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">{rep.author}</span>
                      <span className="text-[10px] text-slate-400">{rep.time}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rep.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handlePostReply} className="mt-5 flex gap-2">
              <input
                type="text"
                required
                placeholder="Write a constructive reply…"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#7A1737] text-white text-xs font-bold hover:bg-[#60122B] cursor-pointer"
              >
                Reply
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: GATHERING RSVP CONFIRMATION
         ========================================================================= */}
      {rsvpGathering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative text-center">
            <button
              onClick={() => setRsvpGathering(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-3">
              ✓
            </div>
            <h3 className="font-display font-bold text-lg text-[#17263C]">
              RSVP Confirmed!
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              You are reserved for <strong>{rsvpGathering.title}</strong> on {rsvpGathering.date}.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 mb-5">
              <div>📍 <strong>Location:</strong> {rsvpGathering.loc}</div>
              <div>💻 <strong>Meeting Room:</strong> {rsvpGathering.meetLink}</div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={generateGoogleCalendarUrl({
                  title: rsvpGathering.title,
                  details: rsvpGathering.desc,
                  location: rsvpGathering.meetLink || rsvpGathering.loc,
                  startTime: "2026-10-28T20:00:00",
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>📅 Add to Google Calendar</span>
              </a>
              <button
                onClick={() =>
                  downloadIcsFile({
                    title: rsvpGathering.title,
                    description: rsvpGathering.desc,
                    location: rsvpGathering.meetLink || rsvpGathering.loc,
                    startTime: "2026-10-28T20:00:00",
                  })
                }
                className="py-2 px-4 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                📥 Download .ics Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN THEATER MODE OVERLAY */}
      {isTheaterMode && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col p-2 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsTheaterMode(false)}
        >
          <div className="flex items-center justify-between pb-3 sm:pb-4 text-white max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  Pabna University of Science and Technology · Community Reel
                </h3>
                <p className="text-xs text-slate-400">Campus Atmosphere · Press ESC to exit</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsTheaterMode(false)}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              ✕ Exit Fullscreen
            </button>
          </div>
          <div
            className="flex-1 w-full max-w-7xl mx-auto rounded-2xl overflow-hidden bg-black shadow-2xl relative flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src="/assets/videos/pust_community_reel.mp4"
              autoPlay
              controls
              playsInline
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
