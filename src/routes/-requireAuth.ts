import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "../features/users/store/auth.store";

export const requireAuth = (redirectTo: string) => {
  if (!useAuthStore.getState().isAuthenticated) {
    throw redirect({
      to: "/login",
      search: { redirect: redirectTo },
      replace: true,
    });
  }
};
