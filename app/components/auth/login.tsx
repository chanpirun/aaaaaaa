"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 cursor-pointer"
            />
            <span className="text-sm text-slate-600">Remember me</span>
          </label>
          <Link
            href="#"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-indigo-900 text-white font-semibold text-lg shadow-lg hover:bg-indigo-800 transition active:scale-95"
        >
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-500">OR</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Social login
      <div className="space-y-3">
        <button className="w-full py-3 rounded-xl border-2 border-slate-300 font-medium text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2 text-sm">
          <span>🔵</span> Google
        </button>
        <button className="w-full py-3 rounded-xl border-2 border-slate-300 font-medium text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2 text-sm">
          <span>🐙</span> GitHub
        </button>
      </div> */}
    </div>
  );
}