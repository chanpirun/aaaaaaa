"use client";

import { useState } from "react";
import { BarChart3, Globe, Lock, ShieldCheck } from "lucide-react";
import DirectorSidebar, {
  type DirectorSidebarItemId,
} from "@/components/director-sidebar";
import DirectorSubmissions from "./submissions";
import AllProject from "./allproject";
import RoleManagement from "./rolemanagement";
import { projects } from "@/data/projects";
import { users } from "@/data/users";

function Dashboard() {
  const totalProjects = projects.length;
  const published = projects.filter((p) => p.visibility === "public").length;
  const privateCount = projects.filter(
    (p) => p.visibility === "private",
  ).length;
  const totalUsers = users.length;

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <BarChart3 className="text-indigo-900" size={22} />
          <p className="mt-4 text-2xl font-bold text-slate-950">
            {totalProjects}
          </p>
          <p className="text-sm text-slate-500">Total projects</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <Globe className="text-indigo-600" size={22} />
          <p className="mt-4 text-2xl font-bold text-slate-950">{published}</p>
          <p className="text-sm text-slate-500">Published</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <Lock className="text-slate-500" size={22} />
          <p className="mt-4 text-2xl font-bold text-slate-950">
            {privateCount}
          </p>
          <p className="text-sm text-slate-500">Private</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldCheck className="text-violet-600" size={22} />
          <p className="mt-4 text-2xl font-bold text-slate-950">{totalUsers}</p>
          <p className="text-sm text-slate-500">Total users</p>
        </div>
      </div>
    </section>
  );
}

export default function DirectorPage() {
  const [activeItem, setActiveItem] =
    useState<DirectorSidebarItemId>("dashboard");

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <DirectorSidebar activeItem={activeItem} onItemSelect={setActiveItem} />

      <main className="flex-1 overflow-auto bg-linear-to-br from-[#f8f7ff] via-[#f1efff] to-[#e9ecff] p-6 md:p-8">
        <div className="w-full">
          {activeItem === "dashboard" && <Dashboard />}
          {activeItem === "submissions" && <DirectorSubmissions />}
          {activeItem === "repository" && <AllProject />}
          {activeItem === "roles" && <RoleManagement />}
        </div>
      </main>
    </div>
  );
}
