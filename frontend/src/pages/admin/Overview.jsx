import React from "react";

var $s = [
    {
      label: `Total Alumni`,
      value: `18,420`,
      change: `+284 this month`,
      icon: `🎓`,
      color: `#1B4F8A`,
    },
    {
      label: `Active Users (30d)`,
      value: `6,892`,
      change: `+12.4% vs last month`,
      icon: `📊`,
      color: `#006B3F`,
    },
    {
      label: `Pending Verifications`,
      value: `47`,
      change: `Requires action`,
      icon: `⏳`,
      color: `#D97706`,
    },
    {
      label: `Open Job Postings`,
      value: `134`,
      change: `23 new this week`,
      icon: `💼`,
      color: `#7C3AED`,
    },
    {
      label: `Active Mentorships`,
      value: `312`,
      change: `+18 new pairs`,
      icon: `🎯`,
      color: `#0891B2`,
    },
    {
      label: `Events This Month`,
      value: `8`,
      change: `2 upcoming`,
      icon: `📅`,
      color: `#DC2626`,
    },
  ],
  ec = [
    {
      action: `New alumni registration`,
      user: `Arif Chowdhury, CSE 2024`,
      time: `5 min ago`,
      type: `reg`,
    },
    {
      action: `Verification request`,
      user: `Sumaiya Islam, EEE 2019`,
      time: `18 min ago`,
      type: `verify`,
    },
    {
      action: `Job posting submitted`,
      user: `Grameenphone Ltd.`,
      time: `42 min ago`,
      type: `job`,
    },
    {
      action: `Achievement submitted`,
      user: `Dr. Rafiqul Islam — IEEE Award`,
      time: `1 hr ago`,
      type: `achieve`,
    },
    {
      action: `Event created`,
      user: `Homecoming Reunion 2026`,
      time: `2 hrs ago`,
      type: `event`,
    },
    {
      action: `Mentorship match requested`,
      user: `Nahid Hasan → Dr. Rafiqul Islam`,
      time: `3 hrs ago`,
      type: `mentor`,
    },
  ];
export default function AdminOverview() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-[#0F172A]">
          Admin Overview
        </h1>
        <p className="text-[#64748B] text-sm mt-0.5">
          PUST Alumni Platform · Dashboard
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {$s.map((e) => (
          <div key={e.label} className="card rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{e.icon}</span>
              <span className="badge badge-gray text-[9px]">Live</span>
            </div>
            <p
              className="font-display font-bold text-2xl"
              style={{
                color: e.color,
              }}
            >
              {e.value}
            </p>
            <p className="text-xs font-semibold text-[#0F172A] mt-0.5">
              {e.label}
            </p>
            <p className="text-[10px] text-[#94A3B8] mt-1">{e.change}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card rounded-xl p-5">
          <h2 className="font-semibold text-[#0F172A] mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {ec.map((e, t) => (
              <div
                key={t}
                className="flex items-center gap-3 py-2 border-b border-[#F1F5F9] last:border-0"
              >
                <div className="w-8 h-8 bg-[#F1F5F9] rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                  {e.type === `reg`
                    ? `👤`
                    : e.type === `verify`
                      ? `✅`
                      : e.type === `job`
                        ? `💼`
                        : e.type === `achieve`
                          ? `🏆`
                          : e.type === `event`
                            ? `📅`
                            : `🎯`}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#0F172A]">
                    {e.action}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] truncate">
                    {e.user}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-[10px] text-[#94A3B8]">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card rounded-xl p-5">
            <h2 className="font-semibold text-[#0F172A] mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                {
                  label: `Review Verifications`,
                  count: 47,
                  path: `/admin/verification`,
                  icon: `✅`,
                  urgent: true,
                },
                {
                  label: `Moderate Jobs`,
                  count: 12,
                  path: `/admin/jobs`,
                  icon: `💼`,
                  urgent: false,
                },
                {
                  label: `Manage Events`,
                  count: 8,
                  path: `/admin/events`,
                  icon: `📅`,
                  urgent: false,
                },
                {
                  label: `User Management`,
                  count: null,
                  path: `/admin/users`,
                  icon: `👥`,
                  urgent: false,
                },
                {
                  label: `Analytics`,
                  count: null,
                  path: `/admin/analytics`,
                  icon: `📊`,
                  urgent: false,
                },
              ].map((e) => (
                <a
                  key={e.label}
                  href={e.path}
                  className={`flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors ${e.urgent ? `ring-1 ring-amber-200 bg-amber-50` : ``}`}
                >
                  <span className="text-base">{e.icon}</span>
                  <span className="flex-1 text-sm font-medium text-[#0F172A]">
                    {e.label}
                  </span>
                  {e.count !== null && (
                    <span
                      className={`badge ${e.urgent ? `badge-gold` : `badge-gray`}`}
                    >
                      {e.count}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
          <div className="card rounded-xl p-5">
            <h2 className="font-semibold text-[#0F172A] mb-3">System Health</h2>
            {[
              {
                label: `API Response`,
                val: `98ms`,
                ok: true,
              },
              {
                label: `DB Connections`,
                val: `Normal`,
                ok: true,
              },
              {
                label: `Email Queue`,
                val: `2 pending`,
                ok: true,
              },
              {
                label: `Storage`,
                val: `67% used`,
                ok: false,
              },
            ].map((e) => (
              <div
                key={e.label}
                className="flex justify-between items-center py-1.5 text-xs"
              >
                <span className="text-[#64748B]">{e.label}</span>
                <span
                  className={`font-medium ${e.ok ? `text-[#006B3F]` : `text-amber-600`}`}
                >
                  {e.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card rounded-xl p-5">
        <h2 className="font-semibold text-[#0F172A] mb-4">
          Stakeholder Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: `Alumni`,
              count: 18420,
              icon: `🎓`,
              pct: 68,
            },
            {
              label: `Current Students`,
              count: 4200,
              icon: `📚`,
              pct: 16,
            },
            {
              label: `Faculty`,
              count: 380,
              icon: `👨‍🏫`,
              pct: 1,
            },
            {
              label: `Employers / Partners`,
              count: 840,
              icon: `🏢`,
              pct: 3,
            },
          ].map((e) => (
            <div
              key={e.label}
              className="text-center p-4 bg-[#F8FAFC] rounded-xl"
            >
              <div className="text-3xl mb-2">{e.icon}</div>
              <p className="font-bold text-[#0F172A] text-lg">
                {e.count.toLocaleString()}
              </p>
              <p className="text-[#64748B] text-xs">{e.label}</p>
              <div className="progress-bar h-1.5 mt-2">
                <div
                  className="progress-fill bg-[#1B4F8A]"
                  style={{
                    width: `${e.pct}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
