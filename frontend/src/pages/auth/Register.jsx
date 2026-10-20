import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";
import { wa, Ka } from "../../data/mockData";

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
      desc: `I work or teach at PUST`,
    },
    {
      key: `employer`,
      label: `Employer/Recruiter`,
      icon: `💼`,
      desc: `I want to hire PUST talent`,
    },
  ],
  Ss = [
    `Computer Science & Engineering`,
    `Electrical & Electronic Engineering`,
    `Electrical, Electronic & Communication Engg.`,
    `Information & Communication Engineering`,
    `Civil Engineering`,
    `Architecture`,
    `Urban and Regional Planning`,
    `Mathematics`,
    `Physics`,
    `Pharmacy`,
    `Chemistry`,
    `Statistics and Data Science`,
    `Business Administration`,
    `Tourism and Hospitality Management`,
    `Economics`,
    `Bangla`,
    `Social Work`,
    `English`,
    `Public Administration`,
    `History`,
    `Geography and Environment`,
  ],
  Cs = Array.from(
    {
      length: 23,
    },
    (e, t) => String(2008 + t),
  );
export default function Register() {
  usePageMeta("Create Account · PUST Alumni Network", "Join the official Pabna University of Science and Technology Alumni Network.");
  let [e, t] = useState(1),
    [n, r] = useState(`alumni`),
    [i, a] = useState({
      name: ``,
      email: ``,
      password: ``,
      dept: ``,
      batch: ``,
    }),
    [confirmPassword, setConfirmPassword] = useState(``),
    [showPass, setShowPass] = useState(false),
    [showConfirmPass, setShowConfirmPass] = useState(false),
    [o, s] = useState(false),
    [c, l] = useState(false),
    [u, d] = useState(false),
    [errMsg, setErrMsg] = useState(""),
    [showTerms, setShowTerms] = useState(false),
    [showPrivacy, setShowPrivacy] = useState(false),
    f = (field, val) =>
      a((prev) => ({
        ...prev,
        [field]: val,
      }));

  return u ? (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C] flex items-center justify-center px-4">
      <div className="rounded-2xl p-8 sm:p-12 max-w-md w-full text-center bg-white border border-[#E2E8F0] shadow-lg">
        <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 text-[#7A1737] shadow-xs">
          🎉
        </div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#7A1737] mb-1">
          Account Created Successfully
        </p>
        <h2 className="font-serif font-bold text-2xl text-[#17263C] mb-3">
          Welcome to PUST Alumni
        </h2>
        <p className="text-[#475569] text-xs sm:text-sm mb-6 leading-relaxed">
          {"Your account has been registered for "}
          <span className="font-semibold text-[#17263C]">{i.email}</span>. You can now access your member dashboard or explore directory connections.
        </p>
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-[#17263C] font-bold mb-1">
            Alumni Affiliation Notice:
          </p>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Your profile has been created and is active. The Alumni Affairs Office verifies degree records periodically for the verified alumni badge.
          </p>
        </div>
        <div className="space-y-2.5">
          <Link
            to="/dashboard"
            className="inline-flex w-full items-center justify-center py-2.5 rounded-lg bg-[#7A1737] hover:bg-[#62122B] text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            Enter Alumni Dashboard Now →
          </Link>
          <Link
            to={`/login?registered=1&email=${encodeURIComponent(i.email)}`}
            className="inline-flex w-full items-center justify-center py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#17263C] font-semibold text-xs transition-colors cursor-pointer"
          >
            Go to Sign In Page →
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C] flex">
      {/* Terms Modal */}
      {showTerms && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#17263C]/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowTerms(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif font-bold text-xl text-[#17263C] mb-3">
              PUST Alumni Network Terms of Use
            </h3>
            <div className="text-xs text-[#475569] space-y-3 leading-relaxed mb-6">
              <p>
                1. <strong>Institutional Membership:</strong> Membership in the PUST Alumni Network is reserved for graduates, current students, faculty, and authorized employer partners of Pabna University of Science and Technology.
              </p>
              <p>
                2. <strong>Code of Conduct:</strong> Members agree to engage professionally and respectfully. Any fraudulent credentials, spamming, harassment, or misrepresentation will result in immediate profile suspension.
              </p>
              <p>
                3. <strong>Data Authenticity:</strong> All academic batch, department, and employment history submitted during registration is subject to institutional verification by the Registrar's Office.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="w-full py-2.5 rounded-lg bg-[#7A1737] text-white text-xs font-semibold hover:bg-[#62122B] transition-colors cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#17263C]/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPrivacy(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif font-bold text-xl text-[#17263C] mb-3">
              PUST Alumni Privacy Policy
            </h3>
            <div className="text-xs text-[#475569] space-y-3 leading-relaxed mb-6">
              <p>
                1. <strong>Data Collection:</strong> We collect professional headlines, department affiliation, graduation batch, and contact details to facilitate alumni networking and mentorship.
              </p>
              <p>
                2. <strong>Privacy Controls:</strong> You retain complete control over your profile visibility. You can toggle public discovery and email privacy at any time in Profile Settings.
              </p>
              <p>
                3. <strong>No Third-Party Sharing:</strong> Your personal contact details are never sold or rented to commercial third parties.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPrivacy(false)}
              className="w-full py-2.5 rounded-lg bg-[#7A1737] text-white text-xs font-semibold hover:bg-[#62122B] transition-colors cursor-pointer"
            >
              Accept & Close
            </button>
          </div>
        </div>
      )}
      {/* Left Institutional Sidebar */}
      <div className="hidden lg:flex w-5/12 bg-[#17263C] border-r border-[#0F1A2A] flex-col justify-between p-12 relative overflow-hidden text-white reveal-left">
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

        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C7A76C] mb-6">
            Membership Onboarding
          </p>
          <div className="space-y-4 mb-8">
            {[
              {
                step: `01`,
                title: `Select Your Community Role`,
              },
              {
                step: `02`,
                title: `Academic & Profile Details`,
              },
              {
                step: `03`,
                title: `Verification & Activation`,
              },
            ].map((st, idx) => (
              <div
                key={st.step}
                className={`flex items-center gap-3.5 ${idx + 1 <= e ? `opacity-100` : `opacity-40`}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    idx + 1 < e
                      ? `bg-[#7A1737] text-white`
                      : idx + 1 === e
                      ? `bg-[#C7A76C] text-[#17263C] ring-2 ring-white/30`
                      : `border border-white/20 text-white/50`
                  }`}
                >
                  {idx + 1 < e ? `✓` : st.step}
                </div>
                <span
                  className={`text-xs ${idx + 1 === e ? `text-white font-semibold` : `text-[#CBD5E1]`}`}
                >
                  {st.title}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[#CBD5E1] text-xs leading-relaxed max-w-xs">
            Join 22,400+ PUST graduates, faculty researchers, and student scholars across Bangladesh and worldwide.
          </p>
        </div>

        <p className="relative z-10 text-[#94A3B8] text-xs">
          © 2026 Pabna University of Science & Technology · Alumni Trust
        </p>
      </div>

      {/* Right Registration Card */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 overflow-y-auto bg-[#F4F5F7] reveal-right">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-xs reveal-pop delay-100">
          <div className="mb-6">
            <span className="text-[10px] font-bold text-[#7A1737] uppercase tracking-[0.25em]">
              {"Step "}
              {e}
              {" of 2"}
            </span>
            <h1 className="font-serif font-bold text-2xl text-[#17263C] mt-1 tracking-tight">
              {e === 1 ? `Join the Alumni Network` : `Your Academic Details`}
            </h1>
          </div>

          {e === 1 ? (
            <div>
              <p className="text-[#64748B] text-xs mb-6">
                Select your primary affiliation with PUST to begin:
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {xs.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => r(item.key)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      n === item.key
                        ? `border-[#7A1737] bg-white shadow-xs ring-1 ring-[#7A1737]/30`
                        : `border-[#E2E8F0] hover:border-[#CBD5E1] bg-[#F8FAFC]`
                    }`}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-bold text-[#17263C] text-xs sm:text-sm">
                      {item.label}
                    </div>
                    <div className="text-[#64748B] text-[10px] mt-0.5 leading-snug">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
              <button
                disabled={!n}
                onClick={() => t(2)}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold bg-[#7A1737] hover:bg-[#62122B] text-white transition-all cursor-pointer shadow-xs active:scale-95 ${
                  n ? `` : `opacity-40 cursor-not-allowed`
                }`}
              >
                Continue →
              </button>
              <p className="text-center text-xs text-[#64748B] mt-5">
                {"Already registered? "}
                <Link
                  to="/login"
                  className="text-[#7A1737] font-semibold hover:underline ml-1"
                >
                  Sign in
                </Link>
              </p>
            </div>
          ) : (
            <>
              {errMsg && (
                <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errMsg}</span>
                </div>
              )}
              <form
                onSubmit={async (ev) => {
                  ev.preventDefault();
                  setErrMsg("");
                  if (!i.password || i.password.length < 6) {
                    setErrMsg("Password must be at least 6 characters.");
                    return;
                  }
                  if (i.password !== confirmPassword) {
                    setErrMsg("Passwords do not match. Please verify both password fields.");
                    return;
                  }
                  l(true);
                  const res = await api.register({ ...i, role: n || "alumni" });
                  if (res && res.ok) {
                    setTimeout(() => {
                      l(false);
                      d(true);
                    }, 500);
                  } else {
                    l(false);
                    setErrMsg(res?.message || "Registration failed. Please check your information and try again.");
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 focus:outline-none text-[#17263C] rounded-lg px-3.5 py-2.5 text-xs placeholder-[#94A3B8] transition-all"
                    placeholder="e.g. Dr. Rafiqul Islam"
                    value={i.name}
                    onChange={(ev) => f(`name`, ev.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 focus:outline-none text-[#17263C] rounded-lg px-3.5 py-2.5 text-xs placeholder-[#94A3B8] transition-all"
                    placeholder="you@email.com"
                    value={i.email}
                    onChange={(ev) => f(`email`, ev.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 focus:outline-none text-[#17263C] rounded-lg px-3.5 py-2.5 text-xs pr-10 placeholder-[#94A3B8] transition-all"
                      placeholder="Minimum 6 characters"
                      value={i.password}
                      onChange={(ev) => f(`password`, ev.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm hover:text-[#17263C] cursor-pointer"
                      title={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#7A1737] focus:ring-1 focus:ring-[#7A1737]/20 focus:outline-none text-[#17263C] rounded-lg px-3.5 py-2.5 text-xs pr-10 placeholder-[#94A3B8] transition-all"
                      placeholder="Re-type your password"
                      value={confirmPassword}
                      onChange={(ev) => setConfirmPassword(ev.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm hover:text-[#17263C] cursor-pointer"
                      title={showConfirmPass ? "Hide password" : "Show password"}
                    >
                      {showConfirmPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {(n === `alumni` || n === `student` || n === `faculty`) && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                        Department
                      </label>
                      <select
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#7A1737] focus:outline-none text-[#17263C] rounded-lg px-3.5 py-2.5 text-xs cursor-pointer"
                        value={i.dept}
                        onChange={(ev) => f(`dept`, ev.target.value)}
                        required
                      >
                        <option value="" className="text-[#94A3B8]">Select department…</option>
                        {Ss.map((deptName) => (
                          <option key={deptName} value={deptName}>{deptName}</option>
                        ))}
                      </select>
                    </div>
                    {n === `alumni` && (
                      <div>
                        <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                          Graduation Year (Batch)
                        </label>
                        <select
                          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#7A1737] focus:outline-none text-[#17263C] rounded-lg px-3.5 py-2.5 text-xs cursor-pointer"
                          value={i.batch}
                          onChange={(ev) => f(`batch`, ev.target.value)}
                          required
                        >
                          <option value="" className="text-[#94A3B8]">Select year…</option>
                          {Cs.map((yearStr) => (
                            <option key={yearStr} value={yearStr}>{yearStr}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
                {n === `alumni` && (
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#475569] leading-relaxed">
                    📋 Alumni accounts undergo verification by the Alumni Affairs Office. Your profile badge will be verified within 24–48 hours.
                  </div>
                )}
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={o}
                    onChange={(ev) => s(ev.target.checked)}
                    className="mt-0.5 flex-shrink-0 cursor-pointer accent-[#7A1737]"
                  />
                  <span className="text-xs text-[#64748B]">
                    {"I agree to the "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-[#7A1737] hover:underline font-medium cursor-pointer"
                    >
                      Terms of Use
                    </button>
                    {" and "}
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(true)}
                      className="text-[#7A1737] hover:underline font-medium cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => t(1)}
                    className="w-1/3 py-2.5 rounded-lg text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#17263C] transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={!o || c}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-semibold bg-[#7A1737] hover:bg-[#62122B] text-white transition-all cursor-pointer shadow-xs active:scale-95 ${
                      !o || c ? `opacity-50 cursor-not-allowed` : ``
                    }`}
                  >
                    {c ? (
                      <span className="flex items-center gap-2 justify-center">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account…
                      </span>
                    ) : (
                      `Create Account →`
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
