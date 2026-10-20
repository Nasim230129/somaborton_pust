import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { wa, Ia, La, Ha, Wa, Ka, Ja, Xa, Za, Qa } from "../../data/mockData";
import { api } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";

var ms = [
    {
      v: `general`,
      l: `General Inquiry`,
    },
    {
      v: `membership`,
      l: `Membership & Profile`,
    },
    {
      v: `events`,
      l: `Events & Reunions`,
    },
    {
      v: `sponsorship`,
      l: `Sponsorship & Partnership`,
    },
    {
      v: `technical`,
      l: `Technical Support`,
    },
    {
      v: `other`,
      l: `Other`,
    },
  ],
  hs = [
    {
      icon: `🏛️`,
      color: `#0284c7`,
      title: `Alumni Affairs Office`,
      addr: `PUST Administrative Building, 2nd Floor
Rajapur, Pabna-6600, Bangladesh`,
      phone: `+880-731-65350`,
      email: `alumni@pust.ac.bd`,
      hours: `Sun–Thu: 9:00 AM – 5:00 PM`,
      img: Xa,
    },
    {
      icon: `🎓`,
      color: `#1B4F8A`,
      title: `Registrar Office`,
      addr: `PUST Main Academic Building
Rajapur, Pabna-6600, Bangladesh`,
      phone: `+880-731-65200`,
      email: `registrar@pust.ac.bd`,
      hours: `Sun–Thu: 9:00 AM – 4:00 PM`,
      img: Ja,
    },
    {
      icon: `📞`,
      color: `#7C3AED`,
      title: `Student Affairs`,
      addr: `PUST Student Center, Ground Floor
Rajapur, Pabna-6600, Bangladesh`,
      phone: `+880-731-65220`,
      email: `studentaffairs@pust.ac.bd`,
      hours: `Sun–Thu: 8:30 AM – 4:30 PM`,
      img: Wa,
    },
  ],
  gs = [
    {
      q: `How do I verify my alumni status?`,
      a: `Submit your student ID or transcript through the Alumni Verification portal. Our team reviews requests within 3–5 business days.`,
    },
    {
      q: `Can international alumni join the network?`,
      a: `Absolutely! PUST has alumni chapters in 45 countries. Sign up online — membership is free for all PUST graduates worldwide.`,
    },
    {
      q: `How do I update my profile or department information?`,
      a: `Log in to your dashboard and navigate to Profile Settings. You can update all personal and professional information anytime.`,
    },
    {
      q: `How can my company hire PUST graduates?`,
      a: `Register as an Employer partner through the Jobs portal or email us at employer@pust.ac.bd. We will connect you with our placement cell.`,
    },
    {
      q: `How do I organize a chapter reunion?`,
      a: `Contact the Alumni Affairs Office with your batch and department details. We provide venue assistance, logistics support, and promotion.`,
    },
  ],
  _s = [
    {
      icon: `in`,
      label: `LinkedIn`,
      url: `#`,
      color: `#0A66C2`,
    },
    {
      icon: `fb`,
      label: `Facebook`,
      url: `#`,
      color: `#1877F2`,
    },
    {
      icon: `𝕏`,
      label: `X / Twitter`,
      url: `#`,
      color: `#000`,
    },
    {
      icon: `yt`,
      label: `YouTube`,
      url: `#`,
      color: `#FF0000`,
    },
  ];
export default function Contact() {
  usePageMeta(
    "Contact Alumni Office",
    "Reach out to the Pabna University of Science and Technology (PUST) Alumni Affairs team, submit inquiries, or find office hours."
  );
  let [e, t] = useState({
      name: ``,
      email: ``,
      dept: ``,
      type: ``,
      message: ``,
    }),
    [n, r] = useState(false),
    [submitting, setSubmitting] = useState(false),
    [i, a] = useState(null);

  // Background Video & Theater Mode State (Direct Campus Short Video)
  const [isMuted, setIsMuted] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const videoRef = useRef(null);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleFullscreenCinema = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen().catch(() => setIsTheaterMode(true));
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
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
          1. STABLE FULL-PAGE CAMPUS REAL VIEW VIDEO HERO (Pure Video, No Black Background)
         ========================================================================= */}
      <section
        id="campus-real-view"
        data-no-reveal="true"
        aria-label="PUST Campus Tour & Contact Real View Video"
        className="relative w-full overflow-hidden flex flex-col justify-between select-none"
        style={{
          height: "calc(100vh - 116px)",
          minHeight: "520px",
          maxHeight: "860px",
        }}
      >
        {/* Ambient Auto-Player (Edge-to-Edge Pure Video, No Black Background) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster="/assets/1778991184DSC05122-DR5DHwQE.jpeg"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-full h-full object-cover"
            style={{ filter: "brightness(0.96) contrast(1.05)" }}
          >
            <source src="/assets/videos/pust_contact_short.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Minimal Floating Top Controls (Clean English, No Obstructive Overlays) */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 w-full flex items-center justify-between pointer-events-none">
          <a
            href="https://youtube.com/shorts/2DwK3_9Bg3w"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-red-600/85 hover:bg-red-600 border border-white/20 backdrop-blur-md transition-colors shadow-md active:scale-95"
            title="View original Short on YouTube"
          >
            <span>🎬 YouTube Short</span>
            <span className="text-[10px]">↗</span>
          </a>

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

        {/* Floating Bottom Button to Smoothly Scroll to Contact Helpdesk */}
        <div className="relative z-20 pb-5 sm:pb-7 text-center pointer-events-none flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("contact-helpdesk");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/80 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-[#C7A76C]/40 backdrop-blur-md shadow-xl transition-colors cursor-pointer active:scale-95 ring-1 ring-white/10"
          >
            <span className="text-[#DFCA9E]">💬</span>
            <span>Get in Touch with Helpdesk</span>
            <span className="text-sm text-[#DFCA9E]">↓</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. INSTITUTIONAL CONTACT RIBBON
         ========================================================================= */}
      <div id="contact-helpdesk" className="bg-[#17263C] text-white border-b border-[#0F1A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { icon: "📧", value: "alumni@pust.ac.bd", label: "Official Helpdesk Email" },
              { icon: "📞", value: "+880-731-65350", label: "Direct Telephone Line" },
              { icon: "📍", value: "Rajapur, Pabna-6600", label: "Campus Administrative HQ" },
              { icon: "⚡", value: "< 24 Hours", label: "Inquiry Response Time" },
            ].map((stat, idx) => (
              <div key={idx} className="pt-2 sm:pt-0 sm:px-4 text-center">
                <div className="text-xl mb-1">{stat.icon}</div>
                <p className="font-display font-bold text-sm sm:text-base text-[#DFCA9E] leading-snug">
                  {stat.value}
                </p>
                <p className="text-[11px] sm:text-xs mt-1 uppercase tracking-wider text-slate-300 font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. INSTITUTIONAL CONTACT HEADER
         ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] shadow-2xs py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="border border-[#7A1737]/20 p-2.5 mb-3.5 inline-block rounded-2xl bg-white shadow-xs">
            <img src={wa} alt="PUST" className="w-12 h-12 object-contain" />
          </div>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] mb-2 text-[#7A1737]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> · Alumni Affairs Office · Helpdesk
          </p>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#17263C] mb-3 tracking-tight">
            Contact & Institutional Helpdesk
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Reach out to the PUST Alumni Network coordination team — we respond to every
            inquiry within 24 hours on university working days.
          </p>
        </div>
      </section>

      {/* Main Form & Sidebar */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Inquiry Form */}
          <div className="lg:col-span-3 reveal-left">
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              <div className="relative overflow-hidden h-28 bg-[#17263C]">
                <img
                  src={Ia}
                  alt="PUST"
                  className="w-full h-full object-cover opacity-20"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(23,38,60,0.5) 0%, #17263C 100%)`,
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-center px-6">
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-[#C7A76C]">
                    PUST Alumni Network
                  </p>
                  <h2 className="font-serif font-bold text-white text-xl">
                    Submit an Official Inquiry
                  </h2>
                </div>
              </div>

              {n ? (
                <div className="p-10 text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]">
                    ✓
                  </div>
                  <h3 className="font-serif font-bold text-[#17263C] text-xl mb-2">
                    Inquiry Received!
                  </h3>
                  <p className="text-[#475569] text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#17263C]">{e.name}</strong>. Your message has been routed to the Alumni Affairs Office. We will reply to <strong className="text-[#17263C]">{e.email}</strong> within 1 business day.
                  </p>
                  <button
                    onClick={() => {
                      r(false);
                      t({
                        name: ``,
                        email: ``,
                        dept: ``,
                        type: ``,
                        message: ``,
                      });
                    }}
                    className="text-xs font-bold px-6 py-2.5 rounded-lg bg-[#7A1737] hover:bg-[#62122B] text-white shadow-xs transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (ev) => {
                    ev.preventDefault();
                    if (e.name && e.email && e.message) {
                      setSubmitting(true);
                      try {
                        await api.submitContact({
                          name: e.name,
                          email: e.email,
                          dept: e.dept,
                          topic: e.type,
                          message: e.message,
                        });
                        r(true);
                      } finally {
                        setSubmitting(false);
                      }
                    }
                  }}
                  className="p-6 sm:p-8 space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={e.name}
                        onChange={(ev) =>
                          t({
                            ...e,
                            name: ev.target.value,
                          })
                        }
                        placeholder="e.g. Mahfuzur Rahman"
                        required
                        className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={e.email}
                        onChange={(ev) =>
                          t({
                            ...e,
                            email: ev.target.value,
                          })
                        }
                        placeholder="yourname@gmail.com"
                        required
                        className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-dept"
                        className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5"
                      >
                        Department / Batch
                      </label>
                      <input
                        id="contact-dept"
                        type="text"
                        value={e.dept}
                        onChange={(ev) =>
                          t({
                            ...e,
                            dept: ev.target.value,
                          })
                        }
                        placeholder="e.g. CSE '20"
                        className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-type"
                        className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5"
                      >
                        Inquiry Category
                      </label>
                      <select
                        id="contact-type"
                        value={e.type}
                        onChange={(ev) =>
                          t({
                            ...e,
                            type: ev.target.value,
                          })
                        }
                        className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] focus:bg-white focus:border-[#7A1737] transition-all cursor-pointer"
                      >
                        <option value="" className="text-[#94A3B8]">Select category</option>
                        {ms.map((item) => (
                          <option key={item.v} value={item.v}>
                            {item.l}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5"
                    >
                      Inquiry Details *
                    </label>
                    <textarea
                      id="contact-message"
                      value={e.message}
                      onChange={(ev) =>
                        t({
                          ...e,
                          message: ev.target.value,
                        })
                      }
                      placeholder="Write your message here… Provide relevant batch, student ID, or program details so we can assist promptly."
                      rows={5}
                      required
                      className="w-full border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none rounded-lg bg-[#F8FAFC] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-3 font-semibold text-white text-sm rounded-lg bg-[#7A1737] hover:bg-[#62122B] transition-all shadow-xs cursor-pointer ${
                      submitting ? "opacity-75 cursor-wait" : ""
                    }`}
                  >
                    {submitting ? "Transmitting to Helpdesk…" : "Submit Inquiry →"}
                  </button>
                  <p className="text-[11px] text-[#94A3B8] text-center">
                    Confidential · Messages are processed under PUST Institutional Privacy Regulations.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5 reveal-right">
            {/* Campus Map Preview */}
            <div
              className="relative overflow-hidden rounded-xl border border-[#0F1A2A] shadow-xs"
              style={{
                height: 160,
              }}
            >
              <img src={Xa} alt="PUST" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#17263C]/80 text-center p-4">
                <div className="text-3xl mb-1">📍</div>
                <p className="text-white font-bold text-sm">
                  Pabna University of Science & Technology
                </p>
                <p className="text-[#CBD5E1] text-xs">
                  Rajapur, Pabna-6600, Bangladesh
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-[11px] font-bold px-3 py-1 text-white border border-white/20 hover:bg-white/10 rounded-md transition-colors"
                >
                  View on Google Maps ↗
                </a>
              </div>
            </div>

            {/* Follow Us */}
            <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#7A1737] mb-3">
                Official Channels
              </p>
              <div className="grid grid-cols-2 gap-2">
                {_s.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold border border-[#E2E8F0] rounded-lg transition-colors hover:border-[#7A1737]/40 hover:bg-[#F8FAFC] text-[#475569] hover:text-[#17263C]"
                  >
                    <span className="font-bold text-sm w-4 text-center">
                      {item.icon}
                    </span>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#7A1737] mb-3">
                Helpdesk Hours
              </p>
              {[
                {
                  d: `Sunday – Thursday`,
                  t: `9:00 AM – 5:00 PM BST`,
                },
                {
                  d: `Friday`,
                  t: `Closed (Weekend)`,
                },
                {
                  d: `Saturday`,
                  t: `Closed (Weekend)`,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2.5 border-b border-[#F1F5F9] last:border-b-0"
                >
                  <span className="text-xs font-medium text-[#475569]">{item.d}</span>
                  <span
                    className={`text-xs font-bold ${
                      item.t.includes(`Closed`) ? `text-[#DC2626]` : `text-[#15803D]`
                    }`}
                  >
                    {item.t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* On-Campus Office Locations */}
      <div className="py-14 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#7A1737] font-semibold">
              On-Campus Liaison
            </p>
            <h2
              className="font-serif font-bold text-[#17263C]"
              style={{
                fontSize: `clamp(1.8rem, 4vw, 2.6rem)`,
              }}
            >
              Office Locations & Contacts
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {hs.map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-sm transition-all bg-[#F8FAFC]"
              >
                <div className="relative overflow-hidden h-28 bg-[#17263C]">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, rgba(23,38,60,0.3) 0%, #17263C 100%)`,
                    }}
                  />
                  <div className="absolute bottom-3 left-3 text-2xl">
                    {item.icon}
                  </div>
                </div>
                <div className="p-5 bg-white border-t border-[#E2E8F0]">
                  <h3 className="font-bold text-[#17263C] text-base mb-2">
                    {item.title}
                  </h3>
                  <p
                    className="text-xs text-[#475569] leading-relaxed mb-3 whitespace-pre-line"
                  >
                    {item.addr}
                  </p>
                  <a
                    href={`mailto:${item.email}`}
                    className="text-xs font-semibold text-[#7A1737] hover:underline block"
                  >
                    {item.email}
                  </a>
                  <p className="text-xs text-[#64748B] mt-1 font-medium">{item.phone}</p>
                  <p className="text-[11px] text-[#64748B] mt-3 border-t border-[#F1F5F9] pt-2 flex items-center gap-1">
                    <span>🕒</span>
                    <span>{item.hours}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="py-14 bg-[#F4F5F7]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#7A1737] font-semibold">
              Help & Support
            </p>
            <h2
              className="font-serif font-bold text-[#17263C]"
              style={{
                fontSize: `clamp(1.8rem, 4vw, 2.6rem)`,
              }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-[#64748B] text-sm mt-1">
              Quick answers to the most common queries from alumni and graduates
            </p>
          </div>
          <div className="space-y-3">
            {gs.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-white shadow-2xs"
              >
                <button
                  onClick={() => a(i === idx ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-semibold text-sm text-[#17263C]">
                    {item.q}
                  </span>
                  <span
                    className="text-xl font-light text-[#7A1737] flex-shrink-0"
                    style={{
                      transform: i === idx ? `rotate(45deg)` : `none`,
                      transition: `transform 0.2s`,
                    }}
                  >
                    +
                  </span>
                </button>
                {i === idx && (
                  <div className="px-5 pb-4 border-t border-[#F1F5F9] pt-3 bg-[#F8FAFC]">
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">{item.a}</p>
                  </div>
                )}
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
          minHeight: 220,
        }}
      >
        <img
          src={Qa}
          alt="PUST"
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
              Not sure where to start?
            </h2>
            <p className="text-sm max-w-md text-[#CBD5E1] leading-relaxed">
              Join the PUST Alumni community and connect with thousands of
              graduates, mentors, and employers worldwide.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3.5 flex-shrink-0">
            <Link
              to="/register"
              className="text-sm font-semibold text-white px-7 py-3 text-center rounded-lg bg-[#7A1737] hover:bg-[#62122B] transition-all shadow-sm active:scale-95"
            >
              Join Free →
            </Link>
            <Link
              to="/community"
              className="text-sm font-medium text-white px-7 py-3 text-center rounded-lg border border-white/25 hover:bg-white/10 transition-colors"
            >
              Explore Community
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
                  Pabna University of Science and Technology · Campus Tour Short
                </h3>
                <p className="text-xs text-slate-400">
                  Campus Walkthrough & Tour Reel · Press ESC to exit
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://youtube.com/shorts/2DwK3_9Bg3w"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-3.5 py-1.5 rounded-full bg-red-600/90 hover:bg-red-600 text-xs font-semibold text-white transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>🎬 Open Short</span>
                <span className="text-[10px]">↗</span>
              </a>
              <button
                type="button"
                onClick={() => setIsTheaterMode(false)}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                ✕ Exit Fullscreen
              </button>
            </div>
          </div>
          <div
            className="flex-1 w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl relative flex items-center justify-center bg-black/40 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src="/assets/videos/pust_contact_short.mp4"
              controls
              autoPlay
              playsInline
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
