import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadBuffer } from "@/lib/cloudinary";

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

    const imageType = formData.get("imageType") as string; // PRIMARY, GALLERY, LIFESTYLE, ALT_ANGLE, BRAND_LOGO
    const order = parseInt((formData.get("order") as string) || "0", 10);
    const alt = (formData.get("alt") as string) || "";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Check if uploading brand logo
    if (imageType === "BRAND_LOGO") {
      const uploadRes = await uploadBuffer(buffer, {
        folder: "delhi-shoe-palace/brands",
        transformation: [{ width: 300, height: 300, crop: "fill", quality: "auto" }],
      });
      return NextResponse.json({
        url: uploadRes.url,
        publicId: uploadRes.publicId,
      });
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

    const uploadRes = await uploadBuffer(buffer, {
      folder: `delhi-shoe-palace/products/${productSlug}`,
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

    // Create record in database
    const newImage = await prisma.productImage.create({
      data: {
        productId,
        url: uploadRes.url,
        publicId: uploadRes.publicId,
        type: imageType as any,
        order,
        alt: alt || "Product Image",
      },
    });

    return NextResponse.json(newImage);
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
