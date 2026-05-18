import { Container } from "@/components/ui/Container";

type Pillar = {
  readonly title: string;
  readonly body: string;
};

type ServicePillarsProps = {
  eyebrow?: string;
  heading: string;
  pillars: readonly Pillar[];
};

/**
 * Generic 3-column pillars section. Each pillar renders as a card with
 * a darker brand-gradient header band that fades into a lighter body
 * tile. Center-aligned text throughout. Used by both sub-sites.
 */
export function ServicePillars({
  eyebrow,
  heading,
  pillars,
}: ServicePillarsProps) {
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
          {eyebrow && (
            <p className="mb-5 text-base font-semibold uppercase tracking-[0.25em] text-brand-600 md:text-lg">
              {eyebrow}
            </p>
          )}
          <h2 className="text-5xl font-semibold tracking-tight text-ink text-balance md:text-7xl">
            {heading}
          </h2>
        </div>

        <ul className="grid gap-6 md:grid-cols-3 md:gap-8">
          {pillars.map((p) => (
            <li
              key={p.title}
              className="overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-sm"
            >
              {/* Gradient header band — darker brand at top, fades into the lighter body */}
              <div
                className="flex h-32 items-end justify-center px-6 pb-5 md:h-36"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, var(--color-brand-500) 0%, var(--color-brand-200) 100%)",
                }}
              >
                <h3 className="text-center text-2xl font-semibold tracking-tight text-white text-balance md:text-3xl">
                  {p.title}
                </h3>
              </div>
              {/* Lighter body */}
              <div
                className="px-6 py-8 text-center md:px-8 md:py-10"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, var(--color-brand-50) 0%, #ffffff 100%)",
                }}
              >
                <p className="text-base leading-relaxed text-ink-soft md:text-lg">
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
