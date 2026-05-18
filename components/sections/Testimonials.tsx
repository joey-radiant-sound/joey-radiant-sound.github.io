import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { testimonials, weddingWireUrl } from "@/lib/content/weddings";

/**
 * Weddings testimonials — §2.5. Three curated WeddingWire reviews + a
 * prominent link-out to the full profile.
 */
export function Testimonials() {
  return (
    <section className="bg-ink py-24 text-white md:py-32">
      <Container>
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
          <p className="mb-6 text-2xl font-bold uppercase tracking-[0.2em] text-brand-300 md:text-4xl">
            What couples say
          </p>
          <h2 className="text-5xl font-semibold tracking-tight text-balance md:text-7xl">
            Straight from the dance floor
          </h2>
        </div>

        <ul className="mx-auto grid max-w-5xl gap-6 md:gap-8 lg:grid-cols-3">
          {testimonials.map((t) => (
            <li
              key={t.attribution}
              className="flex flex-col rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 backdrop-blur"
            >
              <p className="text-lg font-semibold text-white text-balance md:text-xl">
                &ldquo;{t.headline}&rdquo;
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">
                {t.body}
              </p>
              <p className="mt-6 text-sm font-medium text-brand-200">
                — {t.attribution}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Button
            href={weddingWireUrl}
            variant="secondary"
            size="lg"
            target="_blank"
            rel="noreferrer"
          >
            See all reviews on WeddingWire →
          </Button>
        </div>
      </Container>
    </section>
  );
}
