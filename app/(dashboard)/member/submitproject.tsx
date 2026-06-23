"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Database,
  Download,
  Eye,
  FileArchive,
  FileText,
  Image as ImageIcon,
  Link2,
  Plus,
  Send,
  Tags,
  Trash2,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import { getAuthToken } from "@/lib/submissions";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

type FileItem = {
  id: string;
  file: File;
  url: string;
  uploadedAt: string;
};

type PreviewFile = {
  name: string;
  url: string;
  type: string;
};

type FileSectionProps = {
  title: string;
  actionLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  files: FileItem[];
  accept: string;
  multiple?: boolean;
  onAdd: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  onPreview: (file: PreviewFile) => void;
};

const actionButtonClass =
  "inline-flex items-center gap-1.5 rounded-md border border-indigo-600 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50";

function fileStamp() {
  return new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
}

function makeFileItem(file: File): FileItem {
  return {
    id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    url: URL.createObjectURL(file),
    uploadedAt: fileStamp(),
  };
}

function CompactFileIcon({ name }: { name: string }) {
  const extension = name.split(".").pop()?.toUpperCase() ?? "FILE";
  const tone = 
    extension === "ZIP" || extension === "RAR" ? "bg-amber-500 text-white" :
    extension === "SQL" || extension === "DB" || extension === "CSV" || extension === "JSON" ? "bg-blue-500 text-white" :
    extension === "PDF" ? "bg-rose-500 text-white" : 
    extension === "DOC" || extension === "DOCX" ? "bg-indigo-500 text-white" :
    "bg-slate-500 text-white";

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-sm">
      <span className={`rounded px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider ${tone}`}>
        {extension.slice(0, 3)}
      </span>
    </div>
  );
}

function FileSection({
  title,
  actionLabel,
  icon: Icon,
  files,
  accept,
  multiple = true,
  onAdd,
  onRemove,
  onPreview,
}: FileSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (!multiple) {
        const dt = new DataTransfer();
        dt.items.add(e.dataTransfer.files[0]);
        onAdd(dt.files);
      } else {
        onAdd(e.dataTransfer.files);
      }
    }
  };

  const getTheme = () => {
    const t = title.toLowerCase();
    if (t.includes("cover")) {
      return {
        bg: "bg-rose-50/80 text-rose-600",
        border: "border-rose-100",
        accent: "text-rose-600",
        hoverBg: "hover:bg-rose-50/30",
        ring: "focus-within:ring-rose-100 focus-within:border-rose-400",
      };
    }
    if (t.includes("manual")) {
      return {
        bg: "bg-indigo-50/80 text-indigo-600",
        border: "border-indigo-100",
        accent: "text-indigo-600",
        hoverBg: "hover:bg-indigo-50/30",
        ring: "focus-within:ring-indigo-100 focus-within:border-indigo-400",
      };
    }
    if (t.includes("source")) {
      return {
        bg: "bg-amber-50/80 text-amber-600",
        border: "border-amber-100",
        accent: "text-amber-600",
        hoverBg: "hover:bg-amber-50/30",
        ring: "focus-within:ring-amber-100 focus-within:border-amber-400",
      };
    }
    if (t.includes("database")) {
      return {
        bg: "bg-sky-50/80 text-sky-600",
        border: "border-sky-100",
        accent: "text-sky-600",
        hoverBg: "hover:bg-sky-50/30",
        ring: "focus-within:ring-sky-100 focus-within:border-sky-400",
      };
    }
    return {
      bg: "bg-emerald-50/80 text-emerald-600",
      border: "border-emerald-100",
      accent: "text-emerald-600",
      hoverBg: "hover:bg-emerald-50/30",
      ring: "focus-within:ring-emerald-100 focus-within:border-emerald-400",
    };
  };

  const theme = getTheme();
  
  const acceptLabel = accept
    .split(",")
    .map((ext) => ext.trim().replace(".", "").toUpperCase())
    .join(", ");

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative flex flex-col h-[280px] rounded-xl border bg-white p-5 transition-all duration-300 ${
        isDragActive
          ? "border-indigo-500 ring-4 ring-indigo-50 shadow-md scale-[1.01]"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <input
        ref={inputRef}
        accept={accept}
        className="sr-only"
        multiple={multiple}
        type="file"
        onChange={(event) => {
          onAdd(event.target.files);
          event.target.value = "";
        }}
      />

      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${theme.bg}`}>
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-800" title={title}>
              {title}
            </h3>
            <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-wider">
              {acceptLabel}
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div>
            {multiple ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 shadow-sm"
                title={actionLabel}
              >
                <Plus size={11} />
                Add
              </button>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 shadow-sm"
                title={actionLabel}
              >
                Replace
              </button>
            )}
          </div>
        )}
      </div>

      {files.length === 0 ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="mt-4 flex-1 flex flex-col items-center justify-center rounded-lg border-2 border-dotted border-slate-300 bg-slate-50/40 hover:bg-slate-50 cursor-pointer p-4 transition-all duration-200 group"
        >
          <div className={`rounded-full bg-white p-2.5 shadow-sm border border-slate-100 transition-transform duration-200 group-hover:scale-110 ${theme.accent}`}>
            <Upload size={16} />
          </div>
          <span className="mt-2 text-xs font-semibold text-slate-700 transition-colors group-hover:text-slate-900">
            {actionLabel}
          </span>
          <span className="mt-0.5 text-[10px] text-slate-400 text-center">
            Drag & drop or click to upload
          </span>
        </div>
      ) : (
        <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar animate-fadeIn">
          {files.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/80 p-2 hover:bg-slate-50 hover:border-slate-200 transition-all duration-200"
            >
              {title.toLowerCase().includes("cover") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded border border-slate-200 object-cover bg-white"
                />
              ) : (
                <CompactFileIcon name={item.file.name} />
              )}
              
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-700" title={item.file.name}>
                  {item.file.name}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-medium">
                  <span className="text-slate-400 flex items-center gap-0.5">
                    <Clock3 size={10} />
                    {item.uploadedAt}
                  </span>
                  <span className="text-emerald-600 flex items-center gap-0.5">
                    <CheckCircle2 size={10} />
                    Uploaded
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-indigo-50 hover:text-indigo-600"
                  type="button"
                  title="Preview"
                  onClick={() =>
                    onPreview({
                      name: item.file.name,
                      url: item.url,
                      type: item.file.type,
                    })
                  }
                >
                  <Eye size={12} />
                </button>
                <a
                  className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-600"
                  href={item.url}
                  download={item.file.name}
                  title="Download"
                >
                  <Download size={12} />
                </a>
                <button
                  className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
                  type="button"
                  title="Remove"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PreviewModal({
  file,
  onClose,
}: {
  file: PreviewFile;
  onClose: () => void;
}) {
  const isImage = file.type.startsWith("image/");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3">
          <p className="truncate text-sm font-semibold text-slate-900">
            {file.name}
          </p>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            type="button"
            onClick={onClose}
            title="Close preview"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-[60vh] overflow-auto bg-slate-100 p-4">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={file.url}
              alt={file.name}
              className="mx-auto max-h-[72vh] max-w-full rounded-lg bg-white object-contain shadow-sm"
            />
          ) : (
            <iframe
              className="h-[72vh] w-full rounded-lg border border-slate-200 bg-white"
              src={file.url}
              title={file.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SubmitProject() {
  const [authorType, setAuthorType] = useState<"individual" | "team">(
    "individual",
  );
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");
  const [currentUserName] = useState(() => {
    if (typeof window === "undefined") return "Member User";

    const raw = localStorage.getItem("user");
    if (!raw) return "Member User";

    try {
      const user = JSON.parse(raw) as { name?: string };
      return user.name ?? "Member User";
    } catch {
      return "Member User";
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<FileItem | null>(null);
  const [documentFiles, setDocumentFiles] = useState<FileItem[]>([]);
  const [sourceFiles, setSourceFiles] = useState<FileItem[]>([]);
  const [datasetFiles, setDatasetFiles] = useState<FileItem[]>([]);
  const [finalDocumentationFiles, setFinalDocumentationFiles] = useState<FileItem[]>([]);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const selectedFilesRef = useRef<FileItem[]>([]);

  selectedFilesRef.current = [
    ...(coverFile ? [coverFile] : []),
    ...documentFiles,
    ...sourceFiles,
    ...datasetFiles,
    ...finalDocumentationFiles,
  ];

  useEffect(() => {
    return () => {
      revokeFileItems(selectedFilesRef.current);
    };
  }, []);

  const authorValue = authorType === "individual" ? currentUserName : "";

  function revokeFileItems(files: FileItem[]) {
    files.forEach((item) => URL.revokeObjectURL(item.url));
  }

  function replaceCover(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (coverFile) URL.revokeObjectURL(coverFile.url);
    setCoverFile(makeFileItem(file));
  }

  function appendFiles(
    files: FileList | null,
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  ) {
    if (!files?.length) return;
    const selectedItems = Array.from(files).map(makeFileItem);
    setFiles((prev) => [...prev, ...selectedItems]);
  }

  function removeFile(
    id: string,
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  ) {
    setFiles((prev) => {
      const item = prev.find((file) => file.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((file) => file.id !== id);
    });
  }

  function addMember() {
    const name = memberInput.trim();
    if (name && !teamMembers.includes(name)) {
      setTeamMembers((prev) => [...prev, name]);
    }
    setMemberInput("");
  }

  function removeMember(name: string) {
    setTeamMembers((prev) => prev.filter((m) => m !== name));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const token = getAuthToken();
    if (!token) {
      setError("Please sign in again before submitting.");
      return;
    }

    const formElement = event.currentTarget;
    const submitted = new FormData(formElement);
    const titleVal = String(submitted.get("title") ?? "").trim();
    const tagsVal = String(submitted.get("tags") ?? "").trim();
    const descVal = String(submitted.get("description") ?? "").trim();

    if (!titleVal) {
      setError("Project title is required.");
      return;
    }
    if (!tagsVal) {
      setError("At least one tag is required.");
      return;
    }
    if (authorType === "team" && teamMembers.length === 0) {
      setError("Please add at least one team member.");
      return;
    }
    if (!descVal) {
      setError("Project description is required.");
      return;
    }

    if (!coverFile) {
      setError("Please add one cover image.");
      return;
    }

    if (documentFiles.length === 0) {
      setError("Please add at least one manual document.");
      return;
    }

    if (sourceFiles.length === 0) {
      setError("Please add at least one source code ZIP.");
      return;
    }

    if (datasetFiles.length === 0) {
      setError("Please add at least one database file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formElement = event.currentTarget;
      const submitted = new FormData(formElement);
      const formData = new FormData();

      formData.set("title", String(submitted.get("title") ?? ""));
      formData.set("tags", String(submitted.get("tags") ?? ""));
      formData.set("description", String(submitted.get("description") ?? ""));
      formData.set("owner_type", authorType);
      formData.set("team_members", JSON.stringify(teamMembers));

      formData.set("cover_image", coverFile.file);
      documentFiles.forEach((item) => formData.append("document[]", item.file));
      sourceFiles.forEach((item) => formData.append("source_code[]", item.file));
      datasetFiles.forEach((item) => formData.append("dataset[]", item.file));
      finalDocumentationFiles.forEach((item) =>
        formData.append("project_images[]", item.file),
      );

      const demoLink = String(submitted.get("demoLink") ?? "").trim();
      if (demoLink) {
        formData.set("demo_link", demoLink);
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.message ?? "Failed to submit project.");
        return;
      }

      formElement.reset();
      setTeamMembers([]);
      setMemberInput("");
      setAuthorType("individual");
      revokeFileItems([
        ...(coverFile ? [coverFile] : []),
        ...documentFiles,
        ...sourceFiles,
        ...datasetFiles,
        ...finalDocumentationFiles,
      ]);
      setCoverFile(null);
      setDocumentFiles([]);
      setSourceFiles([]);
      setDatasetFiles([]);
      setFinalDocumentationFiles([]);
      setMessage("Project submitted successfully.");
    } catch {
      setError("Failed to submit project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-[1600px] rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      {previewFile && (
        <PreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
        <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
          Project Submission
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Submit Project
        </h1>
      </div>

      <form
        className="animate-fadeIn space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Description & Info */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-slate-50/30 p-6 shadow-sm flex flex-col space-y-7">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">1. Project Information</h2>
              <p className="text-xs text-slate-500">Provide the project title, tags, author details, and description.</p>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Project title
              </span>
              <input
                className={inputClass}
                name="title"
                placeholder="Project title"
                type="text"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Tags size={16} />
                Tag
              </span>
              <input
                className={inputClass}
                name="tags"
                placeholder="AI, Web, Research"
                type="text"
                required
              />
            </label>

            <div>
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Author
              </span>

              <div className="mb-3 grid gap-3 grid-cols-1">
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition ${authorType === "individual" ? "border-indigo-700 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700"}`}>
                  <input checked={authorType === "individual"} className="sr-only" name="authorType" onChange={() => setAuthorType("individual")} type="radio" value="individual" />
                  <User size={17} />
                  Individual
                </label>

                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition ${authorType === "team" ? "border-indigo-700 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700"}`}>
                  <input checked={authorType === "team"} className="sr-only" name="authorType" onChange={() => setAuthorType("team")} type="radio" value="team" />
                  <Users size={17} />
                  Team
                </label>
              </div>

              {authorType === "individual" ? (
                <input className={`${inputClass} bg-slate-50 text-slate-600`} name="author" readOnly type="text" value={authorValue} />
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                  {teamMembers.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {teamMembers.map((name) => (
                        <span key={name} className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-sm font-medium text-indigo-900">
                          {name}
                          <button type="button" onClick={() => removeMember(name)} className="leading-none text-indigo-400 transition hover:text-indigo-700">
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    className="w-full text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder={teamMembers.length === 0 ? "Type a name and press Enter..." : "Add another member..."}
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addMember();
                      }
                      if (e.key === "Backspace" && memberInput === "") {
                        setTeamMembers((prev) => prev.slice(0, -1));
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <label className="block flex-1 flex flex-col">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
              <textarea className={`${inputClass} flex-grow min-h-48 resize-y`} name="description" placeholder="Write the project abstract" required />
            </label>

            <div>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Link2 size={16} />
                  Demo link
                </span>
                <input className={inputClass} name="demoLink" placeholder="https://example.com/demo" type="url" />
              </label>
            </div>
          </div>

          {/* Right Panel: Documentation & Project Code */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-slate-50/30 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">2. Documentation & Project Code</h2>
              <p className="text-xs text-slate-500">Upload the cover image, manual, source code, database, and final documentation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FileSection
                title="Cover image"
                actionLabel={coverFile ? "Change Cover Image" : "Add Cover Image"}
                icon={ImageIcon}
                files={coverFile ? [coverFile] : []}
                accept=".jpg,.jpeg,.png,.webp"
                multiple={false}
                onAdd={replaceCover}
                onRemove={() => {
                  if (coverFile) URL.revokeObjectURL(coverFile.url);
                  setCoverFile(null);
                }}
                onPreview={setPreviewFile}
              />
              <FileSection
                title="Manual Documentation"
                actionLabel="Add Manual Document"
                icon={FileText}
                files={documentFiles}
                accept=".pdf,.doc,.docx"
                onAdd={(files) => appendFiles(files, setDocumentFiles)}
                onRemove={(id) => removeFile(id, setDocumentFiles)}
                onPreview={setPreviewFile}
              />
              <FileSection
                title="Source Code ZIP"
                actionLabel="Add Source Code"
                icon={FileArchive}
                files={sourceFiles}
                accept=".zip"
                onAdd={(files) => appendFiles(files, setSourceFiles)}
                onRemove={(id) => removeFile(id, setSourceFiles)}
                onPreview={setPreviewFile}
              />
              <FileSection
                title="Database"
                actionLabel="Add Database"
                icon={Database}
                files={datasetFiles}
                accept=".csv,.json,.xlsx,.xls,.zip"
                onAdd={(files) => appendFiles(files, setDatasetFiles)}
                onRemove={(id) => removeFile(id, setDatasetFiles)}
                onPreview={setPreviewFile}
              />
              <div className="md:col-span-2">
                <FileSection
                  title="Final Documentation"
                  actionLabel="Add Final Documentation"
                  icon={FileText}
                  files={finalDocumentationFiles}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  onAdd={(files) => appendFiles(files, setFinalDocumentationFiles)}
                  onRemove={(id) => removeFile(id, setFinalDocumentationFiles)}
                  onPreview={setPreviewFile}
                />
              </div>
            </div>

            {message && <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
            {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <div className="mt-7 flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Send size={16} />
                {isSubmitting ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
