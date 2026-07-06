"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Globe } from "lucide-react";
import type { Project } from "@/data/projects";
import ProjectList from "@/components/project-list";
import { mapSubmissionToProject } from "@/lib/submissions";

export default function AllProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/next-api/public/submissions", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load repository data.");
        const json = await res.json();
        const rows = json?.data ?? [];
        setProjects(rows.map(mapSubmissionToProject));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load repository data."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section className="mx-auto w-full">
      {/* Clean & Minimal Header Box */}
      <div className="mb-10 flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] sm:flex-row sm:items-end sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Project Showcase
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Repository
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            All published research projects approved by the director.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <Globe size={16} className="text-slate-400" />
          <span className="font-semibold text-slate-900">{loading ? "..." : projects.length}</span> Public Projects
        </div>
      </div>

      {loading && (
        <div className="space-y-8">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="animate-pulse overflow-hidden rounded-[30px] border border-slate-200 bg-white p-7"
            >
              <div className="grid gap-8 md:grid-cols-[280px_1fr]">
                <div className="h-52 rounded-3xl bg-slate-100" />
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex gap-2">
                    <div className="h-6 w-20 rounded-full bg-slate-100" />
                    <div className="h-6 w-16 rounded-full bg-slate-100" />
                  </div>
                  <div className="h-8 w-3/4 rounded-lg bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-5/6 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && projects.length === 0 && !error && (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-900">
            <FolderOpen size={24} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">
            No published projects yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Projects will appear here once the director publishes them.
          </p>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <ProjectList projects={projects} showSearch={false} showVisibility />
      )}
    </section>
  );
}
