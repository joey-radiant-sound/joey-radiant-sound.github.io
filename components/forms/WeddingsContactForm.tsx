"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { Button } from "@/components/ui/Button";
import { submitWeddingsContact } from "@/app/weddings/contact/actions";
import {
  WEDDINGS_SERVICES,
  type WeddingsFormState,
} from "@/app/weddings/contact/fields";

const initialState: WeddingsFormState = { ok: false };

export function WeddingsContactForm() {
  const [state, formAction, pending] = useActionState(
    submitWeddingsContact,
    initialState,
  );

  if (state.ok && state.message) {
    return (
      <div className="rounded-xl border border-brand-600/30 bg-brand-50 p-6 text-center">
        <p className="text-lg font-medium text-ink">Thanks — message received.</p>
        <p className="mt-2 text-base text-ink-soft">{state.message}</p>
      </div>
    );
  }

  const e = state.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {/* Honeypot — visually hidden but present in the DOM for bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company (leave blank)
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Row 1: your name */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="First name" name="firstName" required error={e.firstName} autoComplete="given-name" />
        <Input label="Last name" name="lastName" required error={e.lastName} autoComplete="family-name" />
      </div>

      {/* Row 2: partner's name */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Partner's first name" name="partnerFirstName" error={e.partnerFirstName} />
        <Input label="Partner's last name" name="partnerLastName" error={e.partnerLastName} />
      </div>

      <Input label="Email" name="email" type="email" required error={e.email} autoComplete="email" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Wedding date" name="weddingDate" type="date" required error={e.weddingDate} />
        <Input label="Approximate guest count" name="guestCount" type="number" min={1} required error={e.guestCount} />
      </div>

      <Input label="Venue" name="venue" required error={e.venue} placeholder="e.g. The Statler Hotel" />

      {/* Browser-native street-address autofill. Joey can wire Google Places later
          for a true searchable dropdown — needs an API key. */}
      <Input
        label="Venue address"
        name="venueAddress"
        error={e.venueAddress}
        autoComplete="street-address"
        placeholder="Start typing to autofill"
      />

      <CheckboxGroup
        label="Services needed"
        name="services"
        options={WEDDINGS_SERVICES}
        required
        error={e.services}
      />

      <Input label="How did you hear about us?" name="referral" error={e.referral} />
      <Textarea label="Anything else we should know?" name="message" rows={5} error={e.message} />

      {!state.ok && state.message && (
        <p className="text-sm font-medium text-red-600" aria-live="polite">
          {state.message}
        </p>
      )}

      <div className="mt-4 flex justify-center">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}
