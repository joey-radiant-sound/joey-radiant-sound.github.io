import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { tagline } from "@/lib/content/weddings";

// TODO(1I): replace # hrefs with real social URLs once Joey provides them.
const socials = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "The Knot", href: "#" },
  { label: "WeddingWire", href: "#" },
];

/**
 * Wedding sub-site footer. Pulls its tagline from lib/content/weddings.ts
 * once that lands in Phase 1D; inlined here for Phase 1B.
 */
export function WeddingsFooter() {
  return (
    <footer className="bg-ink py-16 text-brand-100">
      <Container>
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="max-w-md text-xl font-medium text-white text-balance">
              {tagline}
            </p>
            <p className="mt-4 text-sm text-brand-200/70">
              Radiant Sound · Weddings
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-300">
              Contact
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:joey@radiantsoundwny.com"
                  className="transition-colors hover:text-white"
                >
                  joey@radiantsoundwny.com
                </a>
              </li>
              <li>
                <Link
                  href="/weddings/contact"
                  className="transition-colors hover:text-white"
                >
                  Get a quote →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-300">
              Follow
            </p>
            <ul className="space-y-2 text-sm">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="transition-colors hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-brand-200/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Radiant Sound, LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/acappella" className="transition-colors hover:text-white">
              A Cappella site →
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
