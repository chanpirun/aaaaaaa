"use client";

import { useState, useMemo } from "react";
import { Calendar, Globe, Lock, Search, User, Filter, ArrowRight, X, FileText, Download } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/data/projects";

export type { Project };

function shouldBypassImageOptimization(src: string): boolean {
  return src.startsWith("http://127.0.0.1") || src.startsWith("http://localhost");
}

const tagColors = [
  "bg-indigo-50/80 text-indigo-700 border border-indigo-100/50",
  "bg-violet-50/80 text-violet-700 border border-violet-100/50",
  "bg-emerald-50/80 text-emerald-700 border border-emerald-100/50",
  "bg-amber-50/80 text-amber-700 border border-amber-100/50",
  "bg-sky-50/80 text-sky-700 border border-sky-100/50",
  "bg-rose-50/80 text-rose-700 border border-rose-100/50",
];

type ProjectListProps = {
  projects: Project[];
  title?: string;
  countLabel?: string;
  searchPlaceholder?: string;
  actionLabel?: string;
  showSearch?: boolean;
  showVisibility?: boolean;
};

export default function ProjectList({
  projects,
  title = "Latest Publications",
  countLabel = "Projects",
  searchPlaceholder = "Search research, projects, or authors...",
  actionLabel = "Open Publication",
  showSearch = true,
  showVisibility = false,
}: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");

  const years = useMemo(() => {
    const uniqueYears = new Set<string>();
    projects.forEach((p) => {
      const match = p.date.match(/\b(20\d{2})\b/);
      if (match) uniqueYears.add(match[1]);
    });
    return ["All", ...Array.from(uniqueYears).sort((a, b) => b.localeCompare(a))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchYear = selectedYear === "All" || p.date.includes(selectedYear);
      return matchSearch && matchYear;
    });
  }, [projects, searchQuery, selectedYear]);

  return (
    <div className="w-full">
      {showSearch && (
        <div className="mb-12">
          <div className="group flex flex-col gap-4 sm:flex-row sm:items-center rounded-2xl border border-slate-200/60 bg-white/80 px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 focus-within:border-indigo-300 focus-within:shadow-[0_8px_30px_rgb(79,70,229,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <div className="flex flex-1 items-center gap-4 border-b border-slate-100/50 sm:border-none pb-4 sm:pb-0">
              <Search className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
              <input
                className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-normal"
                placeholder={searchPlaceholder}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 sm:border-l sm:border-slate-200/60 sm:pl-6">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer hover:text-indigo-600 transition-colors"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year === "All" ? "All Years" : year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Clean & Minimal Section Box */}
      <div className="mb-8 mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-[0_2px_10px_rgb(0,0,0,0.04)] sm:px-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">Showing {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200">
            {filteredProjects.length} {countLabel}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            actionLabel={actionLabel}
            key={project.id}
            project={project}
            showVisibility={showVisibility}
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({
  actionLabel,
  project,
  showVisibility,
  priority = false,
}: {
  actionLabel: string;
  project: Project;
  showVisibility: boolean;
  priority?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <article className="group relative overflow-hidden rounded-[24px] border border-slate-200/50 bg-white/70 p-3 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-indigo-300/50 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] sm:p-4">
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:gap-8">
        
        {/* Image Container */}
        <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-[20px] shadow-inner md:h-auto md:w-[320px]">
          <div className="absolute inset-0 bg-slate-100/50" />
          <Image
            alt={project.title}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            fill
            sizes="(min-width: 768px) 320px, 100vw"
            src={project.coverImage}
            unoptimized={shouldBypassImageOptimization(project.coverImage)}
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          {showVisibility && (
            <div className="absolute left-4 top-4 z-10">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm backdrop-blur-md transition-all ${
                project.visibility === "public"
                  ? "bg-white/90 text-indigo-700 border border-white/20"
                  : "bg-slate-900/80 text-white border border-slate-700/50"
              }`}>
                {project.visibility === "public" ? <Globe size={12} strokeWidth={2.5} /> : <Lock size={12} strokeWidth={2.5} />}
                {project.visibility === "public" ? "Public" : "Private"}
              </span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex flex-1 flex-col justify-between py-2 pr-2 md:py-4 md:pr-6">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={tag}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${tagColors[index % tagColors.length]}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h4 className="text-xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-indigo-600 sm:text-2xl lg:text-[26px] lg:leading-tight">
              {project.title}
            </h4>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:mt-4">
              {project.description}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 transition-colors group-hover:bg-indigo-50/40 group-hover:text-indigo-700">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 group-hover:bg-indigo-200 group-hover:text-indigo-700 transition-colors">
                  <User size={12} strokeWidth={3} />
                </div>
                {project.owner}
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 transition-colors group-hover:bg-indigo-50/40 group-hover:text-indigo-700">
                <Calendar size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                {project.date}
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="group/btn inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-slate-900/10 transition-all duration-300 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              {actionLabel}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
        
      </div>
    </article>

    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4 sm:px-6">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsModalOpen(false)}
        />
        
        {/* Modal */}
        <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-8 sm:py-6">
            <h3 className="text-xl font-bold text-slate-900">Publication Details</h3>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
          
          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={tag}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${tagColors[index % tagColors.length]}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h4 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {project.title}
            </h4>

            <div className="mb-8 flex items-center gap-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><User size={14}/> {project.owner}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-1.5"><Calendar size={14}/> {project.date}</span>
            </div>

            <div className="prose prose-slate prose-indigo max-w-none">
              <h5 className="text-lg font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Project Description</h5>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>

            {/* Documents Section */}
            <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-100 p-6">
              <h5 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                <FileText className="text-indigo-600" size={20} />
                Final Documentation
              </h5>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {project.pdf && (
                  <a 
                    href={project.pdf} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">Main Document</span>
                        <span className="text-xs font-medium text-slate-500">PDF File</span>
                      </div>
                    </div>
                    <Download size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </a>
                )}
                
                {project.finalDocuments?.map((doc, idx) => (
                  <a 
                    key={idx}
                    href={doc} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">Document {idx + 1}</span>
                        <span className="text-xs font-medium text-slate-500">Attachment</span>
                      </div>
                    </div>
                    <Download size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </a>
                ))}

                {!project.pdf && (!project.finalDocuments || project.finalDocuments.length === 0) && (
                  <div className="col-span-full py-4 text-center text-sm font-medium text-slate-500">
                    No documentation available for this publication yet.
                  </div>
                )}
              </div>
            </div>

          </div>
          
          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-8 sm:py-5 flex justify-end">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

