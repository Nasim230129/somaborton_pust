import React, { useState } from "react";
import { Link } from "react-router-dom";
import { pa, ma } from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";

var ks = [`Connections`, `Pending`, `Suggestions`, `Students to Help`];
export default function DashboardNetwork() {
  useBackendSync();
  let [e, t] = useState(`Connections`),
    [n, r] = useState([1, 5]),
    [i, a] = useState([3, 7]),
    o =
      {
        Connections: pa.filter((e) => n.includes(e.id)),
        Pending: pa.filter((e) => i.includes(e.id)),
        Suggestions: pa.filter((e) => !n.includes(e.id) && !i.includes(e.id)),
        "Students to Help": ma,
      }[e] || [];
  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-[#0F172A]">
          My Network
        </h1>
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <span className="font-semibold text-[#0F172A]">{n.length}</span>
          {" connections"}
        </div>
      </div>
      <div className="card rounded-xl overflow-hidden">
        <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
          {ks.map((n) => (
            <button
              key={n}
              onClick={() => t(n)}
              className={`tab-underline ${e === n ? `active` : ``}`}
            >
              {n}
              {n === `Pending` && i.length > 0 && (
                <span className="ml-1.5 badge badge-red text-[9px]">
                  {i.length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-3">
          {o.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="font-semibold text-[#0F172A]">
                {"No "}
                {e}
                {" Yet"}
              </h3>
              <p className="text-[#64748B] text-sm mt-1">
                Start exploring the alumni directory to connect.
              </p>
              <Link to="/alumni" className="btn btn-primary btn-sm mt-4">
                Browse Alumni
              </Link>
            </div>
          ) : (
            o.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F8FAFC] transition-colors"
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-[#0F172A] text-sm">
                      {t.name}
                    </p>
                    {t.verified && (
                      <span className="text-[#006B3F] text-[10px]">✓</span>
                    )}
                  </div>
                  <p className="text-[#64748B] text-xs mt-0.5 truncate">
                    {t.headline}
                  </p>
                  <p className="text-[10px] text-[#94A3B8]">
                    {t.dept} {t.batch ? `· Batch ${t.batch}` : ``}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {e === `Connections` && (
                    <>
                      <Link to={`/dashboard/messages?startWith=${t.id}`} className="btn btn-sm btn-ghost">Message</Link>
                      <button
                        onClick={() => r(n.filter((e) => e !== t.id))}
                        className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </>
                  )}
                  {e === `Pending` && (
                    <>
                      <button
                        onClick={() => {
                          api.connectAlumni(t.id);
                          r([...n, t.id]);
                          a(i.filter((e) => e !== t.id));
                        }}
                        className="btn btn-sm btn-green"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => a(i.filter((e) => e !== t.id))}
                        className="btn btn-sm btn-ghost text-red-500"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {e === `Suggestions` && (
                    <button
                      onClick={() => {
                        api.connectAlumni(t.id);
                        a([...i, t.id]);
                      }}
                      className="btn btn-sm btn-primary"
                    >
                      Connect
                    </button>
                  )}
                  {e === `Students to Help` && (
                    <Link to="/dashboard/mentorship" className="btn btn-sm btn-outline">Mentor</Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
