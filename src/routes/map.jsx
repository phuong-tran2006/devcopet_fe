import { createFileRoute } from '@tanstack/react-router';
import MapPage from '../features/users/components/MapPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const Route = createFileRoute('/map')({
  component: () => (
    <ProtectedRoute>
      <MapPage />
    </ProtectedRoute>
  ),
});
