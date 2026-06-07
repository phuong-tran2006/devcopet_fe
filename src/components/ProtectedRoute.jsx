import React from "react";
import { Navigate, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "../features/users/store/auth.store";

export function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { isAuthenticated } = useAuthStore();
  // Assume initialized for Zustand store as it's sync
  const initialized = true;
  const loading = false;
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#041521]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-[#76d6d5] border-t-transparent rounded-full" />
          <p
            className="text-[#bdc9c8] text-sm"
            style={{ fontFamily: "Roboto" }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
}
