import DashboardHeader from "@/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-dvh">
      <DashboardHeader />
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
