import React, { useState, useMemo } from "react";
import {
  pa as initialAlumni,
  ma as initialStudents,
  ha as initialFaculty,
  Sa as initialEmployers,
  Ca as initialCommunityPhotos,
  Ia,
  La,
  Ra,
  za,
  Ba,
  Va,
  Ha,
} from "../../data/mockData";
import { api, useBackendSync } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";
import CampusVideoExperience from "../../components/CampusVideoExperience";

const REAL_CAMPUS_ARCHIVE = [
  {
    id: 1001,
    url: Ia,
    thumb: Ia,
    title: "PUST Campus — Sunset View over Central Grounds",
    category: "Campus Life",
    year: "2026",
    likes: 148,
    stakeholder: "alumni",
  },
  {
    id: 1002,
    url: Ha,
    thumb: Ha,
    title: "Freshers' Reception & Orientation Ceremony",
    category: "Events",
    year: "2025",
    likes: 214,
    stakeholder: "students",
  },
  {
    id: 1003,
    url: La,
    thumb: La,
    title: "Distinguished Alumni Award Ceremony",
    category: "Convocation",
    year: "2026",
    likes: 176,
    stakeholder: "alumni",
  },
  {
    id: 1004,
    url: Va,
    thumb: Va,
    title: "National Tech Hackathon & Programming Contest",
    category: "Events",
    year: "2026",
    likes: 132,
    stakeholder: "students",
  },
  {
    id: 1005,
    url: za,
    thumb: za,
    title: "Faculty Development Training on Pedagogy & Research",
    category: "Research",
    year: "2026",
    likes: 98,
    stakeholder: "faculty",
  },
  {
    id: 1006,
    url: Ra,
    thumb: Ra,
    title: "PUST Vice Chancellor's Directorate",
    category: "Campus Life",
    year: "2026",
    likes: 87,
    stakeholder: "faculty",
  },
  {
    id: 1007,
    url: Ba,
    thumb: Ba,
    title: "PUST Eagle Sculpture — Campus Heritage Landmark",
    category: "Campus Life",
    year: "2026",
    likes: 203,
    stakeholder: "alumni",
  },
];

const CATEGORIES = [
  "All",
  "Campus Life",
  "Events",
  "Convocation",
  "Research",
  "Alumni Reunion",
  "Sports",
];

const STAKEHOLDERS = [
  { key: "all", label: "All Stakeholders", icon: "🌐" },
  { key: "alumni", label: "Alumni", icon: "🎓" },
  { key: "students", label: "Students", icon: "📚" },
  { key: "faculty", label: "Faculty", icon: "👨‍🏫" },
  { key: "employers", label: "Employers", icon: "🏢" },
];

const STAKEHOLDER_BADGES = {
  alumni: "bg-[#7A1737]/10 text-[#7A1737] border border-[#7A1737]/20",
  students: "bg-[#17263C]/10 text-[#17263C] border border-[#17263C]/20",
  faculty: "bg-[#C7A76C]/20 text-[#7A1737] border border-[#C7A76C]/40",
  employers: "bg-[#174A7E]/10 text-[#174A7E] border border-[#174A7E]/20",
};

export default function Gallery() {
  usePageMeta(
    "Campus & Community Gallery · PUST Alumni Network",
    "Explore photos, moments, convocations, campus events, and reunions from Pabna University of Science and Technology."
  );
  useBackendSync();

  const allPhotos = useMemo(() => {
    return [...REAL_CAMPUS_ARCHIVE, ...initialCommunityPhotos];
  }, []);

  const allStakeholders = useMemo(() => {
    return [
      ...initialAlumni.map((e) => ({ ...e, group: "alumni", groupLabel: "Alumni" })),
      ...initialStudents.map((e) => ({ ...e, group: "students", groupLabel: "Current Students" })),
      ...initialFaculty.map((e) => ({ ...e, group: "faculty", groupLabel: "Faculty" })),
      ...initialEmployers.map((e) => ({ ...e, group: "employers", groupLabel: "Employer Partners" })),
    ];
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStakeholder, setSelectedStakeholder] = useState("all");
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState(null);
  const [activeTab, setActiveTab] = useState("photos");
  const [likedPhotoIds, setLikedPhotoIds] = useState([]);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((item) => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchStake =
        selectedStakeholder === "all" || item.stakeholder === selectedStakeholder;
      return matchCat && matchStake;
    });
  }, [allPhotos, selectedCategory, selectedStakeholder]);

  // Filtered stakeholders
  const filteredStakeholders = useMemo(() => {
    return allStakeholders.filter(
      (m) => selectedStakeholder === "all" || m.group === selectedStakeholder
    );
  }, [allStakeholders, selectedStakeholder]);

  // Like toggle
  const handleToggleLike = (photoId, e) => {
    if (e) e.stopPropagation();
    if (!likedPhotoIds.includes(photoId)) {
      api.likeGallery(photoId);
    }
    setLikedPhotoIds((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#17263C]">
      {/* 1. HERO HEADER */}
      <section
        className="relative overflow-hidden border-b border-[#0F1A2A]"
        style={{
          background: "#17263C",
          minHeight: 380,
        }}
      >
        <div
          className="absolute inset-0 grid gap-0.5 opacity-20"
          style={{
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
          }}
        >
          <div className="overflow-hidden" style={{ gridRow: "1 / 3" }}>
            <img src={Ia} alt="PUST Campus" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <img src={Ha} alt="Freshers" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <img src={La} alt="Award" className="w-full h-full object-cover object-top" />
          </div>
          <div className="overflow-hidden">
            <img src={Va} alt="Contest" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <img src={za} alt="Training" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <img src={Ra} alt="VC Office" className="w-full h-full object-cover object-top" />
          </div>
          <div className="overflow-hidden">
            <img src={Ba} alt="Sculpture" className="w-full h-full object-cover" />
          </div>
        </div>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(23, 38, 60, 0.85) 0%, rgba(23, 38, 60, 0.98) 100%)",
          }}
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C7A76C] mb-3 reveal-down">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span>{" "}
            · PUST Photo & Video Archive
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-3 reveal-down delay-100">
            Campus Memories & Moments
          </h1>
          <p className="text-[#E2E8F0] text-sm sm:text-base max-w-xl leading-relaxed reveal-up delay-150">
            Preserving milestones and shared moments — alumni, students, faculty, and institutional
            partners of Pabna University of Science & Technology.
          </p>
        </div>
      </section>

      {/* 2. METRICS RIBBON */}
      <section className="bg-white border-b border-[#E2E8F0] shadow-2xs reveal-section">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0]">
          {[
            { value: allPhotos.length, label: "Total Archive Photos" },
            {
              value: allPhotos.filter((e) => e.stakeholder === "alumni").length,
              label: "Alumni Memories",
            },
            {
              value: allPhotos.filter((e) => e.stakeholder === "students").length,
              label: "Student Life",
            },
            {
              value: allPhotos.filter((e) => e.stakeholder === "faculty").length,
              label: "Academic & Research",
            },
            {
              value: allPhotos.filter((e) => e.stakeholder === "employers").length,
              label: "Industry Meets",
            },
          ].map((item, idx) => (
            <div key={idx} className={`py-4 px-3 text-center reveal-scale delay-${(idx + 1) * 75}`}>
              <p className="font-display font-bold text-[#7A1737] text-xl sm:text-2xl leading-none">
                {item.value}
              </p>
              <p className="text-[#64748B] text-[10px] mt-1 font-semibold uppercase tracking-wider">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MAIN GALLERY INTERFACE */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E2E8F0] mb-6 gap-6">
          {[
            { key: "photos", label: "📸 Photo Archive" },
            { key: "videos", label: "🎥 Campus Walkthrough Videos" },
            { key: "people", label: "👥 All Stakeholders" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === item.key
                  ? "text-[#7A1737] border-[#7A1737]"
                  : "text-[#64748B] border-transparent hover:text-[#17263C]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Stakeholder Filters for photos / people */}
        {activeTab !== "videos" && (
          <div className="flex flex-wrap gap-2 mb-6">
            {STAKEHOLDERS.map((stake) => (
              <button
                key={stake.key}
                onClick={() => setSelectedStakeholder(stake.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  selectedStakeholder === stake.key
                    ? "bg-[#7A1737] text-white border-[#7A1737] shadow-2xs"
                    : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#17263C]"
                }`}
              >
                <span>{stake.icon}</span>
                <span>{stake.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* TAB: PHOTOS */}
        {activeTab === "photos" && (
          <>
            {/* Quick Campus Video Teaser Banner */}
            <div className="mb-6 p-5 rounded-xl bg-[#17263C] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-[#0F1A2A]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-lg bg-white/10 text-white flex items-center justify-center text-xl flex-shrink-0 border border-white/10">
                  🎥
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C]">
                      অফিশিয়াল রিয়েল ক্যাম্পাস ভিডিও
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="font-display font-bold text-white text-base sm:text-lg mt-0.5">
                    ক্যাম্পাস ওয়াকথ্রু ও সমাবর্তন পুনর্মিলনীর আসল মুহূর্ত দেখুন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("videos")}
                className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[#7A1737] hover:bg-[#62122B] text-white transition-all flex items-center gap-2 flex-shrink-0 active:scale-95 shadow-sm cursor-pointer"
              >
                <span>ভিডিও প্লে করুন</span>
                <span>▶</span>
              </button>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 text-xs rounded-full transition-all border cursor-pointer ${
                    selectedCategory === category
                      ? "bg-[#17263C] text-white font-semibold border-[#17263C] shadow-2xs"
                      : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#17263C]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Real Campus Photos Grid Strip */}
            {selectedCategory === "All" && selectedStakeholder === "all" && (
              <div className="mb-8 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A1737]">
                    PUST — Verified Historical Archive
                  </p>
                  <span className="text-[11px] text-[#94A3B8]">Click any photo to enlarge</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                  {REAL_CAMPUS_ARCHIVE.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveLightboxPhoto(item)}
                      className="relative overflow-hidden cursor-pointer group rounded-lg border border-[#E2E8F0] hover:border-[#7A1737] transition-all aspect-square"
                    >
                      <img
                        src={item.thumb}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(23,38,60,0.92), transparent 60%)",
                        }}
                      >
                        <p className="text-white text-[9px] font-medium leading-tight line-clamp-2">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Masonry View */}
            {filteredPhotos.length === 0 ? (
              <div className="text-center py-20 text-[#64748B] bg-white rounded-xl border border-[#E2E8F0]">
                <div className="text-4xl mb-3">📷</div>
                <p className="font-semibold text-[#17263C]">No photos found</p>
                <p className="text-sm mt-1 text-[#64748B]">
                  Try selecting a different filter category
                </p>
              </div>
            ) : (
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
                {filteredPhotos.map((item) => {
                  const isLiked = likedPhotoIds.includes(item.id);
                  const isOfficial = item.id >= 1001;

                  return (
                    <div
                      key={item.id}
                      className="break-inside-avoid group relative overflow-hidden cursor-pointer rounded-xl border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-md transition-all duration-300 bg-white"
                      onClick={() => setActiveLightboxPhoto(item)}
                    >
                      <img
                        src={item.thumb}
                        alt={item.title}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {isOfficial && (
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#17263C]/90 text-[#C7A76C] border border-white/20 backdrop-blur-xs">
                            PUST Verified
                          </span>
                        </div>
                      )}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(23,38,60,0.95) 0%, rgba(23,38,60,0.4) 50%, transparent 100%)",
                        }}
                      >
                        <p className="text-white font-semibold text-xs leading-snug">
                          {item.title}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                          <span className="text-[9px] font-bold text-[#CBD5E1] uppercase tracking-wide">
                            {item.category}
                          </span>
                          <button
                            type="button"
                            onClick={(event) => handleToggleLike(item.id, event)}
                            className="flex items-center gap-1 text-xs text-white font-semibold hover:text-[#C7A76C] transition-colors cursor-pointer"
                          >
                            <span>{isLiked ? "❤️" : "🤍"}</span>
                            <span>{item.likes + (isLiked ? 1 : 0)}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upload Memories CTA */}
            <div className="mt-12 p-8 text-center border border-dashed border-[#CBD5E1] rounded-2xl bg-white shadow-2xs">
              <div className="text-3xl mb-2">📸</div>
              <h2 className="font-display font-bold text-xl text-[#17263C] mb-1">
                Share Your PUST Memories
              </h2>
              <p className="text-[#475569] text-xs sm:text-sm max-w-sm mx-auto mb-5 leading-relaxed">
                Upload historical batch photos, campus milestones, or convocation snapshots to the
                official network gallery.
              </p>
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold bg-[#7A1737] hover:bg-[#62122B] text-white transition-all shadow-xs active:scale-95"
              >
                Upload Campus Photos →
              </a>
            </div>
          </>
        )}

        {/* TAB: PEOPLE */}
        {activeTab === "people" && (
          <div className="space-y-8">
            {(selectedStakeholder === "all"
              ? ["alumni", "students", "faculty", "employers"]
              : [selectedStakeholder]
            ).map((groupKey) => {
              const members = filteredStakeholders.filter((m) => m.group === groupKey);
              if (members.length === 0) return null;
              const groupMeta = STAKEHOLDERS.find((m) => m.key === groupKey);

              return (
                <div key={groupKey}>
                  <div className="flex items-center gap-2.5 mb-4 border-b border-[#E2E8F0] pb-3">
                    <span className="text-xl">{groupMeta?.icon}</span>
                    <h2 className="font-display font-bold text-lg text-[#17263C]">
                      {groupMeta?.label}
                    </h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#17263C]/10 text-[#17263C]">
                      {members.length} Members
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="bg-white border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-sm rounded-xl p-4 text-center transition-all group"
                      >
                        <div className="relative inline-block mb-2.5">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-[#E2E8F0] group-hover:ring-[#7A1737] transition-all"
                          />
                          {member.verified && (
                            <span className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-[#7A1737] rounded-full flex items-center justify-center text-white text-[9px] ring-2 ring-white">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-[#17263C] text-sm leading-snug truncate group-hover:text-[#7A1737] transition-colors">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                          {member.headline}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                          <span
                            className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                              STAKEHOLDER_BADGES[groupKey] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {member.groupLabel}
                          </span>
                          {member.batch && (
                            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#F4F5F7] text-[#64748B] border border-[#E2E8F0]">
                              Batch {member.batch}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: VIDEOS */}
        {activeTab === "videos" && (
          <div className="mb-8">
            <CampusVideoExperience
              title="PUST রিয়েল ক্যাম্পাস ভিডিও আর্কাইভ"
              subtitle="ক্যাম্পাস জীবনের মনোরম মুহূর্ত ও সমাবর্তন পুনর্মিলনীর আসল ভিডিও ফুটেজ — অনলাইন থেকেই অফলাইন ক্যাম্পাসের আসল অনুভূতি উপভোগ করুন"
            />
          </div>
        )}
      </main>

      {/* 4. LIGHTBOX MODAL */}
      {activeLightboxPhoto && (
        <div
          className="fixed inset-0 bg-[#17263C]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setActiveLightboxPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-2xl leading-none transition-colors cursor-pointer"
              onClick={() => setActiveLightboxPhoto(null)}
              aria-label="Close photo preview"
            >
              ✕
            </button>
            <img
              src={activeLightboxPhoto.url}
              alt={activeLightboxPhoto.title}
              className="w-full object-contain max-h-[70vh] rounded-xl bg-[#F8FAFC]"
            />
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]">
              <div>
                <p className="text-[#17263C] font-bold text-base">{activeLightboxPhoto.title}</p>
                <div className="flex gap-2 mt-1.5">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#7A1737]/10 text-[#7A1737] border border-[#7A1737]/20">
                    {activeLightboxPhoto.category}
                  </span>
                  <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                    {activeLightboxPhoto.year}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#17263C]/10 text-[#17263C] capitalize">
                    {activeLightboxPhoto.stakeholder}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => handleToggleLike(activeLightboxPhoto.id, e)}
                className="flex items-center gap-2 text-[#7A1737] font-bold text-sm px-4 py-2 rounded-lg bg-[#7A1737]/10 border border-[#7A1737]/20 hover:bg-[#7A1737] hover:text-white transition-all self-start sm:self-auto cursor-pointer"
              >
                <span>{likedPhotoIds.includes(activeLightboxPhoto.id) ? "❤️" : "🤍"}</span>
                <span>
                  {activeLightboxPhoto.likes +
                    (likedPhotoIds.includes(activeLightboxPhoto.id) ? 1 : 0)}{" "}
                  Likes
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
