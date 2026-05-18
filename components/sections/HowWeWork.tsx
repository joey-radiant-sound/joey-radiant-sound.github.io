import { Container } from "@/components/ui/Container";
import { principles } from "@/lib/content/weddings";

/**
 * Weddings "how we work" section — §2.3. Three principles: meticulous
 * organization, musical expertise, unparalleled professionalism.
 * Numbered indices removed per Joey's feedback — the principles read
 * as peers, not sequential steps.
 */
export function HowWeWork() {
  return (
    <section className="bg-surface-alt py-24 md:py-32">
      <Container>
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
            How we work
          </p>
          <h2 className="text-5xl font-semibold tracking-tight text-ink text-balance md:text-7xl">
            Three things we take seriously.
          </h2>
        </div>

        <ul className="mx-auto grid max-w-4xl gap-12 md:gap-14">
          {principles.map((p) => (
            <li key={p.title}>
              <h3 className="text-3xl font-semibold text-ink md:text-4xl">
                {p.title}
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
