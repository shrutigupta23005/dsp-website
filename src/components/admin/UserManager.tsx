"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  isBlocked: boolean;
};

export default function UserManager({ users }: { users: AdminUser[] }) {
  const router = useRouter();

  const update = async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      toast.error("User update failed");
      return;
    }
    toast.success("User updated");
    router.refresh();
  };

  return (
    <div className="rounded-lg border border-border bg-white">
      {users.map((user) => (
        <div key={user.id} className="grid gap-3 border-b border-border p-4 last:border-b-0 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <p className="font-semibold text-text-primary">{user.name || "Unnamed user"}</p>
            <p className="text-sm text-text-muted">{user.email}</p>
          </div>
          <select
            value={user.role}
            onChange={(event) => update(user.id, { role: event.target.value })}
            className="h-10 rounded border border-border px-3 text-sm"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <Button
            type="button"
            variant={user.isBlocked ? "outline" : "destructive"}
            onClick={() => update(user.id, { isBlocked: !user.isBlocked })}
          >
            {user.isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      ))}
    </div>
  );
}
