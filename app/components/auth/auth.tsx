"use client";

import Login from "./login";

export default function Auth() {
  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="mb-7">
        <div className="mb-3 inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1">
          <span className="text-[0.68rem] font-semibold uppercase tracking-widest text-violet-400">
            Member Portal
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm text-slate-400">
          Sign in to access your workspace and submissions.
        </p>
      </div>

      <Login />
    </div>
  );
}
