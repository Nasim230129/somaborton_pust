import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { wa, Ia, La, Ra, za, Ba, Ha, Wa, Ka, Ja, Xa, Za, Qa } from "../../data/mockData";
import { api } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";

// Inquiry category definitions
const INQUIRY_CATEGORIES = [
  { v: "general", l: "General Academic & Campus Query" },
  { v: "verification", l: "Degree, Transcript & Alumni Verification" },
  { v: "somaborton", l: "Convocation (Somaborton) Registration & Gown" },
  { v: "idcard", l: "Alumni Lifetime ID Card Request" },
  { v: "membership", l: "Directory Profile & Chapter Membership" },
  { v: "reunion", l: "Reunion & Batch Alumni Meet" },
  { v: "sponsorship", l: "Corporate Partnership & Sponsorship" },
  { v: "technical", l: "Portal Technical Support & Bug Report" },
  { v: "other", l: "Other Directorate Inquiries" },
];

// Directorate offices directory
const OFFICE_DIRECTORY = [
  {
    id: "alumni-affairs",
    icon: "🏛️",
    badge: "Primary Liaison",
    title: "Alumni Affairs Directorate",
    head: "Prof. Dr. Md. Kamruzzaman",
    role: "Director, Alumni Relations",
    category: "alumni",
    addr: "Administrative Building, 2nd Floor, Room 204\nPUST Campus, Rajapur, Pabna-6600, Bangladesh",
    phone: "+880-731-65350",
    email: "alumni@pust.ac.bd",
    hours: "Sun–Thu: 9:00 AM – 5:00 PM BST",
    img: Xa,
  },
  {
    id: "registrar",
    icon: "🎓",
    badge: "Certificates & Verification",
    title: "Office of the Registrar",
    head: "Academic & Records Wing",
    role: "Controller of Examinations & Transcripts",
    category: "academic",
    addr: "Main Academic Complex, Ground Floor, Room 102\nPUST Campus, Rajapur, Pabna-6600, Bangladesh",
    phone: "+880-731-65200",
    email: "registrar@pust.ac.bd",
    hours: "Sun–Thu: 9:00 AM – 4:30 PM BST",
    img: Ja,
  },
  {
    id: "proctor",
    icon: "🛡️",
    badge: "24/7 Campus Security",
    title: "Office of the Proctor",
    head: "Proctorial Security & Vigilance Desk",
    role: "Campus Safety & Emergency Protocol",
    category: "emergency",
    addr: "PUST Central Gate 1 Plaza, Ground Floor\nPUST Campus, Rajapur, Pabna-6600, Bangladesh",
    phone: "+880-1711-384950",
    email: "proctor@pust.ac.bd",
    hours: "24/7 Security & Emergency Dispatch",
    img: Wa,
  },
  {
    id: "dsw",
    icon: "🤝",
    badge: "Student & Alumni Care",
    title: "Directorate of Student Welfare (DSW)",
    head: "Student Affairs Coordination Cell",
    role: "Welfare, Scholarships & Community",
    category: "alumni",
    addr: "Central Student Center (TSC), 1st Floor\nPUST Campus, Rajapur, Pabna-6600, Bangladesh",
    phone: "+880-731-65220",
    email: "studentaffairs@pust.ac.bd",
    hours: "Sun–Thu: 9:00 AM – 4:30 PM BST",
    img: Ka,
  },
  {
    id: "ict-cell",
    icon: "💻",
    badge: "Digital Services",
    title: "ICT Cell & Portal Tech Center",
    head: "Systems & Network Engineering Team",
    role: "Portal Accounts & IT Helpdesk",
    category: "tech",
    addr: "Academic Building 2, 3rd Floor, Room 314\nPUST Campus, Rajapur, Pabna-6600, Bangladesh",
    phone: "+880-731-65255",
    email: "it.support@pust.ac.bd",
    hours: "Sun–Thu: 9:00 AM – 5:00 PM BST",
    img: Ia,
  },
  {
    id: "global-desk",
    icon: "🌏",
    badge: "International Chapters",
    title: "Global Alumni Chapters Liaison",
    head: "International Relations Cell",
    role: "Overseas Chapters & Global Networking",
    category: "alumni",
    addr: "Admin Complex, Room 208 & Dhaka Guest House\nPUST Campus, Rajapur, Pabna-6600, Bangladesh",
    phone: "+880-731-65355",
    email: "global.alumni@pust.ac.bd",
    hours: "Sun–Thu: 10:00 AM – 6:00 PM BST",
    img: Ba,
  },
];

// Pre-seeded realistic demo tickets for instantaneous verification testing
const DEMO_TICKETS = {
  "PUST-INQ-2026-8491": {
    trackingCode: "PUST-INQ-2026-8491",
    name: "Engr. Tanvir Ahmed",
    email: "tanvir.cse15@gmail.com",
    phone: "+880 1712-345678",
    dept: "Computer Science & Engineering (Batch '15)",
    topic: "Degree, Transcript & Alumni Verification",
    priority: "Urgent",
    status: "Resolved & Dispatched",
    stage: "Official Verification Dispatched",
    createdAt: "2026-10-19T09:15:00.000Z",
    assignedOfficer: "Md. Tariqul Islam (Assistant Registrar, Academic Wing)",
    resolutionNotes:
      "Degree and transcript records verified against PUST Controller Archive register Vol-8. Digital verified certificate sent to Canadian WES & candidate email.",
    timeline: [
      { step: "Inquiry Received & Registered", time: "Oct 19, 09:15 AM BST", done: true },
      { step: "Routed to Academic Records Desk", time: "Oct 19, 11:30 AM BST", done: true },
      { step: "Transcript & Archive Verification", time: "Oct 20, 02:40 PM BST", done: true },
      { step: "Official Dispatch & Response Sent", time: "Oct 21, 10:00 AM BST", done: true },
    ],
  },
  "PUST-INQ-2026-2305": {
    trackingCode: "PUST-INQ-2026-2305",
    name: "Nusrat Jahan",
    email: "nusrat.eee18@pust.ac.bd",
    phone: "+880 1819-876543",
    dept: "Electrical & Electronic Engineering (Batch '18)",
    topic: "Convocation (Somaborton) Registration & Gown",
    priority: "High",
    status: "Under Review",
    stage: "Gown Inventory Allocation in Progress",
    createdAt: "2026-10-20T14:30:00.000Z",
    assignedOfficer: "Prof. Dr. M. Faruq (Convocation Logistics Coordinator)",
    resolutionNotes:
      "Gown size 'M' verified and assigned. Token issued for pick-up at PUST Gymnasium Booth 4 on convocation rehearsal day.",
    timeline: [
      { step: "Inquiry Received & Registered", time: "Oct 20, 02:30 PM BST", done: true },
      { step: "Routed to Convocation Committee", time: "Oct 21, 09:00 AM BST", done: true },
      { step: "Gown & Token Allocation", time: "Oct 21, 11:30 AM BST", done: true },
      { step: "Final Confirmation Slip Dispatch", time: "Pending Final Dispatch", done: false },
    ],
  },
};

// FAQ data
const FAQ_ITEMS = [
  {
    q: "How do I verify my PUST degree or transcript for foreign evaluation (WES/ECE)?",
    category: "verification",
    a: "Submit an inquiry choosing 'Degree, Transcript & Alumni Verification' or contact registrar@pust.ac.bd with your student roll, registration number, and passing year. The Controller of Examinations authenticates records against original archive volumes and dispatches verified digital or sealed physical copies directly to international credential assessment agencies.",
  },
  {
    q: "How can I register for the upcoming PUST Convocation (Somaborton)?",
    category: "convocation",
    a: "Eligible graduates can register through the Convocation portal. Select your gown size, specify guest invitations, upload your formal convocation photograph, and settle fees via bKash/Nagad/Cards. A printable QR-coded Admit Card will be generated instantly upon confirmation.",
  },
  {
    q: "How do I obtain an official PUST Alumni Lifetime Membership Card?",
    category: "idcard",
    a: "Graduates can apply directly from their profile dashboard or submit an inquiry to the Alumni Affairs Office. Lifetime ID cards grant on-campus central library privileges, guest house reservations, university sports facilities access, and corporate discounts with partner healthcare and airline providers.",
  },
  {
    q: "Can international alumni join and participate in overseas chapters?",
    category: "membership",
    a: "Absolutely! PUST maintains active chapters across North America, Europe, Australia, Japan, and the Middle East. Membership is free for all PUST graduates worldwide. Register online to receive chapter event notices and mentoring opportunities.",
  },
  {
    q: "How can corporate employers hire PUST graduates or schedule campus recruitment?",
    category: "general",
    a: "Organizations can register as corporate partners via our Career Portal or email employer@pust.ac.bd. Our Career Guidance & Placement Cell arranges campus interviews, technical assessments, and dedicated recruitment drives.",
  },
  {
    q: "How do I organize a departmental batch reunion on campus?",
    category: "general",
    a: "Contact the Alumni Affairs Directorate at alumni@pust.ac.bd at least 3 weeks before your intended date. The university provides venue reservations (Central Auditorium / TSC Open Stage), guest reception protocols, campus sound permissions, and security escort.",
  },
  {
    q: "What is the standard turnaround time for inquiries submitted here?",
    category: "general",
    a: "Every submission is immediately assigned an official tracking reference code (e.g., PUST-INQ-2026-XXXX). Helpdesk officers review and reply within 24 hours on Bangladesh working days (Sunday through Thursday, 9:00 AM – 5:00 PM BST).",
  },
];

// Official social channels
const SOCIAL_CHANNELS = [
  { icon: "💼", label: "LinkedIn", url: "https://www.linkedin.com/school/pabna-university-of-science-and-technology/", color: "#0A66C2" },
  { icon: "🌐", label: "Facebook", url: "https://www.facebook.com/PUSTofficial", color: "#1877F2" },
  { icon: "𝕏", label: "X / Twitter", url: "https://twitter.com/pust_bd", color: "#0F1419" },
  { icon: "▶️", label: "YouTube", url: "https://www.youtube.com/@PUSTMedia", color: "#FF0000" },
];

export default function Contact() {
  usePageMeta(
    "Contact & Helpdesk | PUST Alumni Network",
    "Reach out to the Pabna University of Science and Technology (PUST) Alumni Affairs Directorate, track official inquiries, and access office contacts."
  );

  // Active view tab: 'submit' or 'track'
  const [activeTab, setActiveTab] = useState("submit");

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dept: "",
    type: "general",
    priority: "Normal",
    message: "",
    sendCopy: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Ticket tracking state
  const [trackingInput, setTrackingInput] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedTicket, setTrackedTicket] = useState(null);
  const [trackError, setTrackError] = useState("");

  // Directory filter state
  const [directoryFilter, setDirectoryFilter] = useState("all");

  // FAQ state
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState("all");

  // Toast feedback state
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "info" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Copy helper
  const copyToClipboard = (text, label) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`${label} copied to clipboard! ✓`);
      }).catch(() => {
        showToast(`Copied: ${text}`);
      });
    } else {
      showToast(`Copied: ${text}`);
    }
  };

  // Live Bangladesh Standard Time (BST = UTC+6) calculation
  const [currentTimeBST, setCurrentTimeBST] = useState("");
  const [isOfficeOpen, setIsOfficeOpen] = useState(false);

  useEffect(() => {
    const updateBST = () => {
      const now = new Date();
      // UTC time in ms
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      // BST is UTC + 6 hours
      const bstDate = new Date(utcMs + 6 * 3600000);

      const day = bstDate.getDay(); // 0 is Sunday, 4 is Thursday, 5 is Friday, 6 is Saturday
      const hour = bstDate.getHours();
      const minute = bstDate.getMinutes();

      // PUST working days: Sunday (0) to Thursday (4), 9:00 AM (9) to 5:00 PM (17)
      const isWorkingDay = day >= 0 && day <= 4;
      const isWorkingHours = hour >= 9 && hour < 17;
      setIsOfficeOpen(isWorkingDay && isWorkingHours);

      // Formatted time string
      const formatted = bstDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTimeBST(formatted);
    };

    updateBST();
    const interval = setInterval(updateBST, 1000);
    return () => clearInterval(interval);
  }, []);

  // Background Video & Theater Mode State (Direct Campus Short Video)
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

  // Handle Form Submission
  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast("Please fill in your name, email, and inquiry details.", "error");
      return;
    }

    setSubmitting(true);
    const trackingCode = `PUST-INQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      trackingCode,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      dept: form.dept.trim(),
      topic: form.type,
      priority: form.priority,
      subject: `[${form.priority}] ${form.type.toUpperCase()} Inquiry from ${form.name}`,
      message: form.message.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Submit to backend API
      await api.submitContact(payload);
    } catch {
      // Even if network fails, we gracefully persist to localStorage for the user
    } finally {
      // 2. Persist locally to provide instant offline and session-persistent tracking
      try {
        const stored = JSON.parse(localStorage.getItem("pust_submitted_inquiries") || "[]");
        stored.unshift({
          ...payload,
          status: "Received & Queued",
          stage: "Logged & Awaiting Officer Review",
          assignedOfficer: "Engr. M. A. Rahman (Alumni Helpdesk Officer)",
          resolutionNotes: "Inquiry received into queue. Expected review within 24 hours.",
          timeline: [
            { step: "Inquiry Received & Registered", time: "Just now", done: true },
            { step: "Triage & Desk Assignment", time: "Queued", done: false },
            { step: "Official Assessment", time: "Pending", done: false },
            { step: "Official Reply Dispatched", time: "Pending", done: false },
          ],
        });
        localStorage.setItem("pust_submitted_inquiries", JSON.stringify(stored));
      } catch {
        // ignore localStorage errors
      }

      setSubmittedTicket({
        ...payload,
        status: "Received & Queued",
        stage: "Logged & Awaiting Officer Review",
      });
      setSubmitting(false);
      showToast(`Inquiry submitted successfully! Reference: ${trackingCode}`);
    }
  };

  // Handle Inquiry Tracking Search
  const handleTrackSearch = async (codeToSearch) => {
    const raw = (codeToSearch || trackingInput).trim();
    if (!raw) {
      setTrackError("Please enter a tracking reference code or email address.");
      return;
    }

    setTrackingLoading(true);
    setTrackError("");
    setTrackedTicket(null);

    const clean = raw.toUpperCase();

    // 1. Check pre-seeded demo tickets
    if (DEMO_TICKETS[clean]) {
      setTrackedTicket(DEMO_TICKETS[clean]);
      setTrackingLoading(false);
      return;
    }

    // 2. Check backend API
    try {
      const res = await api.getContactTracking(clean);
      if (res?.ok && res.data) {
        setTrackedTicket({
          ...res.data,
          timeline: [
            { step: "Inquiry Received & Registered", time: new Date(res.data.createdAt).toLocaleDateString(), done: true },
            { step: "Triage & Desk Assignment", time: "Completed", done: true },
            { step: "Official Assessment", time: res.data.stage || "Under Review", done: res.data.status !== "unread" },
            { step: "Official Reply Dispatched", time: res.data.status === "resolved" ? "Dispatched" : "Pending", done: res.data.status === "resolved" },
          ],
        });
        setTrackingLoading(false);
        return;
      }
    } catch {
      // Backend track endpoint might 404, fall through to localStorage
    }

    // 3. Check localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("pust_submitted_inquiries") || "[]");
      const found = stored.find(
        (item) =>
          (item.trackingCode && item.trackingCode.toUpperCase() === clean) ||
          (item.email && item.email.toLowerCase() === raw.toLowerCase())
      );
      if (found) {
        setTrackedTicket(found);
        setTrackingLoading(false);
        return;
      }
    } catch {
      // ignore
    }

    setTrackError(`No record found for "${raw}". Please verify your reference number (e.g. PUST-INQ-2026-8491) or check the demo tickets.`);
    setTrackingLoading(false);
  };

  // Filtered offices directory
  const filteredOffices = useMemo(() => {
    if (directoryFilter === "all") return OFFICE_DIRECTORY;
    return OFFICE_DIRECTORY.filter((off) => off.category === directoryFilter);
  }, [directoryFilter]);

  // Filtered FAQ items
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchCat = faqCategory === "all" || item.category === faqCategory;
      const matchSearch =
        !faqSearch.trim() ||
        item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
        item.a.toLowerCase().includes(faqSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [faqSearch, faqCategory]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C]">
      {/* Toast Notification */}
      {toast.show && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold transition-all animate-bounce"
          style={{
            backgroundColor: toast.type === "error" ? "#7F1D1D" : "#17263C",
            borderColor: toast.type === "error" ? "#EF4444" : "#C7A76C",
            color: "#FFFFFF",
          }}
        >
          <span className="text-lg">{toast.type === "error" ? "⚠️" : "✓"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* =========================================================================
          1. STABLE FULL-PAGE CAMPUS REAL VIEW VIDEO HERO (Pure Video, No Black Background)
         ========================================================================= */}
      <section
        id="campus-real-view"
        data-no-reveal="true"
        aria-label="PUST Campus Tour & Contact Real View Video"
        className="relative w-full overflow-hidden flex flex-col justify-between select-none"
        style={{
          height: "calc(100vh - 116px)",
          minHeight: "520px",
          maxHeight: "860px",
        }}
      >
        {/* Ambient Auto-Player */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster="/assets/1778991184DSC05122-DR5DHwQE.jpeg"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-full h-full object-cover"
            style={{ filter: "brightness(0.96) contrast(1.05)" }}
          >
            <source src="/assets/videos/pust_contact_short.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Minimal Floating Top Controls */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 w-full flex items-center justify-between pointer-events-none">
          <a
            href="https://youtube.com/shorts/2DwK3_9Bg3w"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-red-600/85 hover:bg-red-600 border border-white/20 backdrop-blur-md transition-colors shadow-md active:scale-95"
            title="View original Short on YouTube"
          >
            <span>🎬 YouTube Short</span>
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

        {/* Center Space */}
        <div className="flex-1 pointer-events-none" />

        {/* Floating Bottom Button */}
        <div className="relative z-20 pb-5 sm:pb-7 text-center pointer-events-none flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("contact-main");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/80 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-[#C7A76C]/40 backdrop-blur-md shadow-xl transition-colors cursor-pointer active:scale-95 ring-1 ring-white/10"
          >
            <span className="text-[#DFCA9E]">💬</span>
            <span>Get in Touch with Helpdesk</span>
            <span className="text-sm text-[#DFCA9E]">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. LIVE CAMPUS OPERATIONAL STATUS & BST BANNER
         ========================================================================= */}
      <div id="contact-main" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                  isOfficeOpen ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold tracking-wide">
                    {isOfficeOpen
                      ? "Offices Open Now · Accepting Inquiries & Campus Visitors"
                      : "Offices After-Hours · Online Inquiry Queue Active"}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      isOfficeOpen
                        ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-950/70 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {isOfficeOpen ? "LIVE DESK OPEN" : "OFF-HOURS QUEUED"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Standard Operating Hours: Sunday – Thursday, 9:00 AM – 5:00 PM BST
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-base">🕒</span>
              <div className="text-right sm:text-left">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                  Campus Local BST (UTC+6)
                </p>
                <p className="font-mono font-bold text-xs sm:text-sm text-[#DFCA9E]">
                  {currentTimeBST || "Loading Clock…"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. EMERGENCY & DIRECT HOTLINE QUICK BAR
         ========================================================================= */}
      <div className="bg-[#101E31] text-white border-b border-[#0A1320] py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
            {/* Proctor Hotline */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-red-400/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-base text-red-400">🚨</span>
                <div>
                  <p className="font-bold text-[11px] text-white">Campus Security Hotline</p>
                  <p className="text-[10px] text-slate-300">Proctorial 24/7 Desk</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard("+8801711384950", "Hotline")}
                className="px-2 py-1 rounded text-[10px] font-bold bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                title="Copy Hotline Number"
              >
                +880-1711-384950
              </button>
            </div>

            {/* Directorate Desk Phone */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#DFCA9E]/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-base text-[#DFCA9E]">📞</span>
                <div>
                  <p className="font-bold text-[11px] text-white">Alumni Desk Phone</p>
                  <p className="text-[10px] text-slate-300">Direct Landline</p>
                </div>
              </div>
              <a
                href="tel:+88073165350"
                className="px-2 py-1 rounded text-[10px] font-bold bg-white/10 hover:bg-white/20 text-[#DFCA9E] border border-white/10 transition-colors"
              >
                +880-731-65350
              </a>
            </div>

            {/* WhatsApp Quick Chat */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-400/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-base text-emerald-400">💬</span>
                <div>
                  <p className="font-bold text-[11px] text-white">Direct WhatsApp Desk</p>
                  <p className="text-[10px] text-slate-300">Fast Messaging</p>
                </div>
              </div>
              <a
                href="https://wa.me/8801711384950?text=Hello%20PUST%20Alumni%20Helpdesk,%20I%20have%20an%20inquiry%20regarding%20alumni%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1"
              >
                <span>Chat Now</span>
                <span>↗</span>
              </a>
            </div>

            {/* Guaranteed SLA Response */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-base text-amber-400">⚡</span>
                <div>
                  <p className="font-bold text-[11px] text-white">Guaranteed SLA</p>
                  <p className="text-[10px] text-slate-300">&lt; 24h on Working Days</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                OFFICIAL SLA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. INSTITUTIONAL HEADER & TAB NAVIGATION
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] shadow-2xs py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="border border-[#7A1737]/20 p-2.5 mb-3.5 inline-block rounded-2xl bg-white shadow-xs">
            <img src={wa} alt="PUST" className="w-12 h-12 object-contain" />
          </div>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] mb-2 text-[#7A1737]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> · Directorate of Alumni Affairs
          </p>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#17263C] mb-3 tracking-tight">
            Institutional Helpdesk & Inquiry Portal
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
            Submit formal inquiries to campus directorates, request degree verification, or track the resolution status of your existing ticket reference.
          </p>

          {/* Dual Navigation Switcher: Submit vs Track */}
          <div className="inline-flex p-1.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] shadow-inner gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("submit")}
              className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "submit"
                  ? "bg-[#7A1737] text-white shadow-sm"
                  : "text-[#475569] hover:text-[#17263C] hover:bg-white/60"
              }`}
            >
              <span>✍️ Submit an Official Inquiry</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("track")}
              className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "track"
                  ? "bg-[#17263C] text-white shadow-sm"
                  : "text-[#475569] hover:text-[#17263C] hover:bg-white/60"
              }`}
            >
              <span>🔍 Track Existing Ticket Status</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C7A76C] text-[#17263C] font-black">
                LIVE
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. MAIN CONTENT AREA (FORM / TRACKER + SIDEBAR)
         ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Action Column (3 cols) */}
          <div className="lg:col-span-3">
            {activeTab === "submit" ? (
              /* TAB 1: SUBMIT AN OFFICIAL INQUIRY */
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
                <div className="relative overflow-hidden h-28 bg-[#17263C]">
                  <img
                    src={Ia}
                    alt="PUST"
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, rgba(23,38,60,0.5) 0%, #17263C 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-center px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-[#C7A76C]">
                          Directorate Helpdesk
                        </p>
                        <h2 className="font-serif font-bold text-white text-xl">
                          Submit an Official Inquiry
                        </h2>
                      </div>
                      <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/20">
                        Official Ticket Issued
                      </span>
                    </div>
                  </div>
                </div>

                {submittedTicket ? (
                  /* Confirmation Card View */
                  <div className="p-6 sm:p-8">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]/40 border-2 border-[#86EFAC] text-center mb-6">
                      <div className="w-14 h-14 rounded-full bg-[#15803D] text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">
                        ✓
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full">
                        Inquiry Registered Successfully
                      </span>
                      <h3 className="font-serif font-bold text-2xl text-[#17263C] mt-2 mb-1">
                        Official Ticket Reference Issued
                      </h3>
                      <p className="text-xs text-[#475569] max-w-md mx-auto mb-4">
                        Thank you, <strong className="text-[#17263C]">{submittedTicket.name}</strong>. Your inquiry has been logged into the PUST Helpdesk database and assigned to the relevant Directorate officer.
                      </p>

                      {/* Prominent Reference Number Box */}
                      <div className="bg-white border-2 border-dashed border-[#15803D]/40 rounded-xl p-4 max-w-sm mx-auto shadow-xs flex items-center justify-between gap-3">
                        <div className="text-left">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Ticket Tracking Code
                          </p>
                          <p className="font-mono font-black text-lg text-[#7A1737]">
                            {submittedTicket.trackingCode}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(submittedTicket.trackingCode, "Tracking Code")}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#17263C] text-white hover:bg-[#7A1737] transition-colors cursor-pointer"
                        >
                          Copy Code 📋
                        </button>
                      </div>

                      {/* Details summary */}
                      <div className="mt-5 pt-4 border-t border-[#86EFAC]/50 text-left text-xs space-y-1.5 text-[#334155] max-w-md mx-auto">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Contact Email:</span>
                          <span className="font-semibold text-[#17263C]">{submittedTicket.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Department / Batch:</span>
                          <span className="font-semibold text-[#17263C]">{submittedTicket.dept || "General Inquirer"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Inquiry Category:</span>
                          <span className="font-semibold text-[#17263C] capitalize">{submittedTicket.topic}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Response SLA:</span>
                          <span className="font-semibold text-[#15803D]">Within 24 Hours</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setTrackingInput(submittedTicket.trackingCode);
                          setActiveTab("track");
                          handleTrackSearch(submittedTicket.trackingCode);
                        }}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#17263C] hover:bg-[#0F1A2A] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>🔍 Track Ticket Status Now</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>🖨️ Print Ticket Slip</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittedTicket(null);
                          setForm({
                            name: "",
                            email: "",
                            phone: "",
                            dept: "",
                            type: "general",
                            priority: "Normal",
                            message: "",
                            sendCopy: true,
                          });
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#7A1737] hover:underline cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Inquiry Form */
                  <form onSubmit={handleSubmitInquiry} className="p-6 sm:p-8 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5"
                        >
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Mahfuzur Rahman"
                          required
                          className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 transition-all"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5"
                        >
                          Official / Personal Email *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="yourname@gmail.com"
                          required
                          className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5"
                        >
                          Phone / WhatsApp Number
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+880 1700-000000"
                          className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 transition-all"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-dept"
                          className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5"
                        >
                          Department / Batch (If Alumni/Student)
                        </label>
                        <input
                          id="contact-dept"
                          type="text"
                          value={form.dept}
                          onChange={(e) => setForm({ ...form, dept: e.target.value })}
                          placeholder="e.g. CSE, 12th Batch"
                          className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-type"
                          className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5"
                        >
                          Inquiry Category *
                        </label>
                        <select
                          id="contact-type"
                          value={form.type}
                          onChange={(e) => setForm({ ...form, type: e.target.value })}
                          className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] focus:bg-white focus:border-[#7A1737] transition-all cursor-pointer"
                        >
                          {INQUIRY_CATEGORIES.map((item) => (
                            <option key={item.v} value={item.v}>
                              {item.l}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="contact-priority"
                          className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5"
                        >
                          Priority Level
                        </label>
                        <select
                          id="contact-priority"
                          value={form.priority}
                          onChange={(e) => setForm({ ...form, priority: e.target.value })}
                          className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] focus:bg-white focus:border-[#7A1737] transition-all cursor-pointer font-medium"
                        >
                          <option value="Normal">Normal (Standard 24h SLA)</option>
                          <option value="High">High (Academic/Employment Deadline)</option>
                          <option value="Urgent">Urgent (Immediate Visa/Embassy Verification)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label
                          htmlFor="contact-message"
                          className="block text-[11px] font-bold uppercase tracking-wider text-[#475569]"
                        >
                          Inquiry Details *
                        </label>
                        <span className="text-[10px] text-slate-400">
                          {form.message.length} characters
                        </span>
                      </div>
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Please write the full context of your inquiry. If asking about verification or convocation, include your Student Roll, Registration Number, and Passing Year for expedited service."
                        rows={5}
                        required
                        className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 transition-all resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        id="send-copy"
                        type="checkbox"
                        checked={form.sendCopy}
                        onChange={(e) => setForm({ ...form, sendCopy: e.target.checked })}
                        className="w-4 h-4 rounded text-[#7A1737] focus:ring-[#7A1737] border-gray-300 cursor-pointer"
                      />
                      <label htmlFor="send-copy" className="text-xs text-[#475569] cursor-pointer select-none">
                        Send a confirmation copy with tracking reference to my email address
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full py-3.5 font-bold text-white text-sm rounded-xl bg-[#7A1737] hover:bg-[#62122B] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                        submitting ? "opacity-75 cursor-wait" : "active:scale-[0.99]"
                      }`}
                    >
                      {submitting ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Registering Inquiry into Helpdesk…</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Official Inquiry</span>
                          <span>→</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-[#94A3B8] text-center">
                      🔒 Official Institutional Channel · Communications are logged in accordance with PUST Data Privacy Regulations.
                    </p>
                  </form>
                )}
              </div>
            ) : (
              /* TAB 2: LIVE INQUIRY STATUS TRACKER */
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
                <div className="relative overflow-hidden h-28 bg-[#17263C]">
                  <img
                    src={za}
                    alt="PUST"
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, rgba(23,38,60,0.6) 0%, #17263C 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-center px-6">
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-[#C7A76C]">
                      Real-Time Verification
                    </p>
                    <h2 className="font-serif font-bold text-white text-xl">
                      Inquiry Status Tracker
                    </h2>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Search bar */}
                  <div className="mb-6">
                    <label
                      htmlFor="tracking-input"
                      className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-2"
                    >
                      Enter Ticket Reference Code or Email
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="tracking-input"
                        type="text"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleTrackSearch();
                        }}
                        placeholder="e.g. PUST-INQ-2026-8491"
                        className="flex-1 border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none rounded-xl bg-[#F8FAFC] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#17263C] focus:ring-1 focus:ring-[#17263C]/20 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleTrackSearch()}
                        disabled={trackingLoading}
                        className="px-6 py-2.5 rounded-xl bg-[#17263C] hover:bg-[#0F1A2A] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                      >
                        {trackingLoading ? "Searching…" : "Track →"}
                      </button>
                    </div>

                    {/* Quick Demo Test Buttons */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Try Demo Tickets:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTrackingInput("PUST-INQ-2026-8491");
                          handleTrackSearch("PUST-INQ-2026-8491");
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] font-mono border border-slate-200 transition-colors"
                      >
                        PUST-INQ-2026-8491 (Verification)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTrackingInput("PUST-INQ-2026-2305");
                          handleTrackSearch("PUST-INQ-2026-2305");
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] font-mono border border-slate-200 transition-colors"
                      >
                        PUST-INQ-2026-2305 (Convocation)
                      </button>
                    </div>

                    {trackError && (
                      <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{trackError}</span>
                      </div>
                    )}
                  </div>

                  {/* Tracked Ticket Results View */}
                  {trackedTicket && (
                    <div className="border border-[#CBD5E1] rounded-2xl p-5 sm:p-6 bg-[#F8FAFC]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Reference Tracking Number
                          </span>
                          <h3 className="font-mono font-black text-xl text-[#7A1737]">
                            {trackedTicket.trackingCode}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ● {trackedTicket.status || "In Progress"}
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                            Priority: {trackedTicket.priority || "Normal"}
                          </span>
                        </div>
                      </div>

                      {/* Ticket metadata */}
                      <div className="grid sm:grid-cols-2 gap-3 py-4 text-xs border-b border-slate-200">
                        <div>
                          <p className="text-slate-400 uppercase text-[10px] font-bold">Inquirer</p>
                          <p className="font-semibold text-[#17263C]">{trackedTicket.name}</p>
                          <p className="text-slate-500">{trackedTicket.email}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 uppercase text-[10px] font-bold">Department / Topic</p>
                          <p className="font-semibold text-[#17263C]">{trackedTicket.dept || "General Desk"}</p>
                          <p className="text-slate-500 capitalize">{trackedTicket.topic}</p>
                        </div>
                        {trackedTicket.assignedOfficer && (
                          <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-slate-200">
                            <p className="text-slate-400 uppercase text-[10px] font-bold">Assigned Desk Officer</p>
                            <p className="font-semibold text-[#17263C]">{trackedTicket.assignedOfficer}</p>
                            {trackedTicket.resolutionNotes && (
                              <p className="text-xs text-slate-600 mt-1 italic">
                                &ldquo;{trackedTicket.resolutionNotes}&rdquo;
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Interactive Visual Progress Timeline */}
                      <div className="pt-5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-4">
                          Inquiry Lifecycle Milestone
                        </p>
                        <div className="space-y-4">
                          {(trackedTicket.timeline || [
                            { step: "Inquiry Received & Registered", time: "Logged", done: true },
                            { step: "Triage & Desk Assignment", time: "Completed", done: true },
                            { step: "Official Assessment", time: "Under Review", done: true },
                            { step: "Official Reply Dispatched", time: "Pending", done: false },
                          ]).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-xs">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                                  item.done
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "bg-slate-200 text-slate-500"
                                }`}
                              >
                                {item.done ? "✓" : idx + 1}
                              </div>
                              <div className="flex-1">
                                <p className={`font-semibold ${item.done ? "text-[#17263C]" : "text-slate-500"}`}>
                                  {item.step}
                                </p>
                                <p className="text-[10px] text-slate-400">{item.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Institutional Sidebar (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Campus Directions & Map Card */}
            <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-xs overflow-hidden">
              <div
                className="relative overflow-hidden h-36 bg-[#17263C]"
              >
                <img src={Ra} alt="PUST Campus" className="w-full h-full object-cover opacity-35" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17263C] via-[#17263C]/60 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#DFCA9E]">
                    Campus Directions
                  </span>
                  <h3 className="font-bold text-white text-sm">
                    Pabna University of Science & Technology
                  </h3>
                  <p className="text-[11px] text-slate-300">Rajapur, Pabna-6600, Bangladesh</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="text-xs text-[#475569] space-y-1.5">
                  <p className="flex items-start gap-2">
                    <span className="text-sm">🚌</span>
                    <span><strong>By Bus:</strong> Direct inter-district AC/Non-AC coaches from Dhaka (Gabtoli/Kalyanpur) halt directly at PUST Main Gate, Rajapur.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-sm">🚂</span>
                    <span><strong>By Train:</strong> Dhaka Kamalapur to Ishwardi Bypass / Pabna Rail Station, followed by a 15-min auto-rickshaw commute to campus.</span>
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=Pabna+University+of+Science+and+Technology"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-lg bg-[#17263C] hover:bg-[#0F1A2A] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>📍 Open Campus Navigation in Google Maps</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Official Helpdesk Hours */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#7A1737]">
                  Directorate Working Schedule
                </p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isOfficeOpen ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {isOfficeOpen ? "OPEN NOW" : "CLOSED NOW"}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { d: "Sunday – Thursday", t: "9:00 AM – 5:00 PM BST", status: "Active" },
                  { d: "Friday", t: "Closed (Weekend)", status: "Closed" },
                  { d: "Saturday", t: "Closed (Weekend)", status: "Closed" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-[#F1F5F9] last:border-b-0"
                  >
                    <span className="font-medium text-[#475569]">{item.d}</span>
                    <span
                      className={`font-bold ${
                        item.status === "Closed" ? "text-rose-600" : "text-emerald-700"
                      }`}
                    >
                      {item.t}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-3 italic">
                * Online inquiry ticket submissions remain open 24/7. Inquiries submitted over weekends are addressed first thing on Sunday morning.
              </p>
            </div>

            {/* Official Digital Channels */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#7A1737] mb-3">
                Official Media Channels
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SOCIAL_CHANNELS.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold border border-[#E2E8F0] rounded-xl transition-all hover:border-[#7A1737]/40 hover:bg-[#F8FAFC] text-[#475569] hover:text-[#17263C]"
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          6. INTERACTIVE ON-CAMPUS DIRECTORATE DIRECTORY
         ========================================================================= */}
      <section className="py-14 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#7A1737]">
              Campus Directorate Directory
            </p>
            <h2
              className="font-serif font-bold text-[#17263C]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}
            >
              Direct Office Contacts & Liaison Desks
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl mx-auto">
              Find office locations, room coordinates, direct telephone extensions, and authorized emails for key university departments.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[
                { id: "all", label: "All Directorates" },
                { id: "alumni", label: "Alumni & Welfare" },
                { id: "academic", label: "Registrar & Academic" },
                { id: "emergency", label: "Security & Emergency" },
                { id: "tech", label: "ICT & Technical" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setDirectoryFilter(pill.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    directoryFilter === pill.id
                      ? "bg-[#7A1737] text-white shadow-xs"
                      : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffices.map((office) => (
              <div
                key={office.id}
                className="group overflow-hidden rounded-2xl border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-lg transition-all bg-[#F8FAFC] flex flex-col justify-between"
              >
                <div>
                  <div className="relative overflow-hidden h-28 bg-[#17263C]">
                    <img
                      src={office.img}
                      alt={office.title}
                      className="w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(180deg, rgba(23,38,60,0.4) 0%, #17263C 100%)",
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-[#DFCA9E] backdrop-blur-xs border border-white/20">
                        {office.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-3 text-2xl">
                      {office.icon}
                    </div>
                  </div>

                  <div className="p-5 bg-white border-t border-[#E2E8F0]">
                    <h3 className="font-bold text-[#17263C] text-base leading-snug mb-1">
                      {office.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#7A1737] mb-2">
                      {office.role}
                    </p>
                    <p className="text-xs text-[#475569] leading-relaxed mb-3 whitespace-pre-line">
                      {office.addr}
                    </p>

                    <div className="space-y-1.5 text-xs pt-2 border-t border-[#F1F5F9]">
                      <div className="flex items-center justify-between">
                        <a
                          href={`mailto:${office.email}`}
                          className="font-semibold text-[#7A1737] hover:underline truncate mr-2"
                        >
                          {office.email}
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(office.email, "Email")}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <a
                          href={`tel:${office.phone.replace(/[^0-9+]/g, "")}`}
                          className="font-medium text-[#475569] hover:text-[#17263C]"
                        >
                          {office.phone}
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(office.phone, "Phone")}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>

                      <p className="text-[11px] text-[#64748B] pt-1 flex items-center gap-1">
                        <span>🕒</span>
                        <span>{office.hours}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex gap-2">
                  <a
                    href={`mailto:${office.email}`}
                    className="flex-1 py-1.5 rounded-lg text-center text-xs font-bold bg-[#17263C] text-white hover:bg-[#7A1737] transition-colors"
                  >
                    Direct Email ✉️
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        type: office.category === "academic" ? "verification" : "general",
                        message: `[Inquiry for ${office.title}]\n`,
                      }));
                      setActiveTab("submit");
                      const el = document.getElementById("contact-main");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#CBD5E1] bg-white hover:bg-slate-100 text-[#334155] transition-colors cursor-pointer"
                    title="Pre-fill inquiry form for this directorate"
                  >
                    Inquire ↗
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FREQUENTLY ASKED QUESTIONS (SEARCHABLE ACCORDION)
         ========================================================================= */}
      <section className="py-14 bg-[#F4F5F7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#7A1737]">
              Help & Answers
            </p>
            <h2
              className="font-serif font-bold text-[#17263C]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-1">
              Instant answers regarding degree authentication, alumni cards, convocation, and chapters
            </p>

            {/* Search Input for FAQs */}
            <div className="mt-5 max-w-md mx-auto">
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search queries (e.g. verification, convocation, alumni card)..."
                className="w-full border border-[#CBD5E1] px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white text-[#17263C] outline-none shadow-2xs focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {[
                { id: "all", label: "All Questions" },
                { id: "verification", label: "Degree & Verification" },
                { id: "convocation", label: "Convocation" },
                { id: "idcard", label: "Alumni ID Card" },
                { id: "membership", label: "Global Chapters" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setFaqCategory(pill.id)}
                  className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                    faqCategory === pill.id
                      ? "bg-[#17263C] text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-[#17263C]">
                      {item.q}
                    </span>
                    <span
                      className="text-xl font-light text-[#7A1737] shrink-0"
                      style={{
                        transform: activeFaqIndex === idx ? "rotate(45deg)" : "none",
                        transition: "transform 0.2s",
                      }}
                    >
                      +
                    </span>
                  </button>
                  {activeFaqIndex === idx && (
                    <div className="px-5 pb-5 pt-3 border-t border-[#F1F5F9] bg-[#F8FAFC]">
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-sm font-semibold text-slate-600">No matching questions found.</p>
                <button
                  type="button"
                  onClick={() => {
                    setFaqSearch("");
                    setFaqCategory("all");
                  }}
                  className="mt-2 text-xs text-[#7A1737] font-bold hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. INSTITUTIONAL CTA
         ========================================================================= */}
      <div
        className="relative overflow-hidden border-t border-[#0F1A2A]"
        style={{
          background: "#17263C",
          minHeight: 220,
        }}
      >
        <img
          src={Qa}
          alt="PUST"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-15"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(23,38,60,0.85) 0%, rgba(23,38,60,0.98) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-12 py-12 max-w-5xl mx-auto">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-2 text-[#C7A76C]">
              PUST Alumni Network
            </p>
            <h2 className="font-serif font-bold text-white text-2xl sm:text-3xl mb-2">
              Ready to Connect with Fellow Graduates?
            </h2>
            <p className="text-xs sm:text-sm max-w-md text-[#CBD5E1] leading-relaxed">
              Register free to join the official alumni directory, access career mentorship, participate in chapter reunions, and expand your professional circle.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
            <Link
              to="/register"
              className="text-xs sm:text-sm font-semibold text-white px-7 py-3 text-center rounded-xl bg-[#7A1737] hover:bg-[#62122B] transition-all shadow-sm active:scale-95"
            >
              Join Network Free →
            </Link>
            <Link
              to="/directory"
              className="text-xs sm:text-sm font-medium text-white px-7 py-3 text-center rounded-xl border border-white/25 hover:bg-white/10 transition-colors"
            >
              Search Alumni Directory
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          9. FULL-SCREEN THEATER MODE CINEMA OVERLAY MODAL
         ========================================================================= */}
      {isTheaterMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Theater Mode Campus Video Player"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-6"
          onClick={() => setIsTheaterMode(false)}
        >
          <div className="flex items-center justify-between pb-3 sm:pb-4 text-white max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  Pabna University of Science and Technology · Campus Tour Short
                </h3>
                <p className="text-xs text-slate-400">
                  Campus Walkthrough & Tour Reel · Press ESC to exit
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://youtube.com/shorts/2DwK3_9Bg3w"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-3.5 py-1.5 rounded-full bg-red-600/90 hover:bg-red-600 text-xs font-semibold text-white transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>🎬 Open Short</span>
                <span className="text-[10px]">↗</span>
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
            className="flex-1 w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl relative flex items-center justify-center bg-black/40 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src="/assets/videos/pust_contact_short.mp4"
              controls
              autoPlay
              playsInline
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
