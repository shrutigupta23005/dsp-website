import { prisma } from "@/lib/prisma";
import { ok, requireAdmin } from "@/lib/api";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, isBlocked: true, createdAt: true },
  });
  return ok(users);
}
