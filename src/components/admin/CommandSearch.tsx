"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  LayoutDashboard,
  Package,
  Users as UsersIcon,
  BarChart2,
  Tag,
  Award,
  SearchX,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  products: any[];
  users: any[];
  brands: any[];
  categories: any[];
  totalResults: number;
}

export default function CommandSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen to Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen to custom open event from TopBar
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-admin-search", handleOpen);
    return () => window.removeEventListener("open-admin-search", handleOpen);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults(null);
      setActiveIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Debounced search fetch
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setActiveIndex(0);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Keyboard navigation within the lists
  const flatItems = React.useMemo(() => {
    const items: { label: string; url: string; type: string; subtitle?: string; price?: number; image?: string; icon?: any }[] = [];

    if (!query) {
      // Quick Links
      items.push(
        { label: "Dashboard", url: "/admin/dashboard", type: "shortcut", icon: LayoutDashboard },
        { label: "Add Product", url: "/admin/products/new", type: "shortcut", icon: Package },
        { label: "Users Management", url: "/admin/users", type: "shortcut", icon: UsersIcon },
        { label: "Analytics Insights", url: "/admin/analytics", type: "shortcut", icon: BarChart2 }
      );
    } else if (results) {
      results.products?.forEach((p) => {
        items.push({
          label: p.name,
          url: `/admin/products/${p.id}/edit`,
          type: "product",
          subtitle: p.brand?.name || "Product",
          price: p.price,
          image: p.images?.[0]?.url,
        });
      });
      results.users?.forEach((u) => {
        items.push({
          label: u.name || "Unnamed User",
          url: `/admin/users/${u.id}`,
          type: "user",
          subtitle: u.email,
        });
      });
      results.brands?.forEach((b) => {
        items.push({
          label: b.name,
          url: `/admin/brands`,
          type: "brand",
          subtitle: b.slug,
        });
      });
      results.categories?.forEach((c) => {
        items.push({
          label: c.name,
          url: `/admin/categories`,
          type: "category",
          subtitle: `${c.gender} category`,
        });
      });
    }

    return items;
  }, [query, results]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (flatItems.length > 0 ? (prev + 1) % flatItems.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (flatItems.length > 0 ? (prev - 1 + flatItems.length) % flatItems.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatItems[activeIndex]) {
          router.push(flatItems[activeIndex].url);
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, flatItems, activeIndex, router]);

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-[#000000]/70 backdrop-blur-sm flex justify-center items-start pt-[15vh] px-4"
    >
      <div
        ref={dialogRef}
        className="bg-[#1A1A1A] border border-[#242424] rounded-2xl w-full max-w-lg shadow-[0_25px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
      >
        {/* Search Bar Input */}
        <div className="flex items-center h-14 px-4 gap-3 relative border-b border-[#242424]">
          <Search className="w-5 h-5 text-[#C9933A]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, users, brands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-[#F5F5F5] font-sans placeholder-[#6B6B6B] text-base"
          />
          {loading ? (
            <Loader2 className="w-4 h-4 text-[#C9933A] animate-spin" />
          ) : query ? (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-[#6B6B6B] hover:text-[#F5F5F5]"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-mono text-[#3A3A3A] border border-[#3A3A3A] px-1.5 py-0.5 rounded uppercase">
              Esc
            </span>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
          {loading && flatItems.length === 0 ? (
            // Typing / Loading Skeleton
            <div className="space-y-2 p-2">
              <div className="h-10 bg-[#242424] rounded-lg animate-pulse w-full" />
              <div className="h-10 bg-[#242424] rounded-lg animate-pulse w-full" />
              <div className="h-10 bg-[#242424] rounded-lg animate-pulse w-full" />
            </div>
          ) : flatItems.length > 0 ? (
            <div className="space-y-1">
              {!query && (
                <div className="text-[10px] font-mono text-[#3A3A3A] uppercase tracking-widest px-3 py-1.5 mb-1">
                  Quick Links
                </div>
              )}

              {flatItems.map((item, idx) => {
                const isActive = idx === activeIndex;
                const ShortcutIcon = item.icon;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      router.push(item.url);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer border-l-2",
                      isActive
                        ? "bg-[#1A1205] border-[#C9933A]"
                        : "bg-transparent border-transparent hover:bg-[#242424]"
                    )}
                  >
                    {/* Item Icon / Image */}
                    {item.type === "product" && item.image ? (
                      <img
                        src={item.image}
                        alt={item.label}
                        className="w-8 h-8 rounded-lg object-cover bg-[#141414]"
                      />
                    ) : item.type === "shortcut" && ShortcutIcon ? (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#141414] text-[#C9933A]">
                        <ShortcutIcon className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#141414] text-[#C9933A] font-mono text-xs font-bold uppercase">
                        {item.type === "user"
                          ? item.label.slice(0, 2)
                          : item.type === "brand"
                          ? <Award className="w-4 h-4" />
                          : <Tag className="w-4 h-4" />}
                      </div>
                    )}

                    {/* Labels */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F5F5F5] truncate font-sans">
                        {item.label}
                      </p>
                      {item.subtitle && (
                        <p className="text-[11px] font-mono text-[#6B6B6B] truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Price Badge for Products */}
                    {item.type === "product" && item.price !== undefined && (
                      <span className="text-xs font-mono text-[#C9933A] font-semibold whitespace-nowrap">
                        Rs. {item.price.toLocaleString("en-IN")}
                      </span>
                    )}

                    {/* Shortcut keyboard badge */}
                    {item.type === "shortcut" && (
                      <span className="text-[10px] font-mono text-[#3A3A3A] bg-[#0F0F0F] px-1.5 py-0.5 rounded border border-[#242424]">
                        Go
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : query.trim().length >= 2 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-8 text-center text-[#6B6B6B]">
              <SearchX className="w-8 h-8 text-[#3A3A3A] mb-2" />
              <p className="text-sm font-sans font-medium">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-xs font-sans text-[#3A3A3A] mt-1">
                Try searching for something else.
              </p>
            </div>
          ) : (
            // Idle State: prompt to type
            <div className="text-center py-6 text-xs text-[#6B6B6B] font-sans">
              Type at least 2 characters to search...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
