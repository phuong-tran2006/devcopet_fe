import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../features/users/pages/LoginPage";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
