import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Radiant Sound has been mixing a cappella for over a decade — hundreds of shows across the country and on international tours, from tight competition sets to festival concerts to full album productions.",
};

/**
 * A Cappella About — §4.A. Copy lifted verbatim from CONTENT.md v2;
 * Joey has not flagged this section for rewrite.
 */
export default function AcappellaAbout() {
  return (
    <section className="py-24 md:py-32">
      <Container width="narrow">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
          About
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink text-balance md:text-6xl">
          About Radiant Sound &middot; A Cappella
        </h1>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-ink-soft md:text-xl">
          <p>
            We&rsquo;ve been mixing a cappella for over a decade. In that time
            we&rsquo;ve run sound and lighting for hundreds of shows across
            the country and on international tours — from tight competition
            sets to festival-length concerts to full album productions.
          </p>
          <p>
            Radiant Sound exists because a cappella deserves better than a
            house-rig afterthought. Every element of what we do — PA
            selection, microphone choice, monitor mix, show lighting,
            recording chain — is tuned specifically for the way voices work
            together on stage. We know the difference between a bass line
            that lands and one that disappears, and we know what a soloist
            needs from a monitor the second they step forward.
          </p>
          <p>
            Beyond live sound, we handle recording, mixing, mastering, and
            post-production for albums and show videos. Same ears. Same
            standards. Same obsession with getting it right.
          </p>
        </div>

        <div className="mt-12">
          <Button href="/acappella/contact" size="lg">
            Tell us about your show
          </Button>
        </div>
      </Container>
    </section>
  );
}
