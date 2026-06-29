"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadZoneProps {
  productId: string;
  productSlug: string;
  onUploadComplete: (image: any) => void;
}

interface QueuedFile {
  file: File;
  preview: string;
  type: "PRIMARY" | "GALLERY" | "LIFESTYLE" | "ALT_ANGLE";
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
}

export default function ImageUploadZone({
  productId,
  productSlug,
  onUploadComplete,
}: ImageUploadZoneProps) {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mapped = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: "GALLERY" as const, // default to GALLERY
      progress: 0,
      status: "idle" as const,
    }));
    setFiles((prev) => [...prev, ...mapped].slice(0, 10)); // Max 10 images
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 10,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const copy = [...prev];
      const removed = copy.splice(index, 1)[0];
      if (removed && removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return copy;
    });
  };

  const updateFileType = (index: number, type: QueuedFile["type"]) => {
    setFiles((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, type } : item))
    );
  };

  const uploadSequentially = async () => {
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const current = files[i];
      if (current.status === "success" || current.status === "uploading") continue;

      // Update status to uploading
      setFiles((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: "uploading", progress: 20 } : item
        )
      );

      const formData = new FormData();
      formData.append("file", current.file);
      formData.append("productId", productId);
      formData.append("productSlug", productSlug);
      formData.append("imageType", current.type);
      formData.append("order", String(i));
      formData.append("alt", current.file.name.split(".")[0] || "Product Image");

      try {
        setFiles((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, progress: 60 } : item
          )
        );

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadedImage = await res.json();

        setFiles((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "success", progress: 100 } : item
          )
        );

        onUploadComplete(uploadedImage);
      } catch (err) {
        setFiles((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "error", progress: 0 } : item
          )
        );
        toast.error(`Failed to upload ${current.file.name}`);
      }
    }

    setIsUploading(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const pendingFiles = files.filter((f) => f.status === "idle");

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-[#242424] rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#0F0F0F] relative",
          isDragActive ? "border-[#C9933A] bg-[#1A1205]" : "hover:border-[#C9933A]/50"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-8 h-8 text-[#3A3A3A] mx-auto mb-2" />
        <p className="text-sm font-sans text-[#6B6B6B]">
          {isDragActive ? "Drop the files here..." : "Drop images here"}
        </p>
        <p className="text-[11px] font-mono text-[#3A3A3A] mt-1">
          or click to browse
        </p>
        <p className="text-[10px] font-mono text-[#3A3A3A] mt-3">
          JPG, PNG, WebP &bull; Max 5MB &bull; Up to 10 images
        </p>
      </div>

      {/* Upload Queue list */}
      {files.length > 0 && (
        <div className="space-y-3 bg-[#141414] border border-[#242424] p-4 rounded-xl">
          <h4 className="text-xs font-mono text-[#6B6B6B] uppercase tracking-wider">
            Upload Queue ({files.length})
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
            {files.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-[#1A1A1A] border border-[#242424] p-2.5 rounded-lg text-xs"
              >
                {/* Image Thumbnail */}
                <img
                  src={item.preview}
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded bg-[#0F0F0F]"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-medium text-[#F5F5F5] truncate">
                    {item.file.name}
                  </p>
                  <span className="font-mono text-[10px] text-[#6B6B6B]">
                    {formatSize(item.file.size)}
                  </span>
                </div>

                {/* Type Selection */}
                {item.status === "idle" && (
                  <select
                    value={item.type}
                    onChange={(e) => updateFileType(idx, e.target.value as any)}
                    className="bg-[#0F0F0F] border border-[#2A2A2A] rounded px-2 py-1 text-[11px] text-[#F5F5F5] font-sans outline-none focus:border-[#C9933A] cursor-pointer"
                  >
                    <option value="PRIMARY">Primary</option>
                    <option value="GALLERY">Gallery</option>
                    <option value="LIFESTYLE">Lifestyle</option>
                    <option value="ALT_ANGLE">Alt Angle</option>
                  </select>
                )}

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  {item.status === "uploading" && (
                    <div className="w-16 bg-[#0F0F0F] h-1.5 rounded-full overflow-hidden relative">
                      <div
                        className="bg-[#C9933A] h-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  {item.status === "success" && (
                    <span className="w-5 h-5 rounded-full bg-[#14532D] text-[#86EFAC] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}

                  {item.status === "error" && (
                    <span className="w-5 h-5 rounded-full bg-[#7F1D1D] text-[#FCA5A5] flex items-center justify-center">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </span>
                  )}

                  {/* Remove Button */}
                  {item.status === "idle" && (
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-[#6B6B6B] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Trigger */}
          {pendingFiles.length > 0 && (
            <Button
              type="button"
              onClick={uploadSequentially}
              disabled={isUploading}
              className="w-full bg-[#C9933A] text-[#0F0F0F] hover:bg-[#E5AC52] font-semibold text-xs h-9 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Uploading {files.length - pendingFiles.length}/{files.length}
                </>
              ) : (
                `Upload ${pendingFiles.length} Image(s)`
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
