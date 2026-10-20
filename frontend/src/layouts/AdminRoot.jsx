import React, { useState, Suspense } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { wa } from "../data/mockData";
import SearchBar from "../components/SearchBar";
import LoadingFallback from "../components/LoadingFallback";

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
  let [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#17263C]/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-[#E2E8F0] z-50 flex flex-col transition-transform duration-300 shadow-xl ${
          sidebarOpen ? `translate-x-0` : `-translate-x-full`
        } lg:translate-x-0`}
      >
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[#E2E8F0] bg-white flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#7A1737]/10 border border-[#7A1737]/20 p-1 flex items-center justify-center flex-shrink-0">
            <img src={wa} alt="PUST" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-bold text-sm text-[#17263C] tracking-tight">Admin Console</div>
            <div className="text-[9px] text-[#7A1737] uppercase tracking-wider font-bold">
              PUST Central Administration
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {Pa.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? `bg-[#7A1737]/10 text-[#7A1737] border-l-4 border-[#7A1737] shadow-xs`
                    : `text-[#475569] hover:bg-[#F4F5F7] hover:text-[#17263C]`
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="w-5 h-5 bg-[#7A1737] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[#E2E8F0] space-y-1 bg-white">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm text-[#475569] hover:text-[#17263C] hover:bg-[#F4F5F7] transition-colors font-medium"
          >
            <span>⬅️</span>
            <span>User Dashboard</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm text-[#475569] hover:text-[#17263C] hover:bg-[#F4F5F7] transition-colors font-medium"
          >
            <span>🌐</span>
            <span>Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Royal Golden Task Bar */}
        <div className="bg-gradient-to-r from-[#B5893C] via-[#E8CB80] to-[#C9A96E] text-black text-[11.5px] font-black py-1.5 px-4 sm:px-6 flex items-center justify-between border-b border-[#9E772B]/80 shadow-xs z-30 font-mono">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black text-white border border-black text-[10.5px] font-medium shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8CB80] animate-pulse" />
              <span className="font-bengali font-medium">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span>
            </span>
            <span className="hidden sm:inline text-black font-bold">|</span>
            <span className="hidden sm:inline text-black font-medium text-xs font-bengali tracking-tight">
              সেন্ট্রাল অ্যাডমিন কন্ট্রোল সেন্টার
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono font-black">
            <Link
              to="/dashboard"
              className="text-black hover:text-[#7A1737] font-medium transition-colors flex items-center gap-1 font-bengali"
            >
              <span>⬅️ ইউজার ড্যাশবোর্ড</span>
            </Link>
            <span className="text-black font-black">|</span>
            <Link
              to="/"
              className="text-black hover:text-[#7A1737] font-medium transition-colors flex items-center gap-1 font-bengali"
            >
              <span>🌐 পাবলিক সাইট</span>
            </Link>
            <span className="hidden md:inline text-black font-black">|</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black text-white shadow-2xs font-mono">
              অ্যাডমিন সেশন
            </span>
          </div>
        </div>

        {/* Golden accent hairline */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#B5893C] via-[#F4E3AD] to-[#B5893C] shadow-2xs" />

        <header className="bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-30 shadow-xs">
          <div className="h-16 flex items-center justify-between px-4 sm:px-6 gap-3">
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F4F5F7] text-[#17263C] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              ☰
            </button>
            <div className="flex items-center gap-2">
              <span className="bg-[#7A1737]/10 border border-[#7A1737]/20 text-[#7A1737] px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A1737] animate-pulse" />
                <span>Admin Mode</span>
              </span>
              <span className="text-xs text-[#64748B] hidden sm:block">
                PUST Central Administration
              </span>
            </div>
            <div className="flex-1 max-w-sm mx-4 hidden md:block">
              <SearchBar variant="light" placeholder="Search alumni, jobs, events..." />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-medium text-[#475569]">
                Super Admin
              </span>
              <div className="w-8 h-8 rounded-full bg-[#7A1737] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#7A1737]/20 shadow-xs">
                A
              </div>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 p-4 sm:p-6 bg-[#F4F5F7]" tabIndex="-1">
          <Suspense fallback={<LoadingFallback message="Loading admin panel..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
