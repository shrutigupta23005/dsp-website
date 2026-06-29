"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import ImageUploadZone from "./ImageUploadZone";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  UploadCloud,
  X,
  Plus,
  Trash2,
  GripVertical,
  Loader2,
} from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import { productSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDropzone } from "react-dropzone";

interface ProductFormProps {
  product?: any;
  categories: any[];
  brands: any[];
}

// DnD Sortable Image Tile Component
function SortableImageTile({
  image,
  onDelete,
  onCycleType,
}: {
  image: any;
  onDelete: (id: string) => void;
  onCycleType: (image: any) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.6 : 1,
  };

  const getBadgeColors = (type: string) => {
    switch (type) {
      case "PRIMARY":
        return "border-[#C9933A] bg-[#1A1205] text-[#C9933A]";
      case "GALLERY":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
      case "LIFESTYLE":
        return "border-green-500/30 bg-green-500/10 text-green-400";
      default:
        return "border-gray-500/30 bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative aspect-square bg-[#141414] border border-[#242424] rounded-xl overflow-hidden group/tile",
        image.type === "PRIMARY" && "border-2 border-[#C9933A]"
      )}
    >
      <img
        src={image.url}
        alt={image.alt || "Product image"}
        className="w-full h-full object-cover"
      />
      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/tile:opacity-100 transition-opacity flex flex-col justify-between p-2.5 z-10">
        <div className="flex justify-between items-start">
          {/* Type Badge */}
          <button
            type="button"
            onClick={() => onCycleType(image)}
            className={cn(
              "border text-[9px] font-mono font-bold uppercase rounded-full px-2 py-0.5 transition-transform hover:scale-105 cursor-pointer",
              getBadgeColors(image.type)
            )}
          >
            {image.type}
          </button>

          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="text-[#6B6B6B] hover:text-[#F5F5F5] cursor-grab p-1"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>

        {/* Delete button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onDelete(image.id)}
            className="p-1.5 rounded-lg bg-[#0F0F0F] text-[#6B6B6B] hover:text-[#EF4444] border border-[#242424] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductForm({
  product,
  categories,
  brands,
}: ProductFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // DB Images state (for EDIT mode)
  const [dbImages, setDbImages] = useState<any[]>(
    product?.images?.sort((a: any, b: any) => a.order - b.order) || []
  );

  // Local uploads queue (specifically for CREATE mode, or staging files)
  const [queuedFiles, setQueuedFiles] = useState<any[]>([]);

  // Sizes Array State
  const [sizes, setSizes] = useState<any[]>(
    product?.sizes?.map((s: any) => ({ size: s.size, isAvailable: s.isAvailable })) || []
  );
  const [newSize, setNewSize] = useState("");

  // Colors State (Auto-handled for UI simply or loaded from product)
  const [colors, setColors] = useState<any[]>(
    product?.colors?.map((c: any) => ({ name: c.name, hexCode: c.hexCode })) || [
      { name: "Black", hexCode: "#000000" },
    ]
  );

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price || 0,
      brandId: product?.brandId || brands[0]?.id || "",
      categoryId: product?.categoryId || categories[0]?.id || "",
      subcategoryId: product?.subcategoryId || "",
      gender: product?.gender || "MEN",
      material: product?.material || "",
      status: product?.status || "AVAILABLE",
      isFeatured: product?.isFeatured || false,
      colors: colors,
      sizes: sizes,
    },
  });

  const watchName = watch("name");
  const watchCategory = watch("categoryId");
  const watchGender = watch("gender");
  const watchStatus = watch("status");

  // Debounced auto-slugify
  useEffect(() => {
    if (!product && watchName) {
      setValue("slug", slugify(watchName));
    }
  }, [watchName, setValue, product]);

  // Synchronize size and color inputs into hook-form state
  useEffect(() => {
    setValue("sizes", sizes);
  }, [sizes, setValue]);

  useEffect(() => {
    setValue("colors", colors);
  }, [colors, setValue]);

  // Filtered Subcategories based on Category selection
  const selectedCategoryObj = useMemo(() => {
    return categories.find((c) => c.id === watchCategory);
  }, [categories, watchCategory]);

  const filteredSubcategories = selectedCategoryObj?.subcategories || [];

  // Automatically select first subcategory on category change (in create mode)
  useEffect(() => {
    if (!product && filteredSubcategories.length > 0) {
      setValue("subcategoryId", filteredSubcategories[0].id);
    } else if (product && product.categoryId === watchCategory) {
      setValue("subcategoryId", product.subcategoryId);
    }
  }, [watchCategory, filteredSubcategories, setValue, product]);

  // presetting sizes
  const applySizePreset = (preset: "MEN" | "WOMEN" | "KIDS") => {
    let presetSizes: string[] = [];
    if (preset === "MEN") presetSizes = ["6", "7", "8", "9", "10", "11"];
    if (preset === "WOMEN") presetSizes = ["3", "4", "5", "6", "7", "8"];
    if (preset === "KIDS") presetSizes = ["1", "2", "3", "4", "5"];

    const newSizesList = [...sizes];
    presetSizes.forEach((sz) => {
      if (!newSizesList.some((s) => s.size === sz)) {
        newSizesList.push({ size: sz, isAvailable: true });
      }
    });
    setSizes(newSizesList);
  };

  const handleAddSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSize.trim()) return;
    if (sizes.some((s) => s.size === newSize.trim())) {
      toast.error("Size already exists");
      return;
    }
    setSizes((prev) => [...prev, { size: newSize.trim(), isAvailable: true }]);
    setNewSize("");
  };

  const toggleSizeAvailability = (index: number) => {
    setSizes((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const removeSize = (index: number) => {
    setSizes((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Image upload callbacks (for EDIT mode)
  const handleUploadComplete = (newImage: any) => {
    setDbImages((prev) => [...prev, newImage]);
  };

  // Cycle image types
  const handleCycleType = async (image: any) => {
    const types = ["PRIMARY", "GALLERY", "LIFESTYLE", "ALT_ANGLE"];
    const currentIdx = types.indexOf(image.type);
    const nextType = types[(currentIdx + 1) % types.length];

    // Optimistic UI update
    setDbImages((prev) =>
      prev.map((img) => (img.id === image.id ? { ...img, type: nextType } : img))
    );

    try {
      const res = await fetch(`/api/admin/images/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: nextType }),
      });
      if (!res.ok) throw new Error();
      toast.success("Image type updated");
    } catch {
      toast.error("Failed to update image type");
      // Rollback
      setDbImages((prev) =>
        prev.map((img) => (img.id === image.id ? { ...img, type: image.type } : img))
      );
    }
  };

  // Delete image
  const handleDeleteImage = async (imageId: string) => {
    // Optimistic UI update
    setDbImages((prev) => prev.filter((img) => img.id !== imageId));

    try {
      const res = await fetch(`/api/admin/images/${imageId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
      // Reload images
      router.refresh();
    }
  };

  // DnD Sensors config
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = dbImages.findIndex((img) => img.id === active.id);
    const newIndex = dbImages.findIndex((img) => img.id === over.id);

    const reordered = arrayMove(dbImages, oldIndex, newIndex);
    setDbImages(reordered);

    // Save order changes sequentially to DB
    try {
      await Promise.all(
        reordered.map((img, idx) =>
          fetch(`/api/admin/images/${img.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: idx }),
          })
        )
      );
      toast.success("Images reordered");
    } catch {
      toast.error("Failed to save image order");
    }
  };

  // Form Submit Handler
  const onSubmit = async (data: any) => {
    if (sizes.length === 0) {
      toast.error("Please add at least one size");
      return;
    }

    setIsSaving(true);
    const productId = product?.id;

    try {
      if (productId) {
        // Edit mode
        const res = await fetch(`/api/admin/products/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to update product");
        }

        toast.success("Product updated successfully");
        router.push("/admin/products");
      } else {
        // Create mode
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to create product");
        }

        const newProduct = await res.json();

        // Check if there are local files queued in state (using dropzone in create mode)
        if (queuedFiles.length > 0) {
          toast.loading("Uploading queued images...", { id: "image-upload" });
          for (let i = 0; i < queuedFiles.length; i++) {
            const current = queuedFiles[i];
            const formData = new FormData();
            formData.append("file", current.file);
            formData.append("productId", newProduct.id);
            formData.append("productSlug", newProduct.slug);
            formData.append("imageType", current.type);
            formData.append("order", String(i));
            formData.append("alt", newProduct.name);

            await fetch("/api/admin/upload", {
              method: "POST",
              body: formData,
            });
          }
          toast.dismiss("image-upload");
        }

        toast.success("Product created successfully");
        router.push("/admin/products");
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  // Local Dropzone (Used specifically in Create mode when product doesn't exist yet)
  const onDropLocal = useCallback((acceptedFiles: File[]) => {
    const mapped = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: "GALLERY" as const,
    }));
    setQueuedFiles((prev) => [...prev, ...mapped].slice(0, 10));
  }, []);

  const {
    getRootProps: getLocalRootProps,
    getInputProps: getLocalInputProps,
    isDragActive: isLocalDragActive,
  } = useDropzone({
    onDrop: onDropLocal,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 10,
  });

  const removeLocalQueuedFile = (index: number) => {
    setQueuedFiles((prev) => {
      const copy = [...prev];
      const removed = copy.splice(index, 1)[0];
      if (removed && removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return copy;
    });
  };

  const updateLocalQueuedType = (index: number, type: any) => {
    setQueuedFiles((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, type } : item))
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* LEFT COLUMN: Fields */}
        <div className="space-y-4">
          {/* Card 1: Basic Information */}
          <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-[#F5F5F5] font-sans">
                Basic Information
              </h3>
              <span className="text-xs font-mono text-[#6B6B6B]">
                Core product details
              </span>
            </div>

            <div className="space-y-4">
              {/* Product Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6B6B] font-sans">
                  Product Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="e.g. Nike Air Max 90"
                  className="h-10 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none transition-colors"
                />
                {errors.name && (
                  <p className="text-xs text-[#EF4444] font-mono mt-1">
                    {(errors.name as any).message}
                  </p>
                )}
                {/* Slug Preview */}
                {watchName && (
                  <span className="text-[11px] font-mono text-[#6B6B6B] mt-1">
                    dsp.com/products/
                    <span className="text-[#C9933A]">{slugify(watchName)}</span>
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6B6B] font-sans">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Tell buyers about this product, specs, fit, etc."
                  className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-3 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none transition-colors resize-none"
                />
                {errors.description && (
                  <p className="text-xs text-[#EF4444] font-mono mt-1">
                    {(errors.description as any).message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#6B6B6B] font-sans">
                    Price (Rs.)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-mono font-bold text-[#C9933A] select-none">
                      Rs.
                    </span>
                    <input
                      {...register("price", { valueAsNumber: true })}
                      type="number"
                      placeholder="8999"
                      className="h-10 w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-10 pr-3 text-sm text-[#F5F5F5] font-mono focus:border-[#C9933A] outline-none transition-colors"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-[#EF4444] font-mono mt-1">
                      {(errors.price as any).message}
                    </p>
                  )}
                </div>

                {/* Material */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#6B6B6B] font-sans">
                    Material
                  </label>
                  <input
                    {...register("material")}
                    type="text"
                    placeholder="e.g. Leather, Mesh, Canvas"
                    className="h-10 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none transition-colors"
                  />
                  {errors.material && (
                    <p className="text-xs text-[#EF4444] font-mono mt-1">
                      {(errors.material as any).message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Classification */}
          <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-[#F5F5F5] font-sans">
                Classification
              </h3>
              <span className="text-xs font-mono text-[#6B6B6B]">
                Organize catalog placements
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6B6B] font-sans">
                  Category
                </label>
                <select
                  {...register("categoryId")}
                  className="h-10 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-xs text-[#F5F5F5] focus:border-[#C9933A] outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.gender})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6B6B] font-sans">
                  Subcategory
                </label>
                <select
                  {...register("subcategoryId")}
                  className="h-10 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-xs text-[#F5F5F5] focus:border-[#C9933A] outline-none cursor-pointer"
                >
                  {filteredSubcategories.map((sc: any) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6B6B] font-sans">
                  Brand
                </label>
                <select
                  {...register("brandId")}
                  className="h-10 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-xs text-[#F5F5F5] focus:border-[#C9933A] outline-none cursor-pointer"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender Toggle pills */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#6B6B6B] font-sans">
                Target Audience
              </label>
              <div className="flex gap-2">
                {["MEN", "WOMEN", "KIDS"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setValue("gender", g as any)}
                    className={cn(
                      "h-9 px-4 rounded-lg text-xs font-semibold font-sans cursor-pointer transition-colors border",
                      watchGender === g
                        ? "bg-[#C9933A] border-[#C9933A] text-[#0F0F0F]"
                        : "bg-[#1A1A1A] border-[#242424] text-[#6B6B6B] hover:text-[#F5F5F5] hover:border-[#C9933A]"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#6B6B6B] font-sans">
                Stock Status
              </label>
              <div className="flex flex-wrap gap-2">
                {["AVAILABLE", "NEW_ARRIVAL", "TRENDING", "LIMITED"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setValue("status", st as any)}
                    className={cn(
                      "h-9 px-4 rounded-lg text-xs font-semibold font-sans cursor-pointer transition-colors border",
                      watchStatus === st
                        ? "bg-[#C9933A] border-[#C9933A] text-[#0F0F0F]"
                        : "bg-[#1A1A1A] border-[#242424] text-[#6B6B6B] hover:text-[#F5F5F5] hover:border-[#C9933A]"
                    )}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between border-t border-[#242424] pt-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F5F5] font-sans">
                  Mark as Featured Product
                </span>
                <span className="text-xs text-[#6B6B6B] font-sans">
                  Featured products appear on the homepage highlights.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setValue("isFeatured", !watch("isFeatured"))}
                className={cn(
                  "w-10 h-5 rounded-full relative p-0.5 transition-colors cursor-pointer shrink-0",
                  watch("isFeatured") ? "bg-[#C9933A]" : "bg-[#2A2A2A]"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 bg-[#0F0F0F] rounded-full transition-all",
                    watch("isFeatured") ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Card 3: Available Sizes */}
          <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-[#F5F5F5] font-sans">
                  Available Sizes
                </h3>
                <span className="text-xs font-mono text-[#6B6B6B]">
                  Manage size stock levels
                </span>
              </div>

              {/* Presets */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => applySizePreset("MEN")}
                  className="bg-[#141414] border border-[#242424] text-[#6B6B6B] hover:text-[#F5F5F5] hover:border-[#C9933A] px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-lg cursor-pointer"
                >
                  Men UK 6-11
                </button>
                <button
                  type="button"
                  onClick={() => applySizePreset("WOMEN")}
                  className="bg-[#141414] border border-[#242424] text-[#6B6B6B] hover:text-[#F5F5F5] hover:border-[#C9933A] px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-lg cursor-pointer"
                >
                  Women UK 3-8
                </button>
                <button
                  type="button"
                  onClick={() => applySizePreset("KIDS")}
                  className="bg-[#141414] border border-[#242424] text-[#6B6B6B] hover:text-[#F5F5F5] hover:border-[#C9933A] px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-lg cursor-pointer"
                >
                  Kids UK 1-5
                </button>
              </div>
            </div>

            {/* Size Pills Grid */}
            {sizes.length > 0 ? (
              <div className="flex flex-wrap gap-2 border border-[#242424] p-3.5 rounded-xl bg-[#141414]">
                {sizes.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-[#1A1A1A] border border-[#242424] pl-3 pr-1.5 h-8 rounded-full group/size cursor-pointer hover:border-[#C9933A]"
                    onClick={() => toggleSizeAvailability(idx)}
                  >
                    <span className="font-mono text-xs font-bold text-[#F5F5F5]">
                      UK {s.size}
                    </span>
                    {/* Status Dot */}
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        s.isAvailable ? "bg-[#22C55E]" : "bg-[#EF4444]"
                      )}
                    />
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSize(idx);
                      }}
                      className="text-[#3A3A3A] group-hover/size:text-[#EF4444] p-0.5 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6B6B6B] italic">No sizes added yet. Use presets or add manually below.</p>
            )}

            {/* Add manual size */}
            <div className="flex gap-2 max-w-xs">
              <input
                type="text"
                placeholder="Add size, e.g. 7.5"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSize(e)}
                className="h-9 w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-xs text-[#F5F5F5] font-mono outline-none focus:border-[#C9933A]"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="bg-[#1A1A1A] border border-[#242424] text-[#C9933A] hover:bg-[#C9933A] hover:text-[#0F0F0F] text-xs font-bold font-sans rounded-lg px-4 h-9 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Image Manager */}
        <div className="space-y-4">
          <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-[#F5F5F5] font-sans">
                  Product Images
                </h3>
                <span className="text-xs font-mono font-bold text-[#C9933A]">
                  {product ? dbImages.length : queuedFiles.length} files
                </span>
              </div>
              <span className="text-xs font-mono text-[#6B6B6B]">
                Drag to reorder. Click badge to change role.
              </span>
            </div>

            {/* CURRENT IMAGES GRID */}
            {product ? (
              // EDIT MODE: Uses SWR / DB Images
              dbImages.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={dbImages.map((img) => img.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-2 gap-3 bg-[#141414] border border-[#242424] p-3 rounded-xl">
                      {dbImages.map((img) => (
                        <SortableImageTile
                          key={img.id}
                          image={img}
                          onDelete={handleDeleteImage}
                          onCycleType={handleCycleType}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <p className="text-xs text-[#6B6B6B] italic text-center p-6 bg-[#141414] rounded-xl border border-[#242424]">
                  No images uploaded yet.
                </p>
              )
            ) : (
              // CREATE MODE: Local staged queue preview
              queuedFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-3 bg-[#141414] border border-[#242424] p-3 rounded-xl">
                  {queuedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square bg-[#0F0F0F] border border-[#242424] rounded-xl overflow-hidden group/tile"
                    >
                      <img
                        src={file.preview}
                        alt="Staged"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/tile:opacity-100 transition-opacity flex flex-col justify-between p-2 z-10">
                        <select
                          value={file.type}
                          onChange={(e) => updateLocalQueuedType(idx, e.target.value as any)}
                          className="bg-[#0F0F0F] border border-[#2A2A2A] rounded px-1.5 py-0.5 text-[9px] text-[#F5F5F5] font-sans"
                        >
                          <option value="PRIMARY">PRIMARY</option>
                          <option value="GALLERY">GALLERY</option>
                          <option value="LIFESTYLE">LIFESTYLE</option>
                          <option value="ALT_ANGLE">ALT ANGLE</option>
                        </select>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeLocalQueuedFile(idx)}
                            className="p-1 rounded bg-[#0F0F0F] text-[#6B6B6B] hover:text-[#EF4444]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* UPLOAD ZONE */}
            {product ? (
              // EDIT MODE: Direct sequential upload
              <div className="border-t border-[#242424] pt-4">
                <ImageUploadZone
                  productId={product.id}
                  productSlug={product.slug}
                  onUploadComplete={handleUploadComplete}
                />
              </div>
            ) : (
              // CREATE MODE: Local files dropper
              <div className="border-t border-[#242424] pt-4">
                <div
                  {...getLocalRootProps()}
                  className={cn(
                    "border-2 border-dashed border-[#242424] rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#0F0F0F]",
                    isLocalDragActive ? "border-[#C9933A] bg-[#1A1205]" : "hover:border-[#C9933A]/50"
                  )}
                >
                  <input {...getLocalInputProps()} />
                  <UploadCloud className="w-8 h-8 text-[#3A3A3A] mx-auto mb-2" />
                  <p className="text-xs text-[#6B6B6B] font-sans">
                    Drop product images here
                  </p>
                  <span className="text-[10px] font-mono text-[#3A3A3A] block mt-1">
                    Staged & uploaded upon save
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="sticky bottom-0 bg-[#141414] border-t border-[#242424] p-4 -mx-4 md:-mx-6 lg:-mx-8 flex items-center justify-between z-20">
        <span className="text-[11px] font-mono text-[#6B6B6B]">
          {isSaving ? "Saving changes..." : "All updates cached locally"}
        </span>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => router.push("/admin/products")}
            className="border-[#2A2A2A] text-[#6B6B6B] bg-transparent hover:border-[#C9933A] hover:text-[#F5F5F5] font-sans text-xs h-9 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[#C9933A] text-[#0F0F0F] hover:bg-[#E5AC52] font-semibold text-xs h-9 px-6 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Saving Product
              </>
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
