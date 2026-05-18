"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { requestMagicLink, type SignInState } from "./actions";

const initial: SignInState = { ok: false };

export function SignInForm({ initialError }: { initialError?: string }) {
  const [state, formAction, pending] = useActionState(
    requestMagicLink,
    initialError ? { ok: false, message: errorMessage(initialError) } : initial,
  );

  if (state.ok) {
    return (
      <div className="rounded-xl border border-brand-600/30 bg-brand-50 p-6 text-center">
        <p className="text-lg font-medium text-ink">Check your email.</p>
        <p className="mt-2 text-base text-ink-soft">
          We sent a sign-in link to your inbox. It expires in 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        autoFocus
        error={state.errors?.email}
      />
      {state.message && !state.errors && (
        <p className="text-sm font-medium text-red-600" aria-live="polite">
          {state.message}
        </p>
      )}
      <div className="flex justify-center">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending…" : "Send sign-in link"}
        </Button>
      </div>
    </form>
  );
}

function errorMessage(code: string): string {
  // Auth.js surfaces ?error=… on the configured error page. Map the
  // common codes to friendlier copy.
  switch (code) {
    case "Verification":
      return "That sign-in link has expired or already been used. Request a new one below.";
    case "AccessDenied":
      return "That email isn't on Joey's invite list. Reach out at joey@radiantsoundwny.com if you think this is a mistake.";
    case "Configuration":
      return "Sign-in is temporarily unavailable. Try again in a moment.";
    default:
      return "Something went wrong. Try again.";
  }
}
