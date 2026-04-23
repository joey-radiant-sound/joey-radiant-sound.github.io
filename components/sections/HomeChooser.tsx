"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Audience = "weddings" | "acappella";

type Panel = {
  audience: Audience;
  label: string;
  tagline: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
};

const panels: readonly Panel[] = [
  {
    audience: "weddings",
    label: "Weddings",
    tagline: "The night you'll want to replay forever.",
    cta: "Plan your wedding",
    href: "/weddings",
    image: "/images/weddings/first-dance-01.jpg",
    imageAlt: "First dance on a wedding reception floor",
  },
  {
    audience: "acappella",
    label: "A Cappella",
    tagline: "Production built for voices.",
    cta: "Book your show",
    href: "/acappella",
    image: "/images/acappella/stage-01.jpg",
    imageAlt: "A cappella group performing on a lit stage",
  },
] as const;

/**
 * Dual-path homepage chooser.
 *
 * Desktop: two panels side-by-side on a full-viewport gradient. Hovering a
 * panel brightens its image and dims the other. Clicking enters the
 * corresponding sub-site.
 *
 * Mobile: panels stack vertically; there is no hover, so both panels
 * always show their imagery. Tapping navigates.
 *
 * Honors prefers-reduced-motion globally via the guard in globals.css.
 * Future polish (Phase 1G): entrance animation for panels, and a Next.js
 * route-transition fade-to-sub-site effect.
 */
export function HomeChooser() {
  const [hovered, setHovered] = useState<Audience | null>(null);

  return (
    <main
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--color-gradient-start) 0%, var(--color-gradient-mid) 55%, var(--color-gradient-end) 100%)",
      }}
    >
      {/* Center brand wordmark */}
      <div className="pointer-events-none absolute inset-x-0 top-8 z-20 flex justify-center md:top-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
          Radiant Sound
        </p>
      </div>

      {/* Panels */}
      <div className="relative grid min-h-screen grid-cols-1 md:grid-cols-2">
        {panels.map((panel) => {
          const isActive = hovered === panel.audience;
          const isOther = hovered !== null && hovered !== panel.audience;

          return (
            <Link
              key={panel.audience}
              href={panel.href}
              onMouseEnter={() => setHovered(panel.audience)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(panel.audience)}
              onBlur={() => setHovered(null)}
              className="group relative flex min-h-[50vh] items-end overflow-hidden p-8 transition-opacity duration-500 md:min-h-screen md:p-14 focus:outline-none"
              aria-label={`${panel.label} — ${panel.tagline}`}
              style={{
                opacity: isOther ? 0.55 : 1,
              }}
            >
              {/* Panel image — visible on mobile always, revealed on hover
                  on desktop via opacity transition. */}
              <div
                className="absolute inset-0 transition-[opacity,transform] duration-700 ease-out md:opacity-0 md:scale-[1.02] md:group-hover:opacity-100 md:group-hover:scale-100 md:group-focus-visible:opacity-100 md:group-focus-visible:scale-100"
                style={{ opacity: isActive ? 1 : undefined }}
                aria-hidden
              >
                <Image
                  src={panel.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Dark gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/20" />
              </div>

              {/* Thin divider between panels on desktop */}
              <div
                className="pointer-events-none absolute right-0 top-0 hidden h-full w-px bg-white/10 md:block"
                aria-hidden
              />

              {/* Panel content */}
              <div className="relative z-10 max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  {panel.audience === "weddings" ? "For couples" : "For groups"}
                </p>
                <h2 className="mt-4 text-5xl font-semibold tracking-tight text-balance md:text-7xl">
                  {panel.label}
                </h2>
                <p className="mt-4 max-w-sm text-base text-white/80 md:text-lg">
                  {panel.tagline}
                </p>
                <p className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-transform duration-300 group-hover:translate-x-1">
                  {panel.cta}
                  <span aria-hidden>→</span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile-only horizontal divider between stacked panels */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-white/10 md:hidden"
        aria-hidden
      />
    </main>
  );
}
