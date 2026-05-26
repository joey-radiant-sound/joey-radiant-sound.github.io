/**
 * Tiny pure helpers shared by the planning-sheet client components.
 * No "use client" / no "server-only" — these are safe for both.
 */

/** Convert a nullable/undefined string to "" for use as a defaultValue. */
export function s(v: string | null | undefined): string {
  return v ?? "";
}

/** Map a tri-state boolean to a <Select> string value. */
export function boolToStr(v: boolean | null | undefined): string {
  if (v === true) return "true";
  if (v === false) return "false";
  return "";
}

/** Reverse of boolToStr — turn "true"/"false"/undefined into a tri-state bool. */
export function strToBool(v: string | undefined): boolean | null {
  if (v === "true") return true;
  if (v === "false") return false;
  return null;
}
