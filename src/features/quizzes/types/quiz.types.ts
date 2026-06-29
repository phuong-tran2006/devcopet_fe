export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  index?: number;
  question: string;
  options: QuizOption[];
  points: number;
  difficulty?: "easy" | "medium" | "hard";
  codeSnippet?: string;
}

export interface LessonQuizData {
  _id: string;
  lessonId?: string;
  title?: string;
  passingScore?: number;
  questions: QuizQuestion[];
}

export interface QuizAnswerPayload {
  questionIndex: number;
  selectedOptionIds: string[];
  answerText: string;
}

export interface QuizQuestionResult {
  questionIndex: number;
  isCorrect: boolean;
  correctOptionIds: string[];
  earnedPoints: number;
  points: number;
  explanation?: string;
}

export interface LessonProgressUpdate {
  lessonId?: string;
  status?: "locked" | "available" | "completed";
  bestScore?: number;
  attempts?: number;
  completedAt?: string;
  nextLessonId?: string | null;
  nextLessonUnlocked?: boolean;
  [key: string]: unknown;
}

export interface SubmitQuizResult {
  passed: boolean;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  earnedPoints: number;
  totalPoints: number;
  results: QuizQuestionResult[];
  progress?: LessonProgressUpdate;
}
