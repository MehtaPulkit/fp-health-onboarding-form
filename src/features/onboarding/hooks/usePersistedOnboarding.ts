import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  defaultOnboardingValues,
  type OnboardingFormValuesInput,
} from "../schemas/onboardingSchema";
import {
  clearPersistedProgress,
  loadPersistedProgress,
  savePersistedProgress,
} from "../utils/persistence";

export function usePersistedOnboarding(form: UseFormReturn<OnboardingFormValuesInput>) {
  const persistedProgress = useMemo(loadPersistedProgress, []);
  const [currentStep, setCurrentStepState] = useState(persistedProgress?.currentStep ?? 0);
  const hasHydrated = useRef(false);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);

  useEffect(() => {
    if (hasHydrated.current) {
      return;
    }

    if (persistedProgress) {
      form.reset(persistedProgress.values);
    } else {
      form.reset(defaultOnboardingValues);
    }

    hasHydrated.current = true;
  }, [form, persistedProgress]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!hasHydrated.current) {
        return;
      }

      try {
        savePersistedProgress(values as OnboardingFormValuesInput, currentStep);
        setPersistenceError(null);
      } catch (error) {
        setPersistenceError(error instanceof Error ? error.message : "Unable to save progress.");
      }
    });

    return () => subscription.unsubscribe();
  }, [currentStep, form]);

  const setCurrentStep = useCallback(
    (nextStep: number) => {
      setCurrentStepState(nextStep);

      try {
        savePersistedProgress(form.getValues(), nextStep);
        setPersistenceError(null);
      } catch (error) {
        setPersistenceError(error instanceof Error ? error.message : "Unable to save progress.");
      }
    },
    [form],
  );

  return {
    currentStep,
    setCurrentStep,
    persistenceError,
    clearProgress: clearPersistedProgress,
  };
}
