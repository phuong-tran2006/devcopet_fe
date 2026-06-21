import { createFileRoute, redirect } from "@tanstack/react-router";
import HomePage from "../features/users/components/HomePage";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: () => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      throw redirect({ to: "/login" });
    }

    let user: { onboardingCompleted?: boolean } | null = null;
    try {
      user = JSON.parse(stored);
    } catch {
      localStorage.removeItem("user");
      throw redirect({ to: "/login" });
    }

    if (user?.onboardingCompleted) {
      throw redirect({ to: "/course" });
    }
  },
  component: HomePage,
});
