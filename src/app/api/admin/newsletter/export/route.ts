import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscribers = await prisma.newsletter.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Build CSV
    const headers = "Name,Email,Subscribed,Joined Date\n";
    const rows = subscribers
      .map((s) => {
        const name = (s.name || "").replace(/,/g, " ");
        const date = s.createdAt.toLocaleDateString("en-IN");
        return `${name},${s.email},${s.subscribed ? "Yes" : "No"},${date}`;
      })
      .join("\n");

    const csv = headers + rows;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="newsletter-subscribers.csv"',
      },
    });
  } catch (error) {
    console.error("Newsletter CSV export error:", error);
    return NextResponse.json(
      { error: "Failed to export" },
      { status: 500 }
    );
  }
}
