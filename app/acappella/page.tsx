import { Container } from "@/components/ui/Container";
import { CallToAction } from "@/components/sections/CallToAction";

// TODO(1E): replace stub with hero + pillars + roster + why-us + service
// area. Content comes from lib/content/acappella.ts.
export default function AcappellaHome() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-28 md:py-40">
        <Container className="text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
            Radiant Sound · A Cappella
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-ink text-balance md:text-6xl">
            A cappella is all we think about.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
            Professional live sound, lighting, and recording for a cappella
            groups.
          </p>
          <p className="mx-auto mt-12 max-w-xl text-sm text-muted/70">
            {/* Phase 1B stub — full page lands in Phase 1E */}
            Roster, why-us, and service area lands in Phase 1E.
          </p>
        </Container>
      </section>

      <CallToAction
        eyebrow="Bring us your show"
        heading="Tell us about your next performance."
        body="Concerts, ICCAs, showcases, studio sessions — we&rsquo;ve done them all."
        ctaLabel="Get in touch"
        ctaHref="/acappella/contact"
      />
    </>
  );
}
