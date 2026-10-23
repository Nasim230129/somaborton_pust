import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  _a as initialEvents,
  La,
  za,
  Ba,
  Ha,
  Wa,
  qa,
  Ja,
  Xa,
  Qa,
} from "../../data/mockData";
import { api, useBackendSync, getCurrentUser } from "../../services/api";
import usePageMeta from "../../services/usePageMeta";

// Deterministic SVG QR Code generator with zero external dependencies
function TicketQrCode({ ticketRef, size = 120 }) {
  const hash = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  };
  const seed = hash(ticketRef || "PUST-PASS-DEFAULT");

  const cells = [];
  const finderPattern = (r, c) => {
    if (r <= 6 && c <= 6) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    if (r <= 6 && c >= 14) {
      if (r === 0 || r === 6 || c === 14 || c === 20) return true;
      if (r >= 2 && r <= 4 && c >= 16 && c <= 18) return true;
      return false;
    }
    if (r >= 14 && c <= 6) {
      if (r === 14 || r === 20 || c === 0 || c === 6) return true;
      if (r >= 16 && r <= 18 && c >= 2 && c <= 4) return true;
      return false;
    }
    return null;
  };

  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      const finder = finderPattern(r, c);
      if (finder !== null) {
        if (finder) cells.push({ r, c });
      } else {
        const bit = ((seed ^ (r * 37 + c * 17)) + (r * c)) % 3 === 0;
        if (bit) cells.push({ r, c });
      }
    }
  }

  const cellSize = size / 21;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded bg-white p-1 border border-slate-200 shadow-2xs"
      aria-label="Official QR Pass"
    >
      <rect width={size} height={size} fill="#ffffff" />
      {cells.map(({ r, c }, i) => (
        <rect
          key={i}
          x={c * cellSize}
          y={r * cellSize}
          width={cellSize}
          height={cellSize}
          fill="#17263C"
        />
      ))}
    </svg>
  );
}

// Client-side A5 Official Admit Pass PDF Generator using jsPDF
function generateEventAdmitPassPdf({ ticket, event }) {
  try {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a5" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Top header banner (Navy + Maroon accent)
    doc.setFillColor(23, 38, 60); // #17263C
    doc.rect(0, 0, w, 28, "F");

    doc.setFillColor(122, 23, 55); // #7A1737
    doc.rect(0, 26, w, 3, "F");

    // Header Text
    doc.setTextColor(199, 167, 108); // #C7A76C
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("PABNA UNIVERSITY OF SCIENCE AND TECHNOLOGY", 12, 10);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.text("OFFICIAL ALUMNI CONVOCATION & EVENT ADMIT PASS", 12, 18);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Directorate of Student & Alumni Affairs · Security Clearance Division", 12, 23);

    // Ticket ID badge on header right
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(w - 68, 7, 58, 14, 2, 2, "F");
    doc.setTextColor(122, 23, 55);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("PASS ID: " + (ticket.ticketRef || "PUST-PASS-001"), w - 65, 12.5);
    doc.setTextColor(21, 128, 61);
    doc.text("STATUS: VERIFIED & CONFIRMED", w - 65, 17.5);

    // Content Area Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(10, 34, w - 20, h - 45, 3, 3, "FD");

    // Event Details
    doc.setTextColor(23, 38, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    const safeTitle = (event.title || "PUST University Event").replace(/[^\x00-\x7F]/g, "").trim() || "PUST Event";
    doc.text(safeTitle, 15, 43);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Date & Time: ${event.date || "2026"} | ${event.time || "10:00 AM"}`, 15, 49);
    const safeLoc = (event.location || "PUST Campus").replace(/[^\x00-\x7F]/g, "").trim();
    doc.text(`Venue: ${safeLoc} (${event.city || ""}, ${event.country || "Bangladesh"})`, 15, 54);
    const safeOrg = (event.organizer || "PUST Alumni Network").replace(/[^\x00-\x7F]/g, "").trim();
    doc.text(`Organizer: ${safeOrg}`, 15, 59);

    // Attendee Box
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 64, 125, 44, 2, 2, "FD");

    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("ATTENDEE NAME", 19, 71);
    doc.setTextColor(23, 38, 60);
    doc.setFont("helvetica", "bold");
    const safeName = (ticket.name || "Alumni Attendee").replace(/[^\x00-\x7F]/g, "").trim() || "Alumni Attendee";
    doc.text(safeName, 19, 76);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("DEPARTMENT & BATCH", 19, 83);
    doc.setTextColor(23, 38, 60);
    doc.setFont("helvetica", "bold");
    const safeDept = (ticket.dept || "Engineering").replace(/[^\x00-\x7F]/g, "").trim();
    doc.text(`${safeDept} (Batch: ${ticket.batch || "2026"})`, 19, 88);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("CONTACT & GUESTS", 19, 95);
    doc.setTextColor(23, 38, 60);
    doc.setFont("helvetica", "bold");
    doc.text(`${ticket.phone || "+880 1700-000000"} | ${ticket.guests || 1} Person(s)`, 19, 100);

    // Payment Badge Box
    const isPaid = Boolean(ticket.isPaid);
    doc.setDrawColor(isPaid ? 254 : 187, isPaid ? 202 : 247, isPaid ? 202 : 208);
    doc.setFillColor(isPaid ? 255 : 240, isPaid ? 241 : 253, isPaid ? 242 : 244);
    doc.roundedRect(15, 112, 125, 17, 2, 2, "FD");

    doc.setTextColor(isPaid ? 190 : 21, isPaid ? 18 : 128, isPaid ? 60 : 61);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const payText = isPaid
      ? `PAYMENT STATUS: PAID (${ticket.amountPaid || "BDT 1,000"}) via ${ticket.paymentMethod || "bKash"}`
      : "REGISTRATION: FREE / COMPLIMENTARY ADMISSION PASS";
    doc.text(payText, 19, 119);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    const subText = isPaid
      ? `Transaction ID: ${ticket.trxId || "TRX-VERIFIED"} | Verified & Authorized by PUST Finance`
      : "Authorized by PUST Directorate of Student & Alumni Affairs";
    doc.text(subText, 19, 124);

    // QR Code Area
    const qrX = w - 60;
    const qrY = 48;
    const qrSize = 44;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(qrX, qrY, qrSize, qrSize, 2, 2, "FD");

    // Draw Vector QR
    const cellSize = (qrSize - 4) / 21;
    doc.setFillColor(23, 38, 60);
    const hash = (str) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
      }
      return Math.abs(h);
    };
    const seed = hash(ticket.ticketRef || "PUST-PASS-DEFAULT");

    for (let r = 0; r < 21; r++) {
      for (let c = 0; c < 21; c++) {
        const isFinder =
          (r <= 6 &&
            c <= 6 &&
            (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))) ||
          (r <= 6 &&
            c >= 14 &&
            (r === 0 ||
              r === 6 ||
              c === 14 ||
              c === 20 ||
              (r >= 2 && r <= 4 && c >= 16 && c <= 18))) ||
          (r >= 14 &&
            c <= 6 &&
            (r === 14 ||
              r === 20 ||
              c === 0 ||
              c === 6 ||
              (r >= 16 && r <= 18 && c >= 2 && c <= 4)));
        if (isFinder) {
          doc.rect(qrX + 2 + c * cellSize, qrY + 2 + r * cellSize, cellSize, cellSize, "F");
        } else if (((seed ^ (r * 37 + c * 17)) + r * c) % 3 === 0) {
          doc.rect(qrX + 2 + c * cellSize, qrY + 2 + r * cellSize, cellSize, cellSize, "F");
        }
      }
    }

    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.text("GATE CHECK-IN QR", qrX + 8, qrY + qrSize + 5);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text("Valid with National/Student ID", qrX + 4, qrY + qrSize + 8);

    // Footer notice
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Notice: Official digital admit pass. Please present this pass on phone or printed copy at campus security gate.",
      12,
      h - 4
    );

    doc.save(`PUST_Admit_Pass_${ticket.ticketRef || "ticket"}.pdf`);
    return true;
  } catch (err) {
    console.error("PDF generation error:", err);
    return false;
  }
}

// World Regions & Worldwide Locations List
const WORLD_REGIONS = [
  { id: "All Locations", label: "🌍 All Worldwide Locations (সমগ্র বিশ্ব)" },
  { id: "Bangladesh", label: "🇧🇩 Bangladesh (National & Campus)" },
  { id: "North America", label: "🇺🇸 🇨🇦 North America (USA & Canada)" },
  { id: "Europe", label: "🇬🇧 🇪🇺 Europe (UK, Germany, Sweden)" },
  { id: "Asia-Pacific", label: "🇦🇺 🇯🇵 🇸🇬 Asia-Pacific (Australia, Japan, Singapore)" },
  { id: "Middle East", label: "🇦🇪 🇸🇦 Middle East (UAE, Saudi Arabia, Qatar)" },
  { id: "Virtual", label: "🌐 Virtual / Worldwide Online" },
];

// Helper to auto-detect region and country from location strings
function detectRegionAndCountry(location = "", city = "") {
  const combined = (location + " " + city).toLowerCase();
  if (
    combined.includes("usa") ||
    combined.includes("new york") ||
    combined.includes("silicon valley") ||
    combined.includes("san jose") ||
    combined.includes("dallas") ||
    combined.includes("canada") ||
    combined.includes("toronto") ||
    combined.includes("vancouver")
  ) {
    return {
      region: "North America",
      country: combined.includes("canada") ? "Canada" : "USA",
    };
  }
  if (
    combined.includes("uk") ||
    combined.includes("london") ||
    combined.includes("cambridge") ||
    combined.includes("germany") ||
    combined.includes("munich") ||
    combined.includes("berlin") ||
    combined.includes("sweden") ||
    combined.includes("stockholm") ||
    combined.includes("europe")
  ) {
    return {
      region: "Europe",
      country: combined.includes("germany")
        ? "Germany"
        : combined.includes("sweden")
        ? "Sweden"
        : "United Kingdom",
    };
  }
  if (
    combined.includes("australia") ||
    combined.includes("sydney") ||
    combined.includes("melbourne") ||
    combined.includes("japan") ||
    combined.includes("tokyo") ||
    combined.includes("singapore") ||
    combined.includes("malaysia")
  ) {
    return {
      region: "Asia-Pacific",
      country: combined.includes("australia")
        ? "Australia"
        : combined.includes("japan")
        ? "Japan"
        : combined.includes("singapore")
        ? "Singapore"
        : "Malaysia",
    };
  }
  if (
    combined.includes("uae") ||
    combined.includes("dubai") ||
    combined.includes("saudi") ||
    combined.includes("riyadh") ||
    combined.includes("qatar") ||
    combined.includes("doha") ||
    combined.includes("middle east")
  ) {
    return {
      region: "Middle East",
      country: combined.includes("saudi")
        ? "Saudi Arabia"
        : combined.includes("qatar")
        ? "Qatar"
        : "United Arab Emirates",
    };
  }
  if (
    combined.includes("online") ||
    combined.includes("zoom") ||
    combined.includes("virtual") ||
    combined.includes("webinar")
  ) {
    return { region: "Virtual", country: "Worldwide" };
  }
  return { region: "Bangladesh", country: "Bangladesh" };
}

// Comprehensive Worldwide Curated Events for PUST Community
const curatedEvents = [
  {
    id: 1,
    title: "PUST Alumni Reunion 2026 — Grand Homecoming & Convocation Gala",
    month: "NOV",
    day: "15",
    year: "2026",
    date: "Nov 15, 2026",
    time: "10:00 AM – 6:00 PM",
    location: "PUST Main Auditorium, Central Campus",
    city: "Pabna",
    country: "Bangladesh",
    region: "Bangladesh",
    type: "Reunion",
    online: false,
    spots: 600,
    registered: 314,
    isPaid: true,
    fee: 1000,
    currency: "BDT",
    img: qa,
    desc: "Annual grand homecoming bringing together all PUST alumni batches across Bangladesh and overseas with formal dinner, souvenir, and cultural night.",
    organizer: "PUST Alumni Association & Directorate",
    tags: ["Reunion", "Alumni", "Gala", "Homecoming"],
  },
  {
    id: 2,
    title: "Tech Career Fair 2026 — 40+ Hiring Partners",
    month: "OCT",
    day: "20",
    year: "2026",
    date: "Oct 20, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "CSE Building, PUST Campus",
    city: "Pabna",
    country: "Bangladesh",
    region: "Bangladesh",
    type: "Career",
    online: false,
    spots: 800,
    registered: 620,
    isPaid: false,
    fee: 0,
    currency: "BDT",
    img: Ba,
    desc: "Meet leading software companies, telecommunications, and engineering firms actively hiring PUST graduates and students.",
    organizer: "Department of CSE & Career Club",
    tags: ["Career", "Jobs", "Interviews", "Tech"],
  },
  {
    id: 3,
    title: "PUST Alumni North America Annual Gala & Dinner 2026",
    month: "NOV",
    day: "28",
    year: "2026",
    date: "Nov 28, 2026",
    time: "6:00 PM – 10:30 PM EST",
    location: "Manhattan Conference Center, New York, NY",
    city: "New York",
    country: "USA",
    region: "North America",
    type: "Reunion",
    online: false,
    spots: 180,
    registered: 142,
    isPaid: true,
    fee: 2500,
    currency: "BDT",
    img: Ja,
    desc: "Annual gathering of PUST alumni living across the United States and Canada featuring executive guest speakers, networking buffet, and diaspora awards.",
    organizer: "PUST Alumni Association of North America",
    tags: ["USA", "North America", "Alumni", "Diaspora"],
  },
  {
    id: 4,
    title: "Global Alumni Webinar — AI in Bangladesh & Worldwide Tech",
    month: "OCT",
    day: "05",
    year: "2026",
    date: "Oct 5, 2026",
    time: "3:00 PM BST / 9:00 AM GMT",
    location: "Worldwide Virtual (Zoom & YouTube Live)",
    city: "Global Virtual",
    country: "Worldwide",
    region: "Virtual",
    type: "Webinar",
    online: true,
    spots: 2000,
    registered: 847,
    isPaid: false,
    fee: 0,
    currency: "BDT",
    img: za,
    desc: "Distinguished PUST alumni researchers from Google, Meta, and top European universities share breakthrough insights on generative AI and engineering.",
    organizer: "Alumni Tech & Research Network",
    tags: ["AI", "Research", "Virtual", "Global"],
  },
  {
    id: 5,
    title: "PUST Europe Chapter Innovation & Academic Meetup",
    month: "DEC",
    day: "06",
    year: "2026",
    date: "Dec 6, 2026",
    time: "2:00 PM – 7:00 PM GMT",
    location: "Canary Wharf Networking Hub, London",
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    type: "Career",
    online: false,
    spots: 120,
    registered: 88,
    isPaid: false,
    fee: 0,
    currency: "BDT",
    img: Xa,
    desc: "Connecting PUST graduates, researchers, and PhD scholars across the UK, Germany, and Scandinavia for European career and research synergy.",
    organizer: "PUST Europe Alumni Chapter",
    tags: ["Europe", "UK", "Research", "Networking"],
  },
  {
    id: 6,
    title: "PUST Middle East Chapter Dinner & Networking 2026",
    month: "DEC",
    day: "18",
    year: "2026",
    date: "Dec 18, 2026",
    time: "7:00 PM – 11:00 PM GST",
    location: "World Trade Centre Ballroom, Dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    type: "Reunion",
    online: false,
    spots: 200,
    registered: 165,
    isPaid: true,
    fee: 1500,
    currency: "BDT",
    img: Qa,
    desc: "Grand gala dinner and family gathering for PUST engineering, construction, and IT professionals working in UAE, Saudi Arabia, and Qatar.",
    organizer: "PUST Middle East Alumni Forum",
    tags: ["Middle East", "Dubai", "UAE", "Alumni Dinner"],
  },
  {
    id: 7,
    title: "Asia-Pacific Alumni Tech Colloquium & Dinner",
    month: "NOV",
    day: "30",
    year: "2026",
    date: "Nov 30, 2026",
    time: "4:00 PM – 9:00 PM JST",
    location: "Shinjuku International Hall, Tokyo",
    city: "Tokyo",
    country: "Japan",
    region: "Asia-Pacific",
    type: "Career",
    online: false,
    spots: 100,
    registered: 74,
    isPaid: false,
    fee: 0,
    currency: "BDT",
    img: Wa,
    desc: "Scholarly and industry meetup for PUST alumni in Japan, Singapore, and Australia focusing on robotics, semiconductors, and green energy.",
    organizer: "PUST Asia-Pacific Alumni Cell",
    tags: ["Japan", "Asia-Pacific", "Tech", "Robotics"],
  },
  {
    id: 8,
    title: "3rd PUST National Convocation Preparatory Assembly",
    month: "NOV",
    day: "22",
    year: "2026",
    date: "Nov 22, 2026",
    time: "11:00 AM – 3:00 PM",
    location: "PUST Central Gymnasium & Ground",
    city: "Pabna",
    country: "Bangladesh",
    region: "Bangladesh",
    type: "Reunion",
    online: false,
    spots: 1500,
    registered: 1140,
    isPaid: true,
    fee: 800,
    currency: "BDT",
    img: La,
    desc: "Official orientation, gown kit distribution, photo pass issuance, and rehearsal for graduating batches and degree recipients.",
    organizer: "PUST Convocation Steering Committee",
    tags: ["Convocation", "Graduates", "Gown", "Ceremony"],
  },
  {
    id: 9,
    title: "Freshers' Reception 2026 — Welcome Batch",
    month: "SEP",
    day: "28",
    year: "2026",
    date: "Sep 28, 2026",
    time: "10:00 AM – 2:00 PM",
    location: "PUST Central Ground",
    city: "Pabna",
    country: "Bangladesh",
    region: "Bangladesh",
    type: "Campus",
    online: false,
    spots: 1200,
    registered: 980,
    isPaid: false,
    fee: 0,
    currency: "BDT",
    img: Ha,
    desc: "Grand institutional welcome ceremony for PUST's newest batch of undergraduate students with departmental orientations.",
    organizer: "PUST Students' Union & Faculty",
    tags: ["Campus Life", "Students", "Orientation"],
  },
  {
    id: 10,
    title: "Alumni Award Ceremony 2026",
    month: "OCT",
    day: "12",
    year: "2026",
    date: "Oct 12, 2026",
    time: "6:00 PM – 9:00 PM",
    location: "PUST Auditorium",
    city: "Pabna",
    country: "Bangladesh",
    region: "Bangladesh",
    type: "Reunion",
    online: false,
    spots: 400,
    registered: 310,
    isPaid: true,
    fee: 500,
    currency: "BDT",
    img: La,
    desc: "Honoring distinguished PUST alumni across academia, technology, public administration, and entrepreneurship with annual awards.",
    organizer: "PUST Alumni Association",
    tags: ["Awards", "Alumni", "Gala"],
  },
  {
    id: 11,
    title: "Faculty Training Workshop — Pedagogy 2026",
    month: "OCT",
    day: "18",
    year: "2026",
    date: "Oct 18, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Faculty Development Center",
    city: "Pabna",
    country: "Bangladesh",
    region: "Bangladesh",
    type: "Faculty",
    online: false,
    spots: 80,
    registered: 72,
    isPaid: false,
    fee: 0,
    currency: "BDT",
    img: za,
    desc: "Advanced training for PUST faculty members covering interactive learning environments, modern research, and instructional design.",
    organizer: "PUST Institutional Quality Assurance Cell (IQAC)",
    tags: ["Faculty", "Research", "Pedagogy"],
  },
  {
    id: 12,
    title: "Inter-University Tech Contest & Hackathon",
    month: "NOV",
    day: "08",
    year: "2026",
    date: "Nov 8, 2026",
    time: "8:00 AM – 6:00 PM",
    location: "CSE Department Labs & Auditoria",
    city: "Pabna",
    country: "Bangladesh",
    region: "Bangladesh",
    type: "Career",
    online: false,
    spots: 350,
    registered: 265,
    isPaid: false,
    fee: 0,
    currency: "BDT",
    img: Ba,
    desc: "Annual engineering and software contest open to all PUST students and alumni developers with prizes from top tech sponsors.",
    organizer: "PUST CSE Society",
    tags: ["Tech", "Students", "Competition", "Software"],
  },
];

const MONTH_MAP = {
  Jan: "JAN",
  Feb: "FEB",
  Mar: "MAR",
  Apr: "APR",
  May: "MAY",
  Jun: "JUN",
  Jul: "JUL",
  Aug: "AUG",
  Sep: "SEP",
  Oct: "OCT",
  Nov: "NOV",
  Dec: "DEC",
};

function normalizeEvent(event) {
  if (!event) return null;
  const rawDate = event.date || "Nov 15, 2026";
  const parts = rawDate.split(" ");
  const monthKey = parts[0] || "Nov";
  const month = event.month || MONTH_MAP[monthKey] || monthKey.toUpperCase() || "NOV";
  const day = event.day || parts[1]?.replace(",", "") || "15";
  const year = event.year || parts[2] || "2026";

  const { region, country } = detectRegionAndCountry(event.location, event.city);
  const fee = Number(event.fee) || 0;
  const isPaid = Boolean(event.isPaid || fee > 0);

  return {
    ...event,
    id: Number(event.id) || event.id || Math.floor(Math.random() * 100000),
    title: event.title || "PUST University Event",
    month,
    day,
    year,
    date: rawDate,
    time: event.time || "10:00 AM – 1:00 PM",
    location: event.location || "PUST Campus, Pabna",
    city: event.city || "Pabna",
    country: event.country || country || "Bangladesh",
    region: event.region || region || "Bangladesh",
    type: event.type || "Reunion",
    online: Boolean(event.online),
    spots: Number(event.spots) || 300,
    registered: Number(event.registered) || 0,
    isPaid,
    fee,
    currency: event.currency || "BDT",
    img: event.img || qa,
    desc:
      event.desc ||
      "Join students, faculty, and alumni in this official university event connecting the global PUST community.",
    organizer: event.organizer || "PUST Alumni Network",
    tags: Array.isArray(event.tags) && event.tags.length > 0 ? event.tags : [event.type || "Event"],
  };
}

// Generate calendar links
function getGoogleCalendarUrl(event) {
  if (!event) return "#";
  const title = encodeURIComponent(event.title || "PUST Alumni Event");
  const details = encodeURIComponent(
    `${event.desc || ""}\n\nOrganizer: ${event.organizer || "PUST Alumni Network"}\nLocation: ${
      event.location || "PUST Campus, Pabna"
    }\nPortal: https://somaborton.pust.ac.bd`
  );
  const location = encodeURIComponent(event.location || "PUST Campus, Pabna, Bangladesh");
  const startStr = "20261115T040000Z";
  const endStr = "20261115T120000Z";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startStr}/${endStr}`;
}

function downloadIcsCalendar(event) {
  if (!event) return;
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PUST Alumni Directorate//Somaborton PUST//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${event.title || "PUST Alumni Event"}`,
    `DESCRIPTION:${(event.desc || "").replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location || "PUST Campus, Pabna, Bangladesh"}`,
    `ORGANIZER;CN=${event.organizer || "PUST Alumni Association"}:mailto:alumni@pust.ac.bd`,
    "DTSTART:20261115T040000Z",
    "DTEND:20261115T120000Z",
    `UID:pust-event-${event.id}-${Date.now()}@pust.ac.bd`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `${(event.title || "pust_event").toLowerCase().replace(/[^a-z0-9]/g, "_")}.ics`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const FORMAT_OPTIONS = ["All Formats", "In-Person", "Virtual"];
const CATEGORY_OPTIONS = [
  "All Categories",
  "Reunion",
  "Career",
  "Webinar",
  "Mentorship",
  "Campus",
  "Faculty",
];
const PRICING_OPTIONS = ["All Pricing", "Free Events", "Paid Events"];
const DATE_OPTIONS = ["All Dates", "Next 7 Days", "Next 30 Days", "Next 60 Days"];

export default function Events() {
  useBackendSync();
  usePageMeta(
    "Events & Reunions — PUST Alumni Directorate",
    "Discover upcoming PUST reunions, convocation assemblies, career fairs, faculty workshops, and student networking events worldwide."
  );

  const location = useLocation();

  const getInitialSearchQuery = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(location.search || window.location.search);
    return params.get("search") || params.get("q") || "";
  };

  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery);
  const [selectedFormat, setSelectedFormat] = useState("All Formats");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedPricing, setSelectedPricing] = useState("All Pricing");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [activeTab, setActiveTab] = useState("All");

  // Expandable filter accordions in desktop sidebar
  const [isLocationOpen, setIsLocationOpen] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isFormatOpen, setIsFormatOpen] = useState(false);

  // Live Backend & Curated Events State
  const [rawEvents, setRawEvents] = useState(() => {
    const combined = [
      ...curatedEvents,
      ...initialEvents.filter((ev) => !curatedEvents.some((c) => c.id === ev.id)),
    ];
    return combined.map(normalizeEvent).filter(Boolean);
  });

  // Persistent Registered Event IDs from localStorage (synced with Dashboard Overview)
  const [registeredEventIds, setRegisteredEventIds] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_registered_events");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return new Set(parsed.map(Number));
      }
      return new Set([1]);
    } catch {
      return new Set([1]);
    }
  });

  // Bookmarked / Saved Events
  const [savedEventIds, setSavedEventIds] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_saved_events");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return new Set(parsed.map(Number));
      }
      return new Set([2]);
    } catch {
      return new Set([2]);
    }
  });

  // Persistent Tickets Map
  const [ticketsMap, setTicketsMap] = useState(() => {
    try {
      const stored = localStorage.getItem("pust_event_tickets");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") return parsed;
      }
      return {
        1: {
          ticketRef: "PUST-PASS-2026-REUNION-0824",
          name: "Engr. Tanvir Ahmed",
          dept: "Computer Science & Engineering",
          batch: "2012 (4th Batch)",
          email: "tanvir.pust08@gmail.com",
          phone: "+880 1711-234567",
          guests: "2",
          isPaid: true,
          amountPaid: "৳2,000",
          paymentMethod: "bKash",
          trxId: "TRX-8291410",
          registeredAt: "2026-03-15T10:30:00.000Z",
          seatTier: "Alumni VIP Section A",
          qrDigest: "PUST-EV-1-TKT-2026-AUTH-VERIFIED",
        },
      };
    } catch {
      return {};
    }
  });

  // Modals state
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [currentTicketRef, setCurrentTicketRef] = useState("");

  // Detailed Itinerary & Speakers Modal
  const [detailsEvent, setDetailsEvent] = useState(null);
  const [detailsTab, setDetailsTab] = useState("overview");

  // Digital Admit Pass Modal
  const [admitPassEvent, setAdmitPassEvent] = useState(null);

  // Propose Event Modal
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [hostSuccessMessage, setHostSuccessMessage] = useState("");

  // Live Toast Notification
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  // Live Countdown to Flagship Reunion (Nov 15, 2026)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-11-15T09:00:00+06:00").getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const distance = Math.max(0, targetDate - now);
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Campus Tour Video State
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (videoRef.current) {
        videoRef.current.muted = nextMuted;
        if (!nextMuted) {
          videoRef.current.volume = 1.0;
          videoRef.current.play().catch(() => {});
        }
      }
      return nextMuted;
    });
  };

  // Registration Form Fields with Payment support
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    dept: "",
    batch: "",
    phone: "",
    guests: "1",
    paymentMethod: "bKash",
    senderNumber: "",
    trxId: "",
    notes: "",
  });

  // Host Event Form Fields with Worldwide Location & Pricing support
  const [hostForm, setHostForm] = useState({
    title: "",
    category: "Reunion",
    format: "In-Person",
    region: "Bangladesh",
    country: "Bangladesh",
    city: "Pabna",
    location: "PUST Central Campus",
    isPaid: false,
    fee: 0,
    date: "",
    time: "",
    spots: 200,
    organizer: "",
    desc: "",
  });

  // Prefill logged-in user details if available
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setRegForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        dept: user.dept || prev.dept,
        batch: user.batch ? String(user.batch) : prev.batch,
        phone: user.phone || prev.phone,
      }));
    }
  }, []);

  // Fetch live events from Backend on Mount
  useEffect(() => {
    let isMounted = true;
    api
      .getEvents()
      .then((res) => {
        if (!isMounted) return;
        const fetched = res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(fetched) && fetched.length > 0) {
          setRawEvents((prev) => {
            const normalizedFetched = fetched.map(normalizeEvent).filter(Boolean);
            const map = new Map();
            prev.forEach((ev) => map.set(ev.id, ev));
            normalizedFetched.forEach((ev) => map.set(ev.id, ev));
            return Array.from(map.values());
          });
        }
      })
      .catch((err) => {
        console.warn("Using local curated events:", err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for storage sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "pust_registered_events" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setRegisteredEventIds(new Set(parsed.map(Number)));
        } catch {}
      }
      if (e.key === "pust_saved_events" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setSavedEventIds(new Set(parsed.map(Number)));
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Sync URL search params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || params.get("q");
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
    }
  }, [location.search]);

  // Listen to custom cross-component search events
  useEffect(() => {
    const handleCustom = (evt) => {
      if (evt.detail !== undefined) setSearchQuery(evt.detail);
    };
    window.addEventListener("pust-search-query", handleCustom);
    return () => window.removeEventListener("pust-search-query", handleCustom);
  }, []);

  // Helpers to persist state
  const persistRegisteredEvents = (nextSet) => {
    setRegisteredEventIds(nextSet);
    const arr = Array.from(nextSet);
    try {
      localStorage.setItem("pust_registered_events", JSON.stringify(arr));
      window.dispatchEvent(
        new CustomEvent("pust-data-synced", { detail: { type: "events", count: arr.length } })
      );
    } catch {}
  };

  const persistSavedEvents = (nextSet) => {
    setSavedEventIds(nextSet);
    try {
      localStorage.setItem("pust_saved_events", JSON.stringify(Array.from(nextSet)));
    } catch {}
  };

  const persistTicketsMap = (nextMap) => {
    setTicketsMap(nextMap);
    try {
      localStorage.setItem("pust_event_tickets", JSON.stringify(nextMap));
    } catch {}
  };

  // Filter events by Search, Category, Location, Pricing, Format, and Tabs
  const filteredEvents = useMemo(() => {
    return rawEvents.filter((ev) => {
      // 1. Quick Tabs Filter
      if (activeTab === "MyPasses" && !registeredEventIds.has(ev.id)) return false;
      if (activeTab === "Saved" && !savedEventIds.has(ev.id)) return false;
      if (activeTab === "Free" && ev.isPaid) return false;
      if (activeTab === "Paid" && !ev.isPaid) return false;
      if (activeTab === "Reunion" && ev.type !== "Reunion") return false;
      if (activeTab === "Career" && ev.type !== "Career") return false;
      if (activeTab === "Global" && ev.region === "Bangladesh" && !ev.online) return false;

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (ev.title || "").toLowerCase().includes(q);
        const matchDesc = (ev.desc || "").toLowerCase().includes(q);
        const matchLoc = (ev.location || "").toLowerCase().includes(q);
        const matchCity = (ev.city || "").toLowerCase().includes(q);
        const matchCountry = (ev.country || "").toLowerCase().includes(q);
        const matchType = (ev.type || "").toLowerCase().includes(q);
        const matchOrg = (ev.organizer || "").toLowerCase().includes(q);
        const matchTags =
          Array.isArray(ev.tags) && ev.tags.some((tag) => tag.toLowerCase().includes(q));
        if (
          !matchTitle &&
          !matchDesc &&
          !matchLoc &&
          !matchCity &&
          !matchCountry &&
          !matchType &&
          !matchOrg &&
          !matchTags
        ) {
          return false;
        }
      }

      // 3. Location / World Region Filter
      if (selectedLocation !== "All Locations" && ev.region !== selectedLocation) {
        return false;
      }

      // 4. Pricing Filter (Free vs Paid)
      if (selectedPricing === "Free Events" && ev.isPaid) return false;
      if (selectedPricing === "Paid Events" && !ev.isPaid) return false;

      // 5. Format Filter
      if (selectedFormat === "In-Person" && ev.online) return false;
      if (selectedFormat === "Virtual" && !ev.online) return false;

      // 6. Category Filter
      if (selectedCategory !== "All Categories" && ev.type !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [
    rawEvents,
    activeTab,
    registeredEventIds,
    savedEventIds,
    searchQuery,
    selectedLocation,
    selectedPricing,
    selectedFormat,
    selectedCategory,
    selectedDate,
  ]);

  // Flagship spotlight event (PUST Alumni Reunion 2026, id: 1)
  const flagshipEvent = useMemo(() => {
    return rawEvents.find((e) => e.id === 1) || rawEvents[0];
  }, [rawEvents]);

  // Toggle Registration or open pass
  const handleToggleRegistration = (eventId, e) => {
    if (e) e.stopPropagation();
    const ev = rawEvents.find((item) => item.id === eventId);
    if (!ev) return;

    const isCurrentlyRegistered = registeredEventIds.has(eventId);

    if (isCurrentlyRegistered) {
      // Cancel registration
      api.registerEvent(eventId, { action: "cancel", unregister: true }).catch(() => {});
      const nextSet = new Set(registeredEventIds);
      nextSet.delete(eventId);
      persistRegisteredEvents(nextSet);

      setRawEvents((prev) =>
        prev.map((item) =>
          item.id === eventId ? { ...item, registered: Math.max(0, item.registered - 1) } : item
        )
      );

      const nextTickets = { ...ticketsMap };
      delete nextTickets[eventId];
      persistTicketsMap(nextTickets);

      showToast(`Registration cancelled for "${ev.title}". Seat released.`, "warning");
    } else {
      openRegistrationModal(ev);
    }
  };

  // Toggle Bookmark
  const handleToggleSave = (eventId, e) => {
    if (e) e.stopPropagation();
    const ev = rawEvents.find((item) => item.id === eventId);
    const nextSet = new Set(savedEventIds);
    if (nextSet.has(eventId)) {
      nextSet.delete(eventId);
      persistSavedEvents(nextSet);
      showToast(`Removed "${ev?.title || "Event"}" from saved bookmarks.`, "info");
    } else {
      nextSet.add(eventId);
      persistSavedEvents(nextSet);
      showToast(`★ Saved "${ev?.title || "Event"}" to your bookmarks.`, "success");
    }
  };

  // Share Event Link
  const handleShare = (event, e) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/events?search=${encodeURIComponent(event.title)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("Event link copied to clipboard!", "success");
      });
    } else {
      showToast("Event link: " + shareUrl, "info");
    }
  };

  // Open registration modal
  const openRegistrationModal = (event, e) => {
    if (e) e.stopPropagation();
    setSelectedEventForModal(event);
    setIsRegistrationSuccess(false);
    setIsRegisterModalOpen(true);
  };

  // Open Admit Pass Modal directly
  const openAdmitPassModal = (event, e) => {
    if (e) e.stopPropagation();
    setAdmitPassEvent(event);
  };

  // Submit registration form with Paid/Free branching
  const handleFormSubmitRegistration = (e) => {
    e.preventDefault();
    if (!selectedEventForModal) return;

    const eventId = selectedEventForModal.id;
    const isPaid = selectedEventForModal.isPaid;
    const guestsCount = Number(regForm.guests) || 1;
    const totalAmount = isPaid ? selectedEventForModal.fee * guestsCount : 0;

    api.registerEvent(eventId, { ...regForm, totalAmount, isPaid }).catch(() => {});

    // Update Set
    const nextSet = new Set(registeredEventIds).add(eventId);
    persistRegisteredEvents(nextSet);

    // Increment count
    setRawEvents((prev) =>
      prev.map((item) =>
        item.id === eventId ? { ...item, registered: item.registered + 1 } : item
      )
    );

    // Generate ticket reference
    const refCode = `PUST-PASS-2026-${eventId}-${Math.floor(1000 + Math.random() * 9000)}`;
    setCurrentTicketRef(refCode);

    // Save ticket metadata
    const nextTickets = {
      ...ticketsMap,
      [eventId]: {
        ticketRef: refCode,
        name: regForm.name || "Alumni Attendee",
        email: regForm.email || "alumni@pust.ac.bd",
        phone: regForm.phone || "+880 1700-000000",
        dept: regForm.dept || "PUST Alumni",
        batch: regForm.batch || "2026",
        guests: String(guestsCount),
        isPaid,
        amountPaid: isPaid ? `৳${totalAmount.toLocaleString()} BDT` : "FREE",
        paymentMethod: isPaid ? regForm.paymentMethod : "Complimentary",
        trxId: isPaid ? regForm.trxId || `TRX-${Math.floor(100000 + Math.random() * 900000)}` : "FREE-PASS",
        registeredAt: new Date().toISOString(),
        seatTier: selectedEventForModal.type === "Reunion" ? "Alumni VIP Section" : "General Admittance",
        qrDigest: `${refCode}-VERIFIED-PUST-DIR`,
      },
    };
    persistTicketsMap(nextTickets);

    setIsRegistrationSuccess(true);
    showToast(
      isPaid
        ? `🎉 Payment & Registration Confirmed! Pass #${refCode} issued.`
        : `🎉 Free Registration Confirmed! Pass #${refCode} issued.`,
      "success"
    );
  };

  // Submit host event proposal
  const handleHostEventSubmit = async (e) => {
    e.preventDefault();
    if (!hostForm.title.trim()) return;

    const newEventPayload = {
      ...hostForm,
      id: Date.now(),
      spots: Number(hostForm.spots) || 200,
      fee: hostForm.isPaid ? Number(hostForm.fee) || 500 : 0,
      registered: 1,
      online: hostForm.format === "Virtual",
      tags: [hostForm.category, hostForm.country || "Alumni Chapter"],
      img: qa,
    };

    try {
      await api.createEvent(newEventPayload);
    } catch {}

    const normalizedNew = normalizeEvent(newEventPayload);
    setRawEvents((prev) => [normalizedNew, ...prev]);

    setHostSuccessMessage(
      "Your event proposal has been registered and submitted to the PUST Alumni Directorate for review."
    );
    showToast("Event proposal submitted successfully for administrator approval!", "success");

    setTimeout(() => {
      setIsHostModalOpen(false);
      setHostSuccessMessage("");
      setHostForm({
        title: "",
        category: "Reunion",
        format: "In-Person",
        region: "Bangladesh",
        country: "Bangladesh",
        city: "Pabna",
        location: "PUST Central Campus",
        isPaid: false,
        fee: 0,
        date: "",
        time: "",
        spots: 200,
        organizer: "",
        desc: "",
      });
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#475569]">
      {/* Print stylesheet to ensure only admit pass is printed */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #pust-printable-admit-card, #pust-printable-admit-card * {
            visibility: visible !important;
          }
          #pust-printable-admit-card {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            border: 2px solid #000 !important;
            background: white !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. INSTITUTIONAL HERO SECTION WITH VIDEO BACKGROUND */}
      <section
        className="relative overflow-hidden bg-[#0D1522] text-white flex flex-col justify-between pt-6 sm:pt-10 pb-6 sm:pb-8 border-b border-[#0F1A2A]"
        style={{ minHeight: "calc(100vh - 84px)" }}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover"
            style={{ filter: "brightness(0.85) contrast(1.08)" }}
            aria-hidden="true"
          >
            <source src="/assets/videos/pust_tour_youtube.mp4" type="video/mp4" />
            <source src="/assets/videos/pust_campus_tour_experience.mp4" type="video/mp4" />
            <source src="/assets/videos/pust_alumni_campus_short.mp4" type="video/mp4" />
          </video>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(13, 21, 34, 0.85) 0%, rgba(13, 21, 34, 0.50) 45%, rgba(13, 21, 34, 0.96) 100%)",
            }}
          />
        </div>

        {/* Top Video Indicator & Controls */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 mb-4 w-full flex items-center justify-between pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-white text-[11px] sm:text-xs font-semibold bg-[#17263C]/80 border border-white/15 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="font-bengali font-medium">🎥 PUST ক্যাম্পাস ট্যুর ও গ্লোবাল ইভেন্ট লাইভ ব্যাকগ্রাউন্ড</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsYouTubeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white bg-[#7A1737] hover:bg-[#60122B] border border-white/20 backdrop-blur-md transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <span className="font-bengali font-medium">▶ YouTube প্লেয়ারে দেখুন</span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute event video sound" : "Mute event video sound"}
              className="px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-white bg-[#17263C]/80 hover:bg-[#17263C] border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <span className="font-bengali font-medium">{isMuted ? "🔇 সাউন্ড অফ" : "🔊 সাউন্ড অন"}</span>
            </button>
          </div>
        </div>

        {/* Center Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center my-auto py-6 sm:py-10 reveal-up">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3 text-[#C7A76C]">
            <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span>{" "}
            · Worldwide Alumni Network · Global Events & Convocation
          </p>
          <h1
            className="font-display font-bold !text-white text-white mb-4 tracking-tight"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              lineHeight: 1.15,
              color: "#FFFFFF",
            }}
          >
            Events, Reunions & Global Chapters
          </h1>
          <p
            className="text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#E2E8F0" }}
          >
            Explore PUST alumni gatherings from the Pabna campus to North America, Europe, Asia-Pacific,
            and Middle East chapters. Register for free or paid passes and download your official PDF
            admit card instantly.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              document.getElementById("events-directory")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full max-w-2xl mx-auto flex items-center bg-white p-2 rounded-xl shadow-xl border border-[#E2E8F0] focus-within:border-[#7A1737] focus-within:ring-2 focus-within:ring-[#7A1737]/20 gap-2 transition-all reveal-up delay-100"
          >
            <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] text-[#17263C] flex items-center justify-center font-bold text-base flex-shrink-0 border border-[#E2E8F0]">
              🌍
            </div>
            <input
              type="text"
              placeholder="Search by event title, country, city, chapter, or organizer…"
              aria-label="Search university events"
              value={searchQuery}
              onChange={(ev) => setSearchQuery(ev.target.value)}
              className="flex-1 px-2 py-2 text-sm sm:text-base text-[#17263C] outline-none bg-transparent font-normal placeholder-[#94A3B8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="w-7 h-7 my-auto rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#17263C] flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="btn-maroon px-6 py-2.5 text-xs sm:text-sm font-semibold flex-shrink-0 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
              style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
            >
              <span>Search</span>
            </button>
          </form>

          {searchQuery && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#E2E8F0]">
              <span>
                Found <strong className="text-white">{filteredEvents.length}</strong> events matching{" "}
                <strong className="text-white">"{searchQuery}"</strong>
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="underline hover:text-white font-medium text-[#C7A76C] ml-1 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* Quick Hero Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 reveal-up delay-200">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("events-directory");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors cursor-pointer backdrop-blur-sm"
            >
              Browse Global Events ({rawEvents.length}) ↓
            </button>

            {registeredEventIds.size > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("MyPasses");
                  const el = document.getElementById("events-directory");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-5 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
              >
                <span>🎫 My Passes ({registeredEventIds.size})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsHostModalOpen(true)}
              className="px-5 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
              style={{ backgroundColor: "#C7A76C", color: "#17263C" }}
            >
              + Host Worldwide Event
            </button>
          </div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="relative z-20 w-full text-center mt-4 pointer-events-auto flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("events-directory");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span className="font-bengali font-normal">নিচে স্ক্রোল করে পেইড/ফ্রি ইভেন্ট ও পিডিএফ টিকেট ডাউনলোড করুন</span>
            <span className="animate-bounce font-mono">↓</span>
          </button>
        </div>
      </section>

      {/* 2. FLAGSHIP SPOTLIGHT BANNER WITH LIVE COUNTDOWN TIMER */}
      {flagshipEvent && !searchQuery && activeTab === "All" && (
        <section className="bg-white border-b border-[#E2E8F0] py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 reveal-up">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A1737] border-b-2 border-[#7A1737] pb-1 inline-block">
                  Flagship University Gathering
                </p>
                <h3 className="text-sm font-semibold text-[#17263C] mt-1 font-bengali">
                  পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় বার্ষিক পুনর্মিলনী ও সমাবর্তন সমাবেশ ২০২৬
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Fee: ৳1,000 BDT (Gala Dinner & Souvenir)
                </span>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs"
                  style={{ backgroundColor: "rgba(122, 23, 55, 0.08)", color: "#7A1737" }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#7A1737] animate-pulse" />
                  Official Marquee Event
                </span>
              </div>
            </div>

            <div
              className="section-dark-navy rounded-2xl overflow-hidden border border-[#0F1A2A] shadow-lg grid grid-cols-1 lg:grid-cols-2 text-white"
              style={{ backgroundColor: "#17263C" }}
            >
              {/* Media Block with Countdown */}
              <div className="relative min-h-[280px] lg:min-h-full overflow-hidden reveal-left group">
                <img
                  src={flagshipEvent.img || qa}
                  alt={flagshipEvent.title}
                  className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(23,38,60,0.15) 0%, rgba(23,38,60,0.75) 100%)",
                  }}
                />
                <div
                  className="absolute top-4 left-4 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md"
                  style={{ backgroundColor: "#7A1737" }}
                >
                  ★ Annual Feature 2026
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-[#0D1522]/90 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    <span>Live Countdown to Convocation Reunion</span>
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white/10 rounded-lg p-1.5 border border-white/10">
                      <span className="font-display font-bold text-lg text-white block leading-tight">
                        {countdown.days}
                      </span>
                      <span className="text-[9px] uppercase text-slate-300 font-medium font-bengali">দিন / Days</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-1.5 border border-white/10">
                      <span className="font-display font-bold text-lg text-white block leading-tight">
                        {countdown.hours}
                      </span>
                      <span className="text-[9px] uppercase text-slate-300 font-medium font-bengali">ঘণ্টা / Hrs</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-1.5 border border-white/10">
                      <span className="font-display font-bold text-lg text-white block leading-tight">
                        {countdown.minutes}
                      </span>
                      <span className="text-[9px] uppercase text-slate-300 font-medium font-bengali">মিনিট / Min</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-1.5 border border-white/10">
                      <span className="font-display font-bold text-lg text-white block leading-tight">
                        {countdown.seconds}
                      </span>
                      <span className="text-[9px] uppercase text-slate-300 font-medium font-bengali">সেকেন্ড / Sec</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Block */}
              <div className="p-6 sm:p-8 flex flex-col justify-between reveal-right delay-100">
                <div>
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#C7A76C] border border-white/15">
                      {flagshipEvent.type}
                    </span>
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      <span>📍</span> {flagshipEvent.location}
                    </span>
                    <span className="text-xs text-amber-300 font-bold px-2 py-0.5 rounded bg-white/10">
                      ৳{flagshipEvent.fee} BDT
                    </span>
                  </div>

                  <h2
                    className="font-display font-bold text-xl sm:text-2xl text-white mb-2.5 leading-snug !text-white"
                    style={{ color: "#FFFFFF" }}
                  >
                    {flagshipEvent.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed mb-4">
                    {flagshipEvent.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-2.5 border-y border-white/10 mb-4 text-xs text-slate-200">
                    <div>
                      <p className="text-[10px] uppercase text-[#C7A76C] font-semibold">Date & Time</p>
                      <p className="font-semibold text-white mt-0.5">
                        {flagshipEvent.date} · {flagshipEvent.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-[#C7A76C] font-semibold">Organizer & Region</p>
                      <p className="font-semibold text-white mt-0.5 truncate">
                        {flagshipEvent.organizer} · {flagshipEvent.country}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <div className="flex justify-between text-[11px] mb-1.5 text-slate-300 font-medium">
                      <span>{flagshipEvent.registered} Confirmed Attendees</span>
                      <span>
                        {Math.round((flagshipEvent.registered / (flagshipEvent.spots || 600)) * 100)}% Full
                      </span>
                    </div>
                    <div
                      className="w-full h-2.5 rounded-full overflow-hidden p-0.5 border"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        borderColor: "rgba(255, 255, 255, 0.25)",
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          background: "linear-gradient(90deg, #DECA9E 0%, #C7A76C 100%)",
                          backgroundColor: "#C7A76C",
                          width: `${Math.min(
                            100,
                            Math.round(
                              (flagshipEvent.registered / (flagshipEvent.spots || 600)) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {registeredEventIds.has(flagshipEvent.id) ? (
                      <button
                        type="button"
                        onClick={(e) => openAdmitPassModal(flagshipEvent, e)}
                        className="w-full sm:flex-1 py-3 px-4 text-xs sm:text-sm font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        <span>✓ View Admit Pass & PDF</span>
                        <span className="text-xs">🎫</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => openRegistrationModal(flagshipEvent, e)}
                        className="btn-maroon w-full sm:flex-1 py-3 px-4 text-xs sm:text-sm font-bold text-white rounded-lg transition-all active:scale-95 cursor-pointer shadow-md"
                        style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
                      >
                        Register for Reunion (৳1,000) →
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDetailsEvent(flagshipEvent)}
                      className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Full Itinerary & Agenda
                    </button>

                    <a
                      href={getGoogleCalendarUrl(flagshipEvent)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-3.5 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors cursor-pointer text-center"
                    >
                      📅 Calendar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. MAIN DIRECTORY: FILTER TABS BAR + SIDEBAR + EVENT CARDS */}
      <main
        id="events-directory"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"
      >
        {/* DESKTOP STICKY SIDEBAR FILTERS */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28 reveal-left space-y-4">
          <div className="rounded-xl overflow-hidden bg-white border border-[#E2E8F0] shadow-xs">
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <p className="font-bold text-xs uppercase tracking-wider text-[#17263C]">
                Filter Programs & Locations
              </p>
            </div>

            {/* Worldwide Region Accordion */}
            <div className="border-b border-[#E2E8F0]">
              <button
                type="button"
                aria-expanded={isLocationOpen}
                className="w-full flex items-center justify-between px-5 py-3.5 focus:outline-none cursor-pointer"
                onClick={() => setIsLocationOpen(!isLocationOpen)}
              >
                <span className="font-semibold text-xs uppercase tracking-wider text-[#17263C]">
                  Worldwide Location
                </span>
                <span className="text-[#64748B] text-xs">{isLocationOpen ? "▲" : "▼"}</span>
              </button>
              {isLocationOpen && (
                <div className="px-5 pb-4 space-y-2">
                  {WORLD_REGIONS.map((rOpt) => (
                    <label
                      key={rOpt.id}
                      className="flex items-center gap-2.5 cursor-pointer text-xs"
                      onClick={() => setSelectedLocation(rOpt.id)}
                    >
                      <div
                        className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: selectedLocation === rOpt.id ? "#7A1737" : "#CBD5E1",
                        }}
                      >
                        {selectedLocation === rOpt.id && (
                          <div className="w-2 h-2 rounded-full bg-[#7A1737]" />
                        )}
                      </div>
                      <span
                        className={
                          selectedLocation === rOpt.id
                            ? "font-semibold text-[#17263C]"
                            : "text-[#475569] hover:text-[#17263C]"
                        }
                      >
                        {rOpt.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Free vs Paid Pricing Accordion */}
            <div className="border-b border-[#E2E8F0]">
              <button
                type="button"
                aria-expanded={isPricingOpen}
                className="w-full flex items-center justify-between px-5 py-3.5 focus:outline-none cursor-pointer"
                onClick={() => setIsPricingOpen(!isPricingOpen)}
              >
                <span className="font-semibold text-xs uppercase tracking-wider text-[#17263C]">
                  Pricing / ফি
                </span>
                <span className="text-[#64748B] text-xs">{isPricingOpen ? "▲" : "▼"}</span>
              </button>
              {isPricingOpen && (
                <div className="px-5 pb-4 space-y-2">
                  {PRICING_OPTIONS.map((pOpt) => (
                    <label
                      key={pOpt}
                      className="flex items-center gap-2.5 cursor-pointer text-xs"
                      onClick={() => setSelectedPricing(pOpt)}
                    >
                      <div
                        className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: selectedPricing === pOpt ? "#7A1737" : "#CBD5E1",
                        }}
                      >
                        {selectedPricing === pOpt && (
                          <div className="w-2 h-2 rounded-full bg-[#7A1737]" />
                        )}
                      </div>
                      <span
                        className={
                          selectedPricing === pOpt
                            ? "font-semibold text-[#17263C]"
                            : "text-[#475569] hover:text-[#17263C]"
                        }
                      >
                        {pOpt === "Free Events"
                          ? "🟢 Free Events (ফ্রি)"
                          : pOpt === "Paid Events"
                          ? "💳 Paid Events (ফি প্রযোজ্য)"
                          : pOpt}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Category Accordion */}
            <div className="border-b border-[#E2E8F0]">
              <button
                type="button"
                aria-expanded={isCategoryOpen}
                className="w-full flex items-center justify-between px-5 py-3.5 focus:outline-none cursor-pointer"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <span className="font-semibold text-xs uppercase tracking-wider text-[#17263C]">
                  Category
                </span>
                <span className="text-[#64748B] text-xs">{isCategoryOpen ? "▲" : "▼"}</span>
              </button>
              {isCategoryOpen && (
                <div className="px-5 pb-4 space-y-2">
                  {CATEGORY_OPTIONS.map((cOpt) => (
                    <label
                      key={cOpt}
                      className="flex items-center gap-2.5 cursor-pointer text-xs"
                      onClick={() => setSelectedCategory(cOpt)}
                    >
                      <div
                        className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: selectedCategory === cOpt ? "#7A1737" : "#CBD5E1",
                        }}
                      >
                        {selectedCategory === cOpt && (
                          <div className="w-2 h-2 rounded-full bg-[#7A1737]" />
                        )}
                      </div>
                      <span
                        className={
                          selectedCategory === cOpt
                            ? "font-semibold text-[#17263C]"
                            : "text-[#475569] hover:text-[#17263C]"
                        }
                      >
                        {cOpt}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Format Accordion */}
            <div>
              <button
                type="button"
                aria-expanded={isFormatOpen}
                className="w-full flex items-center justify-between px-5 py-3.5 focus:outline-none cursor-pointer"
                onClick={() => setIsFormatOpen(!isFormatOpen)}
              >
                <span className="font-semibold text-xs uppercase tracking-wider text-[#17263C]">
                  Event Format
                </span>
                <span className="text-[#64748B] text-xs">{isFormatOpen ? "▲" : "▼"}</span>
              </button>
              {isFormatOpen && (
                <div className="px-5 pb-4 space-y-2">
                  {FORMAT_OPTIONS.map((fOpt) => (
                    <label
                      key={fOpt}
                      className="flex items-center gap-2.5 cursor-pointer text-xs"
                      onClick={() => setSelectedFormat(fOpt)}
                    >
                      <div
                        className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: selectedFormat === fOpt ? "#7A1737" : "#CBD5E1",
                        }}
                      >
                        {selectedFormat === fOpt && (
                          <div className="w-2 h-2 rounded-full bg-[#7A1737]" />
                        )}
                      </div>
                      <span
                        className={
                          selectedFormat === fOpt
                            ? "font-semibold text-[#17263C]"
                            : "text-[#475569] hover:text-[#17263C]"
                        }
                      >
                        {fOpt}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reset Filters */}
          <button
            type="button"
            className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors hover:border-[#7A1737] hover:text-[#7A1737] rounded-lg cursor-pointer bg-white border border-[#E2E8F0] text-[#475569] shadow-2xs"
            onClick={() => {
              setSearchQuery("");
              setSelectedLocation("All Locations");
              setSelectedPricing("All Pricing");
              setSelectedFormat("All Formats");
              setSelectedCategory("All Categories");
              setSelectedDate("All Dates");
              setActiveTab("All");
            }}
          >
            Clear All Filters
          </button>

          {/* Host an Event Quick Box */}
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mb-2"
              style={{ backgroundColor: "rgba(122, 23, 55, 0.08)", color: "#7A1737" }}
            >
              📣
            </div>
            <p className="text-xs font-bold text-[#17263C] mb-1">Organizing a Chapter Event?</p>
            <p className="text-[11px] text-[#64748B] leading-relaxed mb-3">
              Alumni chapters worldwide can host free or paid gatherings for the PUST network.
            </p>
            <button
              onClick={() => setIsHostModalOpen(true)}
              className="w-full py-2 text-xs font-semibold rounded bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#17263C] transition-colors cursor-pointer"
            >
              + Propose Event
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT COLUMN */}
        <div className="lg:col-span-3 min-w-0 w-full reveal-right">
          {/* TOP QUICK FILTER TABS BAR */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-[#E2E8F0]">
            {[
              { id: "All", label: "All Programs", count: rawEvents.length },
              { id: "MyPasses", label: "🎫 My Passes", count: registeredEventIds.size },
              { id: "Saved", label: "★ Saved", count: savedEventIds.size },
              { id: "Free", label: "🟢 Free" },
              { id: "Paid", label: "💳 Paid" },
              { id: "Global", label: "🌍 Global Chapters" },
              { id: "Reunion", label: "🎓 Reunions" },
              { id: "Career", label: "💼 Career" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#17263C] text-white shadow-xs"
                      : "bg-white text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Header Bar with Active Filter Pills & Mobile Format Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E2E8F0]">
            <div>
              <p className="font-semibold text-[#17263C] flex items-center gap-2">
                <span className="font-display text-2xl font-bold">{filteredEvents.length}</span>
                <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">
                  {activeTab === "MyPasses"
                    ? "Registered Passes Found"
                    : activeTab === "Saved"
                    ? "Bookmarked Events Found"
                    : "Scheduled Events Found"}
                </span>
              </p>

              {(selectedLocation !== "All Locations" ||
                selectedPricing !== "All Pricing" ||
                selectedCategory !== "All Categories" ||
                selectedFormat !== "All Formats" ||
                activeTab !== "All" ||
                searchQuery) && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-[#64748B] font-medium">Active:</span>

                  {selectedLocation !== "All Locations" && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                      📍 {selectedLocation}
                      <button onClick={() => setSelectedLocation("All Locations")} className="cursor-pointer font-bold">
                        ✕
                      </button>
                    </span>
                  )}

                  {selectedPricing !== "All Pricing" && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                        selectedPricing === "Free Events"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {selectedPricing}
                      <button onClick={() => setSelectedPricing("All Pricing")} className="cursor-pointer font-bold">
                        ✕
                      </button>
                    </span>
                  )}

                  {activeTab !== "All" && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#17263C] text-white flex items-center gap-1">
                      Tab: {activeTab}
                      <button onClick={() => setActiveTab("All")} className="cursor-pointer font-bold">
                        ✕
                      </button>
                    </span>
                  )}

                  {searchQuery && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] flex items-center gap-1 border border-[#E2E8F0]">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery("")} className="cursor-pointer font-bold">
                        ✕
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Format Filter Pills */}
            <div className="flex gap-1 lg:hidden">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedFormat(opt)}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedFormat === opt
                      ? "bg-[#7A1737] text-white shadow-2xs"
                      : "bg-white text-[#475569] border border-[#E2E8F0]"
                  }`}
                  style={selectedFormat === opt ? { backgroundColor: "#7A1737", color: "#FFFFFF" } : {}}
                >
                  {opt.replace("All Formats", "All")}
                </button>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 px-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <p className="text-4xl mb-3 text-[#94A3B8]">
                {activeTab === "MyPasses" ? "🎫" : activeTab === "Saved" ? "★" : "🌍"}
              </p>
              <h3 className="font-display font-semibold text-[#17263C] text-lg mb-1">
                {activeTab === "MyPasses"
                  ? "No Registered Passes Yet"
                  : activeTab === "Saved"
                  ? "No Bookmarked Events"
                  : "No Events Match Your Worldwide Filter"}
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto mb-5 leading-relaxed">
                Try selecting "All Worldwide Locations" or clearing selected categories to see all
                national and international PUST programs.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLocation("All Locations");
                  setSelectedPricing("All Pricing");
                  setSelectedFormat("All Formats");
                  setSelectedCategory("All Categories");
                  setSelectedDate("All Dates");
                  setActiveTab("All");
                }}
                className="btn-maroon px-5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event, idx) => {
                const isRegistered = registeredEventIds.has(event.id);
                const isSaved = savedEventIds.has(event.id);
                const percentFull = Math.min(
                  100,
                  Math.round((event.registered / (event.spots || 100)) * 100)
                );
                const formatLabel = event.online ? "Virtual" : "In-Person";
                const spotsRemaining = Math.max(0, (event.spots || 100) - event.registered);
                const animDir = idx % 2 === 0 ? "reveal-left" : "reveal-right";
                const animDelay = `delay-${Math.min(300, (idx % 4) * 80)}`;

                return (
                  <article
                    key={event.id}
                    className={`p-5 sm:p-6 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#7A1737]/40 hover:shadow-md transition-all duration-300 group ${animDir} ${animDelay}`}
                  >
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      {/* Date Stamp Block */}
                      <div
                        className="flex-shrink-0 text-center rounded-xl p-3 bg-[#F8FAFC] border border-[#E2E8F0] w-full sm:w-auto"
                        style={{ width: "95px", minWidth: "95px" }}
                      >
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#7A1737]">
                          {event.month}
                        </p>
                        <p
                          className="font-display font-bold leading-none text-[#17263C] my-1.5"
                          style={{ fontSize: "1.85rem", color: "#17263C" }}
                        >
                          {event.day}
                        </p>
                        <p className="text-[11px] text-[#64748B] font-medium">{event.year}</p>
                        <div
                          className="mt-2 text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide rounded"
                          style={{
                            backgroundColor: event.online ? "#174A7E" : "#17263C",
                            color: "#FFFFFF",
                          }}
                        >
                          {formatLabel}
                        </div>
                      </div>

                      {/* Main Event Information */}
                      <div className="flex-1 min-w-0">
                        {/* Header bar: category, region, pricing, bookmark & share */}
                        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                              style={{
                                backgroundColor: "rgba(122, 23, 55, 0.08)",
                                color: "#7A1737",
                                border: "1px solid rgba(122, 23, 55, 0.2)",
                              }}
                            >
                              {event.type}
                            </span>

                            {/* Location / Country Tag */}
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                              <span>📍</span> {event.city}, {event.country}
                            </span>

                            {/* Free vs Paid Badge */}
                            {event.isPaid ? (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                                <span>💳</span> ৳{event.fee.toLocaleString()} BDT
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <span>🟢</span> Free Pass
                              </span>
                            )}
                          </div>

                          {/* Quick bookmark & share tools */}
                          <div className="flex items-center gap-1.5 ml-auto">
                            <button
                              type="button"
                              onClick={(e) => handleToggleSave(event.id, e)}
                              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                isSaved
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-white text-slate-400 hover:text-amber-500 border-slate-200"
                              }`}
                              title={isSaved ? "Remove from bookmarks" : "Save event"}
                              aria-label="Bookmark event"
                            >
                              ★
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleShare(event, e)}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#17263C] text-xs transition-colors cursor-pointer"
                              title="Copy event share link"
                              aria-label="Share event"
                            >
                              🔗
                            </button>
                          </div>
                        </div>

                        <h3 className="font-display font-bold text-base sm:text-lg text-[#17263C] mb-2 group-hover:text-[#7A1737] transition-colors leading-snug">
                          {event.title}
                        </h3>

                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3 text-xs text-[#64748B]">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#17263C]">🕒</span> {event.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#17263C]">🏛️</span> {event.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#17263C]">👥</span> {event.organizer}
                          </span>
                        </div>

                        <p className="text-xs leading-relaxed mb-4 text-[#475569]">
                          {event.desc}
                        </p>

                        {/* Progress Bar & Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-[#E2E8F0]">
                          <div className="w-full sm:w-48">
                            <div className="flex justify-between text-[11px] mb-1 text-[#64748B]">
                              <span>{event.registered} registered</span>
                              <span>{percentFull}% full</span>
                            </div>
                            <div
                              className="h-2 rounded-full overflow-hidden p-0.5 border"
                              style={{ backgroundColor: "#F5EEDB", borderColor: "#E5D7B7" }}
                            >
                              <div
                                className="h-full rounded-full transition-all duration-500 shadow-2xs"
                                style={{
                                  width: `${percentFull}%`,
                                  background: "linear-gradient(90deg, #DECA9E 0%, #C7A76C 100%)",
                                  backgroundColor: "#C7A76C",
                                }}
                              />
                            </div>
                            <p className="text-[10px] text-[#64748B] mt-1 font-medium">
                              {spotsRemaining > 0 ? `${spotsRemaining} seats left` : "Full Capacity"}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => setDetailsEvent(event)}
                              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#17263C] transition-colors cursor-pointer"
                            >
                              Schedule & Info
                            </button>

                            {isRegistered ? (
                              <button
                                type="button"
                                onClick={(e) => openAdmitPassModal(event, e)}
                                className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                              >
                                <span>🎫 View Pass & PDF</span>
                              </button>
                            ) : null}

                            <button
                              type="button"
                              onClick={(e) => handleToggleRegistration(event.id, e)}
                              aria-label={
                                isRegistered
                                  ? `Cancel registration for ${event.title}`
                                  : `Register for ${event.title}`
                              }
                              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm ${
                                isRegistered
                                  ? "border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100"
                                  : "btn-maroon"
                              }`}
                              style={
                                !isRegistered
                                  ? { backgroundColor: "#7A1737", color: "#FFFFFF" }
                                  : {}
                              }
                            >
                              {isRegistered
                                ? "✕ Cancel Pass"
                                : event.isPaid
                                ? `Register (৳${event.fee}) →`
                                : "Free Register →"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Event Image Preview */}
                      {event.img && (
                        <div
                          className="hidden md:block flex-shrink-0 overflow-hidden rounded-xl border border-[#E2E8F0] shadow-2xs"
                          style={{ width: "160px", height: "125px" }}
                        >
                          <img
                            src={event.img}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Directory Footer */}
          {filteredEvents.length > 0 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E2E8F0]">
              <span className="text-xs text-[#64748B]">
                Showing <strong>{filteredEvents.length}</strong> of <strong>{rawEvents.length}</strong> total programs
              </span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#CBD5E1] text-[#17263C] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                ↑ Back to Top
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 4. INSTITUTIONAL CALL-TO-ACTION */}
      <section
        className="section-dark-navy relative overflow-hidden mt-12 border-t border-[#0F1A2A]"
        style={{
          backgroundColor: "#17263C",
          minHeight: 220,
        }}
      >
        <img
          src={Ja}
          alt="PUST Event"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-20"
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="reveal-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2 text-[#C7A76C]">
              Global Alumni Chapters & Partnerships
            </p>
            <h2
              className="font-display font-bold text-white text-2xl sm:text-3xl mb-2 !text-white"
              style={{ color: "#FFFFFF" }}
            >
              Host an Event Anywhere in the World
            </h2>
            <p className="text-xs sm:text-sm max-w-md text-[#E2E8F0] leading-relaxed">
              Are you a chapter lead or batch representative in Bangladesh, North America, Europe,
              Asia, or the Middle East? Host official paid or free sessions for the global network.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 reveal-right delay-100">
            <button
              onClick={() => setIsHostModalOpen(true)}
              className="btn-maroon text-xs font-semibold text-white px-6 py-3 rounded-lg text-center transition-all cursor-pointer shadow-sm active:scale-95"
              style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
            >
              + Propose a Chapter Event →
            </button>
            <Link
              to="/about"
              className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg text-center transition-colors cursor-pointer"
            >
              Alumni Guidelines
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. MODALS (OFFICIAL ADMIT PASS WITH PDF, REGISTRATION, SCHEDULE)
         ======================================================== */}

      {/* MODAL 1: OFFICIAL DIGITAL ADMIT PASS (WITH DIRECT PDF DOWNLOAD & PRINT) */}
      {admitPassEvent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setAdmitPassEvent(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#CBD5E1] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Crest & Directorate */}
            <div
              className="p-6 text-white flex items-center justify-between no-print"
              style={{
                background: "linear-gradient(135deg, #17263C 0%, #7A1737 100%)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/15 border border-white/25 flex items-center justify-center font-bold text-lg shadow-sm">
                  🏛️
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C7A76C] block font-bengali">
                    পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় · PUST
                  </span>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white">
                    Official Digital Admit Pass & Entry Ticket
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdmitPassEvent(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors cursor-pointer"
                aria-label="Close admit pass"
              >
                ✕
              </button>
            </div>

            {/* Printable Pass Body */}
            <div id="pust-printable-admit-card" className="p-6 bg-[#F8FAFC]">
              {(() => {
                const ticket = ticketsMap[admitPassEvent.id] || {
                  ticketRef: `PUST-PASS-2026-${admitPassEvent.id}-8491`,
                  name: regForm.name || "Alumni Attendee",
                  dept: regForm.dept || "PUST Alumni",
                  batch: regForm.batch || "2026",
                  email: regForm.email || "alumni@pust.ac.bd",
                  phone: regForm.phone || "+880 1700-000000",
                  guests: "1",
                  isPaid: admitPassEvent.isPaid,
                  amountPaid: admitPassEvent.isPaid ? `৳${admitPassEvent.fee} BDT` : "FREE",
                  paymentMethod: admitPassEvent.isPaid ? "bKash" : "Complimentary",
                  trxId: admitPassEvent.isPaid ? "TRX-8291410" : "FREE-PASS",
                  seatTier: "Confirmed Attendee",
                };

                return (
                  <div className="rounded-xl bg-white border border-[#CBD5E1] p-5 shadow-sm space-y-4">
                    {/* Top status bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                          STATUS: VERIFIED & CONFIRMED
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#7A1737]">
                        PASS ID: {ticket.ticketRef}
                      </span>
                    </div>

                    {/* Event & Pass Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C]">
                            {admitPassEvent.type} · {admitPassEvent.country} · {admitPassEvent.online ? "Online Webcast" : "In-Person Attendance"}
                          </span>
                          <h4 className="font-display font-bold text-lg text-[#17263C] leading-snug">
                            {admitPassEvent.title}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                          <div>
                            <span className="text-[10px] uppercase text-[#64748B] block font-semibold">
                              Date & Time
                            </span>
                            <span className="font-bold text-[#17263C]">
                              {admitPassEvent.date} · {admitPassEvent.time}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-[#64748B] block font-semibold">
                              Venue & City
                            </span>
                            <span className="font-bold text-[#17263C] truncate block">
                              {admitPassEvent.location} ({admitPassEvent.city})
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-[#64748B] block font-semibold">
                              Attendee Name
                            </span>
                            <span className="font-bold text-[#17263C]">{ticket.name}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-[#64748B] block font-semibold">
                              Department & Batch
                            </span>
                            <span className="font-bold text-[#17263C]">
                              {ticket.dept} ({ticket.batch})
                            </span>
                          </div>
                        </div>

                        {/* Payment Verification Status Box */}
                        <div
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                            ticket.isPaid
                              ? "bg-rose-50 border-rose-200 text-rose-800"
                              : "bg-emerald-50 border-emerald-200 text-emerald-800"
                          }`}
                        >
                          <div>
                            <span className="font-bold block">
                              {ticket.isPaid
                                ? `PAYMENT: PAID (${ticket.amountPaid}) via ${ticket.paymentMethod}`
                                : "REGISTRATION: FREE / COMPLIMENTARY PASS"}
                            </span>
                            <span className="text-[10px] opacity-80">
                              {ticket.isPaid
                                ? `Transaction Ref: ${ticket.trxId} · Verified by PUST Finance`
                                : "Official University Courtesy Admission"}
                            </span>
                          </div>
                          <span className="text-base font-bold">{ticket.isPaid ? "✓ Paid" : "🟢 Free"}</span>
                        </div>
                      </div>

                      {/* Right Column: Deterministic SVG QR Code */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                        <TicketQrCode ticketRef={ticket.ticketRef} size={110} />
                        <span className="text-[9px] font-mono uppercase text-[#64748B] mt-1.5 tracking-wider">
                          Scan at Gate
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                          Security Cleared
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons for Admit Pass */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-5 no-print">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Download PDF Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const ticket = ticketsMap[admitPassEvent.id] || {
                        ticketRef: `PUST-PASS-2026-${admitPassEvent.id}-8491`,
                        name: regForm.name || "Alumni Attendee",
                        dept: regForm.dept || "PUST Alumni",
                        batch: regForm.batch || "2026",
                        phone: regForm.phone || "+880 1700-000000",
                        guests: "1",
                        isPaid: admitPassEvent.isPaid,
                        amountPaid: admitPassEvent.isPaid ? `৳${admitPassEvent.fee} BDT` : "FREE",
                        paymentMethod: admitPassEvent.isPaid ? "bKash" : "Complimentary",
                        trxId: admitPassEvent.isPaid ? "TRX-8291410" : "FREE-PASS",
                      };
                      const success = generateEventAdmitPassPdf({ ticket, event: admitPassEvent });
                      if (success) {
                        showToast("📄 Admit Pass PDF downloaded successfully!", "success");
                      }
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-[#7A1737] text-white hover:bg-[#60122B] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span>📥 Download PDF (পিডিএফ)</span>
                  </button>

                  {/* Print Pass Button */}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#17263C] text-white hover:bg-[#0D1522] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>🖨️ Print Pass</span>
                  </button>

                  <a
                    href={getGoogleCalendarUrl(admitPassEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-[#CBD5E1] text-[#17263C] hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>📅 Cal</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadIcsCalendar(admitPassEvent)}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-[#CBD5E1] text-[#17263C] hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>📥 .ICS</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleToggleRegistration(admitPassEvent.id);
                    setAdmitPassEvent(null);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                >
                  Cancel Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAILED EVENT SCHEDULE & ITINERARY */}
      {detailsEvent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setDetailsEvent(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#CBD5E1] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#17263C] text-white p-5 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block">
                  {detailsEvent.type} · {detailsEvent.country} · Event Program Details
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white truncate max-w-md mt-0.5">
                  {detailsEvent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailsEvent(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors cursor-pointer"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 pt-2 gap-4">
              {[
                { id: "overview", label: "Overview & Fee" },
                { id: "agenda", label: "Timeline & Agenda" },
                { id: "speakers", label: "Guests & Speakers" },
                { id: "venue", label: "Directions & Venue" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setDetailsTab(t.id)}
                  className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    detailsTab === t.id
                      ? "border-[#7A1737] text-[#7A1737]"
                      : "border-transparent text-[#64748B] hover:text-[#17263C]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#475569]">
              {detailsTab === "overview" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex-1 space-y-1.5">
                      <p>
                        <strong className="text-[#17263C]">Date:</strong> {detailsEvent.date}
                      </p>
                      <p>
                        <strong className="text-[#17263C]">Time:</strong> {detailsEvent.time}
                      </p>
                      <p>
                        <strong className="text-[#17263C]">Location:</strong> {detailsEvent.location}
                      </p>
                      <p>
                        <strong className="text-[#17263C]">City / Chapter:</strong> {detailsEvent.city},{" "}
                        {detailsEvent.country} ({detailsEvent.region})
                      </p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p>
                        <strong className="text-[#17263C]">Total Seats:</strong> {detailsEvent.spots}
                      </p>
                      <p>
                        <strong className="text-[#17263C]">Confirmed:</strong> {detailsEvent.registered}
                      </p>
                      <p>
                        <strong className="text-[#17263C]">Pricing:</strong>{" "}
                        {detailsEvent.isPaid ? (
                          <span className="font-bold text-rose-700">৳{detailsEvent.fee} BDT (Paid Event)</span>
                        ) : (
                          <span className="font-bold text-emerald-700">Free / Complimentary</span>
                        )}
                      </p>
                      <p>
                        <strong className="text-[#17263C]">Organizer:</strong> {detailsEvent.organizer}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#17263C] text-sm mb-1.5">About This Gathering</h4>
                    <p className="leading-relaxed">{detailsEvent.desc}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#17263C] text-sm mb-1.5">Registration Privileges</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Official PUST Commemorative Souvenir & Digital Pass.</li>
                      <li>
                        {detailsEvent.isPaid
                          ? "Full Buffet Dinner / High Tea, Networking Lounge & Delegate Kit."
                          : "Free entry, networking, and certificate of participation."}
                      </li>
                      <li>Gate 1 VIP Admittance with security barcode clearance.</li>
                    </ul>
                  </div>
                </div>
              )}

              {detailsTab === "agenda" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-[#17263C] text-sm mb-2">Program Timeline & Schedule</h4>
                  {[
                    {
                      time: "09:00 AM – 10:00 AM",
                      title: "Registration, Kit & Pass Check",
                      desc: "Collect commemorative batch folder, event badge, and breakfast refreshments at Central Reception.",
                    },
                    {
                      time: "10:00 AM – 11:30 AM",
                      title: "Inaugural Ceremony & Presidential Address",
                      desc: "Address by the Honorable Vice Chancellor, PUST and welcome speeches by Department Deans.",
                    },
                    {
                      time: "11:30 AM – 01:00 PM",
                      title: "Alumni Panel: Innovations & Impact",
                      desc: "Senior engineering and research alumni share insights on global technology trends and startup ecosystems.",
                    },
                    {
                      time: "01:00 PM – 02:30 PM",
                      title: "Grand Buffet Lunch & Batch Photographs",
                      desc: "Courtyard networking, batch-wise formal photography, and open reunions across departmental lawns.",
                    },
                    {
                      time: "02:30 PM – 04:30 PM",
                      title: "Cultural Showcase & Alumni Memories",
                      desc: "Student musical performances, alumni nostalgia presentations, and interactive open mic.",
                    },
                    {
                      time: "04:30 PM – 05:30 PM",
                      title: "Award Conferment & Closing Valedictory",
                      desc: "Distinguished Alumni Awards, memento presentation, and formal closing by Alumni President.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3.5 p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                    >
                      <span className="font-mono font-bold text-[#7A1737] whitespace-nowrap text-[11px] pt-0.5">
                        {item.time}
                      </span>
                      <div>
                        <p className="font-bold text-[#17263C] text-xs">{item.title}</p>
                        <p className="text-[11px] text-[#64748B] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {detailsTab === "speakers" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-[#17263C] text-sm mb-2">Keynote Dignitaries & Speakers</h4>
                  {[
                    {
                      name: "Prof. Dr. Hafizur Rahman",
                      role: "Vice Chancellor, PUST",
                      bio: "Patron-in-Chief delivering institutional vision for PUST's global academic and alumni presence.",
                    },
                    {
                      name: "Engr. Tanvir Ahmed (Alumni 2012)",
                      role: "Head of Engineering & Global Chapter Envoy",
                      bio: "Distinguished alumni keynote addressing technology entrepreneurship and international pathways.",
                    },
                    {
                      name: "Prof. Dr. Farhana Akter",
                      role: "Dean, Faculty of Engineering & Technology",
                      bio: "Presiding over research excellence awards and graduate mentorship initiatives.",
                    },
                  ].map((speaker, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#17263C] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {speaker.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-[#17263C] text-xs">{speaker.name}</p>
                        <p className="text-[10px] text-[#7A1737] font-semibold">{speaker.role}</p>
                        <p className="text-[11px] text-[#64748B] mt-1">{speaker.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {detailsTab === "venue" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-[#17263C] text-sm mb-2">Venue & Transit Directions</h4>
                  <div className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                    <p>
                      <strong className="text-[#17263C]">Address:</strong> {detailsEvent.location},{" "}
                      {detailsEvent.city}, {detailsEvent.country}
                    </p>
                    <p>
                      <strong className="text-[#17263C]">Designated Entrance:</strong> Gate 1 (Main
                      Archway) for attendees with Admit Pass.
                    </p>
                    <p>
                      <strong className="text-[#17263C]">Parking:</strong> Reserved parking for alumni
                      delegates and guests.
                    </p>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      detailsEvent.location + ", " + detailsEvent.city
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7A1737] text-white font-semibold text-xs transition-colors hover:bg-[#60122B] cursor-pointer shadow-2xs"
                  >
                    <span>📍 Open in Google Maps Directions →</span>
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs text-[#64748B]">
                {detailsEvent.city}, {detailsEvent.country} · {detailsEvent.organizer}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDetailsEvent(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#17263C] cursor-pointer"
                >
                  Close
                </button>
                {registeredEventIds.has(detailsEvent.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDetailsEvent(null);
                      openAdmitPassModal(detailsEvent);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                  >
                    View Admit Pass 🎫
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setDetailsEvent(null);
                      openRegistrationModal(detailsEvent);
                    }}
                    className="btn-maroon px-5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                    style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
                  >
                    {detailsEvent.isPaid ? `Register (৳${detailsEvent.fee}) →` : "Free Register →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REGISTRATION MODAL (FREE VS PAID WITH BKASH / NAGAD / ROCKET / CARD) */}
      {isRegisterModalOpen && selectedEventForModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#17263C] text-white px-6 py-5 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block">
                  {selectedEventForModal.isPaid ? "💳 Paid Event Registration" : "🟢 Complimentary Free Registration"}
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white truncate max-w-xs sm:max-w-md mt-0.5">
                  {selectedEventForModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              {isRegistrationSuccess ? (
                /* Ticket Confirmation Card */
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center text-2xl mx-auto mb-3">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#17263C] mb-1">
                    Registration Confirmed!
                  </h4>
                  <p className="text-xs text-[#64748B] mb-5">
                    Your attendance has been recorded in the PUST Alumni Directorate system.
                  </p>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left mb-6 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Ticket Reference:</span>
                      <span className="font-mono font-bold text-[#7A1737]">{currentTicketRef}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Date & Venue:</span>
                      <span className="font-semibold text-[#17263C]">
                        {selectedEventForModal.date} · {selectedEventForModal.location} ({selectedEventForModal.city})
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[#64748B]">Attendee:</span>
                      <span className="font-semibold text-[#17263C]">
                        {regForm.name || "Alumni Attendee"} ({regForm.guests} Person)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Registration Type:</span>
                      <span
                        className={`font-bold ${
                          selectedEventForModal.isPaid ? "text-rose-700" : "text-emerald-700"
                        }`}
                      >
                        {selectedEventForModal.isPaid
                          ? `PAID (৳${(selectedEventForModal.fee * Number(regForm.guests)).toLocaleString()} BDT)`
                          : "FREE / COMPLIMENTARY"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        const ticket = ticketsMap[selectedEventForModal.id] || {
                          ticketRef: currentTicketRef,
                          name: regForm.name || "Alumni Attendee",
                          dept: regForm.dept || "PUST Alumni",
                          batch: regForm.batch || "2026",
                          phone: regForm.phone || "+880 1700-000000",
                          guests: regForm.guests,
                          isPaid: selectedEventForModal.isPaid,
                          amountPaid: selectedEventForModal.isPaid
                            ? `৳${selectedEventForModal.fee * Number(regForm.guests)} BDT`
                            : "FREE",
                          paymentMethod: selectedEventForModal.isPaid ? regForm.paymentMethod : "Complimentary",
                          trxId: regForm.trxId || "TRX-DEMO",
                        };
                        generateEventAdmitPassPdf({ ticket, event: selectedEventForModal });
                        showToast("📄 PDF downloaded successfully!", "success");
                      }}
                      className="flex-1 py-2.5 text-xs font-bold rounded-lg bg-[#7A1737] text-white hover:bg-[#60122B] transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>📥 Download Admit Pass PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterModalOpen(false);
                        openAdmitPassModal(selectedEventForModal);
                      }}
                      className="flex-1 py-2.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                    >
                      🎫 View Admit Pass
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleFormSubmitRegistration} className="space-y-4">
                  {/* Event summary card */}
                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] space-y-1">
                    <div className="flex justify-between items-center">
                      <p>
                        <strong>Date:</strong> {selectedEventForModal.date} · {selectedEventForModal.time}
                      </p>
                      {selectedEventForModal.isPaid ? (
                        <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          ৳{selectedEventForModal.fee} BDT / Seat
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          🟢 Free Entry
                        </span>
                      )}
                    </div>
                    <p>
                      <strong>Location:</strong> {selectedEventForModal.location} ({selectedEventForModal.city},{" "}
                      {selectedEventForModal.country})
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rafiqul Islam"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alumni@pust.ac.bd"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+880 1700-000000"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CSE, EEE, Civil"
                        value={regForm.dept}
                        onChange={(e) => setRegForm({ ...regForm, dept: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Batch / Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2012 or 4th Batch"
                        value={regForm.batch}
                        onChange={(e) => setRegForm({ ...regForm, batch: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Number of Attendees / Guests
                    </label>
                    <select
                      value={regForm.guests}
                      onChange={(e) => setRegForm({ ...regForm, guests: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C] bg-white"
                    >
                      <option value="1">1 Person (Self only)</option>
                      <option value="2">2 Persons (Self + 1 Guest)</option>
                      <option value="3">3 Persons (Self + 2 Guests)</option>
                      <option value="4">4 Persons (Family Group)</option>
                    </select>
                  </div>

                  {/* PAID EVENT PAYMENT SECTION */}
                  {selectedEventForModal.isPaid ? (
                    <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                        <div>
                          <span className="text-xs font-bold text-rose-900 block">
                            পেমেন্ট তথ্য (Payment Gateway)
                          </span>
                          <span className="text-[11px] text-rose-700">
                            ফি: ৳{selectedEventForModal.fee} × {regForm.guests} জন
                          </span>
                        </div>
                        <span className="font-display font-bold text-base text-[#7A1737]">
                          মোট: ৳{(selectedEventForModal.fee * Number(regForm.guests)).toLocaleString()} BDT
                        </span>
                      </div>

                      {/* Payment Method Selector */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#17263C] mb-1">
                          পেমেন্ট মাধ্যম নির্বাচন করুন (Select Method) *
                        </label>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {[
                            { id: "bKash", label: "📱 বিকাশ (bKash)" },
                            { id: "Nagad", label: "🟠 নগদ (Nagad)" },
                            { id: "Rocket", label: "🚀 রকেট (Rocket)" },
                            { id: "Card", label: "💳 ভিসা / কার্ড" },
                            { id: "Bank", label: "🏛️ ব্যাংক ট্রান্সফার" },
                          ].map((pm) => (
                            <button
                              key={pm.id}
                              type="button"
                              onClick={() => setRegForm({ ...regForm, paymentMethod: pm.id })}
                              className={`py-1.5 px-2 rounded-lg border font-semibold text-[11px] transition-colors cursor-pointer ${
                                regForm.paymentMethod === pm.id
                                  ? "bg-[#7A1737] text-white border-[#7A1737]"
                                  : "bg-white text-[#475569] border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {pm.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Payment Instructions */}
                      <div className="p-2.5 rounded bg-white border border-rose-100 text-[11px] text-[#475569] leading-relaxed">
                        <p className="font-semibold text-rose-900 mb-0.5">
                          {regForm.paymentMethod} পেমেন্ট নির্দেশিকা:
                        </p>
                        <p>
                          অনুগ্রহ করে আপনার {regForm.paymentMethod} অ্যাপ থেকে{" "}
                          <strong className="text-rose-900 font-mono">01711-234567</strong> নম্বরে মোট{" "}
                          <strong>৳{(selectedEventForModal.fee * Number(regForm.guests)).toLocaleString()}</strong> টাকা{" "}
                          Send Money / Payment করুন। রেফারেন্সে লিখুন{" "}
                          <strong className="font-mono">PUST-{selectedEventForModal.id}</strong>।
                        </p>
                      </div>

                      {/* Sender Mobile & TrxID */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#17263C] mb-1">
                            প্রেরক মোবাইল নম্বর *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 017xxxxxxxx"
                            value={regForm.senderNumber}
                            onChange={(e) => setRegForm({ ...regForm, senderNumber: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:border-[#7A1737] outline-none text-[#17263C] bg-white"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[11px] font-semibold text-[#17263C]">
                              ট্রানজেকশন আইডি (TrxID) *
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setRegForm((prev) => ({
                                  ...prev,
                                  senderNumber: prev.senderNumber || "01711-998877",
                                  trxId: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
                                }))
                              }
                              className="text-[10px] text-[#7A1737] hover:underline font-bold cursor-pointer"
                            >
                              ⚡ ডেমো TrxID বসান
                            </button>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="e.g. TRX-9K38AJ29"
                            value={regForm.trxId}
                            onChange={(e) => setRegForm({ ...regForm, trxId: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:border-[#7A1737] outline-none text-[#17263C] bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Free Registration Note */
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <span>🟢</span> ফ্রি ইভেন্ট রেজিস্ট্রেশন (No Payment Required)
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        এই ইভেন্টটি PUST শিক্ষার্থী ও অ্যালামনাইদের জন্য সম্পূর্ণ প্রশংসাসূচক ও ফ্রি।
                        নিবন্ধন নিশ্চিত করলে তাত্ক্ষণিক অ্যাডমিট পাস ও কিউআর কোড পাওয়া যাবে।
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegisterModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#17263C] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-maroon px-6 py-2.5 text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                      style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
                    >
                      {selectedEventForModal.isPaid
                        ? `Complete Payment (৳${(
                            selectedEventForModal.fee * Number(regForm.guests)
                          ).toLocaleString()}) & Issue Pass →`
                        : "Confirm Free Registration & Issue Pass →"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PROPOSE / HOST WORLDWIDE EVENT MODAL */}
      {isHostModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsHostModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#17263C] text-white px-6 py-5 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] block">
                  PUST Directorate of Student & Alumni Affairs
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white mt-0.5">
                  Propose Worldwide / Campus Event
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHostModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {hostSuccessMessage ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center text-2xl mx-auto mb-3">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-base text-[#17263C] mb-2">
                    Proposal Submitted
                  </h4>
                  <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                    {hostSuccessMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleHostEventSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PUST North America Reunion or Batch 2014 Gathering"
                      value={hostForm.title}
                      onChange={(e) => setHostForm({ ...hostForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Category
                      </label>
                      <select
                        value={hostForm.category}
                        onChange={(e) => setHostForm({ ...hostForm, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C] bg-white"
                      >
                        {CATEGORY_OPTIONS.filter((c) => c !== "All Categories").map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Format
                      </label>
                      <select
                        value={hostForm.format}
                        onChange={(e) => setHostForm({ ...hostForm, format: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C] bg-white"
                      >
                        <option value="In-Person">In-Person</option>
                        <option value="Virtual">Virtual / Online</option>
                      </select>
                    </div>
                  </div>

                  {/* Worldwide Location Selection */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <p className="text-[11px] font-bold text-[#17263C]">
                      🌍 ইভেন্টের অবস্থান ও অঞ্চল (Worldwide Location)
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold text-[#64748B] mb-0.5">
                          Region
                        </label>
                        <select
                          value={hostForm.region}
                          onChange={(e) => {
                            const reg = e.target.value;
                            setHostForm({
                              ...hostForm,
                              region: reg,
                              country:
                                reg === "North America"
                                  ? "USA"
                                  : reg === "Europe"
                                  ? "United Kingdom"
                                  : reg === "Asia-Pacific"
                                  ? "Japan"
                                  : reg === "Middle East"
                                  ? "United Arab Emirates"
                                  : reg === "Virtual"
                                  ? "Worldwide"
                                  : "Bangladesh",
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 bg-white text-[#17263C]"
                        >
                          <option value="Bangladesh">Bangladesh (বাংলাদেশ)</option>
                          <option value="North America">North America (USA & Canada)</option>
                          <option value="Europe">Europe (UK, EU)</option>
                          <option value="Asia-Pacific">Asia-Pacific (Australia, Japan)</option>
                          <option value="Middle East">Middle East (UAE, Saudi)</option>
                          <option value="Virtual">Virtual / Online</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#64748B] mb-0.5">
                          City / Chapter
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Pabna, New York, London, Dubai"
                          value={hostForm.city}
                          onChange={(e) => setHostForm({ ...hostForm, city: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white text-[#17263C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#64748B] mb-0.5">
                        Specific Venue / Address
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PUST Central Ground or Manhattan Conference Suite"
                        value={hostForm.location}
                        onChange={(e) => setHostForm({ ...hostForm, location: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white text-[#17263C]"
                      />
                    </div>
                  </div>

                  {/* Free vs Paid Option */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <p className="text-[11px] font-bold text-[#17263C]">
                      🎟️ রেজিস্ট্রেশন ফি (Registration Pricing)
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                        <input
                          type="radio"
                          name="isPaidChoice"
                          checked={!hostForm.isPaid}
                          onChange={() => setHostForm({ ...hostForm, isPaid: false, fee: 0 })}
                        />
                        <span>🟢 Free Event (ফ্রি)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                        <input
                          type="radio"
                          name="isPaidChoice"
                          checked={hostForm.isPaid}
                          onChange={() => setHostForm({ ...hostForm, isPaid: true, fee: 500 })}
                        />
                        <span>💳 Paid Event (পেইড)</span>
                      </label>
                    </div>

                    {hostForm.isPaid && (
                      <div className="pt-1.5">
                        <label className="block text-[11px] font-semibold text-[#17263C] mb-1">
                          ফি পরিমাণ (Fee per attendee in BDT)
                        </label>
                        <input
                          type="number"
                          min="50"
                          placeholder="e.g. 1000"
                          value={hostForm.fee}
                          onChange={(e) => setHostForm({ ...hostForm, fee: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white text-[#17263C]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Date *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dec 20, 2026"
                        value={hostForm.date}
                        onChange={(e) => setHostForm({ ...hostForm, date: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10:00 AM – 3:00 PM"
                        value={hostForm.time}
                        onChange={(e) => setHostForm({ ...hostForm, time: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Organizing Chapter / Dept *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PUST North America Chapter"
                        value={hostForm.organizer}
                        onChange={(e) => setHostForm({ ...hostForm, organizer: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17263C] mb-1">
                        Total Capacity (Seats)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 250"
                        value={hostForm.spots}
                        onChange={(e) => setHostForm({ ...hostForm, spots: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17263C] mb-1">
                      Description & Objectives
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Provide brief details on agenda, target attendees, and organizing team..."
                      value={hostForm.desc}
                      onChange={(e) => setHostForm({ ...hostForm, desc: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#7A1737] outline-none text-[#17263C]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsHostModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#17263C] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-maroon px-6 py-2.5 text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                      style={{ backgroundColor: "#7A1737", color: "#FFFFFF" }}
                    >
                      Submit Proposal
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: YOUTUBE VIDEO PLAYER */}
      {isYouTubeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in no-print"
          onClick={() => setIsYouTubeModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#17263C] rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0F1A2A]">
              <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                <span className="text-rose-500 font-bold">▶</span>
                <span>A Short Tour of PUST – A Glimpse of Knowledge & Beauty</span>
              </div>
              <button
                type="button"
                onClick={() => setIsYouTubeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
                title="Close player"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/AzgQbTHCBPI?autoplay=1&rel=0"
                title="A Short Tour of PUST"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-300 no-print ${
            toast.type === "success"
              ? "bg-[#17263C] text-emerald-400 border-emerald-500/40"
              : toast.type === "warning"
              ? "bg-[#17263C] text-amber-400 border-amber-500/40"
              : "bg-[#17263C] text-white border-white/20"
          }`}
        >
          <span>
            {toast.type === "success" ? "✓" : toast.type === "warning" ? "⚠️" : "ℹ️"}
          </span>
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-2 text-white/50 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
