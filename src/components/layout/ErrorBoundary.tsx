import type { ReactNode } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

type ErrorBoundaryProps = {
  children: ReactNode;
};

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const location = useLocation();

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("Unhandled application error", error, info);
      }}
      resetKeys={[location.pathname]}
    >
      {children}
    </ReactErrorBoundary>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();
  const message = getErrorMessage(error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <section
        aria-labelledby="error-boundary-title"
        className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 text-center shadow-soft sm:p-8"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral-50 text-coral-700">
          <AlertTriangle aria-hidden="true" className="h-6 w-6" />
        </div>
        <h1
          id="error-boundary-title"
          className="mt-4 text-2xl font-bold text-ink"
        >
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          We could not load this part of the onboarding experience. Try again or
          return to the start.
        </p>
        {message ? (
          <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-left text-xs text-slate-600">
            {message}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={resetErrorBoundary}>
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Try again
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              resetErrorBoundary();
              navigate("/", { replace: true });
            }}
          >
            <Home aria-hidden="true" className="h-4 w-4" />
            Go home
          </Button>
        </div>
      </section>
    </main>
  );
}

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return null;
}
