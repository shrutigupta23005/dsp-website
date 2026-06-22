import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    console.error("Brands API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
