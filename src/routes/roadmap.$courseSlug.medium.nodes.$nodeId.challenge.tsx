import { createFileRoute } from "@tanstack/react-router";
import MediumNodeChallengePage from "../features/courses/pages/MediumNodeChallengePage";

export const Route = createFileRoute(
  "/roadmap/$courseSlug/medium/nodes/$nodeId/challenge",
)({
  component: MediumNodeChallengePage,
});
