"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex items-center  bg-gradient-to-br from-[#f8f7ff] via-[#f1efff] to-[#e9ecff]">
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2  gap-20 items-center ">
        {/* LEFT */}
        <div>
          <p className="mb-4 text-sm font-medium tracking-[0.2em] uppercase text-indigo-600">
            Research & Innovation Hub
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-slate-900">
            Where Ideas <br />
            <span className="text-indigo-700">Come To Life</span>
          </h1>

          <p className="mt-6 max-w-lg text-base md:text-lg leading-8 text-slate-600">
            Radice fosters applied research, innovation and discovery,
            transforming creative ideas into impactful solutions.
          </p>

          {/* CTA */}
<div className="mt-8 flex items-center gap-5">

  <button
    className="
      px-7 py-3 rounded-xl
      bg-indigo-900 text-white font-medium
      shadow-lg
      hover:scale-105
      transition duration-300
    "
  >
    Explore R&D
  </button>

  <button
    className="
      group
      px-5 py-3 rounded-xl
      border border-slate-300/70
      bg-white/70 backdrop-blur-md

      text-sm font-medium tracking-wide
      text-slate-700

      shadow-sm

      hover:bg-white
      hover:border-indigo-300
      hover:text-indigo-700
      hover:-translate-y-1
      hover:shadow-lg

      transition-all duration-300
    "
  >
    <span className="flex items-center gap-2">
      <span
        className="
          w-2 h-2 rounded-full
          bg-indigo-500
          group-hover:scale-125
          transition
        "
      />
      Research & Development
    </span>
  </button>

</div>

          {/* Stats */}
          <div className="mt-7 flex flex-wrap gap-6 text-sm text-slate-500"></div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center items-center">
          {/* Glow */}
          <div className="absolute w-[380px] h-[380px] rounded-full bg-indigo-300/30 blur-3xl animate-pulseGlow" />

          {/* Rings */}
          <div className="absolute w-[280px] h-[280px] rounded-full border border-indigo-300/60 animate-spinSlow" />
          <div className="absolute w-[340px] h-[340px] rounded-full border border-indigo-200/30 animate-spinReverse" />

          {/* Logo */}
          <Image
            src="/ParagonLogo.png"
            alt="Radice Logo"
            width={240}
            height={240}
            priority
            className="relative z-10 animate-float drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
