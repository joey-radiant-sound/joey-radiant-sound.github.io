"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** ms delay before the reveal transition starts */
  delay?: number;
  /** Distance (px) the element translates up from on reveal. Default 28. */
  distance?: number;
  /** HTML tag to render. Default "div". */
  as?: "div" | "section" | "article" | "li";
  className?: string;
};

/**
 * Fade + translate-up on first intersection. Uses IntersectionObserver +
 * CSS transitions — no GSAP required. Bails out instantly on
 * `prefers-reduced-motion: reduce` (renders fully visible).
 */
export function ScrollReveal({
  children,
  delay = 0,
  distance = 28,
  as: Tag = "div",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error — ref polymorphism over a constrained tag union is safe here.
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translate3d(0, 0, 0)" : `translate3d(0, ${distance}px, 0)`,
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: shown ? undefined : "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
