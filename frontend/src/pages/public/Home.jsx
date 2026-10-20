import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CampusVideoExperience from "../../components/CampusVideoExperience";
import {
  _a,
  pa,
  wa,
  vcPortrait,
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
import usePageMeta from "../../services/usePageMeta";

// Stakeholder Portal Data
var eo = [
  {
    img: qa,
    label: `অ্যালামনাই নেটওয়ার্ক`,
    title: `Alumni Network & Community`,
    desc: `যুক্ত হোন বিশ্বজুড়ে ছড়িয়ে থাকা ২২,৪০০+ PUST গ্র্যাজুয়েটদের সাথে। ব্যাচমেটদের খুঁজুন, ক্যারিয়ার নেটওয়ার্ক গড়ুন এবং স্মৃতির ক্যাম্পাসের সাথে আজীবন যুক্ত থাকুন।`,
    link: `/alumni`,
    linkText: `ডিরেক্টরি এক্সপ্লোর করুন`,
    color: `#0284c7`,
    badge: `22,400+ Members`,
    icon: `🎓`,
  },
  {
    img: Ha,
    label: `শিক্ষার্থীদের ক্যারিয়ার`,
    title: `Students & Future Leaders`,
    desc: `বর্তমান শিক্ষার্থীদের জন্য ৩২০+ অভিজ্ঞ অ্যালামনাই মেন্টরদের ১-অন-১ ক্যারিয়ার গাইডেন্স, ইন্টার্নশিপ ও স্কিল ডেভেলপমেন্ট ওয়ার্কশপ।`,
    link: `/mentorship`,
    linkText: `মেন্টরশিপ প্রোগ্রাম দেখুন`,
    color: `#0ea5e9`,
    badge: `320+ Active Mentors`,
    icon: `🎯`,
  },
  {
    img: za,
    label: `গবেষণা ও শিক্ষকবৃন্দ`,
    title: `Faculty & Research Exchange`,
    desc: `২১টি ডিপার্টমেন্ট ও ১টি ইনস্টিটিউটের যৌথ গবেষণা, আন্তর্জাতিক পাবলিকেশন এবং ফ্যাকাল্টি কোলাবোরেশন হাব।`,
    link: `/stories`,
    linkText: `গবেষণা ও সাফল্য দেখুন`,
    color: `#7c3aed`,
    badge: `21 Departments`,
    icon: `🔬`,
  },
  {
    img: Va,
    label: `কর্পোরেট পার্টনার্স`,
    title: `Industry & Hiring Partners`,
    desc: `দেশের শীর্ষস্থানীয় টেক ও মাল্টিন্যাশনাল কোম্পানিগুলোর সাথে রিক্রুটমেন্ট পার্টনারশিপ। সরাসরি PUST গ্র্যাজুয়েটদের নিয়োগ দিন।`,
    link: `/jobs`,
    linkText: `জব সার্কুলার ও পার্টনারশিপ`,
    color: `#b45309`,
    badge: `600+ Companies`,
    icon: `💼`,
  },
];

var to = [Ka, Wa, Xa, qa, Ja, Ia, Ha, La, Va, za, Ra, Ba, Ua, Qa, Za, Ya, Ga];

export default function Home() {
  usePageMeta(
    "PUST Alumni Association · Home",
    "Welcome to the official Pabna University of Science and Technology (PUST) Campus & Alumni Network. Connect with 22,400+ graduates, explore career opportunities, and experience our vibrant campus."
  );

  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeVideo, setActiveVideo] = useState("tour"); // "tour" | "convocation"

  const videoRef = useRef(null);
  const heroRef = useRef(null);

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {});
      }
      setIsMuted(nextMuted);
    }
  };

  const switchVideo = (type) => {
    setActiveVideo(type);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleFullscreen = () => {
    if (!heroRef.current) return;
    if (!document.fullscreenElement) {
      if (heroRef.current.requestFullscreen) {
        heroRef.current.requestFullscreen();
      } else if (heroRef.current.webkitRequestFullscreen) {
        heroRef.current.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {});
    }
  }, [activeVideo, isMuted]);

  return (
    <div className="min-h-screen text-slate-800 bg-[#f8fafc] overflow-x-hidden">
      {/* =========================================================================
          1. IMMERSIVE PUST CAMPUS TOUR VIDEO HERO (100% Fullscreen, Fully Responsive)
         ========================================================================= */}
      <section
        ref={heroRef}
        data-no-reveal="true"
        aria-label="PUST Campus Virtual Experience"
        className="relative w-full overflow-hidden flex flex-col justify-between transition-all duration-500 pt-20 sm:pt-24 lg:pt-28 pb-4 sm:pb-6"
        style={{
          minHeight: "100vh",
          backgroundColor: "#020617",
          position: "relative",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Fullscreen Video Background */}
        <div
          className="hero-video-wrapper"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 0,
            backgroundColor: "#020617",
          }}
        >
          {/* Immediate Poster Layer while video buffers */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/assets/1778991184DSC05122-DR5DHwQE.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              opacity: 0.85,
            }}
          />

          <video
            ref={videoRef}
            key={activeVideo}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster="/assets/1778991184DSC05122-DR5DHwQE.jpeg"
            className="hero-video-element"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              minWidth: "100%",
              minHeight: "100%",
              width: "100%",
              height: "100%",
              transform: "translate(-50%, -50%)",
              objectFit: "cover",
              objectPosition: "center center",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <source
              src={
                activeVideo === "convocation"
                  ? "/assets/videos/pust_convocation_memories.mp4"
                  : "/assets/videos/pust_campus_tour_experience.mp4"
              }
              type="video/mp4"
            />
          </video>

          {/* Subtle Deep Navy Gradient Overlay */}
          <div
            className="hero-video-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(23, 38, 60, 0.78) 0%, rgba(23, 38, 60, 0.35) 45%, rgba(23, 38, 60, 0.90) 100%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        </div>

        {/* TOP FLOATING CONTROLS BAR (Responsive Flexbox) */}
        <div className="relative z-20 w-full px-4 sm:px-8 pt-2 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
          {/* Live Campus Badge & Video Switcher */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-white shadow-xl transition-all"
              style={{
                backgroundColor: "rgba(23, 38, 60, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-400" />
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-white">
                🔴 PUST Live Campus Experience
              </span>
            </div>

            {/* Video Selector Toggle */}
            <div
              className="hidden sm:inline-flex items-center p-0.5 rounded-full shadow-lg"
              style={{
                backgroundColor: "rgba(23, 38, 60, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              <button
                type="button"
                onClick={() => switchVideo("tour")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeVideo === "tour"
                    ? "bg-[#7A1737] text-white shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                🏛️ ক্যাম্পাস ওয়াকথ্রু
              </button>
              <button
                type="button"
                onClick={() => switchVideo("convocation")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeVideo === "convocation"
                    ? "bg-[#C7A76C] text-[#17263C] shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                🎓 সমাবর্তন স্মৃতি
              </button>
            </div>
          </div>

          {/* Controls: Audio Unmute, Fullscreen */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Audio Toggle Button with Equalizer */}
            <button
              type="button"
              onClick={toggleMute}
              className="text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full border transition-all flex items-center gap-1.5 sm:gap-2 shadow-xl active:scale-95"
              style={{
                backgroundColor: isMuted ? "rgba(23, 38, 60, 0.85)" : "#7A1737",
                color: "#FFFFFF",
                borderColor: isMuted ? "rgba(255, 255, 255, 0.2)" : "#7A1737",
                backdropFilter: "blur(12px)",
              }}
              title={isMuted ? "Click to Unmute Campus Video" : "Click to Mute Audio"}
              aria-label={isMuted ? "Unmute Campus Video" : "Mute Campus Video"}
            >
              {isMuted ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                  <span>🔊 সাউন্ড অন</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-0.5 h-3.5" aria-hidden="true">
                    <span className="w-1 bg-white rounded-full animate-[pustEq_0.6s_ease-in-out_infinite_alternate]" />
                    <span className="w-1 bg-white rounded-full animate-[pustEq_0.8s_ease-in-out_0.2s_infinite_alternate]" />
                    <span className="w-1 bg-white rounded-full animate-[pustEq_0.5s_ease-in-out_0.4s_infinite_alternate]" />
                  </span>
                  <span>সাউন্ড চালু</span>
                </>
              )}
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="text-white text-[11px] sm:text-xs font-semibold px-3 sm:px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 shadow-xl active:scale-95 hover:bg-white/10"
              style={{
                backgroundColor: "rgba(23, 38, 60, 0.85)",
                borderColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(12px)",
              }}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Virtual Campus Experience"}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="hidden sm:inline">{isFullscreen ? "Exit" : "ফুলস্ক্রিন"}</span>
            </button>
          </div>
        </div>

        {/* HERO CENTER CONTENT */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center flex flex-col items-center justify-center my-auto">
          {/* Institutional Crest Pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 shadow-xl"
            style={{
              backgroundColor: "rgba(23, 38, 60, 0.88)",
              border: "1px solid rgba(199, 167, 108, 0.45)",
              color: "#C7A76C",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="text-base">🏛️</span>
            <span className="font-bengali font-medium">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span>
            <span className="text-white/40">•</span>
            <span className="font-mono text-xs text-white">Est. 2008</span>
          </div>

          {/* Grand Headline in Bengali Hind Siliguri (700) */}
          <h1
            className="font-bengali font-bold text-white leading-tight tracking-tight drop-shadow-2xl max-w-4xl"
            style={{
              fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
              color: "#ffffff",
              textShadow: "0 4px 30px rgba(0, 0, 0, 0.95), 0 2px 10px rgba(0, 0, 0, 0.8)",
            }}
          >
            স্বপ্নের ক্যাম্পাস, স্মৃতির আঙিনা
          </h1>

          <p
            className="font-bold mt-2 sm:mt-2.5 max-w-2xl drop-shadow-md text-sm sm:text-lg lg:text-xl text-[#C7A76C]"
            style={{
              textShadow: "0 2px 14px rgba(0, 0, 0, 0.9)",
            }}
          >
            Welcome to Pabna University of Science & Technology Alumni Network
          </p>

          <p
            className="font-bengali mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-base max-w-2xl leading-relaxed hidden sm:block font-normal text-[#E2E8F0]"
            style={{
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.95)",
            }}
          >
            সবুজ শ্যামল ৩০ একরের দৃষ্টিনন্দন ক্যাম্পাস — ভার্চুয়ালি ঘুরে আসুন আপনার প্রিয় প্রাঙ্গণ এবং যুক্ত থাকুন বিশ্বব্যাপী ২২,৪০০+ অ্যালামনাইদের সাথে।
          </p>

          {/* Action CTAs (Clean, High-Contrast & Zero Cognitive Pressure) */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link
              to="/alumni"
              className="w-full sm:w-auto font-medium text-white px-8 py-3.5 text-sm rounded-full bg-[#7A1737] hover:bg-[#60122B] shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 text-center font-bengali border border-white/20"
            >
              <span>🎓</span>
              <span>অ্যালামনাই ডিরেক্টরি খুঁজুন</span>
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto font-medium text-[#17263C] px-7 py-3.5 text-sm rounded-full bg-white hover:bg-slate-100 border border-slate-200 shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 text-center font-bengali"
            >
              <span>✨ ফ্রি অ্যাকাউন্ট খুলুন</span>
              <span className="text-xs">→</span>
            </Link>
          </div>
        </div>

        {/* BOTTOM LANDMARKS TICKER */}
        <div className="relative z-10 w-full pb-3 sm:pb-5 px-3 sm:px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
            {/* Campus Landmark Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none justify-start md:justify-center">
              {[
                { icon: "🏛️", name: "স্বাধীনতা চত্বর" },
                { icon: "📚", name: "কেন্দ্রীয় লাইব্রেরি" },
                { icon: "🌊", name: "ক্যাম্পাস লেক" },
                { icon: "🔬", name: "ড. ওয়াজেদ মিয়া ভবন" },
                { icon: "🌳", name: "শহীদ মিনার চত্বর" },
                { icon: "🎓", name: "কনভোকেশন গ্রাউন্ড" },
              ].map((spot, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] sm:text-xs transition-all shadow-md font-bengali"
                  style={{
                    backgroundColor: "rgba(23, 38, 60, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span>{spot.icon}</span>
                  <span className="text-white font-medium">{spot.name}</span>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 font-bengali">
              <span className="animate-bounce text-[#C7A76C]">↓</span>
              <span>স্ক্রোল করে আরও ঘুরে দেখুন</span>
            </div>
          </div>
        </div>

        <style>
          {`
            @keyframes pustEq {
              0% { height: 4px; }
              100% { height: 14px; }
            }
          `}
        </style>
      </section>

      {/* =========================================================================
          2. STATISTICS RIBBON (Institutional University Grid)
         ========================================================================= */}
      <div className="bg-white border-t border-b border-[#E2E8F0] relative z-20 shadow-xs reveal-section">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0]">
          {[
            { v: `22,400+`, l: `Alumni Worldwide`, bn: `সক্রিয় অ্যালামনাই` },
            { v: `45+`, l: `Countries`, bn: `দেশে পদচারণা` },
            { v: `21`, l: `Departments`, bn: `একাডেমিক বিভাগ` },
            { v: `600+`, l: `Employer Partners`, bn: `হায়ারিং পার্টনার্স` },
          ].map((item, idx) => (
            <div key={idx} className={`py-6 sm:py-7 px-4 text-center reveal-up delay-${(idx + 1) * 75}`}>
              <p className="font-display font-extrabold text-[#7A1737] text-2xl sm:text-3xl lg:text-4xl leading-none tracking-tight">
                {item.v}
              </p>
              <p className="text-[#17263C] text-xs sm:text-sm font-bold mt-2 tracking-wide">
                {item.l}
              </p>
              <p className="text-[#64748B] text-[11px] font-medium font-bengali hidden sm:block mt-0.5">
                {item.bn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          QUICK ZERO-PRESSURE GUIDANCE PORTAL (Effortless 4-Step Navigation)
         ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80 reveal-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 reveal-up">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737] bg-[#7A1737]/10 px-3.5 py-1 rounded-full border border-[#7A1737]/20 font-bengali">
              সহজ ও দ্রুত পথনির্দেশক
            </span>
            <h2 className="font-display font-extrabold text-[#17263C] text-2xl sm:text-3xl lg:text-4xl mt-3 tracking-tight font-bengali">
              আপনি কী খুঁজছেন? এক ক্লিকেই শুরু করুন
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-2 font-bengali">
              পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় প্ল্যাটফর্মের প্রধান সেবাগুলো কোনো জটিলতা ছাড়াই ব্যবহার করুন
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: "👥",
                title: "অ্যালামনাই খুঁজুন",
                desc: "ব্যাচমেট, সিনিয়র ও বন্ধুদের ডিপার্টমেন্ট বা ব্যাচ অনুযায়ী খুঁজে নিন।",
                link: "/alumni",
                linkText: "ডিরেক্টরি দেখুন →",
                borderHover: "hover:border-[#7A1737]/50",
              },
              {
                icon: "🎓",
                title: "সমাবর্তন ও অনুষ্ঠান",
                desc: "আসন্ন পুনর্মিলনী উৎসব, সমাবর্তন তথ্য ও ক্যাম্পাসের সকল অনুষ্ঠান।",
                link: "/events",
                linkText: "ইভেন্টস ক্যালেন্ডার →",
                borderHover: "hover:border-[#C7A76C]",
              },
              {
                icon: "💼",
                title: "ক্যারিয়ার ও চাকরি",
                desc: "শীর্ষ কোম্পানিগুলোর জব সার্কুলার ও অভিজ্ঞ অ্যালামনাইদের মেন্টরশিপ।",
                link: "/jobs",
                linkText: "জব সার্কুলার দেখুন →",
                borderHover: "hover:border-blue-400",
              },
              {
                icon: "🏛️",
                title: "ক্যাম্পাস স্মৃতি ও গ্যালারি",
                desc: "৩০ একরের সবুজ ক্যাম্পাস দর্শন, স্মৃতিচারণ ও জীবন্ত ফটো গ্যালারি।",
                link: "/gallery",
                linkText: "গ্যালারি এক্সপ্লোর →",
                borderHover: "hover:border-emerald-500",
              },
            ].map((card, idx) => (
              <Link
                key={idx}
                to={card.link}
                className={`group p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${card.borderHover} reveal-up delay-${(idx + 1) * 75}`}
              >
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <h3 className="font-display font-bold text-[#17263C] text-lg group-hover:text-[#7A1737] transition-colors font-bengali">
                    {card.title}
                  </h3>
                  <p className="text-[#64748B] text-xs sm:text-[13px] mt-2 leading-relaxed font-bengali">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#7A1737] group-hover:underline font-bengali">
                  <span>{card.linkText}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CAMPUS VIDEO EXPERIENCE (Offline Campus Feel & Convocation Showcase)
         ========================================================================= */}
      <section
        id="campus-experience"
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#F4F5F7] relative overflow-hidden border-b border-[#E2E8F0] scroll-mt-12 reveal-section"
      >
        <div className="max-w-6xl mx-auto reveal-up">
          <CampusVideoExperience />
        </div>
      </section>

      {/* =========================================================================
          4. VICE CHANCELLOR'S WELCOME & INSTITUTIONAL HERITAGE
         ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E2E8F0] reveal-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white via-[#F8FAFC] to-[#F1F5F9] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E2E8F0] shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
              {/* Honorable Vice-Chancellor Portrait & Seal */}
              <div className="lg:col-span-4 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-[#E2E8F0] pb-8 lg:pb-0 lg:pr-8 reveal-left">
                <div className="relative mb-4 group">
                  <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden bg-white p-1.5 shadow-md border border-slate-200 ring-2 ring-[#C7A76C]/40 group-hover:ring-[#7A1737]/60 transition-all duration-300">
                    <img
                      src={vcPortrait}
                      alt="Prof. Dr. Abul Hasnat Md. Shamim"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold bg-[#17263C] text-[#DFCA9E] border border-[#C7A76C]/40 shadow-sm font-bengali">
                    🏛️ মাননীয় উপাচার্য
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-[#17263C] text-lg sm:text-xl font-bengali mt-3">
                  প্রফেসর ড. আবুল হাসানাত মো. শামীম
                </h3>
                <p className="font-semibold text-xs text-[#7A1737] mt-0.5">
                  Prof. Dr. Abul Hasnat Md. Shamim
                </p>
                <p className="text-xs text-[#64748B] font-medium mt-1 font-bengali">
                  উপাচার্য, পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1737]/10 border border-[#7A1737]/20 text-[#7A1737] text-[11px] font-bold font-bengali">
                  <span>🏛️ প্রতিষ্ঠিত: ২০০৮ ইং · Pabna, BD</span>
                </div>
              </div>

              {/* VC's Inspiring Official Welcome Message */}
              <div className="lg:col-span-8 flex flex-col justify-center reveal-right">
                <div className="inline-flex items-center gap-2 text-[#7A1737] text-xs font-bold uppercase tracking-wider mb-2.5 font-bengali">
                  <span>🕊️ Welcome Message from the Vice-Chancellor</span>
                </div>
                <blockquote className="font-display font-bold text-[#17263C] text-xl sm:text-2xl lg:text-3xl leading-snug tracking-tight font-bengali">
                  "Our vision is to build PUST as one of the national leaders in creating a center of excellence in research, learning, and teaching."
                </blockquote>
                <p className="text-[#475569] text-xs sm:text-sm mt-3.5 leading-relaxed font-bengali">
                  ২০০৮ সালে মাত্র ৪টি বিভাগ ও ১৪০ জন শিক্ষার্থী নিয়ে যাত্রা শুরু করা পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (PUST) আজ ঢাকা-পাবনা মহাসড়কের পাশে ৩০ একরের সবুজ ক্যাম্পাসে ৫টি অনুষদ, ২১টি বিভাগ, ১৭২ জন শিক্ষক ও প্রায় ৫,০০০ শিক্ষার্থীর এক প্রাণবন্ত বাতিঘর।
                </p>
                <p className="text-[#475569] text-xs sm:text-sm mt-2.5 leading-relaxed font-bengali hidden sm:block">
                  দেশকে ২০৪১ সালের মধ্যে উন্নত রাষ্ট্রে রূপান্তর ও ২০৩০ সালের টেকসই উন্নয়ন লক্ষ্যমাত্রা (SDG) অর্জনের লক্ষ্যে চতুর্থ শিল্প বিপ্লবের (4IR) সকল চ্যালেঞ্জ মোকাবেলায় আমাদের শিক্ষক ও ২২,৪০০+ অ্যালামনাই বিশ্বজুড়ে অনন্য অবদান রাখছেন।
                </p>

                {/* Key Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#17263C] font-bengali flex items-center gap-1.5">
                    <span>🔬</span>
                    <span>উচ্চমানের গবেষণা</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#17263C] font-bengali flex items-center gap-1.5">
                    <span>🌐</span>
                    <span>আন্তর্জাতিক স্বীকৃতি</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#17263C] font-bengali flex items-center gap-1.5 col-span-2 sm:col-span-1">
                    <span>🚀</span>
                    <span>স্মার্ট বাংলাদেশ ২০৪১</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="text-xs text-[#64748B] font-bengali">
                    <span className="font-bold text-[#17263C]">Prof. Dr. Abul Hasnat Md. Shamim</span>
                    <span className="block text-[11px]">Vice Chancellor, PUST</span>
                  </div>
                  <Link
                    to="/about#vc-message"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7A1737] hover:underline transition-colors font-bengali"
                  >
                    <span>উপাচার্যের পূর্ণাঙ্গ বাণী পড়ুন</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. AWARD GIVING CEREMONY & CONVOCATION SPOTLIGHT (Featured Event)
         ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[#F4F5F7] border-b border-[#E2E8F0] reveal-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 reveal-up">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737] bg-[#7A1737]/10 px-3.5 py-1 rounded-full border border-[#7A1737]/20 font-bengali">
              অ্যালামনাই ফেস্টিভ্যাল ও অনুষ্ঠান
            </span>
            <h2 className="font-display font-extrabold text-[#17263C] text-2xl sm:text-4xl mt-3 tracking-tight">
              PUST Award Giving Ceremony 2026
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-2 font-bengali">
              মেধাবী অ্যালামনাই ও কৃতি শিক্ষার্থীদের সম্মাননা এবং শিক্ষক-শিক্ষার্থীদের মিলনমেলা
            </p>
          </div>

          <div className="flex flex-col lg:flex-row overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-3xl">
            {/* Event Image */}
            <div className="lg:w-1/2 overflow-hidden relative min-h-[280px] sm:min-h-[340px] reveal-left">
              <img
                src={La}
                alt="Award Ceremony"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-[#7A1737] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                🏆 ফ্ল্যাগশিপ ইভেন্ট
              </div>
            </div>

            {/* Event Description & Registration CTA */}
            <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center reveal-right">
              <div className="flex items-center gap-2 text-xs font-bold text-[#7A1737] mb-2 font-bengali">
                <span>📍 স্বাধীনতা চত্বর অডিটোরিয়াম, PUST ক্যাম্পাস</span>
              </div>
              <h3 className="font-display font-bold text-[#17263C] text-2xl sm:text-3xl leading-snug mb-3 font-bengali">
                একাডেমিক এক্সিলেন্স ও অ্যালামনাই সম্মাননা
              </h3>
              <p className="text-[#475569] text-xs sm:text-sm leading-relaxed mb-6 font-bengali">
                পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের উপাচার্য মহোদয়ের সভাপতিত্বে এবং দেশ-বিদেশের বিশিষ্ট অ্যালামনাই, সম্মানিত শিক্ষক ও শিক্ষার্থীদের উপস্থিতিতে অনুষ্ঠিত হতে যাচ্ছে এই মহতী উৎসব।
              </p>

              {/* Highlights Pill Badges */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#17263C] font-semibold font-bengali">
                  ✓ ডিন্স অ্যাওয়ার্ড প্রদান
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#17263C] font-semibold font-bengali">
                  ✓ অ্যালামনাই রিইউনিয়ন লাঞ্চ
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#17263C] font-semibold font-bengali">
                  ✓ স্মৃতিচারণ ও সাংস্কৃতিক সন্ধ্যা
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#17263C] font-semibold font-bengali">
                  ✓ নেটওয়ার্কিং ও ক্যারিয়ার মিট
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/events"
                  className="px-6 py-3 rounded-full text-xs sm:text-sm font-medium text-white bg-[#7A1737] hover:bg-[#60122B] shadow-sm transition-all active:scale-95 text-center flex-1 sm:flex-initial font-bengali"
                >
                  ইভেন্টে অংশ নিন / রেজিস্ট্রেশন করুন →
                </Link>
                <Link
                  to="/events"
                  className="px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-[#17263C] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors text-center font-bengali"
                >
                  বিস্তারিত দেখুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. CONNECTING WITH PURPOSE (Stakeholders Grid)
         ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E2E8F0] reveal-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal-up">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737] bg-[#7A1737]/10 px-3.5 py-1 rounded-full border border-[#7A1737]/20 font-bengali">
              সকল অংশীদারের জন্য নিবেদিত
            </span>
            <h2 className="font-display font-extrabold text-[#17263C] text-2xl sm:text-4xl mt-3 tracking-tight">
              Connecting With Purpose
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-2 font-bengali">
              অ্যালামনাই, বর্তমান শিক্ষার্থী, গবেষক ও নিয়োগকর্তা—সবার জন্য এক অবিচ্ছেদ্য ডিজিটাল পোর্টাল
            </p>
          </div>

          {/* Balanced 2x2 Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {eo.map((item, idx) => (
              <div
                key={idx}
                className={`group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] hover:border-[#7A1737]/40 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 reveal-up delay-${(idx + 1) * 100}`}
              >
                {/* Photo Header */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17263C]/90 via-[#17263C]/30 to-transparent pointer-events-none" />

                  {/* Badges on Image */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm font-bengali">
                      {item.icon} {item.label}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <p className="font-display font-bold text-lg sm:text-xl drop-shadow-md">
                      {item.title}
                    </p>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#17263C]">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white">
                  <p className="text-[#475569] text-xs sm:text-sm leading-relaxed mb-6 font-bengali">
                    {item.desc}
                  </p>

                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <Link
                      to={item.link}
                      className="font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 text-[#7A1737] hover:underline transition-all group-hover:gap-2.5 font-bengali"
                    >
                      <span>{item.linkText}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. DISTINGUISHED ALUMNI SPOTLIGHT (Hall of Fame)
         ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[#F4F5F7] border-b border-[#E2E8F0] reveal-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal-up">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737] bg-[#7A1737]/10 px-3.5 py-1 rounded-full border border-[#7A1737]/20 font-bengali">
              গৌরবোজ্জ্বল অ্যালামনাই
            </span>
            <h2 className="font-display font-extrabold text-[#17263C] text-2xl sm:text-4xl mt-3 tracking-tight">
              PUSTians Making Global Impact
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-2 font-bengali">
              বিশ্বের সেরা কোম্পানি ও গবেষণা প্রতিষ্ঠানে মেধার স্বাক্ষর রাখছেন আমাদের গ্র্যাজুয়েটরা
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pa.slice(0, 4).map((alumni, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#7A1737]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group reveal-up delay-${(idx + 1) * 75}`}
              >
                <div className="relative mb-4">
                  <img
                    src={alumni.avatar}
                    alt={alumni.name}
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-[#E2E8F0] group-hover:ring-[#7A1737] transition-all shadow-xs"
                  />
                  {alumni.verified && (
                    <span
                      className="absolute bottom-0 right-0 w-5 h-5 bg-[#7A1737] text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white"
                      title="Verified Alumni"
                    >
                      ✓
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-[#17263C] text-base group-hover:text-[#7A1737] transition-colors">
                  {alumni.name}
                </h3>
                <p className="text-xs font-semibold text-[#7A1737] mt-0.5">
                  {alumni.dept} · {alumni.batch ? `Batch ${alumni.batch}` : "Alumni"}
                </p>

                <p className="text-[#475569] text-xs mt-2 line-clamp-2 leading-relaxed">
                  {alumni.headline || `Professional in ${alumni.company || "Leading Sector"}`}
                </p>

                {alumni.company && (
                  <div className="mt-3 px-3 py-1 rounded-full bg-[#F4F5F7] border border-[#E2E8F0] text-[11px] font-semibold text-[#17263C] flex items-center gap-1.5">
                    <span>🏢</span>
                    <span className="truncate max-w-[140px]">{alumni.company}</span>
                  </div>
                )}

                <Link
                  to={`/alumni/${alumni.id}`}
                  className="mt-5 text-xs font-bold text-[#7A1737] hover:underline transition-colors inline-flex items-center gap-1 font-bengali"
                >
                  <span>প্রোফাইল দেখুন</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 reveal-up">
            <Link
              to="/alumni"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-medium text-[#17263C] bg-white border border-[#E2E8F0] hover:border-[#7A1737] hover:text-[#7A1737] transition-all shadow-xs font-bengali"
            >
              <span>সকল ২২,৪০০+ অ্যালামনাই ডিরেক্টরিতে খুঁজুন</span>
              <span>🔍</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. EVENTS & PROGRAMS (Responsive 3-col Grid)
         ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E2E8F0] reveal-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 reveal-up">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737] bg-[#7A1737]/10 px-3.5 py-1 rounded-full border border-[#7A1737]/20 font-bengali">
              আপকামিং ইভেন্টস
            </span>
            <h2 className="font-display font-extrabold text-[#17263C] text-2xl sm:text-4xl mt-3 tracking-tight">
              Be Part of Every PUST Moment
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-2 font-bengali">
              ক্যাম্পাস রিইউনিয়ন, টেক কনফারেন্স, ক্যারিয়ার ফেয়ার ও ভার্চুয়াল ওয়েবিনার
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {_a.slice(0, 3).map((event, idx) => (
              <Link
                key={event.id}
                to="/events"
                className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] hover:border-[#7A1737]/40 shadow-xs hover:shadow-md transition-all duration-300 reveal-up delay-${(idx + 1) * 100}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17263C]/90 via-[#17263C]/30 to-transparent" />

                  {event.online && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 text-white bg-[#7A1737] rounded-full shadow-md">
                      🌐 Virtual Event
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[11px] text-[#C7A76C] font-bold uppercase tracking-wider">
                      {event.type}
                    </p>
                    <p className="font-display font-bold text-sm sm:text-base leading-snug drop-shadow-sm group-hover:text-white transition-colors">
                      {event.title}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
                  <div className="flex items-center justify-between text-xs text-[#64748B] pb-3 border-b border-[#E2E8F0]">
                    <span className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{event.date}</span>
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <span>📍</span>
                      <span className="truncate">{event.location}</span>
                    </span>
                  </div>

                  <p className="text-[#475569] text-xs mt-3 line-clamp-2 leading-relaxed">
                    {event.desc}
                  </p>

                  <div className="mt-4 pt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7A1737] group-hover:underline font-bengali">
                      অংশগ্রহণ করুন →
                    </span>
                    <span className="text-[10px] font-semibold text-[#64748B] font-bengali">
                      রেজিস্ট্রেশন চলছে
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center reveal-up">
            <Link
              to="/events"
              className="inline-block text-xs sm:text-sm font-medium text-[#17263C] px-8 py-3.5 border border-[#E2E8F0] hover:border-[#7A1737] hover:text-[#7A1737] transition-all rounded-full shadow-xs bg-white font-bengali"
            >
              সকল ইভেন্ট ক্যালেন্ডার দেখুন →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. PUST ON CAMPUS PHOTO & MOMENTS GALLERY (Responsive Photo Grid)
         ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[#F4F5F7] border-b border-[#E2E8F0] reveal-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 reveal-up">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737] bg-[#7A1737]/10 px-3.5 py-1 rounded-full border border-[#7A1737]/20 font-bengali">
              স্মৃতির দৃশ্যপট
            </span>
            <h2 className="font-display font-extrabold text-[#17263C] text-2xl sm:text-4xl mt-3 tracking-tight">
              PUST on Campus Moments
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-2 font-bengali">
              পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের প্রিয় প্রাঙ্গণ ও উৎসবের জীবন্ত প্রতিচ্ছবি
            </p>
          </div>

          {/* Responsive Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {to.slice(0, 12).map((photo, idx) => (
              <Link
                key={idx}
                to="/gallery"
                className={`relative overflow-hidden group rounded-xl aspect-square shadow-xs border border-[#E2E8F0] hover:border-[#7A1737] transition-all bg-white reveal-scale delay-${(idx % 6 + 1) * 75}`}
              >
                <img
                  src={photo}
                  alt="PUST campus photo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#17263C]/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold px-3 py-1 rounded-full bg-[#7A1737] shadow-sm">
                    View
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 reveal-up">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7A1737] hover:underline transition-all font-bengali"
            >
              <span>সম্পূর্ণ ফটো ও ভিডিও গ্যালারি এক্সপ্লোর করুন</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. MENTORSHIP & GIVING BACK DUAL HUB
         ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E2E8F0] reveal-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Card 1: Mentorship */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7A1737]/30 transition-all duration-300 shadow-xs flex flex-col justify-between reveal-left">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#7A1737]/10 border border-[#7A1737]/20 text-[#7A1737] flex items-center justify-center text-3xl mb-5 shadow-xs">
                  🎯
                </div>
                <h3 className="font-display font-bold text-[#17263C] text-2xl sm:text-3xl mb-3">
                  Become a Mentor
                </h3>
                <p className="text-[#475569] text-xs sm:text-sm leading-relaxed mb-6 font-bengali">
                  আপনার অভিজ্ঞতা ও দক্ষতা ভাগ করে নিন বর্তমান PUST শিক্ষার্থী ও নবীন গ্র্যাজুয়েটদের সাথে। ক্যারিয়ার পরামর্শ, সিভি রিভিউ এবং মক ইন্টারভিউ সেশনের মাধ্যমে গড়ে তুলুন আগামীর নেতৃত্ব।
                </p>
                <div className="flex items-center gap-3 text-xs font-semibold text-[#17263C] mb-6 font-bengali">
                  <span>✓ ৩২০+ একটিভ মেন্টর</span>
                  <span>•</span>
                  <span>✓ ১-অন-১ গাইডেন্স</span>
                </div>
              </div>

              <Link
                to="/mentorship"
                className="w-full sm:w-auto text-center px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-[#7A1737] hover:bg-[#60122B] shadow-sm transition-all active:scale-95 inline-block font-bengali"
              >
                মেন্টর হিসেবে যোগ দিন →
              </Link>
            </div>

            {/* Card 2: Donate / Give Back */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7A1737]/30 transition-all duration-300 shadow-xs flex flex-col justify-between reveal-right">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#C7A76C]/15 border border-[#C7A76C]/30 text-[#8B6B2F] flex items-center justify-center text-3xl mb-5 shadow-xs">
                  🏛️
                </div>
                <h3 className="font-display font-bold text-[#17263C] text-2xl sm:text-3xl mb-3">
                  Give Back to PUST
                </h3>
                <p className="text-[#475569] text-xs sm:text-sm leading-relaxed mb-6 font-bengali">
                  অসহায় মেধাবী শিক্ষার্থীদের বৃত্তি তহবিল, আধুনিক ল্যাব ও গবেষণা সরঞ্জাম এবং ক্যাম্পাস উন্নয়নে অবদান রাখুন। প্রতিটি অনুদান PUST-এর উন্নয়নযাত্রায় বিশেষ ভূমিকা রাখে।
                </p>
                <div className="flex items-center gap-3 text-xs font-semibold text-[#17263C] mb-6 font-bengali">
                  <span>✓ স্কলারশিপ ফান্ড</span>
                  <span>•</span>
                  <span>✓ ১০০% স্বচ্ছ ট্র্যাকিং</span>
                </div>
              </div>

              <Link
                to="/donate"
                className="w-full sm:w-auto text-center px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-[#17263C] hover:bg-[#0F1A2A] shadow-sm transition-all active:scale-95 inline-block font-bengali"
              >
                ক্যাম্পাসে অনুদান দিন →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. NEWSLETTER & ALUMNI NETWORK BANNER
         ========================================================================= */}
      <section className="relative overflow-hidden min-h-[300px] flex items-center bg-[#17263C] border-b border-[#0F1A2A] reveal-section">
        <img
          src={Qa}
          alt="PUST Campus Sunset"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17263C] via-[#17263C]/90 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 w-full reveal-up">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C7A76C] bg-white/10 px-3.5 py-1 rounded-full border border-white/15 font-bengali">
              সংযুক্ত থাকুন
            </span>
            <h2 className="font-display font-extrabold text-white text-2xl sm:text-4xl mt-3 leading-tight tracking-tight">
              PUST <span className="text-[#C7A76C] italic">Alumni Digest</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed font-bengali">
              ক্যাম্পাস সংবাদ, পুনর্মিলনী ইভেন্ট, ক্যারিয়ার সার্কুলার ও অ্যালামনাইদের সাফল্যের নিয়মিত আপডেট পান আপনার ইনবক্সে।
            </p>

            {isSubscribed ? (
              <div className="mt-5 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2 font-bengali">
                <span>✓</span>
                <span>সাবস্ক্রিপশন সম্পন্ন হয়েছে। আপনাকে ধন্যবাদ!</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) {
                    setIsSubscribed(true);
                    setEmail("");
                  }
                }}
                className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন"
                  required
                  className="flex-1 px-4 py-3 rounded-xl sm:rounded-l-xl sm:rounded-r-none text-xs sm:text-sm bg-white/10 text-white placeholder-slate-300 outline-none border border-white/20 focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl sm:rounded-r-xl sm:rounded-l-none text-xs sm:text-sm font-bold text-white bg-[#7A1737] hover:bg-[#60122B] transition-all text-center flex-shrink-0 font-bengali"
                >
                  সাবস্ক্রাইব করুন
                </button>
              </form>
            )}

            <p className="text-slate-400 text-[11px] mt-3 font-bengali">
              আমরা আপনার গোপনীয়তা রক্ষা করি। কোনো স্প্যাম পাঠানো হবে না।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

