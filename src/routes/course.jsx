import { createFileRoute } from '@tanstack/react-router';
import CoursePage from '../features/users/components/CoursePage/index.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const Route = createFileRoute('/course')({
  component: () => (
    <ProtectedRoute>
      <CoursePage />
    </ProtectedRoute>
  ),
});
