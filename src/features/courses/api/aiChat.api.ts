import { api } from "../../../services/axiosClient";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AiChatMode = "easy" | "medium" | "hard";

export type PromptId =
  | "EXPLAIN_NODE"
  | "SIMPLE_EXAMPLE"
  | "COURSE_CONNECTION"
  | "CHALLENGE_HINT"
  | "COMMON_MISTAKE"
  | "NEXT_STEP";

export interface AiPrompt {
  id: PromptId;
  label: string;
  description?: string;
}

export interface AiUsage {
  remaining: number;
  dailyLimit: number;
}

export interface AiPromptsResponse {
  prompts: AiPrompt[];
  usage: AiUsage;
}

export interface AiRelatedLesson {
  id: string;
  title: string;
  slug?: string;
}

export interface AiAskResponse {
  answer: string;
  usage: AiUsage;
  relatedLesson?: AiRelatedLesson;
}

// Error codes returned by the backend
export type AiErrorCode =
  | "DAILY_LIMIT_REACHED"
  | "AI_COOLDOWN"
  | "AI_REQUEST_IN_PROGRESS"
  | "AI_GLOBAL_LIMIT_REACHED";

export interface AiErrorResponse {
  message: string;
  code?: AiErrorCode;
  retryAfter?: number; // seconds until cooldown expires
}

// ─── Prompt icon mapping ─────────────────────────────────────────────────────

export const PROMPT_ICONS: Record<PromptId, string> = {
  EXPLAIN_NODE: "lightbulb",
  SIMPLE_EXAMPLE: "code",
  COURSE_CONNECTION: "link",
  CHALLENGE_HINT: "emoji_objects",
  COMMON_MISTAKE: "warning",
  NEXT_STEP: "arrow_forward",
};

// ─── API Functions ───────────────────────────────────────────────────────────

export const aiChatApi = {
  /**
   * Fetch available prompts for a specific roadmap node.
   * GET /ai-chat/roadmap/:mode/nodes/:nodeId/prompts
   *
   * Uses _skipAuthRedirect to prevent the global interceptor from
   * redirecting to /login when this endpoint returns 401.
   */
  getNodePrompts: async (
    mode: AiChatMode,
    nodeId: string,
  ): Promise<AiPromptsResponse> => {
    const response = await api.get(
      `/ai-chat/roadmap/${mode}/nodes/${nodeId}/prompts`,
      { _skipAuthRedirect: true } as any,
    );
    return response.data;
  },

  /**
   * Ask an AI prompt for a specific roadmap node.
   * POST /ai-chat/roadmap/:mode/nodes/:nodeId/ask
   */
  askNodePrompt: async (
    mode: AiChatMode,
    nodeId: string,
    promptId: PromptId,
  ): Promise<AiAskResponse> => {
    const response = await api.post(
      `/ai-chat/roadmap/${mode}/nodes/${nodeId}/ask`,
      { promptId },
      { _skipAuthRedirect: true } as any,
    );
    return response.data;
  },
};
