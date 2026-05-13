import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  defaultOnboardingValues,
  type OnboardingFormValuesInput,
} from "../schemas/onboardingSchema";

const warningMessage =
  "You may lose some onboarding data. For privacy, account setup and health information are not saved.";

export function useOnboardingUnloadWarning(
  form: UseFormReturn<OnboardingFormValuesInput>,
  isSubmitting: boolean,
) {
  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = warningMessage;
      return warningMessage;
    }

    function syncBeforeUnload(values: OnboardingFormValuesInput) {
      if (isSubmitting || !hasStartedOnboarding(values)) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        return;
      }

      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    syncBeforeUnload(form.getValues());
    const subscription = form.watch((values) => {
      syncBeforeUnload(values as OnboardingFormValuesInput);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [form, isSubmitting]);
}

function hasStartedOnboarding(values: OnboardingFormValuesInput): boolean {
  return Boolean(
    values.personal.firstName.trim() ||
      values.personal.lastName.trim() ||
      values.personal.dateOfBirth.trim() ||
      values.personal.phone.trim() ||
      values.address.line1.trim() ||
      values.address.line2?.trim() ||
      values.address.city.trim() ||
      values.address.state.trim() ||
      values.address.postcode.trim() ||
      values.address.country.trim() !== defaultOnboardingValues.address.country ||
      values.emergencyContact.name.trim() ||
      values.emergencyContact.relationship.trim() ||
      values.emergencyContact.phone.trim() ||
      values.membershipId.trim() ||
      (values.health.conditionIds?.length ?? 0) > 0 ||
      values.health.fitnessGoals.trim() ||
      values.health.waiverAccepted ||
      values.health.medicalClearanceAcknowledged ||
      values.account.email.trim() ||
      values.account.password ||
      values.account.confirmPassword,
  );
}
