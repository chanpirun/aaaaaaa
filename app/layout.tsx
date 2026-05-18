import "./globals.css";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-[#f9f6f4] text-gray-900 flex flex-col min-h-screen"
      >
        <Script
          id="sanitize-extension-hydration-noise"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var attrs = [
                  "fdprocessedid",
                  "data-new-gr-c-s-check-loaded",
                  "data-gr-ext-installed"
                ];
                var selector = attrs.map(function (attr) {
                  return "[" + attr + "]";
                }).join(",");

                function stripAttrs(root) {
                  if (!root || !root.querySelectorAll) return;
                  if (root.hasAttribute) {
                    for (var i = 0; i < attrs.length; i += 1) {
                      root.removeAttribute(attrs[i]);
                    }
                  }
                  var nodes = root.querySelectorAll(selector);
                  for (var n = 0; n < nodes.length; n += 1) {
                    for (var a = 0; a < attrs.length; a += 1) {
                      nodes[n].removeAttribute(attrs[a]);
                    }
                  }
                }

                stripAttrs(document.documentElement);
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
