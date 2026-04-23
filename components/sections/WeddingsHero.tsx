import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hero } from "@/lib/content/weddings";

/**
 * Weddings sub-site hero. Dark-on-photo treatment: real wedding image
 * as backdrop, brand-gradient wash on top for legibility, white type.
 */
export function WeddingsHero() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <Image
        src="/images/weddings/reception-dancefloor-01.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.55) 45%, rgba(10,22,40,0.8) 100%)",
        }}
      />
      <Container className="relative text-center text-white">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
          {hero.eyebrow}
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl lg:text-7xl">
          {hero.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
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
