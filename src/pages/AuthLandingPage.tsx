import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { BrandLogo } from "../components/layout/BrandLogo";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { isAuthenticated } from "../lib/auth";

export function AuthLandingPage() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  return (
    <AppShell>
      <div className="flex flex-1 md:items-center md:justify-center py-10">
        <div className="flex flex-col w-full max-w-5xl gap-6 ">
          <div className="max-h-fit">
            <BrandLogo className="h-14" />
            <h1 className="mt-3 text-4xl font-bold text-ink sm:text-5xl">
              Get started with your membership
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Create your profile, select your plan, and complete your health
              check to prepare for your first visit.
            </p>
          </div>

          <Card className="p-6 sm:p-8 lg:max-w-lg max-h-fit">
            <div className="space-y-4 lg:flex lg:justify-center lg:space-x-4 lg:space-y-0 ">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full justify-between"
                onClick={() =>
                  navigate(authenticated ? "/dashboard" : "/login")
                }
              >
                Login
                <LogIn aria-hidden="true" className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                size="lg"
                className="w-full justify-between"
                onClick={() =>
                  navigate(authenticated ? "/dashboard" : "/signup")
                }
              >
                Create account
                <UserPlus aria-hidden="true" className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
