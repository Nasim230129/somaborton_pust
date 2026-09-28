import React, { useState } from "react";
import { pa, ma, ha } from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";

export default function AdminUsers() {
  useBackendSync();
  let rc = [
      ...pa.map((e) => ({
        ...e,
        status: e.status || (e.verified ? `active` : `unverified`),
        joined: e.joined || `2024`,
      })),
      ...ma.map((e) => ({
        ...e,
        status: e.status || `active`,
        joined: e.joined || `2024`,
      })),
      ...ha.map((e) => ({
        ...e,
        status: e.status || `active`,
        joined: e.joined || `2023`,
      })),
    ],
    [e, t] = useState(``),
    [n, r] = useState(`all`),
    [i, a] = useState(`all`),
    [o, s] = useState([]),
    c = rc.filter((t) => {
      let r =
          t.name.toLowerCase().includes(e.toLowerCase()) ||
          t.dept.toLowerCase().includes(e.toLowerCase()),
        a = n === `all` || t.role === n,
        o = i === `all` || t.status === i;
      return r && a && o;
    }),
    l = (e) => s(o.includes(e) ? o.filter((t) => t !== e) : [...o, e]),
    u = () => s(o.length === c.length ? [] : c.map((e) => e.id)),
    d = {
      alumni: `badge-blue`,
      student: `badge-green`,
      faculty: `badge-purple`,
      employer: `badge-gold`,
      admin: `badge-red`,
    };
  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F172A]">
            User Management
          </h1>
          <p className="text-[#64748B] text-sm">
            {rc.length}
            {" total users"}
          </p>
        </div>
        <div className="flex gap-2">
          {o.length > 0 && (
            <>
              <button
                onClick={async () => {
                  for (const uid of o) {
                    await api.updateUser(uid, { verified: true, status: "active" });
                  }
                  s([]);
                }}
                className="btn btn-outline btn-sm text-green-600 border-green-300 hover:bg-green-50"
              >
                Verify ({o.length})
              </button>
              <button
                onClick={async () => {
                  for (const uid of o) {
                    await api.updateUser(uid, { status: "suspended" });
                  }
                  s([]);
                }}
                className="btn btn-outline btn-sm text-red-500 border-red-200 hover:bg-red-50"
              >
                Suspend ({o.length})
              </button>
            </>
          )}
          <button className="btn btn-green btn-sm">+ Add User</button>
        </div>
      </div>
      <div className="card rounded-xl p-4 flex flex-wrap gap-3">
        <input
          type="text"
          className="input flex-1 min-w-48"
          placeholder="Search by name or department\u2026"
          value={e}
          onChange={(e) => t(e.target.value)}
        />
        <select
          className="input w-36"
          value={n}
          onChange={(e) => r(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="alumni">Alumni</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <select
          className="input w-36"
          value={i}
          onChange={(e) => a(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="unverified">Unverified</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div className="card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="text-left p-4 w-10">
                  <input
                    type="checkbox"
                    checked={o.length === c.length && c.length > 0}
                    onChange={u}
                    className="w-4 h-4 accent-[#1B4F8A]"
                  />
                </th>
                <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  User
                </th>
                <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {c.map((e) => (
                <tr
                  key={e.id}
                  className={`hover:bg-[#F8FAFC] transition-colors ${o.includes(e.id) ? `bg-blue-50/50` : ``}`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={o.includes(e.id)}
                      onChange={() => l(e.id)}
                      className="w-4 h-4 accent-[#1B4F8A]"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={e.avatar}
                        alt={e.name}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium text-sm text-[#0F172A]">
                          {e.name}
                        </p>
                        <p className="text-[10px] text-[#94A3B8]">
                          {e.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-[#64748B] max-w-[180px] truncate">
                      {e.dept}
                    </p>
                    {e.batch && (
                      <p className="text-[10px] text-[#94A3B8]">
                        {"Batch "}
                        {e.batch}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`badge ${d[e.role] || `badge-gray`} capitalize`}
                    >
                      {e.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`badge ${e.status === `active` ? `badge-green` : e.status === `suspended` ? `badge-red` : `badge-gold`}`}
                    >
                      {e.status === `active`
                        ? `✓ Active`
                        : e.status === `suspended`
                          ? `⛔ Suspended`
                          : `⏳ Unverified`}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-sm text-xs">
                        View
                      </button>
                      <button className="btn btn-ghost btn-sm text-xs text-amber-600">
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {c.length === 0 && (
            <div className="py-12 text-center text-[#94A3B8]">
              No users match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
