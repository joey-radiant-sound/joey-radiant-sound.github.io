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
    <section className="bg-surface-alt py-24 md:py-32">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
            Who we&rsquo;ve worked with
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink text-balance md:text-5xl">
            A decade of groups on our boards.
          </h2>
        </div>

        {/* Featured: Varsity Vocals / ICCAs */}
        <div className="mx-auto mb-14 max-w-3xl rounded-2xl bg-ink p-8 text-center text-white md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-300">
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
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-600">
                {g.institution}
              </h3>
              <ul className="space-y-2 text-base text-ink-soft">
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
