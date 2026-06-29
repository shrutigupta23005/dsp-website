"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import useSWR from "swr";
import { Menu, Search, Bell, LogOut, User as UserIcon } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

interface AdminTopBarProps {
  title: string;
  breadcrumb: string;
  onMenuToggle: () => void;
  user: {
    name?: string | null;
    email?: string | null;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminTopBar({
  title,
  breadcrumb,
  onMenuToggle,
  user,
}: AdminTopBarProps) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const { data: notifData, mutate: mutateNotifs } = useSWR(
    "/api/admin/notifications",
    fetcher,
    { refreshInterval: 30000 } // Poll every 30s
  );

  const notifications = notifData?.notifications ?? [];
  const unreadCount = notifData?.unreadCount ?? 0;

  // Handle clicking outside of dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Simulate marking all read locally
    mutateNotifs({ notifications, unreadCount: 0 }, false);
  };

  return (
    <header className="h-16 w-full bg-[#141414] border-b border-[#1E1E1E] flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left: Mobile hamburger menu + page title & breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors p-1 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-[#F5F5F5] font-sans leading-tight">
            {title}
          </h1>
          <span className="text-[11px] font-mono text-[#6B6B6B] leading-none mt-0.5">
            {breadcrumb}
          </span>
        </div>
      </div>

      {/* Right side: Search, Notifications, Avatar */}
      <div className="flex items-center gap-4">
        {/* Search Bar (280px wide) */}
        <div
          onClick={() => window.dispatchEvent(new CustomEvent("open-admin-search"))}
          className="hidden md:flex items-center w-[280px] h-9 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 gap-2 cursor-pointer hover:border-[#C9933A] transition-colors group"
        >
          <Search className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#C9933A] transition-colors" />
          <span className="text-xs text-[#6B6B6B] flex-1 font-sans select-none">
            Search products, users...
          </span>
          <span className="text-[9px] font-mono text-[#3A3A3A] bg-[#141414] border border-[#2A2A2A] px-1.5 py-0.5 rounded uppercase">
            Cmd K
          </span>
        </div>

        {/* Search button for Mobile */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-admin-search"))}
          className="md:hidden text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notification Bell with Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors p-1.5 rounded-lg hover:bg-[#1A1A1A] cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#C9933A] text-[#0F0F0F] font-mono font-bold text-[9px] rounded-full flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#1A1A1A] border border-[#242424] rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between p-4 border-b border-[#242424]">
                <h3 className="text-sm font-semibold text-[#F5F5F5] font-sans">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#C9933A] hover:text-[#E5AC52] transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Scrollable list */}
              <div className="overflow-y-auto max-h-64 divide-y divide-[#242424] custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notif: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => {
                        router.push(notif.link);
                        setNotifOpen(false);
                      }}
                      className="p-3 flex items-start gap-3 hover:bg-[#1E1A14] transition-colors cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#C9933A] mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#F5F5F5] font-sans leading-normal break-words">
                          {notif.message}
                        </p>
                        <span className="text-[10px] font-mono text-[#6B6B6B] block mt-1">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-[#6B6B6B] font-sans">
                    No new activity.
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-[#141414] border-t border-[#242424] text-center">
                <button
                  onClick={() => {
                    router.push("/admin/analytics");
                    setNotifOpen(false);
                  }}
                  className="text-xs text-[#C9933A] hover:text-[#E5AC52] font-medium font-sans cursor-pointer"
                >
                  View all activity
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-[#242424]" />

        {/* Avatar Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 rounded-full bg-[#C9933A] text-[#0F0F0F] flex items-center justify-center font-sans font-semibold text-sm transition-transform active:scale-95 cursor-pointer"
          >
            {getInitials(user.name || "Admin")}
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-[#242424] rounded-xl shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-[#242424] mb-1">
                <p className="text-xs text-[#6B6B6B] font-sans">Signed in as</p>
                <p className="text-sm font-semibold text-[#F5F5F5] truncate font-sans">
                  {user.name || "Admin"}
                </p>
              </div>

              <button
                onClick={() => {
                  router.push("/admin/settings");
                  setProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-[#F5F5F5] hover:bg-[#242424] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#C9933A]" />
                <span>View Profile</span>
              </button>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-2 text-xs text-[#EF4444] hover:bg-[#EF4444]/10 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-[#EF4444]" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
