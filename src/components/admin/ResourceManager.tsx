"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ResourceKind = "categories" | "brands";
type ResourceItem = {
  id: string;
  name: string;
  slug: string;
};

export default function ResourceManager({
  kind,
  items,
}: {
  kind: ResourceKind;
  items: ResourceItem[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [gender, setGender] = useState("MEN");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [logo, setLogo] = useState("");

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    const body = kind === "categories"
      ? { name, slug, gender, image: image || undefined }
      : { name, slug, logo: logo || undefined, description };
    const res = await fetch(`/api/admin/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not create item");
      return;
    }
    toast.success("Created");
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setLogo("");
    router.refresh();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/${kind}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed. Make sure no products depend on this item.");
      return;
    }
    toast.success("Deleted");
    router.refresh();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={create} className="space-y-4 rounded-lg border border-border bg-white p-6">
        <h2 className="font-semibold text-text-primary">Add {kind === "categories" ? "Category" : "Brand"}</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="h-10 w-full rounded border border-border px-3" required />
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug (optional)" className="h-10 w-full rounded border border-border px-3" />
        {kind === "categories" ? (
          <>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="h-10 w-full rounded border border-border px-3">
              <option value="MEN">Men</option>
              <option value="WOMEN">Women</option>
              <option value="KIDS">Kids</option>
            </select>
            <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Category image URL" className="h-10 w-full rounded border border-border px-3" />
          </>
        ) : (
          <>
            <input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="Logo URL" className="h-10 w-full rounded border border-border px-3" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="min-h-28 w-full rounded border border-border px-3 py-2" />
          </>
        )}
        <Button type="submit" className="w-full">Create</Button>
      </form>
      <div className="rounded-lg border border-border bg-white">
        <div className="grid grid-cols-[1fr_auto] border-b border-border px-4 py-3 text-sm font-semibold text-text-muted">
          <span>Name</span>
          <span>Actions</span>
        </div>
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_auto] items-center border-b border-border px-4 py-3 last:border-b-0">
            <div>
              <p className="font-semibold text-text-primary">{item.name}</p>
              <p className="text-xs text-text-muted">{item.slug}</p>
            </div>
            <Button type="button" variant="destructive" size="sm" onClick={() => remove(item.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
