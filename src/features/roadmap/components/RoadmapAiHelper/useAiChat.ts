// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import {
  aiChatApi,
  type AiChatMode,
  type AiPrompt,
  type AiUsage,
  type AiRelatedLesson,
  type AiErrorCode,
  type PromptId,
} from "src/features/courses/api/aiChat.api";

export interface ChatMessage {
  id: string;
  promptId: PromptId;
  promptLabel: string;
  answer: string;
  relatedLesson: AiRelatedLesson | null;
}

export function useAiChat(
  nodeId: string | null,
  nodeStatus: string,
  mode: AiChatMode,
  panelState: "collapsed" | "expanded",
) {
  const [prompts, setPrompts] = useState<AiPrompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [activePromptId, setActivePromptId] = useState<PromptId | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [usage, setUsage] = useState<AiUsage | null>(null);
  const [relatedLesson, setRelatedLesson] = useState<AiRelatedLesson | null>(
    null,
  );
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  // Reset when node changes
  useEffect(() => {
    setAnswer(null);
    setActivePromptId(null);
    setRelatedLesson(null);
    setErrorCode(null);
    setCooldownSeconds(0);
    setPrompts([]);
    setHistory([]);
    setUsage(null);
    setLoadingPrompts(false);
  }, [nodeId, mode, nodeStatus]);

  // Fetch prompts only when panel is explicitly opened by user
  useEffect(() => {
    if (panelState !== "expanded") return;
    if (!nodeId || nodeStatus === "locked") return;
    if (prompts.length > 0 || errorCode) return;

    let alive = true;
    setLoadingPrompts(true);

    aiChatApi
      .getNodePrompts(mode, nodeId)
      .then((data) => {
        if (!alive) return;
        setPrompts(data.prompts || []);
        setUsage(data.usage);
      })
      .catch((err) => {
        if (!alive) return;
        const status = err?.response?.status;
        const code = err?.response?.data?.code;

        if (status === 401) {
          setErrorCode("UNAUTHORIZED");
        } else if (status === 503) {
          setErrorCode("SERVICE_UNAVAILABLE");
        } else if (code) {
          setErrorCode(code);
        } else {
          setErrorCode("UNKNOWN");
        }
        setPrompts([]);
      })
      .finally(() => {
        if (alive) setLoadingPrompts(false);
      });

    return () => {
      alive = false;
    };
  }, [panelState, nodeId, mode, nodeStatus, prompts.length, errorCode]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setErrorCode(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const isLimitReached =
    errorCode === "DAILY_LIMIT_REACHED" || (usage && usage.remaining <= 0);
  const chipsDisabled = asking || !!isLimitReached || cooldownSeconds > 0;

  const handleAskPrompt = useCallback(
    async (promptId: PromptId) => {
      if (!nodeId || asking || chipsDisabled) return;

      if (activePromptId && answer) {
        const promptLabel =
          prompts.find((p) => p.id === activePromptId)?.label || "";
        setHistory((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            promptId: activePromptId,
            promptLabel,
            answer,
            relatedLesson,
          },
        ]);
      }

      setAsking(true);
      setActivePromptId(promptId);
      setAnswer(null);
      setErrorCode(null);

      try {
        const data = await aiChatApi.askNodePrompt(mode, nodeId, promptId);
        setAnswer(data.answer);
        setUsage(data.usage);
        if (data.relatedLesson) {
          setRelatedLesson(data.relatedLesson);
        }
      } catch (err: any) {
        const status = err?.response?.status;
        const code = err?.response?.data?.code as AiErrorCode | undefined;
        const retryAfter = err?.response?.data?.retryAfter;

        if (status === 503) {
          setErrorCode("SERVICE_UNAVAILABLE");
        } else if (code === "AI_COOLDOWN" && retryAfter) {
          setErrorCode("AI_COOLDOWN");
          setCooldownSeconds(retryAfter);
        } else if (code) {
          setErrorCode(code);
          if (err?.response?.data?.usage) {
            setUsage(err.response.data.usage);
          }
        } else if (status !== 401) {
          setErrorCode("UNKNOWN");
        }
      } finally {
        setAsking(false);
      }
    },
    [
      nodeId,
      mode,
      asking,
      chipsDisabled,
      activePromptId,
      answer,
      prompts,
      relatedLesson,
    ],
  );

  return {
    prompts,
    loadingPrompts,
    asking,
    answer,
    activePromptId,
    history,
    usage,
    relatedLesson,
    errorCode,
    cooldownSeconds,
    chipsDisabled,
    handleAskPrompt,
  };
}
