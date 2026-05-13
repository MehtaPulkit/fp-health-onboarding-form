import { useFormContext } from "react-hook-form";
import { FormField } from "../../../components/ui/FormField";
import { Input } from "../../../components/ui/Input";
import { PasswordInput } from "../../../components/ui/PasswordInput";
import type { OnboardingFormValuesInput } from "../schemas/onboardingSchema";

export function AccountSetupStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingFormValuesInput>();

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField
        id="accountEmail"
        label="Email"
        error={errors.account?.email?.message}
        className="sm:col-span-2"
      >
        <Input
          id="accountEmail"
          type="email"
          autoComplete="email"
          inputMode="email"
          hasError={Boolean(errors.account?.email)}
          aria-describedby={errors.account?.email ? "accountEmail-error" : undefined}
          {...register("account.email")}
        />
      </FormField>

      <FormField
        id="password"
        label="Password"
        hint="Use at least 8 characters with uppercase, lowercase, and a number."
        error={errors.account?.password?.message}
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          hasError={Boolean(errors.account?.password)}
          aria-describedby={errors.account?.password ? "password-error" : "password-hint"}
          {...register("account.password")}
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm password"
        error={errors.account?.confirmPassword?.message}
      >
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          hasError={Boolean(errors.account?.confirmPassword)}
          aria-describedby={
            errors.account?.confirmPassword ? "confirmPassword-error" : undefined
          }
          {...register("account.confirmPassword")}
        />
      </FormField>
    </div>
  );
}
