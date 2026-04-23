import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact",
};

// TODO(1F): mount <AcappellaContactForm /> here once the form + server
// action + Zod schema land in Phase 1F.
export default function AcappellaContact() {
  return (
    <section className="py-24 md:py-32">
      <Container width="narrow">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
          Contact
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Tell us about your show
        </h1>
        <p className="mt-6 text-lg text-muted">
          Group name, school, performance date, and anything else we should
          know. We&rsquo;ll reply within one business day.
        </p>
        <p className="mt-12 text-sm text-muted/70">
          Phase 1B stub — form lands in Phase 1F.
        </p>
      </Container>
    </section>
  );
}
