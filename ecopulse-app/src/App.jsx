import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase";

const ACCENT = "#22c55e";
const ACCENT_DARK = "#4ade80";
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const THEMES = {
  light: {
    bg: "linear-gradient(135deg, #f8fafc 0%, #eefdf4 100%)",
    surface: "#ffffff",
    surfaceAlt: "#f8fafc",
    border: "rgba(15,23,42,0.13)",
    navBg: "rgba(255,255,255,0.94)",
    text: "#07111f",
    textSecondary: "#334155",
    cardBg: "#ffffff",
    inputBg: "#f8fafc",
    inputText: "#0f172a",
    progressTrack: "#e2e8f0",
    complaintBg: "rgba(0,0,0,0.04)",
    accent: "#16a34a",
    accentBright: "#22c55e",
    tickerBg: "rgba(255,255,255,0.85)",
    popupBg: "#ffffff",
    categoryHover: "#dcfce7",
  },
  dark: {
    bg: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
    surface: "#0f172a",
    surfaceAlt: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.09)",
    navBg: "rgba(15,23,42,0.85)",
    text: "#f1f5f9",
    textSecondary: "#94a3b8",
    cardBg: "rgba(255,255,255,0.06)",
    inputBg: "#1e293b",
    inputText: "#f1f5f9",
    progressTrack: "#1e293b",
    complaintBg: "rgba(255,255,255,0.06)",
    accent: "#4ade80",
    accentBright: "#4ade80",
    tickerBg: "rgba(255,255,255,0.06)",
    popupBg: "#0f172a",
    categoryHover: "#14532d",
  },
};

const ISSUES = [
  { emoji: "🗑️", label: "Garbage & Waste", color: "#4ade80", key: "garbage" },
  { emoji: "🚧", label: "Road & Pothole", color: "#fbbf24", key: "road" },
  { emoji: "💧", label: "Water Leakage", color: "#38bdf8", key: "water" },
  { emoji: "💡", label: "Street Lights", color: "#f472b6", key: "light" },
  { emoji: "🌫️", label: "Pollution", color: "#a78bfa", key: "pollution" },
  { emoji: "📌", label: "Other Issue", color: "#fb923c", key: "other" },
];

const STATS = [
  { value: "1,200+", label: "Complaints Solved", emoji: "✅" },
  { value: "92%", label: "Awareness Score", emoji: "📊" },
  { value: "14 Tons", label: "Waste Reduced", emoji: "♻️" },
  { value: "8,500+", label: "Citizens Engaged", emoji: "🏘️" },
];

const COMPLAINTS = [
  { emoji: "🚧", text: "Pothole near MG Road", status: "Pending", color: "#fbbf24" },
  { emoji: "💧", text: "Water Leakage in Sector 5", status: "In Progress", color: "#38bdf8" },
  { emoji: "🗑️", text: "Garbage Overflow – Gandhi Park", status: "Resolved", color: "#4ade80" },
  { emoji: "💡", text: "Streetlight broken – Block C", status: "Pending", color: "#fbbf24" },
];

const TICKER_ITEMS = [
  "🚧 Road Damage – Sector 4 – Pending",
  "💧 Water Leakage – Park Ave – In Progress",
  "🗑️ Garbage Overflow – Resolved",
  "💡 Streetlight Issue – Sector 9 – Pending",
  "✅ Pothole Fixed – MG Road – Resolved",
  "🌫️ Air Quality Alert – Industrial Zone",
];

const PROGRESS_BARS = [
  { label: "Waste Reduction", pct: 74, color: "#4ade80" },
  { label: "Water Conservation", pct: 61, color: "#38bdf8" },
  { label: "Pollution Control", pct: 89, color: "#f472b6" },
  { label: "Road Maintenance", pct: 53, color: "#fbbf24" },
];

const CONTACTS = [
  { emoji: "📞", label: "Phone", value: "+91 9876543210" },
  { emoji: "📸", label: "Instagram", value: "@ecopulse.ai" },
  { emoji: "📘", label: "Facebook", value: "EcoPulse Official" },
  { emoji: "📺", label: "YouTube", value: "EcoPulse Civic" },
  { emoji: "𝕏", label: "Twitter", value: "@EcoPulseCity" },
];

const REPORT_CATEGORIES = [
  "Garbage & Waste",
  "Road & Pothole",
  "Water & Drainage",
  "Construction",
  "Street Lights",
  "Other Issue",
];

const CIVIC_PARAGRAPHS = [
  "Civic sense begins with small everyday choices: keeping public spaces clean, respecting shared resources, following civic rules, and reporting problems before they grow into bigger hazards. A city becomes easier to live in when citizens treat streets, parks, water points, and public facilities as common responsibilities.",
  "Awareness is equally important because many civic problems are preventable. Segregating waste, saving water, avoiding plastic litter, and speaking up about unsafe roads or broken streetlights help local authorities respond faster and plan better.",
  "EcoPulse encourages citizens to take part in this shared effort. Every report, every alert, and every responsible action adds to a cleaner, safer, and more sustainable neighbourhood.",
];

const SIMPLE_STEPS = [
  { title: "Simple.", text: "Choose the issue category and share what you see." },
  { title: "Fast.", text: "Upload a photo and send the report in a few seconds." },
  { title: "Effective.", text: "Clear reports help civic teams identify and resolve problems sooner." },
];

const WHY_IT_MATTERS = [
  "Cleaner surroundings reduce health risks and make public places safer for families, children, and senior citizens.",
  "Early reporting prevents water wastage, road accidents, pollution build-up, and repeated damage to public infrastructure.",
  "Community participation builds trust between citizens and local authorities, turning civic care into a daily habit.",
];

const FAQS = [
  {
    q: "How do I report an issue?",
    a: "Tap 'Report Issue' in the menu, pick a category (like Garbage or Road), describe the problem, and hit Submit. It takes less than 2 minutes!",
  },
  {
    q: "How long before my issue is fixed?",
    a: "Most issues are reviewed within 24 hours. You'll get a complaint ID you can use to track progress anytime.",
  },
  {
    q: "Can I report anonymously?",
    a: "Yes! Your contact details are optional. You can report without sharing your name or phone number.",
  },
  {
    q: "How does EcoPulse help the environment?",
    a: "Every complaint you report helps authorities act faster. Our analytics also track city-wide trends to improve long-term sustainability.",
  },
];

function DonutChart({ t }) {
  const data = [42, 27, 18, 13];
  const colors = ["#4ade80", "#38bdf8", "#fbbf24", "#f472b6"];
  const labels = ["Waste", "Water", "Roads", "Pollution"];
  const total = data.reduce((a, b) => a + b, 0);
  let cumulative = 0;
  const cx = 80, cy = 80, r = 60, inner = 36;
  const paths = data.map((val, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += val;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const xi1 = cx + inner * Math.cos(startAngle);
    const yi1 = cy + inner * Math.sin(startAngle);
    const xi2 = cx + inner * Math.cos(endAngle);
    const yi2 = cy + inner * Math.sin(endAngle);
    const large = val / total > 0.5 ? 1 : 0;
    return (
      <path
        key={i}
        d={`M ${xi1} ${yi1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${inner} ${inner} 0 ${large} 0 ${xi1} ${yi1} Z`}
        fill={colors[i]}
        opacity="0.92"
      />
    );
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {paths}
        <circle cx={cx} cy={cy} r={inner - 2} fill={t.cardBg} />
        <text x={cx} y={cy - 6} textAnchor="middle" fill={t.text} fontSize="11" fontWeight="600">{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={t.textSecondary} fontSize="9">issues</text>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", justifyContent: "center" }}>
        {labels.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textSecondary }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: colors[i], display: "inline-block" }} />
            {l} <strong style={{ color: t.text }}>{data[i]}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ t }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const curr = [8, 12, 7, 15, 11, 9, 5];
  const prev = [6, 9, 11, 8, 14, 7, 4];
  const max = Math.max(...curr, ...prev);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110, paddingTop: 8 }}>
      {days.map((d, i) => (
        <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 90 }}>
            <div title={`Last week: ${prev[i]}`} style={{ width: 8, height: `${(prev[i] / max) * 90}px`, background: t.progressTrack, borderRadius: "3px 3px 0 0", border: `1px solid ${t.accent}`, transition: "height 0.6s" }} />
            <div title={`This week: ${curr[i]}`} style={{ width: 8, height: `${(curr[i] / max) * 90}px`, background: t.accent, borderRadius: "3px 3px 0 0", transition: "height 0.6s" }} />
          </div>
          <span style={{ fontSize: 10, color: t.textSecondary }}>{d}</span>
        </div>
      ))}
    </div>
  );
}

function Ticker({ t }) {
  const text = TICKER_ITEMS.join("   •   ");
  return (
    <div style={{ overflow: "hidden", background: t.tickerBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px 20px", backdropFilter: "blur(8px)" }}>
      <div style={{
        display: "inline-block",
        whiteSpace: "nowrap",
        animation: "tickerScroll 28s linear infinite",
        fontSize: 14,
        color: t.textSecondary,
        fontWeight: 500,
      }}>
        {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}
      </div>
      <style>{`@keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function Card({ t, children, style = {} }) {
  return (
    <div style={{
      background: t.cardBg,
      border: `1px solid ${t.border}`,
      borderRadius: 20,
      padding: "24px 28px",
      backdropFilter: "blur(12px)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function StatusBadge({ status, t }) {
  const map = {
    "Pending": { bg: "#fef3c7", color: "#92400e" },
    "In Progress": { bg: "#dbeafe", color: "#1e3a8a" },
    "Resolved": { bg: "#dcfce7", color: "#14532d" },
  };
  const s = map[status] || { bg: t.complaintBg, color: t.text };
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: s.bg, color: s.color, letterSpacing: 0.3 }}>
      {status}
    </span>
  );
}

function reportCategoryFromIssue(issue) {
  const map = {
    garbage: "Garbage & Waste",
    road: "Road & Pothole",
    water: "Water & Drainage",
    light: "Street Lights",
    pollution: "Other Issue",
    other: "Other Issue",
  };
  return map[issue.key] || "";
}

export default function EcoPulse() {
  const [themeName, setThemeName] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ecopulse-theme");
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  const t = THEMES[themeName];

  const toggleTheme = () => {
    const next = themeName === "dark" ? "light" : "dark";
    setThemeName(next);
    localStorage.setItem("ecopulse-theme", next);
  };

  const [activeSection, setActiveSection] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    title: "",
    location: "",
    latitude: "",
    longitude: "",
    urgency: "Medium",
  });
  const [previewImg, setPreviewImg] = useState(null);
  const [reportPhoto, setReportPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [toast, setToast] = useState(null);
  const [animIn, setAnimIn] = useState(true);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const navigate = (section) => {
    setAnimIn(false);
    setTimeout(() => {
      setActiveSection(section);
      setAnimIn(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReportPhoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      showToast("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        setFormData((p) => ({
          ...p,
          latitude,
          longitude,
          location: `${latitude}, ${longitude}`,
        }));
        showToast("Location added.");
      },
      () => showToast("Location permission was denied or unavailable."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) { showToast("⚠️ Please select an issue category first."); return; }
    if (!formData.name.trim()) { showToast("Please enter your name."); return; }
    if (!formData.phone.trim()) { showToast("Please enter your phone number."); return; }
    if (!formData.title.trim()) { showToast("Please enter the issue title."); return; }
    if (!formData.latitude || !formData.longitude) { showToast("Please allow location permission."); return; }
    if (!reportPhoto) { showToast("Please upload a photo."); return; }
    if (!formData.urgency) { showToast("Please choose urgency."); return; }

    const payload = new FormData();
    payload.append("category", selectedCategory);
    payload.append("name", formData.name);
    payload.append("phone", formData.phone);
    payload.append("title", formData.title);
    payload.append("location", formData.location);
    payload.append("latitude", formData.latitude);
    payload.append("longitude", formData.longitude);
    payload.append("urgency", formData.urgency);
    if (reportPhoto) payload.append("photo", reportPhoto);

    try {
      const response = await fetch(`${API_BASE}/api/complaints`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) throw new Error(`Backend returned ${response.status}`);

      const data = await response.json().catch(() => ({}));
      const id = data.complaintId || data.id || "ECO-" + (2000 + Math.floor(Math.random() * 900));
      setComplaintId(id);
      setSubmitted(true);
      showToast("✅ Complaint submitted! ID: " + id);
    } catch (error) {
      showToast("⚠️ Backend connection failed. Start Flask backend on port 5000.");
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSelectedCategory("");
    setPreviewImg(null);
    setReportPhoto(null);
    setFormData({ name: "", phone: "", title: "", location: "", latitude: "", longitude: "", urgency: "Medium" });
  };

  const handleContact = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showToast("⚠️ Please fill in all fields."); return;
    }
    setContactSent(true);
    showToast("✅ Message sent! We'll reply within 24 hours.");
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setContactSent(false), 5000);
  };

  const navStyle = {
    position: "sticky", top: 0, zIndex: 1000,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "0 5%", height: 64,
    background: t.navBg, backdropFilter: "blur(14px)",
    borderBottom: `1px solid ${t.border}`,
    transition: "background 0.3s, border-color 0.3s",
  };

  const btnPrimary = {
    background: t.accent, color: "#fff",
    border: "none", borderRadius: 12, padding: "11px 22px",
    fontWeight: 700, fontSize: 15, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
    transition: "opacity 0.15s, transform 0.15s",
    fontFamily: "inherit",
  };
  const btnSecondary = {
    background: "transparent", color: t.accent,
    border: `2px solid ${t.accent}`, borderRadius: 12, padding: "11px 22px",
    fontWeight: 700, fontSize: 15, cursor: "pointer",
    fontFamily: "inherit", transition: "background 0.15s",
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 15,
    border: `1.5px solid ${t.border}`, background: t.inputBg, color: t.inputText,
    fontFamily: "inherit", marginTop: 8, outline: "none",
    transition: "border-color 0.2s",
  };

  const sectionStyle = {
    width: "100%",
    padding: "80px clamp(20px, 5vw, 96px)",
    opacity: animIn ? 1 : 0,
    transform: animIn ? "translateY(0)" : "translateY(12px)",
    transition: "opacity 0.25s ease, transform 0.25s ease",
    minHeight: "80vh",
    boxSizing: "border-box",
  };

  return (
    <div style={{ background: t.bg, color: t.text, width: "100%", minHeight: "100vh", transition: "background 0.3s, color 0.3s", fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={navStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => navigate("home")}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, color: "#fff", flexShrink: 0 }}>🌿</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, lineHeight: 1 }}>EcoPulse</div>
            <div style={{ fontSize: 11, color: t.textSecondary, lineHeight: 1.4 }}>Smart Civic Platform</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {["home", "dashboard", "report", "contact"].map((s) => (
            <button key={s} onClick={() => navigate(s)} style={{
              background: activeSection === s ? t.accent : "transparent",
              color: activeSection === s ? "#fff" : t.textSecondary,
              border: "none", borderRadius: 9, padding: "8px 16px",
              fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.2s, color 0.2s", textTransform: "capitalize",
            }}>
              {s === "home" ? "🏠 Home" : s === "dashboard" ? "📊 Dashboard" : s === "report" ? "📝 Report" : "📞 Contact"}
            </button>
          ))}
          <button onClick={toggleTheme} style={{
            width: 42, height: 42, borderRadius: 11, border: `1.5px solid ${t.border}`,
            background: t.cardBg, cursor: "pointer", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s", marginLeft: 4,
          }} title={`Switch to ${themeName === "dark" ? "light" : "dark"} mode`}>
            {themeName === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* HOME */}
      {activeSection === "home" && (
        <div style={sectionStyle}>
          {/* Hero */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 48, flexWrap: "wrap", minHeight: "70vh" }}>
            <div style={{ flex: "1 1 340px", maxWidth: 580 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: themeName === "dark" ? "#14532d" : "#dcfce7", color: t.accent, borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 700, marginBottom: 20, border: `1px solid ${t.accent}30` }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent, display: "inline-block", animation: "ep-pulse 2s infinite" }} />
                Smart City Platform
              </div>
              <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 20 }}>
                Building <span style={{ color: t.accent }}>Cleaner</span> &amp; Smarter Cities
              </h1>
              <p style={{ color: t.textSecondary, lineHeight: 1.85, fontSize: 16, marginBottom: 32, maxWidth: 500 }}>
                EcoPulse empowers every citizen — from kids to seniors — to report civic issues, track resolutions, and drive sustainability in their neighbourhood.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button style={btnPrimary} onClick={() => navigate("report")}>📝 Report an Issue</button>
                <button style={btnSecondary} onClick={() => navigate("dashboard")}>📊 View Dashboard</button>
              </div>
            </div>

            <div style={{ flex: "1 1 280px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {STATS.map((s, i) => (
                <Card key={i} t={t} style={{ textAlign: "center", padding: "20px 16px" }}>
                  <div style={{ fontSize: 28 }}>{s.emoji}</div>
                  <div style={{ fontSize: "clamp(1.3rem,3vw,1.7rem)", fontWeight: 900, color: t.accent, marginTop: 6 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 4 }}>{s.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Civic Awareness Theory */}
          <div style={{ marginTop: 56 }}>
            <Card t={t} style={{ padding: "34px 36px" }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 18 }}>Civic Sense & Awareness</h2>
              <div style={{ display: "grid", gap: 16 }}>
                {CIVIC_PARAGRAPHS.map((para, i) => (
                  <p key={i} style={{ color: t.textSecondary, lineHeight: 1.85, fontSize: 15, margin: 0 }}>
                    {para}
                  </p>
                ))}
              </div>
            </Card>
          </div>

          {/* Ticker */}
          <div style={{ marginTop: 56 }}>
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>🔴 Live Civic Updates</h2>
              <p style={{ color: t.textSecondary, fontSize: 14, marginTop: 4 }}>Real-time monitoring across the city</p>
            </div>
            <Ticker t={t} />
          </div>

          {/* Simple Fast Effective */}
          <div style={{ marginTop: 56 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 18 }}>Simple. Fast. Effective.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 18 }}>
              {SIMPLE_STEPS.map((step) => (
                <Card key={step.title} t={t}>
                  <h3 style={{ color: t.accent, fontSize: 20, fontWeight: 900, marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ color: t.textSecondary, lineHeight: 1.7, fontSize: 14, margin: 0 }}>{step.text}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Why It Matters */}
          <div style={{ marginTop: 56 }}>
            <Card t={t} style={{ padding: "34px 36px" }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 18 }}>Why it matters</h2>
              <div style={{ display: "grid", gap: 14 }}>
                {WHY_IT_MATTERS.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", color: t.textSecondary, lineHeight: 1.75, fontSize: 15 }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: t.accent, marginTop: 9, flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Report Bar */}
          <div style={{ marginTop: 56 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Quick Report</h2>
            <p style={{ color: t.textSecondary, fontSize: 14, marginBottom: 20 }}>Tap any issue to start reporting — no login needed!</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14 }}>
              {ISSUES.map((issue) => (
                <button key={issue.key} onClick={() => { setSelectedCategory(reportCategoryFromIssue(issue)); navigate("report"); }} style={{
                  background: t.cardBg, border: `1.5px solid ${t.border}`, borderRadius: 16,
                  padding: "18px 12px", cursor: "pointer", textAlign: "center",
                  fontFamily: "inherit", color: t.text,
                  transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = issue.color; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <span style={{ fontSize: 28 }}>{issue.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{issue.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {activeSection === "dashboard" && (
        <div style={sectionStyle}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, letterSpacing: -1 }}>📊 Awareness Dashboard</h1>
            <p style={{ color: t.textSecondary, marginTop: 8, fontSize: 15 }}>Smart sustainability analytics and environmental insights</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "start" }}>

            {/* Sustainability Info */}
            <Card t={t}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>🌱 Sustainability Goals</h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.75, fontSize: 14, marginBottom: 18 }}>
                Our city is committed to reducing pollution, improving waste management, and building environmentally responsible communities.
              </p>
              <div style={{ background: t.progressTrack, borderRadius: 12, padding: "14px 18px", fontSize: 13, color: t.textSecondary, lineHeight: 1.7 }}>
                🎯 <strong style={{ color: t.text }}>2025 Target:</strong> 50 tons waste reduced, 20,000 citizens engaged, 95% complaint resolution rate.
              </div>
            </Card>

            {/* Donut Chart */}
            <Card t={t}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>🥧 Common Civic Issues</h2>
              <DonutChart t={t} />
            </Card>

            {/* Progress Bars */}
            <Card t={t}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>📈 Environmental Progress</h2>
              {PROGRESS_BARS.map((p) => (
                <div key={p.label} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
                    <span>{p.label}</span>
                    <span style={{ color: t.accent }}>{p.pct}%</span>
                  </div>
                  <div style={{ background: t.progressTrack, borderRadius: 999, height: 10, overflow: "hidden" }}>
                    <div style={{ width: `${p.pct}%`, height: "100%", background: p.color, borderRadius: 999, transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </Card>

            {/* Bar Chart */}
            <Card t={t}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>📅 Weekly Complaints</h2>
              <p style={{ color: t.textSecondary, fontSize: 13, marginBottom: 8 }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: t.accent, marginRight: 6 }} />This week &nbsp;
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: t.progressTrack, border: `1px solid ${t.accent}`, marginRight: 6 }} />Last week
              </p>
              <BarChart t={t} />
            </Card>

            {/* Recent Complaints */}
            <Card t={t} style={{ gridColumn: "span 2" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>🗂️ Recent Complaints</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                {COMPLAINTS.map((c, i) => (
                  <div key={i} style={{
                    background: t.complaintBg, borderRadius: 14, padding: "14px 18px",
                    border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                      <span style={{ fontSize: 22 }}>{c.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.text, flex: 1 }}>{c.text}</span>
                    </div>
                    <StatusBadge status={c.status} t={t} />
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      )}

      {/* REPORT */}
        {/* REPORT */}
{activeSection === "report" && (
  <div style={sectionStyle}>
    <Card
      t={t}
      style={{
        maxWidth: 950,
        margin: "0 auto",
        padding: "48px 50px",
        borderRadius: 28,
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 35 }}>
        <div
          style={{
            display: "inline-block",
            background: `${t.accent}20`,
            color: t.accent,
            padding: "8px 16px",
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 18,
          }}
        >
          Submit a Complaint
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem,4vw,2.7rem)",
            fontWeight: 900,
            letterSpacing: -1,
            marginBottom: 12,
          }}
        >
          Report a Civic Issue
        </h1>

        <p
          style={{
            color: t.textSecondary,
            lineHeight: 1.7,
            fontSize: 15,
          }}
        >
          Fill in the details below. Your report goes directly to
          the Municipal Authority.
        </p>
      </div>

      {/* SUCCESS */}
      {submitted ? (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{ fontSize: 58, marginBottom: 16 }}>✅</div>

          <h2
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: t.accent,
              marginBottom: 10,
            }}
          >
            Complaint Submitted Successfully!
          </h2>

          <p
            style={{
              color: t.textSecondary,
              marginBottom: 24,
            }}
          >
            Complaint ID:
            <strong style={{ color: t.text, marginLeft: 6 }}>
              {complaintId}
            </strong>
          </p>

          <button style={btnPrimary} onClick={resetForm}>
            Report Another Issue
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* CATEGORY */}
          <div>
            <label
              style={{
                marginBottom: 12,
                display: "block",
                color: t.textSecondary,
                fontWeight: 700,
              }}
            >
              Select Category
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(170px,1fr))",
                gap: 14,
              }}
            >
              {[
                ["🗑️", "Garbage & Waste"],
                ["🚧", "Road & Pothole"],
                ["💧", "Water & Drainage"],
                ["🏗️", "Construction"],
                ["💡", "Street Lights"],
                ["📌", "Other Issue"],
              ].map(([emoji, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedCategory(label)}
                  style={{
                    padding: "20px 16px",
                    borderRadius: 22,
                    border:
                      selectedCategory === label
                        ? `2px solid ${t.accent}`
                        : `1px solid ${t.border}`,
                    background:
                      selectedCategory === label
                        ? `${t.accent}18`
                        : t.cardBg,
                    color: t.text,
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 14,
                    transition: "0.2s",
                  }}
                >
                  <div
                    style={{
                      fontSize: 30,
                      marginBottom: 10,
                    }}
                  >
                    {emoji}
                  </div>

                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* NAME + PHONE */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(240px,1fr))",
              gap: 18,
            }}
          >
            <div>
              <label
                style={{
                  marginBottom: 10,
                  display: "block",
                  color: t.textSecondary,
                  fontWeight: 600,
                }}
              >
                Name *
              </label>

              <input
                required
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    name: e.target.value,
                  }))
                }
                style={{
                  ...inputStyle,
                  marginTop: 0,
                  borderRadius: 18,
                  padding: 16,
                }}
              />
            </div>

            <div>
              <label
                style={{
                  marginBottom: 10,
                  display: "block",
                  color: t.textSecondary,
                  fontWeight: 600,
                }}
              >
                Phone *
              </label>

              <input
                required
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    phone: e.target.value,
                  }))
                }
                style={{
                  ...inputStyle,
                  marginTop: 0,
                  borderRadius: 18,
                  padding: 16,
                }}
              />
            </div>
          </div>

          {/* TITLE */}
          <div>
            <label
              style={{
                marginBottom: 10,
                display: "block",
                color: t.textSecondary,
                fontWeight: 600,
              }}
            >
              Issue Title *
            </label>

            <input
              required
              type="text"
              placeholder="Enter issue title"
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  title: e.target.value,
                }))
              }
              style={{
                ...inputStyle,
                marginTop: 0,
                borderRadius: 18,
                padding: 16,
              }}
            />
          </div>

          {/* LOCATION */}
          <div>
            <label
              style={{
                marginBottom: 10,
                display: "block",
                color: t.textSecondary,
                fontWeight: 600,
              }}
            >
              Location *
            </label>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <input
                required
                type="text"
                placeholder="Click Use My Location"
                value={formData.location}
                readOnly
                style={{
                  ...inputStyle,
                  marginTop: 0,
                  borderRadius: 18,
                  padding: 16,
                  flex: "1 1 260px",
                }}
              />

              <button
                type="button"
                onClick={requestLocation}
                style={{
                  ...btnSecondary,
                  borderRadius: 18,
                }}
              >
                📍 Use My Location
              </button>
            </div>
          </div>

          {/* PHOTO */}
          <div>
            <label
              style={{
                marginBottom: 10,
                display: "block",
                color: t.textSecondary,
                fontWeight: 600,
              }}
            >
              Photos *
            </label>

            <label
              style={{
                border: `2px dashed ${t.accent}66`,
                padding: 40,
                borderRadius: 28,
                textAlign: "center",
                background: t.complaintBg,
                display: "block",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: 44,
                  marginBottom: 12,
                }}
              >
                📸
              </div>

              <p
                style={{
                  color: t.textSecondary,
                  marginBottom: 18,
                }}
              >
                {previewImg
                  ? "Image selected. Upload another image if needed."
                  : "Drag & Drop or Upload an Image"}
              </p>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
              />
            </label>

            {previewImg && (
              <img
                src={previewImg}
                alt="Preview"
                style={{
                  width: "100%",
                  borderRadius: 18,
                  marginTop: 16,
                  maxHeight: 260,
                  objectFit: "cover",
                }}
              />
            )}
          </div>

          {/* URGENCY */}
          <div>
            <label
              style={{
                marginBottom: 10,
                display: "block",
                color: t.textSecondary,
                fontWeight: 600,
              }}
            >
              Urgency Scale *
            </label>

            <select
              required
              value={formData.urgency}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  urgency: e.target.value,
                }))
              }
              style={{
                ...inputStyle,
                marginTop: 0,
                borderRadius: 18,
                padding: 16,
              }}
            >
              <option value="">Choose urgency</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {/* REVIEW BOX */}
          <div
            style={{
              background: t.complaintBg,
              border: `1px solid ${t.border}`,
              borderRadius: 22,
              padding: 24,
            }}
          >
            <h3
              style={{
                marginBottom: 18,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              Review Details
            </h3>

            <div
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              {[
                ["Category", selectedCategory || "-"],
                ["Name", formData.name || "-"],
                ["Phone", formData.phone || "-"],
                ["Title", formData.title || "-"],
                ["Location", formData.location || "-"],
                ["Urgency", formData.urgency || "-"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ color: t.textSecondary }}>
                    {k}
                  </span>

                  <strong>{v}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            style={{
              ...btnPrimary,
              alignSelf: "flex-start",
              color: "#000",
              background: "#22c55e",
              padding: "14px 28px",
              borderRadius: 18,
            }}
          >
            🚀 Submit Complaint
          </button>
        </form>
      )}
    </Card>
  </div>
)}
      {/* CONTACT */}
      {activeSection === "contact" && (
        <div style={sectionStyle}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, letterSpacing: -1 }}>📞 Contact Us</h1>
            <p style={{ color: t.textSecondary, marginTop: 8, fontSize: 15 }}>We're here to help — reach out anytime!</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, alignItems: "start", marginBottom: 44 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 18 }}>
              {CONTACTS.map((c, i) => (
                <Card key={i} t={t} style={{ textAlign: "left", padding: "22px 24px" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{c.emoji}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{c.label}</h3>
                  <p style={{ color: t.accent, fontWeight: 600, fontSize: 14, margin: 0 }}>{c.value}</p>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <Card t={t} style={{ width: "100%" }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Email Us</h2>
              <p style={{ color: t.textSecondary, fontSize: 14, marginBottom: 22 }}>Send a message to ecopulse@gmail.com</p>
              {contactSent ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: t.accent }}>Message Sent!</h3>
                  <p style={{ color: t.textSecondary, marginTop: 8 }}>We'll reply within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContact}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontWeight: 700, fontSize: 14 }}>Your Name</label>
                    <input style={inputStyle} type="text" placeholder="What should we call you?" value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontWeight: 700, fontSize: 14 }}>Email</label>
                    <input style={inputStyle} type="email" placeholder="your@email.com" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} required />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontWeight: 700, fontSize: 14 }}>Message</label>
                    <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} placeholder="How can we help you?" value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} required />
                  </div>
                  <button type="submit" style={{ ...btnPrimary, width: "100%", justifyContent: "center", padding: "13px 0", borderRadius: 12 }}>
                    📨 Send Message
                  </button>
                </form>
              )}
            </Card>
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>❓ Frequently Asked Questions</h2>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                  width: "100%", textAlign: "left", background: t.cardBg,
                  border: `1px solid ${faqOpen === i ? t.accent : t.border}`,
                  borderRadius: faqOpen === i ? "14px 14px 0 0" : 14,
                  padding: "16px 20px", cursor: "pointer", color: t.text,
                  fontFamily: "inherit", fontWeight: 700, fontSize: 15,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "border-color 0.2s",
                }}>
                  {faq.q}
                  <span style={{ fontSize: 20, transition: "transform 0.2s", transform: faqOpen === i ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
                </button>
                {faqOpen === i && (
                  <div style={{ background: t.complaintBg, border: `1px solid ${t.accent}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "16px 20px", color: t.textSecondary, lineHeight: 1.75, fontSize: 14 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: themeName === "dark" ? "#1e293b" : "#0f172a",
          color: "#fff", padding: "14px 24px", borderRadius: 14,
          fontWeight: 700, fontSize: 15, zIndex: 9999, maxWidth: "90vw", textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)", animation: "ep-toast 0.3s ease",
        }}>
          {toast}
        </div>
      )}

      <footer style={{ textAlign: "center", padding: 30, color: t.textSecondary, borderTop: `1px solid ${t.border}`, marginTop: 20 }}>
        © 2026 EcoPulse | Smart Sustainable Civic Platform
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes ep-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }
        @keyframes ep-toast { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        input:focus, textarea:focus, select:focus { outline: 2px solid #22c55e; outline-offset: 1px; }
        button:active { transform: scale(0.97); }
      `}</style>
    </div>
  );
}
