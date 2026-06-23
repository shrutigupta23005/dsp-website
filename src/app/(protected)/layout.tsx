import AuthProvider from "@/components/auth/AuthProvider";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
