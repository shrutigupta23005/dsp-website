// This file redirects to the public homepage
// The actual homepage is at src/app/(public)/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/");
}
