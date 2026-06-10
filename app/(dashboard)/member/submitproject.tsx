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

function FileIcon({ name }: { name: string }) {
  const extension = name.split(".").pop()?.toUpperCase() ?? "FILE";
  const tone = extension === "ZIP" ? "bg-amber-500" : extension === "SQL" ? "bg-blue-500" : "bg-red-500";

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="relative h-9 w-8 rounded border border-slate-200 bg-slate-50">
        <div className="absolute right-0 top-0 h-2 w-2 rounded-bl border-b border-l border-slate-200 bg-white" />
        <span className={`absolute left-1 top-3 rounded px-1 py-0.5 text-[8px] font-bold leading-none text-white ${tone}`}>
          {extension.slice(0, 3)}
        </span>
      </div>
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

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Icon size={16} className="text-slate-600" />
          {title}
        </span>
        <button
          className={actionButtonClass}
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          <Plus size={15} />
          {actionLabel}
        </button>
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
      </div>

      <div className="space-y-3">
        {files.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-500">
            No file selected
          </div>
        ) : (
          files.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            >
              {title.toLowerCase().includes("cover") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt=""
                  className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                />
              ) : (
                <FileIcon name={item.file.name} />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {item.file.name}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-5 text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Clock3 size={14} />
                    {item.uploadedAt}
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 size={14} />
                    Uploaded
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 transition hover:bg-indigo-100"
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
                  <Eye size={16} />
                </button>
                <a
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                  href={item.url}
                  download={item.file.name}
                  title="Download"
                >
                  <Download size={16} />
                </a>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                  type="button"
                  title="Remove"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
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

    if (authorType === "team" && teamMembers.length === 0) {
      setError("Please add at least one team member.");
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
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-5 md:grid-cols-2">
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
        </div>

        <div className="mt-5">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Author
          </span>

          <div className="mb-3 grid gap-3 sm:grid-cols-2">
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

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
          <textarea className={`${inputClass} min-h-24 resize-y`} name="description" placeholder="Write the project abstract" required />
        </label>

        <div className="mt-6 space-y-4">
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
          <FileSection
            title="Finalize Documentation"
            actionLabel="Add Final Documentation"
            icon={FileText}
            files={finalDocumentationFiles}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            onAdd={(files) => appendFiles(files, setFinalDocumentationFiles)}
            onRemove={(id) => removeFile(id, setFinalDocumentationFiles)}
            onPreview={setPreviewFile}
          />
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Link2 size={16} />
              Demo link
            </span>
            <input className={inputClass} name="demoLink" placeholder="https://example.com/demo" type="url" />
          </label>
        </div>

        {message && <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="mt-7 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={isSubmitting}>
            <Send size={16} />
            {isSubmitting ? "Submitting..." : "Submit Project"}
          </button>
        </div>
      </form>
    </section>
  );
}
