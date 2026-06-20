import { createFileRoute, redirect } from "@tanstack/react-router";
import LeaderboardPage from "../features/leaderboard/pages/LeaderboardPage";
import { useAuthStore } from "../features/users/store/auth.store";

export const Route = createFileRoute("/leaderboard")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: "/leaderboard" } });
    }
  },
  component: LeaderboardPage,
});
