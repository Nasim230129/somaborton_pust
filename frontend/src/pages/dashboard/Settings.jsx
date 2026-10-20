import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../services/api";

const qs = ["Account", "Privacy", "Notifications", "Security", "Danger Zone"];

export default function DashboardSettings() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [activeTab, setActiveTab] = useState("Account");
  const [toastMsg, setToastMsg] = useState("");
  const [isSavedBadge, setIsSavedBadge] = useState(false);

  // Account State
  const [accountForm, setAccountForm] = useState({
    name: currentUser?.name || "Dr. Rafiqul Islam",
    email: currentUser?.email || "rafiq@pust.ac.bd",
    username: currentUser?.email ? currentUser.email.split("@")[0] : "rafiqul-islam-2008",
    phone: currentUser?.phone || "+880 1712 345678",
    language: "English",
  });

  // Security / 2FA State
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  // Danger Zone Modals
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setIsSavedBadge(true);
    setTimeout(() => {
      setToastMsg("");
      setIsSavedBadge(false);
    }, 3000);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (currentUser) {
      const updated = {
        ...currentUser,
        name: accountForm.name,
        email: accountForm.email,
        phone: accountForm.phone,
      };
      localStorage.setItem("pust_alumni_user", JSON.stringify(updated));
      window.dispatchEvent(new Event("pust-data-synced"));
    }
    showToast("✓ অ্যাকাউন্ট সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!");
  };

  const handleToggle2fa = () => {
    setIs2faEnabled(!is2faEnabled);
    showToast(
      !is2faEnabled
        ? "✓ টু-ফ্যাক্টর অথেনটিকেশন (2FA) চালু করা হয়েছে!"
        : "টু-ফ্যাক্টর অথেনটিকেশন বন্ধ করা হয়েছে।"
    );
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.newPass || passwordForm.newPass !== passwordForm.confirmPass) {
      showToast("নতুন পাসওয়ার্ড দুটি মিলছে না! পুনরায় চেষ্টা করুন।");
      return;
    }
    setPasswordForm({ current: "", newPass: "", confirmPass: "" });
    showToast("✓ পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!");
  };

  const handleDeactivate = () => {
    setIsDeactivateModalOpen(false);
    showToast("অ্যাকাউন্ট সফলভাবে ডিঅ্যাক্টিভেট করা হয়েছে। পুনরায় লগইন করে চালু করতে পারবেন।");
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 1500);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") return;
    setIsDeleteModalOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-4xl space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Deactivate Modal */}
      {isDeactivateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-[#0F172A] mb-2">
              Deactivate Account?
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mb-5 leading-relaxed">
              Your profile, directory listing, and mentorship availability will be temporarily hidden from other members. You can reactivate anytime simply by logging back in.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeactivateModalOpen(false)}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                className="btn btn-sm bg-amber-600 hover:bg-amber-700 text-white"
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200">
            <h2 className="text-lg font-bold text-red-600 mb-2">
              Permanent Account Deletion
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mb-4 leading-relaxed">
              This action is permanent and cannot be undone. All your posts, event registrations, and network connections will be permanently wiped.
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type <strong>DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="input text-sm w-full border-red-300 focus:border-red-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== "DELETE"}
                onClick={handleDeleteAccount}
                className="btn btn-danger btn-sm disabled:opacity-40"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F172A]">
            Settings
          </h1>
          <p className="text-xs text-[#64748B]">Manage your profile preferences, privacy, and account security.</p>
        </div>
        {isSavedBadge && <span className="badge badge-green">✓ Changes saved</span>}
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        <div className="w-full sm:w-44 flex-shrink-0">
          <div className="card rounded-xl overflow-hidden">
            {qs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#EFF6FF] text-[#1B4F8A] border-r-2 border-[#1B4F8A]"
                    : "text-[#64748B] hover:bg-[#F8FAFC]"
                } ${tab === "Danger Zone" ? "text-red-500 hover:bg-red-50" : ""}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 card rounded-xl p-6">
          {activeTab === "Account" && (
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <h2 className="font-semibold text-[#0F172A]">Account Settings</h2>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input text-sm w-full"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  className="input text-sm w-full"
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    className="input text-sm w-full"
                    value={accountForm.username}
                    onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="input text-sm w-full"
                    value={accountForm.phone}
                    onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Interface Language
                </label>
                <select
                  className="input text-sm w-full"
                  value={accountForm.language}
                  onChange={(e) => setAccountForm({ ...accountForm, language: e.target.value })}
                >
                  <option value="English">English</option>
                  <option value="বাংলা">বাংলা</option>
                </select>
              </div>
              <button type="submit" className="btn btn-green cursor-pointer">
                Save Account Settings
              </button>
            </form>
          )}

          {activeTab === "Privacy" && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#0F172A]">Privacy Controls</h2>
              <p className="text-[#64748B] text-sm">
                Control who can see your profile and how you appear in search results.
              </p>
              {[
                {
                  label: "Profile Visibility",
                  opts: ["Public", "PUST Alumni Only", "Connections Only"],
                  default: "Public",
                },
                {
                  label: "Show Email Address",
                  opts: ["No one", "Connections", "All alumni"],
                  default: "Connections",
                },
                {
                  label: "Search Visibility",
                  opts: ["Visible", "Hidden"],
                  default: "Visible",
                },
              ].map((item) => (
                <div key={item.label}>
                  <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    {item.label}
                  </label>
                  <select className="input text-sm w-full" defaultValue={item.default}>
                    {item.opts.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="space-y-3 pt-2">
                {[
                  { label: "Allow others to see my connections list", defaultOn: true },
                  { label: "Allow contact via platform messaging", defaultOn: true },
                  { label: "Show my activity status (online/offline)", defaultOn: false },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-[#64748B]">{item.label}</span>
                    <input type="checkbox" defaultChecked={item.defaultOn} className="toggle rounded text-[#006B3F] focus:ring-[#006B3F]" />
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => showToast("✓ প্রাইভেসী সেটিংস সফলভাবে আপডেট হয়েছে!")}
                className="btn btn-green cursor-pointer"
              >
                Save Privacy Settings
              </button>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#0F172A]">Notification Preferences</h2>
              <p className="text-[#64748B] text-sm">
                Choose how and when PUST Alumni Association communicates with you.
              </p>
              <div className="space-y-3">
                {[
                  { title: "Convocation & Homecoming Alerts", desc: "Official updates on reunion and convocation tickets", on: true },
                  { title: "Job Board Digest", desc: "Weekly summary of new openings in your department", on: true },
                  { title: "Mentorship Requests", desc: "Instant email when a mentee requests guidance", on: true },
                  { title: "Community Replies", desc: "Notifications when someone comments on your post", on: false },
                ].map((pref, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">{pref.title}</p>
                      <p className="text-[11px] text-[#64748B]">{pref.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked={pref.on} className="rounded text-[#006B3F] focus:ring-[#006B3F]" />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => showToast("✓ নোটিফিকেশন প্রেফারেন্স আপডেট হয়েছে!")}
                className="btn btn-green cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === "Security" && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <h2 className="font-semibold text-[#0F172A]">Password & Security</h2>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  className="input text-sm w-full"
                  placeholder="••••••••"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  className="input text-sm w-full"
                  placeholder="Minimum 8 characters"
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="input text-sm w-full"
                  placeholder="Repeat new password"
                  value={passwordForm.confirmPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                />
              </div>

              {/* 2FA Section */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-[#1B4F8A]">
                    Two-Factor Authentication (2FA)
                  </p>
                  {is2faEnabled && (
                    <span className="badge badge-green text-[10px]">Active</span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] mb-3">
                  Add an extra layer of security using your verified mobile number or authenticator app.
                </p>
                <button
                  type="button"
                  onClick={handleToggle2fa}
                  className={`btn btn-sm cursor-pointer ${
                    is2faEnabled ? "btn-outline text-red-600 border-red-200" : "btn-primary"
                  }`}
                >
                  {is2faEnabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
              </div>

              <button type="submit" className="btn btn-primary cursor-pointer">
                Update Password
              </button>
            </form>
          )}

          {activeTab === "Danger Zone" && (
            <div className="space-y-5">
              <h2 className="font-semibold text-red-600">Danger Zone</h2>
              <div className="border border-amber-200 bg-amber-50 rounded-xl p-5">
                <h3 className="font-semibold text-[#0F172A] mb-1">
                  Deactivate Account
                </h3>
                <p className="text-[#64748B] text-xs mb-3">
                  Temporarily hide your profile and suspend all activity. You can reactivate at any time.
                </p>
                <button
                  type="button"
                  onClick={() => setIsDeactivateModalOpen(true)}
                  className="btn btn-sm border border-amber-400 text-amber-700 hover:bg-amber-100 cursor-pointer"
                >
                  Deactivate Account
                </button>
              </div>
              <div className="border border-red-200 bg-red-50 rounded-xl p-5">
                <h3 className="font-semibold text-red-600 mb-1">
                  Delete Account
                </h3>
                <p className="text-[#64748B] text-xs mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="btn btn-danger btn-sm cursor-pointer"
                >
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

