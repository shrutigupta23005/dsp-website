import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import QuizClient from "@/components/quiz/QuizClient";

export default async function QuizPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/quiz");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-secondary pt-28">
        <section className="container-wide pb-16">
          <QuizClient />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
