import { createFileRoute, redirect } from "@tanstack/react-router";
import HardNodeChallengePage from "../features/roadmap/pages/challenges/HardNodeChallengePage";
import { useAuthStore } from "../features/users/store/auth.store";

export const Route = createFileRoute(
  "/roadmap/$courseSlug/hard/nodes/$nodeId/challenge",
)({
  beforeLoad: ({ params }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: `/roadmap/${params.courseSlug}/hard/nodes/${params.nodeId}/challenge`,
        },
      });
    }
  },
  component: HardNodeChallengePage,
});
