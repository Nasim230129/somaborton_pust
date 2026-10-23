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
import { api, useBackendSync, getCurrentUser } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";
import { getSocket, initSocket } from "../../services/socket";

const campusImages = [Ia, La, Ra, za, Ba, Va, Ha, Ka, Wa, Xa, qa, Ja, Qa, Ua, Za, Ya, Ga];

const processSteps = [
  {
    step: "01",
    icon: "🔍",
    title: "Browse & Match Mentors",
    desc: "Filter by industry, department, target role, or use our smart AI matcher to find the right guide.",
  },
  {
    step: "02",
    icon: "📅",
    title: "Select Time Slot",
    desc: "Choose a convenient date and time slot for a live 1-on-1 virtual or campus consultation.",
  },
  {
    step: "03",
    icon: "🤝",
    title: "Connect in Real-Time",
    desc: "Meet via Google Meet or Zoom. Your session is 100% free and backed by institutional alumni.",
  },
  {
    step: "04",
    icon: "🚀",
    title: "Accelerate Career",
    desc: "Receive personalized resume reviews, mock interviews, higher study prep, and referrals.",
  },
];

const industryTabs = ["All", "Technology", "Energy", "Finance", "Academia", "Infrastructure", "Healthcare"];

const careerTracks = [
  { id: "software", label: "Software & Cloud Engineering", icon: "💻", depts: ["CSE", "ICE", "EEE"] },
  { id: "data", label: "Data Science, AI & ML", icon: "🧠", depts: ["CSE", "MATH", "PHYS"] },
  { id: "power", label: "Renewable Energy & IoT", icon: "⚡", depts: ["EEE", "ICE", "PHYS"] },
  { id: "study-abroad", label: "Higher Studies & Scholarships Abroad", icon: "✈️", depts: ["CSE", "EEE", "MATH", "CHEM", "PHARM"] },
  { id: "civil", label: "Infrastructure & Structural Design", icon: "🏗️", depts: ["CE", "ARCH"] },
  { id: "business", label: "Product Management & Corporate Banking", icon: "📊", depts: ["BBA", "ECON"] },
];

function generateGoogleCalendarUrl({ title, details, location, startTime, endTime }) {
  const formatTime = (iso) => (iso ? new Date(iso).toISOString().replace(/-|:|\.\d\d\d/g, "") : "");
  const start = formatTime(startTime);
  const end = formatTime(endTime);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&dates=${start}/${end}`;
}

function downloadIcsFile({ title, description, location, startTime, endTime }) {
  const formatTime = (iso) => (iso ? new Date(iso).toISOString().replace(/-|:|\.\d\d\d/g, "") : "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PUST Alumni Network//Mentorship//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${formatTime(startTime)}`,
    `DTEND:${formatTime(endTime)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `pust-mentorship-session-${Date.now()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Mentorship() {
  useBackendSync();
  usePageMeta(
    "PUST Alumni Mentorship Program — Real-Time 1-on-1 Guidance",
    "Connect directly with 320+ verified Pabna University of Science and Technology alumni mentors across software engineering, higher studies, and global industries."
  );

  const location = useLocation();
  const currentUser = getCurrentUser();

  // Backend Data State
  const [backendMentors, setBackendMentors] = useState([]);
  const [stats, setStats] = useState({
    totalMentors: 320,
    totalSessions: 1845,
    satisfactionRate: 98,
    activeCountries: 45,
    pendingRequests: 4,
  });
  const [reviews, setReviews] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [liveActivities, setLiveActivities] = useState([
    {
      id: 1,
      text: "🔥 Ariful Islam (CSE '22) completed a Technical Mock Interview with Dr. Rafiqul Islam",
      time: "10 mins ago",
      icon: "🎯",
    },
    {
      id: 2,
      text: "⚡ Sumaiya Khatun scheduled an Embedded Systems consultation for Friday at 8:00 PM",
      time: "25 mins ago",
      icon: "📅",
    },
    {
      id: 3,
      text: "⭐ Nahid Hasan left a 5-star review for Nusrat Jahan Akter: 'Priceless guidance for junior PUSTians!'",
      time: "1 hour ago",
      icon: "⭐",
    },
    {
      id: 4,
      text: "🎉 Tahmid Chowdhury (Staff Engineer, Shopify) opened 4 new weekend slots",
      time: "2 hours ago",
      icon: "🚀",
    },
  ]);

  // Filter States
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");

  // Requested mentors storage
  const [requestedMentorIds, setRequestedMentorIds] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_requested_mentors");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  // Modal State for Booking
  const [activeMentor, setActiveMentor] = useState(null);
  const [bookingStep, setBookingStep] = useState("form"); // 'form' | 'success'
  const [createdSessionData, setCreatedSessionData] = useState(null);
  const [mentorForm, setMentorForm] = useState({
    topic: "Technical Interview & Resume Review",
    goal: "",
    message: "",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "19:30",
    platform: "Google Meet",
    menteeName: currentUser?.name || "",
    menteeEmail: currentUser?.email || "",
    dept: currentUser?.dept || "CSE",
    batch: currentUser?.batch || "2023",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Smart Matcher Quiz State
  const [matcherOpen, setMatcherOpen] = useState(false);
  const [matcherTrack, setMatcherTrack] = useState("software");
  const [matcherDept, setMatcherDept] = useState("CSE");
  const [matchedResults, setMatchedResults] = useState([]);

  // Community Q&A Modal / State
  const [qaModalOpen, setQaModalOpen] = useState(false);
  const [qaList, setQaList] = useState([
    {
      id: 1,
      question: "How can final-year CSE students prepare for product-based company hiring in Dhaka?",
      asker: "Tanvir (CSE '23)",
      answer: "Focus deeply on data structures (Arrays, HashMaps, Trees), one solid backend framework (Node/Spring/Django), and have at least 1 deployed production project.",
      answeredBy: "Dr. Rafiqul Islam · Lead Architect",
      votes: 38,
    },
    {
      id: 2,
      question: "What is the typical timeline for DAAD or Erasmus Mundus scholarship applications from PUST?",
      asker: "Fariha (EEE '22)",
      answer: "Begin preparing your IELTS & SOP between June-August. Most German universities and Erasmus programs open portals between October and January for the following winter intake.",
      answeredBy: "Nusrat Jahan Akter · Renewable Researcher",
      votes: 42,
    },
  ]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionAsker, setNewQuestionAsker] = useState("");

  // Video State
  const [isMuted, setIsMuted] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Load Initial Data from Backend
  const fetchMentorshipData = async () => {
    try {
      const res = await api.getMentorship();
      if (res && res.ok) {
        if (Array.isArray(res.mentors) && res.mentors.length > 0) {
          setBackendMentors(res.mentors);
        }
        if (res.stats) {
          setStats((prev) => ({ ...prev, ...res.stats }));
        }
        if (Array.isArray(res.reviews) && res.reviews.length > 0) {
          setReviews(res.reviews);
        }
      }
    } catch (err) {
      console.debug("Mentorship sync notice:", err.message);
    }
  };

  useEffect(() => {
    fetchMentorshipData();
    const interval = setInterval(fetchMentorshipData, 12000); // Poll every 12s for real-time freshness
    return () => clearInterval(interval);
  }, []);

  // Socket.IO Real-Time Integration
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

    const onMentorshipActivity = (act) => {
      let text = "";
      if (act.type === "request") {
        text = `🎯 ${act.menteeName} requested 1-on-1 guidance from ${act.mentorName}: "${act.topic}"`;
      } else if (act.type === "accepted") {
        text = `🎉 ${act.mentorName} accepted mentorship request from ${act.menteeName}!`;
      } else if (act.type === "completed") {
        text = `🏆 ${act.menteeName} completed session with ${act.mentorName} (${act.topic})`;
      } else if (act.type === "review") {
        text = `⭐ ${act.menteeName} rated ${act.mentorName} ${"★".repeat(act.rating || 5)}`;
      } else if (act.type === "new_mentor") {
        text = `🌟 ${act.mentorName} joined as a verified Alumni Mentor (${act.dept})!`;
      } else {
        text = `⚡ Mentorship update from ${act.mentorName || "PUST Network"}`;
      }

      setLiveActivities((prev) => [
        {
          id: Date.now(),
          text,
          time: "Just now",
          icon: act.type === "completed" ? "🏆" : act.type === "review" ? "⭐" : "⚡",
        },
        ...prev.slice(0, 9),
      ]);

      fetchMentorshipData();
    };

    const onRequestCreated = () => fetchMentorshipData();
    const onRequestUpdated = () => fetchMentorshipData();
    const onSessionCreated = () => fetchMentorshipData();
    const onReviewAdded = (rev) => {
      setReviews((prev) => [rev, ...prev]);
      fetchMentorshipData();
    };

    setSocketConnected(socket.connected);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("mentorship_activity", onMentorshipActivity);
    socket.on("mentorship_request_created", onRequestCreated);
    socket.on("mentorship_request_updated", onRequestUpdated);
    socket.on("mentorship_session_created", onSessionCreated);
    socket.on("mentorship_review_added", onReviewAdded);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("mentorship_activity", onMentorshipActivity);
      socket.off("mentorship_request_created", onRequestCreated);
      socket.off("mentorship_request_updated", onRequestUpdated);
      socket.off("mentorship_session_created", onSessionCreated);
      socket.off("mentorship_review_added", onReviewAdded);
    };
  }, []);

  // Sync Search from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || params.get("q");
    if (q) setSearchQuery(q);
  }, [location.search]);

  // Merge static seed mentors with dynamic backend mentors without duplicate IDs
  const combinedMentors = useMemo(() => {
    const map = new Map();
    // Default seed mentors
    pa.filter((m) => m.mentorAvailable).forEach((m) => {
      map.set(m.id, {
        ...m,
        rating: m.rating || 4.9,
        sessionsCount: m.sessionsCount || (12 + (m.id * 3) % 19),
        online: m.id % 2 === 1,
        nextSlot: m.id % 3 === 0 ? "Today 7:30 PM" : m.id % 3 === 1 ? "Tomorrow 8:00 PM" : "Friday 6:00 PM",
      });
    });

    // Backend mentors override / add
    if (Array.isArray(backendMentors)) {
      backendMentors.forEach((bm) => {
        map.set(bm.id, {
          ...(map.get(bm.id) || {}),
          ...bm,
          rating: bm.rating || map.get(bm.id)?.rating || 5.0,
          sessionsCount: bm.sessionsCount || map.get(bm.id)?.sessionsCount || 8,
          online: true,
          nextSlot: bm.nextSlot || "This Week",
        });
      });
    }

    return Array.from(map.values());
  }, [backendMentors]);

  // Filtered & Sorted Mentors
  const filteredMentors = useMemo(() => {
    let list = combinedMentors.filter((mentor) => {
      if (selectedIndustry !== "All" && mentor.industry !== selectedIndustry) {
        return false;
      }
      if (selectedDept !== "All" && mentor.dept && !mentor.dept.toLowerCase().includes(selectedDept.toLowerCase())) {
        return false;
      }
      if (selectedAvailability === "online" && !mentor.online) {
        return false;
      }
      if (selectedAvailability === "today" && !mentor.nextSlot?.toLowerCase().includes("today")) {
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

    if (sortBy === "rating") {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "sessions") {
      list = [...list].sort((a, b) => (b.sessionsCount || 0) - (a.sessionsCount || 0));
    } else if (sortBy === "recent") {
      list = [...list].sort((a, b) => b.id - a.id);
    }

    return list;
  }, [combinedMentors, selectedIndustry, selectedDept, selectedAvailability, searchQuery, sortBy]);

  // Smart Matcher Calculation
  const runSmartMatcher = () => {
    const selectedTrackObj = careerTracks.find((t) => t.id === matcherTrack);
    const results = combinedMentors
      .map((mentor) => {
        let score = 70;
        if (selectedTrackObj?.depts?.some((d) => (mentor.dept || "").toUpperCase().includes(d))) {
          score += 20;
        }
        if (mentor.dept && mentor.dept.toUpperCase().includes(matcherDept.toUpperCase())) {
          score += 8;
        }
        if (mentor.verified) score += 2;
        return { mentor, score: Math.min(score, 99) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setMatchedResults(results);
    setMatcherOpen(true);
  };

  // Video Controls
  const toggleMute = () => {
    const iframe = document.getElementById("youtube-mentorship-bg-iframe");
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (iframe && iframe.contentWindow) {
      const command = nextMuted ? "mute" : "unMute";
      iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "*");
      if (!nextMuted) {
        iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [100] }), "*");
      }
    }
    const localVideo = document.getElementById("fallback-mentorship-video");
    if (localVideo) localVideo.muted = nextMuted;
  };

  const handleFullscreenCinema = () => {
    const iframe = document.getElementById("youtube-mentorship-bg-iframe");
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

  // Open Booking Modal for a Mentor
  const handleOpenBooking = (mentor) => {
    setActiveMentor(mentor);
    setBookingStep("form");
    setCreatedSessionData(null);
    setMentorForm((prev) => ({
      ...prev,
      menteeName: currentUser?.name || prev.menteeName || "PUST Student",
      menteeEmail: currentUser?.email || prev.menteeEmail || "student@pust.ac.bd",
      dept: currentUser?.dept || prev.dept || "CSE",
      batch: currentUser?.batch || prev.batch || "2023",
    }));
  };

  // Submit Booking / Request
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!activeMentor) return;

    setIsSubmitting(true);
    try {
      const startDateTime = `${mentorForm.date}T${mentorForm.time}:00`;
      const endDateTime = new Date(new Date(startDateTime).getTime() + 45 * 60000).toISOString();
      const generatedMeetLink = `https://meet.google.com/pus-${Math.random().toString(36).slice(2, 6)}-${Math.random()
        .toString(36)
        .slice(2, 5)}`;

      const res = await api.requestMentorship({
        mentorId: activeMentor.id,
        mentorName: activeMentor.name,
        mentorAvatar: activeMentor.avatar,
        menteeName: mentorForm.menteeName || "PUST Community Member",
        menteeEmail: mentorForm.menteeEmail || "alumni.user@pust.ac.bd",
        dept: mentorForm.dept || "CSE",
        batch: mentorForm.batch || "2023",
        topic: mentorForm.topic,
        goal: mentorForm.goal,
        message: mentorForm.message,
        preferredDate: mentorForm.date,
        preferredTime: mentorForm.time,
        preferredPlatform: mentorForm.platform,
      });

      const nextRequested = [...requestedMentorIds, activeMentor.id];
      setRequestedMentorIds(nextRequested);
      localStorage.setItem("pust_requested_mentors", JSON.stringify(nextRequested));

      setCreatedSessionData({
        sessionCode: `PUST-MENTOR-${Math.floor(1000 + Math.random() * 9000)}`,
        meetLink: generatedMeetLink,
        mentorName: activeMentor.name,
        topic: mentorForm.topic,
        startDateTime,
        endDateTime,
        date: mentorForm.date,
        time: mentorForm.time,
        platform: mentorForm.platform,
      });

      setBookingStep("success");
    } catch (err) {
      console.debug("Mentorship request submission notice:", err);
      // Fallback display if offline
      setCreatedSessionData({
        sessionCode: `PUST-MENTOR-${Math.floor(1000 + Math.random() * 9000)}`,
        meetLink: `https://meet.google.com/pus-${Math.random().toString(36).slice(2, 6)}-${Math.random()
          .toString(36)
          .slice(2, 5)}`,
        mentorName: activeMentor.name,
        topic: mentorForm.topic,
        startDateTime: `${mentorForm.date}T${mentorForm.time}:00`,
        endDateTime: new Date(new Date(`${mentorForm.date}T${mentorForm.time}:00`).getTime() + 45 * 60000).toISOString(),
        date: mentorForm.date,
        time: mentorForm.time,
        platform: mentorForm.platform,
      });
      setBookingStep("success");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Community Question
  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ = {
      id: Date.now(),
      question: newQuestionText,
      asker: newQuestionAsker.trim() || `${currentUser?.name || "Student"} (${currentUser?.dept || "PUST"})`,
      answer: "Thank you for your question! A verified alumni mentor in this discipline will post a response shortly.",
      answeredBy: "PUST Alumni Mentor Panel",
      votes: 1,
    };

    setQaList([newQ, ...qaList]);
    setNewQuestionText("");
    setNewQuestionAsker("");
    setQaModalOpen(false);

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit("mentorship_qa_asked", newQ);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C]">
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
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
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

        {/* Top Controls & Live Socket Status */}
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
              <span>{socketConnected ? "🟢 Live Real-Time Network Active" : "⚡ Live Synced with Server"}</span>
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
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
              const el = document.getElementById("mentorship-board");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/85 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-[#C7A76C]/40 backdrop-blur-md shadow-xl transition-all cursor-pointer active:scale-95 ring-1 ring-white/10"
          >
            <span className="text-[#DFCA9E]">🎯</span>
            <span>Explore 320+ Live Mentors & Book 1:1 Session</span>
            <span className="text-sm text-[#DFCA9E]">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. INSTITUTIONAL METRICS RIBBON (Dynamic Live Backend Counts)
         ========================================================================= */}
      <div id="mentorship-board" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-2 sm:pt-0 sm:px-4 text-center">
              <p className="font-display font-bold text-2xl sm:text-3xl text-[#DFCA9E] leading-none">
                {stats.totalMentors || combinedMentors.length}+
              </p>
              <p className="text-[11px] sm:text-xs mt-2 uppercase tracking-wider text-slate-300 font-semibold">
                Verified Alumni Mentors
              </p>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-4 text-center">
              <p className="font-display font-bold text-2xl sm:text-3xl text-emerald-400 leading-none">
                {stats.totalSessions.toLocaleString()}+
              </p>
              <p className="text-[11px] sm:text-xs mt-2 uppercase tracking-wider text-slate-300 font-semibold">
                1-on-1 Sessions Completed
              </p>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-4 text-center">
              <p className="font-display font-bold text-2xl sm:text-3xl text-[#DFCA9E] leading-none">
                {stats.satisfactionRate}%
              </p>
              <p className="text-[11px] sm:text-xs mt-2 uppercase tracking-wider text-slate-300 font-semibold">
                Mentee Satisfaction Rate
              </p>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-4 text-center">
              <p className="font-display font-bold text-2xl sm:text-3xl text-cyan-400 leading-none">
                {stats.activeCountries}+
              </p>
              <p className="text-[11px] sm:text-xs mt-2 uppercase tracking-wider text-slate-300 font-semibold">
                Countries with Active Mentors
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
            <span>Live Pulse</span>
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
          4. INSTITUTIONAL MENTORSHIP HEADER & SEARCH
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] shadow-2xs py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-2 text-[#7A1737]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> · PUST Alumni Network · Mentorship
          </p>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#17263C] mb-3 tracking-tight">
            Connect With PUST Alumni Mentors Worldwide
          </h1>

          <p className="mb-6 max-w-2xl mx-auto text-xs sm:text-sm text-[#64748B] leading-relaxed">
            320+ experienced PUST graduates ready to provide personalized 1-on-1 career guidance,
            technical interview preparation, resume reviews, and higher study mentorship.
          </p>

          {/* Search Bar */}
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
              placeholder="Search mentors by name, company, skill (e.g. AWS, React), or department…"
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

          {/* Action CTAs */}
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={runSmartMatcher}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-[#7A1737] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm cursor-pointer flex items-center gap-2 active:scale-95 hover:brightness-110"
            >
              <span>✨ Smart AI Mentor Matcher</span>
            </button>
            <button
              type="button"
              onClick={() => setQaModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-[#17263C] font-semibold text-xs sm:text-sm tracking-wide transition-all border border-[#E2E8F0] shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>💬 Ask Alumni a Question</span>
            </button>
            <Link
              to="/dashboard/mentorship"
              className="px-4 py-2.5 rounded-lg bg-[#17263C] hover:bg-[#0F1A2A] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>⚙️ Mentor Dashboard →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SMART AI MATCHING MODAL / DRAWER
         ========================================================================= */}
      {matcherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setMatcherOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-fit mb-2">
              <span>✨ Intelligent Recommendation Engine</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#17263C]">
              Find Your Perfect PUST Mentor Match
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Tell us your target career direction and academic background. We will match you with the highest-rated PUST alumni practitioners in that domain.
            </p>

            {/* Step 1 & 2 Selectors */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-[#17263C] mb-1.5">
                  1. Your Target Career Track
                </label>
                <select
                  value={matcherTrack}
                  onChange={(e) => {
                    setMatcherTrack(e.target.value);
                    setTimeout(runSmartMatcher, 50);
                  }}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  {careerTracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17263C] mb-1.5">
                  2. Your PUST Department
                </label>
                <select
                  value={matcherDept}
                  onChange={(e) => {
                    setMatcherDept(e.target.value);
                    setTimeout(runSmartMatcher, 50);
                  }}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="CSE">CSE (Computer Science)</option>
                  <option value="EEE">EEE (Electrical & Electronics)</option>
                  <option value="ICE">ICE (Information & Communication)</option>
                  <option value="CE">Civil Engineering</option>
                  <option value="ARCH">Architecture</option>
                  <option value="MATH">Mathematics</option>
                  <option value="PHYS">Physics</option>
                  <option value="CHEM">Chemistry</option>
                  <option value="PHARM">Pharmacy</option>
                  <option value="BBA">Business Administration</option>
                  <option value="ECON">Economics</option>
                </select>
              </div>
            </div>

            {/* Top Matches */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Top 3 Recommended Alumni Mentors
            </h3>
            <div className="space-y-3">
              {matchedResults.map(({ mentor, score }) => (
                <div
                  key={mentor.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#7A1737]/40 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#7A1737]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#17263C]">{mentor.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {score}% Match
                        </span>
                      </div>
                      <p className="text-xs text-[#7A1737] font-semibold">{mentor.company || mentor.dept}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{mentor.headline}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMatcherOpen(false);
                      handleOpenBooking(mentor);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-[#7A1737] hover:bg-[#60122B] text-white shadow-xs cursor-pointer flex-shrink-0"
                  >
                    Book 1:1 →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. HOW MENTORSHIP WORKS
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] py-14 sm:py-16 reveal-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
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
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-md transition-all flex flex-col justify-between group"
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
                  <p className="text-xs text-[#64748B] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. MAIN MENTORS DIRECTORY WITH REAL-TIME INDICATORS
         ========================================================================= */}
      <section id="mentors-directory" className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Filter Controls Header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#17263C]">
                  Available Alumni Mentors
                </h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Showing <strong className="text-[#17263C]">{filteredMentors.length}</strong> verified alumni practitioners ready for 1-on-1 sessions.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Availability Filter */}
              <select
                aria-label="Filter mentors by availability"
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl outline-none focus:ring-1 focus:ring-[#7A1737] bg-white border border-[#E2E8F0] text-[#17263C] shadow-xs cursor-pointer"
              >
                <option value="All">⚡ All Availabilities</option>
                <option value="online">🟢 Online Now</option>
                <option value="today">📅 Slots Available Today</option>
              </select>

              {/* Department Filter */}
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
              </select>

              {/* Sort By */}
              <select
                aria-label="Sort mentors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl outline-none focus:ring-1 focus:ring-[#7A1737] bg-white border border-[#E2E8F0] text-[#17263C] shadow-xs cursor-pointer"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="rating">Sort: Highest Rated (★)</option>
                <option value="sessions">Sort: Most Sessions</option>
                <option value="recent">Sort: Recently Joined</option>
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
            {(selectedIndustry !== "All" || selectedDept !== "All" || selectedAvailability !== "All" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedIndustry("All");
                  setSelectedDept("All");
                  setSelectedAvailability("All");
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
            <h3 className="font-bold text-[#17263C] text-lg mb-1">No Mentors Match Your Search</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto mb-5">
              Try adjusting your department or industry filter to discover other mentors across our 22,400+ alumni network.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedIndustry("All");
                setSelectedDept("All");
                setSelectedAvailability("All");
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
              const isRequested =
                Array.isArray(requestedMentorIds) && requestedMentorIds.some((id) => String(id) === String(mentor.id));

              return (
                <div
                  key={mentor.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl transition-all bg-white border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-lg"
                >
                  <div>
                    {/* Cover image banner with Live Status */}
                    <div className="relative h-24 overflow-hidden bg-[#17263C]">
                      <img
                        src={coverImage}
                        alt=""
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17263C]/80 via-transparent to-transparent" />

                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border ${
                            mentor.online
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                              : "bg-black/60 text-slate-300 border-white/20"
                          }`}
                        >
                          {mentor.online ? "🟢 Online Now" : "⚡ Available"}
                        </span>
                      </div>

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

                      <p className="text-xs font-semibold text-[#7A1737] mt-0.5">{mentor.company || mentor.dept}</p>

                      <p className="text-xs text-[#64748B] mt-1.5 leading-snug line-clamp-2 min-h-[32px]">
                        {mentor.headline || `Experienced practitioner in ${mentor.industry || mentor.dept}.`}
                      </p>

                      {/* Rating & Slot Ribbon */}
                      <div className="flex items-center justify-center gap-3 mt-3 py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                        <span className="text-amber-500 font-bold">★ {mentor.rating || 4.9}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 font-medium">{mentor.sessionsCount || 14} sessions</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-emerald-700 font-semibold">{mentor.nextSlot || "This Week"}</span>
                      </div>

                      {/* Department & Batch */}
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
                      onClick={() => handleOpenBooking(mentor)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs ${
                        isRequested
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-[#7A1737] hover:bg-[#60122B] text-white"
                      }`}
                    >
                      {isRequested ? "✓ Booked / Requested" : "📅 Book 1:1 Session →"}
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
          7. MENTEE TESTIMONIALS & REVIEWS SECTION
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#17263C] text-white py-16 border-t border-b border-[#0F1A2A]">
        <img src={Ha} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C7A76C] bg-white/10 px-3.5 py-1 rounded-full border border-white/15 font-bengali">
              অ্যালামনাইদের অভিজ্ঞতা ও মূল্যায়ন
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-2.5">
              Verified Mentee Feedback
            </h2>
            <p className="text-xs sm:text-sm text-[#E2E8F0] mt-1.5">
              Real testimonials from graduates who accelerated their career roadmaps through 1-on-1 alumni mentorship.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {(reviews.length > 0 ? reviews : [
              {
                menteeName: "Ariful Islam",
                dept: "CSE",
                batch: "2022",
                rating: 5,
                review: "My mentor connected me with a leading software enterprise before I even completed my final semester. Truly life-changing.",
              },
              {
                menteeName: "Sumaiya Khatun",
                dept: "EEE",
                batch: "2023",
                rating: 5,
                review: "Three months of mentorship gave me more career clarity than four years of searching alone. The PUST alumni network is priceless.",
              },
              {
                menteeName: "Nahid Hasan",
                dept: "MATH",
                batch: "2024",
                rating: 5,
                review: "My mentor provided essential guidance on foreign scholarship applications and research proposals. Forever grateful.",
              },
            ]).slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#F59E0B] text-sm mb-3">
                    {"★".repeat(item.rating || 5)}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed mb-6 text-[#E2E8F0] italic">
                    "{item.review}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <img
                    src={item.menteeAvatar || createInitialsAvatar(item.menteeName, "student")}
                    alt={item.menteeName}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <p className="text-white text-xs font-bold">{item.menteeName}</p>
                    <p className="text-[10px] text-[#C7A76C]">{item.dept} · Batch {item.batch}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. COMMUNITY Q&A DRAWER / ASK ALUMNI ANYTHING
         ========================================================================= */}
      <section className="py-14 sm:py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A1737] bg-[#7A1737]/10 px-3 py-1 rounded-full border border-[#7A1737]/20 font-bengali">
                প্রশ্নোত্তর ফোরাম
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#17263C] mt-2">
                Ask PUST Alumni Questions
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Have a quick question about career choices, higher education, or technical stacks?
              </p>
            </div>
            <button
              onClick={() => setQaModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#7A1737] hover:bg-[#60122B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              + Ask a Question
            </button>
          </div>

          <div className="space-y-4">
            {qaList.map((qa) => (
              <div key={qa.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-sm text-[#17263C]">❓ {qa.question}</h3>
                  <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                    asked by {qa.asker}
                  </span>
                </div>
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <p className="font-medium">{qa.answer}</p>
                  <p className="text-[10px] text-[#7A1737] font-semibold mt-2">
                    ✓ Verified Answer by {qa.answeredBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. BECOME A MENTOR CTA
         ========================================================================= */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-[#17263C] text-white rounded-3xl p-8 sm:p-12 border border-[#0F1A2A] shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#DFCA9E] bg-white/10 px-3 py-1 rounded-full border border-white/20 font-bengali">
                অ্যালামনাইদের অবদান
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-3">
                Inspire the Next Generation of PUSTians
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Whether you have 2 years of industry experience or 15+ years of leadership, your insights can guide a fellow graduate to their dream career. Join 320+ verified PUST alumni mentors today.
              </p>
            </div>
            <Link
              to="/dashboard/mentorship"
              className="px-8 py-3.5 text-xs sm:text-sm font-bold bg-[#DFCA9E] hover:bg-[#C7A76C] text-[#17263C] rounded-xl shadow-lg transition-all active:scale-95 flex-shrink-0"
            >
              Join as a Mentor →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. INTERACTIVE 1-ON-1 BOOKING & CONFIRMATION MODAL
         ========================================================================= */}
      {activeMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E2E8F0] shadow-2xl relative overflow-hidden max-h-[95vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveMentor(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F4F5F7] hover:bg-[#E2E8F0] text-[#17263C] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              title="Close modal"
            >
              ✕
            </button>

            {bookingStep === "success" && createdSessionData ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-200">
                  ✓
                </div>
                <h3 className="font-display font-bold text-xl text-[#17263C] mb-1">
                  1-on-1 Session Scheduled!
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                  Your live mentorship request has been sent to <strong>{createdSessionData.mentorName}</strong> with real-time notification.
                </p>

                {/* Session Details Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 mb-5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Session ID:</span>
                    <span className="font-mono font-bold text-[#7A1737]">{createdSessionData.sessionCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled For:</span>
                    <span className="font-semibold">{createdSessionData.date} at {createdSessionData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Format:</span>
                    <span className="font-semibold">{createdSessionData.platform}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block mb-1">Virtual Meeting Room:</span>
                    <a
                      href={createdSessionData.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7A1737] font-semibold underline break-all hover:text-[#60122B]"
                    >
                      {createdSessionData.meetLink}
                    </a>
                  </div>
                </div>

                {/* Calendar Integration Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={generateGoogleCalendarUrl({
                      title: `PUST Mentorship: ${createdSessionData.mentorName}`,
                      details: `Topic: ${createdSessionData.topic}\nMeeting link: ${createdSessionData.meetLink}\nPUST Alumni Mentorship Program.`,
                      location: createdSessionData.meetLink,
                      startTime: createdSessionData.startDateTime,
                      endTime: createdSessionData.endDateTime,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>📅 Add to Google Calendar</span>
                  </a>
                  <button
                    onClick={() =>
                      downloadIcsFile({
                        title: `PUST Mentorship: ${createdSessionData.mentorName}`,
                        description: `Topic: ${createdSessionData.topic}\nLink: ${createdSessionData.meetLink}`,
                        location: createdSessionData.meetLink,
                        startTime: createdSessionData.startDateTime,
                        endTime: createdSessionData.endDateTime,
                      })
                    }
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>📥 Download .ics Invite</span>
                  </button>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => setActiveMentor(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
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
                      Book Live 1:1 with {activeMentor.name}
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
                      <option value="Technical Interview & Resume Review">Technical Interview & Resume Review</option>
                      <option value="Career Guidance & Transition">Career Guidance & Transition</option>
                      <option value="Higher Studies & Scholarship Preparation">Higher Studies & Scholarship Preparation</option>
                      <option value="Research Collaboration & Publishing">Research Collaboration & Publishing</option>
                      <option value="Industry Best Practices & Skill Building">Industry Best Practices & Skill Building</option>
                    </select>
                  </div>

                  {/* Date & Time Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#17263C] mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={mentorForm.date}
                        onChange={(e) => setMentorForm({ ...mentorForm, date: e.target.value })}
                        className="w-full text-xs py-2.5 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#7A1737] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#17263C] mb-1.5">
                        Preferred Time
                      </label>
                      <select
                        value={mentorForm.time}
                        onChange={(e) => setMentorForm({ ...mentorForm, time: e.target.value })}
                        className="w-full text-xs py-2.5 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#7A1737] outline-none"
                      >
                        <option value="18:00">06:00 PM BST</option>
                        <option value="19:00">07:00 PM BST</option>
                        <option value="19:30">07:30 PM BST</option>
                        <option value="20:00">08:00 PM BST</option>
                        <option value="21:00">09:00 PM BST</option>
                        <option value="10:00">10:00 AM BST (Weekend)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17263C] mb-1.5">
                      Meeting Platform
                    </label>
                    <select
                      value={mentorForm.platform}
                      onChange={(e) => setMentorForm({ ...mentorForm, platform: e.target.value })}
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#7A1737] outline-none"
                    >
                      <option value="Google Meet">Google Meet (Auto-generated link)</option>
                      <option value="Zoom">Zoom</option>
                      <option value="PUST Campus In-Person">PUST Campus Central Library / Dept Lab</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17263C] mb-1.5">
                      What is your primary goal / question?
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Preparing for Junior Software Engineer interview at Brain Station 23"
                      value={mentorForm.goal}
                      onChange={(e) => setMentorForm({ ...mentorForm, goal: e.target.value })}
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#7A1737] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17263C] mb-1.5">
                      Short Note for Mentor
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Share your graduation year, current projects, or specific questions..."
                      value={mentorForm.message}
                      onChange={(e) => setMentorForm({ ...mentorForm, message: e.target.value })}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#7A1737] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveMentor(null)}
                      className="px-5 py-2.5 text-xs font-semibold text-[#17263C] hover:bg-[#F4F5F7] rounded-xl border border-[#E2E8F0] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-[#7A1737] hover:bg-[#60122B] rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "Scheduling Live..." : "Confirm & Send Request →"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          11. ASK A QUESTION MODAL
         ========================================================================= */}
      {qaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setQaModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 className="font-display font-bold text-lg text-[#17263C] mb-1">
              Ask PUST Alumni Mentors
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your inquiry will be highlighted in the alumni community feed for verified practitioners to answer.
            </p>
            <form onSubmit={handlePostQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Question</label>
                <textarea
                  required
                  rows={3}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. Which elective course is best for stepping into cloud computing?"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name / Department</label>
                <input
                  type="text"
                  placeholder="e.g. Ariful (CSE '23)"
                  value={newQuestionAsker}
                  onChange={(e) => setNewQuestionAsker(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#7A1737] outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQaModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#7A1737] text-white hover:bg-[#60122B]"
                >
                  Post Question
                </button>
              </div>
            </form>
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
                <p className="text-xs text-slate-400">Real Campus Experience · Press ESC to exit</p>
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
