import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, caseInsensitive } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const search = url.searchParams.get("search") || "";
    const filter = url.searchParams.get("filter") || "all"; // all, active, blocked

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, ...caseInsensitive() } },
        { email: { contains: search, ...caseInsensitive() } },
      ];
    }

    if (filter === "blocked") {
      where.isBlocked = true;
    } else if (filter === "active") {
      where.isBlocked = false;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          isBlocked: true,
          createdAt: true,
          _count: {
            select: {
              wishlist: true,
              recentlyViewed: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      users,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Failed to query users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
