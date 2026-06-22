import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color: "#F5F2EE",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid #2A2A2A",
            },
            success: {
              iconTheme: {
                primary: "#C9933A",
                secondary: "#1A1A1A",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
