import { clsx } from "clsx";
import { CheckCircle2, Clock } from "lucide-react";
import type { MembershipTier } from "../types/onboarding";
import { formatCurrency } from "../utils/formatters";

type MembershipCardProps = {
  tier: MembershipTier;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function MembershipCard({
  tier,
  selected,
  onSelect,
}: MembershipCardProps) {
  return (
    <label
      className={clsx(
        "relative flex h-full cursor-pointer flex-col rounded-lg border bg-white p-5 shadow-sm transition",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500",
        selected
          ? "border-brand-500 ring-2 ring-brand-100"
          : "border-slate-200 hover:border-brand-500",
      )}
    >
      <input
        type="radio"
        name="membershipId"
        value={tier.id}
        checked={selected}
        onChange={() => onSelect(tier.id)}
        className="sr-only"
        aria-label={`Select ${tier.name}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-ink">{tier.name}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <Clock aria-hidden="true" className="h-4 w-4" />
            {tier.accessHours}
          </p>
        </div>
        {tier.popular ? (
          <span className="rounded-full bg-coral-50 px-3 py-1 text-xs font-bold text-coral-800">
            Popular
          </span>
        ) : null}
      </div>

      <p className="mt-5 text-3xl font-bold text-ink">
        {formatCurrency(tier.price)}
        <span className="text-sm font-medium text-slate-600">
          {" "}
          / {tier.billingPeriod}
        </span>
      </p>

      <ul className="mt-5 flex flex-1 flex-col gap-3 text-sm text-slate-700">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <span
        className={clsx(
          "mt-5 inline-flex h-10 items-center justify-center rounded-md border text-sm font-semibold",
          selected
            ? "border-brand-500 bg-brand-500 text-white"
            : "border-slate-300 text-slate-700",
        )}
      >
        {selected ? "Selected" : "Select plan"}
      </span>
    </label>
  );
}
