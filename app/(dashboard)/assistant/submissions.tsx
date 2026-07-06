"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { type Project, type ProjectStatus } from "@/data/projects";
import { fetchProjectsFromApi, mapSubmissionToProject } from "@/lib/submissions";

type FilterTab = "all" | ProjectStatus;

export default function AssistantSubmissions() {
  const [list, setList] = useState<Project[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

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

  async function handleReview(status: ProjectStatus) {
    if (!reviewId) return;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!storedUser) {
      setError("Please sign in again to submit review.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/submissions/${reviewId}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          review_comment: comment,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.message ?? "Failed to update review.");
        return;
      }

      setList((prev) =>
        prev.map((p) => (p.id === reviewId ? mapSubmissionToProject(payload.data) : p))
      );
      setReviewId(null);
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review.");
    } finally {
      setSaving(false);
    }
  }

  const filtered = list.filter((p) => {
    const matchesTab = filter === "all" ? true : p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeReviewProject = list.find((p) => p.id === reviewId);

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
          Assistant Panel
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
              filter === "all" ? "bg-indigo-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "pending" ? "bg-indigo-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "approved" ? "bg-indigo-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "rejected" ? "bg-indigo-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Rejected
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none shadow-sm focus:border-indigo-500 text-slate-900"
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
              <th className="px-5 py-3">Status</th>
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
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    p.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                    p.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => {
                      setReviewId(p.id);
                      setComment(p.reviewComment ?? "");
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeReviewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Review Submission</h2>
            <p className="text-sm text-slate-600 mb-4">{activeReviewProject.title}</p>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a review comment..."
              className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-indigo-500 mb-4 min-h-24 resize-none"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setReviewId(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview("rejected")}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
              >
                Reject
              </button>
              <button
                onClick={() => handleReview("approved")}
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
