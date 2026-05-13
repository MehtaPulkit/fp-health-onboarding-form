import { login } from "../../../lib/auth";
import { AUTH_TOKEN_STORAGE_KEY } from "../constants/storage";
import type { OnboardingFormValues } from "../types/onboarding";

export type SubmissionResult = {
  token: string;
  submittedAt: string;
};

export async function submitOnboarding(values: OnboardingFormValues): Promise<SubmissionResult> {
  const { token } = await login(values.account.email, values.account.password);
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);

  return {
    token,
    submittedAt: new Date().toISOString(),
  };
}
