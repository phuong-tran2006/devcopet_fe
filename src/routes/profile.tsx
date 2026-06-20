import { createFileRoute, redirect } from "@tanstack/react-router";
import ProfilePage from "../features/profile/pages/ProfilePage";
import { useAuthStore } from "../features/users/store/auth.store";

export const Route = createFileRoute("/profile")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: "/profile" } });
    }
  },
  component: ProfilePage,
});
