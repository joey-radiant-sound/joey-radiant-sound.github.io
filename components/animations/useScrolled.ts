"use client";

import { useEffect, useState } from "react";

/**
 * Returns true once the user has scrolled past `threshold` pixels. Used
 * by sub-site nav bars to toggle between transparent/top and
 * opaque/scrolled states.
 */
export function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
