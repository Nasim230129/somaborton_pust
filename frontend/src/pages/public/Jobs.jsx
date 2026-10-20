import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  va as initialJobs,
  Ia,
  La,
  Ra,
  za,
  Ba,
  Va,
  Ha,
  Ka,
  Wa,
  Xa,
  qa,
  Ja,
  Qa,
} from "../../data/mockData";
import { api, useBackendSync, getCurrentUser } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";

// Additional curated career openings across diverse PUST departments
const curatedJobs = [
  {
    id: 6,
    title: "Civil Infrastructure Engineer",
    company: "Max Group Bangladesh",
    logo: "🏗️",
    location: "Rooppur, Pabna",
    type: "Full-time",
    salary: "৳ 45,000–65,000/mo",
    dept: "CE",
    posted: "3 days ago",
    deadline: "Nov 05, 2026",
    skills: ["AutoCAD", "Structural Analysis", "Project Supervision"],
    applicants: 34,
    postedBy: "Engr. Zahid Hasan (Alumni)",
    remote: false,
    desc: "Overseeing mega structural construction projects near the greater Pabna and northern region.",
  },
  {
    id: 7,
    title: "Quality Assurance Pharmacist",
    company: "Square Pharmaceuticals",
    logo: "💊",
    location: "Pabna Plant, Bangladesh",
    type: "Full-time",
    salary: "৳ 42,000–58,000/mo",
    dept: "PHARM",
    posted: "4 days ago",
    deadline: "Nov 12, 2026",
    skills: ["HPLC", "GMP Compliance", "QA Inspection"],
    applicants: 41,
    postedBy: "Nazmun Nahar (Alumni)",
    remote: false,
    desc: "Quality compliance and chemical analysis for export-grade pharmaceutical formulations.",
  },
  {
    id: 8,
    title: "Machine Learning Research Intern",
    company: "Samsung R&D Institute",
    logo: "🤖",
    location: "Dhaka, Bangladesh",
    type: "Internship",
    salary: "৳ 25,000/mo",
    dept: "CSE/ICE",
    posted: "1 day ago",
    deadline: "Oct 28, 2026",
    skills: ["PyTorch", "Computer Vision", "NLP"],
    applicants: 58,
    postedBy: "Dr. Rafiqul Islam (Alumni)",
    remote: true,
    desc: "6-month research internship focusing on edge computing algorithms and multimodal AI.",
  },
];

const JOB_TYPES = ["All", "Full-time", "Internship", "Remote"];
const DEPARTMENTS = [
  "All Departments",
  "CSE",
  "EEE",
  "CE",
  "PHARM",
  "MATH",
  "CHEM/PHY",
  "BBA",
];

const CAMPUS_BACKGROUNDS = [Ia, La, Ra, za, Ba, Va, Ha, Ka, Wa, Xa, qa, Ja, Qa];

export default function Jobs() {
  useBackendSync();
  usePageMeta(
    "Jobs & Opportunities",
    "Explore career openings, tech jobs, and internships posted and referred by PUST alumni and partner corporations worldwide."
  );

  const location = useLocation();

  const getInitialSearchQuery = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(location.search || window.location.search);
    return params.get("search") || params.get("q") || "";
  };

  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // "newest", "salary", "applicants"
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  const POPULAR_SEARCHES = [
    "Software Engineer",
    "Data Analyst",
    "Civil Engineer",
    "Management Trainee",
    "Remote",
    "Internship",
  ];

  const handlePopularSearch = (term) => {
    if (term === "Remote") {
      setRemoteOnly(true);
      setSelectedType("Remote");
    } else if (term === "Internship") {
      setSelectedType("Internship");
    } else {
      setSearchQuery(term);
    }
  };

  const handleShareJob = (job) => {
    if (!job) return;
    const url = `${window.location.origin}/jobs?search=${encodeURIComponent(job.title)}`;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => showToast("সার্কুলার লিংক সফলভাবে কপি করা হয়েছে!"))
        .catch(() => showToast("সার্কুলার লিংক: " + url));
    } else {
      showToast("সার্কুলার লিংক কপি করা হয়েছে!");
    }
  };

  const handleSubscribeAlert = () => {
    showToast(`সফলভাবে ${selectedJob?.dept || "আপনার বিভাগের"} জব অ্যালার্টে সাবস্ক্রাইব করা হয়েছে!`);
  };

  // Combined jobs list
  const [jobList, setJobList] = useState(() => {
    return [
      ...initialJobs,
      ...curatedJobs.filter((c) => !initialJobs.some((j) => j.id === c.id)),
    ];
  });

  // Selected job for master-detail view
  const [selectedJob, setSelectedJob] = useState(jobList[0] || initialJobs[0]);

  // Track user applied and saved jobs
  const [appliedJobIds, setAppliedJobIds] = useState(() => [1]);
  const [savedJobIds, setSavedJobIds] = useState([]);

  // Modals & Drawers
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplySuccess, setIsApplySuccess] = useState(false);
  const [applicationRefCode, setApplicationRefCode] = useState("");
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [postJobSuccess, setPostJobSuccess] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Background Video State (User's YouTube Video: -5wJ9pJebvM)
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const iframe = document.getElementById("youtube-bg-iframe");
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
  };

  const handleFullscreenCinema = () => {
    const iframe = document.getElementById("youtube-bg-iframe");
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

  // Application form data
  const [applyForm, setApplyForm] = useState({
    name: "",
    email: "",
    phone: "",
    dept: "",
    batch: "",
    portfolioUrl: "",
    coverNote: "",
  });

  // Post Job form data
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    company: "",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    dept: "CSE",
    salary: "৳ 40,000–60,000/mo",
    deadline: "Nov 30, 2026",
    skills: "React, Node.js, SQL",
    remote: false,
    desc: "",
  });

  // Prefill logged-in user profile info
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setApplyForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        dept: user.dept || prev.dept,
        batch: user.batch ? String(user.batch) : prev.batch,
        phone: user.phone || prev.phone,
      }));
    }
  }, []);

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

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    let list = jobList.filter((job) => {
      if (selectedType === "Remote" && !job.remote) return false;
      if (selectedType === "Full-time" && job.type !== "Full-time") return false;
      if (selectedType === "Internship" && job.type !== "Internship") return false;

      if (remoteOnly && !job.remote) return false;

      if (selectedDept !== "All Departments") {
        const d = (job.dept || "").toLowerCase();
        if (!d.includes(selectedDept.toLowerCase())) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (job.title || "").toLowerCase().includes(q);
        const matchCompany = (job.company || "").toLowerCase().includes(q);
        const matchLoc = (job.location || "").toLowerCase().includes(q);
        const matchDept = (job.dept || "").toLowerCase().includes(q);
        const matchDesc = (job.desc || "").toLowerCase().includes(q);
        const matchSkills =
          Array.isArray(job.skills) && job.skills.some((s) => s.toLowerCase().includes(q));

        if (!matchTitle && !matchCompany && !matchLoc && !matchDept && !matchDesc && !matchSkills) {
          return false;
        }
      }

      return true;
    });

    if (sortBy === "applicants") {
      list = [...list].sort((a, b) => (b.applicants || 0) - (a.applicants || 0));
    } else if (sortBy === "salary") {
      list = [...list].sort((a, b) => {
        const numA = parseInt(String(a.salary).replace(/[^0-9]/g, "") || "0", 10);
        const numB = parseInt(String(b.salary).replace(/[^0-9]/g, "") || "0", 10);
        return numB - numA;
      });
    }

    return list;
  }, [jobList, selectedType, selectedDept, remoteOnly, searchQuery, sortBy]);

  // Keep selectedJob valid
  useEffect(() => {
    if (filteredJobs.length > 0 && !filteredJobs.some((j) => j.id === selectedJob?.id)) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [filteredJobs, selectedJob]);

  // Toggle Save Job
  const handleToggleSave = (jobId) => {
    setSavedJobIds((prev) => {
      const isSaved = prev.includes(jobId);
      const next = isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      showToast(isSaved ? "বুকমার্ক থেকে সরানো হয়েছে" : "সুযোগটি সফলভাবে বুকমার্কে সেভ করা হয়েছে!");
      return next;
    });
  };

  // Open Application Modal
  const handleOpenApplyModal = (job, e) => {
    if (e) e.stopPropagation();
    setSelectedJob(job);
    setIsApplySuccess(false);
    setIsApplyModalOpen(true);
  };

  // Submit Application Form
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    api.applyJob(selectedJob.id, applyForm);
    setAppliedJobIds((prev) => (prev.includes(selectedJob.id) ? prev : [...prev, selectedJob.id]));

    const refCode = `PUST-JOB-${selectedJob.id}-${Math.floor(1000 + Math.random() * 9000)}`;
    setApplicationRefCode(refCode);
    setIsApplySuccess(true);
  };

  // Submit New Job Post Form
  const handlePostJobSubmit = (e) => {
    e.preventDefault();
    if (!newJobForm.title.trim() || !newJobForm.company.trim()) return;

    const user = getCurrentUser();
    const newEntry = {
      id: Date.now(),
      title: newJobForm.title.trim(),
      company: newJobForm.company.trim(),
      logo: "💼",
      location: newJobForm.location.trim(),
      type: newJobForm.type,
      dept: newJobForm.dept,
      salary: newJobForm.salary.trim(),
      posted: "Just now",
      deadline: newJobForm.deadline.trim(),
      skills: newJobForm.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      applicants: 1,
      postedBy: user ? `${user.name} (Alumni)` : "Alumni Network Member",
      remote: newJobForm.remote,
      desc: newJobForm.desc.trim() || "Exciting opening for PUST graduates and students.",
    };

    setJobList([newEntry, ...jobList]);
    setSelectedJob(newEntry);
    setPostJobSuccess(true);

    setTimeout(() => {
      setIsPostJobModalOpen(false);
      setPostJobSuccess(false);
      setNewJobForm({
        title: "",
        company: "",
        location: "Dhaka, Bangladesh",
        type: "Full-time",
        dept: "CSE",
        salary: "৳ 40,000–60,000/mo",
        deadline: "Nov 30, 2026",
        skills: "React, Node.js, SQL",
        remote: false,
        desc: "",
      });
    }, 2200);
  };

  const selectedIndex = Math.max(
    0,
    jobList.findIndex((j) => j.id === selectedJob?.id)
  );
  const detailBackdrop = CAMPUS_BACKGROUNDS[selectedIndex % CAMPUS_BACKGROUNDS.length];
  const isSelectedSaved = selectedJob ? savedJobIds.includes(selectedJob.id) : false;
  const isSelectedApplied = selectedJob ? appliedJobIds.includes(selectedJob.id) : false;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#475569] overflow-x-hidden w-full">
      {/* =========================================
          1. STABLE FULL-PAGE CAMPUS DRONE VIDEO HERO
      ========================================= */}
      <section
        id="campus-real-view"
        data-no-reveal="true"
        aria-label="PUST Campus Drone Tour"
        className="relative w-full overflow-hidden bg-black flex flex-col justify-between select-none"
        style={{
          height: "calc(100vh - 116px)",
          minHeight: "520px",
          maxHeight: "860px",
        }}
      >
        {/* Ambient Auto-Player (No YouTube Player UI, Pure Edge-to-Edge Auto Loop) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
          <iframe
            id="youtube-bg-iframe"
            src="https://www.youtube.com/embed/-5wJ9pJebvM?autoplay=1&mute=1&controls=0&loop=1&playlist=-5wJ9pJebvM&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1"
            title="Pabna University of Science and Technology Drone Shoot"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-none select-none"
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

        {/* Minimal Floating Top Controls (No Bengali text on video) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 w-full flex items-center justify-end pointer-events-none">
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

        {/* Unobstructed Center View */}
        <div className="flex-1 pointer-events-none" />

        {/* Floating Bottom Button to Smoothly Scroll to Jobs (Clean English, No Bengali text) */}
        <div className="relative z-10 pb-5 sm:pb-7 text-center pointer-events-none flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("jobs-board");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/80 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-[#C7A76C]/40 backdrop-blur-md shadow-xl transition-colors cursor-pointer active:scale-95 ring-1 ring-white/10"
          >
            <span className="text-[#DFCA9E]">💼</span>
            <span>Explore Opportunities</span>
            <span className="text-sm text-[#DFCA9E]">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================
          2. CAREER ECOSYSTEM STATS & QUICK METRICS
      ========================================= */}
      <div id="jobs-board" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-2 sm:pt-0 sm:px-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] mb-0.5">
                সক্রিয় সার্কুলার
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl sm:text-3xl text-white">১২০+</span>
                <span className="text-xs text-emerald-400 font-semibold">লাইভ ওপেনিং</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">ফুল-টাইম ও ইন্টার্নশিপ সুযোগ</p>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] mb-0.5">
                পার্টনার প্রতিষ্ঠান
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl sm:text-3xl text-white">৫০+</span>
                <span className="text-xs text-sky-400 font-semibold">শীর্ষ কোম্পানি</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">মাল্টিন্যাশনাল, টেক ও ব্যাংক</p>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] mb-0.5">
                গড় মাসিক বেতন
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-xl sm:text-2xl text-white">৳ ৫০K-১.৫L</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">আকর্ষণীয় সুযোগ-সুবিধা ও বোনাস</p>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] mb-0.5">
                অ্যালামনাই রেফারেল
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl sm:text-3xl text-white">৯২%</span>
                <span className="text-xs text-[#DFCA9E] font-semibold">সরাসরি ব্যাকড</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">অগ্রাধিকার ভিত্তিক ইন্টারভিউ</p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          3. JOBS HEADER & SEARCH BAR
      ========================================= */}
      <div className="bg-white border-b border-[#E2E8F0] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C7A76C] mb-1 font-semibold">
                PUST Alumni Network · Career Ecosystem
              </p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#17263C]">
                Jobs & Career Opportunities
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় অ্যালামনাই ও কর্পোরেট পার্টনারদের এক্সক্লুসিভ ক্যারিয়ার সার্কুলার।
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPostJobModalOpen(true)}
                className="self-start md:self-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-2 active:scale-95"
              >
                <span>+ Post a Job Opening</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={(ev) => ev.preventDefault()}
            className="w-full flex items-center bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0] focus-within:border-[#7A1737] focus-within:ring-2 focus-within:ring-[#7A1737]/20 gap-2 transition-all shadow-2xs"
          >
            <div className="w-10 h-10 rounded-lg bg-white text-[#17263C] flex items-center justify-center font-bold text-base flex-shrink-0 border border-[#E2E8F0]">
              💼
            </div>
            <input
              type="text"
              placeholder="পজিশন, কোম্পানি, দক্ষতা (React, Python), বিভাগ (CSE, EEE) বা লোকেশন দিয়ে খুঁজুন…"
              aria-label="Search career openings"
              value={searchQuery}
              onChange={(ev) => setSearchQuery(ev.target.value)}
              className="flex-1 px-2 py-2 text-sm sm:text-base text-[#17263C] outline-none bg-transparent font-normal placeholder-[#94A3B8]"
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
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold flex-shrink-0 rounded-lg bg-[#7A1737] hover:bg-[#60122B] text-white transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Popular Search Chips */}
          <div className="mt-3.5 flex items-center gap-2 flex-wrap text-xs text-[#64748B]">
            <span className="font-semibold text-[#17263C]">জনপ্রিয় অনুসন্ধান:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handlePopularSearch(term)}
                className="px-2.5 py-1 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] hover:text-[#7A1737] text-[#475569] text-[11px] font-medium transition-colors cursor-pointer border border-[#E2E8F0]"
              >
                {term}
              </button>
            ))}
          </div>

          {searchQuery && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#64748B]">
              <span>
                Found <strong className="text-[#17263C]">{filteredJobs.length}</strong> opportunities matching{" "}
                <strong className="text-[#17263C]">"{searchQuery}"</strong>
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="underline hover:text-[#17263C] font-medium text-[#7A1737] ml-1 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          4. FILTER BAR WITH TYPE TABS, DEPT & SORTING
      ========================================= */}
      <section className="bg-white border-b border-[#E2E8F0] sticky top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedType === type
                    ? "bg-[#7A1737] text-white shadow-2xs"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#17263C]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 ml-auto flex-wrap">
            {/* Department Filter Dropdown */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#17263C] outline-none focus:border-[#7A1737] cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#17263C] outline-none focus:border-[#7A1737] cursor-pointer"
            >
              <option value="newest">🕒 নতুন সার্কুলার</option>
              <option value="salary">💰 সর্বোচ্চ বেতন</option>
              <option value="applicants">👥 সর্বোচ্চ আবেদনকারী</option>
            </select>

            {/* Remote Filter Checkbox */}
            <label className="flex items-center gap-1.5 text-xs text-[#475569] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="rounded border-[#E2E8F0] text-[#7A1737] focus:ring-[#7A1737]"
              />
              <span>Remote Only</span>
            </label>

            <span className="text-xs text-[#64748B] hidden lg:inline pl-2 border-l border-[#E2E8F0]">
              Showing <strong className="text-[#17263C]">{filteredJobs.length}</strong> positions
            </span>
          </div>
        </div>
      </section>

      {/* =========================================
          5. MASTER-DETAIL TWO-PANE MAIN BOARD
      ========================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-6 items-start">
        {/* LEFT COLUMN: LIST OF CARDS */}
        <div className="w-full lg:w-[380px] flex-shrink-0 space-y-3 reveal-left">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
              <p className="text-4xl mb-3 text-[#94A3B8]">💼</p>
              <p className="font-semibold text-[#17263C] text-sm">No job openings found</p>
              <p className="text-xs mt-1 text-[#64748B]">
                Try adjusting your search terms, work mode, or department filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("All");
                  setSelectedDept("All Departments");
                  setRemoteOnly(false);
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-[#7A1737] text-white hover:bg-[#62122B] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              const isApplied = appliedJobIds.includes(job.id);
              const isSaved = savedJobIds.includes(job.id);

              return (
                <article
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setMobileDrawerOpen(true);
                  }}
                  className={`w-full text-left rounded-xl transition-all duration-200 cursor-pointer overflow-hidden bg-white border ${
                    isSelected
                      ? "border-[#7A1737] border-l-4 border-l-[#7A1737] ring-1 ring-[#7A1737]/20 shadow-md bg-[#FFFDFC]"
                      : "border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-xs"
                  }`}
                >
                  <div className="p-4 sm:p-5">
                    {/* Header Row */}
                    <div className="flex items-start gap-3 mb-2.5">
                      <div className="w-11 h-11 flex items-center justify-center text-xl flex-shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-2xs">
                        {job.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-sm leading-snug text-[#17263C] hover:text-[#7A1737] transition-colors truncate">
                          {job.title}
                        </h3>
                        <p className="text-xs font-medium text-[#64748B] truncate mt-0.5">
                          {job.company} · 📍 {job.location}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(job.id);
                        }}
                        className={`text-xs p-1 rounded-md transition-colors ${
                          isSaved ? "text-[#7A1737]" : "text-[#94A3B8] hover:text-[#17263C]"
                        }`}
                        title={isSaved ? "Saved" : "Save opportunity"}
                      >
                        {isSaved ? "💾" : "🔖"}
                      </button>
                    </div>

                    {/* Salary & Posted Date */}
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-xs font-bold text-[#7A1737]">{job.salary}</p>
                      <p className="text-[10px] text-[#64748B]">{job.posted}</p>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {(job.skills || []).slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-[9px] font-medium px-2 py-0.5 rounded bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
                        >
                          {skill}
                        </span>
                      ))}
                      {(job.skills || []).length > 3 && (
                        <span className="text-[9px] text-[#94A3B8] self-center">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#E2E8F0] text-[10px] text-[#64748B]">
                      <div className="flex items-center gap-2">
                        <span>👥 {job.applicants} applicants</span>
                        {job.remote && (
                          <span className="font-semibold text-[#7A1737] bg-[#7A1737]/10 px-1.5 py-0.5 rounded">
                            Remote
                          </span>
                        )}
                      </div>
                      {isApplied && (
                        <span className="font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                          ✓ Applied
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: DESKTOP STICKY DETAIL VIEW */}
        <div className="flex-1 hidden lg:block sticky top-[86px] reveal-right">
          {selectedJob ? (
            <div className="rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] shadow-sm">
              {/* Header Banner */}
              <div
                className="relative overflow-hidden p-7 text-white"
                style={{
                  background: "#17263C",
                  minHeight: 180,
                }}
              >
                <img
                  src={detailBackdrop}
                  alt={selectedJob.company}
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(23,38,60,0.6) 0%, rgba(23,38,60,0.95) 100%)",
                  }}
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center text-3xl flex-shrink-0 bg-white border border-[#E2E8F0] rounded-2xl shadow-md">
                      {selectedJob.logo}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block mb-1">
                        {selectedJob.type} · {selectedJob.dept}
                      </span>
                      <h2 className="font-display font-bold text-xl sm:text-2xl text-white leading-tight">
                        {selectedJob.title}
                      </h2>
                      <p className="text-sm text-[#E2E8F0] mt-0.5">
                        {selectedJob.company} · 📍 {selectedJob.location}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleSave(selectedJob.id)}
                    className="flex-shrink-0 px-4 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-2xs"
                  >
                    {isSelectedSaved ? "💾 Saved" : "🔖 Save"}
                  </button>
                </div>
              </div>

              {/* Quick Metadata Pill Strip */}
              <div className="px-7 py-3.5 flex flex-wrap gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <span className="text-xs font-medium px-3 py-1 rounded-lg bg-white text-[#475569] border border-[#E2E8F0]">
                  📍 {selectedJob.location}
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-lg bg-white text-[#475569] border border-[#E2E8F0]">
                  💼 {selectedJob.type}
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-lg bg-white text-[#475569] border border-[#E2E8F0]">
                  ⏱ Deadline: {selectedJob.deadline}
                </span>
                {selectedJob.remote && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#7A1737]/10 text-[#7A1737] border border-[#7A1737]/20">
                    🌐 Remote Eligible
                  </span>
                )}
              </div>

              {/* Highlight Numbers Strip */}
              <div className="grid grid-cols-3 divide-x divide-[#E2E8F0] border-b border-[#E2E8F0]">
                <div className="text-center py-4">
                  <p className="font-display font-bold text-base leading-none text-[#7A1737]">
                    {selectedJob.salary}
                  </p>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1 font-semibold">
                    Monthly Compensation
                  </p>
                </div>
                <div className="text-center py-4">
                  <p className="font-display font-bold text-base leading-none text-[#17263C]">
                    {selectedJob.applicants}
                  </p>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1 font-semibold">
                    Applicants
                  </p>
                </div>
                <div className="text-center py-4">
                  <p className="font-display font-bold text-base leading-none text-[#17263C]">
                    {selectedJob.dept}
                  </p>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1 font-semibold">
                    Target Faculty / Dept
                  </p>
                </div>
              </div>

              {/* Main Job Body */}
              <div className="p-7 space-y-6">
                <div>
                  <h3 className="font-bold text-[#17263C] text-sm mb-2 uppercase tracking-wide text-xs">
                    About this Opportunity
                  </h3>
                  <p className="text-sm leading-relaxed text-[#475569]">{selectedJob.desc}</p>
                </div>

                <div>
                  <h3 className="font-bold text-[#17263C] text-sm mb-2.5 uppercase tracking-wide text-xs">
                    Required Skills & Competencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedJob.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#F8FAFC] text-[#17263C] border border-[#E2E8F0]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Alumni Referral Spotlight Box */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-2xl flex-shrink-0">🎓</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#17263C] mb-0.5">
                      PUST Alumni Referral Backing
                    </p>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Posted by{" "}
                      <strong className="text-[#17263C]">{selectedJob.postedBy}</strong>. Alumni
                      applicants receive prioritized internal CV evaluation.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0] flex-wrap">
                  <button
                    onClick={(e) => handleOpenApplyModal(selectedJob, e)}
                    className={`flex-1 min-w-[170px] py-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer shadow-xs ${
                      isSelectedApplied
                        ? "bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]"
                        : "bg-[#7A1737] hover:bg-[#62122B] text-white active:scale-95"
                    }`}
                  >
                    {isSelectedApplied ? "✓ Applied Successfully" : "Apply for Position →"}
                  </button>

                  <Link
                    to="/mentorship"
                    className="px-4 py-3 text-xs sm:text-sm font-semibold rounded-lg bg-white hover:bg-[#F8FAFC] text-[#17263C] border border-[#E2E8F0] transition-colors cursor-pointer text-center"
                  >
                    Request Referral
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleShareJob(selectedJob)}
                    className="px-3.5 py-3 text-xs font-semibold rounded-lg bg-white hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#17263C] border border-[#E2E8F0] transition-colors cursor-pointer"
                    title="Share this opportunity"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E2E8F0] text-[#64748B]">
              Select an opportunity from the list to view full specifications.
            </div>
          )}

          {/* Job Alert Subscriptions Box */}
          <div className="mt-4 flex items-center gap-4 p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
            <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              🔔
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#17263C]">Career Notification Alert</p>
              <p className="text-[11px] text-[#64748B]">
                Receive email dispatches when opportunities matching {selectedJob?.dept || "your faculty"} are posted.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSubscribeAlert}
              className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-lg bg-[#7A1737] hover:bg-[#62122B] text-white cursor-pointer shadow-2xs active:scale-95"
            >
              Subscribe
            </button>
          </div>
        </div>
      </main>

      {/* 5. MOBILE DETAILS DRAWER MODAL */}
      {mobileDrawerOpen && selectedJob && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden flex items-end justify-center bg-black/60 backdrop-blur-xs p-0"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="bg-white border border-[#E2E8F0] w-full max-h-[85vh] overflow-y-auto rounded-t-2xl shadow-2xl flex flex-col"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white border-b border-[#E2E8F0] px-5 py-3.5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17263C]">
                Opportunity Overview
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#17263C] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  {selectedJob.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-base text-[#17263C] leading-snug">
                    {selectedJob.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {selectedJob.company} · 📍 {selectedJob.location}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-[#F8FAFC] font-bold text-[#7A1737] border border-[#E2E8F0]">
                  {selectedJob.salary}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]">
                  {selectedJob.type}
                </span>
                {selectedJob.remote && (
                  <span className="px-2.5 py-1 rounded-md bg-[#7A1737]/10 text-[#7A1737] font-semibold border border-[#7A1737]/20">
                    Remote
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                  Deadline: {selectedJob.deadline}
                </span>
              </div>

              <div className="text-xs text-[#475569] leading-relaxed pt-3 border-t border-[#E2E8F0]">
                <p className="font-bold text-[#17263C] mb-1">Description:</p>
                <p>{selectedJob.desc}</p>
              </div>

              <div className="text-xs pt-3 border-t border-[#E2E8F0]">
                <p className="font-bold text-[#17263C] mb-1.5">Required Skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedJob.skills || []).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B]">
                <strong className="text-[#17263C]">Referral Contact:</strong> Posted by{" "}
                {selectedJob.postedBy}.
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={(e) => handleOpenApplyModal(selectedJob, e)}
                  className={`flex-1 py-3 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs ${
                    isSelectedApplied
                      ? "bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]"
                      : "bg-[#7A1737] hover:bg-[#62122B] text-white"
                  }`}
                >
                  {isSelectedApplied ? "✓ Applied" : "Apply Now →"}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleSave(selectedJob.id)}
                  className="px-4 py-3 text-xs font-semibold border border-[#E2E8F0] rounded-lg text-[#17263C] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  {isSelectedSaved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => handleShareJob(selectedJob)}
                  className="px-3.5 py-3 text-xs font-semibold border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#17263C] cursor-pointer"
                  title="Share link"
                >
                  🔗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. INTERACTIVE JOB APPLICATION MODAL */}
      {isApplyModalOpen && selectedJob && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsApplyModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#17263C] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block">
                  Submit Application
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white truncate max-w-xs sm:max-w-md mt-0.5">
                  {selectedJob.title} — {selectedJob.company}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {isApplySuccess ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center text-2xl mx-auto mb-3">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#17263C] mb-1">
                    Application Forwarded!
                  </h4>
                  <p className="text-xs text-[#64748B] mb-5">
                    Your profile and CV reference have been delivered directly to{" "}
                    <strong>{selectedJob.postedBy}</strong> and corporate hiring partners.
                  </p>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left mb-6 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Application ID:</span>
                      <span className="font-mono font-bold text-[#7A1737]">
                        {applicationRefCode}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Position:</span>
                      <span className="font-semibold text-[#17263C]">{selectedJob.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Company:</span>
                      <span className="font-semibold text-[#17263C]">{selectedJob.company}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="w-full py-2.5 text-xs font-bold rounded-lg bg-[#7A1737] text-white hover:bg-[#62122B] transition-colors cursor-pointer"
                  >
                    Done & Return to Career Board
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rafiqul Islam or Student Name"
                      value={applyForm.name}
                      onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
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
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+880 1700-000000"
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        PUST Department
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CSE, EEE, Pharmacy"
                        value={applyForm.dept}
                        onChange={(e) => setApplyForm({ ...applyForm, dept: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Batch / Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2018 or 10th Batch"
                        value={applyForm.batch}
                        onChange={(e) => setApplyForm({ ...applyForm, batch: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Portfolio, CV, or LinkedIn Link *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://linkedin.com/in/... or drive link"
                      value={applyForm.portfolioUrl}
                      onChange={(e) => setApplyForm({ ...applyForm, portfolioUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Brief Note to Hiring Team
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Highlight relevant projects, technologies, and career goals..."
                      value={applyForm.coverNote}
                      onChange={(e) => setApplyForm({ ...applyForm, coverNote: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsApplyModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#17263C] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-bold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all shadow-xs cursor-pointer"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. POST A JOB MODAL */}
      {isPostJobModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsPostJobModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#17263C] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block">
                  Employer & Alumni Portal
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white mt-0.5">
                  Post a Job / Internship
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPostJobModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {postJobSuccess ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center text-2xl mx-auto mb-3">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-base text-[#17263C] mb-2">
                    Opening Published!
                  </h4>
                  <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                    Your opportunity is now visible across the PUST Alumni and Student ecosystem.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePostJobSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Frontend Engineer"
                        value={newJobForm.title}
                        onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Organization / Company *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Brain Station 23"
                        value={newJobForm.company}
                        onChange={(e) => setNewJobForm({ ...newJobForm, company: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Job Type
                      </label>
                      <select
                        value={newJobForm.type}
                        onChange={(e) => setNewJobForm({ ...newJobForm, type: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C] bg-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Target Department
                      </label>
                      <select
                        value={newJobForm.dept}
                        onChange={(e) => setNewJobForm({ ...newJobForm, dept: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C] bg-white"
                      >
                        <option value="CSE">CSE</option>
                        <option value="EEE">EEE</option>
                        <option value="CE">Civil</option>
                        <option value="PHARM">Pharmacy</option>
                        <option value="MATH">Mathematics</option>
                        <option value="BBA">Business (BBA)</option>
                        <option value="All Departments">All Disciplines</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Monthly Compensation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ৳ 50,000–70,000/mo"
                        value={newJobForm.salary}
                        onChange={(e) => setNewJobForm({ ...newJobForm, salary: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Application Deadline
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nov 30, 2026"
                        value={newJobForm.deadline}
                        onChange={(e) => setNewJobForm({ ...newJobForm, deadline: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Required Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Python, Django, AWS, Docker"
                      value={newJobForm.skills}
                      onChange={(e) => setNewJobForm({ ...newJobForm, skills: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Job Description & Application Instructions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Outline core responsibilities and qualifications..."
                      value={newJobForm.desc}
                      onChange={(e) => setNewJobForm({ ...newJobForm, desc: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remoteCheck"
                      checked={newJobForm.remote}
                      onChange={(e) => setNewJobForm({ ...newJobForm, remote: e.target.checked })}
                      className="rounded border-[#E2E8F0] text-[#7A1737] focus:ring-[#7A1737]"
                    />
                    <label htmlFor="remoteCheck" className="text-xs text-[#475569] cursor-pointer">
                      Remote Work Allowed
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPostJobModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#17263C] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-bold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all shadow-xs cursor-pointer"
                    >
                      Publish Opportunity
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. EMPLOYER RECRUITMENT CALL-TO-ACTION */}
      <section
        className="relative overflow-hidden mt-12 border-t border-[#0F1A2A]"
        style={{
          background: "#17263C",
          minHeight: 220,
        }}
      >
        <div className="absolute inset-0 flex opacity-20">
          <img src={Va} alt="" className="w-1/2 h-full object-cover object-center" />
          <img src={Ha} alt="" className="w-1/2 h-full object-cover object-center" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(23,38,60,0.85) 0%, rgba(23,38,60,0.98) 100%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2 text-[#C7A76C]">
              For Employers & Alumni Leaders
            </p>
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-2">
              Hire PUST Talent
            </h2>
            <p className="text-xs sm:text-sm max-w-md text-[#E2E8F0] leading-relaxed">
              Post an opportunity and recruit from over 22,400+ distinguished alumni and 4,200+
              skilled graduating students across engineering, science, and business.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="text-xs font-semibold px-6 py-3 rounded-lg bg-[#7A1737] hover:bg-[#62122B] text-white transition-opacity cursor-pointer shadow-sm active:scale-95"
            >
              Post a Job Opening →
            </button>
            <Link
              to="/mentorship"
              className="text-xs font-semibold text-white px-6 py-3 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-center"
            >
              Become a Career Mentor
            </Link>
          </div>
        </div>
      </section>

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
                  Pabna University of Science and Technology (PUST) · Campus Drone Tour
                </h3>
                <p className="text-[11px] text-gray-400 hidden sm:block">
                  Full Page Cinema Experience · 4K Drone Footage
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsTheaterMode(false)}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>✕</span>
              <span>Close (Esc)</span>
            </button>
          </div>

          <div
            className="flex-1 w-full max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black relative"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src="https://www.youtube.com/embed/-5wJ9pJebvM?autoplay=1&rel=0&modestbranding=1"
              title="Pabna University of Science and Technology Drone Shoot Full Page"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl bg-[#17263C] text-white text-xs font-semibold shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
