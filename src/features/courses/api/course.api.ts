import { api } from "../../../services/axiosClient";

export type EasyRoadmapNodeStatus = "locked" | "available" | "completed";

export interface EasyRoadmapNode {
  id: string;
  lessonId: string;
  chapterId: string;
  chapterOrder: number;
  lessonOrder: number;
  label: string;
  title: string;
  description?: string;
  status: EasyRoadmapNodeStatus;
  xp: number;
  duration?: number;
  href?: string;
}

export interface EasyRoadmapChapter {
  id: string;
  slug?: string;
  title: string;
  order: number;
  lessonCount: number;
  nodeCount: number;
  nodes: EasyRoadmapNode[];
}

export interface EasyRoadmapResponse {
  course: {
    id: string;
    slug: string;
    title: string;
    totalChapters: number;
    totalLessons: number;
    totalNodes: number;
  };
  mode: "easy";
  chapters: EasyRoadmapChapter[];
}

export type EasyChallengeOptionId = "A" | "B" | "C" | "D";
export type EasyNodeChallengePromptType = "code_mcq" | "concept_mcq";

export interface EasyNodeChallenge {
  id: string;
  type: "multiple_choice";
  promptType?: EasyNodeChallengePromptType;
  title: string;
  question: string;
  codeSnippet?: {
    language: "python";
    code: string;
  };
  options: Array<{
    id: EasyChallengeOptionId;
    text: string;
  }>;
  xp: number;
  estimatedMinutes: number;
}

export interface EasyNodeChallengeReview {
  selectedOptionId: EasyChallengeOptionId;
  correctOptionId: EasyChallengeOptionId;
  correct: boolean;
  explanation: string;
  completedAt?: string;
}

export interface EasyNodeChallengeResponse {
  node: {
    id: string;
    lessonId: string;
    chapterId: string;
    label: string;
    title: string;
    status: EasyRoadmapNodeStatus;
  };
  challenge: EasyNodeChallenge | null;
  review?: EasyNodeChallengeReview;
  message?: string;
}

export interface SubmitEasyNodeChallengeResponse {
  correct?: boolean;
  message: string;
  correctOptionId?: EasyChallengeOptionId;
  explanation?: string;
  review?: EasyNodeChallengeReview;
}

export const courseApi = {
  getCourses: async () => {
    const response = await api.get(`/courses`);
    return response.data;
  },

  getChapters: async (courseId: string) => {
    const response = await api.get(`/courses/${courseId}/chapters`);
    return response.data;
  },

  getLessons: async (chapterId: string) => {
    const response = await api.get(`/chapters/${chapterId}/lessons`);
    return response.data;
  },

  getLessonDetail: async (lessonId: string) => {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  },

  getLessonQuiz: async (lessonId: string) => {
    const response = await api.get(`/lessons/${lessonId}/quiz`);
    return response.data;
  },

  getEasyRoadmap: async (
    courseSlug: string,
  ): Promise<EasyRoadmapResponse> => {
    const response = await api.get(`/roadmaps/${courseSlug}/easy`);
    return response.data;
  },

  getEasyNodeChallenge: async (
    nodeId: string,
  ): Promise<EasyNodeChallengeResponse> => {
    const response = await api.get(`/roadmaps/easy/nodes/${nodeId}/challenge`);
    return response.data;
  },

  submitEasyNodeChallenge: async (
    nodeId: string,
    selectedOptionId: EasyChallengeOptionId,
  ): Promise<SubmitEasyNodeChallengeResponse> => {
    const response = await api.post(
      `/roadmaps/easy/nodes/${nodeId}/challenge/submit`,
      { selectedOptionId },
    );
    return response.data;
  },
};
