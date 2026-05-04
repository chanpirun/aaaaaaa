"use client";

import { useState } from "react";
import { ChevronDown, Folders } from "lucide-react";
import { projects } from "@/data/projects";
import type { ProjectVisibility } from "@/data/projects";
import ProjectList from "@/components/project-list";

type Filter = "all" | ProjectVisibility;

const publicCount = projects.filter((p) => p.visibility === "public").length;
const privateCount = projects.filter((p) => p.visibility === "private").length;

export default function AllProject() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.visibility === filter);

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
            Knowledge Base
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Repository</h1>
        </div>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All ({projects.length})</option>
            <option value="public">Public ({publicCount})</option>
            <option value="private">Private ({privateCount})</option>
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <Folders size={36} className="opacity-40" />
          <p className="text-sm">No projects found.</p>
        </div>
      ) : (
        <ProjectList projects={filtered} showVisibility />
      )}
    </section>
  );
}
