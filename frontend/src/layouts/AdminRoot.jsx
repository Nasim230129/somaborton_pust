import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { wa } from "../data/mockData";

var Pa = [
  {
    to: `/admin`,
    label: `Overview`,
    icon: `📊`,
    exact: true,
  },
  {
    to: `/admin/users`,
    label: `User Management`,
    icon: `👥`,
  },
  {
    to: `/admin/verification`,
    label: `Alumni Verification`,
    icon: `✅`,
    badge: 14,
  },
  {
    to: `/admin/events`,
    label: `Events`,
    icon: `📅`,
  },
  {
    to: `/admin/jobs`,
    label: `Jobs`,
    icon: `💼`,
  },
  {
    to: `/admin/analytics`,
    label: `Analytics`,
    icon: `📈`,
  },
];
export default function AdminRoot() {
  let [e, t] = useState(false);
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {e && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => t(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0F172A] z-50 flex flex-col transition-transform duration-300 ${e ? `translate-x-0` : `-translate-x-full`} lg:translate-x-0`}
      >
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10 flex-shrink-0">
          <img
            src={wa}
            alt="PUST"
            className="w-8 h-8 object-contain flex-shrink-0"
          />
          <div>
            <div className="font-bold text-sm text-white">Admin Panel</div>
            <div className="text-[9px] text-[#64748B] uppercase tracking-wider">
              PUST Alumni
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {Pa.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.exact}
              className={({ isActive: e }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${e ? `bg-[#006B3F] text-white` : `text-[#94A3B8] hover:bg-white/5 hover:text-white`}`
              }
            >
              <span className="text-base">{e.icon}</span>
              <span className="flex-1">{e.label}</span>
              {e.badge && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {e.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[#94A3B8] hover:bg-white/5 hover:text-white transition-colors"
          >
            <span>⬅️</span>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </aside>
      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]"
            onClick={() => t(true)}
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="badge badge-red">Admin Mode</span>
            <span className="text-sm text-[#64748B] hidden sm:block">
              PUST Alumni Administration
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#0F172A]">
              Super Admin
            </span>
            <div className="w-8 h-8 rounded-full bg-[#006B3F] flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
