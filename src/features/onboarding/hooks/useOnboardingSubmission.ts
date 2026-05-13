import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  onboardingFormSchema,
  type OnboardingFormValuesInput,
} from "../schemas/onboardingSchema";
import { submitOnboarding } from "../services/submitOnboarding";

type UseOnboardingSubmissionOptions = {
  form: UseFormReturn<OnboardingFormValuesInput>;
  clearProgress: () => void;
};

export function useOnboardingSubmission({
  form,
  clearProgress,
}: UseOnboardingSubmissionOptions) {
  const navigate = useNavigate();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearSubmissionError = useCallback(() => {
    setSubmissionError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const parsedValues = onboardingFormSchema.safeParse(form.getValues());

    if (!parsedValues.success) {
      await form.trigger(undefined, { shouldFocus: true });
      setSubmissionError(
        "Please resolve the highlighted fields before submitting.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const result = await submitOnboarding(parsedValues.data);
      clearProgress();
      navigate("/success", {
        replace: true,
        state: {
          email: parsedValues.data.account.email,
          membershipId: parsedValues.data.membershipId,
          submittedAt: result.submittedAt,
        },
      });
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your registration.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [clearProgress, form, navigate]);

  return {
    clearSubmissionError,
    handleSubmit,
    isSubmitting,
    submissionError,
  };
}
