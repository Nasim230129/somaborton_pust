import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  _a as initialEvents,
  La,
  za,
  Ba,
  Ha,
  Wa,
  qa,
  Ja,
  Xa,
  Qa,
} from "../../data/mockData";
import { api, useBackendSync, getCurrentUser } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";

// Comprehensive fallback/curated events for PUST community
const curatedEvents = [
  {
    id: 5,
    title: "Freshers' Reception 2026 — Welcome Batch",
    month: "SEP",
    day: "28",
    year: "2026",
    date: "Sep 28, 2026",
    time: "10:00 AM – 2:00 PM",
    location: "PUST Central Ground",
    city: "Pabna, Bangladesh",
    type: "Campus",
    online: false,
    spots: 1200,
    registered: 980,
    img: Ha,
    desc: "Grand institutional welcome ceremony for PUST's newest batch of 1,200 undergraduate and graduate students.",
    organizer: "PUST Students' Union & Faculty",
    tags: ["Campus Life", "Students", "Orientation"],
  },
  {
    id: 6,
    title: "Alumni Award Ceremony 2026",
    month: "OCT",
    day: "12",
    year: "2026",
    date: "Oct 12, 2026",
    time: "6:00 PM – 9:00 PM",
    location: "PUST Auditorium",
    city: "Pabna, Bangladesh",
    type: "Reunion",
    online: false,
    spots: 400,
    registered: 310,
    img: La,
    desc: "Honoring distinguished PUST alumni across academia, technology, public service, and entrepreneurship with annual awards.",
    organizer: "PUST Alumni Association",
    tags: ["Awards", "Alumni", "Gala"],
  },
  {
    id: 7,
    title: "Faculty Training Workshop — Pedagogy 2026",
    month: "OCT",
    day: "18",
    year: "2026",
    date: "Oct 18, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Faculty Development Center",
    city: "Pabna, Bangladesh",
    type: "Faculty",
    online: false,
    spots: 80,
    registered: 72,
    img: za,
    desc: "Advanced training for PUST faculty members covering interactive learning environments, modern research, and instructional design.",
    organizer: "PUST Institutional Quality Assurance Cell (IQAC)",
    tags: ["Faculty", "Research", "Pedagogy"],
  },
  {
    id: 8,
    title: "Inter-University Tech Contest & Hackathon",
    month: "NOV",
    day: "08",
    year: "2026",
    date: "Nov 8, 2026",
    time: "8:00 AM – 6:00 PM",
    location: "CSE Department Labs & Auditoria",
    city: "Pabna, Bangladesh",
    type: "Career",
    online: false,
    spots: 350,
    registered: 265,
    img: Ba,
    desc: "Annual engineering and software contest open to all PUST students and alumni developers with prizes from top tech sponsors.",
    organizer: "PUST CSE Society",
    tags: ["Tech", "Students", "Competition", "Software"],
  },
];

const MONTH_MAP = {
  Jan: "JAN",
  Feb: "FEB",
  Mar: "MAR",
  Apr: "APR",
  May: "MAY",
  Jun: "JUN",
  Jul: "JUL",
  Aug: "AUG",
  Sep: "SEP",
  Oct: "OCT",
  Nov: "NOV",
  Dec: "DEC",
};

function normalizeEvent(event) {
  if ("month" in event && event.month) return event;
  const parts = (event.date || "Oct 15, 2026").split(" ");
  return {
    ...event,
    month: MONTH_MAP[parts[0]] || parts[0]?.toUpperCase() || "OCT",
    day: parts[1]?.replace(",", "") || "15",
    year: parts[2] || "2026",
    city: event.location || "PUST Campus",
    tags: event.tags || [event.type || "Event"],
  };
}

const FORMAT_OPTIONS = ["All Formats", "In-Person", "Virtual"];
const CATEGORY_OPTIONS = [
  "All Categories",
  "Reunion",
  "Career",
  "Webinar",
  "Mentorship",
  "Campus",
  "Faculty",
];
const DATE_OPTIONS = ["All Dates", "Next 7 Days", "Next 30 Days", "Next 60 Days"];

export default function Events() {
  useBackendSync();
  usePageMeta(
    "Events & Programs",
    "Discover upcoming PUST reunions, career webinars, faculty workshops, and student networking events."
  );

  const location = useLocation();

  const getInitialSearchQuery = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(location.search || window.location.search);
    return params.get("search") || params.get("q") || "";
  };

  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery);
  const [selectedFormat, setSelectedFormat] = useState("All Formats");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDate, setSelectedDate] = useState("All Dates");

  // Expandable filter accordions in desktop sidebar
  const [isDateOpen, setIsDateOpen] = useState(true);
  const [isFormatOpen, setIsFormatOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  // Registered event tracking
  const [registeredEventIds, setRegisteredEventIds] = useState(() => new Set([1]));

  // Modals state
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [ticketReference, setTicketReference] = useState("");
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [hostSuccessMessage, setHostSuccessMessage] = useState("");

  // Campus Tour Video & YouTube Player State
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (videoRef.current) {
        videoRef.current.muted = nextMuted;
        if (!nextMuted) {
          videoRef.current.volume = 1.0;
          videoRef.current.play().catch(() => {});
        }
      }
      return nextMuted;
    });
  };

  // Registration Form Fields
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    dept: "",
    batch: "",
    phone: "",
    guests: "1",
    notes: "",
  });

  // Host Event Form Fields
  const [hostForm, setHostForm] = useState({
    title: "",
    category: "Reunion",
    format: "In-Person",
    date: "",
    time: "",
    location: "PUST Auditorium",
    spots: 200,
    organizer: "",
    desc: "",
  });

  // Prefill logged-in user details if available
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setRegForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        dept: user.dept || prev.dept,
        batch: user.batch ? String(user.batch) : prev.batch,
        phone: user.phone || prev.phone,
      }));
    }
  }, []);

  // Sync URL search params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || params.get("q");
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
    }
  }, [location.search]);

  // Listen to custom cross-component search events
  useEffect(() => {
    const handleCustom = (evt) => {
      if (evt.detail !== undefined) setSearchQuery(evt.detail);
    };
    window.addEventListener("pust-search-query", handleCustom);
    return () => window.removeEventListener("pust-search-query", handleCustom);
  }, []);

  // Merge mockData events and curated events
  const allEvents = useMemo(() => {
    const combined = [
      ...initialEvents,
      ...curatedEvents.filter((c) => !initialEvents.some((ev) => ev.id === c.id)),
    ];
    return combined.map(normalizeEvent);
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (ev.title || "").toLowerCase().includes(q);
        const matchDesc = (ev.desc || "").toLowerCase().includes(q);
        const matchLoc = (ev.location || "").toLowerCase().includes(q);
        const matchType = (ev.type || "").toLowerCase().includes(q);
        const matchOrg = (ev.organizer || "").toLowerCase().includes(q);
        const matchTags =
          Array.isArray(ev.tags) && ev.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchLoc && !matchType && !matchOrg && !matchTags) {
          return false;
        }
      }

      if (selectedFormat === "In-Person" && ev.online) return false;
      if (selectedFormat === "Virtual" && !ev.online) return false;

      if (selectedCategory !== "All Categories" && ev.type !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [allEvents, searchQuery, selectedFormat, selectedCategory, selectedDate]);

  // Flagship spotlight event (e.g., Reunion or Grand Awards)
  const flagshipEvent = useMemo(() => {
    return allEvents.find((e) => e.id === 1) || allEvents[0];
  }, [allEvents]);

  // Handle direct quick register
  const handleToggleRegistration = (eventId, e) => {
    if (e) e.stopPropagation();
    const isCurrentlyRegistered = registeredEventIds.has(eventId);

    if (!isCurrentlyRegistered) {
      api.registerEvent(eventId, { registeredAt: new Date().toISOString() });
      setRegisteredEventIds((prev) => new Set(prev).add(eventId));
    } else {
      setRegisteredEventIds((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
    }
  };

  // Open full registration modal
  const openRegistrationModal = (event, e) => {
    if (e) e.stopPropagation();
    setSelectedEventForModal(event);
    setIsRegistrationSuccess(false);
    setIsRegisterModalOpen(true);
  };

  // Submit registration form
  const handleFormSubmitRegistration = (e) => {
    e.preventDefault();
    if (!selectedEventForModal) return;

    api.registerEvent(selectedEventForModal.id, regForm);
    setRegisteredEventIds((prev) => new Set(prev).add(selectedEventForModal.id));
    const refCode = `PUST-TKT-${selectedEventForModal.id}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketReference(refCode);
    setIsRegistrationSuccess(true);
  };

  // Submit host event proposal
  const handleHostEventSubmit = async (e) => {
    e.preventDefault();
    if (!hostForm.title.trim()) return;

    try {
      await api.createEvent({
        ...hostForm,
        online: hostForm.format === "Virtual",
      });
      setHostSuccessMessage(
        "Your event proposal has been submitted to the PUST Alumni Directorate for review."
      );
      setTimeout(() => {
        setIsHostModalOpen(false);
        setHostSuccessMessage("");
        setHostForm({
          title: "",
          category: "Reunion",
          format: "In-Person",
          date: "",
          time: "",
          location: "PUST Auditorium",
          spots: 200,
          organizer: "",
          desc: "",
        });
      }, 2500);
    } catch {
      setHostSuccessMessage("Event proposal submitted successfully for administrator approval.");
      setTimeout(() => {
        setIsHostModalOpen(false);
        setHostSuccessMessage("");
      }, 2200);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#475569]">
      {/* 1. INSTITUTIONAL HERO SECTION (FULL LENGTH / FULL VIEWPORT YOUTUBE VIDEO HERO) */}
      <section
        className="relative overflow-hidden bg-[#0D1522] text-white flex flex-col justify-between pt-6 sm:pt-10 pb-6 sm:pb-8 border-b border-[#0F1A2A]"
        style={{ minHeight: "calc(100vh - 84px)" }}
      >
        {/* Full-Length Live Campus Tour Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover"
            style={{ filter: "brightness(0.85) contrast(1.08)" }}
            aria-hidden="true"
          >
            <source src="/assets/videos/pust_tour_youtube.mp4" type="video/mp4" />
            <source src="/assets/videos/pust_campus_tour_experience.mp4" type="video/mp4" />
            <source src="/assets/videos/pust_alumni_campus_short.mp4" type="video/mp4" />
          </video>

          {/* Deep Navy Gradient Overlay for crystal clear typography and readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(13, 21, 34, 0.82) 0%, rgba(13, 21, 34, 0.45) 45%, rgba(13, 21, 34, 0.94) 100%)",
            }}
          />
        </div>

        {/* Top Video Indicator & Controls */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 mb-4 w-full flex items-center justify-between pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-white text-[11px] sm:text-xs font-semibold bg-[#17263C]/80 border border-white/15 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="font-bengali font-medium">🎥 PUST ক্যাম্পাস ট্যুর ও ইভেন্ট লাইভ ব্যাকগ্রাউন্ড</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsYouTubeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white bg-[#7A1737] hover:bg-[#60122B] border border-white/20 backdrop-blur-md transition-all shadow-sm cursor-pointer active:scale-95"
              title="Watch full original video in player"
            >
              <span className="font-bengali font-medium">▶ YouTube প্লেয়ারে দেখুন</span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute event video sound" : "Mute event video sound"}
              className="px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-white bg-[#17263C]/80 hover:bg-[#17263C] border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              title={isMuted ? "Click to play sound" : "Click to mute"}
            >
              <span className="font-bengali font-medium">{isMuted ? "🔇 সাউন্ড অফ" : "🔊 সাউন্ড অন"}</span>
            </button>
          </div>
        </div>

        {/* Center Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center my-auto py-6 sm:py-10 reveal-up">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3 text-[#C7A76C]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span>{" "}
            · PUST Alumni Network · Events & Programs
          </p>
          <h1
            className="font-display font-bold !text-white text-white mb-4 tracking-tight"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              lineHeight: 1.15,
              color: "#FFFFFF",
            }}
          >
            Events, Reunions & Programs
          </h1>
          <p
            className="text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#E2E8F0" }}
          >
            From annual reunions on the Pabna campus to international technical webinars and career
            bootcamps. Stay connected through events that shape your professional life.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              document.getElementById("events-directory")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full max-w-2xl mx-auto flex items-center bg-white p-2 rounded-xl shadow-xl border border-[#E2E8F0] focus-within:border-[#7A1737] focus-within:ring-2 focus-within:ring-[#7A1737]/20 gap-2 transition-all reveal-up delay-100"
          >
            <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] text-[#17263C] flex items-center justify-center font-bold text-base flex-shrink-0 border border-[#E2E8F0]">
              📅
            </div>
            <input
              type="text"
              placeholder="Search events by title, keyword, department, or venue…"
              aria-label="Search university events"
              value={searchQuery}
              onChange={(ev) => setSearchQuery(ev.target.value)}
              className="flex-1 px-2 py-2 text-sm sm:text-base text-[#17263C] outline-none bg-transparent font-normal placeholder-[#94A3B8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="w-7 h-7 my-auto rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#17263C] flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="btn-maroon px-6 py-2.5 text-xs sm:text-sm font-semibold flex-shrink-0 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
              style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
            >
              <span>Search</span>
            </button>
          </form>

          {searchQuery && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#E2E8F0]">
              <span>
                Found <strong className="text-white">{filteredEvents.length}</strong> events matching{" "}
                <strong className="text-white">"{searchQuery}"</strong>
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="underline hover:text-white font-medium text-[#C7A76C] ml-1 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* Quick Hero Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 reveal-up delay-200">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("events-directory");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors cursor-pointer backdrop-blur-sm"
            >
              Browse All Events ↓
            </button>
            <button
              type="button"
              onClick={() => setIsHostModalOpen(true)}
              className="px-5 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
              style={{ backgroundColor: "#C7A76C", color: "#17263C" }}
            >
              + Propose University Event
            </button>
          </div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="relative z-20 w-full text-center mt-4 pointer-events-auto flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("events-directory");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span className="font-bengali font-normal">নিচে স্ক্রোল করে বিশ্ববিদ্যালয় ইভেন্ট ও পুনর্মিলনীসমূহ দেখুন</span>
            <span className="animate-bounce font-mono">↓</span>
          </button>
        </div>
      </section>

      {/* 2. FLAGSHIP SPOTLIGHT BANNER */}
      {flagshipEvent && !searchQuery && (
        <section className="bg-white border-b border-[#E2E8F0] py-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-4 reveal-up">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A1737] border-b-2 border-[#7A1737] pb-1 inline-block">
                Flagship University Event
              </p>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded"
                style={{ backgroundColor: "rgba(122, 23, 55, 0.08)", color: "#7A1737" }}
              >
                Official Marquee Gathering
              </span>
            </div>

            <div
              className="section-dark-navy rounded-2xl overflow-hidden border border-[#0F1A2A] shadow-lg grid grid-cols-1 lg:grid-cols-2 text-white"
              style={{ backgroundColor: "#17263C" }}
            >
              <div className="relative min-h-[260px] lg:min-h-full overflow-hidden reveal-left">
                <img
                  src={flagshipEvent.img || qa}
                  alt={flagshipEvent.title}
                  className="w-full h-full object-cover object-center opacity-85 hover:scale-105 transition-transform duration-700"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(23,38,60,0.1) 0%, rgba(23,38,60,0.65) 100%)",
                  }}
                />
                <div
                  className="absolute top-4 left-4 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md"
                  style={{ backgroundColor: "#7A1737" }}
                >
                  ★ Annual Feature
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between reveal-right delay-100">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#C7A76C] border border-white/15">
                      {flagshipEvent.type}
                    </span>
                    <span className="text-xs text-slate-300">
                      📍 {flagshipEvent.location}
                    </span>
                  </div>
                  <h2
                    className="font-display font-bold text-xl sm:text-2xl text-white mb-2.5 leading-snug !text-white"
                    style={{ color: "#FFFFFF" }}
                  >
                    {flagshipEvent.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed mb-4">
                    {flagshipEvent.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-2.5 border-y border-white/10 mb-4 text-xs text-slate-200">
                    <div>
                      <p className="text-[10px] uppercase text-[#C7A76C] font-semibold">Date & Time</p>
                      <p className="font-semibold text-white mt-0.5">
                        {flagshipEvent.date} · {flagshipEvent.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-[#C7A76C] font-semibold">Organizer</p>
                      <p className="font-semibold text-white mt-0.5 truncate">
                        {flagshipEvent.organizer}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:flex-1">
                    <div className="flex justify-between text-[11px] mb-1.5 text-slate-300">
                      <span>{flagshipEvent.registered} Confirmed</span>
                      <span>{Math.round((flagshipEvent.registered / flagshipEvent.spots) * 100)}% Full</span>
                    </div>
                    <div
                      className="w-full h-2.5 rounded-full overflow-hidden p-0.5 border"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        borderColor: "rgba(255, 255, 255, 0.25)",
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          background: "linear-gradient(90deg, #DECA9E 0%, #C7A76C 100%)",
                          backgroundColor: "#C7A76C",
                          width: `${Math.min(
                            100,
                            Math.round((flagshipEvent.registered / flagshipEvent.spots) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={(e) => openRegistrationModal(flagshipEvent, e)}
                    className="btn-maroon w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-bold text-white rounded-lg transition-all active:scale-95 cursor-pointer flex-shrink-0 shadow-md"
                    style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
                  >
                    {registeredEventIds.has(flagshipEvent.id)
                      ? "✓ View Your Ticket"
                      : "Register for Reunion →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. MAIN DIRECTORY: SIDEBAR FILTERS & EVENT CARDS */}
      <main id="events-directory" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP STICKY SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28 reveal-left">
          <div className="rounded-xl overflow-hidden bg-white border border-[#E2E8F0] shadow-xs">
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <p className="font-bold text-xs uppercase tracking-wider text-[#17263C]">
                Filter Programs
              </p>
            </div>

            {/* Date Filter Accordion */}
            <div className="border-b border-[#E2E8F0]">
              <button
                type="button"
                aria-expanded={isDateOpen}
                className="w-full flex items-center justify-between px-5 py-3.5 focus:outline-none cursor-pointer"
                onClick={() => setIsDateOpen(!isDateOpen)}
              >
                <span className="font-semibold text-xs uppercase tracking-wider text-[#17263C]">
                  Timeline
                </span>
                <span className="text-[#64748B] text-xs">{isDateOpen ? "▲" : "▼"}</span>
              </button>
              {isDateOpen && (
                <div className="px-5 pb-4 space-y-2">
                  {DATE_OPTIONS.map((dOpt) => (
                    <label
                      key={dOpt}
                      className="flex items-center gap-2.5 cursor-pointer text-xs"
                      onClick={() => setSelectedDate(dOpt)}
                    >
                      <div
                        className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: selectedDate === dOpt ? "#7A1737" : "#CBD5E1",
                        }}
                      >
                        {selectedDate === dOpt && (
                          <div className="w-2 h-2 rounded-full bg-[#7A1737]" />
                        )}
                      </div>
                      <span
                        className={
                          selectedDate === dOpt
                            ? "font-semibold text-[#17263C]"
                            : "text-[#475569] hover:text-[#17263C]"
                        }
                      >
                        {dOpt}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Format Filter Accordion */}
            <div className="border-b border-[#E2E8F0]">
              <button
                type="button"
                aria-expanded={isFormatOpen}
                className="w-full flex items-center justify-between px-5 py-3.5 focus:outline-none cursor-pointer"
                onClick={() => setIsFormatOpen(!isFormatOpen)}
              >
                <span className="font-semibold text-xs uppercase tracking-wider text-[#17263C]">
                  Event Format
                </span>
                <span className="text-[#64748B] text-xs">{isFormatOpen ? "▲" : "▼"}</span>
              </button>
              {isFormatOpen && (
                <div className="px-5 pb-4 space-y-2">
                  {FORMAT_OPTIONS.map((fOpt) => (
                    <label
                      key={fOpt}
                      className="flex items-center gap-2.5 cursor-pointer text-xs"
                      onClick={() => setSelectedFormat(fOpt)}
                    >
                      <div
                        className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: selectedFormat === fOpt ? "#7A1737" : "#CBD5E1",
                        }}
                      >
                        {selectedFormat === fOpt && (
                          <div className="w-2 h-2 rounded-full bg-[#7A1737]" />
                        )}
                      </div>
                      <span
                        className={
                          selectedFormat === fOpt
                            ? "font-semibold text-[#17263C]"
                            : "text-[#475569] hover:text-[#17263C]"
                        }
                      >
                        {fOpt}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter Accordion */}
            <div>
              <button
                type="button"
                aria-expanded={isCategoryOpen}
                className="w-full flex items-center justify-between px-5 py-3.5 focus:outline-none cursor-pointer"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <span className="font-semibold text-xs uppercase tracking-wider text-[#17263C]">
                  Category
                </span>
                <span className="text-[#64748B] text-xs">{isCategoryOpen ? "▲" : "▼"}</span>
              </button>
              {isCategoryOpen && (
                <div className="px-5 pb-4 space-y-2">
                  {CATEGORY_OPTIONS.map((cOpt) => (
                    <label
                      key={cOpt}
                      className="flex items-center gap-2.5 cursor-pointer text-xs"
                      onClick={() => setSelectedCategory(cOpt)}
                    >
                      <div
                        className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: selectedCategory === cOpt ? "#7A1737" : "#CBD5E1",
                        }}
                      >
                        {selectedCategory === cOpt && (
                          <div className="w-2 h-2 rounded-full bg-[#7A1737]" />
                        )}
                      </div>
                      <span
                        className={
                          selectedCategory === cOpt
                            ? "font-semibold text-[#17263C]"
                            : "text-[#475569] hover:text-[#17263C]"
                        }
                      >
                        {cOpt}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reset Action */}
          <button
            type="button"
            className="w-full mt-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors hover:border-[#7A1737] hover:text-[#7A1737] rounded-lg cursor-pointer bg-white border border-[#E2E8F0] text-[#475569] shadow-2xs"
            onClick={() => {
              setSearchQuery("");
              setSelectedFormat("All Formats");
              setSelectedCategory("All Categories");
              setSelectedDate("All Dates");
            }}
          >
            Clear All Filters
          </button>

          {/* Host an Event Quick Box */}
          <div className="mt-4 p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mb-2"
              style={{ backgroundColor: "rgba(122, 23, 55, 0.08)", color: "#7A1737" }}
            >
              📣
            </div>
            <p className="text-xs font-bold text-[#17263C] mb-1">Organizing an Event?</p>
            <p className="text-[11px] text-[#64748B] leading-relaxed mb-3">
              Alumni chapters and faculty can host sessions for the PUST network.
            </p>
            <button
              onClick={() => setIsHostModalOpen(true)}
              className="w-full py-2 text-xs font-semibold rounded bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#17263C] transition-colors cursor-pointer"
            >
              Propose Event
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT COLUMN */}
        <div className="lg:col-span-3 min-w-0 w-full reveal-right">
          {/* Header Bar with Active Filter Pills & Mobile Format Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E2E8F0] reveal-up">
            <div>
              <p className="font-semibold text-[#17263C] flex items-center gap-2">
                <span className="font-display text-2xl font-bold">{filteredEvents.length}</span>
                <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">
                  Scheduled Events Found
                </span>
              </p>
              {(selectedCategory !== "All Categories" ||
                selectedFormat !== "All Formats" ||
                searchQuery) && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-[#64748B] font-medium">Filters:</span>
                  {selectedCategory !== "All Categories" && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                      style={{ backgroundColor: "rgba(122, 23, 55, 0.08)", color: "#7A1737" }}
                    >
                      {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory("All Categories")}
                        className="cursor-pointer font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {selectedFormat !== "All Formats" && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                      style={{ backgroundColor: "rgba(23, 38, 60, 0.08)", color: "#17263C" }}
                    >
                      {selectedFormat}
                      <button
                        onClick={() => setSelectedFormat("All Formats")}
                        className="cursor-pointer font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] flex items-center gap-1 border border-[#E2E8F0]">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery("")} className="cursor-pointer font-bold">
                        ✕
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Format Filter Pills */}
            <div className="flex gap-1 lg:hidden">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedFormat(opt)}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedFormat === opt
                      ? "bg-[#7A1737] text-white shadow-2xs"
                      : "bg-white text-[#475569] border border-[#E2E8F0]"
                  }`}
                  style={
                    selectedFormat === opt
                      ? { backgroundColor: "#7A1737", color: "#FFFFFF" }
                      : {}
                  }
                >
                  {opt.replace("All Formats", "All")}
                </button>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 px-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <p className="text-4xl mb-3 text-[#94A3B8]">📅</p>
              <h3 className="font-display font-semibold text-[#17263C] text-lg mb-1">
                No Events Match Your Filter
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto mb-5 leading-relaxed">
                Try clearing selected categories or search terms to see all institutional gatherings.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFormat("All Formats");
                  setSelectedCategory("All Categories");
                  setSelectedDate("All Dates");
                }}
                className="btn-maroon px-5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event, idx) => {
                const isRegistered = registeredEventIds.has(event.id);
                const percentFull = Math.min(
                  100,
                  Math.round((event.registered / (event.spots || 100)) * 100)
                );
                const formatLabel = event.online ? "Virtual" : "In-Person";
                const spotsRemaining = Math.max(0, (event.spots || 100) - event.registered);
                const animDir = idx % 2 === 0 ? "reveal-left" : "reveal-right";
                const animDelay = `delay-${Math.min(300, (idx % 4) * 80)}`;

                return (
                  <article
                    key={event.id}
                    className={`p-5 sm:p-6 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-md transition-all duration-300 group ${animDir} ${animDelay}`}
                  >
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      {/* Date Stamp Block */}
                      <div
                        className="flex-shrink-0 text-center rounded-xl p-3 bg-[#F8FAFC] border border-[#E2E8F0] w-full sm:w-auto"
                        style={{ width: "90px", minWidth: "90px" }}
                      >
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#7A1737]">
                          {event.month}
                        </p>
                        <p
                          className="font-display font-bold leading-none text-[#17263C] my-1.5"
                          style={{ fontSize: "1.85rem", color: "#17263C" }}
                        >
                          {event.day}
                        </p>
                        <p className="text-[11px] text-[#64748B] font-medium">{event.year}</p>
                        <div
                          className="mt-2 text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide rounded"
                          style={{
                            backgroundColor: event.online ? "#174A7E" : "#17263C",
                            color: "#FFFFFF",
                          }}
                        >
                          {formatLabel}
                        </div>
                      </div>

                      {/* Main Event Information */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: "rgba(122, 23, 55, 0.08)",
                              color: "#7A1737",
                              border: "1px solid rgba(122, 23, 55, 0.2)",
                            }}
                          >
                            {event.type}
                          </span>
                          {(event.tags || [])
                            .filter((t) => t !== event.type)
                            .slice(0, 3)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"
                              >
                                #{tag}
                              </span>
                            ))}
                        </div>

                        <h3 className="font-display font-bold text-base sm:text-lg text-[#17263C] mb-2 group-hover:text-[#7A1737] transition-colors leading-snug">
                          {event.title}
                        </h3>

                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3 text-xs text-[#64748B]">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#17263C]">🕒</span> {event.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#17263C]">📍</span> {event.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#17263C]">🏛️</span> {event.organizer}
                          </span>
                        </div>

                        <p className="text-xs leading-relaxed mb-4 text-[#475569]">
                          {event.desc}
                        </p>

                        {/* Progress Bar & Direct Registration Buttons */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-[#E2E8F0]">
                          <div className="w-full sm:w-48">
                            <div className="flex justify-between text-[11px] mb-1 text-[#64748B]">
                              <span>{event.registered} registered</span>
                              <span>{percentFull}% full</span>
                            </div>
                            <div
                              className="h-2 rounded-full overflow-hidden p-0.5 border"
                              style={{ backgroundColor: "#F5EEDB", borderColor: "#E5D7B7" }}
                            >
                              <div
                                className="h-full rounded-full transition-all duration-500 shadow-2xs"
                                style={{
                                  width: `${percentFull}%`,
                                  background: "linear-gradient(90deg, #DECA9E 0%, #C7A76C 100%)",
                                  backgroundColor: "#C7A76C",
                                }}
                              />
                            </div>
                            <p className="text-[10px] text-[#64748B] mt-1 font-medium">
                              {spotsRemaining > 0
                                ? `${spotsRemaining} seats left`
                                : "Full Capacity"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={(e) => openRegistrationModal(event, e)}
                              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#17263C] transition-colors cursor-pointer"
                            >
                              Details & Ticket
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleToggleRegistration(event.id, e)}
                              aria-label={
                                isRegistered
                                  ? `Cancel registration for ${event.title}`
                                  : `Register for ${event.title}`
                              }
                              className={`flex-1 sm:flex-none px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm ${
                                isRegistered
                                  ? "border"
                                  : "btn-maroon"
                              }`}
                              style={
                                isRegistered
                                  ? {
                                      backgroundColor: "#F0FDF4",
                                      color: "#15803D",
                                      borderColor: "#BBF7D0",
                                    }
                                  : { backgroundColor: "#7A1737", color: "#FFFFFF" }
                              }
                            >
                              {isRegistered ? "✓ Registered" : "Register Now →"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Event Image Preview */}
                      {event.img && (
                        <div
                          className="hidden md:block flex-shrink-0 overflow-hidden rounded-xl border border-[#E2E8F0] shadow-2xs"
                          style={{ width: "160px", height: "120px" }}
                        >
                          <img
                            src={event.img}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}


          {/* Pagination Navigation */}
          {filteredEvents.length > 0 && (
            <nav
              className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-[#E2E8F0]"
              aria-label="Events pagination"
            >
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  aria-label={`Page ${page}`}
                  aria-current={page === 1 ? "page" : undefined}
                  className={`w-9 h-9 text-xs font-semibold rounded-lg flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
                    page === 1
                      ? "bg-[#7A1737] text-white border border-[#7A1737]"
                      : "bg-white text-[#475569] border border-[#E2E8F0] hover:text-[#7A1737]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="text-xs text-[#94A3B8] px-1">…</span>
              <button
                type="button"
                aria-label="Next page"
                className="px-4 h-9 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors hover:text-[#7A1737] hover:border-[#7A1737] bg-white text-[#475569] border border-[#E2E8F0] cursor-pointer shadow-2xs"
              >
                Next →
              </button>
            </nav>
          )}
        </div>
      </main>

      {/* 6. INSTITUTIONAL CALL-TO-ACTION */}
      <section
        className="section-dark-navy relative overflow-hidden mt-12 border-t border-[#0F1A2A]"
        style={{
          backgroundColor: "#17263C",
          minHeight: 220,
        }}
      >
        <img
          src={Ja}
          alt="PUST Event"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-20"
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="reveal-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2 text-[#C7A76C]">
              Alumni & Faculty Partnerships
            </p>
            <h2
              className="font-display font-bold text-white text-2xl sm:text-3xl mb-2 !text-white"
              style={{ color: "#FFFFFF" }}
            >
              Host a University Event
            </h2>
            <p className="text-xs sm:text-sm max-w-md text-[#E2E8F0] leading-relaxed">
              Are you an alumnus, batch representative, department, or student organization? Submit
              your event to reach the entire PUST global alumni network.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 reveal-right delay-100">
            <button
              onClick={() => setIsHostModalOpen(true)}
              className="btn-maroon text-xs font-semibold text-white px-6 py-3 rounded-lg text-center transition-all cursor-pointer shadow-sm active:scale-95"
              style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
            >
              Propose an Event →
            </button>
            <Link
              to="/about"
              className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg text-center transition-colors cursor-pointer"
            >
              Alumni Guidelines
            </Link>
          </div>
        </div>
      </section>

      {/* 7. REGISTRATION & TICKET MODAL */}
      {isRegisterModalOpen && selectedEventForModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#17263C] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block">
                  Event Registration
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white truncate max-w-xs sm:max-w-md mt-0.5">
                  {selectedEventForModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {isRegistrationSuccess ? (
                /* Ticket Confirmation Card */
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center text-2xl mx-auto mb-3">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#17263C] mb-1">
                    Registration Confirmed!
                  </h4>
                  <p className="text-xs text-[#64748B] mb-5">
                    Your attendance has been recorded in the PUST Alumni Directorate system.
                  </p>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left mb-6 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Ticket Reference:</span>
                      <span className="font-mono font-bold text-[#7A1737]">{ticketReference}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Date & Venue:</span>
                      <span className="font-semibold text-[#17263C]">
                        {selectedEventForModal.date} · {selectedEventForModal.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Attendee:</span>
                      <span className="font-semibold text-[#17263C]">
                        {regForm.name || "Alumni Attendee"} ({regForm.guests} Person)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="btn-maroon w-full py-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleFormSubmitRegistration} className="space-y-4">
                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] space-y-1">
                    <p>
                      <strong>Date:</strong> {selectedEventForModal.date} · {selectedEventForModal.time}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedEventForModal.location}
                    </p>
                    <p>
                      <strong>Organizer:</strong> {selectedEventForModal.organizer}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rafiqul Islam"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alumni@pust.ac.bd"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Mobile Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+880 1700-000000"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
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
                        placeholder="e.g. CSE, EEE, Physics"
                        value={regForm.dept}
                        onChange={(e) => setRegForm({ ...regForm, dept: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Batch / Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2012 or 4th Batch"
                        value={regForm.batch}
                        onChange={(e) => setRegForm({ ...regForm, batch: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegisterModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#17263C] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-maroon px-6 py-2.5 text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                      style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
                    >
                      Confirm Registration
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. PROPOSE / HOST EVENT MODAL */}
      {isHostModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsHostModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#17263C] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block">
                  PUST Directorate of Student & Alumni Affairs
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white mt-0.5">
                  Propose a University Event
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHostModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {hostSuccessMessage ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center text-2xl mx-auto mb-3">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-base text-[#17263C] mb-2">
                    Proposal Submitted
                  </h4>
                  <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                    {hostSuccessMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleHostEventSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Batch 2014 Decade Reunion"
                      value={hostForm.title}
                      onChange={(e) => setHostForm({ ...hostForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Category
                      </label>
                      <select
                        value={hostForm.category}
                        onChange={(e) => setHostForm({ ...hostForm, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C] bg-white"
                      >
                        {CATEGORY_OPTIONS.filter((c) => c !== "All Categories").map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Format
                      </label>
                      <select
                        value={hostForm.format}
                        onChange={(e) => setHostForm({ ...hostForm, format: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C] bg-white"
                      >
                        <option value="In-Person">In-Person</option>
                        <option value="Virtual">Virtual / Online</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Date *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dec 20, 2026"
                        value={hostForm.date}
                        onChange={(e) => setHostForm({ ...hostForm, date: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10:00 AM – 3:00 PM"
                        value={hostForm.time}
                        onChange={(e) => setHostForm({ ...hostForm, time: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Venue / Virtual Link
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PUST Central Ground or Zoom URL"
                      value={hostForm.location}
                      onChange={(e) => setHostForm({ ...hostForm, location: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Description & Goals
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Provide brief details on agenda, target attendees, and organizing team..."
                      value={hostForm.desc}
                      onChange={(e) => setHostForm({ ...hostForm, desc: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsHostModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#17263C] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-maroon px-6 py-2.5 text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                      style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
                    >
                      Submit Proposal
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* YouTube Video Player Modal */}
      {isYouTubeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setIsYouTubeModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#17263C] rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0F1A2A]">
              <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                <span className="text-rose-500 font-bold">▶</span>
                <span>A Short Tour of PUST – A Glimpse of Knowledge & Beauty</span>
              </div>
              <button
                type="button"
                onClick={() => setIsYouTubeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
                title="Close player"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/AzgQbTHCBPI?autoplay=1&rel=0"
                title="A Short Tour of PUST"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
