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
import { useBackendSync, getCurrentUser } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";

// Curated additional alumni stories celebrating multi-disciplinary achievements
const curatedStories = [
  {
    id: 4,
    title: "Pioneering Biomedical Devices for Rural Clinics",
    author: {
      name: "Engr. Tanvir Ahmed",
      dept: "Electrical & Electronic Engineering",
      batch: "2013",
      avatar: pa[1]?.avatar || Ia,
    },
    category: "Social Impact",
    date: "Jun 2026",
    readTime: "6 min",
    img: Ba,
    excerpt:
      "Deploying portable solar-powered healthcare diagnostic tools across remote river-island communities in northern Bangladesh.",
    featured: false,
    content:
      "When we graduated from the EEE department at PUST, our graduation project focused on low-power sensor arrays. Years later, that foundational research led to our current enterprise, supplying over 120 rural clinic outposts with reliable diagnostic hardware. PUST instilled in us the resolve to solve real grassroots challenges with robust engineering.",
  },
  {
    id: 5,
    title: "Scaling a Fintech Startup from Pabna to 1 Million Users",
    author: {
      name: "Rahnuma Islam",
      dept: "Business Administration (BBA)",
      batch: "2016",
      avatar: pa[3]?.avatar || La,
    },
    category: "Entrepreneurship",
    date: "May 2026",
    readTime: "8 min",
    img: Xa,
    excerpt:
      "How our student venture transitioned into a licensed merchant gateway facilitating micro-transactions for cottage industries.",
    featured: false,
    content:
      "Starting up while studying at PUST taught us agility. With mentorship from CSE and BBA faculty, we built our earliest payment prototypes in campus computer labs. Today, our company processes daily transactions for artisans and retailers across Rajshahi and Dhaka divisions.",
  },
  {
    id: 6,
    title: "Preserving Bangladesh's Architectural Heritage",
    author: {
      name: "Ar. Saima Chowdhury",
      dept: "Architecture & Planning",
      batch: "2014",
      avatar: pa[0]?.avatar || za,
    },
    category: "Academia",
    date: "Apr 2026",
    readTime: "5 min",
    img: Wa,
    excerpt:
      "Documenting and revitalizing century-old historic zamindar estates and terracotta structures along the Padma basin.",
    featured: false,
    content:
      "Pabna is steeped in architectural richness, from the Himaitpur Satsang ashram to colonial rail architecture. My studio training at PUST sparked a lifelong dedication to heritage preservation and sustainable urban planning.",
  },
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

const CATEGORIES = [
  "All Stories",
  "Career Journey",
  "Social Impact",
  "Academia",
  "Entrepreneurship",
];

const PHOTO_STRIP = [Ia, La, Ra, za, Ba, Va, Ha, Ka, Wa, Xa, qa, Ja, Qa, Ua, Za, Ya, Ga];

export default function Stories() {
  useBackendSync();
  usePageMeta(
    "Alumni Stories & News",
    "Inspiring chronicles and career journeys from Pabna University of Science and Technology alumni making an impact worldwide."
  );

  const [selectedCategory, setSelectedCategory] = useState("All Stories");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [readingStory, setReadingStory] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Background Video State (User's YouTube Video: U-_F7Dhl2tA)
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
      if (!nextMuted) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "setVolume", args: [100] }),
          "*"
        );
      }
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
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
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

  // Submission Form State
  const [submitForm, setSubmitForm] = useState({
    name: "",
    email: "",
    dept: "",
    batch: "",
    currentRole: "",
    title: "",
    category: "Career Journey",
    storyText: "",
  });

  // All combined stories
  const allStories = useMemo(() => {
    const combined = [
      ...initialStories.map((s) => ({
        ...s,
        content:
          s.content ||
          `${s.excerpt} During our years at Pabna University of Science and Technology, academic rigor and collaborative laboratory environments shaped our foundational engineering ethos. Whether transitioning into high-growth software architectures or national infrastructure initiatives, the lessons learned on the PUST campus remain an enduring compass.`,
      })),
      ...curatedStories.filter((c) => !initialStories.some((s) => s.id === c.id)),
    ];
    return combined;
  }, []);

  // Filtered stories
  const filteredStories = useMemo(() => {
    return allStories.filter((story) => {
      if (selectedCategory !== "All Stories" && story.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (story.title || "").toLowerCase().includes(q);
        const matchExcerpt = (story.excerpt || "").toLowerCase().includes(q);
        const matchAuthor = (story.author?.name || "").toLowerCase().includes(q);
        const matchDept = (story.author?.dept || "").toLowerCase().includes(q);
        if (!matchTitle && !matchExcerpt && !matchAuthor && !matchDept) return false;
      }
      return true;
    });
  }, [allStories, selectedCategory, searchQuery]);

  // Lead featured story
  const featuredStory = useMemo(() => {
    return allStories.find((s) => s.featured) || allStories[0];
  }, [allStories]);

  // Handle story submission
  const handleSubmitStory = (e) => {
    e.preventDefault();
    if (!submitForm.title.trim() || !submitForm.storyText.trim()) return;

    setIsSubmitSuccess(true);
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
        storyText: "",
      });
    }, 2400);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#475569]">
      {/* =========================================================================
          1. STABLE FULL-PAGE CAMPUS REAL VIEW VIDEO HERO (YouTube: U-_F7Dhl2tA)
         ========================================================================= */}
      <section
        id="campus-real-view"
        data-no-reveal="true"
        aria-label="PUST Campus Celebration & Stories Video"
        className="relative w-full overflow-hidden bg-black flex flex-col justify-between select-none"
        style={{
          height: "calc(100vh - 116px)",
          minHeight: "520px",
          maxHeight: "860px",
        }}
      >
        {/* Ambient Auto-Player (Pure Edge-to-Edge Auto Loop, No YouTube UI) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
          {/* High-Performance Fallback Local Video for Instant Render */}
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

          {/* User's YouTube Video Embed (U-_F7Dhl2tA) */}
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

        {/* Minimal Floating Top Controls (Clean English, No Obstructive Overlays) */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 w-full flex items-center justify-end pointer-events-auto">
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

        {/* Floating Bottom Button to Smoothly Scroll to Stories Board */}
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
            <span>Explore Alumni Stories</span>
            <span className="text-sm text-[#DFCA9E]">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. INSTITUTIONAL METRICS RIBBON
         ========================================================================= */}
      <div id="stories-board" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { value: "500+", label: "Stories Documented" },
              { value: "45", label: "Countries Represented" },
              { value: "12", label: "Distinguished Awardees" },
              { value: "96%", label: "Reader Inspiration Rating" },
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
          3. INSTITUTIONAL STORIES HEADER & SEARCH
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] shadow-2xs py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-2 text-[#7A1737]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> · PUST Alumni Network · Stories & Impact
          </p>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#17263C] mb-3 tracking-tight">
            Alumni Journeys & Global Impact
          </h1>
          <p className="text-xs sm:text-sm max-w-2xl mx-auto text-[#64748B] leading-relaxed mb-6">
            Read how PUST graduates are transforming industries, heading research laboratories,
            building resilient startups, and uplifting communities across 45+ nations.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-xl mx-auto flex items-center bg-[#F8FAFC] p-2 rounded-xl shadow-md border border-[#E2E8F0] focus-within:border-[#7A1737] focus-within:ring-2 focus-within:ring-[#7A1737]/20 gap-2 transition-all">
            <span className="pl-3 text-sm text-[#94A3B8]">🔍</span>
            <input
              type="text"
              placeholder="Search stories by topic, alumnus name, or department…"
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
              className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#7A1737] hover:bg-[#62122B] text-white transition-all cursor-pointer shadow-sm flex-shrink-0 active:scale-95"
            >
              + Submit Story
            </button>
          </div>
        </div>
      </section>

      {/* 3. FEATURED STORY SPOTLIGHT */}
      {featuredStory && !searchQuery && (
        <section className="py-12 bg-transparent reveal-section">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-6 inline-block pb-2 text-[#7A1737] border-b-2 border-[#7A1737] reveal-up">
              Featured Editorial Spotlight
            </p>

            <div className="flex flex-col lg:flex-row overflow-hidden rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#7A1737]/40 hover:shadow-md transition-all">
              <div className="relative lg:w-[480px] flex-shrink-0 overflow-hidden min-h-[320px] reveal-left">
                <img
                  src={Ha}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-25"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(23,38,60,0.4) 0%, rgba(23,38,60,0.85) 100%)",
                  }}
                />
                <div className="absolute inset-6 overflow-hidden rounded-xl border border-white/20">
                  <img
                    src={featuredStory.img || Ha}
                    alt={featuredStory.title}
                    className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute top-6 left-6 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-[#7A1737] text-white shadow-xs">
                    ★ Editor's Pick
                  </span>
                </div>
                <div className="absolute bottom-6 right-6 z-10">
                  <span className="text-[10px] font-bold px-3 py-1.5 rounded bg-black/60 text-white backdrop-blur-xs border border-white/20">
                    {featuredStory.readTime} read
                  </span>
                </div>
              </div>

              <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center reveal-right">
                <span className="text-[10px] font-bold uppercase tracking-widest mb-3 inline-block text-[#7A1737]">
                  {featuredStory.category}
                </span>
                <h2
                  className="font-display font-bold text-[#17263C] leading-tight mb-4"
                  style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)" }}
                >
                  {featuredStory.title}
                </h2>
                <div className="mb-5 pl-4 border-l-2 border-[#7A1737]">
                  <p className="text-sm leading-relaxed italic text-[#475569]">
                    "{featuredStory.excerpt}"
                  </p>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <img
                    src={featuredStory.author?.avatar || Ia}
                    alt={featuredStory.author?.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#E2E8F0]"
                  />
                  <div>
                    <p className="font-bold text-[#17263C] text-sm">
                      {featuredStory.author?.name}
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      {featuredStory.author?.batch
                        ? `Batch ${featuredStory.author.batch} · `
                        : ""}
                      {featuredStory.author?.dept} · {featuredStory.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReadingStory(featuredStory)}
                  className="self-start text-xs sm:text-sm font-semibold px-7 py-3 rounded-xl bg-[#7A1737] hover:bg-[#62122B] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Read Full Story →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. PHOTO STRIP DIVIDER */}
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

      {/* 5. EDITORIAL STORIES GRID */}
      <main className="max-w-5xl mx-auto px-6 py-14">
        {/* Category Pills & Count */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#7A1737] text-white shadow-2xs font-bold"
                    : "bg-white text-[#475569] border border-[#E2E8F0] hover:text-[#7A1737] hover:border-[#7A1737]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#64748B]">
            Showing <strong className="text-[#17263C]">{filteredStories.length}</strong> stories
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredStories.map((story) => (
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
                    Read →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 6. VOICES FROM THE PUST CAMPUS */}
        <div className="mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-6 inline-block pb-2 text-[#7A1737] border-b-2 border-[#7A1737]">
            Dispatches from the PUST Campus
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

      {/* 7. ALUMNI HALL OF FAME AWARDS */}
      <section
        className="relative overflow-hidden border-y border-[#0F1A2A]"
        style={{ background: "#17263C" }}
      >
        <img src={Qa} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-[#C7A76C]">
              Institutional Honors
            </p>
            <h2
              className="font-display font-bold text-white"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
            >
              Alumni Hall of Fame
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

      {/* 8. SUBMIT YOUR STORY BOTTOM CALL-TO-ACTION */}
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
            Your Story Inspires
          </p>
          <h2
            className="font-display font-bold text-[#17263C] mb-3"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}
          >
            Share Your PUST Journey
          </h2>
          <p className="text-xs sm:text-sm mb-7 max-w-lg text-[#64748B] leading-relaxed">
            Every career milestone, research publication, and startup founded by PUST alumni provides
            valuable inspiration for thousands of current students and fellow alumni worldwide.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="text-xs sm:text-sm font-semibold px-8 py-3 rounded-xl bg-[#7A1737] hover:bg-[#62122B] text-white transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Submit Your Story →
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

      {/* 9. FULL STORY READER MODAL */}
      {readingStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setReadingStory(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-[#17263C] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block">
                  {readingStory.category} · {readingStory.readTime}
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white truncate max-w-md">
                  {readingStory.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReadingStory(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="h-56 sm:h-72 rounded-xl overflow-hidden relative">
                <img
                  src={readingStory.img || Ha}
                  alt={readingStory.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-3 py-3 border-y border-[#E2E8F0]">
                <img
                  src={readingStory.author?.avatar || Ia}
                  alt={readingStory.author?.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#E2E8F0]"
                />
                <div>
                  <p className="font-bold text-[#17263C] text-sm">{readingStory.author?.name}</p>
                  <p className="text-xs text-[#64748B]">
                    {readingStory.author?.dept}{" "}
                    {readingStory.author?.batch ? `· Batch ${readingStory.author.batch}` : ""} ·{" "}
                    {readingStory.date}
                  </p>
                </div>
              </div>

              <div className="prose text-xs sm:text-sm text-[#475569] leading-relaxed space-y-4">
                <p className="font-semibold text-[#17263C] text-base leading-snug">
                  "{readingStory.excerpt}"
                </p>
                <p>{readingStory.content}</p>
                <p>
                  Reflecting on the university journey, the guidance of dedicated faculty and the
                  enduring bond of batchmates remain pivotal. As the PUST Alumni Network expands
                  globally, staying committed to giving back—through student mentorship, research
                  collaboration, and campus visits—ensures our collective legacy endures for future
                  generations.
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E2E8F0]">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("Story link copied to clipboard!");
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#17263C] cursor-pointer"
                >
                  🔗 Share Story Link
                </button>
                <button
                  onClick={() => setReadingStory(null)}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-[#7A1737] text-white hover:bg-[#62122B] cursor-pointer"
                >
                  Close Reader
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. SUBMIT YOUR STORY MODAL */}
      {isSubmitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#17263C] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block">
                  Editorial Contributions
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white mt-0.5">
                  Submit Your PUST Story
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {isSubmitSuccess ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center text-2xl mx-auto mb-3">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-base text-[#17263C] mb-2">
                    Story Received for Editorial Review
                  </h4>
                  <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                    Thank you for sharing your experience. Our editorial team will review and
                    feature your journey on the network portal.
                  </p>
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
                        placeholder="e.g. Nusrat Jahan"
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
                        Department
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CSE, EEE, Chemistry"
                        value={submitForm.dept}
                        onChange={(e) => setSubmitForm({ ...submitForm, dept: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Batch / Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2015 or 7th Batch"
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
                      placeholder="e.g. Lead Engineer at Samsung R&D / Ph.D. Researcher at BUET"
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
                        <option value="Social Impact">Social Impact</option>
                        <option value="Academia">Academia</option>
                        <option value="Entrepreneurship">Entrepreneurship</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Your Story Narrative *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your path after PUST, challenges overcome, career milestones, and words of guidance for younger batches..."
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
                      className="px-6 py-2.5 text-xs font-bold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all shadow-xs cursor-pointer"
                    >
                      Submit for Review
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
    </div>
  );
}
