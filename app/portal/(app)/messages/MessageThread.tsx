"use client";

import { useActionState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { postMessage, type MessageState } from "./actions";

export type MessageRow = {
  id: string;
  body: string;
  createdAt: string; // ISO
  authorName: string | null;
  isMine: boolean;
};

const initial: MessageState = { ok: false };

/**
 * Per-project message thread. Same component drives the couple page
 * (/portal/messages) and the admin panel on the project detail page.
 * No real-time — posting revalidates the route.
 */
export function MessageThread({
  projectId,
  messages,
}: {
  projectId: string;
  messages: MessageRow[];
}) {
  const action = postMessage.bind(null, projectId);
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <div className="flex flex-col gap-5">
      {messages.length === 0 ? (
        <p className="rounded-md border border-dashed border-black/15 px-4 py-3 text-sm text-muted">
          No messages yet. Say hello 👋
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`max-w-[85%] rounded-2xl px-4 py-3 ring-1 ${
                m.isMine
                  ? "self-end bg-brand-500 text-white ring-brand-600/20"
                  : "self-start bg-white text-ink ring-black/5"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{m.body}</p>
              <p
                className={`mt-1 text-xs ${
                  m.isMine ? "text-white/70" : "text-muted"
                }`}
              >
                {m.authorName ?? "—"} · {formatWhen(m.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="flex flex-col gap-3">
        <Textarea label="Message" name="body" rows={3} required />
        <div className="flex items-center gap-4">
          <Button type="submit" size="md" disabled={pending}>
            {pending ? "Sending…" : "Send"}
          </Button>
          {!state.ok && state.message && (
            <span className="text-sm font-medium text-red-600">
              {state.message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
