import React, { useState } from "react";
import { api, getCurrentUser } from "../../services/api";

var Rs = [
    {
      name: `CSE Alumni Community`,
      members: 4820,
      posts: 1240,
      icon: `💻`,
      joined: true,
    },
    {
      name: `EEE Alumni Community`,
      members: 3910,
      posts: 980,
      icon: `⚡`,
      joined: false,
    },
    {
      name: `Batch 2008 Community`,
      members: 310,
      posts: 240,
      icon: `🎓`,
      joined: true,
    },
    {
      name: `Tech Industry Network`,
      members: 2100,
      posts: 560,
      icon: `🚀`,
      joined: true,
    },
    {
      name: `PUST Research Forum`,
      members: 890,
      posts: 320,
      icon: `🔬`,
      joined: false,
    },
    {
      name: `BBA Alumni Network`,
      members: 2890,
      posts: 680,
      icon: `📊`,
      joined: false,
    },
  ],
  zs = [
    {
      id: 1,
      author: `Tahmid Chowdhury`,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&auto=format`,
      batch: `Batch 2015`,
      community: `Tech Industry Network`,
      time: `2 hours ago`,
      content: `Just accepted an offer from a Bay Area startup as Head of Product 🎉 After 5 years at Shopify, ready for a new challenge. If any PUST alumni are in the Bay Area tech scene, let's connect! Happy to share what the hiring market looks like right now.`,
      likes: 47,
      comments: 12,
      liked: false,
      type: `post`,
    },
    {
      id: 2,
      author: `Dr. Nadia Hussain`,
      avatar: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&auto=format`,
      batch: `Faculty, Physics`,
      community: `PUST Research Forum`,
      time: `5 hours ago`,
      content: `📢 Exciting news: our paper on low-temperature superconductors has been accepted at Nature Materials! This is a first for PUST Physics. If any alumni are working in materials science, I'd love to collaborate on the follow-up study.`,
      likes: 132,
      comments: 28,
      liked: true,
      type: `announcement`,
    },
    {
      id: 3,
      author: `Ariful Islam`,
      avatar: `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&auto=format`,
      batch: `Batch 2022`,
      community: `CSE Alumni Community`,
      time: `Yesterday`,
      content: `❓ Question for seniors: I'm building a REST API project using Django + PostgreSQL. What's the best approach for handling JWT token refresh without re-login? Would love guidance from anyone in backend engineering.`,
      likes: 18,
      comments: 9,
      liked: false,
      type: `question`,
    },
  ];
export default function DashboardCommunity() {
  let [e, t] = useState(zs),
    [n, r] = useState(``),
    [i, a] = useState(
      Rs.map((e, t) => (e.joined ? t : -1)).filter((e) => e >= 0),
    ),
    [o, s] = useState(`Feed`),
    c = (n) => {
      t(
        e.map((e) =>
          e.id === n
            ? {
                ...e,
                liked: !e.liked,
                likes: e.liked ? e.likes - 1 : e.likes + 1,
              }
            : e,
        ),
      );
    };
  return (
    <div className="max-w-5xl space-y-5">
      <h1 className="font-display font-bold text-2xl text-[#0F172A]">
        Community
      </h1>
      <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
        {[`Feed`, `Communities`, `Questions`].map((e) => (
          <button
            key={e}
            onClick={() => s(e)}
            className={`tab-underline ${o === e ? `active` : ``}`}
          >
            {e}
          </button>
        ))}
      </div>
      {o === `Feed` && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="card rounded-xl p-4">
              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=60&h=60&fit=crop&auto=format"
                  alt=""
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <textarea
                    className="input resize-none h-20 text-sm"
                    placeholder="Share a thought, achievement, or question with the community\u2026"
                    value={n}
                    onChange={(e) => r(e.target.value)}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-2">
                      {[`📷`, `🔗`, `📊`].map((e) => (
                        <button
                          key={e}
                          className="text-lg text-[#94A3B8] hover:text-[#64748B]"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        if (!n.trim()) return;
                        const user = getCurrentUser();
                        t([
                          {
                            id: Date.now(),
                            author: user?.name || `Dr. Rafiqul Islam`,
                            avatar:
                              user?.avatar ||
                              `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=60&h=60&fit=crop&auto=format`,
                            batch: `Batch ${user?.batch || `2008`}`,
                            community: `CSE Alumni Community`,
                            time: `Just now`,
                            content: n,
                            likes: 0,
                            comments: 0,
                            liked: false,
                            type: `post`,
                          },
                          ...e,
                        ]);
                        api.createCommunityPost({
                          title: n.slice(0, 60),
                          body: n,
                          channel: `CSE Alumni Community`,
                        });
                        r(``);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {e.map((e) => (
              <div key={e.id} className="card rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={e.avatar}
                    alt={e.author}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#0F172A] text-sm">
                        {e.author}
                      </p>
                      <span
                        className={`badge text-[9px] ${e.type === `question` ? `badge-purple` : e.type === `announcement` ? `badge-gold` : `badge-gray`}`}
                      >
                        {e.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8]">
                      {e.batch}
                      {" \xB7 "}
                      {e.community}
                      {" \xB7 "}
                      {e.time}
                    </p>
                  </div>
                </div>
                <p className="text-[#0F172A] text-sm leading-relaxed mb-4">
                  {e.content}
                </p>
                <div className="flex items-center gap-4 pt-3 border-t border-[#F1F5F9]">
                  <button
                    onClick={() => c(e.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${e.liked ? `text-[#006B3F]` : `text-[#94A3B8] hover:text-[#64748B]`}`}
                  >
                    {e.liked ? `❤️` : `🤍`} {e.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#64748B]">
                    {"\uD83D\uDCAC "}
                    {e.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#64748B]">
                    ↗️ Share
                  </button>
                  <button className="ml-auto text-xs text-[#94A3B8] hover:text-[#64748B]">
                    ⋯
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="card rounded-xl p-4">
              <h3 className="font-semibold text-[#0F172A] text-sm mb-3">
                Your Communities
              </h3>
              <div className="space-y-2">
                {Rs.filter((e, t) => i.includes(t)).map((e, t) => (
                  <div key={t} className="flex items-center gap-2.5">
                    <span className="text-xl">{e.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#0F172A] truncate">
                        {e.name}
                      </p>
                      <p className="text-[10px] text-[#94A3B8]">
                        {e.members.toLocaleString()}
                        {" members"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {o === `Communities` && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Rs.map((e, t) => (
            <div key={t} className="card rounded-xl p-5">
              <div className="text-3xl mb-3">{e.icon}</div>
              <h3 className="font-semibold text-[#0F172A] text-sm mb-1">
                {e.name}
              </h3>
              <div className="flex gap-3 text-xs text-[#94A3B8] mb-4">
                <span>
                  {"\uD83D\uDC65 "}
                  {e.members.toLocaleString()}
                </span>
                <span>
                  {"\uD83D\uDCDD "}
                  {e.posts}
                  {" posts"}
                </span>
              </div>
              <button
                onClick={() =>
                  a(i.includes(t) ? i.filter((e) => e !== t) : [...i, t])
                }
                className={`btn btn-sm w-full ${i.includes(t) ? `btn-ghost text-[#006B3F]` : `btn-green`}`}
              >
                {i.includes(t) ? `✓ Joined` : `Join Community`}
              </button>
            </div>
          ))}
        </div>
      )}
      {o === `Questions` && (
        <div className="space-y-4">
          {e
            .filter((e) => e.type === `question`)
            .map((e) => (
              <div key={e.id} className="card rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={e.avatar}
                    alt={e.author}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[#0F172A] text-sm">
                      {e.author}
                    </p>
                    <p className="text-[10px] text-[#94A3B8]">
                      {e.batch}
                      {" \xB7 "}
                      {e.time}
                    </p>
                  </div>
                  <span className="ml-auto badge badge-purple text-[9px]">
                    Question
                  </span>
                </div>
                <p className="text-[#0F172A] text-sm leading-relaxed mb-3">
                  {e.content}
                </p>
                <button className="btn btn-outline btn-sm">
                  Answer this Question
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
