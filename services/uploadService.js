// services/uploadService.js
// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary unsigned upload — no server needed
// ─────────────────────────────────────────────────────────────────────────────

const CLOUD_NAME   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload a file to Cloudinary and return its secure URL.
 * Compresses by requesting quality=auto and format=auto via the delivery URL.
 * @param {File} file
 * @returns {Promise<string>} Secure Cloudinary URL
 */
export async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary env vars not set. Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }

  // Limit size to 5 MB
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File too large. Maximum size is 5 MB.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "vayu-warn/reports");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}
