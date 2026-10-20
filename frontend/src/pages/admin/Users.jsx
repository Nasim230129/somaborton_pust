import React, { useState } from "react";
import { pa, ma, ha, createInitialsAvatar } from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";

const initialUsersList = [
  ...pa.map((u) => ({
    ...u,
    status: u.status || (u.verified ? "active" : "unverified"),
    joined: u.joined || "2024",
  })),
  ...ma.map((u) => ({
    ...u,
    status: u.status || "active",
    joined: u.joined || "2024",
  })),
  ...ha.map((u) => ({
    ...u,
    status: u.status || "active",
    joined: u.joined || "2023",
  })),
];

export default function AdminUsers() {
  useBackendSync();
  const [users, setUsers] = useState(initialUsersList);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    dept: "Computer Science & Engineering",
    batch: "2020",
    role: "alumni",
    location: "Dhaka, Bangladesh",
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleToggleSuspend = (userId) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "suspended" ? "active" : "suspended";
          api.updateUser(userId, { status: nextStatus });
          showToast(
            nextStatus === "suspended"
              ? `ইউজার ${u.name}-কে সাসপেন্ড করা হয়েছে`
              : `ইউজার ${u.name}-কে সক্রিয় করা হয়েছে`
          );
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const created = {
      id: Date.now(),
      name: newUserForm.name,
      email: newUserForm.email,
      dept: newUserForm.dept,
      batch: newUserForm.batch,
      role: newUserForm.role,
      location: newUserForm.location,
      status: "active",
      verified: true,
      avatar: createInitialsAvatar(newUserForm.name, newUserForm.role),
      headline: `${newUserForm.role.toUpperCase()} · ${newUserForm.dept}`,
    };

    setUsers([created, ...users]);
    api.createUser?.(created);
    setIsAddUserModalOpen(false);
    setNewUserForm({
      name: "",
      email: "",
      dept: "Computer Science & Engineering",
      batch: "2020",
      role: "alumni",
      location: "Dhaka, Bangladesh",
    });
    showToast(`🎉 নতুন ইউজার ${created.name} সফলভাবে তৈরি হয়েছে!`);
  };

  const handleBulkVerify = async () => {
    for (const uid of selectedIds) {
      await api.updateUser(uid, { verified: true, status: "active" });
    }
    setUsers(
      users.map((u) => (selectedIds.includes(u.id) ? { ...u, status: "active", verified: true } : u))
    );
    setSelectedIds([]);
    showToast("নির্বাচিত সকল ইউজার ভেরিফাই করা হয়েছে!");
  };

  const handleBulkSuspend = async () => {
    for (const uid of selectedIds) {
      await api.updateUser(uid, { status: "suspended" });
    }
    setUsers(
      users.map((u) => (selectedIds.includes(u.id) ? { ...u, status: "suspended" } : u))
    );
    setSelectedIds([]);
    showToast("নির্বাচিত ইউজারদের সাসপেন্ড করা হয়েছে!");
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.company && u.company.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleSelectUser = (id) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === filteredUsers.length ? [] : filteredUsers.map((u) => u.id)
    );
  };

  const roleBadges = {
    alumni: "badge-blue",
    student: "badge-green",
    faculty: "badge-purple",
    employer: "badge-gold",
    admin: "badge-red",
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                Add New University User
              </h2>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddUser} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Dr. Mahmudul Hasan"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Institutional / Personal Email *
                </label>
                <input
                  required
                  type="email"
                  placeholder="name@pust.ac.bd"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Role
                  </label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="input text-sm w-full"
                  >
                    <option value="alumni">Alumni</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="employer">Partner / Recruiter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Batch Year
                  </label>
                  <input
                    type="text"
                    value={newUserForm.batch}
                    onChange={(e) => setNewUserForm({ ...newUserForm, batch: e.target.value })}
                    className="input text-sm w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newUserForm.dept}
                  onChange={(e) => setNewUserForm({ ...newUserForm, dept: e.target.value })}
                  className="input text-sm w-full"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-green btn-sm">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A]">User Details</h2>
              <button
                onClick={() => setViewingUser(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={viewingUser.avatar}
                  alt={viewingUser.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h3 className="font-bold text-[#0F172A] text-base">{viewingUser.name}</h3>
                  <p className="text-xs text-[#64748B]">{viewingUser.headline || viewingUser.role}</p>
                  <span className={`badge ${roleBadges[viewingUser.role] || "badge-gray"} text-[9px] mt-1`}>
                    {viewingUser.role.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Department:</span>
                  <span className="font-medium text-[#0F172A]">{viewingUser.dept}</span>
                </div>
                {viewingUser.batch && (
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Batch:</span>
                    <span className="font-medium text-[#0F172A]">{viewingUser.batch}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Location:</span>
                  <span className="font-medium text-[#0F172A]">{viewingUser.location || "Bangladesh"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Status:</span>
                  <span className="font-medium capitalize text-[#0F172A]">{viewingUser.status}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    handleToggleSuspend(viewingUser.id);
                    setViewingUser(null);
                  }}
                  className={`btn btn-sm cursor-pointer ${
                    viewingUser.status === "suspended" ? "btn-green" : "btn-outline text-amber-600"
                  }`}
                >
                  {viewingUser.status === "suspended" ? "Reactivate User" : "Suspend User"}
                </button>
                <button
                  onClick={() => setViewingUser(null)}
                  className="btn btn-primary btn-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F172A]">
            User Management
          </h1>
          <p className="text-[#64748B] text-sm">
            {users.length} total registered profiles across all departments
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={handleBulkVerify}
                className="btn btn-outline btn-sm text-green-600 border-green-300 hover:bg-green-50 cursor-pointer"
              >
                Verify ({selectedIds.length})
              </button>
              <button
                onClick={handleBulkSuspend}
                className="btn btn-outline btn-sm text-red-500 border-red-200 hover:bg-red-50 cursor-pointer"
              >
                Suspend ({selectedIds.length})
              </button>
            </>
          )}
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="btn btn-green btn-sm cursor-pointer"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card rounded-xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 flex items-center">
          <span className="absolute left-3 text-slate-400 pointer-events-none text-xs">
            🔍
          </span>
          <input
            type="text"
            className="input w-full pl-8 pr-7 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#1B4F8A]"
            placeholder="Search by name, department, or company…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs p-0.5 cursor-pointer"
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>
        <select
          className="input w-36 text-sm"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="alumni">Alumni</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <select
          className="input w-36 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="unverified">Unverified</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="text-left p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded text-[#006B3F] focus:ring-[#006B3F] cursor-pointer"
                  />
                </th>
                <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase">
                  User
                </th>
                <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase">
                  Department
                </th>
                <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase">
                  Role
                </th>
                <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase">
                  Status
                </th>
                <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="rounded text-[#006B3F] focus:ring-[#006B3F] cursor-pointer"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium text-sm text-[#0F172A]">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-[#94A3B8]">
                          {user.location || "Bangladesh"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-[#64748B] max-w-[180px] truncate">
                      {user.dept}
                    </p>
                    {user.batch && (
                      <p className="text-[10px] text-[#94A3B8]">
                        Batch {user.batch}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`badge ${roleBadges[user.role] || "badge-gray"} capitalize`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`badge ${
                        user.status === "active"
                          ? "badge-green"
                          : user.status === "suspended"
                          ? "badge-red"
                          : "badge-gold"
                      }`}
                    >
                      {user.status === "active"
                        ? "✓ Active"
                        : user.status === "suspended"
                        ? "⛔ Suspended"
                        : "⏳ Unverified"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setViewingUser(user)}
                        className="btn btn-ghost btn-sm text-xs cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleToggleSuspend(user.id)}
                        className={`btn btn-ghost btn-sm text-xs cursor-pointer ${
                          user.status === "suspended" ? "text-green-600 font-semibold" : "text-amber-600"
                        }`}
                      >
                        {user.status === "suspended" ? "Reactivate" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-[#94A3B8]">
              No users match your search and filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
