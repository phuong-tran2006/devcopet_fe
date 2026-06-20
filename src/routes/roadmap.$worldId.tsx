import { createFileRoute, redirect } from "@tanstack/react-router";
import WorldMapPage from "../features/courses/pages/WorldMapPage";
import { useAuthStore } from "../features/users/store/auth.store";

export const Route = createFileRoute("/roadmap/$worldId")({
  beforeLoad: ({ params }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: `/roadmap/${params.worldId}` } });
    }
  },
  component: WorldMapPage,
});
