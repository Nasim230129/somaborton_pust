import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pa, ma } from "../../data/mockData";
import { getCurrentUser } from "../../services/api";

const Ps = ["Incoming Requests", "Active Mentorships", "Find Mentors", "Reviews"];
const Fs = [
  {
    student: ma[0],
    msg: "I'm a final year CSE student passionate about backend development. I would love guidance on transitioning to a product engineering role like yours at Brain Station 23.",
    goal: "Backend → Product Engineering",
  },
  {
    student: ma[1],
    msg: "I'm working on my final year project in embedded systems and struggling with RTOS. Could you guide me from your EEE experience?",
    goal: "Embedded Systems & RTOS",
  },
];

export default function DashboardMentorship() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [activeTab, setActiveTab] = useState("Incoming Requests");
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [declinedRequests, setDeclinedRequests] = useState([]);
  const [requestedMentors, setRequestedMentors] = useState([]);
  const [mentorSearch, setMentorSearch] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Modals
  const [isBecomeMentorModalOpen, setIsBecomeMentorModalOpen] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    expertise: "Fullstack Web & Cloud Architecture",
    availability: "2 hrs/week",
    topics: "Resume review, Career transition, Mock interviews",
  });

  const [scheduleModalUser, setScheduleModalUser] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "19:00",
    platform: "Google Meet",
  });

  const [quickMsgUser, setQuickMsgUser] = useState(null);
  const [quickMsgText, setQuickMsgText] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleBecomeMentor = (e) => {
    e.preventDefault();
    setIsBecomeMentorModalOpen(false);
    showToast("🎉 আপনার মেন্টর প্রোফাইল সফলভাবে এক্টিভেট করা হয়েছে!");
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    const targetName = scheduleModalUser?.name || "Mentee";
    setScheduleModalUser(null);
    showToast(`📅 ${targetName}-এর সাথে ${scheduleData.date || "Next Monday"} তারিখের সেশন বুক করা হয়েছে!`);
  };

  const handleSendQuickMsg = (e) => {
    e.preventDefault();
    if (!quickMsgText.trim()) return;
    const targetName = quickMsgUser?.name || "Member";
    setQuickMsgUser(null);
    setQuickMsgText("");
    showToast(`💬 ${targetName}-কে মেসেজ পাঠানো হয়েছে!`);
  };

  const filteredMentors = pa
    .filter((m) => m.mentorAvailable && m.id !== 1)
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

  return (
    <div className="max-w-4xl space-y-5">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Become a Mentor Modal */}
      {isBecomeMentorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                Become a PUST Alumni Mentor
              </h2>
              <button
                onClick={() => setIsBecomeMentorModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleBecomeMentor} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Primary Area of Expertise
                </label>
                <input
                  required
                  type="text"
                  value={mentorForm.expertise}
                  onChange={(e) => setMentorForm({ ...mentorForm, expertise: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Weekly Availability
                </label>
                <select
                  value={mentorForm.availability}
                  onChange={(e) => setMentorForm({ ...mentorForm, availability: e.target.value })}
                  className="input text-sm w-full"
                >
                  <option value="1 hr/week">1 hour / week (1 session)</option>
                  <option value="2 hrs/week">2 hours / week (2 sessions)</option>
                  <option value="4 hrs/week">4 hours / week (Weekend batches)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Topics You Can Guide On
                </label>
                <textarea
                  rows={3}
                  value={mentorForm.topics}
                  onChange={(e) => setMentorForm({ ...mentorForm, topics: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBecomeMentorModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-green btn-sm">
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Session Modal */}
      {scheduleModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A]">
                Schedule Session with {scheduleModalUser.name}
              </h2>
              <button
                onClick={() => setScheduleModalUser(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  required
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
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScheduleModalUser(null)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Message Modal */}
      {quickMsgUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A]">
                Message {quickMsgUser.name}
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
                  placeholder={`Hi ${quickMsgUser.name.split(" ")[0]}, let's discuss your mentorship goals...`}
                  value={quickMsgText}
                  onChange={(e) => setQuickMsgText(e.target.value)}
                  className="input text-sm w-full"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickMsgUser(null)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-green btn-sm">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F172A]">
            Mentorship
          </h1>
          <p className="text-xs text-[#64748B]">
            Guide the next generation of PUST graduates or discover experienced mentors.
          </p>
        </div>
        <button
          onClick={() => setIsBecomeMentorModalOpen(true)}
          className="btn btn-green btn-sm cursor-pointer"
        >
          + Become a Mentor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { v: "8", l: "Active Mentees", c: "bg-green-50 text-[#006B3F]" },
          {
            v: `${Fs.filter((_, idx) => !acceptedRequests.includes(idx) && !declinedRequests.includes(idx)).length}`,
            l: "Pending Requests",
            c: "bg-amber-50 text-[#D97706]",
          },
          { v: "23", l: "Total Sessions", c: "bg-blue-50 text-[#1B4F8A]" },
          { v: "4.9★", l: "Avg. Rating", c: "bg-purple-50 text-purple-700" },
        ].map((item) => (
          <div key={item.l} className="stat-card rounded-xl text-center">
            <div className={`font-display font-bold text-2xl ${item.c} w-fit mx-auto px-2 rounded`}>
              {item.v}
            </div>
            <div className="text-[#64748B] text-xs mt-1">{item.l}</div>
          </div>
        ))}
      </div>

      {/* Main Tabs Card */}
      <div className="card rounded-xl overflow-hidden">
        <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
          {Ps.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-underline whitespace-nowrap cursor-pointer ${
                activeTab === tab ? "active font-semibold text-[#006B3F]" : "text-[#64748B]"
              }`}
            >
              {tab}
              {tab === "Incoming Requests" && (
                <span className="ml-1 badge badge-red text-[9px]">
                  {Fs.filter((_, idx) => !acceptedRequests.includes(idx) && !declinedRequests.includes(idx)).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "Incoming Requests" && (
            <div className="space-y-4">
              {Fs.map((item, idx) => {
                const isAccepted = acceptedRequests.includes(idx);
                const isDeclined = declinedRequests.includes(idx);
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-xl border transition-all ${
                      isAccepted
                        ? "border-green-200 bg-green-50/50"
                        : isDeclined
                        ? "border-red-100 bg-red-50/50 opacity-60"
                        : "border-[#E2E8F0]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.student.avatar}
                        alt={item.student.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-[#0F172A]">
                            {item.student.name}
                          </h3>
                          <span className="badge badge-blue text-[9px]">
                            Batch {item.student.batch}
                          </span>
                          <span className="badge badge-gray text-[9px]">
                            {item.student.dept.split("&")[0].trim()}
                          </span>
                        </div>
                        <p className="text-xs text-[#94A3B8] mb-2">
                          Goal:{" "}
                          <span className="text-[#1B4F8A] font-medium">
                            {item.goal}
                          </span>
                        </p>
                        <p className="text-sm text-[#64748B] leading-relaxed">
                          {item.msg}
                        </p>

                        {isAccepted ? (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="badge badge-green">
                              ✓ Accepted — Mentorship started!
                            </span>
                            <button
                              onClick={() => setScheduleModalUser(item.student)}
                              className="btn btn-primary btn-sm text-xs cursor-pointer ml-auto"
                            >
                              📅 Schedule First Session
                            </button>
                          </div>
                        ) : isDeclined ? (
                          <div className="mt-3 badge badge-red">Declined</div>
                        ) : (
                          <div className="flex gap-2 mt-4 flex-wrap">
                            <button
                              onClick={() => {
                                setAcceptedRequests([...acceptedRequests, idx]);
                                showToast(`🎉 Accepted mentorship request from ${item.student.name}!`);
                              }}
                              className="btn btn-green btn-sm cursor-pointer"
                            >
                              Accept Request
                            </button>
                            <button
                              onClick={() => {
                                setDeclinedRequests([...declinedRequests, idx]);
                                showToast(`Mentorship request declined`);
                              }}
                              className="btn btn-sm btn-ghost text-red-500 cursor-pointer"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => setQuickMsgUser(item.student)}
                              className="btn btn-sm btn-outline cursor-pointer"
                            >
                              Message First
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "Active Mentorships" && (
            <div className="space-y-3">
              {ma.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-[#E2E8F0] rounded-xl hover:shadow-xs transition-shadow"
                >
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0F172A] text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {item.dept} · Batch {item.batch}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setScheduleModalUser(item)}
                      className="btn btn-sm btn-outline cursor-pointer"
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => setQuickMsgUser(item)}
                      className="btn btn-sm btn-ghost cursor-pointer"
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Find Mentors" && (
            <div className="space-y-4">
              {/* Mentors Search Bar */}
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Search mentors by name, company, skill, or department..."
                  value={mentorSearch}
                  onChange={(e) => setMentorSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none"
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
                        className="p-4 border border-[#E2E8F0] rounded-xl hover:border-[#006B3F]/40 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex gap-3 mb-3">
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-[#0F172A] text-sm">
                                {item.name}
                              </h3>
                              <p className="text-xs text-[#64748B] line-clamp-1">{item.headline}</p>
                              <span className="text-[10px] text-[#006B3F] font-medium">
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
                        <button
                          onClick={() => {
                            if (!isRequested) {
                              setRequestedMentors([...requestedMentors, item.id]);
                              showToast(`🎯 Mentorship request sent to ${item.name}!`);
                            }
                          }}
                          className={`btn btn-sm w-full cursor-pointer ${
                            isRequested ? "bg-[#006B3F] text-white" : "btn-green"
                          }`}
                        >
                          {isRequested ? "✓ Request Sent" : "Request Mentorship"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="space-y-4">
              {[
                {
                  name: "Ariful Islam",
                  rating: 5,
                  text: "Dr. Rafiqul gave me incredibly detailed feedback on my portfolio and helped me land an internship at Brain Station 23. Life-changing mentorship!",
                  batch: "CSE '22",
                },
                {
                  name: "Sumaiya Khatun",
                  rating: 5,
                  text: "Patient, knowledgeable, and genuinely invested in my growth. Helped me navigate my first job search with confidence.",
                  batch: "EEE '23",
                },
              ].map((review, idx) => (
                <div key={idx} className="p-5 bg-[#F8FAFC] rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#F59E0B]">
                      {"★".repeat(review.rating)}
                    </span>
                    <span className="font-semibold text-[#0F172A] text-sm">
                      {review.name}
                    </span>
                    <span className="text-[#94A3B8] text-xs">
                      Batch {review.batch}
                    </span>
                  </div>
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

