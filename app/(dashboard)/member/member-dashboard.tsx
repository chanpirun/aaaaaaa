"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  FileCheck2,
  Globe,
  Lock,
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

        if (projects && projects.length > 0) {
          const newStats: DashboardStats = {
            totalProjects: projects.length,
            published: projects.filter(
              (p) => p.visibility === "public"
            ).length,
            private: projects.filter((p) => p.visibility === "private").length,
            approved: projects.filter((p) => p.status === "approved").length,
            pending: projects.filter((p) => p.status === "pending").length,
            rejected: projects.filter((p) => p.status === "rejected").length,
          };
          setStats(newStats);
        }
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
      <section className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center py-12">
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
          Dashboard
        </p>
        <h1 className="mt-2 text-5xl font-bold text-slate-950">
          Welcome back, {userName || "Member"}! 👋
        </h1>
        <p className="mt-2 text-slate-600">
          Here's an overview of your project submissions
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {/* Total Projects */}
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Total Projects</p>
              <p className="text-4xl font-bold text-indigo-900">
                {stats.totalProjects}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <BarChart3 className="text-indigo-900" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            All your project submissions
          </p>
        </div>

        {/* Published */}
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Published</p>
              <p className="text-4xl font-bold text-blue-900">
                {stats.published}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Globe className="text-blue-900" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Public submissions
          </p>
        </div>

        {/* Private */}
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Private</p>
              <p className="text-4xl font-bold text-slate-900">
                {stats.private}
              </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
              <Lock className="text-slate-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Private submissions
          </p>
        </div>

        {/* Approved */}
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Approved</p>
              <p className="text-4xl font-bold text-emerald-900">
                {stats.approved}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <FileCheck2 className="text-emerald-900" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Approved projects
          </p>
        </div>
      </div>

      {/* Status Stats */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <h2 className="text-lg font-semibold text-slate-950 mb-6">
          Submission Status
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Pending */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="text-amber-700" size={20} />
              </div>
              <p className="font-medium text-slate-900">Pending Review</p>
            </div>
            <p className="text-3xl font-bold text-amber-900 mb-1">
              {stats.pending}
            </p>
            <p className="text-sm text-slate-600">
              Awaiting director review
            </p>
          </div>

          {/* Approved */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileCheck2 className="text-emerald-700" size={20} />
              </div>
              <p className="font-medium text-slate-900">Approved</p>
            </div>
            <p className="text-3xl font-bold text-emerald-900 mb-1">
              {stats.approved}
            </p>
            <p className="text-sm text-slate-600">
              Successfully approved
            </p>
          </div>

          {/* Rejected */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="text-red-700" size={20} />
              </div>
              <p className="font-medium text-slate-900">Rejected</p>
            </div>
            <p className="text-3xl font-bold text-red-900 mb-1">
              {stats.rejected}
            </p>
            <p className="text-sm text-slate-600">
              Needs revision
            </p>
          </div>
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
