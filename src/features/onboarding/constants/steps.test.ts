import { describe, expect, it } from "vitest";
import { ONBOARDING_STEPS, STEP_FIELD_PATHS } from "./steps";

describe("onboarding steps", () => {
  it("places account setup immediately before review", () => {
    expect(ONBOARDING_STEPS.map((step) => step.id)).toEqual([
      "personal",
      "membership",
      "health",
      "account",
      "review",
    ]);
  });

  it("keeps address and emergency contact in personal information", () => {
    expect(STEP_FIELD_PATHS.personal).toEqual(
      expect.arrayContaining([
        "address.line1",
        "address.postcode",
        "emergencyContact.name",
        "emergencyContact.phone",
      ]),
    );
    expect(STEP_FIELD_PATHS.health).not.toContain("emergencyContact.name");
  });
});
