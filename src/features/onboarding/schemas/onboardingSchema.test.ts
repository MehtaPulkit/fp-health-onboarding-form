import { describe, expect, it } from "vitest";
import {
  defaultOnboardingValues,
  onboardingFormSchema,
  type OnboardingFormValuesInput,
} from "./onboardingSchema";

const validValues: OnboardingFormValuesInput = {
  account: {
    email: "sam@example.com",
    password: "Strong123",
    confirmPassword: "Strong123",
  },
  personal: {
    firstName: "Sam",
    lastName: "Rivera",
    dateOfBirth: "1994-02-10",
    phone: "0412 345 678",
  },
  address: {
    line1: "10 Market Street",
    line2: "",
    city: "Sydney",
    state: "NSW",
    postcode: "2000",
    country: "Australia",
  },
  emergencyContact: {
    name: "Jordan Rivera",
    relationship: "Partner",
    phone: "0412 111 222",
  },
  membershipId: "premium",
  health: {
    conditionIds: ["none"],
    fitnessGoals: "Build strength and improve weekly training consistency.",
    waiverAccepted: true,
    medicalClearanceAcknowledged: false,
  },
};

describe("onboardingFormSchema", () => {
  it("accepts a complete onboarding payload", () => {
    expect(onboardingFormSchema.safeParse(validValues).success).toBe(true);
  });

  it("requires members to be at least 16", () => {
    const result = onboardingFormSchema.safeParse({
      ...validValues,
      personal: {
        ...validValues.personal,
        dateOfBirth: new Date().toISOString().slice(0, 10),
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toContain(
      "Members must be at least 16 years old.",
    );
  });

  it("requires emergency contact details as part of personal information", () => {
    const result = onboardingFormSchema.safeParse({
      ...validValues,
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toEqual(
      expect.arrayContaining([
        "emergencyContact.name",
        "emergencyContact.relationship",
        "emergencyContact.phone",
      ]),
    );
    expect(result.error?.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        "Emergency contact name is required.",
        "Relationship is required.",
        "Emergency contact phone is required.",
      ]),
    );
  });

  it("requires strong matching passwords", () => {
    const result = onboardingFormSchema.safeParse({
      ...validValues,
      account: {
        email: "sam@example.com",
        password: "weak",
        confirmPassword: "different",
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toEqual(
      expect.arrayContaining(["account.password", "account.confirmPassword"]),
    );
  });

  it("validates Australian postcodes", () => {
    const result = onboardingFormSchema.safeParse({
      ...validValues,
      address: {
        ...validValues.address,
        postcode: "200",
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toContain(
      "address.postcode",
    );
  });

  it("validates Australian mobile phone formats", () => {
    for (const phone of ["0412345678", "+61412345678", "61412345678", "0412 345 678"]) {
      expect(
        onboardingFormSchema.safeParse({
          ...validValues,
          personal: { ...validValues.personal, phone },
          emergencyContact: { ...validValues.emergencyContact, phone },
        }).success,
      ).toBe(true);
    }

    const result = onboardingFormSchema.safeParse({
      ...validValues,
      personal: {
        ...validValues.personal,
        phone: "0212345678",
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toContain(
      "Enter a valid Australian mobile number.",
    );
  });

  it("requires medical clearance acknowledgement for flagged conditions", () => {
    const result = onboardingFormSchema.safeParse({
      ...validValues,
      health: {
        ...validValues.health,
        conditionIds: ["heart-disease"],
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toContain(
      "health.medicalClearanceAcknowledged",
    );
  });

  it("requires at least one health condition option", () => {
    const result = onboardingFormSchema.safeParse({
      ...validValues,
      health: {
        ...validValues.health,
        conditionIds: [],
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toContain(
      "Choose at least one health condition option.",
    );
  });

  it("rejects an invalid membership id", () => {
    const result = onboardingFormSchema.safeParse({
      ...defaultOnboardingValues,
      ...validValues,
      membershipId: "vip",
    });

    expect(result.success).toBe(false);
  });
});
