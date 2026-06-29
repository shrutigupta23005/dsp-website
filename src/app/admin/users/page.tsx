import { prisma } from "@/lib/prisma";
import UsersTable from "@/components/admin/UsersTable";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await auth();
  const currentUserId = session?.user?.id || "";

  const [initialUsers, total, activeCount, blockedCount] = await Promise.all([
    prisma.user.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
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
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({ where: { role: "USER", isBlocked: false } }),
    prisma.user.count({ where: { role: "USER", isBlocked: true } }),
  ]);

  return (
    <div className="space-y-6">
      <UsersTable
        initialUsers={initialUsers}
        initialTotal={total}
        activeCount={activeCount}
        blockedCount={blockedCount}
        currentUserId={currentUserId}
      />
    </div>
  );
}
