"use client";

import { useState } from "react";
import Login from "./login";
import Register from "./register";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 py-2.5 rounded-lg font-medium transition ${
            mode === "login"
              ? "bg-white shadow-md text-slate-900"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Login
        </button>

        <button
          onClick={() => setMode("register")}
          className={`flex-1 py-2.5 rounded-lg font-medium transition ${
            mode === "register"
              ? "bg-white shadow-md text-slate-900"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Content */}
      {mode === "login" ? <Login /> : <Register />}
    </div>
  );
}