"use client";

import { useState } from "react";

export default function JoinUsPage() {
  const [isRobotChecked, setIsRobotChecked] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f7ff] via-white to-[#eef2ff] py-24 px-6">

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div>
          <p className="uppercase tracking-[0.25em] text-indigo-600 text-sm font-medium">
            Careers at Radice
          </p>

          <h1 className="mt-5 text-5xl md:text-6xl font-bold leading-tight text-slate-900">
            Join Us &
            <span className="block text-indigo-700">
              Build The Future
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-slate-600">
            Become part of a community driven by innovation,
            research and impact. Join researchers, creators
            and visionaries shaping tomorrow.
          </p>

          <div className="mt-10 space-y-4 text-slate-700">
            <div>✓ Research Opportunities</div>
            <div>✓ Collaborative Environment</div>
            <div>✓ Innovation-Driven Projects</div>
          </div>
        </div>


        {/* FORM CARD */}
        <div className="bg-white shadow-2xl rounded-3xl p-10 border border-slate-100">

          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Application Form
          </h2>

          <form className="space-y-6">

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  First Name
                </label>

                <input
                  type="text"
                  placeholder="John"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Last Name
                </label>

                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>


            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>


            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Reason for Joining
              </label>

              <textarea
                rows={4}
                placeholder="Tell us why you want to join..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>


            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Upload CV
              </label>

              <input
                type="file"
                className="w-full rounded-xl border border-slate-300 p-3"
              />
            </div>


            {/* Interactive reCAPTCHA checkbox */}
            <div 
              className="border-2 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
              onClick={() => setIsRobotChecked(!isRobotChecked)}
            >
              <div className="flex items-center gap-4">
                <div 
                  className={`w-6 h-6 border-2 rounded-sm flex items-center justify-center transition ${
                    isRobotChecked 
                      ? "bg-indigo-600 border-indigo-600" 
                      : "border-slate-300"
                  }`}
                >
                  {isRobotChecked && (
                    <span className="text-white text-xs font-bold">✓</span>
                  )}
                </div>
                <span className="text-slate-700 text-sm font-medium">
                  I'm not a robot
                </span>
              </div>

              <div className="text-xs text-slate-400">
                reCAPTCHA
              </div>
            </div>


            <button
              disabled={!isRobotChecked}
              className="
                w-full
                py-4
                rounded-2xl
                bg-indigo-900
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

          </form>

        </div>

      </div>
    </main>
  );
}