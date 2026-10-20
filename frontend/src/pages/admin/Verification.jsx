import React, { useState } from "react";
import { api } from "../../services/api";
import { createInitialsAvatar } from "../../data/mockData";

var oc = [
  {
    id: 1,
    name: `Sumaiya Islam`,
    dept: `EEE`,
    batch: `2019`,
    avatar: createInitialsAvatar(`Sumaiya Islam`, `alumni`),
    submitted: `2 days ago`,
    docs: [`Transcript`, `Student ID`],
    note: `Graduated with Honours, CGPA 3.92`,
  },
  {
    id: 2,
    name: `Arif Chowdhury`,
    dept: `CSE`,
    batch: `2024`,
    avatar: createInitialsAvatar(`Arif Chowdhury`, `student`),
    submitted: `1 day ago`,
    docs: [`Enrollment Letter`],
    note: `Current final year student`,
  },
  {
    id: 3,
    name: `Dilruba Yasmin`,
    dept: `CHEM`,
    batch: `2016`,
    avatar: createInitialsAvatar(`Dilruba Yasmin`, `alumni`),
    submitted: `4 days ago`,
    docs: [`Degree Certificate`, `NID Copy`],
    note: `Currently working as Lecturer at RUET`,
  },
  {
    id: 4,
    name: `Nazmul Kabir`,
    dept: `MATH`,
    batch: `2018`,
    avatar: createInitialsAvatar(`Nazmul Kabir`, `alumni`),
    submitted: `5 days ago`,
    docs: [`Transcript`],
    note: `PhD student at Dhaka University`,
  },
  {
    id: 5,
    name: `Tasnim Akter`,
    dept: `PHY`,
    batch: `2021`,
    avatar: createInitialsAvatar(`Tasnim Akter`, `student`),
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
    [toastMsg, setToastMsg] = useState(""),
    [previewDoc, setPreviewDoc] = useState(null),
    showToast = (msg) => {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(""), 3000);
    },
    i = (n) => {
      api.updateVerification(n, `approved`);
      t(
        e.map((item) =>
          item.id === n
            ? {
                ...item,
                status: `approved`,
              }
            : item,
        ),
      );
      showToast("অ্যালামনাই প্রোফাইল সফলভাবে ভেরিফাই ও অনুমোদন করা হয়েছে!");
    },
    a = (n) => {
      api.updateVerification(n, `rejected`);
      t(
        e.map((item) =>
          item.id === n
            ? {
                ...item,
                status: `rejected`,
              }
            : item,
        ),
      );
      showToast("আবেদনটি বাতিল করা হয়েছে।");
    },
    handleRequestMoreInfo = (applicantName) => {
      showToast(`অতিরিক্ত তথ্য চাওয়ার নোটিশ ${applicantName}-এর নিকট পাঠানো হয়েছে!`);
    },
    o = e.filter((e) => e.status === `pending`),
    s = e.filter((e) => e.status !== `pending`);
  return (
    <div className="space-y-5 max-w-5xl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-[#0F172A] text-sm sm:text-base flex items-center gap-2">
                <span>📎</span> {previewDoc.title}
              </h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="py-8 text-center bg-slate-50 rounded-xl my-4 border border-dashed border-slate-300">
              <span className="text-4xl">📄</span>
              <p className="text-xs font-semibold text-[#0F172A] mt-2">
                {previewDoc.title} · {previewDoc.applicant}
              </p>
              <p className="text-[11px] text-[#64748B] mt-1">
                Official PUST Registrar & Exam Controller verification watermark verified.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="btn btn-primary btn-sm cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

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
                    {e.docs.map((docName) => (
                      <button
                        key={docName}
                        onClick={() => setPreviewDoc({ title: docName, applicant: e.name })}
                        className="badge badge-blue text-[9px] hover:bg-blue-200 cursor-pointer"
                        title="Click to preview document"
                      >
                        📎 {docName}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 mb-2">
                    <input
                      className="input text-xs"
                      placeholder="Add a rejection reason (required to reject)…"
                      value={n[e.id] || ""}
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
                      className="btn btn-green btn-sm cursor-pointer"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => a(e.id)}
                      className="btn btn-danger btn-sm cursor-pointer"
                      disabled={!n[e.id]}
                    >
                      ✕ Reject
                    </button>
                    <button
                      onClick={() => handleRequestMoreInfo(e.name)}
                      className="btn btn-ghost btn-sm cursor-pointer"
                    >
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
