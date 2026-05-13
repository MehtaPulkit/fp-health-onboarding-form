import { useFormContext, useWatch } from "react-hook-form";
import type { ReactNode } from "react";
import { Button } from "../../../components/ui/Button";
import {
  getHealthConditionById,
  getMembershipTierById,
  noHealthConditionId,
} from "../constants/data";
import type { OnboardingFormValuesInput } from "../schemas/onboardingSchema";
import { formatCurrency } from "../utils/formatters";

type ReviewStepProps = {
  onEditStep: (stepIndex: number) => void;
};

export function ReviewStep({ onEditStep }: ReviewStepProps) {
  const { control } = useFormContext<OnboardingFormValuesInput>();
  const values = useWatch({ control });
  const membership = getMembershipTierById(values.membershipId ?? "");
  const selectedConditions = (values.health?.conditionIds ?? [])
    .filter((conditionId) => conditionId !== noHealthConditionId)
    .map((conditionId) => getHealthConditionById(conditionId))
    .filter(Boolean);

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <ReviewSection title="Personal information" onEdit={() => onEditStep(0)}>
        <ReviewRow label="Name" value={`${values.personal?.firstName ?? ""} ${values.personal?.lastName ?? ""}`} />
        <ReviewRow label="Date of birth" value={values.personal?.dateOfBirth ?? ""} />
        <ReviewRow label="Phone" value={values.personal?.phone ?? ""} />
      </ReviewSection>

      <ReviewSection title="Address" onEdit={() => onEditStep(0)}>
        <ReviewRow label="Address line 1" value={values.address?.line1 ?? ""} />
        <ReviewRow label="Address line 2" value={values.address?.line2 ?? ""} />
        <ReviewRow
          label="Suburb/city"
          value={`${values.address?.city ?? ""}, ${values.address?.state ?? ""} ${values.address?.postcode ?? ""}`}
        />
        <ReviewRow label="Country" value={values.address?.country ?? ""} />
      </ReviewSection>

      <ReviewSection title="Emergency contact" onEdit={() => onEditStep(0)}>
        <ReviewRow
          label="Contact"
          value={
            values.emergencyContact?.name
              ? `${values.emergencyContact.name} (${values.emergencyContact.relationship})`
              : "Not provided"
          }
        />
        <ReviewRow label="Phone" value={values.emergencyContact?.phone ?? "-"} />
      </ReviewSection>

      <ReviewSection title="Membership" onEdit={() => onEditStep(1)}>
        <ReviewRow label="Plan" value={membership?.name ?? "Not selected"} />
        <ReviewRow
          label="Price"
          value={
            membership ? `${formatCurrency(membership.price)} / ${membership.billingPeriod}` : "-"
          }
        />
        <ReviewRow label="Access" value={membership?.accessHours ?? "-"} />
      </ReviewSection>

      <ReviewSection title="Health information" onEdit={() => onEditStep(2)}>
        <ReviewRow
          label="Conditions"
          value={
            selectedConditions.length > 0
              ? selectedConditions.map((condition) => condition?.name).join(", ")
              : "None selected"
          }
        />
        <ReviewRow label="Goals" value={values.health?.fitnessGoals ?? "-"} />
      </ReviewSection>

      <ReviewSection title="Account" onEdit={() => onEditStep(3)}>
        <ReviewRow label="Email" value={values.account?.email ?? ""} />
      </ReviewSection>
    </div>
  );
}

function ReviewSection({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: ReactNode;
  onEdit: () => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
      <dl className="space-y-3">{children}</dl>
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm leading-6 text-slate-800">{value || "-"}</dd>
    </div>
  );
}
