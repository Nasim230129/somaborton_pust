import React, { useState } from "react";
import {
  pa,
  ma,
  ha,
  Sa,
  Ca,
  Ia,
  La,
  Ra,
  za,
  Ba,
  Va,
  Ha,
} from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";

var ns = [
    {
      id: 1001,
      url: Ia,
      thumb: Ia,
      title: `PUST Campus — Sunset View`,
      category: `Campus Life`,
      year: `2026`,
      likes: 148,
      stakeholder: `alumni`,
    },
    {
      id: 1002,
      url: Ha,
      thumb: Ha,
      title: `Freshers' Reception & Orientation 2025–26`,
      category: `Events`,
      year: `2025`,
      likes: 214,
      stakeholder: `students`,
    },
    {
      id: 1003,
      url: La,
      thumb: La,
      title: `Award Giving Ceremony — Academic Excellence`,
      category: `Convocation`,
      year: `2026`,
      likes: 176,
      stakeholder: `alumni`,
    },
    {
      id: 1004,
      url: Va,
      thumb: Va,
      title: `জাতীয় হাই স্কুল প্রোগ্রামিং প্রতিযোগিতা ২০২৬`,
      category: `Events`,
      year: `2026`,
      likes: 132,
      stakeholder: `students`,
    },
    {
      id: 1005,
      url: za,
      thumb: za,
      title: `Training on Office Management & Professionalism`,
      category: `Research`,
      year: `2026`,
      likes: 98,
      stakeholder: `faculty`,
    },
    {
      id: 1006,
      url: Ra,
      thumb: Ra,
      title: `Vice Chancellor's Office, PUST`,
      category: `Campus Life`,
      year: `2026`,
      likes: 87,
      stakeholder: `faculty`,
    },
    {
      id: 1007,
      url: Ba,
      thumb: Ba,
      title: `PUST Eagle Sculpture — Campus Identity`,
      category: `Campus Life`,
      year: `2026`,
      likes: 203,
      stakeholder: `alumni`,
    },
  ],
  is = [
    `All`,
    `Campus Life`,
    `Events`,
    `Convocation`,
    `Research`,
    `Alumni Reunion`,
    `Sports`,
  ],
  as = [
    {
      key: `all`,
      label: `All`,
      icon: `🌐`,
    },
    {
      key: `alumni`,
      label: `Alumni`,
      icon: `🎓`,
    },
    {
      key: `students`,
      label: `Students`,
      icon: `📚`,
    },
    {
      key: `faculty`,
      label: `Faculty`,
      icon: `👨‍🏫`,
    },
    {
      key: `employers`,
      label: `Employers`,
      icon: `🏢`,
    },
  ],
  ss = {
    alumni: `badge-blue`,
    students: `badge-green`,
    faculty: `badge-purple`,
    employers: `badge-gold`,
  };
export default function Gallery() {
  useBackendSync();
  let rs = [...ns, ...Ca],
    os = [
      ...pa.map((e) => ({
        ...e,
        group: `alumni`,
        groupLabel: `Alumni`,
      })),
      ...ma.map((e) => ({
        ...e,
        group: `students`,
        groupLabel: `Current Students`,
      })),
      ...ha.map((e) => ({
        ...e,
        group: `faculty`,
        groupLabel: `Faculty`,
      })),
      ...Sa.map((e) => ({
        ...e,
        group: `employers`,
        groupLabel: `Employer Partners`,
      })),
    ],
    [e, t] = useState(`All`),
    [n, r] = useState(`all`),
    [i, a] = useState(null),
    [o, s] = useState(`photos`),
    [c, l] = useState([]),
    u = rs.filter((t) => {
      let r = e === `All` || t.category === e,
        i = n === `all` || t.stakeholder === n;
      return r && i;
    }),
    d = os.filter((e) => n === `all` || e.group === n),
    f = (e, t) => {
      t.stopPropagation();
      if (!c.includes(e)) {
        api.likeGallery(e);
      }
      l((t) => (t.includes(e) ? t.filter((t) => t !== e) : [...t, e]));
    };
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <div
        className="relative overflow-hidden"
        style={{
          height: 380,
        }}
      >
        <div
          className="absolute inset-0 grid gap-0.5"
          style={{
            gridTemplateColumns: `2fr 1fr 1fr 1fr`,
            gridTemplateRows: `1fr 1fr`,
          }}
        >
          <div
            className="overflow-hidden"
            style={{
              gridRow: `1 / 3`,
            }}
          >
            <img
              src={Ia}
              alt="PUST Campus"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src={Ha}
              alt="Freshers"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src={La}
              alt="Award"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src={Va}
              alt="Contest"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src={za}
              alt="Training"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src={Ra}
              alt="VC Office"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src={Ba}
              alt="Sculpture"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.72) 100%)`,
          }}
        />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pt-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-3 px-3 py-1 border border-white/30">
            PUST Photo Gallery
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-white leading-tight mb-3">
            PUST Memories
          </h1>
          <p className="text-white/65 text-sm max-w-md">
            Celebrating every moment — alumni, students, faculty, and partners
            of Pabna University of Science & Technology.
          </p>
        </div>
      </div>
      <div
        style={{
          background: `#1B4F8A`,
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-5 divide-x divide-blue-700">
          {[
            {
              v: rs.length,
              l: `Total Photos`,
            },
            {
              v: rs.filter((e) => e.stakeholder === `alumni`).length,
              l: `Alumni`,
            },
            {
              v: rs.filter((e) => e.stakeholder === `students`).length,
              l: `Students`,
            },
            {
              v: rs.filter((e) => e.stakeholder === `faculty`).length,
              l: `Faculty`,
            },
            {
              v: rs.filter((e) => e.stakeholder === `employers`).length,
              l: `Partners`,
            },
          ].map((e, t) => (
            <div key={t} className="py-3 text-center">
              <p className="font-display font-bold text-white text-lg sm:text-xl leading-none">
                {e.v}
              </p>
              <p className="text-blue-200 text-[10px] mt-0.5">{e.l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7">
        <div className="flex border-b border-[#E2E8F0] mb-5">
          {[`photos`, `people`].map((e) => (
            <button
              key={e}
              onClick={() => s(e)}
              className={`tab-underline ${o === e ? `active` : ``}`}
            >
              {e === `photos` ? `📸 Photos` : `👥 All Stakeholders`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {as.map((e) => (
            <button
              key={e.key}
              onClick={() => r(e.key)}
              className={`btn btn-sm ${n === e.key ? `btn-primary` : `btn-ghost`}`}
            >
              {e.icon} {e.label}
            </button>
          ))}
        </div>
        {o === `photos` && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {is.map((n) => (
                <button
                  key={n}
                  onClick={() => t(n)}
                  className={`btn btn-sm ${e === n ? `btn-green` : `btn-ghost`}`}
                >
                  {n}
                </button>
              ))}
            </div>
            {(e === `All` || ns.some((t) => t.category === e)) &&
              n === `all` &&
              e === `All` && (
                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#006B3F] mb-3">
                    PUST — Real Campus Photos
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {ns.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => a(e)}
                        className="relative overflow-hidden cursor-pointer group border border-gray-200 hover:border-[#006B3F] transition-colors"
                        style={{
                          aspectRatio: `1/1`,
                        }}
                      >
                        <img
                          src={e.thumb}
                          alt={e.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5"
                          style={{
                            background: `linear-gradient(to top, rgba(0,0,0,0.75), transparent 60%)`,
                          }}
                        >
                          <p className="text-white text-[8px] font-semibold leading-tight line-clamp-2">
                            {e.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-b border-gray-200 mt-6 mb-2" />
                </div>
              )}
            {u.length === 0 ? (
              <div className="text-center py-20 text-[#94A3B8]">
                <div className="text-5xl mb-3">📷</div>
                <p className="font-semibold text-[#0F172A]">No photos found</p>
                <p className="text-sm mt-1">Try a different filter</p>
              </div>
            ) : (
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                {u.map((e) => {
                  let t = c.includes(e.id),
                    n = e.id >= 1001;
                  return (
                    <div
                      key={e.id}
                      className="break-inside-avoid group relative overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
                      style={{
                        borderRadius: 0,
                      }}
                      onClick={() => a(e)}
                    >
                      <img
                        src={e.thumb}
                        alt={e.title}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {n && (
                        <div className="absolute top-2 left-2">
                          <span
                            className="text-[8px] font-bold px-1.5 py-0.5 text-white"
                            style={{
                              background: `#006B3F`,
                            }}
                          >
                            PUST
                          </span>
                        </div>
                      )}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
                        style={{
                          background: `linear-gradient(to top, rgba(15,23,42,0.82), transparent 55%)`,
                        }}
                      >
                        <p className="text-white font-semibold text-xs leading-snug">
                          {e.title}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[9px] font-bold text-white/60 uppercase tracking-wide">
                            {e.category}
                          </span>
                          <button
                            onClick={(t) => f(e.id, t)}
                            className="flex items-center gap-1 text-xs text-white font-medium"
                          >
                            {t ? `❤️` : `🤍`} {e.likes + (t ? 1 : 0)}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-8 p-7 text-center border border-dashed border-gray-300 bg-white">
              <div className="text-3xl mb-2">📸</div>
              <h2 className="font-display font-bold text-lg text-[#0F172A] mb-1">
                Share Your PUST Memories
              </h2>
              <p className="text-[#64748B] text-sm max-w-sm mx-auto mb-4">
                Upload photos from events, reunions, or campus moments.
              </p>
              <a href="/login" className="btn btn-green">
                Upload Photos →
              </a>
            </div>
          </>
        )}
        {o === `people` && (
          <div className="space-y-8">
            {(n === `all`
              ? [`alumni`, `students`, `faculty`, `employers`]
              : [n]
            ).map((e) => {
              let t = d.filter((t) => t.group === e);
              if (t.length === 0) return null;
              let n = as.find((t) => t.key === e);
              return (
                <div key={e}>
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-3">
                    <span className="text-xl">{n.icon}</span>
                    <h2 className="font-display font-bold text-lg text-[#0F172A]">
                      {n.label}
                    </h2>
                    <span className="badge badge-gray">{t.length}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {t.map((t) => (
                      <div
                        key={t.id}
                        className="card rounded-xl p-4 text-center hover:shadow-md transition-shadow group"
                      >
                        <div className="relative inline-block mb-2">
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-14 h-14 rounded-full object-cover mx-auto ring-2 ring-[#E2E8F0] group-hover:ring-[#1B4F8A] transition-all"
                          />
                          {t.verified && (
                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#006B3F] rounded-full flex items-center justify-center text-white text-[8px] ring-2 ring-white">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-[#0F172A] text-xs leading-snug truncate">
                          {t.name}
                        </p>
                        <p className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                          {t.headline}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1 justify-center">
                          <span
                            className={`badge text-[8px] ${ss[e] || `badge-gray`}`}
                          >
                            {t.groupLabel}
                          </span>
                          {t.batch && (
                            <span className="badge badge-gray text-[8px]">
                              {"Batch "}
                              {t.batch}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {i && (
        <div
          className="fixed inset-0 bg-black/92 z-[100] flex items-center justify-center p-4"
          onClick={() => a(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-9 right-0 text-white/60 hover:text-white text-2xl leading-none"
              onClick={() => a(null)}
            >
              ✕
            </button>
            <img
              src={i.url}
              alt={i.title}
              className="w-full object-contain max-h-[72vh]"
              style={{
                borderRadius: 0,
              }}
            />
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">{i.title}</p>
                <div className="flex gap-2 mt-1">
                  <span className="badge badge-blue text-[9px]">
                    {i.category}
                  </span>
                  <span className="badge badge-gray text-[9px]">{i.year}</span>
                  <span className="badge badge-green text-[9px] capitalize">
                    {i.stakeholder}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => f(i.id, e)}
                className="flex items-center gap-2 text-white font-semibold text-sm"
              >
                {c.includes(i.id) ? `❤️` : `🤍`}
                {i.likes + (c.includes(i.id) ? 1 : 0)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
