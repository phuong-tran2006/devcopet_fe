import { createFileRoute } from "@tanstack/react-router";
import HardNodeChallengePage from "../features/courses/pages/HardNodeChallengePage";

export const Route = createFileRoute(
  "/roadmap/$courseSlug/hard/nodes/$nodeId/challenge",
)({
  component: HardNodeChallengePage,
});
