import { CalendarCheck2, LogOut, Mail, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { BrandLogo } from "../components/layout/BrandLogo";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { getMembershipTierById } from "../features/onboarding/constants/data";
import { AUTH_TOKEN_STORAGE_KEY } from "../features/onboarding/constants/storage";
import { formatCurrency } from "../features/onboarding/utils/formatters";
import { getCurrentUser, logout } from "../lib/auth";

type DashboardLocationState = {
  membershipId?: string;
  submittedAt?: string;
};

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const state = (location.state ?? {}) as DashboardLocationState;
  const membershipId = state.membershipId ?? user?.membershipType;
  const membership = membershipId
    ? getMembershipTierById(membershipId)
    : undefined;

  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center py-10">
        <Card className="w-full max-w-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <BrandLogo />
              <h1 className="mt-2 text-3xl font-bold text-ink">Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your membership dashboard is ready.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                logout();
                window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
                navigate("/", { replace: true });
              }}
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <dl className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <UserRound aria-hidden="true" className="h-4 w-4" />
                Member
              </dt>
              <dd className="mt-2 text-sm text-slate-900">
                {user?.name ?? "Member"}
              </dd>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Mail aria-hidden="true" className="h-4 w-4" />
                Email
              </dt>
              <dd className="mt-2 break-words text-sm text-slate-900">
                {user?.email ?? "Not available"}
              </dd>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
              <dt className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CalendarCheck2 aria-hidden="true" className="h-4 w-4" />
                Membership
              </dt>
              <dd className="mt-2 text-sm text-slate-900">
                {membership ? (
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold">{membership.name}</p>
                      <p className="text-slate-600">
                        {formatCurrency(membership.price)} /{" "}
                        {membership.billingPeriod}
                      </p>
                      <p className="text-slate-600">
                        Access: {membership.accessHours}
                      </p>
                    </div>
                    <ul className="grid gap-1 text-slate-700 sm:grid-cols-2">
                      {membership.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  "Membership details will appear here after onboarding is complete."
                )}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </AppShell>
  );
}
