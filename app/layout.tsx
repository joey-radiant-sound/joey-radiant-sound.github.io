import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Body font — wired via CSS variable so Tailwind's `font-sans` token in
// globals.css can reference it. Variable fonts only (no weight specified).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Radiant Sound",
    template: "%s · Radiant Sound",
  },
  description:
    "Radiant Sound provides professional live sound, lighting, and DJ services for weddings and college a cappella productions across the Northeast.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
