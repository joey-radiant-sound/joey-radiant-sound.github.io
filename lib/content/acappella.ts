/**
 * Typed copy for the A Cappella sub-site.
 *
 * Source-of-truth for all a cappella-side text. Components import from
 * here and stay presentation-only.
 */

// §7 Taglines — locked pick [B]
export const tagline = "Production built for voices.";

// §3.1 Hero
export const hero = {
  eyebrow: "Radiant Sound · A Cappella",
  headline: tagline,
  subhead:
    "Professional live sound, lighting, and recording for a cappella groups.",
  body: "Radiant Sound specializes in live sound, lighting, recording, and post-production for a cappella groups. We combine purpose-built equipment with over a decade of a cappella-specific experience to deliver the sound, the show, and the record exactly how you want it to land.",
  ctaLabel: "Book your show",
  ctaHref: "/acappella/contact",
} as const;

// §3.2 What we do — three pillars
export const pillars = [
  {
    title: "Live sound.",
    body:
      "Full PA, custom monitoring, and up to 18 wireless microphones tuned specifically for a cappella. A seasoned a cappella engineer runs every show — someone who knows how to bring out the best in your group's sound, from VP clarity to soloist body to ensemble blend.",
  },
  {
    title: "Lighting.",
    body:
      "Show lighting designed around your set — washes, moving heads, and backlighting programmed to your music. Our goal is to accentuate your creative vision, never distract from it.",
  },
  {
    title: "Video + streaming.",
    body:
      "Multi-cam capture, multitrack recording, and full post-production (on request) — so your biggest show lives on long after the final chord.",
  },
] as const;

// §3.3 Roster — Varsity Vocals featured per v2 comment; rest grouped by
// institution.
export const rosterFeatured = {
  name: "Varsity Vocals",
  note: "ICCAs",
} as const;

export const rosterGroups = [
  {
    institution: "Cornell University",
    groups: [
      "Absolute A Cappella",
      "Class Notes",
      "Hearsay Acappella",
      "Key Elements",
      "Less Than Three",
      "Men of Last Call",
      "Nothing But Treble",
      "Tarana",
      "The CallbaXX A Cappella",
      "The Touchtones",
    ],
  },
  {
    institution: "University at Buffalo",
    groups: ["The Buffalo Chips", "The Enchords"],
  },
  {
    institution: "University of Rochester",
    groups: ["Midnight Ramblers", "Trebellious"],
  },
] as const;

// §3.4 Why groups keep booking us
export const whyBookUs = [
  {
    title: "We speak your language.",
    body:
      "Solo cues, group blend, VP, choreo — we're already thinking in the same terms you are.",
  },
  {
    title: "We're consistent.",
    body:
      "Many of our groups have worked with the same team year after year.",
  },
  {
    title: "We're flexible.",
    body:
      "Whether it's a 150-seat blackbox or a 1,500-seat theater, we scale to the room.",
  },
] as const;

// §3.5 Service area + CTA
export const serviceArea = {
  body: "We travel across the United States and internationally.",
  ctaLabel: "Tell us about your show",
  ctaHref: "/acappella/contact",
} as const;
