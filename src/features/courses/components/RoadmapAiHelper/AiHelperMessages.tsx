import React from "react";
import MarkdownRenderer from "../../../../components/MarkdownRenderer";
import type { ChatMessage } from "./useAiChat";
import type { AiPrompt, PromptId, AiRelatedLesson } from "../../api/aiChat.api";

interface AiHelperMessagesProps {
  history: ChatMessage[];
  activePromptId: PromptId | null;
  prompts: AiPrompt[];
  asking: boolean;
  answer: string | null;
  displayedAnswer: string;
  relatedLesson: AiRelatedLesson | null;
  aiPrimary: string;
  aiSecondary: string;
  accentColor: string;
  answerRef: React.RefObject<HTMLDivElement>;
  onNavigateToLesson: (lessonId: string) => void;
  user: any;
  nodeTitle: string;
}

export function AiHelperMessages({
  history,
  activePromptId,
  prompts,
  asking,
  answer,
  displayedAnswer,
  relatedLesson,
  aiPrimary,
  aiSecondary,
  accentColor,
  answerRef,
  onNavigateToLesson,
  user,
  nodeTitle,
}: AiHelperMessagesProps) {
  return (
    <>
      {/* Initial Greeting Bubble */}
      {!activePromptId && !answer && history.length === 0 && (
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
            className="rounded-2xl rounded-tl-sm px-4 py-3 text-[13px] leading-relaxed text-on-surface shadow-sm bg-surface-container-high/50 transition-colors duration-300"
            style={{
              border: `1px solid ${aiPrimary}30`,
            }}
          >
            Hi <strong>{user?.name || user?.username || "there"}</strong>!{" "}
            <br />
            I'm your personal learning companion. I can help you understand more
            about <strong>{nodeTitle}</strong>. <br />
            Choose a question below to get started!
          </div>
        </div>
      )}

      {/* Render History Messages */}
      {history.map((msg) => (
        <div key={msg.id} className="mb-6">
          <div className="mb-4 flex justify-end">
            <div
              className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-[14px] font-medium text-on-surface shadow-sm transition-colors duration-300"
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
              className="mb-4 rounded-xl border px-6 py-5 shadow-sm bg-surface-container-high/50 transition-colors duration-300"
              style={{
                borderColor: `${aiPrimary}30`,
                boxShadow: `inset 0 0 30px ${aiPrimary}10`,
              }}
            >
              <div className="ai-answer-content text-[14px] leading-relaxed text-on-surface">
                <MarkdownRenderer content={msg.answer} />
              </div>
            </div>
            {msg.relatedLesson && (
              <button
                onClick={() => onNavigateToLesson(msg.relatedLesson!.id)}
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
              className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-[14px] font-medium text-on-surface shadow-sm transition-colors duration-300"
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
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: aiPrimary }}
            />
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: aiPrimary }}
            >
              Thinking…
            </span>
          </div>
          <div className="flex flex-col gap-2">
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
        </div>
      )}

      {/* Answer */}
      {answer && !asking && (
        <div ref={answerRef} className="ai-answer-appear">
          <div
            className="mb-4 rounded-xl border px-6 py-5 shadow-sm bg-surface-container-high/50 transition-colors duration-300"
            style={{
              borderColor: `${aiPrimary}30`,
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
              onClick={() => onNavigateToLesson(relatedLesson.id)}
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
    </>
  );
}
