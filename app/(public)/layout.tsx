import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-0">{children}</main>
      <Footer />
    </>
  );
}
