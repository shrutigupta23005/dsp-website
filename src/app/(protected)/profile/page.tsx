import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Heart, Eye, Scale, FileText, LogOut, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EditProfileForm from "@/components/profile/EditProfileForm";

export const metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/profile");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
      _count: {
        select: {
          wishlist: true,
          recentlyViewed: true,
        },
      },
    },
  });

  if (!user) redirect("/auth/login");

  const initials = (user.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = user.createdAt.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const quickLinks = [
    {
      href: "/wishlist",
      icon: Heart,
      label: "My Wishlist",
      count: user._count.wishlist,
    },
    {
      href: "/compare",
      icon: Scale,
      label: "Compare Products",
    },
    {
      href: "/quiz",
      icon: FileText,
      label: "Style Quiz",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-secondary pt-28">
        <section className="container-wide pb-16 max-w-3xl mx-auto">
          {/* Profile Hero Card */}
          <div className="rounded-2xl bg-[#0A0A0A] p-8 md:p-12 text-center relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-1/4 w-64 h-64 bg-accent rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-accent mx-auto flex items-center justify-center">
                <span
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {initials}
                </span>
              </div>
              <h1
                className="text-3xl font-bold text-white mt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {user.name || "Anonymous"}
              </h1>
              <p className="text-white/40 text-sm mt-1">{user.email}</p>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div>
                  <p
                    className="text-accent text-lg font-bold"
                    style={{ fontFamily: "var(--font-utility)" }}
                  >
                    {user._count.wishlist}
                  </p>
                  <p className="text-white/30 text-xs">Saved</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p
                    className="text-accent text-lg font-bold"
                    style={{ fontFamily: "var(--font-utility)" }}
                  >
                    {user._count.recentlyViewed}
                  </p>
                  <p className="text-white/30 text-xs">Viewed</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-white/30 text-xs">Member since</p>
                  <p className="text-white/60 text-xs mt-0.5">{memberSince}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="mt-8 rounded-xl border border-border bg-white p-6 md:p-8">
            <EditProfileForm user={user} />
          </div>

          {/* Quick Links */}
          <div className="mt-8 rounded-xl border border-border bg-white divide-y divide-border">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 px-6 py-4 hover:bg-background-secondary transition-colors"
              >
                <link.icon className="w-5 h-5 text-accent" />
                <span className="flex-1 text-sm font-medium text-text-primary">
                  {link.label}
                </span>
                {link.count !== undefined && (
                  <span
                    className="text-sm text-text-muted"
                    style={{ fontFamily: "var(--font-utility)" }}
                  >
                    {link.count}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </Link>
            ))}
          </div>

          {/* Sign Out */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
