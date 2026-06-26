import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import AuthProvider from "@/components/auth/AuthProvider";
import CompareBar from "@/components/product/CompareBar";
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://delhishoepalace.com",
    siteName: "Delhi Shoe Palace",
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <body>
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
        <AuthProvider>
          {children}
          <CompareBar />
        </AuthProvider>
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
