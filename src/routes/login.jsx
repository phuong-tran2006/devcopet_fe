import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../features/users/components/LoginPage";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
