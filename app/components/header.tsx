"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import Auth from "./auth/auth";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex flex-col gap-2 px-4 py-2.5 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-[1.25rem]shadow-[0_12px_30px_-15px_rgba(15,23,42,0.6)]">
                <Image
                  src="/RadiceLogoNoText_light.svg"
                  alt="RaDiCe Logo"
                  fill
                  sizes="56"
                  className="cover"
                />
              </div>
              <div>
                <p className="text-sm md:text-base font-semibold uppercase tracking-[0.22em] text-slate-900">
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
            <button 
              onClick={() => {
                setAuthMode("login");
                setShowAuth(true);
              }}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition">
              Login
            </button>
            <button 
              onClick={() => {
                setAuthMode("register");
                setShowAuth(true);
              }}
              className="px-4 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-800 transition">
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
             <button 
               onClick={() => {
                 setAuthMode("login");
                 setShowAuth(true);
                 setMenuOpen(false);
               }}
               className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
               Login
             </button>
             <button 
               onClick={() => {
                 setAuthMode("register");
                 setShowAuth(true);
                 setMenuOpen(false);
               }}
               className="w-full rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 transition">
               Sign Up
             </button>
           </div>
         </div>
       </div>

       {/* Auth Modal */}
       {showAuth && (
         <div 
           className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
           onClick={() => setShowAuth(false)}
         >
           <div 
             className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative"
             onClick={(e) => e.stopPropagation()}
           >
             <button 
               onClick={() => setShowAuth(false)}
               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
             >
               ✕
             </button>
             <Auth />
           </div>
         </div>
       )}
     </header>
   );
 }
