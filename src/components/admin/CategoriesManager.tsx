"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import {
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ConfirmDialog from "./ConfirmDialog";
import { AnimatePresence, motion } from "framer-motion";

interface CategoriesManagerProps {
  initialCategories: any[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CategoriesManager({
  initialCategories,
}: CategoriesManagerProps) {
  // SWR query
  const { data: categories, mutate } = useSWR("/api/admin/categories", fetcher, {
    fallbackData: initialCategories,
    revalidateOnFocus: false,
  });

  // State Management
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatGender, setNewCatGender] = useState<"MEN" | "WOMEN" | "KIDS">("MEN");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);

  // Edit Category Inline
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [updatingCat, setUpdatingCat] = useState(false);

  // Add Subcategory Inline
  const [addingSubCatId, setAddingSubCatId] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState("");
  const [creatingSub, setCreatingSub] = useState(false);

  // Edit Subcategory Inline
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editingSubName, setEditingSubName] = useState("");
  const [updatingSub, setUpdatingSub] = useState(false);

  // 1. Create Category Action
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || newCatName.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    setCreatingCategory(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim(), gender: newCatGender }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");

      toast.success("Category created successfully");
      setNewCatName("");
      setIsAddingCategory(false);
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  // 2. Update Category Action
  const handleUpdateCategory = async (catId: string) => {
    if (!editingCatName.trim() || editingCatName.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    setUpdatingCat(true);
    try {
      const res = await fetch(`/api/admin/categories/${catId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingCatName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update category");

      toast.success("Category updated");
      setEditingCatId(null);
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to update category");
    } finally {
      setUpdatingCat(false);
    }
  };

  // 3. Delete Category Action
  const handleDeleteCategory = async (catId: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${catId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");

      toast.success("Category deleted");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  // 4. Create Subcategory Action
  const handleCreateSubcategory = async (catId: string) => {
    if (!newSubName.trim() || newSubName.trim().length < 2) {
      toast.error("Subcategory name must be at least 2 characters");
      return;
    }

    setCreatingSub(true);
    try {
      const res = await fetch("/api/admin/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSubName.trim(), categoryId: catId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create subcategory");

      toast.success("Subcategory added");
      setNewSubName("");
      setAddingSubCatId(null);
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to create subcategory");
    } finally {
      setCreatingSub(false);
    }
  };

  // 5. Update Subcategory Action
  const handleUpdateSubcategory = async (subId: string) => {
    if (!editingSubName.trim() || editingSubName.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    setUpdatingSub(true);
    try {
      const res = await fetch(`/api/admin/subcategories/${subId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingSubName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update subcategory");

      toast.success("Subcategory updated");
      setEditingSubId(null);
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to update subcategory");
    } finally {
      setUpdatingSub(false);
    }
  };

  // 6. Delete Subcategory Action
  const handleDeleteSubcategory = async (subId: string) => {
    try {
      const res = await fetch(`/api/admin/subcategories/${subId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete subcategory");

      toast.success("Subcategory deleted");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete subcategory");
    }
  };

  const getGenderBadge = (gender: string) => {
    switch (gender) {
      case "MEN":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
      case "WOMEN":
        return "bg-pink-500/10 text-pink-400 border border-pink-500/30";
      default:
        return "bg-purple-500/10 text-purple-400 border border-purple-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#F5F5F5] font-sans">Categories</h2>
          <span className="font-mono text-xs text-[#C9933A] border border-[#C9933A]/20 bg-[#1A1205] rounded-full px-2.5 py-0.5">
            {categories.length}
          </span>
        </div>

        <button
          onClick={() => setIsAddingCategory(!isAddingCategory)}
          className="bg-[#C9933A] text-[#0F0F0F] hover:bg-[#E5AC52] transition-colors h-9 px-4 rounded-lg text-xs font-semibold font-sans flex items-center gap-1.5 cursor-pointer"
        >
          {isAddingCategory ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAddingCategory ? "Cancel" : "Add Category"}
        </button>
      </div>

      {/* Inline Create Form */}
      <AnimatePresence>
        {isAddingCategory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleCreateCategory}
              className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-end md:items-center"
            >
              <div className="flex-1 w-full space-y-1">
                <label className="text-[10px] font-mono text-[#6B6B6B] uppercase tracking-wider block">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sports, Casual, Sandals"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="h-10 w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none"
                  required
                />
              </div>

              <div className="w-full md:w-44 space-y-1">
                <label className="text-[10px] font-mono text-[#6B6B6B] uppercase tracking-wider block">
                  Gender
                </label>
                <select
                  value={newCatGender}
                  onChange={(e) => setNewCatGender(e.target.value as any)}
                  className="h-10 w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-xs text-[#F5F5F5] focus:border-[#C9933A] outline-none cursor-pointer"
                >
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="KIDS">Kids</option>
                </select>
              </div>

              <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="h-10 flex-1 md:flex-initial px-4 rounded-lg text-xs font-semibold text-[#6B6B6B] border border-[#242424] hover:text-[#F5F5F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCategory}
                  className="h-10 flex-1 md:flex-initial px-4 bg-[#C9933A] text-[#0F0F0F] hover:bg-[#E5AC52] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {creatingCategory && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Create Category
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accordion Categories List */}
      <div className="space-y-4">
        {categories.map((cat: any) => {
          const isExpanded = expandedCatId === cat.id;
          const isEditing = editingCatId === cat.id;
          const hasProducts = cat._count?.products > 0;

          return (
            <div
              key={cat.id}
              className="bg-[#1A1A1A] border border-[#242424] rounded-2xl overflow-hidden"
            >
              {/* COLLAPSED HEADER */}
              <div
                onClick={() => !isEditing && setExpandedCatId(isExpanded ? null : cat.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-[#1E1A14]/10 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-[#6B6B6B]" />
                  </motion.div>

                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap",
                      getGenderBadge(cat.gender)
                    )}
                  >
                    {cat.gender}
                  </span>

                  {isEditing ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 max-w-sm flex-1"
                    >
                      <input
                        type="text"
                        value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleUpdateCategory(cat.id)
                        }
                        className="h-8 bg-[#0F0F0F] border border-[#2A2A2A] rounded px-3 text-sm text-[#F5F5F5] font-sans w-full outline-none focus:border-[#C9933A]"
                      />
                      <button
                        onClick={() => handleUpdateCategory(cat.id)}
                        disabled={updatingCat}
                        className="p-1.5 rounded bg-[#C9933A] text-[#0F0F0F] cursor-pointer"
                      >
                        {updatingCat ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingCatId(null)}
                        className="p-1.5 rounded bg-[#242424] text-[#6B6B6B] hover:text-[#F5F5F5] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-base font-semibold text-[#F5F5F5] font-sans truncate">
                      {cat.name}
                    </h3>
                  )}
                </div>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-4 text-xs font-mono text-[#6B6B6B]"
                >
                  <span>{cat.subcategories?.length || 0} subcategories</span>
                  <span className="text-[#C9933A]">{cat._count?.products || 0} products</span>

                  <div className="flex items-center gap-1.5 border-l border-[#242424] pl-4">
                    <button
                      onClick={() => {
                        setEditingCatId(cat.id);
                        setEditingCatName(cat.name);
                      }}
                      className="p-1.5 rounded-lg hover:text-[#C9933A] hover:bg-[#242424] transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <ConfirmDialog
                      trigger={
                        <button
                          disabled={hasProducts}
                          className={cn(
                            "p-1.5 rounded-lg hover:text-[#EF4444] hover:bg-[#242424] transition-colors cursor-pointer",
                            hasProducts && "opacity-35 hover:bg-transparent cursor-not-allowed"
                          )}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      }
                      title="Delete Category?"
                      description={`Are you sure you want to delete ${cat.name}? This will delete all its subcategories too.`}
                      confirmLabel="Delete"
                      variant="danger"
                      onConfirm={() => handleDeleteCategory(cat.id)}
                    />
                  </div>
                </div>
              </div>

              {/* EXPANDED BODY */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 border-t border-[#242424] space-y-4">
                      <div className="mt-4">
                        <span className="text-[10px] font-mono text-[#6B6B6B] uppercase tracking-wider block mb-3">
                          Subcategories
                        </span>

                        {/* Subcategory chips */}
                        <div className="flex flex-wrap gap-2.5">
                          {cat.subcategories?.map((sub: any) => {
                            const isSubEditing = editingSubId === sub.id;
                            const hasSubProducts = sub._count?.products > 0;

                            return (
                              <div
                                key={sub.id}
                                className={cn(
                                  "bg-[#141414] border border-[#242424] hover:border-[#C9933A] rounded-full pl-3 pr-2 py-1.5 flex items-center gap-2 transition-colors",
                                  isSubEditing && "border-[#C9933A]"
                                )}
                              >
                                {isSubEditing ? (
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={editingSubName}
                                      onChange={(e) => setEditingSubName(e.target.value)}
                                      onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        handleUpdateSubcategory(sub.id)
                                      }
                                      className="h-5 bg-transparent border-0 outline-none text-xs text-[#F5F5F5] font-sans w-24"
                                    />
                                    <button
                                      onClick={() => handleUpdateSubcategory(sub.id)}
                                      disabled={updatingSub}
                                      className="text-[#C9933A] hover:text-[#E5AC52] cursor-pointer"
                                    >
                                      {updatingSub ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Check className="w-3 h-3" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => setEditingSubId(null)}
                                      className="text-[#6B6B6B] hover:text-[#F5F5F5] cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <span className="font-mono text-xs text-[#F5F5F5]">
                                      {sub.name}
                                    </span>
                                    {/* Product count */}
                                    <span className="w-5 h-5 rounded-full bg-[#1A1A1A] border border-[#242424] text-[9px] font-mono font-bold text-[#C9933A] flex items-center justify-center">
                                      {sub._count?.products || 0}
                                    </span>

                                    {/* edit/delete */}
                                    <button
                                      onClick={() => {
                                        setEditingSubId(sub.id);
                                        setEditingSubName(sub.name);
                                      }}
                                      className="text-[#3A3A3A] hover:text-[#C9933A] transition-colors cursor-pointer"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>

                                    <ConfirmDialog
                                      trigger={
                                        <button
                                          disabled={hasSubProducts}
                                          className={cn(
                                            "text-[#3A3A3A] hover:text-[#EF4444] transition-colors cursor-pointer",
                                            hasSubProducts &&
                                              "opacity-25 hover:text-[#3A3A3A] cursor-not-allowed"
                                          )}
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      }
                                      title="Delete Subcategory?"
                                      description={`Are you sure you want to delete subcategory ${sub.name}?`}
                                      confirmLabel="Delete"
                                      variant="danger"
                                      onConfirm={() => handleDeleteSubcategory(sub.id)}
                                    />
                                  </>
                                )}
                              </div>
                            );
                          })}

                          {/* Add Subcategory Inline Button */}
                          {addingSubCatId === cat.id ? (
                            <div className="bg-[#141414] border border-[#C9933A] rounded-full pl-3 pr-2 py-1 flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Subcategory name..."
                                value={newSubName}
                                onChange={(e) => setNewSubName(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleCreateSubcategory(cat.id)
                                }
                                className="h-6 bg-transparent border-0 outline-none text-xs text-[#F5F5F5] font-sans w-32 placeholder-[#3A3A3A]"
                              />
                              <button
                                onClick={() => handleCreateSubcategory(cat.id)}
                                disabled={creatingSub}
                                className="text-[#C9933A] hover:text-[#E5AC52] cursor-pointer"
                              >
                                {creatingSub ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => setAddingSubCatId(null)}
                                className="text-[#6B6B6B] hover:text-[#F5F5F5] cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setAddingSubCatId(cat.id);
                                setNewSubName("");
                              }}
                              className="border border-dashed border-[#242424] hover:border-[#C9933A] rounded-full px-3.5 py-1.5 text-xs text-[#6B6B6B] hover:text-[#C9933A] font-sans flex items-center gap-1 transition-colors cursor-pointer bg-transparent"
                            >
                              <Plus className="w-3 h-3" />
                              Add Subcategory
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-12 text-center text-[#6B6B6B] flex flex-col items-center justify-center">
            <FolderOpen className="w-12 h-12 text-[#3A3A3A] mb-3" />
            <h4 className="font-sans font-medium text-sm text-[#F5F5F5]">No Categories Found</h4>
            <p className="text-xs mt-1">Get started by creating your first category catalog above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
