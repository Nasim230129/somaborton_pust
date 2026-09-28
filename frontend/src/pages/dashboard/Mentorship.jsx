import React, { useState } from "react";
import { pa, ma } from "../../data/mockData";

var Ps = [`Incoming Requests`, `Active Mentorships`, `Find Mentors`, `Reviews`],
  Fs = [
    {
      student: ma[0],
      msg: `I'm a final year CSE student passionate about backend development. I would love guidance on transitioning to a product engineering role like yours at Brain Station 23.`,
      goal: `Backend → Product Engineering`,
    },
    {
      student: ma[1],
      msg: `I'm working on my final year project in embedded systems and struggling with RTOS. Could you guide me from your EEE experience?`,
      goal: `Embedded Systems & RTOS`,
    },
  ];
export default function DashboardMentorship() {
  let [e, t] = useState(`Incoming Requests`),
    [n, r] = useState([]),
    [i, a] = useState([]);
  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-[#0F172A]">
          Mentorship
        </h1>
        <button className="btn btn-green btn-sm">+ Become a Mentor</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            v: `8`,
            l: `Active Mentees`,
            c: `bg-green-50 text-[#006B3F]`,
          },
          {
            v: `2`,
            l: `Pending Requests`,
            c: `bg-amber-50 text-[#D97706]`,
          },
          {
            v: `23`,
            l: `Total Sessions`,
            c: `bg-blue-50 text-[#1B4F8A]`,
          },
          {
            v: `4.9★`,
            l: `Avg. Rating`,
            c: `bg-purple-50 text-purple-700`,
          },
        ].map((e) => (
          <div key={e.l} className="stat-card rounded-xl text-center">
            <div
              className={`font-display font-bold text-2xl ${e.c} w-fit mx-auto px-2 rounded`}
            >
              {e.v}
            </div>
            <div className="text-[#64748B] text-xs mt-1">{e.l}</div>
          </div>
        ))}
      </div>
      <div className="card rounded-xl overflow-hidden">
        <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
          {Ps.map((r) => (
            <button
              key={r}
              onClick={() => t(r)}
              className={`tab-underline whitespace-nowrap ${e === r ? `active` : ``}`}
            >
              {r}
              {r === `Incoming Requests` && (
                <span className="ml-1 badge badge-red text-[9px]">
                  {Fs.filter((e, t) => !n.includes(t) && !i.includes(t)).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="p-5">
          {e === `Incoming Requests` && (
            <div className="space-y-4">
              {Fs.map((e, t) => (
                <div
                  key={t}
                  className={`p-5 rounded-xl border transition-all ${n.includes(t) ? `border-green-200 bg-green-50` : i.includes(t) ? `border-red-100 bg-red-50 opacity-60` : `border-[#E2E8F0]`}`}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={e.student.avatar}
                      alt={e.student.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-[#0F172A]">
                          {e.student.name}
                        </h3>
                        <span className="badge badge-blue text-[9px]">
                          {"Batch "}
                          {e.student.batch}
                        </span>
                        <span className="badge badge-gray text-[9px]">
                          {e.student.dept.split(`&`)[0].trim()}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mb-2">
                        {"Goal: "}
                        <span className="text-[#1B4F8A] font-medium">
                          {e.goal}
                        </span>
                      </p>
                      <p className="text-sm text-[#64748B] leading-relaxed">
                        {e.msg}
                      </p>
                      {n.includes(t) ? (
                        <div className="mt-3 badge badge-green">
                          ✓ Accepted — Mentorship started!
                        </div>
                      ) : i.includes(t) ? (
                        <div className="mt-3 badge badge-red">Declined</div>
                      ) : (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => r([...n, t])}
                            className="btn btn-green btn-sm"
                          >
                            Accept Request
                          </button>
                          <button
                            onClick={() => a([...i, t])}
                            className="btn btn-sm btn-ghost text-red-500"
                          >
                            Decline
                          </button>
                          <button className="btn btn-sm btn-outline">
                            Message First
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {e === `Active Mentorships` && (
            <div className="space-y-3">
              {ma.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-4 p-4 border border-[#E2E8F0] rounded-xl"
                >
                  <img
                    src={e.avatar}
                    alt={e.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0F172A] text-sm">
                      {e.name}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {e.dept}
                      {" \xB7 Batch "}
                      {e.batch}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="btn btn-sm btn-outline">Schedule</button>
                    <button className="btn btn-sm btn-ghost">Message</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {e === `Find Mentors` && (
            <div className="grid sm:grid-cols-2 gap-4">
              {pa
                .filter((e) => e.mentorAvailable && e.id !== 1)
                .map((e) => (
                  <div
                    key={e.id}
                    className="p-4 border border-[#E2E8F0] rounded-xl hover:border-[#006B3F]/40 transition-colors"
                  >
                    <div className="flex gap-3 mb-3">
                      <img
                        src={e.avatar}
                        alt={e.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-[#0F172A] text-sm">
                          {e.name}
                        </h3>
                        <p className="text-xs text-[#64748B]">{e.headline}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {e.skills?.slice(0, 3).map((e) => (
                        <span key={e} className="badge badge-gray text-[9px]">
                          {e}
                        </span>
                      ))}
                    </div>
                    <button className="btn btn-green btn-sm w-full">
                      Request Mentorship
                    </button>
                  </div>
                ))}
            </div>
          )}
          {e === `Reviews` && (
            <div className="space-y-4">
              {[
                {
                  name: `Ariful Islam`,
                  rating: 5,
                  text: `Dr. Rafiqul gave me incredibly detailed feedback on my portfolio and helped me land an internship at Brain Station 23. Life-changing mentorship!`,
                  batch: `CSE '22`,
                },
                {
                  name: `Sumaiya Khatun`,
                  rating: 5,
                  text: `Patient, knowledgeable, and genuinely invested in my growth. Helped me navigate my first job search with confidence.`,
                  batch: `EEE '23`,
                },
              ].map((e, t) => (
                <div key={t} className="p-5 bg-[#F8FAFC] rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#F59E0B]">
                      {`★`.repeat(e.rating)}
                    </span>
                    <span className="font-semibold text-[#0F172A] text-sm">
                      {e.name}
                    </span>
                    <span className="text-[#94A3B8] text-xs">
                      {"Batch "}
                      {e.batch}
                    </span>
                  </div>
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    {e.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
