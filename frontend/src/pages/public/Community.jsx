import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Ia, La, za, Ha, Ua, Wa, Ka, qa, Xa, Qa } from "../../data/mockData";
import { api, getCurrentUser } from "../../services/api";

var ls = [
    {
      icon: `💻`,
      color: `#1B4F8A`,
      bg: `#DBEAFE`,
      name: `CSE & Tech Alumni`,
      desc: `A hub for CSE, EEE, ICE, and tech-track graduates to share opportunities, projects, and industry news.`,
      members: 3840,
      posts: 124,
      online: 42,
      tags: [`Software`, `AI/ML`, `Networking`],
      img: qa,
    },
    {
      icon: `📐`,
      color: `#7C3AED`,
      bg: `#F3E8FF`,
      name: `Engineering & Architecture`,
      desc: `Civil, Mechanical, Architecture, and URP alumni collaborating on infrastructure and design projects.`,
      members: 2210,
      posts: 87,
      online: 19,
      tags: [`Civil`, `Architecture`, `URP`],
      img: Xa,
    },
    {
      icon: `🧪`,
      color: `#059669`,
      bg: `#D1FAE5`,
      name: `Science & Research Circle`,
      desc: `Physics, Chemistry, Math, Pharmacy, and SDS alumni discussing research, publications, and lab life.`,
      members: 1680,
      posts: 96,
      online: 23,
      tags: [`Research`, `Pharmacy`, `Data Science`],
      img: Ia,
    },
    {
      icon: `📋`,
      color: `#D97706`,
      bg: `#FEF3C7`,
      name: `Business & Management Hub`,
      desc: `BBA and THM graduates networking around entrepreneurship, hospitality, and management careers.`,
      members: 1920,
      posts: 73,
      online: 31,
      tags: [`BBA`, `Startup`, `Tourism`],
      img: La,
    },
    {
      icon: `📜`,
      color: `#BE185D`,
      bg: `#FCE7F3`,
      name: `Humanities & Social Science`,
      desc: `Bangla, English, History, Social Work, PA, Economics, and Geography alumni sharing culture and ideas.`,
      members: 1540,
      posts: 61,
      online: 14,
      tags: [`Literature`, `History`, `Economics`],
      img: za,
    },
    {
      icon: `🌿`,
      color: `#0D9488`,
      bg: `#CCFBF1`,
      name: `PUST Green Campus`,
      desc: `Students, alumni, and faculty committed to environmental sustainability and campus beautification.`,
      members: 840,
      posts: 45,
      online: 9,
      tags: [`Environment`, `GEO`, `Green`],
      img: Wa,
    },
    {
      icon: `🎓`,
      color: `#004D2C`,
      bg: `#DCFCE7`,
      name: `Freshers & Young Alumni`,
      desc: `A welcoming space for recent graduates and current students transitioning into professional life.`,
      members: 2680,
      posts: 202,
      online: 78,
      tags: [`Freshers`, `Students`, `Career`],
      img: Ha,
    },
    {
      icon: `🌍`,
      color: `#0891B2`,
      bg: `#E0F2FE`,
      name: `PUST Global Chapter`,
      desc: `Alumni living and working abroad — chapters in UK, USA, Canada, Australia, Middle East, and beyond.`,
      members: 4320,
      posts: 310,
      online: 91,
      tags: [`International`, `Diaspora`, `Global`],
      img: Qa,
    },
  ],
  us = [
    {
      cat: `Career`,
      catColor: `#1B4F8A`,
      catBg: `#DBEAFE`,
      title: `Best cities in Bangladesh for CSE graduates in 2026?`,
      author: `Tanvir Ahmed`,
      dept: `CSE '22`,
      time: `2h ago`,
      replies: 34,
      likes: 88,
    },
    {
      cat: `Research`,
      catColor: `#7C3AED`,
      catBg: `#F3E8FF`,
      title: `Looking for co-authors for a journal paper on AI ethics`,
      author: `Dr. Nasrin Akter`,
      dept: `ICE (Faculty)`,
      time: `5h ago`,
      replies: 12,
      likes: 41,
    },
    {
      cat: `Campus`,
      catColor: `#059669`,
      catBg: `#D1FAE5`,
      title: `Reunion 2026 planning — who is joining from Dhaka?`,
      author: `Sabbir Hossain`,
      dept: `EEE '19`,
      time: `1d ago`,
      replies: 67,
      likes: 134,
    },
    {
      cat: `Business`,
      catColor: `#D97706`,
      catBg: `#FEF3C7`,
      title: `I started a startup after PUST — AMA`,
      author: `Rahnuma Islam`,
      dept: `BBA '20`,
      time: `2d ago`,
      replies: 52,
      likes: 176,
    },
    {
      cat: `Mentorship`,
      catColor: `#BE185D`,
      catBg: `#FCE7F3`,
      title: `How do I transition from academia to industry?`,
      author: `Mahfuz Khan`,
      dept: `MATH '23`,
      time: `3d ago`,
      replies: 29,
      likes: 63,
    },
  ],
  ds = [
    {
      icon: `🏆`,
      date: `Oct 12`,
      title: `PUST Alumni Quiz Night`,
      loc: `Online · Zoom`,
      seats: 120,
    },
    {
      icon: `🎤`,
      date: `Nov 05`,
      title: `PUST Career Talk Series`,
      loc: `PUST Auditorium`,
      seats: 200,
    },
    {
      icon: `🌐`,
      date: `Nov 18`,
      title: `Global Chapter Networking`,
      loc: `Online · Discord`,
      seats: 500,
    },
    {
      icon: `🎓`,
      date: `Dec 01`,
      title: `PUST Annual Gala 2026`,
      loc: `Dhaka Grand Hotel`,
      seats: 350,
    },
  ],
  fs = [
    {
      v: `22,400+`,
      l: `Community Members`,
    },
    {
      v: `8`,
      l: `Active Groups`,
    },
    {
      v: `1,200+`,
      l: `Posts per Month`,
    },
    {
      v: `45`,
      l: `Countries Represented`,
    },
  ];
export default function Community() {
  let [e, t] = useState(`groups`),
    [n, r] = useState(``),
    [i, a] = useState(new Set()),
    [discussions, setDiscussions] = useState(us),
    [postText, setPostText] = useState(``),
    o = ls.filter(
      (e) =>
        e.name.toLowerCase().includes(n.toLowerCase()) ||
        e.tags.some((e) => e.toLowerCase().includes(n.toLowerCase())),
    );
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
          minHeight: 380,
        }}
      >
        <img
          src={Ka}
          alt="PUST Campus"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(0,77,44,0.88) 0%, rgba(27,79,138,0.72) 60%, rgba(0,0,0,0.60) 100%)`,
          }}
        />
        <div
          className="absolute top-10 right-16 w-40 h-40 rounded-full opacity-10"
          style={{
            border: `2px solid #F59E0B`,
          }}
        />
        <div
          className="absolute top-20 right-24 w-24 h-24 rounded-full opacity-10"
          style={{
            border: `2px solid #F59E0B`,
          }}
        />
        <div
          className="absolute -bottom-8 left-10 w-32 h-32 rounded-full opacity-8"
          style={{
            background: `rgba(245,158,11,0.15)`,
          }}
        />
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 56"
          preserveAspectRatio="none"
          style={{
            height: 56,
          }}
        >
          <polygon points="0,56 1440,0 1440,56" fill="#f2f2f2" />
        </svg>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.26em] mb-3 px-3 py-1"
            style={{
              color: `#F59E0B`,
              border: `1px solid rgba(245,158,11,0.4)`,
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
            Community
          </h1>
          <p
            className="max-w-lg text-sm sm:text-base mb-8"
            style={{
              color: `rgba(255,255,255,0.72)`,
            }}
          >
            Join groups, spark conversations, and stay connected with 22,400+
            PUST alumni across every department and country.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              to="/register"
              className="font-bold text-white px-7 py-3 text-sm hover:opacity-90 transition-opacity"
              style={{
                background: `#006B3F`,
              }}
            >
              Join a Group
            </Link>
            <Link
              to="/alumni"
              className="font-semibold text-white px-7 py-3 text-sm border border-white/50 hover:bg-white/10 transition-colors"
            >
              Browse Alumni →
            </Link>
          </div>
        </div>
      </div>
      <div
        style={{
          background: `#1a1a1a`,
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-4">
          {fs.map((e, t) => (
            <div
              key={t}
              className="py-5 text-center"
              style={{
                borderRight:
                  t < 3 ? `1px solid rgba(255,255,255,0.08)` : `none`,
              }}
            >
              <p
                className="font-display font-bold text-white text-xl sm:text-2xl leading-none"
                style={{
                  color: `#F59E0B`,
                }}
              >
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
      <div
        style={{
          background: `#fff`,
          borderBottom: `1px solid #e5e5e5`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4 flex-wrap py-4">
            <div className="flex gap-0">
              {[`groups`, `discussions`, `events`].map((n) => (
                <button
                  key={n}
                  onClick={() => t(n)}
                  className="px-5 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors"
                  style={{
                    color: e === n ? `#004D2C` : `#666`,
                    borderColor: e === n ? `#004D2C` : `transparent`,
                    background: `transparent`,
                  }}
                >
                  {n === `groups`
                    ? `Groups`
                    : n === `discussions`
                      ? `Discussions`
                      : `Upcoming Events`}
                </button>
              ))}
            </div>
            {e === `groups` && (
              <input
                type="text"
                value={n}
                onChange={(e) => r(e.target.value)}
                placeholder="Search groups\u2026"
                className="border px-3 py-2 text-sm outline-none"
                style={{
                  borderColor: `#d1d5db`,
                  width: 200,
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {e === `groups` && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {o.map((e, t) => (
              <div
                key={t}
                className="overflow-hidden flex flex-col"
                style={{
                  background: `#fff`,
                  border: `1px solid #e5e5e5`,
                  borderRadius: 4,
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: 120,
                  }}
                >
                  <img
                    src={e.img}
                    alt={e.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg,${e.color}cc,${e.color}88)`,
                    }}
                  />
                  <svg
                    className="absolute bottom-0 right-0 h-full"
                    viewBox="0 0 100 120"
                    preserveAspectRatio="none"
                    style={{
                      width: 100,
                    }}
                  >
                    <polygon
                      points="100,0 0,120 100,120"
                      fill="rgba(255,255,255,0.08)"
                    />
                  </svg>
                  <div className="absolute top-3 left-3 text-2xl">{e.icon}</div>
                  <div
                    className="absolute top-3 right-3 text-white text-[9px] font-bold px-2 py-0.5"
                    style={{
                      background: `rgba(0,0,0,0.35)`,
                      borderRadius: 2,
                    }}
                  >
                    {e.online}
                    {" online"}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-[#1a1a1a] text-sm leading-snug mb-1">
                    {e.name}
                  </h3>
                  <p className="text-[#666] text-xs leading-relaxed mb-3 flex-1">
                    {e.desc}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {e.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-semibold px-2 py-0.5"
                        style={{
                          background: e.bg,
                          color: e.color,
                          borderRadius: 2,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#888] mb-3">
                    <span>
                      {"\uD83D\uDC65 "}
                      {e.members.toLocaleString()}
                      {" members"}
                    </span>
                    <span>
                      {"\uD83D\uDCAC "}
                      {e.posts}
                      {" posts/mo"}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      a((e) => {
                        let n = new Set(e);
                        return (n.has(t) ? n.delete(t) : n.add(t), n);
                      })
                    }
                    className="w-full py-2 text-sm font-bold transition-colors"
                    style={
                      i.has(t)
                        ? {
                            background: `#f0fdf4`,
                            color: `#004D2C`,
                            border: `1.5px solid #004D2C`,
                          }
                        : {
                            background: e.color,
                            color: `#fff`,
                            border: `none`,
                          }
                    }
                  >
                    {i.has(t) ? `✓ Joined` : `Join Group`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {e === `discussions` && (
          <div className="space-y-3">
            <div
              className="p-5 mb-6 flex gap-3 items-start"
              style={{
                background: `#fff`,
                border: `1px solid #e5e5e5`,
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                style={{
                  background: `#004D2C`,
                }}
              >
                P
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={postText}
                  onChange={(ev) => setPostText(ev.target.value)}
                  placeholder="Start a discussion with the PUST community\u2026"
                  className="w-full border px-4 py-2.5 text-sm outline-none"
                  style={{
                    borderColor: `#d1d5db`,
                  }}
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() => {
                      if (!postText.trim()) return;
                      const user = getCurrentUser();
                      const newDisc = {
                        cat: `Discussion`,
                        catColor: `#004D2C`,
                        catBg: `#DCFCE7`,
                        title: postText.trim(),
                        author: user?.name || `Dr. Rafiqul Islam`,
                        dept: `${(user?.dept || `CSE`).split(` `)[0]} '${String(user?.batch || `2008`).slice(-2)}`,
                        time: `Just now`,
                        replies: 0,
                        likes: 1,
                      };
                      setDiscussions([newDisc, ...discussions]);
                      api.createCommunityPost({
                        title: postText.trim(),
                        body: postText.trim(),
                      });
                      setPostText(``);
                    }}
                    className="text-xs font-bold px-4 py-1.5 text-white hover:opacity-90 transition-opacity"
                    style={{
                      background: `#004D2C`,
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
            {discussions.map((e, t) => (
              <div
                key={t}
                className="p-5 hover:border-gray-300 transition-colors cursor-pointer"
                style={{
                  background: `#fff`,
                  border: `1px solid #e5e5e5`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      background: e.catColor,
                    }}
                  >
                    {e.author
                      .split(` `)
                      .map((e) => e[0])
                      .join(``)
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-[9px] font-bold px-2 py-0.5"
                        style={{
                          background: e.catBg,
                          color: e.catColor,
                          borderRadius: 2,
                        }}
                      >
                        {e.cat}
                      </span>
                      <span className="font-bold text-xs text-[#1a1a1a]">
                        {e.author}
                      </span>
                      <span className="text-[10px] text-[#aaa]">{e.dept}</span>
                      <span className="text-[10px] text-[#aaa] ml-auto">
                        {e.time}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-[#1a1a1a] leading-snug mb-2">
                      {e.title}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-[#888]">
                      <span>
                        {"\uD83D\uDCAC "}
                        {e.replies}
                        {" replies"}
                      </span>
                      <span>
                        {"\u2764\uFE0F "}
                        {e.likes}
                        {" likes"}
                      </span>
                      <button className="hover:text-[#004D2C] font-medium transition-colors ml-auto">
                        Reply →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
              <button
                className="text-sm font-bold px-8 py-2.5 border hover:bg-[#004D2C] hover:text-white transition-colors"
                style={{
                  borderColor: `#004D2C`,
                  color: `#004D2C`,
                }}
              >
                Load more discussions →
              </button>
            </div>
          </div>
        )}
        {e === `events` && (
          <div className="space-y-4">
            {ds.map((e, t) => (
              <div
                key={t}
                className="flex items-center gap-5 p-5"
                style={{
                  background: `#fff`,
                  border: `1px solid #e5e5e5`,
                }}
              >
                <div className="text-3xl flex-shrink-0">{e.icon}</div>
                <div className="w-14 text-center flex-shrink-0">
                  <p className="font-display font-bold text-[#004D2C] text-lg leading-none">
                    {e.date.split(` `)[1]}
                  </p>
                  <p className="text-[10px] uppercase text-[#888]">
                    {e.date.split(` `)[0]}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#1a1a1a] text-sm">{e.title}</p>
                  <p className="text-[11px] text-[#888] mt-0.5">
                    {"\uD83D\uDCCD "}
                    {e.loc}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-[#aaa]">
                    {e.seats}
                    {" seats"}
                  </p>
                  <button
                    className="mt-1 text-xs font-bold px-4 py-1.5 text-white hover:opacity-90 transition-opacity"
                    style={{
                      background: `#004D2C`,
                    }}
                  >
                    RSVP
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className="flex overflow-hidden"
        style={{
          height: 90,
        }}
      >
        {[Ua, Wa, Xa, qa, Qa, Ia, Ha, La, za].map((e, t) => (
          <div key={t} className="flex-1 relative overflow-hidden group">
            <img
              src={e}
              alt=""
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: [
                  `#004D2C`,
                  `#1B4F8A`,
                  `#7C3AED`,
                  `#D97706`,
                  `#059669`,
                  `#0891B2`,
                  `#004D2C`,
                  `#BE185D`,
                  `#0D9488`,
                ][t],
              }}
            />
          </div>
        ))}
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: 220,
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
            background: `linear-gradient(to right, rgba(0,77,44,0.94) 55%, rgba(27,79,138,0.70) 100%)`,
          }}
        />
        <svg
          className="absolute top-0 right-0 h-full"
          viewBox="0 0 200 220"
          preserveAspectRatio="none"
          style={{
            width: 200,
          }}
        >
          <polygon points="200,0 0,220 200,220" fill="rgba(245,158,11,0.08)" />
        </svg>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 sm:px-16 py-12 max-w-5xl mx-auto">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2"
              style={{
                color: `#F59E0B`,
              }}
            >
              Join 22,400+ Members
            </p>
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-2">
              Be Part of the PUST Community
            </h2>
            <p
              className="text-sm max-w-md"
              style={{
                color: `rgba(255,255,255,0.60)`,
              }}
            >
              Connect with batchmates, collaborate with peers, and grow your
              professional network — all in one place.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link
              to="/register"
              className="text-sm font-bold text-white px-8 py-3 text-center hover:opacity-90 transition-opacity"
              style={{
                background: `#F59E0B`,
                color: `#000`,
              }}
            >
              Create Your Profile →
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
