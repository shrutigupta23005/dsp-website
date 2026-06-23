import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/profile");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-secondary pt-28">
        <section className="container-narrow pb-16">
          <p className="eyebrow">Account</p>
          <h1 className="section-title mt-3">Your Profile</h1>
          <span className="golden-rule" />
          <div className="mt-10 rounded-lg border border-border bg-white p-8">
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-text-muted">Name</dt>
                <dd className="mt-1 font-semibold text-text-primary">{session.user.name || "Delhi Shoe Palace Customer"}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Email</dt>
                <dd className="mt-1 font-semibold text-text-primary">{session.user.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Role</dt>
                <dd className="mt-1 font-semibold text-text-primary">{session.user.role}</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
