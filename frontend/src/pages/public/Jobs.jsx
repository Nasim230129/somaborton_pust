import React, { useState } from "react";
import {
  va,
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

var jo = [Ia, La, Ra, za, Ba, Va, Ha, Ka, Wa, Xa, qa, Ja, Qa, Ua, Za, Ya, Ga],
  Mo = [
    {
      from: `#004D2C`,
      to: `#006B3F`,
    },
    {
      from: `#1B4F8A`,
      to: `#0D3666`,
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
  No = [`All`, `Full-time`, `Internship`, `Remote`],
  Po = {
    "Full-time": {
      bg: `#DBEAFE`,
      color: `#1B4F8A`,
    },
    Internship: {
      bg: `#F3E8FF`,
      color: `#7C3AED`,
    },
    Remote: {
      bg: `#DCFCE7`,
      color: `#006B3F`,
    },
  };
export default function Jobs() {
  useBackendSync();
  let [e, t] = useState(``),
    [n, r] = useState(`All`),
    [i, a] = useState(va[0]),
    [o, s] = useState([]),
    [c, l] = useState([]),
    u = va.filter((t) => {
      if (
        (n === `Remote` && !t.remote) ||
        (n === `Full-time` && t.type !== `Full-time`) ||
        (n === `Internship` && t.type !== `Internship`)
      )
        return false;
      if (e) {
        let n = e.toLowerCase();
        return (
          t.title.toLowerCase().includes(n) ||
          t.company.toLowerCase().includes(n) ||
          t.location.toLowerCase().includes(n) ||
          t.skills.some((e) => e.toLowerCase().includes(n))
        );
      }
      return true;
    }),
    d = Math.max(0, va.findIndex((e) => e.id === i.id)),
    f = jo[d % jo.length],
    p = Mo[d % Mo.length],
    m = o.includes(i.id),
    h = c.includes(i.id);
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
          minHeight: `clamp(300px,42vh,440px)`,
        }}
      >
        <img
          src={Ia}
          alt="PUST Campus"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(120deg, rgba(0,77,44,0.94) 0%, rgba(27,79,138,0.80) 60%, rgba(0,77,44,0.65) 100%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden"
          style={{
            height: 56,
          }}
        >
          <svg
            viewBox="0 0 1440 56"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <polygon points="0,56 1440,0 1440,56" fill="#f2f2f2" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 pb-20">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.26em] mb-3"
            style={{
              color: `#F59E0B`,
            }}
          >
            PUST Alumni · Career Ecosystem
          </p>
          <h1
            className="font-display font-bold text-white mb-3"
            style={{
              fontSize: `clamp(2rem,5.5vw,3.8rem)`,
              lineHeight: 1.1,
            }}
          >
            Jobs & Opportunities
          </h1>
          <p
            className="text-sm sm:text-base mb-8 max-w-lg"
            style={{
              color: `rgba(255,255,255,0.65)`,
            }}
          >
            Exclusive roles from PUST alumni and corporate partners — full-time,
            internship & remote.
          </p>
          <div
            className="w-full max-w-2xl flex overflow-hidden"
            style={{
              boxShadow: `0 8px 40px rgba(0,0,0,0.30)`,
              borderRadius: 2,
            }}
          >
            <span className="flex items-center px-4 bg-white text-[#bbb] flex-shrink-0">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by title, company, or skill\u2026"
              value={e}
              onChange={(e) => t(e.target.value)}
              className="flex-1 px-3 py-4 text-sm text-[#1a1a1a] outline-none bg-white"
            />
            <button
              className="px-7 py-4 text-sm font-bold flex-shrink-0 transition-opacity hover:opacity-90"
              style={{
                background: `#F59E0B`,
                color: `#1a1a1a`,
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div
        style={{
          background: `#1a1a1a`,
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-4 divide-x divide-white/10">
          {[
            {
              v: `${va.length}+`,
              l: `Active Jobs`,
            },
            {
              v: `40+`,
              l: `Partner Companies`,
            },
            {
              v: `1,200+`,
              l: `Placed Alumni`,
            },
            {
              v: `৳75k`,
              l: `Avg Salary/mo`,
            },
          ].map((e, t) => (
            <div key={t} className="py-5 text-center">
              <p className="font-display font-bold text-white text-xl sm:text-2xl leading-none">
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
        className="flex overflow-hidden"
        style={{
          height: 88,
        }}
      >
        {jo.map((e, t) => (
          <div key={t} className="flex-1 relative overflow-hidden group">
            <img
              src={e}
              alt=""
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg,${Mo[t].from}99,${Mo[t].to}77)`,
              }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          background: `#fff`,
          borderBottom: `1px solid #e5e5e5`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center">
          {No.map((e) => (
            <button
              key={e}
              onClick={() => r(e)}
              className="px-5 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap"
              style={{
                borderBottomColor: n === e ? `#004D2C` : `transparent`,
                color: n === e ? `#004D2C` : `#888`,
              }}
            >
              {e}
            </button>
          ))}
          <p
            className="ml-auto text-xs pr-2"
            style={{
              color: `#aaa`,
            }}
          >
            <span className="font-bold text-[#1a1a1a]">{u.length}</span>
            {" positions"}
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex gap-6 items-start">
        <div className="flex-shrink-0 w-full lg:w-[360px] space-y-3">
          {u.length === 0 && (
            <div className="text-center py-20 bg-white border border-gray-200">
              <p className="text-4xl mb-3">💼</p>
              <p className="font-bold text-[#1a1a1a]">
                No jobs match your search.
              </p>
              <p
                className="text-xs mt-1"
                style={{
                  color: `#aaa`,
                }}
              >
                Try different keywords or filters.
              </p>
            </div>
          )}
          {u.map((e, t) => {
            let n = i.id === e.id,
              r = jo[t % jo.length],
              o = Mo[t % Mo.length],
              s = Po[e.type] ?? Po[`Full-time`];
            return (
              <button
                key={e.id}
                onClick={() => a(e)}
                className="w-full text-left overflow-hidden group transition-all"
                style={{
                  background: `#fff`,
                  border: `2px solid ${n ? o.from : `#e5e5e5`}`,
                  boxShadow: n ? `0 6px 24px ${o.from}28` : `none`,
                  transform: n ? `translateY(-2px)` : `none`,
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: 72,
                  }}
                >
                  <img
                    src={r}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(120deg,${o.from}CC,${o.to}99)`,
                    }}
                  />
                  <div
                    className="absolute bottom-0 right-0 overflow-hidden"
                    style={{
                      width: 80,
                      height: 72,
                    }}
                  >
                    <svg
                      viewBox="0 0 80 72"
                      className="absolute inset-0 w-full h-full"
                    >
                      <polygon
                        points="80,0 80,72 0,72"
                        fill="rgba(255,255,255,0.08)"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center px-4 gap-3">
                    <div
                      className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
                      style={{
                        background: `#fff`,
                        borderRadius: 6,
                        boxShadow: `0 2px 8px rgba(0,0,0,0.18)`,
                      }}
                    >
                      {e.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-xs leading-snug truncate">
                        {e.company}
                      </p>
                      <p className="text-white/60 text-[10px] truncate">
                        {"\uD83D\uDCCD "}
                        {e.location}
                      </p>
                    </div>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 flex-shrink-0"
                      style={{
                        background: s.bg,
                        color: s.color,
                      }}
                    >
                      {e.type}
                    </span>
                  </div>
                </div>
                <div className="px-4 pt-3 pb-4">
                  <div className="flex gap-3 items-start mb-2">
                    <div
                      className="w-0.5 self-stretch flex-shrink-0 mt-0.5"
                      style={{
                        background: `linear-gradient(to bottom,${o.from},${o.to})`,
                      }}
                    />
                    <h3 className="font-display font-bold text-[#1a1a1a] text-sm leading-snug group-hover:text-[#004D2C] transition-colors">
                      {e.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p
                      className="text-xs font-bold"
                      style={{
                        color: o.from,
                      }}
                    >
                      {e.salary}
                    </p>
                    <p
                      className="text-[10px]"
                      style={{
                        color: `#bbb`,
                      }}
                    >
                      {e.posted}
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mb-2.5">
                    {e.skills.slice(0, 3).map((e) => (
                      <span
                        key={e}
                        className="text-[9px] font-medium px-2 py-0.5"
                        style={{
                          background: `#F1F5F9`,
                          color: `#475569`,
                        }}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px]"
                      style={{
                        color: `#bbb`,
                      }}
                    >
                      {e.applicants}
                      {" applicants"}
                    </span>
                    {e.remote && (
                      <span
                        className="text-[9px] font-bold px-2 py-0.5"
                        style={{
                          background: `#DCFCE7`,
                          color: `#006B3F`,
                        }}
                      >
                        🌐 Remote
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex-1 hidden lg:block sticky top-[86px]">
          <div
            className="overflow-hidden"
            style={{
              background: `#fff`,
              border: `1px solid #e5e5e5`,
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                height: 200,
              }}
            >
              <img
                src={f}
                alt={i.company}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(120deg,${p.from}E6 0%,${p.to}CC 100%)`,
                }}
              />
              <div className="absolute top-0 right-0 w-64 h-full overflow-hidden">
                <svg
                  viewBox="0 0 256 200"
                  className="absolute inset-0 w-full h-full"
                >
                  <polygon
                    points="256,0 256,200 60,200"
                    fill="rgba(255,255,255,0.06)"
                  />
                  <polygon
                    points="256,0 256,200 140,0"
                    fill="rgba(255,255,255,0.04)"
                  />
                </svg>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: 40,
                }}
              >
                <svg
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <polygon points="0,40 100,0 100,40" fill="#fff" />
                </svg>
              </div>
              <div className="absolute top-0 left-0 right-0 px-7 pt-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 flex items-center justify-center text-3xl flex-shrink-0"
                    style={{
                      background: `#fff`,
                      borderRadius: 8,
                      boxShadow: `0 4px 16px rgba(0,0,0,0.22)`,
                    }}
                  >
                    {i.logo}
                  </div>
                  <div>
                    <h2
                      className="font-display font-bold text-white leading-tight"
                      style={{
                        fontSize: `clamp(1.1rem,2vw,1.45rem)`,
                      }}
                    >
                      {i.title}
                    </h2>
                    <p className="text-white/70 text-sm mt-0.5">{i.company}</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    l(h ? c.filter((e) => e !== i.id) : [...c, i.id])
                  }
                  className="flex-shrink-0 px-4 py-2 text-xs font-bold transition-all"
                  style={
                    h
                      ? {
                          background: `#F59E0B`,
                          color: `#1a1a1a`,
                        }
                      : {
                          background: `rgba(255,255,255,0.16)`,
                          color: `#fff`,
                          border: `1px solid rgba(255,255,255,0.35)`,
                        }
                  }
                >
                  {h ? `💾 Saved` : `🔖 Save`}
                </button>
              </div>
            </div>
            <div
              className="px-7 py-4 flex flex-wrap gap-2"
              style={{
                borderBottom: `1px solid #f0f0f0`,
              }}
            >
              {[
                {
                  icon: `📍`,
                  label: i.location,
                  bg: `#F1F5F9`,
                  color: `#475569`,
                },
                {
                  icon: ``,
                  label: i.type,
                  bg: Po[i.type]?.bg ?? `#F1F5F9`,
                  color: Po[i.type]?.color ?? `#475569`,
                },
                {
                  icon: `⏱`,
                  label: `Deadline: ${i.deadline}`,
                  bg: `#FEF3C7`,
                  color: `#D97706`,
                },
                ...(i.remote
                  ? [
                      {
                        icon: `🌐`,
                        label: `Remote OK`,
                        bg: `#DCFCE7`,
                        color: `#006B3F`,
                      },
                    ]
                  : []),
              ].map((e, t) => (
                <span
                  key={t}
                  className="text-xs font-semibold px-3 py-1.5"
                  style={{
                    background: e.bg,
                    color: e.color,
                  }}
                >
                  {e.icon} {e.label}
                </span>
              ))}
            </div>
            <div
              className="grid grid-cols-3 divide-x"
              style={{
                borderBottom: `1px solid #f0f0f0`,
              }}
            >
              {[
                {
                  label: `Salary`,
                  value: i.salary,
                  color: `#006B3F`,
                },
                {
                  label: `Applicants`,
                  value: String(i.applicants),
                  color: `#1B4F8A`,
                },
                {
                  label: `For Dept`,
                  value: i.dept,
                  color: `#7C3AED`,
                },
              ].map((e, t) => (
                <div key={t} className="text-center py-4">
                  <p
                    className="font-display font-bold text-base leading-none"
                    style={{
                      color: e.color,
                    }}
                  >
                    {e.value}
                  </p>
                  <p className="text-[10px] text-[#aaa] uppercase tracking-wider mt-1">
                    {e.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-7 py-6">
              <div className="mb-5">
                <h3
                  className="font-bold text-[#1a1a1a] text-sm mb-2 pl-3"
                  style={{
                    borderLeft: `3px solid ${p.from}`,
                  }}
                >
                  About this Role
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: `#555`,
                  }}
                >
                  {i.desc}
                </p>
              </div>
              <div className="mb-5">
                <h3
                  className="font-bold text-[#1a1a1a] text-sm mb-2 pl-3"
                  style={{
                    borderLeft: `3px solid ${p.to}`,
                  }}
                >
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {i.skills.map((e) => (
                    <span
                      key={e}
                      className="text-xs font-semibold px-3 py-1.5"
                      style={{
                        background: p.from + `12`,
                        color: p.from,
                        border: `1px solid ${p.from}30`,
                      }}
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="flex items-start gap-3 p-4 mb-6"
                style={{
                  background: p.from + `0D`,
                  border: `1px solid ${p.from}30`,
                }}
              >
                <span className="text-xl flex-shrink-0">💡</span>
                <div>
                  <p
                    className="text-xs font-bold mb-0.5"
                    style={{
                      color: p.from,
                    }}
                  >
                    Alumni Referral Available
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: `#555`,
                    }}
                  >
                    {"Posted by "}
                    <span className="font-semibold">{i.postedBy}</span>
                    {" \u2014 connect for an internal referral!"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!m) {
                      api.applyJob(i.id);
                      s([...o, i.id]);
                    }
                  }}
                  className="flex-1 py-3.5 text-sm font-bold transition-all"
                  style={{
                    background: m ? `#006B3F` : p.from,
                    color: `#fff`,
                  }}
                >
                  {m ? `✓ Applied Successfully` : `Apply Now →`}
                </button>
                <button
                  className="px-5 py-3.5 text-sm font-semibold transition-all"
                  style={{
                    border: `1.5px solid ${p.from}40`,
                    color: p.from,
                    background: `transparent`,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = p.from + `10`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = `transparent`;
                  }}
                >
                  Message Poster
                </button>
              </div>
            </div>
          </div>
          <div
            className="mt-4 flex items-center gap-4 p-4"
            style={{
              background: `#fff`,
              border: `1px solid #e5e5e5`,
            }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: `#FEF3C7`,
                borderRadius: 8,
              }}
            >
              🔔
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1a1a1a]">Job Alert</p>
              <p
                className="text-xs"
                style={{
                  color: `#888`,
                }}
              >
                Get notified when matching jobs are posted.
              </p>
            </div>
            <button
              className="flex-shrink-0 text-xs font-bold px-4 py-2"
              style={{
                background: `#004D2C`,
                color: `#fff`,
              }}
            >
              Enable
            </button>
          </div>
        </div>
      </div>
      <div
        className="relative overflow-hidden mt-4"
        style={{
          minHeight: 220,
        }}
      >
        <div className="absolute inset-0 flex">
          <img
            src={Va}
            alt=""
            className="w-1/2 h-full object-cover object-center"
          />
          <img
            src={Ha}
            alt=""
            className="w-1/2 h-full object-cover object-center"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(120deg,rgba(0,77,44,0.93) 0%,rgba(27,79,138,0.90) 100%)`,
          }}
        />
        <div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2"
          style={{
            width: 3,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              background: `rgba(255,255,255,0.12)`,
            }}
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{
                color: `#F59E0B`,
              }}
            >
              For Employers & Alumni
            </p>
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-2">
              Hire PUST Talent
            </h2>
            <p
              className="text-sm max-w-md"
              style={{
                color: `rgba(255,255,255,0.55)`,
              }}
            >
              Post a job or internship and reach 22,400+ PUST alumni and 4,200+
              active students instantly.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <button
              className="text-sm font-bold px-8 py-3 hover:opacity-90 transition-opacity"
              style={{
                background: `#F59E0B`,
                color: `#1a1a1a`,
              }}
            >
              Post a Job →
            </button>
            <button
              className="text-sm font-semibold text-white px-8 py-3 border hover:bg-white/10 transition-colors"
              style={{
                borderColor: `rgba(255,255,255,0.3)`,
              }}
            >
              View Employer Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
