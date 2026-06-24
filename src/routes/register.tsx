// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import RegistrationPage from "../features/users/pages/auth/RegistrationPage";

export const Route = createFileRoute("/register")({
  component: RegistrationPage,
});
