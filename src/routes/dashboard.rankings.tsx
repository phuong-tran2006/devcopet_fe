import { createFileRoute } from "@tanstack/react-router";
import ArenaRankingPage from "../features/arena/pages/ArenaRankingPage";

export const Route = createFileRoute("/dashboard/rankings")({
  component: ArenaRankingPage,
});
