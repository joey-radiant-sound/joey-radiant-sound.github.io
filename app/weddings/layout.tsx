import type { Metadata } from "next";
import { WeddingsNav } from "@/components/layout/WeddingsNav";
import { WeddingsFooter } from "@/components/layout/WeddingsFooter";

export const metadata: Metadata = {
  title: {
    default: "Weddings",
    template: "%s · Radiant Sound Weddings",
  },
  description:
    "Full-service DJ, sound, and lighting for the one night you'll replay for the rest of your life. Radiant Sound — weddings across the Northeast.",
};

export default function WeddingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-audience="weddings" className="flex min-h-screen flex-col">
      <WeddingsNav />
      <main className="flex-1">{children}</main>
      <WeddingsFooter />
    </div>
  );
}
