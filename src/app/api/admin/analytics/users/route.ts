import { prisma } from "@/lib/prisma";
import { ok, requireAdmin } from "@/lib/api";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, name: true, email: true, createdAt: true, role: true },
  });
  return ok(users);
}
