"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  /** Image paths to cycle through. First image renders with priority. */
  images: readonly string[];
  /** ms between transitions. Default 6000. */
  intervalMs?: number;
  /** ms duration of the cross-fade. Default 1500. */
  fadeMs?: number;
};

/**
 * Auto-cycling background slideshow with cross-fades. Renders all
 * images stacked absolutely and toggles opacity. Pauses entirely on
 * `prefers-reduced-motion: reduce` (just shows the first image).
 *
 * Used as the backdrop layer of a hero — pair with a dark overlay +
 * foreground text in the parent.
 */
export function HeroSlideshow({
  images,
  intervalMs = 6000,
  fadeMs = 1500,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <div aria-hidden className="absolute inset-0">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className="object-cover"
          style={{
            opacity: i === index ? 1 : 0,
            transition: `opacity ${fadeMs}ms ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}
