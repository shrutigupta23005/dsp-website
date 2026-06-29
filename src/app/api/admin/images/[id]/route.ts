import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { order, type, alt } = body;

    const updatedImage = await prisma.productImage.update({
      where: { id },
      data: {
        ...(order !== undefined && { order: parseInt(order, 10) }),
        ...(type !== undefined && { type }),
        ...(alt !== undefined && { alt }),
      },
    });

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error("Failed to update image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const image = await prisma.productImage.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete from Cloudinary if publicId exists
    if (image.publicId) {
      try {
        await deleteImage(image.publicId);
      } catch (cloudinaryErr) {
        console.error("Cloudinary deletion failed, proceeding with DB delete:", cloudinaryErr);
      }
    }

    // Delete from database
    await prisma.productImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
