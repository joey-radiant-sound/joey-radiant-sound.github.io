/**
 * Field option constants + shared form-state type for the weddings
 * contact form. Kept in a plain module (not "use server") so it can be
 * imported by client components.
 */
export const WEDDINGS_SERVICES = [
  { value: "dj", label: "DJ" },
  { value: "ceremony_audio", label: "Ceremony audio" },
  { value: "reception_sound", label: "Reception sound" },
  { value: "uplighting", label: "Uplighting" },
  { value: "cold_sparks", label: "Cold-spark effects" },
  { value: "other", label: "Other" },
] as const;

export type WeddingsFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<
    Record<
      | "firstName"
      | "lastName"
      | "email"
      | "partnerName"
      | "weddingDate"
      | "venue"
      | "guestCount"
      | "services"
      | "referral"
      | "message",
      string
    >
  >;
};
