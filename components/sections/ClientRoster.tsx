import { Container } from "@/components/ui/Container";
import { rosterFeatured, rosterGroups } from "@/lib/content/acappella";

/**
 * A cappella client roster — §3.3. Varsity Vocals is featured as a
 * prominent callout (per v2 "put this at the top"); institution-grouped
 * lists follow.
 *
 * Phase 1H: swap plain text for group logos once assets land.
 */
export function ClientRoster() {
  return (
    <section className="bg-ink py-24 text-white md:py-32">
      <Container>
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
          <p className="mb-5 text-base font-semibold uppercase tracking-[0.25em] text-brand-300 md:text-lg">
            Who we&rsquo;ve worked with
          </p>
          <h2 className="text-5xl font-semibold tracking-tight text-balance md:text-7xl">
            A decade of groups on our boards.
          </h2>
        </div>

        {/* Featured: Varsity Vocals / ICCAs */}
        <div
          className="mx-auto mb-14 max-w-3xl rounded-2xl p-8 text-center text-white ring-1 ring-white/10 md:p-12"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--color-brand-700) 0%, var(--color-brand-900) 100%)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
            {rosterFeatured.note}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            {rosterFeatured.name}
          </p>
        </div>

        {/* Institution-grouped roster */}
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
          {rosterGroups.map((g) => (
            <div key={g.institution}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-300">
                {g.institution}
              </h3>
              <ul className="space-y-2 text-base text-white/85">
                {g.groups.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
