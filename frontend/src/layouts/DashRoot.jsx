import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { pa, wa } from "../data/mockData";
import { api, getCurrentUser, useBackendSync } from "../services/api";

var ja = [
    {
      to: `/dashboard`,
      label: `Dashboard`,
      icon: `⊞`,
      exact: true,
    },
    {
      to: `/dashboard/network`,
      label: `My Network`,
      icon: `🔗`,
      badge: 3,
    },
    {
      to: `/dashboard/messages`,
      label: `Messages`,
      icon: `✉️`,
      badge: 3,
    },
    {
      to: `/dashboard/mentorship`,
      label: `Mentorship`,
      icon: `🎯`,
      badge: 2,
    },
    {
      to: `/dashboard/jobs`,
      label: `Jobs & Career`,
      icon: `💼`,
    },
    {
      to: `/dashboard/community`,
      label: `Community`,
      icon: `👥`,
    },
    {
      to: `/dashboard/achievements`,
      label: `Achievements`,
      icon: `🏆`,
    },
    {
      to: `/dashboard/notifications`,
      label: `Notifications`,
      icon: `🔔`,
      badge: 3,
    },
    {
      to: `/dashboard/profile`,
      label: `My Profile`,
      icon: `👤`,
    },
    {
      to: `/dashboard/settings`,
      label: `Settings`,
      icon: `⚙️`,
    },
  ];
export default function DashRoot() {
  useBackendSync();
  let [e, t] = useState(false),
    { pathname: n } = useLocation(),
    navigate = useNavigate(),
    Ma = getCurrentUser() || pa[0];
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {e && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => t(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-[#E2E8F0] z-50 flex flex-col transition-transform duration-300 ${e ? `translate-x-0` : `-translate-x-full`} lg:translate-x-0`}
      >
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[#E2E8F0] flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={wa}
              alt="PUST"
              className="w-8 h-8 object-contain flex-shrink-0"
            />
            <div>
              <div className="font-bold text-sm text-[#006B3F]">
                PUST Alumni
              </div>
              <div className="text-[9px] text-[#94A3B8] uppercase tracking-wider">
                Network
              </div>
            </div>
          </Link>
        </div>
        <div className="px-4 py-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <img
              src={Ma.avatar}
              alt={Ma.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] truncate">
                {Ma.name}
              </p>
              <p className="text-xs text-[#64748B] truncate">{Ma.headline}</p>
            </div>
            {Ma.verified && (
              <span className="text-[#006B3F] text-xs flex-shrink-0">✓</span>
            )}
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-[#94A3B8] mb-1">
              <span>Profile Completion</span>
              <span className="text-[#006B3F] font-semibold">84%</span>
            </div>
            <div className="progress-bar h-1.5">
              <div
                className="progress-fill bg-[#006B3F]"
                style={{
                  width: `84%`,
                }}
              />
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {ja.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.exact}
              className={({ isActive: e }) =>
                `sidebar-link ${e ? `active` : ``}`
              }
            >
              <span className="text-base icon">{e.icon}</span>
              <span className="flex-1">{e.label}</span>
              {e.badge && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {e.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-[#F1F5F9] space-y-1">
          <Link to="/admin" className="sidebar-link text-[#1B4F8A]">
            <span>🛡️</span>
            <span>Admin Panel</span>
          </Link>
          <Link to="/" className="sidebar-link">
            <span>🌐</span>
            <span>Public Site</span>
          </Link>
          <button
            onClick={() => {
              api.logout();
              navigate("/login");
            }}
            className="sidebar-link w-full text-red-500 hover:bg-red-50"
          >
            <span>⬅️</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9]"
            onClick={() => t(true)}
          >
            ☰
          </button>
          <div className="flex-1 max-w-sm mx-4 lg:mx-0">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search alumni, events, jobs\u2026"
                className="input pl-9 py-2 text-sm bg-[#F8FAFC]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/notifications"
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#F1F5F9] relative"
            >
              🔔
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </Link>
            <img
              src={Ma.avatar}
              alt={Ma.name}
              className="w-9 h-9 rounded-full object-cover cursor-pointer"
            />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
