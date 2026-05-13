import { clsx } from "clsx";
import { Check } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  description?: ReactNode;
  hasError?: boolean;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, hasError, id, ...props }, ref) => (
    <label
      className={clsx(
        "flex cursor-pointer gap-3 rounded-md border bg-white p-3 text-sm transition-colors ",
        hasError
          ? "border-coral-500 focus:border-coral-500"
          : "border-slate-200 hover:border-brand-500 focus:border-brand-500",
        className,
      )}
      htmlFor={id}
    >
      <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="peer h-5 w-5 appearance-none rounded border border-slate-400 bg-white checked:border-brand-500 checked:bg-brand-500"
          aria-invalid={hasError || undefined}
          {...props}
        />
        <Check
          aria-hidden="true"
          className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100"
        />
      </span>
      <span className="min-w-0">
        <span className="block font-medium text-ink">{label}</span>
        {description ? (
          <span className="mt-1 block text-slate-600">{description}</span>
        ) : null}
      </span>
    </label>
  ),
);

Checkbox.displayName = "Checkbox";
