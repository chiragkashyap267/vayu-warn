// components/AuthGuard.js
// ─────────────────────────────────────────────────────────────────────────────
// Wraps pages that require authentication (or admin role).
// Shows a spinner while auth state is loading.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, Loader2 } from "lucide-react";

/**
 * @param {{ adminOnly?: boolean, children: React.ReactNode }} props
 */
export default function AuthGuard({ children, adminOnly = false }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (adminOnly && role !== "admin") {
      router.replace("/alerts");
    }
  }, [user, role, loading, adminOnly, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Authenticating…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (adminOnly && role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4 text-center p-8">
          <ShieldAlert className="w-16 h-16 text-red-500" />
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-gray-400">You don&apos;t have admin privileges.</p>
        </div>
      </div>
    );
  }

  return children;
}
