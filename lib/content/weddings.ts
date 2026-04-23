/**
 * Typed copy for the Weddings sub-site.
 *
 * Source-of-truth for all weddings-side text. Components import from here
 * and stay presentation-only. When copy changes, edit CONTENT.md first,
 * then sync here.
 */

// §7 Taglines — locked pick [A]
export const tagline = "The night you'll want to replay forever.";

// §2.1 Hero
export const hero = {
  eyebrow: "Radiant Sound · Weddings",
  headline: tagline,
  subhead:
    "Full-service DJ, sound, and lighting for the one night you'll replay for the rest of your life.",
  ctaLabel: "Get a quote",
  ctaHref: "/weddings/contact",
} as const;

// §2.2 What we offer — three pillars
export const pillars = [
  {
    title: "DJ + MC",
    body:
      "Curated sets that read the room. We learn your playlist, your do-not-plays, and play right into your vibe.",
  },
  {
    title: "Sound reinforcement",
    body:
      "Professional audio for ceremonies, cocktail hours, and receptions — indoor or outdoor, any size room. Wireless handhelds for toasts and officiants, and the right amount of sound for your dance floor.",
  },
  {
    title: "Lighting design",
    body:
      "Uplighting, dance-floor party lighting, and cold-spark effects on request. Built to your venue, customized to your taste.",
  },
] as const;

// §2.3 How we work — three principles
export const principles = [
  {
    title: "Meticulous organization.",
    body:
      "Your wedding day is a collection of unique moments, and every detail matters. We've refined a comprehensive planning spreadsheet over every wedding we've played. We ask the right questions, nothing gets overlooked, and your day runs the way you pictured it.",
  },
  {
    title: "Musical expertise.",
    body:
      "Sharing our love of music is core to who we are. We've developed eclectic tastes across every genre and invest serious hours curating each reception — a tasteful blend of nostalgia and contemporary that keeps every generation of your guests on the floor.",
  },
  {
    title: "Unparalleled professionalism.",
    body:
      "Exceptional service sits at the heart of what we do. We make ourselves available around the clock to answer questions, offer recommendations, and guide you through the process. Your peace of mind is our top priority.",
  },
] as const;

// §2.4 Our simple four-step process
export const processSteps = [
  {
    title: "Initial consultation.",
    body:
      "We connect and dive into your vision. We'll walk you through our comprehensive planning sheet and make sure we capture every nuance of your big day.",
  },
  {
    title: "Planning period.",
    body:
      "As your wedding details come together, you'll fill out the planning spreadsheet with music requests, reception events, and general ideas. We're a text away the whole time — ready to assist, recommend, and guide you through the process.",
  },
  {
    title: "Pre-wedding consultation.",
    body:
      "We finalize every detail of the reception together. Your dedicated DJ then crafts a personalized playlist for your review, and we coordinate with your venue and vendors so everyone shows up on the same page.",
  },
  {
    title: "The big day.",
    body:
      "It's finally here. We arrive early with one thing in mind: helping create the greatest night of your lives. We play at peak performance and make sure your reception is talked about for years to come.",
  },
] as const;

// §2.5 Testimonials (WeddingWire-sourced, curated on-site)
export const testimonials = [
  {
    headline: "Professionalism, flexibility — Joey brings the party!",
    body:
      "My husband and I were so pleased with Radiant Sound! And our guests absolutely loved the dancing. Joey was excellent to work with — super responsive, understood our vision, and was incredibly flexible given our unique venue limitations. The playlists he curated were spot on, and his mixing kept the party going well into the evening. We were also super impressed by the amount of equipment provided — it really leveled up the space for such an affordable price. If we could do it all over again, Radiant Sound would still be our choice.",
    attribution: "Teagan & Isaac",
  },
  {
    headline: "Even Grandma was on the dance floor!",
    body:
      "In our wedding experiences, DJs have been good at best — most were fine, but had one or more noticeable flaws. They were either too loud, too talkative, or had weird song choices. Joey was the first fantastic DJ we ever experienced. He played tasteful songs at the perfect volume (a healthy mix of our requests and his choices), didn't play any unusual versions of songs, and maintained a professional presence that everyone respected — without making the wedding about him. And yes, he even got Grandma dancing. Most guests stayed the whole night just to dance to his music. I would highly recommend Radiant Sound to anyone looking for a straightforward, no-nonsense, affordable DJ.",
    attribution: "Michael & Anna",
  },
  {
    headline: "Your #1 wedding DJ",
    body:
      "Can not recommend Joey from Radiant Sound enough. From the start of the process to the wedding date, he was responsive and helpful. You are making a mistake if you pass up on the opportunity to work with him.",
    attribution: "Patrick & Tiffany",
  },
] as const;

export const weddingWireUrl =
  "https://www.weddingwire.com/reviews/radiant-sound/28eae179691bbe53.html";

// §2.6 Service area + CTA
export const serviceArea = {
  body: "Based in Western New York. Available for weddings throughout NY, PA, and OH.",
  ctaLabel: "Start a conversation",
  ctaHref: "/weddings/contact",
} as const;
