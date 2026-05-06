// app/emergency/page.js
"use client";

import { useEffect, useState } from "react";
import { subscribeToAlerts } from "@/services/alertService";
import AlertCard from "@/components/AlertCard";
import { useLang } from "@/context/LanguageContext";
import { AlertTriangle, Phone, Siren, Shield, X, ChevronDown, ChevronUp } from "lucide-react";

const HELPLINES = [
  { label: "National Disaster Helpline", number: "1078",        color: "text-red-400",     bg: "bg-red-500/10"     },
  { label: "Police",                     number: "100",          color: "text-blue-400",    bg: "bg-blue-500/10"    },
  { label: "Fire Brigade",               number: "101",          color: "text-orange-400",  bg: "bg-orange-500/10"  },
  { label: "Ambulance (NDMA)",           number: "108",          color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "NDRF HQ",                    number: "011-24363260", color: "text-purple-400",  bg: "bg-purple-500/10"  },
  { label: "PM Helpline",                number: "1800-11-1363", color: "text-yellow-400",  bg: "bg-yellow-500/10"  },
];

const SAFETY_TIPS = {
  Flood:      ["Move to high ground immediately.", "Do not walk through moving water.", "Disconnect all electrical appliances.", "Follow official evacuation routes."],
  Landslide:  ["Move away from the slide path.", "Avoid river valleys during heavy rain.", "Do not return until declared safe.", "Listen for rumbling sounds."],
  Earthquake: ["Drop, Cover, and Hold On.", "Stay away from windows.", "If outdoors, move away from buildings.", "After shaking stops, check for gas leaks."],
  Cyclone:    ["Stay indoors, away from windows.", "Keep emergency kit ready.", "Follow evacuation orders immediately.", "Do not go outside during the eye of the storm."],
  Fire:       ["Evacuate immediately.", "Crawl low under smoke.", "Close doors to slow fire spread.", "Call 101 from outside the building."],
  General:    ["Stay calm and follow official instructions.", "Keep emergency contacts handy.", "Help vulnerable neighbours.", "Have a 72-hour emergency kit ready."],
};

export default function EmergencyPage() {
  const { t } = useLang();
  const [active,     setActive]   = useState(false);
  const [alerts,     setAlerts]   = useState([]);
  const [expanded,   setExpanded] = useState(null);

  useEffect(() => {
    if (!active) return;
    const unsub = subscribeToAlerts((data) =>
      setAlerts(data.filter((a) => a.severity === "high").slice(0, 3))
    );
    return unsub;
  }, [active]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${active ? "bg-red-950/20" : ""}`}>
      <div className="page-section max-w-3xl mx-auto">
        {!active ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px]" />
            </div>
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white">{t("emergency_heading")}</h1>
            <p className="text-gray-400 max-w-md">
              {t("emergency_desc")}
            </p>
            <button
              onClick={() => setActive(true)}
              className="mt-4 px-12 py-5 rounded-2xl text-xl font-black text-white bg-red-600 hover:bg-red-500 transition-all animate-emergency flex items-center gap-3"
            >
              <Siren className="w-6 h-6" />
              {t("emergency_activate")}
            </button>
            <p className="text-gray-600 text-xs">{t("emergency_caution")}</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Active bar */}
            <div className="flex items-center justify-between mb-6 glass rounded-2xl px-5 py-3 border border-red-500/30">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 font-black tracking-widest text-sm uppercase">{t("emergency_active")}</span>
              </div>
              <button onClick={() => setActive(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Helplines */}
            <section className="mb-8">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-400" /> {t("emergency_helplines")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HELPLINES.map(({ label, number, color, bg }) => (
                  <a key={number} href={`tel:${number}`}
                    className={`flex items-center gap-4 p-4 rounded-2xl border border-gray-800 ${bg} hover:border-gray-600 transition-all hover:scale-[1.02] active:scale-100`}
                  >
                    <div>
                      <p className={`font-black text-xl leading-none ${color}`}>{number}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{label}</p>
                    </div>
                    <span className="ml-auto text-gray-600 text-xs">{t("emergency_tap_call")}</span>
                  </a>
                ))}
              </div>
            </section>

            {/* Safety tips */}
            <section className="mb-8">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" /> {t("emergency_safety")}
              </h2>
              <div className="flex flex-col gap-2">
                {Object.entries(SAFETY_TIPS).map(([key, tips]) => (
                  <div key={key} className="glass rounded-xl border border-gray-800 overflow-hidden">
                    <button
                      onClick={() => setExpanded(expanded === key ? null : key)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-all"
                    >
                      <span className="font-semibold text-white">{key}</span>
                      {expanded === key ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {expanded === key && (
                      <ul className="px-5 pb-4 flex flex-col gap-2">
                        {tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />{tip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* High severity alerts */}
            <section>
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" /> {t("emergency_high")}
              </h2>
              {alerts.length === 0 ? (
                <div className="glass rounded-xl p-6 text-center text-gray-500 text-sm border border-gray-800">
                  {t("emergency_none")}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
