// app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { addAlert, deleteAlert, subscribeToAlerts } from "@/services/alertService";
import { getAllReports, markReportReviewed } from "@/services/reportService";
import AlertCard from "@/components/AlertCard";
import {
  ShieldCheck, Plus, Trash2, Eye, Loader2,
  BellRing, FileText, MapPin, X, CheckCircle2,
  Image as ImageIcon, Search, Navigation,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPage() {
  return (
    <AuthGuard adminOnly>
      <AdminDashboard />
    </AuthGuard>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState("alerts");

  return (
    <div className="page-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-red-500" />
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage alerts and review community reports</p>
        </div>

        <div className="flex rounded-xl overflow-hidden border border-gray-800">
          {[
            { key: "alerts",  label: "Alerts",  Icon: BellRing },
            { key: "reports", label: "Reports", Icon: FileText },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all ${
                tab === key
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "alerts" ? <AlertsTab /> : <ReportsTab />}
    </div>
  );
}

/* ─── Alerts Tab ──────────────────────────────────────────────────────────── */
function AlertsTab() {
  const [alerts,  setAlerts]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAlerts((data) => {
      setAlerts(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this alert? This is irreversible.")) return;
    try {
      await deleteAlert(id);
      toast.success("Alert deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-gray-400 text-sm">{alerts.length} total alerts</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Alert"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 animate-fade-up">
          <AddAlertForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No alerts yet. Create one above.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} isAdmin onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Add Alert Form ──────────────────────────────────────────────────────── */
function AddAlertForm({ onSuccess }) {
  const [title,     setTitle]     = useState("");
  const [location,  setLocation]  = useState("");
  const [severity,  setSeverity]  = useState("medium");
  const [lat,       setLat]       = useState("");
  const [lng,       setLng]       = useState("");
  const [desc,      setDesc]      = useState("");
  const [saving,    setSaving]    = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [gpsing,    setGpsing]    = useState(false);

  // ── Nominatim reverse-geocode: location name → lat/lng ──────────────────
  async function geocodeLocation() {
    if (!location.trim()) { toast.error("Enter a location name first"); return; }
    setGeocoding(true);
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location + ", India")}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data.length > 0) {
        setLat(parseFloat(data[0].lat).toFixed(5));
        setLng(parseFloat(data[0].lon).toFixed(5));
        toast.success(`Found: ${data[0].display_name.split(",")[0]}`);
      } else {
        toast.error("Location not found — try a more specific name");
      }
    } catch {
      toast.error("Geocoding failed — enter coordinates manually");
    } finally {
      setGeocoding(false);
    }
  }

  // ── Use browser GPS for lat/lng ──────────────────────────────────────────
  function useGPS() {
    if (!navigator.geolocation) { toast.error("GPS not available"); return; }
    setGpsing(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(5));
        setLng(pos.coords.longitude.toFixed(5));
        toast.success("GPS coordinates filled!");
        setGpsing(false);
      },
      () => { toast.error("GPS access denied"); setGpsing(false); }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !location) { toast.error("Fill title and location."); return; }
    if (!lat || !lng)        { toast.error("Coordinates required — click 📍 Find to auto-fill."); return; }
    setSaving(true);
    try {
      await addAlert({
        title,
        location,
        severity,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        description: desc,
      });
      toast.success("Alert published!");
      onSuccess?.();
    } catch {
      toast.error("Failed to publish alert.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 border border-gray-800 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-white">Create New Alert</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Flood Alert" className="input-base" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Location *</label>
          <div className="flex gap-2">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Rishikesh, Uttarakhand"
              className="input-base flex-1"
              required
            />
            {/* Auto-geocode button */}
            <button
              type="button"
              onClick={geocodeLocation}
              disabled={geocoding}
              title="Auto-fill coordinates from location name"
              className="shrink-0 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-50"
            >
              {geocoding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              Find
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Severity *</label>
        <div className="flex gap-2">
          {["high", "medium", "low"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeverity(s)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all border ${
                severity === s
                  ? s === "high"   ? "bg-red-500/20 border-red-500 text-red-400"
                  : s === "medium" ? "bg-yellow-400/20 border-yellow-400 text-yellow-400"
                  : "bg-emerald-400/20 border-emerald-400 text-emerald-400"
                  : "border-gray-700 text-gray-500 hover:border-gray-500"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Coordinates row — with GPS button */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-gray-400">Coordinates * (auto-filled by "Find" button)</label>
          <button
            type="button"
            onClick={useGPS}
            disabled={gpsing}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            {gpsing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
            Use My GPS
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Latitude</label>
            <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="30.08690" className="input-base" required />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Longitude</label>
            <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="78.26760" className="input-base" required />
          </div>
        </div>
        {lat && lng && (
          <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Coordinates set — marker will appear on map
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Additional details…" rows={3} className="input-base resize-none" />
      </div>

      <button type="submit" disabled={saving} className="btn-primary py-3">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        {saving ? "Publishing…" : "Publish Alert"}
      </button>
    </form>
  );
}

/* ─── Reports Tab ─────────────────────────────────────────────────────────── */
function ReportsTab() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    getAllReports().then((data) => {
      setReports(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleReview(id) {
    try {
      await markReportReviewed(id);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "reviewed" } : r))
      );
      toast.success("Marked as reviewed");
    } catch {
      toast.error("Failed to update");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (reports.length === 0) {
    return <div className="text-center py-16 text-gray-500">No reports submitted yet.</div>;
  }

  return (
    <div>
      <p className="text-gray-400 text-sm mb-5">{reports.length} total reports</p>

      {/* Image preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreview(null)}>
          <div className="relative max-w-2xl w-full">
            <button onClick={() => setPreview(null)} className="absolute -top-10 right-0 text-white hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
            <img src={preview} alt="Report" className="w-full rounded-2xl border border-gray-700" />
          </div>
        </div>
      )}

      {/* Reports table (mobile: cards, desktop: table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-white capitalize">{r.type}</td>
                <td className="py-3 px-4 text-gray-400 max-w-[200px] truncate">{r.description}</td>
                <td className="py-3 px-4 text-gray-500 text-xs">
                  <MapPin className="w-3 h-3 inline mr-1" />{r.lat?.toFixed(3)}, {r.lng?.toFixed(3)}
                </td>
                <td className="py-3 px-4">
                  {r.image ? (
                    <button onClick={() => setPreview(r.image)} className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> View
                    </button>
                  ) : (
                    <span className="text-gray-600 text-xs">None</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    r.status === "reviewed"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-yellow-400/15 text-yellow-400"
                  }`}>
                    {r.status || "pending"}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 text-xs">{r.createdAt?.toLocaleDateString?.() ?? "—"}</td>
                <td className="py-3 px-4">
                  {r.status !== "reviewed" && (
                    <button onClick={() => handleReview(r.id)} className="btn-ghost text-xs py-1 px-2">
                      <CheckCircle2 className="w-3 h-3" /> Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {reports.map((r) => (
          <div key={r.id} className="glass rounded-2xl p-4 border border-gray-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white capitalize">{r.type}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                r.status === "reviewed" ? "bg-emerald-500/15 text-emerald-400" : "bg-yellow-400/15 text-yellow-400"
              }`}>
                {r.status || "pending"}
              </span>
            </div>
            <p className="text-gray-400 text-sm line-clamp-2">{r.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-xs"><MapPin className="w-3 h-3 inline mr-1" />{r.lat?.toFixed(3)}, {r.lng?.toFixed(3)}</span>
              <div className="flex gap-2">
                {r.image && (
                  <button onClick={() => setPreview(r.image)} className="btn-ghost text-xs py-1 px-2">
                    <Eye className="w-3 h-3" /> Photo
                  </button>
                )}
                {r.status !== "reviewed" && (
                  <button onClick={() => handleReview(r.id)} className="btn-ghost text-xs py-1 px-2">
                    <CheckCircle2 className="w-3 h-3" /> Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
