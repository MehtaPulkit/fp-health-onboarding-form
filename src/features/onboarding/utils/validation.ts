import { z } from "zod";

export function createNameSchema(fieldLabel: string) {
  return z
    .string()
    .trim()
    .min(1, `${fieldLabel} is required.`)
    .min(2, `${fieldLabel} must be at least 2 characters.`)
    .max(80, "Please keep this under 80 characters.");
}

export function isAustralianMobileNumber(value: string): boolean {
  const compact = value.replace(/[\s()-]/g, "");

  if (compact.startsWith("+61")) {
    return /^\+614\d{8}$/.test(compact);
  }

  return /^(?:04\d{8}|614\d{8})$/.test(compact);
}

export function createAustralianMobileSchema(fieldLabel: string) {
  return z
    .string()
    .trim()
    .min(1, `${fieldLabel} is required.`)
    .refine(isAustralianMobileNumber, "Enter a valid Australian mobile number.");
}
