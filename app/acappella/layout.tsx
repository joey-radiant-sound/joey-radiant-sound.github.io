import type { Metadata } from "next";
import { AcappellaNav } from "@/components/layout/AcappellaNav";
import { AcappellaFooter } from "@/components/layout/AcappellaFooter";

export const metadata: Metadata = {
  title: {
    default: "A Cappella",
    template: "%s · Radiant Sound A Cappella",
  },
  description:
    "Professional live sound, lighting, and recording for a cappella groups. Radiant Sound — purpose-built for a cappella production.",
};

export default function AcappellaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-audience="acappella" className="flex min-h-screen flex-col">
      <AcappellaNav />
      <main className="flex-1">{children}</main>
      <AcappellaFooter />
    </div>
  );
}
