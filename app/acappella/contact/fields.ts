/**
 * Field option constants + shared form-state type for the a cappella
 * contact form. Kept in a plain module (not "use server") so it can be
 * imported by client components.
 */
export const ACAPPELLA_ROLES = [
  { value: "music_director", label: "Music Director" },
  { value: "business_manager", label: "Business Manager" },
  { value: "president", label: "President" },
  { value: "other", label: "Other" },
] as const;

export const ACAPPELLA_SERVICES = [
  { value: "live_sound", label: "Live sound" },
  { value: "lighting", label: "Lighting" },
  { value: "recording", label: "Recording (multitrack)" },
  { value: "video", label: "Video capture" },
  { value: "livestream", label: "Livestream" },
  { value: "album", label: "Album production" },
  { value: "other", label: "Other" },
] as const;

export type AcappellaFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<
    Record<
      | "firstName"
      | "lastName"
      | "email"
      | "role"
      | "groupName"
      | "institution"
      | "showDate"
      | "venue"
      | "expectedAttendance"
      | "services"
      | "message",
      string
    >
  >;
};
