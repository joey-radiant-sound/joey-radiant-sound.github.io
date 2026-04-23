type Option = { value: string; label: string };

type Props = {
  label: string;
  name: string;
  options: readonly Option[];
  required?: boolean;
  error?: string;
};

/**
 * Group of native <input type="checkbox"> sharing a name — submits as
 * multiple values under the same key. Pair with `formData.getAll(name)`
 * in the server action.
 */
export function CheckboxGroup({ label, name, options, required, error }: Props) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-brand-600">*</span>}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink transition-colors hover:border-brand-600/40 has-checked:border-brand-600 has-checked:bg-brand-50"
          >
            <input
              type="checkbox"
              name={name}
              value={o.value}
              className="h-4 w-4 rounded border-black/20 text-brand-600 focus:ring-brand-600"
            />
            {o.label}
          </label>
        ))}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
    </fieldset>
  );
}
