// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import LessonDetailPage from "../../features/courses/pages/LessonDetailPage";

export const Route = createFileRoute("/lesson/$lessonId")({
  component: LessonDetailPage,
});
