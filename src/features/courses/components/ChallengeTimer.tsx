import { useEffect, useState } from "react";
import LucideIcon from "../../../components/ui/LucideIcon";

interface ChallengeTimerProps {
  timeLimitSeconds?: number;
  onTimeout: () => void;
  paused?: boolean;
}

const ChallengeTimer = ({
  timeLimitSeconds,
  onTimeout,
  paused = false,
}: ChallengeTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (typeof timeLimitSeconds === "number" && timeLimitSeconds > 0) {
      setTimeLeft(timeLimitSeconds);
    } else {
      setTimeLeft(null);
    }
  }, [timeLimitSeconds]);

  useEffect(() => {
    if (timeLeft === null || paused) return;

    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout, paused]);

  if (timeLeft === null) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 10;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold tracking-widest transition-colors ${
        isWarning
          ? "border-red-500/50 bg-red-50 text-red-600 dark:border-red-400/50 dark:bg-red-950/30 dark:text-red-400"
          : "border-slate-200 bg-white text-slate-600 dark:border-[#263b44] dark:bg-[#111c23] dark:text-on-surface-variant"
      }`}
    >
      <LucideIcon
        name="timer"
        className={`text-[14px] ${isWarning ? "animate-pulse" : ""}`}
      />
      <span className={isWarning ? "animate-pulse" : ""}>{formattedTime}</span>
    </div>
  );
};

export default ChallengeTimer;
