"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import {
  Search,
  Package,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import DataTable from "./DataTable";
import ConfirmDialog from "./ConfirmDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

interface ProductsTableProps {
  initialProducts: any[];
  initialTotal: number;
  categories: any[];
  brands: any[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductsTable({
  initialProducts,
  initialTotal,
  categories,
  brands,
}: ProductsTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // SWR query
  const queryUrl = `/api/admin/products?page=${page}&limit=20&search=${encodeURIComponent(
    debouncedSearch
  )}&category=${selectedCategory === "all" ? "" : selectedCategory}&status=${
    selectedStatus === "all" ? "" : selectedStatus
  }`;

  const { data, mutate, isValidating } = useSWR(queryUrl, fetcher, {
    fallbackData: {
      products: initialProducts,
      total: initialTotal,
      page: 1,
      totalPages: Math.ceil(initialTotal / 20),
    },
    revalidateOnFocus: false,
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  // Optimistic Featured Toggle
  const handleToggleFeatured = async (productId: string, currentVal: boolean) => {
    // Optimistic Update
    const updatedProducts = products.map((p: any) =>
      p.id === productId ? { ...p, isFeatured: !currentVal } : p
    );
    mutate({ ...data, products: updatedProducts }, false);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentVal }),
      });
      if (!res.ok) {
        throw new Error("Failed to toggle");
      }
      toast.success("Featured status updated");
    } catch (err) {
      toast.error("Failed to update featured status");
      mutate(); // Rollback
    }
  };

  // Delete product action
  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete");
      }
      toast.success("Product deleted successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  // Bulk Delete action
  const handleBulkDelete = async () => {
    const idsToDelete = Object.keys(selectedRows).filter((key) => selectedRows[key]);
    if (idsToDelete.length === 0) return;

    try {
      await Promise.all(
        idsToDelete.map((id) =>
          fetch(`/api/admin/products/${id}`, { method: "DELETE" })
        )
      );
      toast.success(`Deleted ${idsToDelete.length} products`);
      setSelectedRows({});
      mutate();
    } catch (err) {
      toast.error("Some deletions failed");
      mutate();
    }
  };

  // Checkbox toggle helpers
  const handleSelectRow = (productId: string, val: boolean) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: val,
    }));
  };

  const handleSelectAll = (val: boolean) => {
    const newSelected: Record<string, boolean> = {};
    if (val) {
      products.forEach((p: any) => {
        newSelected[p.id] = true;
      });
    }
    setSelectedRows(newSelected);
  };

  const numberSelected = Object.values(selectedRows).filter(Boolean).length;
  const allSelected = products.length > 0 && products.every((p: any) => selectedRows[p.id]);

  // Table Column Definitions
  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={allSelected}
          onCheckedChange={(val) => handleSelectAll(!!val)}
          className="border-[#2A2A2A] data-[state=checked]:bg-[#C9933A] data-[state=checked]:border-[#C9933A]"
        />
      ),
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={!!selectedRows[row.original.id]}
            onCheckedChange={(val) => handleSelectRow(row.original.id, !!val)}
            className="border-[#2A2A2A] data-[state=checked]:bg-[#C9933A] data-[state=checked]:border-[#C9933A]"
          />
        </div>
      ),
    },
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const imgUrl = row.original.images?.[0]?.url ?? "/placeholder-shoe.jpg";
        return (
          <img
            src={imgUrl}
            alt={row.original.name}
            className="w-11 h-11 rounded-lg object-cover bg-[#141414]"
          />
        );
      },
    },
    {
      id: "product",
      header: "Product",
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="font-semibold text-[#F5F5F5] leading-snug line-clamp-2">
            {row.original.name}
          </p>
          <span className="text-[10px] font-mono text-[#3A3A3A] block mt-0.5">
            {row.original.slug}
          </span>
        </div>
      ),
    },
    {
      id: "brand",
      header: "Brand",
      cell: ({ row }) => (
        <span className="text-[#6B6B6B] font-medium font-sans">
          {row.original.brand?.name || "N/A"}
        </span>
      ),
    },
    {
      id: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="border border-[#242424] bg-[#1A1A1A] text-[#6B6B6B] text-[11px] font-sans font-medium px-2 py-0.5 rounded-md uppercase">
          {row.original.category?.name || "N/A"}
        </span>
      ),
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-mono text-[#C9933A] font-bold">
          {formatPrice(row.original.price)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let badgeStyle = "bg-gray-500/20 text-gray-400";
        if (status === "NEW_ARRIVAL") badgeStyle = "bg-[#1D4ED8]/20 text-[#60A5FA]";
        if (status === "TRENDING") badgeStyle = "bg-[#B45309]/20 text-[#FCD34D]";
        if (status === "LIMITED") badgeStyle = "bg-[#DC2626]/20 text-[#FCA5A5]";
        if (status === "AVAILABLE") badgeStyle = "bg-[#14532D]/20 text-[#86EFAC]";

        return (
          <span
            className={cn(
              "font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap",
              badgeStyle
            )}
          >
            {status.replace("_", " ")}
          </span>
        );
      },
    },
    {
      id: "featured",
      header: "Featured",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center">
          <button
            onClick={() => handleToggleFeatured(row.original.id, row.original.isFeatured)}
            className={cn(
              "w-8 h-4 rounded-full relative p-0.5 transition-colors cursor-pointer",
              row.original.isFeatured ? "bg-[#C9933A]" : "bg-[#2A2A2A]"
            )}
          >
            <div
              className={cn(
                "w-3 h-3 bg-[#0F0F0F] rounded-full transition-all",
                row.original.isFeatured ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
      ),
    },
    {
      id: "views",
      header: "Views",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[#6B6B6B] flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          {row.original.viewCount}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1">
          <button
            onClick={() => router.push(`/admin/products/${row.original.id}/edit`)}
            className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#C9933A] hover:bg-[#242424] transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <ConfirmDialog
            trigger={
              <button className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#EF4444] hover:bg-[#242424] transition-colors cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            }
            title="Delete Product?"
            description={`Are you sure you want to delete ${row.original.name}? This action is permanent and cannot be undone.`}
            confirmLabel="Delete"
            variant="danger"
            onConfirm={() => handleDeleteProduct(row.original.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Bulk actions float-down bar */}
      {numberSelected > 0 && (
        <div className="bg-[#1A1205] border-b border-[#C9933A] py-3 px-6 flex items-center justify-between rounded-xl animate-in slide-in-from-top duration-250">
          <span className="text-xs font-mono font-bold text-[#C9933A]">
            {numberSelected} products selected
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedRows({})}
              className="text-xs font-sans text-[#6B6B6B] hover:text-[#F5F5F5] px-3 h-8 cursor-pointer"
            >
              Clear Selection
            </button>
            <ConfirmDialog
              trigger={
                <button className="bg-[#EF4444] text-white hover:bg-red-600 px-4 h-8 rounded-lg text-xs font-mono uppercase font-bold flex items-center justify-center cursor-pointer">
                  Delete Selected
                </button>
              }
              title="Delete Selected Products?"
              description={`You are about to delete ${numberSelected} products. This is irreversible. Continue?`}
              confirmLabel="Delete All"
              variant="danger"
              onConfirm={handleBulkDelete}
            />
          </div>
        </div>
      )}

      {/* TOP FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#F5F5F5] font-sans">Products</h2>
          <span className="font-mono text-xs text-[#C9933A] border border-[#C9933A]/20 bg-[#1A1205] rounded-full px-2.5 py-0.5">
            {total}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center w-full md:w-60 h-9 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 gap-2 focus-within:border-[#C9933A] transition-colors">
            <Search className="w-4 h-4 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-[#F5F5F5] text-xs font-sans placeholder-[#6B6B6B]"
            />
          </div>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-xs text-[#F5F5F5] font-sans outline-none focus:border-[#C9933A] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.gender})
              </option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-xs text-[#F5F5F5] font-sans outline-none focus:border-[#C9933A] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="NEW_ARRIVAL">New Arrival</option>
            <option value="TRENDING">Trending</option>
            <option value="LIMITED">Limited</option>
          </select>

          {/* Add Product Button */}
          <button
            onClick={() => router.push("/admin/products/new")}
            className="bg-[#C9933A] text-[#0F0F0F] hover:bg-[#E5AC52] transition-colors h-9 px-4 rounded-lg text-xs font-semibold font-sans flex items-center gap-1.5 cursor-pointer ml-auto md:ml-0"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        data={products}
        isLoading={isValidating}
        onRowClick={(row) => router.push(`/admin/products/${row.id}/edit`)}
        pagination={{
          page,
          totalPages,
          onPageChange: (p) => setPage(p),
        }}
      />
    </div>
  );
}
