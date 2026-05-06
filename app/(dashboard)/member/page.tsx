"use client";

import { BarChart3, FileCheck2, UploadCloud } from "lucide-react";
import { useState } from "react";
import Sidebar, { type SidebarItemId } from "@/components/sidebar";
import AllProject from "./allproject";
import SubmitProject from "./submitproject";

function Dashboard() {
  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <BarChart3 className="text-indigo-900" size={22} />
          <p className="mt-4 text-2xl font-bold text-slate-950">0</p>
          <p className="text-sm text-slate-500">Total projects</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <UploadCloud className="text-indigo-900" size={22} />
          <p className="mt-4 text-2xl font-bold text-slate-950">0</p>
          <p className="text-sm text-slate-500">Pending submissions</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <FileCheck2 className="text-indigo-900" size={22} />
          <p className="mt-4 text-2xl font-bold text-slate-950">0</p>
          <p className="text-sm text-slate-500">Approved projects</p>
        </div>
      </div>
    </section>
  );
}

export default function MemberPage() {
  const [activeItem, setActiveItem] = useState<SidebarItemId>("overview");

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <Sidebar activeItem={activeItem} onItemSelect={setActiveItem} />

      <main className="flex-1 overflow-auto bg-linear-to-br from-[#f8f7ff] via-[#f1efff] to-[#e9ecff] p-8">
        {activeItem === "overview" && <Dashboard />}
        {activeItem === "submitproject" && <SubmitProject />}
        {activeItem === "repository" && <AllProject />}
      </main>
    </div>
  );
}
