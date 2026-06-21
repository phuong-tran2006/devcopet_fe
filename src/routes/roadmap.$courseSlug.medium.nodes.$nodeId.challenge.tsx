import { createFileRoute, redirect } from "@tanstack/react-router";
import MediumNodeChallengePage from "../features/courses/pages/MediumNodeChallengePage";
import { useAuthStore } from "../features/users/store/auth.store";

export const Route = createFileRoute(
  "/roadmap/$courseSlug/medium/nodes/$nodeId/challenge",
)({
  beforeLoad: ({ params }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: `/roadmap/${params.courseSlug}/medium/nodes/${params.nodeId}/challenge`,
        },
      });
    }
  },
  component: MediumNodeChallengePage,
});
