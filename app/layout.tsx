import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f9f6f4] text-gray-900 flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}