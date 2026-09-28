import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  _a,
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

var $a = [
    {
      img: Ka,
      tag: `PUST Alumni Network`,
      heading: `Connecting 22,400+ Alumni Across 45 Countries`,
      sub: `Pabna University of Science & Technology · Est. 2008`,
    },
    {
      img: Ha,
      tag: `Orientation 2025–26`,
      heading: `Freshers' Reception & Orientation Program`,
      sub: `Welcoming the new generation at PUST`,
    },
    {
      img: La,
      tag: `Recognition`,
      heading: `Award Giving Ceremony — Academic Excellence`,
      sub: `Celebrating outstanding students and alumni`,
    },
    {
      img: Va,
      tag: `National Contest 2026`,
      heading: `জাতীয় হাই স্কুল প্রোগ্রামিং প্রতিযোগিতা ২০২৬`,
      sub: `National High School Programming Contest — PUST`,
    },
    {
      img: Xa,
      tag: `PUST Auditorium`,
      heading: `Grand Auditorium — Heart of Campus Life`,
      sub: `Venue for convocations, seminars, and cultural events`,
    },
    {
      img: Wa,
      tag: `Campus Life`,
      heading: `A Campus Where Nature & Knowledge Meet`,
      sub: `The tranquil lakeside walkway of PUST`,
    },
    {
      img: za,
      tag: `Faculty Development`,
      heading: `Training on Office Management & Professionalism`,
      sub: `Convention Hall, PUST · May 17, 2026`,
    },
  ],
  eo = [
    {
      img: qa,
      label: `Alumni`,
      title: `Alumni Network`,
      desc: `Join 22,400+ PUST graduates across 45 countries. Access the alumni directory, reconnect with batchmates, and build lifelong professional relationships.`,
      link: `/alumni`,
      linkText: `Explore Alumni Directory`,
      color: `#1B4F8A`,
    },
    {
      img: Ha,
      label: `Students`,
      title: `Students`,
      desc: `Welcome, PUST students! Don't miss out on mentorship programs, career resources, and events developed just for you.`,
      link: `/mentorship`,
      linkText: `Find student programs`,
      color: `#006B3F`,
    },
    {
      img: za,
      label: `Faculty`,
      title: `Faculty & Research`,
      desc: `Access faculty development resources, research collaboration tools, and connect with peers across departments and institutions.`,
      link: `/stories`,
      linkText: `Faculty resources`,
      color: `#7C3AED`,
    },
    {
      img: Va,
      label: `Employers`,
      title: `Community & Employers`,
      desc: `Partner with PUST to hire top talent, sponsor events, and engage with a vibrant community of students, alumni, and researchers.`,
      link: `/jobs`,
      linkText: `Partner with us`,
      color: `#D97706`,
    },
  ],
  to = [Ka, Wa, Xa, qa, Ja, Ia, Ha, La, Va, za, Ra, Ba, Ua, Qa, Za, Ya, Ga];
export default function Home() {
  let [e, t] = useState(0),
    [n, r] = useState(false),
    [i, a] = useState(``),
    [o, s] = useState(false),
    c = useCallback(
      (e) => {
        n || (r(true), t(e), setTimeout(() => r(false), 700));
      },
      [n],
    ),
    l = useCallback(() => c((e + 1) % $a.length), [e, c]),
    u = useCallback(() => c((e - 1 + $a.length) % $a.length), [e, c]);
  return (
    useEffect(() => {
      let e = setInterval(l, 3e3);
      return () => clearInterval(e);
    }, [l]),
    (
      <div
        style={{
          background: `#f2f2f2`,
        }}
        className="min-h-screen"
      >
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: `calc(100vh - 86px)`,
            minHeight: 460,
          }}
        >
          <div
            className="flex h-full"
            style={{
              width: `${$a.length * 100}%`,
              transform: `translateX(-${(e * 100) / $a.length}%)`,
              transition: `transform 0.75s cubic-bezier(0.77,0,0.175,1)`,
            }}
          >
            {$a.map((e, t) => (
              <div
                key={t}
                className="relative flex-shrink-0 h-full"
                style={{
                  width: `${100 / $a.length}%`,
                }}
              >
                <img
                  src={e.img}
                  alt={e.heading}
                  className="w-full h-full object-cover object-center"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.75) 100%)`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pb-14">
            <p
              key={`t${e}`}
              className="text-[10px] font-bold uppercase tracking-[0.22em] mb-3 px-3 py-1 text-white/85"
              style={{
                border: `1px solid rgba(255,255,255,0.4)`,
                animation: `suFadeUp 0.55s ease both`,
              }}
            >
              {$a[e].tag}
            </p>
            <h1
              key={`h${e}`}
              className="font-display font-bold text-white leading-tight max-w-3xl"
              style={{
                fontSize: `clamp(1.8rem, 4.5vw, 3.5rem)`,
                animation: `suFadeUp 0.55s 0.08s ease both`,
                textShadow: `0 2px 24px rgba(0,0,0,0.3)`,
              }}
            >
              {$a[e].heading}
            </h1>
            <p
              key={`s${e}`}
              className="text-white/68 mt-4 max-w-lg"
              style={{
                fontSize: `clamp(0.85rem, 1.5vw, 1rem)`,
                animation: `suFadeUp 0.55s 0.16s ease both`,
              }}
            >
              {$a[e].sub}
            </p>
            <div
              className="flex gap-3 mt-7"
              style={{
                animation: `suFadeUp 0.55s 0.24s ease both`,
              }}
            >
              <Link
                to="/alumni"
                className="font-bold text-white px-7 py-3 text-sm hover:opacity-90 transition-opacity"
                style={{
                  background: `#006B3F`,
                }}
              >
                Explore Alumni
              </Link>
              <Link
                to="/register"
                className="font-semibold text-white px-7 py-3 text-sm border border-white/50 hover:bg-white/10 transition-colors"
              >
                Join Free
              </Link>
            </div>
          </div>
          <button
            onClick={u}
            aria-label="Prev"
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-xl text-white border border-white/40 hover:bg-white/20 transition-colors"
          >
            ‹
          </button>
          <button
            onClick={l}
            aria-label="Next"
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-xl text-white border border-white/40 hover:bg-white/20 transition-colors"
          >
            ›
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {$a.map((t, n) => (
              <button
                key={n}
                onClick={() => c(n)}
                aria-label={`Slide ${n + 1}`}
                style={{
                  width: n === e ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: `none`,
                  cursor: `pointer`,
                  background: n === e ? `#F59E0B` : `rgba(255,255,255,0.4)`,
                  transition: `all 0.35s`,
                }}
              />
            ))}
          </div>
        </div>
        <style>
          {
            "\n        @keyframes suFadeUp {\n          from { opacity:0; transform:translateY(18px); }\n          to   { opacity:1; transform:translateY(0); }\n        }\n      "
          }
        </style>
        <div
          style={{
            background: `#004D2C`,
          }}
        >
          <div
            className="max-w-5xl mx-auto grid grid-cols-4 divide-x"
            style={{
              borderColor: `rgba(255,255,255,0.12)`,
            }}
          >
            {[
              {
                v: `22,400+`,
                l: `Alumni Worldwide`,
              },
              {
                v: `45`,
                l: `Countries`,
              },
              {
                v: `8`,
                l: `Departments`,
              },
              {
                v: `600+`,
                l: `Employer Partners`,
              },
            ].map((e, t) => (
              <div
                key={t}
                className="py-4 text-center"
                style={{
                  borderColor: `rgba(255,255,255,0.12)`,
                }}
              >
                <p className="font-display font-bold text-white text-xl sm:text-2xl leading-none">
                  {e.v}
                </p>
                <p className="text-green-300/70 text-[10px] mt-1">{e.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: `#ffffff`,
          }}
          className="py-16"
        >
          <div className="max-w-4xl mx-auto px-6 text-center mb-10">
            <h2
              className="font-display font-bold text-[#1a1a1a]"
              style={{
                fontSize: `clamp(2rem, 4vw, 3rem)`,
              }}
            >
              PUST Alumni Association
            </h2>
            <p className="text-[#555] mt-3 text-base max-w-lg mx-auto">
              Stay connected. Give back. Grow together.
            </p>
          </div>
          <div className="max-w-4xl mx-auto px-6">
            <div
              className="flex flex-col sm:flex-row overflow-hidden"
              style={{
                background: `#f0f0f0`,
                borderRadius: 4,
              }}
            >
              <div
                className="sm:w-[420px] flex-shrink-0 overflow-hidden"
                style={{
                  minHeight: 260,
                }}
              >
                <img
                  src={La}
                  alt="Award Ceremony"
                  className="w-full h-full object-cover object-top"
                  style={{
                    minHeight: 260,
                  }}
                />
              </div>
              <div className="flex-1 p-8 flex flex-col justify-center">
                <h3 className="font-display font-bold text-[#1a1a1a] text-2xl sm:text-3xl leading-snug mb-3">
                  Award Giving Ceremony 2026
                </h3>
                <p className="text-[#555] text-sm leading-relaxed mb-2">
                  Celebrating academic excellence at Pabna University — presided
                  by the Vice Chancellor and attended by distinguished alumni,
                  faculty, and students.
                </p>
                <p className="font-bold text-[#1a1a1a] text-sm mb-4">
                  Registration is open for all PUST stakeholders.
                </p>
                <Link
                  to="/events"
                  className="font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                  style={{
                    color: `#006B3F`,
                  }}
                >
                  Learn more ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            background: `#f2f2f2`,
          }}
          className="py-16"
        >
          <div className="max-w-4xl mx-auto px-6 text-center mb-12">
            <h2
              className="font-display font-bold text-[#1a1a1a]"
              style={{
                fontSize: `clamp(2rem, 4vw, 3rem)`,
              }}
            >
              Connecting With Purpose
            </h2>
            <p className="text-[#555] mt-3 text-base max-w-xl mx-auto">
              There is something for everyone at PUST Alumni. We are here to
              help you connect, learn, and grow every step of the way.
            </p>
          </div>
          <div className="max-w-4xl mx-auto px-6 space-y-5">
            {eo.map((e, t) => (
              <div
                key={t}
                className="flex flex-col sm:flex-row overflow-hidden"
                style={{
                  background: `#ffffff`,
                  borderRadius: 4,
                  boxShadow: `0 1px 4px rgba(0,0,0,0.06)`,
                }}
              >
                <div
                  className="sm:w-[420px] flex-shrink-0 overflow-hidden"
                  style={{
                    minHeight: 240,
                  }}
                >
                  <img
                    src={e.img}
                    alt={e.title}
                    className="w-full h-full object-cover"
                    style={{
                      minHeight: 240,
                    }}
                  />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-2"
                    style={{
                      color: e.color,
                    }}
                  >
                    {e.label}
                  </p>
                  <h3 className="font-display font-bold text-[#1a1a1a] text-2xl sm:text-3xl leading-snug mb-3">
                    {e.title}
                  </h3>
                  <p className="text-[#555] text-sm leading-relaxed mb-5">
                    {e.desc}
                  </p>
                  <Link
                    to={e.link}
                    className="font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                    style={{
                      color: e.color,
                    }}
                  >
                    {e.linkText}
                    {" \u2192"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: `#1a1a1a`,
          }}
          className="py-16"
        >
          <div className="max-w-5xl mx-auto px-6">
            <p
              className="text-center text-sm font-semibold mb-1"
              style={{
                color: `#F59E0B`,
                letterSpacing: `0.06em`,
              }}
            >
              Events & Programs
            </p>
            <div
              className="w-8 h-0.5 mx-auto mb-8"
              style={{
                background: `#F59E0B`,
              }}
            />
            <h2
              className="font-display font-bold text-white text-center mb-4"
              style={{
                fontSize: `clamp(2rem, 4.5vw, 3.5rem)`,
                lineHeight: 1.15,
              }}
            >
              Be Part of Every PUST Moment
            </h2>
            <p
              className="text-center text-sm mb-10 max-w-xl mx-auto"
              style={{
                color: `#888`,
              }}
            >
              From campus reunions to global webinars, PUST events connect you
              with the people and ideas that matter most.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {_a.slice(0, 3).map((e) => (
                <Link
                  key={e.id}
                  to="/events"
                  className="relative overflow-hidden group block"
                  style={{
                    borderRadius: 4,
                  }}
                >
                  <div
                    style={{
                      height: 220,
                    }}
                    className="overflow-hidden"
                  >
                    <img
                      src={e.img}
                      alt={e.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {e.online && (
                      <span
                        className="absolute top-3 left-3 text-[9px] font-bold px-2 py-0.5 text-white"
                        style={{
                          background: `#1B4F8A`,
                        }}
                      >
                        Online
                      </span>
                    )}
                  </div>
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between"
                    style={{
                      background: `linear-gradient(to top, rgba(0,0,0,0.88), transparent 80%)`,
                    }}
                  >
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">
                        {e.title}
                      </p>
                      <p className="text-white/60 text-[10px] mt-1">
                        {e.location}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-white/70 text-[9px] uppercase tracking-wider">
                        {e.date.split(` `)[1]}
                      </p>
                      <p className="font-display font-bold text-white text-2xl leading-none">
                        {e.date.split(` `)[1]
                          ? e.date.split(`,`)[0].split(` `).pop()
                          : e.date}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/events"
                className="inline-block text-sm font-bold text-white px-8 py-3 border border-white/30 hover:border-white/70 transition-colors"
              >
                See all events →
              </Link>
            </div>
          </div>
        </div>
        <div
          style={{
            background: `#ffffff`,
          }}
          className="py-14"
        >
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-display font-bold text-[#1a1a1a] text-center text-2xl sm:text-3xl mb-2">
              PUST on Campus
            </h2>
            <p className="text-center text-sm text-[#888] mb-8">
              Real moments from Pabna University of Science & Technology
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {to.slice(0, 6).map((e, t) => (
                <Link
                  key={t}
                  to="/gallery"
                  className="relative overflow-hidden group"
                  style={{
                    aspectRatio: `1/1`,
                    borderRadius: 2,
                  }}
                >
                  <img
                    src={e}
                    alt="PUST campus"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    style={{
                      background: `rgba(0,77,44,0.55)`,
                    }}
                  >
                    <span className="text-white text-xs font-bold">View</span>
                  </div>
                </Link>
              ))}
              <Link
                to="/gallery"
                className="relative overflow-hidden group col-span-2"
                style={{
                  aspectRatio: `2/1`,
                  borderRadius: 2,
                }}
              >
                <img
                  src={to[6]}
                  alt="PUST campus"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  style={{
                    background: `rgba(27,79,138,0.55)`,
                  }}
                >
                  <span className="text-white text-xs font-bold">View</span>
                </div>
              </Link>
              {to.slice(7, 11).map((e, t) => (
                <Link
                  key={t + 7}
                  to="/gallery"
                  className="relative overflow-hidden group"
                  style={{
                    aspectRatio: `1/1`,
                    borderRadius: 2,
                  }}
                >
                  <img
                    src={e}
                    alt="PUST campus"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    style={{
                      background: `rgba(0,77,44,0.55)`,
                    }}
                  >
                    <span className="text-white text-xs font-bold">View</span>
                  </div>
                </Link>
              ))}
              {to.slice(11, 16).map((e, t) => (
                <Link
                  key={t + 11}
                  to="/gallery"
                  className="relative overflow-hidden group"
                  style={{
                    aspectRatio: `1/1`,
                    borderRadius: 2,
                  }}
                >
                  <img
                    src={e}
                    alt="PUST campus"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    style={{
                      background: `rgba(0,77,44,0.55)`,
                    }}
                  >
                    <span className="text-white text-xs font-bold">View</span>
                  </div>
                </Link>
              ))}
              <Link
                to="/gallery"
                className="relative overflow-hidden group"
                style={{
                  aspectRatio: `1/1`,
                  borderRadius: 2,
                }}
              >
                <img
                  src={to[16]}
                  alt="PUST campus"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  style={{
                    background: `rgba(245,158,11,0.55)`,
                  }}
                >
                  <span className="text-white text-xs font-bold">
                    View all 17+
                  </span>
                </div>
              </Link>
            </div>
            <div className="text-center mt-6">
              <Link
                to="/gallery"
                className="text-sm font-bold inline-flex items-center gap-1 hover:gap-2 transition-all"
                style={{
                  color: `#006B3F`,
                }}
              >
                View full gallery →
              </Link>
            </div>
          </div>
        </div>
        <div
          style={{
            background: `#f2f2f2`,
          }}
          className="py-14"
        >
          <div className="max-w-4xl mx-auto px-6 grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: `🎯`,
                title: `Become a Mentor`,
                desc: `Share your expertise with current PUST students and recent graduates. 320+ active mentors across every department.`,
                link: `/mentorship`,
                linkText: `Join as a mentor`,
              },
              {
                icon: `🏛️`,
                title: `Give Back to PUST`,
                desc: `Fund scholarships, research grants, and campus development for the next generation of PUST students.`,
                link: `/donate`,
                linkText: `Donate to PUST`,
              },
            ].map((e, t) => (
              <div
                key={t}
                className="p-8 flex flex-col"
                style={{
                  background: `#ffffff`,
                  borderRadius: 4,
                }}
              >
                <div className="text-4xl mb-4">{e.icon}</div>
                <h3 className="font-display font-bold text-[#1a1a1a] text-xl mb-3">
                  {e.title}
                </h3>
                <p className="text-[#555] text-sm leading-relaxed flex-1 mb-5">
                  {e.desc}
                </p>
                <Link
                  to={e.link}
                  className="font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                  style={{
                    color: `#006B3F`,
                  }}
                >
                  {e.linkText}
                  {" \u2192"}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div
          className="relative overflow-hidden"
          style={{
            height: 280,
          }}
        >
          <img
            src={Qa}
            alt="PUST"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, rgba(0,0,0,0.82) 45%, rgba(0,0,0,0.3) 100%)`,
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-center px-10 sm:px-16">
            <h2 className="font-display font-bold text-white text-2xl sm:text-4xl leading-tight max-w-sm mb-6">
              {"PUST\xA0"}
              <span className="italic font-normal">| alumni</span>
            </h2>
            {o ? (
              <p className="text-white font-semibold text-sm border border-white/30 inline-block px-6 py-2.5">
                ✓ Subscribed. Thank you!
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  (e.preventDefault(), i && (s(true), a(``)));
                }}
                className="flex max-w-sm"
              >
                <input
                  type="email"
                  value={i}
                  onChange={(e) => a(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-2.5 text-sm text-[#0F172A] outline-none"
                  style={{
                    border: `none`,
                    borderRadius: 0,
                  }}
                />
                <button
                  type="submit"
                  className="text-white text-sm font-bold px-5 py-2.5 hover:opacity-90 transition-opacity whitespace-nowrap"
                  style={{
                    background: `#004D2C`,
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
            <p className="text-white/45 text-xs mt-3">
              Monthly PUST alumni digest — news, events, careers & stories.
            </p>
          </div>
        </div>
      </div>
    )
  );
}
