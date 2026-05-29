import { createFileRoute } from '@tanstack/react-router';
import HomePage from '../features/users/components/HomePage';

export const Route = createFileRoute('/quiz')({
  component: HomePage,
});
