import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "h-11 w-full rounded-md border bg-white px-3 text-sm text-ink shadow-sm transition-colors",
        "placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100",
        hasError
          ? "border-coral-500 focus:border-coral-500 focus-visible:outline-coral-500/40"
          : "border-slate-300 focus:border-brand-500",
        className,
      )}
      aria-invalid={hasError || undefined}
      {...props}
    />
  ),
);

Input.displayName = "Input";
