import { createFileRoute, redirect } from "@tanstack/react-router";
import CoursePage from "../features/courses/pages/CoursePage";
import { useAuthStore } from "../features/users/store/auth.store";

export const Route = createFileRoute("/course")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: "/course" } });
    }
  },
  component: CoursePage,
});
