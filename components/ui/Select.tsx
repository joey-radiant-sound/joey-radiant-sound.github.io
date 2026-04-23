import type { SelectHTMLAttributes } from "react";

type Option = { value: string; label: string };

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string;
  name: string;
  options: readonly Option[];
  error?: string;
  placeholder?: string;
};

export function Select({
  label,
  name,
  options,
  error,
  placeholder = "Select one…",
  required,
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
      <select
        id={name}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        defaultValue=""
        className={`rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-base text-ink shadow-sm outline-none transition-colors focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 ${className ?? ""}`}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
