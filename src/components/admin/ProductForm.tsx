"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import type { BrandType, CategoryWithSubcategories, ProductWithRelations } from "@/types";

type FormImage = {
  id: string;
  url: string;
  publicId?: string | null;
  type: "PRIMARY" | "GALLERY" | "LIFESTYLE" | "ALT_ANGLE";
  alt?: string | null;
};

function SortableImage({ image, onRemove, onType }: { image: FormImage; onRemove: () => void; onType: (type: FormImage["type"]) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-md border border-border bg-white p-3">
      <button type="button" {...attributes} {...listeners} className="cursor-grab text-text-muted">
        <GripVertical className="h-4 w-4" />
      </button>
      <img src={image.url} alt={image.alt || "Product"} className="h-14 w-14 rounded-md object-cover" />
      <input value={image.url} readOnly className="min-w-0 flex-1 truncate rounded border border-border px-2 py-1 text-xs" />
      <select value={image.type} onChange={(event) => onType(event.target.value as FormImage["type"])} className="rounded border border-border px-2 py-1 text-xs">
        <option value="PRIMARY">Primary</option>
        <option value="GALLERY">Gallery</option>
        <option value="LIFESTYLE">Lifestyle</option>
        <option value="ALT_ANGLE">Alt Angle</option>
      </select>
      <button type="button" onClick={onRemove} className="text-red-600">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ProductForm({
  product,
  brands,
  categories,
}: {
  product?: ProductWithRelations;
  brands: BrandType[];
  categories: CategoryWithSubcategories[];
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [brandId, setBrandId] = useState(product?.brandId || brands[0]?.id || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || "");
  const [subcategoryId, setSubcategoryId] = useState(product?.subcategoryId || categories[0]?.subcategories[0]?.id || "");
  const [gender, setGender] = useState(product?.gender || "MEN");
  const [material, setMaterial] = useState(product?.material || "");
  const [status, setStatus] = useState(product?.status || "AVAILABLE");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [colors, setColors] = useState(product?.colors.map((color) => `${color.name}:${color.hexCode || ""}`).join("\n") || "Black:#000000");
  const [sizes, setSizes] = useState(product?.sizes.map((size) => `${size.size}:${size.isAvailable}`).join("\n") || "7:true\n8:true\n9:true");
  const [images, setImages] = useState<FormImage[]>(
    product?.images.map((image) => ({
      id: image.id,
      url: image.url,
      publicId: image.publicId,
      type: image.type,
      alt: image.alt,
    })) || []
  );
  const [imageUrl, setImageUrl] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId) || categories[0],
    [categories, categoryId]
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setImages((current) => {
      const oldIndex = current.findIndex((image) => image.id === active.id);
      const newIndex = current.findIndex((image) => image.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    const payload = {
      name,
      slug: slug || slugify(name),
      description,
      price: Number(price),
      brandId,
      categoryId,
      subcategoryId,
      gender,
      material,
      status,
      isFeatured,
      colors: colors.split("\n").filter(Boolean).map((line) => {
        const [colorName, hexCode] = line.split(":");
        return { name: colorName.trim(), hexCode: hexCode?.trim() || undefined };
      }),
      sizes: sizes.split("\n").filter(Boolean).map((line) => {
        const [size, available] = line.split(":");
        return { size: size.trim(), isAvailable: available !== "false" };
      }),
      images: images.map((image, order) => ({ ...image, order, alt: image.alt || name })),
    };

    const res = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setIsSaving(false);

    if (!res.ok) {
      toast.error(data.error || "Could not save product");
      return;
    }

    toast.success("Product saved");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={save} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4 rounded-lg border border-border bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">Name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-10 w-full rounded border border-border px-3" required /></label>
          <label className="text-sm font-medium">Slug<input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(name)} className="mt-1 h-10 w-full rounded border border-border px-3" /></label>
          <label className="text-sm font-medium">Price<input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="mt-1 h-10 w-full rounded border border-border px-3" required /></label>
          <label className="text-sm font-medium">Material<input value={material} onChange={(e) => setMaterial(e.target.value)} className="mt-1 h-10 w-full rounded border border-border px-3" /></label>
          <label className="text-sm font-medium">Brand<select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="mt-1 h-10 w-full rounded border border-border px-3">{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label>
          <label className="text-sm font-medium">Gender<select value={gender} onChange={(e) => setGender(e.target.value as typeof gender)} className="mt-1 h-10 w-full rounded border border-border px-3"><option value="MEN">Men</option><option value="WOMEN">Women</option><option value="KIDS">Kids</option></select></label>
          <label className="text-sm font-medium">Category<select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(categories.find((c) => c.id === e.target.value)?.subcategories[0]?.id || ""); }} className="mt-1 h-10 w-full rounded border border-border px-3">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label className="text-sm font-medium">Subcategory<select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className="mt-1 h-10 w-full rounded border border-border px-3">{selectedCategory?.subcategories.map((subcategory) => <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>)}</select></label>
          <label className="text-sm font-medium">Status<select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="mt-1 h-10 w-full rounded border border-border px-3"><option value="AVAILABLE">Available</option><option value="LIMITED">Limited</option><option value="TRENDING">Trending</option><option value="NEW_ARRIVAL">New Arrival</option></select></label>
          <label className="flex items-center gap-2 pt-7 text-sm font-medium"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Featured product</label>
        </div>
        <label className="block text-sm font-medium">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 min-h-32 w-full rounded border border-border px-3 py-2" /></label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">Colors <span className="text-text-muted">(name:hex, one per line)</span><textarea value={colors} onChange={(e) => setColors(e.target.value)} className="mt-1 min-h-32 w-full rounded border border-border px-3 py-2 font-mono text-xs" /></label>
          <label className="text-sm font-medium">Sizes <span className="text-text-muted">(size:true, one per line)</span><textarea value={sizes} onChange={(e) => setSizes(e.target.value)} className="mt-1 min-h-32 w-full rounded border border-border px-3 py-2 font-mono text-xs" /></label>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="font-semibold text-text-primary">Images</h2>
          <div className="mt-4 flex gap-2">
            <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="Cloudinary or Unsplash URL" className="h-10 min-w-0 flex-1 rounded border border-border px-3 text-sm" />
            <Button type="button" onClick={() => { if (!imageUrl) return; setImages((current) => [...current, { id: crypto.randomUUID(), url: imageUrl, type: current.length ? "GALLERY" : "PRIMARY" }]); setImageUrl(""); }}>Add</Button>
          </div>
          <div className="mt-4 space-y-2">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={images.map((image) => image.id)} strategy={verticalListSortingStrategy}>
                {images.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    onRemove={() => setImages((current) => current.filter((item) => item.id !== image.id))}
                    onType={(type) => setImages((current) => current.map((item) => item.id === image.id ? { ...item, type } : item))}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <Button type="submit" disabled={isSaving} size="lg" className="w-full">{isSaving ? "Saving..." : "Save Product"}</Button>
      </div>
    </form>
  );
}
