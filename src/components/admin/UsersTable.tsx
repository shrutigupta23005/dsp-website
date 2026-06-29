"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import {
  Search,
  Users as UsersIcon,
  ShieldAlert,
  UserCheck,
  Eye,
  Lock,
  Unlock,
  Plus,
  Heart,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import DataTable from "./DataTable";
import ConfirmDialog from "./ConfirmDialog";
import { ColumnDef } from "@tanstack/react-table";

interface UsersTableProps {
  initialUsers: any[];
  initialTotal: number;
  activeCount: number;
  blockedCount: number;
  currentUserId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UsersTable({
  initialUsers,
  initialTotal,
  activeCount: initialActiveCount,
  blockedCount: initialBlockedCount,
  currentUserId,
}: UsersTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, blocked

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // SWR query
  const queryUrl = `/api/admin/users?page=${page}&limit=20&search=${encodeURIComponent(
    debouncedSearch
  )}&filter=${filter}`;

  const { data, mutate, isValidating } = useSWR(queryUrl, fetcher, {
    fallbackData: {
      users: initialUsers,
      total: initialTotal,
      page: 1,
      totalPages: Math.ceil(initialTotal / 20),
    },
    revalidateOnFocus: false,
  });

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  // Aggregate stats (dynamically count from current data or use initial server totals)
  const totalUsersCount = initialTotal;
  const activeUsersCount = initialActiveCount;
  const blockedUsersCount = initialBlockedCount;

  // Block/Unblock action
  const handleToggleBlock = async (userId: string, currentBlocked: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !currentBlocked }),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to update user");
      }
      toast.success(
        currentBlocked ? "User unblocked successfully" : "User blocked successfully"
      );
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user status");
    }
  };

  const handleInviteUser = () => {
    toast.info("Coming soon");
  };

  // Table Column Definitions
  const columns: ColumnDef<any>[] = [
    {
      id: "user",
      header: "User",
      cell: ({ row }) => {
        const initials = getInitials(row.original.name || "Customer");
        return (
          <div className="flex items-center gap-3">
            {row.original.image ? (
              <img
                src={row.original.image}
                alt={row.original.name}
                className="w-9 h-9 rounded-full object-cover bg-[#141414]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#C9933A] text-[#0F0F0F] flex items-center justify-center font-sans font-semibold text-xs">
                {initials}
              </div>
            )}
            <div>
              <div className="font-semibold text-[#F5F5F5] font-sans flex items-center gap-1.5">
                {row.original.name || "Customer"}
                {row.original.id === currentUserId && (
                  <span className="text-[9px] font-mono text-[#C9933A] bg-[#1A1205] border border-[#C9933A]/30 px-1 py-0.2 rounded">
                    (You)
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-[#6B6B6B] block">
                {row.original.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "role",
      header: "Role",
      cell: ({ row }) => {
        const isAdmin = row.original.role === "ADMIN";
        return (
          <span
            className={cn(
              "font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded",
              isAdmin
                ? "bg-[#7C3AED]/20 text-[#C4B5FD] border border-[#7C3AED]/40"
                : "bg-[#1A1A1A] border border-[#242424] text-[#6B6B6B]"
            )}
          >
            {row.original.role}
          </span>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const isBlocked = row.original.isBlocked;
        return (
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs font-sans font-medium",
              isBlocked ? "text-[#EF4444]" : "text-[#22C55E]"
            )}
          >
            <span
              className={cn("w-1.5 h-1.5 rounded-full", isBlocked ? "bg-[#EF4444]" : "bg-[#22C55E]")}
            />
            {isBlocked ? "Blocked" : "Active"}
          </span>
        );
      },
    },
    {
      id: "wishlist",
      header: "Wishlist",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[#6B6B6B] flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-[#6B6B6B]" />
          {row.original._count?.wishlist || 0}
        </span>
      ),
    },
    {
      id: "viewed",
      header: "Viewed",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[#6B6B6B] flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#6B6B6B]" />
          {row.original._count?.recentlyViewed || 0}
        </span>
      ),
    },
    {
      id: "joined",
      header: "Joined",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <span className="font-mono text-xs text-[#6B6B6B]">
            {date.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "2-digit",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isSelf = row.original.id === currentUserId;
        const isBlocked = row.original.isBlocked;

        return (
          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5">
            {/* View Details */}
            <button
              onClick={() => router.push(`/admin/users/${row.original.id}`)}
              className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#C9933A] hover:bg-[#242424] transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Block/Unblock toggle */}
            {!isSelf ? (
              <ConfirmDialog
                trigger={
                  <button
                    className={cn(
                      "p-1.5 rounded-lg text-[#6B6B6B] transition-colors cursor-pointer",
                      isBlocked ? "hover:text-[#22C55E]" : "hover:text-[#EF4444]"
                    )}
                  >
                    {isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  </button>
                }
                title={isBlocked ? "Unblock User?" : "Block User?"}
                description={
                  isBlocked
                    ? `Are you sure you want to unblock ${row.original.name}? They will regain access to their account.`
                    : `Are you sure you want to block ${row.original.name}? They will be immediately signed out and unable to sign back in.`
                }
                confirmLabel={isBlocked ? "Unblock" : "Block"}
                variant={isBlocked ? "default" : "danger"}
                onConfirm={() => handleToggleBlock(row.original.id, isBlocked)}
              />
            ) : (
              <span className="text-[10px] font-mono text-[#3A3A3A] italic pl-2 select-none">
                Admin
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* 3 mini stat cards */}
      <div className="grid gap-6 grid-cols-3">
        {[
          ["Total Customers", totalUsersCount, UsersIcon],
          ["Active Customers", activeUsersCount, UserCheck],
          ["Blocked Customers", blockedUsersCount, ShieldAlert],
        ].map(([label, value, Icon]: any) => (
          <div
            key={label}
            className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-5 flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#6B6B6B] uppercase tracking-wider block">
                {label}
              </span>
              <p className="text-2xl font-bold font-mono text-[#C9933A]">{value}</p>
            </div>
            <Icon className="w-6 h-6 text-[#6B6B6B]" />
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#F5F5F5] font-sans">User Directory</h2>
          <span className="font-mono text-xs text-[#C9933A] border border-[#C9933A]/20 bg-[#1A1205] rounded-full px-2.5 py-0.5">
            {total}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center w-60 h-9 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 gap-2 focus-within:border-[#C9933A] transition-colors">
            <Search className="w-4 h-4 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-[#F5F5F5] text-xs font-sans placeholder-[#6B6B6B]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex bg-[#141414] border border-[#242424] p-0.5 rounded-lg">
            {[
              ["all", "All"],
              ["active", "Active"],
              ["blocked", "Blocked"],
            ].map(([f, label]) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={cn(
                  "px-3 h-7 rounded text-[11px] font-semibold font-sans transition-colors cursor-pointer",
                  filter === f
                    ? f === "blocked"
                      ? "bg-[#7F1D1D] text-[#FCA5A5]"
                      : f === "active"
                      ? "bg-[#14532D] text-[#86EFAC]"
                      : "bg-[#1A1A1A] text-[#F5F5F5] border border-[#242424]"
                    : "text-[#6B6B6B] hover:text-[#F5F5F5]"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Invite button */}
          <button
            onClick={handleInviteUser}
            className="border border-[#C9933A] bg-transparent text-[#C9933A] hover:bg-[#C9933A] hover:text-[#0F0F0F] transition-colors h-9 px-4 rounded-lg text-xs font-semibold font-sans flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Invite User
          </button>
        </div>
      </div>

      {/* USER DATA TABLE */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isValidating}
        onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
        pagination={{
          page,
          totalPages,
          onPageChange: (p) => setPage(p),
        }}
      />
    </div>
  );
}
