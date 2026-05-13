import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import {
  defaultOnboardingValues,
  type OnboardingFormValuesInput,
} from "../schemas/onboardingSchema";
import { useOnboardingUnloadWarning } from "./useOnboardingUnloadWarning";

function dispatchBeforeUnload() {
  const event = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(event);
  return event;
}

function TestHarness({ isSubmitting = false }: { isSubmitting?: boolean }) {
  const form = useForm<OnboardingFormValuesInput>({
    defaultValues: defaultOnboardingValues,
  });

  useOnboardingUnloadWarning(form, isSubmitting);

  return (
    <button
      type="button"
      onClick={() => {
        form.setValue("personal.firstName", "Sam", { shouldDirty: true });
      }}
    >
      Start draft
    </button>
  );
}

describe("useOnboardingUnloadWarning", () => {
  it("does not warn before the onboarding flow has started", () => {
    render(<TestHarness />);

    expect(dispatchBeforeUnload().defaultPrevented).toBe(false);
  });

  it("warns once the onboarding flow has draft values", async () => {
    const user = userEvent.setup();
    render(<TestHarness />);

    await user.click(screen.getByRole("button", { name: /start draft/i }));

    await waitFor(() => {
      expect(dispatchBeforeUnload().defaultPrevented).toBe(true);
    });
  });

  it("does not warn while the onboarding flow is submitting", async () => {
    const user = userEvent.setup();
    render(<TestHarness isSubmitting />);

    await user.click(screen.getByRole("button", { name: /start draft/i }));

    expect(dispatchBeforeUnload().defaultPrevented).toBe(false);
  });
});
