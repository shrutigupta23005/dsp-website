import type { Metadata } from "next";
import AboutPageClient from "@/components/about/AboutPageClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Delhi Shoe Palace — 24 years of trusted footwear retail in Karol Bagh, New Delhi. Our story, values, and journey.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
