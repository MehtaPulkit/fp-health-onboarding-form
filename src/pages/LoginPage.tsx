import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { BrandLogo } from "../components/layout/BrandLogo";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { FormField } from "../components/ui/FormField";
import { Input } from "../components/ui/Input";
import { PasswordInput } from "../components/ui/PasswordInput";
import {
  loginSchema,
  type LoginFormValues,
} from "../features/auth/schemas/loginSchema";
import { AUTH_TOKEN_STORAGE_KEY } from "../features/onboarding/constants/storage";
import { getCurrentUser, isAuthenticated, login } from "../lib/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  if (isAuthenticated() && getCurrentUser()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(values: LoginFormValues) {
    setAuthError(null);

    try {
      const result = await login(values.email, values.password);
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    }
  }

  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center py-10">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <BrandLogo />
          <h1 className="mt-2 text-3xl font-bold text-ink">Login</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sign in to your account to get started.
          </p>

          {authError ? (
            <Alert title="Login failed" variant="error" className="mt-5">
              {authError}
            </Alert>
          ) : null}

          <form
            className="mt-6 space-y-5"
            onSubmit={form.handleSubmit(handleLogin)}
            noValidate
          >
            <FormField
              id="loginEmail"
              label="Email"
              error={form.formState.errors.email?.message}
            >
              <Input
                id="loginEmail"
                type="email"
                autoComplete="email"
                inputMode="email"
                hasError={Boolean(form.formState.errors.email)}
                aria-describedby={
                  form.formState.errors.email ? "loginEmail-error" : undefined
                }
                {...form.register("email")}
              />
            </FormField>

            <FormField
              id="loginPassword"
              label="Password"
              error={form.formState.errors.password?.message}
            >
              <PasswordInput
                id="loginPassword"
                autoComplete="current-password"
                hasError={Boolean(form.formState.errors.password)}
                aria-describedby={
                  form.formState.errors.password
                    ? "loginPassword-error"
                    : undefined
                }
                {...form.register("password")}
              />
            </FormField>

            <Button
              type="submit"
              className="w-full"
              isLoading={form.formState.isSubmitting}
            >
              Login
              <LogIn aria-hidden="true" className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            New here?{" "}
            <Link
              className="font-semibold text-brand-700 hover:text-brand-500"
              to="/signup"
            >
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
