// components/VayuBot.js
// ─────────────────────────────────────────────────────────────────────────────
// VayuBot — Floating chatbot assistant (EN / HI / Garhwali / Kumaoni)
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/context/LanguageContext";
import { BOT_LANG } from "@/components/vayubot-lang";
import {
  X, Send, Bot, ChevronDown, Phone, Info, HelpCircle,
  AlertTriangle, Map, FileText, Shield, MessageCircle,
} from "lucide-react";

const ICO = { what: Info, how: HelpCircle, alerts: AlertTriangle, numbers: Phone, map: Map, report: FileText, safety: Shield };

function renderMessage(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
    }
    return part.split("\n").map((line, j) => (
      <span key={`${i}-${j}`}>{line}{j < part.split("\n").length - 1 && <br />}</span>
    ));
  });
}

export default function VayuBot() {
  const { lang } = useLang();
  const L = BOT_LANG[lang] || BOT_LANG.en;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const prevLang = useRef(lang);

  // Reset chat when language changes
  useEffect(() => {
    if (prevLang.current !== lang) {
      setMessages([]);
      setShowSuggestions(true);
      prevLang.current = lang;
    }
  }, [lang]);

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "bot", text: L.welcome, showCategories: true }]);
    }
  }, [open, messages.length, L.welcome]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);

  function botReply(text, extra = {}) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: "bot", text, ...extra }]);
    }, 600 + Math.random() * 400);
  }

  function matchKeyword(msg, category) {
    const kw = L.keywords?.[category];
    if (!kw) return false;
    const lower = msg.toLowerCase();
    return kw.some(w => lower.includes(w.toLowerCase()));
  }

  function handleSend(msg) {
    const userMsg = (msg || input).trim();
    if (!userMsg) return;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setShowSuggestions(false);

    if (matchKeyword(userMsg, "hello")) {
      botReply(L.hello, { showCategories: true });
    } else if (matchKeyword(userMsg, "thanks")) {
      botReply(L.thanks);
    } else if (matchKeyword(userMsg, "numbers")) {
      botReply(L.answers.numbers);
    } else if (matchKeyword(userMsg, "alerts")) {
      botReply(L.answers.alerts);
    } else if (matchKeyword(userMsg, "map")) {
      botReply(L.answers.map);
    } else if (matchKeyword(userMsg, "report")) {
      botReply(L.answers.report);
    } else {
      // Try fuzzy match against question list
      const lower = userMsg.toLowerCase();
      const catMatch = L.cats?.find(c => lower.includes(c.label.toLowerCase().split(" ").slice(0, 2).join(" ")));
      if (catMatch) {
        botReply(L.answers[catMatch.id] || L.fallback, catMatch ? {} : { showCategories: true });
      } else {
        botReply(L.fallback, { showCategories: true });
      }
    }
  }

  function handleCategory(catId) {
    const cat = L.cats?.find(c => c.id === catId);
    if (!cat) return;
    setMessages(prev => [...prev, { role: "user", text: cat.label }]);
    setShowSuggestions(false);
    botReply(L.answers[catId] || L.fallback);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  return (
    <>
      {/* ── FAB ── */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open VayuBot chat"
        className="vayubot-fab"
        style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 1000,
          width: "60px", height: "60px", borderRadius: "50%",
          background: "linear-gradient(135deg, #ef4444, #f97316)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(239,68,68,0.45), 0 2px 8px rgba(0,0,0,0.4)",
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open ? <ChevronDown style={{ width: 26, height: 26, color: "#fff" }} /> : <MessageCircle style={{ width: 26, height: 26, color: "#fff" }} />}
        {!open && <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(239,68,68,0.5)", animation: "vayubotPulse 2s ease-in-out infinite" }} />}
      </button>

      {/* ── Tooltip ── */}
      {!open && (
        <div style={{ position: "fixed", bottom: "92px", right: "24px", zIndex: 999, background: "rgba(17,24,39,0.95)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "6px 12px", fontSize: "12px", fontWeight: 700, color: "#f9fafb", whiteSpace: "nowrap", backdropFilter: "blur(8px)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", animation: "vayubotLabelPop 0.3s ease both" }}>
          💬 VayuBot
        </div>
      )}

      {/* ── Chat Window ── */}
      {open && (
        <div style={{ position: "fixed", bottom: "96px", right: "24px", zIndex: 999, width: "min(380px, calc(100vw - 32px))", height: "min(540px, calc(100dvh - 120px))", borderRadius: "20px", background: "rgba(10,12,20,0.97)", border: "1px solid rgba(239,68,68,0.25)", boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "vayubotSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.1))", borderBottom: "1px solid rgba(239,68,68,0.2)", flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #ef4444, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bot style={{ width: 20, height: 20, color: "#fff" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: "#fff", lineHeight: 1.2 }}>VayuBot</p>
              <p style={{ margin: 0, fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", display: "inline-block" }} />
                {L.online}
              </p>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "8px", color: "#6b7280", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}>
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: "10px", scrollbarWidth: "thin", scrollbarColor: "#374151 transparent" }}>
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-end", gap: "8px" }}>
                  {msg.role === "bot" && (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #ef4444, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Bot style={{ width: 14, height: 14, color: "#fff" }} />
                    </div>
                  )}
                  <div style={{ maxWidth: "80%", padding: "10px 13px", borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: msg.role === "user" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "rgba(31,41,55,0.9)", border: msg.role === "bot" ? "1px solid rgba(255,255,255,0.06)" : "none", fontSize: "13px", lineHeight: "1.55", color: msg.role === "user" ? "#fff" : "#d1d5db", wordBreak: "break-word" }}>
                    {renderMessage(msg.text)}
                  </div>
                </div>
                {msg.role === "bot" && msg.showCategories && (
                  <div style={{ marginTop: 10, marginLeft: 34 }}>
                    <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>{L.chooseTopic}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {(L.cats || []).map(({ id, label }) => {
                        const CatIcon = ICO[id] || Info;
                        return (
                          <button key={id} onClick={() => handleCategory(id)}
                            style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "20px", background: "rgba(31,41,55,0.8)", border: "1px solid rgba(239,68,68,0.25)", color: "#f9fafb", fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.6)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(31,41,55,0.8)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }}>
                            <CatIcon style={{ width: 11, height: 11, color: "#ef4444" }} />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #ef4444, #f97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot style={{ width: 14, height: 14, color: "#fff" }} />
                </div>
                <div style={{ padding: "10px 16px", borderRadius: "4px 16px 16px 16px", background: "rgba(31,41,55,0.9)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: `vayubotDot 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {showSuggestions && messages.length <= 1 && (
            <div style={{ padding: "8px 14px", borderTop: "1px solid rgba(255,255,255,0.04)", flexShrink: 0 }}>
              <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>{L.suggested}</p>
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                {(L.questions || []).map(q => (
                  <button key={q} onClick={() => handleSend(q)}
                    style={{ flexShrink: 0, padding: "5px 10px", borderRadius: "16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", fontSize: "11px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "10px 14px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={L.placeholder}
              style={{ flex: 1, background: "rgba(31,41,55,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "10px 14px", fontSize: "13px", color: "#f3f4f6", outline: "none", transition: "border-color 0.2s", fontFamily: "inherit" }}
              onFocus={e => { e.target.style.borderColor = "rgba(239,68,68,0.5)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }} />
            <button onClick={() => handleSend()} disabled={!input.trim()}
              style={{ width: 40, height: 40, borderRadius: "50%", background: input.trim() ? "linear-gradient(135deg, #ef4444, #f97316)" : "rgba(31,41,55,0.8)", border: "none", cursor: input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
              <Send style={{ width: 16, height: 16, color: input.trim() ? "#fff" : "#4b5563" }} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes vayubotPulse { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.5);opacity:0} }
        @keyframes vayubotSlideUp { from{opacity:0;transform:translateY(20px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes vayubotLabelPop { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes vayubotDot { 0%,80%,100%{transform:scale(.7);opacity:.4} 40%{transform:scale(1);opacity:1} }
        @media(max-width:480px){ .vayubot-fab{bottom:16px!important;right:16px!important} }
      `}</style>
    </>
  );
}
