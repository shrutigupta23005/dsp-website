import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import UserDetailClient from "./UserDetailClient";

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  const currentUserId = session?.user?.id || "";

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
    notFound();
  }

  return (
    <div className="space-y-6">
      <UserDetailClient user={user} currentUserId={currentUserId} />
    </div>
  );
}
