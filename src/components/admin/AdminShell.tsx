import Link from "next/link";
import { BarChart3, Boxes, LayoutDashboard, Tags, Users, Warehouse } from "lucide-react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/brands", label: "Brands", icon: Warehouse },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-secondary">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-background-primary p-6 text-white lg:block">
        <Link href="/" className="block">
          <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            Delhi Shoe Palace
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-accent">Admin</p>
        </Link>
        <nav className="mt-10 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                <Icon className="h-4 w-4 text-accent" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-6">
            <Link href="/admin/dashboard" className="font-semibold text-text-primary lg:hidden">DSP Admin</Link>
            <Link href="/" className="text-sm font-medium text-accent hover:text-accent-hover">View Website</Link>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
