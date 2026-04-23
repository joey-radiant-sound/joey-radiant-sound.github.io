import { WeddingsHero } from "@/components/sections/WeddingsHero";
import { ServicePillars } from "@/components/sections/ServicePillars";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Testimonials } from "@/components/sections/Testimonials";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { CallToAction } from "@/components/sections/CallToAction";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { pillars, serviceArea } from "@/lib/content/weddings";

export default function WeddingsHome() {
  return (
    <>
      <WeddingsHero />

      <ScrollReveal>
        <ServicePillars
          eyebrow="What we offer"
          heading="Full-service wedding production."
          pillars={pillars}
        />
      </ScrollReveal>

      <ScrollReveal>
        <HowWeWork />
      </ScrollReveal>

      <ScrollReveal>
        <ProcessSteps />
      </ScrollReveal>

      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>

      <ScrollReveal>
        <ServiceArea body={serviceArea.body} />
      </ScrollReveal>

      <ScrollReveal>
        <CallToAction
          eyebrow="Ready when you are"
          heading="Let's plan your wedding."
          body="Tell us your date, venue, and vibe — we'll take it from there."
          ctaLabel={serviceArea.ctaLabel}
          ctaHref={serviceArea.ctaHref}
        />
      </ScrollReveal>
    </>
  );
}
