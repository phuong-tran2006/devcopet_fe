import { createFileRoute } from "@tanstack/react-router";
import ArenaHistoryPage from "../features/arena/pages/ArenaHistoryPage";

export const Route = createFileRoute("/dashboard/history")({
  component: ArenaHistoryPage,
});
