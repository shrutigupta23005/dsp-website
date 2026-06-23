import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AuthProvider from "@/components/auth/AuthProvider";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/admin/dashboard");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
