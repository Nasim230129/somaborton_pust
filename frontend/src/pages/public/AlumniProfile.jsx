import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { pa, ma, ha, Sa, Ka } from "../../data/mockData";
import { api, useBackendSync, getCurrentUser } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";

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

export default function AlumniProfile() {
  useBackendSync();
  const { id } = useParams();
  const navigate = useNavigate();

  const allMembers = useMemo(() => [...pa, ...ma, ...ha, ...Sa], []);
  const initialMember = allMembers.find(
    (m) => String(m.id) === String(id) || m.id === Number(id)
  );

  const [member, setMember] = useState(initialMember || null);
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_connected_alumni");
      const list = stored ? JSON.parse(stored) : [];
      return list.some((item) => String(item) === String(id));
    } catch (e) {
      return false;
    }
  });
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_saved_alumni");
      const savedList = stored ? JSON.parse(stored) : [];
      return savedList.some((item) => String(item) === String(id));
    } catch (e) {
      return false;
    }
  });

  const [showEmail, setShowEmail] = useState(false);
  const [connectionCount, setConnectionCount] = useState(initialMember?.connections || 0);

  // Modals state
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [mentorSubmitted, setMentorSubmitted] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    topic: "Career Mentorship & Industry Insights",
    goal: "Professional Networking & Career Guidance",
    message: "",
  });

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportForm, setReportForm] = useState({
    reason: "Inaccurate Credentials / Impersonation",
    details: "",
  });
  const [reportError, setReportError] = useState("");
  const [loading, setLoading] = useState(!initialMember);

  // Sync member details from API if available
  useEffect(() => {
    let isMounted = true;
    if (!initialMember) setLoading(true);
    api.getAlumniById(id).then((res) => {
      if (isMounted) {
        if (res && res.ok && res.data) {
          setMember((prev) => ({ ...(prev || {}), ...res.data }));
          if (res.data.connections !== undefined) {
            setConnectionCount(res.data.connections);
          }
        }
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [id, initialMember]);

  useEffect(() => {
    const handleSync = () => {
      const refreshedAll = [...pa, ...ma, ...ha, ...Sa];
      const match = refreshedAll.find(
        (m) => String(m.id) === String(id) || m.id === Number(id)
      );
      if (match) {
        setMember((prev) => ({ ...(match || {}), ...(prev || {}) }));
      }
    };
    window.addEventListener("pust-data-synced", handleSync);
    return () => window.removeEventListener("pust-data-synced", handleSync);
  }, [id]);

  usePageMeta(
    member ? `${member.name} — PUST Alumni Profile` : "Alumni Profile",
    member?.headline || "PUST Alumni Network member profile."
  );

  if (loading && !member) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-[#F4F5F7] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#7A1737] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#64748B] font-medium">Loading alumni profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-[#F4F5F7] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F8FAFC] text-[#64748B] flex items-center justify-center text-3xl mx-auto mb-4 border border-[#E2E8F0]">
            👤
          </div>
          <h1 className="font-display font-bold text-2xl text-[#17263C] mb-2">
            Member Not Found
          </h1>
          <p className="text-[#64748B] text-sm mb-6 leading-relaxed">
            The alumni profile you are looking for does not exist or may have been removed.
          </p>
          <Link
            to="/alumni"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#7A1737] hover:bg-[#62122B] text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm"
          >
            ← Back to Alumni Directory
          </Link>
        </div>
      </div>
    );
  }

  // Work experience list
  const experienceList =
    Array.isArray(member.experience) && member.experience.length > 0
      ? member.experience
      : member.company
        ? [
            {
              title: member.headline || "Professional Role",
              company: member.company,
              period: "Present",
              description: member.bio || `Professional contributor in the ${member.dept || "PUST"} sector.`,
            },
          ]
        : [];

  // Education history list
  const educationList =
    Array.isArray(member.education) && member.education.length > 0
      ? member.education
      : [
          {
            degree: `B.Sc. in ${member.dept || "Engineering"}`,
            institution: "Pabna University of Science & Technology",
            year: member.batch ? `Batch of ${member.batch}` : "PUST Graduate",
          },
        ];

  // Masked email calculation
  const maskedEmail = member.email
    ? member.email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + "*".repeat(Math.max(b.length, 3)))
    : "Not publicly available";

  // Connect action
  const handleConnect = async () => {
    if (!connected) {
      setConnected(true);
      setConnectionCount((prev) => prev + 1);
      try {
        const stored = localStorage.getItem("pust_connected_alumni");
        const list = stored ? JSON.parse(stored) : [];
        if (!list.includes(member.id)) {
          list.push(member.id);
          localStorage.setItem("pust_connected_alumni", JSON.stringify(list));
        }
        await api.connectAlumni(member.id);
      } catch (err) {
        console.debug("Connect failed:", err);
      }
    }
  };

  // Toggle Save / Bookmark
  const handleToggleSave = async () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      const stored = localStorage.getItem("pust_saved_alumni");
      let list = stored ? JSON.parse(stored) : [];
      if (nextSaved) {
        if (!list.includes(member.id)) list.push(member.id);
      } else {
        list = list.filter((item) => item !== member.id);
      }
      localStorage.setItem("pust_saved_alumni", JSON.stringify(list));
      await api.saveAlumni(member.id, { saved: nextSaved });
    } catch (err) {
      console.debug("Save alumni failed:", err);
    }
  };

  // Department peers for recommendations
  const departmentPeers = useMemo(() => {
    return allMembers
      .filter((m) => m.id !== Number(id) && m.dept === member?.dept)
      .slice(0, 3);
  }, [allMembers, id, member?.dept]);

  // Share profile
  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Submit mentorship request
  const handleMentorshipSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = getCurrentUser();
      await api.requestMentorship({
        mentorId: member.id,
        mentorName: member.name,
        menteeName: currentUser?.name || "PUST Community Member",
        menteeEmail: currentUser?.email || "",
        dept: currentUser?.dept || "PUST",
        batch: currentUser?.batch || "2024",
        topic: mentorForm.topic,
        goal: mentorForm.goal,
        message: mentorForm.message,
      });
      setMentorSubmitted(true);
      setTimeout(() => {
        setShowMentorModal(false);
        setMentorSubmitted(false);
      }, 2000);
    } catch (err) {
      console.debug("Mentorship request failed:", err);
    }
  };

  // Submit report
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportError("");
    if (!reportForm.reason) {
      setReportError("Please specify a reason for this report.");
      return;
    }
    try {
      const currentUser = getCurrentUser();
      const res = await api.reportAlumni(member.id, {
        reason: reportForm.reason,
        details: reportForm.details,
        reporterEmail: currentUser?.email || "anonymous",
      });
      if (res && res.ok) {
        setReportSubmitted(true);
        setTimeout(() => {
          setShowReportModal(false);
          setReportSubmitted(false);
        }, 2000);
      } else {
        setReportError(res?.message || "Failed to submit report. Please try again.");
      }
    } catch (err) {
      setReportError("Failed to submit report. Please check your network.");
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-[#F4F5F7]">
      {/* Cover Banner */}
      <div className="bg-[#17263C] border-b border-[#0F1A2A] h-52 lg:h-64 relative overflow-hidden reveal-up">
        <img
          src={Ka}
          alt="PUST Campus"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17263C] via-[#17263C]/80 to-transparent" />
        <div className="absolute bottom-4 left-4 sm:left-10 text-[#C7A76C] text-xs font-semibold flex items-center gap-2 flex-wrap">
          <span className="font-bengali font-semibold text-white">
            পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়
          </span>
          <span>·</span>
          <span>PUST Alumni Network</span>
          <span>·</span>
          <span className="text-white">{member.dept}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* =========================================
              LEFT COLUMN: PROFILE SUMMARY & ACTIONS
          ========================================= */}
          <div className="lg:col-span-1 space-y-5 reveal-left">
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
              <div className="relative mb-4 inline-block">
                <div className="w-28 h-28 rounded-3xl overflow-hidden bg-white p-1 border-2 border-[#C7A76C] shadow-md ring-4 ring-white">
                  <img
                    src={member.avatar || getInitialsAvatar(member.name)}
                    alt={member.name}
                    onError={(e) => {
                      e.currentTarget.src = getInitialsAvatar(member.name);
                    }}
                    className="w-full h-full rounded-2xl object-cover bg-[#F8FAFC]"
                  />
                </div>
                {member.verified && (
                  <span
                    className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-[#006B3F] text-white font-extrabold flex items-center gap-1 text-[10px] ring-2 ring-white shadow-xs"
                    title="Verified PUST Alumnus"
                  >
                    <span>✓</span>
                    <span>Verified</span>
                  </span>
                )}
                {member.mentorAvailable && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-[#C7A76C] text-[#17263C] font-bold rounded-full flex items-center justify-center text-xs ring-2 ring-white shadow-xs"
                    title="Available for Mentorship"
                  >
                    🎯
                  </span>
                )}
              </div>

              <h1 className="font-display font-bold text-xl text-[#17263C] leading-snug">
                {member.name}
              </h1>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F8FAFC] text-[#17263C] border border-[#E2E8F0]">
                  {member.role || "Alumni"}
                </span>
                {member.verified && (
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#7A1737]/10 text-[#7A1737] border border-[#7A1737]/25">
                    ✓ Verified Alumnus
                  </span>
                )}
              </div>

              <p className="text-[#64748B] text-sm mt-3 leading-relaxed">
                {member.headline || `Graduate of ${member.dept}, PUST.`}
              </p>

              {/* Attributes Details */}
              <div className="mt-5 space-y-2.5 text-xs text-[#475569] border-t border-[#E2E8F0] pt-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-base" aria-hidden="true">
                    🏛️
                  </span>
                  <span className="font-medium">{member.dept}</span>
                </div>
                {member.batch && (
                  <div className="flex items-center gap-2.5">
                    <span className="text-base" aria-hidden="true">
                      🎓
                    </span>
                    <span>Graduation Batch {member.batch}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <span className="text-base" aria-hidden="true">
                    📍
                  </span>
                  <span>{member.location || "Bangladesh"}</span>
                </div>
                {member.company && (
                  <div className="flex items-center gap-2.5">
                    <span className="text-base" aria-hidden="true">
                      🏢
                    </span>
                    <span>{member.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <span className="text-base" aria-hidden="true">
                    🔗
                  </span>
                  <span>{connectionCount} professional connections</span>
                </div>

                {/* Privacy-Protected Email */}
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1.5">
                    <span>✉️ Institutional Email</span>
                    <span className="text-[10px] text-[#17263C] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0] font-medium">
                      Privacy Protected
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-[#F8FAFC] px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-mono text-[#17263C]">
                    <span className="truncate">
                      {showEmail || connected ? member.email : maskedEmail}
                    </span>
                    {!showEmail && !connected && (
                      <button
                        type="button"
                        onClick={() => setShowEmail(true)}
                        className="text-[10px] text-[#7A1737] hover:underline font-semibold font-sans whitespace-nowrap cursor-pointer"
                      >
                        Reveal
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleConnect}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs ${
                    connected
                      ? "bg-[#F1F5F9] text-[#17263C] border border-[#CBD5E1]"
                      : "bg-[#7A1737] hover:bg-[#62122B] text-white"
                  }`}
                >
                  {connected ? "✓ Connected" : "Connect"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/messages?startWith=${member.id}`)}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#17263C] transition-colors cursor-pointer bg-white"
                >
                  Message
                </button>
              </div>

              {/* Secondary Actions: Bookmark & Report */}
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSaved
                      ? "bg-[#C7A76C]/15 border-[#C7A76C] text-[#17263C]"
                      : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#17263C]"
                  }`}
                >
                  <span>{isSaved ? "★" : "☆"}</span>
                  <span>{isSaved ? "Saved" : "Save Profile"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E2E8F0] hover:border-[#EF4444]/40 hover:text-[#EF4444] bg-white text-[#64748B] transition-colors cursor-pointer"
                >
                  🚩 Report Profile
                </button>
              </div>

              {/* Mentorship CTA */}
              {member.mentorAvailable && (
                <button
                  type="button"
                  onClick={() => setShowMentorModal(true)}
                  className="w-full mt-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer bg-[#17263C] hover:bg-[#0F1A2A] text-white flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>🎯</span>
                  <span>Request 1-on-1 Mentorship</span>
                </button>
              )}

              {/* Share Public Profile Action */}
              <button
                type="button"
                onClick={handleShare}
                className="w-full mt-2.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] transition-colors cursor-pointer flex items-center justify-center gap-1.5 bg-white"
              >
                <span>{copied ? "✓ Link Copied to Clipboard!" : "📋 Share Public Profile"}</span>
              </button>
            </div>

            {/* Skills & Areas of Expertise */}
            {member.skills && member.skills.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
                <h3 className="font-semibold text-[#17263C] text-sm mb-3">
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social & Public Links */}
            {member.socialLinks && (
              <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
                <h3 className="font-semibold text-[#17263C] text-sm mb-3">
                  Online Presence
                </h3>
                <div className="space-y-2">
                  {member.socialLinks.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-[#174A7E] hover:underline font-medium"
                    >
                      <span>🔗</span>
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {member.socialLinks.github && (
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-[#17263C] hover:underline font-medium"
                    >
                      <span>💻</span>
                      <span>GitHub Portfolio</span>
                    </a>
                  )}
                  {member.socialLinks.twitter && (
                    <a
                      href={member.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-[#0284C7] hover:underline font-medium"
                    >
                      <span>🐦</span>
                      <span>Twitter / X</span>
                    </a>
                  )}
                  {member.socialLinks.website && (
                    <a
                      href={member.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-[#7A1737] hover:underline font-medium"
                    >
                      <span>🌐</span>
                      <span>Personal Website</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* =========================================
              RIGHT COLUMN: CAREER, EDUCATION & COMMUNITY
          ========================================= */}
          <div className="lg:col-span-2 space-y-5 reveal-right">
            {/* About / Bio Section */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs reveal-up">
              <h2 className="font-display font-semibold text-[#17263C] text-base mb-3">
                About {member.name}
              </h2>
              <p className="text-[#475569] text-sm leading-relaxed whitespace-pre-line">
                {member.bio ||
                  `Dedicated alumnus of Pabna University of Science & Technology (${member.dept}), actively engaged in professional advancements and alumni mentorship.`}
              </p>
            </div>

            {/* Professional Experience */}
            {experienceList.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs reveal-up delay-100">
                <h2 className="font-display font-semibold text-[#17263C] text-base mb-5 flex items-center gap-2">
                  <span>💼</span>
                  <span>Professional Experience</span>
                </h2>
                <div className="space-y-6">
                  {experienceList.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-lg flex-shrink-0 text-[#17263C]">
                          🏢
                        </div>
                        {idx < experienceList.length - 1 && (
                          <div className="w-0.5 h-full bg-[#E2E8F0] mt-2" />
                        )}
                      </div>
                      <div className="pb-2 flex-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#7A1737]">
                          {item.period}
                        </span>
                        <h3 className="font-semibold text-[#17263C] text-sm mt-0.5">
                          {item.title}
                        </h3>
                        <p className="text-[#64748B] text-xs font-medium mt-0.5">{item.company}</p>
                        {item.description && (
                          <p className="text-[#475569] text-xs mt-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education History */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs reveal-up delay-150">
              <h2 className="font-display font-semibold text-[#17263C] text-base mb-5 flex items-center gap-2">
                <span>🎓</span>
                <span>Education History</span>
              </h2>
              <div className="space-y-5">
                {educationList.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-lg flex-shrink-0 text-[#17263C]">
                      🎓
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-[#C7A76C] uppercase tracking-wider">
                        {item.year}
                      </span>
                      <h3 className="font-semibold text-[#17263C] text-sm mt-0.5">
                        {item.degree}
                      </h3>
                      <p className="text-[#64748B] text-xs font-medium mt-0.5">
                        {item.institution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Recognition */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs reveal-up delay-200">
              <h2 className="font-display font-semibold text-[#17263C] text-base mb-4">
                PUST Community Affiliation
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <p className="text-sm font-semibold text-[#17263C]">
                    Department of {member.dept}
                  </p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Pabna University of Science & Technology
                  </p>
                </div>
                <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <p className="text-sm font-semibold text-[#17263C]">
                    Global Alumni Association
                  </p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Active Member · Region: {member.location || "Bangladesh"}
                  </p>
                </div>
              </div>
            </div>

            {/* Department Peers / Network Recommendations */}
            {departmentPeers.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs reveal-up delay-250">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-[#17263C] text-base flex items-center gap-2">
                    <span>👥</span>
                    <span>Peers from {member.dept}</span>
                  </h2>
                  <Link
                    to={`/alumni?dept=${encodeURIComponent(member.dept)}`}
                    className="text-xs font-semibold text-[#7A1737] hover:underline"
                  >
                    View All →
                  </Link>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {departmentPeers.map((peer) => (
                    <Link
                      key={`peer-${peer.id}`}
                      to={`/alumni/${peer.id}`}
                      className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:bg-white transition-all text-center block group"
                    >
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-12 h-12 rounded-full mx-auto object-cover ring-2 ring-white shadow-xs mb-2 bg-white"
                      />
                      <h3 className="font-semibold text-xs text-[#17263C] group-hover:text-[#7A1737] transition-colors truncate">
                        {peer.name}
                      </h3>
                      <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                        {peer.company || `Batch ${peer.batch}`}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Directory Link */}
            <div className="pt-2">
              <Link
                to="/alumni"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A1737] hover:underline transition-colors"
              >
                ← Back to Alumni Directory
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          REQUEST MENTORSHIP MODAL
      ========================================= */}
      {showMentorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] relative">
            <button
              type="button"
              onClick={() => setShowMentorModal(false)}
              className="absolute top-4 right-4 text-[#64748B] hover:text-[#17263C] text-base font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-display font-bold text-lg text-[#17263C] mb-1">
              Request Mentorship from {member.name}
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Send a mentorship inquiry regarding your career goals and development objectives.
            </p>

            {mentorSubmitted ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
                  ✓
                </div>
                <h4 className="font-semibold text-[#17263C] text-sm mb-1">Request Sent!</h4>
                <p className="text-xs text-[#64748B]">
                  Your mentorship request has been forwarded to {member.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMentorshipSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#17263C] mb-1">
                    Mentorship Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={mentorForm.topic}
                    onChange={(e) => setMentorForm({ ...mentorForm, topic: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#E2E8F0] outline-none focus:border-[#7A1737]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17263C] mb-1">
                    Your Goal / Learning Objective
                  </label>
                  <input
                    type="text"
                    required
                    value={mentorForm.goal}
                    onChange={(e) => setMentorForm({ ...mentorForm, goal: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#E2E8F0] outline-none focus:border-[#7A1737]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17263C] mb-1">
                    Personal Note / Introduction
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Briefly introduce yourself, your current studies or projects, and what guidance you are seeking..."
                    value={mentorForm.message}
                    onChange={(e) => setMentorForm({ ...mentorForm, message: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#E2E8F0] outline-none focus:border-[#7A1737]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMentorModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-[#7A1737] hover:bg-[#62122B] text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    Send Mentorship Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          REPORT PROFILE MODAL
      ========================================= */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] relative">
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-[#64748B] hover:text-[#17263C] text-base font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-display font-bold text-lg text-[#17263C] mb-1">
              Report Alumni Profile
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Help us maintain integrity across the PUST Alumni community by reporting inaccurate or
              fraudulent profiles.
            </p>

            {reportSubmitted ? (
              <div className="py-6 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
                  ✓
                </div>
                <h4 className="font-semibold text-[#17263C] text-sm mb-1">Report Received</h4>
                <p className="text-xs text-[#64748B]">
                  Thank you. Our administration team will review this profile against university records.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3.5">
                {reportError && (
                  <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                    {reportError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#17263C] mb-1">
                    Reason for Reporting
                  </label>
                  <select
                    value={reportForm.reason}
                    onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#E2E8F0] outline-none focus:border-[#7A1737] bg-white cursor-pointer"
                  >
                    <option value="Inaccurate Credentials / Impersonation">
                      Inaccurate Credentials / Impersonation
                    </option>
                    <option value="Misleading Employment Information">
                      Misleading Employment Information
                    </option>
                    <option value="Inappropriate Content or Behavior">
                      Inappropriate Content or Behavior
                    </option>
                    <option value="Spam / Solicitation">Spam / Solicitation</option>
                    <option value="Other Policy Violation">Other Policy Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17263C] mb-1">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide any specific context or links to assist the review team..."
                    value={reportForm.details}
                    onChange={(e) => setReportForm({ ...reportForm, details: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#E2E8F0] outline-none focus:border-[#7A1737]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-[#7A1737] hover:bg-[#62122B] text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
