// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import LessonDetailPage from "../../features/courses/pages/lesson/LessonDetailPage";

export const Route = createFileRoute("/lesson/$lessonId")({
  component: LessonDetailPage,
});
