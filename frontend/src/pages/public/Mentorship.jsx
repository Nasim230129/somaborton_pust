import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  pa,
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
  createInitialsAvatar,
} from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";

const campusImages = [Ia, La, Ra, za, Ba, Va, Ha, Ka, Wa, Xa, qa, Ja, Qa, Ua, Za, Ya, Ga];

const processSteps = [
  {
    step: "01",
    icon: "🔍",
    title: "Browse Mentors",
    desc: "Filter by industry, department, skills, and background to find the right guide for your journey.",
  },
  {
    step: "02",
    icon: "📝",
    title: "Send a Request",
    desc: "Share your academic or career goals and the specific areas where you need guidance.",
  },
  {
    step: "03",
    icon: "🤝",
    title: "Get Matched",
    desc: "Your mentor reviews and connects with you. Sessions are flexible and 100% free.",
  },
  {
    step: "04",
    icon: "🚀",
    title: "Accelerate Career",
    desc: "Engage in 1-on-1 consultations, resume reviews, technical prep, and industry insights.",
  },
];

const mentorshipStats = [
  { val: "320+", label: "Active Mentors" },
  { val: "1,800+", label: "Sessions Completed" },
  { val: "94%", label: "Mentee Satisfaction" },
  { val: "45+", label: "Countries Active" },
];

const menteeTestimonials = [
  {
    quote: "My mentor connected me with a leading software enterprise before I even completed my final semester. Truly life-changing.",
    name: "Ariful Islam",
    dept: "CSE, Batch 2022",
    avatar: createInitialsAvatar("Ariful Islam", "student"),
  },
  {
    quote: "Three months of mentorship gave me more career clarity than four years of searching alone. The PUST alumni network is priceless.",
    name: "Sumaiya Khatun",
    dept: "EEE, Batch 2023",
    avatar: createInitialsAvatar("Sumaiya Khatun", "student"),
  },
  {
    quote: "My mentor provided essential guidance on foreign scholarship applications and research proposals. Forever grateful.",
    name: "Nahid Hasan",
    dept: "MATH, Batch 2024",
    avatar: createInitialsAvatar("Nahid Hasan", "student"),
  },
];

const industryTabs = ["All", "Technology", "Energy", "Finance", "Academia", "Infrastructure", "Healthcare"];

export default function Mentorship() {
  useBackendSync();
  usePageMeta(
    "PUST Alumni Mentorship Program — One-on-One Career Guidance",
    "Connect directly with 320+ experienced Pabna University of Science and Technology alumni mentors across technology, engineering, research, and corporate sectors."
  );

  const location = useLocation();

  // Filter States
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestedMentorIds, setRequestedMentorIds] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_requested_mentors");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Modal State
  const [activeMentor, setActiveMentor] = useState(null);
  const [mentorForm, setMentorForm] = useState({
    topic: "Career Guidance & Transition",
    goal: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Background Video State (User's YouTube Video: 8a_svoC83P4)
  const [isMuted, setIsMuted] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const toggleMute = () => {
    const iframe = document.getElementById("youtube-mentorship-bg-iframe");
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
    const localVideo = document.getElementById("fallback-mentorship-video");
    if (localVideo) {
      localVideo.muted = nextMuted;
    }
  };

  const handleFullscreenCinema = () => {
    const iframe = document.getElementById("youtube-mentorship-bg-iframe");
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

  // Sync search from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || params.get("q");
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
    }
  }, [location.search]);

  // Listen to custom cross-header search
  useEffect(() => {
    const handleCustom = (evt) => {
      if (evt.detail !== undefined) setSearchQuery(evt.detail);
    };
    window.addEventListener("pust-search-query", handleCustom);
    return () => window.removeEventListener("pust-search-query", handleCustom);
  }, []);

  // Mentors list
  const availableMentors = useMemo(() => {
    return pa.filter((member) => member.mentorAvailable);
  }, []);

  // Filtered mentors
  const filteredMentors = useMemo(() => {
    return availableMentors.filter((mentor) => {
      if (selectedIndustry !== "All" && mentor.industry !== selectedIndustry) {
        return false;
      }
      if (selectedDept !== "All" && mentor.dept && !mentor.dept.includes(selectedDept)) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (mentor.name || "").toLowerCase().includes(q);
        const deptMatch = (mentor.dept || "").toLowerCase().includes(q);
        const headlineMatch = (mentor.headline || "").toLowerCase().includes(q);
        const companyMatch = (mentor.company || "").toLowerCase().includes(q);
        const locationMatch = (mentor.location || "").toLowerCase().includes(q);
        const skillsMatch = Array.isArray(mentor.skills) && mentor.skills.some((s) => s.toLowerCase().includes(q));

        if (!nameMatch && !deptMatch && !headlineMatch && !companyMatch && !locationMatch && !skillsMatch) {
          return false;
        }
      }
      return true;
    });
  }, [availableMentors, selectedIndustry, selectedDept, searchQuery]);

  // Request Mentorship Submit Handler
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!activeMentor) return;

    setIsSubmitting(true);
    try {
      const storedUser = localStorage.getItem("pust_user");
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      await api.requestMentorship({
        mentorId: activeMentor.id,
        mentorName: activeMentor.name,
        menteeName: currentUser?.name || "PUST Community Member",
        menteeEmail: currentUser?.email || "alumni.user@pust.ac.bd",
        topic: mentorForm.topic,
        goal: mentorForm.goal,
        message: mentorForm.message,
      });

      const nextRequested = [...requestedMentorIds, activeMentor.id];
      setRequestedMentorIds(nextRequested);
      localStorage.setItem("pust_requested_mentors", JSON.stringify(nextRequested));

      setSubmitSuccess(true);
      setTimeout(() => {
        setActiveMentor(null);
        setSubmitSuccess(false);
        setMentorForm({ topic: "Career Guidance & Transition", goal: "", message: "" });
      }, 1800);
    } catch (err) {
      console.debug("Mentorship request submission:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* =========================================================================
          1. STABLE FULL-PAGE CAMPUS REAL VIEW VIDEO HERO (YouTube: 8a_svoC83P4)
         ========================================================================= */}
      <section
        id="campus-real-view"
        data-no-reveal="true"
        aria-label="PUST Campus Tour & Mentorship"
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
            id="fallback-mentorship-video"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster="/assets/1778991184DSC05122-DR5DHwQE.jpeg"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-full h-full object-cover"
            style={{ filter: "brightness(0.92) contrast(1.05)" }}
          >
            <source src="/assets/videos/pust_tour_youtube.mp4" type="video/mp4" />
          </video>

          {/* User's YouTube Video Embed (8a_svoC83P4) */}
          <iframe
            id="youtube-mentorship-bg-iframe"
            src="https://www.youtube.com/embed/8a_svoC83P4?autoplay=1&mute=1&controls=0&loop=1&playlist=8a_svoC83P4&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1"
            title="Pabna University of Science and Technology (PUST) Campus Tour"
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

        {/* Floating Bottom Button to Smoothly Scroll to Mentorship Board */}
        <div className="relative z-20 pb-5 sm:pb-7 text-center pointer-events-none flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("mentorship-board");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/80 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-[#C7A76C]/40 backdrop-blur-md shadow-xl transition-colors cursor-pointer active:scale-95 ring-1 ring-white/10"
          >
            <span className="text-[#DFCA9E]">🎯</span>
            <span>Explore Mentors & Guidance</span>
            <span className="text-sm text-[#DFCA9E]">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. INSTITUTIONAL METRICS RIBBON
         ========================================================================= */}
      <div id="mentorship-board" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {mentorshipStats.map((stat, idx) => (
              <div key={idx} className="pt-2 sm:pt-0 sm:px-4 text-center">
                <p className="font-display font-bold text-2xl sm:text-3xl text-[#DFCA9E] leading-none">
                  {stat.val}
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
          3. INSTITUTIONAL MENTORSHIP HEADER & SEARCH
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] shadow-2xs py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-2 text-[#7A1737]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> · PUST Alumni Network · Mentorship
          </p>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#17263C] mb-3 tracking-tight">
            Connect With PUST Alumni Mentors
          </h1>

          <p className="mb-6 max-w-2xl mx-auto text-xs sm:text-sm text-[#64748B] leading-relaxed">
            320+ experienced PUST graduates ready to provide personalized 1-on-1 career guidance,
            technical interview preparation, and higher education mentorship.
          </p>

          {/* Prominent Search Bar */}
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              document.getElementById("mentors-directory")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="max-w-2xl mx-auto relative group bg-[#F8FAFC] p-2 rounded-xl shadow-md border border-[#E2E8F0] focus-within:border-[#7A1737] focus-within:ring-2 focus-within:ring-[#7A1737]/20 flex items-center gap-2 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-white text-[#17263C] flex items-center justify-center font-bold text-base flex-shrink-0 border border-[#E2E8F0]">
              🎯
            </div>
            <input
              type="text"
              placeholder="Search mentors by name, company, skill, or department…"
              aria-label="Search mentors by name, company, or department"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-2 py-2 text-xs sm:text-sm text-[#17263C] outline-none bg-transparent font-normal placeholder-[#94A3B8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="w-7 h-7 my-auto rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#64748B] hover:text-[#17263C] flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold flex-shrink-0 rounded-lg bg-[#7A1737] hover:bg-[#60122B] text-white transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Search Mentors</span>
            </button>
          </form>

          {/* Dual Action CTAs */}
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => {
                document.getElementById("mentors-directory")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2.5 rounded-lg bg-[#7A1737] hover:bg-[#60122B] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <span>↓ Explore All Mentors</span>
            </button>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-[#F4F5F7] text-[#17263C] hover:text-[#7A1737] font-semibold text-xs sm:text-sm tracking-wide transition-all border border-[#E2E8F0] shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>Become a Mentor →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HOW MENTORSHIP WORKS (Institutional 4-Step Process)
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] py-14 sm:py-16 reveal-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal-up">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737] bg-[#7A1737]/10 px-3.5 py-1 rounded-full border border-[#7A1737]/20 font-bengali">
              সহজ ও কার্যকর পদ্ধতি
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#17263C] mt-2.5 tracking-tight">
              How PUST Mentorship Works
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2">
              A structured, transparent pathway designed to bridge senior alumni with ambitious students and graduates.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, sIdx) => (
              <div
                key={step.step}
                className={`p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-md transition-all flex flex-col justify-between group ${
                  sIdx % 2 === 0 ? "reveal-left" : "reveal-right"
                } delay-${(sIdx + 1) * 100}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{step.icon}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#7A1737] border border-[#E2E8F0]">
                      Step {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#17263C] text-base mb-2 group-hover:text-[#7A1737] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. MAIN MENTORS DIRECTORY
         ========================================================================= */}
      <section id="mentors-directory" className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Filter Controls Header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#17263C]">
                Available Alumni Mentors
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Showing <strong className="text-[#17263C]">{filteredMentors.length}</strong> verified mentors ready to assist.
              </p>
            </div>

            {/* Department Quick Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B] font-medium hidden sm:inline">Department:</span>
              <select
                aria-label="Filter mentors by department"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl outline-none focus:ring-1 focus:ring-[#7A1737] bg-white border border-[#E2E8F0] text-[#17263C] shadow-xs cursor-pointer"
              >
                <option value="All">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="ICE">ICE</option>
                <option value="CE">Civil Engineering</option>
                <option value="ARCH">Architecture</option>
                <option value="MATH">Mathematics</option>
                <option value="PHYS">Physics</option>
                <option value="CHEM">Chemistry</option>
                <option value="PHARM">Pharmacy</option>
                <option value="BBA">Business Administration</option>
                <option value="ECON">Economics</option>
                <option value="ENG">English</option>
                <option value="GEO">Geography & Environment</option>
              </select>
            </div>
          </div>

          {/* Industry Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E8F0]">
            <span className="text-xs text-[#64748B] font-medium mr-1">Industry:</span>
            {industryTabs.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  selectedIndustry === ind
                    ? "bg-[#7A1737] text-white shadow-xs font-bold"
                    : "bg-white text-[#475569] border border-[#E2E8F0] hover:text-[#7A1737] hover:border-[#7A1737]"
                }`}
              >
                {ind}
              </button>
            ))}
            {(selectedIndustry !== "All" || selectedDept !== "All" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedIndustry("All");
                  setSelectedDept("All");
                  setSearchQuery("");
                }}
                className="text-xs font-semibold text-[#7A1737] hover:underline ml-auto cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Mentors Grid */}
        {filteredMentors.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
            <p className="text-4xl mb-3 text-[#94A3B8]">🎯</p>
            <h3 className="font-bold text-[#17263C] text-lg mb-1">
              No Mentors Match Your Search
            </h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto mb-5">
              Try adjusting your industry or department filter to discover other mentors across our 22,400+ alumni network.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedIndustry("All");
                setSelectedDept("All");
                setSearchQuery("");
              }}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#7A1737] hover:bg-[#60122B] text-white transition-colors cursor-pointer shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor, idx) => {
              const coverImage = campusImages[idx % campusImages.length];
              const isRequested = requestedMentorIds.includes(mentor.id);

              return (
                <div
                  key={mentor.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl transition-all bg-white border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-md"
                >
                  <div>
                    {/* Cover image banner */}
                    <div className="relative h-24 overflow-hidden bg-[#17263C]">
                      <img
                        src={coverImage}
                        alt=""
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17263C]/80 via-transparent to-transparent" />
                      {mentor.verified && (
                        <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7A1737] text-white border border-white/40 shadow-xs">
                          ✓ Verified Mentor
                        </span>
                      )}
                    </div>

                    {/* Mentor Avatar */}
                    <div className="flex justify-center -mt-10 relative px-4">
                      <div className="relative">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-20 h-20 rounded-full object-cover ring-4 ring-white bg-[#F8FAFC] shadow-sm"
                        />
                        <span
                          className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-[9px] text-white font-bold"
                          title="Available for Mentorship"
                        >
                          ✓
                        </span>
                      </div>
                    </div>

                    {/* Mentor Details */}
                    <div className="px-5 pt-3 pb-4 text-center">
                      <Link
                        to={`/alumni/${mentor.id}`}
                        className="font-display font-bold text-[#17263C] text-base group-hover:text-[#7A1737] transition-colors leading-snug line-clamp-1 block"
                      >
                        {mentor.name}
                      </Link>

                      <p className="text-xs font-semibold text-[#7A1737] mt-0.5">
                        {mentor.company || mentor.dept}
                      </p>

                      <p className="text-xs text-[#64748B] mt-1.5 leading-snug line-clamp-2 min-h-[32px]">
                        {mentor.headline || `Experienced practitioner in ${mentor.industry || mentor.dept}.`}
                      </p>

                      <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-[#64748B]">
                        <span>🏛️ {mentor.dept ? mentor.dept.split("&")[0].trim() : "PUST"}</span>
                        {mentor.batch && <span>· Batch {mentor.batch}</span>}
                      </div>

                      {/* Skills Chips */}
                      {mentor.skills && mentor.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-center mt-3 pt-3 border-t border-[#E2E8F0]">
                          {mentor.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]/60 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isRequested) {
                          setActiveMentor(mentor);
                        }
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs ${
                        isRequested
                          ? "bg-[#F1F5F9] text-[#17263C] border border-[#CBD5E1]"
                          : "bg-[#7A1737] hover:bg-[#60122B] text-white"
                      }`}
                    >
                      {isRequested ? "✓ Request Sent" : "Request Mentorship →"}
                    </button>
                    <Link
                      to={`/alumni/${mentor.id}`}
                      className="px-3 py-2 text-xs font-semibold text-[#17263C] hover:text-[#7A1737] border border-[#E2E8F0] bg-white hover:bg-[#F4F5F7] rounded-xl transition-colors cursor-pointer"
                      title="View Profile"
                    >
                      Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          5. MENTEE TESTIMONIALS (Dark Navy Contrast Section)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#17263C] text-white py-16 border-t border-b border-[#0F1A2A]">
        <img
          src={Ha}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C7A76C] bg-white/10 px-3.5 py-1 rounded-full border border-white/15 font-bengali">
              অ্যালামনাইদের অভিজ্ঞতা
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-2.5">
              What PUST Mentees Say
            </h2>
            <p className="text-xs sm:text-sm text-[#E2E8F0] mt-1.5">
              Real stories from graduates who accelerated their careers through institutional alumni guidance.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {menteeTestimonials.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl text-[#C7A76C] mb-2 font-serif">“</div>
                  <p className="text-xs sm:text-sm leading-relaxed mb-6 text-[#E2E8F0] italic">
                    "{item.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <p className="text-white text-xs font-bold">{item.name}</p>
                    <p className="text-[10px] text-[#C7A76C]">{item.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. BECOME A MENTOR CALL TO ACTION
         ========================================================================= */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-[#F8FAFC] rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A1737] bg-[#7A1737]/10 px-3 py-1 rounded-full border border-[#7A1737]/20 font-bengali">
                অ্যালামনাইদের অবদান
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#17263C] mt-3">
                Inspire the Next Generation of PUSTians
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] mt-2 leading-relaxed">
                Whether you have 2 years of industry experience or 15+ years of leadership, your insights can guide a fellow graduate to their dream career. Join 320+ verified PUST alumni mentors today.
              </p>
            </div>
            <Link
              to="/register"
              className="px-8 py-3.5 text-xs sm:text-sm font-bold bg-[#7A1737] hover:bg-[#60122B] text-white rounded-xl shadow-sm transition-all active:scale-95 flex-shrink-0"
            >
              Apply as a Mentor →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. MENTORSHIP REQUEST MODAL
         ========================================================================= */}
      {activeMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E2E8F0] shadow-2xl relative overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveMentor(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F4F5F7] hover:bg-[#E2E8F0] text-[#17263C] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              title="Close modal"
            >
              ✕
            </button>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-200">
                  ✓
                </div>
                <h3 className="font-display font-bold text-xl text-[#17263C] mb-2">
                  Request Sent Successfully!
                </h3>
                <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
                  Your mentorship request has been forwarded to <strong>{activeMentor.name}</strong>. You will receive an email notification when they review your request.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#E2E8F0]">
                  <img
                    src={activeMentor.avatar}
                    alt={activeMentor.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#7A1737]"
                  />
                  <div>
                    <h3 className="font-bold text-[#17263C] text-base leading-snug">
                      Request Mentorship from {activeMentor.name}
                    </h3>
                    <p className="text-xs text-[#7A1737] font-semibold">
                      {activeMentor.company || activeMentor.dept}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17263C] mb-1.5">
                      Mentorship Topic / Focus Area
                    </label>
                    <select
                      value={mentorForm.topic}
                      onChange={(e) => setMentorForm({ ...mentorForm, topic: e.target.value })}
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737] outline-none text-[#17263C] bg-white cursor-pointer"
                    >
                      <option value="Career Guidance & Transition">Career Guidance & Transition</option>
                      <option value="Technical Interview & Resume Review">Technical Interview & Resume Review</option>
                      <option value="Higher Studies & Scholarship Preparation">Higher Studies & Scholarship Preparation</option>
                      <option value="Research Collaboration & Publishing">Research Collaboration & Publishing</option>
                      <option value="Industry Best Practices & Skill Building">Industry Best Practices & Skill Building</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17263C] mb-1.5">
                      What is your primary goal?
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Preparing for junior software engineer roles in Dhaka"
                      value={mentorForm.goal}
                      onChange={(e) => setMentorForm({ ...mentorForm, goal: e.target.value })}
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737] outline-none text-[#17263C] placeholder-[#94A3B8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17263C] mb-1.5">
                      Short Note for Mentor
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Introduce yourself, your graduation year, and any specific questions you have for the mentor..."
                      value={mentorForm.message}
                      onChange={(e) => setMentorForm({ ...mentorForm, message: e.target.value })}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737] outline-none text-[#17263C] placeholder-[#94A3B8]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveMentor(null)}
                      className="px-5 py-2.5 text-xs font-semibold text-[#17263C] hover:bg-[#F4F5F7] rounded-xl border border-[#E2E8F0] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-[#7A1737] hover:bg-[#60122B] rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending Request..." : "Send Request →"}
                    </button>
                  </div>
                </form>
              </div>
            )}
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
                  Pabna University of Science and Technology (PUST) · Campus Tour
                </h3>
                <p className="text-xs text-slate-400">
                  Real Campus Experience · Press ESC to exit
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
              src="https://www.youtube.com/embed/8a_svoC83P4?autoplay=1&mute=0&controls=1&rel=0"
              title="PUST Campus Tour"
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
