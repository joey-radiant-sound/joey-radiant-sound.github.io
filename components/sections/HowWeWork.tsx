import { Container } from "@/components/ui/Container";
import { principles } from "@/lib/content/weddings";

/**
 * Weddings "how we work" — §2.3. Dark section. Two-column layout per
 * principle (no left/right alternation — everything stays anchored on
 * the same side): big title on the left, sentence-broken body on the
 * right with proper bullet points aligned to the text baseline.
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
                <div className="grid items-start gap-8 md:gap-14 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <h3 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                      {p.title}
                    </h3>
                  </div>
                  <ul className="space-y-4 md:col-span-7 md:pt-4">
                    {sentences.map((sentence, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-lg leading-relaxed text-white/85 md:text-xl"
                      >
                        <span
                          aria-hidden
                          className="select-none text-brand-400"
                        >
                          •
                        </span>
                        <span className="flex-1">{sentence}</span>
                      </li>
                    ))}
                  </ul>
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
