// components/OnboardingModal.js
// ─────────────────────────────────────────────────────────────────────────────
// Shown once after first login if displayName is not yet set in Firestore.
// Asks for the user's name and optional profile picture.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { User, Upload, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function OnboardingModal({ onComplete }) {
  const { user } = useAuth();
  const fileRef  = useRef(null);

  const [name,    setName]    = useState("");
  const [preview, setPreview] = useState(null);
  const [file,    setFile]    = useState(null);
  const [saving,  setSaving]  = useState(false);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error("Photo must be under 5 MB"); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    setSaving(true);
    try {
      let photoURL = null;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", PRESET);
        fd.append("folder", "vayu-warn/avatars");
        const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body: fd });
        const data = await res.json();
        photoURL   = data.secure_url;
      }
      await updateDoc(doc(db, "users", user.uid), {
        displayName: name.trim(),
        ...(photoURL && { photoURL }),
        onboarded: true,
      });
      toast.success(`Welcome aboard, ${name.trim()}! 🎉`);
      onComplete({ displayName: name.trim(), photoURL });
    } catch (err) {
      toast.error("Failed to save profile. Try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm glass rounded-3xl p-8 border border-gray-700 animate-fade-up">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-7 text-center">
          <div className="w-10 h-10 bg-red-500/15 rounded-2xl flex items-center justify-center border border-red-500/30">
            <Sparkles className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="text-xl font-black text-white">Welcome to VayuWarn!</h2>
          <p className="text-gray-500 text-sm">Let's set up your profile — takes 10 seconds.</p>
        </div>

        {/* Avatar picker */}
        <div className="flex flex-col items-center mb-6">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-gray-600 hover:border-red-500 transition-colors group"
          >
            {preview
              ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 gap-1">
                  <Upload className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors" />
                  <span className="text-[9px] text-gray-600 group-hover:text-gray-400">Photo</span>
                </div>
              )
            }
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <p className="text-xs text-gray-600 mt-2">Optional · max 5 MB</p>
        </div>

        {/* Name input */}
        <div className="mb-2">
          <label className="text-sm font-semibold text-gray-300 block mb-2">
            Your first name <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 flex items-center justify-center w-5 h-5 pointer-events-none">
              <User className="w-4 h-4 text-gray-500" />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="e.g. Chirag"
              className="input-base pl-10 w-full"
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-600 mt-1.5">Email: {user?.email}</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full py-3 mt-5"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
            <Sparkles className="w-4 h-4" /> Let&apos;s Go!
          </>}
        </button>
      </div>
    </div>
  );
}
