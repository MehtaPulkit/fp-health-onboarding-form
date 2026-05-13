import { type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { clsx } from "clsx";

type AlertVariant = "info" | "warning" | "success" | "error";

type AlertProps = {
  title: string;
  children?: ReactNode;
  variant?: AlertVariant;
  className?: string;
};

const variantClasses: Record<AlertVariant, string> = {
  info: "border-brand-100 bg-brand-50 text-brand-700",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-coral-500 bg-coral-50 text-coral-600",
};

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: AlertTriangle,
};

export function Alert({ title, children, variant = "info", className }: AlertProps) {
  const Icon = icons[variant];

  return (
    <div
      className={clsx("rounded-md border p-4", variantClasses[variant], className)}
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
    >
      <div className="flex gap-3">
        <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">{title}</p>
          {children ? <div className="mt-1 text-sm leading-6">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
