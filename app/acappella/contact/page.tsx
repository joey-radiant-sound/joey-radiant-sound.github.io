import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AcappellaContactForm } from "@/components/forms/AcappellaContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your a cappella show — group, date, venue, services. We'll reply within one business day.",
};

export default function AcappellaContact() {
  return (
    <section className="py-24 md:py-32">
      <Container width="narrow">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
          Contact
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink text-balance md:text-5xl">
          Tell us about your show
        </h1>
        <p className="mt-6 text-lg text-muted">
          Group name, school, performance date, and anything else we should
          know. We&rsquo;ll come back within one business day with availability
          and a quote.
        </p>

        <div className="mt-12">
          <AcappellaContactForm />
        </div>
      </Container>
    </section>
  );
}
