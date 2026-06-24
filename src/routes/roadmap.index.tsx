import { createFileRoute } from "@tanstack/react-router";
import RoadmapPage from "../features/roadmap/pages/RoadmapPage";

export const Route = createFileRoute("/roadmap/")({
  component: RoadmapPage,
});
