import React, { useState, useEffect, Suspense } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { wa } from "../data/mockData";
import { useBackendSync, getCurrentUser } from "../services/api";
import LoadingFallback from "../components/LoadingFallback";
import ScrollControls from "../components/ScrollControls";
import useScrollReveal from "../services/useScrollReveal";
import Navbar from "../components/Navbar";

export default function PublicRoot() {
  useBackendSync();
  useScrollReveal();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return localStorage.getItem("pust_token") ? getCurrentUser() : null;
    } catch (e) {
      return null;
    }
  });

  const { pathname } = useLocation();

  useEffect(() => {
    const handleSync = () => {
      try {
        setCurrentUser(localStorage.getItem("pust_token") ? getCurrentUser() : null);
      } catch (e) {}
    };
    window.addEventListener("pust-data-synced", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("pust-data-synced", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C] flex flex-col selection:bg-[#B5893C] selection:text-white">
      {/* Skip to Main Content Link for Keyboard and Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#B5893C] focus:text-white focus:font-bold focus:rounded-md focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* World-Class Modern University Navbar */}
      <Navbar currentUser={currentUser} onUserChange={setCurrentUser} />

      {/* Main Outlet for Pages */}
      <main id="main-content" tabIndex="-1" className="flex-1 pb-20 lg:pb-0">
        <Suspense fallback={<LoadingFallback message="Loading content..." />}>
          <div key={pathname} className="animate-page-enter">
            <Outlet />
          </div>
        </Suspense>
      </main>

      {/* Authentic Institutional Deep Navy Footer */}
      <footer className="pt-16 pb-12 border-t border-[#1E324F] bg-[#17263C] text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Branding Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-md border border-white/20 ring-2 ring-blue-500/30">
                  <img src={wa} alt="PUST Emblem" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-white font-bold text-base sm:text-lg tracking-tight font-display">
                    PUST Alumni Network
                  </p>
                  <p className="text-[10px] sm:text-[10.5px] uppercase tracking-widest text-blue-300 font-semibold mt-0.5">
                    Pabna University of Science & Technology · Est. 2008
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed max-w-sm mb-5 text-slate-300">
                Official alumni platform connecting 22,400+ graduates of Pabna University of Science and Technology across 45 countries for lifelong professional collaboration, research excellence, and community mentorship.
              </p>
              <div className="flex gap-2">
                {[
                  { name: "LinkedIn", href: "https://www.linkedin.com/school/pabna-university-of-science-and-technology" },
                  { name: "Facebook", href: "https://www.facebook.com/pust.ac.bd" },
                  { name: "YouTube", href: "https://www.youtube.com/results?search_query=PUST+alumni" },
                  { name: "X", href: "https://twitter.com/search?q=PUST" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 border border-white/15 text-slate-200 hover:text-white hover:bg-[#1D4ED8] hover:border-[#1D4ED8] transition-all"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {[
              {
                title: "Alumni Network",
                links: [
                  { l: "Alumni Directory", to: "/alumni" },
                  { l: "Find Mentors", to: "/mentorship" },
                  { l: "Career Opportunities", to: "/jobs" },
                  { l: "Alumni Events", to: "/events" },
                ],
              },
              {
                title: "University & Community",
                links: [
                  { l: "News & Stories", to: "/news" },
                  { l: "Community Forum", to: "/community" },
                  { l: "Photo Gallery", to: "/gallery" },
                  { l: "Giving & Endowment", to: "/donate" },
                  { l: "About PUST", to: "/about" },
                  { l: "Contact & Campus Map", to: "/contact" },
                ],
              },
              {
                title: "Member Portal",
                links: [
                  { l: "Alumni Login", to: "/login" },
                  { l: "Join Network (Registration)", to: "/register" },
                  { l: "Member Dashboard", to: "/dashboard" },
                  { l: "Admin Console", to: "/admin" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 pb-2 border-b border-[#1E324F]">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.l}>
                      <Link
                        to={link.to}
                        className="text-xs sm:text-sm text-slate-300 hover:text-white hover:underline transition-colors"
                      >
                        {link.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#1E324F] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>© 2026 Pabna University of Science & Technology Alumni Network. All rights reserved.</p>
            <div className="flex gap-5">
              {[
                { l: "Privacy Policy", to: "#" },
                { l: "Terms of Service", to: "#" },
                { l: "Institutional Contact", to: "/contact" },
              ].map((item) => (
                <Link key={item.l} to={item.to} className="hover:text-white transition-colors">
                  {item.l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Floating University Quick Dock */}
      <aside
        aria-label="Quick mobile navigation dock"
        className="lg:hidden fixed bottom-3 left-3 right-3 z-40 pointer-events-none"
      >
        <div className="pointer-events-auto bg-[#0F172A]/95 border border-white/10 backdrop-blur-2xl rounded-2xl px-2 py-1.5 flex items-center justify-around text-slate-300 max-w-md mx-auto shadow-[0_15px_35px_rgba(0,0,0,0.5)] ring-1 ring-blue-500/20">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-white bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] font-bold shadow-xs ring-1 ring-white/20"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            <span className="text-base leading-none">🏠</span>
            <span className="text-[10px] mt-0.5">Home</span>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-white bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] font-bold shadow-xs ring-1 ring-white/20"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            <span className="text-base leading-none">ℹ️</span>
            <span className="text-[10px] mt-0.5">About</span>
          </NavLink>
          <NavLink
            to="/alumni"
            className={({ isActive }) =>
              `flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-white bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] font-bold shadow-xs ring-1 ring-white/20"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            <span className="text-base leading-none">🎓</span>
            <span className="text-[10px] mt-0.5">Alumni</span>
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-white bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] font-bold shadow-xs ring-1 ring-white/20"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            <span className="text-base leading-none">📅</span>
            <span className="text-[10px] mt-0.5">Events</span>
          </NavLink>
          <NavLink
            to="/news"
            className={({ isActive }) =>
              `flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-white bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] font-bold shadow-xs ring-1 ring-white/20"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            <span className="text-base leading-none">📰</span>
            <span className="text-[10px] mt-0.5">News</span>
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-white bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] font-bold shadow-xs ring-1 ring-white/20"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            <span className="text-base leading-none">✉️</span>
            <span className="text-[10px] mt-0.5">Contact</span>
          </NavLink>
        </div>
      </aside>

      {/* Floating Scroll Controls: Progress Bar & Scroll To Top */}
      <ScrollControls />
    </div>
  );
}
