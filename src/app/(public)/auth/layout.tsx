import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="block text-center mb-8"
        >
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Delhi Shoe Palace
          </h1>
          <span className="text-[10px] tracking-[0.2em] text-[#C9933A] uppercase">
            Est. 2001
          </span>
        </Link>

        {/* Card */}
        <div className="bg-card rounded-2xl p-10 shadow-[0_24px_60px_rgb(10_10_10/0.16)]">
          {children}
        </div>
      </div>
    </div>
  );
}
