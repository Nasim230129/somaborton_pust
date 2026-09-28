import React, { useState } from "react";

var qs = [`Account`, `Privacy`, `Notifications`, `Security`, `Danger Zone`];
export default function DashboardSettings() {
  let [e, t] = useState(`Account`),
    [n, r] = useState(false),
    i = () => {
      (r(true), setTimeout(() => r(false), 2e3));
    };
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display font-bold text-2xl text-[#0F172A]">
          Settings
        </h1>
        {n && <span className="badge badge-green">✓ Changes saved</span>}
      </div>
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="w-full sm:w-44 flex-shrink-0">
          <div className="card rounded-xl overflow-hidden">
            {qs.map((n) => (
              <button
                key={n}
                onClick={() => t(n)}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${e === n ? `bg-[#EFF6FF] text-[#1B4F8A] border-r-2 border-[#1B4F8A]` : `text-[#64748B] hover:bg-[#F8FAFC]`} ${n === `Danger Zone` ? `text-red-500 hover:bg-red-50` : ``}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 card rounded-xl p-6">
          {e === `Account` && (
            <div className="space-y-5">
              <h2 className="font-semibold text-[#0F172A]">Account Settings</h2>
              {[
                {
                  label: `Email Address`,
                  val: `rafiqul@brainstationbd.com`,
                  type: `email`,
                },
                {
                  label: `Display Name`,
                  val: `Dr. Rafiqul Islam`,
                  type: `text`,
                },
                {
                  label: `Username`,
                  val: `rafiqul-islam-2008`,
                  type: `text`,
                },
                {
                  label: `Phone`,
                  val: `+880 1700 000000`,
                  type: `tel`,
                },
              ].map((e) => (
                <div key={e.label}>
                  <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    {e.label}
                  </label>
                  <input type={e.type} className="input" defaultValue={e.val} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Language
                </label>
                <select className="input">
                  <option>English</option>
                  <option>বাংলা</option>
                </select>
              </div>
              <button onClick={i} className="btn btn-green">
                Save Account Settings
              </button>
            </div>
          )}
          {e === `Privacy` && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#0F172A]">Privacy Controls</h2>
              <p className="text-[#64748B] text-sm">
                Control who can see your profile and how you appear in search
                results.
              </p>
              {[
                {
                  label: `Profile Visibility`,
                  opts: [`Public`, `PUST Alumni Only`, `Connections Only`],
                  default: `Public`,
                },
                {
                  label: `Show Email Address`,
                  opts: [`No one`, `Connections`, `All alumni`],
                  default: `Connections`,
                },
                {
                  label: `Search Visibility`,
                  opts: [`Visible`, `Hidden`],
                  default: `Visible`,
                },
              ].map((e) => (
                <div key={e.label}>
                  <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    {e.label}
                  </label>
                  <select className="input text-sm">
                    {e.opts.map((t) => (
                      <option key={t} selected={t === e.default}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="space-y-3 pt-2">
                {[
                  {
                    label: `Allow others to see my connections list`,
                    on: true,
                  },
                  {
                    label: `Allow contact via platform messaging`,
                    on: true,
                  },
                  {
                    label: `Show my activity status (online/offline)`,
                    on: false,
                  },
                ].map((e, t) => (
                  <label
                    key={t}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-sm text-[#64748B]">{e.label}</span>
                    <div
                      className={`w-9 h-5 rounded-full flex items-center ${e.on ? `bg-[#006B3F]` : `bg-[#E2E8F0]`}`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow mx-0.5 transition-transform ${e.on ? `translate-x-4` : ``}`}
                      />
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={i} className="btn btn-green">
                Save Privacy Settings
              </button>
            </div>
          )}
          {e === `Security` && (
            <div className="space-y-5">
              <h2 className="font-semibold text-[#0F172A]">
                Password & Security
              </h2>
              {[
                {
                  label: `Current Password`,
                  type: `password`,
                  placeholder: `••••••••`,
                },
                {
                  label: `New Password`,
                  type: `password`,
                  placeholder: `Minimum 8 characters`,
                },
                {
                  label: `Confirm New Password`,
                  type: `password`,
                  placeholder: `Repeat new password`,
                },
              ].map((e) => (
                <div key={e.label}>
                  <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    {e.label}
                  </label>
                  <input
                    type={e.type}
                    className="input"
                    placeholder={e.placeholder}
                  />
                </div>
              ))}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-[#1B4F8A] mb-2">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-[#64748B] mb-3">
                  Add an extra layer of security using your phone number or
                  authenticator app.
                </p>
                <button className="btn btn-outline btn-sm">Enable 2FA</button>
              </div>
              <button onClick={i} className="btn btn-primary">
                Update Password
              </button>
            </div>
          )}
          {e === `Danger Zone` && (
            <div className="space-y-5">
              <h2 className="font-semibold text-red-600">Danger Zone</h2>
              <div className="border border-amber-200 bg-amber-50 rounded-xl p-5">
                <h3 className="font-semibold text-[#0F172A] mb-1">
                  Deactivate Account
                </h3>
                <p className="text-[#64748B] text-xs mb-3">
                  Temporarily hide your profile and suspend all activity. You
                  can reactivate at any time.
                </p>
                <button className="btn btn-sm border border-amber-400 text-amber-700 hover:bg-amber-100">
                  Deactivate Account
                </button>
              </div>
              <div className="border border-red-200 bg-red-50 rounded-xl p-5">
                <h3 className="font-semibold text-red-600 mb-1">
                  Delete Account
                </h3>
                <p className="text-[#64748B] text-xs mb-3">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <button className="btn btn-danger btn-sm">
                  Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
