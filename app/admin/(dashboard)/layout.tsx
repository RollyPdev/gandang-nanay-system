import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="relative min-h-svh overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <div className="ambient-orb left-0 top-8 h-48 w-48 bg-rose-200/60" />
      <div className="ambient-orb bottom-10 right-10 h-64 w-64 bg-amber-200/60" />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <AdminSidebar />
        <main className="min-w-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
