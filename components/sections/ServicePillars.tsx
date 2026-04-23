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
 * Generic 3-column pillars section. Used by both sub-sites (weddings §2.2,
 * a cappella §3.2). Scroll-reveal hooks land in Phase 1G.
 */
export function ServicePillars({
  eyebrow,
  heading,
  pillars,
}: ServicePillarsProps) {
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-semibold tracking-tight text-ink text-balance md:text-5xl">
            {heading}
          </h2>
        </div>

        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {pillars.map((p, i) => (
            <li key={p.title} className="flex flex-col">
              <span className="mb-4 text-xs font-semibold tracking-widest text-brand-500">
                0{i + 1}
              </span>
              <h3 className="text-xl font-semibold text-ink md:text-2xl">
                {p.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
