"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Debounced auto-save. Give it a `save` callback (which builds its own
 * FormData and calls a server action); call the returned `trigger` from
 * a form's `onChange`. The callback fires once input goes quiet for
 * `debounceMs`. `flush` saves immediately (use on blur / unmount).
 */
export function useAutoSave(save: () => Promise<unknown>, debounceMs = 1000) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep the latest `save` closure without re-creating `run`/`trigger`.
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  const run = useCallback(async () => {
    setStatus("saving");
    try {
      const r = await saveRef.current();
      const failed =
        r && typeof r === "object" && "ok" in r && (r as { ok: boolean }).ok === false;
      setStatus(failed ? "error" : "saved");
    } catch {
      setStatus("error");
    }
  }, []);

  const trigger = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setStatus("saving");
    timer.current = setTimeout(run, debounceMs);
  }, [run, debounceMs]);

  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    void run();
  }, [run]);

  return { status, trigger, flush };
}

/** Small inline indicator for an auto-saving form. */
export function AutoSaveStatus({ status }: { status: SaveStatus }) {
  const text =
    status === "saving"
      ? "Saving…"
      : status === "saved"
        ? "All changes saved"
        : status === "error"
          ? "Couldn't save — check your connection"
          : "";
  if (!text) return null;
  return (
    <span
      aria-live="polite"
      className={`text-xs font-medium ${
        status === "error" ? "text-red-600" : "text-muted"
      }`}
    >
      {text}
    </span>
  );
}
