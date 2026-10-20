import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import usePageMeta from "../../services/usePageMeta";
import CampusVideoExperience from "../../components/CampusVideoExperience";
import {
  wa,
  vcPortrait,
  La,
  Ra,
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

var Yo = [Ka, Wa, Xa, qa, Ja, Qa, Ua, Za, Ya, Ga],
  Xo = [
    {
      icon: `👥`,
      v: `4,500+`,
      l: `Students`,
    },
    {
      icon: `👨‍🏫`,
      v: `213`,
      l: `Teachers`,
    },
    {
      icon: `🏛️`,
      v: `5`,
      l: `Faculties`,
    },
    {
      icon: `📚`,
      v: `21`,
      l: `Departments`,
    },
    {
      icon: `🔬`,
      v: `1`,
      l: `Institute`,
    },
    {
      icon: `📰`,
      v: `3`,
      l: `Journals`,
    },
  ],
  Zo = [
    {
      v: `22,400+`,
      l: `Alumni Worldwide`,
    },
    {
      v: `45`,
      l: `Countries`,
    },
    {
      v: `320+`,
      l: `Active Mentors`,
    },
    {
      v: `600+`,
      l: `Hiring Partners`,
    },
    {
      v: `2008`,
      l: `Est.`,
    },
  ],
  Qo = [
    {
      key: `eng`,
      name: `Faculty of Engineering & Technology`,
      color: `#1B4F8A`,
      depts: [
        {
          name: `Computer Science and Engineering`,
          code: `CSE`,
          icon: `💻`,
        },
        {
          name: `Electrical and Electronic Engineering`,
          code: `EEE`,
          icon: `⚡`,
        },
        {
          name: `Electrical, Electronic & Communication Engg.`,
          code: `EECE`,
          icon: `📡`,
        },
        {
          name: `Information and Communication Engineering`,
          code: `ICE`,
          icon: `🌐`,
        },
        {
          name: `Civil Engineering`,
          code: `CE`,
          icon: `🏗️`,
        },
        {
          name: `Architecture`,
          code: `ARCH`,
          icon: `🏛️`,
        },
        {
          name: `Urban and Regional Planning`,
          code: `URP`,
          icon: `🗺️`,
        },
      ],
    },
    {
      key: `sci`,
      name: `Faculty of Science`,
      color: `#006B3F`,
      depts: [
        {
          name: `Mathematics`,
          code: `MATH`,
          icon: `📐`,
        },
        {
          name: `Physics`,
          code: `PHY`,
          icon: `⚛️`,
        },
        {
          name: `Pharmacy`,
          code: `PHARM`,
          icon: `💊`,
        },
        {
          name: `Chemistry`,
          code: `CHEM`,
          icon: `🧪`,
        },
        {
          name: `Statistics and Data Science`,
          code: `SDS`,
          icon: `📊`,
        },
      ],
    },
    {
      key: `bus`,
      name: `Faculty of Business Studies`,
      color: `#D97706`,
      depts: [
        {
          name: `Business Administration`,
          code: `BBA`,
          icon: `📋`,
        },
        {
          name: `Tourism and Hospitality Management`,
          code: `THM`,
          icon: `🏨`,
        },
      ],
    },
    {
      key: `hum`,
      name: `Faculty of Humanities & Social Science`,
      color: `#7C3AED`,
      depts: [
        {
          name: `Economics`,
          code: `ECON`,
          icon: `💹`,
        },
        {
          name: `Bangla`,
          code: `BAN`,
          icon: `অ`,
        },
        {
          name: `Social Work`,
          code: `SW`,
          icon: `🤝`,
        },
        {
          name: `English`,
          code: `ENG`,
          icon: `📝`,
        },
        {
          name: `Public Administration`,
          code: `PA`,
          icon: `🏢`,
        },
        {
          name: `History`,
          code: `HIST`,
          icon: `📜`,
        },
      ],
    },
    {
      key: `life`,
      name: `Faculty of Life & Earth Science`,
      color: `#059669`,
      depts: [
        {
          name: `Geography and Environment`,
          code: `GEO`,
          icon: `🌿`,
        },
      ],
    },
  ],
  $o = [
    {
      year: `2008`,
      title: `University Founded`,
      desc: `Pabna University of Science & Technology established by the Government of Bangladesh.`,
    },
    {
      year: `2012`,
      title: `First Convocation`,
      desc: `First batch of PUST graduates — 420 students across 4 departments.`,
    },
    {
      year: `2015`,
      title: `Alumni Association Formed`,
      desc: `PUST Alumni Association officially registered and launched.`,
    },
    {
      year: `2019`,
      title: `International Chapters`,
      desc: `Alumni chapters established in the UK, Canada, USA, and Australia.`,
    },
    {
      year: `2022`,
      title: `Digital Platform Launch`,
      desc: `PUST Alumni Network portal launched — connecting graduates online for the first time.`,
    },
    {
      year: `2026`,
      title: `22,400+ Members`,
      desc: `Network grows to 22,400+ alumni across 45 countries, with 600+ employer partners.`,
    },
  ],
  es = [
    {
      icon: `🎓`,
      title: `Academic Excellence`,
      desc: `Upholding the intellectual legacy of PUST through research, mentorship, and lifelong learning.`,
    },
    {
      icon: `🤝`,
      title: `Community & Belonging`,
      desc: `Creating a global family where every PUST stakeholder — alumni, student, faculty, employer — belongs.`,
    },
    {
      icon: `🌱`,
      title: `Give Back`,
      desc: `Inspiring alumni to invest in the next generation through scholarships, mentorship, and donations.`,
    },
    {
      icon: `🌐`,
      title: `Global Impact`,
      desc: `Amplifying Bangladesh's voice in science, technology, and innovation through our global alumni network.`,
    },
  ];
export default function About() {
  usePageMeta(
    "About Us · PUST Alumni Network",
    "Learn about the history, faculties, leadership, and mission of Pabna University of Science and Technology Alumni Association."
  );
  let [e, t] = useState(`eng`),
    n = Qo.find((t) => t.key === e);

  // Background Video State (User's YouTube Video: 78gF7vJwVkA)
  const [isMuted, setIsMuted] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const toggleMute = () => {
    const iframe = document.getElementById("youtube-about-bg-iframe");
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
    const localVideo = document.getElementById("fallback-about-video");
    if (localVideo) {
      localVideo.muted = nextMuted;
    }
  };

  const handleFullscreenCinema = () => {
    const iframe = document.getElementById("youtube-about-bg-iframe");
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
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C]">
      {/* =========================================================================
          1. STABLE FULL-PAGE CAMPUS REAL VIEW VIDEO HERO (YouTube: 78gF7vJwVkA)
         ========================================================================= */}
      <section
        id="campus-real-view"
        data-no-reveal="true"
        aria-label="PUST Campus Real View Video"
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
            id="fallback-about-video"
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

          {/* User's YouTube Video Embed (78gF7vJwVkA) */}
          <iframe
            id="youtube-about-bg-iframe"
            src="https://www.youtube.com/embed/78gF7vJwVkA?autoplay=1&mute=1&controls=0&loop=1&playlist=78gF7vJwVkA&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1"
            title="এক নজরে পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় | PUST | campuslive"
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

        {/* Floating Bottom Button to Smoothly Scroll to University Overview */}
        <div className="relative z-20 pb-5 sm:pb-7 text-center pointer-events-none flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("about-board");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/80 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-[#C7A76C]/40 backdrop-blur-md shadow-xl transition-colors cursor-pointer active:scale-95 ring-1 ring-white/10"
          >
            <span className="text-[#DFCA9E]">🏛️</span>
            <span>Explore University History & Vision</span>
            <span className="text-sm text-[#DFCA9E]">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. INSTITUTIONAL METRICS RIBBON
         ========================================================================= */}
      <div id="about-board" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {Zo.map((item, idx) => (
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
          3. INSTITUTIONAL ABOUT HEADER
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] shadow-2xs py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="border border-[#7A1737]/20 p-2.5 mb-3.5 inline-block rounded-2xl bg-white shadow-xs">
            <img src={wa} alt="PUST" className="w-12 h-12 object-contain" />
          </div>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] mb-2 text-[#7A1737]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> · Est. 2008 · Pabna, Bangladesh
          </p>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#17263C] mb-3 tracking-tight">
            Pabna University of Science & Technology
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#64748B] leading-relaxed">
            A premier public research university in Pabna, Bangladesh — fostering academic brilliance across 5 faculties, 21 departments, and a vibrant global network of 22,400+ alumni.
          </p>
        </div>
      </section>

      {/* University at a Glance */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] shadow-2xs reveal-section">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-widest mb-6 text-[#7A1737] reveal-up">
            Institutional Overview & Academic Scale
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-6 sm:gap-y-0 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0]">
            {Xo.map((item, idx) => (
              <div key={idx} className={`text-center py-2 px-3 reveal-scale delay-${(idx + 1) * 75}`}>
                <div className="text-2xl mb-1.5">{item.icon}</div>
                <p className="font-serif font-bold text-[#17263C] text-xl sm:text-2xl leading-none">
                  {item.v}
                </p>
                <p className="text-[11px] uppercase tracking-wider mt-1 text-[#64748B] font-semibold">
                  {item.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Welcome Message from the Vice-Chancellor */}
      <section id="vc-message" className="py-16 sm:py-20 bg-white border-b border-[#E2E8F0] scroll-mt-16 reveal-section">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E2E8F0] shadow-sm relative overflow-hidden">
            {/* Top Accent Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-slate-200">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7A1737]/10 text-[#7A1737] text-xs font-bold font-bengali">
                <span>🏛️ পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span>
                <span className="text-slate-400">•</span>
                <span className="font-mono text-[11px]">Rajapur, Pabna-6600</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 font-display">
                Office of the Vice-Chancellor
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Official Message Text */}
              <div className="lg:col-span-8 space-y-4 text-slate-700 leading-relaxed text-sm sm:text-[14.5px] reveal-left">
                <h2 className="font-serif font-extrabold text-[#17263C] text-2xl sm:text-3xl lg:text-[32px] tracking-tight leading-snug">
                  Welcome Message from the Vice-Chancellor
                </h2>
                
                <p className="font-semibold text-[#7A1737] text-sm sm:text-base leading-snug">
                  Welcome to the website of Pabna University of Science and Technology (PUST), one of the most promising universities in Bangladesh committed to teaching, research, and academic excellence!
                </p>

                <p className="text-slate-600">
                  Founded in 2008, PUST started its journey with around 140 students enrolled in 4 departments including departments of Computer Science and Engineering (CSE), Electrical and Electronic Engineering (EEE), Mathematics (Math), and Business Administration (BA). This thriving university is spread over 30 acres of land beside the Dhaka-Pabna highway and is located about 3 kilometers east of Pabna town. Within this short span of time, PUST has been able to achieve substantial progress, while it currently accommodates 5 faculties, 21 departments, 172 teaching staff, and nearly 5000 students. We are already in a process of elevating this university to reach a global standard in terms of academics, research, and areal expansion.
                </p>

                <p className="text-slate-600">
                  Since its establishment, PUST has always had the mission of promoting research in the field of science and technology. Our academics and students have secured commendable recognition through high quality research publications in national and international journals. Recent webinars have attracted distinct scholars from around the world including noble laureates. We are determined to continue our progress in teaching quality, research output, and service to the community. In addition, PUST is unique in its campus design, educational curriculum, co-curricular, and extra-curricular activities. Students of PUST regularly participate in debate, sports, computer programming, engineering and architectural designs, competition for business ideas, and alike, and have won many awards at the national and international levels.
                </p>

                <p className="text-slate-600">
                  At the time when Bangladesh envisions to be a developed nation by 2041 and has made a commitment to obtain the Sustainable Development Goals (SDGs) by 2030, and in an age when we experience the emergence of the Fourth Industrial Revolution (4IR), I can affirm that all stakeholders of the PUST is highly committed to meeting all future challenges and is ready to effectively contribute to nation's all endeavors in achieving the international and national commitments.
                </p>

                <p className="text-slate-600">
                  As the Vice Chancellor of PUST, my enthusiasm is always to prepare the university to face all future challenges with wisdom, acquired experience, available resources, dedicated administrators, experienced faculty members, talented students, and employees.
                </p>

                <p className="text-slate-600">
                  I look forward to the continued progress of the PUST towards academic excellence and intellectual freedom. Our vision is to build PUST as one of the national leaders in creating a center of excellence in research, learning, and teaching. I strongly believe that all our efforts and dedication must make our journey towards acquiring knowledge, enlightenment, and liberation successful.
                </p>

                <div className="pt-4 border-t border-slate-200">
                  <p className="font-bold text-[#7A1737] italic font-serif text-sm">
                    Long Live the Pabna University of Science and Technology! Long Live Bangladesh!
                  </p>
                  <div className="mt-4">
                    <p className="font-bold text-[#17263C] text-base font-display">
                      Prof. Dr. Abul Hasnat Md. Shamim
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Vice Chancellor, Pabna University of Science and Technology
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Official Portrait of Vice-Chancellor */}
              <div className="lg:col-span-4 flex flex-col items-center text-center lg:sticky lg:top-24 reveal-right">
                <div className="w-full max-w-[260px] bg-white rounded-2xl p-2.5 shadow-lg border border-slate-200/90 ring-2 ring-[#C7A76C]/40">
                  <div className="aspect-[3/4] overflow-hidden rounded-xl bg-slate-100 relative">
                    <img
                      src={vcPortrait}
                      alt="Prof. Dr. Abul Hasnat Md. Shamim"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pt-3 pb-1">
                    <p className="font-extrabold text-[#17263C] text-sm font-display">
                      Prof. Dr. Abul Hasnat Md. Shamim
                    </p>
                    <p className="text-[11px] font-bold text-[#7A1737] uppercase tracking-wider mt-0.5">
                      Honorable Vice-Chancellor
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-bengali">
                      পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়
                    </p>
                  </div>
                </div>

                {/* Institutional Highlights Card */}
                <div className="w-full max-w-[260px] mt-4 p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-left space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📍</span>
                    <span>Dhaka-Pabna Highway, Pabna</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🏛️</span>
                    <span>30-Acre Campus · Est. 2008</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎓</span>
                    <span>5 Faculties · 21 Departments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Life at PUST & Campus Video Experience */}
      <div className="py-12 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#7A1737] font-semibold">
              Campus Vistas & Moments
            </p>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#17263C]">
              Life at PUST
            </h2>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {Yo.slice(0, 5).map((imgSrc, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-lg border border-[#E2E8F0] shadow-2xs group"
                style={{
                  aspectRatio: `1/1`,
                }}
              >
                <img
                  src={imgSrc}
                  alt="PUST"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {Yo.slice(5, 10).map((imgSrc, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-lg border border-[#E2E8F0] shadow-2xs group"
                style={{
                  aspectRatio: `1/1`,
                }}
              >
                <img
                  src={imgSrc}
                  alt="PUST"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          {/* Real Campus Walkthrough & Convocation Experience */}
          <div className="mt-12 pt-8 border-t border-[#E2E8F0]">
            <CampusVideoExperience
              title="ভার্চুয়াল ক্যাম্পাস ট্যুর ও সমাবর্তন উদযাপন"
              subtitle="ক্যাম্পাস জীবনের পদচারণা এবং সমাবর্তন পুনর্মিলনীর আসল ভিডিও ফুটেজ — ঘুরে আসুন পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়"
            />
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="py-16 bg-[#F4F5F7]">
        <div className="max-w-5xl mx-auto px-6 text-center mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A1737] mb-2 font-semibold">
            Institutional Purpose
          </p>
          <h2
            className="font-serif font-bold text-[#17263C]"
            style={{
              fontSize: `clamp(1.8rem, 4vw, 2.6rem)`,
            }}
          >
            Our Mission & Commitment
          </h2>
        </div>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xs reveal-section">
            <div
              className="sm:w-[420px] flex-shrink-0 overflow-hidden bg-[#17263C] reveal-left"
              style={{
                minHeight: 280,
              }}
            >
              <img
                src={Wa}
                alt="PUST lakeside walkway"
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                style={{
                  minHeight: 280,
                }}
              />
            </div>
            <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center reveal-right">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-2.5 text-[#7A1737]">
                PUST Alumni Association
              </p>
              <h3 className="font-serif font-bold text-[#17263C] text-2xl sm:text-3xl leading-snug mb-4">
                Sustaining Lifelong Bonds
              </h3>
              <p className="text-[#475569] text-sm leading-relaxed mb-3">
                The PUST Alumni Network exists to sustain, deepen, and extend
                the bonds formed on the university campus — creating lifelong
                connections between generations of students, graduates, and the
                institution itself.
              </p>
              <p className="text-[#475569] text-sm leading-relaxed mb-6">
                We believe every PUST graduate carries a piece of Pabna with
                them. Through this platform, we bring that community together to
                mentor, hire, inspire, and give back.
              </p>
              <Link
                to="/register"
                className="self-start font-semibold text-xs px-6 py-2.5 rounded-lg bg-[#7A1737] hover:bg-[#62122B] text-white shadow-xs transition-all active:scale-95"
              >
                Join the Network →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Faculties & Departments */}
      <div className="py-16 bg-white border-y border-[#E2E8F0] reveal-section">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10 reveal-up">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A1737] mb-2 font-semibold">
              Academic Structure
            </p>
            <h2
              className="font-serif font-bold text-[#17263C]"
              style={{
                fontSize: `clamp(1.8rem, 4vw, 2.6rem)`,
              }}
            >
              Faculties & Departments
            </h2>
            <p className="text-[#64748B] text-sm mt-1">
              5 faculties · 21 departments · 1 research institute
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
            <div className="sm:w-72 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-[#E2E8F0] bg-[#F8FAFC] reveal-left">
              {Qo.map((item) => (
                <button
                  key={item.key}
                  onClick={() => t(item.key)}
                  className={`w-full text-left px-5 py-4 text-xs sm:text-sm font-semibold transition-all border-b border-[#E2E8F0] last:border-0 flex items-center gap-3 cursor-pointer ${
                    e === item.key
                      ? `bg-white text-[#7A1737] border-l-4 border-l-[#7A1737] shadow-2xs`
                      : `text-[#475569] hover:bg-[#F1F5F9] border-l-4 border-l-transparent`
                  }`}
                >
                  <span className="leading-snug">{item.name}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 sm:p-8 bg-white reveal-right">
              <p className="font-bold text-sm mb-5 pb-3 border-b border-[#E2E8F0] text-[#17263C]">
                Departments under {n.name}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {n.depts.map((dept, dIdx) => (
                  <Link
                    key={dept.code}
                    to="/alumni"
                    className={`group flex flex-col items-center text-center p-4 rounded-xl border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-xs transition-all bg-[#F8FAFC] hover:bg-white reveal-up delay-${(dIdx + 1) * 75}`}
                  >
                    <span className="text-3xl mb-2.5">{dept.icon}</span>
                    <p className="font-bold text-xs text-[#17263C] leading-snug group-hover:text-[#7A1737] transition-colors">
                      {dept.name}
                    </p>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 mt-2.5 rounded-full bg-white border border-[#E2E8F0] text-[#7A1737]">
                      {dept.code}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Dept Code Tags */}
          <div className="mt-6 p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] reveal-up">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#64748B] mb-3">
              All 21 Departments at a Glance
            </p>
            <div className="flex flex-wrap gap-2">
              {Qo.flatMap((item) => item.depts).map((dept) => (
                <span
                  key={dept.code}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white border border-[#E2E8F0] text-[#475569] shadow-2xs hover:border-[#7A1737] transition-colors"
                >
                  {dept.icon} {dept.code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What We Stand For */}
      <div className="py-16 bg-[#F4F5F7] reveal-section">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10 reveal-up">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A1737] mb-2 font-semibold">
              Core Principles
            </p>
            <h2
              className="font-serif font-bold text-[#17263C]"
              style={{
                fontSize: `clamp(1.8rem, 4vw, 2.6rem)`,
              }}
            >
              What We Stand For
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {es.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 flex flex-col rounded-xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#7A1737]/40 hover:shadow-sm transition-all ${
                  idx % 2 === 0 ? "reveal-left" : "reveal-right"
                } delay-${(idx + 1) * 100}`}
              >
                <div className="text-3xl mb-3.5">{item.icon}</div>
                <h3 className="font-bold text-[#17263C] text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-[#475569] text-xs leading-relaxed flex-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PUST Through the Years (Timeline) */}
      <div className="py-16 bg-white border-t border-[#E2E8F0] reveal-section">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 reveal-up">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 text-[#7A1737] font-semibold">
              Our Journey
            </p>
            <h2
              className="font-serif font-bold text-[#17263C]"
              style={{
                fontSize: `clamp(1.8rem, 4vw, 2.6rem)`,
              }}
            >
              PUST Through the Years
            </h2>
          </div>
          <div className="space-y-6 max-w-3xl mx-auto">
            {$o.map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-6 items-start ${
                  idx % 2 === 0 ? "reveal-left" : "reveal-right"
                } delay-${(idx + 1) * 75}`}
              >
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="font-serif font-bold text-lg text-[#7A1737]">
                    {item.year}
                  </span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-3.5 h-3.5 rounded-full mt-1.5 flex-shrink-0 bg-[#7A1737] shadow-[0_0_0_4px_rgba(122,23,55,0.15)]" />
                  {idx < $o.length - 1 && (
                    <div
                      className="w-px flex-1 mt-1 bg-[#E2E8F0]"
                      style={{
                        minHeight: 36,
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <p className="font-bold text-[#17263C] text-sm sm:text-base">{item.title}</p>
                  <p className="text-xs sm:text-sm leading-relaxed mt-1 text-[#475569]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership & Administration */}
      <div className="py-16 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A1737] mb-2 font-semibold">
              Institutional Governance
            </p>
            <h2
              className="font-serif font-bold text-[#17263C]"
              style={{
                fontSize: `clamp(1.8rem, 4vw, 2.6rem)`,
              }}
            >
              Leadership & Administration
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: `Prof. Dr. Md. Nazrul Islam`,
                role: `Vice Chancellor (In-Charge)`,
                img: Ra,
              },
              {
                name: `PUST Alumni Association`,
                role: `Governing Body 2026–2027`,
                img: La,
              },
              {
                name: `Faculty Development Cell`,
                role: `Training & Research Wing`,
                img: Xa,
              },
              {
                name: `Career Services Centre`,
                role: `Jobs, Internships & Mentoring`,
                img: Ja,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group overflow-hidden rounded-xl border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-sm transition-all bg-white"
              >
                <div
                  className="overflow-hidden bg-[#17263C]"
                  style={{
                    height: 154,
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                </div>
                <div className="p-4 border-t border-[#E2E8F0]">
                  <p className="font-bold text-[#17263C] text-sm leading-snug group-hover:text-[#7A1737] transition-colors">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-1 font-medium">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Institutional CTA Section */}
      <div
        className="relative overflow-hidden border-t border-[#0F1A2A]"
        style={{
          background: `#17263C`,
          minHeight: 240,
        }}
      >
        <img
          src={Qa}
          alt="PUST Hall"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-15"
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
              Join the Network
            </p>
            <h2 className="font-serif font-bold text-white text-2xl sm:text-3xl mb-2">
              Be Part of the PUST Story
            </h2>
            <p className="text-sm max-w-md text-[#CBD5E1] leading-relaxed">
              Whether you are an alumnus, student, faculty member, or employer partner —
              there is a place for you in the PUST Alumni Network.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3.5 flex-shrink-0">
            <Link
              to="/register"
              className="text-sm font-semibold text-white px-7 py-3 text-center bg-[#7A1737] hover:bg-[#62122B] shadow-sm rounded-lg transition-all active:scale-95"
            >
              Join Free →
            </Link>
            <Link
              to="/alumni"
              className="text-sm font-medium text-white px-7 py-3 text-center border border-white/25 hover:bg-white/10 rounded-lg transition-colors"
            >
              Browse Alumni
            </Link>
          </div>
        </div>
      </div>

      {/* Full-Screen Theater Mode Cinema Overlay Modal */}
      {isTheaterMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Theater Mode Campus Video Player"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-6"
          onClick={() => setIsTheaterMode(false)}
        >
          <div className="flex items-center justify-between pb-3 sm:pb-4 text-white max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  এক নজরে পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় · PUST
                </h3>
                <p className="text-xs text-slate-400">
                  Real Campus Overview & Campuslive Documentary · Press ESC to exit
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
              src="https://www.youtube.com/embed/78gF7vJwVkA?autoplay=1&mute=0&controls=1&rel=0"
              title="এক নজরে পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় | PUST | campuslive"
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
