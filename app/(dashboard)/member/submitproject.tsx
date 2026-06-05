"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Database,
  FileArchive,
  FileText,
  Image as ImageIcon,
  Link2,
  Send,
  Tags,
  User,
  Users,
  Eye,
  Download,
  UploadCloud,
  Trash,
} from "lucide-react";
import { getAuthToken } from "@/lib/submissions";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const fileClass =
  "w-full rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:border-indigo-300";

const fileWrapperClass =
  "w-full rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600";

const uploadTileClass =
  "flex min-h-[96px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-indigo-200 bg-indigo-50 p-3 text-center";

const chooseBtnClass =
  "mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none";

const cardClass =
  "rounded-lg border border-slate-100 bg-white p-3 shadow-sm";

const fileIconWrapper = "flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50 text-indigo-700";

export default function SubmitProject() {
  const [authorType, setAuthorType] = useState<"individual" | "team">("individual");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");
  const [currentUserName] = useState(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!raw) return "Member User";
      const user = JSON.parse(raw) as { name?: string };
      return user.name ?? "Member User";
    } catch {
      return "Member User";
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // files & previews
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [documentPreviewUrls, setDocumentPreviewUrls] = useState<string[]>([]);
  const [documentNames, setDocumentNames] = useState<string[]>([]);

  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [sourcePreviewUrls, setSourcePreviewUrls] = useState<string[]>([]);
  const [sourceNames, setSourceNames] = useState<string[]>([]);

  const [datasetFiles, setDatasetFiles] = useState<File[]>([]);
  const [datasetPreviewUrls, setDatasetPreviewUrls] = useState<string[]>([]);
  const [datasetNames, setDatasetNames] = useState<string[]>([]);

  const [finalizedDocFiles, setFinalizedDocFiles] = useState<File[]>([]);
  const [finalizedDocPreviewUrls, setFinalizedDocPreviewUrls] = useState<string[]>([]);
  const [finalizedDocNames, setFinalizedDocNames] = useState<string[]>([]);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      documentPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      sourcePreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      datasetPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      finalizedDocPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [coverPreviewUrl, documentPreviewUrls, sourcePreviewUrls, datasetPreviewUrls, finalizedDocPreviewUrls]);

  function setSingleFilePreview(file: File | null, currentUrl: string | null, setUrl: (v: string | null) => void) {
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    if (!file) {
      setUrl(null);
      return;
    }
    setUrl(URL.createObjectURL(file));
  }

  function setMultipleFilePreviews(files: File[], currentUrls: string[], setUrls: (v: string[]) => void, setNames?: (n: string[]) => void) {
    currentUrls.forEach((u) => URL.revokeObjectURL(u));
    if (!files || files.length === 0) {
      setUrls([]);
      if (setNames) setNames([]);
      return;
    }
    const urls = files.map((f) => URL.createObjectURL(f));
    setUrls(urls);
    if (setNames) setNames(files.map((f) => f.name));
  }

  function formatBytes(bytes: number) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  function appendUniqueFiles(existing: File[], incoming: File[]) {
    const existingNames = new Set(existing.map((f) => f.name));
    const filtered = incoming.filter((f) => !existingNames.has(f.name));
    return filtered.length === 0 ? existing : [...existing, ...filtered];
  }

  function openPreview(url: string, title?: string | null) {
    setPreviewUrl(url);
    setPreviewTitle(title ?? null);
    setPreviewModalOpen(true);
  }

  function closePreview() {
    setPreviewModalOpen(false);
    setPreviewUrl(null);
    setPreviewTitle(null);
  }

  function downloadFile(url: string, name?: string | null) {
    try {
      const a = document.createElement("a");
      a.href = url;
      if (name) a.download = name;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  const authorValue = authorType === "individual" ? currentUserName : "";

  function addMember() {
    const name = memberInput.trim();
    if (name && !teamMembers.includes(name)) setTeamMembers((p) => [...p, name]);
    setMemberInput("");
  }

  function removeMember(name: string) {
    setTeamMembers((prev) => prev.filter((m) => m !== name));
  }

  function removeDocument(index: number) {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
    const urls = documentPreviewUrls.slice();
    URL.revokeObjectURL(urls[index]);
    urls.splice(index, 1);
    setDocumentPreviewUrls(urls);
    const names = documentNames.slice();
    names.splice(index, 1);
    setDocumentNames(names);
  }

  function removeSource(index: number) {
    setSourceFiles((prev) => prev.filter((_, i) => i !== index));
    const urls = sourcePreviewUrls.slice();
    URL.revokeObjectURL(urls[index]);
    urls.splice(index, 1);
    setSourcePreviewUrls(urls);
    const names = sourceNames.slice();
    names.splice(index, 1);
    setSourceNames(names);
  }

  function removeDataset(index: number) {
    setDatasetFiles((prev) => prev.filter((_, i) => i !== index));
    const urls = datasetPreviewUrls.slice();
    URL.revokeObjectURL(urls[index]);
    urls.splice(index, 1);
    setDatasetPreviewUrls(urls);
    const names = datasetNames.slice();
    names.splice(index, 1);
    setDatasetNames(names);
  }

  function removeFinalized(index: number) {
    setFinalizedDocFiles((prev) => prev.filter((_, i) => i !== index));
    const urls = finalizedDocPreviewUrls.slice();
    URL.revokeObjectURL(urls[index]);
    urls.splice(index, 1);
    setFinalizedDocPreviewUrls(urls);
    const names = finalizedDocNames.slice();
    names.splice(index, 1);
    setFinalizedDocNames(names);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    setIsSubmitting(true);

    try {
      const formElement = event.currentTarget;
      const formData = new FormData(formElement);

      formData.set("owner_type", authorType);
      formData.set("team_members", JSON.stringify(teamMembers));
      formData.set("tags", String(formData.get("tags") ?? ""));

      formData.delete("coverImage");
      formData.delete("document");
      formData.delete("sourceCode");
      formData.delete("dataset");
      formData.delete("projectImages");

      if (coverFile) formData.append("cover_image", coverFile);

      documentFiles.forEach((f) => formData.append("document[]", f));
      sourceFiles.forEach((f) => formData.append("source_code[]", f));
      datasetFiles.forEach((f) => formData.append("dataset[]", f));
      finalizedDocFiles.forEach((f) => formData.append("project_images[]", f));

      const demoLink = String(formData.get("demoLink") ?? "").trim();
      formData.delete("demoLink");
      if (demoLink) formData.set("demo_link", demoLink);

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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

      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      documentPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      sourcePreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      datasetPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      finalizedDocPreviewUrls.forEach((u) => URL.revokeObjectURL(u));

      setCoverFile(null);
      setCoverPreviewUrl(null);
      setDocumentFiles([]);
      setDocumentPreviewUrls([]);
      setDocumentNames([]);
      setSourceFiles([]);
      setSourcePreviewUrls([]);
      setSourceNames([]);
      setDatasetFiles([]);
      setDatasetPreviewUrls([]);
      setDatasetNames([]);
      setFinalizedDocFiles([]);
      setFinalizedDocPreviewUrls([]);
      setFinalizedDocNames([]);

      setMessage("Project submitted successfully.");
    } catch (err) {
      setError("Failed to submit project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">Project Submission</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Submit Project</h1>
      </div>

      <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Project title</span>
            <input className={inputClass} name="title" placeholder="Project title" type="text" required />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><Tags size={16} />Tag</span>
            <input className={inputClass} name="tags" placeholder="AI, Web, Research" type="text" />
          </label>
        </div>

        <div className="mt-5">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Author</span>
          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            <label className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition ${authorType === "individual" ? "border-indigo-700 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700"}`}>
              <input checked={authorType === "individual"} className="sr-only" name="authorType" onChange={() => setAuthorType("individual")} type="radio" value="individual" />
              <User size={17} /> Individual
            </label>
            <label className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition ${authorType === "team" ? "border-indigo-700 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700"}`}>
              <input checked={authorType === "team"} className="sr-only" name="authorType" onChange={() => setAuthorType("team")} type="radio" value="team" />
              <Users size={17} /> Team
            </label>
          </div>

          {authorType === "individual" ? (
            <input className={`${inputClass} bg-slate-50 text-slate-600`} name="author" readOnly type="text" value={authorValue} title={authorValue ? `Author: ${authorValue}` : "Author"} />
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              {teamMembers.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {teamMembers.map((name) => (
                    <span key={name} className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-sm font-medium text-indigo-900">
                      {name}
                      <button type="button" onClick={() => removeMember(name)} className="leading-none text-indigo-400 transition hover:text-indigo-700">x</button>
                    </span>
                  ))}
                </div>
              )}
              <input className="w-full text-sm text-slate-900 outline-none placeholder:text-slate-400" placeholder={teamMembers.length === 0 ? "Type a name and press Enter..." : "Add another member..."} value={memberInput} onChange={(e) => setMemberInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMember(); } if (e.key === "Backspace" && memberInput === "") { setTeamMembers((prev) => prev.slice(0, -1)); } }} />
            </div>
          )}
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
          <textarea className={`${inputClass} min-h-24 resize-y`} name="description" placeholder="Write the project abstract" />
        </label>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><ImageIcon size={16} />Cover picture</span>
            <div className={fileWrapperClass}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="col-span-1">
                    <div className={uploadTileClass}>
                      <UploadCloud size={28} className="text-indigo-700" />
                      <label htmlFor="coverInput" className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-900 px-3 py-1.5 text-sm font-medium text-white">Choose File</label>
                      <p className="mt-2 text-xs text-slate-500">Recommended: 1200×628 • JPG/PNG</p>
                      <input id="coverInput" accept=".jpg,.jpeg,.png,.webp" className="sr-only" type="file" onChange={(e) => { const file = e.target.files?.[0] ?? null; setCoverFile(file); setSingleFilePreview(file, coverPreviewUrl, setCoverPreviewUrl); (e.target as HTMLInputElement).value = ""; }} />
                    </div>
                  </div>

                <div className="col-span-2">
                  {coverPreviewUrl && coverFile && (
                    <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm flex items-center gap-3">
                      <img src={coverPreviewUrl} alt={coverFile.name} className="h-16 w-24 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-700">{coverFile.name}</div>
                        <div className="mt-1 text-xs text-slate-500">{formatBytes(coverFile.size)} • {coverFile.type.split('/').pop()}</div>
                        <div className="mt-2 flex gap-2">
                          <button type="button" aria-label={`Preview ${coverFile.name}`} onClick={() => openPreview(coverPreviewUrl, coverFile.name)} className="rounded p-1 text-slate-600 hover:text-slate-900"><Eye size={16} /></button>
                          <button type="button" aria-label={`Download ${coverFile.name}`} onClick={() => downloadFile(coverPreviewUrl, coverFile.name)} className="rounded p-1 text-slate-600 hover:text-slate-900"><Download size={16} /></button>
                          <button type="button" aria-label={`Remove ${coverFile.name}`} title={`Remove ${coverFile.name}`} onClick={() => { setSingleFilePreview(null, coverPreviewUrl, setCoverPreviewUrl); setCoverFile(null); }} className="ml-auto rounded px-2 py-0.5 text-sm text-red-600"><Trash size={14} /></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><FileText size={16} />Manual document</span>
            <div className="mt-1">
              <div className={fileWrapperClass}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="col-span-1">
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer?.files ?? []);
                        if (files.length === 0) return;
                        const newFiles = appendUniqueFiles(documentFiles, files);
                        setDocumentFiles(newFiles);
                        setMultipleFilePreviews(newFiles, documentPreviewUrls, setDocumentPreviewUrls, setDocumentNames);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="flex h-full min-h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50 p-3 text-center"
                    >
                      <UploadCloud size={28} className="text-indigo-700" />
                      <label htmlFor="documentInput" className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-900 px-4 py-2 text-sm font-medium text-white">Choose Files</label>
                      <p className="mt-2 text-xs text-slate-500">Or drag and drop files here</p>
                      <input id="documentInput" accept=".pdf,.doc,.docx" className="sr-only" type="file" multiple onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length === 0) { (e.target as HTMLInputElement).value = ""; return; }
                        const newFiles = appendUniqueFiles(documentFiles, files);
                        setDocumentFiles(newFiles);
                        setMultipleFilePreviews(newFiles, documentPreviewUrls, setDocumentPreviewUrls, setDocumentNames);
                        (e.target as HTMLInputElement).value = "";
                      }} />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {documentPreviewUrls.map((url, index) => {
                        const name = documentNames[index] ?? `File ${index + 1}`;
                        const size = documentFiles[index]?.size ?? 0;
                        const ext = (name.split(".").pop() ?? "").toUpperCase();
                        return (
                          <div key={`${url}-${index}`} className="rounded-lg border bg-white p-3">
                            <div className="flex items-center gap-3">
                              <div className={fileIconWrapper}>
                                <UploadCloud size={16} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-slate-700">{name}</div>
                                <div className="mt-1 text-xs text-slate-500">{formatBytes(size)} • {ext}</div>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                              <button type="button" onClick={() => openPreview(url, name)} aria-label={`Preview ${name}`} className="rounded p-1 text-slate-600 hover:text-slate-900"><Eye size={16} /></button>
                              <button type="button" onClick={() => downloadFile(url, name)} aria-label={`Download ${name}`} className="rounded p-1 text-slate-600 hover:text-slate-900"><Download size={16} /></button>
                              <button type="button" aria-label={`Remove ${name}`} title={`Remove ${name}`} onClick={() => removeDocument(index)} className="ml-auto rounded px-2 py-0.5 text-sm text-red-600"><Trash size={14} /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><FileArchive size={16} />Source code ZIP</span>
            <div className="mt-1">
              <div className={fileWrapperClass}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="col-span-1">
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer?.files ?? []);
                        if (files.length === 0) return;
                        const newFiles = appendUniqueFiles(sourceFiles, files);
                        setSourceFiles(newFiles);
                        setMultipleFilePreviews(newFiles, sourcePreviewUrls, setSourcePreviewUrls, setSourceNames);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="flex h-full min-h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50 p-3 text-center"
                    >
                      <UploadCloud size={28} className="text-indigo-700" />
                      <label htmlFor="sourceInput" className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-900 px-4 py-2 text-sm font-medium text-white">Choose Files</label>
                      <p className="mt-2 text-xs text-slate-500">Or drag and drop files here</p>
                      <input id="sourceInput" accept=".zip" className="sr-only" type="file" multiple onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length === 0) { (e.target as HTMLInputElement).value = ""; return; }
                        const newFiles = appendUniqueFiles(sourceFiles, files);
                        setSourceFiles(newFiles);
                        setMultipleFilePreviews(newFiles, sourcePreviewUrls, setSourcePreviewUrls, setSourceNames);
                        (e.target as HTMLInputElement).value = "";
                      }} />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sourcePreviewUrls.map((url, index) => {
                        const name = sourceNames[index] ?? `File ${index + 1}`;
                        const size = sourceFiles[index]?.size ?? 0;
                        const ext = (name.split(".").pop() ?? "").toUpperCase();
                        return (
                          <div key={`${url}-${index}`} className="rounded-lg border bg-white p-3">
                            <div className="flex items-center gap-3">
                              <div className={fileIconWrapper}>
                                <UploadCloud size={16} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-slate-700">{name}</div>
                                <div className="mt-1 text-xs text-slate-500">{formatBytes(size)} • {ext}</div>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                              <button type="button" onClick={() => openPreview(url, name)} aria-label={`Preview ${name}`} className="rounded p-1 text-slate-600 hover:text-slate-900"><Eye size={16} /></button>
                              <button type="button" onClick={() => downloadFile(url, name)} aria-label={`Download ${name}`} className="rounded p-1 text-slate-600 hover:text-slate-900"><Download size={16} /></button>
                              <button type="button" aria-label={`Remove ${name}`} title={`Remove ${name}`} onClick={() => removeSource(index)} className="ml-auto rounded px-2 py-0.5 text-sm text-red-600"><Trash size={14} /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><Database size={16} />Database</span>
            <div className="mt-1">
              <div className={fileWrapperClass}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="col-span-1">
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer?.files ?? []);
                        if (files.length === 0) return;
                        const newFiles = appendUniqueFiles(datasetFiles, files);
                        setDatasetFiles(newFiles);
                        setMultipleFilePreviews(newFiles, datasetPreviewUrls, setDatasetPreviewUrls, setDatasetNames);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="flex h-full min-h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50 p-3 text-center"
                    >
                      <UploadCloud size={28} className="text-indigo-700" />
                      <label htmlFor="datasetInput" className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-900 px-4 py-2 text-sm font-medium text-white">Choose Files</label>
                      <p className="mt-2 text-xs text-slate-500">Or drag and drop files here</p>
                      <input id="datasetInput" accept=".csv,.json,.xlsx,.xls,.zip" className="sr-only" type="file" multiple onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length === 0) { (e.target as HTMLInputElement).value = ""; return; }
                        const newFiles = appendUniqueFiles(datasetFiles, files);
                        setDatasetFiles(newFiles);
                        setMultipleFilePreviews(newFiles, datasetPreviewUrls, setDatasetPreviewUrls, setDatasetNames);
                        (e.target as HTMLInputElement).value = "";
                      }} />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {datasetPreviewUrls.map((url, index) => {
                        const name = datasetNames[index] ?? `File ${index + 1}`;
                        const size = datasetFiles[index]?.size ?? 0;
                        const ext = (name.split(".").pop() ?? "").toUpperCase();
                        return (
                          <div key={`${url}-${index}`} className="rounded-lg border bg-white p-3">
                            <div className="flex items-center gap-3">
                              <div className={fileIconWrapper}>
                                <UploadCloud size={16} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-slate-700">{name}</div>
                                <div className="mt-1 text-xs text-slate-500">{formatBytes(size)} • {ext}</div>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                              <button type="button" onClick={() => openPreview(url, name)} aria-label={`Preview ${name}`} className="rounded p-1 text-slate-600 hover:text-slate-900"><Eye size={16} /></button>
                              <button type="button" onClick={() => downloadFile(url, name)} aria-label={`Download ${name}`} className="rounded p-1 text-slate-600 hover:text-slate-900"><Download size={16} /></button>
                              <button type="button" aria-label={`Remove ${name}`} title={`Remove ${name}`} onClick={() => removeDataset(index)} className="ml-auto rounded px-2 py-0.5 text-sm text-red-600"><Trash size={14} /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><ImageIcon size={16} />Finalized documentation</span>
            <div className="mt-1">
              <div className={fileWrapperClass}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="col-span-1">
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer?.files ?? []);
                        if (files.length === 0) return;
                        const newFiles = appendUniqueFiles(finalizedDocFiles, files);
                        setFinalizedDocFiles(newFiles);
                        setMultipleFilePreviews(newFiles, finalizedDocPreviewUrls, setFinalizedDocPreviewUrls, setFinalizedDocNames);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="flex h-full min-h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50 p-3 text-center"
                    >
                      <UploadCloud size={28} className="text-indigo-700" />
                      <label htmlFor="finalInput" className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-900 px-4 py-2 text-sm font-medium text-white">Choose Files</label>
                      <p className="mt-2 text-xs text-slate-500">Or drag and drop files here</p>
                      <input id="finalInput" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" className="sr-only" multiple name="projectImages" type="file" onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length === 0) { (e.target as HTMLInputElement).value = ""; return; }
                        const newFiles = appendUniqueFiles(finalizedDocFiles, files);
                        setFinalizedDocFiles(newFiles);
                        setMultipleFilePreviews(newFiles, finalizedDocPreviewUrls, setFinalizedDocPreviewUrls, setFinalizedDocNames);
                        (e.target as HTMLInputElement).value = "";
                      }} />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {finalizedDocPreviewUrls.map((url, index) => {
                        const name = finalizedDocNames[index] ?? `File ${index + 1}`;
                        const size = finalizedDocFiles[index]?.size ?? 0;
                        const ext = (name.split(".").pop() ?? "").toUpperCase();
                        return (
                          <div key={`${url}-${index}`} className="rounded-lg border bg-white p-3">
                            <div className="flex items-center gap-3">
                              <div className={fileIconWrapper}>
                                <UploadCloud size={16} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-slate-700">{name}</div>
                                <div className="mt-1 text-xs text-slate-500">{formatBytes(size)} • {ext}</div>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                              <button type="button" onClick={() => openPreview(url, name)} aria-label={`Preview ${name}`} className="rounded p-1 text-slate-600 hover:text-slate-900"><Eye size={16} /></button>
                              <button type="button" onClick={() => downloadFile(url, name)} aria-label={`Download ${name}`} className="rounded p-1 text-slate-600 hover:text-slate-900"><Download size={16} /></button>
                              <button type="button" aria-label={`Remove ${name}`} title={`Remove ${name}`} onClick={() => removeFinalized(index)} className="ml-auto rounded px-2 py-0.5 text-sm text-red-600"><Trash size={14} /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><Link2 size={16} />Demo link</span>
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

      {previewModalOpen && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closePreview} />

          <div role="dialog" aria-modal="true" className="relative z-50 w-full max-w-5xl h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="text-sm font-medium text-slate-900 truncate">{previewTitle}</h3>
              <div className="flex items-center gap-2">
                <a href={previewUrl} download={previewTitle ?? undefined} className="text-slate-700 hover:text-slate-900" title="Download">
                  <Download size={16} />
                </a>
                <button onClick={closePreview} className="ml-2 rounded px-3 py-1 text-sm font-medium text-slate-700 hover:text-slate-900">Close</button>
              </div>
            </div>

            <div className="h-full">
              <iframe src={previewUrl} title={previewTitle ?? "Document preview"} className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


