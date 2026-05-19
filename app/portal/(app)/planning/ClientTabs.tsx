"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/portal/planning/general", label: "General Info" },
  { href: "/portal/planning/party", label: "Wedding Party" },
  { href: "/portal/planning/events", label: "Events & Music" },
  { href: "/portal/planning/ceremony", label: "Ceremony" },
  { href: "/portal/planning/line-dances", label: "Line Dances" },
  { href: "/portal/planning/itinerary", label: "Itinerary" },
] as const;

export function ClientTabs() {
  const pathname = usePathname() ?? "";
  return (
    <nav className="mt-8 -mx-2 overflow-x-auto">
      <ul className="flex min-w-max items-center gap-1 border-b border-black/10 px-2">
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`inline-block whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-brand-600 text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
