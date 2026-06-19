import { createFileRoute } from "@tanstack/react-router";
import BattlePage from "../features/arena/pages/BattlePage";

export const Route = createFileRoute("/dashboard/active")({
  component: BattlePage,
});
