import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "../features/users/pages/LandingPage";

export const Route = createFileRoute("/")({
  component: LandingPage,
});
