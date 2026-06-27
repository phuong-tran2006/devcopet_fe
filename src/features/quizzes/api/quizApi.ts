import { api } from "../../../services/axiosClient";
import type {
  LessonQuizData,
  QuizAnswerPayload,
  SubmitQuizResult,
} from "../types/quiz.types";

export const getQuizByLessonId = async (
  lessonId: string,
): Promise<LessonQuizData> => {
  const response = await api.get(`/lessons/${lessonId}/quiz`);
  return response.data;
};

export const submitQuiz = async (
  quizId: string,
  answers: QuizAnswerPayload[],
): Promise<SubmitQuizResult> => {
  const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
  return response.data;
};
