"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { getAuthToken } from "@/lib/submissions";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const fileClass =
  "w-full rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:border-indigo-300";

export default function SubmitProject() {
  const [authorType, setAuthorType] = useState<"individual" | "team">(
    "individual",
  );
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");
  const [currentUserName, setCurrentUserName] = useState("Member User");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null);
  const [datasetPreviewUrl, setDatasetPreviewUrl] = useState<string | null>(null);
  const [projectImagePreviewUrls, setProjectImagePreviewUrls] = useState<string[]>(
    [],
  );
  const [selectedDocumentName, setSelectedDocumentName] = useState<string | null>(
    null,
  );
  const [selectedSourceName, setSelectedSourceName] = useState<string | null>(null);
  const [selectedDatasetName, setSelectedDatasetName] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;

    try {
      const user = JSON.parse(raw) as { name?: string };
      if (user.name) setCurrentUserName(user.name);
    } catch {
      // ignore invalid storage payload
    }
  }, []);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      if (documentPreviewUrl) URL.revokeObjectURL(documentPreviewUrl);
      if (sourcePreviewUrl) URL.revokeObjectURL(sourcePreviewUrl);
      if (datasetPreviewUrl) URL.revokeObjectURL(datasetPreviewUrl);
      projectImagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [
    coverPreviewUrl,
    documentPreviewUrl,
    sourcePreviewUrl,
    datasetPreviewUrl,
    projectImagePreviewUrls,
  ]);

  function setSingleFilePreview(
    file: File | null,
    currentUrl: string | null,
    setUrl: (value: string | null) => void,
  ) {
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    if (!file) {
      setUrl(null);
      return;
    }
    setUrl(URL.createObjectURL(file));
  }

  const authorValue = authorType === "individual" ? currentUserName : "";

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

    setIsSubmitting(true);

    try {
      const formElement = event.currentTarget;
      const formData = new FormData(formElement);

      formData.set("owner_type", authorType);
      formData.set("team_members", JSON.stringify(teamMembers));
      formData.set("tags", String(formData.get("tags") ?? ""));

      const coverImage = formData.get("coverImage") as File | null;
      const document = formData.get("document") as File | null;
      const sourceCode = formData.get("sourceCode") as File | null;
      const dataset = formData.get("dataset") as File | null;
      const projectImages = formData.getAll("projectImages") as File[];

      formData.delete("coverImage");
      formData.delete("sourceCode");
      formData.delete("projectImages");
      formData.delete("authorType");
      formData.delete("tag");

      if (coverImage) formData.set("cover_image", coverImage);
      if (document) formData.set("document", document);
      if (sourceCode) formData.set("source_code", sourceCode);
      if (dataset) formData.set("dataset", dataset);
      projectImages.forEach((file) => formData.append("project_images[]", file));

      const demoLink = String(formData.get("demoLink") ?? "").trim();
      formData.delete("demoLink");
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
      setSingleFilePreview(null, coverPreviewUrl, setCoverPreviewUrl);
      setSingleFilePreview(null, documentPreviewUrl, setDocumentPreviewUrl);
      setSingleFilePreview(null, sourcePreviewUrl, setSourcePreviewUrl);
      setSingleFilePreview(null, datasetPreviewUrl, setDatasetPreviewUrl);
      projectImagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setProjectImagePreviewUrls([]);
      setSelectedDocumentName(null);
      setSelectedSourceName(null);
      setSelectedDatasetName(null);
      setMessage("Project submitted successfully.");
    } catch {
      setError("Failed to submit project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl">
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

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ImageIcon size={16} />
              Cover picture
            </span>
            <input
              accept=".jpg,.jpeg,.png,.webp"
              className={fileClass}
              name="coverImage"
              type="file"
              required
              onChange={(e) =>
                setSingleFilePreview(
                  e.target.files?.[0] ?? null,
                  coverPreviewUrl,
                  setCoverPreviewUrl,
                )
              }
            />
            {coverPreviewUrl && (
              <a
                href={coverPreviewUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-indigo-700 underline"
              >
                Preview cover image
              </a>
            )}
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText size={16} />
              PDF
            </span>
            <input
              accept=".pdf,.doc,.docx"
              className={fileClass}
              name="document"
              type="file"
              required
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedDocumentName(file?.name ?? null);
                setSingleFilePreview(file, documentPreviewUrl, setDocumentPreviewUrl);
              }}
            />
            {documentPreviewUrl && selectedDocumentName && (
              <a
                href={documentPreviewUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-indigo-700 underline"
              >
                Preview {selectedDocumentName}
              </a>
            )}
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileArchive size={16} />
              Source code ZIP
            </span>
            <input
              accept=".zip"
              className={fileClass}
              name="sourceCode"
              type="file"
              required
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedSourceName(file?.name ?? null);
                setSingleFilePreview(file, sourcePreviewUrl, setSourcePreviewUrl);
              }}
            />
            {sourcePreviewUrl && selectedSourceName && (
              <a
                href={sourcePreviewUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-indigo-700 underline"
              >
                Preview {selectedSourceName}
              </a>
            )}
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Database size={16} />
              Dataset
            </span>
            <input
              accept=".csv,.json,.xlsx,.xls,.zip"
              className={fileClass}
              name="dataset"
              type="file"
              required
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedDatasetName(file?.name ?? null);
                setSingleFilePreview(file, datasetPreviewUrl, setDatasetPreviewUrl);
              }}
            />
            {datasetPreviewUrl && selectedDatasetName && (
              <a
                href={datasetPreviewUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-indigo-700 underline"
              >
                Preview {selectedDatasetName}
              </a>
            )}
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ImageIcon size={16} />
              Project images
            </span>
            <input
              accept=".jpg,.jpeg,.png,.webp"
              className={fileClass}
              multiple
              name="projectImages"
              type="file"
              onChange={(e) => {
                projectImagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
                const urls = Array.from(e.target.files ?? []).map((file) =>
                  URL.createObjectURL(file),
                );
                setProjectImagePreviewUrls(urls);
              }}
            />
            {projectImagePreviewUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {projectImagePreviewUrls.map((url, index) => (
                  <a
                    key={`${url}-${index}`}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-md border border-slate-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Project preview ${index + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </a>
                ))}
              </div>
            )}
          </label>
          <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><Link2 size={16} />Demo link</span><input className={inputClass} name="demoLink" placeholder="https://example.com/demo" type="url" /></label>
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
