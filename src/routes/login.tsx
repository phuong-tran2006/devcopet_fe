// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../features/users/pages/auth/LoginPage";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
