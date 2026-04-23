import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hero } from "@/lib/content/acappella";

/**
 * A cappella sub-site hero. Dark-on-photo treatment: real performance
 * image as backdrop, deep-blue wash for legibility, white type.
 */
export function AcappellaHero() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <Image
        src="/images/acappella/stage-01.jpg"
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
            "linear-gradient(180deg, rgba(10,22,40,0.78) 0%, rgba(10,22,40,0.6) 45%, rgba(10,22,40,0.85) 100%)",
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
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          {hero.body}
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
