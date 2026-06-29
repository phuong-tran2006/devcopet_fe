// @ts-nocheck
import LucideIcon from "../../../components/ui/LucideIcon";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../users/store/auth.store";
import type { AiChatMode } from "../api/aiChat.api";
import { useAiChat } from "./RoadmapAiHelper/useAiChat";
import { useTypewriter } from "./RoadmapAiHelper/useTypewriter";
import { AiHelperFab } from "./RoadmapAiHelper/AiHelperFab";
import { AiHelperHeader } from "./RoadmapAiHelper/AiHelperHeader";
import { AiHelperMessages } from "./RoadmapAiHelper/AiHelperMessages";
import { AiHelperPrompts } from "./RoadmapAiHelper/AiHelperPrompts";
import { AiHelperError } from "./RoadmapAiHelper/AiHelperError";

interface RoadmapAiHelperProps {
  nodeId: string | null;
  nodeTitle: string;
  nodeStatus: "locked" | "available" | "completed";
  mode: AiChatMode;
  accentColor: string;
  accentGradient: string;
  accentGlowWeak: string;
}

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
  const { user } = useAuthStore();
  const [panelState, setPanelState] = useState<"collapsed" | "expanded">(
    "collapsed",
  );

  const answerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fabVideoRef = useRef<HTMLVideoElement>(null);
  const headerVideoRef = useRef<HTMLVideoElement>(null);

  const {
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
  } = useAiChat(nodeId, nodeStatus, mode, panelState);

  const displayedAnswer = useTypewriter(answer, asking, 3);

  // Scroll behavior
  useEffect(() => {
    if (asking && scrollContainerRef.current) {
      // Scroll to bottom to show loading shimmer
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    } else if (
      !asking &&
      answer &&
      answerRef.current &&
      scrollContainerRef.current
    ) {
      // Scroll to the top of the answer bubble so user can read from the beginning
      answerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [asking, answer, history]);

  // Navigate to related lesson
  const goToLesson = useCallback(
    (lessonId: string) => {
      navigate({
        to: "/lesson/$lessonId",
        params: { lessonId },
      });
    },
    [navigate],
  );

  // Theme-matching vibrant AI palette
  const aiPrimary = accentColor;
  const aiSecondary = accentColor;
  const headerBgGradient = `linear-gradient(90deg, ${accentColor}15, ${accentColor}05)`;

  const isHidden = !nodeId || nodeStatus === "locked";
  if (isHidden) return null;

  if (panelState === "collapsed") {
    return (
      <AiHelperFab
        setPanelState={setPanelState}
        aiPrimary={aiPrimary}
        fabVideoRef={fabVideoRef}
      />
    );
  }

  return (
    <>
      <div
        ref={panelRef}
        id="ai-helper-panel"
        className="ai-helper-panel fixed bottom-6 right-6 z-[110] flex w-[480px] h-[80vh] min-h-[500px] max-h-[900px] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-[32px] bg-surface/95 transition-colors duration-300"
        style={{
          borderColor: `${aiPrimary}40`,
          boxShadow: `0 24px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 40px ${aiPrimary}15`,
        }}
      >
        <AiHelperHeader
          user={user}
          nodeTitle={nodeTitle}
          usage={usage}
          accentColor={accentColor}
          aiPrimary={aiPrimary}
          headerBgGradient={headerBgGradient}
          setPanelState={setPanelState}
          headerVideoRef={headerVideoRef}
        />

        {/* Content (scrollable) */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${accentColor}40 transparent`,
          }}
        >
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

          {!loadingPrompts && errorCode && (
            <AiHelperError
              errorCode={errorCode}
              cooldownSeconds={cooldownSeconds}
              accentColor={accentColor}
            />
          )}

          {!loadingPrompts && !errorCode && prompts.length === 0 && (
            <div className="py-6 text-center">
              <LucideIcon
                name="psychology"
                className="mb-2 text-[28px] text-on-surface-variant/40"
              />
              <p className="text-[12px] font-medium text-on-surface-variant/60">
                No Pet prompts available for this node.
              </p>
            </div>
          )}

          <AiHelperMessages
            history={history}
            activePromptId={activePromptId}
            prompts={prompts}
            asking={asking}
            answer={answer}
            displayedAnswer={displayedAnswer}
            relatedLesson={relatedLesson}
            aiPrimary={aiPrimary}
            aiSecondary={aiSecondary}
            accentColor={accentColor}
            answerRef={answerRef}
            onNavigateToLesson={goToLesson}
            user={user}
            nodeTitle={nodeTitle}
          />

          {!loadingPrompts &&
            prompts.length > 0 &&
            !activePromptId &&
            history.length === 0 &&
            !asking &&
            (!answer || displayedAnswer === answer) && (
              <AiHelperPrompts
                activePromptId={activePromptId}
                prompts={prompts}
                chipsDisabled={chipsDisabled}
                aiPrimary={aiPrimary}
                usage={usage}
                handleAskPrompt={handleAskPrompt}
              />
            )}
        </div>

        {/* Footer: Usage bar */}
        {usage && (
          <div
            className="shrink-0 border-t px-5 py-3 flex items-center justify-between"
            style={{ borderColor: `${accentColor}15` }}
          >
            <div className="flex items-center gap-2">
              <LucideIcon
                name="auto_awesome"
                className="text-[14px]"
                style={{ color: usage.remaining > 0 ? accentColor : "#ef4444" }}
              />
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
