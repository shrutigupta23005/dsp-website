import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        wishlist: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            product: {
              include: {
                images: {
                  where: { type: "PRIMARY" },
                  take: 1,
                },
                brand: true,
              },
            },
          },
        },
        recentlyViewed: {
          orderBy: { viewedAt: "desc" },
          take: 5,
          include: {
            product: {
              include: {
                images: {
                  where: { type: "PRIMARY" },
                  take: 1,
                },
                brand: true,
              },
            },
          },
        },
        _count: {
          select: {
            wishlist: true,
            recentlyViewed: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
    const { isBlocked } = body;

    // Prevent role escalation via API — role changes are not allowed
    if ("role" in body) {
      return NextResponse.json(
        { error: "Role changes are not allowed via this endpoint" },
        { status: 400 }
      );
    }

    if (isBlocked === undefined || typeof isBlocked !== "boolean") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Prevent blocking self
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "You cannot block yourself" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isBlocked },
      select: {
        id: true,
        name: true,
        email: true,
        isBlocked: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user block status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
