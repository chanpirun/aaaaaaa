"use client";

import { useState } from "react";
import { ChevronDown, FolderOpen } from "lucide-react";
import { projects } from "@/data/projects";
import type { ProjectVisibility } from "@/data/projects";
import ProjectList from "@/components/project-list";

type Filter = "all" | ProjectVisibility;

const publicCount = projects.filter((p) => p.visibility === "public").length;
const privateCount = projects.filter((p) => p.visibility === "private").length;

export default function AllProject() {
  const [filter, setFilter] = useState<Filter>("public");

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.visibility === filter);

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
            Repository
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            All Projects
          </h1>
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
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-900">
            <FolderOpen size={24} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">
            No projects found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            No projects match the selected filter.
          </p>
        </div>
      ) : (
        <ProjectList projects={filtered} showVisibility />
      )}
    </section>
  );
}
