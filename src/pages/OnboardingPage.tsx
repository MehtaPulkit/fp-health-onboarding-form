import { AppShell } from "../components/layout/AppShell";
import { OnboardingFlow } from "../features/onboarding/components/OnboardingFlow";

export function OnboardingPage() {
  return (
    <AppShell>
      <OnboardingFlow />
    </AppShell>
  );
}
