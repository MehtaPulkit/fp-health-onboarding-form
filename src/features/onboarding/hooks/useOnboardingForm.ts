import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  defaultOnboardingValues,
  onboardingFormSchema,
  type OnboardingFormValuesInput,
} from "../schemas/onboardingSchema";

export function useOnboardingForm() {
  return useForm<OnboardingFormValuesInput>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: defaultOnboardingValues,
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });
}
