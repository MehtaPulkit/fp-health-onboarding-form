import { LoaderCircle } from "lucide-react";
import { clsx } from "clsx";

type SpinnerProps = {
  label?: string;
  className?: string;
};

export function Spinner({ label = "Loading", className }: SpinnerProps) {
  return (
    <span className={clsx("inline-flex items-center gap-2 text-sm text-slate-600", className)}>
      <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
      <span>{label}</span>
    </span>
  );
}
