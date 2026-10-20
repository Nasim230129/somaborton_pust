import React, { useState } from "react";

var Hs = [
    {
      id: 1,
      title: `Distinguished Alumni Award 2023`,
      category: `Award`,
      status: `verified`,
      date: `Dec 2023`,
      desc: `Awarded by PUST Alumni Association for outstanding contributions to Bangladesh's tech industry.`,
      icon: `🏆`,
    },
    {
      id: 2,
      title: `Published 3 IEEE Papers on ML Systems`,
      category: `Research`,
      status: `verified`,
      date: `2022–2023`,
      desc: `Papers on distributed machine learning architectures, cited 240+ times.`,
      icon: `📄`,
    },
    {
      id: 3,
      title: `Speaker at NASSCOM India Tech Summit`,
      category: `Recognition`,
      status: `pending`,
      date: `Oct 2024`,
      desc: `Keynote on building engineering teams in emerging markets.`,
      icon: `🎤`,
    },
  ],
  Us = [
    `Award`,
    `Career Milestone`,
    `Research`,
    `Entrepreneurship`,
    `Social Impact`,
    `Recognition`,
    `Other`,
  ];
export default function DashboardAchievements() {
  let [e, t] = useState(false),
    [n, r] = useState(Hs),
    [i, a] = useState({
      title: "",
      category: "",
      desc: "",
      date: "",
    });

  const [toastMsg, setToastMsg] = useState("");
  const [isNominateModalOpen, setIsNominateModalOpen] = useState(false);
  const [nominationForm, setNominationForm] = useState({
    name: "",
    dept: "CSE",
    batch: "2015",
    category: "Distinguished Career",
    reason: "",
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleNominateSubmit = (e) => {
    e.preventDefault();
    setIsNominateModalOpen(false);
    showToast(`🎉 ${nominationForm.name}-এর অ্যাওয়ার্ড নমিনেশন সফলভাবে সাবমিট হয়েছে!`);
    setNominationForm({
      name: "",
      dept: "CSE",
      batch: "2015",
      category: "Distinguished Career",
      reason: "",
    });
  };

  return (
    <div className="max-w-4xl space-y-5">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-[#0F172A]">
          Achievements
        </h1>
        <button onClick={() => t(!e)} className="btn btn-green btn-sm cursor-pointer">
          + Submit Achievement
        </button>
      </div>
      {e && (
        <div className="card rounded-xl p-6">
          <h2 className="font-semibold text-[#0F172A] mb-4">
            Submit New Achievement
          </h2>
          <form
            onSubmit={(e) => {
              (e.preventDefault(),
                r([
                  ...n,
                  {
                    id: Date.now(),
                    ...i,
                    status: `pending`,
                    icon: `🌟`,
                  },
                ]),
                a({
                  title: ``,
                  category: ``,
                  desc: ``,
                  date: ``,
                }),
                t(false));
            }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  className="input"
                  placeholder="Achievement title"
                  value={i.title}
                  onChange={(e) =>
                    a({
                      ...i,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  className="input"
                  value={i.category}
                  onChange={(e) =>
                    a({
                      ...i,
                      category: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select…</option>
                  {Us.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <input
                  className="input"
                  placeholder="Month Year"
                  value={i.date}
                  onChange={(e) =>
                    a({
                      ...i,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                className="input h-24 resize-none"
                placeholder="Describe your achievement\u2026"
                value={i.desc}
                onChange={(e) =>
                  a({
                    ...i,
                    desc: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              📋 Submitted achievements are reviewed by the alumni admin team
              within 48 hours before appearing publicly.
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-green">
                Submit for Review
              </button>
              <button
                type="button"
                onClick={() => t(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="space-y-4">
        {n.map((e) => (
          <div
            key={e.id}
            className="card rounded-xl p-5 flex items-start gap-4"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {e.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-[#0F172A] text-sm">
                  {e.title}
                </h3>
                <span
                  className={`badge text-[9px] ${e.status === `verified` ? `badge-green` : `badge-gold`}`}
                >
                  {e.status === `verified` ? `✓ Verified` : `⏳ Pending Review`}
                </span>
              </div>
              <div className="flex gap-2 mb-2">
                <span className="badge badge-gray text-[9px]">
                  {e.category}
                </span>
                <span className="text-[10px] text-[#94A3B8]">{e.date}</span>
              </div>
              <p className="text-[#64748B] text-xs leading-relaxed">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card rounded-xl p-6">
        <h2 className="font-semibold text-[#0F172A] mb-4">
          PUST Recognition Awards
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              award: `Distinguished Alumni`,
              icon: `🌟`,
              desc: `Outstanding contribution to society or field`,
            },
            {
              award: `Young Achiever`,
              icon: `🚀`,
              desc: `Alumni under 35 making early impact`,
            },
            {
              award: `Research Excellence`,
              icon: `🔬`,
              desc: `Significant academic or scientific contribution`,
            },
            {
              award: `Entrepreneur of the Year`,
              icon: `💡`,
              desc: `Founded or built a significant business`,
            },
            {
              award: `Social Impact`,
              icon: `❤️`,
              desc: `Meaningful contribution to community/society`,
            },
            {
              award: `Lifetime Achievement`,
              icon: `🏅`,
              desc: `Sustained excellence across a career`,
            },
          ].map((e) => (
            <div
              key={e.award}
              className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hover:border-[#F59E0B]/40 transition-colors"
            >
              <div className="text-2xl mb-2">{e.icon}</div>
              <h3 className="font-semibold text-[#0F172A] text-xs">
                {e.award}
              </h3>
              <p className="text-[#94A3B8] text-[10px] mt-0.5 leading-snug">
                {e.desc}
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsNominateModalOpen(true)}
          className="btn btn-outline btn-sm mt-4 cursor-pointer"
        >
          Nominate an Alumni →
        </button>
      </div>

      {/* Nominate Alumni Modal */}
      {isNominateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A]">
                Nominate a PUST Alumnus
              </h2>
              <button
                onClick={() => setIsNominateModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleNominateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Nominee Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Engr. Tanvir Ahmed"
                  value={nominationForm.name}
                  onChange={(e) => setNominationForm({ ...nominationForm, name: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSE"
                    value={nominationForm.dept}
                    onChange={(e) => setNominationForm({ ...nominationForm, dept: e.target.value })}
                    className="input text-sm w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Batch
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2012"
                    value={nominationForm.batch}
                    onChange={(e) => setNominationForm({ ...nominationForm, batch: e.target.value })}
                    className="input text-sm w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Award Category
                </label>
                <select
                  value={nominationForm.category}
                  onChange={(e) => setNominationForm({ ...nominationForm, category: e.target.value })}
                  className="input text-sm w-full"
                >
                  <option value="Distinguished Career">Distinguished Career</option>
                  <option value="Young Alumnus Award">Young Alumnus Award</option>
                  <option value="Academic Excellence">Academic Excellence</option>
                  <option value="Entrepreneur of the Year">Entrepreneur of the Year</option>
                  <option value="Social Impact">Social Impact</option>
                  <option value="Lifetime Achievement">Lifetime Achievement</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Citation / Contribution Details *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe why this alumnus deserves this recognition..."
                  value={nominationForm.reason}
                  onChange={(e) => setNominationForm({ ...nominationForm, reason: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNominateModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-green btn-sm">
                  Submit Nomination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
