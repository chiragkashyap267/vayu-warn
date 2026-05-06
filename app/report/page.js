// app/report/page.js
"use client";

import { useState, useRef } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/context/LanguageContext";
import { uploadToCloudinary } from "@/services/uploadService";
import { submitReport } from "@/services/reportService";
import {
  FileText, Upload, MapPin, Loader2, CheckCircle2,
  Image as ImageIcon, X, AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

const DISASTER_TYPES = [
  { value: "flood",     label: "🌊 Flood"      },
  { value: "landslide", label: "⛰️ Landslide"  },
  { value: "earthquake",label: "🌍 Earthquake"  },
  { value: "fire",      label: "🔥 Fire"        },
  { value: "cyclone",   label: "🌀 Cyclone"     },
  { value: "drought",   label: "☀️ Drought"    },
  { value: "other",     label: "⚠️ Other"      },
];

export default function ReportPage() {
  return (
    <AuthGuard>
      <ReportForm />
    </AuthGuard>
  );
}

function ReportForm() {
  const { user } = useAuth();
  const { t }    = useLang();
  const fileRef  = useRef(null);

  const [type,       setType]       = useState("");
  const [desc,       setDesc]       = useState("");
  const [file,       setFile]       = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [locating,   setLocating]   = useState(false);
  const [lat,        setLat]        = useState("");
  const [lng,        setLng]        = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5 MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function getLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocating(false);
        toast.success("Location detected!");
      },
      () => {
        setLocating(false);
        toast.error("Could not get location. Please enter manually.");
      }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!type)        return toast.error("Select a disaster type.");
    if (!desc.trim()) return toast.error("Add a description.");
    if (!lat || !lng) return toast.error("Location is required.");

    setSubmitting(true);
    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }
      await submitReport({
        userId: user.uid,
        type,
        description: desc,
        image: imageUrl,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });
      setDone(true);
      toast.success("Report submitted! Thank you.");
    } catch (err) {
      toast.error(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center flex flex-col items-center gap-4 animate-fade-up">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white">{t("report_done_h")}</h2>
          <p className="text-gray-400 max-w-sm">
            {t("report_done_p")}
          </p>
          <button
            onClick={() => {
              setDone(false); setType(""); setDesc("");
              setFile(null); setPreview(null); setLat(""); setLng("");
            }}
            className="btn-primary mt-2"
          >
            {t("report_another")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-red-500" />
          {t("report_heading")}
        </h1>
        <p className="text-gray-500 text-sm">
          {t("report_subhead")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Disaster type */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {t("report_type")} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DISASTER_TYPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all ${
                  type === value
                    ? "bg-red-600/20 border-red-500 text-red-400"
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {t("report_desc")} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={t("report_desc_ph")}
            rows={4}
            className="input-base resize-none"
            required
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {t("report_photo")}
          </label>
          {preview ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-700">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 p-1.5 bg-gray-900/80 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-700 hover:border-red-500/50 rounded-xl p-8 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-all"
            >
              <ImageIcon className="w-8 h-8" />
              <span className="text-sm font-medium">{t("report_upload")}</span>
              <span className="text-xs">JPG, PNG, WEBP — max 5 MB</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {t("report_location")} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="input-base"
              step="any"
              required
            />
            <input
              type="number"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="input-base"
              step="any"
              required
            />
          </div>
          <button
            type="button"
            onClick={getLocation}
            disabled={locating}
            className="btn-ghost text-sm"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4 text-red-400" />
            )}
            {locating ? t("report_getting") : t("report_my_loc")}
          </button>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-400/80">
            {t("report_warning")}
          </p>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary py-3 text-base">
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("report_submitting")}
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              {t("report_submit")}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
