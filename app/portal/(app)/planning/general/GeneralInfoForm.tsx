"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { saveGeneralInfo, type GeneralState } from "./actions";
import { LINEN_COLORS } from "../_constants";

const initial: GeneralState = { ok: false };

type Props = {
  // Serialized WeddingDetails values from the server. Use `unknown`
  // to avoid pulling Prisma types into the client bundle.
  initial: Record<string, unknown>;
};

function s(v: unknown): string {
  return v == null ? "" : String(v);
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-xl bg-white p-6 ring-1 ring-black/5 md:p-8">
      <legend className="-mt-9 inline-block bg-white px-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
        {title}
      </legend>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function GeneralInfoForm({ initial: data }: Props) {
  const [state, formAction, pending] = useActionState(saveGeneralInfo, initial);

  return (
    <form action={formAction} className="flex flex-col gap-8" noValidate>
      <FieldGroup title="Event">
        <Input
          label="Wedding date"
          name="weddingDate"
          type="date"
          defaultValue={s(data.weddingDate)}
        />
        <Input
          label="Contact phone"
          name="contactPhone"
          type="tel"
          defaultValue={s(data.contactPhone)}
        />
        <Input
          label="Contact email"
          name="contactEmail"
          type="email"
          defaultValue={s(data.contactEmail)}
        />
        <Input
          label="Approximate guest count"
          name="guestCount"
          type="number"
          min={0}
          defaultValue={s(data.guestCount)}
        />
        <Input
          label="Earliest guest arrival"
          name="earliestArrival"
          placeholder="e.g. 4:00 PM"
          defaultValue={s(data.earliestArrival)}
        />
        <Input
          label="DJ setup arrival"
          name="djArrival"
          placeholder="e.g. 2:00 PM"
          defaultValue={s(data.djArrival)}
        />
        <Select
          label="Linen color for DJ table"
          name="linenColor"
          options={LINEN_COLORS}
          placeholder="—"
          defaultValue={s(data.linenColor)}
        />
      </FieldGroup>

      <FieldGroup title="Bride">
        <Input
          label="First name"
          name="brideFirstName"
          defaultValue={s(data.brideFirstName)}
        />
        <Input
          label="Last name"
          name="brideLastName"
          defaultValue={s(data.brideLastName)}
        />
      </FieldGroup>

      <FieldGroup title="Groom">
        <Input
          label="First name"
          name="groomFirstName"
          defaultValue={s(data.groomFirstName)}
        />
        <Input
          label="Last name"
          name="groomLastName"
          defaultValue={s(data.groomLastName)}
        />
      </FieldGroup>

      <FieldGroup title="Reception venue">
        <Input
          label="Name"
          name="receptionVenueName"
          defaultValue={s(data.receptionVenueName)}
        />
        <Input
          label="Address"
          name="receptionVenueAddress"
          autoComplete="street-address"
          defaultValue={s(data.receptionVenueAddress)}
        />
      </FieldGroup>

      <FieldGroup title="Ceremony venue">
        <Input
          label="Name"
          name="ceremonyVenueName"
          defaultValue={s(data.ceremonyVenueName)}
        />
        <Input
          label="Address"
          name="ceremonyVenueAddress"
          autoComplete="street-address"
          defaultValue={s(data.ceremonyVenueAddress)}
        />
      </FieldGroup>

      <FieldGroup title="Venue manager">
        <Input
          label="Name"
          name="venueManagerName"
          defaultValue={s(data.venueManagerName)}
        />
        <Input
          label="Phone"
          name="venueManagerPhone"
          type="tel"
          defaultValue={s(data.venueManagerPhone)}
        />
        <Input
          label="Email"
          name="venueManagerEmail"
          type="email"
          defaultValue={s(data.venueManagerEmail)}
        />
      </FieldGroup>

      <FieldGroup title="Photographer">
        <Input
          label="Name"
          name="photographerName"
          defaultValue={s(data.photographerName)}
        />
        <Input
          label="Email"
          name="photographerEmail"
          type="email"
          defaultValue={s(data.photographerEmail)}
        />
      </FieldGroup>

      <FieldGroup title="Videographer">
        <Input
          label="Name"
          name="videographerName"
          defaultValue={s(data.videographerName)}
        />
        <Input
          label="Email"
          name="videographerEmail"
          type="email"
          defaultValue={s(data.videographerEmail)}
        />
      </FieldGroup>

      <fieldset className="rounded-xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <legend className="-mt-9 inline-block bg-white px-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
          Additional info
        </legend>
        <Textarea
          label="Anything else we should know"
          name="generalNotes"
          rows={5}
          defaultValue={s(data.generalNotes)}
        />
      </fieldset>

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving…" : "Save General Info"}
        </Button>
        {state.ok && state.message && (
          <span className="text-sm font-medium text-brand-700">
            {state.message}
          </span>
        )}
        {!state.ok && state.message && (
          <span className="text-sm font-medium text-red-600">
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
