import React, { useState } from "react";
import { api } from "../../services/api";

var vc = [
  {
    id: 1,
    title: `Senior Software Engineer`,
    company: `Brain Station 23`,
    dept: `CSE`,
    type: `Full-time`,
    location: `Dhaka`,
    salary: `BDT 80–120K`,
    posted: `2 days ago`,
    status: `pending`,
    applicants: 0,
  },
  {
    id: 2,
    title: `Power Systems Engineer`,
    company: `BPDB`,
    dept: `EEE`,
    type: `Government`,
    location: `Dhaka`,
    salary: `Grade 9`,
    posted: `1 day ago`,
    status: `approved`,
    applicants: 34,
  },
  {
    id: 3,
    title: `Data Analyst Intern`,
    company: `HSBC Bangladesh`,
    dept: `MATH`,
    type: `Internship`,
    location: `Dhaka`,
    salary: `BDT 20K`,
    posted: `3 days ago`,
    status: `approved`,
    applicants: 91,
  },
  {
    id: 4,
    title: `Research Assistant`,
    company: `PUST`,
    dept: `PHY`,
    type: `Part-time`,
    location: `Pabna`,
    salary: `Stipend`,
    posted: `4 hrs ago`,
    status: `pending`,
    applicants: 0,
  },
  {
    id: 5,
    title: `Content Strategist`,
    company: `The Daily Star`,
    dept: `English`,
    type: `Full-time`,
    location: `Dhaka`,
    salary: `BDT 40–60K`,
    posted: `5 days ago`,
    status: `approved`,
    applicants: 58,
  },
  {
    id: 6,
    title: `Civil Engineer`,
    company: `LGED`,
    dept: `CE`,
    type: `Government`,
    location: `Multiple`,
    salary: `Grade 8`,
    posted: `6 days ago`,
    status: `rejected`,
    applicants: 0,
  },
];
export default function AdminJobs() {
  let [e, t] = useState(vc),
    [n, r] = useState(`all`),
    i = (n, r) => {
      api.updateJob(n, { status: r });
      t(
        e.map((e) =>
          e.id === n
            ? {
                ...e,
                status: r,
              }
            : e,
        ),
      );
    },
    a = n === `all` ? e : e.filter((e) => e.status === n),
    o = {
      pending: e.filter((e) => e.status === `pending`).length,
      approved: e.filter((e) => e.status === `approved`).length,
      rejected: e.filter((e) => e.status === `rejected`).length,
    };
  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F172A]">
            Job Postings
          </h1>
          <p className="text-[#64748B] text-sm">
            {e.length}
            {" total postings"}
          </p>
        </div>
        <button className="btn btn-green btn-sm">+ Add Posting</button>
      </div>
      <div className="flex gap-3 flex-wrap">
        {[
          [`all`, `All`, e.length],
          [`pending`, `Pending Review`, o.pending],
          [`approved`, `Approved`, o.approved],
          [`rejected`, `Rejected`, o.rejected],
        ].map(([e, t, i]) => (
          <button
            key={e}
            onClick={() => r(e)}
            className={`btn btn-sm ${n === e ? `btn-primary` : `btn-ghost`}`}
          >
            {t} <span className="ml-1 badge badge-gray text-[9px]">{i}</span>
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {a.map((e) => (
          <div key={e.id} className="card rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                💼
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">{e.title}</h3>
                    <p className="text-xs text-[#64748B]">
                      {e.company}
                      {" \xB7 "}
                      {e.location}
                      {" \xB7 "}
                      {e.type}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="badge badge-gray text-[9px]">
                        {e.dept}
                      </span>
                      <span className="badge badge-blue text-[9px]">
                        {e.salary}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        {"Posted "}
                        {e.posted}
                      </span>
                      {e.applicants > 0 && (
                        <span className="text-[10px] text-[#64748B]">
                          {"\uD83D\uDC65 "}
                          {e.applicants}
                          {" applicants"}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`badge flex-shrink-0 ${e.status === `approved` ? `badge-green` : e.status === `rejected` ? `badge-red` : `badge-gold`}`}
                  >
                    {e.status === `approved`
                      ? `✓ Approved`
                      : e.status === `rejected`
                        ? `✕ Rejected`
                        : `⏳ Pending`}
                  </span>
                </div>
                {e.status === `pending` && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => i(e.id, `approved`)}
                      className="btn btn-green btn-sm"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => i(e.id, `rejected`)}
                      className="btn btn-danger btn-sm"
                    >
                      ✕ Reject
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {a.length === 0 && (
          <div className="card rounded-xl py-16 text-center text-[#94A3B8]">
            No jobs in this category.
          </div>
        )}
      </div>
    </div>
  );
}
