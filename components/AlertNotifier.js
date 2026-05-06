// components/AlertNotifier.js
"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeToAlerts } from "@/services/alertService";
import { AlertTriangle, X, BellRing, Volume2 } from "lucide-react";

// ── Siren (original simple sawtooth wail) ────────────────────────────────────
function playSiren(durationSec = 4) {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    const t = ctx.currentTime;
    // Wail up and down twice
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.linearRampToValueAtTime(880, t + 0.8);
    osc.frequency.linearRampToValueAtTime(440, t + 1.6);
    osc.frequency.linearRampToValueAtTime(880, t + 2.4);
    osc.frequency.linearRampToValueAtTime(440, t + durationSec);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);
    osc.start(t);
    osc.stop(t + durationSec);
  } catch {
    // Autoplay policy blocked — silently skip
  }
}


// ── Browser Notification (Web Notifications API) ──────────────────────────────
async function sendBrowserNotif(title, body, severity) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
  if (Notification.permission !== "granted") return;
  try {
    new Notification(`🚨 VayuWarn — ${title}`, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: `vayu-${severity}-${Date.now()}`,
      requireInteraction: severity === "high",
    });
  } catch {/* ignore */}
}

const SEVERITY_STYLES = {
  high:   { bg: "bg-red-950/95 border-red-500/60",   icon: "text-red-400",    badge: "bg-red-600",    label: "🚨 HIGH ALERT"  },
  medium: { bg: "bg-yellow-950/95 border-yellow-500/50", icon: "text-yellow-400", badge: "bg-yellow-500 text-gray-900", label: "⚠️ ALERT"    },
  low:    { bg: "bg-blue-950/95 border-blue-500/40",  icon: "text-blue-400",   badge: "bg-blue-600",   label: "ℹ️ ADVISORY"   },
};

export default function AlertNotifier() {
  const seenIds = useRef(new Set());
  const isFirst = useRef(true);
  const [queue, setQueue] = useState([]);

  // Request browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const unsub = subscribeToAlerts((alerts) => {
      if (isFirst.current) {
        alerts.forEach((a) => seenIds.current.add(a.id));
        isFirst.current = false;
        return;
      }

      const newAlerts = alerts.filter((a) => !seenIds.current.has(a.id));
      if (!newAlerts.length) return;

      newAlerts.forEach((a) => {
        seenIds.current.add(a.id);
        // Browser notification for EVERY new alert
        sendBrowserNotif(
          a.title,
          `${a.severity?.toUpperCase()} · 📍 ${a.location}${a.description ? " · " + a.description.slice(0, 80) : ""}`,
          a.severity
        );
      });

      // Siren only for HIGH
      if (newAlerts.some((a) => a.severity === "high")) playSiren(5);

      setQueue((prev) => [
        ...newAlerts.map((a) => ({
          uid: `${a.id}-${Date.now()}`,
          id: a.id,
          title: a.title,
          location: a.location,
          severity: a.severity ?? "medium",
        })),
        ...prev,
      ]);
    });
    return unsub;
  }, []);

  // Auto-dismiss oldest after 9s
  useEffect(() => {
    if (!queue.length) return;
    const t = setTimeout(() => setQueue((p) => p.slice(0, -1)), 9000);
    return () => clearTimeout(t);
  }, [queue]);

  const dismiss = (uid) => setQueue((p) => p.filter((n) => n.uid !== uid));

  if (!queue.length) return null;

  return (
    <div className="fixed top-20 right-4 z-[999] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]">
      {queue.map((notif, i) => {
        const s = SEVERITY_STYLES[notif.severity] ?? SEVERITY_STYLES.medium;
        return (
          <div
            key={notif.uid}
            className={`
              animate-slide-in-right relative
              flex items-start gap-3 p-4 rounded-2xl border shadow-2xl
              ${s.bg} backdrop-blur-xl
              transition-all duration-300
              ${i > 0 ? "opacity-60 scale-[0.97]" : ""}
            `}
            style={{ transform: `translateY(${i * 5}px)` }}
          >
            <div className={`shrink-0 mt-0.5 ${s.icon}`}>
              {notif.severity === "high"
                ? <AlertTriangle className="w-5 h-5 animate-pulse" />
                : <BellRing className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-black tracking-widest text-white px-2.5 py-0.5 rounded-full ${s.badge}`}>
                  {s.label}
                </span>
                {notif.severity === "high" && (
                  <span className="text-[10px] text-red-400 font-bold flex items-center gap-0.5 animate-pulse">
                    <Volume2 className="w-3 h-3" /> SIREN
                  </span>
                )}
              </div>
              <p className="text-sm font-black text-white leading-tight">{notif.title}</p>
              {notif.location && (
                <p className="text-xs text-gray-400 mt-0.5">📍 {notif.location}</p>
              )}
              <p className="text-[10px] text-gray-600 mt-1.5">New alert published · tap to view alerts</p>
            </div>

            <button
              onClick={() => dismiss(notif.uid)}
              className="shrink-0 p-1 rounded-lg text-gray-600 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-b-2xl overflow-hidden">
              <div className="h-full bg-white/30 animate-shrink-width" style={{ animationDuration: "9s" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
