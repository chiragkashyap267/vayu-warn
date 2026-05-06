// components/Navbar.js
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/context/LanguageContext";
import { LANGS } from "@/context/LanguageContext";
import {
  BellRing, Map, FileText, ShieldCheck, AlertTriangle,
  LogIn, LogOut, Menu, X, Zap, Leaf, ChevronDown, User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar({ profileData }) {
  const { user, role, logout } = useAuth();
  const { lang, setLangDirect, t } = useLang();
  const pathname = usePathname();
  const router   = useRouter();
  const [open,      setOpen]      = useState(false);
  const [langOpen,  setLangOpen]  = useState(false);
  const [userOpen,  setUserOpen]  = useState(false);

  const currentLang = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Morning";
    if (h < 17) return "Afternoon";
    if (h < 20) return "Evening";
    return "Night";
  }

  const NAV_LINKS = [
    { href: "/alerts",       label: t("nav_alerts"),    Icon: BellRing  },
    { href: "/map",          label: t("nav_map"),       Icon: Map       },
    { href: "/report",       label: t("nav_report"),    Icon: FileText  },
    { href: "/sustainability",label: t("nav_sustain"),   Icon: Leaf      },
  ];

  async function handleLogout() {
    await logout();
    toast.success("Signed out");
    router.push("/login");
  }

  const active = (href) =>
    pathname === href
      ? "text-red-400 border-b-2 border-red-500"
      : "text-gray-300 hover:text-white";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">
            vayu<span className="text-red-500">warn</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 text-sm font-medium pb-0.5 transition-colors ${active(href)}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          {role === "admin" && (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 text-sm font-medium pb-0.5 transition-colors ${active("/admin")}`}
            >
              <ShieldCheck className="w-4 h-4" />
              {t("nav_admin")}
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language picker dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg border border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-400 transition-all tracking-wider"
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 glass border border-gray-700 rounded-xl overflow-hidden z-50 shadow-xl">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLangDirect(l.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold transition-all ${
                      lang === l.code
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/emergency"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all animate-pulse-slow"
          >
            <AlertTriangle className="w-4 h-4" />
            {t("nav_emergency")}
          </Link>

          {/* User avatar / menu OR Login button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-700 hover:border-gray-500 transition-all"
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border border-gray-600">
                  {profileData?.photoURL
                    ? <img src={profileData.photoURL} alt="avatar" className="w-full h-full object-cover" />
                    : <User className="w-3.5 h-3.5 text-gray-400" />}
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 leading-none">Good {greeting()}</p>
                  <p className="text-xs font-bold text-white leading-tight truncate max-w-[80px]">
                    {profileData?.displayName ?? user.email?.split("@")[0]}
                  </p>
                </div>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${userOpen ? "rotate-180" : ""}`} />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 glass border border-gray-700 rounded-xl overflow-hidden z-50 shadow-xl">
                  <Link
                    href="/profile"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  {role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-red-400" /> Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-gray-800" />
                  <button
                    onClick={() => { handleLogout(); setUserOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:border-gray-500 transition-all"
            >
              <LogIn className="w-4 h-4" />
              {t("nav_login")}
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile language quick cycle */}
          <button
            onClick={() => { const c=["en","hi","ga","ku"]; setLangDirect(c[(c.indexOf(lang)+1)%c.length]); }}
            className="px-2 py-1 text-xs font-black rounded border border-gray-700 text-gray-300"
          >
            {currentLang.label}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-gray-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-red-500/10 text-red-400"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          {role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <ShieldCheck className="w-4 h-4" />
              {t("nav_admin")}
            </Link>
          )}
          <div className="border-t border-gray-800 pt-2 mt-1 flex flex-col gap-2">
            <Link
              href="/emergency"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold bg-red-600 text-white"
            >
              <AlertTriangle className="w-4 h-4" />
              {t("nav_emergency")}
            </Link>
            {user ? (
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                {t("nav_logout")}
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <LogIn className="w-4 h-4" />
                {t("nav_login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
