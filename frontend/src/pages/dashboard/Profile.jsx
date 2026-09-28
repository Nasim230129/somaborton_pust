import React, { useState } from "react";
import { pa } from "../../data/mockData";
import { api, getCurrentUser, useBackendSync } from "../../services/api";

export default function DashboardProfile() {
  useBackendSync();
  let Gs = getCurrentUser() || pa[0],
    [e, t] = useState(false),
    [n, r] = useState(false),
    [i, a] = useState({
      name: Gs.name,
      headline: Gs.headline,
      location: Gs.location,
      bio: Gs.bio || ``,
      company: Gs.company || ``,
    });
  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-[#0F172A]">
          My Profile
        </h1>
        {n && <span className="badge badge-green">✓ Profile saved</span>}
        <button
          onClick={() => t(!e)}
          className={`btn btn-sm ${e ? `btn-ghost` : `btn-outline`}`}
        >
          {e ? `Cancel` : `✏️ Edit Profile`}
        </button>
      </div>
      <div className="card rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#1B4F8A] to-[#006B3F]" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <img
                src={Gs.avatar}
                alt={Gs.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
              />
              {e && (
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-[#1B4F8A] rounded-full text-white text-xs flex items-center justify-center">
                  ✏️
                </button>
              )}
              {Gs.verified && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-[#006B3F] rounded-full flex items-center justify-center text-white text-[9px] ring-2 ring-white">
                  ✓
                </span>
              )}
            </div>
            {e && (
              <button
                onClick={async () => {
                  await api.updateProfile(Gs.id || 1, i);
                  r(true);
                  t(false);
                  setTimeout(() => r(false), 2e3);
                }}
                className="btn btn-green btn-sm"
              >
                Save Changes
              </button>
            )}
          </div>
          {e ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  className="input"
                  value={i.name}
                  onChange={(e) =>
                    a({
                      ...i,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                  Professional Headline
                </label>
                <input
                  className="input"
                  value={i.headline}
                  onChange={(e) =>
                    a({
                      ...i,
                      headline: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                    Current Company
                  </label>
                  <input
                    className="input"
                    value={i.company}
                    onChange={(e) =>
                      a({
                        ...i,
                        company: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    className="input"
                    value={i.location}
                    onChange={(e) =>
                      a({
                        ...i,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                  Bio
                </label>
                <textarea
                  className="input h-24 resize-none"
                  value={i.bio}
                  onChange={(e) =>
                    a({
                      ...i,
                      bio: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-display font-bold text-xl text-[#0F172A]">
                {i.name}
              </h2>
              {Gs.verified && (
                <span className="badge badge-green text-[9px] mt-0.5">
                  Verified Alumni
                </span>
              )}
              <p className="text-[#64748B] text-sm mt-2">{i.headline}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#94A3B8] mt-3">
                <span>
                  {"\uD83C\uDFDB\uFE0F "}
                  {Gs.dept}
                </span>
                <span>
                  {"\uD83C\uDF93 Batch "}
                  {Gs.batch}
                </span>
                <span>
                  {"\uD83D\uDCCD "}
                  {i.location}
                </span>
                {i.company && (
                  <span>
                    {"\uD83C\uDFE2 "}
                    {i.company}
                  </span>
                )}
                <span>
                  {"\uD83D\uDD17 "}
                  {Gs.connections}
                  {" connections"}
                </span>
              </div>
              {i.bio && (
                <p className="text-sm text-[#64748B] leading-relaxed mt-4">
                  {i.bio}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="card rounded-xl p-5">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold text-[#0F172A]">Profile Completion</h2>
          <span className="font-bold text-[#006B3F]">84%</span>
        </div>
        <div className="progress-bar h-2 mb-4">
          <div
            className="progress-fill bg-[#006B3F]"
            style={{
              width: `84%`,
            }}
          />
        </div>
        <div className="space-y-2">
          {[
            {
              label: `Profile photo`,
              done: true,
            },
            {
              label: `Professional headline`,
              done: true,
            },
            {
              label: `Bio / About`,
              done: true,
            },
            {
              label: `Skills`,
              done: true,
            },
            {
              label: `Career timeline`,
              done: true,
            },
            {
              label: `LinkedIn URL`,
              done: false,
            },
            {
              label: `Publications`,
              done: false,
            },
          ].map((e) => (
            <div
              key={e.label}
              className={`flex items-center gap-2.5 text-xs ${e.done ? `text-[#006B3F]` : `text-[#94A3B8]`}`}
            >
              <span>{e.done ? `✓` : `○`}</span>
              <span>{e.label}</span>
              {!e.done && (
                <button className="ml-auto text-[#1B4F8A] hover:underline text-[10px]">
                  Add
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="card rounded-xl p-5">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold text-[#0F172A]">Skills</h2>
          {e && (
            <button className="text-xs text-[#1B4F8A] hover:underline">
              + Add Skill
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {Gs.skills?.map((e) => (
            <span key={e} className="badge badge-blue">
              {e}
            </span>
          ))}
          {e && (
            <button className="badge badge-gray cursor-pointer hover:bg-[#E2E8F0]">
              + Add
            </button>
          )}
        </div>
      </div>
      <div className="card rounded-xl p-5">
        <h2 className="font-semibold text-[#0F172A] mb-4">Privacy Settings</h2>
        <div className="space-y-3">
          {[
            {
              label: `Show profile to public visitors`,
              on: true,
            },
            {
              label: `Show email to connections`,
              on: false,
            },
            {
              label: `Show in search results`,
              on: true,
            },
            {
              label: `Available for mentorship`,
              on: true,
            },
          ].map((e, t) => (
            <div key={t} className="flex items-center justify-between">
              <span className="text-sm text-[#64748B]">{e.label}</span>
              <div
                className={`w-9 h-5 rounded-full flex items-center cursor-pointer ${e.on ? `bg-[#006B3F]` : `bg-[#E2E8F0]`}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow mx-0.5 transition-transform ${e.on ? `translate-x-4` : ``}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
