import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { pa, wa, Ka, createInitialsAvatar } from "../../data/mockData";
import { api, getCurrentUser, useBackendSync } from "../../services/api";

const PUST_HALLS = [
  { id: "BSMR", name: "Bangabandhu Sheikh Mujibur Rahman Hall (বঙ্গবন্ধু শেখ মুজিবুর রহমান হল)" },
  { id: "JJ", name: "Shaheed Janani Jahanara Imam Hall (শহীদ জননী জাহানারা ইমাম হল)" },
  { id: "B24", name: "Bijoy 24 Hall (বিজয় ২৪ হল)" },
  { id: "PW", name: "Pritilata Waddedar Hall (প্রীতিলতা ওয়াদ্দেদার হল)" },
];

const PUST_DEPTS = [
  "Computer Science & Engineering (CSE)",
  "Electrical and Electronic Engineering (EEE)",
  "Civil Engineering (CE)",
  "Information & Communication Engineering (ICE)",
  "Electronic and Telecommunication Engineering (ETE)",
  "Mechanical Engineering (ME)",
  "Architecture (ARCH)",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Statistics",
  "Pharmacy",
  "Business Administration (BBA)",
  "Economics",
  "English",
  "Social Work",
  "Public Administration",
  "Urban & Regional Planning (URP)",
  "Geography and Environment",
  "History and Bangladesh Studies",
];

export default function DashboardProfile() {
  useBackendSync();

  const loadInitialProfile = () => {
    const raw = getCurrentUser();
    const isMock = !raw || !raw.name;
    const base = isMock ? pa[0] : raw;

    let cleanAvatar = base.avatar;
    if (!cleanAvatar || cleanAvatar.includes("unsplash.com")) {
      cleanAvatar = createInitialsAvatar(base.name || "PUST", base.role || "alumni");
    }

    return {
      id: base.id || Date.now(),
      name: base.name || "PUST Alumni",
      email: base.email || "",
      role: base.role || "alumni",
      dept: base.dept || "Computer Science & Engineering (CSE)",
      batch: base.batch || (base.role === "student" ? "2024" : "2020"),
      session: base.session || (base.batch ? `${base.batch}-${Number(base.batch) + 1}` : "2020-2021"),
      studentId: base.studentId || (isMock ? "0801042" : ""),
      regNo: base.regNo || (isMock ? "REG-PUST-2008-042" : ""),
      degree: base.degree || (base.role === "student" ? "B.Sc. Engineering" : "B.Sc. in Computer Science & Engineering"),
      hall: base.hall || "Bangabandhu Sheikh Mujibur Rahman Hall (বঙ্গবন্ধু শেখ মুজিবুর রহমান হল)",
      bloodGroup: base.bloodGroup || "B+",
      passingYear: base.passingYear || (base.batch ? String(Number(base.batch) + 4) : "2024"),
      convocation: base.convocation || "2nd Convocation (March 2026)",
      hometown: base.hometown || (isMock ? "Pabna, Bangladesh" : ""),
      phone: base.phone || (isMock ? "+880 1711-482910" : ""),
      location: base.location || "Dhaka, Bangladesh",
      company: base.company || (isMock ? "Brain Station 23" : ""),
      industry: base.industry || "Information Technology",
      headline: base.headline || `${base.role === "student" ? "Student" : "Alumni"}, ${base.dept || "PUST"}`,
      bio: base.bio || (isMock ? pa[0].bio : `Proud ${base.role === "student" ? "student" : "graduate"} of Pabna University of Science & Technology.`),
      avatar: cleanAvatar,
      verified: Boolean(base.verified),
      mentorAvailable: base.mentorAvailable !== false,
      mentorshipCount: base.mentorshipCount || (base.role === "alumni" ? (isMock ? 18 : 3) : 0),
      profileViews: base.profileViews || (isMock ? 284 : 45),
      connections: base.connections || (isMock ? 342 : 1),
      experience: Array.isArray(base.experience) ? base.experience : (isMock ? pa[0].experience : []),
      skills: Array.isArray(base.skills) && base.skills.length ? base.skills : [
        "System Architecture",
        "Python & Web",
        "Technical Mentorship",
      ],
      socialLinks: base.socialLinks || {
        linkedin: isMock ? "https://linkedin.com/in/rafiqul-islam-pust" : "",
        github: isMock ? "https://github.com/rafiqul-islam" : "",
        website: isMock ? "https://rafiqul.dev" : "",
      },
    };
  };

  const [user, setUser] = useState(loadInitialProfile);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "idcard" | "edit" | "privacy"
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState(() => user.skills || []);

  const fileInputRef = useRef(null);

  // Form State for Editing (Bound to live inputs)
  const [formData, setFormData] = useState({
    name: user.name,
    headline: user.headline,
    location: user.location,
    hometown: user.hometown,
    phone: user.phone,
    email: user.email,
    bloodGroup: user.bloodGroup,
    dept: user.dept,
    batch: user.batch,
    session: user.session,
    studentId: user.studentId,
    regNo: user.regNo,
    degree: user.degree,
    hall: user.hall,
    passingYear: user.passingYear,
    convocation: user.convocation,
    company: user.company,
    industry: user.industry,
    bio: user.bio,
    avatar: user.avatar,
    linkedin: user.socialLinks?.linkedin || "",
    github: user.socialLinks?.github || "",
    website: user.socialLinks?.website || "",
  });

  // Privacy toggles state
  const [privacy, setPrivacy] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_privacy_settings");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      publicVisibility: true,
      emailVisibility: false,
      searchVisibility: true,
      mentorshipAvailable: user.mentorAvailable !== false,
      phoneVisibility: false,
    };
  });

  const [privacyToast, setPrivacyToast] = useState("");
  const [copiedId, setCopiedId] = useState(false);

  // Sync state if external user updates or storage changes
  useEffect(() => {
    const fresh = loadInitialProfile();
    setUser(fresh);
    setSkills(fresh.skills);
    setFormData({
      name: fresh.name,
      headline: fresh.headline,
      location: fresh.location,
      hometown: fresh.hometown,
      phone: fresh.phone,
      email: fresh.email,
      bloodGroup: fresh.bloodGroup,
      dept: fresh.dept,
      batch: fresh.batch,
      session: fresh.session,
      studentId: fresh.studentId,
      regNo: fresh.regNo,
      degree: fresh.degree,
      hall: fresh.hall,
      passingYear: fresh.passingYear,
      convocation: fresh.convocation,
      company: fresh.company,
      industry: fresh.industry,
      bio: fresh.bio,
      avatar: fresh.avatar,
      linkedin: fresh.socialLinks?.linkedin || "",
      github: fresh.socialLinks?.github || "",
      website: fresh.socialLinks?.website || "",
    });
  }, []);

  // Guarantee old unsplash avatars in localStorage are immediately cleaned out
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pust_user");
      if (raw && raw.includes("unsplash.com")) {
        const parsed = JSON.parse(raw);
        parsed.avatar = createInitialsAvatar(parsed.name, parsed.role || "alumni");
        localStorage.setItem("pust_user", JSON.stringify(parsed));
        setUser((prev) => ({ ...prev, avatar: parsed.avatar }));
        setFormData((prev) => ({ ...prev, avatar: parsed.avatar }));
        window.dispatchEvent(new CustomEvent("pust-data-synced", { detail: parsed }));
      }
    } catch (e) {}
  }, []);

  // Live Composite Data: Updates in real-time as user types
  const activeData = useMemo(() => {
    return {
      ...user,
      ...formData,
      skills,
      socialLinks: {
        linkedin: formData.linkedin,
        github: formData.github,
        website: formData.website,
      },
    };
  }, [user, formData, skills]);

  // Current Avatar: Real photo (base64/data URL/real URL) or SVG Initials (Zero Stock/AI)
  const currentAvatarSrc = useMemo(() => {
    const rawAvatar = formData.avatar || user.avatar;
    if (rawAvatar && !rawAvatar.includes("unsplash.com")) {
      return rawAvatar;
    }
    return createInitialsAvatar(activeData.name || "PUST", user.role || "alumni");
  }, [formData.avatar, user.avatar, activeData.name, user.role]);

  // Real-Time Dynamic Profile Completion Percentage
  const completionScore = useMemo(() => {
    const checkFields = [
      activeData.name,
      activeData.email,
      activeData.phone,
      activeData.dept,
      activeData.batch,
      activeData.headline,
      activeData.studentId,
      activeData.location,
      activeData.bloodGroup,
      activeData.bio,
      currentAvatarSrc,
    ];
    const filled = checkFields.filter((f) => Boolean(f && String(f).trim())).length;
    return Math.min(100, Math.max(35, Math.round((filled / checkFields.length) * 100)));
  }, [activeData, currentAvatarSrc]);

  const togglePrivacy = (key) => {
    setPrivacy((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("pust_privacy_settings", JSON.stringify(updated));
      setPrivacyToast("Privacy settings updated.");
      setTimeout(() => setPrivacyToast(""), 2000);
      return updated;
    });
  };

  // Handle local real photo upload (zero AI, strictly local device FileReader)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Please upload a photo smaller than 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      setFormData((prev) => ({ ...prev, avatar: base64Data }));
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPhoto = (chosenAvatar) => {
    const targetAvatar = chosenAvatar || formData.avatar || currentAvatarSrc;
    const updatedPayload = {
      ...user,
      ...formData,
      avatar: targetAvatar,
      skills,
    };
    setUser(updatedPayload);
    setFormData((prev) => ({ ...prev, avatar: targetAvatar }));
    localStorage.setItem("pust_user", JSON.stringify(updatedPayload));
    window.dispatchEvent(new CustomEvent("pust-data-synced", { detail: updatedPayload }));
    try {
      api.updateProfile(user.id || updatedPayload.id || 1, updatedPayload);
    } catch (e) {}
    setShowAvatarModal(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    const nextSkills = [...skills, trimmed];
    setSkills(nextSkills);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    const updatedPayload = {
      ...user,
      ...formData,
      avatar: currentAvatarSrc,
      skills,
      socialLinks: {
        linkedin: formData.linkedin,
        github: formData.github,
        website: formData.website,
      },
      mentorAvailable: privacy.mentorshipAvailable,
    };

    // 1. Instantly update local state
    setUser(updatedPayload);
    setFormData((prev) => ({ ...prev, avatar: currentAvatarSrc }));

    // 2. Instantly persist to localStorage and broadcast real-time sync event
    localStorage.setItem("pust_user", JSON.stringify(updatedPayload));
    window.dispatchEvent(new CustomEvent("pust-data-synced", { detail: updatedPayload }));

    // 3. Persist to backend API
    try {
      await api.updateProfile(user.id || updatedPayload.id || 1, updatedPayload);
    } catch (e) {
      console.debug("Backend profile update fallback:", e);
    }

    setSavedSuccess(true);
    setActiveTab("overview");
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleCopyAlumniId = () => {
    const idToCopy = `PUST-ALM-${activeData.batch || "2026"}-${activeData.studentId || "0000"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(idToCopy);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Official University Insignia Options (Zero AI)
  const officialInsignias = [
    {
      name: "PUST Royal Maroon",
      c1: "#7A1737",
      c2: "#4F0D22",
      role: "alumni",
    },
    {
      name: "PUST Imperial Gold",
      c1: "#B5893C",
      c2: "#8A6321",
      role: "faculty",
    },
    {
      name: "PUST Deep Navy",
      c1: "#17263C",
      c2: "#0A131F",
      role: "employer",
    },
    {
      name: "PUST Academic Emerald",
      c1: "#006B3F",
      c2: "#00482B",
      role: "student",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* =========================================================================
          PHOTO MODAL: 100% REAL PHOTOS ONLY (NO AI / NO STOCK FACES)
         ========================================================================= */}
      {showAvatarModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#17263C]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowAvatarModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#C7A76C] relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7A1737]/10 border border-[#7A1737]/20 flex items-center justify-center text-[#7A1737] font-bold text-lg">
                  📸
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#17263C]">
                    Change Profile Photo
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Upload your real personal photo or use an official PUST insignia
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Current Preview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF5E8] border border-[#DECFA9] mb-5">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-3 ring-[#B5893C] shadow-md flex-shrink-0 bg-white">
                <img
                  src={currentAvatarSrc}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#17263C] truncate">{activeData.name}</p>
                <p className="text-xs text-[#75551E] font-medium">Active Profile Photo Preview</p>
                <p className="text-[11px] text-[#8C6524] mt-0.5">
                  ✓ High-resolution, professional alumni display
                </p>
              </div>
            </div>

            {/* Option 1: Real Local File Upload */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17263C] mb-2">
                1. Upload Your Real Photo (From Computer or Phone)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-[#7A1737]/40 hover:border-[#7A1737] bg-[#7A1737]/5 hover:bg-[#7A1737]/10 text-[#7A1737] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <span>📁</span>
                <span>Select Real Image File (JPEG, PNG, WebP — Max 3MB)</span>
              </button>
            </div>

            {/* Option 2: Real Personal Photo URL */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17263C] mb-1.5">
                2. Or Enter Personal Photo URL (e.g. LinkedIn, Portfolio)
              </label>
              <input
                type="url"
                placeholder="https://yourdomain.com/photo.jpg"
                value={formData.avatar.startsWith("data:") ? "" : formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
              />
            </div>

            {/* Option 3: Official PUST Crest & Monogram Insignias (NO AI FACES) */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17263C] mb-2">
                3. Or Official PUST University Insignia
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {officialInsignias.map((badge, idx) => {
                  const svgData = createInitialsAvatar(activeData.name || "PUST", badge.role);
                  const isSelected = formData.avatar === svgData;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: svgData })}
                      className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#7A1737] bg-[#7A1737]/10 ring-2 ring-[#7A1737]/30 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <img
                        src={svgData}
                        alt={badge.name}
                        className="w-10 h-10 rounded-full shadow-xs"
                      />
                      <span className="text-[10px] font-bold text-[#17263C] text-center leading-tight">
                        {badge.name.replace("PUST ", "")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleApplyPhoto(formData.avatar || currentAvatarSrc)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#7A1737] hover:bg-[#62122B] text-white shadow-md cursor-pointer transition-all active:scale-95"
              >
                Save & Apply Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          HERO PROFILE SHOWCASE BANNER (Real-Time Live Sync with Active Data)
         ========================================================================= */}
      <div className="rounded-3xl overflow-hidden border-2 border-[#C7A76C] bg-white shadow-xl relative">
        {/* Cover Photo: Real Campus Photo + Royal Gradient */}
        <div className="h-44 sm:h-52 relative overflow-hidden bg-[#17263C]">
          <img
            src={Ka}
            alt="PUST Campus"
            className="w-full h-full object-cover opacity-35 filter saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17263C] via-[#17263C]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17263C] via-transparent to-[#7A1737]/40" />

          {/* Top Institutional Badge Strip */}
          <div className="absolute top-3.5 left-4 sm:left-6 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#F8E7B9] border border-[#C7A76C]/60 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#E8CB80] animate-pulse" />
              <span className="font-bengali font-medium">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span>
            </span>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-semibold">
              Official Alumni Portal
            </span>
          </div>

          {/* Top-Right Quick Actions */}
          <div className="absolute top-3.5 right-4 sm:right-6 flex items-center gap-2">
            <Link
              to={`/alumni/${user.id || 1}`}
              className="px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#17263C] hover:text-[#7A1737] text-xs font-bold shadow-md transition-all flex items-center gap-1.5 backdrop-blur-md"
              title="View Public Profile as seen by others"
            >
              <span>Public Profile ↗</span>
            </Link>
          </div>
        </div>

        {/* Alumnus Identity Area */}
        <div className="px-5 sm:px-8 pb-7">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-5">
            {/* Real Alumnus Avatar with Golden Double Ring */}
            <div className="relative inline-block self-start">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-white p-1 border-3 border-[#C7A76C] shadow-2xl ring-4 ring-white relative group">
                <img
                  src={currentAvatarSrc}
                  alt={activeData.name}
                  className="w-full h-full object-cover rounded-2xl bg-slate-50 transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute inset-0 bg-black/50 text-white font-bold text-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer backdrop-blur-xs"
                >
                  <span className="text-xl">📷</span>
                  <span>Change Photo</span>
                </button>
              </div>

              {/* Official University Verified Alumnus Badge */}
              <div
                className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[#006B3F] text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md ring-2 ring-white"
                title="Verified PUST Degree Holder"
              >
                <span>✓</span>
                <span>Verified</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap sm:mb-2">
              <button
                type="button"
                onClick={() => setActiveTab("idcard")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  activeTab === "idcard"
                    ? "bg-[#C7A76C] text-[#17263C] ring-2 ring-[#B5893C]"
                    : "bg-[#FAF5E8] hover:bg-[#F3E7C4] text-[#75551E] border border-[#DECFA9]"
                }`}
              >
                <span>🪪</span>
                <span>Alumni Digital Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab(activeTab === "edit" ? "overview" : "edit")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  activeTab === "edit"
                    ? "bg-[#17263C] text-white"
                    : "bg-[#7A1737] hover:bg-[#60122B] text-white"
                }`}
              >
                <span>{activeTab === "edit" ? "✕ Close Editor" : "✏️ Edit Profile"}</span>
              </button>
            </div>
          </div>

          {/* Alumnus Name, Verified Banner, and Core Credentials (REAL TIME PREVIEW) */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#17263C] tracking-tight">
                {activeData.name || "Alumni Member"}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-[#7A1737]/10 text-[#7A1737] border border-[#7A1737]/25 text-xs font-extrabold flex items-center gap-1">
                <span>🎓</span>
                <span>Class of {activeData.batch || "2026"} · {activeData.dept ? activeData.dept.split(" ")[0] : "PUST"}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#C7A76C]/20 text-[#8C6524] border border-[#C7A76C]/40 text-[11px] font-bold">
                Lifetime Member
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#475569] font-medium max-w-3xl leading-relaxed">
              {activeData.headline}
            </p>

            {/* University & Professional Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs text-[#55401D] font-semibold border-t border-[#F1F5F9]">
              <span className="flex items-center gap-1.5">
                <span>🏛️</span>
                <span>{activeData.dept}</span>
              </span>
              {activeData.company && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <span>🏢</span>
                    <span>{activeData.company}</span>
                  </span>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span>📍</span>
                <span>{activeData.location || "Bangladesh"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span>🩸</span>
                <span>Blood: {activeData.bloodGroup}</span>
              </span>
              <span>•</span>
              <button
                type="button"
                onClick={handleCopyAlumniId}
                className="flex items-center gap-1 text-[#7A1737] hover:underline cursor-pointer"
                title="Click to copy official Alumni ID"
              >
                <span>🪪 ID: PUST-ALM-{activeData.batch || "2026"}-{activeData.studentId || "0000"}</span>
                <span className="text-[10px]">{copiedId ? "✓ Copied" : "📋"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="border-t border-[#E2E8F0] bg-[#FAF5E8]/60 px-5 sm:px-8 py-2 flex items-center gap-2 overflow-x-auto">
          {[
            { id: "overview", label: "Profile Overview", icon: "👤" },
            { id: "idcard", label: "Digital Alumni ID Card", icon: "🪪" },
            { id: "edit", label: "Edit Profile Details", icon: "✏️" },
            { id: "privacy", label: "Privacy & Controls", icon: "🔒" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#17263C] text-[#F8E7B9] shadow-sm"
                  : "text-[#55401D] hover:bg-[#F0E4C3]"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500/40 text-emerald-900 font-bold text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-sm">
              ✓
            </span>
            <span>Your profile has been saved and synchronized across the alumni network!</span>
          </div>
          <button
            type="button"
            onClick={() => setSavedSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 1: PROFILE OVERVIEW (REALISTIC ALUMNI METRICS & STORY)
         ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* 4 Core Engagement Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {[
              {
                title: "Network Connections",
                val: activeData.connections || 1,
                desc: "Verified PUST alumni & students",
                icon: "🔗",
                color: "text-[#17263C]",
                bg: "bg-blue-50/70 border-blue-200/60",
              },
              {
                title: "Mentorship Sessions",
                val: activeData.mentorshipCount || 0,
                desc: "Career guidance given to juniors",
                icon: "🎯",
                color: "text-[#7A1737]",
                bg: "bg-rose-50/70 border-rose-200/60",
              },
              {
                title: "Graduation Batch",
                val: `${activeData.batch || "2026"}`,
                desc: activeData.dept || "Pabna University",
                icon: "🏛️",
                color: "text-[#8C6524]",
                bg: "bg-amber-50/70 border-amber-200/60",
              },
              {
                title: "Monthly Profile Views",
                val: activeData.profileViews || 42,
                desc: "Alumni & recruiters visits",
                icon: "👁️",
                color: "text-emerald-700",
                bg: "bg-emerald-50/70 border-emerald-200/60",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${stat.bg} shadow-2xs hover:shadow-sm transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{stat.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Stats
                  </span>
                </div>
                <div className={`font-extrabold text-2xl ${stat.color} tracking-tight`}>
                  {stat.val}
                </div>
                <div className="font-bold text-xs text-[#17263C] mt-0.5">{stat.title}</div>
                <div className="text-[11px] text-[#64748B] mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Bio, Experience, Education */}
            <div className="lg:col-span-2 space-y-6">
              {/* Professional Summary / Bio */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1F5F9]">
                  <h3 className="font-bold text-base text-[#17263C] flex items-center gap-2">
                    <span>📖</span>
                    <span>Professional Biography & Vision</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className="text-xs text-[#7A1737] hover:underline font-bold"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-[#334155] leading-relaxed font-normal whitespace-pre-line">
                  {activeData.bio || "No biography provided yet. Click 'Edit Profile' to introduce yourself to fellow alumni!"}
                </p>
              </div>

              {/* Verified Academic Credentials */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F1F5F9]">
                  <h3 className="font-bold text-base text-[#17263C] flex items-center gap-2">
                    <span>🎓</span>
                    <span>University Academic Records</span>
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Official Verification Verified
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#FAF5E8]/80 border border-[#DECFA9]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-[#17263C]">
                          {activeData.degree}
                        </h4>
                        <p className="text-xs text-[#75551E] font-medium mt-0.5">
                          Pabna University of Science & Technology · Est. 2008
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#C7A76C] text-[#17263C] text-[11px] font-extrabold">
                        {activeData.passingYear}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E8DCBF] text-xs text-[#55401D]">
                      <div><strong>Department:</strong> {activeData.dept}</div>
                      <div><strong>Batch:</strong> {activeData.batch}</div>
                      <div><strong>Academic Session:</strong> {activeData.session}</div>
                      <div><strong>Student ID:</strong> {activeData.studentId || "Not set yet"}</div>
                      <div><strong>Registration No:</strong> {activeData.regNo || "Not set yet"}</div>
                      <div><strong>Hall of Residence:</strong> {activeData.hall}</div>
                      <div><strong>Convocation:</strong> {activeData.convocation}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Experience Timeline */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F1F5F9]">
                  <h3 className="font-bold text-base text-[#17263C] flex items-center gap-2">
                    <span>💼</span>
                    <span>Career & Work Experience</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className="text-xs text-[#7A1737] hover:underline font-bold"
                  >
                    Edit
                  </button>
                </div>

                {Array.isArray(activeData.experience) && activeData.experience.length > 0 ? (
                  <div className="space-y-5 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#E2E8F0]">
                    {activeData.experience.map((job, idx) => (
                      <div key={idx} className="relative pl-8">
                        <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#7A1737] ring-4 ring-white" />
                        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:border-[#7A1737]/30 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className="font-bold text-sm text-[#17263C]">{job.title}</h4>
                            <span className="text-[11px] font-bold text-[#7A1737] bg-rose-50 px-2 py-0.5 rounded border border-rose-200 w-fit">
                              {job.period}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-[#64748B] mt-0.5">
                            {job.company} · {job.location || activeData.location}
                          </p>
                          <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                            {job.description || job.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-[#64748B]">
                      {activeData.company
                        ? `Currently at ${activeData.company} (${activeData.headline})`
                        : "No employment history recorded yet."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("edit")}
                      className="mt-2 text-xs font-bold text-[#7A1737] hover:underline"
                    >
                      + Update your current role or university organization
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right 1 Col: Digital ID Teaser, Skills, Contact */}
            <div className="space-y-6">
              {/* Digital Alumni ID Card Teaser */}
              <div className="bg-gradient-to-br from-[#0F1A2A] via-[#17263C] to-[#253A5A] rounded-2xl p-5 border-2 border-[#C7A76C] shadow-lg text-white relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-2">
                    <img src={wa} alt="PUST" className="w-6 h-6 object-contain" />
                    <span className="font-bold text-xs text-[#F8E7B9]">Digital Alumni Card</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={currentAvatarSrc}
                    alt={activeData.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-[#C7A76C] shadow-sm bg-white"
                  />
                  <div>
                    <p className="font-bold text-sm text-white leading-tight truncate max-w-[160px]">{activeData.name}</p>
                    <p className="text-[11px] text-[#C7A76C] font-semibold mt-0.5 truncate max-w-[160px]">
                      {activeData.dept} ({activeData.batch})
                    </p>
                    <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                      ID: PUST-ALM-{activeData.batch}-{activeData.studentId || "0000"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("idcard")}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#B5893C] to-[#D4AF37] hover:from-[#A67C2E] hover:to-[#B5893C] text-[#17263C] font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🪪 View & Print Official ID Card</span>
                </button>
              </div>

              {/* Skills & Expertise */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1F5F9]">
                  <h3 className="font-bold text-sm text-[#17263C] flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Skills & Endorsements</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className="text-xs text-[#7A1737] hover:underline font-bold"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF5E8] text-[#55401D] border border-[#DECFA9] text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Contact & Online Channels */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-[#17263C] pb-2 border-b border-[#F1F5F9] flex items-center gap-1.5">
                  <span>🌐</span>
                  <span>Contact & Online Presence</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                    <span className="text-[#64748B]">Institutional Email:</span>
                    <span className="font-mono font-bold text-[#17263C] truncate max-w-[150px]">{activeData.email || "Not set"}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                    <span className="text-[#64748B]">Contact Phone:</span>
                    <span className="font-mono font-bold text-[#17263C]">{activeData.phone || "Not set"}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                    <span className="text-[#64748B]">Hometown:</span>
                    <span className="font-bold text-[#17263C]">{activeData.hometown || "Bangladesh"}</span>
                  </div>

                  {activeData.socialLinks?.linkedin && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                      <span className="text-[#64748B]">LinkedIn:</span>
                      <a
                        href={activeData.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#1D4ED8] hover:underline font-bold truncate max-w-[150px]"
                      >
                        Profile Link ↗
                      </a>
                    </div>
                  )}

                  {activeData.socialLinks?.github && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                      <span className="text-[#64748B]">GitHub:</span>
                      <a
                        href={activeData.socialLinks.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#17263C] hover:underline font-bold truncate max-w-[150px]"
                      >
                        GitHub Profile ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: OFFICIAL PUST DIGITAL ALUMNI ID CARD (LIVE PREVIEW & PRINT)
         ========================================================================= */}
      {activeTab === "idcard" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm text-center">
            <h2 className="font-display font-extrabold text-2xl text-[#17263C]">
              Official PUST Digital Alumni Card
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mx-auto mt-1 mb-8">
              Authorized alumni identification verified by Pabna University of Science & Technology.
              Use for university library access, convocation reunions, and alumni events.
            </p>

            {/* The PVC Style ID Card (Real-time dynamic live data) */}
            <div className="pust-id-card-container flex justify-center mb-8">
              <div className="pust-alumni-id-card w-full max-w-md p-6 sm:p-7 printable-id-card text-left select-none">
                {/* Header Strip with Emblem */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#C7A76C]/40 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white p-1 border border-[#C7A76C] shadow-sm flex-shrink-0">
                      <img src={wa} alt="PUST Emblem" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-[13px] text-[#F8E7B9] leading-tight font-bengali">
                        পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়
                      </h3>
                      <p className="text-[10px] tracking-wider text-slate-300 font-bold uppercase mt-0.5">
                        PABNA UNIVERSITY OF SCIENCE & TECH
                      </p>
                      <p className="text-[9px] text-[#C7A76C] font-extrabold tracking-widest uppercase">
                        ALUMNI IDENTIFICATION CARD
                      </p>
                    </div>
                  </div>

                  {/* Micro Golden Smart Chip */}
                  <div className="w-10 h-7 pust-id-chip hidden sm:block shadow-sm" />
                </div>

                {/* Holographic Security Hairline */}
                <div className="w-full h-1 pust-hologram-strip rounded-full mb-4" />

                {/* Body Content */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Alumnus Photo with Golden Ring */}
                  <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-[#C7A76C] shadow-md flex-shrink-0 bg-white">
                    <img
                      src={currentAvatarSrc}
                      alt={activeData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Identification Details */}
                  <div className="flex-1 min-w-0 space-y-1 text-xs">
                    <p className="text-[10px] text-[#C7A76C] font-bold uppercase tracking-wider">
                      ALUMNUS NAME:
                    </p>
                    <p className="font-extrabold text-white text-sm sm:text-base leading-tight truncate">
                      {activeData.name}
                    </p>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5 text-[11px] text-slate-300">
                      <div>
                        <span className="text-[#C7A76C] font-bold">ALUMNI ID:</span>
                        <div className="font-mono text-white font-bold truncate">
                          {activeData.studentId || "PENDING"}
                        </div>
                      </div>
                      <div>
                        <span className="text-[#C7A76C] font-bold">BATCH:</span>
                        <div className="text-white font-bold">{activeData.batch || "2026"}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[#C7A76C] font-bold">DEPARTMENT:</span>
                        <div className="text-white font-semibold truncate">{activeData.dept}</div>
                      </div>
                      <div>
                        <span className="text-[#C7A76C] font-bold">BLOOD GRP:</span>
                        <div className="text-white font-bold">{activeData.bloodGroup}</div>
                      </div>
                      <div>
                        <span className="text-[#C7A76C] font-bold">VALIDITY:</span>
                        <div className="text-emerald-400 font-bold">Lifetime</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Barcode, Hologram, Verification Stamp */}
                <div className="pt-3 border-t border-[#C7A76C]/30 flex items-center justify-between text-[10px] text-slate-300">
                  <div>
                    <div className="font-mono tracking-widest text-[9px] text-slate-400">
                      ||| | |||| | ||| ||||| ||| ||
                    </div>
                    <div className="text-[8.5px] text-[#C7A76C]">
                      PUST-ALM-{activeData.batch || "2026"}-{activeData.studentId || "0000"}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-extrabold text-[9px]">
                    <span>✓</span>
                    <span>OFFICIAL VERIFIED ALUMNUS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Print & Action Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-3 rounded-xl bg-[#7A1737] hover:bg-[#60122B] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>🖨️</span>
                <span>Print Official Alumni ID Card</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAlumniId}
                className="px-5 py-3 rounded-xl bg-[#FAF5E8] hover:bg-[#F3E7C4] text-[#75551E] border border-[#DECFA9] font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>📋</span>
                <span>{copiedId ? "✓ Copied ID Number" : "Copy Alumni ID Number"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-[#17263C] font-bold text-xs transition-all cursor-pointer"
              >
                Update Card Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: EDIT PROFILE (REAL-TIME LIVE REACTIVE EDITOR)
         ========================================================================= */}
      {activeTab === "edit" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <div>
              <h2 className="font-display font-extrabold text-xl text-[#17263C]">
                Edit Your Alumni Profile
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Changes apply instantly across your Digital ID Card, Navbar, and Directory profile
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-6 py-2.5 rounded-xl bg-[#7A1737] hover:bg-[#62122B] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Save All Changes
            </button>
          </div>

          {/* Real-time Dynamic Profile Completion Tracker */}
          <div className="p-4 rounded-2xl bg-[#FAF5E8] border border-[#DECFA9] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#7A1737]/10 border border-[#7A1737]/30 flex items-center justify-center text-lg flex-shrink-0">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#17263C]">Live Profile Completion:</span>
                  <span className="font-extrabold text-xs text-[#7A1737]">{completionScore}%</span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  All changes immediately update across your digital ID card, navbar, and alumni profile.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-48">
              <div className="h-2.5 rounded-full overflow-hidden bg-white border border-[#DECFA9] p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${completionScore}%`,
                    background: "linear-gradient(90deg, #DECA9E 0%, #C7A76C 100%)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#17263C] pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <span>👤</span>
              <span>Personal & Contact Information</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your official full name"
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none font-bold text-[#17263C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none font-bold text-[#17263C]"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +880 1711-000000"
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="yourname@pust.ac.bd or personal email"
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Current City / Country
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Dhaka, Bangladesh or Pabna"
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Hometown in Bangladesh
                </label>
                <input
                  type="text"
                  value={formData.hometown}
                  onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                  placeholder="e.g. Pabna, Rajshahi, Bogura"
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: University & Academic Records */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-[#17263C] pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <span>🏛️</span>
              <span>PUST Academic Credentials</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  list="pust-department-list"
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  placeholder="Select or type your department"
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none font-semibold text-[#17263C]"
                />
                <datalist id="pust-department-list">
                  {PUST_DEPTS.map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Batch & Session
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Batch (e.g. 2020)"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none font-bold text-[#17263C]"
                  />
                  <input
                    type="text"
                    placeholder="Session (e.g. 2020-2021)"
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Student ID & Registration No
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Student ID (e.g. 2001042)"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none font-mono font-bold text-[#17263C]"
                  />
                  <input
                    type="text"
                    placeholder="Reg No (e.g. REG-2020-042)"
                    value={formData.regNo}
                    onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Hall of Residence (আবাসিক হল)
                </label>
                <select
                  value={formData.hall}
                  onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none font-semibold text-[#17263C]"
                >
                  {PUST_HALLS.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Degree Title
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. B.Sc. in Computer Science & Engineering"
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Passing Year & Convocation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Year (e.g. 2024)"
                    value={formData.passingYear}
                    onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Convocation (e.g. 2nd Convocation)"
                    value={formData.convocation}
                    onChange={(e) => setFormData({ ...formData, convocation: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Professional Info & Headline */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-[#17263C] pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <span>💼</span>
              <span>Professional Status & Headline</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Professional Headline (Displayed under your name)
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="e.g. Software Engineer at Google | Alumni, CSE"
                className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none font-semibold text-[#17263C]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Current Company / Institution
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Brain Station 23, PUST, Robi Axiata"
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g. Technology, Education, Telecommunication, Civil"
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Bio & Career Story
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your academic memories, professional journey, or advice for juniors..."
                className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 4: Skills Editor */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-[#17263C] pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <span>💡</span>
              <span>Manage Skills</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF5E8] text-[#55401D] border border-[#DECFA9] text-xs font-bold flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-rose-500 hover:text-rose-700 font-bold ml-1 cursor-pointer"
                    title="Remove skill"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md pt-2">
              <input
                type="text"
                placeholder="Add skill (e.g. System Design, Python, React)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
              />
              <button
                type="submit"
                disabled={!newSkill.trim()}
                className="px-4 py-2 rounded-xl bg-[#17263C] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                + Add
              </button>
            </form>
          </div>

          {/* Section 5: Social Channels */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-[#17263C] pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <span>🌐</span>
              <span>Social & Professional Links</span>
            </h3>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourname"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/yourname"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                  Personal Website / Portfolio
                </label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#7A1737] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-7 py-2.5 rounded-xl bg-[#7A1737] hover:bg-[#62122B] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: PRIVACY & NETWORK CONTROLS
         ========================================================================= */}
      {activeTab === "privacy" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <div>
              <h2 className="font-display font-extrabold text-xl text-[#17263C]">
                Privacy & Discovery Settings
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Control who can view your credentials and contact you
              </p>
            </div>
            {privacyToast && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                ✓ {privacyToast}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {[
              {
                key: "publicVisibility",
                label: "Show profile to public visitors",
                desc: "Allow logged-out guests to view your university degree and headline in the directory",
                on: privacy.publicVisibility,
              },
              {
                key: "emailVisibility",
                label: "Mask institutional email from strangers",
                desc: "Only mutually connected alumni can see your full direct email address",
                on: privacy.emailVisibility,
              },
              {
                key: "searchVisibility",
                label: "Include in Directory & Talent Search",
                desc: "Allow fellow PUST graduates and university employers to discover your profile",
                on: privacy.searchVisibility,
              },
              {
                key: "mentorshipAvailable",
                label: "Available for Student & Junior Alumni Mentorship",
                desc: "Show 'Request 1-on-1 Mentorship' on your public profile card",
                on: privacy.mentorshipAvailable,
              },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => togglePrivacy(item.key)}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] hover:bg-[#FAF5E8] border border-[#E2E8F0] hover:border-[#DECFA9] cursor-pointer transition-colors"
              >
                <div className="pr-4">
                  <p className="text-sm font-bold text-[#17263C]">{item.label}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{item.desc}</p>
                </div>
                <div
                  className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors flex-shrink-0 cursor-pointer ${
                    item.on ? `bg-[#006B3F]` : `bg-[#CBD5E1]`
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      item.on ? `translate-x-5` : ``
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
