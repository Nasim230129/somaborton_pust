import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Ia, La, za, Ha, Ua, Wa, Ka, qa, Xa, Qa } from "../../data/mockData";
import { api, getCurrentUser } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";

// Institutional community circles & chapters
const COMMUNITY_GROUPS = [
  {
    icon: "💻",
    name: "CSE & Tech Alumni Circle",
    desc: "A collaborative hub for CSE, EEE, ICE, and technology graduates to share opportunities, open-source projects, and industry insights.",
    members: 3840,
    posts: 124,
    online: 42,
    tags: ["Software", "AI/ML", "Cloud", "Networking"],
    img: qa,
  },
  {
    icon: "📐",
    name: "Engineering & Architecture Chapter",
    desc: "Civil, Mechanical, Architecture, and URP alumni collaborating on mega-infrastructure, urban renewal, and architectural design.",
    members: 2210,
    posts: 87,
    online: 19,
    tags: ["Civil", "Architecture", "URP", "BIM"],
    img: Xa,
  },
  {
    icon: "🧪",
    name: "Science & Pharmaceutical Research",
    desc: "Physics, Chemistry, Mathematics, Pharmacy, and SDS graduates discussing frontier research, publications, and lab innovations.",
    members: 1680,
    posts: 96,
    online: 23,
    tags: ["Research", "Pharmacy", "Data Science"],
    img: Ia,
  },
  {
    icon: "📋",
    name: "Business & Entrepreneurship Hub",
    desc: "BBA and THM alumni networking around venture capital, supply chain leadership, enterprise strategy, and startup acceleration.",
    members: 1920,
    posts: 73,
    online: 31,
    tags: ["BBA", "Startups", "Fintech", "Tourism"],
    img: La,
  },
  {
    icon: "📜",
    name: "Humanities & Social Sciences Guild",
    desc: "Bangla, English, History, Social Work, Public Administration, and Economics alumni engaging in culture, literature, and policy analysis.",
    members: 1540,
    posts: 61,
    online: 14,
    tags: ["Literature", "History", "Public Policy"],
    img: za,
  },
  {
    icon: "🌿",
    name: "PUST Green Campus Initiative",
    desc: "Students, alumni, and faculty dedicated to environmental sustainability, clean energy projects, and campus biodiversity.",
    members: 840,
    posts: 45,
    online: 9,
    tags: ["Environment", "Sustainability", "Green Tech"],
    img: Wa,
  },
  {
    icon: "🎓",
    name: "Freshers & Young Graduates Forum",
    desc: "A dedicated mentorship gateway for recent graduates and final-year students stepping into professional life and corporate careers.",
    members: 2680,
    posts: 202,
    online: 78,
    tags: ["Freshers", "Students", "Career Prep"],
    img: Ha,
  },
  {
    icon: "🌍",
    name: "PUST Global Diaspora Chapters",
    desc: "Alumni living and working overseas — active chapters spanning North America, Europe, Australia, East Asia, and the Middle East.",
    members: 4320,
    posts: 310,
    online: 91,
    tags: ["International", "Diaspora", "Higher Studies"],
    img: Qa,
  },
];

// Seed discussions
const INITIAL_DISCUSSIONS = [
  {
    id: 1,
    cat: "Career",
    title: "Key technological skills needed for Bangladesh software engineers in 2026–2027?",
    author: "Tanvir Ahmed",
    dept: "CSE '22",
    time: "2h ago",
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
    likes: 88,
    userLiked: false,
  },
  {
    id: 2,
    cat: "Research",
    title: "Looking for PUST alumni co-authors for a peer-reviewed paper on Renewable Energy microgrids",
    author: "Dr. Nasrin Akter",
    dept: "ICE (Faculty)",
    time: "5h ago",
    replies: [
      {
        author: "Zahid Hasan",
        dept: "EEE '16",
        time: "3h ago",
        text: "I am working on solar battery inverters at BPDB. Would love to contribute data from northern Bangladesh plants.",
      },
    ],
    likes: 41,
    userLiked: false,
  },
  {
    id: 3,
    cat: "Campus",
    title: "PUST Grand Alumni Reunion 2026 — who is organizing travel delegations from Dhaka?",
    author: "Sabbir Hossain",
    dept: "EEE '19",
    time: "1d ago",
    replies: [
      {
        author: "Kazi Farhan",
        dept: "CE '15",
        time: "18h ago",
        text: "We are booking 3 AC coaches from Mohakhali terminal. Will share the registration link here shortly!",
      },
    ],
    likes: 134,
    userLiked: false,
  },
  {
    id: 4,
    cat: "Entrepreneurship",
    title: "Bootstrapping an agritech supply startup after PUST — lessons from 3 years in the field",
    author: "Rahnuma Islam",
    dept: "BBA '20",
    time: "2d ago",
    replies: [],
    likes: 176,
    userLiked: false,
  },
  {
    id: 5,
    cat: "Mentorship",
    title: "Transitioning from undergraduate degree to international Ph.D. scholarships — AMA",
    author: "Mahfuz Khan",
    dept: "MATH '23",
    time: "3d ago",
    replies: [],
    likes: 63,
    userLiked: false,
  },
];

const UPCOMING_GATHERINGS = [
  {
    id: 1,
    icon: "🏆",
    date: "Oct 12",
    title: "PUST Inter-Batch Alumni Quiz Night",
    loc: "Online · Official Zoom Conference",
    seats: 120,
    registered: 94,
    desc: "Friendly university trivia, historical PUST memories, and engineering knowledge contest with prizes.",
  },
  {
    id: 2,
    icon: "🎤",
    date: "Nov 05",
    title: "PUST Career Talk Series — Navigating Big Tech",
    loc: "PUST Main Auditorium, Campus",
    seats: 250,
    registered: 185,
    desc: "Keynote talks by PUST alumni working in European and North American enterprise organizations.",
  },
  {
    id: 3,
    icon: "🌐",
    date: "Nov 18",
    title: "Global Diaspora Chapter Virtual Assembly",
    loc: "Online · Regional Timezones",
    seats: 500,
    registered: 360,
    desc: "Connecting alumni chapters across North America, UK, Europe, Australia, and the Middle East.",
  },
  {
    id: 4,
    icon: "🎓",
    date: "Dec 01",
    title: "PUST Annual Alumni Gala Dinner 2026",
    loc: "Dhaka Officers Club, Dhaka",
    seats: 400,
    registered: 320,
    desc: "Formal evening banquet bringing together faculty deans, distinguished alumni, and university leaders.",
  },
];

const METRIC_STATS = [
  { value: "22,400+", label: "Community Members" },
  { value: "8", label: "Specialized Chapters" },
  { value: "1,200+", label: "Monthly Dispatches" },
  { value: "45", label: "Countries Represented" },
];

export default function Community() {
  usePageMeta(
    "Alumni Community & Circles",
    "Join PUST interest groups, alumni chapters, and participate in scholarly and professional discussions with alumni worldwide."
  );

  const [activeTab, setActiveTab] = useState("groups");
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [joinedGroupIndices, setJoinedGroupIndices] = useState(() => new Set([0, 7]));
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
  const [newDiscussionText, setNewDiscussionText] = useState("");
  const [newDiscussionCat, setNewDiscussionCat] = useState("Career");

  // Interactive Discussion Thread Modal
  const [activeThread, setActiveThread] = useState(null);
  const [replyInput, setReplyInput] = useState("");

  // Interactive RSVP Gathering Modal
  const [rsvpGathering, setRsvpGathering] = useState(null);
  const [rsvpRegisteredIds, setRsvpRegisteredIds] = useState(new Set([1]));
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Background Video & Theater Mode State (Facebook Reel: 1647387283748762)
  const [isMuted, setIsMuted] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const videoRef = useRef(null);

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
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else {
        setIsTheaterMode(true);
      }
    } else {
      setIsTheaterMode(true);
    }
  };

  // Handle ESC key to exit full-screen theater mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isTheaterMode) {
        setIsTheaterMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTheaterMode]);

  // Filter groups
  const filteredGroups = COMMUNITY_GROUPS.filter((grp) => {
    if (!groupSearchQuery.trim()) return true;
    const q = groupSearchQuery.toLowerCase().trim();
    return (
      grp.name.toLowerCase().includes(q) ||
      grp.desc.toLowerCase().includes(q) ||
      grp.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  // Filter discussions
  const filteredDiscussions = discussions.filter((disc) => {
    if (!groupSearchQuery.trim()) return true;
    const q = groupSearchQuery.toLowerCase().trim();
    return (
      (disc.title || "").toLowerCase().includes(q) ||
      (disc.author || "").toLowerCase().includes(q) ||
      (disc.dept || "").toLowerCase().includes(q) ||
      (disc.cat || "").toLowerCase().includes(q) ||
      (disc.preview || "").toLowerCase().includes(q)
    );
  });

  // Toggle group membership
  const handleToggleGroup = (idx) => {
    setJoinedGroupIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  // Toggle discussion like
  const handleToggleLike = (discId, e) => {
    if (e) e.stopPropagation();
    setDiscussions((prev) =>
      prev.map((disc) => {
        if (disc.id === discId) {
          const isLiked = disc.userLiked;
          return {
            ...disc,
            userLiked: !isLiked,
            likes: isLiked ? disc.likes - 1 : disc.likes + 1,
          };
        }
        return disc;
      })
    );

    if (activeThread && activeThread.id === discId) {
      setActiveThread((prev) => ({
        ...prev,
        userLiked: !prev.userLiked,
        likes: prev.userLiked ? prev.likes - 1 : prev.likes + 1,
      }));
    }
  };

  // Create discussion
  const handleCreateDiscussion = (e) => {
    e.preventDefault();
    if (!newDiscussionText.trim()) return;

    const user = getCurrentUser();
    const newEntry = {
      id: Date.now(),
      cat: newDiscussionCat,
      title: newDiscussionText.trim(),
      author: user?.name || "Dr. Rafiqul Islam",
      dept: `${(user?.dept || "CSE").split(" ")[0]} '${String(user?.batch || "2008").slice(-2)}`,
      time: "Just now",
      replies: [],
      likes: 1,
      userLiked: true,
    };

    setDiscussions([newEntry, ...discussions]);
    api.createCommunityPost({
      title: newDiscussionText.trim(),
      body: newDiscussionText.trim(),
      category: newDiscussionCat,
    });
    setNewDiscussionText("");
  };

  // Post reply to discussion
  const handlePostReply = (e) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeThread) return;

    const user = getCurrentUser();
    const newReply = {
      author: user?.name || "PUST Alumni Member",
      dept: user?.dept || "Alumni",
      time: "Just now",
      text: replyInput.trim(),
    };

    const updatedThread = {
      ...activeThread,
      replies: [...(activeThread.replies || []), newReply],
    };

    setActiveThread(updatedThread);
    setDiscussions((prev) =>
      prev.map((d) => (d.id === activeThread.id ? updatedThread : d))
    );
    setReplyInput("");
  };

  // Handle RSVP submission
  const handleRsvpSubmit = (gathering) => {
    setRsvpGathering(gathering);
    setRsvpSuccess(true);
    setRsvpRegisteredIds((prev) => new Set(prev).add(gathering.id));
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#475569]">
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
        {/* Ambient Auto-Player (Edge-to-Edge HD Auto Loop) */}
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

        {/* Minimal Floating Top Controls */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 w-full flex items-center justify-between pointer-events-none">
          <a
            href="https://www.facebook.com/reel/1647387283748762"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600/80 hover:bg-blue-600 border border-white/20 backdrop-blur-md transition-colors shadow-md active:scale-95"
            title="View original reel on Facebook"
          >
            <span>📱 Facebook Reel</span>
            <span className="text-[10px]">↗</span>
          </a>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute sound" : "Mute sound"}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-black/70 hover:bg-black/90 border border-white/25 backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              title={isMuted ? "Unmute sound" : "Mute sound"}
            >
              <span>{isMuted ? "🔇 Unmute" : "🔊 Mute"}</span>
            </button>
            <button
              type="button"
              onClick={handleFullscreenCinema}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#7A1737]/90 hover:bg-[#7A1737] border border-[#C7A76C]/40 backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              title="Fullscreen Cinema View"
            >
              <span>⛶ Cinema View</span>
            </button>
          </div>
        </div>

        {/* Unobstructed Center View so Visitors Get the Authentic Offline Campus View */}
        <div className="flex-1 pointer-events-none" />

        {/* Floating Bottom Button to Smoothly Scroll to Community Board */}
        <div className="relative z-20 pb-5 sm:pb-7 text-center pointer-events-none flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("community-board");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/80 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-[#C7A76C]/40 backdrop-blur-md shadow-xl transition-colors cursor-pointer active:scale-95 ring-1 ring-white/10"
          >
            <span className="text-[#DFCA9E]">🏛️</span>
            <span>Explore Chapters & Discussions</span>
            <span className="text-sm text-[#DFCA9E]">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. INSTITUTIONAL METRICS RIBBON
         ========================================================================= */}
      <div id="community-board" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {METRIC_STATS.map((stat, idx) => (
              <div key={idx} className="pt-2 sm:pt-0 sm:px-4 text-center">
                <p className="font-display font-bold text-2xl sm:text-3xl text-[#DFCA9E] leading-none">
                  {stat.value}
                </p>
                <p className="text-[11px] sm:text-xs mt-2 uppercase tracking-wider text-slate-300 font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. INSTITUTIONAL COMMUNITY HEADER
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] shadow-2xs py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-2 text-[#7A1737]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> · PUST Alumni Network · Community
          </p>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#17263C] mb-3 tracking-tight">
            Alumni Community & Circles
          </h1>
          <p className="text-xs sm:text-sm mb-6 max-w-2xl mx-auto text-[#64748B] leading-relaxed">
            Join official department chapters, spark cross-discipline research dialogues, and stay
            united with 22,400+ graduates across all 21 academic departments and global chapters.
          </p>

          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => {
                setActiveTab("groups");
                const el = document.getElementById("community-main");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Explore Chapters →
            </button>
            <button
              onClick={() => {
                setActiveTab("discussions");
                const el = document.getElementById("community-main");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#17263C] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
            >
              Join Discussions
            </button>
          </div>
        </div>
      </section>

      {/* 3. NAVIGATION TABS BAR */}
      <section id="community-main" className="bg-white border-b border-[#E2E8F0] sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4 flex-wrap py-2.5">
            <div className="flex gap-1 sm:gap-2">
              {[
                { id: "groups", label: "Chapters & Circles" },
                { id: "discussions", label: "Discussion Feed" },
                { id: "gatherings", label: "Upcoming Gatherings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "text-[#7A1737] border-[#7A1737]"
                      : "text-[#64748B] border-transparent hover:text-[#17263C]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {(activeTab === "groups" || activeTab === "discussions") && (
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[#94A3B8] pointer-events-none text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === "groups"
                      ? "Filter chapters or keywords…"
                      : "Search discussions or authors…"
                  }
                  className="pl-8 pr-7 py-1.5 text-xs sm:text-sm rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C] placeholder-[#94A3B8] bg-[#F8FAFC] focus:bg-white w-48 sm:w-64 transition-all"
                />
                {groupSearchQuery && (
                  <button
                    onClick={() => setGroupSearchQuery("")}
                    className="absolute right-2.5 text-[#94A3B8] hover:text-[#17263C] text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. MAIN CONTENT TABS */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* TAB 1: CHAPTERS & CIRCLES */}
        {activeTab === "groups" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-[#64748B]">
                Showing <strong className="text-[#17263C]">{filteredGroups.length}</strong> official
                community circles
              </p>
              <span className="text-[11px] font-semibold text-[#7A1737] bg-[#7A1737]/10 px-2.5 py-1 rounded-full">
                Joined: {joinedGroupIndices.size} Circles
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((grp, idx) => {
                const isJoined = joinedGroupIndices.has(idx);

                return (
                  <article
                    key={idx}
                    className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs hover:border-[#7A1737]/40 hover:shadow-md transition-all overflow-hidden flex flex-col group"
                  >
                    <div className="relative overflow-hidden h-32 bg-[#17263C]">
                      <img
                        src={grp.img}
                        alt={grp.name}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(23,38,60,0.2) 0%, rgba(23,38,60,0.85) 100%)",
                        }}
                      />
                      <div className="absolute top-3 left-3 text-2xl drop-shadow-sm">{grp.icon}</div>
                      <div className="absolute top-3 right-3 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#17263C]/80 border border-white/20 backdrop-blur-xs">
                        ● {grp.online} active now
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-display font-bold text-[#17263C] text-base leading-snug mb-1.5 group-hover:text-[#7A1737] transition-colors">
                        {grp.name}
                      </h3>
                      <p className="text-[#475569] text-xs leading-relaxed mb-4 flex-1">
                        {grp.desc}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {grp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-[#F4F5F7] border border-[#E2E8F0] text-[#475569]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-3 border-t border-[#E2E8F0] mb-4">
                        <span>👥 {grp.members.toLocaleString()} members</span>
                        <span>💬 {grp.posts} threads/mo</span>
                      </div>

                      <button
                        onClick={() => handleToggleGroup(idx)}
                        className={`w-full py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isJoined
                            ? "bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]"
                            : "bg-[#7A1737] hover:bg-[#62122B] text-white shadow-2xs"
                        }`}
                      >
                        {isJoined ? "✓ Joined Chapter" : "Join Chapter →"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DISCUSSIONS FEED */}
        {activeTab === "discussions" && (
          <div className="space-y-4">
            {/* Create Discussion Card */}
            <form
              onSubmit={handleCreateDiscussion}
              className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs"
            >
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold bg-[#7A1737] shadow-2xs">
                  P
                </div>
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={newDiscussionText}
                    onChange={(e) => setNewDiscussionText(e.target.value)}
                    placeholder="Start an institutional dialogue with PUST alumni, faculty, and graduating students…"
                    className="w-full border border-[#E2E8F0] p-3 text-xs sm:text-sm outline-none rounded-lg text-[#17263C] placeholder-[#94A3B8] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#64748B] font-medium">Category:</span>
                  <select
                    value={newDiscussionCat}
                    onChange={(e) => setNewDiscussionCat(e.target.value)}
                    className="text-xs px-2.5 py-1 rounded-md border border-[#E2E8F0] bg-white text-[#17263C] outline-none"
                  >
                    <option value="Career">Career Guidance</option>
                    <option value="Research">Research & Papers</option>
                    <option value="Campus">Campus Life</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Mentorship">Mentorship</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!newDiscussionText.trim()}
                  className="text-xs font-bold px-6 py-2 rounded-lg bg-[#7A1737] hover:bg-[#62122B] disabled:opacity-50 text-white transition-all shadow-2xs cursor-pointer"
                >
                  Post to Network
                </button>
              </div>
            </form>

            {/* Discussions Feed List */}
            {filteredDiscussions.map((disc) => (
              <article
                key={disc.id}
                onClick={() => setActiveThread(disc)}
                className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs hover:border-[#7A1737]/30 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[#17263C] text-xs font-bold bg-[#F4F5F7] border border-[#E2E8F0]">
                    {disc.author
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#7A1737]/10 text-[#7A1737] border border-[#7A1737]/20">
                        {disc.cat}
                      </span>
                      <span className="font-bold text-sm text-[#17263C]">{disc.author}</span>
                      <span className="text-[11px] text-[#64748B] font-medium">{disc.dept}</span>
                      <span className="text-[11px] text-[#94A3B8] ml-auto">{disc.time}</span>
                    </div>

                    <h3 className="font-display font-semibold text-sm sm:text-base text-[#17263C] leading-snug mb-3 group-hover:text-[#7A1737] transition-colors">
                      {disc.title}
                    </h3>

                    <div className="flex items-center gap-5 text-xs text-[#64748B] pt-2 border-t border-[#F1F5F9]">
                      <span className="hover:text-[#17263C] transition-colors">
                        💬 {(disc.replies || []).length} responses
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(disc.id, e)}
                        className={`transition-colors flex items-center gap-1 cursor-pointer ${
                          disc.userLiked ? "text-[#7A1737] font-bold" : "hover:text-[#7A1737]"
                        }`}
                      >
                        <span>{disc.userLiked ? "❤️" : "🤍"}</span>
                        <span>{disc.likes}</span>
                      </button>

                      <span className="text-[#7A1737] font-bold transition-colors ml-auto text-xs group-hover:underline">
                        Join Discussion →
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {filteredDiscussions.length === 0 && (
              <div className="py-12 text-center text-sm text-[#64748B] bg-white rounded-xl border border-[#E2E8F0]">
                🔍 কোনো আলোচনা খুঁজে পাওয়া যায়নি "{groupSearchQuery}" দিয়ে। অন্য কি-ওয়ার্ড দিয়ে খুঁজুন।
              </div>
            )}
          </div>
        )}

        {/* TAB 3: UPCOMING GATHERINGS */}
        {activeTab === "gatherings" && (
          <div className="space-y-4">
            {UPCOMING_GATHERINGS.map((evt) => {
              const isRsvpd = rsvpRegisteredIds.has(evt.id);

              return (
                <div
                  key={evt.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs hover:border-[#7A1737]/40 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl flex-shrink-0">{evt.icon}</div>
                    <div className="w-16 text-center flex-shrink-0 bg-[#F4F5F7] rounded-lg py-2 border border-[#E2E8F0]">
                      <p className="font-display font-bold text-[#7A1737] text-xl leading-none">
                        {evt.date.split(" ")[1]}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mt-0.5">
                        {evt.date.split(" ")[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-[#17263C] text-sm sm:text-base leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1">
                      <span>📍</span>
                      <span>{evt.loc}</span>
                    </p>
                    <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">{evt.desc}</p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2E8F0]">
                    <p className="text-[11px] text-[#64748B] font-medium">
                      {evt.seats - evt.registered} spots open
                    </p>
                    <button
                      onClick={() => handleRsvpSubmit(evt)}
                      className={`text-xs font-bold px-6 py-2.5 rounded-lg transition-all shadow-2xs cursor-pointer ${
                        isRsvpd
                          ? "bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]"
                          : "bg-[#7A1737] hover:bg-[#62122B] text-white active:scale-95"
                      }`}
                    >
                      {isRsvpd ? "✓ Reserved Seat" : "RSVP Gathering"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. PHOTO STRIP */}
      <div className="flex overflow-hidden opacity-50 border-y border-[#E2E8F0] h-16">
        {[Ua, Wa, Xa, qa, Qa, Ia, Ha, La, za].map((imgSrc, idx) => (
          <div key={idx} className="flex-1 relative overflow-hidden group">
            <img
              src={imgSrc}
              alt=""
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[#17263C]/30" />
          </div>
        ))}
      </div>

      {/* 6. CALL-TO-ACTION SECTION */}
      <section
        className="relative overflow-hidden border-t border-[#0F1A2A]"
        style={{
          background: "#17263C",
          minHeight: 220,
        }}
      >
        <img
          src={Qa}
          alt="PUST Assembly Hall"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-15"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(23,38,60,0.85) 0%, rgba(23,38,60,0.98) 100%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-2 text-[#C7A76C]">
              Join 22,400+ Alumni
            </p>
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-2">
              Be Part of the Official Network
            </h2>
            <p className="text-xs sm:text-sm max-w-md text-[#CBD5E1] leading-relaxed">
              Connect with batchmates, participate in departmental workshops, and expand your
              professional circle across Bangladesh and worldwide.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/register"
              className="text-xs sm:text-sm font-semibold text-white px-7 py-3 rounded-lg bg-[#7A1737] hover:bg-[#62122B] transition-all shadow-sm active:scale-95 text-center"
            >
              Create Alumni Profile →
            </Link>
            <Link
              to="/directory"
              className="text-xs sm:text-sm font-medium text-white px-7 py-3 rounded-lg border border-white/25 hover:bg-white/10 transition-colors text-center"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </section>

      {/* 7. DISCUSSION THREAD & REPLY MODAL */}
      {activeThread && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setActiveThread(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-[#17263C] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block">
                  {activeThread.cat} Dialogue
                </span>
                <h3 className="font-display font-bold text-sm sm:text-base text-white truncate max-w-md">
                  {activeThread.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveThread(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Original Post */}
              <div className="flex items-start gap-3.5 pb-4 border-b border-[#E2E8F0]">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[#17263C] text-xs font-bold bg-[#F4F5F7] border border-[#E2E8F0]">
                  {activeThread.author
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[#17263C]">{activeThread.author}</span>
                    <span className="text-[11px] text-[#64748B] font-medium">
                      {activeThread.dept}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] ml-auto">{activeThread.time}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {activeThread.title}
                  </p>
                </div>
              </div>

              {/* Thread Responses */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#17263C]">
                  Responses ({(activeThread.replies || []).length})
                </p>

                {(activeThread.replies || []).length === 0 ? (
                  <p className="text-xs text-[#94A3B8] italic">
                    Be the first alumnus to reply to this discussion.
                  </p>
                ) : (
                  (activeThread.replies || []).map((reply, rIdx) => (
                    <div key={rIdx} className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-[#17263C]">
                          {reply.author}
                          <span className="font-normal text-[#64748B] ml-1.5 text-[11px]">
                            ({reply.dept})
                          </span>
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">{reply.time}</span>
                      </div>
                      <p className="text-xs text-[#475569] leading-relaxed">{reply.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handlePostReply} className="pt-3 border-t border-[#E2E8F0] space-y-2">
                <textarea
                  rows={2}
                  required
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Contribute your perspective or answer..."
                  className="w-full border border-[#E2E8F0] p-3 text-xs outline-none rounded-lg text-[#17263C] placeholder-[#94A3B8] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737]"
                />
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={(e) => handleToggleLike(activeThread.id, e)}
                    className="text-xs text-[#7A1737] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{activeThread.userLiked ? "❤️ Liked" : "🤍 Like"}</span>
                    <span>({activeThread.likes})</span>
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-colors cursor-pointer"
                  >
                    Post Response
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 8. RSVP CONFIRMATION MODAL */}
      {rsvpGathering && rsvpSuccess && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setRsvpSuccess(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#E2E8F0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center text-2xl mx-auto mb-3">
              ✓
            </div>
            <h4 className="font-display font-bold text-lg text-[#17263C] mb-1">
              Seat Reservation Confirmed!
            </h4>
            <p className="text-xs text-[#64748B] mb-4">
              Your attendance for <strong>{rsvpGathering.title}</strong> has been logged.
            </p>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs text-[#17263C] text-left mb-5 space-y-1">
              <p>
                <strong>Date:</strong> {rsvpGathering.date}, 2026
              </p>
              <p>
                <strong>Venue:</strong> {rsvpGathering.loc}
              </p>
            </div>
            <button
              onClick={() => setRsvpSuccess(false)}
              className="w-full py-2.5 text-xs font-bold rounded-lg bg-[#7A1737] text-white hover:bg-[#62122B] transition-colors cursor-pointer"
            >
              Great, Close
            </button>
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
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় · Campus Video Reel
                </h3>
                <p className="text-xs text-slate-400">
                  Real Campus Experience · Press ESC to exit
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/reel/1647387283748762"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-3.5 py-1.5 rounded-full bg-blue-600/80 hover:bg-blue-600 text-xs font-semibold text-white transition-colors"
              >
                Facebook এ দেখুন ↗
              </a>
              <button
                type="button"
                onClick={() => setIsTheaterMode(false)}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                ✕ Exit Fullscreen
              </button>
            </div>
          </div>
          <div
            className="flex-1 w-full max-w-7xl mx-auto rounded-2xl overflow-hidden bg-black shadow-2xl relative flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src="/assets/videos/pust_community_reel.mp4"
              controls
              autoPlay
              className="max-h-full max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
