import React from "react";

var lc = [
    `Jan`,
    `Feb`,
    `Mar`,
    `Apr`,
    `May`,
    `Jun`,
    `Jul`,
    `Aug`,
    `Sep`,
    `Oct`,
    `Nov`,
    `Dec`,
  ],
  uc = [340, 480, 420, 610, 580, 720, 840, 790, 930, 870, 1020, 1180],
  dc = [1800, 2100, 1950, 2400, 2600, 2800, 3100, 3e3, 3400, 3200, 3800, 4100],
  fc = Math.max(...uc),
  pc = Math.max(...dc),
  mc = [
    {
      dept: `CSE`,
      alumni: 4820,
      pct: 26,
    },
    {
      dept: `EEE`,
      alumni: 3910,
      pct: 21,
    },
    {
      dept: `BBA`,
      alumni: 2890,
      pct: 16,
    },
    {
      dept: `MATH`,
      alumni: 2340,
      pct: 13,
    },
    {
      dept: `CHEM`,
      alumni: 1760,
      pct: 10,
    },
    {
      dept: `PHY`,
      alumni: 1980,
      pct: 11,
    },
    {
      dept: `Other`,
      alumni: 720,
      pct: 4,
    },
  ],
  hc = [
    `#1B4F8A`,
    `#006B3F`,
    `#7C3AED`,
    `#D97706`,
    `#0891B2`,
    `#DC2626`,
    `#94A3B8`,
  ];
export default function AdminAnalytics() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-[#0F172A]">
          Analytics
        </h1>
        <p className="text-[#64748B] text-sm">
          Platform performance overview · Academic Year 2025–2026
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: `Total Registrations (YTD)`,
            val: `9,780`,
            delta: `+32%`,
            up: true,
          },
          {
            label: `Avg. Monthly Active Users`,
            val: `5,640`,
            delta: `+18%`,
            up: true,
          },
          {
            label: `Profile Completion Rate`,
            val: `68%`,
            delta: `+4pts`,
            up: true,
          },
          {
            label: `Verification Rate`,
            val: `82%`,
            delta: `-1pt`,
            up: false,
          },
        ].map((e) => (
          <div key={e.label} className="card rounded-xl p-5">
            <p className="font-bold text-2xl text-[#0F172A]">{e.val}</p>
            <p className="text-xs text-[#64748B] mt-1 leading-snug">
              {e.label}
            </p>
            <p
              className={`text-xs font-semibold mt-2 ${e.up ? `text-[#006B3F]` : `text-red-500`}`}
            >
              {e.up ? `▲` : `▼`} {e.delta}
              {" vs last year"}
            </p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card rounded-xl p-5">
          <h2 className="font-semibold text-[#0F172A] mb-1">
            Monthly Registrations
          </h2>
          <p className="text-xs text-[#94A3B8] mb-4">
            New users registered per month — 2025
          </p>
          <div className="flex items-end gap-1.5 h-36">
            {uc.map((e, t) => (
              <div key={t} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-[#1B4F8A] hover:bg-[#1B4F8A]/80 transition-colors cursor-pointer"
                  style={{
                    height: `${(e / fc) * 100}%`,
                  }}
                  title={`${lc[t]}: ${e}`}
                />
                <span className="text-[8px] text-[#94A3B8]">
                  {lc[t].slice(0, 1)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card rounded-xl p-5">
          <h2 className="font-semibold text-[#0F172A] mb-1">
            Monthly Active Users
          </h2>
          <p className="text-xs text-[#94A3B8] mb-4">
            Logged-in users at least once per month — 2025
          </p>
          <div className="flex items-end gap-1.5 h-36">
            {dc.map((e, t) => (
              <div key={t} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-[#006B3F] hover:bg-[#006B3F]/80 transition-colors cursor-pointer"
                  style={{
                    height: `${(e / pc) * 100}%`,
                  }}
                  title={`${lc[t]}: ${e}`}
                />
                <span className="text-[8px] text-[#94A3B8]">
                  {lc[t].slice(0, 1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card rounded-xl p-5">
        <h2 className="font-semibold text-[#0F172A] mb-4">
          Alumni by Department
        </h2>
        <div className="space-y-3">
          {mc.map((e, t) => (
            <div key={e.dept} className="flex items-center gap-4">
              <span className="text-xs font-semibold text-[#64748B] w-12 flex-shrink-0">
                {e.dept}
              </span>
              <div className="flex-1 h-5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${e.pct}%`,
                    backgroundColor: hc[t],
                  }}
                />
              </div>
              <span className="text-xs font-bold text-[#0F172A] w-16 text-right">
                {e.alumni.toLocaleString()}
              </span>
              <span className="text-xs text-[#94A3B8] w-8">{e.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            label: `Job Applications Submitted`,
            val: `2,840`,
            icon: `💼`,
          },
          {
            label: `Mentorship Sessions Held`,
            val: `1,290`,
            icon: `🎯`,
          },
          {
            label: `Community Posts (30d)`,
            val: `4,560`,
            icon: `💬`,
          },
          {
            label: `Events Attended (YTD)`,
            val: `8,200`,
            icon: `📅`,
          },
          {
            label: `Achievements Submitted`,
            val: `342`,
            icon: `🏆`,
          },
          {
            label: `Donations Received (BDT)`,
            val: `৳12.4M`,
            icon: `❤️`,
          },
        ].map((e) => (
          <div
            key={e.label}
            className="card rounded-xl p-4 flex items-center gap-3"
          >
            <span className="text-2xl">{e.icon}</span>
            <div>
              <p className="font-bold text-lg text-[#0F172A]">{e.val}</p>
              <p className="text-[10px] text-[#64748B] leading-snug">
                {e.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
