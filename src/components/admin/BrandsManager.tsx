"use client";

import React, { useState, useRef } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  UploadCloud,
  Loader2,
  X,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import ConfirmDialog from "./ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface BrandsManagerProps {
  initialBrands: any[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BrandsManager({ initialBrands }: BrandsManagerProps) {
  // SWR query
  const { data: brands, mutate } = useSWR("/api/admin/brands", fetcher, {
    fallbackData: initialBrands,
    revalidateOnFocus: false,
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null); // null means ADD mode

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setEditingBrand(null);
    setName("");
    setDescription("");
    setLogoUrl("");
    setModalOpen(true);
  };

  const openEditModal = (brand: any) => {
    setEditingBrand(brand);
    setName(brand.name);
    setDescription(brand.description || "");
    setLogoUrl(brand.logo || "");
    setModalOpen(true);
  };

  // Logo Upload Trigger
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }

    setIsUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageType", "BRAND_LOGO");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setLogoUrl(data.url);
      toast.success("Logo uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload brand logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Save Brand (Create / Edit)
  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Brand name must be at least 2 characters");
      return;
    }

    setIsSaving(true);
    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      logo: logoUrl || undefined,
    };

    try {
      if (editingBrand) {
        // Edit mode
        const res = await fetch(`/api/admin/brands/${editingBrand.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update brand");

        toast.success("Brand updated successfully");
      } else {
        // Create mode
        const res = await fetch("/api/admin/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create brand");

        toast.success("Brand created successfully");
      }

      setModalOpen(false);
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to save brand");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Brand Action
  const handleDeleteBrand = async (brandId: string) => {
    try {
      const res = await fetch(`/api/admin/brands/${brandId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete brand");

      toast.success("Brand deleted successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete brand");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#F5F5F5] font-sans">Brands</h2>
          <span className="font-mono text-xs text-[#C9933A] border border-[#C9933A]/20 bg-[#1A1205] rounded-full px-2.5 py-0.5">
            {brands.length}
          </span>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#C9933A] text-[#0F0F0F] hover:bg-[#E5AC52] transition-colors h-9 px-4 rounded-lg text-xs font-semibold font-sans flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      {/* BRANDS GRID */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand: any) => {
          const hasProducts = brand._count?.products > 0;

          return (
            <div
              key={brand.id}
              className="relative bg-[#1A1A1A] border border-[#242424] hover:border-[#C9933A]/50 rounded-2xl p-5 transition-all duration-200 group flex flex-col justify-between h-[180px]"
            >
              {/* Top Row: Logo & Hover actions */}
              <div className="flex items-start justify-between">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-12 h-12 rounded-full object-cover bg-[#141414] border border-[#242424]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#242424] flex items-center justify-center font-mono font-bold text-sm text-[#C9933A]">
                    {getInitials(brand.name)}
                  </div>
                )}

                {/* Edit / Delete overlay (only visible on group hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 absolute top-4 right-4 bg-[#1A1A1A] p-0.5 rounded-lg border border-[#242424]/80 shadow-md">
                  <button
                    onClick={() => openEditModal(brand)}
                    className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#C9933A] transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <ConfirmDialog
                    trigger={
                      <button
                        disabled={hasProducts}
                        className={cn(
                          "p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#EF4444] transition-colors cursor-pointer",
                          hasProducts && "opacity-25 hover:text-[#6B6B6B] cursor-not-allowed"
                        )}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    }
                    title="Delete Brand?"
                    description={
                      hasProducts
                        ? `This brand has ${brand._count.products} products. Reassign or delete products first.`
                        : `Are you sure you want to delete brand "${brand.name}"?`
                    }
                    confirmLabel="Delete"
                    variant="danger"
                    onConfirm={() => handleDeleteBrand(brand.id)}
                  />
                </div>
              </div>

              {/* Middle: Name & Description */}
              <div className="mt-3 flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-[#F5F5F5] font-sans truncate">
                  {brand.name}
                </h3>
                <p className="text-[11px] text-[#6B6B6B] font-sans line-clamp-2 mt-1 leading-normal">
                  {brand.description || "No description provided."}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="mt-4 pt-3 border-t border-[#242424] flex items-center justify-between text-[11px] font-mono text-[#3A3A3A]">
                <span className="text-[#C9933A] flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-[#C9933A]" />
                  {brand._count?.products || 0} products
                </span>
                <span className="truncate max-w-[120px]">{brand.slug}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD/EDIT BRAND MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#1A1A1A] border-[#242424] text-[#F5F5F5] rounded-2xl max-w-md p-6">
          <DialogHeader>
            <DialogTitle
              className="text-xl text-[#F5F5F5]"
              style={{ fontFamily: "var(--font-serif)" }} // Playfair Display
            >
              {editingBrand ? `Edit Brand: ${editingBrand.name}` : "Add New Brand"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveBrand} className="space-y-4 py-2">
            {/* Logo Upload Area (96px circle) */}
            <div className="flex flex-col items-center justify-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => !isUploadingLogo && fileInputRef.current?.click()}
                className={cn(
                  "w-24 h-24 rounded-full border-2 border-dashed border-[#242424] hover:border-[#C9933A] bg-[#0F0F0F] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors relative group",
                  logoUrl && "border-solid border-[#C9933A]"
                )}
              >
                {isUploadingLogo ? (
                  <Loader2 className="w-6 h-6 text-[#C9933A] animate-spin" />
                ) : logoUrl ? (
                  <>
                    <img
                      src={logoUrl}
                      alt="Brand Logo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-[#F5F5F5] font-mono">
                      Change
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5 text-[#3A3A3A] group-hover:text-[#C9933A]" />
                    <span className="text-[10px] font-sans text-[#6B6B6B] mt-1">Logo</span>
                  </>
                )}
              </div>
              <span className="text-[9px] font-mono text-[#3A3A3A]">
                Square PNG/JPG &bull; Max 2MB
              </span>
            </div>

            {/* Brand Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#6B6B6B] font-sans">
                Brand Name
              </label>
              <input
                type="text"
                placeholder="e.g. Nike, Adidas, Woodland"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none"
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#6B6B6B] font-sans">
                Description
              </label>
              <textarea
                placeholder="Tell customers about the brand..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-3 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none resize-none"
              />
            </div>

            <DialogFooter className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="h-9 px-4 rounded-lg text-xs font-semibold text-[#6B6B6B] border border-[#242424] hover:text-[#F5F5F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploadingLogo}
                className="bg-[#C9933A] text-[#0F0F0F] hover:bg-[#E5AC52] h-9 px-5 rounded-lg text-xs font-semibold font-sans flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Brand
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
