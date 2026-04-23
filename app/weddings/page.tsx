import { Container } from "@/components/ui/Container";
import { CallToAction } from "@/components/sections/CallToAction";

// TODO(1D): replace stub with hero + pillars + principles + process +
// testimonials + service area. Content comes from lib/content/weddings.ts.
export default function WeddingsHome() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-28 md:py-40">
        <Container className="text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
            Radiant Sound · Weddings
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-ink text-balance md:text-6xl">
            The night you&rsquo;ll want to replay forever.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
            Full-service DJ, sound, and lighting for the one night you&rsquo;ll
            replay for the rest of your life.
          </p>
          <p className="mx-auto mt-12 max-w-xl text-sm text-muted/70">
            {/* Phase 1B stub — full page lands in Phase 1D */}
            Full page with pillars, principles, process, and testimonials
            coming in Phase 1D.
          </p>
        </Container>
      </section>

      <CallToAction
        eyebrow="Ready when you are"
        heading="Let's plan your wedding."
        body="Tell us your date, venue, and vibe — we&rsquo;ll take it from there."
        ctaLabel="Get a quote"
        ctaHref="/weddings/contact"
      />
    </>
  );
}
