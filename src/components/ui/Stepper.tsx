import { clsx } from "clsx";
import { Check, Menu, X } from "lucide-react";
import { useState } from "react";
import type { ONBOARDING_STEPS } from "../../features/onboarding/constants/steps";

type StepperProps = {
  steps: typeof ONBOARDING_STEPS;
  currentStep: number;
  highestAvailableStep: number;
  onStepSelect: (stepIndex: number) => void;
};

export function Stepper({
  steps,
  currentStep,
  highestAvailableStep,
  onStepSelect,
}: StepperProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const currentStage = steps[currentStep];
  const CurrentIcon = currentStage.icon;

  function handleStepSelect(stepIndex: number) {
    onStepSelect(stepIndex);
    setIsMobileOpen(false);
  }

  return (
    <nav aria-label="Onboarding progress" className="w-full">
      <div className="rounded-lg border border-brand-100 bg-white p-3 shadow-sm sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
              <CurrentIcon aria-hidden="true" className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-700">
                Step {currentStep + 1} of {steps.length}
              </p>
              <p className="truncate text-sm font-semibold text-ink">
                {currentStage.label}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:border-brand-500 hover:bg-brand-50"
            aria-controls="mobile-stepper-stages"
            aria-expanded={isMobileOpen}
            aria-label={
              isMobileOpen ? "Hide onboarding stages" : "Show onboarding stages"
            }
            onClick={() => setIsMobileOpen((open) => !open)}
          >
            {isMobileOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>

        {isMobileOpen ? (
          <ol id="mobile-stepper-stages" className="mt-3 grid gap-2">
            {steps.map((step, index) => (
              <StepButton
                key={step.id}
                step={step}
                index={index}
                currentStep={currentStep}
                highestAvailableStep={highestAvailableStep}
                onStepSelect={handleStepSelect}
              />
            ))}
          </ol>
        ) : null}
      </div>

      <ol className="hidden gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => {
          return (
            <StepButton
              key={step.id}
              step={step}
              index={index}
              currentStep={currentStep}
              highestAvailableStep={highestAvailableStep}
              onStepSelect={onStepSelect}
            />
          );
        })}
      </ol>
    </nav>
  );
}

type StepButtonProps = {
  step: (typeof ONBOARDING_STEPS)[number];
  index: number;
  currentStep: number;
  highestAvailableStep: number;
  onStepSelect: (stepIndex: number) => void;
};

function StepButton({
  step,
  index,
  currentStep,
  highestAvailableStep,
  onStepSelect,
}: StepButtonProps) {
  const isCurrent = index === currentStep;
  const isComplete = index < currentStep;
  const isAvailable = index <= highestAvailableStep;
  const Icon = step.icon;

  return (
    <li>
      <button
        type="button"
        className={clsx(
          "flex h-full w-full items-center gap-3 rounded-md border p-3 text-left transition-colors",
          isCurrent
            ? "border-brand-500 bg-brand-50 text-brand-700"
            : "border-slate-200 bg-white text-slate-700",
          isAvailable
            ? "hover:border-brand-500"
            : "cursor-not-allowed opacity-55",
        )}
        aria-current={isCurrent ? "step" : undefined}
        disabled={!isAvailable}
        onClick={() => onStepSelect(index)}
      >
        <span
          className={clsx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            isCurrent || isComplete
              ? "bg-brand-500 text-white"
              : "bg-slate-100",
          )}
        >
          {isComplete ? (
            <Check aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Icon aria-hidden="true" className="h-4 w-4" />
          )}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{step.label}</span>
          <span className="block text-xs text-slate-600">
            {step.description}
          </span>
        </span>
      </button>
    </li>
  );
}
