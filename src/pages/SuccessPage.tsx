import { CalendarCheck2, Home, LogOut, Mail, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { getMembershipTierById } from "../features/onboarding/constants/data";
import { AUTH_TOKEN_STORAGE_KEY } from "../features/onboarding/constants/storage";
import { getCurrentUser, logout } from "../lib/auth";

type SuccessLocationState = {
  email?: string;
  membershipId?: string;
  submittedAt?: string;
};

export function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as SuccessLocationState;
  const user = getCurrentUser();
  const membership = state.membershipId
    ? getMembershipTierById(state.membershipId)
    : undefined;

  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center py-10">
        <Card className="w-full max-w-2xl p-6 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Sparkles aria-hidden="true" className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-ink">
            Registration submitted
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
            Your Fitness Passport account has been created and your onboarding
            details are ready for the team to review.
          </p>

          <dl className="mt-7 grid gap-3 text-left sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Mail aria-hidden="true" className="h-4 w-4" />
                Email
              </dt>
              <dd className="mt-2 break-words text-sm text-slate-900">
                {state.email ?? user?.email ?? "Confirmation email pending"}
              </dd>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CalendarCheck2 aria-hidden="true" className="h-4 w-4" />
                Membership
              </dt>
              <dd className="mt-2 text-sm text-slate-900">
                {membership?.name ?? "Selected plan"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                navigate("/dashboard", {
                  state: {
                    membershipId: state.membershipId,
                    submittedAt: state.submittedAt,
                  },
                })
              }
            >
              <Home aria-hidden="true" className="h-4 w-4" />
              Go to dashboard
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                logout();
                window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
                navigate("/");
              }}
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
