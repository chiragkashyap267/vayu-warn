// components/AlertCard.js
"use client";

import { useState } from "react";
import { MapPin, Clock, Trash2, AlertTriangle, X } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";

const SEVERITY_CONFIG = {
  high:   { label: "HIGH",   dot: "bg-red-500",    border: "border-red-500/50",    glow: "shadow-red-500/20",    text: "text-red-400",    bg: "bg-red-500/10",    pulse: true,  ring: "ring-red-500/20"   },
  medium: { label: "MEDIUM", dot: "bg-yellow-400",  border: "border-yellow-400/50", glow: "shadow-yellow-400/20", text: "text-yellow-400", bg: "bg-yellow-400/10", pulse: false, ring: "ring-yellow-400/20" },
  low:    { label: "LOW",    dot: "bg-emerald-400", border: "border-emerald-400/50",glow: "shadow-emerald-400/20",text: "text-emerald-400",bg: "bg-emerald-400/10",pulse: false, ring: "ring-emerald-400/20"},
};

// Inline confirm dialog — replaces browser confirm() which is blocked in dev
function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div className="absolute inset-0 z-20 rounded-2xl bg-gray-950/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-6 border border-red-500/30">
      <AlertTriangle className="w-8 h-8 text-red-400" />
      <p className="text-white font-bold text-sm text-center">Delete this alert?</p>
      <p className="text-gray-500 text-xs text-center">This action cannot be undone.</p>
      <div className="flex gap-2 w-full mt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl border border-gray-700 text-gray-300 text-sm font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-1"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all flex items-center justify-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}

export default function AlertCard({ alert, onDelete, isAdmin }) {
  const s = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.low;
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      className={`
        relative group rounded-2xl border bg-gray-900/70 backdrop-blur-sm
        p-5 flex flex-col gap-3 shadow-lg transition-all duration-300 overflow-hidden
        hover:-translate-y-1 hover:shadow-2xl ring-1 ring-transparent hover:${s.ring}
        ${s.border} ${s.glow}
        ${alert.severity === "high" ? "animate-card-pulse-high" : ""}
      `}
    >
      {/* ── Severity glow bar (left edge) ──────────────────────────────────── */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${s.dot} rounded-l-2xl`} />

      {/* ── High severity animated background shimmer ───────────────────── */}
      {alert.severity === "high" && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 animate-shimmer-card pointer-events-none" />
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2 pl-3 relative z-10">
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-white text-base leading-snug">{alert.title}</h3>
        </div>
        <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest ${s.bg} ${s.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? "animate-pulse" : ""}`} />
          {s.label}
        </span>
      </div>

      {/* ── Description ───────────────────────────────────────────────────── */}
      {alert.description && (
        <p className="text-gray-400 text-sm leading-relaxed pl-3 line-clamp-2 relative z-10">
          {alert.description}
        </p>
      )}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 pl-3 relative z-10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" /> {alert.location}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" /> {formatDistanceToNow(alert.createdAt)}
          </span>
        </div>

        {isAdmin && onDelete && (
          <button
            onClick={() => setConfirming(true)}
            className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
            aria-label="Delete alert"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Inline confirm overlay ─────────────────────────────────────────── */}
      {confirming && (
        <DeleteConfirm
          onConfirm={() => { setConfirming(false); onDelete(alert.id); }}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
