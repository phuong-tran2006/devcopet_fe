import { createFileRoute } from "@tanstack/react-router";
import WorldMapPage from "../features/courses/pages/WorldMapPage";

export const Route = createFileRoute("/roadmap/$worldId")({
  component: WorldMapPage,
});
