"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, KeyRound, Mail, CheckCircle2 } from "lucide-react";

// token is NO LONGER returned to client — it's in an HttpOnly cookie set server-side
type LoginResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
  message?: string;
};


export default function Login() {
  const router = useRouter();

  // View state: 'login' | 'forgot' | 'reset'
  const [view, setView] = useState<"login" | "forgot" | "reset">("login");

  // Auth fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Password reset fields
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & Feedback fields
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get("token");
      const emailParam = params.get("email");
      if (tokenParam && emailParam) {
        setEmail(emailParam);
        setOtpCode(tokenParam);
        setView("reset");
      }
    }
  }, []);


  // Sign In submit handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/next-api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        // credentials: 'include' ensures cookies sent back by Next.js route are stored
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Login failed");
        return;
      }

      // SECURITY: token is in an HttpOnly cookie — we NEVER see it here.
      // Only store non-sensitive user display info in localStorage.
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/member");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // Forgot Password request handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/next-api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Unable to request password reset link.");
        return;
      }

      setSuccessMessage(data.message || "If that email exists, a password reset link has been sent.");
      setView("login");

    } catch (error) {
      console.error("Forgot password error:", error);
      setErrorMessage("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Password validation handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/next-api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          code: otpCode.trim(),
          token: otpCode.trim(),
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Invalid or expired reset token.");
        return;
      }

      setSuccessMessage("Your password has been reset successfully. Please sign in.");
      setView("login");
      // Clear sensitive fields
      setPassword("");
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error("Reset password error:", error);
      setErrorMessage("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 transition-all duration-300">
      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-400">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <p className="text-sm leading-tight">{successMessage}</p>
        </div>
      )}

      {/* Error notification */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">!</span>
          <p className="text-sm leading-tight">{errorMessage}</p>
        </div>
      )}

      {/* VIEW: LOGIN FORM */}
      {view === "login" && (
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              Email Address
            </label>
            <div
              className={`relative rounded-xl border transition-all duration-200 ${
                focusedField === "email"
                  ? "border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.18)]"
                  : "border-white/10 hover:border-white/20"
              } bg-white/5`}
            >
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              Password
            </label>
            <div
              className={`relative rounded-xl border transition-all duration-200 ${
                focusedField === "password"
                  ? "border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.18)]"
                  : "border-white/10 hover:border-white/20"
              } bg-white/5`}
            >
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="
                  w-full rounded-xl bg-transparent px-4 py-3.5 pr-12 text-sm text-white
                  placeholder:text-slate-500 focus:outline-none
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition hover:text-violet-400 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2.5 group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-4 w-4 rounded border border-white/20 bg-white/5 transition peer-checked:border-violet-500 peer-checked:bg-violet-500 group-hover:border-violet-400" />
                {rememberMe && (
                  <svg
                    className="absolute inset-0 m-auto h-2.5 w-2.5 text-white"
                    fill="none"
                    viewBox="0 0 10 8"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path d="M1 4l2.5 2.5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition">
                Remember me
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setView("forgot");
              }}
              className="text-xs font-medium text-slate-400 transition hover:text-violet-400 underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white
              bg-gradient-to-r from-violet-600 to-indigo-600
              shadow-[0_8px_24px_rgba(139,92,246,0.35)]
              transition-all duration-200
              hover:shadow-[0_8px_32px_rgba(139,92,246,0.55)]
              hover:brightness-110
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            <span className="relative z-10">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing In…
                </span>
              ) : (
                "Sign In"
              )}
            </span>
          </button>
        </form>
      )}

      {/* VIEW: REQUEST OTP FORM */}
      {view === "forgot" && (
        <form onSubmit={handleForgotPassword} className="space-y-5">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail size={18} className="text-violet-400" />
              Reset password
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your email address below and we'll generate a verification code to help you reset your password.
            </p>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="forgot-email"
              className="block text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              Email Address
            </label>
            <div
              className={`relative rounded-xl border transition-all duration-200 ${
                focusedField === "forgot-email"
                  ? "border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.18)]"
                  : "border-white/10 hover:border-white/20"
              } bg-white/5`}
            >
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("forgot-email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white
              bg-gradient-to-r from-violet-600 to-indigo-600
              shadow-[0_8px_24px_rgba(139,92,246,0.35)]
              transition-all duration-200
              hover:shadow-[0_8px_32px_rgba(139,92,246,0.55)]
              hover:brightness-110
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            <span className="relative z-10">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending Code…
                </span>
              ) : (
                "Send Reset Code"
              )}
            </span>
          </button>

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => {
              setErrorMessage("");
              setView("login");
            }}
            className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-slate-400 transition hover:text-white py-1"
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </button>
        </form>
      )}

      {/* VIEW: VERIFY OTP AND RESET FORM */}
      {view === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound size={18} className="text-violet-400" />
              New Credentials
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Please enter and confirm your new password to reset the account password for <strong>{email}</strong>.
            </p>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label
              htmlFor="new-password"
              className="block text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              New Password
            </label>
            <div
              className={`relative rounded-xl border transition-all duration-200 ${
                focusedField === "new-password"
                  ? "border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.18)]"
                  : "border-white/10 hover:border-white/20"
              } bg-white/5`}
            >
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setFocusedField("new-password")}
                onBlur={() => setFocusedField(null)}
                placeholder="At least 8 characters"
                required
                className="w-full rounded-xl bg-transparent px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition hover:text-violet-400 focus:outline-none"
              >
                {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label
              htmlFor="confirm-password"
              className="block text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              Confirm Password
            </label>
            <div
              className={`relative rounded-xl border transition-all duration-200 ${
                focusedField === "confirm-password"
                  ? "border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.18)]"
                  : "border-white/10 hover:border-white/20"
              } bg-white/5`}
            >
              <input
                id="confirm-password"
                type={showNewPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField("confirm-password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Re-type new password"
                required
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white
              bg-gradient-to-r from-violet-600 to-indigo-600
              shadow-[0_8px_24px_rgba(139,92,246,0.35)]
              transition-all duration-200
              hover:shadow-[0_8px_32px_rgba(139,92,246,0.55)]
              hover:brightness-110
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            <span className="relative z-10">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Resetting Password…
                </span>
              ) : (
                "Reset Password"
              )}
            </span>
          </button>

          {/* Go Back / Request Another Code */}
          <div className="flex flex-col gap-2 pt-1 text-center">
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setView("forgot");
              }}
              className="text-xs font-semibold text-slate-400 hover:text-violet-400 transition"
            >
              Request a new link
            </button>
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setView("login");
              }}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-white transition"
            >
              <ArrowLeft size={12} />
              Cancel and Sign In
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
