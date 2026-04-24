"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full flex justify-center pt-6 transition-all duration-300">
      <div className="w-[90%] max-w-6xl bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-md" />
          <div>
            <p className="font-semibold text-sm">NovaLab</p>
            <p className="text-xs text-gray-500">Smart Research</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <Link href="#">WHO WE ARE</Link>
          <Link href="#">MEDIA</Link>
          <Link href="#">JOIN US</Link>
          
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100">
            Login
          </button>
          <button className="px-4 py-1.5 text-sm rounded-lg bg-black text-white hover:bg-gray-800">
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
}