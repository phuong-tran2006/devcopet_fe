import { createFileRoute } from '@tanstack/react-router';
import ChapterPage from '../features/users/components/ChapterPage/index.jsx';

export const Route = createFileRoute('/chapter')({
  component: ChapterPage,
});
