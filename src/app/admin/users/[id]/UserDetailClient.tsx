"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Heart,
  Eye,
  Lock,
  Unlock,
  AlertCircle,
  Clock,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface UserDetailClientProps {
  user: any;
  currentUserId: string;
}

export default function UserDetailClient({
  user: initialUser,
  currentUserId,
}: UserDetailClientProps) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [isMutating, setIsMutating] = useState(false);

  const isSelf = user.id === currentUserId;

  const handleToggleBlock = async () => {
    setIsMutating(true);
    const newBlockState = !user.isBlocked;

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: newBlockState }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");

      setUser((prev: any) => ({ ...prev, isBlocked: newBlockState }));
      toast.success(
        newBlockState ? "User blocked successfully" : "User unblocked successfully"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update user block status");
    } finally {
      setIsMutating(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B6B6B] hover:text-[#C9933A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>
      </div>

      {/* PROFILE HEADER CARD */}
      <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#C9933A] text-[#0F0F0F] flex items-center justify-center font-sans font-medium text-2xl">
            {getInitials(user.name || "Customer")}
          </div>

          <div className="space-y-1">
            <h2
              className="text-2xl font-bold text-[#F5F5F5] font-serif leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {user.name || "Customer"}
            </h2>
            <p className="text-sm font-mono text-[#6B6B6B]">{user.email}</p>
            <p className="text-[11px] font-mono text-[#3A3A3A]">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Right Details */}
        <div className="flex flex-col md:items-end gap-3">
          <div className="flex items-center gap-2">
            {/* Role */}
            <span
              className={cn(
                "font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                user.role === "ADMIN"
                  ? "bg-[#7C3AED]/20 text-[#C4B5FD] border border-[#7C3AED]/40"
                  : "bg-[#141414] border border-[#242424] text-[#6B6B6B]"
              )}
            >
              {user.role}
            </span>

            {/* Status */}
            <span
              className={cn(
                "font-sans text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5",
                user.isBlocked
                  ? "bg-[#7F1D1D]/30 text-[#FCA5A5] border border-[#7F1D1D]/55"
                  : "bg-[#14532D]/30 text-[#86EFAC] border border-[#14532D]/55"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  user.isBlocked ? "bg-[#EF4444]" : "bg-[#22C55E]"
                )}
              />
              {user.isBlocked ? "Blocked" : "Active"}
            </span>
          </div>

          {/* Activity counters */}
          <div className="flex gap-4 text-xs font-mono text-[#6B6B6B] mt-1">
            <span>
              <span className="text-[#C9933A] font-bold">{user._count?.wishlist ?? 0}</span>{" "}
              wishlisted
            </span>
            <span>
              <span className="text-[#C9933A] font-bold">{user._count?.recentlyViewed ?? 0}</span>{" "}
              viewed
            </span>
          </div>

          {/* Block action button */}
          {!isSelf ? (
            <ConfirmDialog
              trigger={
                <button
                  type="button"
                  disabled={isMutating}
                  className={cn(
                    "mt-2 h-9 px-4 rounded-lg text-xs font-semibold font-sans flex items-center gap-1.5 cursor-pointer border transition-colors bg-transparent",
                    user.isBlocked
                      ? "border-[#C9933A] text-[#C9933A] hover:bg-[#C9933A] hover:text-[#0F0F0F]"
                      : "border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
                  )}
                >
                  {user.isBlocked ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      Unblock User
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Block User
                    </>
                  )}
                </button>
              }
              title={user.isBlocked ? "Unblock User?" : "Block User?"}
              description={
                user.isBlocked
                  ? `Are you sure you want to unblock ${user.name}?`
                  : `Are you sure you want to block ${user.name}? They will lose catalog access.`
              }
              confirmLabel={user.isBlocked ? "Unblock" : "Block"}
              variant={user.isBlocked ? "default" : "danger"}
              onConfirm={handleToggleBlock}
            />
          ) : (
            <span className="text-[10px] font-mono text-[#3A3A3A] italic select-none mt-2">
              Cannot block yourself
            </span>
          )}
        </div>
      </div>

      {/* ACTIVITY SECTION (Two columns) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Recent Wishlist */}
        <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-base font-semibold text-[#F5F5F5] font-sans flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#C9933A]" />
              Recent Wishlist
            </h3>
            <span className="text-xs font-mono text-[#6B6B6B] block mb-4">
              Saved items catalog
            </span>

            <div className="space-y-4 divide-y divide-[#242424]">
              {user.wishlist?.map((item: any, idx: number) => {
                const product = item.product;
                if (!product) return null;
                const imgUrl = product.images?.[0]?.url ?? "/placeholder-shoe.jpg";

                return (
                  <div key={item.id} className={cn("flex items-center gap-3", idx > 0 && "pt-3")}>
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-11 h-11 rounded-lg object-cover bg-[#141414]"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs font-semibold text-[#F5F5F5] hover:text-[#C9933A] transition-colors truncate block"
                      >
                        {product.name}
                      </Link>
                      <span className="text-[10px] font-mono text-[#6B6B6B]">
                        {product.brand?.name || "Delhi Shoe Palace"}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6B6B6B] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>
                );
              })}

              {(!user.wishlist || user.wishlist.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-[#6B6B6B]">
                  <AlertCircle className="w-8 h-8 text-[#3A3A3A] mb-2" />
                  <p className="text-xs font-sans">No wishlist items yet</p>
                </div>
              )}
            </div>
          </div>

          {user.wishlist?.length > 0 && (
            <div className="border-t border-[#242424] pt-4 text-center mt-4">
              <span className="text-[11px] font-mono text-[#C9933A] uppercase hover:underline cursor-pointer">
                View Full Wishlist
              </span>
            </div>
          )}
        </div>

        {/* Right: Recently Viewed */}
        <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-base font-semibold text-[#F5F5F5] font-sans flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#C9933A]" />
              Recently Viewed
            </h3>
            <span className="text-xs font-mono text-[#6B6B6B] block mb-4">
              Browsing history log
            </span>

            <div className="space-y-4 divide-y divide-[#242424]">
              {user.recentlyViewed?.map((item: any, idx: number) => {
                const product = item.product;
                if (!product) return null;
                const imgUrl = product.images?.[0]?.url ?? "/placeholder-shoe.jpg";

                return (
                  <div key={item.id} className={cn("flex items-center gap-3", idx > 0 && "pt-3")}>
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-11 h-11 rounded-lg object-cover bg-[#141414]"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs font-semibold text-[#F5F5F5] hover:text-[#C9933A] transition-colors truncate block"
                      >
                        {product.name}
                      </Link>
                      <span className="text-[10px] font-mono text-[#6B6B6B]">
                        {product.brand?.name || "Delhi Shoe Palace"}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6B6B6B] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(item.viewedAt)}
                    </span>
                  </div>
                );
              })}

              {(!user.recentlyViewed || user.recentlyViewed.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-[#6B6B6B]">
                  <AlertCircle className="w-8 h-8 text-[#3A3A3A] mb-2" />
                  <p className="text-xs font-sans">No browsing history</p>
                </div>
              )}
            </div>
          </div>

          {user.recentlyViewed?.length > 0 && (
            <div className="border-t border-[#242424] pt-4 text-center mt-4">
              <span className="text-[11px] font-mono text-[#C9933A] uppercase hover:underline cursor-pointer">
                View Full History
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
