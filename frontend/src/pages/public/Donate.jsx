import React, { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";
import {
  Ia,
  La,
  Ra,
  za,
  Ba,
  Va,
  Ha,
  Ua,
  Wa,
  Ga,
  Ka,
  qa,
  Ja,
  Ya,
  Xa,
  Za,
  Qa,
} from "../../data/mockData";

var Wo = [
    {
      icon: `🎓`,
      img: Ha,
      from: `#1B4F8A`,
      to: `#0D3666`,
      title: `Merit Scholarship Fund`,
      desc: `Fund full scholarships for brilliant students who lack financial means.`,
      raised: 42e5,
      goal: 8e6,
      donors: 1420,
    },
    {
      icon: `🔬`,
      img: za,
      from: `#7C3AED`,
      to: `#5B21B6`,
      title: `Research Excellence Grant`,
      desc: `Support faculty and student research across all PUST departments.`,
      raised: 28e5,
      goal: 6e6,
      donors: 890,
    },
    {
      icon: `🏗️`,
      img: qa,
      from: `#059669`,
      to: `#047857`,
      title: `Campus Infrastructure`,
      desc: `Upgrade labs, classrooms, and hostels to world-class standards.`,
      raised: 61e5,
      goal: 15e6,
      donors: 620,
    },
    {
      icon: `🌍`,
      img: Za,
      from: `#0891B2`,
      to: `#0E7490`,
      title: `Global Mobility Program`,
      desc: `Fund student exchange programs and international conference attendance.`,
      raised: 12e5,
      goal: 3e6,
      donors: 540,
    },
    {
      icon: `🚨`,
      img: Ua,
      from: `#D97706`,
      to: `#B45309`,
      title: `Student Emergency Fund`,
      desc: `Immediate financial assistance for students facing unexpected crises.`,
      raised: 8e5,
      goal: 2e6,
      donors: 340,
    },
  ],
  Go = [`৳ 500`, `৳ 1,000`, `৳ 5,000`, `৳ 10,000`, `৳ 25,000`, `Custom`],
  Ko = [
    {
      v: `৳ 4.2Cr`,
      l: `Total Raised`,
    },
    {
      v: `180`,
      l: `Scholarships Awarded`,
    },
    {
      v: `3,810`,
      l: `Total Donors`,
    },
    {
      v: `94%`,
      l: `Goes to Programs`,
    },
  ],
  qo = [
    {
      img: Ha,
      title: `Student Scholarships`,
      desc: `180+ students received full-ride scholarships funded entirely by PUST alumni.`,
    },
    {
      img: Xa,
      title: `Recognition Programs`,
      desc: `Annual awards celebrating academic, research, and community excellence at the PUST Auditorium.`,
    },
    {
      img: Wa,
      title: `Campus Beautification`,
      desc: `Lakeside walkways, green spaces, and landscapes that make PUST a place worth loving.`,
    },
    {
      img: qa,
      title: `Academic Infrastructure`,
      desc: `Building modern classrooms, labs, and facilities for the next generation of PUST scholars.`,
    },
  ];
export default function Donate() {
  usePageMeta(
    "Give Back · Support PUST",
    "Support scholarships, research grants, and campus infrastructure by donating to the PUST Alumni Fund."
  );
  let [e, t] = useState(0),
    [n, r] = useState(`৳ 1,000`),
    [i, a] = useState(``),
    [o, s] = useState(``),
    [c, l] = useState(``),
    [u, d] = useState(false),
    [submitting, setSubmitting] = useState(false),
    [formError, setFormError] = useState(""),
    f = Wo[e];

  // Background Video State (User's YouTube Video: sTROHxDgvMw)
  const [isMuted, setIsMuted] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const toggleMute = () => {
    const iframe = document.getElementById("youtube-donate-bg-iframe");
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (iframe && iframe.contentWindow) {
      const command = nextMuted ? "mute" : "unMute";
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*"
      );
      if (!nextMuted) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "setVolume", args: [100] }),
          "*"
        );
      }
    }
    const localVideo = document.getElementById("fallback-donate-video");
    if (localVideo) {
      localVideo.muted = nextMuted;
    }
  };

  const handleFullscreenCinema = () => {
    const iframe = document.getElementById("youtube-donate-bg-iframe");
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen().catch(() => setIsTheaterMode(true));
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else {
        setIsTheaterMode(true);
      }
    } else {
      setIsTheaterMode(true);
    }
  };

  // Handle ESC key to exit full-screen theater mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isTheaterMode) {
        setIsTheaterMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTheaterMode]);
  Math.round((f.raised / f.goal) * 100);
  let p = n === `Custom` ? `৳ ${i || `—`}` : n;
  return u ? (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#F4F5F7] text-[#17263C]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white border border-[#E2E8F0] shadow-lg">
        <div className="relative overflow-hidden h-28 bg-[#17263C]">
          <img
            src={f.img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(23,38,60,0.4) 0%, #17263C 100%)`,
            }}
          />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-white text-[#7A1737] shadow-sm">
              ✓
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#7A1737] mb-1">
            PUST Alumni Fund
          </p>
          <h2 className="font-serif font-bold text-2xl text-[#17263C] mb-2">
            Thank You for Giving Back!
          </h2>
          <p className="text-sm mb-5 text-[#475569] leading-relaxed">
            Your generous gift of{" "}
            <span className="font-bold text-[#17263C]">{p}</span> to the{" "}
            <span className="font-bold text-[#17263C]">{f.title}</span> has been successfully recorded.
          </p>
          <div className="p-4 mb-6 text-xs rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] font-medium">
            An official university donation receipt has been dispatched to your email address.
          </div>
          <button
            onClick={() => d(false)}
            className="w-full py-3 text-sm font-semibold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all shadow-xs cursor-pointer"
          >
            Make Another Contribution
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C]">
      {/* =========================================================================
          1. STABLE FULL-PAGE CAMPUS REAL VIEW VIDEO HERO (YouTube: sTROHxDgvMw)
         ========================================================================= */}
      <section
        id="campus-real-view"
        data-no-reveal="true"
        aria-label="PUST Campus Tour & Giving Video"
        className="relative w-full overflow-hidden bg-black flex flex-col justify-between select-none"
        style={{
          height: "calc(100vh - 116px)",
          minHeight: "520px",
          maxHeight: "860px",
        }}
      >
        {/* Ambient Auto-Player (Pure Edge-to-Edge Auto Loop, No YouTube UI) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
          {/* High-Performance Fallback Local Video for Instant Render */}
          <video
            id="fallback-donate-video"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster="/assets/1778991184DSC05122-DR5DHwQE.jpeg"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-full h-full object-cover"
            style={{ filter: "brightness(0.92) contrast(1.05)" }}
          >
            <source src="/assets/videos/pust_tour_youtube.mp4" type="video/mp4" />
          </video>

          {/* User's YouTube Video Embed (sTROHxDgvMw) */}
          <iframe
            id="youtube-donate-bg-iframe"
            src="https://www.youtube.com/embed/sTROHxDgvMw?autoplay=1&mute=1&controls=0&loop=1&playlist=sTROHxDgvMw&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1"
            title="PUST Campus Tour GST 2026 | Pabna University of Science and Technology"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-none select-none z-10"
            style={{
              width: "max(100%, 177.78vh)",
              height: "max(100%, 56.25vw)",
              minWidth: "100%",
              minHeight: "100%",
              border: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Minimal Floating Top Controls (Clean English, No Obstructive Overlays) */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 w-full flex items-center justify-end pointer-events-auto">
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute sound" : "Mute sound"}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-black/70 hover:bg-black/90 border border-white/25 backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              title={isMuted ? "Unmute sound" : "Mute sound"}
            >
              <span>{isMuted ? "🔇 Unmute" : "🔊 Mute"}</span>
            </button>
            <button
              type="button"
              onClick={handleFullscreenCinema}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#7A1737]/90 hover:bg-[#7A1737] border border-[#C7A76C]/40 backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              title="Fullscreen Cinema View"
            >
              <span>⛶ Cinema View</span>
            </button>
          </div>
        </div>

        {/* Unobstructed Center View so Visitors Get the Authentic Offline Campus View */}
        <div className="flex-1 pointer-events-none" />

        {/* Floating Bottom Button to Smoothly Scroll to Giving Board */}
        <div className="relative z-20 pb-5 sm:pb-7 text-center pointer-events-none flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("giveback-board");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/80 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-[#C7A76C]/40 backdrop-blur-md shadow-xl transition-colors cursor-pointer active:scale-95 ring-1 ring-white/10"
          >
            <span className="text-[#DFCA9E]">🎓</span>
            <span>Explore Giving Programs & Causes</span>
            <span className="text-sm text-[#DFCA9E]">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. INSTITUTIONAL METRICS RIBBON
         ========================================================================= */}
      <div id="giveback-board" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {Ko.map((item, idx) => (
              <div key={idx} className="pt-2 sm:pt-0 sm:px-4 text-center">
                <p className="font-display font-bold text-2xl sm:text-3xl text-[#DFCA9E] leading-none">
                  {item.v}
                </p>
                <p className="text-[11px] sm:text-xs mt-2 uppercase tracking-wider text-slate-300 font-semibold">
                  {item.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. INSTITUTIONAL GIVE BACK HEADER
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] shadow-2xs py-8 sm:py-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] mb-2 text-[#7A1737]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> · Institutional Giving
          </p>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#17263C] mb-3 tracking-tight">
            Give Back to PUST
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto text-[#64748B] leading-relaxed mb-6">
            Your generous gift — however large or modest — creates undergraduate scholarships,
            funds innovative faculty research, and elevates campus infrastructure.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("donation-funds");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Contribute to a Fund →
            </button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <div className="py-14 bg-white border-b border-[#E2E8F0] reveal-section">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10 reveal-up">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-1.5 text-[#7A1737] font-semibold">
              Measurable Impact
            </p>
            <h2
              className="font-serif font-bold text-[#17263C]"
              style={{
                fontSize: `clamp(1.6rem, 3.5vw, 2.4rem)`,
              }}
            >
              How Your Contribution Empowers PUST
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {qo.map((item, idx) => (
              <div
                key={idx}
                className={`group overflow-hidden rounded-xl border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-sm transition-all bg-[#F8FAFC] ${
                  idx % 2 === 0 ? "reveal-left" : "reveal-right"
                } delay-${(idx + 1) * 100}`}
              >
                <div className="relative overflow-hidden h-32 bg-[#17263C]">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, rgba(23,38,60,0.3) 0%, #17263C 100%)`,
                    }}
                  />
                  <div className="relative z-10 flex items-end h-full p-4">
                    <p className="font-bold text-white text-sm leading-snug">
                      {item.title}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-white border-t border-[#E2E8F0]">
                  <p className="text-xs leading-relaxed text-[#475569]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cause Selection & Donation Form */}
      <div id="donation-funds" className="max-w-5xl mx-auto px-6 py-14 flex flex-col lg:flex-row gap-8 items-start scroll-mt-20">
        {/* Cause List */}
        <div className="flex-1 min-w-0 reveal-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A1737] mb-1.5 font-semibold">
            Institutional Funds
          </p>
          <h2
            className="font-serif font-bold text-[#17263C] mb-6"
            style={{
              fontSize: `clamp(1.4rem, 3vw, 2rem)`,
            }}
          >
            Select a Giving Initiative
          </h2>
          <div className="space-y-4">
            {Wo.map((cause, idx) => {
              let isSelected = e === idx,
                pct = Math.round((cause.raised / cause.goal) * 100);
              return (
                <button
                  key={idx}
                  onClick={() => t(idx)}
                  className={`w-full text-left overflow-hidden group transition-all rounded-xl cursor-pointer ${
                    isSelected
                      ? `bg-white border-2 border-[#7A1737] shadow-sm`
                      : `bg-white border border-[#E2E8F0] hover:border-[#CBD5E1]`
                  }`}
                >
                  <div className="relative overflow-hidden h-16 bg-[#17263C]">
                    <img
                      src={cause.img}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-600 opacity-40"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, rgba(23,38,60,0.4) 0%, #17263C 100%)`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center px-5 gap-3">
                      <span className="text-2xl drop-shadow-sm">{cause.icon}</span>
                      <p className="text-white font-bold text-sm sm:text-base">{cause.title}</p>
                      {isSelected && (
                        <span className="ml-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-[#7A1737] text-white">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs leading-relaxed mb-3.5 text-[#475569]">
                      {cause.desc}
                    </p>
                    <div className="flex justify-between text-xs mb-1.5 text-[#64748B] font-medium">
                      <span>৳ {(cause.raised / 1e5).toFixed(1)}L raised</span>
                      <span>{cause.donors} donors · {pct}% funded</span>
                    </div>
                    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
                      <div
                        style={{
                          width: `${pct}%`,
                        }}
                        className="h-full bg-[#7A1737] transition-all duration-700"
                      />
                    </div>
                    <p className="text-[11px] mt-1.5 text-[#64748B]">
                      Goal: ৳ {(cause.goal / 1e5).toFixed(0)}L
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Donation Sidebar */}
        <div className="lg:w-[380px] flex-shrink-0 sticky top-[86px] reveal-right">
          <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
            <div className="relative overflow-hidden h-24 bg-[#17263C]">
              <img
                src={f.img}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, rgba(23,38,60,0.4) 0%, #17263C 100%)`,
                }}
              />
              <div className="relative z-10 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5 text-[#C7A76C]">
                  Designated Cause
                </p>
                <p className="font-serif font-bold text-white text-base leading-snug truncate">
                  {f.title}
                </p>
              </div>
            </div>

            <div className="p-6">
              <p
                id="amount-label"
                className="text-[11px] font-bold uppercase tracking-wider mb-2.5 text-[#475569]"
              >
                Select Giving Tier
              </p>
              <div
                role="radiogroup"
                aria-labelledby="amount-label"
                className="grid grid-cols-3 gap-2 mb-4"
              >
                {Go.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    role="radio"
                    aria-checked={n === amt}
                    onClick={() => {
                      r(amt);
                      setFormError("");
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      n === amt
                        ? "bg-[#7A1737] text-white shadow-xs"
                        : "bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:text-[#17263C] hover:border-[#CBD5E1]"
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>

              {n === `Custom` && (
                <div className="mb-4">
                  <label htmlFor="custom-amount" className="sr-only">
                    Custom Donation Amount in Taka
                  </label>
                  <div className="flex overflow-hidden rounded-lg border border-[#E2E8F0]">
                    <span className="flex items-center px-3.5 text-sm font-bold flex-shrink-0 bg-[#F1F5F9] text-[#17263C] border-r border-[#E2E8F0]">
                      ৳
                    </span>
                    <input
                      id="custom-amount"
                      type="number"
                      min="10"
                      className="flex-1 px-3.5 py-2.5 text-sm outline-none bg-white text-[#17263C] placeholder-[#94A3B8]"
                      placeholder="Enter amount (e.g. 5000)"
                      value={i}
                      onChange={(ev) => {
                        a(ev.target.value);
                        setFormError("");
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3.5 mb-5">
                <div>
                  <label
                    htmlFor="donor-name"
                    className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-[#475569]"
                  >
                    Donor Name *
                  </label>
                  <input
                    id="donor-name"
                    type="text"
                    placeholder="Your full name"
                    value={o}
                    onChange={(ev) => {
                      s(ev.target.value);
                      setFormError("");
                    }}
                    className="w-full px-3.5 py-2 text-sm outline-none rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#7A1737] transition-all"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="donor-email"
                    className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-[#475569]"
                  >
                    Receipt Email *
                  </label>
                  <input
                    id="donor-email"
                    type="email"
                    placeholder="your@email.com"
                    value={c}
                    onChange={(ev) => {
                      l(ev.target.value);
                      setFormError("");
                    }}
                    className="w-full px-3.5 py-2 text-sm outline-none rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#7A1737] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-4 mb-5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-xs font-bold text-[#17263C] mb-1.5">
                  Available Transfer Channels
                </p>
                <div className="space-y-1 text-xs text-[#475569]">
                  <p>
                    📱 <span className="font-semibold text-[#17263C]">bKash / Nagad:</span> 01700-000000 (Merchant)
                  </p>
                  <p>
                    🏦 <span className="font-semibold text-[#17263C]">Institutional Account:</span> Dutch-Bangla Bank (PUST Alumni Fund)
                  </p>
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="p-3 mb-3 text-xs bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] rounded-lg"
                >
                  {formError}
                </div>
              )}

              <button
                type="button"
                disabled={submitting}
                onClick={async () => {
                  const numericAmt =
                    n === `Custom`
                      ? Number(i) || 0
                      : Number(String(p).replace(/[^0-9]/g, "")) || 1000;
                  if (!o.trim()) {
                    setFormError("Please enter your name.");
                    return;
                  }
                  if (!c.trim() || !c.includes("@")) {
                    setFormError("Please enter a valid email address.");
                    return;
                  }
                  if (numericAmt < 10) {
                    setFormError("Donation amount must be at least ৳ 10.");
                    return;
                  }
                  setSubmitting(true);
                  try {
                    await api.submitDonation({
                      campaign: f.title,
                      amount: numericAmt,
                      donorName: o.trim(),
                      donorEmail: c.trim(),
                    });
                    d(true);
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className={`w-full py-3 text-sm font-semibold text-white bg-[#7A1737] hover:bg-[#62122B] rounded-lg transition-all shadow-xs cursor-pointer mb-2.5 active:scale-95 ${
                  submitting ? "opacity-75 cursor-wait" : ""
                }`}
              >
                {submitting
                  ? "Transmitting Gift…"
                  : `Confirm Donation — ${p} →`}
              </button>
              <p className="text-center text-[11px] text-[#94A3B8]">
                🔒 100% Tax Exempt · Certified University Alumni Trust
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional CTA Section */}
      <div
        className="relative overflow-hidden border-t border-[#0F1A2A]"
        style={{
          background: `#17263C`,
          minHeight: 220,
        }}
      >
        <img
          src={Qa}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top opacity-15"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(23,38,60,0.85) 0%, rgba(23,38,60,0.98) 100%)`,
          }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 sm:px-16 py-12 max-w-5xl mx-auto">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-2 text-[#C7A76C]">
              Every Taka Counts
            </p>
            <h2 className="font-serif font-bold text-white text-2xl sm:text-3xl mb-2">
              Be Part of PUST's Future
            </h2>
            <p className="text-sm max-w-md text-[#CBD5E1] leading-relaxed">
              Join 3,810+ alumni donors who believe in the transformative power of
              Pabna University of Science & Technology.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3.5 flex-shrink-0">
            <button
              onClick={() =>
                window.scrollTo({
                  top: 500,
                  behavior: `smooth`,
                })
              }
              className="text-sm font-semibold text-white px-7 py-3 text-center rounded-lg bg-[#7A1737] hover:bg-[#62122B] transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Donate Now →
            </button>
            <a
              href="/about"
              className="text-sm font-medium text-white px-7 py-3 text-center rounded-lg border border-white/25 hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN THEATER MODE OVERLAY */}
      {isTheaterMode && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col p-2 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsTheaterMode(false)}
        >
          <div className="flex items-center justify-between pb-3 sm:pb-4 text-white max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  PUST Campus Tour & Geography · Pabna University of Science and Technology
                </h3>
                <p className="text-xs text-slate-400">
                  Real Campus Experience · Press ESC to exit
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsTheaterMode(false)}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              ✕ Exit Fullscreen
            </button>
          </div>
          <div
            className="flex-1 w-full max-w-7xl mx-auto rounded-2xl overflow-hidden bg-black shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src="https://www.youtube.com/embed/sTROHxDgvMw?autoplay=1&mute=0&controls=1&rel=0"
              title="PUST Campus Tour GST 2026"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
