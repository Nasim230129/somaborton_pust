import React, { useState } from "react";
import { va } from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";

export default function DashboardJobs() {
  useBackendSync();
  let [e, t] = useState(`Browse Jobs`),
    [n, r] = useState([]),
    [i, a] = useState([]);
  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-[#0F172A]">
          Jobs & Career
        </h1>
        <button className="btn btn-primary btn-sm">+ Post a Job</button>
      </div>
      <div className="card rounded-xl overflow-hidden">
        <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
          {[
            `Browse Jobs`,
            `My Applications`,
            `Saved Jobs`,
            `Posted by Alumni`,
          ].map((n) => (
            <button
              key={n}
              onClick={() => t(n)}
              className={`tab-underline ${e === n ? `active` : ``}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="p-5">
          {e === `Browse Jobs` && (
            <div className="space-y-3">
              {va.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl border border-[#E2E8F0] hover:border-[#1B4F8A]/30 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {e.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#0F172A] text-sm">
                        {e.title}
                      </h3>
                      <span
                        className={`badge text-[9px] ${e.type === `Internship` ? `badge-purple` : `badge-blue`}`}
                      >
                        {e.type}
                      </span>
                      {e.remote && (
                        <span className="badge badge-green text-[9px]">
                          Remote
                        </span>
                      )}
                    </div>
                    <p className="text-[#64748B] text-xs">
                      {e.company}
                      {" \xB7 "}
                      {e.location}
                    </p>
                    <div className="flex gap-3 text-[10px] text-[#94A3B8] mt-1">
                      <span>
                        {"\uD83D\uDCB0 "}
                        {e.salary}
                      </span>
                      <span>
                        {"\u23F0 Deadline: "}
                        {e.deadline}
                      </span>
                      <span>
                        {"\uD83D\uDC65 "}
                        {e.applicants}
                        {" applied"}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#006B3F] mt-1">
                      {"\uD83D\uDCA1 "}
                      {e.postedBy}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        a(
                          i.includes(e.id)
                            ? i.filter((t) => t !== e.id)
                            : [...i, e.id],
                        )
                      }
                      className={`btn btn-sm ${i.includes(e.id) ? `btn-primary` : `btn-ghost`}`}
                    >
                      {i.includes(e.id) ? `💾` : `🔖`}
                    </button>
                    <button
                      onClick={() => {
                        if (!n.includes(e.id)) {
                          api.applyJob(e.id);
                          r([...n, e.id]);
                        }
                      }}
                      className={`btn btn-sm ${n.includes(e.id) ? `bg-[#006B3F] text-white` : `btn-primary`}`}
                    >
                      {n.includes(e.id) ? `✓ Applied` : `Apply`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {e === `My Applications` && (
            <div>
              {n.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="font-semibold text-[#0F172A]">
                    No Applications Yet
                  </h3>
                  <p className="text-[#64748B] text-sm mt-1">
                    Browse jobs and apply to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {va
                    .filter((e) => n.includes(e.id))
                    .map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center gap-4 p-4 border border-[#E2E8F0] rounded-xl"
                      >
                        <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-xl">
                          {e.logo}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#0F172A] text-sm">
                            {e.title}
                          </h3>
                          <p className="text-xs text-[#64748B]">{e.company}</p>
                        </div>
                        <span className="badge badge-green text-[9px]">
                          Applied
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          {e === `Saved Jobs` && (
            <div>
              {i.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-5xl mb-4">🔖</div>
                  <h3 className="font-semibold text-[#0F172A]">
                    No Saved Jobs
                  </h3>
                  <p className="text-[#64748B] text-sm mt-1">
                    Save jobs you're interested in to review later.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {va
                    .filter((e) => i.includes(e.id))
                    .map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center gap-4 p-4 border border-[#E2E8F0] rounded-xl"
                      >
                        <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-xl">
                          {e.logo}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#0F172A] text-sm">
                            {e.title}
                          </h3>
                          <p className="text-xs text-[#64748B]">
                            {e.company}
                            {" \xB7 "}
                            {e.salary}
                          </p>
                        </div>
                        <button
                          onClick={() => r([...n, e.id])}
                          className="btn btn-primary btn-sm"
                        >
                          Apply Now
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          {e === `Posted by Alumni` && (
            <div className="space-y-3">
              {va.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-4 p-4 border border-[#E2E8F0] rounded-xl"
                >
                  <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-xl">
                    {e.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#0F172A] text-sm">
                      {e.title}
                    </h3>
                    <p className="text-[#64748B] text-xs">{e.company}</p>
                    <p className="text-[10px] text-[#006B3F] mt-0.5">
                      {"\uD83D\uDC64 "}
                      {e.postedBy}
                    </p>
                  </div>
                  <button className="btn btn-sm btn-outline flex-shrink-0">
                    Request Referral
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
