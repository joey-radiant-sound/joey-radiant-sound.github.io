import { Container } from "@/components/ui/Container";
import { processSteps } from "@/lib/content/weddings";

/**
 * Weddings 4-step process — §2.4. Phase 1G may pin this section and
 * animate step reveals for an Apple-style layered scroll moment.
 */
export function ProcessSteps() {
  return (
    <section className="bg-surface py-24 md:py-32">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
            The process
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink text-balance md:text-5xl">
            Our simple four-step process.
          </h2>
        </div>

        <ol className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:gap-12">
          {processSteps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-2xl bg-surface-alt p-8 md:p-10"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-6 text-xl font-semibold text-ink md:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
