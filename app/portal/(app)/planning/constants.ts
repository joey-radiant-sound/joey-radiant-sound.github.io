/**
 * Field-option constants shared between server actions and forms for
 * the planning sheet. Kept separate from `actions.ts` (which uses
 * "use server" and may only export async functions).
 */

export const MUSIC_CATEGORIES = [
  { value: "PROCESSIONAL", label: "Processional" },
  { value: "RECESSIONAL", label: "Recessional" },
  { value: "FIRST_DANCE", label: "First dance" },
  { value: "PARENT_DANCE", label: "Parent dance" },
  { value: "MUST_PLAY", label: "Must play" },
  { value: "DO_NOT_PLAY", label: "Do NOT play" },
  { value: "OTHER", label: "Other" },
] as const;

export const VENDOR_ROLES = [
  { value: "PHOTOGRAPHER", label: "Photographer" },
  { value: "VIDEOGRAPHER", label: "Videographer" },
  { value: "PLANNER", label: "Planner" },
  { value: "VENUE_COORDINATOR", label: "Venue coordinator" },
  { value: "OFFICIANT", label: "Officiant" },
  { value: "CATERER", label: "Caterer" },
  { value: "FLORIST", label: "Florist" },
  { value: "OTHER", label: "Other" },
] as const;

export const EQUIPMENT_CATEGORIES = [
  { value: "POWER", label: "Power" },
  { value: "LOAD_IN", label: "Load-in" },
  { value: "CEREMONY_LOCATION", label: "Ceremony location" },
  { value: "RECEPTION_LOCATION", label: "Reception location" },
  { value: "WEATHER_PLAN", label: "Weather plan" },
  { value: "OTHER", label: "Other" },
] as const;

export type FormState = {
  ok: boolean;
  message?: string;
};
