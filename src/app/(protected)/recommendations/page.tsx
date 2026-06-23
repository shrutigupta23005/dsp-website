import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui/button";

export default async function RecommendationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/recommendations");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-secondary pt-28">
        <section className="container-narrow pb-16 text-center">
          <p className="eyebrow">Personal Picks</p>
          <h1 className="section-title mt-3">Recommendations Start With The Quiz</h1>
          <span className="golden-rule mx-auto" />
          <p className="mx-auto mt-6 max-w-2xl text-text-muted">
            Answer four quick questions and the catalog will narrow itself to pairs that match your use, taste, and budget.
          </p>
          <Button asChild className="mt-8">
            <Link href="/quiz">Find Your Perfect Pair</Link>
          </Button>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
