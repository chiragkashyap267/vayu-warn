// services/alertService.js
// ─────────────────────────────────────────────────────────────────────────────
// All Firestore operations for the "alerts" collection
// ─────────────────────────────────────────────────────────────────────────────
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION = "alerts";

/**
 * Subscribe to real-time alert updates.
 * Returns an unsubscribe function — call it on component unmount.
 * @param {(alerts: Array) => void} callback
 */
export function subscribeToAlerts(callback) {
  const q = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      // Convert Firestore Timestamp → JS Date for easy display
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
    }));
    callback(alerts);
  });
}

/**
 * Fetch alerts once (no realtime) — used by admin table.
 */
export async function fetchAlerts() {
  const q = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
  }));
}

/**
 * Add a new alert (admin only — enforce in Firestore rules).
 * @param {{ title, location, severity, lat, lng, description }} data
 */
export async function addAlert(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/**
 * Delete an alert by ID (admin only).
 * @param {string} id
 */
export async function deleteAlert(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}
