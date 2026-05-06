// components/VayuBot.js
// ─────────────────────────────────────────────────────────────────────────────
// VayuBot — Floating chatbot assistant for VayuWarn
// Provides: category chips, recommended Q&A, emergency numbers, app info
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useRef, useEffect } from "react";
import {
  X, Send, Bot, ChevronDown, Phone, Info, HelpCircle,
  AlertTriangle, Map, FileText, Zap, Shield, MessageCircle,
} from "lucide-react";

// ── Static knowledge base ────────────────────────────────────────────────────
const EMERGENCY_NUMBERS = [
  { label: "National Disaster Helpline", number: "1078" },
  { label: "Police",                     number: "100"  },
  { label: "Fire Brigade",               number: "101"  },
  { label: "Ambulance / NDMA",           number: "108"  },
  { label: "NDRF HQ",                    number: "011-24363260" },
  { label: "PM Relief Helpline",         number: "1800-11-1363" },
];

const CATEGORIES = [
  { id: "what",      label: "What is VayuWarn?",    Icon: Info         },
  { id: "how",       label: "How to use the app",   Icon: HelpCircle   },
  { id: "alerts",    label: "About Alerts",         Icon: AlertTriangle},
  { id: "numbers",   label: "Emergency Numbers",    Icon: Phone        },
  { id: "map",       label: "Live Map",             Icon: Map          },
  { id: "report",    label: "Report a Disaster",    Icon: FileText     },
  { id: "safety",    label: "Safety Tips",          Icon: Shield       },
];

const SUGGESTED_QUESTIONS = [
  "What is VayuWarn?",
  "How do I get real-time alerts?",
  "What emergency numbers should I call?",
  "How do I report a disaster?",
  "Is the app free to use?",
  "How does the live map work?",
  "What types of disasters are covered?",
  "How fast are alerts delivered?",
];

const QA_MAP = {
  "What is VayuWarn?": `🌐 **VayuWarn** is India's community-powered real-time disaster early-warning platform.\n\nIt aggregates crowd-sourced incident reports, admin-verified alerts, and live geolocation data to warn citizens about floods, landslides, earthquakes, cyclones, and more — in under 1 second.\n\n🏆 Built for climate resilience across India.`,

  "How do I get real-time alerts?": `🔔 Getting alerts is simple:\n\n1. **Sign up / Log in** to your VayuWarn account.\n2. Visit the **Alerts** page to see live updates.\n3. The **Alert Ticker** at the top of every page scrolls live alerts.\n4. A **siren notification** plays automatically for high-severity events.\n\nAlerts are sourced from verified admins and community reports.`,

  "What emergency numbers should I call?": `📞 **Emergency Helplines (India):**\n\n${EMERGENCY_NUMBERS.map(e => `• **${e.number}** — ${e.label}`).join("\n")}\n\nTap any number in the Emergency page to call instantly.`,

  "How do I report a disaster?": `📝 **To report a disaster:**\n\n1. Go to the **Report** page from the navigation.\n2. Select the type of disaster (Flood, Landslide, etc.).\n3. Enter the location and a brief description.\n4. Submit — our admin team will verify and publish the alert.\n\n⚡ Reports help protect your community in real time!`,

  "Is the app free to use?": `✅ **Yes! VayuWarn is completely free.**\n\nAll features are available at no cost:\n• Real-time alert monitoring\n• Live disaster map\n• Community disaster reporting\n• Emergency helpline directory\n• Safety tips & guidelines\n\nOur mission is saving lives, not making profits.`,

  "How does the live map work?": `🗺️ **The Live Map shows:**\n\n• 📍 **Pinned alerts** — each disaster reported on the map with color-coded severity (Red = High, Yellow = Medium, Green = Low).\n• 🔴 **Pulse rings** — animate on high-severity alerts so you spot them instantly.\n• 🗓️ **Real-time updates** — the map refreshes automatically via Firebase.\n\nClick any pin to see alert details.`,

  "What types of disasters are covered?": `🌊 **VayuWarn covers 8+ disaster types:**\n\n• 🌊 Flood\n• ⛰️ Landslide\n• 🌍 Earthquake\n• 🌀 Cyclone\n• 🔥 Fire\n• 🌪️ Storm\n• ☣️ Industrial Hazard\n• 🌡️ Extreme Heat\n\nNew types can be added by administrators.`,

  "How fast are alerts delivered?": `⚡ **VayuWarn delivers alerts in under 1 second!**\n\nWe use **Firebase Realtime Database** with live subscriptions, meaning:\n• No page refresh needed\n• Alerts appear instantly across all connected devices\n• Siren sounds automatically for High-severity events\n\nThis is real-time disaster tech at its fastest.`,
};

// Category content
const CATEGORY_CONTENT = {
  what: {
    title: "What is VayuWarn?",
    content: QA_MAP["What is VayuWarn?"],
  },
  how: {
    title: "How to use VayuWarn",
    content: `📱 **Getting Started:**\n\n**Step 1 — Sign Up**\nCreate a free account with your email.\n\n**Step 2 — Allow Location** *(optional)*\nGet location-specific alerts near you.\n\n**Step 3 — Browse Alerts**\nSee live disaster alerts on the Alerts page and Live Map.\n\n**Step 4 — Report Incidents**\nSpot something? Report it instantly from the Report page.\n\n**Step 5 — Share**\nHelp spread awareness — share alerts with family and friends.`,
  },
  alerts: {
    title: "About Alerts",
    content: `🔔 **VayuWarn Alert System:**\n\n• **High Severity** 🔴 — Immediate danger, evacuate/take action now.\n• **Medium Severity** 🟡 — Be cautious, monitor situation.\n• **Low Severity** 🟢 — Informational, stay aware.\n\nAlerts include:\n📍 Location\n🕐 Timestamp\n📝 Description\n⚠️ Recommended actions\n\nAll alerts are admin-verified before publishing.`,
  },
  numbers: {
    title: "Emergency Numbers",
    content: EMERGENCY_NUMBERS.map(e => `📞 **${e.number}** — ${e.label}`).join("\n"),
  },
  map: {
    title: "Live Map",
    content: QA_MAP["How does the live map work?"],
  },
  report: {
    title: "Report a Disaster",
    content: QA_MAP["How do I report a disaster?"],
  },
  safety: {
    title: "Safety Tips",
    content: `🛡️ **General Safety Tips:**\n\n• Stay calm — panic makes things worse.\n• Keep emergency kit: water, food, torch, first-aid, documents.\n• Know your evacuation route before disasters strike.\n• Save emergency numbers on your phone.\n• Help elderly and disabled neighbours first.\n• Do NOT spread unverified information.\n• Follow NDMA and government advisories.\n• After a disaster, check for gas leaks before entering buildings.\n\n🆘 In immediate danger, call **112** (Universal Emergency).`,
  },
};

// ── Markdown-lite renderer ───────────────────────────────────────────────────
function renderMessage(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
    }
    // Handle line breaks
    return part.split("\n").map((line, j) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < part.split("\n").length - 1 && <br />}
      </span>
    ));
  });
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function VayuBot() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [typing,   setTyping]   = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "bot",
          text: "👋 Hi! I'm **VayuBot**, your VayuWarn assistant.\n\nI can help you with alerts, emergency numbers, how to report disasters, and more.\n\nWhat would you like to know today?",
          showCategories: true,
        },
      ]);
    }
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  function botReply(text, extra = {}) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text, ...extra }]);
    }, 600 + Math.random() * 400);
  }

  function handleSend(msg) {
    const userMsg = (msg || input).trim();
    if (!userMsg) return;

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setShowSuggestions(false);

    // Match Q&A
    const matched = Object.entries(QA_MAP).find(([q]) =>
      q.toLowerCase().includes(userMsg.toLowerCase()) ||
      userMsg.toLowerCase().includes(q.toLowerCase().split(" ").slice(0, 3).join(" "))
    );

    if (matched) {
      botReply(matched[1]);
    } else if (
      userMsg.toLowerCase().includes("hello") ||
      userMsg.toLowerCase().includes("hi") ||
      userMsg.toLowerCase().includes("hey")
    ) {
      botReply("👋 Hello! How can I help you today? Choose a category below or type your question.", { showCategories: true });
    } else if (userMsg.toLowerCase().includes("thank")) {
      botReply("🙏 You're welcome! Stay safe and prepared. Is there anything else I can help you with?");
    } else if (
      userMsg.toLowerCase().includes("number") ||
      userMsg.toLowerCase().includes("helpline") ||
      userMsg.toLowerCase().includes("call") ||
      userMsg.toLowerCase().includes("emergency")
    ) {
      botReply(QA_MAP["What emergency numbers should I call?"]);
    } else if (
      userMsg.toLowerCase().includes("alert") ||
      userMsg.toLowerCase().includes("notification")
    ) {
      botReply(QA_MAP["How do I get real-time alerts?"]);
    } else if (
      userMsg.toLowerCase().includes("map") ||
      userMsg.toLowerCase().includes("location")
    ) {
      botReply(QA_MAP["How does the live map work?"]);
    } else if (
      userMsg.toLowerCase().includes("report") ||
      userMsg.toLowerCase().includes("submit")
    ) {
      botReply(QA_MAP["How do I report a disaster?"]);
    } else {
      botReply(
        "🤔 I'm not sure about that specific query, but here are some things I can help with:",
        { showCategories: true }
      );
    }
  }

  function handleCategory(catId) {
    const cat = CATEGORY_CONTENT[catId];
    if (!cat) return;
    setMessages((prev) => [...prev, { role: "user", text: cat.title }]);
    setShowSuggestions(false);
    botReply(cat.content);
  }

  function handleSuggestedQ(q) {
    handleSend(q);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open VayuBot chat"
        className="vayubot-fab"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ef4444, #f97316)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(239,68,68,0.45), 0 2px 8px rgba(0,0,0,0.4)",
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.12)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open
          ? <ChevronDown style={{ width: 26, height: 26, color: "#fff" }} />
          : <MessageCircle style={{ width: 26, height: 26, color: "#fff" }} />
        }

        {/* Pulse ring when closed */}
        {!open && (
          <span style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: "2px solid rgba(239,68,68,0.5)",
            animation: "vayubotPulse 2s ease-in-out infinite",
          }} />
        )}
      </button>

      {/* ── Label tooltip ── */}
      {!open && (
        <div style={{
          position: "fixed",
          bottom: "92px",
          right: "24px",
          zIndex: 999,
          background: "rgba(17,24,39,0.95)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "10px",
          padding: "6px 12px",
          fontSize: "12px",
          fontWeight: 700,
          color: "#f9fafb",
          whiteSpace: "nowrap",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          animation: "vayubotLabelPop 0.3s ease both",
        }}>
          💬 VayuBot — Ask me anything!
        </div>
      )}

      {/* ── Chat Window ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            zIndex: 999,
            width: "min(380px, calc(100vw - 32px))",
            height: "min(540px, calc(100dvh - 120px))",
            borderRadius: "20px",
            background: "rgba(10,12,20,0.97)",
            border: "1px solid rgba(239,68,68,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "vayubotSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 16px",
            background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.1))",
            borderBottom: "1px solid rgba(239,68,68,0.2)",
            flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ef4444, #f97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Bot style={{ width: 20, height: 20, color: "#fff" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: "#fff", lineHeight: 1.2 }}>VayuBot</p>
              <p style={{ margin: 0, fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", display: "inline-block" }} />
                Online • VayuWarn Assistant
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "4px", borderRadius: "8px",
                color: "#6b7280", transition: "color 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
            >
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>

          {/* Messages area */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 14px 8px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            scrollbarWidth: "thin",
            scrollbarColor: "#374151 transparent",
          }}>
            {messages.map((msg, idx) => (
              <div key={idx}>
                {/* Message bubble */}
                <div style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: "8px",
                }}>
                  {msg.role === "bot" && (
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: "linear-gradient(135deg, #ef4444, #f97316)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Bot style={{ width: 14, height: 14, color: "#fff" }} />
                    </div>
                  )}
                  <div style={{
                    maxWidth: "80%",
                    padding: "10px 13px",
                    borderRadius: msg.role === "user"
                      ? "16px 4px 16px 16px"
                      : "4px 16px 16px 16px",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #ef4444, #dc2626)"
                      : "rgba(31,41,55,0.9)",
                    border: msg.role === "bot" ? "1px solid rgba(255,255,255,0.06)" : "none",
                    fontSize: "13px",
                    lineHeight: "1.55",
                    color: msg.role === "user" ? "#fff" : "#d1d5db",
                    wordBreak: "break-word",
                  }}>
                    {renderMessage(msg.text)}
                  </div>
                </div>

                {/* Category chips after bot message */}
                {msg.role === "bot" && msg.showCategories && (
                  <div style={{ marginTop: 10, marginLeft: 34 }}>
                    <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>
                      CHOOSE A TOPIC:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {CATEGORIES.map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          onClick={() => handleCategory(id)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "5px 10px",
                            borderRadius: "20px",
                            background: "rgba(31,41,55,0.8)",
                            border: "1px solid rgba(239,68,68,0.25)",
                            color: "#f9fafb",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                            e.currentTarget.style.borderColor = "rgba(239,68,68,0.6)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(31,41,55,0.8)";
                            e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
                          }}
                        >
                          <Icon style={{ width: 11, height: 11, color: "#ef4444" }} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "linear-gradient(135deg, #ef4444, #f97316)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Bot style={{ width: 14, height: 14, color: "#fff" }} />
                </div>
                <div style={{
                  padding: "10px 16px",
                  borderRadius: "4px 16px 16px 16px",
                  background: "rgba(31,41,55,0.9)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", gap: 4, alignItems: "center",
                }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{
                      width: 7, height: 7,
                      borderRadius: "50%",
                      background: "#ef4444",
                      display: "inline-block",
                      animation: `vayubotDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggested questions (show when messages ≤ 1) */}
          {showSuggestions && messages.length <= 1 && (
            <div style={{
              padding: "8px 14px",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              flexShrink: 0,
            }}>
              <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>
                💡 SUGGESTED QUESTIONS:
              </p>
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestedQ(q)}
                    style={{
                      flexShrink: 0,
                      padding: "5px 10px",
                      borderRadius: "16px",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#fca5a5",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div style={{
            padding: "10px 14px 14px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
            display: "flex",
            gap: "8px",
            alignItems: "flex-end",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask VayuBot anything..."
              style={{
                flex: 1,
                background: "rgba(31,41,55,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "#f3f4f6",
                outline: "none",
                transition: "border-color 0.2s",
                resize: "none",
                fontFamily: "inherit",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(239,68,68,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              style={{
                width: 40, height: 40,
                borderRadius: "50%",
                background: input.trim()
                  ? "linear-gradient(135deg, #ef4444, #f97316)"
                  : "rgba(31,41,55,0.8)",
                border: "none",
                cursor: input.trim() ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              <Send style={{ width: 16, height: 16, color: input.trim() ? "#fff" : "#4b5563" }} />
            </button>
          </div>
        </div>
      )}

      {/* ── Keyframe styles injected via style tag ── */}
      <style>{`
        @keyframes vayubotPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes vayubotSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes vayubotLabelPop {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vayubotDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%           { transform: scale(1);   opacity: 1; }
        }
        @media (max-width: 480px) {
          .vayubot-fab {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </>
  );
}
