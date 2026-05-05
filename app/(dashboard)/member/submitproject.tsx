"use client";

import { useState } from "react";
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

const currentUserName = "Mario Mario";

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
        onSubmit={(event) => event.preventDefault()}
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
              name="tag"
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
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition ${
                authorType === "individual"
                  ? "border-indigo-700 bg-indigo-50 text-indigo-900"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <input
                checked={authorType === "individual"}
                className="sr-only"
                name="authorType"
                onChange={() => setAuthorType("individual")}
                type="radio"
                value="individual"
              />
              <User size={17} />
              Individual
            </label>

            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition ${
                authorType === "team"
                  ? "border-indigo-700 bg-indigo-50 text-indigo-900"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <input
                checked={authorType === "team"}
                className="sr-only"
                name="authorType"
                onChange={() => setAuthorType("team")}
                type="radio"
                value="team"
              />
              <Users size={17} />
              Team
            </label>
          </div>

          {authorType === "individual" ? (
            <input
              className={`${inputClass} bg-slate-50 text-slate-600`}
              name="author"
              readOnly
              type="text"
              value={authorValue}
            />
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              {teamMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {teamMembers.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-sm font-medium text-indigo-900"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => removeMember(name)}
                        className="text-indigo-400 hover:text-indigo-700 transition leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                className="w-full text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder={teamMembers.length === 0 ? "Type a name and press Enter…" : "Add another member…"}
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addMember(); }
                  if (e.key === "Backspace" && memberInput === "") setTeamMembers((prev) => prev.slice(0, -1));
                }}
              />
            </div>
          )}
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Description
          </span>
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            name="description"
            placeholder="Write the project abstract"
            required
          />
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
            />
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
            />
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
            />
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
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ImageIcon size={16} />
              Project images
            </span>
            <input
              accept=".jpg,.jpeg,.png"
              className={fileClass}
              multiple
              name="projectImages"
              type="file"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Link2 size={16} />
              Demo link
            </span>
            <input
              className={inputClass}
              name="demoLink"
              placeholder="https://example.com/demo"
              type="url"
            />
          </label>
        </div>

        <div className="mt-7 flex justify-end">
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            type="submit"
          >
            <Send size={16} />
            Submit Project
          </button>
        </div>
      </form>
    </section>
  );
}
