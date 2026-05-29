import { createFileRoute } from '@tanstack/react-router';
import HomePage from '../features/users/components/HomePage';
import LandingPage from '../features/users/components/LandingPage';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

export const quizRoute = createFileRoute('/quiz')({
  component: HomePage,
});
