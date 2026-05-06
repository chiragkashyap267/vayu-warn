// services/reportService.js
// ─────────────────────────────────────────────────────────────────────────────
// All Firestore operations for the "reports" collection
// ─────────────────────────────────────────────────────────────────────────────
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION = "reports";

/**
 * Submit a new disaster report from a user.
 * @param {{ userId, type, image, lat, lng, description }} data
 */
export async function submitReport(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

/**
 * Fetch all reports (admin dashboard).
 */
export async function getAllReports() {
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
 * Mark a report as reviewed by admin.
 * @param {string} id
 */
export async function markReportReviewed(id) {
  return updateDoc(doc(db, COLLECTION, id), { status: "reviewed" });
}
