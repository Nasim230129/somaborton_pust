import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ya,
  O,
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
import { useBackendSync } from "../../services/api";

var go = {
    "Career Journey": {
      from: `#1B4F8A`,
      to: `#0D3666`,
      light: `#DBEAFE`,
      text: `#1B4F8A`,
    },
    "Social Impact": {
      from: `#006B3F`,
      to: `#004D2C`,
      light: `#DCFCE7`,
      text: `#006B3F`,
    },
    Academia: {
      from: `#7C3AED`,
      to: `#5B21B6`,
      light: `#F3E8FF`,
      text: `#7C3AED`,
    },
    All: {
      from: `#004D2C`,
      to: `#1B4F8A`,
      light: `#F0FDF4`,
      text: `#004D2C`,
    },
  },
  _o = [Ha, Ia, Va, Wa, Ua, Qa, qa],
  vo = [
    {
      photo: La,
      cat: `Achievement`,
      title: `PUST Alumni Award Night 2026`,
      sub: `Celebrating excellence across industries`,
    },
    {
      photo: za,
      cat: `Development`,
      title: `Faculty Training: Modern Pedagogy`,
      sub: `Building the next generation of educators`,
    },
    {
      photo: Ba,
      cat: `Technology`,
      title: `National Programming Contest at PUST`,
      sub: `Students competing at national level`,
    },
    {
      photo: Ra,
      cat: `Leadership`,
      title: `VC's Vision for PUST 2030`,
      sub: `Shaping the future of public universities`,
    },
  ],
  yo = [`All`, `Career Journey`, `Social Impact`, `Academia`];
export default function Stories() {
  useBackendSync();
  let [e, t] = useState(`All`),
    n = e === `All` ? ya : ya.filter((t) => t.category === e);
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
          src={Ka}
          alt="PUST Campus"
          className="absolute inset-0 w-full h-full object-cover object-top scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(120deg,rgba(0,77,44,0.93) 0%,rgba(27,79,138,0.80) 55%,rgba(124,58,237,0.65) 100%)`,
          }}
        />
        <div
          className="absolute top-10 right-20 w-56 h-56 rounded-full opacity-8"
          style={{
            border: `1.5px solid rgba(255,255,255,0.18)`,
          }}
        />
        <div
          className="absolute top-20 right-32 w-32 h-32 rounded-full opacity-6"
          style={{
            border: `1px solid #F59E0B44`,
          }}
        />
        <div
          className="absolute bottom-16 left-12 w-20 h-20 opacity-10"
          style={{
            border: `1.5px solid rgba(255,255,255,0.3)`,
            transform: `rotate(45deg)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 60,
          }}
        >
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <polygon points="0,60 1440,10 1440,60" fill="#f2f2f2" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 pb-24">
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
              fontSize: `clamp(2.2rem,6vw,4.2rem)`,
              lineHeight: 1.1,
            }}
          >
            Inspiring Journeys
          </h1>
          <p
            className="text-sm sm:text-base max-w-lg"
            style={{
              color: `rgba(255,255,255,0.62)`,
            }}
          >
            Read how PUST graduates are changing industries, leading
            organizations, and making a difference across the world.
          </p>
        </div>
      </div>
      <div
        style={{
          background: `#1a1a1a`,
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-4 divide-x divide-white/10">
          {[
            {
              v: `${ya.length * 140}+`,
              l: `Stories Published`,
            },
            {
              v: `45`,
              l: `Countries Featured`,
            },
            {
              v: `12`,
              l: `Award Winners`,
            },
            {
              v: `94%`,
              l: `Reader Rating`,
            },
          ].map((e, t) => (
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
        style={{
          background: `#fff`,
        }}
        className="py-14"
      >
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em] mb-8 inline-block pb-2"
            style={{
              color: `#004D2C`,
              borderBottom: `2px solid #004D2C`,
            }}
          >
            Featured Story
          </p>
          <div
            className="flex flex-col lg:flex-row overflow-hidden"
            style={{
              border: `1px solid #e5e5e5`,
            }}
          >
            <div
              className="relative lg:w-[480px] flex-shrink-0 overflow-hidden"
              style={{
                minHeight: 340,
              }}
            >
              <img
                src={Ha}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg,rgba(0,77,44,0.30) 0%,rgba(0,0,0,0.70) 100%)`,
                }}
              />
              <div
                className="absolute inset-6 overflow-hidden"
                style={{
                  border: `3px solid rgba(255,255,255,0.18)`,
                }}
              >
                <img
                  src={ya[0].img}
                  alt={ya[0].title}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="absolute top-6 left-6 z-10">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5"
                  style={{
                    background: `#F59E0B`,
                    color: `#1a1a1a`,
                  }}
                >
                  ★ Featured
                </span>
              </div>
              <div className="absolute bottom-6 right-6 z-10">
                <span
                  className="text-[10px] font-bold px-3 py-1.5"
                  style={{
                    background: `rgba(255,255,255,0.15)`,
                    color: `#fff`,
                    border: `1px solid rgba(255,255,255,0.3)`,
                  }}
                >
                  {ya[0].readTime}
                  {" read"}
                </span>
              </div>
            </div>
            <div
              className="flex-1 p-8 sm:p-10 flex flex-col justify-center"
              style={{
                borderLeft: `none`,
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-widest mb-3 inline-block"
                style={{
                  color: go[ya[0].category]?.text ?? `#004D2C`,
                }}
              >
                {ya[0].category}
              </span>
              <h2
                className="font-display font-bold text-[#1a1a1a] leading-tight mb-4"
                style={{
                  fontSize: `clamp(1.3rem,3vw,2rem)`,
                }}
              >
                {ya[0].title}
              </h2>
              <div
                className="mb-5 pl-4"
                style={{
                  borderLeft: `3px solid #F59E0B`,
                }}
              >
                <p
                  className="text-sm leading-relaxed italic"
                  style={{
                    color: `#555`,
                  }}
                >
                  "{ya[0].excerpt}"
                </p>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={ya[0].author.avatar}
                  alt={ya[0].author.name}
                  className="w-11 h-11 rounded-full object-cover"
                  style={{
                    border: `2px solid #e5e5e5`,
                  }}
                />
                <div>
                  <p className="font-bold text-[#1a1a1a] text-sm">
                    {ya[0].author.name}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{
                      color: `#aaa`,
                    }}
                  >
                    {ya[0].author.batch
                      ? `Batch ${ya[0].author.batch}`
                      : ya[0].author.dept}
                    {"\xA0\xB7\xA0"}
                    {ya[0].date}
                  </p>
                </div>
              </div>
              <Link
                to="/stories"
                className="self-start text-sm font-bold px-7 py-3 transition-opacity hover:opacity-85"
                style={{
                  background: `#004D2C`,
                  color: `#fff`,
                }}
              >
                Read Full Story →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex overflow-hidden"
        style={{
          height: 72,
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
              className="absolute inset-0 opacity-65"
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
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex gap-1.5 flex-wrap">
            {yo.map((n) => {
              let r = go[n] ?? go.All,
                i = e === n;
              return (
                <button
                  key={n}
                  onClick={() => t(n)}
                  className="px-5 py-2 text-xs font-bold transition-all"
                  style={{
                    background: i ? r.from : `#fff`,
                    color: i ? `#fff` : `#555`,
                    border: `1.5px solid ${i ? r.from : `#ddd`}`,
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <p
            className="text-xs"
            style={{
              color: `#aaa`,
            }}
          >
            <span className="font-bold text-[#1a1a1a]">{n.length}</span>
            {" stories"}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {n.map((e, t) => {
            let n = go[e.category] ?? go.All,
              r = _o[t % _o.length];
            return (
              <article
                key={e.id}
                className="group overflow-hidden cursor-pointer transition-all"
                style={{
                  background: `#fff`,
                  border: `1px solid #e5e5e5`,
                }}
                onMouseOver={(e) => {
                  ((e.currentTarget.style.boxShadow = `0 8px 32px ${n.from}22`),
                    (e.currentTarget.style.transform = `translateY(-4px)`));
                }}
                onMouseOut={(e) => {
                  ((e.currentTarget.style.boxShadow = `none`),
                    (e.currentTarget.style.transform = `none`));
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: 200,
                  }}
                >
                  <img
                    src={r}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover scale-110"
                  />
                  <img
                    src={e.img}
                    alt={e.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${n.from}E6 0%, transparent 60%)`,
                    }}
                  />
                  <span
                    className="absolute top-4 left-4 text-[9px] font-bold px-2.5 py-1 uppercase tracking-wide"
                    style={{
                      background: n.light,
                      color: n.text,
                    }}
                  >
                    {e.category}
                  </span>
                  <span
                    className="absolute top-4 right-4 text-[9px] font-medium px-2 py-1"
                    style={{
                      background: `rgba(0,0,0,0.40)`,
                      color: `#fff`,
                    }}
                  >
                    {e.readTime}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                    <h3
                      className="font-display font-bold text-white text-sm leading-snug"
                      style={{
                        textShadow: `0 1px 4px rgba(0,0,0,0.5)`,
                      }}
                    >
                      {e.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <div
                    className="h-0.5 mb-4"
                    style={{
                      background: `linear-gradient(to right,${n.from},${n.to})`,
                    }}
                  />
                  <p
                    className="text-xs leading-relaxed mb-4"
                    style={{
                      color: `#666`,
                      display: `-webkit-box`,
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: `vertical`,
                      overflow: `hidden`,
                    }}
                  >
                    {e.excerpt}
                  </p>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={e.author.avatar}
                      alt={e.author.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      style={{
                        border: `2px solid ${n.from}`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1a1a1a] truncate">
                        {e.author.name}
                      </p>
                      <p
                        className="text-[10px] truncate"
                        style={{
                          color: `#aaa`,
                        }}
                      >
                        {e.date}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-bold transition-all group-hover:gap-1"
                      style={{
                        color: n.text,
                      }}
                    >
                      Read →
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mb-2">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em] mb-6 inline-block pb-2"
            style={{
              color: `#004D2C`,
              borderBottom: `2px solid #004D2C`,
            }}
          >
            From the PUST Campus
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vo.map((e, t) => {
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
                  from: `#0891B2`,
                  to: `#0E7490`,
                },
                {
                  from: `#7C3AED`,
                  to: `#5B21B6`,
                },
              ][t];
              return (
                <div
                  key={t}
                  className="group relative overflow-hidden cursor-pointer"
                  style={{
                    height: 180,
                  }}
                >
                  <img
                    src={e.photo}
                    alt={e.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(160deg,${n.from}CC 0%,${n.to}E6 100%)`,
                    }}
                  />
                  <div
                    className="absolute top-0 right-0 overflow-hidden"
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  >
                    <svg viewBox="0 0 60 60" className="w-full h-full">
                      <polygon
                        points="60,0 60,60 0,0"
                        fill="rgba(255,255,255,0.08)"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest mb-1.5 opacity-70"
                      style={{
                        color: `#fff`,
                      }}
                    >
                      {e.cat}
                    </span>
                    <p className="font-display font-bold text-white text-sm leading-snug mb-1">
                      {e.title}
                    </p>
                    <p
                      className="text-[10px]"
                      style={{
                        color: `rgba(255,255,255,0.6)`,
                      }}
                    >
                      {e.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          background: `#1a1a1a`,
        }}
      >
        <img
          src={Qa}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 48,
          }}
        >
          <svg
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <polygon points="0,0 1440,48 0,48" fill="#f2f2f2" />
          </svg>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center mb-12">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{
                color: `#F59E0B`,
              }}
            >
              Hall of Fame
            </p>
            <h2
              className="font-display font-bold text-white"
              style={{
                fontSize: `clamp(1.8rem,4vw,2.8rem)`,
              }}
            >
              Alumni Recognition Awards
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {O.map((e, t) => {
              let n = [
                  {
                    from: `#F59E0B`,
                    to: `#D97706`,
                  },
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
                ],
                r = n[t % n.length];
              return (
                <div
                  key={e.award}
                  className="group text-center p-6 transition-all"
                  style={{
                    background: `rgba(255,255,255,0.05)`,
                    border: `1px solid rgba(255,255,255,0.09)`,
                  }}
                  onMouseOver={(e) => {
                    ((e.currentTarget.style.background = `rgba(255,255,255,0.09)`),
                      (e.currentTarget.style.transform = `translateY(-3px)`));
                  }}
                  onMouseOut={(e) => {
                    ((e.currentTarget.style.background = `rgba(255,255,255,0.05)`),
                      (e.currentTarget.style.transform = `none`));
                  }}
                >
                  <div className="relative inline-block mb-4">
                    <div
                      className="w-[72px] h-[72px] rounded-full p-[3px] mx-auto"
                      style={{
                        background: `linear-gradient(135deg,${r.from},${r.to})`,
                      }}
                    >
                      <img
                        src={e.img}
                        alt={e.name}
                        className="w-full h-full rounded-full object-cover"
                        style={{
                          border: `2px solid #1a1a1a`,
                        }}
                      />
                    </div>
                    <span
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: r.from,
                        color: t === 0 ? `#1a1a1a` : `#fff`,
                      }}
                    >
                      ★
                    </span>
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 block mb-2"
                    style={{
                      background: r.from + `20`,
                      color: r.from,
                    }}
                  >
                    {e.award}
                  </span>
                  <h3 className="font-display font-bold text-white text-sm mb-1">
                    {e.name}
                  </h3>
                  <p
                    className="text-[10px] leading-relaxed mb-2"
                    style={{
                      color: `rgba(255,255,255,0.45)`,
                    }}
                  >
                    {e.desc}
                  </p>
                  <p
                    className="font-bold text-sm"
                    style={{
                      color: r.from,
                    }}
                  >
                    {e.year}
                  </p>
                  <div
                    className="h-0.5 mt-4 mx-2"
                    style={{
                      background: `linear-gradient(to right,${r.from},${r.to})`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className="flex flex-col lg:flex-row overflow-hidden"
        style={{
          minHeight: 240,
        }}
      >
        <div
          className="lg:w-2/5 relative overflow-hidden"
          style={{
            minHeight: 180,
          }}
        >
          <img
            src={Ra}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `rgba(0,0,0,0.45)`,
            }}
          />
          <div
            className="absolute inset-y-0 right-0 overflow-hidden hidden lg:block"
            style={{
              width: 60,
            }}
          >
            <svg
              viewBox="0 0 60 300"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <polygon points="60,0 60,300 0,300" fill="#004D2C" />
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
            Your Turn
          </p>
          <h2
            className="font-display font-bold text-white mb-3"
            style={{
              fontSize: `clamp(1.6rem,3.5vw,2.4rem)`,
            }}
          >
            Share Your Story
          </h2>
          <p
            className="text-sm mb-7 max-w-md"
            style={{
              color: `rgba(255,255,255,0.58)`,
            }}
          >
            Every PUST journey is worth telling. Submit your story and inspire
            thousands of current students and fellow alumni around the world.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              className="text-sm font-bold px-8 py-3 transition-opacity hover:opacity-90"
              style={{
                background: `#F59E0B`,
                color: `#1a1a1a`,
              }}
            >
              Submit Your Story →
            </button>
            <button
              className="text-sm font-semibold text-white px-8 py-3 border transition-colors hover:bg-white/10"
              style={{
                borderColor: `rgba(255,255,255,0.35)`,
              }}
            >
              Browse All Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
