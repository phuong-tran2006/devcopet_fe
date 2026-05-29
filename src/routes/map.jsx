import { createFileRoute } from '@tanstack/react-router';
import MapPage from '../features/users/components/MapPage';

export const Route = createFileRoute('/map')({
  component: MapPage,
});
