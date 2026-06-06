import { createFileRoute } from '@tanstack/react-router';
import CourseDetailPage from '../../features/courses/pages/CourseDetailPage';

export const Route = createFileRoute('/course/$courseId')({
  component: CourseDetailPage,
});
