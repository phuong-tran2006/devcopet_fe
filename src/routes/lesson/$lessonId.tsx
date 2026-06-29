import { createFileRoute } from "@tanstack/react-router";
import LessonDetailPage from "../../features/courses/pages/LessonDetailPage";
import { requireAuth } from "../-requireAuth";

export const Route = createFileRoute("/lesson/$lessonId")({
  beforeLoad: ({ params }) =>
    requireAuth(`/lesson/${encodeURIComponent(params.lessonId)}`),
  component: LessonDetailPage,
});
