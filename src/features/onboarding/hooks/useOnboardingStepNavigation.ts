import { useCallback, useState } from "react";
import type { FieldPath, UseFormReturn } from "react-hook-form";
import { ONBOARDING_STEPS, STEP_FIELD_PATHS } from "../constants/steps";
import type { OnboardingFormValuesInput } from "../schemas/onboardingSchema";

type UseOnboardingStepNavigationOptions = {
  currentStep: number;
  form: UseFormReturn<OnboardingFormValuesInput>;
  onBeforeNavigate?: () => void;
  onSubmit: () => Promise<void>;
  setCurrentStep: (stepIndex: number) => void;
};

export function useOnboardingStepNavigation({
  currentStep,
  form,
  onBeforeNavigate,
  onSubmit,
  setCurrentStep,
}: UseOnboardingStepNavigationOptions) {
  const [highestAvailableStep, setHighestAvailableStep] = useState(currentStep);
  const step = ONBOARDING_STEPS[currentStep];
  const progressLabel = `Step ${currentStep + 1} of ${ONBOARDING_STEPS.length}`;

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex <= highestAvailableStep) {
        onBeforeNavigate?.();
        setCurrentStep(stepIndex);
      }
    },
    [highestAvailableStep, onBeforeNavigate, setCurrentStep],
  );

  const handleNext = useCallback(async () => {
    onBeforeNavigate?.();

    if (step.id === "review") {
      await onSubmit();
      return;
    }

    const fieldsToValidate = STEP_FIELD_PATHS[step.id] as Array<
      FieldPath<OnboardingFormValuesInput>
    >;
    const isStepValid = await form.trigger(fieldsToValidate, {
      shouldFocus: true,
    });

    if (!isStepValid) {
      return;
    }

    const nextStep = Math.min(currentStep + 1, ONBOARDING_STEPS.length - 1);
    setHighestAvailableStep((highestStep) => Math.max(highestStep, nextStep));
    setCurrentStep(nextStep);
  }, [currentStep, form, onBeforeNavigate, onSubmit, setCurrentStep, step.id]);

  const handleBack = useCallback(() => {
    onBeforeNavigate?.();
    setCurrentStep(Math.max(currentStep - 1, 0));
  }, [currentStep, onBeforeNavigate, setCurrentStep]);

  return {
    goToStep,
    handleBack,
    handleNext,
    highestAvailableStep,
    progressLabel,
    step,
  };
}
