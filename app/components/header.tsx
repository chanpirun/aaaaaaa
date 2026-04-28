"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-[1.75rem]shadow-[0_18px_45px_-20px_rgba(15,23,42,0.7)]">
                <Image
                  src="/RadiceLogoNoText_light.svg"
                  alt="RaDiCe Logo"
                  fill
                  sizes="56"
                  className="cover"
                />
              </div>
              <div>
                <p className="text-base md:text-lg font-semibold uppercase tracking-[0.22em] text-slate-900">
                  RaDiCe WMS
                </p>
                <p className="mt-1 text-[0.68rem] uppercase tracking-[0.35em] text-slate-500">
                  Research Center
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm transition hover:bg-gray-50 md:hidden"
              aria-expanded={menuOpen ? "true" : "false"}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((state) => !state)}
            >
              {menuOpen ? (
                <span className="text-xl font-bold">×</span>
              ) : (
                <span className="text-lg">☰</span>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[0.9rem] font-medium text-gray-600">
            <Link href="/whoweare" className="hover:text-blue-800 transition">
              WHO WE ARE
            </Link>
            <Link href="#" className="hover:text-blue-800 transition">
              MEDIA
            </Link>
            <Link href="/joinus/" className="hover:text-blue-800 transition">
              JOIN US
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100">
              Login
            </button>
            <button className="px-4 py-1.5 text-sm rounded-lg bg-black text-white hover:bg-gray-800">
              Get Started
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96" : "max-h-0"}`}
        >
          <nav className="flex flex-col gap-2 px-4 pb-4 text-sm text-gray-700">
            <Link
              href="/whoweare"
              className="rounded-lg px-3 py-2 hover:bg-gray-100 transition"
              onClick={() => setMenuOpen(false)}
            >
              WHO WE ARE
            </Link>
            <Link
              href="#"
              className="rounded-lg px-3 py-2 hover:bg-gray-100 transition"
              onClick={() => setMenuOpen(false)}
            >
              MEDIA
            </Link>
            <Link
              href="/joinus/"
              className="rounded-lg px-3 py-2 hover:bg-gray-100 transition"
              onClick={() => setMenuOpen(false)}
            >
              JOIN US
            </Link>
          </nav>
          <div className="flex flex-col gap-2 border-t border-gray-200 px-4 pt-4 pb-4">
            <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Login
            </button>
            <button className="w-full rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
