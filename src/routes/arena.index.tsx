import { createFileRoute } from "@tanstack/react-router";
import MatchmakingPage from "../features/arena/pages/MatchmakingPage";

export const Route = createFileRoute("/arena/")({
  component: MatchmakingPage,
});
