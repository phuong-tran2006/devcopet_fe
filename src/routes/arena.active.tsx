import { createFileRoute } from "@tanstack/react-router";
import BattlePage from "../features/arena/pages/BattlePage";

export const Route = createFileRoute("/arena/active")({
  component: BattlePage,
});
