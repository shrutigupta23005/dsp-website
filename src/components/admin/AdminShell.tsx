"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import CommandSearch from "./CommandSearch";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Generate Page Title and Breadcrumb from Pathname
  const getPageMeta = () => {
    if (pathname.startsWith("/admin/dashboard")) {
      return { title: "Dashboard Overview", breadcrumb: "Admin / Dashboard" };
    }
    if (pathname.startsWith("/admin/products/new")) {
      return { title: "Add New Product", breadcrumb: "Admin / Products / New" };
    }
    if (pathname.includes("/edit")) {
      return { title: "Edit Product Details", breadcrumb: "Admin / Products / Edit" };
    }
    if (pathname.startsWith("/admin/products")) {
      return { title: "Product Inventory", breadcrumb: "Admin / Products" };
    }
    if (pathname.startsWith("/admin/categories")) {
      return { title: "Category Catalog", breadcrumb: "Admin / Categories" };
    }
    if (pathname.startsWith("/admin/brands")) {
      return { title: "Brand Catalog", breadcrumb: "Admin / Brands" };
    }
    if (pathname.match(/\/admin\/users\/[c-z0-9]+/i)) {
      return { title: "User Profile & Activity", breadcrumb: "Admin / Users / Detail" };
    }
    if (pathname.startsWith("/admin/users")) {
      return { title: "User Directory", breadcrumb: "Admin / Users" };
    }
    if (pathname.startsWith("/admin/analytics")) {
      return { title: "Store Analytics", breadcrumb: "Admin / Analytics" };
    }
    if (pathname.startsWith("/admin/settings")) {
      return { title: "Admin Settings", breadcrumb: "Admin / Settings" };
    }
    return { title: "Admin Panel", breadcrumb: "Admin" };
  };

  const { title, breadcrumb } = getPageMeta();

  return (
    <div className="dark min-h-screen bg-[#0F0F0F] text-[#F5F5F5] font-sans antialiased flex">
      {/* 1. Desktop Fixed Sidebar (260px wide) */}
      <div className="hidden lg:block w-[260px] shrink-0">
        <AdminSidebar user={user} />
      </div>

      {/* 2. Mobile Sidebar Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all duration-300"
        />
      )}

      {/* 3. Mobile Sidebar Drawer Container */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 w-[260px] z-50 transform transition-transform duration-300 ease-in-out flex",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative w-full h-full flex">
          <AdminSidebar user={user} />
          {/* Close button outside drawer */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 -right-12 text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 4. Main Panel Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <AdminTopBar
          title={title}
          breadcrumb={breadcrumb}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          user={user}
        />

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>

      {/* 5. Global Command Search Modal */}
      <CommandSearch />
    </div>
  );
}
