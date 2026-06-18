// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router";
import HomePage from "../features/users/components/HomePage";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw redirect({ to: "/login" });
    }

    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.onboardingCompleted) {
          throw redirect({ to: "/course" });
        }
      }
    } catch {
      // ignore parse errors
    }
  },
  component: HomePage,
});
