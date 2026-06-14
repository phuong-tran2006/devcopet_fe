import { Navigate, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "../features/users/store/auth.store";

export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        search={{ redirect: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}
