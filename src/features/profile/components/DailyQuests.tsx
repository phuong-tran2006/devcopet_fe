import { useEffect, useState, useCallback } from "react";
import {
  Check,
  Target,
  Loader2,
  Sparkles,
  Flame,
  Lock,
  X,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  dailyMissionApi,
  type DailyMissionTodayResponse,
  type DailyMissionNotificationItem,
  type DailyMissionRedirect,
  type DailyMissionProgress,
} from "../../../features/daily-missions/api/dailyMission.api";

// ─── Redirect Helper ─────────────────────────────────────────────────────────

function resolveDailyMissionRedirect(
  redirect: DailyMissionRedirect | null,
): { to: string; params?: Record<string, string> } | null {
  if (!redirect) return null;

  switch (redirect.routeType) {
    case "ROADMAP_NODE": {
      const nodeId = redirect.targetId || "";
      const parts = nodeId.match(/^(.+?)-(easy|medium|hard)-c(\d+)-n(\d+)$/);
      if (parts) {
        const courseSlug = parts[1];
        const mode = parts[2];
        return {
          to: `/roadmap/${courseSlug}/${mode}/nodes/${nodeId}/challenge` as any,
        };
      }
      return { to: "/roadmap" };
    }
    case "COURSE":
    case "QUIZ":
      return {
        to: "/courses/$courseId" as any,
        params: {
          courseId:
            !redirect.targetId || redirect.targetId === "python"
              ? "python-basic"
              : redirect.targetId,
        },
      };
    case "ARENA":
      return { to: "/arena" };
    case "HARD_LEVEL":
      return { to: "/roadmap" };
    case "DASHBOARD":
      return { to: "/profile" };
    case "LOGIN":
      return { to: "/login" };
    default:
      return {
        to: "/courses/$courseId" as any,
        params: { courseId: "python-basic" },
      };
  }
}

// ─── Progress Bar ────────────────────────────────────────────────────────────

function MissionProgressBar({ progress }: { progress: DailyMissionProgress }) {
  const pct = Math.round(
    (progress.completedNormal / progress.totalNormal) * 100,
  );
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold tracking-wider uppercase text-on-surface-variant">
          Today's Progress
        </span>
        <span className="text-xs font-bold text-primary-fixed-dim">
          {progress.completedNormal}/{progress.totalNormal}
        </span>
      </div>
      <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background:
              pct === 100
                ? "linear-gradient(90deg, #22c55e, #10b981)"
                : "linear-gradient(90deg, var(--color-primary-fixed-dim), #06b6d4)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Mission Card ────────────────────────────────────────────────────────────

function MissionCard({
  mission,
  isActive,
  onMissionClick,
  onDismiss,
}: {
  mission: DailyMissionNotificationItem;
  isActive: boolean;
  onMissionClick: (mission: DailyMissionNotificationItem) => void;
  onDismiss?: (mission: DailyMissionNotificationItem) => void;
}) {
  const isCompleted = mission.status === "completed";
  const isDismissed = mission.status === "dismissed";
  const isLocked = mission.status === "locked";
  const isHardcore = mission.missionKind === "HARDCORE";
  const isClickable =
    mission.status === "available" || mission.status === "opened";

  return (
    <div
      onClick={() => isClickable && onMissionClick(mission)}
      className={`
        group relative flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300
        ${
          isActive
            ? "bg-primary-fixed-dim/8 border-primary-fixed-dim/30 shadow-[0_0_12px_rgba(0,128,128,0.12)]"
            : isCompleted
              ? "bg-surface-container border-outline/10 opacity-70"
              : isDismissed
                ? "bg-surface-container border-outline/10 opacity-50"
                : isLocked
                  ? "bg-surface-container border-outline/10 opacity-40"
                  : "bg-surface-container border-outline/20 hover:bg-on-surface/5"
        }
        ${isClickable ? "cursor-pointer" : "cursor-default"}
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
          ${
            isCompleted
              ? "bg-primary-fixed-dim text-white"
              : isDismissed
                ? "bg-surface-container-highest text-on-surface-variant/50"
                : isLocked
                  ? "bg-surface-container-highest text-on-surface-variant/30"
                  : isHardcore
                    ? "border border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b]"
                    : isActive
                      ? "border border-primary-fixed-dim bg-primary-fixed-dim/15 text-primary-fixed-dim"
                      : "border border-outline/30 bg-transparent text-on-surface-variant/60"
          }
        `}
      >
        {isCompleted ? (
          <Check size={14} strokeWidth={3} />
        ) : isDismissed ? (
          <X size={14} />
        ) : isLocked ? (
          <Lock size={14} />
        ) : isHardcore ? (
          <Flame size={14} />
        ) : (
          <Target
            size={14}
            className={isActive ? "opacity-100" : "opacity-60"}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-bold truncate transition-colors ${
            isCompleted
              ? "text-on-surface-variant line-through"
              : isDismissed
                ? "text-on-surface-variant/60 line-through"
                : isLocked
                  ? "text-on-surface-variant/40"
                  : "text-on-surface"
          }`}
        >
          {isHardcore && !isCompleted && !isDismissed && (
            <span className="text-[#f59e0b] mr-1">★</span>
          )}
          {mission.title}
        </p>
        <p
          className={`text-xs mt-0.5 line-clamp-1 ${
            isCompleted || isDismissed
              ? "text-on-surface-variant/40"
              : "text-on-surface-variant"
          }`}
        >
          {mission.message}
        </p>
      </div>

      {/* Right side */}
      <div className="flex-shrink-0 flex items-center gap-1.5">
        {isClickable && mission.estimatedMinutes && (
          <span className="text-[10px] font-medium text-on-surface-variant/50 hidden sm:inline">
            {mission.estimatedMinutes}m
          </span>
        )}
        {isClickable && (
          <ChevronRight
            size={16}
            className="text-primary-fixed-dim opacity-0 group-hover:opacity-100 transition-opacity"
          />
        )}
        {isClickable && onDismiss && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(mission);
            }}
            className="ml-1 p-1 rounded-md text-on-surface-variant/30 hover:text-on-surface-variant/60 hover:bg-on-surface/5 transition-all opacity-0 group-hover:opacity-100"
            title="Dismiss mission"
          >
            <X size={12} />
          </button>
        )}
        {isCompleted && (
          <span className="text-[10px] font-bold text-primary-fixed-dim uppercase tracking-wider">
            Done
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Praise Banner ───────────────────────────────────────────────────────────

function PraiseBanner({
  title,
  message,
  ctaLabel,
  onCtaClick,
}: {
  title: string;
  message: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}) {
  return (
    <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-primary-fixed-dim/10 via-primary-fixed-dim/5 to-transparent border border-primary-fixed-dim/20">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-primary-fixed-dim/20 text-primary-fixed-dim shadow-[0_0_10px_rgba(0,218,248,0.3)]">
          <Sparkles size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-on-surface">{title}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">{message}</p>
          {ctaLabel && onCtaClick && (
            <button
              onClick={onCtaClick}
              className="mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary-fixed-dim text-on-primary-fixed rounded-lg hover:opacity-90 transition-opacity"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const DailyQuests = () => {
  const [todayData, setTodayData] = useState<DailyMissionTodayResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [devDebug, setDevDebug] = useState<any>(null);
  const navigate = useNavigate();

  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      setDevDebug(null);

      const response = await dailyMissionApi.getDailyMissionToday();

      if (
        response.status === "GENERATION_FAILED" ||
        response.status === "EMPTY"
      ) {
        setError(true);
        setTodayData(null);
        if (import.meta.env.DEV && response.debug) {
          console.debug("[DailyQuests] Generation failed:", response.debug);
          setDevDebug(response.debug);
        }
        return;
      }

      setTodayData(response);

      // Auto-retry if generating
      if (response.status === "GENERATING") {
        setTimeout(() => fetchMissions(), 2500);
      }
    } catch (err) {
      console.error("Failed to load daily missions:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const handleMissionClick = async (mission: DailyMissionNotificationItem) => {
    if (mission.status === "available" && mission.missionId) {
      await dailyMissionApi.markDailyMissionOpened(mission.missionId);
      // Optimistic update
      setTodayData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          missions: prev.missions.map((m) =>
            m.id === mission.id
              ? { ...m, status: "opened" as const, unread: false }
              : m,
          ),
        };
      });
    }

    const target = resolveDailyMissionRedirect(mission.redirect);
    if (target) {
      navigate(target as any);
    }
  };

  const handleDismiss = async (mission: DailyMissionNotificationItem) => {
    if (!mission.missionId) return;
    const result = await dailyMissionApi.markDailyMissionDismissed(
      mission.missionId,
    );
    if (result) {
      setTodayData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          progress: result.progress,
          missions: prev.missions.map((m) =>
            m.id === mission.id
              ? { ...m, status: "dismissed" as const, unread: false }
              : m,
          ),
        };
      });
    }
  };

  const handleHardcoreClick = () => {
    if (!todayData) return;
    const hardcore = todayData.missions.find(
      (m) => m.missionKind === "HARDCORE",
    );
    if (hardcore) {
      handleMissionClick(hardcore);
    }
  };

  return (
    <div className="bg-surface border border-outline/20 rounded-2xl p-6 w-full mb-6 transition-colors duration-300 shadow-sm">
      <h2 className="text-xl font-bold text-on-surface mb-4 transition-colors duration-300">
        Daily Quests
      </h2>

      {error ? (
        <div className="flex flex-col items-center justify-center p-6 gap-3 bg-error-container/20 border border-error/30 rounded-xl">
          <span className="text-sm text-on-surface-variant text-center">
            Daily missions are not available yet.
          </span>
          {devDebug && (
            <div className="text-xs text-error/80 mt-2 bg-error-container/50 p-2 rounded-lg text-left w-full break-words">
              <strong>Dev Error:</strong>{" "}
              {typeof devDebug === "object"
                ? JSON.stringify(devDebug, null, 2)
                : String(devDebug)}
            </div>
          )}
          <button
            onClick={fetchMissions}
            className="mt-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-primary-fixed-dim text-on-primary-fixed rounded-lg hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      ) : loading && !todayData ? (
        <div className="flex flex-col items-center justify-center p-8 gap-3 bg-surface-container border border-outline/20 rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-primary-fixed-dim" />
          <span className="text-sm text-on-surface-variant">
            Loading your quests...
          </span>
        </div>
      ) : todayData?.status === "GENERATING" ? (
        <div className="flex flex-col items-center justify-center p-8 gap-3 bg-surface-container border border-outline/20 rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#fbbf24]" />
          <span className="text-sm text-on-surface-variant">
            Generating your personalized missions...
          </span>
        </div>
      ) : todayData ? (
        <div className="space-y-3">
          {/* Progress Bar */}
          <MissionProgressBar progress={todayData.progress} />

          {/* Praise Banner */}
          {todayData.praise && (
            <PraiseBanner
              title={todayData.praise.title}
              message={todayData.praise.message}
              ctaLabel={todayData.praise.ctaLabel}
              onCtaClick={
                todayData.praise.ctaLabel ? handleHardcoreClick : undefined
              }
            />
          )}

          {/* Mission List */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
            {todayData.missions
              .filter((m) => m.status !== "failed")
              .map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  isActive={todayData.activeMission?.id === mission.id}
                  onMissionClick={handleMissionClick}
                  onDismiss={
                    mission.status === "available" ||
                    mission.status === "opened"
                      ? handleDismiss
                      : undefined
                  }
                />
              ))}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-on-surface-variant">
          No active quests right now.
        </div>
      )}
    </div>
  );
};

export default DailyQuests;
