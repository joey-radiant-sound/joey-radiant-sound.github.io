import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About",
};

// TODO(1E): replace stub with real About copy from CONTENT.md §4.A.
export default function AcappellaAbout() {
  return (
    <section className="py-24 md:py-32">
      <Container width="narrow">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
          About
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          About Radiant Sound · A Cappella
        </h1>
        <p className="mt-6 text-lg text-muted">
          Phase 1B stub — real copy lands in Phase 1E.
        </p>
      </Container>
    </section>
  );
}
