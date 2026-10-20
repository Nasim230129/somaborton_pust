import React, { useState } from "react";
import { api } from "../../services/api";

var bc = [
    {
      id: 1,
      title: `PUST Alumni Homecoming 2026`,
      date: `15 Feb 2026`,
      location: `PUST Campus, Pabna`,
      type: `Reunion`,
      attendees: 842,
      status: `upcoming`,
      featured: true,
    },
    {
      id: 2,
      title: `Tech Career Fair — Dhaka`,
      date: `28 Jan 2026`,
      location: `Radisson Blu, Dhaka`,
      type: `Career`,
      attendees: 340,
      status: `upcoming`,
      featured: false,
    },
    {
      id: 3,
      title: `Annual Research Symposium`,
      date: `10 Mar 2026`,
      location: `PUST Auditorium`,
      type: `Academic`,
      attendees: 180,
      status: `upcoming`,
      featured: false,
    },
    {
      id: 4,
      title: `Alumni Leadership Summit 2025`,
      date: `Dec 2025`,
      location: `Le Méridien Dhaka`,
      type: `Leadership`,
      attendees: 620,
      status: `completed`,
      featured: false,
    },
    {
      id: 5,
      title: `CSE Batch 2008 Reunion`,
      date: `Nov 2025`,
      location: `PUST Campus`,
      type: `Reunion`,
      attendees: 68,
      status: `completed`,
      featured: false,
    },
  ],
  xc = {
    Reunion: `badge-blue`,
    Career: `badge-green`,
    Academic: `badge-purple`,
    Leadership: `badge-gold`,
  };
export default function AdminEvents() {
  let [e, t] = useState(bc),
    [n, r] = useState(false),
    [editingId, setEditingId] = useState(null),
    [toastMsg, setToastMsg] = useState(""),
    [i, a] = useState({
      title: "",
      date: "",
      location: "",
      type: "Reunion",
    });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const o = (eventObj) => {
    eventObj.preventDefault();
    if (editingId) {
      t(
        e.map((item) =>
          item.id === editingId ? { ...item, ...i } : item
        )
      );
      showToast("ইভেন্ট সফলভাবে আপডেট করা হয়েছে!");
      setEditingId(null);
    } else {
      api.createEvent(i);
      t([
        {
          id: Date.now(),
          ...i,
          attendees: 0,
          status: "upcoming",
          featured: false,
        },
        ...e,
      ]);
      showToast("নতুন ইভেন্ট সফলভাবে তৈরি করা হয়েছে!");
    }
    a({
      title: "",
      date: "",
      location: "",
      type: "Reunion",
    });
    r(false);
  };

  const handleEditClick = (eventItem) => {
    setEditingId(eventItem.id);
    a({
      title: eventItem.title,
      date: eventItem.date,
      location: eventItem.location,
      type: eventItem.type,
    });
    r(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (eventId, eventTitle) => {
    t(e.filter((item) => item.id !== eventId));
    api.deleteEvent?.(eventId);
    showToast(`"${eventTitle}" ইভেন্টটি বাতিল করা হয়েছে`);
  };

  let s = e.filter((e) => e.status === "upcoming"),
    c = e.filter((e) => e.status === "completed");

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F172A]">
            Event Management
          </h1>
          <p className="text-[#64748B] text-sm">
            {s.length} upcoming · {c.length} past
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            a({ title: "", date: "", location: "", type: "Reunion" });
            r(!n);
          }}
          className="btn btn-green btn-sm cursor-pointer"
        >
          + Create Event
        </button>
      </div>
      {n && (
        <div className="card rounded-xl p-6">
          <h2 className="font-semibold text-[#0F172A] mb-4">
            {editingId ? "Edit Event" : "Create New Event"}
          </h2>
          <form onSubmit={o} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Event Title
                </label>
                <input
                  className="input"
                  required
                  value={i.title}
                  onChange={(e) =>
                    a({
                      ...i,
                      title: e.target.value,
                    })
                  }
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <select
                  className="input"
                  value={i.type}
                  onChange={(e) =>
                    a({
                      ...i,
                      type: e.target.value,
                    })
                  }
                >
                  {[
                    `Reunion`,
                    `Career`,
                    `Academic`,
                    `Leadership`,
                    `Workshop`,
                    `Webinar`,
                  ].map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <input
                  className="input"
                  type="date"
                  required
                  value={i.date}
                  onChange={(e) =>
                    a({
                      ...i,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <input
                  className="input"
                  required
                  value={i.location}
                  onChange={(e) =>
                    a({
                      ...i,
                      location: e.target.value,
                    })
                  }
                  placeholder="Venue name, City"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-green">
                Create Event
              </button>
              <button
                type="button"
                onClick={() => r(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div>
        <h2 className="font-semibold text-[#0F172A] mb-3">Upcoming Events</h2>
        <div className="space-y-3">
          {s.map((e) => (
            <div
              key={e.id}
              className={`card rounded-xl p-5 ${e.featured ? `ring-2 ring-[#F59E0B]/30` : ``}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-[#0F172A]">{e.title}</h3>
                    {e.featured && (
                      <span className="badge badge-gold text-[9px]">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-[#64748B]">
                    <span>
                      {"\uD83D\uDCC5 "}
                      {e.date}
                    </span>
                    <span>
                      {"\uD83D\uDCCD "}
                      {e.location}
                    </span>
                    <span
                      className={`badge ${xc[e.type] || `badge-gray`} text-[9px]`}
                    >
                      {e.type}
                    </span>
                    <span>
                      {"\uD83D\uDC65 "}
                      {e.attendees}
                      {" registered"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditClick(e)}
                    className="btn btn-ghost btn-sm text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(e.id, e.title)}
                    className="btn btn-outline btn-sm text-xs text-red-500 border-red-200 hover:bg-red-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {c.length > 0 && (
        <div>
          <h2 className="font-semibold text-[#0F172A] mb-3">Past Events</h2>
          <div className="space-y-3">
            {c.map((e) => (
              <div key={e.id} className="card rounded-xl p-4 opacity-70">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    ✅
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#0F172A] text-sm">
                      {e.title}
                    </h3>
                    <div className="flex gap-3 text-xs text-[#94A3B8]">
                      <span>{e.date}</span>
                      <span>
                        {"\uD83D\uDC65 "}
                        {e.attendees}
                        {" attended"}
                      </span>
                    </div>
                  </div>
                  <span className="badge badge-gray text-[9px]">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
