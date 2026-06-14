import { createFileRoute } from "@tanstack/react-router";
import LeaderboardPage from "../features/leaderboard/pages/LeaderboardPage";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});
