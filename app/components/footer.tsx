import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="w-full text-slate-800 border-t border-slate-200"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #c7d2fe 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

        {/* Logo */}
        <div>
          <h2 className="text-xl font-bold mb-3 tracking-wide text-indigo-900">RADICE WMS</h2>
          <div className="w-full h-0.5 bg-linear-to-r from-indigo-500 to-transparent mb-5" />
          <p className="text-slate-500 text-sm leading-relaxed">
            A research and development center for tranforming ideas and research into real world projects.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base font-bold mb-3 tracking-wide text-indigo-900">Quick Links</h3>
          <div className="w-full h-0.5 bg-linear-to-r from-indigo-500 to-transparent mb-5" />
          <ul className="text-sm text-slate-500">
            {[
              { label: "Who We Are", href: "/whoweare" },
              { label: "Media",      href: "#media" },
              { label: "Join Us",    href: "/joinus" },
            ].map(({ label, href }) => (
              <li key={label} className="flex items-center gap-2 border-b border-slate-200 py-3">
                <span className="text-indigo-400 text-xs">&#8594;</span>
                <Link href={href} className="hover:text-indigo-700 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Find Us */}
        <div>
          <h3 className="text-base font-bold mb-3 tracking-wide text-indigo-900">Find Us</h3>
          <div className="w-full h-0.5 bg-linear-to-r from-indigo-500 to-transparent mb-5" />
          <div className="text-sm text-slate-500 space-y-3 leading-relaxed">
            <p>
              No. 8, St. 315,<br />
              Boeng Kak 1, Tuol Kork,<br />
              Phnom Penh, Cambodia, 12151
            </p>
            <p className="text-indigo-600 font-medium">example@paragoniu.edu.kh</p>
          </div>
          <div className="w-full h-0.5 bg-linear-to-r from-indigo-500 to-transparent mt-6" />
        </div>

        {/* Location */}
        <div>
          <h3 className="text-base font-bold mb-3 tracking-wide text-indigo-900">Location</h3>
          <div className="w-full h-0.5 bg-linear-to-r from-indigo-500 to-transparent mb-5" />
          <div className="w-full h-40 sm:h-48 lg:h-44 rounded overflow-hidden shadow-sm">
            <iframe
              src="https://maps.google.com/maps?q=Paragon+International+University+Phnom+Penh+Cambodia&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-white/60 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-sm text-slate-500 py-4 px-4 text-center">
          <span>Powered By ParagonIU Cloud &copy; {new Date().getFullYear()}</span>
          <span className="hidden sm:inline">·</span>
          <span className="text-slate-700 font-medium">All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
