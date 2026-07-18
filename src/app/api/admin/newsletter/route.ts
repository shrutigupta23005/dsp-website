import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [subscribers, totalCount, subscribedCount, unsubscribedCount] =
      await Promise.all([
        prisma.newsletter.findMany({
          orderBy: { createdAt: "desc" },
        }),
        prisma.newsletter.count(),
        prisma.newsletter.count({ where: { subscribed: true } }),
        prisma.newsletter.count({ where: { subscribed: false } }),
      ]);

    return NextResponse.json({
      subscribers,
      totalCount,
      subscribedCount,
      unsubscribedCount,
    });
  } catch (error) {
    console.error("Admin newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
