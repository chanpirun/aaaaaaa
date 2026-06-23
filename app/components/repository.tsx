"use client";

import { useEffect, useState } from "react";
import ProjectList from "@/components/project-list";
import type { Project } from "@/data/projects";
import { mapSubmissionToProject } from "@/lib/submissions";

export default function Repository() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublic() {
      try {
        const res = await fetch("/api/public/submissions", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        const rows = json?.data ?? [];
        setProjects(rows.map(mapSubmissionToProject));
      } catch {
        // Silently fail — repository section just shows nothing
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadPublic();
  }, []);

  return (
    <section className="bg-linear-to-b from-[#faf8ff] to-white px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="inline-flex rounded-full bg-indigo-50 px-5 py-2 text-xs uppercase tracking-[0.28em] text-indigo-700">
            Knowledge Repository
          </span>

          <h2 className="mt-8 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Explore Research &amp; Projects
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Discover publications, innovations and research initiatives shaping
            the future through collaboration and impact.
          </p>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse overflow-hidden rounded-[30px] border border-slate-200 bg-white p-7"
              >
                <div className="grid gap-8 md:grid-cols-[320px_1fr]">
                  <div className="h-60 rounded-3xl bg-slate-100" />
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="flex gap-2">
                      <div className="h-6 w-20 rounded-full bg-slate-100" />
                      <div className="h-6 w-16 rounded-full bg-slate-100" />
                    </div>
                    <div className="h-8 w-3/4 rounded-lg bg-slate-100" />
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-slate-100" />
                      <div className="h-4 w-5/6 rounded bg-slate-100" />
                      <div className="h-4 w-4/6 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[30px] border border-slate-200 bg-white py-24 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-2xl">
              📂
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-800">
              No published projects yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Published research and projects will appear here once the director makes them public.
            </p>
          </div>
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </section>
  );
}
