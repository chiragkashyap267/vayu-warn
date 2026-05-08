// components/Providers.js
"use client";

import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import AlertNotifier from "@/components/AlertNotifier";
import AlertTicker from "@/components/AlertTicker";
import OnboardingModal from "@/components/OnboardingModal";
import VayuBot from "@/components/VayuBot";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ── Inner wrapper — needs access to useAuth ──────────────────────────────────
function AppShell({ children }) {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileData,    setProfileData]    = useState(null);

  useEffect(() => {
    if (!user || loading) return;
    // Check if user has completed onboarding (has displayName in Firestore)
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setProfileData(d);
        // Show onboarding if no displayName set yet
        if (!d.displayName && !d.onboarded) {
          setShowOnboarding(true);
        }
      }
    });
  }, [user, loading]);

  function handleOnboardingComplete(data) {
    setShowOnboarding(false);
    setProfileData((p) => ({ ...p, ...data }));
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profileData={profileData} />
      {/* Alert ticker — sits between navbar and page content */}
      <div className="fixed top-16 inset-x-0 z-[49]">
        <AlertTicker />
      </div>
      <main className="pt-16 flex-grow">{children}</main>

      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-800 bg-gray-950 mt-auto">
        made by chirag kashyap MCA
      </footer>

      {/* Global real-time alert notifier + siren */}
      <AlertNotifier />

      {/* VayuBot — floating chatbot assistant, visible on all pages */}
      <VayuBot />

      {/* First-login onboarding modal */}
      {showOnboarding && user && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      <Toaster
        position="bottom-left"
        containerStyle={{ bottom: "16px", left: "16px" }}
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            border: "1px solid #374151",
            maxWidth: "calc(100vw - 100px)",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </div>
  );
}

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppShell>{children}</AppShell>
      </AuthProvider>
    </LanguageProvider>
  );
}
