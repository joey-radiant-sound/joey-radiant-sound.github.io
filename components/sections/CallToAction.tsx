import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type CallToActionProps = {
  eyebrow?: string;
  heading: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
};

/**
 * Reusable CTA band used at the bottom of sub-site home pages and other
 * long-scroll pages. Drives the user into the sub-site's contact form.
 */
export function CallToAction({
  eyebrow,
  heading,
  body,
  ctaLabel,
  ctaHref,
}: CallToActionProps) {
  return (
    <section className="bg-brand-900 py-20 text-white md:py-28">
      <Container width="narrow" className="text-center">
        {eyebrow && (
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-brand-300">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-5xl">
          {heading}
        </h2>
        {body && (
          <p className="mx-auto mt-5 max-w-xl text-base text-brand-100 md:text-lg">
            {body}
          </p>
        )}
        <div className="mt-8">
          <Button href={ctaHref} size="lg">
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
