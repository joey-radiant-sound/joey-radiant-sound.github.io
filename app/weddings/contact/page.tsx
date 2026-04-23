import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WeddingsContactForm } from "@/components/forms/WeddingsContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your wedding — date, venue, vision. We'll reply within one business day.",
};

export default function WeddingsContact() {
  return (
    <section className="py-24 md:py-32">
      <Container width="narrow">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
          Contact
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink text-balance md:text-5xl">
          Get a wedding quote
        </h1>
        <p className="mt-6 text-lg text-muted">
          Tell us about your wedding. We&rsquo;ll come back within one business
          day with availability and a starting quote.
        </p>

        <div className="mt-12">
          <WeddingsContactForm />
        </div>
      </Container>
    </section>
  );
}
