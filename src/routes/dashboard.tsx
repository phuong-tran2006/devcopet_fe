import { createFileRoute, Outlet } from "@tanstack/react-router";
import ArenaLayout from "../features/arena/components/ArenaLayout";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ArenaLayout>
      <Outlet />
    </ArenaLayout>
  ),
});
