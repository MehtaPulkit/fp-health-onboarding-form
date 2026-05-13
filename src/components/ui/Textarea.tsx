import { clsx } from "clsx";
import { forwardRef, type TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => (
    <textarea
      ref={ref}
      className={clsx(
        "min-h-28 w-full rounded-md border bg-white px-3 py-2 text-sm text-ink shadow-sm transition-colors",
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

Textarea.displayName = "Textarea";
