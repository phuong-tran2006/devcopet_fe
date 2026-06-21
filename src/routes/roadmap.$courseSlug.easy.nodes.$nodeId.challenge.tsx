import { createFileRoute, redirect } from "@tanstack/react-router";
import EasyNodeChallengePage from "../features/courses/pages/EasyNodeChallengePage";
import { useAuthStore } from "../features/users/store/auth.store";

export const Route = createFileRoute(
  "/roadmap/$courseSlug/easy/nodes/$nodeId/challenge",
)({
  beforeLoad: ({ params }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: `/roadmap/${params.courseSlug}/easy/nodes/${params.nodeId}/challenge`,
        },
      });
    }
  },
  component: EasyNodeChallengePage,
});
