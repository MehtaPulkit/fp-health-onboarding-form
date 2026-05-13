import { beforeEach, describe, expect, it } from "vitest";
import { ONBOARDING_STORAGE_KEY } from "../constants/storage";
import { defaultOnboardingValues } from "../schemas/onboardingSchema";
import {
  clearPersistedProgress,
  loadPersistedProgress,
  savePersistedProgress,
} from "./persistence";

describe("onboarding persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("stores only non-sensitive draft fields in sessionStorage", () => {
    savePersistedProgress(
      {
        ...defaultOnboardingValues,
        personal: {
          firstName: "Sam",
          lastName: "Rivera",
          dateOfBirth: "1994-02-10",
          phone: "0412345678",
        },
        address: {
          line1: "10 Market Street",
          line2: "Apt 3",
          city: "Sydney",
          state: "NSW",
          postcode: "2000",
          country: "Australia",
        },
        emergencyContact: {
          name: "Jordan Rivera",
          relationship: "Partner",
          phone: "0412111222",
        },
        membershipId: "premium",
        account: {
          email: "sam@example.com",
          password: "Strong123",
          confirmPassword: "Strong123",
        },
        health: {
          conditionIds: ["heart-disease"],
          fitnessGoals: "Build strength safely.",
          waiverAccepted: true,
          medicalClearanceAcknowledged: true,
        },
      },
      4,
    );

    expect(window.localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBeNull();

    const rawDraft = window.sessionStorage.getItem(ONBOARDING_STORAGE_KEY);
    expect(rawDraft).not.toBeNull();
    expect(rawDraft).toContain("Sam");
    expect(rawDraft).toContain("premium");
    expect(rawDraft).not.toContain("sam@example.com");
    expect(rawDraft).not.toContain("Strong123");
    expect(rawDraft).not.toContain("heart-disease");
    expect(rawDraft).not.toContain("Build strength safely");
    expect(rawDraft).not.toContain("waiverAccepted");
    expect(rawDraft).not.toContain("medicalClearanceAcknowledged");
  });

  it("hydrates sensitive fields back to defaults and restores to the earliest safe step", () => {
    savePersistedProgress(
      {
        ...defaultOnboardingValues,
        personal: {
          ...defaultOnboardingValues.personal,
          firstName: "Sam",
        },
        account: {
          email: "sam@example.com",
          password: "Strong123",
          confirmPassword: "Strong123",
        },
        health: {
          conditionIds: ["asthma"],
          fitnessGoals: "Return to running safely.",
          waiverAccepted: true,
          medicalClearanceAcknowledged: false,
        },
      },
      4,
    );

    const progress = loadPersistedProgress();

    expect(progress?.currentStep).toBe(2);
    expect(progress?.values.personal.firstName).toBe("Sam");
    expect(progress?.values.account.email).toBe("");
    expect(progress?.values.account.password).toBe("");
    expect(progress?.values.health.conditionIds).toEqual([]);
    expect(progress?.values.health.fitnessGoals).toBe("");
    expect(progress?.values.health.waiverAccepted).toBe(false);
  });

  it("clears the session draft", () => {
    savePersistedProgress(defaultOnboardingValues, 1);

    clearPersistedProgress();

    expect(window.sessionStorage.getItem(ONBOARDING_STORAGE_KEY)).toBeNull();
  });
});
