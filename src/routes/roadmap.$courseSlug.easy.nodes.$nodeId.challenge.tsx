import { createFileRoute } from "@tanstack/react-router";
import EasyNodeChallengePage from "../features/courses/pages/EasyNodeChallengePage";

export const Route = createFileRoute(
  "/roadmap/$courseSlug/easy/nodes/$nodeId/challenge",
)({
  component: EasyNodeChallengePage,
});
