import React, { useState } from "react";
import { xa } from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";

var Ms = [
  {
    from: `them`,
    text: `Hi Rafiqul! I wanted to ask if you could review my portfolio before I apply to Brain Station 23. I know you work there!`,
    time: `10:15 AM`,
  },
  {
    from: `me`,
    text: `Of course, Ariful! Happy to help. Go ahead and share the link.`,
    time: `10:18 AM`,
  },
  {
    from: `them`,
    text: `Thank you so much! Here it is: github.com/ariful-dev. The ML projects are at the bottom.`,
    time: `10:25 AM`,
  },
  {
    from: `me`,
    text: `Looks great! The ML projects are solid. I'd suggest adding more documentation to the README. Also, the UI on project 3 needs polish. Overall very strong work!`,
    time: `10:28 AM`,
  },
  {
    from: `them`,
    text: `Amazing feedback, thank you! I'll update the README today. Anything else before I apply?`,
    time: `10:30 AM`,
  },
  {
    from: `me`,
    text: `Great! Let's connect on Friday for the mentorship session.`,
    time: `10:32 AM`,
  },
];
export default function DashboardMessages() {
  useBackendSync();
  let [e, t] = useState(xa[0]),
    [n, r] = useState(``),
    [i, a] = useState(Ms),
    o = () => {
      if (n.trim()) {
        api.sendMessage(e.id, n.trim());
        a([
          ...i,
          {
            from: `me`,
            text: n,
            time: `Now`,
          },
        ]);
        r(``);
      }
    };
  return (
    <div className="h-[calc(100vh-10rem)] flex gap-4">
      <div className="w-72 lg:w-80 flex-shrink-0 card rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0]">
          <h2 className="font-semibold text-[#0F172A] mb-3">Messages</h2>
          <input
            className="input text-sm py-2"
            placeholder="Search conversations\u2026"
          />
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9]">
          {xa.map((n) => (
            <button
              key={n.id}
              onClick={() => t(n)}
              className={`w-full p-4 flex gap-3 text-left hover:bg-[#F8FAFC] transition-colors ${e.id === n.id ? `bg-[#EFF6FF]` : ``}`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={n.user.avatar}
                  alt={n.user.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
                {n.user.id === xa[0].user.id && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#0F172A] text-sm">
                    {n.user.name}
                  </p>
                  <p className="text-[10px] text-[#94A3B8]">{n.time}</p>
                </div>
                <p className="text-xs text-[#64748B] truncate mt-0.5">
                  {n.lastMsg}
                </p>
              </div>
              {n.unread > 0 && (
                <span className="w-5 h-5 bg-[#1B4F8A] text-white text-[10px] rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  {n.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 card rounded-xl flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2E8F0]">
          <img
            src={e.user.avatar}
            alt={e.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-[#0F172A] text-sm">
              {e.user.name}
            </p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Online
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="btn btn-ghost btn-sm">📞</button>
            <button className="btn btn-ghost btn-sm">⋯</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {i.map((t, n) => (
            <div
              key={n}
              className={`flex ${t.from === `me` ? `justify-end` : `justify-start`}`}
            >
              {t.from === `them` && (
                <img
                  src={e.user.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0 self-end"
                />
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${t.from === `me` ? `bg-[#1B4F8A] text-white rounded-br-sm` : `bg-[#F1F5F9] text-[#0F172A] rounded-bl-sm`}`}
              >
                {t.text}
                <p
                  className={`text-[10px] mt-1 ${t.from === `me` ? `text-blue-200` : `text-[#94A3B8]`}`}
                >
                  {t.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-[#E2E8F0]">
          <div className="flex gap-3">
            <input
              className="input flex-1 text-sm"
              placeholder="Type your message\u2026"
              value={n}
              onChange={(e) => r(e.target.value)}
              onKeyDown={(e) => e.key === `Enter` && o()}
            />
            <button onClick={o} className="btn btn-primary px-4">
              Send →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
