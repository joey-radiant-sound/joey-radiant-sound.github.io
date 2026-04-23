"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { Button } from "@/components/ui/Button";
import { submitAcappellaContact } from "@/app/acappella/contact/actions";
import {
  ACAPPELLA_ROLES,
  ACAPPELLA_SERVICES,
  type AcappellaFormState,
} from "@/app/acappella/contact/fields";

const initialState: AcappellaFormState = { ok: false };

export function AcappellaContactForm() {
  const [state, formAction, pending] = useActionState(
    submitAcappellaContact,
    initialState,
  );

  if (state.ok && state.message) {
    return (
      <div className="rounded-xl border border-brand-600/30 bg-brand-50 p-6">
        <p className="text-lg font-medium text-ink">Thanks — message received.</p>
        <p className="mt-2 text-base text-ink-soft">{state.message}</p>
      </div>
    );
  }

  const e = state.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company (leave blank)
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="First name" name="firstName" required error={e.firstName} autoComplete="given-name" />
        <Input label="Last name" name="lastName" required error={e.lastName} autoComplete="family-name" />
      </div>

      <Input label="Email" name="email" type="email" required error={e.email} autoComplete="email" />

      <Select
        label="Your role in the group"
        name="role"
        options={ACAPPELLA_ROLES}
        required
        error={e.role}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Group name" name="groupName" required error={e.groupName} />
        <Input label="School / organization" name="institution" required error={e.institution} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Show date" name="showDate" type="date" required error={e.showDate} />
        <Input label="Expected attendance" name="expectedAttendance" type="number" min={0} error={e.expectedAttendance} />
      </div>

      <Input label="Venue (name + city/state)" name="venue" required error={e.venue} />

      <CheckboxGroup
        label="Services needed"
        name="services"
        options={ACAPPELLA_SERVICES}
        required
        error={e.services}
      />

      <Textarea label="Anything else we should know?" name="message" rows={5} error={e.message} />

      {!state.ok && state.message && (
        <p className="text-sm font-medium text-red-600" aria-live="polite">
          {state.message}
        </p>
      )}

      <div className="mt-2">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}
