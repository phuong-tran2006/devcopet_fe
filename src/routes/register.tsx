// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import RegistrationPage from "../features/users/components/RegistrationPage";

export const Route = createFileRoute("/register")({
  component: RegistrationPage,
});
