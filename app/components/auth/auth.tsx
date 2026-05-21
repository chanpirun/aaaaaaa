"use client";

import Login from "./login";

export default function Auth() {
  return (
    <div className="w-full">
      <div className="mb-7 border-b border-slate-200 pb-5">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Login</h2>
        <p className="mt-1.5 text-sm text-slate-500">Use your account credentials to continue.</p>
      </div>

      <Login />
    </div>
  );
}
