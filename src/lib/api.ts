import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function message(message: string, init?: ResponseInit) {
  return NextResponse.json({ success: true, message }, init);
}

export function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) return { session: null, response: fail("Authentication required", 401) };
  return { session, response: null };
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return { session: null, response: fail("Authentication required", 401) };
  if (session.user.role !== "ADMIN") return { session: null, response: fail("Admin access required", 403) };
  return { session, response: null };
}
