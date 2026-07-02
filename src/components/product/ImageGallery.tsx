"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImageType } from "@/types";

interface ImageGalleryProps {
  images: ProductImageType[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = images[activeIndex] || images[0];

  const goTo = useCallback(
    (index: number) => {
      if (index < 0) setActiveIndex(images.length - 1);
      else if (index >= images.length) setActiveIndex(0);
      else setActiveIndex(index);
    },
    [images.length]
  );

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-muted">
        <p className="text-sm text-text-muted">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Image */}
      <div className="space-y-3">
        <div
          className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-xl bg-white"
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
          aria-label={`View ${productName} full size`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full"
            >
              <Image
                src={activeImage.url}
                alt={activeImage.alt || productName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom hint */}
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn className="h-4 w-4 text-text-primary" />
          </div>

          {/* Image count badge */}
          {images.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-background-primary/70 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300",
                  activeIndex === index
                    ? "border-accent shadow-sm shadow-accent/20 -translate-y-1"
                    : "border-transparent opacity-60 hover:opacity-100 hover:-translate-y-1"
                )}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${productName} - ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-background-primary/95 backdrop-blur-md"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative mx-4 h-[80vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeImage.url}
                alt={activeImage.alt || productName}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex - 1);
                  }}
                  className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex + 1);
                  }}
                  className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Counter */}
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 font-mono text-xs text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
