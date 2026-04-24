export default function Footer() {
  return (
    <footer className="w-full mt-20 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 text-sm text-gray-600">
        
        {/* Brand */}
        <div>
          <h2 className="font-semibold text-black mb-2">NovaLab</h2>
          <p className="text-gray-500">
            AI-powered research platform to explore insights faster and smarter.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-medium text-black mb-2">Product</h3>
          <ul className="space-y-1">
            <li>Features</li>
            <li>Integrations</li>
            <li>API</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-black mb-2">Company</h3>
          <ul className="space-y-1">
            <li>About</li>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-black mb-2">Support</h3>
          <ul className="space-y-1">
            <li>Help Center</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="w-full bg-[#111] border-t border-white/10">
  <div className="text-center text-sm text-gray-400 py-5">
    Powered By ParagonIU Cloud © {new Date().getFullYear()}{" "}
    <span className="text-gray-300 font-medium">
       All rights reserved.
    </span>. 
  </div>
</div>
    </footer>
  );
}