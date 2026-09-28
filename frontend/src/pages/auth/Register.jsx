import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

var xs = [
    {
      key: `alumni`,
      label: `Alumni`,
      icon: `🎓`,
      desc: `I graduated from PUST`,
    },
    {
      key: `student`,
      label: `Current Student`,
      icon: `📚`,
      desc: `I am currently enrolled at PUST`,
    },
    {
      key: `faculty`,
      label: `Faculty/Staff`,
      icon: `🏛️`,
      desc: `I work at PUST`,
    },
    {
      key: `employer`,
      label: `Employer/Recruiter`,
      icon: `💼`,
      desc: `I want to hire PUST graduates`,
    },
  ],
  Ss = [
    `Computer Science & Engineering`,
    `Electrical & Electronic Engineering`,
    `Mathematics`,
    `Physics`,
    `Chemistry`,
    `Business Administration`,
    `Civil Engineering`,
    `English`,
  ],
  Cs = Array.from(
    {
      length: 18,
    },
    (e, t) => String(2008 + t),
  );
export default function Register() {
  let [e, t] = useState(1),
    [n, r] = useState(``),
    [i, a] = useState({
      name: ``,
      email: ``,
      password: ``,
      dept: ``,
      batch: ``,
    }),
    [o, s] = useState(false),
    [c, l] = useState(false),
    [u, d] = useState(false),
    f = (e, t) =>
      a((n) => ({
        ...n,
        [e]: t,
      }));
  return u ? (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4">
      <div className="card rounded-2xl p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          📧
        </div>
        <h2 className="font-display font-bold text-2xl text-[#0F172A] mb-3">
          Check Your Email
        </h2>
        <p className="text-[#64748B] mb-6">
          {"We sent a verification link to "}
          <span className="font-semibold text-[#0F172A]">{i.email}</span>. Click
          the link to activate your account.
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-[#1B4F8A] font-semibold mb-1">
            For Alumni accounts:
          </p>
          <p className="text-xs text-[#64748B]">
            After verifying your email, our team will verify your PUST alumnus
            status within 24–48 hours. You'll receive a second email when
            approved.
          </p>
        </div>
        <Link to="/login" className="btn btn-green w-full">
          Go to Login →
        </Link>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-[#1B4F8A] to-[#006B3F] flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-base font-display">
              P
            </span>
          </div>
          <div>
            <div className="font-bold text-white text-base">
              PUST Alumni Network
            </div>
            <div className="text-blue-200 text-[10px] uppercase tracking-widest">
              Pabna University
            </div>
          </div>
        </Link>
        <div>
          <div className="space-y-4 mb-8">
            {[
              {
                step: `01`,
                title: `Select Your Role`,
              },
              {
                step: `02`,
                title: `Personal Information`,
              },
              {
                step: `03`,
                title: `Verify & Launch`,
              },
            ].map((t, n) => (
              <div
                key={t.step}
                className={`flex items-center gap-3 ${n + 1 <= e ? `opacity-100` : `opacity-40`}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${n + 1 < e ? `bg-[#F59E0B] text-white` : n + 1 === e ? `bg-white text-[#1B4F8A]` : `border-2 border-white/30 text-white`}`}
                >
                  {n + 1 < e ? `✓` : t.step}
                </div>
                <span
                  className={`text-sm ${n + 1 === e ? `text-white font-semibold` : `text-blue-200`}`}
                >
                  {t.title}
                </span>
              </div>
            ))}
          </div>
          <p className="text-blue-200 text-sm">
            Join 22,400+ PUST alumni already on the network.
          </p>
        </div>
        <p className="text-blue-300 text-xs">© 2026 PUST Alumni Network</p>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              {"Step "}
              {e}
              {" of 2"}
            </span>
            <h1 className="font-display font-bold text-3xl text-[#0F172A] mt-1">
              {e === 1 ? `Join the Network` : `Your Details`}
            </h1>
          </div>
          {e === 1 ? (
            <div>
              <p className="text-[#64748B] text-sm mb-6">
                Select your role to get started:
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {xs.map((e) => (
                  <button
                    key={e.key}
                    onClick={() => r(e.key)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${n === e.key ? `border-[#006B3F] bg-green-50` : `border-[#E2E8F0] hover:border-[#006B3F]/40 bg-white`}`}
                  >
                    <div className="text-2xl mb-2">{e.icon}</div>
                    <div className="font-semibold text-[#0F172A] text-sm">
                      {e.label}
                    </div>
                    <div className="text-[#94A3B8] text-xs mt-0.5 leading-snug">
                      {e.desc}
                    </div>
                  </button>
                ))}
              </div>
              <button
                disabled={!n}
                onClick={() => t(2)}
                className={`btn btn-green btn-lg w-full ${n ? `` : `opacity-50 cursor-not-allowed`}`}
              >
                Continue →
              </button>
              <p className="text-center text-sm text-[#64748B] mt-5">
                {"Already have an account? "}
                <Link
                  to="/login"
                  className="text-[#006B3F] font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                l(true);
                await api.register({ ...i, role: n || "alumni" });
                setTimeout(() => {
                  (l(false), d(true));
                }, 800);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  className="input"
                  placeholder="Md. Rafiqul Islam"
                  value={i.name}
                  onChange={(e) => f(`name`, e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@email.com"
                  value={i.email}
                  onChange={(e) => f(`email`, e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder="Minimum 8 characters"
                  value={i.password}
                  onChange={(e) => f(`password`, e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              {(n === `alumni` || n === `student` || n === `faculty`) && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                      Department
                    </label>
                    <select
                      className="input"
                      value={i.dept}
                      onChange={(e) => f(`dept`, e.target.value)}
                      required
                    >
                      <option value="">Select department…</option>
                      {Ss.map((e) => (
                        <option key={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                  {n === `alumni` && (
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                        Graduation Year (Batch)
                      </label>
                      <select
                        className="input"
                        value={i.batch}
                        onChange={(e) => f(`batch`, e.target.value)}
                        required
                      >
                        <option value="">Select year…</option>
                        {Cs.map((e) => (
                          <option key={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
              {n === `alumni` && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  📋 Alumni accounts require verification. You'll be notified
                  within 24–48 hours after submitting.
                </div>
              )}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={o}
                  onChange={(e) => s(e.target.checked)}
                  className="mt-1 flex-shrink-0"
                />
                <span className="text-xs text-[#64748B]">
                  {"I agree to the "}
                  <a href="#" className="text-[#1B4F8A] hover:underline">
                    Terms of Use
                  </a>
                  {" and "}
                  <a href="#" className="text-[#1B4F8A] hover:underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => t(1)}
                  className="btn btn-ghost flex-1"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!o || c}
                  className={`btn btn-green flex-[2] ${!o || c ? `opacity-60` : ``}`}
                >
                  {c ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    `Create Account →`
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
