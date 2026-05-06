// hooks/useAuth.js
// ─────────────────────────────────────────────────────────────────────────────
// Auth hook — Firebase auth + Firestore role lookup
// Supports: Email/Password, Google Sign-In, Password Reset
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, createContext, useContext } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [role,    setRole]    = useState(null);   // "user" | "admin"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        setRole(snap.exists() ? snap.data().role ?? "user" : "user");
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── Email / Password login ────────────────────────────────────────────────
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // ── Email / Password register ─────────────────────────────────────────────
  async function register(email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      role: "user",
      provider: "email",
      createdAt: serverTimestamp(),
    });
    return cred;
  }

  // ── Google Sign-In ────────────────────────────────────────────────────────
  async function loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    // Only create Firestore doc if this is first Google sign-in
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    if (!snap.exists()) {
      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        displayName: cred.user.displayName,
        role: "user",
        provider: "google",
        createdAt: serverTimestamp(),
      });
    }
    return cred;
  }

  // ── Password reset email ──────────────────────────────────────────────────
  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async function logout() {
    return signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, role, loading, login, register, loginWithGoogle, resetPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Consumer hook ─────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
