"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { createProject, type CreateProjectState } from "./actions";

const STATUS_OPTIONS = [
  { value: "LEAD", label: "Lead" },
  { value: "BOOKED", label: "Booked" },
  { value: "PLANNING", label: "Planning" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELED", label: "Canceled" },
] as const;

const initial: CreateProjectState = { ok: false };

export function NewProjectForm() {
  const [state, formAction, pending] = useActionState(createProject, initial);
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <Input
        label="Title"
        name="title"
        required
        error={e.title}
        placeholder="e.g. Teagan & Isaac"
        autoFocus
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Event date"
          name="eventDate"
          type="date"
          error={e.eventDate}
          hint="Optional — set later if not booked yet"
        />
        <Select
          label="Status"
          name="status"
          options={STATUS_OPTIONS}
          error={e.status}
          defaultValue="LEAD"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Venue name" name="venueName" error={e.venueName} />
        <Input
          label="Venue city"
          name="venueCity"
          error={e.venueCity}
          placeholder="e.g. Buffalo, NY"
        />
      </div>
      <Input
        label="Guest count"
        name="guestCount"
        type="number"
        min={1}
        error={e.guestCount}
      />

      {!state.ok && state.message && (
        <p className="text-sm font-medium text-red-600" aria-live="polite">
          {state.message}
        </p>
      )}

      <div className="mt-2 flex gap-3">
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Creating…" : "Create project"}
        </Button>
        <Button href="/portal/admin" variant="ghost" size="md">
          Cancel
        </Button>
      </div>
    </form>
  );
}
