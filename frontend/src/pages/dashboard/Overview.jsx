import React from "react";
import { Link } from "react-router-dom";
import { pa, _a, va, ba } from "../../data/mockData";
import { getCurrentUser, useBackendSync } from "../../services/api";

var Es = [
    {
      label: `Connections`,
      val: `342`,
      icon: `🔗`,
      change: `+12 this month`,
      color: `bg-blue-50 text-[#1B4F8A]`,
    },
    {
      label: `Profile Views`,
      val: `1,240`,
      icon: `👁️`,
      change: `+34% this week`,
      color: `bg-green-50 text-[#006B3F]`,
    },
    {
      label: `Mentees`,
      val: `8`,
      icon: `🎯`,
      change: `2 pending requests`,
      color: `bg-amber-50 text-[#D97706]`,
    },
    {
      label: `Job Applications`,
      val: `3`,
      icon: `💼`,
      change: `1 interview scheduled`,
      color: `bg-purple-50 text-purple-700`,
    },
  ];
export default function DashboardOverview() {
  useBackendSync();
  const Ts = getCurrentUser() || pa[0];
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="bg-gradient-to-r from-[#006B3F] to-[#1B4F8A] rounded-2xl p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img
            src={Ts.avatar}
            alt={Ts.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30"
          />
          <div className="flex-1">
            <p className="text-green-200 text-sm">Good morning,</p>
            <h1 className="font-display font-bold text-2xl lg:text-3xl">
              {"Welcome back, "}
              {Ts.name.split(` `)[0]}!
            </h1>
            <p className="text-green-100 text-sm mt-1">{Ts.headline}</p>
          </div>
          <Link
            to="/dashboard/profile"
            className="btn bg-white text-[#006B3F] hover:bg-green-50 btn-sm font-bold flex-shrink-0"
          >
            Edit Profile
          </Link>
        </div>
        <div className="mt-6 bg-white/10 rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-100">Profile Completion</span>
            <span className="font-bold text-[#F59E0B]">84%</span>
          </div>
          <div className="progress-bar h-2 bg-white/20">
            <div
              className="progress-fill bg-[#F59E0B]"
              style={{
                width: `84%`,
              }}
            />
          </div>
          <p className="text-xs text-green-200 mt-2">
            Add your publications and LinkedIn URL to complete your profile
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Es.map((e) => (
          <div key={e.label} className="stat-card rounded-xl">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${e.color}`}
            >
              {e.icon}
            </div>
            <div className="font-display font-bold text-3xl text-[#0F172A]">
              {e.val}
            </div>
            <div className="text-[#64748B] text-xs mt-0.5">{e.label}</div>
            <div className="text-[10px] text-[#006B3F] font-medium mt-1">
              {e.change}
            </div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#0F172A]">
                People You May Know
              </h2>
              <Link
                to="/dashboard/network"
                className="text-xs text-[#1B4F8A] hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {pa.slice(1, 5).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 p-3 hover:bg-[#F8FAFC] rounded-xl transition-colors"
                >
                  <img
                    src={e.avatar}
                    alt={e.name}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-[#0F172A] text-sm">
                        {e.name}
                      </p>
                      {e.verified && (
                        <span className="text-[#006B3F] text-[10px]">✓</span>
                      )}
                    </div>
                    <p className="text-[#64748B] text-xs truncate">
                      {e.headline}
                    </p>
                    <p className="text-[10px] text-[#94A3B8]">
                      {"Batch "}
                      {e.batch}
                      {" \xB7 "}
                      {e.dept.split(` `)[0]}
                    </p>
                  </div>
                  <button className="btn btn-sm btn-outline flex-shrink-0">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#0F172A]">Notifications</h2>
              <Link
                to="/dashboard/notifications"
                className="text-xs text-[#1B4F8A] hover:underline"
              >
                All
              </Link>
            </div>
            <div className="space-y-3">
              {ba.slice(0, 4).map((e) => (
                <div
                  key={e.id}
                  className={`flex gap-2.5 p-2 rounded-lg ${e.read ? `` : `bg-blue-50/50`}`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center overflow-hidden flex-shrink-0 text-sm">
                    {e.avatar ? (
                      <img
                        src={e.avatar}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      `🔔`
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-[#0F172A] leading-snug">
                      {e.msg}
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      {e.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#0F172A]">Next Event</h2>
              <Link
                to="/dashboard/events"
                className="text-xs text-[#1B4F8A] hover:underline"
              >
                Calendar
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl mb-3 h-28">
              <img
                src={_a[0].img}
                alt={_a[0].title}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="badge badge-blue text-[9px]">{_a[0].type}</span>
            <h3 className="font-semibold text-[#0F172A] text-sm mt-1 leading-snug">
              {_a[0].title}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              {"\uD83D\uDCC5 "}
              {_a[0].date}
            </p>
            <button className="btn btn-primary btn-sm w-full mt-3">
              Register Now
            </button>
          </div>
        </div>
      </div>
      <div className="card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#0F172A]">Recommended Jobs</h2>
          <Link
            to="/dashboard/jobs"
            className="text-xs text-[#1B4F8A] hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {va.slice(0, 3).map((e) => (
            <div
              key={e.id}
              className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hover:border-[#1B4F8A]/30 transition-colors"
            >
              <div className="flex gap-3 mb-3">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                  {e.logo}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#0F172A] text-xs leading-snug">
                    {e.title}
                  </p>
                  <p className="text-[#94A3B8] text-[10px]">{e.company}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#64748B]">
                  {"\uD83D\uDCCD "}
                  {e.location.split(`,`)[0]}
                </span>
                <span
                  className={`badge text-[9px] ${e.type === `Internship` ? `badge-purple` : `badge-blue`}`}
                >
                  {e.type}
                </span>
              </div>
              <p className="text-[10px] text-[#006B3F] font-medium mt-2">
                {e.salary}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="card rounded-xl p-5">
        <h2 className="font-semibold text-[#0F172A] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: `🔍`,
              label: `Find Alumni`,
              to: `/dashboard/network`,
            },
            {
              icon: `💌`,
              label: `Send Message`,
              to: `/dashboard/messages`,
            },
            {
              icon: `📝`,
              label: `Post Achievement`,
              to: `/dashboard/achievements`,
            },
            {
              icon: `🎯`,
              label: `View Requests`,
              to: `/dashboard/mentorship`,
            },
          ].map((e) => (
            <Link
              key={e.label}
              to={e.to}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1B4F8A]/30 hover:bg-blue-50/30 transition-colors text-center"
            >
              <span className="text-2xl">{e.icon}</span>
              <span className="text-xs font-medium text-[#0F172A]">
                {e.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
