import React, { useState, useEffect, useMemo, Suspense } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { pa, wa, createInitialsAvatar } from "../data/mockData";
import { api, getCurrentUser, useBackendSync } from "../services/api";
import SearchBar from "../components/SearchBar";
import LoadingFallback from "../components/LoadingFallback";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser() || pa[0]);

  useEffect(() => {
    const handleSync = () => {
      setCurrentUser(getCurrentUser() || pa[0]);
    };
    window.addEventListener("pust-data-synced", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("pust-data-synced", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const completionScore = useMemo(() => {
    const fields = [
      currentUser?.name,
      currentUser?.email,
      currentUser?.phone,
      currentUser?.dept,
      currentUser?.batch,
      currentUser?.headline,
      currentUser?.studentId,
      currentUser?.location,
      currentUser?.bloodGroup,
      currentUser?.bio,
      currentUser?.avatar,
    ];
    const filled = fields.filter((f) => Boolean(f && String(f).trim())).length;
    return Math.min(100, Math.max(35, Math.round((filled / fields.length) * 100)));
  }, [currentUser]);

  const avatarSrc =
    currentUser?.avatar && !currentUser.avatar.includes("unsplash.com")
      ? currentUser.avatar
      : createInitialsAvatar(currentUser?.name || "PUST", currentUser?.role || "alumni");

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#17263C]/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-[#E2E8F0] z-50 flex flex-col transition-transform duration-300 shadow-xl ${
          sidebarOpen ? `translate-x-0` : `-translate-x-full`
        } lg:translate-x-0`}
      >
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[#E2E8F0] bg-white flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#7A1737]/10 border border-[#7A1737]/20 p-1 flex items-center justify-center flex-shrink-0 group-hover:bg-[#7A1737]/20 transition-colors">
              <img src={wa} alt="PUST" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#17263C] tracking-tight">PUST Alumni</div>
              <div className="text-[9px] text-[#7A1737] uppercase tracking-wider font-bold">
                Member Hub
              </div>
            </div>
          </Link>
        </div>

        {/* User Mini Profile Card in Sidebar */}
        <Link
          to="/dashboard/profile"
          className="block px-4 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#FAF5E8] transition-colors group cursor-pointer"
          title="Click to view & edit your profile"
        >
          <div className="flex items-center gap-3">
            <img
              src={avatarSrc}
              alt={currentUser?.name || "User"}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#7A1737]/20 bg-white"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#17263C] group-hover:text-[#7A1737] transition-colors truncate">
                {currentUser?.name || "Alumni"}
              </p>
              <p className="text-xs text-[#64748B] truncate">
                {currentUser?.headline || `${currentUser?.role === "student" ? "Student" : "Alumni"}, ${currentUser?.dept || "PUST"}`}
              </p>
            </div>
            {currentUser?.verified && (
              <span className="text-[#006B3F] text-xs flex-shrink-0 font-extrabold" title="Verified Alumni">
                ✓
              </span>
            )}
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-[#64748B] mb-1 font-medium">
              <span>Profile Completion</span>
              <span className="text-[#17263C] font-bold">{completionScore}%</span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden p-0.5 border"
              style={{ backgroundColor: "#F5EEDB", borderColor: "#E5D7B7" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 shadow-2xs"
                style={{
                  width: `${completionScore}%`,
                  background: "linear-gradient(90deg, #DECA9E 0%, #C7A76C 100%)",
                  backgroundColor: "#C7A76C",
                }}
              />
            </div>
          </div>
        </Link>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {ja.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? `bg-[#7A1737]/10 text-[#7A1737] border-l-4 border-[#7A1737] shadow-xs`
                    : `text-[#475569] hover:text-[#17263C] hover:bg-[#F4F5F7]`
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="w-5 h-5 bg-[#7A1737] text-white text-[10px] rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Bottom Shortcuts */}
        <div className="px-3 py-4 border-t border-[#E2E8F0] space-y-1 bg-white">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm text-[#475569] hover:text-[#17263C] hover:bg-[#F4F5F7] transition-colors font-medium"
          >
            <span>🛡️</span>
            <span>Admin Console</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm text-[#475569] hover:text-[#17263C] hover:bg-[#F4F5F7] transition-colors font-medium"
          >
            <span>🌐</span>
            <span>Public Site</span>
          </Link>
          <button
            onClick={() => {
              api.logout();
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left font-medium"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0">
        {/* Royal Golden Task Bar */}
        <div className="bg-gradient-to-r from-[#B5893C] via-[#E8CB80] to-[#C9A96E] text-black text-[11.5px] font-black py-1.5 px-4 sm:px-6 flex items-center justify-between border-b border-[#9E772B]/80 shadow-xs z-30 font-mono">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black text-white border border-black text-[10.5px] font-medium shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8CB80] animate-pulse" />
              <span className="font-bengali font-medium">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span>
            </span>
            <span className="hidden sm:inline text-black font-bold">|</span>
            <span className="hidden sm:inline text-black font-medium text-xs font-bengali tracking-tight">
              অ্যালামনাই পোর্টাল ও ড্যাশবোর্ড
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono font-black">
            <Link
              to="/"
              className="text-black hover:text-[#7A1737] font-medium transition-colors flex items-center gap-1 font-bengali"
            >
              <span>🌐 মূল ওয়েবসাইট</span>
            </Link>
            <span className="text-black font-black">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-black font-black font-mono text-[10.5px]">
              alumni@pust.ac.bd
            </span>
            <span className="hidden md:inline text-black font-black">|</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black text-white shadow-2xs font-mono">
              সক্রিয় সেশন
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
            <div className="flex-1 max-w-md mx-2 sm:mx-4 lg:mx-0">
              <SearchBar variant="light" placeholder="Search alumni, events, jobs..." />
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                to="/dashboard/notifications"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-[#E2E8F0] hover:border-[#7A1737]/30 text-[#17263C] transition-colors relative shadow-xs"
                aria-label="Notifications"
              >
                <span>🔔</span>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#7A1737] text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  3
                </span>
              </Link>
              <Link to="/dashboard/profile">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#7A1737]/20 hover:ring-[#7A1737] transition-all cursor-pointer shadow-xs"
                />
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 p-4 sm:p-6 bg-[#F4F5F7]" tabIndex="-1">
          <Suspense fallback={<LoadingFallback message="Loading dashboard..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
