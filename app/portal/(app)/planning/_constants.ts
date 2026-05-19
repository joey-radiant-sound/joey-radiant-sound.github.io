/**
 * Pure constants for the planning sheet. Importable by client AND
 * server. Server-only helpers (auth checks, Prisma seeds) live in
 * _server.ts.
 */

export const DEFAULT_EVENT_ANNOUNCEMENTS = [
  {
    eventKey: "FIRST_DANCE",
    label: "Bride and Groom First Dance",
    announcement:
      "Ladies and gentlemen, it is my honor to introduce to you, ______________, for their first dance together tonight.",
  },
  {
    eventKey: "MOTHER_SON",
    label: "Mother/Son First Dance",
    announcement:
      "And now, let's welcome ________ for her first dance with her newly married son.",
  },
  {
    eventKey: "FATHER_DAUGHTER",
    label: "Father/Daughter First Dance",
    announcement: "Let's welcome out ______ for a dance with his daughter.",
  },
  { eventKey: "CAKE", label: "Cake Cutting", announcement: "" },
  { eventKey: "BOUQUET", label: "Bouquet Toss", announcement: "" },
  { eventKey: "GARTER", label: "Garter Toss", announcement: "" },
] as const;

export const EVENT_LABEL_BY_KEY: Record<string, string> = Object.fromEntries(
  DEFAULT_EVENT_ANNOUNCEMENTS.map((e) => [e.eventKey, e.label]),
);

export const DEFAULT_CEREMONY_SEGMENTS = [
  {
    segment: "PRE_CEREMONY",
    label: "Pre-Ceremony Music",
    defaultNote: "Default is a Vitamin String Quartet Mix",
  },
  { segment: "PROCESSIONAL", label: "Processional", defaultNote: "" },
  { segment: "BRIDAL_ENTRY", label: "Bridal Entry", defaultNote: "" },
  { segment: "RECESSIONAL", label: "Recessional", defaultNote: "" },
] as const;

export const CEREMONY_SEGMENT_LABEL: Record<string, string> = Object.fromEntries(
  DEFAULT_CEREMONY_SEGMENTS.map((s) => [s.segment, s.label]),
);

export const DEFAULT_LINE_DANCES = [
  "Cupid Shuffle",
  "Cha-Cha Slide",
  "Cotton Eyed Joe",
  "Macarena",
  "Y.M.C.A",
  "Gangnam Style",
  "The Hustle",
  "Wobble",
  "Chicken Dance",
  "Crank That (Soulja Boy)",
  "Teach Me How to Dougie",
  "The Twist",
  "The Electric Slide",
  "Shout Song",
] as const;

export const DEFAULT_ITINERARY_TIMES: readonly string[] = (() => {
  const times: string[] = [];
  for (let h = 9; h <= 23; h++) {
    for (const m of [0, 30]) {
      const hour12 = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      const minute = m === 0 ? "00" : "30";
      times.push(`${hour12}:${minute} ${ampm}`);
    }
  }
  times.push("12:00 AM");
  return times;
})();

export const PLAYLIST_TYPES = {
  COCKTAIL_DINNER: "Cocktail / Dinner Playlist",
  RECEPTION_PLAYLIST: "Reception Playlist",
  DO_NOT_PLAY: "Do NOT Play",
} as const;

export const LINEN_COLORS = [
  { value: "BLACK", label: "Black" },
  { value: "WHITE", label: "White" },
] as const;
