import { Container } from "@/components/ui/Container";

type ServiceAreaProps = {
  eyebrow?: string;
  body: string;
};

/**
 * Shared service-area blurb. Used by both sub-sites with different text
 * (weddings §2.6, a cappella §3.5). The CTA below lives in its own
 * <CallToAction /> band for visual separation.
 */
export function ServiceArea({ eyebrow = "Service area", body }: ServiceAreaProps) {
  return (
    <section className="bg-surface py-20 md:py-24">
      <Container width="narrow" className="text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
          {eyebrow}
        </p>
        <p className="text-2xl font-medium text-ink text-balance md:text-3xl">
          {body}
        </p>
      </Container>
    </section>
  );
}
