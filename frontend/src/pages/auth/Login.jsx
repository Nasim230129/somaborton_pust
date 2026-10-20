import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";
import { wa, Ka } from "../../data/mockData";

export default function Login() {
  usePageMeta("Sign In · PUST Alumni Network", "Sign in to your Pabna University of Science and Technology alumni account.");

  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const initialEmail = queryParams.get("email") || "";
  const isRegisteredParam = queryParams.get("registered") === "1";

  let [e, t] = useState(initialEmail),
    [n, r] = useState(``),
    [i, a] = useState(false),
    [o, s] = useState(false),
    [c, l] = useState(``),
    [successNotice, setSuccessNotice] = useState(
      isRegisteredParam ? "Account created successfully! Please sign in with your email and password." : ""
    ),
    [showForgotModal, setShowForgotModal] = useState(false),
    [resetEmail, setResetEmail] = useState(initialEmail),
    [resetPassword, setResetPassword] = useState(""),
    [resetConfirmPassword, setResetConfirmPassword] = useState(""),
    [showResetPass, setShowResetPass] = useState(false),
    [showResetConfirmPass, setShowResetConfirmPass] = useState(false),
    [resetLoading, setResetLoading] = useState(false),
    [resetMsg, setResetMsg] = useState({ type: "", text: "" });

  const fillDemoAccount = (email, pwd) => {
    t(email);
    r(pwd);
    l("");
  };

  const openResetModal = () => {
    setResetEmail(e || initialEmail);
    setResetPassword("");
    setResetConfirmPassword("");
    setResetMsg({ type: "", text: "" });
    setShowForgotModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C] flex">
      {/* Self-Service Reset Password Modal */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#17263C]/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#7A1737]/10 text-[#7A1737] flex items-center justify-center text-xl">
                🔐
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-[#94A3B8] hover:text-[#17263C] text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="font-serif font-bold text-xl text-[#17263C] mb-1">
              Reset Your Password
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed mb-4">
              Enter your registered email address and choose a new password (min 6 chars) to restore account access:
            </p>

            {resetMsg.text && (
              <div
                className={`p-3 rounded-xl text-xs mb-4 flex items-center gap-2 ${
                  resetMsg.type === "success"
                    ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534]"
                    : "bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C]"
                }`}
              >
                <span>{resetMsg.type === "success" ? "✅" : "⚠️"}</span>
                <span>{resetMsg.text}</span>
              </div>
            )}

            <form
              onSubmit={async (ev) => {
                ev.preventDefault();
                setResetMsg({ type: "", text: "" });
                if (!resetEmail) {
                  setResetMsg({ type: "error", text: "Please enter your email address." });
                  return;
                }
                if (!resetPassword || resetPassword.length < 6) {
                  setResetMsg({ type: "error", text: "New password must be at least 6 characters." });
                  return;
                }
                if (resetPassword !== resetConfirmPassword) {
                  setResetMsg({ type: "error", text: "Passwords do not match. Please verify." });
                  return;
                }
                setResetLoading(true);
                const res = await api.resetPassword({
                  email: resetEmail,
                  newPassword: resetPassword,
                });
                setResetLoading(false);
                if (res && res.ok) {
                  setResetMsg({
                    type: "success",
                    text: res.message || "Password successfully reset!",
                  });
                  t(resetEmail);
                  r(resetPassword);
                  setTimeout(() => {
                    setShowForgotModal(false);
                    setSuccessNotice("Password successfully reset! Please click 'Sign In' below.");
                  }, 1200);
                } else {
                  setResetMsg({
                    type: "error",
                    text: res?.message || "Password reset failed. Please check the email.",
                  });
                }
              }}
              className="space-y-3 mb-5"
            >
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 focus:outline-none text-[#17263C] rounded-lg px-3 py-2 text-xs placeholder-[#94A3B8]"
                  placeholder="e.g. jaka@pust.ac.bd"
                  value={resetEmail}
                  onChange={(ev) => setResetEmail(ev.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showResetPass ? "text" : "password"}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 focus:outline-none text-[#17263C] rounded-lg px-3 py-2 text-xs pr-9 placeholder-[#94A3B8]"
                    placeholder="Minimum 6 characters"
                    value={resetPassword}
                    onChange={(ev) => setResetPassword(ev.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPass(!showResetPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-xs hover:text-[#17263C] cursor-pointer"
                  >
                    {showResetPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showResetConfirmPass ? "text" : "password"}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 focus:outline-none text-[#17263C] rounded-lg px-3 py-2 text-xs pr-9 placeholder-[#94A3B8]"
                    placeholder="Re-type new password"
                    value={resetConfirmPassword}
                    onChange={(ev) => setResetConfirmPassword(ev.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetConfirmPass(!showResetConfirmPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-xs hover:text-[#17263C] cursor-pointer"
                  >
                    {showResetConfirmPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-2.5 rounded-lg bg-[#7A1737] hover:bg-[#62122B] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60"
              >
                {resetLoading ? "Updating Password…" : "Reset Password & Continue →"}
              </button>
            </form>

            <div className="pt-3 border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center justify-between">
              <span>Helpdesk: alumni@pust.ac.bd</span>
              <span className="font-mono bg-[#F8FAFC] px-1.5 py-0.5 rounded border border-[#E2E8F0] text-[#17263C]">
                demo: pust2026
              </span>
            </div>
          </div>
        </div>
      )}


      {/* Institutional Left Hero Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#17263C] border-r border-[#0F1A2A] flex-col justify-between p-12 relative overflow-hidden text-white reveal-left">
        <img
          src={Ka}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, rgba(23, 38, 60, 0.88) 0%, rgba(23, 38, 60, 0.98) 100%)`,
          }}
        />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <img src={wa} alt="PUST" className="w-10 h-10 object-contain drop-shadow-sm" />
          <div>
            <div className="font-bold text-white text-sm tracking-wide">
              PUST ALUMNI NETWORK
            </div>
            <div className="text-[#C7A76C] text-[10px] uppercase tracking-widest font-semibold">
              <span className="font-bengali">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span>
            </div>
          </div>
        </Link>

        <div className="relative z-10 my-auto py-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C7A76C] mb-3">
            Institutional Gateway · Authentication
          </p>
          <h2 className="font-serif font-bold text-4xl text-white leading-tight mb-6 tracking-tight">
            Connect with
            <br />
            <span className="text-[#C7A76C]">22,400+</span>
            <br />
            PUST Graduates
          </h2>
          <div className="space-y-3.5 max-w-md">
            {[
              `Verified alumni network across 45+ countries worldwide`,
              `Direct mentorship connections with university faculty and leaders`,
              `Access curated professional opportunities and research fellowships`,
              `Attend institutional convocations, reunions, and webinars`,
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-3 text-[#CBD5E1] text-xs leading-relaxed"
              >
                <span className="text-[#C7A76C] font-bold text-sm">✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[#94A3B8] text-xs">
          © 2026 Pabna University of Science and Technology · Alumni Association
        </p>
      </div>

      {/* Sign-in Form Panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-[#F4F5F7] reveal-right">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-xs reveal-pop delay-100">
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={wa} alt="PUST" className="w-9 h-9 object-contain" />
              <div className="text-left">
                <span className="font-bold text-[#17263C] text-sm block tracking-wide">
                  PUST ALUMNI
                </span>
                <span className="text-[9px] text-[#7A1737] uppercase font-semibold tracking-wider block">
                  Pabna University of Science & Tech
                </span>
              </div>
            </Link>
          </div>

          <h1 className="font-serif font-bold text-2xl text-[#17263C] mb-1.5 tracking-tight">
            Sign In
          </h1>
          <p className="text-[#64748B] text-xs mb-4">
            Enter your institutional email and password to access your alumni account
          </p>

          {/* Quick Demo Fill Buttons */}
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl mb-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A1737] mb-2 flex items-center gap-1">
              <span>⚡</span> <span>1-Click Demo Login Credentials:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount("rafiq@pust.ac.bd", "pust2026")}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-white border border-[#CBD5E1] text-[#17263C] hover:border-[#7A1737] hover:text-[#7A1737] transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                title="Auto-fill Dr. Rafiqul Islam (Alumni)"
              >
                <span>🎓 Dr. Rafiqul</span>
                <span className="text-[#64748B] font-mono text-[10px]">pust2026</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("nusrat@example.com", "pust2026")}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-white border border-[#CBD5E1] text-[#17263C] hover:border-[#7A1737] hover:text-[#7A1737] transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                title="Auto-fill Nusrat Jahan (Student)"
              >
                <span>📚 Nusrat</span>
                <span className="text-[#64748B] font-mono text-[10px]">pust2026</span>
              </button>
            </div>
          </div>

          {successNotice && (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <span>✅</span>
              <span>{successNotice}</span>
            </div>
          )}

          {c && (
            <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs px-4 py-3 rounded-xl mb-5">
              <div className="flex items-center gap-2 mb-1.5 font-semibold">
                <span>⚠️</span>
                <span>{c}</span>
              </div>
              <div className="text-[11px] text-[#7F1D1D] pl-6 flex items-center gap-1.5 flex-wrap">
                <span>Forgot your password?</span>
                <button
                  type="button"
                  onClick={openResetModal}
                  className="font-bold underline text-[#7A1737] hover:text-[#62122B] cursor-pointer"
                >
                  Click here to reset it now
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={async (t) => {
              t.preventDefault();
              if (!e || !n) {
                l("Please enter both email and password.");
                return;
              }
              l("");
              setSuccessNotice("");
              s(true);
              const res = await api.login({ email: e, password: n });
              if (res && res.ok) {
                setTimeout(() => {
                  s(false);
                  window.location.href = "/dashboard";
                }, 500);
              } else {
                s(false);
                l(res?.message || "Invalid email or password. Please try again.");
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 focus:outline-none text-[#17263C] rounded-lg px-3.5 py-2.5 text-xs placeholder-[#94A3B8] transition-all"
                placeholder="rafiq@pust.ac.bd"
                value={e}
                onChange={(ev) => t(ev.target.value)}
                required
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={openResetModal}
                  className="text-xs text-[#7A1737] hover:underline transition-colors font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={i ? `text` : `password`}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 focus:outline-none text-[#17263C] rounded-lg px-3.5 py-2.5 text-xs pr-10 placeholder-[#94A3B8] transition-all"
                  placeholder="••••••••"
                  value={n}
                  onChange={(ev) => r(ev.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => a(!i)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm hover:text-[#17263C] cursor-pointer"
                >
                  {i ? `🙈` : `👁️`}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={o}
              className={`w-full py-2.5 text-xs font-semibold rounded-lg bg-[#7A1737] hover:bg-[#62122B] text-white transition-all cursor-pointer shadow-xs active:scale-95 ${o ? `opacity-70` : ``}`}
            >
              {o ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                `Sign In →`
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold">or explore demo portal</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          <div className="space-y-2">
            <Link
              to="/dashboard"
              className="w-full flex items-center justify-start gap-3 text-xs font-semibold p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:bg-white text-[#17263C] transition-all cursor-pointer shadow-2xs"
            >
              <span>🎓</span>
              <span>Alumni Dashboard (Demo)</span>
            </Link>
            <Link
              to="/admin"
              className="w-full flex items-center justify-start gap-3 text-xs font-semibold p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:bg-white text-[#17263C] transition-all cursor-pointer shadow-2xs"
            >
              <span>🛡️</span>
              <span>Admin Portal (Demo)</span>
            </Link>
          </div>

          <p className="text-center text-xs text-[#64748B] mt-8">
            {"New to PUST Alumni? "}
            <Link
              to="/register"
              className="text-[#7A1737] font-semibold hover:underline ml-1"
            >
              Create Account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
