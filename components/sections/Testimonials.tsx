import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { testimonials, weddingWireUrl } from "@/lib/content/weddings";

/**
 * Weddings testimonials — §2.5. Three curated WeddingWire reviews + a
 * prominent link-out to the full profile.
 */
export function Testimonials() {
  return (
    <section className="bg-surface-alt py-24 md:py-32">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
            What couples say
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink text-balance md:text-5xl">
            Straight from the dance floor.
          </h2>
        </div>

        <ul className="mx-auto grid max-w-5xl gap-6 md:gap-8 lg:grid-cols-3">
          {testimonials.map((t) => (
            <li
              key={t.attribution}
              className="flex flex-col rounded-2xl bg-surface p-8 shadow-sm ring-1 ring-black/5"
            >
              <p className="text-lg font-semibold text-ink text-balance md:text-xl">
                &ldquo;{t.headline}&rdquo;
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                {t.body}
              </p>
              <p className="mt-6 text-sm font-medium text-ink-soft">
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
