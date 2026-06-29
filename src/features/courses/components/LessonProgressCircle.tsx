import LucideIcon from "../../../components/ui/LucideIcon";
import { useTheme } from "../../../contexts/ThemeContext";

const LessonProgressCircle = ({
  progress = 0,
  isActive = false,
  isCompleted = false,
}) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const size = 34;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  return (
    <div className="relative flex h-[34px] w-[34px] items-center justify-center shrink-0">
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={isLight ? "rgba(148, 163, 184, 0.15)" : "rgba(148, 163, 184, 0.25)"}
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={isCompleted ? (isLight ? "#10b981" : "#4ade80") : (isLight ? "#0d9488" : "#00daf8")}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      <div
        className={`
          absolute inset-[6px] flex items-center justify-center rounded-full
          ${
            isCompleted
              ? "bg-emerald-500/10 text-emerald-600 dark:bg-[#4ade80]/20 dark:text-[#4ade80]"
              : isActive
                ? "bg-teal-500/10 text-teal-600 dark:bg-primary-fixed-dim/20 dark:text-primary-fixed-dim"
                : "bg-transparent text-slate-400 dark:text-on-surface-variant/50"
          }
        `}
      >
        <LucideIcon
          name={isCompleted ? "check" : isActive ? "play_arrow" : "lock_open"}
          className="text-[16px]"
        />
      </div>
    </div>
  );
};

export default LessonProgressCircle;
