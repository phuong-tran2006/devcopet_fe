import React from "react";
import { ERROR_MESSAGES } from "./constants";
import LucideIcon from "../../../../components/ui/LucideIcon";

interface AiHelperErrorProps {
  errorCode: string;
  cooldownSeconds: number;
  accentColor: string;
}

export function AiHelperError({
  errorCode,
  cooldownSeconds,
  accentColor,
}: AiHelperErrorProps) {
  const errorInfo = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN;

  return (
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
      <LucideIcon name={errorCode === "UNAUTHORIZED" ? "lock_person" : errorInfo.icon} className="text-[48px] drop-shadow-md" style={{ color: errorCode ==="DAILY_LIMIT_REACHED" || errorCode ==="AI_GLOBAL_LIMIT_REACHED" ?"#ef4444" : accentColor, }} />
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
            <span className="ml-1 font-bold" style={{ color: accentColor }}>
              ({cooldownSeconds}s)
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
