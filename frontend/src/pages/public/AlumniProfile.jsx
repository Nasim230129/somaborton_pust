import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pa, ma, ha, Sa } from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";

var mo = [
    {
      year: `2023–Present`,
      role: `Software Architect`,
      company: `Brain Station 23`,
      icon: `💼`,
    },
    {
      year: `2019–2023`,
      role: `Senior Software Engineer`,
      company: `Samsung R&D Bangladesh`,
      icon: `💼`,
    },
    {
      year: `2015–2019`,
      role: `Software Engineer`,
      company: `Kona Software Lab`,
      icon: `💼`,
    },
    {
      year: `2004–2008`,
      role: `BSc in CSE`,
      company: `PUST (CGPA 3.87/4.00)`,
      icon: `🎓`,
    },
  ];
export default function AlumniProfile() {
  useBackendSync();
  let { id: e } = useParams(),
    navigate = useNavigate(),
    [connected, setConnected] = useState(false),
    [mentorReq, setMentorReq] = useState(false),
    po = [...pa, ...ma, ...ha, ...Sa],
    t = po.find((t) => t.id === Number(e)) || pa[0];
  return (
    <div className="pt-16 min-h-screen bg-[#F1F5F9]">
      <div className="bg-gradient-to-r from-[#1B4F8A] to-[#006B3F] h-48 lg:h-56 relative">
        <img
          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1400&h=300&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="card rounded-xl p-6">
              <div className="relative mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
                {t.verified && (
                  <span className="absolute bottom-0 right-0 w-7 h-7 bg-[#006B3F] rounded-full flex items-center justify-center text-white text-sm ring-2 ring-white">
                    ✓
                  </span>
                )}
              </div>
              <h1 className="font-display font-bold text-xl text-[#0F172A]">
                {t.name}
              </h1>
              {t.verified && (
                <span className="badge badge-green text-[9px] mt-1">
                  Verified Alumni
                </span>
              )}
              <p className="text-[#64748B] text-sm mt-2 leading-snug">
                {t.headline}
              </p>
              <div className="mt-4 space-y-2 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <span>🏛️</span>
                  <span>{t.dept}</span>
                </div>
                {t.batch && (
                  <div className="flex items-center gap-2">
                    <span>🎓</span>
                    <span>
                      {"Batch "}
                      {t.batch}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{t.location}</span>
                </div>
                {t.company && (
                  <div className="flex items-center gap-2">
                    <span>🏢</span>
                    <span>{t.company}</span>
                  </div>
                )}
                {t.connections && (
                  <div className="flex items-center gap-2">
                    <span>🔗</span>
                    <span>
                      {t.connections + (connected ? 1 : 0)}
                      {" connections"}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (!connected) {
                      setConnected(true);
                      api.connectAlumni(t.id);
                    }
                  }}
                  className={`btn btn-sm ${connected ? "btn-green" : "btn-primary"}`}
                >
                  {connected ? "✓ Connected" : "Connect"}
                </button>
                <button
                  onClick={() => navigate("/dashboard/messages")}
                  className="btn btn-outline btn-sm"
                >
                  Message
                </button>
              </div>
              {t.mentorAvailable && (
                <button
                  onClick={() => {
                    if (!mentorReq) {
                      setMentorReq(true);
                      api.requestMentorship({ mentorId: t.id, mentorName: t.name });
                    }
                  }}
                  className="btn btn-green btn-sm w-full mt-2"
                >
                  {mentorReq ? "✓ Request Sent" : "Request Mentorship"}
                </button>
              )}
            </div>
            {t.skills && (
              <div className="card rounded-xl p-5">
                <h3 className="font-semibold text-[#0F172A] text-sm mb-3">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {t.skills.map((e) => (
                    <span key={e} className="badge badge-blue text-xs">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {t.mentorAvailable && (
              <div className="card rounded-xl p-5 border-l-4 border-[#006B3F]">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="font-semibold text-[#0F172A] text-sm">
                      Available for Mentorship
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1">
                      {"Ready to guide students and junior alumni in "}
                      {t.industry || `their field`}.
                    </p>
                    <button
                      onClick={() => {
                        if (!mentorReq) {
                          setMentorReq(true);
                          api.requestMentorship({ mentorId: t.id, mentorName: t.name });
                        }
                      }}
                      className="btn btn-green btn-sm mt-3"
                    >
                      {mentorReq ? "✓ Request Sent" : "Request Mentorship"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-2 space-y-4">
            {t.bio && (
              <div className="card rounded-xl p-6">
                <h2 className="font-semibold text-[#0F172A] mb-3">About</h2>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {t.bio}
                </p>
              </div>
            )}
            <div className="card rounded-xl p-6">
              <h2 className="font-semibold text-[#0F172A] mb-5">
                Career & Education Timeline
              </h2>
              <div className="space-y-5">
                {mo.map((e, t) => (
                  <div key={t} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-lg flex-shrink-0">
                        {e.icon}
                      </div>
                      {t < mo.length - 1 && (
                        <div className="w-0.5 h-8 bg-[#E2E8F0] mt-2" />
                      )}
                    </div>
                    <div className="pb-5 flex-1">
                      <p className="text-xs text-[#94A3B8] font-medium">
                        {e.year}
                      </p>
                      <h3 className="font-semibold text-[#0F172A] text-sm mt-0.5">
                        {e.role}
                      </h3>
                      <p className="text-[#64748B] text-xs">{e.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card rounded-xl p-6">
              <h2 className="font-semibold text-[#0F172A] mb-4">
                Achievements
              </h2>
              <div className="space-y-3">
                {[
                  {
                    icon: `🏆`,
                    title: `Distinguished Alumni Award 2023`,
                    by: `PUST Alumni Association`,
                  },
                  {
                    icon: `📄`,
                    title: `Published 3 peer-reviewed papers on ML systems`,
                    by: `IEEE Transactions`,
                  },
                  {
                    icon: `🚀`,
                    title: `Led team that scaled Brain Station to 500+ engineers`,
                    by: `2022`,
                  },
                ].map((e, t) => (
                  <div
                    key={t}
                    className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-lg"
                  >
                    <span className="text-xl">{e.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">
                        {e.title}
                      </p>
                      <p className="text-xs text-[#94A3B8]">{e.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card rounded-xl p-6">
              <h2 className="font-semibold text-[#0F172A] mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {[
                  {
                    text: `Shared an article about AI trends in Bangladesh's tech ecosystem 🇧🇩`,
                    time: `2 days ago`,
                  },
                  {
                    text: `Congratulated PUST Class of 2026 on graduation!`,
                    time: `1 week ago`,
                  },
                  {
                    text: `Accepted 3 new mentorship requests from PUST students.`,
                    time: `2 weeks ago`,
                  },
                ].map((e, n) => (
                  <div
                    key={n}
                    className="flex gap-3 p-3 bg-[#F8FAFC] rounded-lg"
                  >
                    <img
                      src={t.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm text-[#0F172A]">{e.text}</p>
                      <p className="text-xs text-[#94A3B8] mt-1">{e.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
