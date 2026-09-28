import React, { useState } from "react";
import { ba } from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";

var Xs = {
  connection: `🔗`,
  mentorship: `🎯`,
  job: `💼`,
  event: `📅`,
  achievement: `🏆`,
  community: `👥`,
};
export default function DashboardNotifications() {
  useBackendSync();
  let [e, t] = useState(ba),
    [n, r] = useState(`All`),
    i = () => {
      api.markNotificationsRead();
      t(
        e.map((e) => ({
          ...e,
          read: true,
        })),
      );
    },
    a = (n) =>
      t(
        e.map((e) =>
          e.id === n
            ? {
                ...e,
                read: true,
              }
            : e,
        ),
      ),
    o = [
      `All`,
      `connection`,
      `mentorship`,
      `job`,
      `event`,
      `achievement`,
      `community`,
    ],
    s = n === `All` ? e : e.filter((e) => e.type === n),
    c = e.filter((e) => !e.read).length;
  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-2xl text-[#0F172A]">
            Notifications
          </h1>
          {c > 0 && (
            <span className="badge badge-red">
              {c}
              {" unread"}
            </span>
          )}
        </div>
        <button onClick={i} className="btn btn-ghost btn-sm text-[#64748B]">
          Mark all read
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {o.map((e) => (
          <button
            key={e}
            onClick={() => r(e)}
            className={`btn btn-sm capitalize ${n === e ? `btn-primary` : `btn-ghost`}`}
          >
            {Xs[e] || `🔔`} {e}
          </button>
        ))}
      </div>
      <div className="card rounded-xl overflow-hidden divide-y divide-[#F1F5F9]">
        {s.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="font-semibold text-[#0F172A]">No Notifications</h3>
            <p className="text-[#64748B] text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          s.map((e) => (
            <div
              key={e.id}
              className={`flex items-start gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer ${e.read ? `` : `bg-blue-50/50`}`}
              onClick={() => a(e.id)}
            >
              <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center overflow-hidden flex-shrink-0">
                {e.avatar ? (
                  <img
                    src={e.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg">{Xs[e.type]}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0F172A] leading-snug">{e.msg}</p>
                <p className="text-[10px] text-[#94A3B8] mt-1">{e.time}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!e.read && (
                  <span className="w-2 h-2 bg-[#1B4F8A] rounded-full" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="card rounded-xl p-5">
        <h2 className="font-semibold text-[#0F172A] mb-4">
          Notification Preferences
        </h2>
        <div className="space-y-3">
          {[
            {
              label: `Connection requests`,
              email: true,
              push: true,
            },
            {
              label: `Mentorship requests`,
              email: true,
              push: true,
            },
            {
              label: `Job recommendations`,
              email: false,
              push: true,
            },
            {
              label: `Event reminders`,
              email: true,
              push: false,
            },
            {
              label: `Community activity`,
              email: false,
              push: true,
            },
          ].map((e, t) => (
            <div
              key={t}
              className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0"
            >
              <span className="text-sm text-[#64748B]">{e.label}</span>
              <div className="flex gap-6">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={e.email}
                    className="w-3.5 h-3.5 accent-[#006B3F]"
                  />
                  <span className="text-xs text-[#94A3B8]">Email</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={e.push}
                    className="w-3.5 h-3.5 accent-[#006B3F]"
                  />
                  <span className="text-xs text-[#94A3B8]">Push</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
