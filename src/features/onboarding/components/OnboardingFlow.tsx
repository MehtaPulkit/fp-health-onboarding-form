import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { lazy, Suspense, useMemo } from "react";
import { FormProvider } from "react-hook-form";
import { BrandLogo } from "../../../components/layout/BrandLogo";
import { Alert } from "../../../components/ui/Alert";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Spinner } from "../../../components/ui/Spinner";
import { Stepper } from "../../../components/ui/Stepper";
import { ONBOARDING_STEPS } from "../constants/steps";
import { useOnboardingForm } from "../hooks/useOnboardingForm";
import { useOnboardingStepNavigation } from "../hooks/useOnboardingStepNavigation";
import { useOnboardingSubmission } from "../hooks/useOnboardingSubmission";
import { useOnboardingUnloadWarning } from "../hooks/useOnboardingUnloadWarning";
import { usePersistedOnboarding } from "../hooks/usePersistedOnboarding";
import { useStepFocus } from "../hooks/useStepFocus";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { StepHeading } from "./StepHeading";

const MembershipStep = lazy(() =>
  import("./MembershipStep").then((module) => ({
    default: module.MembershipStep,
  })),
);
const HealthStep = lazy(() =>
  import("./HealthStep").then((module) => ({ default: module.HealthStep })),
);
const AccountSetupStep = lazy(() =>
  import("./AccountSetupStep").then((module) => ({
    default: module.AccountSetupStep,
  })),
);
const ReviewStep = lazy(() =>
  import("./ReviewStep").then((module) => ({ default: module.ReviewStep })),
);

export function OnboardingFlow() {
  const form = useOnboardingForm();
  const { currentStep, setCurrentStep, persistenceError, clearProgress } =
    usePersistedOnboarding(form);
  const {
    clearSubmissionError,
    handleSubmit,
    isSubmitting,
    submissionError,
  } = useOnboardingSubmission({ clearProgress, form });
  const {
    goToStep,
    handleBack,
    handleNext,
    highestAvailableStep,
    progressLabel,
    step,
  } = useOnboardingStepNavigation({
    currentStep,
    form,
    onBeforeNavigate: clearSubmissionError,
    onSubmit: handleSubmit,
    setCurrentStep,
  });
  const headingRef = useStepFocus(currentStep);

  useOnboardingUnloadWarning(form, isSubmitting);

  const stepContent = useMemo(() => {
    switch (step.id) {
      case "personal":
        return <PersonalInfoStep />;
      case "membership":
        return (
          <Suspense fallback={<StepFallback />}>
            <MembershipStep />
          </Suspense>
        );
      case "health":
        return (
          <Suspense fallback={<StepFallback />}>
            <HealthStep />
          </Suspense>
        );
      case "account":
        return (
          <Suspense fallback={<StepFallback />}>
            <AccountSetupStep />
          </Suspense>
        );
      case "review":
        return (
          <Suspense fallback={<StepFallback />}>
            <ReviewStep onEditStep={goToStep} />
          </Suspense>
        );
      default:
        return null;
    }
  }, [goToStep, step.id]);

  return (
    <FormProvider {...form}>
      <div className="flex flex-1 flex-col gap-6">
        <header className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <BrandLogo className="h-14" />
            <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
              Join the fitness revolution
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Complete your profile and health declaration to finalize your
              membership.
            </p>
          </div>
        </header>

        <Stepper
          steps={ONBOARDING_STEPS}
          currentStep={currentStep}
          highestAvailableStep={highestAvailableStep}
          onStepSelect={goToStep}
        />

        {persistenceError ? (
          <Alert title="Progress could not be saved" variant="error">
            {persistenceError}
          </Alert>
        ) : null}

        {submissionError ? (
          <Alert title="Submission problem" variant="error">
            {submissionError}
          </Alert>
        ) : null}

        <Card className="flex-1 p-5 sm:p-7">
          <form
            className="flex min-h-[520px] flex-col gap-7"
            onSubmit={(event) => {
              event.preventDefault();
              void handleNext();
            }}
            noValidate
          >
            <StepHeading
              eyebrow={progressLabel}
              title={step.label}
              description={getStepDescription(step.id)}
              headingRef={headingRef}
            />

            <div className="flex-1">{stepContent}</div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Back
              </Button>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Button type="submit" isLoading={isSubmitting}>
                  {step.id === "review" ? "Submit registration" : "Continue"}
                  {step.id !== "review" ? (
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  ) : null}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        <div className="sr-only" aria-live="polite">
          {progressLabel}: {step.label}
          {isSubmitting ? ". Submitting registration." : ""}
        </div>

        {form.formState.isSubmitted &&
        Object.keys(form.formState.errors).length > 0 ? (
          <div className="sr-only" role="alert">
            <AlertCircle aria-hidden="true" />
            Please review the highlighted form fields.
          </div>
        ) : null}
      </div>
    </FormProvider>
  );
}

function StepFallback() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <Spinner label="Loading step" />
    </div>
  );
}

function getStepDescription(stepId: string): string {
  switch (stepId) {
    case "personal":
      return "Complete your profile by adding your contact details and emergency information.";
    case "membership":
      return "Choose the plan that best fits your training rhythm.";
    case "health":
      return "Share health considerations and goals so the team can onboard you safely.";
    case "account":
      return "Create secure credentials for your Fitness Passport account.";
    case "review":
      return "Check your details before we create your account.";
    default:
      return "";
  }
}
