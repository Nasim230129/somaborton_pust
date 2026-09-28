import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  pa,
  ma,
  ha,
  ga,
  Sa,
  Ia,
  La,
  za,
  Ba,
  Ha,
  Ua,
  Wa,
  Ka,
  qa,
  Ja,
  Ya,
  Xa,
  Za,
  Qa,
} from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";

var ro = [Ia, La, za, Ba, Ha, Wa, Xa, qa, Ja, Qa, Ua, Za, Ya, Ka],
  ao = [
    {
      key: `All`,
      label: `All Members`,
      color: `#475569`,
      bg: `#F1F5F9`,
    },
    {
      key: `Alumni`,
      label: `Alumni`,
      color: `#1B4F8A`,
      bg: `#DBEAFE`,
    },
    {
      key: `Students`,
      label: `Students`,
      color: `#006B3F`,
      bg: `#DCFCE7`,
    },
    {
      key: `Faculty`,
      label: `Faculty`,
      color: `#7C3AED`,
      bg: `#F3E8FF`,
    },
    {
      key: `Employers`,
      label: `Employers`,
      color: `#D97706`,
      bg: `#FEF3C7`,
    },
  ],
  oo = {
    alumni: `linear-gradient(135deg,#1B4F8A,#133970)`,
    student: `linear-gradient(135deg,#006B3F,#004D2C)`,
    faculty: `linear-gradient(135deg,#7C3AED,#5B21B6)`,
    employer: `linear-gradient(135deg,#D97706,#B45309)`,
  },
  so = {
    alumni: `#1B4F8A`,
    student: `#006B3F`,
    faculty: `#7C3AED`,
    employer: `#D97706`,
  },
  co = {
    alumni: `Alumni`,
    student: `Student`,
    faculty: `Faculty`,
    employer: `Employer`,
  },
  lo = [
    `All Industries`,
    `Technology`,
    `Energy`,
    `Finance`,
    `Academia`,
    `Infrastructure`,
    `Media`,
    `Research`,
  ],
  uo = [`Relevance`, `Name A–Z`, `Batch (Newest)`, `Connections`];
export default function Directory() {
  useBackendSync();
  let io = [...pa, ...ma, ...ha, ...Sa],
    [e, t] = useState(``),
    [n, r] = useState(`All`),
    [i, a] = useState(`All`),
    [o, s] = useState(`All Industries`),
    [c, l] = useState(false),
    [u, d] = useState(false),
    [f, p] = useState(`grid`),
    [m, h] = useState(`Relevance`),
    [g, _] = useState([]),
    v = io.filter((t) => {
      if (
        (n === `Alumni` && t.role !== `alumni`) ||
        (n === `Students` && t.role !== `student`) ||
        (n === `Faculty` && t.role !== `faculty`) ||
        (n === `Employers` && t.role !== `employer`) ||
        (i !== `All` && !t.dept.toLowerCase().includes(i.toLowerCase())) ||
        (o !== `All Industries` && t.industry !== o) ||
        (c && !t.mentorAvailable) ||
        (u && !t.verified)
      )
        return false;
      if (e) {
        let n = e.toLowerCase();
        return (
          t.name.toLowerCase().includes(n) ||
          t.headline.toLowerCase().includes(n) ||
          t.dept.toLowerCase().includes(n) ||
          (t.company || ``).toLowerCase().includes(n)
        );
      }
      return true;
    }),
    y = (e, t) => {
      t.preventDefault();
      if (!g.includes(e)) {
        api.connectAlumni(e);
      }
      _((t) => (t.includes(e) ? t.filter((t) => t !== e) : [...t, e]));
    };
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
          paddingTop: 64,
          paddingBottom: 56,
        }}
      >
        <img
          src={Ka}
          alt="PUST Alumni Community"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(0,77,44,0.92) 0%, rgba(0,77,44,0.78) 60%, rgba(27,79,138,0.72) 100%)`,
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em] mb-3"
            style={{
              color: `#F59E0B`,
            }}
          >
            PUST Alumni Network
          </p>
          <h1
            className="font-display font-bold text-white mb-4"
            style={{
              fontSize: `clamp(2rem,5vw,3.5rem)`,
            }}
          >
            Connect with the PUST Community
          </h1>
          <p
            className="mb-8 max-w-lg mx-auto text-base"
            style={{
              color: `rgba(255,255,255,0.6)`,
            }}
          >
            Search across 22,400+ alumni, students, and faculty members
            worldwide.
          </p>
          <div className="max-w-2xl mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name, skill, company, department\u2026"
              value={e}
              onChange={(e) => t(e.target.value)}
              className="w-full pl-11 pr-4 py-4 text-sm text-gray-800 outline-none"
              style={{
                border: `none`,
                boxShadow: `0 4px 24px rgba(0,0,0,0.18)`,
              }}
            />
          </div>
          <div className="flex justify-center gap-8 mt-8 flex-wrap">
            {[
              {
                v: `22,400+`,
                l: `Alumni`,
              },
              {
                v: `4,200+`,
                l: `Students`,
              },
              {
                v: `380+`,
                l: `Faculty`,
              },
              {
                v: `600+`,
                l: `Employers`,
              },
            ].map((e, t) => (
              <div key={t} className="text-center">
                <p className="font-display font-bold text-white text-xl leading-none">
                  {e.v}
                </p>
                <p
                  className="text-xs mt-0.5"
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
      <div
        style={{
          background: `#fff`,
          borderBottom: `1px solid #e5e5e5`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {ao.map((e) => (
              <button
                key={e.key}
                onClick={() => r(e.key)}
                className="flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all"
                style={{
                  borderBottomColor: n === e.key ? `#004D2C` : `transparent`,
                  color: n === e.key ? `#004D2C` : `#888`,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background:
                      n === e.key
                        ? so[e.key.toLowerCase()] || `#004D2C`
                        : `#ddd`,
                  }}
                />
                {e.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div
          className="mb-6 p-4"
          style={{
            background: `#fff`,
            border: `1px solid #e5e5e5`,
          }}
        >
          <div className="flex flex-wrap gap-1.5 mb-3">
            <button
              onClick={() => a(`All`)}
              className="px-3 py-1 text-[11px] font-bold transition-all"
              style={{
                background: i === `All` ? `#004D2C` : `transparent`,
                color: i === `All` ? `#fff` : `#555`,
                border: `1.5px solid`,
                borderColor: i === `All` ? `#004D2C` : `#ddd`,
              }}
            >
              All Departments
            </button>
          </div>
          {[
            `Engineering & Technology`,
            `Science`,
            `Business Studies`,
            `Humanities & Social Science`,
            `Life & Earth Science`,
          ].map((e) => {
            let t = ga.filter((t) => t.faculty === e),
              n = {
                "Engineering & Technology": `#1B4F8A`,
                Science: `#006B3F`,
                "Business Studies": `#D97706`,
                "Humanities & Social Science": `#7C3AED`,
                "Life & Earth Science": `#059669`,
              };
            return (
              <div key={e} className="mb-2 last:mb-0">
                <p
                  className="text-[9px] font-bold uppercase tracking-widest mb-1.5"
                  style={{
                    color: n[e],
                  }}
                >
                  {e}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {t.map((t) => (
                    <button
                      key={t.code}
                      onClick={() => a(t.code)}
                      className="px-2.5 py-1 text-[11px] font-semibold transition-all"
                      style={{
                        background: i === t.code ? n[e] : `transparent`,
                        color: i === t.code ? `#fff` : `#555`,
                        border: `1.5px solid`,
                        borderColor: i === t.code ? n[e] : `#ddd`,
                      }}
                    >
                      {t.icon} {t.code}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-52 flex-shrink-0 space-y-4">
            <div
              style={{
                background: `#fff`,
                border: `1px solid #e5e5e5`,
              }}
              className="p-4"
            >
              <h3
                className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-3"
                style={{
                  borderBottom: `2px solid #004D2C`,
                  paddingBottom: 8,
                }}
              >
                Industry
              </h3>
              <select
                className="w-full text-sm py-1.5 px-2 outline-none"
                style={{
                  border: `1px solid #ddd`,
                  color: `#555`,
                }}
                value={o}
                onChange={(e) => s(e.target.value)}
              >
                {lo.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </div>
            <div
              style={{
                background: `#fff`,
                border: `1px solid #e5e5e5`,
              }}
              className="p-4 space-y-3"
            >
              <h3
                className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-3"
                style={{
                  borderBottom: `2px solid #004D2C`,
                  paddingBottom: 8,
                }}
              >
                Options
              </h3>
              {[
                {
                  label: `Mentor Available`,
                  val: c,
                  set: l,
                },
                {
                  label: `Verified Only`,
                  val: u,
                  set: d,
                },
              ].map(({ label: e, val: t, set: n }) => (
                <label
                  key={e}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <div
                    onClick={() => n(!t)}
                    className="w-9 h-5 rounded-full transition-colors flex items-center flex-shrink-0"
                    style={{
                      background: t ? `#006B3F` : `#ddd`,
                    }}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${t ? `translate-x-4` : ``}`}
                    />
                  </div>
                  <span className="text-xs text-[#555]">{e}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => {
                (r(`All`),
                  a(`All`),
                  s(`All Industries`),
                  l(false),
                  d(false),
                  t(``));
              }}
              className="w-full py-2 text-xs font-semibold text-[#555] border border-dashed border-gray-300 hover:border-red-400 hover:text-red-500 transition-colors"
              style={{
                background: `#fff`,
              }}
            >
              Clear All Filters
            </button>
          </aside>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <p className="text-sm text-[#888]">
                <span className="font-bold text-[#1a1a1a]">{v.length}</span>
                {" members found"}
              </p>
              <div className="flex items-center gap-2">
                <select
                  className="text-xs py-1.5 px-2 outline-none"
                  style={{
                    border: `1px solid #ddd`,
                    color: `#555`,
                    background: `#fff`,
                  }}
                  value={m}
                  onChange={(e) => h(e.target.value)}
                >
                  {uo.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
                <div className="flex border border-gray-300 overflow-hidden">
                  {[`grid`, `list`].map((e) => (
                    <button
                      key={e}
                      onClick={() => p(e)}
                      className="px-3 py-1.5 text-sm transition-colors"
                      style={{
                        background: f === e ? `#004D2C` : `#fff`,
                        color: f === e ? `#fff` : `#888`,
                      }}
                    >
                      {e === `grid` ? `⊞` : `☰`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {v.length === 0 ? (
              <div
                className="text-center py-20"
                style={{
                  background: `#fff`,
                  border: `1px solid #e5e5e5`,
                }}
              >
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="font-display font-bold text-[#1a1a1a] text-xl mb-1">
                  No Results Found
                </h3>
                <p className="text-sm text-[#888]">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : f === `grid` ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {v.map((e, t) => {
                  let n = g.includes(e.id),
                    r = ro[t % ro.length];
                  return (
                    <Link
                      key={e.id}
                      to={`/alumni/${e.id}`}
                      className="group block"
                      style={{
                        background: `#fff`,
                        border: `1px solid #e5e5e5`,
                        transition: `box-shadow 0.2s, transform 0.2s`,
                      }}
                      onMouseOver={(e) => {
                        ((e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.12)`),
                          (e.currentTarget.style.transform = `translateY(-2px)`));
                      }}
                      onMouseOut={(e) => {
                        ((e.currentTarget.style.boxShadow = `none`),
                          (e.currentTarget.style.transform = `translateY(0)`));
                      }}
                    >
                      <div
                        className="relative overflow-hidden"
                        style={{
                          height: 88,
                        }}
                      >
                        <img
                          src={r}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: oo[e.role] || oo.alumni,
                            opacity: 0.82,
                          }}
                        />
                        {e.verified && (
                          <span
                            className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white z-10"
                            style={{
                              background: `rgba(255,255,255,0.25)`,
                              border: `1.5px solid rgba(255,255,255,0.5)`,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <div
                        className="flex justify-center"
                        style={{
                          marginTop: -36,
                        }}
                      >
                        <div className="relative">
                          <img
                            src={e.avatar}
                            alt={e.name}
                            className="rounded-full object-cover"
                            style={{
                              width: 72,
                              height: 72,
                              border: `3px solid #fff`,
                              boxShadow: `0 4px 16px rgba(0,0,0,0.18)`,
                            }}
                          />
                          {e.mentorAvailable && (
                            <span
                              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px]"
                              style={{
                                background: `#006B3F`,
                                color: `#fff`,
                                border: `2px solid #fff`,
                              }}
                            >
                              🎯
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-center mt-2">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5"
                          style={{
                            background: so[e.role] + `18`,
                            color: so[e.role],
                          }}
                        >
                          {co[e.role] || e.role}
                        </span>
                      </div>
                      <div className="px-4 pt-2 pb-5 text-center">
                        <h3 className="font-display font-bold text-[#1a1a1a] text-base leading-snug group-hover:text-[#004D2C] transition-colors">
                          {e.name}
                        </h3>
                        <p
                          className="text-xs text-[#666] mt-1 leading-snug"
                          style={{
                            display: `-webkit-box`,
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: `vertical`,
                            overflow: `hidden`,
                          }}
                        >
                          {e.headline}
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-2.5 text-[10px] text-[#aaa]">
                          <span>
                            {"\uD83D\uDCCD "}
                            {e.location.split(`,`)[0]}
                          </span>
                          {e.batch && (
                            <span>
                              {"\xB7 Batch "}
                              {e.batch}
                            </span>
                          )}
                        </div>
                        {e.skills && e.skills.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1 mt-3">
                            {e.skills.slice(0, 3).map((e) => (
                              <span
                                key={e}
                                className="text-[9px] font-semibold px-2 py-0.5"
                                style={{
                                  background: `#F1F5F9`,
                                  color: `#475569`,
                                }}
                              >
                                {e}
                              </span>
                            ))}
                            {e.skills.length > 3 && (
                              <span
                                className="text-[9px] font-semibold px-2 py-0.5"
                                style={{
                                  background: `#F1F5F9`,
                                  color: `#94A3B8`,
                                }}
                              >
                                +{e.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={(t) => y(e.id, t)}
                            className="flex-1 py-2 text-xs font-bold transition-all"
                            style={{
                              background: n ? `#E8F5EE` : `#004D2C`,
                              color: n ? `#006B3F` : `#fff`,
                              border: n ? `1.5px solid #006B3F` : `none`,
                            }}
                          >
                            {n ? `✓ Connected` : `Connect`}
                          </button>
                          <span
                            className="flex-1 py-2 text-xs font-semibold text-center transition-colors"
                            style={{
                              background: `#F5F7FA`,
                              color: `#475569`,
                              border: `1.5px solid #e5e5e5`,
                            }}
                          >
                            View Profile
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {v.map((e) => {
                  let t = g.includes(e.id);
                  return (
                    <Link
                      key={e.id}
                      to={`/alumni/${e.id}`}
                      className="flex items-center gap-4 p-4 group"
                      style={{
                        background: `#fff`,
                        border: `1px solid #e5e5e5`,
                        transition: `border-color 0.15s`,
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.borderColor = `#004D2C`)
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.borderColor = `#e5e5e5`)
                      }
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={e.avatar}
                          alt={e.name}
                          className="rounded-full object-cover"
                          style={{
                            width: 56,
                            height: 56,
                            border: `3px solid ${so[e.role] || `#ddd`}`,
                          }}
                        />
                        {e.verified && (
                          <span
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                            style={{
                              background: `#006B3F`,
                              border: `1.5px solid #fff`,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-[#1a1a1a] text-sm group-hover:text-[#004D2C] transition-colors">
                            {e.name}
                          </h3>
                          <span
                            className="text-[9px] font-bold px-2 py-0.5"
                            style={{
                              background: so[e.role] + `18`,
                              color: so[e.role],
                            }}
                          >
                            {co[e.role] || e.role}
                          </span>
                          {e.mentorAvailable && (
                            <span
                              className="text-[9px] font-bold px-2 py-0.5"
                              style={{
                                background: `#DCFCE7`,
                                color: `#15803D`,
                              }}
                            >
                              🎯 Mentor
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#666] mt-0.5 truncate">
                          {e.headline}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-[#aaa] mt-1">
                          <span>
                            {"\uD83C\uDFDB\uFE0F "}
                            {e.dept.split(` `)[0]}
                          </span>
                          {e.batch && (
                            <span>
                              {"\xB7 Batch "}
                              {e.batch}
                            </span>
                          )}
                          <span>
                            {"\xB7 \uD83D\uDCCD "}
                            {e.location}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-wrap gap-1 max-w-[140px]">
                        {(e.skills || []).slice(0, 2).map((e) => (
                          <span
                            key={e}
                            className="text-[9px] font-semibold px-2 py-0.5"
                            style={{
                              background: `#F1F5F9`,
                              color: `#475569`,
                            }}
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                      <div className="flex-shrink-0 hidden sm:flex items-center gap-2">
                        <button
                          onClick={(t) => y(e.id, t)}
                          className="px-3 py-1.5 text-xs font-bold transition-all"
                          style={{
                            background: t ? `#E8F5EE` : `#004D2C`,
                            color: t ? `#006B3F` : `#fff`,
                          }}
                        >
                          {t ? `✓ Connected` : `Connect`}
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            {v.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {[1, 2, 3, `…`, 8].map((e, t) => (
                  <button
                    key={t}
                    className="w-9 h-9 text-sm font-medium transition-colors"
                    style={{
                      background: e === 1 ? `#004D2C` : `#fff`,
                      color: e === 1 ? `#fff` : `#666`,
                      border: `1px solid #e5e5e5`,
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
