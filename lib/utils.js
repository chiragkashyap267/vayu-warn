// lib/utils.js
// ─────────────────────────────────────────────────────────────────────────────
// Shared utility functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a human-readable "time ago" string.
 * e.g. "2 minutes ago", "3 hours ago", "just now"
 * @param {Date} date
 */
export function formatDistanceToNow(date) {
  if (!(date instanceof Date) || isNaN(date)) return "recently";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60)  return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)  return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Capitalise first letter
 * @param {string} s
 */
export function capitalize(s = "") {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
