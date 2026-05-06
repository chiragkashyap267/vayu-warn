// app/alerts/page.js
"use client";

import { useEffect, useState, useMemo } from "react";
import { subscribeToAlerts } from "@/services/alertService";
import AlertCard from "@/components/AlertCard";
import { useLang } from "@/context/LanguageContext";
import { BellRing, Loader2, Filter, Radio } from "lucide-react";

const SEVERITIES = ["all", "high", "medium", "low"];

export default function AlertsPage() {
  const { t } = useLang();
  const [alerts,   setAlerts]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");

  // Real-time Firestore listener
  useEffect(() => {
    const unsub = subscribeToAlerts((data) => {
      setAlerts(data);
      setLoading(false);
    });
    return unsub; // cleanup on unmount
  }, []);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const matchSeverity = filter === "all" || a.severity === filter;
      const matchSearch   = !search ||
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.location?.toLowerCase().includes(search.toLowerCase());
      return matchSeverity && matchSearch;
    });
  }, [alerts, filter, search]);

  const counts = useMemo(() => ({
    high:   alerts.filter((a) => a.severity === "high").length,
    medium: alerts.filter((a) => a.severity === "medium").length,
    low:    alerts.filter((a) => a.severity === "low").length,
  }), [alerts]);

  return (
    <div className="page-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-400 font-bold tracking-widest uppercase">{t("alerts_live")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <BellRing className="w-8 h-8 text-red-500" />
            {t("alerts_heading")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? t("alerts_connecting") : `${alerts.length} ${t("alerts_count")}`}
          </p>
        </div>

        {/* Severity summary pills */}
        {!loading && (
          <div className="flex gap-2 flex-wrap">
            <SummaryPill count={counts.high}   label="High"   color="bg-red-500/15 text-red-400 border-red-500/30" />
            <SummaryPill count={counts.medium} label="Medium" color="bg-yellow-400/15 text-yellow-400 border-yellow-400/30" />
            <SummaryPill count={counts.low}    label="Low"    color="bg-emerald-400/15 text-emerald-400 border-emerald-400/30" />
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-7">
        {/* Search */}
        <input
          type="text"
          placeholder={t("alerts_search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base sm:max-w-xs"
        />

        {/* Severity filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500" />
          {SEVERITIES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all capitalize ${
                filter === s
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingGrid />
      ) : filtered.length === 0 ? (
        <EmptyState hasAlerts={alerts.length > 0} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((alert, i) => (
            <div
              key={alert.id}
              className={`animate-fade-up stagger-${Math.min(i + 1, 5)}`}
            >
              <AlertCard alert={alert} />
            </div>
          ))}
        </div>
      )}

      {/* Live badge */}
      <div className="fixed bottom-6 left-6 flex items-center gap-2 glass rounded-full px-4 py-2 text-xs text-gray-400 border border-gray-800">
        <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
        Real-time · Firestore
      </div>
    </div>
  );
}

function SummaryPill({ count, label, color }) {
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${color}`}>
      {count} {label}
    </span>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-800 p-5 flex flex-col gap-3">
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-3 w-1/2 mt-2" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasAlerts }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <BellRing className="w-8 h-8 text-gray-600" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">
        {hasAlerts ? "No alerts match your filter" : "No active alerts"}
      </h3>
      <p className="text-gray-500 text-sm">
        {hasAlerts ? "Try changing the filter or search term." : "The area is clear. Stay alert."}
      </p>
    </div>
  );
}
