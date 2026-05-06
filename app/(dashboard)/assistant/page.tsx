"use client";

import { useState } from "react";
import { BarChart3, CheckCircle2, Clock, XCircle } from "lucide-react";
import AssistantSidebar, {
  type AssistantSidebarItemId,
} from "@/components/assistant-sidebar";
import Submissions from "./submissions";
import AllProject from "./allproject";
import { projects } from "@/data/projects";

function Dashboard() {
  const total = projects.length;
  const pending = projects.filter((p) => p.status === "pending").length;
  const approved = projects.filter((p) => p.status === "approved").length;
  const rejected = projects.filter((p) => p.status === "rejected").length;

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <BarChart3 className="text-indigo-900" size={22} />
          <p className="mt-4 text-2xl font-bold text-slate-950">{total}</p>
          <p className="text-sm text-slate-500">Total submissions</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <Clock className="text-amber-500" size={22} />
          <p className="mt-4 text-2xl font-bold text-slate-950">{pending}</p>
          <p className="text-sm text-slate-500">Pending review</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="text-emerald-600" size={22} />
          <p className="mt-4 text-2xl font-bold text-slate-950">{approved}</p>
          <p className="text-sm text-slate-500">Approved</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <XCircle className="text-red-500" size={22} />
          <p className="mt-4 text-2xl font-bold text-slate-950">{rejected}</p>
          <p className="text-sm text-slate-500">Rejected</p>
        </div>
      </div>
    </section>
  );
}

export default function AssistantPage() {
  const [activeItem, setActiveItem] =
    useState<AssistantSidebarItemId>("dashboard");

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <AssistantSidebar activeItem={activeItem} onItemSelect={setActiveItem} />

      <main className="flex-1 overflow-auto bg-linear-to-br from-[#f8f7ff] via-[#f1efff] to-[#e9ecff] p-8">
        {activeItem === "dashboard" && <Dashboard />}
        {activeItem === "submissions" && <Submissions />}
        {activeItem === "repository" && <AllProject />}
      </main>
    </div>
  );
}
