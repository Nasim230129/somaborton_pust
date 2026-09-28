import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Ia, La, Ha, Wa, Ka, Ja, Xa, Za, Qa } from "../../data/mockData";
import { api } from "../../services/api";

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
      color: `#004D2C`,
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
  let [e, t] = useState({
      name: ``,
      email: ``,
      dept: ``,
      type: ``,
      message: ``,
    }),
    [n, r] = useState(false),
    [i, a] = useState(null);
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
          minHeight: 340,
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
            background: `linear-gradient(135deg, rgba(0,77,44,0.88) 0%, rgba(27,79,138,0.72) 65%, rgba(0,0,0,0.60) 100%)`,
          }}
        />
        <div
          className="absolute top-8 right-20 w-44 h-44 rounded-full opacity-10"
          style={{
            border: `2px solid #F59E0B`,
          }}
        />
        <div
          className="absolute top-20 right-32 w-24 h-24 rounded-full opacity-8"
          style={{
            border: `1px solid #F59E0B`,
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
            We Are Here to Help
          </p>
          <h1
            className="font-display font-bold text-white mb-3"
            style={{
              fontSize: `clamp(2.2rem,6vw,4rem)`,
              lineHeight: 1.1,
            }}
          >
            Contact Us
          </h1>
          <p
            className="max-w-md text-sm sm:text-base"
            style={{
              color: `rgba(255,255,255,0.72)`,
            }}
          >
            Reach out to the PUST Alumni Network team — we respond to every
            message within 24 hours on business days.
          </p>
        </div>
      </div>
      <div
        style={{
          background: `#1a1a1a`,
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-3">
          {[
            {
              icon: `📧`,
              label: `Email`,
              val: `alumni@pust.ac.bd`,
              color: `#F59E0B`,
            },
            {
              icon: `📞`,
              label: `Phone`,
              val: `+880-731-65350`,
              color: `#4ADE80`,
            },
            {
              icon: `📍`,
              label: `Address`,
              val: `Rajapur, Pabna-6600, Bangladesh`,
              color: `#60A5FA`,
            },
          ].map((e, t) => (
            <div
              key={t}
              className="py-5 px-6 text-center"
              style={{
                borderRight:
                  t < 2 ? `1px solid rgba(255,255,255,0.08)` : `none`,
              }}
            >
              <div className="text-xl mb-1">{e.icon}</div>
              <p
                className="text-[10px] uppercase tracking-widest mb-0.5"
                style={{
                  color: `rgba(255,255,255,0.35)`,
                }}
              >
                {e.label}
              </p>
              <p
                className="text-sm font-semibold"
                style={{
                  color: e.color,
                }}
              >
                {e.val}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div
              style={{
                background: `#fff`,
                border: `1px solid #e5e5e5`,
                borderRadius: 4,
              }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  height: 100,
                }}
              >
                <img
                  src={Ia}
                  alt="PUST"
                  className="w-full h-full object-cover object-center"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, rgba(0,77,44,0.92) 55%, rgba(0,77,44,0.60) 100%)`,
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-center px-6">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-1"
                    style={{
                      color: `#F59E0B`,
                    }}
                  >
                    PUST Alumni Network
                  </p>
                  <h2 className="font-display font-bold text-white text-xl">
                    Send Us a Message
                  </h2>
                </div>
              </div>
              {n ? (
                <div className="p-10 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-5"
                    style={{
                      background: `#DCFCE7`,
                    }}
                  >
                    ✓
                  </div>
                  <h3 className="font-display font-bold text-[#1a1a1a] text-xl mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[#666] text-sm mb-5">
                    {"Thank you, "}
                    {e.name}
                    {". We will get back to you at "}
                    <strong>{e.email}</strong>
                    {" within 24 hours on business days."}
                  </p>
                  <button
                    onClick={() => {
                      (r(false),
                        t({
                          name: ``,
                          email: ``,
                          dept: ``,
                          type: ``,
                          message: ``,
                        }));
                    }}
                    className="text-sm font-bold px-6 py-2.5 text-white hover:opacity-90 transition-opacity"
                    style={{
                      background: `#004D2C`,
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(t) => {
                    t.preventDefault();
                    if (e.name && e.email && e.message) {
                      api.submitContact({
                        name: e.name,
                        email: e.email,
                        dept: e.dept,
                        topic: e.type,
                        message: e.message,
                      });
                      r(true);
                    }
                  }}
                  className="p-6 space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={e.name}
                        onChange={(n) =>
                          t({
                            ...e,
                            name: n.target.value,
                          })
                        }
                        placeholder="Your full name"
                        required
                        className="w-full border px-3 py-2.5 text-sm outline-none focus:border-[#004D2C] transition-colors"
                        style={{
                          borderColor: `#d1d5db`,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={e.email}
                        onChange={(n) =>
                          t({
                            ...e,
                            email: n.target.value,
                          })
                        }
                        placeholder="your@email.com"
                        required
                        className="w-full border px-3 py-2.5 text-sm outline-none focus:border-[#004D2C] transition-colors"
                        style={{
                          borderColor: `#d1d5db`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888] mb-1">
                        Department / Batch
                      </label>
                      <input
                        type="text"
                        value={e.dept}
                        onChange={(n) =>
                          t({
                            ...e,
                            dept: n.target.value,
                          })
                        }
                        placeholder="e.g. CSE 2022"
                        className="w-full border px-3 py-2.5 text-sm outline-none focus:border-[#004D2C] transition-colors"
                        style={{
                          borderColor: `#d1d5db`,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888] mb-1">
                        Inquiry Type
                      </label>
                      <select
                        value={e.type}
                        onChange={(n) =>
                          t({
                            ...e,
                            type: n.target.value,
                          })
                        }
                        className="w-full border px-3 py-2.5 text-sm outline-none focus:border-[#004D2C] transition-colors bg-white"
                        style={{
                          borderColor: `#d1d5db`,
                        }}
                      >
                        <option value="">Select a category</option>
                        {ms.map((e) => (
                          <option key={e.v} value={e.v}>
                            {e.l}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888] mb-1">
                      Message *
                    </label>
                    <textarea
                      value={e.message}
                      onChange={(n) =>
                        t({
                          ...e,
                          message: n.target.value,
                        })
                      }
                      placeholder="Write your message here\u2026 Be as detailed as possible so we can help you effectively."
                      rows={5}
                      required
                      className="w-full border px-3 py-2.5 text-sm outline-none focus:border-[#004D2C] transition-colors resize-none"
                      style={{
                        borderColor: `#d1d5db`,
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 font-bold text-white text-sm hover:opacity-90 transition-opacity"
                    style={{
                      background: `#004D2C`,
                    }}
                  >
                    Send Message →
                  </button>
                  <p className="text-[10px] text-[#aaa] text-center">
                    We respond to all messages within 1 business day.
                  </p>
                </form>
              )}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-5">
            <div
              className="relative overflow-hidden"
              style={{
                height: 160,
                borderRadius: 4,
                border: `1px solid #e5e5e5`,
              }}
            >
              <img src={Xa} alt="PUST" className="w-full h-full object-cover" />
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  background: `rgba(0,77,44,0.68)`,
                }}
              >
                <div className="text-3xl mb-1">📍</div>
                <p className="text-white font-bold text-sm">
                  Pabna University of Science
                </p>
                <p className="text-white/70 text-xs">
                  & Technology · Rajapur, Pabna
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-[10px] font-bold px-3 py-1 text-white border border-white/40 hover:bg-white/10 transition-colors"
                >
                  Open in Maps ↗
                </a>
              </div>
            </div>
            <div
              style={{
                background: `#fff`,
                border: `1px solid #e5e5e5`,
                borderRadius: 4,
              }}
              className="p-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-4">
                Follow Us
              </p>
              <div className="grid grid-cols-2 gap-2">
                {_s.map((e, t) => (
                  <a
                    key={t}
                    href={e.url}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold border transition-colors hover:opacity-90"
                    style={{
                      borderColor: `#e5e5e5`,
                      color: e.color,
                    }}
                  >
                    <span className="font-bold text-base w-5 text-center">
                      {e.icon}
                    </span>
                    {e.label}
                  </a>
                ))}
              </div>
            </div>
            <div
              style={{
                background: `#fff`,
                border: `1px solid #e5e5e5`,
                borderRadius: 4,
              }}
              className="p-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-3">
                Office Hours
              </p>
              {[
                {
                  d: `Sunday – Thursday`,
                  t: `9:00 AM – 5:00 PM BST`,
                },
                {
                  d: `Friday`,
                  t: `Closed`,
                },
                {
                  d: `Saturday`,
                  t: `Closed`,
                },
              ].map((e, t) => (
                <div
                  key={t}
                  className="flex justify-between items-center py-2"
                  style={{
                    borderBottom: t < 2 ? `1px solid #f0f0f0` : `none`,
                  }}
                >
                  <span className="text-xs font-medium text-[#444]">{e.d}</span>
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: e.t === `Closed` ? `#ef4444` : `#004D2C`,
                    }}
                  >
                    {e.t}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
              style={{
                color: `#006B3F`,
              }}
            >
              On Campus
            </p>
            <div
              className="w-8 h-0.5 mx-auto mb-4"
              style={{
                background: `#006B3F`,
              }}
            />
            <h2
              className="font-display font-bold text-[#1a1a1a]"
              style={{
                fontSize: `clamp(1.8rem,4vw,2.6rem)`,
              }}
            >
              Office Locations
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {hs.map((e, t) => (
              <div
                key={t}
                className="overflow-hidden"
                style={{
                  background: `#f9f9f9`,
                  border: `1px solid #e5e5e5`,
                  borderRadius: 4,
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: 110,
                  }}
                >
                  <img
                    src={e.img}
                    alt={e.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `${e.color}cc`,
                    }}
                  />
                  <div className="absolute bottom-3 left-3 text-2xl">
                    {e.icon}
                  </div>
                </div>
                <div
                  className="p-4"
                  style={{
                    borderTop: `3px solid ${e.color}`,
                  }}
                >
                  <h3 className="font-display font-bold text-[#1a1a1a] text-sm mb-2">
                    {e.title}
                  </h3>
                  <p
                    className="text-[11px] text-[#666] leading-relaxed mb-2"
                    style={{
                      whiteSpace: `pre-line`,
                    }}
                  >
                    {e.addr}
                  </p>
                  <a
                    href={`mailto:${e.email}`}
                    className="text-[11px] font-medium block hover:underline"
                    style={{
                      color: e.color,
                    }}
                  >
                    {e.email}
                  </a>
                  <p className="text-[11px] text-[#888] mt-1">{e.phone}</p>
                  <p
                    className="text-[10px] text-[#aaa] mt-2 border-t pt-2"
                    style={{
                      borderColor: `#efefef`,
                    }}
                  >
                    {"\uD83D\uDD50 "}
                    {e.hours}
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
        className="py-14"
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2
              className="font-display font-bold text-[#1a1a1a]"
              style={{
                fontSize: `clamp(1.8rem,4vw,2.6rem)`,
              }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-[#888] text-sm mt-2">
              Quick answers to the most common questions
            </p>
          </div>
          <div className="space-y-2">
            {gs.map((e, t) => (
              <div
                key={t}
                style={{
                  background: `#fff`,
                  border: `1px solid #e5e5e5`,
                  borderRadius: 4,
                }}
              >
                <button
                  onClick={() => a(i === t ? null : t)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-semibold text-sm text-[#1a1a1a]">
                    {e.q}
                  </span>
                  <span
                    className="text-xl font-light text-[#888] flex-shrink-0"
                    style={{
                      transform: i === t ? `rotate(45deg)` : `none`,
                      transition: `transform 0.2s`,
                    }}
                  >
                    +
                  </span>
                </button>
                {i === t && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-[#555] leading-relaxed">{e.a}</p>
                  </div>
                )}
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
        {[Qa, Ka, Wa, Ja, Za, Ia, La, Ha].map((e, t) => (
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
                  `#059669`,
                  `#7C3AED`,
                  `#D97706`,
                  `#0891B2`,
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
          alt="PUST"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, rgba(27,79,138,0.92) 50%, rgba(0,77,44,0.72) 100%)`,
          }}
        />
        <svg
          className="absolute top-0 left-0 h-full"
          viewBox="0 0 200 220"
          preserveAspectRatio="none"
          style={{
            width: 200,
          }}
        >
          <polygon points="0,0 200,0 0,220" fill="rgba(245,158,11,0.08)" />
        </svg>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 sm:px-16 py-12 max-w-5xl mx-auto">
          <div>
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-2">
              Not sure where to start?
            </h2>
            <p
              className="text-sm max-w-md"
              style={{
                color: `rgba(255,255,255,0.62)`,
              }}
            >
              Join the PUST Alumni community and connect with thousands of
              graduates, mentors, and employers.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link
              to="/register"
              className="text-sm font-bold px-8 py-3 text-center hover:opacity-90 transition-opacity"
              style={{
                background: `#F59E0B`,
                color: `#000`,
              }}
            >
              Join Free →
            </Link>
            <Link
              to="/community"
              className="text-sm font-semibold text-white px-8 py-3 text-center border border-white/40 hover:bg-white/10 transition-colors"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
