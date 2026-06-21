import { createFileRoute, redirect } from "@tanstack/react-router";
import HardNodeChallengePage from "../features/courses/pages/HardNodeChallengePage";
import { checkDifficultyUnlock } from "../features/courses/api/course.api";
import { useAuthStore } from "../features/users/store/auth.store";

export const Route = createFileRoute(
  "/roadmap/$courseSlug/hard/nodes/$nodeId/challenge",
)({
  beforeLoad: async ({ params }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login" });
    }
    const unlocked = await checkDifficultyUnlock(params.courseSlug, "hard");
    if (!unlocked) {
      throw redirect({
        to: "/roadmap/$worldId",
        params: { worldId: params.courseSlug },
      });
    }
  },
  component: HardNodeChallengePage,
});
