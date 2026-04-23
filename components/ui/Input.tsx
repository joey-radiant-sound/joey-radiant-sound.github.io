import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
  hint?: string;
};

/**
 * Labeled text input. Accepts any native <input> type (text/email/date/number/…).
 * Error messages render inline below the field; linked via aria-describedby.
 */
export function Input({
  label,
  name,
  error,
  hint,
  required,
  className,
  ...rest
}: Props) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-brand-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-base text-ink shadow-sm outline-none transition-colors placeholder:text-muted/60 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 ${className ?? ""}`}
        {...rest}
      />
      {hint && !error && (
        <p id={`${name}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
