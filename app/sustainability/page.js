// app/sustainability/page.js
// ─────────────────────────────────────────────────────────────────────────────
// Sustainability Impact page — addresses the competition's 20% sustainability
// criteria and the problem statement goal: "Improve climate resilience"
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useLang } from "@/context/LanguageContext";
import Link from "next/link";
import {
  Leaf, Zap, Globe, Users, BellRing, ShieldCheck, TrendingDown,
  CloudRain, Mountain, Flame, Wind, ArrowRight, CheckCircle2,
  BarChart3, HeartHandshake, Smartphone,
} from "lucide-react";

// ── Static data (same in both languages) ─────────────────────────────────────
const IMPACT_METRICS = [
  { value: "< 1s",  label: "Alert Delivery Time",     sub: "vs 15–30 min for SMS broadcasts", Icon: Zap,         color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  { value: "0",     label: "Paper / Physical Infra",   sub: "Fully digital — zero print waste", Icon: Leaf,        color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { value: "100%",  label: "Renewable Cloud Infra",    sub: "Firebase runs on Google's carbon-neutral cloud", Icon: Globe,  color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { value: "∞",     label: "Scalability",              sub: "No hardware needed — scales to any village", Icon: BarChart3, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
];

const DISASTER_COVERAGE = [
  { Icon: CloudRain, label: "Floods",      color: "text-blue-400",    bg: "bg-blue-500/10"     },
  { Icon: Mountain,  label: "Landslides",  color: "text-yellow-400",  bg: "bg-yellow-400/10"  },
  { Icon: Zap,       label: "Earthquakes", color: "text-red-400",     bg: "bg-red-500/10"      },
  { Icon: Flame,     label: "Wildfires",   color: "text-orange-400",  bg: "bg-orange-500/10"  },
  { Icon: Wind,      label: "Cyclones",    color: "text-purple-400",  bg: "bg-purple-500/10"  },
  { Icon: Globe,     label: "Droughts",    color: "text-amber-400",   bg: "bg-amber-500/10"   },
];

const SDG_GOALS = [
  {
    num: "SDG 11",
    label: "Sustainable Cities & Communities",
    desc: "Provides early warning systems to make human settlements safer and more resilient to natural disasters.",
    color: "text-orange-400",
    border: "border-orange-400/30",
    bg: "bg-orange-400/5",
  },
  {
    num: "SDG 13",
    label: "Climate Action",
    desc: "Directly addresses climate resilience by enabling faster community response to climate-induced disasters.",
    color: "text-emerald-400",
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/5",
  },
  {
    num: "SDG 3",
    label: "Good Health & Well-being",
    desc: "Reduces disaster fatalities through faster alerts, instant helpline access, and verified safety guidance.",
    color: "text-blue-400",
    border: "border-blue-400/30",
    bg: "bg-blue-400/5",
  },
  {
    num: "SDG 10",
    label: "Reduced Inequalities",
    desc: "Brings disaster information to rural and linguistically diverse communities via multi-language support.",
    color: "text-purple-400",
    border: "border-purple-400/30",
    bg: "bg-purple-400/5",
  },
];

const HOW_RESILIENT = [
  {
    Icon: BellRing,
    title: "Faster Alerts = More Evacuation Time",
    desc: "Traditional SMS alert systems take 15–30 minutes. VayuWarn pushes alerts to every device in under 1 second via Firestore WebSockets — giving communities critical extra time to evacuate.",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    Icon: Users,
    title: "Community-Powered Ground Truth",
    desc: "Official agencies can't monitor every valley and village. Our crowd-sourced report system turns every citizen into a sensor — capturing disasters that slip through official monitoring gaps.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    Icon: Smartphone,
    title: "Low-Bandwidth Design",
    desc: "All pages are lightweight, text-first, and functional on 2G networks. No heavy maps loaded until requested. The Emergency page works instantly even with slow connectivity.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    Icon: HeartHandshake,
    title: "Multi-Language Inclusion",
    desc: "Hindi + English support ensures alerts reach rural populations who may not be comfortable in English — directly addressing linguistic barriers in disaster communication.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  {
    Icon: ShieldCheck,
    title: "Verified Alert Pipeline",
    desc: "Community reports go through admin verification before publishing — eliminating panic from misinformation, a key risk factor that leads to dangerous crowd behavior during disasters.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    Icon: TrendingDown,
    title: "Reducing Disaster Response Costs",
    desc: "Faster, more accurate alerts reduce the scale of emergency response needed. Fewer people in danger zones means lower rescue costs, fewer injuries, and faster community recovery.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
];

export default function SustainabilityPage() {
  const { t } = useLang();

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-emerald-600/8 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-emerald-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="page-section relative">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6">
            <Leaf className="w-3.5 h-3.5" />
            DesignForge '26 · Sustainability Goal
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Engineering the{" "}
            <span style={{ background: "linear-gradient(135deg, #34d399, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Rhythm
            </span>{" "}
            of a{" "}
            <span style={{ background: "linear-gradient(135deg, #34d399, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Greener World
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            VayuWarn is more than a disaster alert system — it&apos;s a climate resilience platform designed to protect communities from the growing frequency of climate-induced disasters.
          </p>
        </div>

        {/* ── Impact Metrics ──────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {IMPACT_METRICS.map(({ value, label, sub, Icon, color, bg, border }) => (
              <div
                key={label}
                className={`glass rounded-2xl p-6 border ${border} flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <div className={`text-3xl font-black ${color}`}>{value}</div>
                  <div className="text-white font-bold text-sm mt-1">{label}</div>
                  <div className="text-gray-500 text-xs mt-1 leading-snug">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How VayuWarn Builds Resilience ─────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              How VayuWarn Builds Climate Resilience
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">
              Each design decision directly maps to a measurable sustainability outcome.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HOW_RESILIENT.map(({ Icon, title, desc, color, bg, border }, i) => (
              <div
                key={title}
                className={`animate-fade-up stagger-${(i % 5) + 1} glass rounded-2xl p-6 border ${border} hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-base font-black text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Disaster Coverage ───────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="glass rounded-3xl p-8 border border-gray-800">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white">Disaster Coverage</h2>
              <p className="text-gray-500 text-sm mt-2">VayuWarn covers all major climate-induced disaster types affecting India</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {DISASTER_COVERAGE.map(({ Icon, label, color, bg }) => (
                <div key={label} className={`flex flex-col items-center gap-2 p-4 ${bg} rounded-2xl`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                  <span className="text-white text-xs font-bold text-center">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── UN SDG Alignment ────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              UN Sustainable Development Goals
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">
              VayuWarn directly supports 4 of the 17 UN SDGs — demonstrating global-scale sustainability alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SDG_GOALS.map(({ num, label, desc, color, border, bg }) => (
              <div
                key={num}
                className={`glass rounded-2xl p-6 border ${border} ${bg} flex gap-4`}
              >
                <div className={`shrink-0 w-14 h-14 rounded-2xl border ${border} flex items-center justify-center`}>
                  <span className={`text-[10px] font-black ${color} text-center leading-tight`}>{num}</span>
                </div>
                <div>
                  <h3 className={`font-black text-sm ${color} mb-1`}>{label}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── vs Traditional Systems ──────────────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              VayuWarn vs. Traditional Alert Systems
            </h2>
          </div>

          <div className="glass rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-6 text-gray-500 text-xs uppercase tracking-wider font-bold">Feature</th>
                    <th className="text-center py-4 px-6 text-gray-500 text-xs uppercase tracking-wider font-bold">Traditional SMS/Radio</th>
                    <th className="text-center py-4 px-6 text-emerald-400 text-xs uppercase tracking-wider font-bold">VayuWarn</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Alert Speed",         "15–30 min",    "< 1 second"],
                    ["Community Reports",   "❌ None",       "✅ GPS + Photo"],
                    ["Multi-language",      "❌ Rare",       "✅ Hindi + English"],
                    ["Interactive Map",     "❌ None",       "✅ Live Leaflet Map"],
                    ["Emergency Mode",      "❌ None",       "✅ One-tap helplines"],
                    ["Infra Cost",          "High (towers)", "Minimal (Firebase)"],
                    ["Offline Capability",  "✅ SMS works",  "⚠️ Needs data"],
                    ["Scalability",         "Limited",       "✅ Infinite (cloud)"],
                  ].map(([feat, old, nw], i) => (
                    <tr key={feat} className={`border-b border-gray-800/50 ${i % 2 === 0 ? "bg-gray-900/20" : ""}`}>
                      <td className="py-3 px-6 font-semibold text-white">{feat}</td>
                      <td className="py-3 px-6 text-center text-gray-400">{old}</td>
                      <td className="py-3 px-6 text-center text-emerald-400 font-semibold">{nw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Future Roadmap ──────────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="glass rounded-3xl p-8 md:p-10 border border-emerald-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5" />
            <div className="relative">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-white">Sustainability Roadmap</h2>
                <p className="text-gray-500 mt-2 text-sm">Planned features to deepen climate resilience impact</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    phase: "Phase 2",
                    items: ["Offline PWA mode (works without internet)", "SMS fallback for 2G areas", "Push notification alerts"],
                    color: "text-blue-400",
                    border: "border-blue-400/30",
                  },
                  {
                    phase: "Phase 3",
                    items: ["AI-powered flood/landslide prediction", "Integration with IMD weather APIs", "Automated severity scoring"],
                    color: "text-purple-400",
                    border: "border-purple-400/30",
                  },
                  {
                    phase: "Phase 4",
                    items: ["10+ regional language support", "Accessible UI for visually impaired", "Village-level granular alerts"],
                    color: "text-emerald-400",
                    border: "border-emerald-400/30",
                  },
                ].map(({ phase, items, color, border }) => (
                  <div key={phase} className={`glass rounded-2xl p-5 border ${border}`}>
                    <div className={`text-xs font-black tracking-widest uppercase ${color} mb-3`}>{phase}</div>
                    <ul className="flex flex-col gap-2">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                          <CheckCircle2 className={`w-4 h-4 ${color} shrink-0 mt-0.5`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Experience the platform</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/alerts" className="btn-primary px-6 py-3">
              <BellRing className="w-5 h-5" />
              View Live Alerts
            </Link>
            <Link href="/map" className="btn-ghost px-6 py-3">
              View Map
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
