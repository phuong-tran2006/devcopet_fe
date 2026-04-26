import { createFileRoute } from "@tanstack/react-router";
import ChooseCompanionPage from "../features/choose-companion/ChooseCompanionPage";

export const Route = createFileRoute("/choose-companion")({
  component: ChooseCompanionPage,
});
