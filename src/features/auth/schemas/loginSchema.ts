import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address.").toLowerCase().max(255, "Email is too long."),
  password: z.string().min(1, "Password is required.").max(100, "Password is too long."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
