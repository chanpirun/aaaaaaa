"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex items-center px-6 bg-gradient-to-br from-[#f5f3ff] via-[#ede9fe] to-[#e0e7ff]">
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 tracking-tight">
            WHERE IDEAS <br />
            COME TO LIFE
          </h1>

          <p className="mt-6 text-gray-600 max-w-md leading-relaxed">
            Radice is a center for applied research and development initiatives 
            of Paragon International University. We are a hub of creativity and discovery, 
            where ideas take flight and possibilities are endless.
          </p>

          {/* CTA */}
          <div className="mt-8 flex items-center gap-4">
            <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition">
              R & D
            </button>

            <span className="text-sm text-gray-500">
              Research & Development
            </span>
          </div>

          {/* Info */}
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
            <span>⭐ 4.8 Innovation Score</span>
            <span>🚀 Advanced Research</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center items-center">

          {/* Glow */}
          <div className="absolute w-[360px] h-[360px] bg-purple-300/30 rounded-full blur-3xl"></div>

          {/* Ring */}
          <div className="absolute w-[260px] h-[260px] rounded-full border border-purple-300/50"></div>

          {/* Image */}
          <Image
            src="/ParagonLogo.png"
            alt="Radice Logo"
            width={200}
            height={200}
            className="relative object-contain drop-shadow-2xl animate-float"
          />

        </div>

      </div>
    </section>
  );
}