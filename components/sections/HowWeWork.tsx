import { Container } from "@/components/ui/Container";
import { principles } from "@/lib/content/weddings";

/**
 * Weddings "how we work" — §2.3. Dark section. Each principle gets a
 * staggered, alternating layout: the title is huge, the body is split
 * into sentence fragments stacked vertically with subtle brand-color
 * leading marks. A thin gradient divider separates each principle.
 */
export function HowWeWork() {
  return (
    <section className="bg-ink py-24 text-white md:py-32">
      <Container>
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-24">
          <p className="mb-5 text-base font-semibold uppercase tracking-[0.25em] text-brand-300 md:text-lg">
            How we work
          </p>
          <h2 className="text-5xl font-semibold tracking-tight text-balance md:text-7xl">
            Three things we take seriously.
          </h2>
        </div>

        <ul className="mx-auto max-w-5xl">
          {principles.map((p, i) => {
            const sentences = splitSentences(p.body);
            const flipped = i % 2 === 1;
            return (
              <li key={p.title}>
                {/* Gradient divider between principles (skip before first) */}
                {i > 0 && (
                  <div
                    aria-hidden
                    className="mx-auto my-14 h-px w-full max-w-3xl md:my-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, transparent 0%, var(--color-brand-500) 50%, transparent 100%)",
                    }}
                  />
                )}
                <div
                  className={`grid items-start gap-8 md:gap-14 md:grid-cols-12 ${
                    flipped ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {/* Title side — half width on desktop, full on mobile */}
                  <div className="md:col-span-5">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">
                      Principle {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                      {p.title}
                    </h3>
                  </div>
                  {/* Sentence-broken body — vertical rhythm + small brand marks */}
                  <div className="md:col-span-7 md:pt-4">
                    <ul className="space-y-5">
                      {sentences.map((sentence, idx) => (
                        <li key={idx} className="flex gap-4">
                          <span
                            aria-hidden
                            className="mt-2 h-1.5 w-6 flex-shrink-0 rounded-full bg-brand-500"
                          />
                          <p className="text-lg leading-relaxed text-white/80 md:text-xl">
                            {sentence}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/** Split a body string into trimmed sentences (keeps trailing punctuation). */
function splitSentences(body: string): string[] {
  return body
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
