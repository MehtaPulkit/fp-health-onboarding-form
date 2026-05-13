import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ErrorBoundary } from "../components/layout/ErrorBoundary";
import { Spinner } from "../components/ui/Spinner";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { RedirectAuthenticatedRoute } from "../features/auth/components/RedirectAuthenticatedRoute";
import { AuthLandingPage } from "../pages/AuthLandingPage";

const LoginPage = lazy(() =>
  import("../pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const OnboardingPage = lazy(() =>
  import("../pages/OnboardingPage").then((module) => ({
    default: module.OnboardingPage,
  })),
);
const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);
const SuccessPage = lazy(() =>
  import("../pages/SuccessPage").then((module) => ({
    default: module.SuccessPage,
  })),
);

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sky-50 px-6">
      <Spinner label="Loading page" />
    </div>
  );
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "/",
        element: <AuthLandingPage />,
      },
      {
        path: "/login",
        element: withSuspense(<LoginPage />),
      },
      {
        element: <RedirectAuthenticatedRoute />,
        children: [
          {
            path: "/signup",
            element: withSuspense(<OnboardingPage />),
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: withSuspense(<DashboardPage />),
          },
          {
            path: "/success",
            element: withSuspense(<SuccessPage />),
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
