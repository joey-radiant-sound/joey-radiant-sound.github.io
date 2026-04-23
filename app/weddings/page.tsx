import { WeddingsHero } from "@/components/sections/WeddingsHero";
import { ServicePillars } from "@/components/sections/ServicePillars";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Testimonials } from "@/components/sections/Testimonials";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { CallToAction } from "@/components/sections/CallToAction";
import { pillars, serviceArea } from "@/lib/content/weddings";

export default function WeddingsHome() {
  return (
    <>
      <WeddingsHero />

      <ServicePillars
        eyebrow="What we offer"
        heading="Full-service wedding production."
        pillars={pillars}
      />

      <HowWeWork />

      <ProcessSteps />

      <Testimonials />

      <ServiceArea body={serviceArea.body} />

      <CallToAction
        eyebrow="Ready when you are"
        heading="Let's plan your wedding."
        body="Tell us your date, venue, and vibe — we'll take it from there."
        ctaLabel={serviceArea.ctaLabel}
        ctaHref={serviceArea.ctaHref}
      />
    </>
  );
}
