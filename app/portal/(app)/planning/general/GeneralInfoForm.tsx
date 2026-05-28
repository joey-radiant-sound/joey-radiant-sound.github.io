"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { saveGeneralInfo } from "./actions";
import { LINEN_COLORS } from "../_constants";
import { useAutoSave, AutoSaveStatus } from "../_autosave";

type Props = {
  projectId: string;
  initial: Record<string, unknown>;
};

// General Info data comes through as `Record<string, unknown>` (Prisma
// row serialized). Coerce any value to a string for use as defaultValue.
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
    <fieldset className="rounded-xl bg-brand-50 p-6 ring-1 ring-brand-200/60 md:p-8">
      <legend className="-mt-9 inline-block bg-brand-50 px-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
        {title}
      </legend>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function GeneralInfoForm({ projectId, initial: data }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const { status, trigger, flush } = useAutoSave(async () => {
    if (!formRef.current) return;
    return saveGeneralInfo({ ok: false }, new FormData(formRef.current));
  });

  return (
    <form
      ref={formRef}
      onChange={trigger}
      onBlur={flush}
      className="flex flex-col gap-8"
      noValidate
    >
      <input type="hidden" name="projectId" value={projectId} />
      <FieldGroup title="Event">
        <Input label="Wedding date" name="weddingDate" type="date" defaultValue={s(data.weddingDate)} />
        <Input label="Contact phone" name="contactPhone" type="tel" defaultValue={s(data.contactPhone)} />
        <Input label="Contact email" name="contactEmail" type="email" defaultValue={s(data.contactEmail)} />
        <Input label="Approximate guest count" name="guestCount" type="number" min={0} defaultValue={s(data.guestCount)} />
        <Input label="Earliest guest arrival" name="earliestArrival" placeholder="e.g. 4:00 PM" defaultValue={s(data.earliestArrival)} />
        <Input label="DJ setup arrival" name="djArrival" placeholder="e.g. 2:00 PM" defaultValue={s(data.djArrival)} />
        <Select label="Linen color for DJ table" name="linenColor" options={LINEN_COLORS} placeholder="—" defaultValue={s(data.linenColor)} />
      </FieldGroup>

      <FieldGroup title="Bride">
        <Input label="First name" name="brideFirstName" defaultValue={s(data.brideFirstName)} />
        <Input label="Last name" name="brideLastName" defaultValue={s(data.brideLastName)} />
      </FieldGroup>

      <FieldGroup title="Groom">
        <Input label="First name" name="groomFirstName" defaultValue={s(data.groomFirstName)} />
        <Input label="Last name" name="groomLastName" defaultValue={s(data.groomLastName)} />
      </FieldGroup>

      <FieldGroup title="Reception venue">
        <Input label="Name" name="receptionVenueName" defaultValue={s(data.receptionVenueName)} />
        <Input label="Address" name="receptionVenueAddress" autoComplete="street-address" defaultValue={s(data.receptionVenueAddress)} />
      </FieldGroup>

      <FieldGroup title="Ceremony venue">
        <Input label="Name" name="ceremonyVenueName" defaultValue={s(data.ceremonyVenueName)} />
        <Input label="Address" name="ceremonyVenueAddress" autoComplete="street-address" defaultValue={s(data.ceremonyVenueAddress)} />
      </FieldGroup>

      <FieldGroup title="Venue manager">
        <Input label="Name" name="venueManagerName" defaultValue={s(data.venueManagerName)} />
        <Input label="Phone" name="venueManagerPhone" type="tel" defaultValue={s(data.venueManagerPhone)} />
        <Input label="Email" name="venueManagerEmail" type="email" defaultValue={s(data.venueManagerEmail)} />
      </FieldGroup>

      <FieldGroup title="Photographer">
        <Input label="Name" name="photographerName" defaultValue={s(data.photographerName)} />
        <Input label="Email" name="photographerEmail" type="email" defaultValue={s(data.photographerEmail)} />
      </FieldGroup>

      <FieldGroup title="Videographer">
        <Input label="Name" name="videographerName" defaultValue={s(data.videographerName)} />
        <Input label="Email" name="videographerEmail" type="email" defaultValue={s(data.videographerEmail)} />
      </FieldGroup>

      <fieldset className="rounded-xl bg-brand-50 p-6 ring-1 ring-brand-200/60 md:p-8">
        <legend className="-mt-9 inline-block bg-brand-50 px-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
          Additional info
        </legend>
        <Textarea label="Anything else we should know" name="generalNotes" rows={5} defaultValue={s(data.generalNotes)} />
      </fieldset>

      <div className="sticky bottom-4 flex items-center gap-3 self-start rounded-full bg-white px-4 py-2 shadow-md ring-1 ring-black/5">
        <AutoSaveStatus status={status} />
        {status === "idle" && (
          <span className="text-xs text-muted">Changes save automatically</span>
        )}
      </div>
    </form>
  );
}
