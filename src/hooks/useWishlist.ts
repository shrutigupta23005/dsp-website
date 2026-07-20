"use client";

import { useRef, useCallback } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { WishlistItem } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((d) => d.data || []);

export function useWishlist() {
  const { data: session } = useSession();
  const { data, mutate, isLoading } = useSWR<WishlistItem[]>(
    session ? "/api/wishlist" : null,
    fetcher
  );

  // Debounce guard: prevent rapid toggle race conditions
  const pendingRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wishlist = data || [];

  const isWishlisted = (productId: string) =>
    wishlist.some((w) => w.productId === productId);

  const getWishlistItemId = (productId: string) =>
    wishlist.find((w) => w.productId === productId)?.id;

  const toggle = useCallback(async (productId: string) => {
    // Early return before any mutate if not authenticated
    if (!session) {
      toast.error("Sign in to save products", {
        action: {
          label: "Login",
          onClick: () => {
            window.location.href = "/auth/login";
          },
        },
      });
      return;
    }

    // Debounce: reject rapid clicks while a request is in-flight
    if (pendingRef.current) return;

    // Debounce timer: 300ms between toggles
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    pendingRef.current = true;

    const wishlisted = wishlist.some((w) => w.productId === productId);

    if (wishlisted) {
      // Optimistically remove
      const previousData = [...wishlist];
      mutate(
        wishlist.filter((w) => w.productId !== productId),
        false
      );

      try {
        const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        toast.success("Removed from wishlist");
        mutate();
      } catch {
        mutate(previousData, false);
        toast.error("Failed to update wishlist");
      }
    } else {
      // Optimistically add
      const previousData = [...wishlist];
      const optimisticItem: WishlistItem = {
        id: `temp-${productId}`,
        userId: session.user?.id || "",
        productId,
        createdAt: new Date(),
        product: {} as WishlistItem["product"],
      };
      mutate([optimisticItem, ...wishlist], false);

      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (!res.ok) throw new Error();
        toast.success("Added to wishlist");
        mutate();
      } catch {
        mutate(previousData, false);
        toast.error("Failed to update wishlist");
      }
    }

    // Release lock after 300ms debounce
    debounceTimerRef.current = setTimeout(() => {
      pendingRef.current = false;
    }, 300);
  }, [session, wishlist, mutate]);

  return {
    wishlist,
    isLoading,
    count: wishlist.length,
    isWishlisted,
    getWishlistItemId,
    toggle,
    mutate,
  };
}
