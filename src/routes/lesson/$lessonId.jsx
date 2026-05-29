import { createFileRoute } from '@tanstack/react-router';
import LessonPage from '../../features/users/components/LessonPage/index.jsx';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export const Route = createFileRoute('/lesson/$lessonId')({
  component: () => (
    <ProtectedRoute>
      <LessonPage />
    </ProtectedRoute>
  ),
});
