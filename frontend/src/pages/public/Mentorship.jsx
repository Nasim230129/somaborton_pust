import React, { useState } from "react";
import {
  pa,
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
import { api, useBackendSync } from "../../services/api";

var Io = [Ia, La, Ra, za, Ba, Va, Ha, Ka, Wa, Xa, qa, Ja, Qa, Ua, Za, Ya, Ga],
  Lo = [
    {
      from: `#1B4F8A`,
      to: `#0D3666`,
    },
    {
      from: `#006B3F`,
      to: `#004D2C`,
    },
    {
      from: `#7C3AED`,
      to: `#5B21B6`,
    },
    {
      from: `#D97706`,
      to: `#B45309`,
    },
    {
      from: `#059669`,
      to: `#047857`,
    },
    {
      from: `#0891B2`,
      to: `#0E7490`,
    },
    {
      from: `#004D2C`,
      to: `#1B4F8A`,
    },
    {
      from: `#1B4F8A`,
      to: `#7C3AED`,
    },
    {
      from: `#059669`,
      to: `#0D9488`,
    },
    {
      from: `#004D2C`,
      to: `#059669`,
    },
    {
      from: `#0D3666`,
      to: `#1B4F8A`,
    },
    {
      from: `#5B21B6`,
      to: `#7C3AED`,
    },
    {
      from: `#006B3F`,
      to: `#059669`,
    },
    {
      from: `#B45309`,
      to: `#D97706`,
    },
    {
      from: `#0E7490`,
      to: `#0891B2`,
    },
    {
      from: `#DC2626`,
      to: `#B91C1C`,
    },
    {
      from: `#059669`,
      to: `#004D2C`,
    },
  ],
  Ro = [
    {
      n: `01`,
      icon: `🔍`,
      title: `Browse Mentors`,
      desc: `Filter by industry, department, skills, and availability to find the perfect match.`,
    },
    {
      n: `02`,
      icon: `📝`,
      title: `Send a Request`,
      desc: `Write a short note about your goals — mentors appreciate knowing your intentions.`,
    },
    {
      n: `03`,
      icon: `✅`,
      title: `Get Matched`,
      desc: `Your mentor reviews and responds within 48 hours. Most requests are accepted.`,
    },
    {
      n: `04`,
      icon: `🚀`,
      title: `Grow Together`,
      desc: `Regular 1-on-1 sessions, career guidance, network introductions, and more.`,
    },
  ],
  zo = [
    {
      v: `320+`,
      l: `Active Mentors`,
    },
    {
      v: `1,800+`,
      l: `Sessions Completed`,
    },
    {
      v: `94%`,
      l: `Satisfaction Rate`,
    },
    {
      v: `45+`,
      l: `Countries Covered`,
    },
  ],
  Bo = [
    {
      quote: `My mentor connected me with Brain Station 23 before I even graduated. Best decision I ever made.`,
      name: `Ariful Islam`,
      dept: `CSE, Batch 2022`,
      avatar: `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop`,
    },
    {
      quote: `Three months of mentorship gave me more career clarity than four years of searching alone.`,
      name: `Sumaiya Khatun`,
      dept: `EEE, Batch 2023`,
      avatar: `https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop`,
    },
    {
      quote: `My mentor is now a lifelong professional contact. The PUST network is truly powerful.`,
      name: `Nahid Hasan`,
      dept: `MATH, Batch 2024`,
      avatar: `https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop`,
    },
  ],
  Ho = [`All`, `Technology`, `Energy`, `Finance`, `Academia`, `Infrastructure`];
export default function Mentorship() {
  useBackendSync();
  let Vo = pa.filter((e) => e.mentorAvailable),
    [e, t] = useState([]),
    [n, r] = useState(`All`),
    [i, a] = useState(``),
    o = Vo.filter((e) => {
      if (n !== `All` && e.industry !== n) return false;
      if (i) {
        let t = i.toLowerCase();
        return (
          e.name.toLowerCase().includes(t) ||
          e.dept.toLowerCase().includes(t) ||
          (e.skills ?? []).some((e) => e.toLowerCase().includes(t))
        );
      }
      return true;
    });
  return (
    <div
      className="min-h-screen"
      style={{
        background: `#f2f2f2`,
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: `clamp(320px,46vh,500px)`,
        }}
      >
        <img
          src={Wa}
          alt="PUST Campus Lakeside"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(120deg,rgba(0,107,63,0.93) 0%,rgba(27,79,138,0.82) 65%,rgba(0,77,44,0.70) 100%)`,
          }}
        />
        <div
          className="absolute top-8 right-16 w-48 h-48 rounded-full opacity-10"
          style={{
            border: `2px solid #fff`,
          }}
        />
        <div
          className="absolute top-16 right-24 w-28 h-28 rounded-full opacity-8"
          style={{
            border: `1px solid #F59E0B`,
          }}
        />
        <div
          className="absolute bottom-12 left-10 w-32 h-32 rounded-full opacity-8"
          style={{
            border: `1.5px solid rgba(255,255,255,0.3)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 64,
          }}
        >
          <svg
            viewBox="0 0 1440 64"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <polygon points="0,64 1440,16 1440,64" fill="#f2f2f2" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 pb-24">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.26em] mb-3"
            style={{
              color: `#F59E0B`,
            }}
          >
            PUST Alumni Network
          </p>
          <h1
            className="font-display font-bold text-white mb-4"
            style={{
              fontSize: `clamp(2.2rem,6vw,4rem)`,
              lineHeight: 1.1,
            }}
          >
            Find Your Mentor
          </h1>
          <p
            className="text-sm sm:text-base mb-8 max-w-lg"
            style={{
              color: `rgba(255,255,255,0.65)`,
            }}
          >
            320+ experienced PUST alumni ready to guide you — one-on-one
            mentorship in your field, at your pace.
          </p>
          <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-3">
            <div
              className="flex flex-1 overflow-hidden"
              style={{
                background: `#fff`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.22)`,
              }}
            >
              <span className="flex items-center px-4 text-[#bbb] flex-shrink-0">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by name, skill, department\u2026"
                value={i}
                onChange={(e) => a(e.target.value)}
                className="flex-1 py-3.5 text-sm text-[#1a1a1a] outline-none bg-transparent"
              />
            </div>
            <button
              className="px-7 py-3.5 text-sm font-bold transition-opacity hover:opacity-90 flex-shrink-0"
              style={{
                background: `#F59E0B`,
                color: `#1a1a1a`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.22)`,
              }}
            >
              Find Mentor
            </button>
          </div>
        </div>
      </div>
      <div
        style={{
          background: `#1a1a1a`,
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-4 divide-x divide-white/10">
          {zo.map((e, t) => (
            <div key={t} className="py-5 text-center">
              <p className="font-display font-bold text-white text-2xl leading-none">
                {e.v}
              </p>
              <p
                className="text-[10px] mt-1 uppercase tracking-wider"
                style={{
                  color: `rgba(255,255,255,0.38)`,
                }}
              >
                {e.l}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          background: `#fff`,
        }}
      >
        <img
          src={Ia}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.04]"
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2"
              style={{
                color: `#006B3F`,
              }}
            >
              Simple Process
            </p>
            <h2
              className="font-display font-bold text-[#1a1a1a]"
              style={{
                fontSize: `clamp(1.8rem,4vw,2.8rem)`,
              }}
            >
              How Mentorship Works
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Ro.map((e, t) => (
              <div key={e.n} className="relative group">
                {t < Ro.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-7 left-[calc(100%-12px)] w-full h-px z-0"
                    style={{
                      background: `linear-gradient(to right,#006B3F40,transparent)`,
                    }}
                  />
                )}
                <div
                  className="relative z-10 flex flex-col items-center text-center p-6 transition-all"
                  style={{
                    border: `1px solid #e5e5e5`,
                    background: `#fafafa`,
                  }}
                  onMouseOver={(e) => {
                    ((e.currentTarget.style.borderColor = `#006B3F`),
                      (e.currentTarget.style.background = `#F0FDF4`));
                  }}
                  onMouseOut={(e) => {
                    ((e.currentTarget.style.borderColor = `#e5e5e5`),
                      (e.currentTarget.style.background = `#fafafa`));
                  }}
                >
                  <div
                    className="w-14 h-14 flex items-center justify-center text-2xl mb-4 relative"
                    style={{
                      background: `#006B3F`,
                      borderRadius: `50%`,
                    }}
                  >
                    {e.icon}
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center"
                      style={{
                        background: `#F59E0B`,
                        color: `#1a1a1a`,
                      }}
                    >
                      {e.n}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1a1a1a] text-sm mb-2">
                    {e.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color: `#666`,
                    }}
                  >
                    {e.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="flex overflow-hidden"
        style={{
          height: 80,
        }}
      >
        {Io.map((e, t) => (
          <div key={t} className="flex-1 relative overflow-hidden group">
            <img
              src={e}
              alt=""
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: `linear-gradient(135deg,${Lo[t % Lo.length].from},${Lo[t % Lo.length].to})`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex flex-wrap gap-2 mb-8 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {Ho.map((e) => (
              <button
                key={e}
                onClick={() => r(e)}
                className="px-4 py-2 text-xs font-semibold transition-all"
                style={{
                  background: n === e ? `#004D2C` : `#fff`,
                  color: n === e ? `#fff` : `#555`,
                  border: `1.5px solid ${n === e ? `#004D2C` : `#ddd`}`,
                }}
              >
                {e}
              </button>
            ))}
          </div>
          <p
            className="text-sm"
            style={{
              color: `#888`,
            }}
          >
            <span className="font-bold text-[#1a1a1a]">{o.length}</span>
            {" mentors available"}
          </p>
        </div>
        {o.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200">
            <p className="text-4xl mb-3">🎯</p>
            <p className="font-bold text-[#1a1a1a]">
              No mentors match your search.
            </p>
            <p className="text-xs mt-1 text-[#aaa]">
              Try a different industry or clear the search.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {o.map((n, r) => {
              let i = Io[r % Io.length],
                a = Lo[r % Lo.length],
                o = e.includes(n.id);
              return (
                <div
                  key={n.id}
                  className="group overflow-hidden transition-all"
                  style={{
                    background: `#fff`,
                    border: `1px solid #e5e5e5`,
                  }}
                  onMouseOver={(e) => {
                    ((e.currentTarget.style.boxShadow = `0 8px 32px ${a.from}22`),
                      (e.currentTarget.style.transform = `translateY(-3px)`));
                  }}
                  onMouseOut={(e) => {
                    ((e.currentTarget.style.boxShadow = `none`),
                      (e.currentTarget.style.transform = `none`));
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      height: 80,
                    }}
                  >
                    <img
                      src={i}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(120deg,${a.from}D9,${a.to}B3)`,
                      }}
                    />
                    <div
                      className="absolute bottom-0 right-0 overflow-hidden"
                      style={{
                        width: 90,
                        height: 80,
                      }}
                    >
                      <svg viewBox="0 0 90 80" className="w-full h-full">
                        <polygon
                          points="90,0 90,80 0,80"
                          fill="rgba(255,255,255,0.07)"
                        />
                      </svg>
                    </div>
                    {n.verified && (
                      <span
                        className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5"
                        style={{
                          background: `rgba(255,255,255,0.22)`,
                          color: `#fff`,
                          border: `1px solid rgba(255,255,255,0.4)`,
                        }}
                      >
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div
                    className="flex justify-center"
                    style={{
                      marginTop: -28,
                    }}
                  >
                    <div className="relative">
                      <img
                        src={n.avatar}
                        alt={n.name}
                        className="rounded-full object-cover"
                        style={{
                          width: 60,
                          height: 60,
                          border: `3px solid #fff`,
                          boxShadow: `0 4px 14px rgba(0,0,0,0.18)`,
                        }}
                      />
                      <span
                        className="absolute bottom-0 right-0.5 w-4 h-4 rounded-full border-2 border-white"
                        style={{
                          background: `#22C55E`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="px-5 pt-3 pb-5 text-center">
                    <h3 className="font-display font-bold text-[#1a1a1a] text-sm leading-snug">
                      {n.name}
                    </h3>
                    <p
                      className="text-xs mt-1 leading-snug"
                      style={{
                        color: `#666`,
                        display: `-webkit-box`,
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: `vertical`,
                        overflow: `hidden`,
                      }}
                    >
                      {n.headline}
                    </p>
                    <div
                      className="flex items-center justify-center gap-3 mt-2.5 text-[10px]"
                      style={{
                        color: `#aaa`,
                      }}
                    >
                      <span>
                        {"\uD83D\uDCCD "}
                        {n.location.split(`,`)[0]}
                      </span>
                      {n.industry && (
                        <span>
                          {"\xB7 "}
                          {n.industry}
                        </span>
                      )}
                    </div>
                    <div
                      className="h-0.5 mx-6 my-3"
                      style={{
                        background: `linear-gradient(to right,${a.from},${a.to})`,
                      }}
                    />
                    {n.skills && (
                      <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                        {n.skills.slice(0, 3).map((e) => (
                          <span
                            key={e}
                            className="text-[9px] font-semibold px-2 py-0.5"
                            style={{
                              background: a.from + `12`,
                              color: a.from,
                            }}
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    )}
                    <p
                      className="text-[10px] mb-4"
                      style={{
                        color: `#aaa`,
                      }}
                    >
                      {"\uD83C\uDFDB\uFE0F "}
                      {n.dept.split(`&`)[0].trim()}
                    </p>
                    <button
                      onClick={() => {
                        if (!o) {
                          api.requestMentorship({
                            mentorId: n.id,
                            mentorName: n.name,
                          });
                          t([...e, n.id]);
                        }
                      }}
                      className="w-full py-2.5 text-xs font-bold transition-all"
                      style={
                        o
                          ? {
                              background: `#006B3F`,
                              color: `#fff`,
                              border: `none`,
                            }
                          : {
                              background: `transparent`,
                              color: a.from,
                              border: `1.5px solid ${a.from}`,
                            }
                      }
                      onMouseOver={(e) => {
                        o || (e.currentTarget.style.background = a.from + `12`);
                      }}
                      onMouseOut={(e) => {
                        o || (e.currentTarget.style.background = `transparent`);
                      }}
                    >
                      {o ? `✓ Request Sent` : `Request Mentorship →`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          background: `#1a1a1a`,
        }}
      >
        <img
          src={Ha}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{
                color: `#F59E0B`,
              }}
            >
              Success Stories
            </p>
            <h2
              className="font-display font-bold text-white"
              style={{
                fontSize: `clamp(1.8rem,4vw,2.6rem)`,
              }}
            >
              What Mentees Say
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {Bo.map((e, t) => (
              <div
                key={t}
                className="p-6 relative"
                style={{
                  background: `rgba(255,255,255,0.06)`,
                  border: `1px solid rgba(255,255,255,0.10)`,
                }}
              >
                <div
                  className="font-display text-6xl leading-none mb-3"
                  style={{
                    color: `#F59E0B`,
                    opacity: 0.6,
                  }}
                >
                  "
                </div>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{
                    color: `rgba(255,255,255,0.75)`,
                  }}
                >
                  {e.quote}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={e.avatar}
                    alt={e.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    style={{
                      border: `2px solid rgba(255,255,255,0.2)`,
                    }}
                  />
                  <div>
                    <p className="text-white text-xs font-bold">{e.name}</p>
                    <p
                      className="text-[10px]"
                      style={{
                        color: `rgba(255,255,255,0.45)`,
                      }}
                    >
                      {e.dept}
                    </p>
                  </div>
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{
                    background: `linear-gradient(to right,${Lo[t % Lo.length].from},${Lo[t % Lo.length].to})`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="flex flex-col lg:flex-row overflow-hidden"
        style={{
          minHeight: 220,
        }}
      >
        <div className="flex-1 relative overflow-hidden">
          <img
            src={La}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(120deg,rgba(27,79,138,0.93) 0%,rgba(27,79,138,0.78) 100%)`,
            }}
          />
          <div className="relative z-10 p-10 flex flex-col justify-center h-full">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{
                color: `#93C5FD`,
              }}
            >
              For Alumni
            </p>
            <h3 className="font-display font-bold text-white text-2xl mb-3">
              Become a Mentor
            </h3>
            <p
              className="text-sm mb-6 max-w-xs"
              style={{
                color: `rgba(255,255,255,0.62)`,
              }}
            >
              Share your experience and give back to the PUST community. Set
              your own schedule and guide the next generation.
            </p>
            <button
              className="self-start px-7 py-3 text-sm font-bold transition-opacity hover:opacity-90"
              style={{
                background: `#fff`,
                color: `#1B4F8A`,
              }}
            >
              Become a Mentor →
            </button>
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden">
          <img
            src={Va}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(120deg,rgba(0,77,44,0.92) 0%,rgba(0,107,63,0.80) 100%)`,
            }}
          />
          <div className="relative z-10 p-10 h-full flex flex-col justify-center">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{
                color: `#6EE7B7`,
              }}
            >
              Program Impact
            </p>
            <h3 className="font-display font-bold text-white text-2xl mb-5">
              Mentorship by Numbers
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {zo.map((e, t) => (
                <div
                  key={t}
                  className="p-3 text-center"
                  style={{
                    background: `rgba(255,255,255,0.08)`,
                    border: `1px solid rgba(255,255,255,0.12)`,
                  }}
                >
                  <p className="font-display font-bold text-white text-xl leading-none">
                    {e.v}
                  </p>
                  <p
                    className="text-[10px] mt-1"
                    style={{
                      color: `rgba(255,255,255,0.5)`,
                    }}
                  >
                    {e.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
