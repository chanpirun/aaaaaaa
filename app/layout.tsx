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
                  "data-gr-ext-installed",
                  "cz-shortcut-listen"
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

                var observer = new MutationObserver(function (mutations) {
                  for (var m = 0; m < mutations.length; m += 1) {
                    var mutation = mutations[m];
                    if (mutation.type === "attributes" && mutation.target) {
                      for (var i = 0; i < attrs.length; i += 1) {
                        if (mutation.attributeName === attrs[i]) {
                          mutation.target.removeAttribute(attrs[i]);
                        }
                      }
                    }
                    if (mutation.type === "childList") {
                      for (var c = 0; c < mutation.addedNodes.length; c += 1) {
                        var node = mutation.addedNodes[c];
                        if (node && node.nodeType === 1) {
                          stripAttrs(node);
                        }
                      }
                    }
                  }
                });

                observer.observe(document.documentElement, {
                  subtree: true,
                  childList: true,
                  attributes: true,
                  attributeFilter: attrs
                });
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
