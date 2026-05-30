import { createFileRoute } from '@tanstack/react-router';
import CoursePage from '../features/users/components/CoursePage/index.jsx';

export const Route = createFileRoute('/course')({
  component: () => <CoursePage />,
});
