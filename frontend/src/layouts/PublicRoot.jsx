import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ba, wa } from "../data/mockData";
import { useBackendSync } from "../services/api";

var Ea = [
    {
      to: `/`,
      label: `Home`,
      exact: true,
    },
    {
      to: `/alumni`,
      label: `Alumni`,
    },
    {
      to: `/events`,
      label: `Events`,
    },
    {
      to: `/jobs`,
      label: `Jobs`,
    },
    {
      to: `/mentorship`,
      label: `Mentorship`,
    },
    {
      to: `/community`,
      label: `Community`,
    },
    {
      to: `/stories`,
      label: `Stories`,
    },
    {
      to: `/donate`,
      label: `Give Back`,
    },
    {
      to: `/about`,
      label: `About`,
    },
    {
      to: `/contact`,
      label: `Contact`,
    },
  ],
  Da = `#004D2C`,
  Oa = `#002A18`;
export default function PublicRoot() {
  useBackendSync();
  let [e, t] = useState(false),
    [n, r] = useState(false),
    { pathname: i } = useLocation(),
    a = ba.filter((e) => !e.read).length;
  return (
    useEffect(() => {
      (t(false), r(false), window.scrollTo(0, 0));
    }, [i]),
    (
      <div
        className="min-h-screen"
        style={{
          background: `#F5F7FA`,
        }}
      >
        <div
          className="hidden sm:flex items-center justify-between text-white text-[10px] py-2 px-6"
          style={{
            background: Oa,
          }}
        >
          <span
            style={{
              color: `rgba(255,255,255,0.45)`,
            }}
          >
            📍 Rajapur, Pabna-6600, Bangladesh  |  📞 +880-731-65350  |  ✉️
            alumni@pust.ac.bd
          </span>
          <span
            style={{
              color: `rgba(255,255,255,0.40)`,
            }}
          >
            Pabna University of Science & Technology · Est. 2008
          </span>
        </div>
        <header
          className="sticky top-0 z-50"
          style={{
            background: Da,
            boxShadow: `0 4px 24px rgba(0,0,0,0.28)`,
          }}
        >
          <div
            style={{
              height: 3,
              background: `linear-gradient(to right,#F59E0B,#D97706,#F59E0B)`,
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="flex items-center"
              style={{
                height: 72,
              }}
            >
              <Link
                to="/"
                className="flex items-center gap-4 flex-shrink-0 pr-7 mr-3"
                style={{
                  borderRight: `1px solid rgba(255,255,255,0.14)`,
                }}
              >
                <div
                  className="bg-white flex items-center justify-center"
                  style={{
                    width: 52,
                    height: 52,
                    padding: 4,
                    borderRadius: 3,
                    boxShadow: `0 2px 8px rgba(0,0,0,0.22)`,
                  }}
                >
                  <img
                    src={wa}
                    alt="PUST"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="leading-tight hidden sm:block">
                  <p
                    className="font-display font-bold text-white leading-none"
                    style={{
                      fontSize: 17,
                      letterSpacing: `-0.01em`,
                    }}
                  >
                    PUST Alumni
                  </p>
                  <p
                    className="font-bold uppercase mt-0.5"
                    style={{
                      fontSize: 9,
                      letterSpacing: `0.22em`,
                      color: `#F59E0B`,
                    }}
                  >
                    Network · Est. 2008
                  </p>
                </div>
              </Link>
              <nav className="hidden lg:flex items-stretch flex-1 h-full">
                {Ea.map((e) => (
                  <NavLink
                    key={e.to}
                    to={e.to}
                    end={e.exact}
                    className={({ isActive: e }) =>
                      `flex items-center px-3 h-full border-b-[3px] transition-all font-bold ${e ? `text-white border-[#F59E0B]` : `text-green-100/80 border-transparent hover:text-white hover:border-white/30`}`
                    }
                    style={{
                      fontSize: 13,
                      letterSpacing: `0.01em`,
                    }}
                  >
                    {e.label}
                  </NavLink>
                ))}
              </nav>
              <div className="flex items-center gap-3 ml-auto">
                <div className="relative">
                  <button
                    onClick={() => r(!n)}
                    className="relative w-10 h-10 flex items-center justify-center text-green-100 hover:text-white hover:bg-white/10 transition-colors"
                    style={{
                      fontSize: 18,
                      borderRadius: 4,
                    }}
                  >
                    🔔
                    {a > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-[#F59E0B] rounded-full text-[9px] text-black flex items-center justify-center font-bold">
                        {a}
                      </span>
                    )}
                  </button>
                  {n && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl z-50 rounded-sm overflow-hidden">
                      <div
                        className="px-4 py-2.5 border-b border-gray-200 flex justify-between items-center"
                        style={{
                          background: Da,
                        }}
                      >
                        <span className="font-semibold text-sm text-white">
                          Notifications
                        </span>
                        <span className="text-[10px] font-bold bg-[#F59E0B] text-black px-2 py-0.5 rounded-full">
                          {a}
                          {" new"}
                        </span>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {ba.map((e) => (
                          <div
                            key={e.id}
                            className={`px-4 py-3 hover:bg-gray-50 flex gap-3 ${e.read ? `` : `bg-green-50/60`}`}
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-sm overflow-hidden">
                              {e.avatar ? (
                                <img
                                  src={e.avatar}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              ) : (
                                `🔔`
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-gray-800 leading-snug">
                                {e.msg}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {e.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2.5 border-t border-gray-200">
                        <Link
                          to="/dashboard/notifications"
                          className="text-xs font-medium hover:underline"
                          style={{
                            color: Da,
                          }}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  to="/login"
                  className="hidden sm:block font-bold text-green-100 hover:text-white transition-colors px-3 py-2"
                  style={{
                    fontSize: 13,
                    letterSpacing: `0.01em`,
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="font-bold text-black px-5 py-2.5 transition-all hover:opacity-90"
                  style={{
                    background: `#F59E0B`,
                    fontSize: 13,
                    letterSpacing: `0.02em`,
                  }}
                >
                  Join Free →
                </Link>
                <button
                  className="lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 text-white ml-1"
                  onClick={() => t(!e)}
                >
                  <span
                    className={`w-6 h-0.5 bg-current transition-all ${e ? `rotate-45 translate-y-2` : ``}`}
                  />
                  <span
                    className={`w-6 h-0.5 bg-current transition-all ${e ? `opacity-0` : ``}`}
                  />
                  <span
                    className={`w-6 h-0.5 bg-current transition-all ${e ? `-rotate-45 -translate-y-2` : ``}`}
                  />
                </button>
              </div>
            </div>
          </div>
          {e && (
            <div
              className="lg:hidden border-t"
              style={{
                background: Oa,
                borderColor: `rgba(255,255,255,0.10)`,
              }}
            >
              {Ea.map((e) => (
                <NavLink
                  key={e.to}
                  to={e.to}
                  end={e.exact}
                  className={({ isActive: e }) =>
                    `block px-6 py-3 font-bold border-l-4 transition-colors ${e ? `text-white border-[#F59E0B] bg-white/8` : `text-green-200/80 border-transparent hover:text-white hover:bg-white/5`}`
                  }
                  style={{
                    fontSize: 14,
                    letterSpacing: `0.01em`,
                  }}
                >
                  {e.label}
                </NavLink>
              ))}
              <div
                className="px-5 pt-4 pb-5 border-t mt-1 flex gap-3"
                style={{
                  borderColor: `rgba(255,255,255,0.1)`,
                }}
              >
                <Link
                  to="/login"
                  className="flex-1 text-center font-bold text-green-200 py-2.5 border hover:text-white transition-colors"
                  style={{
                    borderColor: `rgba(255,255,255,0.3)`,
                    fontSize: 13,
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center font-bold text-black py-2.5 hover:opacity-90 transition-opacity"
                  style={{
                    background: `#F59E0B`,
                    fontSize: 13,
                  }}
                >
                  Join Free →
                </Link>
              </div>
            </div>
          )}
        </header>
        <main>
          <Outlet />
        </main>
        <footer
          style={{
            background: `#0D1F0A`,
            color: `#94A3B8`,
          }}
          className="pt-14 pb-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="h-1 w-24 mb-10"
              style={{
                background: `#006B3F`,
              }}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="bg-white rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 40,
                      height: 40,
                      padding: 4,
                    }}
                  >
                    <img
                      src={wa}
                      alt="PUST"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      PUST Alumni Network
                    </p>
                    <p
                      className="text-[10px] uppercase tracking-widest mt-0.5"
                      style={{
                        color: `#4ADE80`,
                      }}
                    >
                      Pabna, Bangladesh · Est. 2008
                    </p>
                  </div>
                </div>
                <p
                  className="text-sm leading-relaxed max-w-xs mb-5"
                  style={{
                    color: `#64748B`,
                  }}
                >
                  Connecting 22,400+ alumni of Pabna University of Science &
                  Technology across 45 countries.
                </p>
                <div className="flex gap-2">
                  {[`in`, `𝕏`, `fb`, `yt`].map((e, t) => (
                    <a
                      key={t}
                      href="#"
                      className="w-8 h-8 flex items-center justify-center text-[10px] font-bold transition-colors"
                      style={{
                        background: `rgba(255,255,255,0.06)`,
                        color: `#94A3B8`,
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = `#006B3F`)
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = `rgba(255,255,255,0.06)`)
                      }
                    >
                      {e}
                    </a>
                  ))}
                </div>
              </div>
              {[
                {
                  title: `Network`,
                  links: [
                    {
                      l: `Alumni Directory`,
                      to: `/alumni`,
                    },
                    {
                      l: `Find Mentors`,
                      to: `/mentorship`,
                    },
                    {
                      l: `Career & Jobs`,
                      to: `/jobs`,
                    },
                    {
                      l: `Events`,
                      to: `/events`,
                    },
                  ],
                },
                {
                  title: `Explore`,
                  links: [
                    {
                      l: `Community`,
                      to: `/community`,
                    },
                    {
                      l: `Alumni Stories`,
                      to: `/stories`,
                    },
                    {
                      l: `Photo Gallery`,
                      to: `/gallery`,
                    },
                    {
                      l: `Give Back`,
                      to: `/donate`,
                    },
                    {
                      l: `About PUST`,
                      to: `/about`,
                    },
                    {
                      l: `Contact Us`,
                      to: `/contact`,
                    },
                  ],
                },
                {
                  title: `Account`,
                  links: [
                    {
                      l: `Sign In`,
                      to: `/login`,
                    },
                    {
                      l: `Join Network`,
                      to: `/register`,
                    },
                    {
                      l: `Dashboard`,
                      to: `/dashboard`,
                    },
                    {
                      l: `Admin Panel`,
                      to: `/admin`,
                    },
                  ],
                },
              ].map((e) => (
                <div key={e.title}>
                  <h4
                    className="text-white font-semibold text-xs uppercase tracking-wider mb-4"
                    style={{
                      borderBottom: `1px solid rgba(255,255,255,0.08)`,
                      paddingBottom: 10,
                    }}
                  >
                    {e.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {e.links.map((e) => (
                      <li key={e.l}>
                        <Link
                          to={e.to}
                          className="text-sm transition-colors hover:text-white"
                          style={{
                            color: `#64748B`,
                          }}
                        >
                          {e.l}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div
              className="border-t pt-7 flex flex-col sm:flex-row justify-between items-center gap-4"
              style={{
                borderColor: `rgba(255,255,255,0.07)`,
              }}
            >
              <p
                className="text-xs"
                style={{
                  color: `#475569`,
                }}
              >
                © 2026 PUST Alumni Network. All rights reserved.
              </p>
              <div className="flex gap-5 text-xs">
                {[
                  {
                    l: `Privacy Policy`,
                    to: `#`,
                  },
                  {
                    l: `Terms of Use`,
                    to: `#`,
                  },
                  {
                    l: `Contact Us`,
                    to: `/contact`,
                  },
                ].map((e) => (
                  <Link
                    key={e.l}
                    to={e.to}
                    className="transition-colors hover:text-white"
                    style={{
                      color: `#475569`,
                    }}
                  >
                    {e.l}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  );
}
