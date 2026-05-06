// app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/context/LanguageContext";
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

// ── Google G icon (inline SVG — no extra dependency) ─────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ── Floating-label input with left icon ──────────────────────────────────────
function IconInput({ Icon, type, placeholder, value, onChange, required, minLength, rightSlot }) {
  return (
    <div className="relative flex items-center">
      {/* Left icon — fixed size, no overlap */}
      <span className="absolute left-3 flex items-center justify-center w-5 h-5 pointer-events-none">
        <Icon className="w-4 h-4 text-gray-500" />
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className={`input-base pl-10 ${rightSlot ? "pr-11" : ""} w-full`}
      />
      {/* Right slot (show/hide password button) */}
      {rightSlot && (
        <span className="absolute right-3 flex items-center justify-center">
          {rightSlot}
        </span>
      )}
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider({ text = "or" }) {
  return (
    <div className="relative flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-gray-800" />
      <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">{text}</span>
      <div className="flex-1 h-px bg-gray-800" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login, register, loginWithGoogle, resetPassword } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  const [mode,        setMode]        = useState("login"); // "login" | "register" | "reset"
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [gLoading,    setGLoading]    = useState(false);
  const [resetSent,   setResetSent]   = useState(false);

  // Password strength checker
  const pwdStrength = password.length === 0 ? null
    : password.length < 6  ? "weak"
    : password.length < 10 ? "fair"
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? "strong"
    : "fair";

  const strengthColor = { weak: "bg-red-500", fair: "bg-yellow-400", strong: "bg-emerald-500" };
  const strengthWidth = { weak: "w-1/3", fair: "w-2/3", strong: "w-full" };

  function firebaseError(err) {
    const map = {
      "auth/user-not-found":      "No account found. Please register.",
      "auth/wrong-password":       "Incorrect password.",
      "auth/invalid-credential":   "Invalid email or password.",
      "auth/email-already-in-use": "Email already registered.",
      "auth/weak-password":        "Password must be at least 6 characters.",
      "auth/invalid-email":        "Invalid email address.",
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
      "auth/too-many-requests":    "Too many attempts. Please wait and try again.",
    };
    return map[err.code] ?? err.message ?? "Something went wrong.";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Password reset mode
    if (mode === "reset") {
      if (!email) return toast.error("Enter your email address.");
      setLoading(true);
      try {
        await resetPassword(email);
        setResetSent(true);
        toast.success("Reset link sent! Check your email.");
      } catch (err) {
        toast.error(firebaseError(err));
      } finally {
        setLoading(false);
      }
      return;
    }

    // Register mode — confirm password check
    if (mode === "register" && password !== confirm) {
      return toast.error("Passwords don't match.");
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Welcome back!");
      } else {
        await register(email, password);
        toast.success("Account created! Welcome to VayuWarn.");
      }
      router.push("/alerts");
    } catch (err) {
      toast.error(firebaseError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      router.push("/alerts");
    } catch (err) {
      toast.error(firebaseError(err));
    } finally {
      setGLoading(false);
    }
  }

  // ── Password Reset success screen ─────────────────────────────────────────
  if (resetSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-emerald-600/8 rounded-full blur-[120px]" />
        </div>
        <div className="w-full max-w-md animate-fade-up">
          <div className="glass rounded-3xl p-8 md:p-10 border border-gray-800 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white">Check Your Email</h2>
            <p className="text-gray-400 text-sm">
              We sent a password reset link to <span className="text-white font-semibold">{email}</span>.
              Check your inbox (and spam folder).
            </p>
            <button
              onClick={() => { setResetSent(false); setMode("login"); setEmail(""); }}
              className="btn-primary w-full py-3 mt-2"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main card ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-red-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md animate-fade-up">
        <div className="glass rounded-3xl p-8 md:p-10 border border-gray-800">

          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-7">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <Zap className="w-7 h-7 text-white" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black text-white">
              vayu<span className="text-red-500">warn</span>
            </h1>
            <p className="text-gray-500 text-sm text-center">
              {mode === "login"    ? "Sign in to your account"
               : mode === "register" ? "Create a new account"
               : "Reset your password"}
            </p>
          </div>

          {/* Tab toggle — only for login/register */}
          {mode !== "reset" && (
            <div className="flex rounded-xl overflow-hidden border border-gray-800 mb-6">
              {["login", "register"].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setPassword(""); setConfirm(""); }}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-all capitalize ${
                    mode === m ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {/* Google Sign-In button — shown on login and register, NOT reset */}
          {mode !== "reset" && (
            <>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={gLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-500 transition-all text-sm font-semibold text-white disabled:opacity-50"
              >
                {gLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </button>

              <Divider text="or" />
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email field */}
            <IconInput
              Icon={Mail}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password field — not shown on reset mode */}
            {mode !== "reset" && (
              <IconInput
                Icon={Lock}
                type={showPwd ? "text" : "password"}
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            )}

            {/* Password strength bar — register only */}
            {mode === "register" && pwdStrength && (
              <div className="space-y-1 -mt-1">
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strengthColor[pwdStrength]} ${strengthWidth[pwdStrength]}`} />
                </div>
                <p className={`text-xs font-semibold capitalize ${
                  pwdStrength === "weak" ? "text-red-400" : pwdStrength === "fair" ? "text-yellow-400" : "text-emerald-400"
                }`}>
                  {pwdStrength} password
                </p>
              </div>
            )}

            {/* Confirm password — register only */}
            {mode === "register" && (
              <>
                <IconInput
                  Icon={Lock}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-gray-500 hover:text-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                {/* Match indicator */}
                {confirm.length > 0 && (
                  <p className={`text-xs font-semibold flex items-center gap-1.5 -mt-1 ${
                    password === confirm ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {password === confirm
                      ? <><CheckCircle2 className="w-3.5 h-3.5" /> Passwords match</>
                      : <><AlertCircle className="w-3.5 h-3.5" /> Passwords don&apos;t match</>
                    }
                  </p>
                )}
              </>
            )}

            {/* Forgot password link — login mode only */}
            {mode === "login" && (
              <button
                type="button"
                onClick={() => setMode("reset")}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors text-right -mt-1"
              >
                Forgot password?
              </button>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-1"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === "login" ? "Sign In"
                : mode === "register" ? "Create Account"
                : "Send Reset Link"}
            </button>

            {/* Back to login — reset mode */}
            {mode === "reset" && (
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-sm text-gray-500 hover:text-white text-center transition-colors"
              >
                ← Back to login
              </button>
            )}
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            By continuing, you agree to help your community stay safe.
          </p>
        </div>

        <p className="text-center mt-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
