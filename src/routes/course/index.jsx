import { createFileRoute } from '@tanstack/react-router';
import CourseListPage from '../../features/courses/pages/CourseListPage';

export const Route = createFileRoute('/course/')({
  component: CourseListPage,
});
