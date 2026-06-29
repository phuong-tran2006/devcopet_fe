import { api } from "../../../services/axiosClient";

export type EasyRoadmapNodeStatus = "locked" | "available" | "completed";
export type RoadmapMode = "easy" | "medium" | "hard";

export interface CourseProgressSummary {
  completedLessons: number;
  totalLessons: number;
  percent: number;
}

export interface CourseDetailLesson {
  id: string;
  _id?: string;
  title: string;
  description?: string;
  order?: number;
  status: EasyRoadmapNodeStatus;
  canAccess: boolean;
  [key: string]: unknown;
}

export interface CourseDetailChapter {
  id: string;
  _id?: string;
  title: string;
  order: number;
  status: EasyRoadmapNodeStatus;
  progress: CourseProgressSummary;
  lessons: CourseDetailLesson[];
  [key: string]: unknown;
}

export interface CourseDetailResponse {
  course: {
    id: string;
    _id?: string;
    slug?: string;
    title: string;
    description?: string;
    programmingLanguage?: string;
    level?: string;
    totalChapters?: number;
    totalLessons?: number;
    progress?: CourseProgressSummary;
    [key: string]: unknown;
  };
  chapters: CourseDetailChapter[];
}

export interface RewardSummaryItem {
  label: string;
  amount: number;
  type: string;
}

export interface RewardSummary {
  xp?: number;
  stars?: number;
  coins?: number;
  petExp?: number;
  items?: RewardSummaryItem[];
}

export interface ExplanationSpeaker {
  name: string;
  type: "PET" | "SYSTEM" | string;
}

export interface ChallengeNavigationTarget {
  courseSlug: string;
  mode: RoadmapMode;
}

export interface ChallengeNavigation {
  returnToRoadmap: ChallengeNavigationTarget;
  nextChallenge: {
    nodeId: string;
    mode: RoadmapMode;
    courseSlug: string;
  } | null;
}

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

export interface UserProgressSnapshot {
  exp: number;
  level: number;
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
  explanationSpeaker?: ExplanationSpeaker;
  navigation?: ChallengeNavigation;
  nextNode?: {
    id: string;
    label: string;
    title: string;
    status: EasyRoadmapNodeStatus;
  } | null;
}

export interface SubmitEasyNodeChallengeResponse {
  correct?: boolean;
  message: string;
  correctOptionId?: EasyChallengeOptionId;
  explanation?: string;
  review?: EasyNodeChallengeReview;
  xpAwarded?: number;
  userProgress?: UserProgressSnapshot;
  rewardSummary?: RewardSummary;
  explanationSpeaker?: ExplanationSpeaker;
  navigation?: ChallengeNavigation;
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
  hint?: string;
  hints?: Array<{ id: string; text: string }>;
  explanation?: string;
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
  hint?: string;
  hints?: Array<{ id: string; text: string }>;
  explanation?: string;
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

export type MediumNodeChallengeReview = {
  challengeType?: "multiple_choice" | "drag_drop";
  selectedOptionId?: EasyChallengeOptionId;
  correctOptionId?: EasyChallengeOptionId;
  selectedDropZoneMap?: Record<string, string>;
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
  explanationSpeaker?: ExplanationSpeaker;
  navigation?: ChallengeNavigation;
  nextNode?: {
    id: string;
    label: string;
    title: string;
    status: EasyRoadmapNodeStatus;
  } | null;
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
  xpAwarded?: number;
  userProgress?: UserProgressSnapshot;
  rewardSummary?: RewardSummary;
  explanationSpeaker?: ExplanationSpeaker;
  navigation?: ChallengeNavigation;
}

export type HardChallengeType =
  | "multiple_choice"
  | "code_trace"
  | "bug_hunt"
  | "choose_better_algorithm"
  | "simulation"
  | "fill_missing_line"
  | "drag_drop_matching"
  | "drag_drop"
  | "ordering_steps"
  | "ranking";

export interface HardRoadmapNode {
  id: string;
  chapterId?: string;
  chapterOrder: number;
  order: number;
  label: string;
  title: string;
  type: HardChallengeType;
  status: EasyRoadmapNodeStatus;
  xp: number;
  estimatedMinutes: number;
}

export interface HardRoadmapChapter {
  id: string;
  chapterId?: string;
  title: string;
  order: number;
  nodeCount: number;
  nodes: HardRoadmapNode[];
}

export interface HardRoadmapResponse {
  course: {
    id: string;
    slug: string;
    title: string;
    totalChapters: number;
    totalNodes: number;
  };
  mode: "hard";
  chapters: HardRoadmapChapter[];
}

export interface HardChallengeNode {
  id: string;
  label: string;
  title: string;
  type: HardChallengeType;
  status: EasyRoadmapNodeStatus;
}

export interface HardMultipleChoiceChallenge {
  id: string;
  type:
    | "multiple_choice"
    | "code_trace"
    | "bug_hunt"
    | "choose_better_algorithm"
    | "simulation"
    | "fill_missing_line";
  title: string;
  question: string;
  codeSnippet?: MediumCodeSnippet | null;
  hint?: string;
  hints?: Array<{ id: string; text: string }>;
  explanation?: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  xp: number;
  estimatedMinutes: number;
}

export interface HardDragDropChallenge {
  id: string;
  type: "drag_drop_matching";
  title: string;
  question: string;
  codeSnippet?: MediumCodeSnippet | null;
  hint?: string;
  hints?: Array<{ id: string; text: string }>;
  explanation?: string;
  items: Array<{ id: string; text: string }>;
  choices: Array<{ id: string; text: string }>;
  xp: number;
  estimatedMinutes: number;
}

export interface HardOrderingChallenge {
  id: string;
  type: "ordering_steps" | "ranking";
  title: string;
  question: string;
  codeSnippet?: MediumCodeSnippet | null;
  hint?: string;
  hints?: Array<{ id: string; text: string }>;
  explanation?: string;
  steps?: Array<{ id: string; text: string }>;
  poolItems?: Array<{ id: string; text: string }>;
  xp: number;
  estimatedMinutes: number;
}

export interface HardFillTemplateChallenge {
  id: string;
  type: "drag_drop";
  title: string;
  question: string;
  codeSnippet?: MediumCodeSnippet | null;
  hint?: string;
  hints?: Array<{ id: string; text: string }>;
  explanation?: string;
  template: string;
  poolItems: Array<{ id: string; text: string }>;
  xp: number;
  estimatedMinutes: number;
}

export type HardNodeChallenge =
  | HardMultipleChoiceChallenge
  | HardDragDropChallenge
  | HardOrderingChallenge
  | HardFillTemplateChallenge;

export type HardNodeChallengeReview = {
  correct: boolean;
  explanation: string;
  petFeedback?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  completedAt?: string;
  selectedOptionId?: string;
  correctOptionId?: string;
  matchingMap?: Record<string, string>;
  correctMatchingMap?: Record<string, string>;
  orderedIds?: string[];
  correctOrderedIds?: string[];
  dropZoneMap?: Record<string, string>;
  correctDropZoneMap?: Record<string, string>;
};

export interface HardNodeChallengeResponse {
  node: HardChallengeNode;
  challenge: HardNodeChallenge;
  review?: HardNodeChallengeReview;
  explanationSpeaker?: ExplanationSpeaker;
  navigation?: ChallengeNavigation;
}

export interface OptionPayload {
  type:
    | "multiple_choice"
    | "code_trace"
    | "bug_hunt"
    | "choose_better_algorithm"
    | "simulation"
    | "fill_missing_line";
  selectedOptionId: string;
}

export interface MatchingPayload {
  type: "drag_drop_matching";
  matchingMap: Record<string, string>;
}

export interface DragDropPayload {
  type: "drag_drop";
  dropZoneMap: Record<string, string>;
}

export interface OrderingPayload {
  type: "ordering_steps" | "ranking";
  orderedIds: string[];
}

export type SubmitHardNodeChallengePayload =
  | OptionPayload
  | MatchingPayload
  | DragDropPayload
  | OrderingPayload;

export interface SubmitHardNodeChallengeResponse {
  correct: boolean;
  message: string;
  explanation?: string;
  petFeedback?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  correctOptionId?: string;
  correctMatchingMap?: Record<string, string>;
  correctOrderedIds?: string[];
  correctDropZoneMap?: Record<string, string>;
  xpAwarded?: number;
  userProgress?: UserProgressSnapshot;
  rewardSummary?: RewardSummary;
  explanationSpeaker?: ExplanationSpeaker;
  navigation?: ChallengeNavigation;
}

export interface StartChallengeSessionResponse {
  sessionId: string;
  startedAt: string;
  expiresAt: string;
  serverNow: string;
  timeLimitSeconds: number;
}

export const courseApi = {
  getCourses: async () => {
    const response = await api.get(`/courses`);
    return response.data;
  },

  getCourseDetail: async (courseId: string): Promise<CourseDetailResponse> => {
    const response = await api.get(`/courses/${courseId}/detail`);
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
    const response = await api.get(`/roadmaps/${courseSlug}/easy`);
    return response.data;
  },

  getEasyNodeChallenge: async (
    nodeId: string,
  ): Promise<EasyNodeChallengeResponse> => {
    const response = await api.get(`/roadmaps/easy/nodes/${nodeId}/challenge`);
    return response.data;
  },

  startRoadmapChallengeSession: async (
    courseSlug: string,
    mode: RoadmapMode,
    nodeId: string,
  ): Promise<StartChallengeSessionResponse> => {
    const response = await api.post(
      `/roadmaps/${courseSlug}/${mode}/nodes/${nodeId}/session/start`,
    );
    return response.data;
  },

  submitEasyNodeChallenge: async (
    nodeId: string,
    selectedOptionId: EasyChallengeOptionId,
    sessionId?: string,
  ): Promise<SubmitEasyNodeChallengeResponse> => {
    const response = await api.post(
      `/roadmaps/easy/nodes/${nodeId}/challenge/submit`,
      { selectedOptionId, sessionId, answer: selectedOptionId },
    );
    return response.data;
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
    sessionId?: string,
  ): Promise<SubmitMediumNodeChallengeResponse> => {
    const response = await api.post(
      `/roadmaps/medium/nodes/${nodeId}/challenge/submit`,
      { ...payload, sessionId, answer: payload },
    );
    return response.data;
  },

  getHardRoadmap: async (courseSlug: string): Promise<HardRoadmapResponse> => {
    const response = await api.get(`/roadmaps/${courseSlug}/hard`);
    return response.data;
  },

  getHardNodeChallenge: async (
    nodeId: string,
  ): Promise<HardNodeChallengeResponse> => {
    const response = await api.get(`/roadmaps/hard/nodes/${nodeId}/challenge`);
    return response.data;
  },

  submitHardNodeChallenge: async (
    nodeId: string,
    payload: SubmitHardNodeChallengePayload,
    sessionId?: string,
  ): Promise<SubmitHardNodeChallengeResponse> => {
    const response = await api.post(
      `/roadmaps/hard/nodes/${nodeId}/challenge/submit`,
      { ...payload, sessionId, answer: payload },
    );
    return response.data;
  },

  resetCourseProgress: async (courseId: string): Promise<any> => {
    const response = await api.post(`/courses/${courseId}/reset-progress`);
    return response.data;
  },
};
