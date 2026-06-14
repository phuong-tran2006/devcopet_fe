import { createFileRoute } from "@tanstack/react-router";
import CoursePage from "../features/courses/pages/CoursePage";

export const Route = createFileRoute("/course")({
  component: CoursePage,
});
