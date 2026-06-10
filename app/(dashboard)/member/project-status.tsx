"use client";

import { useEffect, useState } from "react";
import { ChevronDown, FolderOpen, Search, X } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { fetchProjectsFromApi, getAuthToken } from "@/lib/submissions";

type StatusTab = "all" | Project["status"];

export default function ProjectStatus() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tab, setTab] = useState<StatusTab>("all");
  const [search, setSearch] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const token = getAuthToken();
      if (!token) {
        setError("Please sign in to view your project status.");
        setLoading(false);
        return;
      }

      try {
        const rows = await fetchProjectsFromApi(token);
        setProjects(rows);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project status.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const pendingCount = projects.filter((p) => p.status === "pending").length;
  const approvedCount = projects.filter((p) => p.status === "approved").length;
  const rejectedCount = projects.filter((p) => p.status === "rejected").length;

  const searched = projects.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const filtered = tab === "all" ? searched : searched.filter((p) => p.status === tab);
  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  const handleViewProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowDetailsModal(true);
  };

  return (
<section className="mx-auto w-full max-w-[1600px] rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
          Project Status
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">My Projects</h1>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          <StatusTabButton active={tab === "all"} onClick={() => setTab("all")} label={`All (${projects.length})`} />
          <StatusTabButton active={tab === "pending"} onClick={() => setTab("pending")} label={`Pending (${pendingCount})`} />
          <StatusTabButton active={tab === "approved"} onClick={() => setTab("approved")} label={`Approved (${approvedCount})`} />
          <StatusTabButton active={tab === "rejected"} onClick={() => setTab("rejected")} label={`Rejected (${rejectedCount})`} />

          <div className="ml-auto flex min-w-[140px] items-center">
            <button
              type="button"
              className="inline-flex w-full items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500"
            >
              All Time
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {loading && <p className="mt-4 text-sm text-slate-500">Loading project status...</p>}
      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-900">
            <FolderOpen size={24} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">No projects found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            No projects match your current filters.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 md:grid">
            <p className="col-span-4">Project Title</p>
            <p className="col-span-2">Tag</p>
            <p className="col-span-2">Submitted Date</p>
            <p className="col-span-2">Status</p>
            <p className="col-span-1">Reviewed By</p>
            <p className="col-span-1 text-right">Actions</p>
          </div>
          {filtered.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-1 gap-2 border-b border-slate-200 px-4 py-4 last:border-b-0 md:grid-cols-12 md:items-center"
            >
              <p className="col-span-4 font-semibold text-slate-900">{project.title}</p>
              <p className="col-span-2 text-sm text-slate-500">{project.tags.slice(0, 2).join(", ")}</p>
              <p className="col-span-2 text-sm text-slate-500">{project.date}</p>
              <div className="col-span-2">
                <StatusBadge status={project.status} />
              </div>
              <p className="col-span-1 text-sm font-medium text-slate-600">
                {project.reviewedByRole ? capitalize(project.reviewedByRole) : "-"}
              </p>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => handleViewProject(project.id)}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDetailsModal && selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_30px_80px_-25px_rgba(15,23,42,0.42)] md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Project Details</h2>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedProject.status} />
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close project details"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
              <div className="relative h-40 overflow-hidden rounded-xl border border-slate-200">
                <Image
                  src={selectedProject.coverImage}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900">{selectedProject.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{selectedProject.tags.join(", ")}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{selectedProject.description}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <DetailItem label="Submitted Date" value={selectedProject.date} />
                  <DetailItem
                    label="Reviewed By"
                    value={
                      selectedProject.reviewedByRole
                        ? capitalize(selectedProject.reviewedByRole)
                        : "Not reviewed yet"
                    }
                  />
                  <DetailItem
                    label="Reviewed Date"
                    value={selectedProject.reviewedAt ?? "Not reviewed yet"}
                  />
                  <DetailItem
                    label="Visibility"
                    value={selectedProject.visibility === "public" ? "Public" : "Private"}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <h4 className="text-sm font-semibold text-slate-800">
                {selectedProject.status === "rejected" ? "Reason for Rejection" : "Review Comment"}
              </h4>
              <p
                className={`mt-2 rounded-lg border px-3 py-2 text-sm ${
                  selectedProject.status === "rejected"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {selectedProject.reviewComment ?? "No review comment yet."}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StatusTabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-indigo-700 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  if (status === "approved") {
    return (
      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
      Pending
    </span>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
