import { createFileRoute } from "@tanstack/react-router";
import CourseDetailPage from "../../features/courses/pages/CourseDetailPage";
import { requireAuth } from "../-requireAuth";

export const Route = createFileRoute("/courses/$courseId")({
  beforeLoad: ({ params }) =>
    requireAuth(`/courses/${encodeURIComponent(params.courseId)}`),
  component: CourseDetailPage,
});
