import { headers } from "next/headers";
import { absoluteUrl } from "@/lib/utils";
import DashboardClient from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const headersList = await headers();
  const res = await fetch(absoluteUrl("/api/admin/stats"), {
    headers: Object.fromEntries(headersList.entries()),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load dashboard stats");
  }

  const stats = await res.json();

  return <DashboardClient stats={stats} />;
}
