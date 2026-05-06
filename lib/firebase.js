// lib/firebase.js
// ─────────────────────────────────────────────────────────────────────────────
// Firebase initialisation — single app instance (safe for Next.js hot-reload)
// Fill your real values in .env.local (see .env.local.example)
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
export const googleProvider = new GoogleAuthProvider();
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Prevent duplicate app init during Next.js Fast Refresh
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Firestore with offline persistence (modern API — no deprecation warnings)
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentSingleTabManager(),
    }),
  });
} catch {
  // Already initialized (hot-reload) — just get existing instance
  db = getFirestore(app);
}

export { db };
export default app;
