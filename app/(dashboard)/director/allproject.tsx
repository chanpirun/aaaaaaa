"use client";

import { useEffect, useState } from "react";
import { ChevronDown, FolderOpen } from "lucide-react";
import type { Project, ProjectVisibility } from "@/data/projects";
import ProjectList from "@/components/project-list";
import { fetchProjectsFromApi, getAuthToken, mapSubmissionToProject } from "@/lib/submissions";

type Filter = "all" | ProjectVisibility;

export default function AllProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      // Directors use the authenticated endpoint so they can see all (public + private)
      const token = getAuthToken();
      try {
        if (token) {
          const rows = await fetchProjectsFromApi(token);
          setProjects(rows);
        } else {
          // Fallback: public only
          const res = await fetch("/api/public/submissions", { cache: "no-store" });
          if (!res.ok) throw new Error("Failed to load.");
          const json = await res.json();
          setProjects((json?.data ?? []).map(mapSubmissionToProject));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load repository.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const publicCount = projects.filter((p) => p.visibility === "public").length;
  const privateCount = projects.filter((p) => p.visibility === "private").length;

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.visibility === filter);

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
            Project Showcase
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Repository</h1>
          <p className="mt-1 text-sm text-slate-500">
            All projects — public &amp; private
          </p>
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

      {loading && (
        <div className="space-y-8">
          {[1, 2].map((n) => (
            <div key={n} className="animate-pulse overflow-hidden rounded-[30px] border border-slate-200 bg-white p-7">
              <div className="grid gap-8 md:grid-cols-[280px_1fr]">
                <div className="h-52 rounded-3xl bg-slate-100" />
                <div className="flex flex-col justify-center space-y-4">
                  <div className="h-8 w-3/4 rounded-lg bg-slate-100" />
                  <div className="h-4 w-full rounded bg-slate-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {!loading && filtered.length === 0 && !error && (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <FolderOpen size={36} className="opacity-40" />
          <p className="text-sm">No projects found.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <ProjectList projects={filtered} showSearch={false} showVisibility />
      )}
    </section>
  );
}
