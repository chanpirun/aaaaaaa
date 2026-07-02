"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import {
  Rocket,
  Users,
  GraduationCap,
  Globe,
  Trophy,
  Mail,
  ChevronRight,
  X,
  Lightbulb,
  Atom,
  BarChart3,
  Check,
  Upload
} from "lucide-react";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
    setIsSubmitted(true);
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    // Reset submission state when modal closes
    if (isSubmitted) {
      setIsSubmitted(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        reason: "",
      });
      setCvFile(null);
      setIsRobotChecked(false);
      setSubmitMessage("");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f7ff] via-[#f1efff] to-[#e9ecff] text-slate-800">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Soft background radial glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -ml-40 -mb-20" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="md:col-span-6 space-y-6 lg:space-y-8">
              <span className="inline-block text-[11px] sm:text-xs font-bold tracking-[0.25em] text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100/50 uppercase">
                Careers at Radice
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] md:leading-[1.15]">
                Why Join <br className="hidden sm:inline" />
                <span className="text-indigo-700">RaDiCe?</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                At RaDiCe, we believe in the power of collaboration, creativity, and continuous learning.
                Together, we turn ideas into real-world impact.
              </p>

              <div className="pt-2">
                <button
                  className="inline-flex items-center gap-3 bg-indigo-900 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md cursor-default pointer-events-none select-none"
                >
                  <Users size={18} />
                  <span>Be Part of Our Mission</span>
                </button>
              </div>
            </div>

            {/* Right Team Illustration Column */}
            <div className="md:col-span-6 relative flex justify-center items-center">
              {/* Floating badges/icons from mockup */}
              <div className="absolute -top-4 right-1/4 z-20 w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-indigo-600 backdrop-blur-sm transition-transform duration-500 hover:scale-110">
                <Lightbulb size={22} className="animate-pulse" />
              </div>
              <div className="absolute bottom-12 -left-4 z-20 w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-indigo-600 backdrop-blur-sm transition-transform duration-500 hover:scale-110">
                <Atom size={22} className="animate-pulse" />
              </div>
              <div className="absolute top-1/4 -right-2 z-20 w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-indigo-600 backdrop-blur-sm transition-transform duration-500 hover:scale-110">
                <BarChart3 size={22} className="animate-pulse" />
              </div>

              {/* Central Image Container */}
              <div className="relative w-full max-w-md lg:max-w-lg aspect-[16/11] rounded-[32px] overflow-hidden shadow-xl border border-slate-200/50 bg-white p-3">
                <div className="relative w-full h-full rounded-[24px] overflow-hidden">
                  <Image
                    src="/radicedemo.jpg"
                    alt="Radice WMS Team Collaboration"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Benefits Grid Section */}
      <section className="py-20 md:py-24 bg-white/40 border-y border-slate-100/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-indigo-600 uppercase">
              Be Part of Something Bigger
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why You Should Join Us
            </h2>
          </div>

          {/* Cards Grid - 5 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shrink-0">
                <Rocket size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Make an Impact</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Work on meaningful projects that solve real-world problems and create positive change.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shrink-0">
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Collaborative Culture</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Join a supportive community where ideas are shared, respected, and brought to life together.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shrink-0">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Learn & Grow</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Access learning opportunities, mentorship, and hands-on experience to accelerate your growth.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shrink-0">
                <Globe size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Innovate Together</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Be part of innovative research and development that pushes boundaries and drives progress.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shrink-0">
                <Trophy size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Build Your Future</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Enhance your skills, build your portfolio, and open doors to new opportunities.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* 4. Application Form Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          
          <div className="relative bg-white rounded-[32px] shadow-2xl border border-slate-100 max-w-2xl w-full p-6 md:p-10 my-8 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Success screen or Form screen */}
            {isSubmitted ? (
              <div className="text-center py-10 px-4 space-y-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto shadow-sm">
                  <Check size={36} strokeWidth={2.5} />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    Application Submitted!
                  </h2>
                  <p className="text-slate-500 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                    Thank you for applying to Radice Research Center. We have received your CV and details, and our team will review them shortly.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                  Application Form
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mb-8">
                  All fields are required. Accepted CV formats: PDF, DOC, DOCX (max 5 MB).
                </p>

                <form className="space-y-5" noValidate onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 text-xs font-semibold text-slate-700" htmlFor="firstName">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange("firstName")}
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                          errors.firstName ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
                        }`}
                      />
                      {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block mb-1.5 text-xs font-semibold text-slate-700" htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange("lastName")}
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                          errors.lastName ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
                        }`}
                      />
                      {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-700" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange("email")}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                        errors.email ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-700" htmlFor="role">
                      Role Applied For
                    </label>
                    <input
                      id="role"
                      type="text"
                      placeholder="e.g. Researcher, Frontend Developer"
                      value={formData.role}
                      onChange={handleInputChange("role")}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                        errors.role ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
                      }`}
                    />
                    {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700" htmlFor="reason">
                        Reason for Joining
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {reasonWordCount}/{MIN_REASON_WORDS} words minimum
                      </span>
                    </div>
                    <textarea
                      id="reason"
                      rows={4}
                      placeholder="Write your motivations here..."
                      value={formData.reason}
                      onChange={handleInputChange("reason")}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                        errors.reason ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
                      }`}
                    />
                    {errors.reason && <p className="mt-1 text-xs text-red-600">{errors.reason}</p>}
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-700" htmlFor="cvUpload">
                      Upload CV
                    </label>
                    <div className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${errors.cv ? "border-red-400 bg-red-50/10" : "border-slate-200 bg-slate-50/50"}`}>
                      <label
                        htmlFor="cvUpload"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
                      >
                        <Upload size={14} />
                        Choose file
                      </label>
                      <span className="text-xs text-slate-500 truncate max-w-xs">
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
                      <p className="mt-1 text-[11px] text-indigo-600 font-medium">
                        Selected: {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                    {errors.cv && <p className="mt-1 text-xs text-red-600">{errors.cv}</p>}
                  </div>

                  {/* Captcha */}
                  <div>
                    <div
                      className={`border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition ${
                        errors.captcha ? "border-red-300 bg-red-50/40" : "border-slate-200 hover:bg-slate-50"
                      }`}
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
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 border rounded flex items-center justify-center transition ${
                            isRobotChecked ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"
                          }`}
                        >
                          {isRobotChecked && <Check size={14} strokeWidth={3} />}
                        </div>
                        <span className="text-slate-700 text-xs font-semibold">I am not a robot</span>
                      </div>
                      <div className="text-[10px] text-slate-400">reCAPTCHA (Custom)</div>
                    </div>
                    {errors.captcha && <p className="mt-1 text-xs text-red-600">{errors.captcha}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitDisabled}
                      className="w-full py-3.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Application
                    </button>
                    {submitMessage && !isSubmitted && (
                      <p className="mt-2 text-xs text-indigo-700 font-medium text-center">{submitMessage}</p>
                    )}
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>
      )}

    </main>
  );
}
