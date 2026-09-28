import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  _a,
  La,
  za,
  Ba,
  Ha,
  Wa,
  Ka,
  qa,
  Ja,
  Xa,
  Qa,
} from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";

var extraEvents = [
    {
      id: 5,
      title: `Freshers' Reception 2026 — Welcome Batch`,
      month: `SEP`,
      day: `28`,
      year: `2026`,
      date: `Sep 28, 2026`,
      time: `10:00 AM – 2:00 PM`,
      location: `PUST Central Ground`,
      city: `Pabna, Bangladesh`,
      type: `Campus`,
      online: false,
      spots: 1200,
      registered: 980,
      img: Ha,
      desc: `Grand welcome ceremony for PUST's newest batch of 1,200 students.`,
      organizer: `PUST Students' Union`,
      tags: [`Campus Life`, `Students`],
    },
    {
      id: 6,
      title: `Alumni Award Ceremony 2026`,
      month: `OCT`,
      day: `12`,
      year: `2026`,
      date: `Oct 12, 2026`,
      time: `6:00 PM – 9:00 PM`,
      location: `PUST Auditorium`,
      city: `Pabna, Bangladesh`,
      type: `Reunion`,
      online: false,
      spots: 400,
      registered: 310,
      img: La,
      desc: `Celebrating outstanding PUST alumni with the Annual Distinguished Alumni Awards.`,
      organizer: `PUST Alumni Association`,
      tags: [`Awards`, `Alumni`],
    },
    {
      id: 7,
      title: `Faculty Training Workshop — Pedagogy 2026`,
      month: `OCT`,
      day: `18`,
      year: `2026`,
      date: `Oct 18, 2026`,
      time: `9:00 AM – 5:00 PM`,
      location: `Faculty Development Center`,
      city: `Pabna, Bangladesh`,
      type: `Webinar`,
      online: false,
      spots: 80,
      registered: 72,
      img: za,
      desc: `Advanced pedagogical training for PUST faculty on modern teaching methodologies.`,
      organizer: `Faculty Development Cell`,
      tags: [`Faculty`, `Training`],
    },
    {
      id: 8,
      title: `Inter-Dept Programming Contest`,
      month: `NOV`,
      day: `08`,
      year: `2026`,
      date: `Nov 8, 2026`,
      time: `8:00 AM – 6:00 PM`,
      location: `CSE Department Labs`,
      city: `Pabna, Bangladesh`,
      type: `Career`,
      online: false,
      spots: 300,
      registered: 240,
      img: Ba,
      desc: `Annual programming competition open to all PUST students and alumni.`,
      organizer: `CSE Department`,
      tags: [`Tech`, `Students`, `Competition`],
    },
  ],
  So = {
    Jan: `JAN`,
    Feb: `FEB`,
    Mar: `MAR`,
    Apr: `APR`,
    May: `MAY`,
    Jun: `JUN`,
    Jul: `JUL`,
    Aug: `AUG`,
    Sep: `SEP`,
    Oct: `OCT`,
    Nov: `NOV`,
    Dec: `DEC`,
  };
function Co(e) {
  if (`month` in e) return e;
  let t = (e.date || `Oct 15, 2026`).split(` `);
  return {
    ...e,
    month: So[t[0]] ?? t[0].toUpperCase(),
    day: t[1]?.replace(`,`, ``) ?? `—`,
    year: t[2] ?? `2026`,
    city: e.location,
    tags: [e.type],
  };
}
var To = [`All Formats`, `In-Person`, `Virtual`],
  Eo = [
    `All Categories`,
    `Reunion`,
    `Career`,
    `Webinar`,
    `Mentorship`,
    `Campus`,
  ],
  Do = [`All Dates`, `Next 7 Days`, `Next 30 Days`, `Next 60 Days`],
  Oo = {
    "In-Person": `#006B3F`,
    Virtual: `#1B4F8A`,
    Online: `#1B4F8A`,
  },
  ko = {
    Reunion: `#7C3AED`,
    Career: `#D97706`,
    Webinar: `#1B4F8A`,
    Mentorship: `#0891B2`,
    Campus: `#059669`,
  };
export default function Events() {
  useBackendSync();
  let [e, t] = useState(``),
    [n, r] = useState(`All Formats`),
    [i, a] = useState(`All Categories`),
    [o, s] = useState(`All Dates`),
    [c, l] = useState(new Set()),
    [u, d] = useState(true),
    [f, p] = useState(true),
    [m, h] = useState(true),
    wo = [..._a, ...extraEvents.filter((ex) => !_a.some((ev) => ev.id === ex.id))].map(Co),
    g = useMemo(
      () =>
        wo.filter(
          (t) =>
            !(
              (e && !t.title.toLowerCase().includes(e.toLowerCase())) ||
              (n === `In-Person` && t.online) ||
              (n === `Virtual` && !t.online) ||
              (i !== `All Categories` && t.type !== i)
            ),
        ),
      [e, n, i, o, wo.length],
    );
  function _(e) {
    if (!c.has(e)) {
      api.registerEvent(e);
    }
    l((t) => {
      let n = new Set(t);
      return (n.has(e) ? n.delete(e) : n.add(e), n);
    });
  }
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
          height: `clamp(300px,45vh,480px)`,
        }}
      >
        <img
          src={Ka}
          alt="PUST Campus Aerial"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(0,77,44,0.80) 0%, rgba(27,79,138,0.60) 60%, rgba(0,0,0,0.55) 100%)`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.26em] mb-3"
            style={{
              color: `#F59E0B`,
            }}
          >
            PUST Alumni Network
          </p>
          <h1
            className="font-display font-bold text-white mb-3"
            style={{
              fontSize: `clamp(2rem,6vw,4rem)`,
              lineHeight: 1.1,
            }}
          >
            Events & Programs
          </h1>
          <p
            className="text-sm sm:text-base mb-8 max-w-md"
            style={{
              color: `rgba(255,255,255,0.65)`,
            }}
          >
            Reunions. Career fairs. Webinars. Workshops. Stay connected through
            events that move you.
          </p>
          <div
            className="w-full max-w-xl flex"
            style={{
              background: `#fff`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.18)`,
            }}
          >
            <input
              type="text"
              placeholder="Search by event name\u2026"
              value={e}
              onChange={(e) => t(e.target.value)}
              className="flex-1 px-5 py-3.5 text-sm text-[#1a1a1a] outline-none"
              style={{
                background: `transparent`,
              }}
            />
            <button
              className="px-6 py-3.5 text-sm font-bold text-white flex-shrink-0 transition-opacity hover:opacity-90"
              style={{
                background: `#004D2C`,
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div
        style={{
          background: `#fff`,
          borderBottom: `1px solid #e5e5e5`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em] mb-6 pb-3"
            style={{
              color: `#004D2C`,
              borderBottom: `2px solid #004D2C`,
              display: `inline-block`,
            }}
          >
            Featured & Upcoming Programs
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                img: Xa,
                label: `All Upcoming Events →`,
                desc: `Browse every in-person and online event open to PUST alumni, students, and faculty.`,
              },
              {
                img: qa,
                label: `Alumni Reunion 2026 →`,
                desc: `Annual reunion bringing together graduates from every batch at the PUST campus.`,
              },
              {
                img: Wa,
                label: `Faculty Workshops →`,
                desc: `Development programs for PUST faculty covering pedagogy, research, and leadership.`,
              },
              {
                img: Qa,
                label: `Career &amp; Tech Events →`,
                desc: `Career fairs, hackathons, and networking events connecting talent with top employers.`,
              },
            ].map((e, t) => (
              <Link
                key={t}
                to="/events"
                className="group block"
                style={{
                  textDecoration: `none`,
                }}
              >
                <div
                  className="overflow-hidden mb-4"
                  style={{
                    height: 160,
                  }}
                >
                  <img
                    src={e.img}
                    alt={e.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p
                  className="font-bold text-sm mb-1.5 group-hover:text-[#006B3F] transition-colors"
                  style={{
                    color: `#004D2C`,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: e.label,
                  }}
                />
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: `#666`,
                  }}
                >
                  {e.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex gap-8 items-start">
        <aside
          className="hidden md:block flex-shrink-0 sticky top-[86px]"
          style={{
            width: 220,
          }}
        >
          <div
            style={{
              background: `#fff`,
              border: `1px solid #e5e5e5`,
            }}
          >
            <div
              className="px-5 py-4"
              style={{
                borderBottom: `1px solid #e5e5e5`,
              }}
            >
              <p className="font-bold text-sm text-[#1a1a1a]">Filter by</p>
            </div>
            <div
              style={{
                borderBottom: `1px solid #e5e5e5`,
              }}
            >
              <button
                className="w-full flex items-center justify-between px-5 py-3.5"
                onClick={() => d(!u)}
              >
                <span className="font-semibold text-xs uppercase tracking-wider text-[#444]">
                  Date
                </span>
                <span className="text-[#888] text-xs">{u ? `▲` : `▼`}</span>
              </button>
              {u && (
                <div className="px-5 pb-4 space-y-2.5">
                  {Do.map((e) => (
                    <label
                      key={e}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: o === e ? `#004D2C` : `#ccc`,
                        }}
                        onClick={() => s(e)}
                      >
                        {o === e && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: `#004D2C`,
                            }}
                          />
                        )}
                      </div>
                      <span className="text-sm text-[#555]">{e}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div
              style={{
                borderBottom: `1px solid #e5e5e5`,
              }}
            >
              <button
                className="w-full flex items-center justify-between px-5 py-3.5"
                onClick={() => p(!f)}
              >
                <span className="font-semibold text-xs uppercase tracking-wider text-[#444]">
                  Format
                </span>
                <span className="text-[#888] text-xs">{f ? `▲` : `▼`}</span>
              </button>
              {f && (
                <div className="px-5 pb-4 space-y-2.5">
                  {To.map((e) => (
                    <label
                      key={e}
                      className="flex items-center gap-2.5 cursor-pointer"
                      onClick={() => r(e)}
                    >
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: n === e ? `#004D2C` : `#ccc`,
                        }}
                      >
                        {n === e && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: `#004D2C`,
                            }}
                          />
                        )}
                      </div>
                      <span className="text-sm text-[#555]">{e}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div>
              <button
                className="w-full flex items-center justify-between px-5 py-3.5"
                onClick={() => h(!m)}
              >
                <span className="font-semibold text-xs uppercase tracking-wider text-[#444]">
                  Category
                </span>
                <span className="text-[#888] text-xs">{m ? `▲` : `▼`}</span>
              </button>
              {m && (
                <div className="px-5 pb-4 space-y-2.5">
                  {Eo.map((e) => (
                    <label
                      key={e}
                      className="flex items-center gap-2.5 cursor-pointer"
                      onClick={() => a(e)}
                    >
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: i === e ? `#004D2C` : `#ccc`,
                        }}
                      >
                        {i === e && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: `#004D2C`,
                            }}
                          />
                        )}
                      </div>
                      <span className="text-sm text-[#555]">{e}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            className="w-full mt-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
            style={{
              border: `1px solid #ccc`,
              color: `#888`,
              background: `#fff`,
            }}
            onClick={() => {
              (t(``), r(`All Formats`), a(`All Categories`), s(`All Dates`));
            }}
          >
            Clear All Filters
          </button>
        </aside>
        <div className="flex-1 min-w-0">
          <div
            className="flex items-center justify-between mb-6 pb-4"
            style={{
              borderBottom: `2px solid #1a1a1a`,
            }}
          >
            <p className="font-bold text-[#1a1a1a]">
              <span className="font-display text-2xl mr-1">{g.length}</span>
              <span className="text-sm text-[#888]">events found</span>
            </p>
            <div className="flex gap-1 md:hidden">
              {To.map((e) => (
                <button
                  key={e}
                  onClick={() => r(e)}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors"
                  style={{
                    background: n === e ? `#004D2C` : `#fff`,
                    color: n === e ? `#fff` : `#555`,
                    border: `1px solid #ddd`,
                  }}
                >
                  {e.replace(`All Formats`, `All`)}
                </button>
              ))}
            </div>
          </div>
          {g.length === 0 ? (
            <div className="text-center py-24 bg-white border border-gray-200">
              <p className="text-5xl mb-4">📅</p>
              <h3 className="font-display font-bold text-[#1a1a1a] text-xl mb-1">
                No Events Found
              </h3>
              <p className="text-sm text-[#888]">
                Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            <div>
              {g.map((e, t) => {
                let n = e,
                  r = c.has(e.id),
                  i = Math.round((e.registered / e.spots) * 100),
                  a = e.online ? `Virtual` : `In-Person`,
                  o = Oo[a] ?? `#555`,
                  s = ko[e.type] ?? `#004D2C`;
                return (
                  <div key={e.id}>
                    <div
                      className="flex gap-6 py-8 group"
                      style={{
                        borderBottom:
                          t < g.length - 1 ? `1px solid #e0e0e0` : `none`,
                      }}
                    >
                      <div
                        className="flex-shrink-0 text-center"
                        style={{
                          width: 56,
                        }}
                      >
                        <p
                          className="text-[11px] font-bold uppercase tracking-widest"
                          style={{
                            color: `#888`,
                          }}
                        >
                          {n.month}
                        </p>
                        <p
                          className="font-display font-bold leading-none"
                          style={{
                            fontSize: `clamp(2rem,5vw,2.8rem)`,
                            color: `#1a1a1a`,
                            lineHeight: 1,
                          }}
                        >
                          {n.day}
                        </p>
                        <p
                          className="text-[10px] mt-1"
                          style={{
                            color: `#aaa`,
                          }}
                        >
                          {n.year}
                        </p>
                        <div
                          className="mt-2 text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide"
                          style={{
                            background: o + `15`,
                            color: o,
                          }}
                        >
                          {a}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5"
                            style={{
                              background: s + `12`,
                              color: s,
                            }}
                          >
                            {e.type}
                          </span>
                          {(n.tags ?? [])
                            .filter((t) => t !== e.type)
                            .map((e) => (
                              <span
                                key={e}
                                className="text-[10px] font-medium px-2 py-0.5"
                                style={{
                                  background: `#f0f0f0`,
                                  color: `#666`,
                                }}
                              >
                                {e}
                              </span>
                            ))}
                        </div>
                        <h2
                          className="font-display font-bold leading-snug mb-2 group-hover:text-[#004D2C] transition-colors"
                          style={{
                            fontSize: `clamp(1rem,2.5vw,1.3rem)`,
                            color: `#1a1a1a`,
                          }}
                        >
                          {e.title}
                          <span
                            className="ml-2 text-sm font-normal"
                            style={{
                              color: s,
                            }}
                          >
                            ↗
                          </span>
                        </h2>
                        <div
                          className="flex flex-wrap gap-x-5 gap-y-1 mb-3 text-xs"
                          style={{
                            color: `#666`,
                          }}
                        >
                          <span className="flex items-center gap-1.5">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {e.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {e.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                            </svg>
                            {e.organizer}
                          </span>
                        </div>
                        <p
                          className="text-sm leading-relaxed mb-4"
                          style={{
                            color: `#555`,
                          }}
                        >
                          {e.desc}
                        </p>
                        <div className="flex items-center gap-5 flex-wrap">
                          <div
                            style={{
                              minWidth: 140,
                              flex: 1,
                              maxWidth: 220,
                            }}
                          >
                            <div
                              className="flex justify-between text-[10px] mb-1.5"
                              style={{
                                color: `#aaa`,
                              }}
                            >
                              <span>
                                {e.registered}
                                {" registered"}
                              </span>
                              <span>{i}% full</span>
                            </div>
                            <div
                              style={{
                                height: 3,
                                background: `#e5e5e5`,
                              }}
                            >
                              <div
                                style={{
                                  width: `${i}%`,
                                  height: 3,
                                  background: i > 85 ? `#D97706` : `#006B3F`,
                                  transition: `width 0.5s`,
                                }}
                              />
                            </div>
                            <p
                              className="text-[10px] mt-1"
                              style={{
                                color: `#aaa`,
                              }}
                            >
                              {e.spots - e.registered}
                              {" spots left"}
                            </p>
                          </div>
                          <button
                            onClick={() => _(e.id)}
                            className="flex-shrink-0 px-6 py-2 text-sm font-bold transition-all"
                            style={
                              r
                                ? {
                                    background: `transparent`,
                                    color: `#006B3F`,
                                    border: `1.5px solid #006B3F`,
                                  }
                                : {
                                    background: `#004D2C`,
                                    color: `#fff`,
                                    border: `1.5px solid #004D2C`,
                                  }
                            }
                          >
                            {r ? `✓ Registered` : `Register →`}
                          </button>
                        </div>
                      </div>
                      <div
                        className="hidden lg:block flex-shrink-0 overflow-hidden"
                        style={{
                          width: 128,
                          height: 96,
                        }}
                      >
                        {typeof e.img == `string` ? (
                          <img
                            src={e.img}
                            alt={e.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <img
                            src={e.img}
                            alt={e.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {g.length > 0 && (
            <div
              className="flex items-center justify-center gap-2 mt-10 pt-6"
              style={{
                borderTop: `1px solid #e0e0e0`,
              }}
            >
              {[1, 2, 3, `…`, 8].map((e, t) => (
                <button
                  key={t}
                  className="w-9 h-9 text-sm font-medium flex items-center justify-center transition-colors"
                  style={{
                    background: e === 1 ? `#004D2C` : `transparent`,
                    color: e === 1 ? `#fff` : `#555`,
                    border: e === 1 ? `none` : `1px solid #ddd`,
                  }}
                >
                  {e}
                </button>
              ))}
              <button
                className="px-4 h-9 text-sm font-medium flex items-center gap-1 transition-colors hover:text-[#004D2C]"
                style={{
                  border: `1px solid #ddd`,
                  color: `#555`,
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className="relative overflow-hidden mt-4"
        style={{
          background: `#1a1a1a`,
          minHeight: 200,
        }}
      >
        <img
          src={Ja}
          alt="PUST Event"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-20"
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{
                color: `#F59E0B`,
              }}
            >
              Alumni & Faculty
            </p>
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-2">
              Host an Event
            </h2>
            <p
              className="text-sm max-w-md"
              style={{
                color: `rgba(255,255,255,0.55)`,
              }}
            >
              Are you an alumnus, department, or student organization? Submit
              your event and reach the entire PUST community.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link
              to="/register"
              className="text-sm font-bold text-black px-8 py-3 text-center hover:opacity-90 transition-opacity"
              style={{
                background: `#F59E0B`,
              }}
            >
              Submit an Event →
            </Link>
            <Link
              to="/about"
              className="text-sm font-semibold text-white px-8 py-3 text-center border transition-colors hover:bg-white/10"
              style={{
                borderColor: `rgba(255,255,255,0.3)`,
              }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
