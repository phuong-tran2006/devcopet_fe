// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "../features/users/pages/marketing/LandingPage";

export const Route = createFileRoute("/")({
  component: LandingPage,
});
