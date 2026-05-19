import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
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
    <footer
      className="py-16 text-white"
      style={{
        backgroundImage: "url('/images/shared/brand-gradient.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="max-w-md text-xl font-medium text-white text-balance">
              {tagline}
            </p>
            <p className="mt-4 text-sm text-white/75">
              Radiant Sound · A Cappella
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/85">
              Contact
            </p>
            <Button href="/acappella/contact" variant="secondary" size="md">
              Contact
            </Button>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/85">
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

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/20 pt-6 text-xs text-white/70 md:flex-row md:items-center">
          <p>
            ©{" "}
            <span suppressHydrationWarning>
              {new Date().getFullYear()}
            </span>{" "}
            Radiant Sound, LLC. All rights reserved.
          </p>
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
