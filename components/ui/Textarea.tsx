import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  error?: string;
};

export function Textarea({
  label,
  name,
  error,
  required,
  rows = 5,
  className,
  ...rest
}: Props) {
  const describedBy = error ? `${name}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-brand-600">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-base text-ink shadow-sm outline-none transition-colors placeholder:text-muted/60 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 ${className ?? ""}`}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
