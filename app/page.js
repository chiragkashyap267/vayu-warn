// app/page.js — Landing / Hero  (with language support + How It Works)
"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import {
  AlertTriangle, BellRing, Map, FileText, Zap, Shield, Users,
  UserCheck, ShieldCheck, Radio, Siren, ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const { t } = useLang();

  const STATS = [
    { label: t("stat_alert_types"),  value: "8+",   Icon: AlertTriangle },
    { label: t("stat_realtime"),     value: "< 1s",  Icon: Zap           },
    { label: t("stat_always_on"),    value: "24/7",  Icon: Shield        },
    { label: t("stat_community"),    value: "Open",  Icon: Users         },
  ];

  const FEATURES = [
    {
      Icon: BellRing,
      title: t("feat_alerts_title"),
      desc:  t("feat_alerts_desc"),
      color: "text-red-400",
      bg:    "bg-red-500/10",
      border:"border-red-500/20",
    },
    {
      Icon: Map,
      title: t("feat_map_title"),
      desc:  t("feat_map_desc"),
      color: "text-blue-400",
      bg:    "bg-blue-500/10",
      border:"border-blue-500/20",
    },
    {
      Icon: FileText,
      title: t("feat_reports_title"),
      desc:  t("feat_reports_desc"),
      color: "text-emerald-400",
      bg:    "bg-emerald-500/10",
      border:"border-emerald-500/20",
    },
    {
      Icon: AlertTriangle,
      title: t("feat_emergency_title"),
      desc:  t("feat_emergency_desc"),
      color: "text-orange-400",
      bg:    "bg-orange-500/10",
      border:"border-orange-500/20",
    },
  ];

  const HOW_STEPS = [
    {
      num: "01",
      Icon: UserCheck,
      title: t("how_step1_title"),
      desc:  t("how_step1_desc"),
      color: "text-blue-400",
      bg:    "bg-blue-500/10",
      border:"border-blue-500/20",
      glow:  "shadow-blue-500/10",
    },
    {
      num: "02",
      Icon: ShieldCheck,
      title: t("how_step2_title"),
      desc:  t("how_step2_desc"),
      color: "text-yellow-400",
      bg:    "bg-yellow-400/10",
      border:"border-yellow-400/20",
      glow:  "shadow-yellow-400/10",
    },
    {
      num: "03",
      Icon: Radio,
      title: t("how_step3_title"),
      desc:  t("how_step3_desc"),
      color: "text-red-400",
      bg:    "bg-red-500/10",
      border:"border-red-500/20",
      glow:  "shadow-red-500/10",
    },
    {
      num: "04",
      Icon: Siren,
      title: t("how_step4_title"),
      desc:  t("how_step4_desc"),
      color: "text-emerald-400",
      bg:    "bg-emerald-500/10",
      border:"border-emerald-500/20",
      glow:  "shadow-emerald-500/10",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-48 w-[400px] h-[400px] bg-orange-500/8 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[300px] bg-red-900/15 rounded-full blur-[100px]" />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="page-section relative flex flex-col items-center text-center gap-6 py-20 md:py-32">
        <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-widest uppercase">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          {t("hero_badge")}
        </div>

        <h1 className="animate-fade-up stagger-1 text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
          {t("hero_h1_a")}{" "}
          <span className="gradient-text">{t("hero_h1_b")}</span>
        </h1>

        <p className="animate-fade-up stagger-2 max-w-xl text-gray-400 text-lg md:text-xl leading-relaxed">
          {t("hero_desc")}
        </p>

        <div className="animate-fade-up stagger-3 flex flex-wrap items-center justify-center gap-3 mt-2">
          <Link href="/alerts" className="btn-primary text-base px-6 py-3">
            <BellRing className="w-5 h-5" />
            {t("hero_btn_alerts")}
          </Link>
          <Link href="/emergency" className="btn-ghost text-base px-6 py-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            {t("hero_btn_emergency")}
          </Link>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-up stagger-4 mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
          {STATS.map(({ label, value, Icon }) => (
            <div key={label} className="glass rounded-xl p-4 flex flex-col items-center gap-1">
              <Icon className="w-5 h-5 text-red-400" />
              <span className="text-2xl font-black text-white">{value}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="page-section relative py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            {t("feat_heading")}
          </h2>
          <p className="text-gray-500 mt-3 text-base max-w-lg mx-auto">
            {t("feat_subhead")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map(({ Icon, title, desc, color, bg, border }, i) => (
            <div
              key={title}
              className={`
                animate-fade-up stagger-${i + 1}
                glass rounded-2xl p-6 border ${border}
                hover:-translate-y-1 hover:shadow-xl transition-all duration-300
              `}
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="page-section relative py-16">
        {/* Section background accent */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-red-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="text-center mb-14">
          <span className="inline-block text-xs font-black tracking-widest uppercase text-red-400 mb-3 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
            User Flow
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            {t("how_heading")}
          </h2>
          <p className="text-gray-500 mt-3 text-base max-w-lg mx-auto">
            {t("how_subhead")}
          </p>
        </div>

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {HOW_STEPS.map(({ num, Icon, title, desc, color, bg, border, glow }, i) => (
              <div key={num} className="flex flex-col items-center text-center group">
                {/* Step circle */}
                <div
                  className={`
                    w-[104px] h-[104px] rounded-full ${bg} border-2 ${border}
                    flex flex-col items-center justify-center mb-5 shadow-lg ${glow}
                    group-hover:scale-110 transition-transform duration-300
                  `}
                >
                  <span className={`text-xs font-black tracking-widest ${color} opacity-70`}>{num}</span>
                  <Icon className={`w-7 h-7 ${color} mt-1`} />
                </div>

                {/* Arrow between steps (mobile) */}
                {i < HOW_STEPS.length - 1 && (
                  <div className="md:hidden flex justify-center my-2 opacity-30">
                    <ArrowRight className="w-5 h-5 text-gray-500 rotate-90" />
                  </div>
                )}

                <h3 className="text-base font-black text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Flow legend */}
        <div className="mt-12 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
          {[
            { dot: "bg-blue-400",    label: "Citizen"  },
            { dot: "bg-yellow-400",  label: "Admin"    },
            { dot: "bg-red-400",     label: "System"   },
            { dot: "bg-emerald-400", label: "Response" },
          ].map(({ dot, label }) => (
            <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-full border border-gray-800">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="page-section py-16 text-center">
        <div className="glass rounded-3xl p-10 md:p-16 border border-red-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5" />
          <div className="relative">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse-slow" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              {t("cta_heading")}
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              {t("cta_desc")}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/login" className="btn-primary text-base px-7 py-3">
                {t("cta_start")}
              </Link>
              <Link href="/map" className="btn-ghost text-base px-7 py-3">
                <Map className="w-5 h-5" />
                {t("cta_map")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
