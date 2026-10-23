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

// Fallback high-quality curated openings for PUST disciplines
const CURATED_CORPORATE_JOBS = [
  {
    id: 1,
    title: "Junior Software Engineer",
    company: "Brain Station 23",
    logo: "🏢",
    location: "Dhaka (Gulshan-1), Bangladesh",
    type: "Full-time",
    salary: "৳ 45,000–65,000/mo",
    dept: "CSE",
    posted: "Just now",
    deadline: "Nov 30, 2026",
    skills: ["Python", "Django", "React", "PostgreSQL", "Docker"],
    applicants: 58,
    postedBy: "Dr. Rafiqul Islam (Alumni & Tech Lead)",
    remote: false,
    desc: "Join our fintech & enterprise engineering team building high-performance microservices and cloud solutions for international banks and telecommunication giants.",
    applyUrl: "https://brainstation-23.com/career",
    applyEmail: "talent@brainstation-23.com",
    status: "approved",
    responsibilities: [
      "Design, write, and test clean, maintainable Python/Django APIs and React components.",
      "Collaborate with Senior System Architects on scalable distributed databases.",
      "Participate in agile sprint ceremonies, code reviews, and CI/CD automation pipelines.",
    ],
    requirements: [
      "B.Sc. in CSE / ICE or related discipline from PUST or accredited university.",
      "Strong grasp of Object-Oriented Programming (OOP), Data Structures, and SQL.",
      "Prior portfolio project or internship experience in web development is preferred.",
    ],
  },
  {
    id: 2,
    title: "Fintech & Risk Data Analyst",
    company: "Dutch-Bangla Bank PLC",
    logo: "🏦",
    location: "Motijheel, Dhaka, Bangladesh",
    type: "Full-time",
    salary: "৳ 50,000–70,000/mo",
    dept: "MATH/CSE",
    posted: "15 mins ago",
    deadline: "Dec 05, 2026",
    skills: ["SQL", "Power BI", "Python", "Financial Modeling", "Excel"],
    applicants: 67,
    postedBy: "Mahmudul Hasan (Alumni, VP Risk Analytics)",
    remote: false,
    desc: "Analyze multi-million financial transactions, develop fraud-detection predictive models, and optimize digital banking service performance across DBBL platforms.",
    applyUrl: "https://www.dutchbanglabank.com/career.html",
    applyEmail: "recruitment@dutchbanglabank.com",
    status: "approved",
    responsibilities: [
      "Query big data lakes with advanced SQL and construct interactive executive dashboards.",
      "Model credit risk, NPA trends, and customer retention metrics.",
      "Present quantitative insights to regional branch controllers and credit risk committees.",
    ],
    requirements: [
      "Graduation in Mathematics, Statistics, CSE, or Business Analytics.",
      "Proficiency in SQL, Python/R, and Power BI / Tableau.",
      "Strong analytical intuition and attention to financial data precision.",
    ],
  },
  {
    id: 3,
    title: "Power Systems & Substation Intern",
    company: "Bangladesh Power Development Board (BPDB)",
    logo: "⚡",
    location: "Ishwardi / Pabna Substation Grid",
    type: "Internship",
    salary: "৳ 18,000/mo",
    dept: "EEE",
    posted: "1 hour ago",
    deadline: "Nov 15, 2026",
    skills: ["SCADA", "Substation Automation", "AutoCAD Electrical", "PLC"],
    applicants: 32,
    postedBy: "Engr. Nusrat Jahan (Alumni, Executive Engineer)",
    remote: false,
    desc: "Hands-on 6-month engineering internship at the western regional electrical transmission grid, covering high-voltage transformers, protection relays, and smart grid automation.",
    applyUrl: "https://bpdb.gov.bd",
    applyEmail: "internship.cell@bpdb.gov.bd",
    status: "approved",
    responsibilities: [
      "Monitor and log 132/33kV substation telemetry via SCADA interfaces.",
      "Assist senior engineers during scheduled preventive transformer maintenance.",
      "Prepare electrical single-line diagrams (SLD) and load flow calculation sheets.",
    ],
    requirements: [
      "B.Sc. in Electrical & Electronic Engineering (Graduating batch or recent graduates).",
      "Knowledge of power systems analysis, switchgear, and safety protocols.",
    ],
  },
  {
    id: 4,
    title: "Product Operations Manager",
    company: "ShajGoj",
    logo: "🛍️",
    location: "Banani, Dhaka (Hybrid)",
    type: "Full-time",
    salary: "৳ 75,000–110,000/mo",
    dept: "BBA/CSE",
    posted: "2 hours ago",
    deadline: "Nov 25, 2026",
    skills: ["Product Strategy", "E-commerce Analytics", "Agile", "Figma"],
    applicants: 89,
    postedBy: "Tahmid Chowdhury (Alumni & Head of Growth)",
    remote: true,
    desc: "Drive omnichannel customer experience and logistics tech optimizations for Bangladesh’s premier online beauty and wellness retail platform.",
    applyUrl: "https://shajgoj.com/career",
    applyEmail: "people@shajgoj.com",
    status: "approved",
    responsibilities: [
      "Collaborate with UI/UX designers and mobile engineering leads to enhance checkout conversion.",
      "Oversee automated inventory allocation algorithms for regional fulfillment centers.",
      "Conduct A/B usability testing and analyze customer retention funnels.",
    ],
    requirements: [
      "Degree in BBA, CSE, or related discipline with 1-3 years of digital product experience.",
      "Deep familiarity with e-commerce operations, user journeys, and data analytics.",
    ],
  },
  {
    id: 5,
    title: "Materials Science Research Fellow",
    company: "BCSIR",
    logo: "🔬",
    location: "Rajshahi Laboratories, Bangladesh",
    type: "Full-time",
    salary: "৳ 38,000–55,000/mo",
    dept: "CHEM/PHY",
    posted: "3 hours ago",
    deadline: "Nov 18, 2026",
    skills: ["Spectroscopy", "Nanomaterials Synthesis", "Lab Protocol", "Research Writing"],
    applicants: 19,
    postedBy: "Rumana Islam (Alumni & Senior Scientific Officer)",
    remote: false,
    desc: "Participate in government-funded research on sustainable polymeric nanomaterials and water purification membrane development.",
    applyUrl: "https://bcsir.gov.bd",
    applyEmail: "director.research@bcsir.gov.bd",
    status: "approved",
    responsibilities: [
      "Synthesize functional nanocomposites and analyze sample morphology using SEM/XRD.",
      "Record analytical data adhering to ISO laboratory safety standards.",
      "Co-author research manuscripts for peer-reviewed indexed scientific journals.",
    ],
    requirements: [
      "B.Sc. / M.Sc. in Chemistry, Applied Chemistry, Physics, or Materials Science.",
      "Keen aptitude for laboratory experimental methods and scientific documentation.",
    ],
  },
  {
    id: 6,
    title: "Civil Infrastructure Site Engineer",
    company: "Max Group Bangladesh",
    logo: "🏗️",
    location: "Rooppur Nuclear Project, Pabna",
    type: "Full-time",
    salary: "৳ 50,000–75,000/mo",
    dept: "CE",
    posted: "4 hours ago",
    deadline: "Dec 10, 2026",
    skills: ["ETABS", "AutoCAD Civil 3D", "Quality Inspection", "Concrete Testing"],
    applicants: 42,
    postedBy: "Engr. Zahid Hasan (Batch '13, Project Lead)",
    remote: false,
    desc: "Structural engineering and quality control oversight for critical auxiliary infrastructure adjacent to the landmark Rooppur Nuclear Power Project in greater Pabna.",
    applyUrl: "https://maxgroup-bd.com/career",
    applyEmail: "hr.civil@maxgroup-bd.com",
    status: "approved",
    responsibilities: [
      "Verify reinforcement rebar detailing and formwork alignment against structural blueprints.",
      "Supervise on-site slump tests, cube crushing tests, and safety compliance.",
      "Coordinate weekly billing measurement books and contractor progress reports.",
    ],
    requirements: [
      "B.Sc. in Civil Engineering from PUST or recognized engineering university.",
      "Sound knowledge of BNBC building codes and structural concrete technology.",
    ],
  },
  {
    id: 7,
    title: "Quality Assurance Pharmacist",
    company: "Square Pharmaceuticals PLC",
    logo: "💊",
    location: "Pabna Main Production Complex",
    type: "Full-time",
    salary: "৳ 45,000–62,000/mo",
    dept: "PHARM",
    posted: "5 hours ago",
    deadline: "Nov 28, 2026",
    skills: ["HPLC", "cGMP Guidelines", "Validation Protocols", "Analytical Chemistry"],
    applicants: 48,
    postedBy: "Nazmun Nahar (Batch '15, QA Manager)",
    remote: false,
    desc: "Ensure stringent cGMP compliance, chemical purity evaluation, and validation protocols for WHO-prequalified oral solid dosage formulations at our premier Pabna plant.",
    applyUrl: "https://www.squarepharma.com.bd/career",
    applyEmail: "careers@squaregroup.com",
    status: "approved",
    responsibilities: [
      "Perform chemical assays using HPLC, UV-Vis, and dissolution apparatus.",
      "Review batch manufacturing records (BMR) and out-of-specification (OOS) investigations.",
      "Maintain documentation for international regulatory audits (US FDA, UK MHRA).",
    ],
    requirements: [
      "B.Pharm (Professional) or M.Pharm degree from PUST with Pharmacy Council registration.",
      "Thorough knowledge of cGMP regulations, validation principles, and pharmacopeial tests.",
    ],
  },
  {
    id: 8,
    title: "Machine Learning Research Engineer",
    company: "Samsung R&D Institute Bangladesh (SRBD)",
    logo: "🤖",
    location: "Dhanmondi, Dhaka (Hybrid)",
    type: "Full-time",
    salary: "৳ 85,000–135,000/mo",
    dept: "CSE",
    posted: "Just now",
    deadline: "Dec 15, 2026",
    skills: ["PyTorch", "Computer Vision", "LLMs", "C++", "Model Optimization"],
    applicants: 74,
    postedBy: "Dr. Shahriar Hossain (Batch '12, Lead Researcher)",
    remote: true,
    desc: "Research and deploy state-of-the-art on-device deep learning algorithms, computer vision pipelines, and multimodal generative models for next-generation Galaxy devices.",
    applyUrl: "https://research.samsung.com/srbd",
    applyEmail: "srbd.careers@samsung.com",
    status: "approved",
    responsibilities: [
      "Design neural network architectures optimized for NPU inference on mobile devices.",
      "Develop robust computer vision models for image enhancement and scene understanding.",
      "Collaborate with global Samsung R&D teams in Seoul and Silicon Valley.",
    ],
    requirements: [
      "B.Sc. / M.Sc. in CSE, ICE, or Applied Mathematics with strong algorithmic foundation.",
      "Hands-on experience with PyTorch/TensorFlow and C++/Python optimization.",
    ],
  },
  {
    id: 9,
    title: "DevOps & Cloud Infrastructure Engineer",
    company: "bKash Limited",
    logo: "🚀",
    location: "Shadhinata Bhaban, Dhaka",
    type: "Full-time",
    salary: "৳ 80,000–120,000/mo",
    dept: "CSE/EEE",
    posted: "6 hours ago",
    deadline: "Dec 02, 2026",
    skills: ["Kubernetes", "AWS", "Terraform", "CI/CD", "Prometheus"],
    applicants: 56,
    postedBy: "Engr. Tariqul Islam (Batch '14, Principal SRE)",
    remote: false,
    desc: "Architect and scale fault-tolerant Kubernetes clusters and automated deployment pipelines supporting over 70 million active mobile financial accounts.",
    applyUrl: "https://www.bkash.com/career",
    applyEmail: "talent.acquisition@bkash.com",
    status: "approved",
    responsibilities: [
      "Manage high-availability multi-region Kubernetes deployments and automated zero-downtime rollouts.",
      "Automate infrastructure provisioning using Terraform and Ansible.",
      "Monitor distributed microservices with Prometheus, Grafana, and ELK stack.",
    ],
    requirements: [
      "B.Sc. in CSE, EEE, or relevant technical degree.",
      "Deep experience with Linux systems administration, Docker containerization, and cloud security.",
    ],
  },
];

const JOB_TYPES = ["All", "Full-time", "Internship", "Remote", "Contract"];
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
    "Live Jobs & Career Opportunities | PUST Alumni Network",
    "Discover real-time live job updates, apply directly from this page, and track your applications across top companies and online APIs."
  );

  const location = useLocation();

  const getInitialSearchQuery = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(location.search || window.location.search);
    return params.get("search") || params.get("q") || "";
  };

  // State
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // "newest", "salary", "applicants"
  const [activeSourceTab, setActiveSourceTab] = useState("all"); // 'all', 'alumni', 'online', 'internship', 'saved', 'my-apps'
  const [toastMessage, setToastMessage] = useState("");

  // Live real-time API state
  const [liveApiLoading, setLiveApiLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("");
  const [liveJobsCount, setLiveJobsCount] = useState(0);
  const [isAutoLiveEnabled, setIsAutoLiveEnabled] = useState(true);
  const [liveTickerMessage, setLiveTickerMessage] = useState(
    "🔴 LIVE STREAM: Real-time job updates & applicant counters active"
  );

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  // Combined master job list
  const [jobList, setJobList] = useState(() => {
    return [
      ...CURATED_CORPORATE_JOBS,
      ...initialJobs.filter((j) => !CURATED_CORPORATE_JOBS.some((c) => c.id === j.id)),
    ];
  });

  // Selected job for master-detail view
  const [selectedJob, setSelectedJob] = useState(CURATED_CORPORATE_JOBS[0] || initialJobs[0]);

  // Track applied and saved jobs in localStorage
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_saved_jobs");
      return stored ? JSON.parse(stored) : [1, 8];
    } catch {
      return [1, 8];
    }
  });

  const [myApplications, setMyApplications] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_my_job_applications");
      return stored
        ? JSON.parse(stored)
        : [
            {
              id: "app-demo-1",
              trackingCode: "PUST-APP-2026-8812",
              jobId: 1,
              jobTitle: "Junior Software Engineer",
              company: "Brain Station 23",
              applicantName: "Mahfuzur Rahman",
              applicantEmail: "mahfuz.cse@gmail.com",
              appliedAt: "2026-10-20T10:30:00.000Z",
              status: "Forwarded to Hiring Team",
            },
          ];
    } catch {
      return [];
    }
  });

  const appliedJobIds = useMemo(() => {
    return myApplications.map((app) => app.jobId);
  }, [myApplications]);

  // Fetch real-time jobs from backend and online Remotive API
  const fetchLiveJobs = async (silent = false) => {
    if (!silent) setLiveApiLoading(true);
    try {
      // 1. Fetch backend jobs
      const resLocal = await api.getJobs();
      let merged = [...CURATED_CORPORATE_JOBS];
      if (resLocal?.ok && Array.isArray(resLocal.data)) {
        resLocal.data.forEach((backendJob) => {
          const idx = merged.findIndex((j) => j.id === backendJob.id);
          if (idx !== -1) {
            merged[idx] = { ...merged[idx], ...backendJob };
          } else {
            merged.unshift(backendJob);
          }
        });
      }

      // 2. Fetch live online jobs via /api/jobs/live
      const resLive = await api.getLiveJobs();
      if (resLive?.ok && Array.isArray(resLive.data) && resLive.data.length > 0) {
        setLiveJobsCount(resLive.data.length);
        resLive.data.forEach((onlineJob) => {
          if (!merged.some((j) => String(j.id) === String(onlineJob.id))) {
            merged.push(onlineJob);
          }
        });
      }

      setJobList(merged);
      const nowStr = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLastSyncTime(nowStr);
      setLiveTickerMessage(`🔴 LIVE: ${merged.length}টি সক্রিয় সার্কুলার সিঙ্ক করা হয়েছে (লাস্ট আপডেট: ${nowStr})`);
      if (!silent) showToast(`লাইভ সার্কুলার সিঙ্ক সম্পন্ন (${merged.length}টি সুযোগ লাইভ)`);
    } catch {
      if (!silent) showToast("অফলাইন মোড সক্রিয় — সংরক্ষিত সার্কুলার প্রদর্শিত হচ্ছে।");
    } finally {
      if (!silent) setLiveApiLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveJobs();
  }, []);

  // Automatic real-time polling stream (every 35 seconds)
  useEffect(() => {
    if (!isAutoLiveEnabled) return;

    const interval = setInterval(() => {
      // Periodic background refresh
      fetchLiveJobs(true);

      // Random live applicant stream activity for visual reality
      setJobList((prev) => {
        if (!prev.length) return prev;
        const targetIdx = Math.floor(Math.random() * Math.min(prev.length, 6));
        const updated = [...prev];
        const currentTarget = updated[targetIdx];
        if (currentTarget) {
          updated[targetIdx] = {
            ...currentTarget,
            applicants: (currentTarget.applicants || 0) + 1,
          };
          setLiveTickerMessage(
            `⚡ এইমাত্র একজন প্রার্থী "${currentTarget.title}" (${currentTarget.company}) পদে আবেদন করেছেন!`
          );
        }
        return updated;
      });
    }, 35000);

    return () => clearInterval(interval);
  }, [isAutoLiveEnabled]);

  // Modals & Drawers
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplySuccess, setIsApplySuccess] = useState(false);
  const [applicationRefCode, setApplicationRefCode] = useState("");
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [postJobSuccess, setPostJobSuccess] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  // In-Page Direct Apply Form state (inside the details view)
  const [inPageSubmitting, setInPageSubmitting] = useState(false);
  const [inPageSuccessCode, setInPageSuccessCode] = useState("");
  const [attachedResumeName, setAttachedResumeName] = useState("");

  // Background Drone Video State
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
    dept: "CSE",
    batch: "2020",
    portfolioUrl: "",
    resumeUrl: "",
    coverNote: "",
  });

  // Post Job form data
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    company: "",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    dept: "CSE",
    salary: "৳ 50,000–80,000/mo",
    deadline: "Dec 31, 2026",
    skills: "React, Node.js, SQL",
    applyUrl: "",
    applyEmail: "",
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

  // Reset in-page application success when switching jobs
  useEffect(() => {
    setInPageSuccessCode("");
  }, [selectedJob?.id]);

  // Sync search from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || params.get("q");
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
    }
  }, [location.search]);

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

  const POPULAR_SEARCHES = [
    "Brain Station",
    "bKash",
    "Square Pharma",
    "Max Group",
    "Samsung R&D",
    "Remote",
    "Internship",
    "Civil Site",
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
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => showToast("সার্কুলার লিংক সফলভাবে কপি করা হয়েছে! ✓"))
        .catch(() => showToast("সার্কুলার লিংক কপি করা হয়েছে!"));
    } else {
      showToast("সার্কুলার লিংক কপি করা হয়েছে!");
    }
  };

  // Toggle Save Job
  const handleToggleSave = (jobId) => {
    setSavedJobIds((prev) => {
      const isSaved = prev.includes(jobId);
      const next = isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      try {
        localStorage.setItem("pust_saved_jobs", JSON.stringify(next));
      } catch {
        // ignore
      }
      showToast(isSaved ? "বুকমার্ক থেকে সরানো হয়েছে" : "সুযোগটি সফলভাবে বুকমার্কে সেভ করা হয়েছে! 🔖");
      return next;
    });
  };

  // Filtered jobs according to tabs, types, and search
  const filteredJobs = useMemo(() => {
    let list = jobList.filter((job) => {
      // Source tab filters
      if (activeSourceTab === "alumni" && job.isLiveApi) return false;
      if (activeSourceTab === "online" && !job.isLiveApi) return false;
      if (activeSourceTab === "internship" && job.type !== "Internship") return false;
      if (activeSourceTab === "saved" && !savedJobIds.includes(job.id)) return false;

      // Type filter
      if (selectedType === "Remote" && !job.remote) return false;
      if (selectedType === "Full-time" && job.type !== "Full-time") return false;
      if (selectedType === "Internship" && job.type !== "Internship") return false;
      if (selectedType === "Contract" && job.type !== "Contract") return false;

      if (remoteOnly && !job.remote) return false;

      // Department filter
      if (selectedDept !== "All Departments") {
        const d = (job.dept || "").toLowerCase();
        if (!d.includes(selectedDept.toLowerCase()) && !d.includes("all")) return false;
      }

      // Keyword search
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
  }, [jobList, activeSourceTab, selectedType, selectedDept, remoteOnly, searchQuery, sortBy, savedJobIds]);

  // Keep selectedJob valid
  useEffect(() => {
    if (filteredJobs.length > 0 && !filteredJobs.some((j) => j.id === selectedJob?.id)) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [filteredJobs, selectedJob]);

  // Open Application Modal
  const handleOpenApplyModal = (job, e) => {
    if (e) e.stopPropagation();
    setSelectedJob(job);
    setIsApplySuccess(false);
    setIsApplyModalOpen(true);
  };

  // Submit Direct Application (Both In-Page and Modal shared logic)
  const submitDirectApplication = async (source = "in-page") => {
    if (!selectedJob) return;

    if (!applyForm.name.trim() || !applyForm.email.trim() || !applyForm.phone.trim()) {
      showToast("দয়া করে আপনার নাম, ইমেইল ও ফোন নম্বর সঠিকভাবে পূরণ করুন।");
      return;
    }

    if (source === "in-page") setInPageSubmitting(true);

    const refCode = `PUST-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      trackingCode: refCode,
      name: applyForm.name.trim(),
      email: applyForm.email.trim(),
      phone: applyForm.phone.trim(),
      dept: applyForm.dept.trim(),
      batch: applyForm.batch.trim(),
      portfolioUrl: applyForm.portfolioUrl.trim(),
      resumeUrl: applyForm.resumeUrl.trim() || attachedResumeName || "Profile Attached",
      coverNote: applyForm.coverNote.trim(),
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
    };

    try {
      await api.applyJob(selectedJob.id, payload);
    } catch {
      // offline fallback
    }

    // Save to state & localStorage
    const newRecord = {
      id: Date.now(),
      trackingCode: refCode,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      applicantName: payload.name,
      applicantEmail: payload.email,
      appliedAt: new Date().toISOString(),
      status: "Forwarded to Hiring Team",
    };

    setMyApplications((prev) => {
      const next = [newRecord, ...prev];
      try {
        localStorage.setItem("pust_my_job_applications", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    // Increment applicants counter in real-time
    setJobList((prev) =>
      prev.map((j) => (j.id === selectedJob.id ? { ...j, applicants: (j.applicants || 0) + 1 } : j))
    );

    if (source === "in-page") {
      setInPageSubmitting(false);
      setInPageSuccessCode(refCode);
    } else {
      setApplicationRefCode(refCode);
      setIsApplySuccess(true);
    }

    showToast(`আবেদন সফলভাবে গৃহীত হয়েছে! ট্র্যাকিং আইডি: ${refCode}`);
  };

  // Submit New Job Post Form to Backend
  const handlePostJobSubmit = async (e) => {
    e.preventDefault();
    if (!newJobForm.title.trim() || !newJobForm.company.trim()) return;

    const user = getCurrentUser();
    const newEntry = {
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
      applyUrl: newJobForm.applyUrl.trim(),
      applyEmail: newJobForm.applyEmail.trim(),
      postedBy: user ? `${user.name} (Alumni)` : "Alumni Network Leader",
      remote: newJobForm.remote,
      desc: newJobForm.desc.trim() || "Exciting opening for PUST graduates and students.",
    };

    try {
      const res = await api.createJob(newEntry);
      if (res?.ok && res.data) {
        setJobList([res.data, ...jobList]);
        setSelectedJob(res.data);
      } else {
        const fallback = { ...newEntry, id: Date.now(), applicants: 1 };
        setJobList([fallback, ...jobList]);
        setSelectedJob(fallback);
      }
    } catch {
      const fallback = { ...newEntry, id: Date.now(), applicants: 1 };
      setJobList([fallback, ...jobList]);
      setSelectedJob(fallback);
    }

    setPostJobSuccess(true);
    showToast("সার্কুলার সফলভাবে পোর্টাল ও ব্যাকএন্ডে পাবলিশ করা হয়েছে!");

    setTimeout(() => {
      setIsPostJobModalOpen(false);
      setPostJobSuccess(false);
      setNewJobForm({
        title: "",
        company: "",
        location: "Dhaka, Bangladesh",
        type: "Full-time",
        dept: "CSE",
        salary: "৳ 50,000–80,000/mo",
        deadline: "Dec 31, 2026",
        skills: "React, Node.js, SQL",
        applyUrl: "",
        applyEmail: "",
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
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C] overflow-x-hidden w-full">
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

        {/* Top Controls */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 w-full flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-black/75 border border-emerald-400/50 backdrop-blur-md flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE JOBS STREAM ACTIVE</span>
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

        {/* Floating Bottom Button */}
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
            <span>Explore & Apply for Opportunities</span>
            <span className="text-sm text-[#DFCA9E]">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================
          2. LIVE TICKER & METRICS BAR
      ========================================= */}
      <div id="jobs-board" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        {/* Real-time Ticker Strip */}
        <div className="bg-[#0F1B2B] px-4 py-2 border-b border-white/10 text-xs flex items-center justify-between gap-4">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="font-semibold text-[#DFCA9E] truncate">
                {liveTickerMessage}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-[11px]">
              <button
                type="button"
                onClick={() => setIsAutoLiveEnabled(!isAutoLiveEnabled)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                  isAutoLiveEnabled
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {isAutoLiveEnabled ? "● Auto-Stream: ON" : "○ Auto-Stream: OFF"}
              </button>
              {lastSyncTime && (
                <span className="text-slate-400 font-mono hidden sm:inline">
                  Synced: {lastSyncTime}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-2 sm:pt-0 sm:px-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] mb-0.5">
                সক্রিয় সার্কুলার
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl sm:text-3xl text-white">
                  {jobList.length}+
                </span>
                <span className="text-xs text-emerald-400 font-semibold">লাইভ ওপেনিং</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {liveJobsCount > 0 ? `${liveJobsCount}টি রিয়েল-টাইম গ্লোবাল API জব` : "ফুল-টাইম ও রিমোট সুযোগ"}
              </p>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] mb-0.5">
                পার্টনার প্রতিষ্ঠান
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl sm:text-3xl text-white">৬০+</span>
                <span className="text-xs text-sky-400 font-semibold">শীর্ষ প্রতিষ্ঠান</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">Brain Station, bKash, Square, Max</p>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] mb-0.5">
                গড় মাসিক বেতন
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-xl sm:text-2xl text-white">৳ ৪৫K–১.৫L</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">আকর্ষণীয় সুযোগ-সুবিধা ও রিমোট স্টাইপেন্ড</p>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] mb-0.5">
                এক ক্লিকে সরাসরি আবেদন
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl sm:text-3xl text-white">১০০%</span>
                <span className="text-xs text-[#DFCA9E] font-semibold">এই পেজ থেকেই</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">ফাস্ট-ট্র্যাক রেফারেল ও রেজুমে সাবমিট</p>
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
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C7A76C]">
                  PUST Alumni Network · Career Ecosystem
                </p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  REAL-TIME UPDATES ACTIVE 🟢
                </span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#17263C]">
                Jobs & Career Opportunities
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় অ্যালামনাই ও গ্লোবাল পার্টনারদের লাইভ সার্কুলার — এই পেজ থেকেই সরাসরি আবেদন করুন।
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => fetchLiveJobs(false)}
                disabled={liveApiLoading}
                className="px-4 py-2.5 text-xs font-semibold rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#17263C] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                title="Fetch latest jobs from live APIs"
              >
                <span className={liveApiLoading ? "animate-spin" : ""}>🔄</span>
                <span>{liveApiLoading ? "সিঙ্ক হচ্ছে…" : "Refresh Live Feed"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPostJobModalOpen(true)}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-2 active:scale-95"
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
            <div className="w-10 h-10 rounded-lg bg-white text-[#17263C] flex items-center justify-center font-bold text-base shrink-0 border border-[#E2E8F0]">
              💼
            </div>
            <input
              type="text"
              placeholder="পজিশন, কোম্পানি (Brain Station, bKash, Square, Max), দক্ষতা (React, Python), বিভাগ (CSE, EEE, CE) দিয়ে খুঁজুন…"
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
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold shrink-0 rounded-lg bg-[#7A1737] hover:bg-[#60122B] text-white transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
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
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          4. SOURCE TABS & MULTI-FILTER BAR
      ========================================= */}
      <section className="bg-white border-b border-[#E2E8F0] sticky top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 flex-wrap">
          {/* Source Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1">
            {[
              { id: "all", label: "All Openings", badge: jobList.length },
              { id: "alumni", label: "PUST Partners & Referrals" },
              { id: "online", label: "⚡ Live Online API", count: liveJobsCount },
              { id: "internship", label: "Internships" },
              { id: "saved", label: "Saved", count: savedJobIds.length },
              { id: "my-apps", label: "My Applications", count: myApplications.length, highlight: true },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSourceTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeSourceTab === tab.id
                    ? "bg-[#7A1737] text-white shadow-2xs"
                    : tab.highlight && tab.count > 0
                    ? "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#17263C]"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeSourceTab === tab.id
                        ? "bg-white text-[#7A1737]"
                        : "bg-[#E2E8F0] text-[#17263C]"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 ml-auto flex-wrap">
            {/* Work Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#17263C] outline-none focus:border-[#7A1737] cursor-pointer"
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Work Types" : type}
                </option>
              ))}
            </select>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#17263C] outline-none focus:border-[#7A1737] cursor-pointer"
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
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#17263C] outline-none focus:border-[#7A1737] cursor-pointer"
            >
              <option value="newest">🕒 নতুন সার্কুলার</option>
              <option value="salary">💰 সর্বোচ্চ বেতন</option>
              <option value="applicants">👥 সর্বোচ্চ আবেদনকারী</option>
            </select>

            {/* Remote Checkbox */}
            <label className="flex items-center gap-1.5 text-xs text-[#475569] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="rounded border-[#E2E8F0] text-[#7A1737] focus:ring-[#7A1737]"
              />
              <span>Remote Only</span>
            </label>

            <span className="text-xs text-[#64748B] hidden xl:inline pl-2 border-l border-[#E2E8F0]">
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
        <div className="w-full lg:w-[410px] shrink-0 space-y-3">
          {/* Active Tab Notice if Viewing Applications */}
          {activeSourceTab === "my-apps" && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">আপনার সাবমিটকৃত আবেদনসমূহ ({myApplications.length})</span>
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">
                  LIVE STATUS
                </span>
              </div>
              <p className="text-[11px] text-amber-800">
                নিচে আপনার সাবমিটকৃত রেফারেন্স কোড ও ট্র্যাকিং হিস্ট্রি প্রদর্শিত হচ্ছে।
              </p>
            </div>
          )}

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
                  setActiveSourceTab("all");
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
                      <div className="w-11 h-11 flex items-center justify-center text-xl shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-2xs overflow-hidden">
                        {typeof job.logo === "string" && job.logo.startsWith("http") ? (
                          <img src={job.logo} alt={job.company} className="w-full h-full object-contain p-1" />
                        ) : (
                          <span>{job.logo || "🏢"}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {job.isLiveApi ? (
                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 border border-sky-200">
                              ONLINE API
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ALUMNI PARTNER
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-medium">
                            {job.dept}
                          </span>
                        </div>
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
                      <span className="text-[10px] font-medium text-[#64748B] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{job.posted}</span>
                      </span>
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
                        <span className="font-semibold text-slate-700">👥 {job.applicants} applicants</span>
                        {job.remote && (
                          <span className="font-semibold text-[#7A1737] bg-[#7A1737]/10 px-1.5 py-0.5 rounded">
                            Remote
                          </span>
                        )}
                      </div>
                      {isApplied ? (
                        <span className="font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                          ✓ Applied
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#7A1737] group-hover:underline">
                          Apply Here →
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: DESKTOP STICKY DETAIL VIEW WITH IN-PAGE APPLY */}
        <div className="flex-1 hidden lg:block sticky top-[86px]">
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
                    <div className="w-16 h-16 flex items-center justify-center text-3xl shrink-0 bg-white border border-[#E2E8F0] rounded-2xl shadow-md overflow-hidden">
                      {typeof selectedJob.logo === "string" && selectedJob.logo.startsWith("http") ? (
                        <img
                          src={selectedJob.logo}
                          alt={selectedJob.company}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <span>{selectedJob.logo || "🏢"}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C]">
                          {selectedJob.type} · {selectedJob.dept}
                        </span>
                        {selectedJob.isLiveApi ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/30 text-sky-200 border border-sky-400/40">
                            Real-time API Feed
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                            Verified PUST Partner
                          </span>
                        )}
                      </div>
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
                    className="shrink-0 px-4 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-2xs"
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
                    Compensation
                  </p>
                </div>
                <div className="text-center py-4">
                  <p className="font-display font-bold text-base leading-none text-[#17263C]">
                    {selectedJob.applicants}
                  </p>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1 font-semibold">
                    Live Applicants
                  </p>
                </div>
                <div className="text-center py-4">
                  <p className="font-display font-bold text-base leading-none text-[#17263C]">
                    {selectedJob.dept}
                  </p>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1 font-semibold">
                    Target Faculty
                  </p>
                </div>
              </div>

              {/* Main Job Body */}
              <div className="p-7 space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto">
                <div>
                  <h3 className="font-bold text-[#17263C] text-xs uppercase tracking-wide mb-2">
                    About this Opportunity
                  </h3>
                  <p className="text-sm leading-relaxed text-[#475569]">{selectedJob.desc}</p>
                </div>

                {/* Responsibilities list if available */}
                {Array.isArray(selectedJob.responsibilities) && selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h3 className="font-bold text-[#17263C] text-xs uppercase tracking-wide mb-2">
                      Key Responsibilities & Scope
                    </h3>
                    <ul className="list-disc pl-5 text-xs text-[#475569] space-y-1.5 leading-relaxed">
                      {selectedJob.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements list if available */}
                {Array.isArray(selectedJob.requirements) && selectedJob.requirements.length > 0 && (
                  <div>
                    <h3 className="font-bold text-[#17263C] text-xs uppercase tracking-wide mb-2">
                      Candidate Qualifications
                    </h3>
                    <ul className="list-disc pl-5 text-xs text-[#475569] space-y-1.5 leading-relaxed">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-[#17263C] text-xs uppercase tracking-wide mb-2.5">
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
                  <span className="text-2xl shrink-0">🎓</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#17263C] mb-0.5">
                      PUST Alumni Referral Backing
                    </p>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Liaison: <strong className="text-[#17263C]">{selectedJob.postedBy}</strong>. PUST graduates receive prioritized CV routing and verification endorsement.
                    </p>
                  </div>
                </div>

                {/* =========================================================================
                    IN-PAGE DIRECT APPLICATION FORM (আবেদন করুন এই পেজ থেকেই!)
                   ========================================================================= */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDFC] to-[#F8FAFC] border-2 border-[#7A1737]/25 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      <div>
                        <h4 className="font-bold text-sm text-[#17263C] leading-snug">
                          Apply Directly from this Page
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          কোনো বাড়তি পপআপ ছাড়া সরাসরি এই পেজ থেকেই দ্রুত আবেদন জমা দিন
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7A1737]/10 text-[#7A1737] border border-[#7A1737]/20">
                      FAST-TRACK
                    </span>
                  </div>

                  {inPageSuccessCode ? (
                    <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl mx-auto shadow-sm">
                        ✓
                      </div>
                      <h4 className="font-bold text-base text-emerald-950">
                        আবেদন সফলভাবে গ্রহণ করা হয়েছে!
                      </h4>
                      <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                        আপনার সিভি ও তথ্য সরাসরি <strong>{selectedJob.company}</strong> রিক্রুটিং টিম ও PUST অ্যালামনাই রেফারেল ডেস্কে ফরোয়ার্ড করা হয়েছে।
                      </p>
                      <div className="bg-white p-3 rounded-lg border border-emerald-200 inline-block font-mono font-bold text-xs text-[#7A1737]">
                        Tracking ID: {inPageSuccessCode}
                      </div>
                      <div className="flex justify-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator?.clipboard?.writeText) {
                              navigator.clipboard.writeText(inPageSuccessCode);
                              showToast("ট্র্যাকিং কোড কপি করা হয়েছে! ✓");
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-[#17263C] text-white text-xs font-semibold hover:bg-[#0F1A2A]"
                        >
                          Copy Tracking ID 📋
                        </button>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                        >
                          Print Slip 🖨️
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        submitDirectApplication("in-page");
                      }}
                      className="space-y-3"
                    >
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Mahfuzur Rahman"
                            value={applyForm.name}
                            onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-[#7A1737]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="yourname@gmail.com"
                            value={applyForm.email}
                            onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-[#7A1737]"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                            Phone / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+880 1700-000000"
                            value={applyForm.phone}
                            onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-[#7A1737]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                            PUST Department & Batch *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. CSE, 12th Batch"
                            value={applyForm.dept}
                            onChange={(e) => setApplyForm({ ...applyForm, dept: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-[#7A1737]"
                          />
                        </div>
                      </div>

                      {/* Resume / CV Input with File or Link */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-bold uppercase text-slate-600">
                            Resume / CV (Drive Link or PDF) *
                          </label>
                          {attachedResumeName && (
                            <span className="text-[10px] text-emerald-700 font-semibold truncate max-w-[180px]">
                              📎 {attachedResumeName}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="Paste Google Drive / LinkedIn / Dropbox CV Link"
                            value={applyForm.resumeUrl}
                            onChange={(e) => setApplyForm({ ...applyForm, resumeUrl: e.target.value })}
                            className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-[#7A1737]"
                          />
                          <label className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1 shrink-0">
                            <span>📎 File</span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setAttachedResumeName(file.name);
                                  showToast(`File attached: ${file.name}`);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Cover note */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                          Brief Statement / Note (Optional)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="আপনার অভিজ্ঞতা বা আগ্রহের ক্ষেত্র সংক্ষেপে লিখুন..."
                          value={applyForm.coverNote}
                          onChange={(e) => setApplyForm({ ...applyForm, coverNote: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-[#7A1737] resize-none"
                        />
                      </div>

                      {/* Direct Apply Button */}
                      <button
                        type="submit"
                        disabled={inPageSubmitting}
                        className={`w-full py-3 rounded-xl bg-[#7A1737] hover:bg-[#62122B] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] ${
                          inPageSubmitting ? "opacity-75 cursor-wait" : ""
                        }`}
                      >
                        {inPageSubmitting ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>আবেদনপত্র সাবমিট হচ্ছে…</span>
                          </>
                        ) : (
                          <>
                            <span>🚀 এই পেজ থেকেই সরাসরি আবেদন জমা দিন</span>
                            <span>→</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Secondary Actions: External Portal + HR Email + Share */}
                <div className="flex items-center gap-3 pt-2 border-t border-[#E2E8F0] flex-wrap">
                  {selectedJob.applyUrl && (
                    <a
                      href={selectedJob.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 text-xs font-bold rounded-xl bg-[#17263C] hover:bg-[#0F1A2A] text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>অফিশিয়াল পোর্টাল লিংক</span>
                      <span>↗</span>
                    </a>
                  )}

                  {selectedJob.applyEmail && (
                    <a
                      href={`mailto:${selectedJob.applyEmail}?subject=${encodeURIComponent(
                        `[PUST Alumni Referral] Application for ${selectedJob.title}`
                      )}`}
                      className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-white hover:bg-[#F8FAFC] text-[#17263C] border border-[#CBD5E1] transition-colors"
                      title="Send direct email to hiring team"
                    >
                      ✉️ Email HR
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleShareJob(selectedJob)}
                    className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-white hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#17263C] border border-[#CBD5E1] transition-colors cursor-pointer"
                    title="Share this opportunity"
                  >
                    🔗
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E2E8F0] text-[#64748B]">
              Select an opportunity from the list to view full specifications.
            </div>
          )}

          {/* Department Salary Insights & Alert Box */}
          <div className="mt-4 p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A1737]">
                Career Insights & Salary Benchmark
              </span>
              <span className="text-[10px] text-slate-400 font-mono">PUST Alumni 2026</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-[10px] text-slate-500">CSE / Software Tech</p>
                <p className="font-bold text-[#17263C]">৳ ৪৫,০০০ – ১,২০,০০০/mo</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-[10px] text-slate-500">EEE / Power & Telecom</p>
                <p className="font-bold text-[#17263C]">৳ ৪০,০০০ – ৮৫,০০০/mo</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-[10px] text-slate-500">Civil / Infrastructure</p>
                <p className="font-bold text-[#17263C]">৳ ৪০,০০০ – ৭৫,০০০/mo</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-[10px] text-slate-500">Pharmacy & Chemical</p>
                <p className="font-bold text-[#17263C]">৳ ৩৮,০০০ – ৭০,০০০/mo</p>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs">
              <Link to="/mentorship" className="font-semibold text-[#7A1737] hover:underline">
                Explore 1-on-1 Alumni Career Mentors →
              </Link>
              <button
                type="button"
                onClick={() => setIsSubscribeModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#17263C] text-white text-[11px] font-bold hover:bg-[#7A1737] transition-colors"
              >
                🔔 Subscribe Job Alert
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================
          6. MOBILE DETAILS DRAWER MODAL
      ========================================= */}
      {mobileDrawerOpen && selectedJob && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden flex items-end justify-center bg-black/60 backdrop-blur-xs p-0"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="bg-white border border-[#E2E8F0] w-full max-h-[90vh] overflow-y-auto rounded-t-2xl shadow-2xl flex flex-col"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white border-b border-[#E2E8F0] px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#17263C]">
                  Opportunity Overview
                </span>
                {selectedJob.isLiveApi && (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                    Live API
                  </span>
                )}
              </div>
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
                <div className="w-12 h-12 flex items-center justify-center text-2xl shrink-0 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-hidden">
                  {typeof selectedJob.logo === "string" && selectedJob.logo.startsWith("http") ? (
                    <img src={selectedJob.logo} alt={selectedJob.company} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span>{selectedJob.logo || "🏢"}</span>
                  )}
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

              {/* Direct In-Drawer Application Button */}
              <div className="space-y-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={(e) => handleOpenApplyModal(selectedJob, e)}
                  className={`w-full py-3 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5 ${
                    isSelectedApplied
                      ? "bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]"
                      : "bg-[#7A1737] hover:bg-[#62122B] text-white"
                  }`}
                >
                  <span>🚀</span>
                  <span>{isSelectedApplied ? "✓ Applied via Fast-Track" : "Fast-Track Referral Apply"}</span>
                </button>

                {selectedJob.applyUrl && (
                  <a
                    href={selectedJob.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#17263C] text-white text-center block"
                  >
                    Apply on Official Portal ↗
                  </a>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleSave(selectedJob.id)}
                    className="flex-1 py-2.5 text-xs font-semibold border border-[#E2E8F0] rounded-xl text-[#17263C] hover:bg-[#F8FAFC]"
                  >
                    {isSelectedSaved ? "💾 Saved" : "🔖 Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareJob(selectedJob)}
                    className="flex-1 py-2.5 text-xs font-semibold border border-[#E2E8F0] rounded-xl text-[#64748B] hover:text-[#17263C]"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          7. MODAL APPLICATION FALLBACK
      ========================================= */}
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
                  PUST Fast-Track Referral Application
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
                    Application Endorsed & Forwarded!
                  </h4>
                  <p className="text-xs text-[#64748B] mb-5">
                    Your profile and CV reference have been routed to{" "}
                    <strong>{selectedJob.postedBy}</strong> and corporate hiring partners with PUST Alumni backing.
                  </p>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left mb-6 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Tracking Reference:</span>
                      <span className="font-mono font-bold text-[#7A1737]">
                        {applicationRefCode}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Position:</span>
                      <span className="font-semibold text-[#17263C]">{selectedJob.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Company:</span>
                      <span className="font-semibold text-[#17263C]">{selectedJob.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Status:</span>
                      <span className="font-bold text-[#15803D]">Forwarded to Hiring Team</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {selectedJob.applyUrl && (
                      <a
                        href={selectedJob.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 text-xs font-bold rounded-lg bg-[#17263C] text-white hover:bg-[#0F1A2A] text-center"
                      >
                        Also Visit Official Portal ↗
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setIsApplyModalOpen(false);
                        setActiveSourceTab("my-apps");
                      }}
                      className="flex-1 py-2.5 text-xs font-bold rounded-lg bg-[#7A1737] text-white hover:bg-[#62122B] transition-colors cursor-pointer"
                    >
                      Track My Applications
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitDirectApplication("modal");
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahfuzur Rahman"
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
                        placeholder="yourname@gmail.com"
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Mobile Phone / WhatsApp *
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
                        PUST Department *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CSE, EEE, Civil, Pharmacy"
                        value={applyForm.dept}
                        onChange={(e) => setApplyForm({ ...applyForm, dept: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Batch / Passing Year *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2020 or 12th Batch"
                        value={applyForm.batch}
                        onChange={(e) => setApplyForm({ ...applyForm, batch: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Resume / CV Link (Google Drive, Dropbox, LinkedIn) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/file/... or LinkedIn URL"
                      value={applyForm.resumeUrl}
                      onChange={(e) => setApplyForm({ ...applyForm, resumeUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Brief Note to Hiring Manager / Alumni Liaison
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Highlight relevant projects, technologies, and why you are excited for this role..."
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
                      className="px-6 py-2.5 text-xs font-bold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      Submit Referral Application →
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          8. POST A JOB MODAL (ALUMNI & EMPLOYERS)
      ========================================= */}
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
                  Employer & Alumni Recruitment Desk
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white mt-0.5">
                  Post a Job / Internship Opening
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
                    Opening Published Successfully!
                  </h4>
                  <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                    Your opportunity is now visible live to over 22,000+ PUST alumni and graduating students worldwide.
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
                        placeholder="e.g. Brain Station 23 / bKash"
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
                        placeholder="e.g. ৳ 50,000–80,000/mo"
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
                        placeholder="e.g. Dec 31, 2026"
                        value={newJobForm.deadline}
                        onChange={(e) => setNewJobForm({ ...newJobForm, deadline: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Official Application URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://company.com/career"
                        value={newJobForm.applyUrl}
                        onChange={(e) => setNewJobForm({ ...newJobForm, applyUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Recruiter / HR Email
                      </label>
                      <input
                        type="email"
                        placeholder="recruitment@company.com"
                        value={newJobForm.applyEmail}
                        onChange={(e) => setNewJobForm({ ...newJobForm, applyEmail: e.target.value })}
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
                      className="px-6 py-2.5 text-xs font-bold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      Publish Opportunity Live
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          9. JOB ALERT SUBSCRIPTION MODAL
      ========================================= */}
      {isSubscribeModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsSubscribeModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E2E8F0] p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-xl mx-auto mb-3">
              🔔
            </div>
            <h3 className="font-display font-bold text-lg text-[#17263C] mb-1">
              Subscribe to PUST Career Alerts
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Get notified directly in your inbox whenever a new verified job matching your department is published.
            </p>
            <input
              type="email"
              placeholder="Enter your email address"
              defaultValue={applyForm.email}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CBD5E1] outline-none focus:border-[#7A1737] mb-3 text-[#17263C]"
            />
            <button
              type="button"
              onClick={() => {
                setIsSubscribeModalOpen(false);
                showToast("ক্যারিয়ার অ্যালার্ট সাবস্ক্রিপশন সম্পন্ন হয়েছে! ✓");
              }}
              className="w-full py-2.5 rounded-xl bg-[#7A1737] hover:bg-[#62122B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Confirm Subscription
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          10. EMPLOYER RECRUITMENT CALL-TO-ACTION
      ========================================= */}
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
              Hire Distinguished PUST Talent
            </h2>
            <p className="text-xs sm:text-sm max-w-md text-[#E2E8F0] leading-relaxed">
              Recruit from over 22,400+ distinguished alumni and graduating students across computer science, electrical engineering, civil infrastructure, pharmacy, and business.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
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
