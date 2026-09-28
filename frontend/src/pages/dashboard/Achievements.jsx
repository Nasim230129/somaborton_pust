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
      title: ``,
      category: ``,
      desc: ``,
      date: ``,
    });
  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-[#0F172A]">
          Achievements
        </h1>
        <button onClick={() => t(!e)} className="btn btn-green btn-sm">
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
        <button className="btn btn-outline btn-sm mt-4">
          Nominate an Alumni →
        </button>
      </div>
    </div>
  );
}
