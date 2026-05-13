import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Alert } from "../../../components/ui/Alert";
import { Checkbox } from "../../../components/ui/Checkbox";
import { FormField } from "../../../components/ui/FormField";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import {
  groupHealthConditionsByCategory,
  noHealthConditionId,
  requiresMedicalClearance,
} from "../constants/data";
import type { OnboardingFormValuesInput } from "../schemas/onboardingSchema";
import { formatCategoryLabel } from "../utils/formatters";

export function HealthStep() {
  const [query, setQuery] = useState("");
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<OnboardingFormValuesInput>();
  const selectedConditionIds =
    useWatch({ control, name: "health.conditionIds" }) ?? [];
  const clearanceRequired = requiresMedicalClearance(selectedConditionIds);

  const groupedConditions = useMemo(
    () => groupHealthConditionsByCategory(),
    [],
  );
  const normalizedQuery = query.trim().toLowerCase();

  function handleConditionToggle(conditionId: string, checked: boolean) {
    const currentIds = selectedConditionIds ?? [];

    if (conditionId === noHealthConditionId) {
      setValue("health.conditionIds", checked ? [noHealthConditionId] : [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("health.medicalClearanceAcknowledged", false, {
        shouldDirty: true,
      });
      return;
    }

    const nextIds = checked
      ? [...currentIds.filter((id) => id !== noHealthConditionId), conditionId]
      : currentIds.filter((id) => id !== conditionId);

    setValue("health.conditionIds", nextIds, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (!requiresMedicalClearance(nextIds)) {
      setValue("health.medicalClearanceAcknowledged", false, {
        shouldDirty: true,
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <FormField
          id="healthSearch"
          label="Health conditions"
          hint="Select all that apply. Use search to narrow the list."
          error={errors.health?.conditionIds?.message}
        >
          <Input
            id="healthSearch"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conditions"
            aria-describedby={
              errors.health?.conditionIds
                ? "healthSearch-error"
                : "healthSearch-hint"
            }
            hasError={Boolean(errors.health?.conditionIds)}
          />
        </FormField>

        <div className="grid gap-4 lg:grid-cols-2">
          {Object.entries(groupedConditions).map(([category, conditions]) => {
            const matchingConditions = conditions.filter((condition) =>
              condition.name.toLowerCase().includes(normalizedQuery),
            );

            if (matchingConditions.length === 0) {
              return null;
            }

            return (
              <fieldset
                key={category}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <legend className="px-1 text-sm font-bold text-ink">
                  {formatCategoryLabel(category)}
                </legend>
                <div className="mt-3 grid gap-2">
                  {matchingConditions.map((condition) => (
                    <Checkbox
                      key={condition.id}
                      id={`condition-${condition.id}`}
                      label={condition.name}
                      description={
                        condition.requiresMedicalClearance
                          ? "May require medical clearance before training."
                          : undefined
                      }
                      checked={selectedConditionIds.includes(condition.id)}
                      onChange={(event) =>
                        handleConditionToggle(
                          condition.id,
                          event.currentTarget.checked,
                        )
                      }
                    />
                  ))}
                </div>
              </fieldset>
            );
          })}
        </div>
      </div>

      {clearanceRequired ? (
        <Alert title="Medical clearance may be required" variant="warning">
          One or more selected conditions may need review before your first
          session. A team member will confirm next steps after registration.
        </Alert>
      ) : null}

      <FormField
        id="fitnessGoals"
        label="Fitness goals"
        hint="A short note helps the team prepare the right onboarding conversation."
        error={errors.health?.fitnessGoals?.message}
      >
        <Textarea
          id="fitnessGoals"
          placeholder="Example: Build strength, improve energy, and return to running safely."
          hasError={Boolean(errors.health?.fitnessGoals)}
          aria-describedby={
            errors.health?.fitnessGoals
              ? "fitnessGoals-error"
              : "fitnessGoals-hint"
          }
          {...register("health.fitnessGoals")}
        />
      </FormField>

      <div className="space-y-3">
        <Checkbox
          id="waiverAccepted"
          label="I acknowledge the gym participation waiver."
          description="I understand exercise involves inherent risk and I am responsible for training within my limits."
          hasError={Boolean(errors.health?.waiverAccepted)}
          {...register("health.waiverAccepted")}
        />
        {errors.health?.waiverAccepted?.message ? (
          <p className="text-sm font-medium text-coral-600" role="alert">
            {errors.health.waiverAccepted.message}
          </p>
        ) : null}

        {clearanceRequired ? (
          <>
            <Checkbox
              id="medicalClearanceAcknowledged"
              label="I understand medical clearance may be required before training."
              description="Fitness Passport may request clearance from a qualified health professional before activating access."
              hasError={Boolean(errors.health?.medicalClearanceAcknowledged)}
              {...register("health.medicalClearanceAcknowledged")}
            />
            {errors.health?.medicalClearanceAcknowledged?.message ? (
              <p className="text-sm font-medium text-coral-600" role="alert">
                {errors.health.medicalClearanceAcknowledged.message}
              </p>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
