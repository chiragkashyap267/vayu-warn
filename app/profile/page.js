// app/profile/page.js
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AuthGuard from "@/components/AuthGuard";
import {
  User, Mail, Upload, Loader2, CheckCircle2, Camera,
  Shield, Clock, Edit3, Save, X,
} from "lucide-react";
import toast from "react-hot-toast";

const CLOUD  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

function ProfileContent() {
  const { user, role } = useAuth();
  const router = useRouter();
  const fileRef = useRef(null);

  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [name,     setName]     = useState("");
  const [preview,  setPreview]  = useState(null);
  const [newFile,  setNewFile]  = useState(null);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setProfile(d);
        setName(d.displayName ?? "");
      }
      setLoading(false);
    });
  }, [user]);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error("Photo must be under 5 MB"); return; }
    setNewFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!name.trim()) { toast.error("Name cannot be empty"); return; }
    setSaving(true);
    try {
      let photoURL = profile?.photoURL ?? null;
      if (newFile) {
        const fd = new FormData();
        fd.append("file", newFile);
        fd.append("upload_preset", PRESET);
        fd.append("folder", "vayu-warn/avatars");
        const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body: fd });
        const data = await res.json();
        photoURL   = data.secure_url;
      }
      await updateDoc(doc(db, "users", user.uid), {
        displayName: name.trim(),
        ...(photoURL && { photoURL }),
      });
      setProfile((p) => ({ ...p, displayName: name.trim(), photoURL }));
      setEditing(false);
      setNewFile(null);
      setPreview(null);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setEditing(false);
    setName(profile?.displayName ?? "");
    setPreview(null);
    setNewFile(null);
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 20) return "Good evening";
    return "Good night";
  }

  const avatarSrc = preview ?? profile?.photoURL;

  if (loading) {
    return (
      <div className="page-section flex justify-center pt-20">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-section max-w-2xl mx-auto py-10">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-red-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative animate-fade-up">
        {/* Header card */}
        <div className="glass rounded-3xl p-8 border border-gray-800 mb-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-900 flex items-center justify-center">
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                  : <User className="w-10 h-10 text-gray-600" />
                }
              </div>
              {editing && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center border-2 border-gray-900 hover:bg-red-500 transition-colors"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm text-gray-500 mb-0.5">{greeting()},</p>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-base text-2xl font-black text-white mb-2 pl-4"
                  placeholder="Your name"
                  autoFocus
                />
              ) : (
                <h1 className="text-2xl font-black text-white mb-1">
                  {profile?.displayName ?? "Anonymous"}
                </h1>
              )}
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </span>
                <span className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full ${
                  role === "admin" ? "bg-red-500/15 text-red-400 border border-red-500/30" : "bg-gray-800 text-gray-400"
                }`}>
                  <Shield className="w-3 h-3" />
                  {role === "admin" ? "Admin" : "Community Member"}
                </span>
              </div>
              {profile?.createdAt && (
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Member since {profile.createdAt?.toDate?.()?.toLocaleDateString?.() ?? "—"}
                </p>
              )}
            </div>

            {/* Edit / Save buttons */}
            <div className="flex gap-2 shrink-0">
              {editing ? (
                <>
                  <button onClick={cancelEdit} className="btn-ghost px-3 py-2 text-sm">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-sm">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-ghost px-4 py-2 text-sm">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {editing && (
            <p className="text-xs text-gray-600 mt-4 flex items-center gap-1.5 justify-center sm:justify-start">
              <Upload className="w-3 h-3" /> Click the camera icon to change photo (max 5 MB)
            </p>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: "Login Method", value: profile?.provider === "google" ? "Google" : "Email", Icon: Mail,         color: "text-blue-400"    },
            { label: "Account Role", value: role === "admin" ? "Admin" : "User",                  Icon: Shield,       color: "text-red-400"     },
            { label: "Profile",      value: profile?.photoURL ? "Complete" : "Incomplete",        Icon: CheckCircle2, color: "text-emerald-400" },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="glass rounded-2xl p-4 border border-gray-800">
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <p className="text-white font-bold text-sm">{value}</p>
              <p className="text-gray-500 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <div className="glass rounded-2xl p-4 border border-gray-800 text-xs text-gray-500 flex items-start gap-2">
          <Shield className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
          <span>Your profile is private. Only your name and photo are visible to other community members. Email and role are never shared publicly.</span>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <AuthGuard><ProfileContent /></AuthGuard>;
}
