import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../../../lib/auth";

export function ProtectedRoute() {
  const location = useLocation();
  const user = getCurrentUser();

  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
