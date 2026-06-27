"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import Auth from "./auth/auth";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <header suppressHydrationWarning className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="w-full border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-2 px-4 py-2.5 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
              <div className="relative h-14 w-14 overflow-hidden rounded-[1.25rem] ">
                <Image
                  src="/RadiceLogoNoText_light.svg"
                  alt="RaDiCe Logo"
                  fill
                  sizes="56"
                  className="cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-900 md:text-base">
                  RaDiCe WMS
                </p>
                <p className="mt-1 text-[0.68rem] uppercase tracking-[0.35em] text-slate-500">
                  Research Center
                </p>
              </div>
            </Link>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm transition hover:bg-gray-50 md:hidden"
              aria-expanded={menuOpen ? "true" : "false"}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((state) => !state)}
            >
              {menuOpen ? (
                <span className="text-xl font-bold">x</span>
              ) : (
                <span className="text-sm font-bold tracking-tight">|||</span>
              )}
            </button>
          </div>

          <div className="hidden items-center gap-8 text-[0.9rem] font-medium text-gray-600 md:flex">
            <Link href="/whoweare" className="transition hover:text-blue-800">
              WHO WE ARE
            </Link>
            <Link href="#" className="transition hover:text-blue-800">
              MEDIA
            </Link>
            <Link href="/joinus/" className="transition hover:text-blue-800">
              JOIN US
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => {
                setShowAuth(true);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition hover:bg-gray-100"
            >
              Login
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${menuOpen ? "max-h-96" : "max-h-0"}`}
        >
          <nav className="flex flex-col gap-2 px-4 pb-4 text-sm text-gray-700">
            <Link
              href="/whoweare"
              className="rounded-lg px-3 py-2 transition hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              WHO WE ARE
            </Link>
            <Link
              href="#"
              className="rounded-lg px-3 py-2 transition hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              MEDIA
            </Link>
            <Link
              href="/joinus/"
              className="rounded-lg px-3 py-2 transition hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              JOIN US
            </Link>
          </nav>
          <div className="flex flex-col gap-2 border-t border-gray-200 px-4 pb-4 pt-4">
            <button
              onClick={() => {
                setShowAuth(true);
                setMenuOpen(false);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition hover:bg-gray-100"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
          onClick={() => setShowAuth(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-800 to-slate-900 p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] md:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-violet-600/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 right-8 h-40 w-40 rounded-full bg-indigo-600/20 blur-3xl" />

            {/* Close button */}
            <button
              onClick={() => setShowAuth(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-red-400"
              aria-label="Close login modal"
            >
              <X size={18} />
            </button>

            <Auth />
          </div>
        </div>
      )}
    </header>
  );
}
