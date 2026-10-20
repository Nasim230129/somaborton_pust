import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CampusVideoExperience({
  title = "বাস্তব ক্যাম্পাস অনুভূতি ও সমাবর্তন স্মৃতি",
  subtitle = "অনলাইন থেকেই সরাসরি উপভোগ করুন পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (PUST) ক্যাম্পাসের আসল পরিবেশ, ৩০ একরের সবুজ প্রাঙ্গণ ও বর্ণাঢ্য সমাবর্তন উৎসব",
  className = "",
  compact = false,
}) {
  // Video 1 (Campus Tour) state
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isMuted1, setIsMuted1] = useState(true);
  const [currentTime1, setCurrentTime1] = useState(0);
  const [duration1, setDuration1] = useState(0);
  const [isFullscreen1, setIsFullscreen1] = useState(false);

  // Video 2 (Convocation Memories) state
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [isMuted2, setIsMuted2] = useState(true);
  const [currentTime2, setCurrentTime2] = useState(0);
  const [duration2, setDuration2] = useState(0);
  const [isFullscreen2, setIsFullscreen2] = useState(false);

  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const container1Ref = useRef(null);
  const container2Ref = useRef(null);

  // Toggle Video 1 play/pause (auto pause video 2)
  const togglePlay1 = () => {
    if (!video1Ref.current) return;
    if (isPlaying1) {
      video1Ref.current.pause();
      setIsPlaying1(false);
    } else {
      if (video2Ref.current && isPlaying2) {
        video2Ref.current.pause();
        setIsPlaying2(false);
      }
      video1Ref.current
        .play()
        .then(() => setIsPlaying1(true))
        .catch(() => setIsPlaying1(false));
    }
  };

  // Toggle Video 2 play/pause (auto pause video 1)
  const togglePlay2 = () => {
    if (!video2Ref.current) return;
    if (isPlaying2) {
      video2Ref.current.pause();
      setIsPlaying2(false);
    } else {
      if (video1Ref.current && isPlaying1) {
        video1Ref.current.pause();
        setIsPlaying1(false);
      }
      video2Ref.current
        .play()
        .then(() => setIsPlaying2(true))
        .catch(() => setIsPlaying2(false));
    }
  };

  const toggleMute1 = () => {
    if (!video1Ref.current) return;
    const next = !isMuted1;
    video1Ref.current.muted = next;
    setIsMuted1(next);
  };

  const toggleMute2 = () => {
    if (!video2Ref.current) return;
    const next = !isMuted2;
    video2Ref.current.muted = next;
    setIsMuted2(next);
  };

  const handleSeek1 = (e) => {
    const val = parseFloat(e.target.value);
    if (video1Ref.current) {
      video1Ref.current.currentTime = val;
      setCurrentTime1(val);
    }
  };

  const handleSeek2 = (e) => {
    const val = parseFloat(e.target.value);
    if (video2Ref.current) {
      video2Ref.current.currentTime = val;
      setCurrentTime2(val);
    }
  };

  const toggleFullscreen1 = () => {
    if (!container1Ref.current) return;
    if (!document.fullscreenElement) {
      if (container1Ref.current.requestFullscreen) {
        container1Ref.current.requestFullscreen();
      } else if (container1Ref.current.webkitRequestFullscreen) {
        container1Ref.current.webkitRequestFullscreen();
      }
      setIsFullscreen1(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen1(false);
    }
  };

  const toggleFullscreen2 = () => {
    if (!container2Ref.current) return;
    if (!document.fullscreenElement) {
      if (container2Ref.current.requestFullscreen) {
        container2Ref.current.requestFullscreen();
      } else if (container2Ref.current.webkitRequestFullscreen) {
        container2Ref.current.webkitRequestFullscreen();
      }
      setIsFullscreen2(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen2(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen1(document.fullscreenElement === container1Ref.current);
      setIsFullscreen2(document.fullscreenElement === container2Ref.current);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const scrollToDiv = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className={`space-y-8 sm:space-y-12 ${className}`}>
      {/* =====================================================================
          SECTION HEADER WITH QUICK JUMP CONTROLS
         ===================================================================== */}
      <div className="relative z-10 px-5 sm:px-8 py-6 sm:py-8 rounded-3xl bg-[#17263C] border border-[#0F1A2A] shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7A1737] text-white text-xs font-bold mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="font-bengali font-medium">🎥 অফিশিয়াল রিয়েল ক্যাম্পাস ভিডিও ফুটেজ</span>
              <span className="text-white/40">|</span>
              <span className="text-white/90 font-medium">Real Offline Campus Feel</span>
            </div>
            <h2 className="font-display font-bold font-bengali text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl font-bengali font-normal leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Quick Jump Buttons to either Video Div */}
          <div className="flex flex-wrap items-center gap-2.5 bg-[#0F1A2A]/80 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <span className="text-[11px] font-bengali font-medium text-slate-300 px-2 hidden sm:inline">
              ভিডিও নির্বাচন:
            </span>
            <button
              type="button"
              onClick={() => scrollToDiv("div-video-campus-tour")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium font-bengali bg-[#7A1737] hover:bg-[#60122B] text-white shadow-md transition-all active:scale-95"
            >
              <span>🌿</span>
              <span>১ম ভিডিও: ক্যাম্পাস ট্যুর</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/25 font-mono text-white">
                ২ মিনিট
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollToDiv("div-video-convocation")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium font-bengali bg-[#C7A76C] hover:bg-[#b8965a] text-[#17263C] shadow-md transition-all active:scale-95"
            >
              <span>🎓</span>
              <span>২য় ভিডিও: সমাবর্তন উৎসব</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 font-mono text-[#17263C] font-bold">
                ৩৩ সে.
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          1ST VIDEO DIV: CAMPUS TOUR & 30-ACRE LIFE EXPERIENCE
         ===================================================================== */}
      <div
        id="div-video-campus-tour"
        ref={container1Ref}
        className={`relative rounded-3xl overflow-hidden shadow-xl transition-all duration-300 scroll-mt-24 ${
          isFullscreen1
            ? "w-screen h-screen flex flex-col justify-center bg-black p-0"
            : "border border-[#E2E8F0] bg-white text-[#17263C] p-5 sm:p-8"
        }`}
      >
        {/* Video 1 Card Top Header */}
        {!isFullscreen1 && (
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-[#E2E8F0]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A1737]/10 border border-[#7A1737]/20 text-[#7A1737] text-xs font-bold mb-2">
                <span>🌿 ১ম ভিডিও ফুটেজ</span>
                <span className="text-[#7A1737]/40">•</span>
                <span>ক্যাম্পাস ওয়াকথ্রু ও পরিবেশ</span>
                <span className="text-[#7A1737]/40">•</span>
                <span className="font-mono font-semibold">দৈর্ঘ্য: ২ মিনিট</span>
              </div>
              <h3 className="font-display font-bold font-bengali text-[#17263C] text-xl sm:text-2xl lg:text-3xl tracking-tight">
                ৩০ একরের সবুজ শ্যামল ক্যাম্পাস ও শিক্ষা প্রাঙ্গণের জীবন্ত চিত্র
              </h3>
              <p className="text-[#64748B] text-xs sm:text-sm mt-1">
                PUST Campus Tour & Natural Atmosphere Experience
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>HD ভিডিও</span>
              </span>
            </div>
          </div>
        )}

        {/* Video 1 Main Content Grid */}
        <div className={`relative z-10 ${isFullscreen1 ? "p-0 h-full flex flex-col justify-center" : ""}`}>
          <div className={`grid ${compact || isFullscreen1 ? "grid-cols-1" : "lg:grid-cols-12"} gap-6 items-center`}>
            {/* Player Container */}
            <div className={`${compact || isFullscreen1 ? "w-full" : "lg:col-span-8"} relative group`}>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-[#E2E8F0] shadow-2xl aspect-video flex items-center justify-center">
                <video
                  ref={video1Ref}
                  src="/assets/videos/pust_tour_youtube.mp4"
                  poster="/assets/1778991184DSC05122-DR5DHwQE.jpeg"
                  playsInline
                  loop
                  muted={isMuted1}
                  onTimeUpdate={() => {
                    if (video1Ref.current) setCurrentTime1(video1Ref.current.currentTime);
                  }}
                  onLoadedMetadata={() => {
                    if (video1Ref.current) setDuration1(video1Ref.current.duration);
                  }}
                  onClick={togglePlay1}
                  className="w-full h-full object-cover cursor-pointer"
                />

                {/* Center Play Overlay Button */}
                {!isPlaying1 && (
                  <button
                    type="button"
                    onClick={togglePlay1}
                    className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7A1737] hover:bg-[#60122B] text-white flex items-center justify-center shadow-2xl ring-4 ring-white/40 hover:scale-110 active:scale-95 transition-all z-20"
                    title="Play campus tour video"
                  >
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                )}

                {/* Top Watermark Badge */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#17263C]/80 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ক্যাম্পাস ওয়াকথ্রু · রাজাপুর, পাবনা</span>
                </div>

                {/* Bottom Custom Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col gap-2">
                  <input
                    type="range"
                    min="0"
                    max={duration1 || 120}
                    step="0.1"
                    value={currentTime1}
                    onChange={handleSeek1}
                    aria-label="Video scrubber"
                    className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#7A1737] hover:h-2 transition-all"
                  />

                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlay1}
                        className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                        title={isPlaying1 ? "Pause" : "Play"}
                      >
                        {isPlaying1 ? (
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={toggleMute1}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          !isMuted1
                            ? "bg-[#7A1737] text-white ring-1 ring-white/30"
                            : "bg-white/15 hover:bg-white/25 text-slate-200"
                        }`}
                        title={isMuted1 ? "শব্দ চালু করুন (Unmute)" : "শব্দ বন্ধ করুন (Mute)"}
                      >
                        {isMuted1 ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                            <span className="hidden sm:inline">সাউন্ড চালু করুন</span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-0.5 h-3">
                              <span className="w-0.5 bg-white rounded-full animate-bounce h-2" />
                              <span className="w-0.5 bg-white rounded-full animate-bounce h-3 delay-75" />
                              <span className="w-0.5 bg-white rounded-full animate-bounce h-2.5 delay-150" />
                            </span>
                            <span>সাউন্ড অন</span>
                          </>
                        )}
                      </button>

                      <span className="font-mono text-[11px] text-white/80 hidden sm:inline">
                        {formatTime(currentTime1)} / {formatTime(duration1)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={toggleFullscreen1}
                      className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors flex items-center gap-1"
                      title="Fullscreen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className="hidden sm:inline text-[11px]">ফুলস্ক্রিন</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video 1 Info & Offline Campus Feel Details */}
            {!isFullscreen1 && !compact && (
              <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs">
                  <div className="flex items-center gap-2 text-[#7A1737] text-xs font-bold uppercase tracking-wider mb-2">
                    <span>🌿</span>
                    <span>PUST Campus Experience</span>
                  </div>
                  <h4 className="font-display font-semibold font-bengali text-[#17263C] text-lg sm:text-xl leading-snug">
                    ক্যাম্পাস প্রাঙ্গণের আসল পরিবেশ
                  </h4>
                  <p className="text-[#475569] text-xs sm:text-sm mt-2 leading-relaxed font-bengali font-normal">
                    পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের শান্ত, মনোরম ৩০ একরের দৃষ্টিনন্দন ক্যাম্পাস, একাডেমি ভবন, লাইব্রেরি ও শিক্ষার্থীদের প্রাণবন্ত পদচারণা।
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-2">
                    <p className="text-[11px] font-bold text-[#7A1737] uppercase tracking-wider font-bengali">
                      ভিডিওতে প্রদর্শিত মূল স্থানসমূহ:
                    </p>
                    {[
                      "🏛️ প্রশাসনিক ও আধুনিক একাডেমি ভবন কমপ্লেক্স",
                      "📚 কেন্দ্রীয় লাইব্রেরি ও শিক্ষার্থীদের স্টাডি কর্নার",
                      "🌊 ক্যাম্পাস লেকভিউ ও স্বাধীনতা চত্বর প্রাঙ্গণ",
                      "🌿 শান্ত সবুজ প্রাঙ্গণ ও আড্ডার স্থান",
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#475569] font-bengali font-normal">
                        <span className="text-[#7A1737] font-bold">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-2 text-[11px] text-[#64748B] font-medium font-bengali">
                    <span>🎧</span>
                    <span>হেডফোনে আসল ক্যাম্পাস বাতাসের শব্দ শুনুন</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#17263C] text-white border border-[#0F1A2A] flex items-center justify-between gap-3 shadow-md">
                  <div>
                    <p className="text-xs font-bold text-white font-bengali">ক্যাম্পাসের আরও ছবি দেখতে চান?</p>
                    <p className="text-[11px] text-slate-300 font-bengali font-normal">২০+ অরিজিনাল ক্যাম্পাস ফটো গ্যালারি</p>
                  </div>
                  <Link
                    to="/gallery"
                    className="px-4 py-2 rounded-xl text-xs font-medium font-bengali text-white bg-[#7A1737] hover:bg-[#60122B] shadow-xs transition-all flex-shrink-0 active:scale-95"
                  >
                    গ্যালারি দেখুন →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          DOWNWARD SCROLL CONNECTOR (Offline Campus Feel Bridge)
         ===================================================================== */}
      <div className="flex flex-col items-center justify-center my-6 sm:my-8 text-center relative z-10">
        <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-[#7A1737]/60 to-[#C7A76C]/60" />
        <button
          type="button"
          onClick={() => scrollToDiv("div-video-convocation")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#C7A76C] text-xs sm:text-sm font-bold text-[#17263C] shadow-lg hover:bg-[#F8FAFC] transition-all active:scale-95 group"
        >
          <span className="text-[#C7A76C] animate-bounce">↓</span>
          <span>স্ক্রোল করুন — নিচে দেখুন ২য় সমাবর্তন পুনর্মিলনী ভিডিও</span>
          <span className="text-[#C7A76C] animate-bounce">↓</span>
        </button>
        <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-[#C7A76C]/60 to-[#7A1737]/20" />
      </div>

      {/* =====================================================================
          2ND VIDEO DIV: CONVOCATION & ALUMNI REUNION MEMORIES
         ===================================================================== */}
      <div
        id="div-video-convocation"
        ref={container2Ref}
        className={`relative rounded-3xl overflow-hidden shadow-xl transition-all duration-300 scroll-mt-24 ${
          isFullscreen2
            ? "w-screen h-screen flex flex-col justify-center bg-black p-0"
            : "border border-[#E2E8F0] bg-white text-[#17263C] p-5 sm:p-8"
        }`}
      >
        {/* Video 2 Card Top Header */}
        {!isFullscreen2 && (
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-[#E2E8F0]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A76C]/20 border border-[#C7A76C]/30 text-[#8B6B2F] text-xs font-bold mb-2">
                <span>🎓 ২য় ভিডিও ফুটেজ</span>
                <span className="text-[#8B6B2F]/40">•</span>
                <span>সমাবর্তন ও অ্যালামনাই পুনর্মিলন</span>
                <span className="text-[#8B6B2F]/40">•</span>
                <span className="font-mono font-semibold">দৈর্ঘ্য: ৩৩ সেকেন্ড</span>
              </div>
              <h3 className="font-display font-bold font-bengali text-[#17263C] text-xl sm:text-2xl lg:text-3xl tracking-tight">
                সমাবর্তন উদযাপন ও বন্ধুদের আনন্দঘন স্মৃতিময় পুনর্মিলনী
              </h3>
              <p className="text-[#64748B] text-xs sm:text-sm mt-1">
                PUST Convocation & Alumni Gathering Memories
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#C7A76C]/20 border border-[#C7A76C]/40 text-[#8B6B2F] text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C7A76C] animate-pulse" />
                <span>HD উৎসব ফুটেজ</span>
              </span>
            </div>
          </div>
        )}

        {/* Video 2 Main Content Grid */}
        <div className={`relative z-10 ${isFullscreen2 ? "p-0 h-full flex flex-col justify-center" : ""}`}>
          <div className={`grid ${compact || isFullscreen2 ? "grid-cols-1" : "lg:grid-cols-12"} gap-6 items-center`}>
            {/* Player Container */}
            <div className={`${compact || isFullscreen2 ? "w-full" : "lg:col-span-8"} relative group`}>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-[#E2E8F0] shadow-2xl aspect-video flex items-center justify-center">
                <video
                  ref={video2Ref}
                  src="/assets/videos/pust_convocation_memories.mp4"
                  poster="/assets/1778991857DSC05306__1_-Bl7-Lfr0.jpeg"
                  playsInline
                  loop
                  muted={isMuted2}
                  onTimeUpdate={() => {
                    if (video2Ref.current) setCurrentTime2(video2Ref.current.currentTime);
                  }}
                  onLoadedMetadata={() => {
                    if (video2Ref.current) setDuration2(video2Ref.current.duration);
                  }}
                  onClick={togglePlay2}
                  className="w-full h-full object-cover cursor-pointer"
                />

                {/* Center Play Overlay Button */}
                {!isPlaying2 && (
                  <button
                    type="button"
                    onClick={togglePlay2}
                    className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C7A76C] hover:bg-[#b8965a] text-[#17263C] flex items-center justify-center shadow-2xl ring-4 ring-white/40 hover:scale-110 active:scale-95 transition-all z-20"
                    title="Play convocation memories video"
                  >
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                )}

                {/* Top Watermark Badge */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#17263C]/80 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-[#C7A76C] animate-pulse" />
                  <span>সমাবর্তন উৎসব · কনভোকেশন গ্রাউন্ড</span>
                </div>

                {/* Bottom Custom Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col gap-2">
                  <input
                    type="range"
                    min="0"
                    max={duration2 || 33}
                    step="0.1"
                    value={currentTime2}
                    onChange={handleSeek2}
                    aria-label="Video scrubber"
                    className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#C7A76C] hover:h-2 transition-all"
                  />

                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlay2}
                        className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                        title={isPlaying2 ? "Pause" : "Play"}
                      >
                        {isPlaying2 ? (
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={toggleMute2}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          !isMuted2
                            ? "bg-[#C7A76C] text-[#17263C] ring-1 ring-white/30"
                            : "bg-white/15 hover:bg-white/25 text-slate-200"
                        }`}
                        title={isMuted2 ? "শব্দ চালু করুন (Unmute)" : "শব্দ বন্ধ করুন (Mute)"}
                      >
                        {isMuted2 ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                            <span className="hidden sm:inline">সাউন্ড চালু করুন</span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-0.5 h-3">
                              <span className="w-0.5 bg-slate-950 rounded-full animate-bounce h-2" />
                              <span className="w-0.5 bg-slate-950 rounded-full animate-bounce h-3 delay-75" />
                              <span className="w-0.5 bg-slate-950 rounded-full animate-bounce h-2.5 delay-150" />
                            </span>
                            <span>সাউন্ড অন</span>
                          </>
                        )}
                      </button>

                      <span className="font-mono text-[11px] text-white/80 hidden sm:inline">
                        {formatTime(currentTime2)} / {formatTime(duration2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={toggleFullscreen2}
                      className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors flex items-center gap-1"
                      title="Fullscreen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className="hidden sm:inline text-[11px]">ফুলস্ক্রিন</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video 2 Info & Offline Convocation Details */}
            {!isFullscreen2 && !compact && (
              <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs">
                  <div className="flex items-center gap-2 text-[#8B6B2F] text-xs font-bold uppercase tracking-wider mb-2">
                    <span>🎓</span>
                    <span>Convocation Memories</span>
                  </div>
                  <h4 className="font-display font-semibold font-bengali text-[#17263C] text-lg sm:text-xl leading-snug">
                    সমাবর্তন পুনর্মিলনীর আবেগঘন মুহূর্ত
                  </h4>
                  <p className="text-[#475569] text-xs sm:text-sm mt-2 leading-relaxed font-bengali font-normal">
                    গ্র্যাজুয়েটদের উৎসবমুখর সমাবর্তন, অ্যালামনাই পুনর্মিলন, গাউন-ক্যাপ পরে বন্ধুদের হাসি ও জীবনের সেরা আবেগঘন বিদায়ের মুহূর্ত।
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-2">
                    <p className="text-[11px] font-bold text-[#8B6B2F] uppercase tracking-wider font-bengali">
                      ভিডিওর বিশেষ স্মৃতিসমূহ:
                    </p>
                    {[
                      "🎓 গ্র্যাজুয়েশন গাউন ও ক্যাপ থ্রোয়িং উৎসব",
                      "🤝 অ্যালামনাইদের আবেগঘন কোলাকুলি ও পুনর্মিলন",
                      "📸 বন্ধুদের সাথে আজীবনের স্মৃতি ও গ্রুপ ফটো সেশন",
                      "📜 সনদ অর্জন ও বিশ্ববিদ্যালয় জীবনের গৌরবময় পরিসমাপ্তি",
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#475569] font-bengali font-normal">
                        <span className="text-[#C7A76C] font-bold">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-2 text-[11px] text-[#64748B] font-medium font-bengali">
                    <span>🎉</span>
                    <span>সমাবর্তন উৎসবের আনন্দধ্বনি ও করতালি শুনুন</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#17263C] text-white border border-[#0F1A2A] flex items-center justify-between gap-3 shadow-md">
                  <div>
                    <p className="text-xs font-bold text-white font-bengali">বন্ধুদের খুঁজছেন?</p>
                    <p className="text-[11px] text-slate-300 font-bengali font-normal">২২,৪০০+ অ্যালামনাই ডিরেক্টরি</p>
                  </div>
                  <Link
                    to="/alumni"
                    className="px-4 py-2 rounded-xl text-xs font-medium font-bengali text-[#17263C] bg-[#C7A76C] hover:bg-[#b8965a] shadow-xs transition-all flex-shrink-0 active:scale-95"
                  >
                    অ্যালামনাই খুঁজুন →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          FEATURE BADGES UNDERNEATH (Offline to Online Bridges)
         ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#7A1737]/30 transition-colors">
          <span className="text-2xl p-2.5 rounded-xl bg-[#7A1737]/10 text-[#7A1737]">
            🏛️
          </span>
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#17263C]">৩০ একরের সবুজ প্রাঙ্গণ</p>
            <p className="text-[11px] text-[#64748B]">
              রাজাপুর, পাবনা ক্যাম্পাসের শান্ত ও মনোরম প্রাকৃতিক সৌন্দর্য
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#C7A76C]/50 transition-colors">
          <span className="text-2xl p-2.5 rounded-xl bg-[#C7A76C]/15 text-[#8B6B2F]">
            🎓
          </span>
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#17263C]">সমাবর্তন ও পুনর্মিলনী</p>
            <p className="text-[11px] text-[#64748B]">
              গ্র্যাজুয়েশন উৎসব ও ২২,৪০০+ অ্যালামনাইদের মিলনমেলা
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#17263C]/30 transition-colors">
          <span className="text-2xl p-2.5 rounded-xl bg-[#17263C]/10 text-[#17263C]">
            🤝
          </span>
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#17263C]">অনলাইনে অফলাইন ফিল</p>
            <p className="text-[11px] text-[#64748B]">
              স্ক্রোল করলেই আসল ক্যাম্পাসের প্রতিটি প্রান্তের বাস্তব অনুভূতি
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
