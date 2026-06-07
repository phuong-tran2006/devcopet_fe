import { createFileRoute } from '@tanstack/react-router';
import QuizPage from '../../features/courses/pages/QuizPage';

export const Route = createFileRoute('/lesson/$lessonId/quiz')({
  component: QuizPage,
});
