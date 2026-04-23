import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LenisProvider } from "@/components/animations/LenisProvider";
import "./globals.css";

// Body font — wired via CSS variable so Tailwind's `font-sans` token in
// globals.css can reference it. Variable fonts only (no weight specified).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://radiantsoundwny.com"),
  title: {
    default: "Radiant Sound",
    template: "%s · Radiant Sound",
  },
  description:
    "Radiant Sound provides professional live sound, lighting, and DJ services for weddings and college a cappella productions across the Northeast.",
  openGraph: {
    siteName: "Radiant Sound",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Radiant Sound",
  url: "https://radiantsoundwny.com",
  email: "joey@radiantsoundwny.com",
  areaServed: "United States",
  address: {
    "@type": "PostalAddress",
    addressRegion: "NY",
    addressCountry: "US",
  },
  description:
    "Live sound, lighting, DJ, and recording services for weddings and college a cappella productions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <LenisProvider>{children}</LenisProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
