import { AcappellaHero } from "@/components/sections/AcappellaHero";
import { ServicePillars } from "@/components/sections/ServicePillars";
import { ClientRoster } from "@/components/sections/ClientRoster";
import { WhyBookUs } from "@/components/sections/WhyBookUs";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { CallToAction } from "@/components/sections/CallToAction";
import { pillars, serviceArea } from "@/lib/content/acappella";

export default function AcappellaHome() {
  return (
    <>
      <AcappellaHero />

      <ServicePillars
        eyebrow="What we do"
        heading="Purpose-built for voices."
        pillars={pillars}
      />

      <ClientRoster />

      <WhyBookUs />

      <ServiceArea body={serviceArea.body} />

      <CallToAction
        eyebrow="Bring us your show"
        heading="Tell us about your next performance."
        body="Concerts, ICCAs, showcases, studio sessions — we've done them all."
        ctaLabel={serviceArea.ctaLabel}
        ctaHref={serviceArea.ctaHref}
      />
    </>
  );
}
