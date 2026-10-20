import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { wa, ba, createInitialsAvatar } from "../data/mockData";
import { api } from "../services/api";
import SearchBar from "./SearchBar";

export default function Navbar({ currentUser, onUserChange }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Refs for click outside
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const exploreMenuRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  const unreadCount = ba.filter((item) => !item.read).length;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchDrawerOpen(false);
    setNotifDropdownOpen(false);
    setUserDropdownOpen(false);
    setExploreDropdownOpen(false);
  }, [pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (exploreMenuRef.current && !exploreMenuRef.current.contains(e.target)) {
        setExploreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut & escape key handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchDrawerOpen(false);
        setNotifDropdownOpen(false);
        setUserDropdownOpen(false);
        setExploreDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleSignOut = () => {
    api.logout();
    if (onUserChange) onUserChange(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  // Primary navigation links required by user specification
  const primaryNavLinks = [
    { label: "Home", to: "/", exact: true, isActive: pathname === "/" },
    { label: "About", to: "/about", isActive: pathname.startsWith("/about") },
    {
      label: "Alumni Directory",
      to: "/alumni",
      isActive: pathname.startsWith("/alumni") || pathname.startsWith("/directory"),
    },
    { label: "Events", to: "/events", isActive: pathname.startsWith("/events") },
    {
      label: "News",
      to: "/news",
      isActive: pathname.startsWith("/news") || pathname.startsWith("/stories"),
    },
    { label: "Contact", to: "/contact", isActive: pathname.startsWith("/contact") },
  ];

  // Secondary links preserved so no routes or features are lost
  const exploreLinks = [
    {
      label: "Jobs & Careers",
      desc: "Career opportunities & alumni recruitment",
      to: "/jobs",
      icon: "💼",
      isActive: pathname.startsWith("/jobs"),
    },
    {
      label: "Mentorship",
      desc: "Connect with senior industry leaders",
      to: "/mentorship",
      icon: "🎯",
      isActive: pathname.startsWith("/mentorship"),
    },
    {
      label: "Community Forum",
      desc: "Discussions, batch groups & collaboration",
      to: "/community",
      icon: "👥",
      isActive: pathname.startsWith("/community"),
    },
    {
      label: "Give Back",
      desc: "Scholarships & campus endowment fund",
      to: "/donate",
      icon: "💝",
      isActive: pathname.startsWith("/donate"),
    },
    {
      label: "Photo Gallery",
      desc: "Campus memories & convocation archives",
      to: "/gallery",
      icon: "🖼️",
      isActive: pathname.startsWith("/gallery"),
    },
  ];

  const isExploreActive = exploreLinks.some((link) => link.isActive);

  return (
    <div className="pust-gold-navbar select-none">
      {/* 1. TOP INSTITUTIONAL PRE-HEADER STRIP (Light Golden Champagne Ribbon) */}
      <div className="hidden sm:block pust-gold-ribbon text-[#17263C] text-[12px] lg:text-[12.5px] transition-colors py-1.5 px-4 sm:px-6 lg:px-8 font-bold">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Institutional Identification */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#17263C]">
              <span className="w-2 h-2 rounded-full bg-[#B5893C] animate-pulse" />
              <span className="font-bengali font-medium">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span>
            </span>
            <span className="text-[#C7A76C]">|</span>
            <span className="font-bengali font-medium text-[#17263C] hidden md:inline">
              সমাবর্তন ও অ্যালামনাই নেটওয়ার্ক
            </span>
            <span className="text-[#C7A76C] hidden lg:inline">|</span>
            <span className="text-[#55401D] font-bold hidden lg:inline">
              Rajapur, Pabna-6600, Bangladesh &bull; Est. 2008
            </span>
          </div>

          {/* Quick Institutional Support & Live Count */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="mailto:alumni@pust.ac.bd"
              className="inline-flex items-center gap-1.5 text-[#17263C] hover:text-[#B5893C] font-bold transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#B5893C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>alumni@pust.ac.bd</span>
            </a>
            <span className="text-[#C7A76C] hidden md:inline">|</span>
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-1 text-[#17263C] hover:text-[#B5893C] font-bold transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#B5893C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Helpdesk</span>
            </Link>
            <span className="text-[#C7A76C] hidden sm:inline">|</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#17263C] text-[#F8E7B9] font-bold text-[11px] border border-[#B5893C] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8CB80] animate-pulse" />
              <span>22,400+ Registered Alumni</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY NAVBAR (Light Golden Background, Bold Times New Roman, Interactive Hover Buttons) */}
      <header
        className={`pust-gold-nav-header sticky top-0 z-40 transition-all duration-300 backdrop-blur-xl ${
          scrolled ? "py-0" : "py-1"
        }`}
      >
        {/* Radiant Golden Decorative Top Hairline */}
        <div className="pust-gold-hairline w-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-16 sm:h-[70px]" : "h-20 sm:h-[80px]"
            }`}
          >
            {/* LEFT: PUST Alumni Network Logo & Brand Name */}
            <Link
              to="/"
              className="flex items-center gap-3 sm:gap-3.5 group flex-shrink-0 transition-transform duration-200 select-none"
              aria-label="PUST Alumni Network Homepage"
            >
              {/* University Logo Emblem with Golden Double Ring */}
              <div className="relative flex-shrink-0">
                <div
                  className={`rounded-2xl p-1 sm:p-1.5 flex items-center justify-center bg-white border-2 border-[#C7A76C] shadow-md ring-2 ring-[#E8CB80]/50 group-hover:ring-[#B5893C] group-hover:scale-105 transition-all duration-300 ${
                    scrolled ? "w-10 h-10 sm:w-12 sm:h-12" : "w-12 h-12 sm:w-14 sm:h-14"
                  }`}
                >
                  <img
                    src={wa}
                    alt="PUST Official Emblem"
                    className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Official University Verified Checkmark */}
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#B5893C] rounded-full ring-2 ring-white flex items-center justify-center text-[9px] text-white font-extrabold shadow-xs"
                  title="Official University Verified Portal"
                >
                  ✓
                </span>
              </div>

              {/* Brand Typography in Bold Times New Roman */}
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#17263C] text-lg sm:text-[22px] tracking-tight group-hover:text-[#B5893C] transition-colors">
                    PUST Alumni
                  </span>
                  <span className="text-[10px] sm:text-[11px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-[#17263C] text-[#F8E7B9] border border-[#B5893C] shadow-xs">
                    Network
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 mt-0.5 text-[#55401D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B5893C]" />
                  <span className="font-bold text-[11px] tracking-wide text-[#55401D]">
                    Pabna University of Science & Technology
                  </span>
                </div>
              </div>
            </Link>

            {/* CENTER: Navigation Links in Bold Times New Roman with Hover Color Change */}
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-1.5 mx-2 bg-[#F6EED8]/70 px-2 py-1.5 rounded-2xl border border-[#DECFA9] shadow-2xs"
              aria-label="Main Navigation"
            >
              {primaryNavLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`pust-nav-btn relative px-3 py-1.5 rounded-xl text-[14px] xl:text-[14.5px] font-bold select-none flex items-center gap-1.5 cursor-pointer ${
                    item.isActive ? "is-active" : ""
                  }`}
                >
                  {item.isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8CB80] animate-pulse" />
                  )}
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* "Explore More" Dropdown for Complete Site Coverage */}
              <div className="relative" ref={exploreMenuRef}>
                <button
                  type="button"
                  onClick={() => setExploreDropdownOpen(!exploreDropdownOpen)}
                  aria-expanded={exploreDropdownOpen}
                  aria-label="Explore more categories"
                  className={`pust-explore-btn px-3 py-1.5 rounded-xl text-[14px] xl:text-[14.5px] font-bold flex items-center gap-1 cursor-pointer select-none ${
                    isExploreActive || exploreDropdownOpen ? "is-active" : ""
                  }`}
                >
                  <span>Explore</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      exploreDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu Panel with Golden Styling */}
                {exploreDropdownOpen && (
                  <div className="absolute left-0 mt-2.5 w-72 bg-[#FDFBF7] rounded-2xl shadow-2xl border-2 border-[#D4C39B] py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 pb-2 mb-1 border-b border-[#EBDDB7]">
                      <p className="text-[11px] font-extrabold text-[#75551E] uppercase tracking-wider">
                        More University Services
                      </p>
                    </div>
                    <div className="space-y-0.5 px-1.5">
                      {exploreLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setExploreDropdownOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 ${
                            link.isActive
                              ? "bg-[#17263C] text-[#F8E7B9] border border-[#B5893C]"
                              : "text-[#17263C] hover:bg-[#B5893C] hover:text-white"
                          }`}
                        >
                          <span className="text-lg leading-none mt-0.5">{link.icon}</span>
                          <div>
                            <p className="text-[13.5px] font-bold leading-tight">{link.label}</p>
                            <p className="text-[11px] text-[#6A5328] hover:text-white/90 leading-snug mt-0.5 font-bold">
                              {link.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* RIGHT: Buttons with Interactive Mouse Hover Color Transformations */}
            <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
              {/* Quick Search Toggle Button */}
              <button
                type="button"
                onClick={() => setSearchDrawerOpen(!searchDrawerOpen)}
                aria-label="Toggle search bar"
                aria-expanded={searchDrawerOpen}
                className={`pust-search-btn w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl cursor-pointer ${
                  searchDrawerOpen ? "is-active" : ""
                }`}
                title={searchDrawerOpen ? "Close search (Esc)" : "Search directory, jobs, events... (Press /)"}
              >
                {searchDrawerOpen ? (
                  <span className="text-sm font-bold leading-none">✕</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    />
                  </svg>
                )}
              </button>

              {/* Notifications Bell */}
              <div className="relative" ref={notifMenuRef}>
                <button
                  type="button"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  aria-label="Notifications"
                  aria-expanded={notifDropdownOpen}
                  className={`pust-notif-btn relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center cursor-pointer ${
                    notifDropdownOpen ? "is-active" : ""
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7A1737] text-white rounded-full text-[9.5px] flex items-center justify-center font-black ring-2 ring-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-80 bg-[#FDFBF7] border-2 border-[#D4C39B] shadow-2xl z-50 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-[#17263C]">
                    <div className="px-4 py-3 bg-[#F5EDD6] border-b border-[#D4C39B] flex justify-between items-center">
                      <span className="font-extrabold text-sm text-[#17263C]">Notifications</span>
                      <span className="text-[10px] font-extrabold bg-[#B5893C] text-white px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-[#EBDDB7]">
                      {ba.map((item) => (
                        <div
                          key={item.id}
                          className={`px-4 py-3 hover:bg-[#F5EDD6]/60 flex gap-3 transition-colors ${
                            item.read ? "bg-[#FDFBF7]" : "bg-[#F7EED6]/50"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-white border border-[#C7A76C] flex items-center justify-center flex-shrink-0 text-xs overflow-hidden text-[#B5893C]">
                            {item.avatar ? (
                              <img src={item.avatar} className="w-full h-full object-cover" alt="" />
                            ) : (
                              "🔔"
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-[#17263C] font-bold leading-snug">{item.msg}</p>
                            <p className="text-[10px] text-[#75551E] font-bold mt-1">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-[#D4C39B] bg-[#F5EDD6]">
                      <Link
                        to="/dashboard/notifications"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-xs font-extrabold text-[#B5893C] hover:underline transition-colors flex items-center justify-between"
                      >
                        <span>View all notifications</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* AUTH BUTTONS OR AUTHENTICATED USER MENU */}
              {currentUser ? (
                /* Authenticated User Menu */
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="pust-user-btn flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full cursor-pointer"
                    aria-label="User profile menu"
                    aria-expanded={userDropdownOpen}
                  >
                    <img
                      src={
                        currentUser.avatar ||
                        createInitialsAvatar(currentUser.name, currentUser.role)
                      }
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#B5893C]"
                    />
                    <div className="text-left hidden sm:block max-w-[120px]">
                      <p className="text-xs font-extrabold text-[#17263C] truncate leading-tight">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-[#75551E] font-bold truncate leading-tight uppercase">
                        {currentUser.role || "MEMBER"}
                      </p>
                    </div>
                    <svg
                      className={`w-3.5 h-3.5 text-[#B5893C] hidden sm:inline transition-transform duration-200 ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu Panel */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-60 bg-[#FDFBF7] rounded-2xl shadow-2xl border-2 border-[#D4C39B] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-[#EBDDB7] bg-[#F5EDD6]">
                        <p className="text-xs font-extrabold text-[#17263C] truncate">{currentUser.name}</p>
                        <p className="text-[10.5px] text-[#75551E] font-bold truncate">{currentUser.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#17263C] hover:bg-[#B5893C] hover:text-white transition-colors"
                        >
                          <span>📊</span>
                          <span>Member Dashboard</span>
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#17263C] hover:bg-[#B5893C] hover:text-white transition-colors"
                        >
                          <span>👤</span>
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#17263C] hover:bg-[#B5893C] hover:text-white transition-colors"
                        >
                          <span>⚙️</span>
                          <span>Account Settings</span>
                        </Link>
                      </div>
                      <div className="border-t border-[#EBDDB7] pt-1">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          <span>🚪</span>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest Auth Buttons: Login and Join Network with Hover Color Changes */
                <div className="flex items-center gap-2 sm:gap-2.5">
                  {/* Login Button */}
                  <Link
                    to="/login"
                    className="pust-login-btn inline-flex items-center justify-center text-[13.5px] sm:text-[14px] px-3.5 sm:px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Login
                  </Link>

                  {/* Join Network Button */}
                  <Link
                    to="/register"
                    className="pust-join-btn inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] px-3.5 sm:px-5 py-2 rounded-xl cursor-pointer group"
                  >
                    <span>Join Network</span>
                    <span className="font-extrabold transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              )}

              {/* MOBILE HAMBURGER BUTTON */}
              <button
                type="button"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                className="pust-hamburger-btn lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-xl cursor-pointer ml-0.5"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span
                  className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0 scale-0" : ""
                  }`}
                />
                <span
                  className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* RESPONSIVE SEARCH BAR DRAWER (Light Golden Background) */}
        {searchDrawerOpen && (
          <div className="border-t-2 border-[#D4C39B] bg-[#FAF5E8]/98 backdrop-blur-xl shadow-xl px-4 py-3.5 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
              <div className="flex-1">
                <SearchBar
                  variant="light"
                  fullWidth
                  autoFocus={true}
                  placeholder="Search alumni by name, department, batch, company, or skills..."
                  onNavigate={() => setSearchDrawerOpen(false)}
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchDrawerOpen(false)}
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-white hover:bg-[#B5893C] text-[#17263C] hover:text-white border-2 border-[#C7A76C] transition-all duration-200 font-extrabold text-sm shadow-xs active:scale-95 cursor-pointer"
                title="Close search"
                aria-label="Close search"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. MOBILE HAMBURGER MENU DRAWER (Light Golden Backdrop & Drawer with Hover Color Changes) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" id="mobile-navigation">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#17263C]/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Offcanvas Golden Drawer */}
          <div
            ref={mobileDrawerRef}
            className="pust-gold-drawer fixed inset-y-0 right-0 w-full max-w-sm shadow-2xl z-50 flex flex-col justify-between animate-in slide-in-from-right duration-300"
          >
            {/* Drawer Header */}
            <div>
              <div className="p-4 border-b-2 border-[#D4C39B] flex items-center justify-between bg-[#F5EDD6]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl p-1 bg-white border-2 border-[#C7A76C] shadow-xs flex items-center justify-center">
                    <img src={wa} alt="PUST Emblem" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="font-extrabold text-[#17263C] text-sm">PUST Alumni Network</p>
                    <p className="text-[10.5px] text-[#75551E] font-bold">Pabna University of Science & Tech</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#17263C] hover:text-white hover:bg-[#B5893C] transition-colors"
                  aria-label="Close navigation menu"
                >
                  <span className="text-base font-extrabold leading-none">✕</span>
                </button>
              </div>

              {/* Drawer Search Bar */}
              <div className="p-3 border-b border-[#EBDDB7] bg-[#FAF5E8]">
                <SearchBar
                  variant="light"
                  fullWidth
                  placeholder="Quick search alumni, jobs..."
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </div>

              {/* Drawer Primary Navigation Links in Bold Times New Roman */}
              <div className="p-3 space-y-1 max-h-[calc(100vh-290px)] overflow-y-auto">
                <p className="px-3 py-1.5 text-[11px] font-extrabold text-[#75551E] uppercase tracking-wider">
                  Main Navigation
                </p>
                {primaryNavLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all text-sm ${
                      item.isActive
                        ? "bg-[#17263C] text-[#F8E7B9] border-2 border-[#B5893C] shadow-sm"
                        : "text-[#17263C] hover:bg-[#B5893C] hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {item.isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#E8CB80] animate-pulse" />
                      )}
                      <span>{item.label}</span>
                    </span>
                    <span className="text-xs text-[#8C6524]">→</span>
                  </Link>
                ))}

                {/* More Services Section */}
                <div className="pt-2 mt-2 border-t border-[#EBDDB7]">
                  <p className="px-3 py-1 text-[11px] font-extrabold text-[#75551E] uppercase tracking-wider">
                    More Services
                  </p>
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    {exploreLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs font-bold transition-colors ${
                          link.isActive
                            ? "bg-[#17263C] text-[#F8E7B9] border border-[#B5893C]"
                            : "text-[#17263C] hover:bg-[#B5893C] hover:text-white"
                        }`}
                      >
                        <span className="text-base">{link.icon}</span>
                        <span className="truncate">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions: Login / Join Network or Profile */}
            <div className="p-4 border-t-2 border-[#D4C39B] bg-[#F5EDD6]">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-white rounded-xl border-2 border-[#C7A76C]">
                    <img
                      src={
                        currentUser.avatar ||
                        createInitialsAvatar(currentUser.name, currentUser.role)
                      }
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[#B5893C]"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-extrabold text-[#17263C] truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-[#75551E] font-bold truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center font-bold text-[#17263C] py-2 rounded-xl bg-white border border-[#C7A76C] hover:bg-[#17263C] hover:text-[#F8E7B9] transition-all text-xs shadow-xs"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex-1 text-center font-bold text-rose-700 py-2 rounded-xl bg-rose-50 border border-rose-300 hover:bg-rose-600 hover:text-white transition-all text-xs cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="pust-login-btn flex-1 text-center py-2.5 rounded-xl text-xs"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="pust-join-btn flex-1 text-center py-2.5 rounded-xl text-xs"
                  >
                    Join Network →
                  </Link>
                </div>
              )}

              {/* Campus Contact Line */}
              <div className="mt-3 text-center text-[11px] text-[#75551E] font-bold">
                PUST Alumni Network &bull; alumni@pust.ac.bd
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
