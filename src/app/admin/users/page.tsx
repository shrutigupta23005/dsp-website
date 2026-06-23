import { prisma } from "@/lib/prisma";
import UserManager from "@/components/admin/UserManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, isBlocked: true, createdAt: true },
  });

  return (
    <div>
      <p className="eyebrow">Access Control</p>
      <h1 className="mb-8 mt-2 text-3xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Users</h1>
      <UserManager users={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
