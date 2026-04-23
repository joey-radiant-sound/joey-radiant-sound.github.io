import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { tagline } from "@/lib/content/acappella";

// TODO(1I): replace # hrefs with real social URLs once Joey provides them.
const socials = [
  { label: "YouTube", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "SoundCloud", href: "#" },
];

/**
 * A cappella sub-site footer. Pulls its tagline from lib/content/acappella.ts
 * once that lands in Phase 1E; inlined here for Phase 1B.
 */
export function AcappellaFooter() {
  return (
    <footer className="bg-ink py-16 text-brand-100">
      <Container>
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="max-w-md text-xl font-medium text-white text-balance">
              {tagline}
            </p>
            <p className="mt-4 text-sm text-brand-200/70">
              Radiant Sound · A Cappella
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
                  href="/acappella/contact"
                  className="transition-colors hover:text-white"
                >
                  Tell us about your show →
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
            <Link href="/weddings" className="transition-colors hover:text-white">
              Weddings site →
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
