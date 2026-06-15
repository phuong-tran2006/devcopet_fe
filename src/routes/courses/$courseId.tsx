// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import CourseDetailPage from "../../features/courses/pages/CourseDetailPage";

export const Route = createFileRoute("/courses/$courseId")({
  component: CourseDetailPage,
});
