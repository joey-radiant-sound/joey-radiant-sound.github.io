import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type CallToActionProps = {
  eyebrow?: string;
  heading: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  /**
   * Optional 4 decorative images for the side margins (lg+ only).
   * Order: [topLeft, bottomLeft, topRight, bottomRight].
   */
  decorations?: readonly [string, string, string, string];
};

/**
 * Reusable CTA band used at the bottom of sub-site home pages. Drives
 * the user into the sub-site's contact form. When `decorations` is
 * provided, two stacked thumbnails appear in each side margin on
 * desktop (lg+); on smaller screens they hide so the copy stays
 * unobstructed.
 */
export function CallToAction({
  eyebrow,
  heading,
  body,
  ctaLabel,
  ctaHref,
  decorations,
}: CallToActionProps) {
  return (
    <section className="relative overflow-hidden bg-brand-900 py-20 text-white md:py-28">
      {decorations && (
        <>
          {/* Left margin column */}
          <div className="pointer-events-none absolute inset-y-10 left-6 hidden w-44 flex-col gap-6 lg:flex xl:w-56">
            <SideImage src={decorations[0]} rotate="-rotate-2" />
            <SideImage src={decorations[1]} rotate="rotate-3" />
          </div>
          {/* Right margin column */}
          <div className="pointer-events-none absolute inset-y-10 right-6 hidden w-44 flex-col gap-6 lg:flex xl:w-56">
            <SideImage src={decorations[2]} rotate="rotate-2" />
            <SideImage src={decorations[3]} rotate="-rotate-3" />
          </div>
        </>
      )}

      <Container width="narrow" className="relative text-center">
        {eyebrow && (
          <p className="mb-6 text-2xl font-bold uppercase tracking-[0.2em] text-brand-300 md:text-4xl">
            {eyebrow}
          </p>
        )}
        <h2 className="text-5xl font-semibold tracking-tight text-balance md:text-7xl">
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

function SideImage({ src, rotate }: { src: string; rotate: string }) {
  return (
    <div
      className={`relative h-1/2 w-full overflow-hidden rounded-xl ring-1 ring-white/15 shadow-2xl ${rotate}`}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 1280px) 224px, 176px"
        className="object-cover opacity-90"
      />
    </div>
  );
}
