import { z } from "zod";
import { readJsonFromStorage, removeFromStorage, writeJsonToStorage } from "../../../lib/storage";
import { ONBOARDING_STORAGE_KEY } from "../constants/storage";
import {
  defaultOnboardingValues,
  type OnboardingFormValuesInput,
} from "../schemas/onboardingSchema";
import type { PersistedOnboardingProgress } from "../types/onboarding";

type OnboardingDraftValues = {
  personal?: Partial<OnboardingFormValuesInput["personal"]>;
  address?: Partial<OnboardingFormValuesInput["address"]>;
  emergencyContact?: Partial<OnboardingFormValuesInput["emergencyContact"]>;
  membershipId?: string;
};

type PersistedProgressDraft = {
  version: 1;
  currentStep: number;
  values: OnboardingDraftValues;
};

const draftValuesSchema = z.object({
  personal: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      dateOfBirth: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  address: z
    .object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postcode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().optional(),
      relationship: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  membershipId: z.string().optional(),
});

const persistedProgressSchema = z.object({
  version: z.literal(1),
  currentStep: z.number().int().min(0).max(4),
  values: draftValuesSchema,
});

function isPersistedProgressDraft(value: unknown): value is PersistedProgressDraft {
  return persistedProgressSchema.safeParse(value).success;
}

export function loadPersistedProgress(): PersistedOnboardingProgress | null {
  const draft = readJsonFromStorage(ONBOARDING_STORAGE_KEY, isPersistedProgressDraft);

  if (!draft) {
    return null;
  }

  return {
    version: 1,
    currentStep: getSafeRestoredStep(draft.currentStep),
    values: mergeWithDefaults(draft.values),
  };
}

export function savePersistedProgress(
  values: OnboardingFormValuesInput,
  currentStep: number,
): void {
  writeJsonToStorage(ONBOARDING_STORAGE_KEY, {
    version: 1,
    currentStep: getSafePersistedStep(currentStep),
    values: sanitizeDraftValues(values),
  });
}

export function clearPersistedProgress(): void {
  removeFromStorage(ONBOARDING_STORAGE_KEY);
}

function mergeWithDefaults(values: OnboardingDraftValues): OnboardingFormValuesInput {
  return {
    ...defaultOnboardingValues,
    ...values,
    personal: {
      ...defaultOnboardingValues.personal,
      ...values.personal,
    },
    account: {
      ...defaultOnboardingValues.account,
    },
    address: {
      ...defaultOnboardingValues.address,
      ...values.address,
    },
    emergencyContact: {
      ...defaultOnboardingValues.emergencyContact,
      ...values.emergencyContact,
    },
    health: {
      ...defaultOnboardingValues.health,
    },
  };
}

function sanitizeDraftValues(values: OnboardingFormValuesInput): OnboardingDraftValues {
  return {
    personal: {
      firstName: values.personal.firstName,
      lastName: values.personal.lastName,
      dateOfBirth: values.personal.dateOfBirth,
      phone: values.personal.phone,
    },
    address: {
      line1: values.address.line1,
      line2: values.address.line2,
      city: values.address.city,
      state: values.address.state,
      postcode: values.address.postcode,
      country: values.address.country,
    },
    emergencyContact: {
      name: values.emergencyContact.name,
      relationship: values.emergencyContact.relationship,
      phone: values.emergencyContact.phone,
    },
    membershipId: values.membershipId,
  };
}
// We only persist non-sensitive fields that are relevant to the first few steps, to allow users to safely resume if they accidentally close the tab or navigate away mid-way. We avoid persisting account credentials and detailed health information, and we also prevent resuming directly to those later steps since they are closer to submission and may contain more sensitive data.
function getSafePersistedStep(currentStep: number): number {
  return Math.min(Math.max(currentStep, 0), 2);
}
// We allow restoring up to the membership step, but not health, account or review, since those may contain more sensitive information and are closer to submission.
function getSafeRestoredStep(currentStep: number): number {
  return Math.min(Math.max(currentStep, 0), 2);
}
