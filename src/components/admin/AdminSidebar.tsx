"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import useSWR from "swr";
import {
  LayoutDashboard,
  BarChart2,
  Package,
  Tag,
  Award,
  Users,
  ShieldOff,
  Settings,
  Search,
  LogOut,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
  shortcut?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: stats } = useSWR("/api/admin/stats", fetcher, {
    revalidateOnFocus: false,
  });

  const productCount = stats?.totalProducts ?? 0;
  const userCount = stats?.totalUsers ?? 0;

  const groups: { label: string; items: SidebarItem[] }[] = [
    {
      label: "Overview",
      items: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
      ],
    },
    {
      label: "Catalog",
      items: [
        {
          href: "/admin/products",
          label: "Products",
          icon: Package,
          badge: productCount,
        },
        { href: "/admin/categories", label: "Categories", icon: Tag },
        { href: "/admin/brands", label: "Brands", icon: Award },
      ],
    },
    {
      label: "Users",
      items: [
        { href: "/admin/users", label: "Users", icon: Users, badge: userCount },
        {
          href: "/admin/users?filter=blocked",
          label: "Blocked Users",
          icon: ShieldOff,
        },
      ],
    },
    {
      label: "System",
      items: [
        { href: "/admin/settings", label: "Settings", icon: Settings },
        {
          href: "#search",
          label: "Search",
          icon: Search,
          shortcut: "Cmd K",
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("open-admin-search"));
          },
        },
      ],
    },
  ];

  return (
    <aside className="w-[260px] h-screen bg-[#141414] border-r border-[#1E1E1E] flex flex-col fixed inset-y-0 left-0 z-30">
      {/* Top Section - Header */}
      <div className="h-[72px] px-6 border-b border-[#1E1E1E] flex items-center gap-3">
        <div className="w-9 h-9 border border-[#C9933A] rounded flex items-center justify-center bg-transparent">
          <span className="font-mono font-bold text-lg text-[#C9933A]">DSP</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#F5F5F5] font-sans">
            Delhi Shoe Palace
          </span>
          <span className="text-[10px] font-mono text-[#C9933A]/60 uppercase tracking-wider">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation Links Area */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-6 custom-scrollbar">
        {groups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="text-[10px] font-mono font-bold text-[#3A3A3A] uppercase tracking-widest px-4 mb-2">
              {group.label}
            </h3>
            {group.items.map((item, itemIdx) => {
              const isActive =
                item.href !== "#search" && item.href !== "/admin/users?filter=blocked"
                  ? pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
                  : item.href === "/admin/users?filter=blocked"
                  ? pathname === "/admin/users" && window.location.search.includes("filter=blocked")
                  : false;

              const Icon = item.icon;

              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center justify-between h-10 px-4 rounded-r-lg font-sans text-sm font-medium transition-all duration-150 relative cursor-pointer",
                    isActive
                      ? "bg-[#1A1205] text-[#C9933A] border-l-3 border-[#C9933A] shadow-[inset_3px_0_0_#C9933A]"
                      : "text-[#6B6B6B] hover:bg-[#1A1A1A] hover:text-[#F5F5F5]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-[#C9933A]" : "text-[#3A3A3A] group-hover:text-[#C9933A]"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {/* Badges and shortcuts */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[11px] font-mono font-bold bg-[#1A1A1A] border border-[#242424] text-[#C9933A] rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                  {item.shortcut && (
                    <span className="text-[10px] font-mono text-[#3A3A3A] bg-[#0F0F0F] px-1.5 py-0.5 rounded border border-[#242424]">
                      {item.shortcut}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Section - User Row */}
      <div className="p-4 border-t border-[#1E1E1E] space-y-3 bg-[#141414]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C9933A] text-[#0F0F0F] flex items-center justify-center font-sans font-medium text-xs">
            {getInitials(user.name || "Admin User")}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[13px] font-medium text-[#F5F5F5] truncate font-sans">
              {user.name || "Admin"}
            </span>
            <span className="text-[11px] font-mono text-[#6B6B6B] truncate">
              {user.email || "admin@delhishoepalace.com"}
            </span>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 h-9 px-3 rounded-lg text-left text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
