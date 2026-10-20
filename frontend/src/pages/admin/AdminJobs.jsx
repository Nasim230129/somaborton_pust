import React, { useState } from "react";
import { api } from "../../services/api";

const initialJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Brain Station 23",
    dept: "CSE",
    type: "Full-time",
    location: "Dhaka",
    salary: "BDT 80–120K",
    posted: "2 days ago",
    status: "pending",
    applicants: 14,
    desc: "Looking for an experienced engineer skilled in React, Node.js, and distributed microservices architecture.",
  },
  {
    id: 2,
    title: "Power Systems Engineer",
    company: "BPDB",
    dept: "EEE",
    type: "Government",
    location: "Dhaka",
    salary: "Grade 9",
    posted: "1 day ago",
    status: "approved",
    applicants: 34,
    desc: "Overseeing electrical grid distribution and substation performance analysis.",
  },
  {
    id: 3,
    title: "Data Analyst Intern",
    company: "HSBC Bangladesh",
    dept: "MATH",
    type: "Internship",
    location: "Dhaka",
    salary: "BDT 20K",
    posted: "3 days ago",
    status: "approved",
    applicants: 91,
    desc: "Analyzing corporate banking transaction datasets using SQL, Python, and PowerBI.",
  },
  {
    id: 4,
    title: "Research Assistant",
    company: "PUST",
    dept: "PHY",
    type: "Part-time",
    location: "Pabna",
    salary: "Stipend",
    posted: "4 hrs ago",
    status: "pending",
    applicants: 5,
    desc: "Assisting faculty members in solid-state physics laboratory experiments.",
  },
  {
    id: 5,
    title: "Content Strategist",
    company: "The Daily Star",
    dept: "English",
    type: "Full-time",
    location: "Dhaka",
    salary: "BDT 40–60K",
    posted: "5 days ago",
    status: "approved",
    applicants: 58,
    desc: "Leading digital editorial narratives, social media strategies, and corporate features.",
  },
  {
    id: 6,
    title: "Civil Engineer",
    company: "LGED",
    dept: "CE",
    type: "Government",
    location: "Multiple",
    salary: "Grade 8",
    posted: "6 days ago",
    status: "rejected",
    applicants: 0,
    desc: "Rural infrastructure planning and road network supervision.",
  },
];

export default function AdminJobs() {
  const [jobs, setJobs] = useState(initialJobs);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    company: "",
    dept: "CSE",
    type: "Full-time",
    location: "Dhaka",
    salary: "BDT 50,000–80,000",
    desc: "",
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleUpdateStatus = (jobId, newStatus) => {
    api.updateJob(jobId, { status: newStatus });
    setJobs(
      jobs.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
    showToast(
      newStatus === "approved"
        ? "জব সার্কুলারটি সফলভাবে অনুমোদন দেওয়া হয়েছে!"
        : "জব সার্কুলারটি বাতিল করা হয়েছে।"
    );
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJobForm.title || !newJobForm.company) return;

    const created = {
      id: Date.now(),
      title: newJobForm.title,
      company: newJobForm.company,
      dept: newJobForm.dept,
      type: newJobForm.type,
      location: newJobForm.location,
      salary: newJobForm.salary,
      desc: newJobForm.desc || "No description provided.",
      posted: "Just now",
      status: "approved",
      applicants: 0,
    };

    setJobs([created, ...jobs]);
    api.createJob?.(created);
    setIsAddModalOpen(false);
    setNewJobForm({
      title: "",
      company: "",
      dept: "CSE",
      type: "Full-time",
      location: "Dhaka",
      salary: "BDT 50,000–80,000",
      desc: "",
    });
    showToast("🎉 নতুন জব সার্কুলার সফলভাবে যুক্ত ও অনুমোদিত হয়েছে!");
  };

  const filtered = jobs.filter((j) => {
    const matchesStatus = filterStatus === "all" || j.status === filterStatus;
    const matchesSearch =
      !searchQuery.trim() ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    pending: jobs.filter((j) => j.status === "pending").length,
    approved: jobs.filter((j) => j.status === "approved").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Add Posting Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                Add Institutional Job Posting
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddJob} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Job Title *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Lead Network Engineer"
                  value={newJobForm.title}
                  onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Company Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Grameenphone"
                    value={newJobForm.company}
                    onChange={(e) => setNewJobForm({ ...newJobForm, company: e.target.value })}
                    className="input text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newJobForm.dept}
                    onChange={(e) => setNewJobForm({ ...newJobForm, dept: e.target.value })}
                    className="input text-sm w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Job Type
                  </label>
                  <select
                    value={newJobForm.type}
                    onChange={(e) => setNewJobForm({ ...newJobForm, type: e.target.value })}
                    className="input text-sm w-full"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Government">Government</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={newJobForm.salary}
                    onChange={(e) => setNewJobForm({ ...newJobForm, salary: e.target.value })}
                    className="input text-sm w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newJobForm.location}
                  onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Job Description & Qualifications
                </label>
                <textarea
                  rows={3}
                  value={newJobForm.desc}
                  onChange={(e) => setNewJobForm({ ...newJobForm, desc: e.target.value })}
                  placeholder="Key responsibilities, skills, eligibility criteria..."
                  className="input text-sm w-full"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-green btn-sm">
                  Publish Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A]">Job Details</h2>
              <button
                onClick={() => setViewingJob(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-[#0F172A]">{viewingJob.title}</h3>
                <p className="text-xs text-[#64748B]">{viewingJob.company} · {viewingJob.location}</p>
                <div className="flex gap-2 flex-wrap mt-2">
                  <span className="badge badge-blue text-xs">{viewingJob.type}</span>
                  <span className="badge badge-purple text-xs">Dept: {viewingJob.dept}</span>
                  <span className="badge badge-green text-xs">{viewingJob.salary}</span>
                  <span className="badge badge-gray text-xs">{viewingJob.applicants} Applicants</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs font-semibold text-[#0F172A] mb-1">Description:</p>
                <p className="text-xs text-[#64748B] leading-relaxed">{viewingJob.desc || "Standard corporate opening for university alumni."}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className={`badge ${
                  viewingJob.status === "approved" ? "badge-green" : viewingJob.status === "rejected" ? "badge-red" : "badge-gold"
                }`}>
                  Status: {viewingJob.status.toUpperCase()}
                </span>
                <div className="flex gap-2">
                  {viewingJob.status !== "approved" && (
                    <button
                      onClick={() => {
                        handleUpdateStatus(viewingJob.id, "approved");
                        setViewingJob(null);
                      }}
                      className="btn btn-green btn-sm cursor-pointer"
                    >
                      ✓ Approve
                    </button>
                  )}
                  {viewingJob.status !== "rejected" && (
                    <button
                      onClick={() => {
                        handleUpdateStatus(viewingJob.id, "rejected");
                        setViewingJob(null);
                      }}
                      className="btn btn-danger btn-sm cursor-pointer"
                    >
                      ✕ Reject
                    </button>
                  )}
                  <button
                    onClick={() => setViewingJob(null)}
                    className="btn btn-ghost btn-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F172A]">
            Job Postings
          </h1>
          <p className="text-[#64748B] text-sm">
            {jobs.length} total postings submitted by employers & alumni
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-green btn-sm cursor-pointer self-start sm:self-auto"
        >
          + Add Posting
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {[
            ["all", "All", jobs.length],
            ["pending", "Pending Review", counts.pending],
            ["approved", "Approved", counts.approved],
            ["rejected", "Rejected", counts.rejected],
          ].map(([statusKey, label, count]) => (
            <button
              key={statusKey}
              onClick={() => setFilterStatus(statusKey)}
              className={`btn btn-sm cursor-pointer ${
                filterStatus === statusKey ? "btn-primary" : "btn-ghost"
              }`}
            >
              {label} <span className="ml-1 badge badge-gray text-[9px]">{count}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search title, company, dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-7 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 focus:border-[#1B4F8A] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="card rounded-xl p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                💼
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">{item.title}</h3>
                    <p className="text-xs text-[#64748B]">
                      {item.company} · {item.location} · {item.type}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="badge badge-gray text-[9px]">{item.dept}</span>
                      <span className="badge badge-blue text-[9px]">{item.salary}</span>
                      <span className="text-[10px] text-[#94A3B8]">
                        Posted {item.posted}
                      </span>
                      {item.applicants > 0 && (
                        <span className="text-[10px] text-[#64748B]">
                          👥 {item.applicants} applicants
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`badge flex-shrink-0 ${
                      item.status === "approved"
                        ? "badge-green"
                        : item.status === "rejected"
                        ? "badge-red"
                        : "badge-gold"
                    }`}
                  >
                    {item.status === "approved"
                      ? "✓ Approved"
                      : item.status === "rejected"
                      ? "✕ Rejected"
                      : "⏳ Pending"}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  {item.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(item.id, "approved")}
                        className="btn btn-green btn-sm cursor-pointer"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item.id, "rejected")}
                        className="btn btn-danger btn-sm cursor-pointer"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setViewingJob(item)}
                    className="btn btn-ghost btn-sm cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card rounded-xl py-16 text-center text-[#94A3B8]">
            No job postings match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
