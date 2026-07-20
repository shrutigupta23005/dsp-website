"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import type { ProductWithRelations } from "@/types";

interface CompareState {
  items: ProductWithRelations[];
  add: (product: ProductWithRelations) => void;
  remove: (id: string) => void;
  clear: () => void;
  isAdded: (id: string) => boolean;
}

/**
 * Safe sessionStorage wrapper — falls back to in-memory if
 * sessionStorage is unavailable (e.g., private browsing in some browsers).
 */
function safeSessionStorage() {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  try {
    // Test if sessionStorage is accessible
    const testKey = "__dsp_storage_test__";
    sessionStorage.setItem(testKey, "1");
    sessionStorage.removeItem(testKey);
    return sessionStorage;
  } catch {
    // sessionStorage is disabled or full — fall back to in-memory
    console.warn("sessionStorage unavailable, compare data will not persist across tabs");
    const memoryStore = new Map<string, string>();
    return {
      getItem: (key: string) => memoryStore.get(key) ?? null,
      setItem: (key: string, value: string) => memoryStore.set(key, value),
      removeItem: (key: string) => memoryStore.delete(key),
    };
  }
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product) => {
        const { items } = get();
        if (items.length >= 3) {
          toast.error("Remove a product to add another");
          return;
        }
        if (items.some((item) => item.id === product.id)) return;
        set({ items: [...items, product] });
        toast.success(`${product.name} added to comparison`);
      },

      remove: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      clear: () => {
        set({ items: [] });
      },

      isAdded: (id) => get().items.some((item) => item.id === id),
    }),
    {
      name: "dsp-compare",
      storage: createJSONStorage(() => safeSessionStorage()),
    }
  )
);
