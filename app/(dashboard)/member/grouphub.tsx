"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  FileText,
  Globe,
  Server,
  Database,
  TestTube2,
  FolderOpen,
  X,
  Download,
  ExternalLink,
  Tag,
  Calendar,
  UserCheck,
  Crown,
  Clock,
  CheckCircle2,
  XCircle,
  FileArchive,
  ChevronDown,
  Trash2,
  AlertTriangle,
  Upload,
  Plus,
} from "lucide-react";
import {
  fetchGroupHubProjects,
  deleteSubmission,
  getAuthToken,
  toAbsoluteFileUrl,
  fetchTeamDocuments,
  createTeamDocument,
  deleteTeamDocument,
  fetchMembers,
  type GroupHubProject,
  type ProjectType,
  type TeamDocument,
} from "@/lib/submissions";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getProjectTypeIcon(name: string | undefined) {
  if (!name) return <FolderOpen size={14} />;
  const lower = name.toLowerCase();
  if (lower === "manuscript") return <FileText size={14} />;
  if (lower === "frontend") return <Globe size={14} />;
  if (lower === "backend") return <Server size={14} />;
  if (lower === "database") return <Database size={14} />;
  if (lower === "postman") return <TestTube2 size={14} />;
  return <Tag size={14} />;
}

function getProjectTypeColor(name: string | undefined): string {
  if (!name) return "bg-slate-100 text-slate-600 border-slate-200";
  const lower = name.toLowerCase();
  if (lower === "manuscript") return "bg-rose-50 text-rose-700 border-rose-200";
  if (lower === "frontend") return "bg-sky-50 text-sky-700 border-sky-200";
  if (lower === "backend") return "bg-violet-50 text-violet-700 border-violet-200";
  if (lower === "database") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (lower === "postman") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-indigo-50 text-indigo-700 border-indigo-200";
}

function StatusBadge({ status }: { status: GroupHubProject["status"] }) {
  const map = {
    approved: {
      cls: "bg-emerald-100 text-emerald-700",
      icon: <CheckCircle2 size={11} />,
      label: "Approved",
    },
    rejected: {
      cls: "bg-red-100 text-red-700",
      icon: <XCircle size={11} />,
      label: "Rejected",
    },
    pending: {
      cls: "bg-amber-100 text-amber-700",
      icon: <Clock size={11} />,
      label: "Pending",
    },
  };
  const { cls, icon, label } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
}

function RoleBadge({ isOwner }: { isOwner: boolean }) {
  return isOwner ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
      <Crown size={9} />
      Submitted by you
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-700">
      <UserCheck size={9} />
      Tagged as Team Member
    </span>
  );
}

// ─── Type chip (small pill) ───────────────────────────────────────────────────

function TypePill({
  projectType,
  small,
}: {
  projectType: ProjectType | null;
  small?: boolean;
}) {
  const colorCls = getProjectTypeColor(projectType?.name);
  const icon = getProjectTypeIcon(projectType?.name);
  const size = small ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${colorCls} ${size}`}
    >
      {icon}
      {projectType?.name ?? "Uncategorised"}
    </span>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  currentUserId,
  onView,
  onDelete,
}: {
  project: GroupHubProject;
  currentUserId: number;
  onView: () => void;
  onDelete: (project: GroupHubProject) => void;
}) {
  const isOwner = project.submittedByUserId === currentUserId;
  // All group members (submitter OR tagged teammate) can delete
  const isGroupMember = isOwner || project.teamMemberIds.includes(currentUserId);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300">
      {/* Cover */}
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-white border-b border-slate-100 p-6">
        <div className="relative h-full w-full">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-sm"
            unoptimized
          />
        </div>
        {/* Status overlay */}
        <div className="absolute right-3 top-3 z-10">
          <StatusBadge status={project.status} />
        </div>
        {/* Type badge overlay */}
        <div className="absolute left-3 top-3 z-10">
          <TypePill projectType={project.projectType} small />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="line-clamp-2 text-sm font-bold text-slate-900 leading-snug"
          title={project.title}
        >
          {project.title}
        </h3>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {project.description}
        </p>

        {/* Divider */}
        <div className="mt-3 border-t border-slate-100 pt-3">
          {/* Role badge */}
          <div className="mb-2">
            <RoleBadge isOwner={isOwner} />
          </div>

          {/* Author */}
          <div className="flex items-start gap-1.5">
            <Users size={12} className="mt-0.5 shrink-0 text-slate-400" />
            <p className="text-[11px] font-medium text-slate-600 leading-snug">
              {project.owner}
            </p>
          </div>

          {/* Date */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <Calendar size={12} className="shrink-0 text-slate-400" />
            <p className="text-[11px] text-slate-500">{project.date}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={onView}
            className="flex-1 rounded-lg bg-indigo-900 py-2 text-xs font-semibold text-white transition hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            View Details
          </button>
          {isGroupMember && (
            <button
              type="button"
              onClick={() => onDelete(project)}
              title="Delete submission"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── File Link Row ────────────────────────────────────────────────────────────

function FileRow({ label, urls }: { label: string; urls: string[] }) {
  if (!urls || urls.length === 0) return null;
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <div className="flex flex-col gap-1.5">
        {urls.map((url, i) => {
          const fileName = decodeURIComponent(url.split("/").pop() ?? `File ${i + 1}`);
          return (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Download size={12} className="shrink-0 text-slate-400" />
              <span className="flex-1 truncate">{fileName}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
  project,
  currentUserId,
  onClose,
}: {
  project: GroupHubProject;
  currentUserId: number;
  onClose: () => void;
}) {
  const isOwner = project.submittedByUserId === currentUserId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_40px_100px_-20px_rgba(15,23,42,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            <TypePill projectType={project.projectType} />
            <StatusBadge status={project.status} />
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* Cover + Title section */}
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <div className="relative h-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {project.title}
              </h2>
              {project.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {project.description}
              </p>

              {/* Meta grid */}
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Submitted
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-800">
                    {project.date}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Reviewed By
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-800 capitalize">
                    {project.reviewedByRole ?? "Not reviewed yet"}
                  </p>
                </div>
                {project.reviewedAt && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Review Date
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-slate-800">
                      {project.reviewedAt}
                    </p>
                  </div>
                )}
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Visibility
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-800 capitalize">
                    {project.visibility}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Authors section */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Authors
            </p>
            <div className="flex flex-wrap gap-2">
              {/* Submitter */}
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  isOwner
                    ? "border border-indigo-200 bg-indigo-50"
                    : "border border-slate-200 bg-white"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                    isOwner
                      ? "bg-indigo-900 text-white"
                      : "bg-slate-300 text-slate-700"
                  }`}
                >
                  {project.submitterName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {project.submitterName}
                  </p>
                  {isOwner && (
                    <p className="text-[10px] font-bold text-indigo-600">
                      You · Submitter
                    </p>
                  )}
                </div>
              </div>

              {/* Other team members (names from team_members array) */}
              {project.teamMembers
                .filter((m) => m !== project.submitterName)
                .map((memberName) => {
                  const isCurrentUser =
                    memberName.toLowerCase() ===
                    project.submitterName.toLowerCase();
                  return (
                    <div
                      key={memberName}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-xs font-black text-teal-700">
                        {memberName.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        {memberName}
                        {isCurrentUser && (
                          <span className="ml-1 text-[10px] font-bold text-teal-600">
                            (You)
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
            </div>

            {/* Your role in this project */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              <RoleBadge isOwner={isOwner} />
            </div>
          </div>

          {/* Review Comment */}
          {project.reviewComment && (
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {project.status === "rejected"
                  ? "Reason for Rejection"
                  : "Review Comment"}
              </p>
              <p
                className={`rounded-lg border px-3 py-2.5 text-sm leading-6 ${
                  project.status === "rejected"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {project.reviewComment}
              </p>
            </div>
          )}

          {/* Files section */}
          <div className="mt-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Project Files
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FileRow
                label="Manual Documentation"
                urls={project.pdfs ?? (project.pdf ? [project.pdf] : [])}
              />
              <FileRow
                label="Source Code"
                urls={
                  project.sourceZips ??
                  (project.sourceZip ? [project.sourceZip] : [])
                }
              />
              <FileRow
                label="Database / Dataset"
                urls={
                  project.datasets ??
                  (project.dataset ? [project.dataset] : [])
                }
              />
              <FileRow
                label="Final Documentation"
                urls={project.finalDocuments ?? []}
              />
            </div>
          </div>

          {/* Demo Link */}
          {project.demoLink && (
            <div className="mt-4">
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                <ExternalLink size={15} />
                Open Live Demo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

type ScopeFilter = "all" | "mine" | "tagged";
type StatusFilter = "all" | "pending" | "approved" | "rejected";

// ─── New Contribution Modal (Standalone — not linked to any project submission) ──

function ContributionUploadModal({
  onClose,
  onSubmitted,
}: {
  onClose: () => void;
  onSubmitted: (doc: TeamDocument) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);
  const [taggedMembers, setTaggedMembers] = useState<{ id: number; name: string }[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [manualFile, setManualFile] = useState<File | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [dbFile, setDbFile] = useState<File | null>(null);
  const [finalFile, setFinalFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manualRef = useRef<HTMLInputElement>(null);
  const sourceRef = useRef<HTMLInputElement>(null);
  const dbRef = useRef<HTMLInputElement>(null);
  const finalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    fetchMembers(token).then(setMembers).catch(() => {});
  }, []);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) &&
      !taggedMembers.find((t) => t.id === m.id),
  );

  function toggleTag(m: { id: number; name: string }) {
    setTaggedMembers((prev) =>
      prev.find((t) => t.id === m.id)
        ? prev.filter((t) => t.id !== m.id)
        : [...prev, m],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) { setError("Contribution title is required."); return; }
    if (!manualFile && !sourceFile && !dbFile && !finalFile) {
      setError("Please upload at least one file."); return;
    }
    const token = getAuthToken();
    if (!token) return;
    setUploading(true);
    try {
      const doc = await createTeamDocument(token, {
        title: title.trim(),
        description: description.trim() || undefined,
        taggedMemberIds: taggedMembers.map((m) => m.id),
        taggedMemberNames: taggedMembers.map((m) => m.name),
        manualDoc: manualFile,
        sourceCode: sourceFile,
        databaseFile: dbFile,
        finalDoc: finalFile,
      });
      onSubmitted(doc);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function FileZone({
    label, acceptDisplay, accept, inputRef, file, setFile, accentColor, icon,
  }: {
    label: string; acceptDisplay: string; accept: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
    file: File | null; setFile: (f: File | null) => void;
    accentColor: string; icon: React.ReactNode;
  }) {
    const [drag, setDrag] = useState(false);
    const handle = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDrag(e.type === "dragenter" || e.type === "dragover"); };
    const drop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); };
    return (
      <div onDragEnter={handle} onDragOver={handle} onDragLeave={handle} onDrop={drop}
        className={`rounded-xl border bg-white transition-all duration-200 ${drag ? "border-indigo-400 ring-4 ring-indigo-50 shadow-md" : "border-slate-200 hover:border-slate-300"}`}>
        <input ref={inputRef} type="file" accept={accept} className="sr-only"
          onChange={(e) => { setFile(e.target.files?.[0] ?? null); e.target.value = ""; }} />
        <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentColor}`}>{icon}</div>
            <div>
              <p className="text-xs font-bold text-slate-800">{label}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{acceptDisplay}</p>
            </div>
          </div>
          {file && (
            <button type="button" onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition">
              Replace
            </button>
          )}
        </div>
        <div className="px-4 pb-3 pt-3">
          {!file ? (
            <div onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 py-5 cursor-pointer hover:bg-slate-50 transition group">
              <div className="rounded-full bg-white p-2 shadow-sm border border-slate-100 text-slate-400 group-hover:scale-110 transition-transform"><Upload size={14} /></div>
              <span className="mt-1.5 text-[11px] font-semibold text-slate-600">Add {label}</span>
              <span className="text-[10px] text-slate-400">Drag & drop or click to upload</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-white shadow-sm">
                <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-500">
                  {file.name.split(".").pop()?.slice(0, 3).toUpperCase() ?? "FILE"}
                </span>
              </div>
              <p className="flex-1 truncate text-[11px] font-semibold text-slate-700" title={file.name}>{file.name}</p>
              <button type="button" onClick={() => setFile(null)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                <X size={11} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_40px_100px_-20px_rgba(15,23,42,0.45)]"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-700">Group Hub</p>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">New Contribution</h2>
            <p className="mt-0.5 text-xs text-slate-500">Share documents with tagged team members</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 flex items-start gap-2">
              <span className="font-bold shrink-0">Error:</span>{error}
            </div>
          )}

          {/* Contribution Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contribution Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Week 3 Manual Documentation"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief note about this contribution..."
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          {/* Tag Members */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tag Members <span className="text-slate-400 font-normal">(they will see this contribution)</span>
            </label>
            {/* Tagged pills */}
            {taggedMembers.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {taggedMembers.map((m) => (
                  <span key={m.id} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-800">
                    {m.name}
                    <button type="button" onClick={() => toggleTag(m)} className="text-indigo-400 hover:text-indigo-700 leading-none">×</button>
                  </span>
                ))}
              </div>
            )}
            {/* Member search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search members to tag..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            {memberSearch && filteredMembers.length > 0 && (
              <div className="mt-1 max-h-36 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                {filteredMembers.map((m) => (
                  <button key={m.id} type="button" onClick={() => { toggleTag(m); setMemberSearch(""); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-indigo-50 transition text-left">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-black text-indigo-700">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-800">{m.name}</span>
                  </button>
                ))}
              </div>
            )}
            {memberSearch && filteredMembers.length === 0 && (
              <p className="mt-1 text-xs text-slate-400 px-1">No matching members found.</p>
            )}
          </div>

          {/* File upload section */}
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-900">Upload Documentation</h3>
            <p className="text-xs text-slate-500 mt-0.5">Upload any combination of the following. Tagged members will be able to download them.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileZone label="Manual Documentation" acceptDisplay="PDF, DOC, DOCX" accept=".pdf,.doc,.docx"
              inputRef={manualRef} file={manualFile} setFile={setManualFile}
              accentColor="bg-indigo-50 text-indigo-600" icon={<FileText size={16} />} />
            <FileZone label="Source Code ZIP" acceptDisplay="ZIP" accept=".zip"
              inputRef={sourceRef} file={sourceFile} setFile={setSourceFile}
              accentColor="bg-amber-50 text-amber-600" icon={<FileArchive size={16} />} />
            <FileZone label="Database" acceptDisplay="SQL, CSV, JSON, XLSX, ZIP, DB" accept=".sql,.db,.csv,.json,.xlsx,.xls,.zip"
              inputRef={dbRef} file={dbFile} setFile={setDbFile}
              accentColor="bg-sky-50 text-sky-600" icon={<Database size={16} />} />
            <FileZone label="Final Documentation" acceptDisplay="PDF, DOC, PPT, TXT" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              inputRef={finalRef} file={finalFile} setFile={setFinalFile}
              accentColor="bg-emerald-50 text-emerald-600" icon={<FileText size={16} />} />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 transition disabled:opacity-50 shadow-sm shadow-indigo-200">
              <Upload size={14} />
              {uploading ? "Submitting..." : "Submit Contribution"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


interface ContribFileItem {
  id: string;
  file: File;
  url: string;
}

function makeContribFileItem(file: File): ContribFileItem {
  return {
    id: `${file.name}-${file.lastModified}-${Math.random()}`,
    file,
    url: URL.createObjectURL(file),
  };
}

function ContribFileZone({
  label,
  subLabel,
  accept,
  acceptDisplay,
  icon,
  accentColor,
  files,
  multiple,
  onAdd,
  onRemove,
}: {
  label: string;
  subLabel: string;
  accept: string;
  acceptDisplay: string;
  icon: React.ReactNode;
  accentColor: string;
  files: ContribFileItem[];
  multiple?: boolean;
  onAdd: (files: FileList | null) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
    else if (e.type === "dragleave") setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files?.length) {
      if (!multiple) {
        const dt = new DataTransfer();
        dt.items.add(e.dataTransfer.files[0]);
        onAdd(dt.files);
      } else {
        onAdd(e.dataTransfer.files);
      }
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`rounded-xl border bg-white transition-all duration-200 ${
        isDragActive
          ? "border-indigo-400 ring-4 ring-indigo-50 shadow-md scale-[1.01]"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={!!multiple}
        className="sr-only"
        onChange={(e) => { onAdd(e.target.files); e.target.value = ""; }}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentColor}`}>
            {icon}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{label}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{acceptDisplay}</p>
          </div>
        </div>
        {files.length > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm"
          >
            <Plus size={10} />
            {multiple ? "Add" : "Replace"}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-3">
        {files.length === 0 ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 py-5 cursor-pointer hover:bg-slate-50 transition group"
          >
            <div className="rounded-full bg-white p-2 shadow-sm border border-slate-100 text-slate-400 group-hover:scale-110 transition-transform">
              <Upload size={14} />
            </div>
            <span className="mt-1.5 text-[11px] font-semibold text-slate-600">{subLabel}</span>
            <span className="text-[10px] text-slate-400">Drag & drop or click to upload</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-28 overflow-y-auto pr-0.5">
            {files.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-2 hover:border-slate-200 transition"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-white shadow-sm">
                  <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-500">
                    {item.file.name.split(".").pop()?.slice(0, 3).toUpperCase() ?? "FILE"}
                  </span>
                </div>
                <p className="flex-1 truncate text-[11px] font-semibold text-slate-700" title={item.file.name}>
                  {item.file.name}
                </p>
                <button
                  type="button"
                  onClick={() => { URL.revokeObjectURL(item.url); onRemove(item.id); }}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────


export default function GroupHub() {
  const [projects, setProjects] = useState<GroupHubProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  // Team Documents state (standalone — visible to submitter + tagged members)
  const [teamDocs, setTeamDocs] = useState<TeamDocument[]>([]);
  const [teamDocsLoading, setTeamDocsLoading] = useState(true);
  const [showContributionModal, setShowContributionModal] = useState(false);

  async function loadTeamDocuments() {
    setTeamDocsLoading(true);
    const token = getAuthToken();
    if (!token) { setTeamDocsLoading(false); return; }
    try {
      const data = await fetchTeamDocuments(token);
      setTeamDocs(data);
    } catch {
      // silently ignore
    } finally {
      setTeamDocsLoading(false);
    }
  }

  async function handleDeleteTeamDoc(id: number) {
    const token = getAuthToken();
    if (!token) return;
    if (!confirm("Are you sure you want to delete this contribution?")) return;
    try {
      await deleteTeamDocument(token, id);
      setTeamDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    }
  }

  // Filters
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Modal
  const [selectedProject, setSelectedProject] =
    useState<GroupHubProject | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<GroupHubProject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    const token = getAuthToken();
    if (!token) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteSubmission(token, deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      // Close the detail modal if the deleted project was open
      setSelectedProject((prev) => (prev?.id === deleteTarget.id ? null : prev));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setIsDeleting(false);
    }
  }

  // All unique project types in the fetched data
  const projectTypes = useMemo(() => {
    const seen = new Map<number, ProjectType>();
    for (const p of projects) {
      if (p.projectType && !seen.has(p.projectType.id)) {
        seen.set(p.projectType.id, p.projectType);
      }
    }
    return Array.from(seen.values());
  }, [projects]);

  useEffect(() => {
    async function load() {
      const token = getAuthToken();
      if (!token) {
        setError("Please sign in to view the Group Hub.");
        setLoading(false);
        return;
      }

      // Get current user ID from localStorage
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const u = JSON.parse(storedUser) as { id?: number };
          setCurrentUserId(u.id ?? 0);
        }
      } catch {
        // ignore
      }

      try {
        const rows = await fetchGroupHubProjects(token);
        setProjects(rows);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load Group Hub."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
    loadTeamDocuments();
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      // Search
      const q = search.trim().toLowerCase();
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.tags.some((t) => t.toLowerCase().includes(q)) &&
        !p.owner.toLowerCase().includes(q)
      ) {
        return false;
      }
      // Scope
      if (scopeFilter === "mine" && p.submittedByUserId !== currentUserId)
        return false;
      if (
        scopeFilter === "tagged" &&
        (p.submittedByUserId === currentUserId ||
          !p.teamMemberIds.includes(currentUserId))
      )
        return false;
      // Status
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      // Type
      if (typeFilter !== "all" && String(p.projectType?.id) !== typeFilter)
        return false;

      return true;
    });
  }, [projects, search, scopeFilter, statusFilter, typeFilter, currentUserId]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      mine: projects.filter((p) => p.submittedByUserId === currentUserId).length,
      tagged: projects.filter(
        (p) =>
          p.submittedByUserId !== currentUserId &&
          p.teamMemberIds.includes(currentUserId)
      ).length,
      pending: projects.filter((p) => p.status === "pending" || p.status === "rejected").length,
      approved: projects.filter((p) => p.status === "approved").length,
    }),
    [projects, currentUserId]
  );

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
            Collaboration
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Group Hub</h1>
          <p className="mt-1 text-sm text-slate-500">
            All projects where you are the submitter or have been tagged as a team
            member.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowContributionModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-900 shadow-sm"
          >
            <Plus size={13} />
            New Contribution
          </button>
          <button
            title="Filters"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Filters and Project Grid */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Stat chips */}
          <div className="flex flex-wrap gap-4">
            {[
              {
                label: "Total Projects",
                value: stats.total,
                cls: "bg-white border-slate-200 text-slate-800",
              },
              {
                label: "Submitted by you",
                value: stats.mine,
                cls: "bg-white border-slate-200 text-indigo-900",
              },
              {
                label: "Tagged as Member",
                value: stats.tagged,
                cls: "bg-white border-slate-200 text-teal-900",
              },
              {
                label: "In Progress",
                value: stats.pending,
                cls: "bg-white border-slate-200 text-blue-900",
              },
              {
                label: "Completed",
                value: stats.approved,
                cls: "bg-white border-slate-200 text-emerald-900",
              },
            ].map(({ label, value, cls }) => (
              <div
                key={label}
                className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-2.5 shadow-sm min-w-[140px] ${cls}`}
              >
                <span className="text-2xl font-black">{value}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-snug">{label}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search by title, tag, or author…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Scope */}
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                {(
                  [
                    { val: "all", label: "All" },
                    { val: "mine", label: "Mine" },
                    { val: "tagged", label: "Tagged" },
                  ] as { val: ScopeFilter; label: string }[]
                ).map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => setScopeFilter(val)}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                      scopeFilter === val
                        ? "bg-indigo-900 text-white"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Status */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                  className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* Type */}
              {projectTypes.length > 0 && (
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    {projectTypes.map((pt) => (
                      <option key={pt.id} value={String(pt.id)}>
                        {pt.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-20 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
              <p className="text-sm text-slate-500">Loading Group Hub…</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                <Users size={26} />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">
                No group projects found
              </h2>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                {projects.length === 0
                  ? "Ask a teammate to tag you on their submission, or submit a project with team members."
                  : "No projects match your current filters."}
              </p>
            </div>
          )}

          {/* Project grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  currentUserId={currentUserId}
                  onView={() => setSelectedProject(project)}
                  onDelete={(p) => { setDeleteTarget(p); setDeleteError(null); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Team Contributions Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Team Contributions</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Visible to you & tagged members</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                {teamDocs.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {teamDocsLoading ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
                  <p className="text-xs text-slate-400">Loading contributions...</p>
                </div>
              ) : teamDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <FileText size={20} />
                  </div>
                  <p className="text-xs text-slate-400">No contributions yet.</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">Click "New Contribution" to share documents.</p>
                </div>
              ) : (
                teamDocs.map((doc) => {
                  const hasFiles = doc.manual_doc_path || doc.source_code_path || doc.database_path || doc.final_doc_path;
                  const isOwner = doc.user_id === currentUserId;
                  return (
                    <div key={doc.id} className="group rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50 p-3 transition space-y-2">
                      {/* Title + delete */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate" title={doc.title}>{doc.title}</p>
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                            <span className="truncate max-w-[90px]" title={doc.submitter_name}>{doc.submitter_name}</span>
                            <span>•</span>
                            <span>{new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          </div>
                        </div>
                        {isOwner && (
                          <button type="button" onClick={() => handleDeleteTeamDoc(doc.id)} title="Delete"
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-red-400 hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>

                      {/* Tagged members */}
                      {(doc.tagged_member_names ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {(doc.tagged_member_names ?? []).map((name) => (
                            <span key={name} className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">
                              {name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* File download links */}
                      {hasFiles && (
                        <div className="flex flex-wrap gap-1.5 border-t border-slate-100 pt-2">
                          {doc.manual_doc_path && (
                            <a href={toAbsoluteFileUrl(doc.manual_doc_path)} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-100 transition">
                              <Download size={9} /> Manual
                            </a>
                          )}
                          {doc.source_code_path && (
                            <a href={toAbsoluteFileUrl(doc.source_code_path)} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 hover:bg-amber-100 transition">
                              <Download size={9} /> Source
                            </a>
                          )}
                          {doc.database_path && (
                            <a href={toAbsoluteFileUrl(doc.database_path)} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 hover:bg-sky-100 transition">
                              <Download size={9} /> Database
                            </a>
                          )}
                          {doc.final_doc_path && (
                            <a href={toAbsoluteFileUrl(doc.final_doc_path)} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 transition">
                              <Download size={9} /> Final Doc
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setShowContributionModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/10 text-indigo-750 py-3 text-xs font-bold transition hover:bg-indigo-50 hover:border-indigo-300"
            >
              <Plus size={14} />
              New Contribution
            </button>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selectedProject && (
        <DetailModal
          project={selectedProject}
          currentUserId={currentUserId}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.4)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={22} className="text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Delete Submission?</h2>
            <p className="mt-2 text-sm text-slate-500">
              You are about to permanently delete{" "}
              <span className="font-semibold text-slate-800">"{deleteTarget.title}"</span>.
              This action cannot be undone. All uploaded files will also be removed.
            </p>
            {deleteError && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {deleteError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 size={14} />
                {isDeleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contribution Modal (Standalone) */}
      {showContributionModal && (
        <ContributionUploadModal
          onClose={() => setShowContributionModal(false)}
          onSubmitted={(newDoc) => {
            setTeamDocs((prev) => [newDoc, ...prev]);
            setShowContributionModal(false);
          }}
        />
      )}
    </div>
  );
}
