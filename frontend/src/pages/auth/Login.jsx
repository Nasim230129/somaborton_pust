import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

export default function Login() {
  let [e, t] = useState(``),
    [n, r] = useState(``),
    [i, a] = useState(false),
    [o, s] = useState(false),
    [c, l] = useState(``);
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#006B3F] to-[#1B4F8A] flex-col justify-between p-12">
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
            <div className="text-green-200 text-[10px] uppercase tracking-widest">
              Pabna University
            </div>
          </div>
        </Link>
        <div>
          <h2 className="font-display font-bold text-4xl text-white leading-tight mb-6">
            Welcome Back to
            <br />
            <span className="text-[#F59E0B]">22,400+</span>
            <br />
            Alumni
          </h2>
          <div className="space-y-3">
            {[
              `Access your professional alumni profile`,
              `Connect with mentors and classmates`,
              `Find exclusive job opportunities`,
              `Participate in events and communities`,
            ].map((e) => (
              <div
                key={e}
                className="flex items-center gap-3 text-green-100 text-sm"
              >
                <span className="text-[#F59E0B]">✓</span>
                <span>{e}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-green-200 text-xs">
          © 2026 PUST Alumni Network · Pabna, Bangladesh
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#006B3F] flex items-center justify-center">
                <span className="text-white font-bold text-base">P</span>
              </div>
              <span className="font-bold text-[#006B3F] text-lg">
                PUST Alumni
              </span>
            </Link>
          </div>
          <h1 className="font-display font-bold text-3xl text-[#0F172A] mb-1">
            Sign In
          </h1>
          <p className="text-[#64748B] text-sm mb-8">
            Access your PUST alumni account
          </p>
          {c && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <span>⚠️</span>
              {c}
            </div>
          )}
          <form
            onSubmit={async (t) => {
              if ((t.preventDefault(), !e || !n)) {
                l(`Please fill in all fields.`);
                return;
              }
              l(``);
              s(true);
              await api.login({ email: e, password: n });
              setTimeout(() => {
                (s(false), (window.location.href = `/dashboard`));
              }, 800);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                className="input"
                placeholder="rafiq@pust.ac.bd"
                value={e}
                onChange={(e) => t(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-[#1B4F8A] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={i ? `text` : `password`}
                  className="input pr-10"
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  value={n}
                  onChange={(e) => r(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => a(!i)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm"
                >
                  {i ? `🙈` : `👁️`}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={o}
              className={`btn btn-green btn-lg w-full mt-2 ${o ? `opacity-70` : ``}`}
            >
              {o ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                `Sign In →`
              )}
            </button>
          </form>
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8]">or continue as</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className="btn btn-ghost w-full justify-start gap-3 text-sm"
            >
              <span>🎓</span>
              {" Alumni (Demo)"}
            </Link>
            <Link
              to="/admin"
              className="btn btn-ghost w-full justify-start gap-3 text-sm"
            >
              <span>🛡️</span>
              {" Admin (Demo)"}
            </Link>
          </div>
          <p className="text-center text-sm text-[#64748B] mt-8">
            {"New to PUST Alumni? "}
            <Link
              to="/register"
              className="text-[#006B3F] font-semibold hover:underline"
            >
              Create account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
