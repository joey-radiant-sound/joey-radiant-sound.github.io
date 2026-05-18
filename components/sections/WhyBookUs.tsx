import { Container } from "@/components/ui/Container";
import { whyBookUs } from "@/lib/content/acappella";

/**
 * A cappella "why groups keep booking us" — §3.4.
 */
export function WhyBookUs() {
  return (
    <section className="bg-surface-alt py-24 md:py-32">
      <Container>
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
          <p className="mb-6 text-2xl font-bold uppercase tracking-[0.2em] text-brand-600 md:text-4xl">
            Why groups keep booking us
          </p>
          <h2 className="text-5xl font-semibold tracking-tight text-ink text-balance md:text-7xl">
            Same team · Same standards · Year after year
          </h2>
        </div>

        <ul className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3 md:gap-10">
          {whyBookUs.map((item) => (
            <li key={item.title} className="flex flex-col">
              <h3 className="text-2xl font-semibold text-ink md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted md:text-lg">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
