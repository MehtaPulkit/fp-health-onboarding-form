import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../../../lib/auth";

export function RedirectAuthenticatedRoute() {
  const user = getCurrentUser();

  if (isAuthenticated() && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
