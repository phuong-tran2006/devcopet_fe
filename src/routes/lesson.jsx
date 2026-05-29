import { createFileRoute } from '@tanstack/react-router';
import LessonPage from '../features/users/components/LessonPage/index.jsx';

export const Route = createFileRoute('/lesson')({
  component: LessonPage,
});
