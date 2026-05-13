import {
  ClipboardCheck,
  HeartPulse,
  KeyRound,
  UserRound,
  WalletCards,
} from "lucide-react";

export const ONBOARDING_STEPS = [
  {
    id: "personal",
    label: "Personal information",
    description: "Identity, contact, and address",
    icon: UserRound,
  },
  {
    id: "membership",
    label: "Membership",
    description: "Choose your plan",
    icon: WalletCards,
  },
  {
    id: "health",
    label: "Health information",
    description: "Safety and goals",
    icon: HeartPulse,
  },
  {
    id: "account",
    label: "Account setup",
    description: "Credentials and sign in",
    icon: KeyRound,
  },
  {
    id: "review",
    label: "Review",
    description: "Confirm and submit",
    icon: ClipboardCheck,
  },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];

export const STEP_FIELD_PATHS: Record<OnboardingStepId, string[]> = {
  personal: [
    "personal.firstName",
    "personal.lastName",
    "personal.dateOfBirth",
    "personal.phone",
    "address.line1",
    "address.line2",
    "address.city",
    "address.state",
    "address.postcode",
    "address.country",
    "emergencyContact.name",
    "emergencyContact.relationship",
    "emergencyContact.phone",
  ],
  membership: ["membershipId"],
  health: [
    "health.conditionIds",
    "health.fitnessGoals",
    "health.waiverAccepted",
    "health.medicalClearanceAcknowledged",
  ],
  account: ["account.email", "account.password", "account.confirmPassword"],
  review: [],
};
