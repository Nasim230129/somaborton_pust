import React, { useState } from "react";
import { api } from "../../services/api";
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
  let [e, t] = useState(0),
    [n, r] = useState(`৳ 1,000`),
    [i, a] = useState(``),
    [o, s] = useState(``),
    [c, l] = useState(``),
    [u, d] = useState(false),
    f = Wo[e];
  Math.round((f.raised / f.goal) * 100);
  let p = n === `Custom` ? `৳ ${i || `—`}` : n;
  return u ? (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: `#f2f2f2`,
      }}
    >
      <div
        className="w-full max-w-md overflow-hidden"
        style={{
          background: `#fff`,
          border: `1px solid #e5e5e5`,
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            height: 120,
          }}
        >
          <img
            src={f.img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg,${f.from}E6,${f.to}CC)`,
            }}
          />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{
                background: `rgba(255,255,255,0.20)`,
                border: `2px solid rgba(255,255,255,0.4)`,
              }}
            >
              ✅
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <h2 className="font-display font-bold text-2xl text-[#1a1a1a] mb-2">
            Thank You!
          </h2>
          <p
            className="text-sm mb-5"
            style={{
              color: `#555`,
            }}
          >
            {"Your donation of "}
            <span
              className="font-bold"
              style={{
                color: f.from,
              }}
            >
              {p}
            </span>
            {" to the"}{" "}
            <span className="font-bold text-[#1a1a1a]">{f.title}</span>
            {" has been received."}
          </p>
          <div
            className="p-4 mb-6 text-xs"
            style={{
              background: `#F0FDF4`,
              border: `1px solid #BBF7D0`,
              color: `#166534`,
            }}
          >
            A receipt has been sent to your email address.
          </div>
          <button
            onClick={() => d(false)}
            className="w-full py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{
              background: f.from,
            }}
          >
            Make Another Donation
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div
      className="min-h-screen"
      style={{
        background: `#f2f2f2`,
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: `clamp(300px,44vh,460px)`,
        }}
      >
        <img
          src={Ka}
          alt="Give Back to PUST"
          className="absolute inset-0 w-full h-full object-cover object-top scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(120deg,rgba(0,77,44,0.93) 0%,rgba(27,79,138,0.78) 60%,rgba(0,77,44,0.68) 100%)`,
          }}
        />
        <div
          className="absolute top-8 right-16 w-52 h-52 rounded-full opacity-8"
          style={{
            border: `1.5px solid rgba(255,255,255,0.18)`,
          }}
        />
        <div
          className="absolute bottom-14 left-10 w-24 h-24 rounded-full opacity-8"
          style={{
            border: `1px solid #F59E0B55`,
          }}
        />
        <div
          className="absolute bottom-10 right-32 w-16 h-16 opacity-10"
          style={{
            border: `1.5px solid rgba(255,255,255,0.25)`,
            transform: `rotate(45deg)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 56,
          }}
        >
          <svg
            viewBox="0 0 1440 56"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <polygon points="0,56 1440,8 1440,56" fill="#f2f2f2" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-14 pb-22">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.28em] mb-3"
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
            Give Back to PUST
          </h1>
          <p
            className="text-sm sm:text-base max-w-lg mb-0"
            style={{
              color: `rgba(255,255,255,0.62)`,
            }}
          >
            Your contribution — however large or small — creates scholarships,
            funds research, and opens doors for the next generation.
          </p>
        </div>
      </div>
      <div
        style={{
          background: `#1a1a1a`,
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-4 divide-x divide-white/10">
          {Ko.map((e, t) => (
            <div key={t} className="py-5 text-center">
              <p
                className="font-display font-bold text-2xl leading-none"
                style={{
                  color: `#F59E0B`,
                }}
              >
                {e.v}
              </p>
              <p
                className="text-[10px] mt-1.5 uppercase tracking-wider"
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
        style={{
          background: `#fff`,
        }}
        className="py-14"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2"
              style={{
                color: `#006B3F`,
              }}
            >
              Your Impact
            </p>
            <h2
              className="font-display font-bold text-[#1a1a1a]"
              style={{
                fontSize: `clamp(1.6rem,3.5vw,2.4rem)`,
              }}
            >
              How Your Donation Helps
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {qo.map((e, t) => {
              let n = [
                {
                  from: `#1B4F8A`,
                  to: `#0D3666`,
                },
                {
                  from: `#D97706`,
                  to: `#B45309`,
                },
                {
                  from: `#7C3AED`,
                  to: `#5B21B6`,
                },
                {
                  from: `#004D2C`,
                  to: `#006B3F`,
                },
              ][t];
              return (
                <div
                  key={t}
                  className="group overflow-hidden"
                  style={{
                    border: `1px solid #e5e5e5`,
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      height: 130,
                    }}
                  >
                    <img
                      src={e.img}
                      alt={e.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(160deg,${n.from}CC,${n.to}E6)`,
                      }}
                    />
                    <div className="relative z-10 flex items-end h-full p-4">
                      <p className="font-display font-bold text-white text-sm leading-snug">
                        {e.title}
                      </p>
                    </div>
                  </div>
                  <div
                    className="p-4"
                    style={{
                      borderTop: `3px solid ${n.from}`,
                    }}
                  >
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
              );
            })}
          </div>
        </div>
      </div>
      <div
        className="flex overflow-hidden"
        style={{
          height: 68,
        }}
      >
        {[
          Ia,
          La,
          Ra,
          za,
          Ba,
          Va,
          Ha,
          Ka,
          Wa,
          Xa,
          qa,
          Ja,
          Qa,
          Ua,
          Za,
          Ya,
          Ga,
        ].map((e, t) => (
          <div key={t} className="flex-1 relative overflow-hidden group">
            <img
              src={e}
              alt=""
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: [
                  `#004D2C`,
                  `#1B4F8A`,
                  `#7C3AED`,
                  `#D97706`,
                  `#059669`,
                  `#0891B2`,
                  `#004D2C`,
                ][t],
              }}
            />
          </div>
        ))}
      </div>
      <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 min-w-0">
          <h2
            className="font-display font-bold text-[#1a1a1a] mb-6"
            style={{
              fontSize: `clamp(1.3rem,3vw,1.8rem)`,
            }}
          >
            Choose a Cause
          </h2>
          <div className="space-y-3">
            {Wo.map((n, r) => {
              let i = e === r,
                a = Math.round((n.raised / n.goal) * 100);
              return (
                <button
                  key={r}
                  onClick={() => t(r)}
                  className="w-full text-left overflow-hidden group transition-all"
                  style={{
                    background: `#fff`,
                    border: `2px solid ${i ? n.from : `#e5e5e5`}`,
                    boxShadow: i ? `0 4px 20px ${n.from}22` : `none`,
                    transform: i ? `translateY(-1px)` : `none`,
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      height: 56,
                    }}
                  >
                    <img
                      src={n.img}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(120deg,${n.from}D9,${n.to}BB)`,
                      }}
                    />
                    <div
                      className="absolute bottom-0 right-0 overflow-hidden"
                      style={{
                        width: 70,
                        height: 56,
                      }}
                    >
                      <svg viewBox="0 0 70 56" className="w-full h-full">
                        <polygon
                          points="70,0 70,56 0,56"
                          fill="rgba(255,255,255,0.07)"
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex items-center px-4 gap-3">
                      <span className="text-2xl">{n.icon}</span>
                      <p className="text-white font-bold text-sm">{n.title}</p>
                      {i && (
                        <span
                          className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            background: `#fff`,
                            color: n.from,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p
                      className="text-xs leading-relaxed mb-3"
                      style={{
                        color: `#666`,
                      }}
                    >
                      {n.desc}
                    </p>
                    <div
                      className="flex justify-between text-[10px] mb-1.5"
                      style={{
                        color: `#aaa`,
                      }}
                    >
                      <span>
                        {"\u09F3 "}
                        {(n.raised / 1e5).toFixed(1)}L raised
                      </span>
                      <span>
                        {n.donors}
                        {" donors \xB7 "}
                        {a}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: `#f0f0f0`,
                      }}
                    >
                      <div
                        style={{
                          width: `${a}%`,
                          height: 4,
                          background: `linear-gradient(to right,${n.from},${n.to})`,
                          transition: `width 0.6s`,
                        }}
                      />
                    </div>
                    <p
                      className="text-[10px] mt-1"
                      style={{
                        color: `#bbb`,
                      }}
                    >
                      {"Goal: \u09F3 "}
                      {(n.goal / 1e5).toFixed(0)}L
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="lg:w-[360px] flex-shrink-0 sticky top-[86px]">
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
                height: 100,
              }}
            >
              <img
                src={f.img}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(120deg,${f.from}E6,${f.to}CC)`,
                }}
              />
              <div
                className="absolute top-0 right-0 overflow-hidden"
                style={{
                  width: 80,
                  height: 100,
                }}
              >
                <svg viewBox="0 0 80 100" className="w-full h-full">
                  <polygon
                    points="80,0 80,100 0,0"
                    fill="rgba(255,255,255,0.06)"
                  />
                </svg>
              </div>
              <div className="relative z-10 p-5">
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                  style={{
                    color: `rgba(255,255,255,0.6)`,
                  }}
                >
                  Donating to
                </p>
                <p className="font-display font-bold text-white text-base leading-snug">
                  {f.title}
                </p>
              </div>
            </div>
            <div className="p-6">
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-3"
                style={{
                  color: `#888`,
                }}
              >
                Select Amount
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {Go.map((e) => (
                  <button
                    key={e}
                    onClick={() => r(e)}
                    className="py-2.5 text-xs font-bold transition-all"
                    style={
                      n === e
                        ? {
                            background: f.from,
                            color: `#fff`,
                            border: `1.5px solid ${f.from}`,
                          }
                        : {
                            background: `transparent`,
                            color: `#555`,
                            border: `1.5px solid #e0e0e0`,
                          }
                    }
                  >
                    {e}
                  </button>
                ))}
              </div>
              {n === `Custom` && (
                <div
                  className="flex mb-4 overflow-hidden"
                  style={{
                    border: `1.5px solid #e0e0e0`,
                  }}
                >
                  <span
                    className="flex items-center px-3 text-sm font-bold flex-shrink-0"
                    style={{
                      background: `#f9f9f9`,
                      color: `#555`,
                      borderRight: `1px solid #e0e0e0`,
                    }}
                  >
                    ৳
                  </span>
                  <input
                    className="flex-1 px-3 py-2.5 text-sm outline-none"
                    placeholder="Enter amount"
                    value={i}
                    onChange={(e) => a(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-3 mb-5">
                {[
                  {
                    label: `Full Name`,
                    type: `text`,
                    ph: `Your full name`,
                    val: o,
                    set: s,
                  },
                  {
                    label: `Email`,
                    type: `email`,
                    ph: `your@email.com`,
                    val: c,
                    set: l,
                  },
                ].map((e) => (
                  <div key={e.label}>
                    <label
                      className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
                      style={{
                        color: `#888`,
                      }}
                    >
                      {e.label}
                    </label>
                    <input
                      type={e.type}
                      placeholder={e.ph}
                      value={e.val}
                      onChange={(t) => e.set(t.target.value)}
                      className="w-full px-4 py-2.5 text-sm outline-none transition-all"
                      style={{
                        border: `1.5px solid #e0e0e0`,
                        background: `#fafafa`,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = f.from;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = `#e0e0e0`;
                      }}
                    />
                  </div>
                ))}
              </div>
              <div
                className="p-4 mb-5"
                style={{
                  background: `#FAFAF9`,
                  border: `1px solid #e5e5e5`,
                }}
              >
                <p className="text-xs font-bold text-[#1a1a1a] mb-2">
                  Payment Options
                </p>
                <div
                  className="space-y-1 text-xs"
                  style={{
                    color: `#666`,
                  }}
                >
                  <p>
                    {"\uD83D\uDCF1 bKash / Nagad: "}
                    <span className="font-bold text-[#1a1a1a]">
                      01700-000000
                    </span>
                  </p>
                  <p>🏦 Bank: Dutch-Bangla Bank · A/C: 1011 0000 0000</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const numericAmt =
                    Number(String(p).replace(/[^0-9]/g, "")) || 1000;
                  api.submitDonation({
                    campaign: f.title,
                    amount: numericAmt,
                    donorName: o || "PUST Alumni",
                    donorEmail: c,
                  });
                  d(true);
                }}
                className="w-full py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 mb-3"
                style={{
                  background: f.from,
                }}
              >
                {"Confirm Donation \u2014 "}
                {p}
                {" \u2192"}
              </button>
              <p
                className="text-center text-[10px]"
                style={{
                  color: `#aaa`,
                }}
              >
                🔒 Secure & 100% Tax Exempt
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col lg:flex-row overflow-hidden"
        style={{
          minHeight: 220,
        }}
      >
        <div
          className="lg:w-2/5 relative overflow-hidden"
          style={{
            minHeight: 160,
          }}
        >
          <img
            src={Qa}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `rgba(0,0,0,0.38)`,
            }}
          />
          <div
            className="absolute inset-y-0 right-0 overflow-hidden hidden lg:block"
            style={{
              width: 56,
            }}
          >
            <svg
              viewBox="0 0 56 300"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <polygon points="56,0 56,300 0,300" fill="#004D2C" />
            </svg>
          </div>
        </div>
        <div
          className="flex-1 flex flex-col justify-center px-10 py-12"
          style={{
            background: `#004D2C`,
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{
              color: `#6EE7B7`,
            }}
          >
            Every Taka Matters
          </p>
          <h2
            className="font-display font-bold text-white mb-3"
            style={{
              fontSize: `clamp(1.5rem,3vw,2.2rem)`,
            }}
          >
            Be Part of the Change
          </h2>
          <p
            className="text-sm mb-6 max-w-md"
            style={{
              color: `rgba(255,255,255,0.55)`,
            }}
          >
            Join 3,810+ donors who believe in the power of PUST education to
            transform lives across Bangladesh and beyond.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                window.scrollTo({
                  top: 600,
                  behavior: `smooth`,
                })
              }
              className="text-sm font-bold px-8 py-3 hover:opacity-90 transition-opacity"
              style={{
                background: `#F59E0B`,
                color: `#1a1a1a`,
              }}
            >
              Donate Now →
            </button>
            <button
              className="text-sm font-semibold text-white px-8 py-3 border hover:bg-white/10 transition-colors"
              style={{
                borderColor: `rgba(255,255,255,0.35)`,
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
