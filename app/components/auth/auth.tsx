"use client";

import Login from "./login";

export default function Auth() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
      </div>

      <Login />
    </div>
  );
}
