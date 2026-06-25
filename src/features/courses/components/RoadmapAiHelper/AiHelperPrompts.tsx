import React from "react";
import {
  PROMPT_ICONS,
  type AiPrompt,
  type PromptId,
  type AiUsage,
} from "../../api/aiChat.api";
import LucideIcon from "../../../../components/ui/LucideIcon";

interface AiHelperPromptsProps {
  activePromptId: PromptId | null;
  prompts: AiPrompt[];
  chipsDisabled: boolean;
  aiPrimary: string;
  usage: AiUsage | null;
  handleAskPrompt: (promptId: PromptId) => void;
}

export function AiHelperPrompts({
  activePromptId,
  prompts,
  chipsDisabled,
  aiPrimary,
  usage,
  handleAskPrompt,
}: AiHelperPromptsProps) {
  return (
    <div className="mb-2 mt-4">
      <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
        {activePromptId ? "Ask another question" : "Ask Pet about this topic"}
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
                <LucideIcon name={icon} className="text-[18px] shrink-0" style={{ color: chipsDisabled ?"var(--color-on-surface-variant)" : aiPrimary, }} />
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
          <LucideIcon name="bedtime" className="text-[#ef4444] text-[20px]" />
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#ef4444]">
              Pet is resting!
            </span>
            <span className="text-[11px] font-medium text-[#ef4444]/80 mt-0.5">
              You've reached your daily limit. Please come back tomorrow for
              more Pet helps!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
