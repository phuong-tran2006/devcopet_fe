import { createFileRoute, Outlet } from "@tanstack/react-router";
import ArenaLayout from "../features/arena/components/ArenaLayout";
import { requireAuth } from "./-requireAuth";

export const Route = createFileRoute("/arena")({
  beforeLoad: ({ location }) => {
    requireAuth(location.href);
  },
  component: () => (
    <ArenaLayout>
      <Outlet />
    </ArenaLayout>
  ),
});
