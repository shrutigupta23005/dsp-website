import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AuthProvider from "@/components/auth/AuthProvider";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return <AuthProvider>{children}</AuthProvider>;
}
