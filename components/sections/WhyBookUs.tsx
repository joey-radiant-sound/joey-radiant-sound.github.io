import { Container } from "@/components/ui/Container";
import { whyBookUs } from "@/lib/content/acappella";

/**
 * A cappella "why groups keep booking us" — §3.4.
 */
export function WhyBookUs() {
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
            Why groups keep booking us
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink text-balance md:text-5xl">
            Same team. Same standards. Year after year.
          </h2>
        </div>

        <ul className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3 md:gap-10">
          {whyBookUs.map((item) => (
            <li key={item.title} className="flex flex-col">
              <h3 className="text-xl font-semibold text-ink md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
