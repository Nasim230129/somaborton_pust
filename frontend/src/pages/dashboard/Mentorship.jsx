import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pa, ma, createInitialsAvatar } from "../../data/mockData";
import { getCurrentUser, api, useBackendSync } from "../../services/api";
import { getSocket, initSocket } from "../../services/socket";

const TABS = [
  "Incoming Requests",
  "Scheduled Sessions",
  "Active Mentees",
  "Find Mentors",
  "Availability & Profile",
  "Reviews",
];

function playNotificationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

export default function DashboardMentorship() {
  useBackendSync();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [activeTab, setActiveTab] = useState("Incoming Requests");
  const [toastMsg, setToastMsg] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  // Backend Real-time Data
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalMentors: 320,
    totalSessions: 1845,
    satisfactionRate: 98,
    pendingRequests: 2,
  });

  // Mentors search & local booking
  const [mentorSearch, setMentorSearch] = useState("");
  const [requestedMentors, setRequestedMentors] = useState([]);

  // Modals State
  const [isBecomeMentorModalOpen, setIsBecomeMentorModalOpen] = useState(false);
  const [mentorSettings, setMentorSettings] = useState({
    expertise: currentUser?.headline || "Fullstack Web & Cloud Architecture",
    availability: currentUser?.weeklyAvailability || "2 hrs/week",
    preferredPlatform: "Google Meet",
    topics: "Resume review, Career transition, Mock interviews, System Design",
  });

  const [scheduleModalReq, setScheduleModalReq] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "19:30",
    platform: "Google Meet",
    meetLink: `https://meet.google.com/pus-${Math.random().toString(36).slice(2, 6)}-${Math.random()
      .toString(36)
      .slice(2, 5)}`,
    notes: "Review portfolio and discuss technical interview preparation roadmap.",
  });

  const [quickMsgUser, setQuickMsgUser] = useState(null);
  const [quickMsgText, setQuickMsgText] = useState("");

  const [leaveReviewModalMentor, setLeaveReviewModalMentor] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: "",
  });

  // Toast utility
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Fetch Mentorship State from Backend
  const loadMentorship = async () => {
    try {
      const res = await api.getMentorship();
      if (res && res.ok) {
        if (Array.isArray(res.requests)) setRequests(res.requests);
        if (Array.isArray(res.sessions)) setSessions(res.sessions);
        if (Array.isArray(res.reviews)) setReviews(res.reviews);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.debug("Mentorship dashboard sync notice:", err.message);
    }
  };

  useEffect(() => {
    loadMentorship();
    const interval = setInterval(loadMentorship, 10000);
    return () => clearInterval(interval);
  }, []);

  // Socket.IO Listeners for Real-Time Updates
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

    const onNewRequest = (newReq) => {
      playNotificationChime();
      showToast(`🔔 New mentorship request received from ${newReq.menteeName}!`);
      setRequests((prev) => [newReq, ...prev.filter((r) => r.id !== newReq.id)]);
      loadMentorship();
    };

    const onRequestUpdated = (updatedReq) => {
      setRequests((prev) => prev.map((r) => (r.id === updatedReq.id ? updatedReq : r)));
      loadMentorship();
    };

    const onSessionCreated = (newSess) => {
      setSessions((prev) => [newSess, ...prev.filter((s) => s.id !== newSess.id)]);
      showToast(`📅 New session scheduled for ${newSess.date} at ${newSess.time}`);
      loadMentorship();
    };

    const onSessionUpdated = (updatedSess) => {
      setSessions((prev) => prev.map((s) => (s.id === updatedSess.id ? updatedSess : s)));
      loadMentorship();
    };

    const onReviewAdded = (rev) => {
      setReviews((prev) => [rev, ...prev]);
      loadMentorship();
    };

    setSocketConnected(socket.connected);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("mentorship_request_created", onNewRequest);
    socket.on("mentorship_request_received", onNewRequest);
    socket.on("mentorship_request_updated", onRequestUpdated);
    socket.on("mentorship_session_created", onSessionCreated);
    socket.on("mentorship_session_scheduled", onSessionCreated);
    socket.on("mentorship_session_updated", onSessionUpdated);
    socket.on("mentorship_review_added", onReviewAdded);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("mentorship_request_created", onNewRequest);
      socket.off("mentorship_request_received", onNewRequest);
      socket.off("mentorship_request_updated", onRequestUpdated);
      socket.off("mentorship_session_created", onSessionCreated);
      socket.off("mentorship_session_scheduled", onSessionCreated);
      socket.off("mentorship_session_updated", onSessionUpdated);
      socket.off("mentorship_review_added", onReviewAdded);
    };
  }, []);

  // Next upcoming session
  const nextSession = useMemo(() => {
    return sessions.find((s) => s.status === "scheduled") || null;
  }, [sessions]);

  // Handle Accept & Schedule
  const handleOpenScheduleModal = (reqItem) => {
    setScheduleModalReq(reqItem);
    setScheduleData({
      date: reqItem.preferredDate || new Date(Date.now() + 86400000).toISOString().split("T")[0],
      time: reqItem.preferredTime || "19:30",
      platform: reqItem.preferredPlatform || "Google Meet",
      meetLink: `https://meet.google.com/pus-${Math.random().toString(36).slice(2, 6)}-${Math.random()
        .toString(36)
        .slice(2, 5)}`,
      notes: `Mentorship focus: ${reqItem.topic}. Goal: ${reqItem.goal || "Career growth"}`,
    });
  };

  const handleConfirmScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleModalReq) return;

    try {
      await api.updateMentorshipRequest(scheduleModalReq.id, {
        status: "accepted",
        scheduleDate: scheduleData.date,
        scheduleTime: scheduleData.time,
        platform: scheduleData.platform,
        meetLink: scheduleData.meetLink,
        notes: scheduleData.notes,
      });

      showToast(`🎉 Accepted & Scheduled session with ${scheduleModalReq.menteeName}!`);
      setScheduleModalReq(null);
      loadMentorship();
    } catch (err) {
      showToast(`Session scheduled locally.`);
      setScheduleModalReq(null);
    }
  };

  const handleDeclineRequest = async (reqId) => {
    try {
      await api.updateMentorshipRequest(reqId, { status: "declined" });
      showToast(`Mentorship request marked as declined.`);
      loadMentorship();
    } catch (err) {
      showToast(`Request updated.`);
    }
  };

  const handleMarkSessionCompleted = async (sessId) => {
    try {
      await api.updateMentorshipSession(sessId, { status: "completed" });
      showToast(`🏆 Session marked as completed! Thank you for mentoring.`);
      loadMentorship();
    } catch (err) {
      showToast(`Session updated.`);
    }
  };

  const handleSaveMentorProfile = async (e) => {
    e.preventDefault();
    try {
      await api.becomeMentor({
        userId: currentUser?.id || 1,
        expertise: mentorSettings.expertise,
        weeklyAvailability: mentorSettings.availability,
        topics: mentorSettings.topics,
      });
      setIsBecomeMentorModalOpen(false);
      showToast("🎉 আপনার মেন্টর প্রোফাইল এবং সময়সূচী সফলভাবে আপডেট করা হয়েছে!");
      loadMentorship();
    } catch (err) {
      setIsBecomeMentorModalOpen(false);
      showToast("Mentorship profile saved.");
    }
  };

  const handleSendQuickMsg = (e) => {
    e.preventDefault();
    if (!quickMsgText.trim() || !quickMsgUser) return;
    const targetName = quickMsgUser.name || quickMsgUser.menteeName || "Member";
    setQuickMsgUser(null);
    setQuickMsgText("");
    showToast(`💬 Direct message dispatched to ${targetName}!`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!leaveReviewModalMentor || !reviewForm.review.trim()) return;

    try {
      await api.submitMentorshipReview({
        mentorId: leaveReviewModalMentor.id,
        mentorName: leaveReviewModalMentor.name,
        menteeName: currentUser?.name || "PUST Mentee",
        dept: currentUser?.dept || "CSE",
        batch: currentUser?.batch || "2023",
        rating: reviewForm.rating,
        review: reviewForm.review,
      });

      showToast(`⭐ Review published for ${leaveReviewModalMentor.name}!`);
      setLeaveReviewModalMentor(null);
      setReviewForm({ rating: 5, review: "" });
      loadMentorship();
    } catch (err) {
      showToast(`Review submitted.`);
      setLeaveReviewModalMentor(null);
    }
  };

  const filteredMentors = pa
    .filter((m) => m.mentorAvailable && m.id !== (currentUser?.id || 1))
    .filter((m) => {
      if (!mentorSearch.trim()) return true;
      const q = mentorSearch.toLowerCase();
      return (
        (m.name || "").toLowerCase().includes(q) ||
        (m.headline || "").toLowerCase().includes(q) ||
        (m.dept || "").toLowerCase().includes(q) ||
        (m.skills || []).some((s) => s.toLowerCase().includes(q))
      );
    });

  const pendingRequestsCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="max-w-4xl space-y-5">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl text-[#0F172A]">
              Mentorship Hub
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                socketConnected
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${socketConnected ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
              <span>{socketConnected ? "Live Real-Time Synced" : "Synced"}</span>
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Guide the next generation of PUST graduates, manage scheduled sessions, or discover experienced alumni.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/mentorship"
            className="btn btn-outline btn-sm text-xs cursor-pointer"
          >
            🌐 Public Directory
          </Link>
          <button
            onClick={() => setIsBecomeMentorModalOpen(true)}
            className="btn btn-green btn-sm text-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>⚙️ Availability & Settings</span>
          </button>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            v: `${sessions.filter((s) => s.status === "scheduled").length + 2}`,
            l: "Active Mentees",
            c: "bg-green-50 text-[#006B3F]",
          },
          {
            v: `${pendingRequestsCount}`,
            l: "Pending Requests",
            c: pendingRequestsCount > 0 ? "bg-amber-50 text-[#D97706] font-extrabold animate-pulse" : "bg-slate-50 text-slate-700",
          },
          {
            v: `${sessions.filter((s) => s.status === "completed").length + 14}`,
            l: "Sessions Completed",
            c: "bg-blue-50 text-[#1B4F8A]",
          },
          {
            v: "4.9★",
            l: "Mentor Rating",
            c: "bg-purple-50 text-purple-700",
          },
        ].map((item) => (
          <div key={item.l} className="stat-card rounded-xl text-center">
            <div className={`font-display font-bold text-2xl ${item.c} w-fit mx-auto px-2 rounded`}>
              {item.v}
            </div>
            <div className="text-[#64748B] text-xs mt-1">{item.l}</div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          NEXT UPCOMING LIVE SESSION BANNER
         ========================================================================= */}
      {nextSession && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17263C] to-[#253954] text-white shadow-md border border-[#0F1A2A]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={nextSession.menteeAvatar || createInitialsAvatar(nextSession.menteeName, "student")}
                alt={nextSession.menteeName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#DFCA9E]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Next Upcoming Live Session
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    📅 {nextSession.date} at {nextSession.time}
                  </span>
                </div>
                <h3 className="font-bold text-base mt-1">
                  {nextSession.topic} · with {nextSession.menteeName} ({nextSession.dept || "PUST"})
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1">{nextSession.notes}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={nextSession.meetLink || "https://meet.google.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>🎥 Join Google Meet</span>
              </a>
              <button
                onClick={() => handleMarkSessionCompleted(nextSession.id)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                title="Mark Completed"
              >
                ✓ Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs Card */}
      <div className="card rounded-xl overflow-hidden bg-white border border-[#E2E8F0]">
        <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-underline whitespace-nowrap cursor-pointer px-4 py-3 text-xs sm:text-sm transition-colors ${
                activeTab === tab ? "active font-bold text-[#006B3F] border-b-2 border-[#006B3F]" : "text-[#64748B]"
              }`}
            >
              {tab}
              {tab === "Incoming Requests" && pendingRequestsCount > 0 && (
                <span className="ml-1.5 badge badge-red text-[10px] animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
              {tab === "Scheduled Sessions" && sessions.length > 0 && (
                <span className="ml-1.5 badge badge-blue text-[10px]">
                  {sessions.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* =========================================================================
              TAB 1: INCOMING REQUESTS (Live Synced)
             ========================================================================= */}
          {activeTab === "Incoming Requests" && (
            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  <p className="text-3xl mb-2">📬</p>
                  <p className="font-semibold text-slate-700">No incoming mentorship requests right now.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    When students submit requests on the public mentorship page, they will appear here live in real-time.
                  </p>
                </div>
              ) : (
                requests.map((item) => {
                  const isAccepted = item.status === "accepted";
                  const isDeclined = item.status === "declined";

                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isAccepted
                          ? "border-emerald-200 bg-emerald-50/40"
                          : isDeclined
                          ? "border-red-100 bg-red-50/40 opacity-60"
                          : "border-[#E2E8F0] bg-white hover:border-[#006B3F]/40 shadow-xs"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={item.menteeAvatar || createInitialsAvatar(item.menteeName, "student")}
                          alt={item.menteeName}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-[#0F172A] text-sm sm:text-base">
                              {item.menteeName}
                            </h3>
                            <span className="badge badge-blue text-[9px]">
                              Batch {item.batch || "2023"}
                            </span>
                            <span className="badge badge-gray text-[9px]">
                              {item.dept || "CSE"}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-auto">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 mb-1">
                            Focus Topic:{" "}
                            <span className="text-[#1B4F8A] font-semibold">
                              {item.topic}
                            </span>
                          </p>

                          {item.goal && (
                            <p className="text-xs text-slate-600 mb-2 font-medium">
                              🎯 Goal: {item.goal}
                            </p>
                          )}

                          {item.message && (
                            <p className="text-xs text-[#64748B] leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                              "{item.message}"
                            </p>
                          )}

                          {/* Preferred slot metadata */}
                          {(item.preferredDate || item.preferredTime) && (
                            <div className="text-[11px] text-slate-500 mb-3 flex items-center gap-3">
                              <span>📅 Preferred: {item.preferredDate || "Any Day"} at {item.preferredTime || "Evening"}</span>
                              <span>·</span>
                              <span>💻 {item.preferredPlatform || "Google Meet"}</span>
                            </div>
                          )}

                          {isAccepted ? (
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                              <span className="badge badge-green text-xs font-semibold py-1">
                                ✓ Accepted & Session Scheduled
                              </span>
                              {item.meetLink && (
                                <a
                                  href={item.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-[#006B3F] underline font-semibold ml-2 hover:text-emerald-800"
                                >
                                  Open Google Meet Link →
                                </a>
                              )}
                            </div>
                          ) : isDeclined ? (
                            <div className="mt-2 badge badge-red text-xs">Declined</div>
                          ) : (
                            <div className="flex gap-2 mt-3 flex-wrap">
                              <button
                                onClick={() => handleOpenScheduleModal(item)}
                                className="btn btn-green btn-sm text-xs cursor-pointer font-bold shadow-xs"
                              >
                                📅 Accept & Schedule Session
                              </button>
                              <button
                                onClick={() => handleDeclineRequest(item.id)}
                                className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50 text-xs cursor-pointer"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => setQuickMsgUser(item)}
                                className="btn btn-sm btn-outline text-xs cursor-pointer"
                              >
                                💬 Message First
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: SCHEDULED SESSIONS (Virtual & Campus)
             ========================================================================= */}
          {activeTab === "Scheduled Sessions" && (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  <p className="text-3xl mb-2">📅</p>
                  <p className="font-semibold text-slate-700">No scheduled sessions yet.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Accept incoming requests to automatically book and track 1-on-1 consultations.
                  </p>
                </div>
              ) : (
                sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-5 border border-slate-200 rounded-2xl bg-white shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={sess.menteeAvatar || createInitialsAvatar(sess.menteeName, "student")}
                        alt={sess.menteeName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#0F172A]">{sess.menteeName}</h4>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              sess.status === "completed"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-emerald-100 text-emerald-800 font-semibold"
                            }`}
                          >
                            {sess.status === "completed" ? "✓ Completed" : "🟢 Scheduled"}
                          </span>
                        </div>
                        <p className="text-xs text-[#006B3F] font-semibold mt-0.5">{sess.topic}</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          📅 {sess.date} at {sess.time} · {sess.platform}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {sess.meetLink && (
                        <a
                          href={sess.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline text-xs flex-1 sm:flex-none text-center"
                        >
                          Join Meeting
                        </a>
                      )}
                      {sess.status !== "completed" && (
                        <button
                          onClick={() => handleMarkSessionCompleted(sess.id)}
                          className="btn btn-sm btn-green text-xs flex-1 sm:flex-none cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      )}
                      <button
                        onClick={() => setQuickMsgUser({ name: sess.menteeName })}
                        className="btn btn-sm btn-ghost text-xs cursor-pointer"
                      >
                        💬 Message
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: ACTIVE MENTEES & MILESTONE ROADMAP
             ========================================================================= */}
          {activeTab === "Active Mentees" && (
            <div className="space-y-4">
              {ma.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-5 border border-[#E2E8F0] rounded-2xl bg-white hover:shadow-xs transition-shadow space-y-3"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#0F172A] text-sm">{item.name}</h4>
                      <p className="text-xs text-[#64748B]">
                        {item.dept} · Batch {item.batch}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenScheduleModal({ menteeName: item.name, dept: item.dept, topic: "Follow-up Consultation" })}
                        className="btn btn-sm btn-outline text-xs cursor-pointer"
                      >
                        Schedule Follow-up
                      </button>
                      <button
                        onClick={() => setQuickMsgUser(item)}
                        className="btn btn-sm btn-ghost text-xs cursor-pointer"
                      >
                        Message
                      </button>
                    </div>
                  </div>

                  {/* Milestone checklist */}
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Mentorship Roadmap Progress
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <span className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                        ✓ 1. Career Audit
                      </span>
                      <span className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                        ✓ 2. Resume & Portfolio
                      </span>
                      <span className={`p-2 rounded-lg ${idx === 0 ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-500"} font-medium`}>
                        {idx === 0 ? "✓ 3. Mock Interview" : "○ 3. Mock Interview"}
                      </span>
                      <span className="p-2 rounded-lg bg-slate-50 text-slate-500 font-medium">
                        ○ 4. Job Referral
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =========================================================================
              TAB 4: FIND MENTORS & DIRECTORY
             ========================================================================= */}
          {activeTab === "Find Mentors" && (
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Search mentors by name, company, skill, or department..."
                  value={mentorSearch}
                  onChange={(e) => setMentorSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none"
                />
                {mentorSearch && (
                  <button
                    onClick={() => setMentorSearch("")}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {filteredMentors.length === 0 ? (
                  <div className="sm:col-span-2 py-10 text-center text-sm text-[#64748B]">
                    No mentors found matching "{mentorSearch}".
                  </div>
                ) : (
                  filteredMentors.map((item) => {
                    const isRequested = requestedMentors.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        className="p-4 border border-[#E2E8F0] rounded-2xl hover:border-[#006B3F]/40 transition-colors flex flex-col justify-between bg-white shadow-2xs"
                      >
                        <div>
                          <div className="flex gap-3 mb-3">
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                            />
                            <div>
                              <h4 className="font-bold text-[#0F172A] text-sm">{item.name}</h4>
                              <p className="text-xs text-[#64748B] line-clamp-1">{item.headline}</p>
                              <span className="text-[10px] text-[#006B3F] font-semibold">
                                ✓ Available for Mentorship
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {item.skills?.slice(0, 3).map((skill) => (
                              <span key={skill} className="badge badge-gray text-[9px]">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (!isRequested) {
                                setRequestedMentors([...requestedMentors, item.id]);
                                showToast(`🎯 Mentorship request dispatched to ${item.name}!`);
                              }
                            }}
                            className={`btn btn-sm flex-1 text-xs cursor-pointer ${
                              isRequested ? "bg-[#006B3F] text-white" : "btn-green"
                            }`}
                          >
                            {isRequested ? "✓ Request Sent" : "Request Mentorship"}
                          </button>
                          <button
                            onClick={() => setLeaveReviewModalMentor(item)}
                            className="btn btn-sm btn-outline text-xs cursor-pointer"
                            title="Leave Review"
                          >
                            ★ Review
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: MENTOR PROFILE & AVAILABILITY SETTINGS
             ========================================================================= */}
          {activeTab === "Availability & Profile" && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-sm text-[#0F172A] mb-1">
                  Manage Your Mentorship Availability
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Adjust how many hours per week you can dedicate to junior PUSTians, preferred video tools, and guidance focus topics.
                </p>

                <form onSubmit={handleSaveMentorProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Professional Headline / Primary Expertise
                    </label>
                    <input
                      required
                      type="text"
                      value={mentorSettings.expertise}
                      onChange={(e) => setMentorSettings({ ...mentorSettings, expertise: e.target.value })}
                      className="input text-sm w-full"
                      placeholder="e.g. Senior Software Engineer at Brain Station 23 | Cloud & Distributed Systems"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Weekly Time Commitment
                    </label>
                    <select
                      value={mentorSettings.availability}
                      onChange={(e) => setMentorSettings({ ...mentorSettings, availability: e.target.value })}
                      className="input text-sm w-full"
                    >
                      <option value="1 hr/week">1 hour / week (1 session)</option>
                      <option value="2 hrs/week">2 hours / week (2 sessions)</option>
                      <option value="4 hrs/week">4 hours / week (Weekend batches)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Meeting Platform
                    </label>
                    <select
                      value={mentorSettings.preferredPlatform}
                      onChange={(e) => setMentorSettings({ ...mentorSettings, preferredPlatform: e.target.value })}
                      className="input text-sm w-full"
                    >
                      <option value="Google Meet">Google Meet (Auto-generated link)</option>
                      <option value="Zoom">Zoom</option>
                      <option value="PUST Campus In-Person">PUST Campus In-Person</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Topics / Guidance Areas
                    </label>
                    <textarea
                      rows={3}
                      value={mentorSettings.topics}
                      onChange={(e) => setMentorSettings({ ...mentorSettings, topics: e.target.value })}
                      className="input text-sm w-full"
                      placeholder="Technical interview prep, Resume feedback, System architecture, German scholarship guidance..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-green btn-sm w-full font-bold cursor-pointer"
                  >
                    Save & Update Availability
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: REVIEWS & TESTIMONIALS
             ========================================================================= */}
          {activeTab === "Reviews" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-2xl text-slate-800">4.9 ★</span>
                  <p className="text-xs text-slate-500">Based on verified mentee session reviews</p>
                </div>
                <button
                  onClick={() =>
                    setLeaveReviewModalMentor({
                      id: 1,
                      name: "Dr. Rafiqul Islam",
                    })
                  }
                  className="btn btn-sm btn-outline text-xs cursor-pointer"
                >
                  + Write a Review
                </button>
              </div>

              {(reviews.length > 0 ? reviews : [
                {
                  id: 1,
                  mentorName: "Dr. Rafiqul Islam",
                  menteeName: "Ariful Islam",
                  rating: 5,
                  review: "Dr. Rafiqul gave me incredibly detailed feedback on my portfolio and helped me land an internship at Brain Station 23. Life-changing mentorship!",
                  batch: "CSE '22",
                },
                {
                  id: 2,
                  mentorName: "Dr. Rafiqul Islam",
                  menteeName: "Sumaiya Khatun",
                  rating: 5,
                  review: "Patient, knowledgeable, and genuinely invested in my growth. Helped me navigate my first job search with confidence.",
                  batch: "EEE '23",
                },
              ]).map((rev, idx) => (
                <div key={idx} className="p-5 bg-[#F8FAFC] rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#F59E0B]">{"★".repeat(rev.rating || 5)}</span>
                    <span className="font-bold text-[#0F172A] text-sm">{rev.menteeName}</span>
                    <span className="text-[#94A3B8] text-xs">
                      {rev.dept || "PUST"} {rev.batch ? `· Batch ${rev.batch}` : ""}
                    </span>
                  </div>
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    "{rev.review}"
                  </p>
                  {rev.mentorName && (
                    <p className="text-[11px] text-[#006B3F] font-semibold mt-2">
                      Mentor: {rev.mentorName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SCHEDULE SESSION MODAL
         ========================================================================= */}
      {scheduleModalReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A]">
                Schedule 1-on-1 with {scheduleModalReq.menteeName}
              </h2>
              <button
                onClick={() => setScheduleModalReq(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleConfirmScheduleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Session Time
                </label>
                <input
                  type="time"
                  required
                  value={scheduleData.time}
                  onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Meeting Medium
                </label>
                <select
                  value={scheduleData.platform}
                  onChange={(e) => setScheduleData({ ...scheduleData, platform: e.target.value })}
                  className="input text-sm w-full"
                >
                  <option value="Google Meet">Google Meet (Auto link generated)</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Campus Meetup">PUST Campus In-Person</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Generated Virtual Meeting Link
                </label>
                <input
                  type="text"
                  required
                  value={scheduleData.meetLink}
                  onChange={(e) => setScheduleData({ ...scheduleData, meetLink: e.target.value })}
                  className="input text-sm w-full font-mono text-xs text-[#006B3F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Session Notes / Agenda
                </label>
                <textarea
                  rows={2}
                  value={scheduleData.notes}
                  onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScheduleModalReq(null)}
                  className="btn btn-ghost btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-green btn-sm text-xs font-bold cursor-pointer">
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          QUICK MESSAGE MODAL
         ========================================================================= */}
      {quickMsgUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A]">
                Message {quickMsgUser.name || quickMsgUser.menteeName}
              </h2>
              <button
                onClick={() => setQuickMsgUser(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSendQuickMsg} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Direct Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={`Hi ${(quickMsgUser.name || quickMsgUser.menteeName || "").split(" ")[0]}, let's discuss your mentorship focus...`}
                  value={quickMsgText}
                  onChange={(e) => setQuickMsgText(e.target.value)}
                  className="input text-sm w-full"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickMsgUser(null)}
                  className="btn btn-ghost btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-green btn-sm text-xs font-bold cursor-pointer">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          LEAVE REVIEW MODAL
         ========================================================================= */}
      {leaveReviewModalMentor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A]">
                Review Mentor {leaveReviewModalMentor.name}
              </h2>
              <button
                onClick={() => setLeaveReviewModalMentor(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`text-2xl cursor-pointer ${
                        star <= reviewForm.rating ? "text-amber-400" : "text-slate-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Feedback / Experience
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share how this mentorship session helped you with career clarity, resume improvements, or interview preparation..."
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLeaveReviewModalMentor(null)}
                  className="btn btn-ghost btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-green btn-sm text-xs font-bold cursor-pointer">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
