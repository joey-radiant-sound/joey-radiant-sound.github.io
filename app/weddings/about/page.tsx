import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Radiant Sound is a wedding production company built around meticulous organization, musical expertise, and service that shows up around the clock.",
};

/**
 * Weddings About page — §4.W.
 *
 * NOTE(joey-review): This copy is an intentionally concise draft that
 * leans on the three principles already covered on the homepage rather
 * than repeating the v1/v2 About paragraphs Joey flagged as "bad."
 * Swap with final copy once Joey provides the information-sheet source
 * he wants to stick close to.
 */
export default function WeddingsAbout() {
  return (
    <section className="py-24 md:py-32">
      <Container width="narrow">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
          About
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink text-balance md:text-6xl">
          Built around your night.
        </h1>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-ink-soft md:text-xl">
          <p>
            Radiant Sound is a wedding production company built around three
            things: meticulous organization, genuine musical expertise, and
            service that shows up around the clock.
          </p>
          <p>
            We stay small on purpose — enough hands to run multiple events a
            weekend, small enough that the person you email is the person
            you&rsquo;ll see on your wedding day.
          </p>
          <p>
            Founded in Western New York in 2021, Radiant Sound is led by Joey
            Cassata, who has spent over a decade behind the mixing board at
            live shows.
          </p>
        </div>

        <div className="mt-12">
          <Button href="/weddings/contact" size="lg">
            Start a conversation
          </Button>
        </div>
      </Container>
    </section>
  );
}
