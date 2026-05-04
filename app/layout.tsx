import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";
import Header from "./components/header";
import Footer from "./components/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f9f6f4] text-gray-900 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 min-h-0">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}