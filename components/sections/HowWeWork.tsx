import { Container } from "@/components/ui/Container";
import { principles } from "@/lib/content/weddings";

/**
 * Weddings "how we work" section — §2.3. Three principles: meticulous
 * organization, musical expertise, unparalleled professionalism.
 */
export function HowWeWork() {
  return (
    <section className="bg-surface-alt py-24 md:py-32">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
            How we work
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink text-balance md:text-5xl">
            Three things we take seriously.
          </h2>
        </div>

        <ul className="mx-auto grid max-w-5xl gap-12 md:gap-14">
          {principles.map((p, i) => (
            <li
              key={p.title}
              className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-10"
            >
              <span className="font-display text-5xl font-semibold leading-none text-brand-500/60 md:text-6xl">
                0{i + 1}
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-ink md:text-3xl">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
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
