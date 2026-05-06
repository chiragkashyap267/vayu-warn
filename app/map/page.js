// app/map/page.js
// Using Leaflet + OpenStreetMap (zero signup, fully free)
// NOTE: Leaflet must be initialized completely synchronously after the container
// is sized. We use a plain div ref with a MutationObserver pattern to avoid the
// React Compiler / SSR timing issues with map.invalidateSize.
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { subscribeToAlerts } from "@/services/alertService";
import { getAllReports } from "@/services/reportService";
import { Map, Loader2, MapPin } from "lucide-react";

async function geocodeName(name) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name + ", India")}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {/* skip */}
  return null;
}

const COLORS = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };

export default function MapPage() {
  const containerRef = useRef(null);
  const [alerts,  setAlerts]  = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("alerts");
  // Map state stored in refs so React Compiler doesn't interfere
  const mapState = useRef({ L: null, map: null, markers: [] });

  // ── Draw markers (pure function, no hooks) ───────────────────────────────
  const drawMarkers = useCallback((currentAlerts, currentReports, currentTab) => {
    const { L, map, markers } = mapState.current;
    if (!L || !map) return;

    // Remove old markers
    markers.forEach((m) => { try { m.remove(); } catch {/* ok */} });
    mapState.current.markers = [];

    const toPlace = currentTab === "alerts" ? currentAlerts : currentReports;
    const bounds  = [];

    toPlace.forEach((item) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lng);
      if (isNaN(lat) || isNaN(lng)) return;
      bounds.push([lat, lng]);

      let icon;
      if (currentTab === "alerts") {
        const color  = COLORS[item.severity] ?? "#6b7280";
        const isHigh = item.severity === "high";
        const size   = isHigh ? 22 : 16;
        const pulse  = isHigh
          ? `<div style="position:absolute;top:50%;left:50%;width:44px;height:44px;
              border-radius:50%;border:2px solid ${color};opacity:0.7;
              transform:translate(-50%,-50%);
              animation:mapPulse 1.5s ease-out infinite;"></div>`
          : "";
        icon = L.divIcon({
          html: `<div style="position:relative;width:${size+20}px;height:${size+20}px;
                  display:flex;align-items:center;justify-content:center;">
                  ${pulse}
                  <div style="width:${size}px;height:${size}px;border-radius:50%;
                    background:${color};border:3px solid rgba(255,255,255,0.95);
                    box-shadow:0 0 16px ${color},0 0 32px ${color}66;
                    position:relative;z-index:2;"></div>
                </div>`,
          className: "",
          iconSize:  [size+20, size+20],
          iconAnchor:[(size+20)/2, (size+20)/2],
        });
        const m = L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:180px">
              <strong style="color:#f3f4f6;font-size:14px;display:block;margin-bottom:4px">${item.title}</strong>
              <span style="color:${color};font-size:11px;font-weight:800;text-transform:uppercase;
                background:${color}22;padding:2px 8px;border-radius:20px;display:inline-block;margin-bottom:6px">
                ● ${item.severity ?? "?"} severity
              </span>
              <div style="color:#9ca3af;font-size:12px;margin-bottom:4px">📍 ${item.location}</div>
              ${item.description ? `<div style="color:#d1d5db;font-size:12px">${item.description}</div>` : ""}
            </div>
          `);
        mapState.current.markers.push(m);
      } else {
        icon = L.divIcon({
          html: `<div style="width:14px;height:14px;border-radius:3px;
            background:#60a5fa;border:3px solid rgba(255,255,255,0.9);
            box-shadow:0 0 10px #60a5fa,0 0 20px #60a5fa66;"></div>`,
          className: "",
          iconSize:  [14, 14],
          iconAnchor:[7, 7],
        });
        const m = L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div>
              <strong style="color:#f3f4f6;font-size:14px;text-transform:capitalize">${item.type}</strong><br/>
              <span style="color:#9ca3af;font-size:12px">${item.description ?? ""}</span>
              ${item.image ? `<br/><img src="${item.image}" style="margin-top:6px;width:160px;border-radius:6px;object-fit:cover"/>` : ""}
            </div>
          `);
        mapState.current.markers.push(m);
      }
    });

    // Fit bounds
    if (bounds.length > 0) {
      if (bounds.length === 1) {
        map.setView(bounds[0], 11);
      } else {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
      }
    }
  }, []);

  // ── Main init effect ─────────────────────────────────────────────────────
  useEffect(() => {
    let unsub;
    let destroyed = false;

    // Use a concrete div reference captured at effect time
    const container = containerRef.current;
    if (!container) return;

    async function init() {
      // Inject Leaflet CSS as a <link> tag — avoids the style-recalc that
      // a dynamic CSS import causes AFTER L.map() measures the container.
      if (!document.getElementById("leaflet-css")) {
        await new Promise((resolve) => {
          const link = document.createElement("link");
          link.id   = "leaflet-css";
          link.rel  = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.onload = resolve;
          document.head.appendChild(link);
        });
      }
      if (destroyed) return;

      const L = (await import("leaflet")).default;
      if (destroyed) return;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      mapState.current.L = L;

      // Init map — container is now fully positioned (CSS done, layout stable)
      const map = L.map(container, { center: [22.5, 78.9], zoom: 5, zoomControl: true });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);
      mapState.current.map = map;

      // Subscribe to realtime alerts, enrich with geocoding
      unsub = subscribeToAlerts(async (data) => {
        if (destroyed) return;
        const enriched = await Promise.all(
          data.map(async (a) => {
            const lat = parseFloat(a.lat);
            const lng = parseFloat(a.lng);
            if (!isNaN(lat) && !isNaN(lng)) return a;
            const geo = await geocodeName(a.location ?? "");
            return geo ? { ...a, lat: geo.lat, lng: geo.lng } : a;
          })
        );
        if (destroyed) return;
        setAlerts(enriched);
        setLoading(false);
        drawMarkers(enriched, mapState.current._reports ?? [], "alerts");
      });

      try {
        const reps = await getAllReports();
        if (!destroyed) {
          setReports(reps);
          mapState.current._reports = reps;
        }
      } catch {/* ok */}
    }

    init();

    return () => {
      destroyed = true;
      unsub?.();
      if (mapState.current.map) {
        mapState.current.map.remove();
        mapState.current.map = null;
      }
      mapState.current.L = null;
      mapState.current.markers = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Redraw when tab changes ──────────────────────────────────────────────
  useEffect(() => {
    drawMarkers(alerts, reports, tab);
  }, [alerts, reports, tab, drawMarkers]);

  return (
    <div className="page-section pb-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Map className="w-7 h-7 text-red-500" />
            Disaster Map
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Live alert locations · community reports · colour-coded severity
          </p>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-gray-800">
          {[{ key: "alerts", label: "🔴 Alerts" }, { key: "reports", label: "🔵 Reports" }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-sm font-semibold transition-all ${
                tab === key ? "bg-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
        <LegendItem color="#ef4444" label="High Severity" />
        <LegendItem color="#f59e0b" label="Medium Severity" />
        <LegendItem color="#10b981" label="Low Severity" />
        <LegendItem color="#60a5fa" label="Community Report" shape="square" />
      </div>

      {/* Map container — position:relative required for absolute child */}
      <div
        style={{
          position: "relative",
          height: "calc(100vh - 280px)",
          minHeight: "400px",
          borderRadius: "1rem",
          border: "1px solid #1f2937",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-950/80 rounded-2xl">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
              <p className="text-gray-400 text-sm">Loading map &amp; geocoding alerts…</p>
            </div>
          </div>
        )}

        {/* The map div — explicit 100% width/height so Leaflet measures correctly */}
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "1rem",
            overflow: "hidden",
          }}
        />


        <button
          onClick={() => {
            if (!navigator.geolocation || !mapState.current.map) return;
            navigator.geolocation.getCurrentPosition((pos) => {
              mapState.current.map.setView([pos.coords.latitude, pos.coords.longitude], 13);
            });
          }}
          className="absolute bottom-4 right-4 z-[1000] p-3 glass rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-all"
          title="Centre on my location"
        >
          <MapPin className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </div>
  );
}

function LegendItem({ color, label, shape = "circle" }) {
  return (
    <div className="flex items-center gap-1.5">
      <div style={{
        background: color, width: 12, height: 12,
        borderRadius: shape === "circle" ? "50%" : 3,
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: `0 0 6px ${color}88`,
      }} />
      <span>{label}</span>
    </div>
  );
}
