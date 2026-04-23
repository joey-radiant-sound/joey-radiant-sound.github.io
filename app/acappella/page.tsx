import { AcappellaHero } from "@/components/sections/AcappellaHero";
import { ServicePillars } from "@/components/sections/ServicePillars";
import { ClientRoster } from "@/components/sections/ClientRoster";
import { WhyBookUs } from "@/components/sections/WhyBookUs";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { CallToAction } from "@/components/sections/CallToAction";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { pillars, serviceArea } from "@/lib/content/acappella";

export default function AcappellaHome() {
  return (
    <>
      <AcappellaHero />

      <ScrollReveal>
        <ServicePillars
          eyebrow="What we do"
          heading="Purpose-built for voices."
          pillars={pillars}
        />
      </ScrollReveal>

      <ScrollReveal>
        <ClientRoster />
      </ScrollReveal>

      <ScrollReveal>
        <WhyBookUs />
      </ScrollReveal>

      <ScrollReveal>
        <ServiceArea body={serviceArea.body} />
      </ScrollReveal>

      <ScrollReveal>
        <CallToAction
          eyebrow="Bring us your show"
          heading="Tell us about your next performance."
          body="Concerts, ICCAs, showcases, studio sessions — we've done them all."
          ctaLabel={serviceArea.ctaLabel}
          ctaHref={serviceArea.ctaHref}
        />
      </ScrollReveal>
    </>
  );
}
