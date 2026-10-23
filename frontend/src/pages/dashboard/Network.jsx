import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pa, ma, ha, Sa } from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";

var ks = [`Connections`, `Pending`, `Suggestions`, `Students to Help`];
export default function DashboardNetwork() {
  useBackendSync();
  const [activeTab, setActiveTab] = useState(`Connections`);
  const [allMembers, setAllMembers] = useState(() => [...pa, ...ma, ...ha, ...Sa]);
  const [connectedIds, setConnectedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_connected_alumni");
      const parsed = stored ? JSON.parse(stored) : [1, 5];
      return Array.isArray(parsed) ? parsed : [1, 5];
    } catch (e) {
      return [1, 5];
    }
  });
  const [pendingIds, setPendingIds] = useState([3, 7]);

  useEffect(() => {
    let isMounted = true;
    api.getAlumniDirectory().then((res) => {
      if (isMounted && res && res.ok && Array.isArray(res.data) && res.data.length > 0) {
        setAllMembers(res.data);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const safeConnIds = Array.isArray(connectedIds) ? connectedIds : [];
  const safePendingIds = Array.isArray(pendingIds) ? pendingIds : [];

  const tabList = {
    Connections: allMembers.filter((m) => m && safeConnIds.some((id) => String(id) === String(m.id))),
    Pending: allMembers.filter((m) => m && safePendingIds.some((id) => String(id) === String(m.id))),
    Suggestions: allMembers.filter(
      (m) =>
        m &&
        !safeConnIds.some((id) => String(id) === String(m.id)) &&
        !safePendingIds.some((id) => String(id) === String(m.id)) &&
        (m.role || "alumni") !== "student"
    ),
    "Students to Help": allMembers.filter((m) => m && (m.role || "").toLowerCase() === "student"),
  }[activeTab] || [];
  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-[#0F172A]">
          My Network
        </h1>
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <span className="font-semibold text-[#0F172A]">{connectedIds.length}</span>
          {" connections"}
        </div>
      </div>
      <div className="card rounded-xl overflow-hidden">
        <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
          {ks.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-underline ${activeTab === tab ? `active` : ``}`}
            >
              {tab}
              {tab === `Pending` && pendingIds.length > 0 && (
                <span className="ml-1.5 badge badge-red text-[9px]">
                  {pendingIds.length}
                </span>
              )}
              {tab === `Connections` && (
                <span className="ml-1.5 badge badge-green text-[9px]">
                  {connectedIds.length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-3">
          {tabList.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="font-semibold text-[#0F172A]">
                {"No "}
                {activeTab}
                {" Yet"}
              </h3>
              <p className="text-[#64748B] text-sm mt-1">
                Start exploring the alumni directory to connect with graduates and faculty.
              </p>
              <Link to="/alumni" className="btn btn-primary btn-sm mt-4">
                Browse Alumni Directory
              </Link>
            </div>
          ) : (
            tabList.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F8FAFC] transition-colors"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-[#0F172A] text-sm">
                      {member.name}
                    </p>
                    {member.verified && (
                      <span className="text-[#006B3F] text-[10px]">✓</span>
                    )}
                  </div>
                  <p className="text-[#64748B] text-xs mt-0.5 truncate">
                    {member.headline}
                  </p>
                  <p className="text-[10px] text-[#94A3B8]">
                    {member.dept} {member.batch ? `· Batch ${member.batch}` : ``}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {activeTab === `Connections` && (
                    <>
                      <Link to={`/dashboard/messages?startWith=${member.id}`} className="btn btn-sm btn-ghost">Message</Link>
                      <button
                        onClick={() => {
                          const next = connectedIds.filter((id) => String(id) !== String(member.id));
                          setConnectedIds(next);
                          try {
                            localStorage.setItem("pust_connected_alumni", JSON.stringify(next));
                          } catch (e) {}
                        }}
                        className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </>
                  )}
                  {activeTab === `Pending` && (
                    <>
                      <button
                        onClick={() => {
                          api.connectAlumni(member.id);
                          const nextConn = [...connectedIds, member.id];
                          setConnectedIds(nextConn);
                          setPendingIds(pendingIds.filter((id) => String(id) !== String(member.id)));
                          try {
                            localStorage.setItem("pust_connected_alumni", JSON.stringify(nextConn));
                          } catch (e) {}
                        }}
                        className="btn btn-sm btn-green"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setPendingIds(pendingIds.filter((id) => String(id) !== String(member.id)))}
                        className="btn btn-sm btn-ghost text-red-500"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {activeTab === `Suggestions` && (
                    <button
                      onClick={() => {
                        api.connectAlumni(member.id);
                        setPendingIds([...pendingIds, member.id]);
                      }}
                      className="btn btn-sm btn-primary"
                    >
                      Connect
                    </button>
                  )}
                  {activeTab === `Students to Help` && (
                    <Link to="/dashboard/mentorship" className="btn btn-sm btn-outline">Mentor</Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
