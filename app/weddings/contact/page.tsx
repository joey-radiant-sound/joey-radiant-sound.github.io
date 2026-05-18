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
    <section className="py-20 md:py-28">
      <Container width="narrow">
        {/* Big centered page header above everything */}
        <header className="mb-12 text-center md:mb-16">
          <p className="mb-6 text-2xl font-bold uppercase tracking-[0.2em] text-brand-600 md:text-4xl">
            Contact
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-ink text-balance md:text-7xl">
            Get a wedding quote
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted md:text-xl">
            Tell us about your wedding. We&rsquo;ll come back within one business
            day with availability and a starting quote.
          </p>
        </header>

        <WeddingsContactForm />
      </Container>
    </section>
  );
}
