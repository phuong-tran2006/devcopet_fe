// @ts-nocheck
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import MarkdownRenderer from "../../../components/MarkdownRenderer";
import {
  aiChatApi,
  PROMPT_ICONS,
  type AiChatMode,
  type AiPrompt,
  type AiUsage,
  type AiRelatedLesson,
  type AiErrorCode,
  type PromptId,
} from "../api/aiChat.api";
import petVideo from "../../../assets/videos/conpet.mp4";
import { useAuthStore } from "../../users/store/auth.store";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RoadmapAiHelperProps {
  nodeId: string | null;
  nodeTitle: string;
  nodeStatus: "locked" | "available" | "completed";
  mode: AiChatMode;
  accentColor: string;
  accentGradient: string;
  accentGlowWeak: string;
}

interface ChatMessage {
  id: string;
  promptId: PromptId;
  promptLabel: string;
  answer: string;
  relatedLesson: AiRelatedLesson | null;
}

type PanelState = "collapsed" | "expanded";

// ─── Error message mapping ───────────────────────────────────────────────────

const ERROR_MESSAGES: Record<
  string,
  { icon: string; title: string; description: string }
> = {
  DAILY_LIMIT_REACHED: {
    icon: "block",
    title: "Daily Limit Reached",
    description: "You've used all your AI helps for today. Come back tomorrow!",
  },
  AI_COOLDOWN: {
    icon: "hourglass_top",
    title: "Cooldown Active",
    description: "Please wait a moment before asking again.",
  },
  AI_REQUEST_IN_PROGRESS: {
    icon: "pending",
    title: "Request In Progress",
    description: "A previous request is still being processed.",
  },
  AI_GLOBAL_LIMIT_REACHED: {
    icon: "cloud_off",
    title: "System Busy",
    description: "AI service is at capacity. Please try again later.",
  },
  SERVICE_UNAVAILABLE: {
    icon: "cloud_off",
    title: "AI is Resting",
    description:
      "The AI service is temporarily down or overloaded. Please try again later.",
  },
  UNAUTHORIZED: {
    icon: "lock",
    title: "Login Required",
    description: "Please log in to chat with the AI Helper.",
  },
  UNKNOWN: {
    icon: "error",
    title: "Something Went Wrong",
    description: "An unexpected error occurred. Please try again.",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

const RoadmapAiHelper = ({
  nodeId,
  nodeTitle,
  nodeStatus,
  mode,
  accentColor,
  accentGradient,
  accentGlowWeak,
}: RoadmapAiHelperProps) => {
  const navigate = useNavigate();
  const answerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── State ──
  const [panelState, setPanelState] = useState<PanelState>("collapsed");
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
  const { user } = useAuthStore();
  const [displayedAnswer, setDisplayedAnswer] = useState<string>("");

  const fabVideoRef = useRef<HTMLVideoElement>(null);
  const headerVideoRef = useRef<HTMLVideoElement>(null);

  // Theme-matching vibrant AI palette
  const aiPrimary = accentColor;
  const aiSecondary = accentColor;
  const panelBgGradient =
    "linear-gradient(145deg, rgba(7, 18, 23, 0.95) 0%, rgba(13, 35, 41, 0.95) 100%)";
  const headerBgGradient = `linear-gradient(90deg, ${accentColor}15, ${accentColor}05)`;

  // ── Derived ──
  const isHidden = !nodeId || nodeStatus === "locked" || mode === "hard";
  const isLimitReached =
    errorCode === "DAILY_LIMIT_REACHED" || (usage && usage.remaining <= 0);
  const chipsDisabled = asking || !!isLimitReached || cooldownSeconds > 0;

  // ── Reset when node changes ──
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
    // Collapse panel when node changes so user must re-open
    setPanelState("collapsed");
  }, [nodeId, mode, nodeStatus]);

  // ── Fetch prompts only when panel is explicitly opened by user ──
  useEffect(() => {
    if (panelState !== "expanded") return;
    if (!nodeId || nodeStatus === "locked" || mode === "hard") return;
    // Don't re-fetch if we already have prompts for this node
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
  }, [panelState, nodeId, mode, nodeStatus]);

  // ── Cooldown timer ──
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

  // ── Scroll to bottom when typing ──
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [answer, displayedAnswer, asking, history]);

  // ── Typewriter Effect ──
  useEffect(() => {
    if (!answer || asking) {
      setDisplayedAnswer("");
      return;
    }

    let currentLength = 0;
    const speed = 3; // Reveal 3 characters per tick
    const interval = setInterval(() => {
      currentLength += speed;
      if (currentLength >= answer.length) {
        setDisplayedAnswer(answer);
        clearInterval(interval);
      } else {
        setDisplayedAnswer(answer.slice(0, currentLength));
      }
    }, 15);

    return () => clearInterval(interval);
  }, [answer, asking]);

  // Video will naturally loop using the `loop` attribute.

  // ── Ask prompt handler ──
  const handleAskPrompt = useCallback(
    async (promptId: PromptId) => {
      if (!nodeId || asking || chipsDisabled) return;

      // Push current active prompt & answer to history before replacing
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
        setUsage(data.usage); // Only update usage from BE response
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
          // Update usage if present in error response
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

  // ── Navigate to related lesson ──
  const goToLesson = useCallback(() => {
    if (!relatedLesson) return;
    navigate({
      to: "/lesson/$lessonId",
      params: { lessonId: relatedLesson.id },
    });
  }, [relatedLesson, navigate]);

  // ── Don't render if hidden ──
  if (isHidden) return null;

  // ── Collapsed FAB ──
  if (panelState === "collapsed") {
    return (
      <>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id="green-screen-filter" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1   0    0   0   0
                      0   1    0   0   0
                      0   0    1   0   0
                      1.5 -3   1.5 1  -0.1"
            />
          </filter>
        </svg>
        <button
          id="ai-helper-fab"
          onClick={() => setPanelState("expanded")}
          onMouseEnter={() => {
            if (fabVideoRef.current) {
              fabVideoRef.current.currentTime = 0;
              fabVideoRef.current.play().catch(() => {});
            }
          }}
          className="ai-helper-fab group fixed bottom-24 right-8 z-[110] flex h-[100px] w-[100px] items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-[0_8px_16px_rgba(168,85,247,0.5)]"
          aria-label="Open AI Helper"
        >
          {/* Speech Bubble */}
          <div
            className="absolute -top-6 -left-16 z-10 w-max origin-bottom-right rounded-2xl rounded-br-sm px-3.5 py-1.5 text-[12px] font-extrabold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: `1px solid ${aiPrimary}60`,
              backdropFilter: "blur(4px)",
            }}
          >
            Ask me!
          </div>

          <video
            ref={fabVideoRef}
            src={`${petVideo}?v=4`}
            autoPlay
            muted
            playsInline
            className="h-[140%] w-[140%] max-w-none object-contain pointer-events-none"
            style={{
              filter: "url(#green-screen-filter)",
              WebkitMaskImage:
                "radial-gradient(circle at center, black 60%, transparent 95%)",
              maskImage:
                "radial-gradient(circle at center, black 60%, transparent 95%)",
            }}
          />
        </button>
      </>
    );
  }

  // ── Expanded Panel ──
  const errorInfo = errorCode
    ? ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN
    : null;

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="green-screen-filter-panel" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1   0    0   0   0
                  0   1    0   0   0
                  0   0    1   0   0
                  1.5 -3   1.5 1  -0.1"
          />
        </filter>
      </svg>
      <div
        ref={panelRef}
        id="ai-helper-panel"
        className="ai-helper-panel fixed bottom-6 right-6 z-[110] flex w-[480px] h-[80vh] min-h-[500px] max-h-[900px] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-[32px]"
        style={{
          background: panelBgGradient,
          borderColor: `${aiPrimary}40`,
          boxShadow: `0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 40px ${aiPrimary}15`,
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex shrink-0 items-center gap-3 border-b px-5 py-4"
          style={{
            borderColor: `${aiPrimary}25`,
            background: headerBgGradient,
          }}
        >
          <div
            className="relative flex h-10 w-10 shrink-0 items-center justify-center cursor-pointer transition-transform hover:scale-110"
            onMouseEnter={() => {
              if (headerVideoRef.current) {
                headerVideoRef.current.currentTime = 0;
                headerVideoRef.current.play().catch(() => {});
              }
            }}
          >
            <video
              ref={headerVideoRef}
              src={`${petVideo}?v=4`}
              autoPlay
              muted
              playsInline
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[150%] w-[150%] max-w-none object-contain pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              style={{
                filter: "url(#green-screen-filter-panel)",
                WebkitMaskImage:
                  "radial-gradient(circle at center, black 50%, transparent 80%)",
                maskImage:
                  "radial-gradient(circle at center, black 50%, transparent 80%)",
              }}
            />
          </div>
          <div className="flex flex-1 flex-col min-w-0">
            <span className="text-[15px] font-extrabold text-white truncate">
              {user
                ? `${user.name || user.username || "User"}'s Pet Helper`
                : "Pet Helper"}
            </span>
            <span className="text-[11px] font-medium text-on-surface-variant truncate">
              {nodeTitle}
            </span>
          </div>

          {/* Usage badge */}
          {usage && (
            <div
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
              style={{
                borderColor:
                  usage.remaining > 0
                    ? `${accentColor}40`
                    : "rgba(239,68,68,0.4)",
                backgroundColor:
                  usage.remaining > 0
                    ? `${accentColor}15`
                    : "rgba(239,68,68,0.1)",
              }}
            >
              <span
                className="material-symbols-outlined text-[13px]"
                style={{ color: usage.remaining > 0 ? accentColor : "#ef4444" }}
              >
                {usage.remaining > 0 ? "bolt" : "block"}
              </span>
              <span
                className="text-[10px] font-bold tracking-wide"
                style={{ color: usage.remaining > 0 ? accentColor : "#ef4444" }}
              >
                {usage.remaining}/{usage.dailyLimit}
              </span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={() => setPanelState("collapsed")}
            className="flex h-7 w-7 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Minimize Pet Helper"
          >
            <span className="material-symbols-outlined text-[18px]">
              remove
            </span>
          </button>
        </div>

        {/* ── Content (scrollable) ── */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${accentColor}40 transparent`,
          }}
        >
          {/* Loading prompts */}
          {loadingPrompts && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div
                className="h-8 w-8 animate-spin rounded-full border-[3px] border-t-transparent"
                style={{
                  borderColor: `${accentColor}40`,
                  borderTopColor: "transparent",
                }}
              />
              <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Loading prompts…
              </span>
            </div>
          )}

          {/* Error state */}
          {!loadingPrompts && errorInfo && (
            <div
              className="mb-4 mt-2 flex flex-col items-center justify-center gap-4 rounded-2xl border px-6 py-8 text-center shadow-lg"
              style={{
                borderColor:
                  errorCode === "DAILY_LIMIT_REACHED" ||
                  errorCode === "AI_GLOBAL_LIMIT_REACHED"
                    ? "rgba(239,68,68,0.3)"
                    : errorCode === "UNAUTHORIZED"
                      ? `${accentColor}40`
                      : `${accentColor}25`,
                backgroundColor:
                  errorCode === "DAILY_LIMIT_REACHED" ||
                  errorCode === "AI_GLOBAL_LIMIT_REACHED"
                    ? "rgba(239,68,68,0.1)"
                    : errorCode === "UNAUTHORIZED"
                      ? `${accentColor}10`
                      : `${accentColor}08`,
                boxShadow:
                  errorCode === "UNAUTHORIZED"
                    ? `inset 0 0 40px ${accentColor}05`
                    : "none",
              }}
            >
              <span
                className="material-symbols-outlined text-[48px] drop-shadow-md"
                style={{
                  color:
                    errorCode === "DAILY_LIMIT_REACHED" ||
                    errorCode === "AI_GLOBAL_LIMIT_REACHED"
                      ? "#ef4444"
                      : accentColor,
                }}
              >
                {errorCode === "UNAUTHORIZED" ? "lock_person" : errorInfo.icon}
              </span>
              <div className="flex flex-col gap-2">
                <span className="text-[18px] font-extrabold text-white">
                  {errorCode === "UNAUTHORIZED"
                    ? "Pet Feature Locked"
                    : errorInfo.title}
                </span>
                <span className="text-[13px] leading-relaxed text-on-surface-variant max-w-[90%] mx-auto">
                  {errorCode === "UNAUTHORIZED"
                    ? "You must be logged in to chat with the Pet Helper. Please log in to your account to unlock this feature!"
                    : errorInfo.description}
                  {cooldownSeconds > 0 && (
                    <span
                      className="ml-1 font-bold"
                      style={{ color: accentColor }}
                    >
                      ({cooldownSeconds}s)
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* No prompts */}
          {!loadingPrompts && !errorCode && prompts.length === 0 && (
            <div className="py-6 text-center">
              <span className="material-symbols-outlined mb-2 text-[28px] text-on-surface-variant/40">
                psychology
              </span>
              <p className="text-[12px] font-medium text-on-surface-variant/60">
                No Pet prompts available for this node.
              </p>
            </div>
          )}

          {/* Render History Messages */}
          {history.map((msg) => (
            <div key={msg.id} className="mb-6">
              <div className="mb-4 flex justify-end">
                <div
                  className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-[14px] font-medium text-white shadow-sm"
                  style={{
                    backgroundColor: `${aiSecondary}40`,
                    border: `1px solid ${aiSecondary}60`,
                  }}
                >
                  {msg.promptLabel}
                </div>
              </div>
              <div className="ai-answer-appear">
                <div
                  className="mb-4 rounded-xl border px-6 py-5 shadow-sm"
                  style={{
                    borderColor: `${aiPrimary}30`,
                    backgroundColor: "rgba(15, 23, 42, 0.4)",
                    boxShadow: `inset 0 0 30px ${aiPrimary}10`,
                  }}
                >
                  <div className="ai-answer-content text-[14px] leading-relaxed text-on-surface">
                    <MarkdownRenderer content={msg.answer} />
                  </div>
                </div>
                {msg.relatedLesson && (
                  <button
                    onClick={() => {
                      navigate({
                        to: "/lesson/$lessonId",
                        params: { lessonId: msg.relatedLesson!.id },
                      });
                    }}
                    className="group mb-2 flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      borderColor: `${accentColor}30`,
                      backgroundColor: `${aiSecondary}15`,
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[18px] shrink-0"
                      style={{ color: aiSecondary }}
                    >
                      menu_book
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                        Review Related Lesson
                      </span>
                      <span
                        className="text-[13px] font-semibold truncate"
                        style={{ color: aiSecondary }}
                      >
                        {msg.relatedLesson.title}
                      </span>
                    </div>
                    <span
                      className="material-symbols-outlined text-[16px] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                      style={{ color: accentColor }}
                    >
                      arrow_forward
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* User prompt bubble (Active) */}
          {(() => {
            if (!activePromptId) return null;
            const askedPrompt = prompts.find((p) => p.id === activePromptId);
            if (!askedPrompt) return null;
            return (
              <div className="mb-4 flex justify-end">
                <div
                  className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-[14px] font-medium text-white shadow-sm"
                  style={{
                    backgroundColor: `${aiSecondary}40`,
                    border: `1px solid ${aiSecondary}60`,
                  }}
                >
                  {askedPrompt.label}
                </div>
              </div>
            );
          })()}

          {/* Loading answer shimmer */}
          {asking && (
            <div className="mb-4 flex flex-col gap-2">
              <div
                className="ai-shimmer h-3 w-[85%] rounded-full"
                style={{ backgroundColor: `${aiPrimary}20` }}
              />
              <div
                className="ai-shimmer h-3 w-[70%] rounded-full"
                style={{
                  backgroundColor: `${aiSecondary}20`,
                  animationDelay: "0.15s",
                }}
              />
              <div
                className="ai-shimmer h-3 w-[90%] rounded-full"
                style={{
                  backgroundColor: `${aiPrimary}15`,
                  animationDelay: "0.3s",
                }}
              />
              <div
                className="ai-shimmer h-3 w-[60%] rounded-full"
                style={{
                  backgroundColor: `${aiSecondary}20`,
                  animationDelay: "0.45s",
                }}
              />
            </div>
          )}

          {/* Answer */}
          {answer && !asking && (
            <div ref={answerRef} className="ai-answer-appear">
              <div
                className="mb-4 rounded-xl border px-6 py-5 shadow-sm"
                style={{
                  borderColor: `${aiPrimary}30`,
                  backgroundColor: "rgba(15, 23, 42, 0.4)",
                  boxShadow: `inset 0 0 30px ${aiPrimary}10`,
                }}
              >
                <div className="ai-answer-content text-[14px] leading-relaxed text-on-surface">
                  <MarkdownRenderer content={displayedAnswer} />
                </div>
              </div>

              {/* Related Lesson Link */}
              {relatedLesson && (
                <button
                  id="ai-related-lesson-link"
                  onClick={goToLesson}
                  className="group mb-2 flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    borderColor: `${accentColor}30`,
                    backgroundColor: `${aiSecondary}15`,
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[18px] shrink-0"
                    style={{ color: aiSecondary }}
                  >
                    menu_book
                  </span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                      Review Related Lesson
                    </span>
                    <span
                      className="text-[13px] font-semibold truncate"
                      style={{ color: aiSecondary }}
                    >
                      {relatedLesson.title}
                    </span>
                  </div>
                  <span
                    className="material-symbols-outlined text-[16px] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{ color: accentColor }}
                  >
                    arrow_forward
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Prompt chips (Remaining/Unused) */}
          {!loadingPrompts && prompts.length > 0 && (
            <>
              {/* Initial Greeting Bubble */}
              {!activePromptId && !answer && (
                <div className="mb-6 mt-2 flex items-start gap-3 animate-fade-in-up">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden"
                    style={{
                      backgroundColor: `${aiPrimary}20`,
                      border: `1px solid ${aiPrimary}40`,
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ color: aiPrimary }}
                    >
                      pets
                    </span>
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm px-4 py-3 text-[13px] leading-relaxed text-on-surface shadow-sm"
                    style={{
                      backgroundColor: "rgba(15, 23, 42, 0.4)",
                      border: `1px solid ${aiPrimary}30`,
                    }}
                  >
                    Hi{" "}
                    <strong>{user?.name || user?.username || "there"}</strong>!{" "}
                    <br />
                    I'm your personal learning companion. I can help you
                    understand more about <strong>{nodeTitle}</strong>. <br />
                    Choose a question below to get started!
                  </div>
                </div>
              )}

              <div className="mb-2 mt-4">
                <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                  {activePromptId
                    ? "Ask another question"
                    : "Ask Pet about this topic"}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {prompts
                    .filter((prompt) => prompt.id !== activePromptId)
                    .map((prompt) => {
                      const icon = PROMPT_ICONS[prompt.id] || "chat";

                      return (
                        <button
                          key={prompt.id}
                          id={`ai-prompt-${prompt.id}`}
                          onClick={() => handleAskPrompt(prompt.id)}
                          disabled={chipsDisabled}
                          className={`ai-prompt-chip group flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                            chipsDisabled
                              ? "cursor-not-allowed opacity-45"
                              : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                          }`}
                          style={{
                            borderColor: chipsDisabled
                              ? "var(--color-outline-variant)"
                              : `${aiPrimary}40`,
                            backgroundColor: chipsDisabled
                              ? "rgba(255,255,255,0.02)"
                              : `${aiPrimary}10`,
                          }}
                        >
                          <span
                            className="material-symbols-outlined text-[18px] shrink-0"
                            style={{
                              color: chipsDisabled
                                ? "var(--color-on-surface-variant)"
                                : aiPrimary,
                            }}
                          >
                            {icon}
                          </span>
                          <span
                            className="text-[12px] font-semibold leading-tight"
                            style={{
                              color: chipsDisabled
                                ? "var(--color-on-surface-variant)"
                                : "var(--color-on-surface)",
                            }}
                          >
                            {prompt.label}
                          </span>
                        </button>
                      );
                    })}
                </div>

                {/* Out of Quota Message */}
                {usage && usage.remaining <= 0 && (
                  <div
                    className="mt-4 flex items-center gap-3 rounded-xl p-3.5 border shadow-sm animate-fade-in-up"
                    style={{
                      borderColor: "rgba(239, 68, 68, 0.3)",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                    }}
                  >
                    <span className="material-symbols-outlined text-[#ef4444] text-[20px]">
                      bedtime
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-[#ef4444]">
                        Pet is resting!
                      </span>
                      <span className="text-[11px] font-medium text-[#ef4444]/80 mt-0.5">
                        You've reached your daily limit. Please come back
                        tomorrow for more Pet helps!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Footer: Usage bar ── */}
        {usage && (
          <div
            className="shrink-0 border-t px-5 py-3 flex items-center justify-between"
            style={{ borderColor: `${accentColor}15` }}
          >
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ color: usage.remaining > 0 ? accentColor : "#ef4444" }}
              >
                auto_awesome
              </span>
              <span className="text-[11px] font-medium text-on-surface-variant">
                Pet helps left:{" "}
                <span
                  className="font-bold"
                  style={{
                    color: usage.remaining > 0 ? accentColor : "#ef4444",
                  }}
                >
                  {usage.remaining}
                </span>
                <span className="text-on-surface-variant/50">
                  {" "}
                  / {usage.dailyLimit}
                </span>
              </span>
            </div>
            {asking && (
              <div className="flex items-center gap-1.5">
                <div
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: accentColor }}
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: accentColor }}
                >
                  Thinking…
                </span>
              </div>
            )}
          </div>
        )}

        {/* Bottom accent line */}
        <div
          className="h-[2px] w-full shrink-0"
          style={{ background: accentGradient }}
        />
      </div>
    </>
  );
};

export default RoadmapAiHelper;
