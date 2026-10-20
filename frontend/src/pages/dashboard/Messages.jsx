import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api, getCurrentUser, useBackendSync } from "../../services/api";
import {
  initSocket,
  getSocket,
  joinConversation,
  leaveConversation,
  emitTyping,
} from "../../services/socket";
import { createInitialsAvatar, xa, pa } from "../../data/mockData";

// Timestamp formatting utilities
function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return String(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatRelativeDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return String(timestamp);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffTime = today - target;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatDaySeparator(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today - target) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export default function DashboardMessages() {
  useBackendSync();
  const [searchParams, setSearchParams] = useSearchParams();
  const startWithParam = searchParams.get("startWith");

  const currentUser = useMemo(() => getCurrentUser(), []);

  // Conversations and active thread state
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");

  // Loading and pagination states
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Real-time states
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [mobileView, setMobileView] = useState("list"); // 'list' | 'chat'
  const [socketConnected, setSocketConnected] = useState(false);

  // New message modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [eligibleAlumni, setEligibleAlumni] = useState([]);
  const [loadingAlumni, setLoadingAlumni] = useState(false);
  const [alumniSearch, setAlumniSearch] = useState("");

  // Refs for tracking active rooms and scrolling
  const messagesEndRef = useRef(null);
  const activeConvRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  activeConvRef.current = activeConversation;
  const activePartner = activeConversation
    ? activeConversation.user || activeConversation.participant || {}
    : {};

  // Auto-scroll to bottom of message thread
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    }
  };

  // 1. Fetch conversations from backend
  const loadConversations = async (autoSelectId = null) => {
    try {
      setLoadingConversations(true);
      const res = await api.getConversations();
      if (res && res.ok && Array.isArray(res.data)) {
        setConversations(res.data);
        if (autoSelectId) {
          const match = res.data.find(
            (c) =>
              c.id === autoSelectId ||
              c.user?.id === autoSelectId ||
              c.participants?.includes(autoSelectId)
          );
          if (match) {
            setActiveConversation(match);
            setMobileView("chat");
          }
        } else if (!activeConversation && res.data.length > 0 && window.innerWidth >= 768) {
          setActiveConversation(res.data[0]);
        }
      } else {
        // Fallback to seeded data if offline
        const fallback = xa.map((item) => ({
          id: item.id,
          participants: [currentUser?.id || 1, item.user.id],
          lastMessage: item.lastMsg,
          lastMessageAt: new Date().toISOString(),
          unreadCount: item.unread || 0,
          user: item.user,
        }));
        setConversations(fallback);
        if (!activeConversation && fallback.length > 0 && window.innerWidth >= 768) {
          setActiveConversation(fallback[0]);
        }
      }
    } catch (err) {
      console.debug("Failed to load conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadConversations();
  }, []);

  // 2. Handle ?startWith=:userId query parameter to initiate or focus a chat
  useEffect(() => {
    if (!startWithParam) return;
    const recipientId = Number(startWithParam);
    if (!recipientId || recipientId === currentUser?.id) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("startWith");
      setSearchParams(nextParams, { replace: true });
      return;
    }

    const initiateWithUser = async () => {
      try {
        const res = await api.startConversation(recipientId);
        if (res && res.ok && res.data) {
          const newOrExisting = res.data;
          setConversations((prev) => {
            const exists = prev.find((c) => c.id === newOrExisting.id);
            if (exists) {
              return prev.map((c) => (c.id === newOrExisting.id ? newOrExisting : c));
            }
            return [newOrExisting, ...prev];
          });
          setActiveConversation(newOrExisting);
          setMobileView("chat");
        }
      } catch (err) {
        console.debug("Failed to start conversation with user:", err);
      } finally {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("startWith");
        setSearchParams(nextParams, { replace: true });
      }
    };

    initiateWithUser();
  }, [startWithParam]);

  // 3. Socket.IO connection and real-time event listeners
  useEffect(() => {
    const socket = initSocket();
    if (!socket) return;

    setSocketConnected(socket.connected);

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    // Incoming new message
    const onNewMessage = (payload) => {
      const msg = payload.message || payload;
      const cId = Number(payload.conversationId || msg.conversationId);

      // If message is for the currently open conversation
      if (activeConvRef.current && Number(activeConvRef.current.id) === cId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });

        // If from partner, mark as read immediately
        if (Number(msg.senderId) !== Number(currentUser?.id)) {
          api.markConversationRead(cId);
        }

        setTimeout(() => scrollToBottom(true), 50);
      }

      // Update conversation in the left sidebar
      setConversations((prev) => {
        const idx = prev.findIndex((c) => Number(c.id) === cId);
        if (idx > -1) {
          const current = prev[idx];
          const isCurrentActive =
            activeConvRef.current && Number(activeConvRef.current.id) === cId;
          const updated = {
            ...current,
            lastMessage: msg.text,
            lastMessageAt: msg.createdAt || new Date().toISOString(),
            lastSenderId: msg.senderId,
            unreadCount: isCurrentActive
              ? 0
              : (current.unreadCount || 0) + (Number(msg.senderId) !== Number(currentUser?.id) ? 1 : 0),
          };
          const next = [...prev];
          next.splice(idx, 1);
          return [updated, ...next];
        } else {
          // If conversation wasn't in list yet, reload conversations
          loadConversations();
          return prev;
        }
      });
    };

    // Conversation preview updated from another user
    const onConversationUpdated = (payload) => {
      const cId = Number(payload.conversationId);
      setConversations((prev) => {
        const idx = prev.findIndex((c) => Number(c.id) === cId);
        if (idx > -1) {
          const updated = {
            ...prev[idx],
            lastMessage: payload.lastMessage,
            lastMessageAt: new Date().toISOString(),
          };
          const next = [...prev];
          next.splice(idx, 1);
          return [updated, ...next];
        }
        return prev;
      });
    };

    // Read receipts
    const onMessagesRead = (payload) => {
      const cId = Number(payload.conversationId);
      if (activeConvRef.current && Number(activeConvRef.current.id) === cId) {
        setMessages((prev) =>
          prev.map((m) =>
            Number(m.senderId) === Number(currentUser?.id)
              ? { ...m, read: true, readAt: payload.readAt }
              : m
          )
        );
      }
    };

    // Typing indicator
    const onUserTyping = (payload) => {
      const cId = Number(payload.conversationId);
      if (
        activeConvRef.current &&
        Number(activeConvRef.current.id) === cId &&
        Number(payload.userId) !== Number(currentUser?.id)
      ) {
        setPartnerTyping(Boolean(payload.isTyping));
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        if (payload.isTyping) {
          typingTimerRef.current = setTimeout(() => {
            setPartnerTyping(false);
          }, 3500);
        }
      }
    };

    // User online presence
    const onUserStatus = (payload) => {
      const userId = Number(payload.userId);
      setConversations((prev) =>
        prev.map((c) => {
          if (c.user && Number(c.user.id) === userId) {
            return {
              ...c,
              user: { ...c.user, online: payload.status === "online" },
            };
          }
          return c;
        })
      );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new_message", onNewMessage);
    socket.on("conversation_updated", onConversationUpdated);
    socket.on("messages_read", onMessagesRead);
    socket.on("user_typing", onUserTyping);
    socket.on("user_status", onUserStatus);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new_message", onNewMessage);
      socket.off("conversation_updated", onConversationUpdated);
      socket.off("messages_read", onMessagesRead);
      socket.off("user_typing", onUserTyping);
      socket.off("user_status", onUserStatus);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [currentUser]);

  // 4. Handle switching active conversation
  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }

    const cId = activeConversation.id;

    // Join authorized socket room
    joinConversation(cId);

    // Reset typing & pagination
    setPartnerTyping(false);
    setPage(1);
    setLoadingMessages(true);
    setErrorMessage("");

    // Mark as read in state & backend
    setConversations((prev) =>
      prev.map((c) => (c.id === cId ? { ...c, unreadCount: 0 } : c))
    );
    api.markConversationRead(cId);

    // Fetch messages for conversation
    api
      .getConversationMessages(cId, { page: 1, limit: 30 })
      .then((res) => {
        if (res && res.ok && Array.isArray(res.data)) {
          setMessages(res.data);
          setHasMoreMessages(res.pagination?.page < res.pagination?.totalPages);
        } else {
          // Fallback mock history if first conversation
          setMessages([
            {
              id: 101,
              conversationId: cId,
              senderId: activePartner.id || 99,
              senderName: activePartner.name || "Alumni",
              senderAvatar:
                activePartner.avatar ||
                createInitialsAvatar(activePartner.name || "PUST"),
              text: `Hello ${currentUser?.name || "there"}! Great to connect with you through the PUST Alumni Network.`,
              read: true,
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
          ]);
          setHasMoreMessages(false);
        }
      })
      .catch((err) => {
        console.debug("Failed to load conversation messages:", err);
      })
      .finally(() => {
        setLoadingMessages(false);
        setTimeout(() => scrollToBottom(false), 50);
      });

    return () => {
      leaveConversation(cId);
      emitTyping(cId, false);
    };
  }, [activeConversation?.id]);

  // Load older messages (Pagination)
  const handleLoadMore = async () => {
    if (!activeConversation || loadingMore || !hasMoreMessages) return;
    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const res = await api.getConversationMessages(activeConversation.id, {
        page: nextPage,
        limit: 30,
      });
      if (res && res.ok && Array.isArray(res.data)) {
        setMessages((prev) => [...res.data, ...prev]);
        setPage(nextPage);
        setHasMoreMessages(res.pagination?.page < res.pagination?.totalPages);
      } else {
        setHasMoreMessages(false);
      }
    } catch (err) {
      console.debug("Failed to load more messages:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // 5. Send message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();

    if (!text || !activeConversation || sending) return;

    if (text.length > 2000) {
      setErrorMessage("Message is too long (maximum 2000 characters).");
      return;
    }

    setSending(true);
    setErrorMessage("");

    // Clear typing indicator immediately
    emitTyping(activeConversation.id, false);
    isTypingRef.current = false;

    try {
      const res = await api.sendChatMessage(activeConversation.id, text);
      if (res && res.ok && res.data) {
        const newMsg = res.data;
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });

        // Update conversation in sidebar
        setConversations((prev) => {
          const idx = prev.findIndex((c) => c.id === activeConversation.id);
          if (idx > -1) {
            const updated = {
              ...prev[idx],
              lastMessage: text,
              lastMessageAt: newMsg.createdAt,
              lastSenderId: currentUser?.id,
            };
            const next = [...prev];
            next.splice(idx, 1);
            return [updated, ...next];
          }
          return prev;
        });

        setInputText("");
        setTimeout(() => scrollToBottom(true), 50);
      } else {
        setErrorMessage(res?.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Failed to send message. Please check your connection.");
    } finally {
      setSending(false);
    }
  };

  // Handle typing input change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (!activeConversation) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitTyping(activeConversation.id, true);
    }

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      emitTyping(activeConversation.id, false);
    }, 2000);
  };

  // 6. Start new conversation modal
  const openNewModal = async () => {
    setShowNewModal(true);
    setLoadingAlumni(true);
    setAlumniSearch("");
    try {
      const res = await api.getMessageEligibleAlumni();
      if (res && res.ok && Array.isArray(res.data)) {
        setEligibleAlumni(res.data);
      } else {
        // Fallback to mock alumni list excluding current user
        const fallback = pa
          .filter((p) => p.id !== (currentUser?.id || 1))
          .map((p) => ({
            id: p.id,
            name: p.name,
            avatar: p.avatar,
            dept: p.dept,
            batch: p.batch,
            headline: p.headline,
            role: p.role,
            online: true,
          }));
        setEligibleAlumni(fallback);
      }
    } catch (err) {
      console.debug("Failed to fetch alumni contacts:", err);
    } finally {
      setLoadingAlumni(false);
    }
  };

  const handleSelectAlumnus = async (targetUser) => {
    try {
      setShowNewModal(false);
      const res = await api.startConversation(targetUser.id);
      if (res && res.ok && res.data) {
        const conv = res.data;
        setConversations((prev) => {
          const idx = prev.findIndex((c) => c.id === conv.id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = conv;
            return next;
          }
          return [conv, ...prev];
        });
        setActiveConversation(conv);
        setMobileView("chat");
      }
    } catch (err) {
      console.debug("Failed to start conversation:", err);
    }
  };

  // Filter conversations list by search
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase().trim();
    return conversations.filter((c) => {
      const p = c.user || c.participant || {};
      const name = (p.name || "").toLowerCase();
      const headline = (p.headline || p.dept || "").toLowerCase();
      const msg = (c.lastMessage || "").toLowerCase();
      return name.includes(q) || headline.includes(q) || msg.includes(q);
    });
  }, [conversations, searchQuery]);

  // Filter eligible alumni in modal
  const filteredAlumni = useMemo(() => {
    if (!alumniSearch.trim()) return eligibleAlumni;
    const q = alumniSearch.toLowerCase().trim();
    return eligibleAlumni.filter(
      (a) =>
        (a.name || "").toLowerCase().includes(q) ||
        (a.dept || "").toLowerCase().includes(q) ||
        (a.batch || "").toLowerCase().includes(q) ||
        (a.headline || "").toLowerCase().includes(q)
    );
  }, [eligibleAlumni, alumniSearch]);

  // Group messages by day for date separator chips
  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentDay = null;

    messages.forEach((msg) => {
      const day = formatDaySeparator(msg.createdAt);
      if (day !== currentDay) {
        currentDay = day;
        groups.push({ type: "date_separator", date: day, id: `sep-${msg.id || Math.random()}` });
      }
      groups.push({ type: "message", ...msg });
    });

    return groups;
  }, [messages]);

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8F0] flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold font-display text-[#17263C] flex items-center gap-2">
            <span>Alumni Messaging</span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                socketConnected ? "bg-[#006B3F]" : "bg-amber-400"
              }`}
              title={socketConnected ? "Real-time Live Connected" : "Connecting..."}
            />
          </h1>
          <p className="text-xs text-[#64748B]">
            Direct, real-time communication between verified PUST alumni and faculty.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#7A1737] hover:bg-[#62122B] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <span>✍️</span>
          <span>New Message</span>
        </button>
      </div>

      {/* Main Messaging Container */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex overflow-hidden">
        {/* ==============================================================
            LEFT PANEL: CONVERSATION LIST
            Mobile: Full width when mobileView === 'list'
            Desktop: 80 or 96 width
        ============================================================== */}
        <div
          className={`${
            mobileView === "list" ? "flex" : "hidden"
          } md:flex flex-col w-full md:w-80 lg:w-96 border-r border-[#E2E8F0] bg-white flex-shrink-0`}
        >
          {/* Conversation List Header & Search */}
          <div className="p-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-[#94A3B8] pointer-events-none">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-xs rounded-lg border border-[#CBD5E1] bg-white text-[#17263C] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#7A1737]/20 focus:border-[#7A1737] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-xs text-[#94A3B8] hover:text-[#17263C]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9]">
            {loadingConversations ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-[#7A1737] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-[#64748B]">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748B] space-y-3">
                <div className="text-2xl">💬</div>
                <p className="font-medium text-[#17263C]">No conversations found</p>
                <p className="text-[11px] text-[#94A3B8]">
                  {searchQuery
                    ? "No alumni match your search query."
                    : "Start connecting with fellow PUST graduates today!"}
                </p>
                <button
                  type="button"
                  onClick={openNewModal}
                  className="px-3 py-1.5 rounded-lg bg-[#17263C] text-white text-xs font-semibold hover:bg-[#0F1A2A] transition-colors"
                >
                  Start Conversation
                </button>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const partner = conv.user || conv.participant || {};
                const isActive = activeConversation?.id === conv.id;
                const unread = Number(conv.unreadCount || 0);

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => {
                      setActiveConversation(conv);
                      setMobileView("chat");
                    }}
                    className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#F1F5F9] border-l-4 border-l-[#7A1737]"
                        : "hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {/* User Avatar with Online Dot */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          partner.avatar ||
                          createInitialsAvatar(partner.name || "Alumni", partner.role || "alumni")
                        }
                        alt={partner.name || "Alumni"}
                        className="w-11 h-11 rounded-full object-cover border border-[#E2E8F0] bg-[#F8FAFC]"
                        onError={(e) => {
                          e.currentTarget.src = createInitialsAvatar(partner.name || "Alumni");
                        }}
                      />
                      {partner.online && (
                        <span
                          className="absolute bottom-0 right-0 w-3 h-3 bg-[#006B3F] rounded-full ring-2 ring-white"
                          title="Online now"
                        />
                      )}
                    </div>

                    {/* Metadata & Message Preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1 mb-1">
                        <p
                          className={`text-xs truncate ${
                            unread > 0
                              ? "font-bold text-[#17263C]"
                              : "font-semibold text-[#17263C]"
                          }`}
                        >
                          {partner.name || "PUST Alumni"}
                        </p>
                        <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                          {formatRelativeDate(conv.lastMessageAt)}
                        </span>
                      </div>

                      <p
                        className={`text-xs truncate ${
                          unread > 0
                            ? "font-semibold text-[#17263C]"
                            : "text-[#64748B]"
                        }`}
                      >
                        {conv.lastSenderId === currentUser?.id ? "You: " : ""}
                        {conv.lastMessage || "No messages yet"}
                      </p>

                      {partner.dept && (
                        <p className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                          {partner.dept} {partner.batch ? `· Batch ${partner.batch}` : ""}
                        </p>
                      )}
                    </div>

                    {/* Unread Pill */}
                    {unread > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#7A1737] text-white text-[10px] font-bold flex-shrink-0 mt-1 shadow-xs">
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ==============================================================
            RIGHT PANEL: ACTIVE CHAT THREAD
            Mobile: Full width when mobileView === 'chat'
            Desktop: Flex-1
        ============================================================== */}
        <div
          className={`${
            mobileView === "chat" ? "flex" : "hidden"
          } md:flex flex-col flex-1 min-w-0 bg-[#F8FAFC]`}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-3 flex-shrink-0 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobileView("list")}
                    className="md:hidden p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#17263C] text-sm"
                    title="Back to conversations"
                  >
                    ←
                  </button>

                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        activePartner.avatar ||
                        createInitialsAvatar(activePartner.name || "Alumni")
                      }
                      alt={activePartner.name || "Alumni"}
                      className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
                      onError={(e) => {
                        e.currentTarget.src = createInitialsAvatar(
                          activePartner.name || "Alumni"
                        );
                      }}
                    />
                    {activePartner.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#006B3F] rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-[#17263C] truncate">
                        {activePartner.name || "Alumni Member"}
                      </p>
                      {activePartner.verified && (
                        <span className="text-[10px] text-[#006B3F] font-bold">✓</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate">
                      {activePartner.online ? (
                        <span className="text-[#006B3F] font-medium">● Online</span>
                      ) : (
                        <span>Offline</span>
                      )}
                      {activePartner.dept ? ` · ${activePartner.dept}` : ""}
                      {activePartner.batch
                        ? ` · Batch ${activePartner.batch}`
                        : ""}
                    </p>
                  </div>
                </div>

                {/* Profile Link */}
                {activePartner.id && (
                  <Link
                    to={`/alumni/${activePartner.id}`}
                    className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#17263C] text-xs font-semibold transition-colors flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>View Profile</span>
                    <span>↗</span>
                  </Link>
                )}
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 min-h-0">
                {/* Pagination load older button */}
                {hasMoreMessages && (
                  <div className="text-center pt-1 pb-2">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#CBD5E1] text-[#17263C] hover:bg-[#F1F5F9] transition-colors shadow-2xs"
                    >
                      {loadingMore ? "Loading older messages..." : "↑ Load earlier messages"}
                    </button>
                  </div>
                )}

                {loadingMessages ? (
                  <div className="py-12 text-center">
                    <div className="w-6 h-6 border-2 border-[#7A1737] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-[#64748B]">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#64748B] space-y-2">
                    <div className="text-3xl">👋</div>
                    <p className="font-semibold text-[#17263C]">No messages yet</p>
                    <p className="text-[#94A3B8]">
                      Say hello to start the conversation with{" "}
                      {activePartner.name || "your fellow alumni"}!
                    </p>
                  </div>
                ) : (
                  groupedMessages.map((item) => {
                    if (item.type === "date_separator") {
                      return (
                        <div key={item.id} className="flex items-center justify-center my-3">
                          <span className="px-3 py-0.5 rounded-full bg-[#E2E8F0]/70 text-[#64748B] text-[10px] font-semibold uppercase tracking-wider">
                            {item.date}
                          </span>
                        </div>
                      );
                    }

                    const isMe =
                      Number(item.senderId) === Number(currentUser?.id) || item.from === "me";

                    return (
                      <div
                        key={item.id || Math.random()}
                        className={`flex items-end gap-2 ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isMe && (
                          <img
                            src={
                              item.senderAvatar ||
                              activePartner.avatar ||
                              createInitialsAvatar(item.senderName || "Alumni")
                            }
                            alt=""
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1 border border-[#E2E8F0]"
                          />
                        )}

                        <div
                          className={`max-w-[78%] sm:max-w-[70%] px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                            isMe
                              ? "bg-[#17263C] text-white rounded-2xl rounded-br-xs"
                              : "bg-white text-[#0F172A] border border-[#E2E8F0] rounded-2xl rounded-bl-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{item.text}</p>
                          <div
                            className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
                              isMe ? "text-slate-300" : "text-[#94A3B8]"
                            }`}
                          >
                            <span>{formatTime(item.createdAt)}</span>
                            {isMe && (
                              <span
                                title={item.read ? "Read" : "Sent"}
                                className={item.read ? "text-[#C7A76C] font-bold" : "text-slate-400"}
                              >
                                {item.read ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Real-time Partner Typing Indicator */}
                {partnerTyping && (
                  <div className="flex items-center gap-2 text-xs text-[#64748B] pt-1">
                    <img
                      src={
                        activePartner.avatar ||
                        createInitialsAvatar(activePartner.name || "Alumni")
                      }
                      alt=""
                      className="w-6 h-6 rounded-full object-cover border border-[#E2E8F0]"
                    />
                    <div className="bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 bg-[#7A1737] rounded-full animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 bg-[#7A1737] rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-[#7A1737] rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                      <span className="text-[11px] text-[#64748B] font-medium ml-1">
                        {activePartner.name?.split(" ")[0] || "User"} is typing...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <div className="p-3 sm:p-4 bg-white border-t border-[#E2E8F0] flex-shrink-0">
                {errorMessage && (
                  <div className="mb-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center justify-between">
                    <span>{errorMessage}</span>
                    <button
                      type="button"
                      onClick={() => setErrorMessage("")}
                      className="text-red-500 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    maxLength={2000}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#17263C] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7A1737]/20 focus:border-[#7A1737] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      !inputText.trim() || sending
                        ? "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                        : "bg-[#7A1737] hover:bg-[#62122B] text-white"
                    }`}
                  >
                    <span>{sending ? "Sending..." : "Send"}</span>
                    <span>→</span>
                  </button>
                </form>
                <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-[#94A3B8]">
                  <span>Press Enter to send</span>
                  <span>{inputText.length} / 2000</span>
                </div>
              </div>
            </>
          ) : (
            /* Empty State when no conversation selected */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F8FAFC]">
              <div className="w-16 h-16 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-3xl mb-4 shadow-sm">
                💬
              </div>
              <h3 className="text-lg font-bold font-display text-[#17263C] mb-1">
                Select a conversation
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mb-6 leading-relaxed">
                Choose an alumni conversation from the left, or compose a new message to any
                verified PUST graduate or faculty member.
              </p>
              <button
                type="button"
                onClick={openNewModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7A1737] hover:bg-[#62122B] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>✍️</span>
                <span>Start New Conversation</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==============================================================
          MODAL: START NEW CONVERSATION WITH ALUMNI
      ============================================================== */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <h3 className="font-bold font-display text-sm text-[#17263C]">
                  Start a New Conversation
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Connect with eligible PUST alumni and faculty members.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="w-7 h-7 rounded-lg text-xs text-[#64748B] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Search */}
            <div className="p-3 border-b border-[#E2E8F0]">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#94A3B8] pointer-events-none">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search alumni by name, dept, batch..."
                  value={alumniSearch}
                  onChange={(e) => setAlumniSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs rounded-lg border border-[#CBD5E1] bg-white text-[#17263C] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#7A1737]/20 focus:border-[#7A1737] transition-all"
                />
                {alumniSearch && (
                  <button
                    type="button"
                    onClick={() => setAlumniSearch("")}
                    className="absolute right-2.5 top-2.5 text-xs text-[#94A3B8] hover:text-[#17263C]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Alumni Scrollable Results */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9] p-2">
              {loadingAlumni ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-[#7A1737] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-[#64748B]">Loading alumni contacts...</p>
                </div>
              ) : filteredAlumni.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B]">
                  No alumni found matching "{alumniSearch}".
                </div>
              ) : (
                filteredAlumni.map((alum) => (
                  <button
                    key={alum.id}
                    type="button"
                    onClick={() => handleSelectAlumnus(alum)}
                    className="w-full p-2.5 rounded-xl flex items-center gap-3 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          alum.avatar ||
                          createInitialsAvatar(alum.name || "Alumni", alum.role || "alumni")
                        }
                        alt={alum.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
                        onError={(e) => {
                          e.currentTarget.src = createInitialsAvatar(alum.name || "Alumni");
                        }}
                      />
                      {alum.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#006B3F] rounded-full ring-2 ring-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#17263C] truncate">{alum.name}</p>
                      <p className="text-[11px] text-[#64748B] truncate">
                        {alum.dept} {alum.batch ? `· Batch ${alum.batch}` : ""}
                        {alum.company ? ` · ${alum.company}` : ""}
                      </p>
                      {alum.headline && (
                        <p className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                          {alum.headline}
                        </p>
                      )}
                    </div>

                    <span className="text-xs text-[#7A1737] font-semibold flex-shrink-0">
                      Chat →
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
