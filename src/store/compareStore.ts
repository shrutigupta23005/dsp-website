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
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return sessionStorage;
        // SSR fallback — never actually used at runtime
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
