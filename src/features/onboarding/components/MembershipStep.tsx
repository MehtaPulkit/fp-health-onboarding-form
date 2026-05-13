import { Controller, useFormContext } from "react-hook-form";
import { Alert } from "../../../components/ui/Alert";
import { membershipTiers } from "../constants/data";
import type { OnboardingFormValuesInput } from "../schemas/onboardingSchema";
import { MembershipCard } from "./MembershipCard";

export function MembershipStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<OnboardingFormValuesInput>();

  return (
    <div className="space-y-4">
      {errors.membershipId?.message ? (
        <Alert title="Membership required" variant="error">
          {errors.membershipId.message}
        </Alert>
      ) : null}

      <Controller
        control={control}
        name="membershipId"
        render={({ field }) => (
          <fieldset>
            <legend className="sr-only">Membership plans</legend>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {membershipTiers.map((tier) => (
                <MembershipCard
                  key={tier.id}
                  tier={tier}
                  selected={field.value === tier.id}
                  onSelect={(id) => field.onChange(id)}
                />
              ))}
            </div>
          </fieldset>
        )}
      />
    </div>
  );
}
