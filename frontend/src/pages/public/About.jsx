import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  wa,
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
  let [e, t] = useState(`eng`),
    n = Qo.find((t) => t.key === e);
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
          minHeight: 400,
        }}
      >
        <img
          src={Ka}
          alt="PUST Campus Aerial View"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(0,77,44,0.80) 0%, rgba(27,79,138,0.65) 60%, rgba(0,0,0,0.55) 100%)`,
          }}
        />
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{
            height: 60,
          }}
        >
          <polygon points="0,60 1440,0 1440,60" fill="#f2f2f2" />
        </svg>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24">
          <div
            className="border border-white/20 p-3 mb-5 inline-block"
            style={{
              background: `rgba(255,255,255,0.12)`,
            }}
          >
            <img src={wa} alt="PUST" className="w-14 h-14 object-contain" />
          </div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em] mb-3"
            style={{
              color: `#F59E0B`,
            }}
          >
            Est. 2008 · Pabna, Bangladesh
          </p>
          <h1
            className="font-display font-bold text-white mb-4"
            style={{
              fontSize: `clamp(2rem,5vw,3.6rem)`,
              lineHeight: 1.15,
            }}
          >
            Pabna University of Science
            <br />
            and Technology
          </h1>
          <p
            className="max-w-xl text-sm sm:text-base"
            style={{
              color: `rgba(255,255,255,0.68)`,
            }}
          >
            A public research university in Pabna, Bangladesh — with 5
            faculties, 21 departments, and a growing global alumni network of
            22,400+.
          </p>
        </div>
      </div>
      <div
        style={{
          background: `#1a1a1a`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p
            className="text-center text-[10px] font-bold uppercase tracking-widest mb-6"
            style={{
              color: `#F59E0B`,
            }}
          >
            University at a Glance
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-0 divide-x divide-white/10">
            {Xo.map((e, t) => (
              <div key={t} className="text-center py-2 px-4">
                <div className="text-2xl mb-1">{e.icon}</div>
                <p className="font-display font-bold text-white text-xl sm:text-2xl leading-none">
                  {e.v}
                </p>
                <p
                  className="text-[10px] uppercase tracking-wider mt-1"
                  style={{
                    color: `rgba(255,255,255,0.4)`,
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
          background: `#004D2C`,
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-5">
          {Zo.map((e, t) => (
            <div
              key={t}
              className="py-4 text-center"
              style={{
                borderRight:
                  t < Zo.length - 1
                    ? `1px solid rgba(255,255,255,0.12)`
                    : `none`,
              }}
            >
              <p className="font-display font-bold text-white text-lg sm:text-2xl leading-none">
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
      <div
        style={{
          background: `#f2f2f2`,
        }}
        className="py-8"
      >
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="text-center text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
            style={{
              color: `#006B3F`,
            }}
          >
            Life at PUST
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {Yo.slice(0, 5).map((e, t) => (
              <div
                key={t}
                className="overflow-hidden"
                style={{
                  aspectRatio: `1/1`,
                  borderRadius: 2,
                }}
              >
                <img
                  src={e}
                  alt="PUST"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1.5 mt-1.5">
            {Yo.slice(5, 10).map((e, t) => (
              <div
                key={t}
                className="overflow-hidden"
                style={{
                  aspectRatio: `1/1`,
                  borderRadius: 2,
                }}
              >
                <img
                  src={e}
                  alt="PUST"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          background: `#fff`,
        }}
        className="py-16"
      >
        <div className="max-w-5xl mx-auto px-6 text-center mb-12">
          <h2
            className="font-display font-bold text-[#1a1a1a]"
            style={{
              fontSize: `clamp(1.8rem,4vw,2.8rem)`,
            }}
          >
            Our Mission
          </h2>
        </div>
        <div className="max-w-5xl mx-auto px-6">
          <div
            className="flex flex-col sm:flex-row overflow-hidden"
            style={{
              background: `#f0f0f0`,
            }}
          >
            <div
              className="sm:w-[420px] flex-shrink-0 overflow-hidden"
              style={{
                minHeight: 280,
              }}
            >
              <img
                src={Wa}
                alt="PUST lakeside walkway"
                className="w-full h-full object-cover"
                style={{
                  minHeight: 280,
                }}
              />
            </div>
            <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{
                  color: `#006B3F`,
                }}
              >
                PUST Alumni Association
              </p>
              <h3 className="font-display font-bold text-[#1a1a1a] text-2xl sm:text-3xl leading-snug mb-4">
                Sustaining Lifelong Bonds
              </h3>
              <p className="text-[#555] text-sm leading-relaxed mb-3">
                The PUST Alumni Network exists to sustain, deepen, and extend
                the bonds formed on the university campus — creating lifelong
                connections between generations of students, graduates, and the
                institution itself.
              </p>
              <p className="text-[#555] text-sm leading-relaxed mb-5">
                We believe every PUST graduate carries a piece of Pabna with
                them. Through this platform, we bring that community together to
                mentor, hire, inspire, and give back.
              </p>
              <Link
                to="/register"
                className="font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                style={{
                  color: `#006B3F`,
                }}
              >
                Join the network →
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
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2
              className="font-display font-bold text-[#1a1a1a]"
              style={{
                fontSize: `clamp(1.8rem,4vw,2.8rem)`,
              }}
            >
              Faculties & Departments
            </h2>
            <p className="text-[#888] text-sm mt-2">
              5 faculties · 21 departments · 1 institute
            </p>
          </div>
          <div
            className="flex flex-col sm:flex-row gap-0 overflow-hidden border border-gray-200"
            style={{
              background: `#fff`,
            }}
          >
            <div className="sm:w-64 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-gray-200">
              {Qo.map((n) => (
                <button
                  key={n.key}
                  onClick={() => t(n.key)}
                  className="w-full text-left px-5 py-4 text-sm font-medium transition-all border-b border-gray-100 last:border-0 flex items-center gap-3"
                  style={{
                    background: e === n.key ? n.color : `transparent`,
                    color: e === n.key ? `#fff` : `#444`,
                    borderLeft:
                      e === n.key
                        ? `4px solid ${n.color}`
                        : `4px solid transparent`,
                  }}
                >
                  <span className="leading-snug">{n.name}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 p-6">
              <p
                className="font-bold text-sm mb-5 pb-3 border-b"
                style={{
                  color: n.color,
                  borderColor: `#e5e5e5`,
                }}
              >
                {"Departments under the "}
                {n.name}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {n.depts.map((e) => (
                  <Link
                    key={e.code}
                    to="/alumni"
                    className="group flex flex-col items-center text-center p-4 border transition-all"
                    style={{
                      border: `1px solid #e5e5e5`,
                      background: `#fafafa`,
                    }}
                    onMouseOver={(e) => {
                      ((e.currentTarget.style.borderColor = n.color),
                        (e.currentTarget.style.background = n.color + `08`));
                    }}
                    onMouseOut={(e) => {
                      ((e.currentTarget.style.borderColor = `#e5e5e5`),
                        (e.currentTarget.style.background = `#fafafa`));
                    }}
                  >
                    <span className="text-3xl mb-2">{e.icon}</span>
                    <p className="font-bold text-xs text-[#1a1a1a] leading-snug">
                      {e.name}
                    </p>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 mt-2"
                      style={{
                        background: n.color + `18`,
                        color: n.color,
                      }}
                    >
                      {e.code}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div
            className="mt-5 p-5"
            style={{
              background: `#fff`,
              border: `1px solid #e5e5e5`,
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#888] mb-3">
              All Departments at a Glance
            </p>
            <div className="flex flex-wrap gap-2">
              {Qo.flatMap((e) => e.depts).map((e) => (
                <span
                  key={e.code}
                  className="text-[10px] font-semibold px-2.5 py-1"
                  style={{
                    background: `#F1F5F9`,
                    color: `#475569`,
                  }}
                >
                  {e.icon} {e.code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          background: `#fff`,
        }}
        className="py-16"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2
              className="font-display font-bold text-[#1a1a1a]"
              style={{
                fontSize: `clamp(1.8rem,4vw,2.8rem)`,
              }}
            >
              What We Stand For
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {es.map((e, t) => (
              <div
                key={t}
                className="p-6 flex flex-col"
                style={{
                  background: `#f9f9f9`,
                  border: `1px solid #e5e5e5`,
                  borderTop: `3px solid #004D2C`,
                }}
              >
                <div className="text-3xl mb-3">{e.icon}</div>
                <h3 className="font-display font-bold text-[#1a1a1a] text-sm mb-2">
                  {e.title}
                </h3>
                <p className="text-[#666] text-xs leading-relaxed flex-1">
                  {e.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          background: `#1a1a1a`,
        }}
        className="py-16"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
              style={{
                color: `#F59E0B`,
              }}
            >
              Our Journey
            </p>
            <div
              className="w-8 h-0.5 mx-auto mb-5"
              style={{
                background: `#F59E0B`,
              }}
            />
            <h2
              className="font-display font-bold text-white"
              style={{
                fontSize: `clamp(1.8rem,4vw,2.8rem)`,
              }}
            >
              PUST Through the Years
            </h2>
          </div>
          <div className="space-y-8">
            {$o.map((e, t) => (
              <div key={t} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 text-right">
                  <span
                    className="font-display font-bold text-lg"
                    style={{
                      color: `#F59E0B`,
                    }}
                  >
                    {e.year}
                  </span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      background: `#F59E0B`,
                      boxShadow: `0 0 0 4px rgba(245,158,11,0.18)`,
                    }}
                  />
                  {t < $o.length - 1 && (
                    <div
                      className="w-px flex-1 mt-1"
                      style={{
                        background: `rgba(255,255,255,0.08)`,
                        minHeight: 28,
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <p className="font-bold text-white text-sm">{e.title}</p>
                  <p
                    className="text-xs leading-relaxed mt-1"
                    style={{
                      color: `#888`,
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
        style={{
          background: `#f2f2f2`,
        }}
        className="py-16"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2
              className="font-display font-bold text-[#1a1a1a]"
              style={{
                fontSize: `clamp(1.8rem,4vw,2.8rem)`,
              }}
            >
              Leadership & Administration
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            ].map((e, t) => (
              <div
                key={t}
                className="group overflow-hidden"
                style={{
                  border: `1px solid #e5e5e5`,
                  background: `#fff`,
                }}
              >
                <div
                  className="overflow-hidden"
                  style={{
                    height: 148,
                  }}
                >
                  <img
                    src={e.img}
                    alt={e.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div
                  className="p-4"
                  style={{
                    borderTop: `3px solid #004D2C`,
                  }}
                >
                  <p className="font-display font-bold text-[#1a1a1a] text-sm leading-snug">
                    {e.name}
                  </p>
                  <p className="text-[10px] text-[#888] mt-1">{e.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: 240,
        }}
      >
        <img
          src={Qa}
          alt="PUST Hall"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, rgba(0,77,44,0.94) 50%, rgba(27,79,138,0.70) 100%)`,
          }}
        />
        <svg
          className="absolute top-0 right-0 h-full"
          viewBox="0 0 200 240"
          preserveAspectRatio="none"
          style={{
            width: 200,
          }}
        >
          <polygon points="200,0 0,240 200,240" fill="rgba(245,158,11,0.08)" />
        </svg>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 sm:px-16 py-12 max-w-5xl mx-auto">
          <div>
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-2">
              Be Part of the PUST Story
            </h2>
            <p
              className="text-sm max-w-md"
              style={{
                color: `rgba(255,255,255,0.6)`,
              }}
            >
              Whether you are an alumnus, student, faculty member, or employer —
              there is a place for you in the PUST Alumni Network.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link
              to="/register"
              className="text-sm font-bold text-white px-8 py-3 text-center hover:opacity-90 transition-opacity"
              style={{
                background: `#F59E0B`,
              }}
            >
              Join Free →
            </Link>
            <Link
              to="/alumni"
              className="text-sm font-semibold text-white px-8 py-3 text-center border border-white/40 hover:bg-white/10 transition-colors"
            >
              Browse Alumni
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
