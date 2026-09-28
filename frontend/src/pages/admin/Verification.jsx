import React, { useState } from "react";
import { api } from "../../services/api";

var oc = [
  {
    id: 1,
    name: `Sumaiya Islam`,
    dept: `EEE`,
    batch: `2019`,
    avatar: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format`,
    submitted: `2 days ago`,
    docs: [`Transcript`, `Student ID`],
    note: `Graduated with Honours, CGPA 3.92`,
  },
  {
    id: 2,
    name: `Arif Chowdhury`,
    dept: `CSE`,
    batch: `2024`,
    avatar: `https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&auto=format`,
    submitted: `1 day ago`,
    docs: [`Enrollment Letter`],
    note: `Current final year student`,
  },
  {
    id: 3,
    name: `Dilruba Yasmin`,
    dept: `CHEM`,
    batch: `2016`,
    avatar: `https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&auto=format`,
    submitted: `4 days ago`,
    docs: [`Degree Certificate`, `NID Copy`],
    note: `Currently working as Lecturer at RUET`,
  },
  {
    id: 4,
    name: `Nazmul Kabir`,
    dept: `MATH`,
    batch: `2018`,
    avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format`,
    submitted: `5 days ago`,
    docs: [`Transcript`],
    note: `PhD student at Dhaka University`,
  },
  {
    id: 5,
    name: `Tasnim Akter`,
    dept: `PHY`,
    batch: `2021`,
    avatar: `https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&auto=format`,
    submitted: `3 hrs ago`,
    docs: [`Degree Certificate`, `Transcript`, `Passport`],
    note: `Currently in Japan for research`,
  },
];
export default function AdminVerification() {
  let [e, t] = useState(
      oc.map((e) => ({
        ...e,
        status: `pending`,
        note2: ``,
      })),
    ),
    [n, r] = useState({}),
    i = (n) => {
      api.updateVerification(n, `approved`);
      t(
        e.map((e) =>
          e.id === n
            ? {
                ...e,
                status: `approved`,
              }
            : e,
        ),
      );
    },
    a = (n) => {
      api.updateVerification(n, `rejected`);
      t(
        e.map((e) =>
          e.id === n
            ? {
                ...e,
                status: `rejected`,
              }
            : e,
        ),
      );
    },
    o = e.filter((e) => e.status === `pending`),
    s = e.filter((e) => e.status !== `pending`);
  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F172A]">
            Alumni Verification
          </h1>
          <p className="text-[#64748B] text-sm">
            {o.length}
            {" pending review"}
          </p>
        </div>
        <span className="badge badge-gold text-sm px-3 py-1.5">
          {o.length}
          {" Pending"}
        </span>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-[#1B4F8A]">
        <p className="font-semibold mb-1">Verification Criteria</p>
        <ul className="list-disc list-inside space-y-0.5 text-[#64748B]">
          <li>Valid PUST degree certificate or enrollment letter required</li>
          <li>Batch year must match university records</li>
          <li>Documents must be legible and unaltered</li>
          <li>
            Mismatched info triggers identity review — do not auto-approve
          </li>
        </ul>
      </div>
      {o.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-[#0F172A]">Pending Review</h2>
          {o.map((e) => (
            <div key={e.id} className="card rounded-xl p-5">
              <div className="flex items-start gap-4">
                <img
                  src={e.avatar}
                  alt={e.name}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-[#E2E8F0]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#0F172A]">{e.name}</h3>
                      <p className="text-xs text-[#64748B]">
                        {e.dept}
                        {" \xB7 Batch "}
                        {e.batch}
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {"Submitted "}
                        {e.submitted}
                      </p>
                    </div>
                    <span className="badge badge-gold text-[9px] flex-shrink-0">
                      Pending
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-3 bg-[#F8FAFC] rounded-lg p-2.5 italic">
                    "{e.note}"
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Documents:
                    </span>
                    {e.docs.map((e) => (
                      <button
                        key={e}
                        className="badge badge-blue text-[9px] hover:bg-blue-200 cursor-pointer"
                      >
                        {"\uD83D\uDCCE "}
                        {e}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 mb-2">
                    <input
                      className="input text-xs"
                      placeholder="Add a rejection reason (required to reject)\u2026"
                      value={n[e.id] || ``}
                      onChange={(t) =>
                        r({
                          ...n,
                          [e.id]: t.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => i(e.id)}
                      className="btn btn-green btn-sm"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => a(e.id)}
                      className="btn btn-danger btn-sm"
                      disabled={!n[e.id]}
                    >
                      ✕ Reject
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      Request More Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {s.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-[#0F172A]">Recently Processed</h2>
          {s.map((e) => (
            <div
              key={e.id}
              className="card rounded-xl p-4 flex items-center gap-4"
            >
              <img
                src={e.avatar}
                alt={e.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-sm text-[#0F172A]">{e.name}</p>
                <p className="text-xs text-[#94A3B8]">
                  {e.dept}
                  {" \xB7 Batch "}
                  {e.batch}
                </p>
              </div>
              <span
                className={`badge ${e.status === `approved` ? `badge-green` : `badge-red`}`}
              >
                {e.status === `approved` ? `✓ Approved` : `✕ Rejected`}
              </span>
            </div>
          ))}
        </div>
      )}
      {o.length === 0 && s.length === e.length && (
        <div className="card rounded-xl p-16 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-semibold text-[#0F172A]">All Clear!</h3>
          <p className="text-[#64748B] text-sm mt-1">
            No pending verifications at this time.
          </p>
        </div>
      )}
    </div>
  );
}
