import { type ReactNode } from "react";
import { clsx } from "clsx";

type FormFieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
  hint?: string;
  className?: string;
};

export function FormField({ id, label, children, error, hint, className }: FormFieldProps) {
  const descriptionId = hint && !error ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={clsx("space-y-1.5", className)}>
      <label className="block text-sm font-semibold text-ink" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-sm text-slate-600" id={descriptionId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm font-medium text-coral-600" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
