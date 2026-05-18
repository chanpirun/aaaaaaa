"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  reason: string;
};

type FormErrors = Partial<Record<keyof FormData | "cv" | "captcha", string>>;

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;
const MIN_REASON_WORDS = 400;
const ACCEPTED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function JoinUsPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    reason: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isRobotChecked, setIsRobotChecked] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const reasonWordCount = formData.reason
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const isSubmitDisabled = useMemo(() => !isRobotChecked, [isRobotChecked]);

  const handleInputChange =
    (key: keyof FormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((previous) => ({
        ...previous,
        [key]: event.target.value,
      }));

      setErrors((previous) => {
        const next = { ...previous };
        delete next[key];
        return next;
      });
    };

  const handleCvChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCvFile(file);

    setErrors((previous) => {
      const next = { ...previous };
      delete next.cv;
      return next;
    });
  };

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email.";
    }

    if (!formData.role.trim()) nextErrors.role = "Please specify the role you are applying for.";

    if (!formData.reason.trim()) {
      nextErrors.reason = "Tell us why you want to join.";
    } else if (reasonWordCount < MIN_REASON_WORDS) {
      nextErrors.reason = `Please write at least ${MIN_REASON_WORDS} words so we can review your application.`;
    }

    if (!cvFile) {
      nextErrors.cv = "Please upload your CV.";
    } else {
      if (!ACCEPTED_CV_TYPES.includes(cvFile.type)) {
        nextErrors.cv = "CV must be PDF, DOC, or DOCX format.";
      }
      if (cvFile.size > MAX_CV_SIZE_BYTES) {
        nextErrors.cv = "CV file size must be 5 MB or less.";
      }
    }

    if (!isRobotChecked) {
      nextErrors.captcha = "Please confirm you are not a robot.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage("");

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitMessage("Application submitted successfully. We will contact you soon.");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f7ff] via-[#f7fbff] to-[#ecfdf5] py-20 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="uppercase tracking-[0.25em] text-emerald-700 text-sm font-semibold">Careers at Radice</p>

          <h1 className="mt-5 text-5xl md:text-6xl font-bold leading-tight text-slate-900">
            Join Us &
            <span className="block text-emerald-700">Build The Future</span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-slate-600">
            Become part of a community driven by innovation, research, and impact.
            Join researchers, creators, and visionaries shaping tomorrow.
          </p>

          <div className="mt-10 space-y-4 text-slate-700">
            <div className="flex items-center gap-2"><span className="text-emerald-600">[OK]</span> Research Opportunities</div>
            <div className="flex items-center gap-2"><span className="text-emerald-600">[OK]</span> Collaborative Environment</div>
            <div className="flex items-center gap-2"><span className="text-emerald-600">[OK]</span> Innovation-Driven Projects</div>
          </div>
        </div>

        <div className="bg-white/95 shadow-2xl rounded-3xl p-10 border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Application Form</h2>
          <p className="text-sm text-slate-500 mb-8">All fields are required. CV: PDF, DOC, DOCX (max 5 MB).</p>

          <form className="space-y-6" noValidate onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange("firstName")}
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 ${errors.firstName ? "border-red-400 focus:ring-red-300" : "border-slate-300 focus:ring-emerald-500"}`}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange("lastName")}
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 ${errors.lastName ? "border-red-400 focus:ring-red-300" : "border-slate-300 focus:ring-emerald-500"}`}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange("email")}
                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 ${errors.email ? "border-red-400 focus:ring-red-300" : "border-slate-300 focus:ring-emerald-500"}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="role">Role Applied For</label>
              <input
                id="role"
                type="text"
                placeholder="Frontend Developer"
                value={formData.role}
                onChange={handleInputChange("role")}
                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 ${errors.role ? "border-red-400 focus:ring-red-300" : "border-slate-300 focus:ring-emerald-500"}`}
              />
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="reason">Reason for Joining</label>
              <textarea
                id="reason"
                rows={4}
                placeholder="Tell us why you want to join..."
                value={formData.reason}
                onChange={handleInputChange("reason")}
                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 ${errors.reason ? "border-red-400 focus:ring-red-300" : "border-slate-300 focus:ring-emerald-500"}`}
              />
              <p className="mt-1 text-xs text-slate-500">{reasonWordCount}/{MIN_REASON_WORDS} minimum words</p>
              {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="cvUpload">Upload CV</label>
              <div className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${errors.cv ? "border-red-400" : "border-slate-300"}`}>
                <label
                  htmlFor="cvUpload"
                  className="inline-flex cursor-pointer items-center rounded-md border border-slate-500 bg-slate-100 px-4 py-2 text-sm font-medium text-black hover:bg-slate-200"
                >
                  Choose file
                </label>
                <span className="text-sm text-slate-700">
                  {cvFile ? cvFile.name : "No file chosen"}
                </span>
                <input
                  id="cvUpload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvChange}
                  className="hidden"
                />
              </div>
              {cvFile && (
                <p className="mt-1 text-xs text-slate-600">
                  Selected: {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              {errors.cv && <p className="mt-1 text-sm text-red-600">{errors.cv}</p>}
            </div>

            <div
              className={`border-2 rounded-2xl p-5 flex items-center justify-between cursor-pointer transition ${errors.captcha ? "border-red-300 bg-red-50/40" : "border-slate-200 hover:bg-gray-50"}`}
              onClick={() => {
                setIsRobotChecked(!isRobotChecked);
                setErrors((previous) => {
                  const next = { ...previous };
                  delete next.captcha;
                  return next;
                });
              }}
              role="checkbox"
              aria-checked={isRobotChecked}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  setIsRobotChecked((previous) => !previous);
                }
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 border-2 rounded-sm flex items-center justify-center transition ${
                    isRobotChecked ? "bg-emerald-600 border-emerald-600" : "border-slate-300"
                  }`}
                >
                  {isRobotChecked && <span className="text-white text-xs font-bold">OK</span>}
                </div>
                <span className="text-slate-700 text-sm font-medium">I am not a robot</span>
              </div>

              <div className="text-xs text-slate-400"></div>
            </div>
            {errors.captcha && <p className="mt-1 text-sm text-red-600">{errors.captcha}</p>}

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="
                w-full
                py-4
                rounded-2xl
                bg-emerald-700
                text-white
                font-semibold
                text-lg
                shadow-lg
                hover:scale-[1.02]
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:scale-100
              "
            >
              Apply Now
            </button>
            {submitMessage && <p className="text-sm text-emerald-700 font-medium">{submitMessage}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
