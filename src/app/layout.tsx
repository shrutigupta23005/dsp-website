import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display, DM_Mono } from "next/font/google";
import { Toaster } from "sonner";
import AuthProvider from "@/components/auth/AuthProvider";
import CompareBar from "@/components/product/CompareBar";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import CustomCursor from "@/components/ui/CustomCursor";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import SkipToContent from "@/components/ui/SkipToContent";
import PageTransition from "@/components/ui/PageTransition";
import { generateOrganizationSchema } from "@/lib/structured-data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Delhi Shoe Palace — 24 Years of Trust in Footwear",
    template: "%s | Delhi Shoe Palace",
  },
  description:
    "Browse premium footwear for Men, Women & Kids at Delhi Shoe Palace. Trusted for 24 years with 200+ brands including Nike, Adidas, Puma, Bata & more. Visit us in Karol Bagh, New Delhi.",
  keywords: [
    "Delhi Shoe Palace",
    "footwear store Delhi",
    "shoes Karol Bagh",
    "buy shoes Delhi",
    "men shoes",
    "women shoes",
    "kids shoes",
    "Nike Delhi",
    "Adidas Delhi",
    "Bata Delhi",
  ],
  authors: [{ name: "Delhi Shoe Palace" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://delhishoepalace.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://delhishoepalace.com",
    siteName: "Delhi Shoe Palace",
    title: "Delhi Shoe Palace — 24 Years of Trust in Footwear",
    description:
      "Browse premium footwear for Men, Women & Kids. 200+ brands. Trusted for 24 years.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Delhi Shoe Palace — 24 Years of Trust in Footwear",
    description:
      "Browse premium footwear for Men, Women & Kids. 200+ brands. Trusted for 24 years.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} ${dmMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <GoogleAnalytics />
        <SkipToContent />
        <SmoothScrollProvider>
          <AuthProvider>
            <CustomCursor />
            <NoiseOverlay />
            <PageTransition>
              <main id="main-content">{children}</main>
            </PageTransition>
            <CompareBar />
          </AuthProvider>
        </SmoothScrollProvider>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color: "#F5F2EE",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid #2A2A2A",
            },
          }}
        />
      </body>
    </html>
  );
}
