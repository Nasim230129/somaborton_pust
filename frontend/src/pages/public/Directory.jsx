import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  pa,
  ma,
  ha,
  ga,
  Sa,
  Ia,
  La,
  za,
  Ba,
  Ha,
  Wa,
  Ka,
  qa,
  Ja,
  Ya,
  Xa,
  Za,
  Qa,
} from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";

// Department acronyms and search aliases mapping
const DEPARTMENT_ALIASES = {
  cse: "Computer Science & Engineering",
  "comp sci": "Computer Science & Engineering",
  "computer science": "Computer Science & Engineering",
  "সিএসই": "Computer Science & Engineering",
  "কম্পিউটার": "Computer Science & Engineering",

  eee: "Electrical & Electronic Engineering",
  "ইইই": "Electrical & Electronic Engineering",
  eece: "Electrical, Electronic & Communication Engg.",

  ice: "Information & Communication Engineering",
  "আইসিই": "Information & Communication Engineering",

  ce: "Civil Engineering",
  civil: "Civil Engineering",
  "সিভিল": "Civil Engineering",

  arch: "Architecture",
  architecture: "Architecture",
  "স্থাপত্য": "Architecture",

  urp: "Urban and Regional Planning",
  "ইউআরপি": "Urban and Regional Planning",

  math: "Mathematics",
  mathematics: "Mathematics",
  maths: "Mathematics",
  "গণিত": "Mathematics",

  phy: "Physics",
  physics: "Physics",
  "পদার্থ": "Physics",

  pharm: "Pharmacy",
  pharmacy: "Pharmacy",
  "ফার্মেসি": "Pharmacy",

  chem: "Chemistry",
  chemistry: "Chemistry",
  "রসায়ন": "Chemistry",

  sds: "Statistics and Data Science",
  stat: "Statistics and Data Science",
  statistics: "Statistics and Data Science",
  "পরিসংখ্যান": "Statistics and Data Science",

  bba: "Business Administration",
  business: "Business Administration",
  mba: "Business Administration",
  "ব্যবসায়": "Business Administration",

  thm: "Tourism and Hospitality Management",
  tourism: "Tourism and Hospitality Management",

  econ: "Economics",
  economics: "Economics",
  "অর্থনীতি": "Economics",

  ban: "Bangla",
  bangla: "Bangla",
  bengali: "Bangla",
  "বাংলা": "Bangla",

  sw: "Social Work",
  "সমাজকর্ম": "Social Work",

  eng: "English",
  english: "English",
  "ইংরেজি": "English",

  pa: "Public Administration",
  "লোকপ্রশাসন": "Public Administration",

  hist: "History",
  history: "History",
  "ইতিহাস": "History",

  geo: "Geography and Environment",
  geography: "Geography and Environment",
  "ভূগোল": "Geography and Environment",
};

const campusImages = [Ia, La, za, Ba, Ha, Wa, Xa, qa, Ja, Qa, Za, Ya, Ka];

const roleTabs = [
  { key: "All", label: "All Members" },
  { key: "Alumni", label: "Alumni" },
  { key: "Students", label: "Students" },
  { key: "Faculty", label: "Faculty" },
];

const roleLabels = {
  alumni: "Alumni",
  student: "Student",
  faculty: "Faculty",
  employer: "Employer",
};

const roleColors = {
  alumni: "bg-[#7A1737]/10 text-[#7A1737] border-[#7A1737]/25",
  student: "bg-blue-50 text-blue-700 border-blue-200",
  faculty: "bg-emerald-50 text-emerald-700 border-emerald-200",
  employer: "bg-amber-50 text-amber-800 border-amber-200",
};

const batchOptions = [
  "All Batches",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2018",
  "2016",
  "2015",
  "2013",
  "2012",
  "2011",
  "2010",
  "2008",
  "2007",
];

const locationOptions = [
  "All Locations",
  "Dhaka",
  "Pabna",
  "Chittagong",
  "Rajshahi",
  "Toronto",
  "London",
];

const sortOptions = ["Relevance", "Name A–Z", "Batch (Newest)", "Connections"];

// Clean member role and company display without duplicates
function getMemberRoleDisplay(member) {
  if (!member) return "";
  const headline = (member.headline || "").trim();
  const company = (member.company || "").trim();

  if (headline && company) {
    if (headline.toLowerCase().includes(company.toLowerCase())) {
      return headline;
    }
    return `${headline} · ${company}`;
  }
  if (headline) return headline;
  if (company) return `Professional at ${company}`;

  const roleName = roleLabels[member.role] || "Member";
  return member.dept ? `${roleName}, ${member.dept}` : `${roleName}, PUST`;
}

// Offline high-contrast university initials avatar
function getInitialsAvatar(name) {
  const initials = (name || "PUST")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "P";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="#7A1737"/><text x="50%" y="54%" font-family="Inter, system-ui, sans-serif" font-size="44" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Match department with acronyms and names
function matchesDepartment(memberDept, targetDept) {
  if (!targetDept || targetDept === "All" || targetDept === "All Departments") return true;
  const mDept = (memberDept || "").toLowerCase().trim();
  const t = targetDept.toLowerCase().trim();
  if (mDept === t || mDept.includes(t) || t.includes(mDept)) return true;

  const aliasName = DEPARTMENT_ALIASES[t];
  if (aliasName && (mDept === aliasName.toLowerCase() || mDept.includes(aliasName.toLowerCase()))) {
    return true;
  }

  const deptObj = ga.find(
    (d) => d.code.toLowerCase() === t || d.name.toLowerCase() === t
  );
  if (deptObj) {
    const fullName = deptObj.name.toLowerCase();
    const codeName = deptObj.code.toLowerCase();
    return mDept === fullName || mDept.includes(fullName) || mDept.includes(codeName);
  }
  return false;
}

// Search matching
function matchesSearch(m, q) {
  if (!q) return true;
  const query = q.toLowerCase().trim();
  if (!query) return true;

  // Name
  if (m.name && m.name.toLowerCase().includes(query)) return true;

  // Department & alias
  const mDept = (m.dept || "").toLowerCase();
  if (mDept.includes(query)) return true;

  const alias = DEPARTMENT_ALIASES[query];
  if (alias && mDept.includes(alias.toLowerCase())) return true;

  const matchedDept = ga.find(
    (d) => d.code.toLowerCase() === query || d.name.toLowerCase().includes(query)
  );
  if (matchedDept && mDept.includes(matchedDept.name.toLowerCase())) return true;

  // Headline & Company & Bio
  if (m.headline && m.headline.toLowerCase().includes(query)) return true;
  if (m.company && m.company.toLowerCase().includes(query)) return true;
  if (m.bio && m.bio.toLowerCase().includes(query)) return true;

  // Role
  const mRole = (m.role || "").toLowerCase();
  if (mRole === query) return true;
  if (query === "student" && mRole === "student") return true;
  if (query === "students" && mRole === "student") return true;
  if (query === "alumni" && mRole === "alumni") return true;
  if (query === "alumnus" && mRole === "alumni") return true;
  if ((query === "faculty" || query === "teacher" || query === "prof" || query === "professor") && mRole === "faculty") return true;

  // Mentor search keywords
  if ((query === "mentor" || query === "mentors") && m.mentorAvailable) return true;

  // Verified search keyword
  if (query === "verified" && m.verified) return true;

  // Batch
  if (m.batch && String(m.batch).toLowerCase().includes(query)) return true;

  // Location
  if (m.location && m.location.toLowerCase().includes(query)) return true;

  // Skills
  if (Array.isArray(m.skills) && m.skills.some((s) => typeof s === "string" && s.toLowerCase().includes(query))) return true;

  // Experience
  if (Array.isArray(m.experience) && m.experience.some((e) =>
    (e.title && e.title.toLowerCase().includes(query)) ||
    (e.company && e.company.toLowerCase().includes(query)) ||
    (e.description && e.description.toLowerCase().includes(query))
  )) return true;

  // Education
  if (Array.isArray(m.education) && m.education.some((ed) =>
    (ed.degree && ed.degree.toLowerCase().includes(query)) ||
    (ed.institution && ed.institution.toLowerCase().includes(query))
  )) return true;

  return false;
}

export default function Directory() {
  useBackendSync();
  usePageMeta(
    "PUST Alumni Directory — Connect with Graduates & Faculty",
    "Search and connect with Pabna University of Science and Technology (PUST) alumni, students, and faculty members worldwide."
  );

  const location = useLocation();

  const getSearchParam = () => {
    if (typeof window === "undefined") return { q: "", role: "All", dept: "All" };
    const params = new URLSearchParams(location.search || window.location.search);
    return {
      q: params.get("search") || params.get("q") || "",
      role: params.get("role") || "All",
      dept: params.get("dept") || "All",
    };
  };

  const initialParams = getSearchParam();
  const [allMembers, setAllMembers] = useState(() => [...pa, ...ma, ...ha, ...Sa]);
  const [, setLoading] = useState(false);

  // Live data fetch on mount to load all registered members
  useEffect(() => {
    let isMounted = true;
    async function loadLiveDirectory() {
      try {
        setLoading(true);
        const res = await api.getAlumniDirectory();
        if (isMounted && res && res.ok && Array.isArray(res.data) && res.data.length > 0) {
          setAllMembers(res.data);
        }
      } catch (err) {
        console.debug("Live directory load error, using fallback data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLiveDirectory();

    const handleSync = () => {
      loadLiveDirectory();
    };
    window.addEventListener("pust-data-synced", handleSync);
    return () => {
      isMounted = false;
      window.removeEventListener("pust-data-synced", handleSync);
    };
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialParams.q);
  const [debouncedSearch, setDebouncedSearch] = useState(initialParams.q);
  const [selectedRole, setSelectedRole] = useState(initialParams.role);
  const [selectedDept, setSelectedDept] = useState(initialParams.dept);
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [mentorOnly, setMentorOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Dynamically compute available batches and locations from all members in store
  const availableBatches = useMemo(() => {
    const set = new Set();
    allMembers.forEach((m) => {
      if (m.batch) set.add(String(m.batch));
    });
    const sorted = Array.from(set).sort((a, b) => Number(b) - Number(a));
    return ["All Batches", ...sorted];
  }, [allMembers]);

  const availableLocations = useMemo(() => {
    const set = new Set();
    allMembers.forEach((m) => {
      if (m.location) {
        const city = m.location.split(",")[0].trim();
        if (city) set.add(city);
      }
    });
    const sorted = Array.from(set).sort();
    return ["All Locations", ...sorted];
  }, [allMembers]);

  // Background Video State (Offline Campus Experience)
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {});
      }
      setIsMuted(nextMuted);
    }
  };

  // Interactivity States
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [connectedIds, setConnectedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_connected_alumni");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_saved_alumni");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Clickable skill handler
  const handleSkillClick = (skill, ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setSearchQuery(skill);
    setDebouncedSearch(skill);
    setSelectedRole("All");
    setCurrentPage(1);
    document.getElementById("directory-results")?.scrollIntoView({ behavior: "smooth" });
  };

  // Quick preset search handler
  const handlePresetSearch = (term) => {
    setSearchQuery(term);
    setDebouncedSearch(term);
    setSelectedRole("All");
    setCurrentPage(1);
    document.getElementById("directory-results")?.scrollIntoView({ behavior: "smooth" });
  };

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        const searchInput = document.getElementById("alumni-hero-search-input");
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync with URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || params.get("q");
    const role = params.get("role");
    const dept = params.get("dept");
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
      setDebouncedSearch(q);
    }
    if (role && role !== "All") setSelectedRole(role);
    if (dept && dept !== "All") setSelectedDept(dept);
  }, [location.search]);

  // Immediate hero search submit
  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    setDebouncedSearch(searchQuery);
    setSelectedRole("All");
    setCurrentPage(1);
    document.getElementById("directory-results")?.scrollIntoView({ behavior: "smooth" });
  };

  // Base filtered list before role filtering (for dynamic counts across tabs)
  const baseFilteredMembers = useMemo(() => {
    return allMembers.filter((m) => {
      // Department filter
      if (selectedDept !== "All" && selectedDept !== "All Departments" && !matchesDepartment(m.dept, selectedDept)) {
        return false;
      }
      // Batch filter
      if (selectedBatch !== "All Batches" && String(m.batch) !== String(selectedBatch)) {
        return false;
      }
      // Location filter
      if (selectedLocation !== "All Locations") {
        const locLower = selectedLocation.toLowerCase();
        if (!m.location || !m.location.toLowerCase().includes(locLower)) return false;
      }
      // Mentor filter
      if (mentorOnly && !m.mentorAvailable) return false;
      // Verified filter
      if (verifiedOnly && !m.verified) return false;
      // Search term
      if (debouncedSearch && !matchesSearch(m, debouncedSearch)) {
        return false;
      }
      return true;
    });
  }, [
    allMembers,
    selectedDept,
    selectedBatch,
    selectedLocation,
    mentorOnly,
    verifiedOnly,
    debouncedSearch,
  ]);

  // Dynamic counts for each role tab based on active filters and search
  const roleCounts = useMemo(() => {
    return {
      All: baseFilteredMembers.length,
      Alumni: baseFilteredMembers.filter((m) => m.role === "alumni").length,
      Students: baseFilteredMembers.filter((m) => m.role === "student").length,
      Faculty: baseFilteredMembers.filter((m) => m.role === "faculty").length,
    };
  }, [baseFilteredMembers]);

  // Final filtered list after applying selectedRole
  const filteredMembers = useMemo(() => {
    let list = baseFilteredMembers;
    if (selectedRole === "Alumni") {
      list = list.filter((m) => m.role === "alumni");
    } else if (selectedRole === "Students") {
      list = list.filter((m) => m.role === "student");
    } else if (selectedRole === "Faculty") {
      list = list.filter((m) => m.role === "faculty");
    }

    // Sorting
    if (sortBy === "Name A–Z") {
      list = [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "Batch (Newest)") {
      list = [...list].sort((a, b) => Number(b.batch || 0) - Number(a.batch || 0));
    } else if (sortBy === "Connections") {
      list = [...list].sort((a, b) => Number(b.connections || 0) - Number(a.connections || 0));
    }

    return list;
  }, [baseFilteredMembers, selectedRole, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  // Actions
  const handleConnect = async (id, ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!connectedIds.includes(id)) {
      const next = [...connectedIds, id];
      setConnectedIds(next);
      try {
        localStorage.setItem("pust_connected_alumni", JSON.stringify(next));
        await api.connectAlumni(id);
      } catch (err) {
        console.debug("Connect failed:", err);
      }
    }
  };

  const handleToggleSave = async (id, ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const isSaved = savedIds.includes(id);
    const nextSaved = isSaved ? savedIds.filter((item) => item !== id) : [...savedIds, id];
    setSavedIds(nextSaved);
    try {
      localStorage.setItem("pust_saved_alumni", JSON.stringify(nextSaved));
      await api.saveAlumni(id, { saved: !isSaved });
    } catch (err) {
      console.debug("Save failed:", err);
    }
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedRole("All");
    setSelectedDept("All");
    setSelectedBatch("All Batches");
    setSelectedLocation("All Locations");
    setMentorOnly(false);
    setVerifiedOnly(false);
    setSortBy("Relevance");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    debouncedSearch ||
    selectedRole !== "All" ||
    (selectedDept !== "All" && selectedDept !== "All Departments") ||
    selectedBatch !== "All Batches" ||
    selectedLocation !== "All Locations" ||
    mentorOnly ||
    verifiedOnly;

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* =========================================
          HERO BANNER (FULL LENGTH / FULL VIEWPORT VIDEO HERO)
      ========================================= */}
      <section
        className="relative overflow-hidden bg-[#0D1522] text-white flex flex-col justify-between pt-6 sm:pt-10 pb-6 sm:pb-8 border-b border-[#0F1A2A]"
        style={{ minHeight: "calc(100vh - 84px)" }}
      >
        {/* Live Campus Video Background spanning the full length of the hero */}
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
            <source src="/assets/videos/pust_alumni_campus_short.mp4" type="video/mp4" />
            <source src="/assets/videos/pust_campus_tour_experience.mp4" type="video/mp4" />
          </video>

          {/* Deep Navy Gradient Overlay for high-contrast, effortless text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(13, 21, 34, 0.82) 0%, rgba(13, 21, 34, 0.45) 45%, rgba(13, 21, 34, 0.92) 100%)",
            }}
          />
        </div>

        {/* Top Video Indicator & Sound Controls */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 mb-4 w-full flex items-center justify-between pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-white text-[11px] sm:text-xs font-semibold bg-[#17263C]/80 border border-white/15 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-bengali">🏛️ PUST ক্যাম্পাস লাইভ ব্যাকগ্রাউন্ড</span>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute campus video sound" : "Mute campus video sound"}
            className="px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-white bg-[#17263C]/80 hover:bg-[#17263C] border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            title={isMuted ? "Click to play sound" : "Click to mute"}
          >
            <span>{isMuted ? "🔇 সাউন্ড অফ" : "🔊 সাউন্ড অন"}</span>
          </button>
        </div>

        {/* Center Main Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center my-auto py-8 sm:py-12 reveal-up">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] mb-2 text-[#C7A76C]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> · Alumni Directory
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold !text-white text-white mb-3 tracking-tight font-display">
            Discover Your PUST Alumni Community
          </h1>

          <p className="mb-6 max-w-xl mx-auto text-sm sm:text-base text-[#E2E8F0] leading-relaxed">
            Search and connect with graduates, current students, and faculty members across all 21 departments.
          </p>

          {/* Primary & Secondary Hero CTAs */}
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap reveal-up delay-100">
            <a
              href="#directory-results"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("directory-results")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-full bg-[#7A1737] hover:bg-[#60122B] text-white font-bold text-xs sm:text-sm transition-all shadow-xl active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Explore Alumni</span>
              <span>↓</span>
            </a>
            <Link
              to="/register"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-sm transition-all active:scale-95 shadow-xl"
            >
              Join the Network →
            </Link>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleHeroSearchSubmit}
            className="max-w-2xl mx-auto relative group bg-white p-2 rounded-2xl shadow-2xl border border-[#E2E8F0] focus-within:border-[#7A1737] focus-within:ring-2 focus-within:ring-[#7A1737]/20 flex items-center gap-2 transition-all reveal-up delay-150"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] text-[#17263C] flex items-center justify-center font-bold text-base flex-shrink-0 border border-[#E2E8F0]">
              🔍
            </div>
            <input
              id="alumni-hero-search-input"
              type="text"
              placeholder="Search by name, department (CSE, EEE, CE), company, batch, skills... (Press /)"
              aria-label="Search alumni community"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-2 py-2 text-sm sm:text-base text-[#17263C] outline-none bg-transparent font-normal placeholder-[#94A3B8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setDebouncedSearch("");
                }}
                className="w-7 h-7 my-auto rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#17263C] flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Clear search"
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#7A1737] hover:bg-[#60122B] text-white font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-md"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Popular Search Suggestions */}
          <div className="mt-4 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap text-xs text-[#E2E8F0] reveal-up delay-200">
            <span className="text-[#C7A76C] font-semibold text-[11px]">Quick Filters:</span>
            {[
              { label: "💻 CSE", term: "CSE" },
              { label: "⚡ EEE", term: "EEE" },
              { label: "🏗️ Civil (CE)", term: "Civil" },
              { label: "🏢 Brain Station", term: "Brain Station" },
              { label: "🎯 Mentors", term: "mentor" },
              { label: "📍 Dhaka", term: "Dhaka" },
            ].map((tag) => (
              <button
                key={tag.term}
                type="button"
                onClick={() => handlePresetSearch(tag.term)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-medium transition-colors cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Ambient Bar & Scroll Down Prompt */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between text-xs text-[#E2E8F0] font-bengali">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">লাইভ ক্যাম্পাস ভিডিও ব্যাকগ্রাউন্ড</span>
          </div>

          <a
            href="#directory-results"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("directory-results")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>নিচে স্ক্রোল করে অ্যালামনাই তালিকা দেখুন</span>
            <span className="animate-bounce font-mono">↓</span>
          </a>
        </div>
      </section>

      {/* =========================================
          ROLE TABS (STICKY WITH LIVE COUNTS)
      ========================================= */}
      <div className="bg-white border-b border-[#E2E8F0] shadow-xs sticky top-16 z-20 reveal-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-1">
            {roleTabs.map((tab) => {
              const active = selectedRole === tab.key;
              const count = roleCounts[tab.key] ?? 0;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setSelectedRole(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    active
                      ? "border-b-[#7A1737] text-[#7A1737]"
                      : "border-b-transparent text-[#64748B] hover:text-[#17263C]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      active ? "bg-[#7A1737]" : "bg-[#CBD5E1]"
                    }`}
                  />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      active ? "bg-[#7A1737]/10 text-[#7A1737]" : "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================
          MAIN DIRECTORY LAYOUT & STRUCTURE
      ========================================= */}
      <div id="directory-results" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mobile Filters Toggle Button */}
        <div className="lg:hidden mb-4 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-[#17263C] px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer"
          >
            <span>⚙️ Filter Community</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#7A1737]" />}
            <span className="text-[10px] text-[#64748B]">{mobileFiltersOpen ? "▲ Hide" : "▼ Show"}</span>
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-[#7A1737] font-semibold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Structured Layout: Left Filter Panel (1 col) + Right Content (3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left: Unified Cohesive Filter Panel */}
          <aside className={`w-full lg:col-span-1 ${mobileFiltersOpen ? "block" : "hidden lg:block"} sticky top-28 reveal-left`}>
            <div className="rounded-xl bg-white border border-[#E2E8F0] shadow-xs overflow-hidden">
              {/* Filter Panel Header */}
              <div className="p-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#17263C] flex items-center gap-1.5">
                  <span>⚙️</span>
                  <span>Filter Options</span>
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[11px] font-semibold text-[#7A1737] hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              <div className="p-4 space-y-4">
                {/* Department Dropdown */}
                <div>
                  <label htmlFor="filter-dept-select" className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Academic Department
                  </label>
                  <select
                    id="filter-dept-select"
                    aria-label="Filter members by department"
                    value={selectedDept}
                    onChange={(e) => {
                      setSelectedDept(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full text-xs py-2 px-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#7A1737]/20 focus:border-[#7A1737] bg-[#F8FAFC] border border-[#E2E8F0] text-[#17263C] cursor-pointer"
                  >
                    <option value="All">All Departments</option>
                    {ga.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code} — {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Batch Dropdown */}
                <div>
                  <label htmlFor="filter-batch-select" className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Graduation Batch
                  </label>
                  <select
                    id="filter-batch-select"
                    aria-label="Filter alumni by graduation batch"
                    value={selectedBatch}
                    onChange={(e) => {
                      setSelectedBatch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full text-xs py-2 px-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#7A1737]/20 focus:border-[#7A1737] bg-[#F8FAFC] border border-[#E2E8F0] text-[#17263C] cursor-pointer"
                  >
                    {availableBatches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Dropdown */}
                <div>
                  <label htmlFor="filter-loc-select" className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Location / City
                  </label>
                  <select
                    id="filter-loc-select"
                    aria-label="Filter members by location"
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full text-xs py-2 px-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#7A1737]/20 focus:border-[#7A1737] bg-[#F8FAFC] border border-[#E2E8F0] text-[#17263C] cursor-pointer"
                  >
                    {availableLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Checkboxes */}
                <div className="pt-2 border-t border-[#E2E8F0] space-y-2.5">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                    Special Status
                  </span>

                  <label className="flex items-center justify-between cursor-pointer select-none">
                    <span className="text-xs text-[#475569] font-medium flex items-center gap-1.5">
                      <span>✓</span>
                      <span>Verified Only</span>
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={verifiedOnly}
                      aria-label="Verified Only Filter"
                      onClick={() => {
                        setVerifiedOnly(!verifiedOnly);
                        setCurrentPage(1);
                      }}
                      className={`w-9 h-5 rounded-full transition-colors flex items-center flex-shrink-0 cursor-pointer ${
                        verifiedOnly ? "bg-[#7A1737]" : "bg-[#E2E8F0]"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform mx-0.5 ${
                          verifiedOnly ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer select-none">
                    <span className="text-xs text-[#475569] font-medium flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>Available Mentors</span>
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={mentorOnly}
                      aria-label="Mentor Available Filter"
                      onClick={() => {
                        setMentorOnly(!mentorOnly);
                        setCurrentPage(1);
                      }}
                      className={`w-9 h-5 rounded-full transition-colors flex items-center flex-shrink-0 cursor-pointer ${
                        mentorOnly ? "bg-[#7A1737]" : "bg-[#E2E8F0]"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform mx-0.5 ${
                          mentorOnly ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>

              {/* Clear All Footer */}
              {hasActiveFilters && (
                <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="w-full py-2 text-xs font-semibold text-[#7A1737] rounded-lg border border-[#7A1737]/30 hover:bg-[#7A1737]/5 bg-white transition-colors cursor-pointer shadow-2xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="lg:col-span-3 min-w-0 w-full reveal-right">
            {/* Active Filter Pills Bar */}
            {hasActiveFilters && (
              <div className="mb-4 flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-xs">
                <span className="text-[11px] font-semibold text-[#64748B] mr-1">Active:</span>

                {debouncedSearch && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#17263C] border border-[#CBD5E1]">
                    <span>"{debouncedSearch}"</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setDebouncedSearch("");
                      }}
                      className="hover:text-[#7A1737] cursor-pointer"
                      aria-label="Remove search term"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedRole !== "All" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]">
                    <span>Role: {selectedRole}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRole("All")}
                      className="hover:text-[#7A1737] cursor-pointer"
                      aria-label="Remove role filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedDept !== "All" && selectedDept !== "All Departments" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF]">
                    <span>Dept: {selectedDept}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDept("All")}
                      className="hover:text-[#7A1737] cursor-pointer"
                      aria-label="Remove department filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedBatch !== "All Batches" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
                    <span>Batch: {selectedBatch}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedBatch("All Batches")}
                      className="hover:text-[#7A1737] cursor-pointer"
                      aria-label="Remove batch filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedLocation !== "All Locations" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]">
                    <span>{selectedLocation}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedLocation("All Locations")}
                      className="hover:text-[#7A1737] cursor-pointer"
                      aria-label="Remove location filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {mentorOnly && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]">
                    <span>🎯 Mentors</span>
                    <button
                      type="button"
                      onClick={() => setMentorOnly(false)}
                      className="hover:text-[#7A1737] cursor-pointer"
                      aria-label="Remove mentor filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {verifiedOnly && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#7A1737]/10 text-[#7A1737] border border-[#7A1737]/25">
                    <span>✓ Verified</span>
                    <button
                      type="button"
                      onClick={() => setVerifiedOnly(false)}
                      className="hover:text-[#7A1737] cursor-pointer"
                      aria-label="Remove verified filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-[#7A1737] hover:underline ml-auto cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Smart Cross-Role Helper Banner */}
            {selectedRole !== "All" && filteredMembers.length === 0 && roleCounts.All > 0 && (
              <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <p className="text-xs leading-relaxed">
                    No results in <strong>{selectedRole}</strong>, but found{" "}
                    <strong>{roleCounts.All}</strong> matching member(s) in other categories!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRole("All")}
                  className="px-3 py-1.5 text-xs font-bold bg-[#7A1737] text-white rounded-lg hover:bg-[#60122B] transition-colors cursor-pointer flex-shrink-0"
                >
                  Show All Members ({roleCounts.All})
                </button>
              </div>
            )}

            {/* Results Toolbar: Count, Sort, Grid/List Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-xs">
              <p className="text-xs sm:text-sm text-[#64748B]">
                Showing <strong className="text-[#17263C]">{filteredMembers.length}</strong> members
                {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
              </p>

              <div className="flex items-center gap-2">
                <label htmlFor="sort-dropdown" className="text-xs text-[#64748B] font-medium hidden sm:inline">
                  Sort:
                </label>
                <select
                  id="sort-dropdown"
                  aria-label="Sort alumni directory"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs py-1.5 px-2.5 rounded-lg outline-none focus:ring-1 focus:ring-[#7A1737] bg-[#F8FAFC] border border-[#E2E8F0] text-[#17263C] cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <div className="flex border border-[#E2E8F0] overflow-hidden rounded-lg bg-white">
                  <button
                    type="button"
                    aria-label="Grid view"
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                      viewMode === "grid" ? "bg-[#F1F5F9] text-[#17263C] font-bold" : "text-[#94A3B8]"
                    }`}
                  >
                    ⊞
                  </button>
                  <button
                    type="button"
                    aria-label="List view"
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                      viewMode === "list" ? "bg-[#F1F5F9] text-[#17263C] font-bold" : "text-[#94A3B8]"
                    }`}
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredMembers.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#F8FAFC] text-[#94A3B8] flex items-center justify-center text-2xl mx-auto mb-3 border border-[#E2E8F0]">
                  🔍
                </div>
                <h3 className="font-display font-bold text-[#17263C] text-base mb-1">
                  No Members Found
                </h3>
                <p className="text-xs text-[#64748B] max-w-md mx-auto mb-4 leading-relaxed">
                  We could not find any members matching your criteria. Try adjusting your department, batch, or keyword search.
                </p>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#7A1737] hover:bg-[#62122B] text-white transition-colors cursor-pointer shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW - BEAUTIFULLY ORGANIZED */
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedMembers.map((member, index) => {
                  const isConnected = connectedIds.includes(member.id);
                  const isSaved = savedIds.includes(member.id);
                  const coverImage = campusImages[index % campusImages.length];

                  return (
                    <div
                      key={member.id}
                      className={`group flex flex-col justify-between rounded-xl overflow-hidden bg-white border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-md transition-all duration-200 ${index % 2 === 0 ? "reveal-left" : "reveal-right"} delay-${Math.min(300, (index % 6) * 50)}`}
                    >
                      <div>
                        {/* Cover image banner */}
                        <div className="relative h-20 overflow-hidden bg-[#17263C]">
                          <img
                            src={coverImage}
                            alt=""
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#17263C]/80 via-transparent to-transparent" />

                          {/* Bookmark Save Button */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleSave(member.id, e)}
                            aria-label={isSaved ? "Remove from saved profiles" : "Save alumni profile"}
                            title={isSaved ? "Saved" : "Save Profile"}
                            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer shadow-sm ${
                              isSaved
                                ? "bg-[#C7A76C] text-[#17263C]"
                                : "bg-black/40 hover:bg-black/60 text-white"
                            }`}
                          >
                            {isSaved ? "★" : "☆"}
                          </button>
                        </div>

                        {/* Avatar & Badges */}
                        <div className="flex justify-center -mt-9 relative px-4">
                          <div className="relative">
                            <img
                              src={member.avatar || getInitialsAvatar(member.name)}
                              alt={member.name}
                              onError={(e) => {
                                e.currentTarget.src = getInitialsAvatar(member.name);
                              }}
                              className="w-16 h-16 rounded-full object-cover ring-2 ring-white bg-[#F8FAFC] shadow-sm"
                            />
                            {member.verified && (
                              <span
                                className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-[#7A1737] text-white font-bold rounded-full flex items-center justify-center text-[9px] ring-2 ring-white shadow-xs"
                                title="Verified PUST Alumnus"
                              >
                                ✓
                              </span>
                            )}
                            {member.mentorAvailable && (
                              <span
                                className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#C7A76C] text-[#17263C] rounded-full flex items-center justify-center text-[9px] ring-2 ring-white shadow-xs"
                                title="Available as Mentor"
                              >
                                🎯
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Name & Hierarchy */}
                        <div className="px-4 pt-2 pb-3 text-center">
                          {/* Role Pill */}
                          <div className="inline-block mb-1">
                            <span
                              className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                roleColors[member.role] || "bg-[#F8FAFC] text-[#17263C] border-[#E2E8F0]"
                              }`}
                            >
                              {roleLabels[member.role] || member.role}
                            </span>
                          </div>

                          {/* Member Name */}
                          <Link
                            to={`/alumni/${member.id}`}
                            className="block font-display font-bold text-[#17263C] text-sm sm:text-base group-hover:text-[#7A1737] transition-colors leading-snug line-clamp-1"
                          >
                            {member.name}
                          </Link>

                          {/* Current Role / Organization */}
                          <p className="text-xs text-[#17263C] font-semibold mt-1 leading-snug line-clamp-1 min-h-[18px]" title={getMemberRoleDisplay(member)}>
                            {getMemberRoleDisplay(member)}
                          </p>

                          {/* Academic Department & Batch */}
                          <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[11px] text-[#64748B] font-medium px-2">
                            <span className="truncate" title={member.dept}>🏛️ {member.dept || "PUST"}</span>
                            {member.batch && (
                              <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                                Batch {member.batch}
                              </span>
                            )}
                          </div>

                          {/* Location & Connections */}
                          <div className="flex items-center justify-center gap-2 mt-1 text-[11px] text-[#64748B]">
                            <span>📍 {member.location || "Bangladesh"}</span>
                            {member.connections !== undefined && (
                              <span>· 🔗 {member.connections + (isConnected ? 1 : 0)} connections</span>
                            )}
                          </div>

                          {/* Skills Chips */}
                          <div className="flex flex-wrap justify-center gap-1 mt-2.5 min-h-[22px]">
                            {member.skills && member.skills.length > 0 ? (
                              <>
                                {member.skills.slice(0, 3).map((skill) => (
                                  <button
                                    key={skill}
                                    type="button"
                                    onClick={(e) => handleSkillClick(skill, e)}
                                    title={`Filter by skill: ${skill}`}
                                    className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:border-[#7A1737] hover:text-[#7A1737] hover:bg-white transition-colors cursor-pointer"
                                  >
                                    {skill}
                                  </button>
                                ))}
                                {member.skills.length > 3 && (
                                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-[#F8FAFC] text-[#94A3B8] border border-[#E2E8F0]">
                                    +{member.skills.length - 3}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-[10px] text-[#94A3B8] italic">PUST Community Member</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC]/60">
                        <button
                          type="button"
                          onClick={(e) => handleConnect(member.id, e)}
                          aria-label={isConnected ? `Connected with ${member.name}` : `Connect with ${member.name}`}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs ${
                            isConnected
                              ? "bg-[#F1F5F9] text-[#17263C] border border-[#CBD5E1]"
                              : "btn-maroon"
                          }`}
                        >
                          {isConnected ? "✓ Connected" : "Connect"}
                        </button>
                        <Link
                          to={`/alumni/${member.id}`}
                          className="flex-1 py-1.5 text-xs font-semibold text-center rounded-lg transition-colors bg-white hover:bg-[#F1F5F9] text-[#17263C] border border-[#E2E8F0]"
                        >
                          View Profile
                        </Link>
                        <Link
                          to={`/dashboard/messages?startWith=${member.id}`}
                          title={`Send message to ${member.name}`}
                          aria-label={`Message ${member.name}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors bg-white hover:bg-[#F1F5F9] text-[#17263C] border border-[#E2E8F0] flex-shrink-0"
                        >
                          💬
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW - STRUCTURED HORIZONTAL ROWS */
              <div className="space-y-3">
                {paginatedMembers.map((member) => {
                  const isConnected = connectedIds.includes(member.id);
                  const isSaved = savedIds.includes(member.id);

                  return (
                    <div
                      key={member.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-xs transition-all"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                          <img
                            src={member.avatar || getInitialsAvatar(member.name)}
                            alt={member.name}
                            onError={(e) => {
                              e.currentTarget.src = getInitialsAvatar(member.name);
                            }}
                            className="w-13 h-13 rounded-full object-cover border border-[#E2E8F0] bg-[#F8FAFC]"
                          />
                          {member.verified && (
                            <span
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white bg-[#7A1737] border border-white"
                              title="Verified PUST Alumnus"
                            >
                              ✓
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              to={`/alumni/${member.id}`}
                              className="font-display font-bold text-sm text-[#17263C] hover:text-[#7A1737] transition-colors"
                            >
                              {member.name}
                            </Link>
                            <span
                              className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                roleColors[member.role] || "bg-[#F8FAFC] border-[#E2E8F0] text-[#17263C]"
                              }`}
                            >
                              {roleLabels[member.role] || member.role}
                            </span>
                            {member.mentorAvailable && (
                              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#C7A76C]/15 text-[#7A1737] border border-[#C7A76C]/30">
                                🎯 Mentor
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#17263C] font-semibold mt-0.5 truncate" title={getMemberRoleDisplay(member)}>
                            {getMemberRoleDisplay(member)}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[#64748B] mt-1">
                            <span>🏛️ {member.dept || "PUST"}</span>
                            {member.batch && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                                Batch {member.batch}
                              </span>
                            )}
                            <span>· 📍 {member.location || "Bangladesh"}</span>
                            {member.connections !== undefined && (
                              <span>· 🔗 {member.connections + (isConnected ? 1 : 0)} connections</span>
                            )}
                          </div>

                          {/* Clickable skills in list view */}
                          {member.skills && member.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {member.skills.slice(0, 4).map((skill) => (
                                <button
                                  key={skill}
                                  type="button"
                                  onClick={(e) => handleSkillClick(skill, e)}
                                  title={`Filter by skill: ${skill}`}
                                  className="text-[9px] font-medium px-2 py-0.5 rounded bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:border-[#7A1737] hover:text-[#7A1737] transition-colors cursor-pointer"
                                >
                                  {skill}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={(e) => handleToggleSave(member.id, e)}
                          title={isSaved ? "Saved" : "Save Profile"}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors border cursor-pointer ${
                            isSaved
                              ? "bg-[#C7A76C]/20 border-[#C7A76C] text-[#17263C]"
                              : "border-[#E2E8F0] text-[#64748B] hover:text-[#17263C]"
                          }`}
                        >
                          {isSaved ? "★" : "☆"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleConnect(member.id, e)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            isConnected
                              ? "bg-[#F1F5F9] text-[#17263C] border border-[#CBD5E1]"
                              : "btn-maroon shadow-xs"
                          }`}
                        >
                          {isConnected ? "✓ Connected" : "Connect"}
                        </button>
                        <Link
                          to={`/alumni/${member.id}`}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-[#F8FAFC] text-[#17263C] border border-[#E2E8F0] transition-colors"
                        >
                          Profile
                        </Link>
                        <Link
                          to={`/dashboard/messages?startWith=${member.id}`}
                          title={`Send message to ${member.name}`}
                          aria-label={`Message ${member.name}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors bg-white hover:bg-[#F8FAFC] text-[#17263C] border border-[#E2E8F0]"
                        >
                          💬
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav
                className="mt-8 flex items-center justify-center gap-2"
                aria-label="Alumni directory pagination"
              >
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    document.getElementById("directory-results")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E2E8F0] text-[#475569] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isCurrent = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      aria-current={isCurrent ? "page" : undefined}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        document.getElementById("directory-results")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        isCurrent
                          ? "bg-[#7A1737] text-white border border-[#7A1737]"
                          : "bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    document.getElementById("directory-results")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E2E8F0] text-[#475569] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  Next →
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
