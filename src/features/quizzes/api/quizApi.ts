import { api } from "../../../services/axiosClient";

interface AnswerPayload {
  questionIndex: number;
  selectedOptionIds: string[];
  answerText: string;
}

export const getQuizByLessonId = async (lessonId: string) => {
  const response = await api.get(`/lessons/${lessonId}/quiz`);
  return response.data;
};

export const submitQuiz = async (quizId: string, answers: AnswerPayload[]) => {
  const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
  return response.data;
};
