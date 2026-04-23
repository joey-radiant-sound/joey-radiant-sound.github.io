import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hero } from "@/lib/content/weddings";

/**
 * Weddings sub-site hero. Phase 1D: gradient-backed type-first hero.
 * Phase 1G will layer in scroll-tied parallax on a background image/video.
 */
export function WeddingsHero() {
  return (
    <section
      className="relative overflow-hidden py-28 md:py-40"
      style={{
        backgroundImage:
          "linear-gradient(180deg, var(--color-brand-50) 0%, #ffffff 100%)",
      }}
    >
      <Container className="text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
          {hero.eyebrow}
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-ink text-balance md:text-6xl lg:text-7xl">
          {hero.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
          {hero.subhead}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={hero.ctaHref} size="lg">
            {hero.ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
