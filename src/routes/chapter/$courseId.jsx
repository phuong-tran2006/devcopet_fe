import { createFileRoute } from '@tanstack/react-router';
import ChapterPage from '../../features/users/components/ChapterPage/index.jsx';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export const Route = createFileRoute('/chapter/$courseId')({
  component: () => (
    <ProtectedRoute>
      <ChapterPage />
    </ProtectedRoute>
  ),
});
