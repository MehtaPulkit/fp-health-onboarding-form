import type { z } from "zod";
import type {
  onboardingFormSchema,
  OnboardingFormValuesInput,
} from "../schemas/onboardingSchema";

export type MembershipTier = {
  id: string;
  name: string;
  price: number;
  billingPeriod: "month" | "year" | string;
  features: string[];
  accessHours: string;
  popular?: boolean;
};

export type HealthCondition = {
  id: string;
  name: string;
  category: string;
  requiresMedicalClearance: boolean;
};

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export type PersistedOnboardingProgress = {
  version: 1;
  currentStep: number;
  values: OnboardingFormValuesInput;
};
