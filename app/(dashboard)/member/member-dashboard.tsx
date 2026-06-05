"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  FileCheck2,
  Clock,
  XCircle,
} from "lucide-react";
import { fetchProjectsFromApi, getAuthToken } from "@/lib/submissions";
import type { Project } from "@/data/projects";

interface DashboardStats {
  totalProjects: number;
  published: number;
  private: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function MemberDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    published: 0,
    private: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Get user info
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserName(user.name);
        }

        // Fetch projects
        const token = getAuthToken();
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const projects = await fetchProjectsFromApi(token);

        setProjects(projects);
        const newStats: DashboardStats = {
          totalProjects: projects.length,
          published: projects.filter((p) => p.visibility === "public").length,
          private: projects.filter((p) => p.visibility === "private").length,
          approved: projects.filter((p) => p.status === "approved").length,
          pending: projects.filter((p) => p.status === "pending").length,
          rejected: projects.filter((p) => p.status === "rejected").length,
        };
        setStats(newStats);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center py-12">
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
          Dashboard
        </p>
        <h1 className="mt-2 text-5xl font-bold text-slate-950">
          Welcome back, {userName || "Member"}!
        </h1>
        <p className="mt-2 text-slate-600">
          See only your own submissions and their latest approval status.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Total Projects</p>
              <p className="text-4xl font-bold text-slate-900">
                {stats.totalProjects}
              </p>
            </div>
            <div className="rounded-lg bg-indigo-100 p-3">
              <BarChart3 className="text-indigo-700" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            All your project submissions
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Pending Review</p>
              <p className="text-4xl font-bold text-amber-700">
                {stats.pending}
              </p>
            </div>
            <div className="rounded-lg bg-amber-100 p-3">
              <Clock className="text-amber-700" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Awaiting assistant/director action
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Approved</p>
              <p className="text-4xl font-bold text-emerald-700">
                {stats.approved}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-100 p-3">
              <FileCheck2 className="text-emerald-700" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Reviewed and approved
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Rejected</p>
              <p className="text-4xl font-bold text-red-700">
                {stats.rejected}
              </p>
            </div>
            <div className="rounded-lg bg-red-100 p-3">
              <XCircle className="text-red-700" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Requires revision and resubmission
          </p>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-950">
            Recent Projects
          </h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="hidden grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 md:grid">
            <p className="col-span-5">Project</p>
            <p className="col-span-2">Status</p>
            <p className="col-span-2">Visibility</p>
            <p className="col-span-3 text-right">Date</p>
          </div>
          {projects.slice(0, 5).map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-1 gap-2 border-b border-slate-200 px-4 py-4 last:border-b-0 md:grid-cols-12 md:items-center"
            >
              <div className="col-span-5">
                <p className="font-semibold text-slate-900">{project.title}</p>
                <p className="text-xs text-slate-500">{project.tags.join(", ")}</p>
              </div>
              <div className="col-span-2">
                <StatusBadge status={project.status} />
              </div>
              <div className="col-span-2">
                <VisibilityBadge visibility={project.visibility} />
              </div>
              <p className="col-span-3 text-right text-sm text-slate-500">{project.date}</p>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-slate-500">
              No submitted projects yet.
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <h2 className="text-lg font-semibold text-slate-950 mb-6">
          Quick Insights
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-6">
            <p className="text-sm text-slate-600 mb-2">Approval Rate</p>
            <p className="text-3xl font-bold text-slate-900">
              {stats.totalProjects > 0
                ? Math.round((stats.approved / stats.totalProjects) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {stats.approved} of {stats.totalProjects} projects approved
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-6">
            <p className="text-sm text-slate-600 mb-2">Public Visibility</p>
            <p className="text-3xl font-bold text-slate-900">
              {stats.totalProjects > 0
                ? Math.round((stats.published / stats.totalProjects) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {stats.published} of {stats.totalProjects} projects published
            </p>
          </div>
        </div>
      </div>
    </section>
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

function VisibilityBadge({ visibility }: { visibility: Project["visibility"] }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        visibility === "public"
          ? "bg-indigo-100 text-indigo-700"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {visibility === "public" ? "Public" : "Private"}
    </span>
  );
}
