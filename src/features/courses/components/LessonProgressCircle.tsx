interface LessonProgressCircleProps {
  progress?: number;
  isActive?: boolean;
  isCompleted?: boolean;
}

const LessonProgressCircle = ({
  progress = 0,
  isActive = false,
  isCompleted = false,
}: LessonProgressCircleProps) => {
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
          stroke="currentColor"
          className="text-on-surface-variant/20"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          className={isCompleted ? "text-[#4ade80]" : "text-primary-fixed-dim"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
      </svg>

      <div
        className={`
          absolute inset-[6px] flex items-center justify-center rounded-full
          ${
            isCompleted
              ? "bg-[#4ade80]/20 text-[#4ade80]"
              : isActive
                ? "bg-primary-fixed-dim/20 text-primary-fixed-dim"
                : "bg-transparent text-on-surface-variant/50 border border-on-surface-variant/30"
          }
        `}
      >
        <span className="material-symbols-outlined text-[14px]">
          {isCompleted ? "check" : isActive ? "play_arrow" : "lock_open"}
        </span>
      </div>
    </div>
  );
};

export default LessonProgressCircle;
