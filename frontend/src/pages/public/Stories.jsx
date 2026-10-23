import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ya as initialStories,
  O as awardWinners,
  Ia,
  La,
  Ra,
  za,
  Ba,
  Va,
  Ha,
  Ua,
  Wa,
  Ga,
  Ka,
  qa,
  Ja,
  Ya,
  Xa,
  Za,
  Qa,
  pa,
} from "../../data/mockData";
import { api, useBackendSync, getCurrentUser } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";

// Curated additional alumni stories and campus news items
const curatedStories = [
  {
    id: 101,
    title: "PUST 3rd National Convocation: 1,500 Degree Recipients to be Honored on Central Ground",
    author: {
      name: "Office of the Registrar",
      dept: "University Administration",
      batch: "Official Notice",
      currentRole: "PUST Directorate of Public Relations",
      avatar: Ia,
    },
    category: "Campus News",
    date: "Oct 2026",
    readTime: "4 min",
    img: Ha,
    excerpt:
      "Preparations are underway for the grand 3rd National Convocation. Degree recipients from undergraduate and graduate programs across all 21 departments will receive formal certificates and mementos.",
    featured: true,
    likes: 342,
    content:
      "Pabna University of Science and Technology (PUST) is gearing up for its historic 3rd National Convocation ceremony on the central campus grounds. The convocation assembly will be presided over by national academic leadership and university dignitaries, conferring formal degrees upon 1,500 graduates across engineering, science, business administration, and humanities.\n\nThe Directorate of Student and Alumni Affairs has established dedicated gown collection counters, commemorative folder distribution booths, and photo exhibition hubs. Alumni traveling from both within Bangladesh and across global diaspora chapters in North America, Europe, and the Middle East are invited to register early for campus security clearance and VIP gate passes.",
  },
  {
    id: 102,
    title: "PUST Physics Researchers Publish Breakthrough Superconductor Study in Nature Materials",
    author: {
      name: "Prof. Dr. Farhana Akter",
      dept: "Department of Physics",
      batch: "Faculty Researcher",
      currentRole: "Dean, Faculty of Science",
      avatar: za,
    },
    category: "Research & Innovation",
    date: "Sep 2026",
    readTime: "6 min",
    img: Ba,
    excerpt:
      "A pioneering study on low-temperature quantum phase transitions in nanoscale thin films co-authored by PUST faculty and alumni researchers receives global recognition.",
    featured: false,
    likes: 289,
    content:
      "In a major institutional milestone, research conducted at the PUST Advanced Materials Laboratory in collaboration with international institutions has been published in the prestigious journal Nature Materials. The study explores novel mechanisms for room-temperature quantum conductivity.\n\nUndergraduate and graduate research assistants from PUST actively contributed to data synthesis and numerical modeling. This marks a new era for scientific research at PUST, cementing the university's reputation as a growing powerhouse of scientific innovation in Bangladesh.",
  },
  {
    id: 103,
    title: "Pioneering Biomedical Devices for Remote River-Island Clinics in Northern Bangladesh",
    author: {
      name: "Engr. Tanvir Ahmed",
      dept: "Electrical & Electronic Engineering",
      batch: "2013",
      currentRole: "Founder & CTO, PulseTech Health Solutions",
      avatar: pa[1]?.avatar || Ia,
    },
    category: "Social Impact",
    date: "Aug 2026",
    readTime: "5 min",
    img: Xa,
    excerpt:
      "Deploying portable solar-powered healthcare diagnostic tools across remote river-island communities along the Jamuna and Padma rivers.",
    featured: false,
    likes: 215,
    content:
      "When we graduated from the EEE department at PUST, our final year thesis focused on low-power sensor arrays and telemetry. Years later, that foundational university research evolved into our social enterprise, which currently equips over 140 remote rural clinic outposts with reliable diagnostic hardware.\n\nPUST instilled in us the resolve to solve grassroots challenges through resilient engineering. Being able to serve marginalized populations who lack constant electricity is the greatest fulfillment of our engineering degree.",
  },
  {
    id: 104,
    title: "Scaling a Fintech Startup from Pabna to 1 Million Micro-Merchants",
    author: {
      name: "Rahnuma Islam",
      dept: "Business Administration (BBA)",
      batch: "2016",
      currentRole: "Co-Founder & CEO, ShebaPay",
      avatar: pa[3]?.avatar || La,
    },
    category: "Entrepreneurship",
    date: "Jul 2026",
    readTime: "7 min",
    img: Wa,
    excerpt:
      "How a student venture conceived in PUST computer labs transitioned into a central-bank licensed payment gateway facilitating digital transactions for cottage artisans.",
    featured: false,
    likes: 310,
    content:
      "Starting up while studying at PUST taught us agility, persistence, and practical problem-solving. With invaluable mentorship from CSE and BBA faculty, we designed our earliest payment prototypes in campus computer labs.\n\nToday, ShebaPay processes daily transactions for thousands of weavers, artisans, and small retailers across Rajshahi, Khulna, and Dhaka divisions. We regularly recruit talented PUST software engineers because of their work ethic and technical depth.",
  },
  {
    id: 105,
    title: "From Pabna to Silicon Valley & Toronto: Engineering Global Commerce at Shopify",
    author: {
      name: "Tahmid Chowdhury",
      dept: "Business Administration",
      batch: "2015",
      currentRole: "Lead Product Manager, Shopify",
      avatar: pa[2]?.avatar || Ja,
    },
    category: "Career Journey",
    date: "Jun 2026",
    readTime: "8 min",
    img: Ja,
    excerpt:
      "How five formative years at PUST prepared me for a career spanning three continents and leading international checkout architectures for millions of global merchants.",
    featured: false,
    likes: 420,
    content:
      "Growing up on the PUST campus, our cohort did not have access to Silicon Valley networks, but we possessed immense curiosity and faculty mentors who believed in us. We spent nights learning product design, distributed systems, and open-source contributions.\n\nFrom leading early operations at Pathao in Dhaka to heading international product teams at Shopify in North America, the foundational discipline and resilience nurtured in Pabna remain my greatest strength.",
  },
  {
    id: 106,
    title: "Preserving Bangladesh's Architectural Heritage Along the Padma River Basin",
    author: {
      name: "Ar. Saima Chowdhury",
      dept: "Architecture & Planning",
      batch: "2014",
      currentRole: "Principal Heritage Architect, Bengal Studio",
      avatar: pa[0]?.avatar || za,
    },
    category: "Academia",
    date: "May 2026",
    readTime: "6 min",
    img: Ra,
    excerpt:
      "Documenting and revitalizing century-old historic terracotta structures, colonial rail architecture, and zamindar estates across Pabna and Rajshahi.",
    featured: false,
    likes: 182,
    content:
      "Pabna is steeped in architectural richness, from the historic Himaitpur Satsang ashram to the vintage British rail heritage of Ishwardi. My studio training at PUST sparked a lifelong dedication to heritage preservation and sustainable urban planning.\n\nOur current national heritage preservation initiative has documented over 45 historic sites along the Padma basin, engaging undergraduate PUST architecture apprentices in field mapping.",
  },
];

const CATEGORIES = [
  "All News & Stories",
  "Campus News",
  "Career Journey",
  "Research & Innovation",
  "Entrepreneurship",
  "Social Impact",
  "Academia",
  "Bookmarked",
];

const CAMPUS_VOICES = [
  {
    photo: La,
    cat: "Achievement",
    title: "PUST Alumni Award Night 2026",
    sub: "Celebrating excellence across industries and public service",
  },
  {
    photo: za,
    cat: "Development",
    title: "Faculty Training: Modern Pedagogy",
    sub: "Building the next generation of academic leaders with IQAC",
  },
  {
    photo: Ba,
    cat: "Technology",
    title: "National Tech Hackathon at PUST",
    sub: "Over 350 university engineers competing on campus",
  },
  {
    photo: Ra,
    cat: "Leadership",
    title: "PUST Vision 2030 Roadmap",
    sub: "Shaping modern laboratory facilities and research hubs",
  },
];

const PHOTO_STRIP = [Ia, La, Ra, za, Ba, Va, Ha, Ka, Wa, Xa, qa, Ja, Qa, Ua, Za, Ya, Ga];

export default function Stories() {
  useBackendSync();
  usePageMeta(
    "News & Stories — PUST Alumni Directorate",
    "Stay updated with university announcements, breakthrough research, alumni achievements, and inspiring chronicles from the global PUST community."
  );

  const [selectedCategory, setSelectedCategory] = useState("All News & Stories");
  const [searchQuery, setSearchQuery] = useState("");

  // Live stories state (merging backend + curated + mock)
  const [storiesList, setStoriesList] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_submitted_stories");
      const submitted = stored ? JSON.parse(stored) : [];
      const combined = [
        ...submitted,
        ...curatedStories,
        ...initialStories.filter((s) => !curatedStories.some((c) => c.id === s.id)),
      ];
      return combined;
    } catch {
      return [...curatedStories, ...initialStories];
    }
  });

  // Saved/Bookmarked stories
  const [savedStoryIds, setSavedStoryIds] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_saved_stories");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return new Set(parsed.map(Number));
      }
      return new Set([101, 105]); // default saved
    } catch {
      return new Set([101, 105]);
    }
  });

  // Likes map (live like counters)
  const [likesMap, setLikesMap] = useState(() => {
    const map = {};
    [...curatedStories, ...initialStories].forEach((s) => {
      map[s.id] = Number(s.likes) || Math.floor(40 + Math.random() * 160);
    });
    return map;
  });

  // Modals state
  const [readingStory, setReadingStory] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Reader interactive settings
  const [fontSize, setFontSize] = useState("normal"); // normal | large | xlarge
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Reader comments/reflections map
  const [commentsMap, setCommentsMap] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_story_comments");
      return stored ? JSON.parse(stored) : {
        101: [
          { name: "Tanvir Ahmed (Batch '13)", text: "Honored to attend the convocation rehearsal! Congratulations to all degree recipients.", time: "2 hours ago" },
          { name: "Nusrat Jahan", text: "Proud moment for PUST. See you all on Central Ground!", time: "5 hours ago" }
        ],
        105: [
          { name: "Arifur Rahman", text: "Truly inspiring journey from Pabna to Shopify!", time: "1 day ago" }
        ]
      };
    } catch {
      return {};
    }
  });
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentName, setNewCommentName] = useState("");

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  // Background Video State
  const [isMuted, setIsMuted] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const toggleMute = () => {
    const iframe = document.getElementById("youtube-stories-bg-iframe");
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (iframe && iframe.contentWindow) {
      const command = nextMuted ? "mute" : "unMute";
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*"
      );
    }
    const localVideo = document.getElementById("fallback-stories-video");
    if (localVideo) {
      localVideo.muted = nextMuted;
    }
  };

  const handleFullscreenCinema = () => {
    const iframe = document.getElementById("youtube-stories-bg-iframe");
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen().catch(() => setIsTheaterMode(true));
      } else {
        setIsTheaterMode(true);
      }
    } else {
      setIsTheaterMode(true);
    }
  };

  // Handle ESC key for theater mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isTheaterMode) {
        setIsTheaterMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTheaterMode]);

  // Submission Form State
  const [submitForm, setSubmitForm] = useState({
    name: "",
    email: "",
    dept: "",
    batch: "",
    currentRole: "",
    title: "",
    category: "Career Journey",
    coverImg: Ha,
    excerpt: "",
    storyText: "",
  });

  // Prefill logged in user
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setSubmitForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        dept: user.dept || prev.dept,
        batch: user.batch ? String(user.batch) : prev.batch,
      }));
      setNewCommentName(user.name || "");
    }
  }, []);

  // Fetch live backend stories on Mount
  useEffect(() => {
    let isMounted = true;
    api
      .getStories()
      .then((res) => {
        if (!isMounted) return;
        const fetched = res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(fetched) && fetched.length > 0) {
          setStoriesList((prev) => {
            const map = new Map();
            prev.forEach((s) => map.set(s.id, s));
            fetched.forEach((s) => map.set(s.id, { ...s, id: Number(s.id) || s.id }));
            return Array.from(map.values());
          });
        }
      })
      .catch((err) => {
        console.warn("Using local stories:", err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Audio Speech Narrator handler
  const toggleSpeechNarrator = (textToRead) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      showToast("Audio synthesis is not supported on this browser.", "info");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      showToast("Audio narration paused.", "info");
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      showToast("🎧 Reading story aloud...", "success");
    }
  };

  // Cancel speech on unmount or closing reader
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [readingStory]);

  // Handle Like/Applaud
  const handleLike = (storyId, e) => {
    if (e) e.stopPropagation();
    api.likeStory(storyId).catch(() => {});
    setLikesMap((prev) => ({
      ...prev,
      [storyId]: (prev[storyId] || 0) + 1,
    }));
    showToast("👏 Thank you for applauding this story!", "success");
  };

  // Handle Toggle Bookmark
  const handleToggleBookmark = (storyId, e) => {
    if (e) e.stopPropagation();
    const nextSet = new Set(savedStoryIds);
    if (nextSet.has(storyId)) {
      nextSet.delete(storyId);
      showToast("Removed from bookmarks.", "info");
    } else {
      nextSet.add(storyId);
      showToast("★ Saved to your bookmarks!", "success");
    }
    setSavedStoryIds(nextSet);
    try {
      localStorage.setItem("pust_saved_stories", JSON.stringify(Array.from(nextSet)));
    } catch {}
  };

  // Add Comment/Reflection to reading story
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!readingStory || !newCommentText.trim()) return;
    const authorName = newCommentName.trim() || "PUST Alumni Reader";
    const commentObj = {
      name: authorName,
      text: newCommentText.trim(),
      time: "Just now",
    };
    const nextComments = {
      ...commentsMap,
      [readingStory.id]: [commentObj, ...(commentsMap[readingStory.id] || [])],
    };
    setCommentsMap(nextComments);
    try {
      localStorage.setItem("pust_story_comments", JSON.stringify(nextComments));
    } catch {}
    setNewCommentText("");
    showToast("💬 Reflection posted successfully!", "success");
  };

  // Filtered stories logic
  const filteredStories = useMemo(() => {
    return storiesList.filter((story) => {
      if (selectedCategory === "Bookmarked") {
        if (!savedStoryIds.has(story.id)) return false;
      } else if (
        selectedCategory !== "All News & Stories" &&
        story.category !== selectedCategory
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (story.title || "").toLowerCase().includes(q);
        const matchExcerpt = (story.excerpt || "").toLowerCase().includes(q);
        const matchAuthor = (story.author?.name || "").toLowerCase().includes(q);
        const matchDept = (story.author?.dept || "").toLowerCase().includes(q);
        const matchCategory = (story.category || "").toLowerCase().includes(q);
        if (!matchTitle && !matchExcerpt && !matchAuthor && !matchDept && !matchCategory) {
          return false;
        }
      }
      return true;
    });
  }, [storiesList, selectedCategory, searchQuery, savedStoryIds]);

  // Lead featured story
  const featuredStory = useMemo(() => {
    return filteredStories.find((s) => s.featured) || filteredStories[0] || storiesList[0];
  }, [filteredStories, storiesList]);

  // Handle REAL story submission
  const handleSubmitStory = async (e) => {
    e.preventDefault();
    if (!submitForm.title.trim() || !submitForm.storyText.trim()) return;

    const wordCount = submitForm.storyText.trim().split(/\s+/).length;
    const calculatedReadTime = `${Math.max(3, Math.ceil(wordCount / 150))} min`;

    const newStory = {
      id: Date.now(),
      title: submitForm.title.trim(),
      category: submitForm.category || "Career Journey",
      date: "Oct 2026",
      readTime: calculatedReadTime,
      img: submitForm.coverImg || Ha,
      excerpt:
        submitForm.excerpt.trim() ||
        submitForm.storyText.slice(0, 160).trim() + "...",
      content: submitForm.storyText.trim(),
      featured: false,
      likes: 1,
      author: {
        name: submitForm.name.trim() || "PUST Alumni Member",
        dept: submitForm.dept.trim() || "Pabna University of Science & Technology",
        batch: submitForm.batch.trim() || "2026",
        currentRole: submitForm.currentRole.trim() || "Alumni Leader",
        avatar: Ia,
        email: submitForm.email.trim(),
      },
    };

    try {
      await api.createStory(newStory);
    } catch (err) {
      console.warn("Backend sync fallback for story:", err.message);
    }

    // Prepend to stories list live!
    setStoriesList((prev) => [newStory, ...prev]);

    // Persist locally
    try {
      const stored = localStorage.getItem("pust_submitted_stories");
      const arr = stored ? JSON.parse(stored) : [];
      localStorage.setItem("pust_submitted_stories", JSON.stringify([newStory, ...arr]));
    } catch {}

    setIsSubmitSuccess(true);
    showToast("🎉 Your story has been submitted and published live!", "success");

    setTimeout(() => {
      setIsSubmitModalOpen(false);
      setIsSubmitSuccess(false);
      setSubmitForm({
        name: "",
        email: "",
        dept: "",
        batch: "",
        currentRole: "",
        title: "",
        category: "Career Journey",
        coverImg: Ha,
        excerpt: "",
        storyText: "",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#475569]">
      {/* =========================================================================
          1. BREAKING NEWS & ANNOUNCEMENT TICKER
         ========================================================================= */}
      <div className="bg-[#0F1A2A] text-white border-b border-white/10 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] bg-[#7A1737] text-white flex-shrink-0 animate-pulse">
              ⚡ LIVE NEWS
            </span>
            <div className="text-slate-200 truncate font-medium">
              <span className="font-bengali">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়:</span> 3rd
              National Convocation gowns distribution · PUST Physics team publishes in Nature
              Materials · North America Chapter Gala in New York
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#C7A76C] font-semibold flex-shrink-0">
            <span>📅 {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            <span>· Pabna, Bangladesh</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. STABLE FULL-PAGE CAMPUS REAL VIEW VIDEO HERO (YouTube: U-_F7Dhl2tA)
         ========================================================================= */}
      <section
        id="campus-real-view"
        data-no-reveal="true"
        aria-label="PUST Campus Celebration & Stories Video"
        className="relative w-full overflow-hidden bg-black flex flex-col justify-between select-none"
        style={{
          height: "calc(100vh - 146px)",
          minHeight: "500px",
          maxHeight: "820px",
        }}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
          <video
            id="fallback-stories-video"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster="/assets/1778991857DSC05306__1_-Bl7-Lfr0.jpeg"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-full h-full object-cover"
            style={{ filter: "brightness(0.92) contrast(1.05)" }}
          >
            <source src="/assets/videos/pust_convocation_memories.mp4" type="video/mp4" />
          </video>

          <iframe
            id="youtube-stories-bg-iframe"
            src="https://www.youtube.com/embed/U-_F7Dhl2tA?autoplay=1&mute=1&controls=0&loop=1&playlist=U-_F7Dhl2tA&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1"
            title="Flashmob PUST || Pabna University of Science and Technology"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-none select-none z-10"
            style={{
              width: "max(100%, 177.78vh)",
              height: "max(100%, 56.25vw)",
              minWidth: "100%",
              minHeight: "100%",
              border: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Top Controls */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 w-full flex items-center justify-between pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-white text-[11px] font-semibold bg-black/70 border border-white/20 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bengali">ক্যাম্পাস স্মৃতি ও লাইভ সেলিব্রেশন ব্যাকগ্রাউন্ড</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-black/70 hover:bg-black/90 border border-white/25 backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            >
              <span>{isMuted ? "🔇 সাউন্ড অফ" : "🔊 সাউন্ড অন"}</span>
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

        {/* Floating Bottom Scroll Prompt */}
        <div className="relative z-20 pb-5 sm:pb-7 text-center pointer-events-none flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("stories-board");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/80 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-[#C7A76C]/40 backdrop-blur-md shadow-xl transition-colors cursor-pointer active:scale-95 ring-1 ring-white/10"
          >
            <span className="text-[#DFCA9E]">📖</span>
            <span className="font-bengali font-normal">নিউজ ও অ্যালামনাই স্টোরি দেখুন</span>
            <span className="text-sm text-[#DFCA9E] animate-bounce">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          3. INSTITUTIONAL METRICS RIBBON
         ========================================================================= */}
      <div id="stories-board" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { value: `${storiesList.length}+`, label: "Articles & News Published" },
              { value: "45", label: "Countries Represented" },
              { value: "1,500+", label: "Convocation Degree Recipients" },
              { value: "98%", label: "Reader Inspiration Rating" },
            ].map((stat, idx) => (
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
          4. HEADER, SEARCH BAR & STORY SUBMIT ACTION
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] shadow-2xs py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-2 text-[#7A1737]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> ·
            PUST Newsroom & Alumni Chronicle
          </p>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#17263C] mb-3 tracking-tight">
            News, Editorial Features & Alumni Journeys
          </h1>
          <p className="text-xs sm:text-sm max-w-2xl mx-auto text-[#64748B] leading-relaxed mb-6">
            Read how PUST graduates are transforming industries, heading research laboratories,
            building resilient startups, and uplifting communities across 45+ nations.
          </p>

          {/* Search Bar & Submit Action */}
          <div className="w-full max-w-2xl mx-auto flex items-center bg-[#F8FAFC] p-2 rounded-xl shadow-md border border-[#E2E8F0] focus-within:border-[#7A1737] focus-within:ring-2 focus-within:ring-[#7A1737]/20 gap-2 transition-all">
            <span className="pl-3 text-sm text-[#94A3B8]">🔍</span>
            <input
              type="text"
              placeholder="Search news by headline, author name, topic, or department…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-2 py-2 text-xs sm:text-sm text-[#17263C] outline-none bg-transparent placeholder-[#94A3B8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#64748B] hover:text-[#17263C] flex items-center justify-center text-xs cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-5 py-2.5 text-xs font-bold rounded-lg bg-[#7A1737] hover:bg-[#62122B] text-white transition-all cursor-pointer shadow-sm flex-shrink-0 active:scale-95 flex items-center gap-1.5"
            >
              <span>+ Submit Your Story</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FEATURED EDITORIAL SPOTLIGHT
         ========================================================================= */}
      {featuredStory && !searchQuery && selectedCategory === "All News & Stories" && (
        <section className="py-10 bg-transparent reveal-section">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A1737] border-b-2 border-[#7A1737] pb-1 inline-block">
                ★ Editor's Lead Feature
              </p>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Official PUST Newsdesk
              </span>
            </div>

            <div className="flex flex-col lg:flex-row overflow-hidden rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
              <div className="relative lg:w-[480px] flex-shrink-0 overflow-hidden min-h-[320px] reveal-left group">
                <img
                  src={featuredStory.img || Ha}
                  alt={featuredStory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(23,38,60,0.2) 0%, rgba(23,38,60,0.85) 100%)",
                  }}
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-[#7A1737] text-white shadow-xs">
                    {featuredStory.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-3 py-1 rounded bg-black/60 text-white backdrop-blur-xs border border-white/20">
                    ⏱️ {featuredStory.readTime}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between reveal-right">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase text-[#C7A76C]">
                      {featuredStory.date}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-[#64748B]">
                      {featuredStory.author?.dept}
                    </span>
                  </div>

                  <h2
                    className="font-display font-bold text-[#17263C] leading-snug mb-3 hover:text-[#7A1737] transition-colors cursor-pointer"
                    onClick={() => setReadingStory(featuredStory)}
                    style={{ fontSize: "clamp(1.3rem, 2.8vw, 1.9rem)" }}
                  >
                    {featuredStory.title}
                  </h2>

                  <div className="mb-5 pl-4 border-l-2 border-[#7A1737]">
                    <p className="text-xs sm:text-sm leading-relaxed italic text-[#475569]">
                      "{featuredStory.excerpt}"
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredStory.author?.avatar || Ia}
                        alt={featuredStory.author?.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
                      />
                      <div>
                        <p className="font-bold text-[#17263C] text-xs sm:text-sm">
                          {featuredStory.author?.name}
                        </p>
                        <p className="text-[10px] text-[#64748B]">
                          {featuredStory.author?.currentRole || featuredStory.author?.dept}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleLike(featuredStory.id, e)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-xs font-semibold text-[#475569] hover:text-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>👏</span>
                        <span>{likesMap[featuredStory.id] || 342}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(featuredStory.id, e)}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                          savedStoryIds.has(featuredStory.id)
                            ? "bg-amber-50 text-amber-600 border-amber-200"
                            : "bg-white text-slate-400 hover:text-amber-500 border-slate-200"
                        }`}
                        title="Bookmark"
                      >
                        ★
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setReadingStory(featuredStory)}
                    className="w-full sm:w-auto text-xs sm:text-sm font-bold px-7 py-3 rounded-xl bg-[#7A1737] hover:bg-[#62122B] text-white shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Read Full Story & Reflections →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          6. PHOTO STRIP DIVIDER
         ========================================================================= */}
      <div className="flex overflow-hidden opacity-40 border-y border-[#E2E8F0] h-16">
        {PHOTO_STRIP.map((imgSrc, idx) => (
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

      {/* =========================================================================
          7. EDITORIAL STORIES & NEWS GRID
         ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Category Filter Pills & Counter */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#7A1737] text-white shadow-2xs font-bold"
                    : "bg-white text-[#475569] border border-[#E2E8F0] hover:text-[#7A1737] hover:border-[#7A1737]"
                }`}
              >
                {cat === "Bookmarked" ? `★ Bookmarked (${savedStoryIds.size})` : cat}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#64748B]">
            Showing <strong className="text-[#17263C]">{filteredStories.length}</strong> of{" "}
            <strong>{storiesList.length}</strong> news articles
          </p>
        </div>

        {/* Empty State */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
            <p className="text-4xl mb-3 text-[#94A3B8]">📰</p>
            <h3 className="font-display font-semibold text-[#17263C] text-lg mb-1">
              No News or Stories Match Your Filter
            </h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto mb-5 leading-relaxed">
              Try selecting "All News & Stories" or clearing your search keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All News & Stories");
                setSearchQuery("");
              }}
              className="btn-maroon px-5 py-2 text-xs font-semibold rounded-lg text-white"
              style={{ backgroundColor: "#7A1737" }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Stories Cards Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredStories.map((story) => {
              const likesCount = likesMap[story.id] || story.likes || 1;
              const isSaved = savedStoryIds.has(story.id);

              return (
                <article
                  key={story.id}
                  onClick={() => setReadingStory(story)}
                  className="group overflow-hidden rounded-xl cursor-pointer transition-all bg-white border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-md flex flex-col"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={story.img || Ha}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600 opacity-90"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(23,38,60,0.85) 0%, rgba(23,38,60,0.2) 60%, transparent 100%)",
                      }}
                    />
                    <span className="absolute top-3 left-3 text-[9px] font-bold px-2.5 py-1 uppercase tracking-wide rounded bg-white text-[#17263C] shadow-2xs">
                      {story.category}
                    </span>
                    <span className="absolute top-3 right-3 text-[9px] font-medium px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs border border-white/20">
                      {story.readTime}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-display font-bold text-white text-sm leading-snug group-hover:text-[#C7A76C] transition-colors line-clamp-2">
                        {story.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <p className="text-xs leading-relaxed mb-4 text-[#475569] line-clamp-3">
                      {story.excerpt}
                    </p>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-3">
                        <span>📅 {story.date}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleLike(story.id, e)}
                            className="hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Applaud story"
                          >
                            <span>👏</span>
                            <span className="font-semibold">{likesCount}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleToggleBookmark(story.id, e)}
                            className={`cursor-pointer ${
                              isSaved ? "text-amber-500 font-bold" : "text-slate-400 hover:text-amber-500"
                            }`}
                            title="Bookmark"
                          >
                            ★
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 pt-3 border-t border-[#E2E8F0]">
                        <img
                          src={story.author?.avatar || Ia}
                          alt={story.author?.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-[#E2E8F0]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#17263C] truncate">
                            {story.author?.name}
                          </p>
                          <p className="text-[10px] truncate text-[#64748B]">
                            {story.author?.batch ? `Batch ${story.author.batch} · ` : ""}
                            {story.author?.dept}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-[#7A1737] group-hover:underline">
                          Read Story →
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 8. VOICES FROM THE PUST CAMPUS */}
        <div className="mb-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-6 inline-block pb-2 text-[#7A1737] border-b-2 border-[#7A1737]">
            Dispatches & Campus Snapshots
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAMPUS_VOICES.map((item, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl border border-[#E2E8F0] hover:border-[#7A1737]/40 shadow-2xs hover:shadow-md transition-all h-44 cursor-pointer"
              >
                <img
                  src={item.photo}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(23,38,60,0.2) 0%, rgba(23,38,60,0.92) 100%)",
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest mb-1 text-[#C7A76C]">
                    {item.cat}
                  </span>
                  <p className="font-display font-bold text-white text-xs sm:text-sm leading-snug mb-1">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-200 line-clamp-1">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* =========================================================================
          8. ALUMNI HALL OF FAME AWARDS
         ========================================================================= */}
      <section
        className="relative overflow-hidden border-y border-[#0F1A2A]"
        style={{ background: "#17263C" }}
      >
        <img src={Qa} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-[#C7A76C]">
              Institutional Honors
            </p>
            <h2
              className="font-display font-bold text-white"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
            >
              PUST Alumni Hall of Fame
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2">
              Recognizing graduates who exemplify leadership, social transformation, and academic
              eminence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {awardWinners.map((awardee) => (
              <div
                key={awardee.award}
                className="group text-center p-6 rounded-xl transition-all bg-white/5 border border-white/10 hover:border-white/25 backdrop-blur-xs"
              >
                <div className="relative inline-block mb-4">
                  <div className="w-[72px] h-[72px] rounded-full p-[3px] mx-auto border-2 border-[#C7A76C]">
                    <img
                      src={awardee.img}
                      alt={awardee.name}
                      className="w-full h-full rounded-full object-cover border border-white/20"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[#C7A76C] text-[#17263C] shadow-xs">
                    ★
                  </span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 block mb-2 rounded bg-white/10 border border-white/15 text-[#C7A76C]">
                  {awardee.award}
                </span>
                <h3 className="font-display font-bold text-white text-sm mb-1">{awardee.name}</h3>
                <p className="text-[10px] leading-relaxed mb-2 text-slate-300">{awardee.desc}</p>
                <p className="font-bold text-sm text-[#C7A76C]">{awardee.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. SUBMIT YOUR STORY BOTTOM CTA
         ========================================================================= */}
      <section className="flex flex-col lg:flex-row overflow-hidden border-t border-[#E2E8F0]">
        <div
          className="lg:w-2/5 relative overflow-hidden bg-[#17263C] border-b lg:border-b-0 lg:border-r border-[#E2E8F0]"
          style={{ minHeight: 220 }}
        >
          <img
            src={Ra}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top opacity-35"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(23,38,60,0.4) 0%, rgba(23,38,60,0.85) 100%)",
            }}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 py-12 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-[#7A1737]">
            Your Story Inspires the Next Generation
          </p>
          <h2
            className="font-display font-bold text-[#17263C] mb-3"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}
          >
            Share Your PUST Story or Campus News
          </h2>
          <p className="text-xs sm:text-sm mb-7 max-w-lg text-[#64748B] leading-relaxed">
            Every career milestone, research publication, and startup founded by PUST alumni provides
            invaluable inspiration for thousands of current students and fellow alumni worldwide.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="text-xs sm:text-sm font-bold px-8 py-3 rounded-xl bg-[#7A1737] hover:bg-[#62122B] text-white transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Submit Your Story Now →
            </button>
            <Link
              to="/directory"
              className="text-xs sm:text-sm font-semibold text-[#17263C] px-8 py-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer text-center"
            >
              Browse Alumni Directory
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. THE ULTIMATE IMMERSIVE ARTICLE READER MODAL (BEAUTIFUL EDITORIAL)
         ========================================================================= */}
      {readingStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setReadingStory(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#CBD5E1] animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Reader Utility Bar */}
            <div className="sticky top-0 z-20 bg-[#17263C] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10 shadow-sm">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] px-2 py-0.5 rounded bg-white/10">
                  {readingStory.category}
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline">
                  ⏱️ {readingStory.readTime}
                </span>
              </div>

              {/* Reader Controls: Font Size, Audio Read, Print, Close */}
              <div className="flex items-center gap-2">
                {/* Font Size Adjuster */}
                <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setFontSize("normal")}
                    className={`px-2 py-0.5 text-xs font-bold rounded ${
                      fontSize === "normal" ? "bg-white text-[#17263C]" : "text-white"
                    }`}
                    title="Standard Font Size"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize("large")}
                    className={`px-2 py-0.5 text-xs font-bold rounded ${
                      fontSize === "large" ? "bg-white text-[#17263C]" : "text-white"
                    }`}
                    title="Large Font Size"
                  >
                    A+
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize("xlarge")}
                    className={`px-2 py-0.5 text-xs font-bold rounded ${
                      fontSize === "xlarge" ? "bg-white text-[#17263C]" : "text-white"
                    }`}
                    title="Extra Large Font Size"
                  >
                    A++
                  </button>
                </div>

                {/* Audio Narrator */}
                <button
                  type="button"
                  onClick={() =>
                    toggleSpeechNarrator(
                      `${readingStory.title}. By ${readingStory.author?.name || "PUST Alumni"}. ${
                        readingStory.excerpt
                      }. ${readingStory.content}`
                    )
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isSpeaking
                      ? "bg-emerald-500 text-white animate-pulse"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  title={isSpeaking ? "Pause Narration" : "Listen to Story"}
                >
                  <span>{isSpeaking ? "⏸️ Pause" : "🎧 Listen"}</span>
                </button>

                {/* Print Article */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  title="Print Article"
                >
                  🖨️
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setReadingStory(null)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm cursor-pointer ml-1"
                  aria-label="Close reader"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Editorial Article Body */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Headline */}
              <h1
                className="font-display font-bold text-[#17263C] leading-tight"
                style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.3rem)" }}
              >
                {readingStory.title}
              </h1>

              {/* Author Info Bar */}
              <div className="flex items-center justify-between py-3.5 border-y border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <img
                    src={readingStory.author?.avatar || Ia}
                    alt={readingStory.author?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#C7A76C]"
                  />
                  <div>
                    <p className="font-bold text-[#17263C] text-sm sm:text-base">
                      {readingStory.author?.name}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {readingStory.author?.currentRole || readingStory.author?.dept} ·{" "}
                      {readingStory.author?.batch ? `Batch ${readingStory.author.batch} · ` : ""}
                      {readingStory.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleLike(readingStory.id, e)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-xs font-bold text-[#475569] hover:text-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>👏</span>
                    <span>{likesMap[readingStory.id] || 342}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleToggleBookmark(readingStory.id, e)}
                    className={`p-2 rounded-lg border text-xs cursor-pointer ${
                      savedStoryIds.has(readingStory.id)
                        ? "bg-amber-50 text-amber-600 border-amber-200 font-bold"
                        : "bg-white text-slate-400 hover:text-amber-500 border-slate-200"
                    }`}
                    title="Bookmark"
                  >
                    ★
                  </button>
                </div>
              </div>

              {/* Hero Photo with Caption */}
              <div className="rounded-2xl overflow-hidden relative border border-[#E2E8F0] shadow-xs">
                <img
                  src={readingStory.img || Ha}
                  alt={readingStory.title}
                  className="w-full h-64 sm:h-84 object-cover"
                />
                <div className="bg-[#F8FAFC] px-4 py-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex justify-between items-center">
                  <span>Photo: Official PUST Archive & Media Directorate</span>
                  <span>Category: {readingStory.category}</span>
                </div>
              </div>

              {/* Lead Pull-Quote */}
              <div className="p-5 rounded-xl bg-slate-50 border-l-4 border-[#7A1737] shadow-2xs">
                <p className="font-display font-medium italic text-[#17263C] text-sm sm:text-base leading-relaxed">
                  "{readingStory.excerpt}"
                </p>
              </div>

              {/* Key Milestones & Takeaways Box */}
              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
                <p className="font-bold text-[#7A1737] uppercase tracking-wider text-[11px]">
                  📌 Key Highlights & Institutional Impact
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[#475569] leading-relaxed">
                  <li>Formative academic training and laboratory mentorship at PUST.</li>
                  <li>Transdisciplinary collaboration between faculty, alumni, and industry partners.</li>
                  <li>Continuous commitment to mentoring current undergraduate and graduate batches.</li>
                </ul>
              </div>

              {/* Narrative Content with Dynamic Font Sizing */}
              <div
                className={`text-[#475569] leading-relaxed space-y-4 ${
                  fontSize === "large"
                    ? "text-base sm:text-lg"
                    : fontSize === "xlarge"
                    ? "text-lg sm:text-xl"
                    : "text-xs sm:text-sm"
                }`}
              >
                <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[#7A1737] first-letter:mr-1 first-letter:float-left">
                  {readingStory.content}
                </p>

                <p>
                  Reflecting upon our university days on the Pabna campus, the collaborative laboratory
                  ethos, peer camaraderie, and late-night study sessions built a foundation of resilience.
                  Whether tackling complex engineering systems or establishing entrepreneurial ventures,
                  the ethos of PUST continues to serve as an enduring compass across global frontiers.
                </p>

                <p>
                  As the PUST alumni network expands globally, staying committed to giving back—through
                  active student mentoring, campus workshops, and research grants—ensures that our
                  collective institutional legacy will continue to empower future generations of leaders.
                </p>
              </div>

              {/* Author Bio Card */}
              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center gap-4 text-xs">
                <img
                  src={readingStory.author?.avatar || Ia}
                  alt={readingStory.author?.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#C7A76C]"
                />
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-bold text-[#17263C] text-sm">{readingStory.author?.name}</p>
                  <p className="text-[11px] text-[#7A1737] font-semibold mb-1">
                    {readingStory.author?.currentRole || readingStory.author?.dept}
                  </p>
                  <p className="text-[#64748B] text-[11px] leading-relaxed">
                    PUST alumnus actively contributing to the university community and global professional
                    pathways. Available for student career guidance.
                  </p>
                </div>
                <Link
                  to="/directory"
                  onClick={() => setReadingStory(null)}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-[#7A1737] text-[#7A1737] hover:bg-[#7A1737] hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  View in Directory
                </Link>
              </div>

              {/* Reader Reflections / Comments Section */}
              <div className="pt-6 border-t border-[#E2E8F0] space-y-4">
                <h4 className="font-bold text-[#17263C] text-sm flex items-center justify-between">
                  <span>💬 Reader Reflections & Notes ({commentsMap[readingStory.id]?.length || 0})</span>
                  <span className="text-xs text-[#64748B] font-normal">Leave an inspiring note</span>
                </h4>

                {/* Comment Form */}
                <form onSubmit={handleAddComment} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Your name / Batch…"
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      className="w-1/3 px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Write an encouraging note or reflection on this story…"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-[#17263C] hover:bg-[#0D1522] text-white transition-colors cursor-pointer shadow-2xs"
                    >
                      Post
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-2.5 pt-2">
                  {(commentsMap[readingStory.id] || []).map((comm, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#17263C]">{comm.name}</span>
                        <span className="text-[10px] text-[#94A3B8]">{comm.time}</span>
                      </div>
                      <p className="text-[#475569]">{comm.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="flex flex-wrap justify-between items-center pt-6 border-t border-[#E2E8F0] gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/news?id=${readingStory.id}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(shareUrl).then(() => {
                        showToast("🔗 Article link copied to clipboard!", "success");
                      });
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#17263C] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>🔗 Copy Article Link</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleLike(readingStory.id, e)}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    👏 Applaud ({likesMap[readingStory.id] || 342})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReadingStory(null)}
                    className="px-6 py-2 text-xs font-bold rounded-lg bg-[#7A1737] text-white hover:bg-[#62122B] transition-colors cursor-pointer"
                  >
                    Close Reader
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          11. REAL FUNCTIONAL STORY & CAMPUS NEWS SUBMIT MODAL
         ========================================================================= */}
      {isSubmitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#17263C] text-white px-6 py-5 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block">
                  PUST Editorial & Media Directorate
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white mt-0.5">
                  Submit Your Story or Campus News
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {isSubmitSuccess ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center text-2xl mx-auto mb-3">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-base text-[#17263C] mb-2">
                    Story Published Successfully!
                  </h4>
                  <p className="text-xs text-[#64748B] max-w-xs mx-auto mb-4">
                    Your story has been permanently recorded and featured on the PUST Newsroom
                    and Alumni Chronicle.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-5 py-2 text-xs font-bold rounded-lg bg-[#7A1737] text-white"
                  >
                    Done & View Story
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitStory} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Engr. Nusrat Jahan"
                        value={submitForm.name}
                        onChange={(e) => setSubmitForm({ ...submitForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alumni@pust.ac.bd"
                        value={submitForm.email}
                        onChange={(e) => setSubmitForm({ ...submitForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Department *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CSE, EEE, Physics"
                        value={submitForm.dept}
                        onChange={(e) => setSubmitForm({ ...submitForm, dept: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Batch / Year *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2014 or 6th Batch"
                        value={submitForm.batch}
                        onChange={(e) => setSubmitForm({ ...submitForm, batch: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Current Role & Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Architect at Brain Station 23 / Ph.D. Researcher at BUET"
                      value={submitForm.currentRole}
                      onChange={(e) =>
                        setSubmitForm({ ...submitForm, currentRole: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Story Headline *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. From Campus Labs to Enterprise Cloud"
                        value={submitForm.title}
                        onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Category
                      </label>
                      <select
                        value={submitForm.category}
                        onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C] bg-white"
                      >
                        <option value="Career Journey">Career Journey</option>
                        <option value="Campus News">Campus News</option>
                        <option value="Research & Innovation">Research</option>
                        <option value="Social Impact">Social Impact</option>
                        <option value="Entrepreneurship">Entrepreneurship</option>
                      </select>
                    </div>
                  </div>

                  {/* Cover Image Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Cover Photo (Select Campus Photo)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[Ha, Ba, Xa, Wa].map((imgItem, i) => (
                        <div
                          key={i}
                          onClick={() => setSubmitForm({ ...submitForm, coverImg: imgItem })}
                          className={`h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                            submitForm.coverImg === imgItem
                              ? "border-[#7A1737] ring-2 ring-[#7A1737]/30 scale-95"
                              : "border-slate-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={imgItem} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Brief Summary / Excerpt *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="One-line summary of your journey or milestone..."
                      value={submitForm.excerpt}
                      onChange={(e) => setSubmitForm({ ...submitForm, excerpt: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Full Story Narrative *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your path after graduating from PUST, research or startup challenges overcome, and advice for junior batches..."
                      value={submitForm.storyText}
                      onChange={(e) =>
                        setSubmitForm({ ...submitForm, storyText: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#17263C] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-bold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      Publish Story Live →
                    </button>
                  </div>
                </form>
              )}
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
                  Flashmob PUST · Pabna University of Science and Technology
                </h3>
                <p className="text-xs text-slate-400">
                  Real Campus Celebration & Memories · Press ESC to exit
                </p>
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
            className="flex-1 w-full max-w-7xl mx-auto rounded-2xl overflow-hidden bg-black shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src="https://www.youtube.com/embed/U-_F7Dhl2tA?autoplay=1&mute=0&controls=1&rel=0"
              title="Flashmob PUST"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === "success"
              ? "bg-[#17263C] text-emerald-400 border-emerald-500/40"
              : "bg-[#17263C] text-white border-white/20"
          }`}
        >
          <span>{toast.type === "success" ? "✓" : "ℹ️"}</span>
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-2 text-white/50 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
