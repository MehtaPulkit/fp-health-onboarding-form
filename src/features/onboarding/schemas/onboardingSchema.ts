import { z } from "zod";
import {
  conditionIds,
  membershipTierIds,
  noHealthConditionId,
  requiresMedicalClearance,
} from "../constants/data";
import {
  createAustralianMobileSchema,
  createNameSchema,
} from "../utils/validation";

const firstNameSchema = createNameSchema("First name");
const lastNameSchema = createNameSchema("Last name");
const relationshipSchema = createNameSchema("Relationship");
const emergencyContactNameSchema = createNameSchema("Emergency contact name");
const mobilePhoneSchema = createAustralianMobileSchema("Phone number");
const emergencyMobilePhoneSchema = createAustralianMobileSchema("Emergency contact phone");

const passwordSchema = z
  .string()
  .min(1, "Password is required.")
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/\d/, "Password must include a number.");

const dateOfBirthSchema = z
  .string()
  .min(1, "Date of birth is required.")
  .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
    message: "Enter a valid date of birth.",
  })
  .refine((value) => calculateAge(value) >= 16, {
    message: "Members must be at least 16 years old.",
  });

const emergencyContactSchema = z.object({
  name: emergencyContactNameSchema,
  relationship: relationshipSchema,
  phone: emergencyMobilePhoneSchema,
});

export const accountSetupSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Confirm your password."),
});

export const personalInformationSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  dateOfBirth: dateOfBirthSchema,
  phone: mobilePhoneSchema,
});

export const addressInformationSchema = z.object({
  line1: z.string().trim().min(1, "Address line 1 is required.").max(120),
  line2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(1, "Suburb or city is required.").max(80),
  state: z.string().trim().min(1, "State is required.").max(50),
  postcode: z
    .string()
    .trim()
    .min(1, "Postcode is required.")
    .regex(/^\d{4}$/, "Enter a valid 4-digit Australian postcode."),
  country: z.string().trim().min(1, "Country is required.").max(80),
});

export const membershipSelectionSchema = z.object({
  membershipId: z
    .string()
    .min(1, "Choose a membership plan.")
    .refine((value) => membershipTierIds.includes(value), "Choose a valid membership plan."),
});

export const healthInformationSchema = z.object({
  conditionIds: z
    .array(z.string())
    .min(1, "Choose at least one health condition option.")
    .refine(
      (selectedIds) => selectedIds.every((conditionId) => conditionIds.includes(conditionId)),
      "Choose valid health conditions.",
    )
    .default([]),
  fitnessGoals: z
    .string()
    .trim()
    .min(10, "Share at least one clear fitness goal.")
    .max(700, "Please keep goals under 700 characters."),
  waiverAccepted: z.boolean().refine((value) => value, {
    message: "You must acknowledge the waiver to continue.",
  }),
  medicalClearanceAcknowledged: z.boolean(),
});

export const onboardingFormSchema = z
  .object({
    personal: personalInformationSchema,
    account: accountSetupSchema,
    address: addressInformationSchema,
    emergencyContact: emergencyContactSchema,
    membershipId: membershipSelectionSchema.shape.membershipId,
    health: healthInformationSchema,
  })
  .superRefine((values, context) => {
    const selectedConditionIds = values.health.conditionIds;
    const selectedMedicalConditionIds = selectedConditionIds.filter(
      (conditionId) => conditionId !== noHealthConditionId,
    );
    const hasNoneAndOtherCondition =
      selectedConditionIds.includes(noHealthConditionId) && selectedMedicalConditionIds.length > 0;

    if (hasNoneAndOtherCondition) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["health", "conditionIds"],
        message: "Choose either 'None of the above' or specific conditions, not both.",
      });
    }

    if (values.account.password !== values.account.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["account", "confirmPassword"],
        message: "Passwords must match.",
      });
    }

    if (
      requiresMedicalClearance(selectedConditionIds) &&
      !values.health.medicalClearanceAcknowledged
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["health", "medicalClearanceAcknowledged"],
        message: "Acknowledge that medical clearance may be required.",
      });
    }
  });

export const defaultOnboardingValues: OnboardingFormValuesInput = {
  personal: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
  },
  account: {
    email: "",
    password: "",
    confirmPassword: "",
  },
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postcode: "",
    country: "Australia",
  },
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
  },
  membershipId: "",
  health: {
    conditionIds: [],
    fitnessGoals: "",
    waiverAccepted: false,
    medicalClearanceAcknowledged: false,
  },
};

export type OnboardingFormValuesInput = z.input<typeof onboardingFormSchema>;

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}
