import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { pa, ma, ha, Sa, _a, va, ya, ga } from "../data/mockData";
import { useBackendSync } from "../services/api";

export default function SearchBar({
  variant = "dark", // "dark" (for public header), "light" (for dashboard/admin), "mobile"
  fullWidth = false,
  placeholder = "Search alumni, jobs, events, depts...",
  onNavigate,
  className = "",
  autoFocus = false,
}) {
  useBackendSync();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Auto focus input if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      setIsOpen(true);
    }
  }, [autoFocus]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K or "/" to focus
  useEffect(() => {
    function handleKeyDown(event) {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInputActive =
        activeTag === "input" ||
        activeTag === "textarea" ||
        document.activeElement?.isContentEditable;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (event.key === "/" && !isInputActive) {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute search results across all data sets
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        people: [],
        jobs: [],
        events: [],
        departments: [],
        stories: [],
        total: 0,
      };
    }

    // 1. People (Alumni, Students, Faculty, Employers)
    const allPeople = [...pa, ...ma, ...ha, ...Sa];
    const people = allPeople
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const headline = (p.headline || "").toLowerCase();
        const dept = (p.dept || "").toLowerCase();
        const company = (p.company || "").toLowerCase();
        const location = (p.location || "").toLowerCase();
        const skills = (p.skills || []).map((s) => s.toLowerCase());
        const role = (p.role || "").toLowerCase();
        const batch = (p.batch || "").toString();

        return (
          name.includes(q) ||
          headline.includes(q) ||
          dept.includes(q) ||
          company.includes(q) ||
          location.includes(q) ||
          role.includes(q) ||
          batch.includes(q) ||
          skills.some((s) => s.includes(q))
        );
      })
      .slice(0, 4);

    // 2. Jobs
    const jobs = (va || [])
      .filter((j) => {
        const title = (j.title || "").toLowerCase();
        const comp = (j.company || "").toLowerCase();
        const loc = (j.location || "").toLowerCase();
        const type = (j.type || "").toLowerCase();
        const dept = (j.dept || "").toLowerCase();
        const skills = (j.skills || []).map((s) => s.toLowerCase());

        return (
          title.includes(q) ||
          comp.includes(q) ||
          loc.includes(q) ||
          type.includes(q) ||
          dept.includes(q) ||
          skills.some((s) => s.includes(q))
        );
      })
      .slice(0, 3);

    // 3. Events
    const events = (_a || [])
      .filter((ev) => {
        const title = (ev.title || "").toLowerCase();
        const loc = (ev.location || "").toLowerCase();
        const type = (ev.type || "").toLowerCase();
        const desc = (ev.desc || "").toLowerCase();
        const date = (ev.date || "").toLowerCase();

        return (
          title.includes(q) ||
          loc.includes(q) ||
          type.includes(q) ||
          desc.includes(q) ||
          date.includes(q)
        );
      })
      .slice(0, 3);

    // 4. Departments
    const departments = (ga || [])
      .filter((d) => {
        const name = (d.name || "").toLowerCase();
        const code = (d.code || "").toLowerCase();
        const faculty = (d.faculty || "").toLowerCase();
        const hod = (d.hod || "").toLowerCase();

        return (
          name.includes(q) ||
          code.includes(q) ||
          faculty.includes(q) ||
          hod.includes(q)
        );
      })
      .slice(0, 2);

    // 5. Stories
    const stories = (ya || [])
      .filter((st) => {
        const title = (st.title || "").toLowerCase();
        const excerpt = (st.excerpt || "").toLowerCase();
        const author = ((st.author && st.author.name) || "").toLowerCase();

        return (
          title.includes(q) || excerpt.includes(q) || author.includes(q)
        );
      })
      .slice(0, 2);

    const total =
      people.length +
      jobs.length +
      events.length +
      departments.length +
      stories.length;

    return { people, jobs, events, departments, stories, total };
  }, [query]);

  // Flattened list for keyboard arrow navigation
  const flatItems = useMemo(() => {
    const items = [];
    results.people.forEach((item) =>
      items.push({
        type: "person",
        id: item.id,
        to: `/alumni/${item.id}`,
        label: item.name,
      })
    );
    results.jobs.forEach((item) =>
      items.push({
        type: "job",
        id: item.id,
        to: `/jobs?search=${encodeURIComponent(item.title)}`,
        label: item.title,
      })
    );
    results.events.forEach((item) =>
      items.push({
        type: "event",
        id: item.id,
        to: `/events?search=${encodeURIComponent(item.title)}`,
        label: item.title,
      })
    );
    results.departments.forEach((item) =>
      items.push({
        type: "department",
        id: item.code,
        to: `/alumni?dept=${encodeURIComponent(item.code)}`,
        label: item.name,
      })
    );
    results.stories.forEach((item) =>
      items.push({
        type: "story",
        id: item.id,
        to: `/stories`,
        label: item.title,
      })
    );
    return items;
  }, [results]);

  const handleSelect = (to, searchVal) => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(-1);
    if (onNavigate) onNavigate();
    navigate(to);

    let resolvedQuery = searchVal;
    if (resolvedQuery === undefined && to && to.includes("?")) {
      try {
        const queryParams = new URLSearchParams(to.split("?")[1]);
        resolvedQuery =
          queryParams.get("search") ||
          queryParams.get("q") ||
          queryParams.get("dept");
      } catch (err) {}
    }

    setTimeout(() => {
      if (resolvedQuery !== undefined && resolvedQuery !== null) {
        window.dispatchEvent(
          new CustomEvent("pust-search-query", { detail: resolvedQuery })
        );
      }
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (flatItems.length > 0) {
        setActiveIndex((prev) => (prev + 1) % flatItems.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (flatItems.length > 0) {
        setActiveIndex((prev) =>
          prev <= 0 ? flatItems.length - 1 : prev - 1
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < flatItems.length) {
        handleSelect(flatItems[activeIndex].to);
      } else if (query.trim()) {
        handleSelect(
          `/alumni?search=${encodeURIComponent(query.trim())}`,
          query.trim()
        );
      }
    }
  };

  const clearQuery = (e) => {
    e.stopPropagation();
    setQuery("");
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  // Trending / quick tags
  const trendingTags = [
    { label: "Computer Science", query: "Computer Science" },
    { label: "Brain Station 23", query: "Brain Station 23" },
    { label: "Dhaka", query: "Dhaka" },
    { label: "Alumni Reunion", query: "Reunion" },
    { label: "Software Engineer", query: "Software" },
    { label: "Mentors", query: "mentor" },
  ];

  // Quick direct links
  const quickLinks = [
    { label: "Alumni Directory", to: "/alumni", icon: "🎓", desc: "22,400+ members" },
    { label: "Job Board", to: "/jobs", icon: "💼", desc: "Top career openings" },
    { label: "Upcoming Events", to: "/events", icon: "📅", desc: "Reunions & Webinars" },
    { label: "Mentorship", to: "/mentorship", icon: "🎯", desc: "Connect with mentors" },
  ];

  const isDark = variant === "dark";

  const jobsBaseIndex = results.people.length;
  const eventsBaseIndex = jobsBaseIndex + results.jobs.length;
  const deptsBaseIndex = eventsBaseIndex + results.events.length;
  const storiesBaseIndex = deptsBaseIndex + results.departments.length;

  const executeSearch = (customQuery) => {
    const q = (customQuery !== undefined ? customQuery : query).trim();
    if (!q) {
      setIsOpen(true);
      inputRef.current?.focus();
      return;
    }
    handleSelect(`/alumni?search=${encodeURIComponent(q)}`, q);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${
        fullWidth ? "w-full" : "w-auto"
      } ${className}`}
    >
      {/* Search Bar Input Box Container */}
      {/* Search Bar Input Box Container */}
      <div
        className={`group flex items-center transition-all duration-300 rounded-xl sm:rounded-2xl border shadow-sm ${
          fullWidth
            ? "w-full"
            : "w-52 md:w-60 lg:w-56 xl:w-72 focus-within:w-80 xl:focus-within:w-96"
        } ${
          isDark
            ? "bg-white/10 border-white/20 focus-within:border-white/40 focus-within:bg-white/15"
            : "bg-white border-[#E2E8F0] focus-within:border-[#7A1737] focus-within:ring-2 focus-within:ring-[#7A1737]/10"
        }`}
        style={{
          height: 42,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Search Icon Box */}
        <span
          className={`pl-3 pr-2 flex items-center pointer-events-none transition-colors ${
            isDark
              ? "text-slate-300 group-focus-within:text-white"
              : "text-[#64748B] group-focus-within:text-[#7A1737]"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-transparent text-xs sm:text-sm font-medium outline-none pr-1 transition-colors ${
            isDark
              ? "text-white placeholder-slate-300"
              : "text-[#17263C] placeholder-[#94A3B8]"
          }`}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className={`p-1 mr-1 rounded-full text-xs transition-colors ${
              isDark
                ? "text-slate-300 hover:text-white hover:bg-white/15"
                : "text-[#64748B] hover:text-[#17263C] hover:bg-[#F4F5F7]"
            }`}
            title="Clear search"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Shortcut Badge (when query is empty) */}
        {!query && (
          <div className="hidden xl:flex items-center pr-2 pointer-events-none">
            <kbd
              className={`px-1.5 py-0.5 text-[10px] font-mono rounded-md border ${
                isDark
                  ? "text-slate-300 bg-white/10 border-white/20"
                  : "text-[#64748B] bg-[#F4F5F7] border-[#E2E8F0]"
              }`}
            >
              ⌘K
            </kbd>
          </div>
        )}

        {/* Search Submit Action Button */}
        <button
          type="button"
          onClick={() => executeSearch()}
          className="flex items-center justify-center gap-1 px-3 py-1.5 mr-1 rounded-lg text-xs font-bold bg-[#7A1737] hover:bg-[#60122B] text-white transition-all flex-shrink-0 active:scale-95 shadow-xs"
          title="Search (Enter)"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <span className="hidden sm:inline text-[11px]">Search</span>
        </button>
      </div>

      {/* Dropdown Live Results */}
      {isOpen && (
        <div
          className={`absolute mt-2.5 z-50 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${
            fullWidth
              ? "w-full left-0 right-0"
              : "w-[320px] sm:w-[440px] md:w-[500px] right-0 left-auto"
          }`}
          style={{
            maxHeight: "80vh",
            boxShadow: "0 20px 40px -15px rgba(23, 38, 60, 0.2)",
          }}
        >
          {/* Header of Dropdown */}
          <div className="px-4 py-3 bg-[#17263C] text-white flex items-center justify-between text-xs font-semibold border-b border-[#0F1A2A]">
            <span className="flex items-center gap-1.5">
              <span>🔍</span>
              <span>
                {query.trim()
                  ? `Search Results for "${query}"`
                  : "Search PUST Alumni Network"}
              </span>
            </span>
            {query.trim() && (
              <span className="text-[10px] bg-[#7A1737] text-white font-bold px-2 py-0.5 rounded-full">
                {results.total} found
              </span>
            )}
          </div>

          <div className="overflow-y-auto max-h-[60vh] divide-y divide-[#E2E8F0]">
            {/* 1. If Query is empty: Show Quick Suggestions & Quick Nav */}
            {!query.trim() && (
              <div className="p-4 space-y-4 bg-white">
                {/* Popular Keywords */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737] mb-2">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingTags.map((tag) => (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => {
                          setQuery(tag.query);
                          inputRef.current?.focus();
                        }}
                        className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#F4F5F7] text-[#475569] hover:text-[#7A1737] hover:border-[#7A1737] transition-all border border-[#E2E8F0]"
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Navigation Sections */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                    Quick Navigation
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickLinks.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleSelect(item.to)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#7A1737] hover:bg-[#F8FAFC] text-left transition-all group bg-white shadow-xs"
                      >
                        <span className="text-xl p-1.5 rounded-lg bg-[#7A1737]/10 text-[#7A1737] shadow-xs group-hover:scale-105 transition-transform">
                          {item.icon}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-[#17263C]">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-[#64748B]">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Results Section (when query is present) */}
            {query.trim() && results.total > 0 && (
              <div className="bg-white">
                {/* A. People (Alumni / Students / Faculty / Employers) */}
                {results.people.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center justify-between px-2 mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737] flex items-center gap-1.5">
                        <span>🎓</span> People & Alumni ({results.people.length})
                      </span>
                      <button
                        onClick={() =>
                          handleSelect(
                            `/alumni?search=${encodeURIComponent(query.trim())}`
                          )
                        }
                        className="text-[10px] text-[#7A1737] font-semibold hover:underline"
                      >
                        See all in Directory →
                      </button>
                    </div>
                    <div className="space-y-1">
                      {results.people.map((person, idx) => {
                        const isSelected = activeIndex === idx;
                        const roleColor =
                          person.role === "faculty"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : person.role === "student"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : person.role === "employer"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-[#7A1737]/10 text-[#7A1737] border border-[#7A1737]/20";

                        return (
                          <div
                            key={person.id}
                            onClick={() => handleSelect(`/alumni/${person.id}`)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group ${
                              isSelected
                                ? "bg-[#7A1737]/10 ring-1 ring-[#7A1737]"
                                : "hover:bg-[#F8FAFC]"
                            }`}
                          >
                            <img
                              src={person.avatar}
                              alt={person.name}
                              className="w-9 h-9 rounded-full object-cover border border-[#E2E8F0] flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-[#17263C] group-hover:text-[#7A1737] truncate">
                                  {person.name}
                                </span>
                                {person.verified && (
                                  <span
                                    className="text-[11px] text-[#7A1737] font-bold"
                                    title="Verified Alumni"
                                  >
                                    ✓
                                  </span>
                                )}
                                <span
                                  className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-xs ml-auto flex-shrink-0 ${roleColor}`}
                                >
                                  {person.role || "Alumni"}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#64748B] truncate">
                                {person.headline ||
                                  `${person.dept} ${
                                    person.batch ? `· Batch ${person.batch}` : ""
                                  }`}
                              </p>
                              {person.company && (
                                <p className="text-[10px] text-[#64748B] truncate">
                                  🏢 {person.company}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* B. Jobs */}
                {results.jobs.length > 0 && (
                  <div className="p-3 border-t border-[#E2E8F0]">
                    <div className="flex items-center justify-between px-2 mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737] flex items-center gap-1.5">
                        <span>💼</span> Jobs & Careers ({results.jobs.length})
                      </span>
                      <button
                        onClick={() =>
                          handleSelect(
                            `/jobs?search=${encodeURIComponent(query.trim())}`
                          )
                        }
                        className="text-[10px] text-[#7A1737] font-semibold hover:underline"
                      >
                        All Jobs →
                      </button>
                    </div>
                    <div className="space-y-1">
                      {results.jobs.map((job, idx) => {
                        const isSelected = activeIndex === jobsBaseIndex + idx;
                        return (
                          <div
                            key={job.id}
                            onClick={() =>
                              handleSelect(
                                `/jobs?search=${encodeURIComponent(job.title)}`
                              )
                            }
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group ${
                              isSelected
                                ? "bg-[#7A1737]/10 ring-1 ring-[#7A1737]"
                                : "hover:bg-[#F8FAFC]"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#7A1737]/10 border border-[#7A1737]/20 text-[#7A1737] flex items-center justify-center text-base flex-shrink-0">
                              {job.logo || "🏢"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-[#17263C] group-hover:text-[#7A1737] truncate">
                                  {job.title}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-xs bg-[#F4F5F7] text-[#475569] flex-shrink-0">
                                  {job.type}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#64748B] truncate">
                                {job.company} · {job.location}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* C. Events */}
                {results.events.length > 0 && (
                  <div className="p-3 border-t border-[#E2E8F0]">
                    <div className="flex items-center justify-between px-2 mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737] flex items-center gap-1.5">
                        <span>📅</span> Events ({results.events.length})
                      </span>
                      <button
                        onClick={() =>
                          handleSelect(
                            `/events?search=${encodeURIComponent(query.trim())}`
                          )
                        }
                        className="text-[10px] text-[#7A1737] font-semibold hover:underline"
                      >
                        All Events →
                      </button>
                    </div>
                    <div className="space-y-1">
                      {results.events.map((event, idx) => {
                        const isSelected = activeIndex === eventsBaseIndex + idx;
                        return (
                          <div
                            key={event.id}
                            onClick={() =>
                              handleSelect(
                                `/events?search=${encodeURIComponent(event.title)}`
                              )
                            }
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group ${
                              isSelected
                                ? "bg-[#7A1737]/10 ring-1 ring-[#7A1737]"
                                : "hover:bg-[#F8FAFC]"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#7A1737]/10 border border-[#7A1737]/20 flex items-center justify-center text-sm font-bold text-[#7A1737] flex-shrink-0">
                              📅
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-[#17263C] group-hover:text-[#7A1737] truncate">
                                  {event.title}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-xs bg-[#7A1737]/10 text-[#7A1737] flex-shrink-0">
                                  {event.type}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#64748B] truncate">
                                {event.date} · {event.location}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* D. Departments */}
                {results.departments.length > 0 && (
                  <div className="p-3 border-t border-[#E2E8F0]">
                    <div className="px-2 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7A1737] flex items-center gap-1.5">
                      <span>🏛️</span> Academic Departments ({results.departments.length})
                    </div>
                    <div className="space-y-1">
                      {results.departments.map((dept, idx) => {
                        const isSelected = activeIndex === deptsBaseIndex + idx;
                        return (
                          <div
                            key={dept.code}
                            onClick={() =>
                              handleSelect(
                                `/alumni?dept=${encodeURIComponent(dept.code)}`
                              )
                            }
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group ${
                              isSelected
                                ? "bg-[#7A1737]/10 ring-1 ring-[#7A1737]"
                                : "hover:bg-[#F8FAFC]"
                            }`}
                          >
                            <div className="w-7 h-7 rounded-md bg-[#7A1737]/10 border border-[#7A1737]/20 flex items-center justify-center text-xs font-bold text-[#7A1737] flex-shrink-0">
                              {dept.code}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-[#17263C] group-hover:text-[#7A1737] truncate block">
                                {dept.name}
                              </span>
                              <span className="text-[10px] text-[#64748B]">
                                {dept.faculty} · {dept.alumni} Alumni
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* E. Stories */}
                {results.stories.length > 0 && (
                  <div className="p-3 border-t border-[#E2E8F0]">
                    <div className="px-2 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7A1737] flex items-center gap-1.5">
                      <span>📖</span> Stories & Features ({results.stories.length})
                    </div>
                    <div className="space-y-1">
                      {results.stories.map((story, idx) => {
                        const isSelected = activeIndex === storiesBaseIndex + idx;
                        return (
                          <div
                            key={story.id}
                            onClick={() => handleSelect(`/stories`)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group ${
                              isSelected
                                ? "bg-[#7A1737]/10 ring-1 ring-[#7A1737]"
                                : "hover:bg-[#F8FAFC]"
                            }`}
                          >
                            <span className="text-base flex-shrink-0">✍️</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-[#17263C] group-hover:text-[#7A1737] truncate block">
                                {story.title}
                              </span>
                              <span className="text-[10px] text-[#64748B]">
                                {story.category} · By{" "}
                                {story.author?.name || "PUST Alumni"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Empty State (no results) */}
            {query.trim() && results.total === 0 && (
              <div className="py-8 px-6 text-center bg-white">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#7A1737]/10 border border-[#7A1737]/20 flex items-center justify-center text-xl text-[#7A1737]">
                  🔍
                </div>
                <p className="text-sm font-bold text-[#17263C]">
                  No matches found for "{query}"
                </p>
                <p className="text-xs text-[#64748B] mt-1 max-w-xs mx-auto">
                  Try searching with a department (e.g. CSE, EEE), person's name,
                  batch year, or company name.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSelect(
                        `/alumni?search=${encodeURIComponent(query.trim())}`
                      )
                    }
                    className="px-4 py-2 text-xs font-bold bg-[#7A1737] text-white rounded-lg hover:bg-[#60122B] shadow-md transition-all"
                  >
                    Search in Directory
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect("/alumni")}
                    className="px-4 py-2 text-xs font-semibold border border-[#E2E8F0] text-[#17263C] rounded-lg hover:bg-[#F4F5F7] transition-colors"
                  >
                    View All Alumni
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
            {query.trim() ? (
              <button
                type="button"
                onClick={() =>
                  handleSelect(
                    `/alumni?search=${encodeURIComponent(query.trim())}`
                  )
                }
                className="font-bold text-[#7A1737] hover:underline flex items-center gap-1"
              >
                <span>View all results in Directory</span>
                <span>→</span>
              </button>
            ) : (
              <span>Tip: Press ⌘K or / to search anytime</span>
            )}
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-[#94A3B8]">
              <span>↑↓ to navigate</span>
              <span>•</span>
              <span>↵ to open</span>
              <span>•</span>
              <span>esc to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
