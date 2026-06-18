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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockRoadmap: EasyRoadmapResponse = {
  course: {
    id: "python-basic",
    slug: "python-basic",
    title: "Python Basic",
    totalChapters: 2,
    totalLessons: 4,
    totalNodes: 4,
  },
  mode: "easy",
  chapters: [
    {
      id: "ch1",
      title: "Introduction",
      order: 1,
      lessonCount: 2,
      nodeCount: 2,
      nodes: [
        {
          id: "node1",
          lessonId: "lesson1",
          chapterId: "ch1",
          chapterOrder: 1,
          lessonOrder: 1,
          label: "Getting Started",
          title: "Introduction to Python",
          status: "completed",
          xp: 10,
          duration: 5,
        },
        {
          id: "node2",
          lessonId: "lesson2",
          chapterId: "ch1",
          chapterOrder: 1,
          lessonOrder: 2,
          label: "Variables",
          title: "Variables and Data Types",
          status: "available",
          xp: 15,
          duration: 10,
        },
      ],
    },
    {
      id: "ch2",
      title: "Control Flow",
      order: 2,
      lessonCount: 2,
      nodeCount: 2,
      nodes: [
        {
          id: "node3",
          lessonId: "lesson3",
          chapterId: "ch2",
          chapterOrder: 2,
          lessonOrder: 1,
          label: "If Statements",
          title: "Conditional Logic",
          status: "locked",
          xp: 20,
          duration: 15,
        },
        {
          id: "node4",
          lessonId: "lesson4",
          chapterId: "ch2",
          chapterOrder: 2,
          lessonOrder: 2,
          label: "Loops",
          title: "For and While Loops",
          status: "locked",
          xp: 25,
          duration: 20,
        },
      ],
    },
  ],
};

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
};
