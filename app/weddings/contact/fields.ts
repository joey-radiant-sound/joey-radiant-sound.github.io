/**
 * Field option constants + shared form-state type for the weddings
 * contact form. Kept in a plain module (not "use server") so it can be
 * imported by client components.
 */
export const WEDDINGS_SERVICES = [
  { value: "reception", label: "Reception" },
  { value: "ceremony", label: "Ceremony" },
  { value: "uplighting", label: "Uplighting" },
  { value: "cold_sparks", label: "Cold Sparks" },
  { value: "other", label: "Other (Please List Below)" },
] as const;

export type WeddingsFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<
    Record<
      | "firstName"
      | "lastName"
      | "partnerFirstName"
      | "partnerLastName"
      | "email"
      | "weddingDate"
      | "guestCount"
      | "venue"
      | "venueAddress"
      | "services"
      | "referral"
      | "message",
      string
    >
  >;
};
