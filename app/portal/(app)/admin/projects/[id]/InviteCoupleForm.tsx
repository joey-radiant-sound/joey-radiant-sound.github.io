"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { inviteCouple, type InviteCoupleState } from "./actions";

const initial: InviteCoupleState = { ok: false };

export function InviteCoupleForm({ projectId }: { projectId: string }) {
  const action = inviteCouple.bind(null, projectId);
  const [state, formAction, pending] = useActionState(action, initial);
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <Input
        label="Email"
        name="email"
        type="email"
        required
        error={e.email}
        autoComplete="email"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" name="firstName" required error={e.firstName} />
        <Input label="Last name" name="lastName" error={e.lastName} />
      </div>

      {state.ok ? (
        <p
          className="rounded-md bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700 ring-1 ring-brand-100"
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : state.message ? (
        <p className="text-sm font-medium text-red-600" aria-live="polite">
          {state.message}
        </p>
      ) : null}

      <div className="mt-1">
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Sending…" : "Send invite"}
        </Button>
      </div>
    </form>
  );
}
