import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadBuffer } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Sanitize a slug for use in Cloudinary folder paths.
 * Strips path traversal attempts and special characters.
 */
function sanitizeSlug(slug: string): string {
  return slug
    .replace(/\.\./g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .substring(0, 100);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file size (server-side, before upload attempt)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Validate MIME type (server-side, can't rely on client-side only)
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    const imageType = formData.get("imageType") as string; // PRIMARY, GALLERY, LIFESTYLE, ALT_ANGLE, BRAND_LOGO
    const order = parseInt((formData.get("order") as string) || "0", 10);
    const alt = (formData.get("alt") as string) || "";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Check if uploading brand logo
    if (imageType === "BRAND_LOGO") {
      try {
        const uploadRes = await uploadBuffer(buffer, {
          folder: "delhi-shoe-palace/brands",
          transformation: [{ width: 300, height: 300, crop: "fill", quality: "auto" }],
        });
        return NextResponse.json({
          url: uploadRes.url,
          publicId: uploadRes.publicId,
        });
      } catch (error: unknown) {
        console.error("Cloudinary brand logo upload failed:", error);
        const message =
          error && typeof error === "object" && "http_code" in error && (error as Record<string, unknown>).http_code === 420
            ? "Image storage temporarily unavailable, try again shortly"
            : "Failed to upload image";
        return NextResponse.json({ error: message }, { status: 503 });
      }
    }

    // 2. Upload product image
    const productId = formData.get("productId") as string;
    const productSlug = formData.get("productSlug") as string;

    if (!productId || !productSlug) {
      return NextResponse.json(
        { error: "productId and productSlug are required for product images" },
        { status: 400 }
      );
    }

    // Sanitize slug to prevent path traversal in Cloudinary folder
    const safeSlug = sanitizeSlug(productSlug);

    try {
      const uploadRes = await uploadBuffer(buffer, {
        folder: `delhi-shoe-palace/products/${safeSlug}`,
        transformation: [
          {
            width: 800,
            height: 800,
            crop: "fill",
            gravity: "auto",
            quality: "auto",
          },
        ],
      });

      // Create DB record AFTER upload succeeds (prevents orphaned records)
      const newImage = await prisma.productImage.create({
        data: {
          productId,
          url: uploadRes.url,
          publicId: uploadRes.publicId,
          type: imageType as "PRIMARY" | "GALLERY" | "LIFESTYLE" | "ALT_ANGLE",
          order,
          alt: alt || "Product Image",
        },
      });

      return NextResponse.json(newImage);
    } catch (error: unknown) {
      console.error("Cloudinary product upload failed:", error);
      // Check for Cloudinary quota exceeded
      const message =
        error && typeof error === "object" && "http_code" in error && (error as Record<string, unknown>).http_code === 420
          ? "Image storage temporarily unavailable, try again shortly"
          : "Failed to upload image";
      return NextResponse.json({ error: message }, { status: 503 });
    }
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
