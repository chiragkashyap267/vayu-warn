// components/AlertTicker.js
// ─────────────────────────────────────────────────────────────────────────────
// Persistent scrolling ticker shown below the navbar on ALL pages when there
// are active alerts. Shows severity badge + title + location in a marquee.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { subscribeToAlerts } from "@/services/alertService";
import { BellRing, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AlertTicker() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const unsub = subscribeToAlerts(setAlerts);
    return unsub;
  }, []);

  if (alerts.length === 0) return null;

  const hasHigh = alerts.some((a) => a.severity === "high");

  // Build ticker text items
  const items = alerts.map((a) => {
    const dot = a.severity === "high" ? "🔴" : a.severity === "medium" ? "🟡" : "🟢";
    return `${dot} ${a.severity?.toUpperCase()} · ${a.title} · 📍 ${a.location}`;
  });

  const tickerText = items.join("     ·····     ");

  return (
    <Link
      href="/alerts"
      className={`
        block w-full overflow-hidden
        ${hasHigh
          ? "bg-red-950/90 border-b border-red-500/50 text-red-200"
          : "bg-yellow-950/80 border-b border-yellow-500/30 text-yellow-200"
        }
        backdrop-blur-md
      `}
      style={{ zIndex: 49 }} // just below navbar (z-50)
    >
      <div className="flex items-center">
        {/* Fixed left badge */}
        <div className={`
          shrink-0 flex items-center gap-2 px-4 py-2 font-black text-xs tracking-widest uppercase
          ${hasHigh
            ? "bg-red-600 text-white"
            : "bg-yellow-500 text-gray-900"
          }
        `}>
          {hasHigh
            ? <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            : <BellRing className="w-3.5 h-3.5" />
          }
          LIVE ALERT
        </div>

        {/* Scrolling marquee */}
        <div className="flex-1 overflow-hidden py-2 px-3">
          <div className="flex whitespace-nowrap animate-ticker text-xs font-semibold tracking-wide">
            {/* Duplicate for seamless loop */}
            <span className="mr-16">{tickerText}</span>
            <span className="mr-16">{tickerText}</span>
          </div>
        </div>

        {/* Alert count badge */}
        <div className={`
          shrink-0 px-3 py-2 text-xs font-black
          ${hasHigh ? "text-red-400" : "text-yellow-400"}
        `}>
          {alerts.length} Active
        </div>
      </div>
    </Link>
  );
}
