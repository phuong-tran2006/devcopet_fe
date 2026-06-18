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

export type MediumChallengeType = "multiple_choice" | "drag_drop";

export interface MediumRoadmapNode {
  id: string;
  chapterId?: string;
  chapterOrder: number;
  order: number;
  label: string;
  title: string;
  type: MediumChallengeType;
  status: EasyRoadmapNodeStatus;
  xp: number;
  estimatedMinutes: number;
}

export interface MediumRoadmapChapter {
  id: string;
  chapterId?: string;
  title: string;
  order: number;
  nodeCount: 5;
  nodes: MediumRoadmapNode[];
}

export interface MediumRoadmapResponse {
  course: {
    id: string;
    slug: string;
    title: string;
    totalChapters: number;
    totalNodes: number;
  };
  mode: "medium";
  chapters: MediumRoadmapChapter[];
}

export interface MediumChallengeNode {
  id: string;
  label: string;
  title: string;
  type: MediumChallengeType;
  status: EasyRoadmapNodeStatus;
}

export interface MediumCodeSnippet {
  language: "python";
  code: string;
}

export interface MediumMultipleChoiceChallenge {
  id: string;
  type: "multiple_choice";
  title: string;
  question: string;
  codeSnippet?: MediumCodeSnippet | null;
  options: Array<{
    id: EasyChallengeOptionId;
    text: string;
  }>;
  xp: number;
  estimatedMinutes: number;
}

export interface MediumDragDropChallenge {
  id: string;
  type: "drag_drop";
  title: string;
  question: string;
  codeSnippet?: MediumCodeSnippet | null;
  template: string;
  poolItems: Array<{
    id: string;
    text: string;
  }>;
  xp: number;
  estimatedMinutes: number;
}

export type MediumNodeChallenge =
  | MediumMultipleChoiceChallenge
  | MediumDragDropChallenge;

export type MediumNodeChallengeReview =
  | {
      selectedOptionId?: EasyChallengeOptionId;
      correctOptionId?: EasyChallengeOptionId;
      correct: boolean;
      explanation: string;
      completedAt?: string;
    }
  | {
      dropZoneMap?: Record<string, string>;
      correctDropZoneMap?: Record<string, string>;
      correct: boolean;
      explanation: string;
      completedAt?: string;
    };

export interface MediumNodeChallengeResponse {
  node: MediumChallengeNode;
  challenge: MediumNodeChallenge;
  review?: MediumNodeChallengeReview;
}

export type SubmitMediumNodeChallengePayload =
  | {
      type: "multiple_choice";
      selectedOptionId: EasyChallengeOptionId;
    }
  | {
      type: "drag_drop";
      dropZoneMap: Record<string, string>;
    };

export interface SubmitMediumNodeChallengeResponse {
  correct: boolean;
  message: string;
  correctOptionId?: EasyChallengeOptionId;
  correctDropZoneMap?: Record<string, string>;
  explanation?: string;
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

  getEasyRoadmap: async (courseSlug: string): Promise<EasyRoadmapResponse> => {
    await delay(800);
    return {
      ...mockRoadmap,
      course: { ...mockRoadmap.course, slug: courseSlug },
    };
  },

  getEasyNodeChallenge: async (
    nodeId: string,
  ): Promise<EasyNodeChallengeResponse> => {
    await delay(500);
    return {
      node: {
        id: nodeId,
        lessonId: "lesson2",
        chapterId: "ch1",
        label: "Challenge",
        title: "Knowledge Check",
        status: "available",
      },
      challenge: {
        id: "challenge1",
        type: "multiple_choice",
        title: "Variables in Python",
        question: "What is the correct way to define a variable in Python?",
        options: [
          { id: "A", text: "var x = 5;" },
          { id: "B", text: "x = 5" },
          { id: "C", text: "int x = 5;" },
          { id: "D", text: "$x = 5;" },
        ],
        xp: 15,
        estimatedMinutes: 5,
      },
    };
  },

  submitEasyNodeChallenge: async (
    nodeId: string,
    selectedOptionId: EasyChallengeOptionId,
  ): Promise<SubmitEasyNodeChallengeResponse> => {
    await delay(500);
    return {
      correct: selectedOptionId === "B",
      message:
        selectedOptionId === "B"
          ? "Great job! You selected the right answer."
          : "Incorrect. Try again!",
      correctOptionId: "B",
      explanation:
        "Python is dynamically typed and doesn't require keywords like var or int to define variables. Semicolons are also not required.",
    };
  },

  getMediumRoadmap: async (
    courseSlug: string,
  ): Promise<MediumRoadmapResponse> => {
    const response = await api.get(`/roadmaps/${courseSlug}/medium`);
    return response.data;
  },

  getMediumNodeChallenge: async (
    nodeId: string,
  ): Promise<MediumNodeChallengeResponse> => {
    const response = await api.get(
      `/roadmaps/medium/nodes/${nodeId}/challenge`,
    );
    return response.data;
  },

  submitMediumNodeChallenge: async (
    nodeId: string,
    payload: SubmitMediumNodeChallengePayload,
  ): Promise<SubmitMediumNodeChallengeResponse> => {
    const response = await api.post(
      `/roadmaps/medium/nodes/${nodeId}/challenge/submit`,
      payload,
    );
    return response.data;
  },
};
