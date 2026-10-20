import React, { useState } from "react";
import { api, getCurrentUser } from "../../services/api";
import { createInitialsAvatar } from "../../data/mockData";

const Rs = [
  {
    name: "CSE Alumni Community",
    members: 4820,
    posts: 1240,
    icon: "💻",
    joined: true,
  },
  {
    name: "EEE Alumni Community",
    members: 3910,
    posts: 980,
    icon: "⚡",
    joined: false,
  },
  {
    name: "Batch 2008 Community",
    members: 310,
    posts: 240,
    icon: "🎓",
    joined: true,
  },
  {
    name: "Tech Industry Network",
    members: 2100,
    posts: 560,
    icon: "🚀",
    joined: true,
  },
  {
    name: "PUST Research Forum",
    members: 890,
    posts: 320,
    icon: "🔬",
    joined: false,
  },
  {
    name: "BBA Alumni Network",
    members: 2890,
    posts: 680,
    icon: "📊",
    joined: false,
  },
];

const initialPosts = [
  {
    id: 1,
    author: "Tahmid Chowdhury",
    avatar: createInitialsAvatar("Tahmid Chowdhury", "alumni"),
    batch: "Batch 2015",
    community: "Tech Industry Network",
    time: "2 hours ago",
    content: "Just accepted an offer from a Bay Area startup as Head of Product 🎉 After 5 years at Shopify, ready for a new challenge. If any PUST alumni are in the Bay Area tech scene, let's connect! Happy to share what the hiring market looks like right now.",
    likes: 47,
    comments: 2,
    liked: false,
    type: "post",
    commentList: [
      { id: 101, author: "Dr. Rafiqul Islam", text: "Heartiest congratulations Tahmid! Proud moment for PUST.", time: "1 hr ago" },
      { id: 102, author: "Nusrat Jahan", text: "Inspiring news! Would love to catch up next week.", time: "30 mins ago" },
    ],
  },
  {
    id: 2,
    author: "Dr. Nadia Hussain",
    avatar: createInitialsAvatar("Nadia Hussain", "faculty"),
    batch: "Faculty, Physics",
    community: "PUST Research Forum",
    time: "5 hours ago",
    content: "📢 Exciting news: our paper on low-temperature superconductors has been accepted at Nature Materials! This is a first for PUST Physics. If any alumni are working in materials science, I'd love to collaborate on the follow-up study.",
    likes: 132,
    comments: 1,
    liked: true,
    type: "announcement",
    commentList: [
      { id: 201, author: "Tanvir Ahmed", text: "Massive milestone for PUST research! Kudos to the team.", time: "4 hrs ago" },
    ],
  },
  {
    id: 3,
    author: "Ariful Islam",
    avatar: createInitialsAvatar("Ariful Islam", "student"),
    batch: "Batch 2022",
    community: "CSE Alumni Community",
    time: "Yesterday",
    content: "❓ Question for seniors: I'm building a REST API project using Django + PostgreSQL. What's the best approach for handling JWT token refresh without re-login? Would love guidance from anyone in backend engineering.",
    likes: 18,
    comments: 1,
    liked: false,
    type: "question",
    commentList: [
      { id: 301, author: "Dr. Rafiqul Islam", text: "Store refresh tokens in HttpOnly cookies with silent background rotation before expiration.", time: "18 hrs ago" },
    ],
  },
];

export default function DashboardCommunity() {
  const [posts, setPosts] = useState(initialPosts);
  const [newPostText, setNewPostText] = useState("");
  const [joinedCommunities, setJoinedCommunities] = useState(
    Rs.map((item, idx) => (item.joined ? idx : -1)).filter((idx) => idx >= 0)
  );
  const [activeTab, setActiveTab] = useState("Feed");
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [answeringQuestionId, setAnsweringQuestionId] = useState(null);
  const [answerInputText, setAnswerInputText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleToggleLike = (id) => {
    setPosts(
      posts.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const handleToggleComments = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const user = getCurrentUser();
    const newCommentObj = {
      id: Date.now(),
      author: user?.name || "Dr. Rafiqul Islam",
      text: text,
      time: "Just now",
    };

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const updatedComments = [...(p.commentList || []), newCommentObj];
          return {
            ...p,
            commentList: updatedComments,
            comments: updatedComments.length,
          };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    showToast("মন্তব্য সফলভাবে যোগ করা হয়েছে!");
  };

  const handleSharePost = (post) => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast("পোস্টের লিংক কপি করা হয়েছে!");
      });
    } else {
      showToast("পোস্ট শেয়ার করা হয়েছে!");
    }
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const user = getCurrentUser();
    const newPost = {
      id: Date.now(),
      author: user?.name || "Dr. Rafiqul Islam",
      avatar: user?.avatar || createInitialsAvatar(user?.name || "Dr. Rafiqul Islam", "alumni"),
      batch: `Batch ${user?.batch || "2008"}`,
      community: "CSE Alumni Community",
      time: "Just now",
      content: newPostText,
      likes: 0,
      comments: 0,
      liked: false,
      type: "post",
      commentList: [],
    };

    setPosts([newPost, ...posts]);
    api.createCommunityPost({
      title: newPostText.slice(0, 60),
      body: newPostText,
      channel: "CSE Alumni Community",
    });
    setNewPostText("");
    showToast("🎉 আপনার পোস্ট সফলভাবে পাবলিশ করা হয়েছে!");
  };

  const handleAnswerQuestion = (questionId) => {
    if (!answerInputText.trim()) return;
    const user = getCurrentUser();
    const answerObj = {
      id: Date.now(),
      author: user?.name || "Dr. Rafiqul Islam",
      text: answerInputText,
      time: "Just now",
    };

    setPosts(
      posts.map((p) => {
        if (p.id === questionId) {
          const list = [...(p.commentList || []), answerObj];
          return {
            ...p,
            commentList: list,
            comments: list.length,
          };
        }
        return p;
      })
    );

    setAnsweringQuestionId(null);
    setAnswerInputText("");
    showToast("আপনার উত্তর সফলভাবে যোগ করা হয়েছে!");
  };

  return (
    <div className="max-w-5xl space-y-5">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <h1 className="font-display font-bold text-2xl text-[#0F172A]">
        Community
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
        {["Feed", "Communities", "Questions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-underline cursor-pointer ${
              activeTab === tab ? "active font-semibold text-[#006B3F]" : "text-[#64748B]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Feed" && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {/* Create Post Card */}
            <div className="card rounded-xl p-4">
              <div className="flex gap-3">
                <img
                  src={getCurrentUser()?.avatar || createInitialsAvatar("Dr. Rafiqul Islam", "alumni")}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-1 ring-sky-200"
                />
                <div className="flex-1">
                  <textarea
                    className="input resize-none h-20 text-sm w-full"
                    placeholder="Share a thought, achievement, or question with the community…"
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-2 text-lg text-[#94A3B8]">
                      <button
                        type="button"
                        onClick={() => showToast("ছবি আপলোড উইন্ডো ওপেন হয়েছে")}
                        className="hover:text-[#64748B] cursor-pointer"
                        title="Add image"
                      >
                        📷
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast("লিংক যুক্ত করার ডায়ালগ")}
                        className="hover:text-[#64748B] cursor-pointer"
                        title="Add link"
                      >
                        🔗
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast("পোল তৈরি করুন")}
                        className="hover:text-[#64748B] cursor-pointer"
                        title="Create poll"
                      >
                        📊
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPostText.trim()}
                      className="btn btn-primary btn-sm cursor-pointer disabled:opacity-50"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Feed List */}
            {posts.map((post) => (
              <div key={post.id} className="card rounded-xl p-5 relative">
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#0F172A] text-sm">
                        {post.author}
                      </p>
                      <span
                        className={`badge text-[9px] ${
                          post.type === "question"
                            ? "badge-purple"
                            : post.type === "announcement"
                            ? "badge-gold"
                            : "badge-gray"
                        }`}
                      >
                        {post.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8]">
                      {post.batch} · {post.community} · {post.time}
                    </p>
                  </div>

                  {/* Options Menu Toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)}
                      className="text-[#94A3B8] hover:text-[#0F172A] p-1 text-sm cursor-pointer"
                    >
                      ⋯
                    </button>
                    {activeMenuId === post.id && (
                      <div className="absolute right-0 top-6 w-36 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-10 text-xs">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            showToast("পোস্টটি সেভ করা হয়েছে!");
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 cursor-pointer"
                        >
                          🔖 Save Post
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            handleSharePost(post);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 cursor-pointer"
                        >
                          🔗 Copy Link
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            showToast("রিপোর্ট এডমিনের কাছে পাঠানো হয়েছে");
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 cursor-pointer"
                        >
                          ⚠️ Report
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[#0F172A] text-sm leading-relaxed mb-4">
                  {post.content}
                </p>

                {/* Post Action Buttons */}
                <div className="flex items-center gap-4 pt-3 border-t border-[#F1F5F9]">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      post.liked ? "text-[#006B3F]" : "text-[#94A3B8] hover:text-[#64748B]"
                    }`}
                  >
                    <span>{post.liked ? "❤️" : "🤍"}</span>
                    <span>{post.likes}</span>
                  </button>
                  <button
                    onClick={() => handleToggleComments(post.id)}
                    className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#64748B] cursor-pointer"
                  >
                    <span>💬</span>
                    <span>{post.comments} {post.comments === 1 ? "comment" : "comments"}</span>
                  </button>
                  <button
                    onClick={() => handleSharePost(post)}
                    className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#64748B] cursor-pointer"
                  >
                    <span>↗️</span>
                    <span>Share</span>
                  </button>
                </div>

                {/* Inline Comment Thread */}
                {expandedComments[post.id] && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-[#F8FAFC] -mx-5 -mb-5 p-5 rounded-b-xl">
                    <div className="space-y-2">
                      {(post.commentList || []).map((c) => (
                        <div key={c.id} className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                          <div className="flex items-center justify-between font-semibold text-[#0F172A] mb-1">
                            <span>{c.author}</span>
                            <span className="text-[10px] text-[#94A3B8] font-normal">{c.time}</span>
                          </div>
                          <p className="text-[#64748B]">{c.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write a comment…"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post.id);
                        }}
                        className="input text-xs flex-1 py-1.5"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="btn btn-primary btn-sm text-xs cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <div className="card rounded-xl p-4">
              <h3 className="font-semibold text-[#0F172A] text-sm mb-3">
                Your Communities
              </h3>
              <div className="space-y-2">
                {Rs.filter((_, idx) => joinedCommunities.includes(idx)).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#0F172A] truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[#94A3B8]">
                        {item.members.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Communities" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Rs.map((item, idx) => {
            const isJoined = joinedCommunities.includes(idx);
            return (
              <div key={idx} className="card rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-[#0F172A] text-sm mb-1">
                    {item.name}
                  </h3>
                  <div className="flex gap-3 text-xs text-[#94A3B8] mb-4">
                    <span>👥 {item.members.toLocaleString()}</span>
                    <span>📝 {item.posts} posts</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const updated = isJoined
                      ? joinedCommunities.filter((i) => i !== idx)
                      : [...joinedCommunities, idx];
                    setJoinedCommunities(updated);
                    showToast(
                      isJoined
                        ? `${item.name} ত্যাগ করা হয়েছে`
                        : `🎉 ${item.name}-এ যুক্ত হয়েছেন!`
                    );
                  }}
                  className={`btn btn-sm w-full cursor-pointer ${
                    isJoined ? "btn-ghost text-[#006B3F]" : "btn-green"
                  }`}
                >
                  {isJoined ? "✓ Joined" : "Join Community"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "Questions" && (
        <div className="space-y-4">
          {posts
            .filter((p) => p.type === "question")
            .map((item) => (
              <div key={item.id} className="card rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[#0F172A] text-sm">
                      {item.author}
                    </p>
                    <p className="text-[10px] text-[#94A3B8]">
                      {item.batch} · {item.time}
                    </p>
                  </div>
                  <span className="ml-auto badge badge-purple text-[9px]">
                    Question
                  </span>
                </div>
                <p className="text-[#0F172A] text-sm leading-relaxed mb-3">
                  {item.content}
                </p>

                {/* Answers / Comments preview */}
                {(item.commentList || []).length > 0 && (
                  <div className="mb-3 space-y-2 bg-[#F8FAFC] p-3 rounded-lg border border-slate-100">
                    <p className="text-[11px] font-semibold text-[#64748B]">Answers ({item.commentList.length}):</p>
                    {item.commentList.map((ans) => (
                      <div key={ans.id} className="text-xs text-[#0F172A] pl-2 border-l-2 border-[#006B3F]">
                        <span className="font-medium text-[#1B4F8A]">{ans.author}:</span> {ans.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer Box */}
                {answeringQuestionId === item.id ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={3}
                      value={answerInputText}
                      onChange={(e) => setAnswerInputText(e.target.value)}
                      placeholder="Write your advice or answer based on your experience..."
                      className="input text-xs w-full"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setAnsweringQuestionId(null);
                          setAnswerInputText("");
                        }}
                        className="btn btn-ghost btn-sm text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAnswerQuestion(item.id)}
                        className="btn btn-primary btn-sm text-xs cursor-pointer"
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAnsweringQuestionId(item.id);
                      setAnswerInputText("");
                    }}
                    className="btn btn-outline btn-sm cursor-pointer"
                  >
                    Answer this Question
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

