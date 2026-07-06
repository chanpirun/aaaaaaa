"use client";

import { useEffect, useState } from "react";
import { Globe, Lock, Search, Eye, X } from "lucide-react";
import { type Project, type ProjectVisibility } from "@/data/projects";
import { fetchProjectsFromApi, mapSubmissionToProject } from "@/lib/submissions";

type FilterTab = "all" | ProjectVisibility;

export default function DirectorSubmissions() {
  const [list, setList] = useState<Project[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!storedUser) {
        setError("Please sign in to view submissions.");
        setLoading(false);
        return;
      }

      try {
        const rows = await fetchProjectsFromApi();
        setList(rows);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleToggleVisibility(id: string, visibility: ProjectVisibility) {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!storedUser) {
      setError("Please sign in again to update submissions.");
      return;
    }

    try {
      const response = await fetch(`/api/submissions/${id}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ visibility }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.message ?? "Failed to update visibility.");
        return;
      }

      setList((prev) =>
        prev.map((p) => (p.id === id ? mapSubmissionToProject(payload.data) : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update visibility.");
    }
  }

  const filtered = list.filter((p) => {
    const matchesTab = filter === "all" ? true : p.visibility === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
          Project Management
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Submissions</h1>
      </div>

      {loading && <p className="mb-4 text-sm text-slate-500">Loading submissions...</p>}
      {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "all" ? "bg-indigo-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("public")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "public" ? "bg-indigo-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Public
          </button>
          <button
            onClick={() => setFilter("private")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "private" ? "bg-indigo-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Private
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-900"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="w-8 px-5 py-3">#</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Owner</th>
              <th className="px-5 py-3">Visibility</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400">
                  No submissions found.
                </td>
              </tr>
            )}
            {filtered.map((p, index) => (
              <tr key={p.id} className="transition-colors hover:bg-indigo-50/20">
                <td className="px-5 py-4 font-mono text-[11px] text-slate-400">{index + 1}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">{p.title}</td>
                <td className="px-5 py-4 text-xs text-slate-600">{p.owner}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    p.visibility === "public" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {p.visibility === "public" ? <Globe size={10} /> : <Lock size={10} />}
                    {p.visibility}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => handleToggleVisibility(p.id, p.visibility === "public" ? "private" : "public")}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-700 hover:border-indigo-200"
                  >
                    Toggle Visibility
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
