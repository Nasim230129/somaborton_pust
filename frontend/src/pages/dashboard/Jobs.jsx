import React, { useState } from "react";
import { va } from "../../data/mockData";
import { api, useBackendSync, getCurrentUser } from "../../services/api";

export default function DashboardJobs() {
  useBackendSync();
  const currentUser = getCurrentUser();

  const [activeTab, setActiveTab] = useState("Browse Jobs");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [referralsRequested, setReferralsRequested] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [jobs, setJobs] = useState(va);

  // Post Job Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    salary: "BDT 50,000–80,000",
    dept: "CSE",
    remote: false,
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handlePostJob = (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company) return;

    const created = {
      id: Date.now(),
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      type: newJob.type,
      salary: newJob.salary,
      dept: newJob.dept,
      remote: newJob.remote,
      logo: "💼",
      deadline: "Nov 30, 2026",
      applicants: 0,
      postedBy: currentUser ? `${currentUser.name} (Alumni)` : "Alumni Referral",
    };

    setJobs([created, ...jobs]);
    api.createJob?.(created);
    setIsPostModalOpen(false);
    setNewJob({
      title: "",
      company: "",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      salary: "BDT 50,000–80,000",
      dept: "CSE",
      remote: false,
    });
    showToast("🎉 নতুন জব সার্কুলার সফলভাবে পোস্ট করা হয়েছে!");
  };

  const handleRequestReferral = (job) => {
    if (!referralsRequested.includes(job.id)) {
      setReferralsRequested([...referralsRequested, job.id]);
      showToast(`রেফারেল রিকোয়েস্ট সফলভাবে ${job.postedBy}-এর নিকট পাঠানো হয়েছে!`);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (j.title || "").toLowerCase().includes(q) ||
      (j.company || "").toLowerCase().includes(q) ||
      (j.location || "").toLowerCase().includes(q) ||
      (j.type || "").toLowerCase().includes(q) ||
      (j.dept || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F172A]">
            Jobs & Career
          </h1>
          <p className="text-xs text-[#64748B]">
            Explore opportunities posted and referred by PUST alumni worldwide.
          </p>
        </div>
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>+</span> Post a Job
        </button>
      </div>

      {/* Post a Job Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0F172A]">
                Post a Job / Internship Opportunity
              </h2>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handlePostJob} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Job Title *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Company Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Brain Station 23"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className="input text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Job Type
                  </label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    className="input text-sm w-full"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhaka, Bangladesh"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="input text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Salary Range / Stipend
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ৳ 50,000–80,000/mo"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="input text-sm w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remote-check"
                  checked={newJob.remote}
                  onChange={(e) => setNewJob({ ...newJob, remote: e.target.checked })}
                  className="rounded border-slate-300 text-[#006B3F] focus:ring-[#006B3F]"
                />
                <label htmlFor="remote-check" className="text-xs text-[#0F172A] font-medium cursor-pointer">
                  This role allows remote / work-from-home work
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Post Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Card with Tabs & Search */}
      <div className="card rounded-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 overflow-x-auto">
          <div className="flex">
            {[
              "Browse Jobs",
              "My Applications",
              "Saved Jobs",
              "Posted by Alumni",
            ].map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`tab-underline whitespace-nowrap cursor-pointer ${
                  activeTab === tabName ? "active font-semibold text-[#1B4F8A]" : "text-[#64748B]"
                }`}
              >
                {tabName}
                {tabName === "My Applications" && appliedJobs.length > 0 && (
                  <span className="ml-1.5 badge badge-green text-[9px]">
                    {appliedJobs.length}
                  </span>
                )}
                {tabName === "Saved Jobs" && savedJobs.length > 0 && (
                  <span className="ml-1.5 badge badge-blue text-[9px]">
                    {savedJobs.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Search jobs by title, company, type, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-200 focus:border-[#1B4F8A] focus:ring-1 focus:ring-[#1B4F8A] outline-none text-[#0F172A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <span className="text-xs text-[#64748B] whitespace-nowrap">
              Found {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
            </span>
          )}
        </div>

        <div className="p-5">
          {activeTab === "Browse Jobs" && (
            <div className="space-y-3">
              {filteredJobs.length === 0 ? (
                <div className="py-12 text-center text-[#64748B] text-sm">
                  🔍 No jobs match your search "{searchQuery}". Try a different keyword.
                </div>
              ) : (
                filteredJobs.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl border border-[#E2E8F0] hover:border-[#1B4F8A]/30 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {item.logo || "💼"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#0F172A] text-sm">
                          {item.title}
                        </h3>
                        <span
                          className={`badge text-[9px] ${
                            item.type === "Internship" ? "badge-purple" : "badge-blue"
                          }`}
                        >
                          {item.type}
                        </span>
                        {item.remote && (
                          <span className="badge badge-green text-[9px]">
                            Remote
                          </span>
                        )}
                      </div>
                      <p className="text-[#64748B] text-xs">
                        {item.company} · {item.location}
                      </p>
                      <div className="flex gap-3 text-[10px] text-[#94A3B8] mt-1">
                        <span>💰 {item.salary}</span>
                        <span>⏰ Deadline: {item.deadline || "Open"}</span>
                        <span>👥 {item.applicants} applied</span>
                      </div>
                      <p className="text-[10px] text-[#006B3F] mt-1">
                        💡 {item.postedBy}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        title={savedJobs.includes(item.id) ? "Remove from saved" : "Save job"}
                        onClick={() => {
                          const updated = savedJobs.includes(item.id)
                            ? savedJobs.filter((id) => id !== item.id)
                            : [...savedJobs, item.id];
                          setSavedJobs(updated);
                          showToast(
                            savedJobs.includes(item.id)
                              ? "জবটি সেভ করা থেকে সরানো হয়েছে"
                              : "জবটি সফলভাবে সেভ করা হয়েছে"
                          );
                        }}
                        className={`btn btn-sm cursor-pointer ${
                          savedJobs.includes(item.id) ? "btn-primary" : "btn-ghost"
                        }`}
                      >
                        {savedJobs.includes(item.id) ? "💾 Saved" : "🔖 Save"}
                      </button>
                      <button
                        onClick={() => {
                          if (!appliedJobs.includes(item.id)) {
                            api.applyJob(item.id);
                            setAppliedJobs([...appliedJobs, item.id]);
                            showToast("আবেদন সফলভাবে গৃহীত হয়েছে!");
                          }
                        }}
                        className={`btn btn-sm cursor-pointer ${
                          appliedJobs.includes(item.id)
                            ? "bg-[#006B3F] text-white"
                            : "btn-primary"
                        }`}
                      >
                        {appliedJobs.includes(item.id) ? "✓ Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "My Applications" && (
            <div>
              {appliedJobs.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="font-semibold text-[#0F172A]">
                    No Applications Yet
                  </h3>
                  <p className="text-[#64748B] text-sm mt-1">
                    Browse jobs and apply to track your career journey here.
                  </p>
                  <button
                    onClick={() => setActiveTab("Browse Jobs")}
                    className="btn btn-primary btn-sm mt-4 cursor-pointer"
                  >
                    Browse Available Jobs
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs
                    .filter((item) => appliedJobs.includes(item.id))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border border-[#E2E8F0] rounded-xl hover:shadow-xs transition-shadow"
                      >
                        <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-xl">
                          {item.logo || "💼"}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#0F172A] text-sm">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#64748B]">{item.company} · {item.location}</p>
                        </div>
                        <span className="badge badge-green text-xs font-semibold">
                          ✓ Applied
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Saved Jobs" && (
            <div>
              {savedJobs.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-5xl mb-4">🔖</div>
                  <h3 className="font-semibold text-[#0F172A]">
                    No Saved Jobs
                  </h3>
                  <p className="text-[#64748B] text-sm mt-1">
                    Bookmark openings you want to review and apply to later.
                  </p>
                  <button
                    onClick={() => setActiveTab("Browse Jobs")}
                    className="btn btn-primary btn-sm mt-4 cursor-pointer"
                  >
                    Browse Openings
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs
                    .filter((item) => savedJobs.includes(item.id))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border border-[#E2E8F0] rounded-xl"
                      >
                        <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-xl">
                          {item.logo || "💼"}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#0F172A] text-sm">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#64748B]">
                            {item.company} · {item.salary}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSavedJobs(savedJobs.filter((id) => id !== item.id));
                              showToast("সেভ তালিকা থেকে সরানো হয়েছে");
                            }}
                            className="btn btn-ghost btn-sm text-xs cursor-pointer"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => {
                              if (!appliedJobs.includes(item.id)) {
                                api.applyJob(item.id);
                                setAppliedJobs([...appliedJobs, item.id]);
                                showToast("আবেদন সফলভাবে সম্পন্ন হয়েছে!");
                              }
                            }}
                            className={`btn btn-sm cursor-pointer ${
                              appliedJobs.includes(item.id) ? "bg-[#006B3F] text-white" : "btn-primary"
                            }`}
                          >
                            {appliedJobs.includes(item.id) ? "✓ Applied" : "Apply Now"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Posted by Alumni" && (
            <div className="space-y-3">
              {jobs.map((item) => {
                const requested = referralsRequested.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-[#E2E8F0] rounded-xl hover:shadow-xs transition-shadow"
                  >
                    <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      {item.logo || "💼"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#0F172A] text-sm">
                        {item.title}
                      </h3>
                      <p className="text-[#64748B] text-xs">{item.company} · {item.location}</p>
                      <p className="text-[10px] text-[#006B3F] mt-0.5">
                        👤 {item.postedBy}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRequestReferral(item)}
                      className={`btn btn-sm flex-shrink-0 cursor-pointer ${
                        requested ? "bg-[#006B3F] text-white border-[#006B3F]" : "btn-outline"
                      }`}
                    >
                      {requested ? "✓ Referral Requested" : "Request Referral"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

