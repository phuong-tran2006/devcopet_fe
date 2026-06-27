import { useCallback, useEffect, useMemo, useState } from "react";
import LucideIcon from "../../../components/ui/LucideIcon";
import {
  dailyQuestsApi,
  getMissionId,
  type DailyMission,
  type MissionHistoryDay,
  type MissionSummary,
  type TodayMissions,
} from "../api/dailyQuests.api";

const EMPTY_TODAY: TodayMissions = {
  missions: [],
  normalMissions: [],
  hardcoreMission: null,
  hardcoreGenerationStatus: null,
  normalCompleted: 0,
  normalTotal: 4,
};

const getMissionProgress = (mission: DailyMission) => {
  if (mission.status === "COMPLETED") return 100;
  if (typeof mission.progress === "number")
    return Math.min(100, mission.progress);
  if (mission.progress?.percent != null) {
    return Math.min(100, Number(mission.progress.percent));
  }
  if (mission.progress?.current != null && mission.progress?.target) {
    return Math.min(
      100,
      Math.round((mission.progress.current / mission.progress.target) * 100),
    );
  }
  return 0;
};

const getMissionDestination = (mission: DailyMission) => {
  const metadata = mission.metadata || {};
  const explicit =
    mission.deepLink ||
    mission.href ||
    String(metadata.deepLink || metadata.href || "");
  if (explicit.startsWith("/")) return explicit;

  const action = String(mission.actionType || "").toUpperCase();
  const targetType = String(mission.targetType || "").toUpperCase();
  const targetId = String(
    mission.targetId || metadata.lessonId || metadata.courseId || "",
  );

  if (action.includes("FEED") || targetType === "PET") return "/profile";
  if (targetType === "COURSE" && targetId) return `/courses/${targetId}`;
  if (
    targetId &&
    (targetType === "LESSON" ||
      action.includes("LESSON") ||
      action.includes("QUIZ"))
  ) {
    return `/lesson/${targetId}`;
  }
  if (action.includes("ARENA")) return "/arena";
  if (action.includes("ROADMAP") || targetType.includes("ROADMAP")) {
    return "/roadmap";
  }
  return "/course";
};

const formatDate = (value?: string) => {
  if (!value) return "Previous day";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
};

const MissionCard = ({
  mission,
  hardcore = false,
  busy,
  onOpen,
  onDismiss,
}: {
  mission: DailyMission;
  hardcore?: boolean;
  busy: boolean;
  onOpen: (mission: DailyMission) => void;
  onDismiss: (mission: DailyMission) => void;
}) => {
  const completed = mission.status === "COMPLETED";
  const dismissed = mission.status === "DISMISSED";
  const progress = getMissionProgress(mission);
  const canDismiss =
    !hardcore && !completed && !dismissed && mission.canDismiss !== false;

  return (
    <article
      className={`rounded-xl border p-4 transition-all ${
        hardcore
          ? "border-secondary-fixed-dim/35 bg-secondary-fixed-dim/5"
          : completed
            ? "border-primary-fixed-dim/20 bg-primary-fixed-dim/5"
            : "border-outline/20 bg-surface-container/45"
      } ${dismissed ? "opacity-55" : "hover:border-primary-fixed-dim/40"}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            completed
              ? "bg-primary-fixed-dim/15 text-primary-fixed-dim"
              : hardcore
                ? "bg-secondary-fixed-dim/15 text-secondary-fixed-dim"
                : "bg-surface-container-high text-on-surface-variant"
          }`}
        >
          <LucideIcon
            name={
              completed
                ? "check_circle"
                : hardcore
                  ? "workspace_premium"
                  : "flag"
            }
            className="h-[19px] w-[19px]"
          />
        </div>

        <button
          type="button"
          disabled={busy || dismissed}
          onClick={() => onOpen(mission)}
          className="min-w-0 flex-1 text-left disabled:cursor-default"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-sm font-bold ${
                completed || dismissed
                  ? "text-on-surface-variant"
                  : "text-on-surface"
              }`}
            >
              {mission.title || mission.message || "Daily mission"}
            </h3>
            {hardcore && (
              <span className="rounded-full bg-secondary-fixed-dim/15 px-2 py-0.5 text-[9px] font-bold tracking-widest text-secondary-fixed-dim">
                HARDCORE
              </span>
            )}
          </div>
          {(mission.description || (mission.title && mission.message)) && (
            <p className="mt-1 text-xs leading-5 text-on-surface-variant">
              {mission.description || mission.message}
            </p>
          )}

          {!dismissed && (
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    hardcore ? "bg-secondary-fixed-dim" : "bg-primary-fixed-dim"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant">
                {progress}%
              </span>
            </div>
          )}
        </button>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {(mission.rewardXp || mission.xpReward) && (
            <span className="text-[11px] font-bold text-primary-fixed-dim">
              +{mission.rewardXp || mission.xpReward} XP
            </span>
          )}
          {canDismiss && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onDismiss(mission)}
              className="rounded-md px-2 py-1 text-[10px] font-semibold text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface disabled:opacity-50"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const MissionPanel = () => {
  const [today, setToday] = useState<TodayMissions>(EMPTY_TODAY);
  const [summary, setSummary] = useState<MissionSummary>({});
  const [history, setHistory] = useState<MissionHistoryDay[]>([]);
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const loadToday = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const data = await dailyQuestsApi.getTodayMissions();
      setToday(data);
      setError("");
    } catch (err) {
      console.error("Failed to load daily missions", err);
      setError("Daily missions could not be loaded. Please try again.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadToday(true);
    dailyQuestsApi
      .getSummary()
      .then(setSummary)
      .catch(() => undefined);
  }, [loadToday]);

  useEffect(() => {
    if (today.hardcoreGenerationStatus !== "GENERATING") return;
    const timer = window.setInterval(() => void loadToday(), 4000);
    return () => window.clearInterval(timer);
  }, [loadToday, today.hardcoreGenerationStatus]);

  useEffect(() => {
    const refresh = () => window.setTimeout(() => void loadToday(), 700);
    const refreshOnFocus = () => void loadToday();
    window.addEventListener("daily-missions:refresh", refresh);
    window.addEventListener("focus", refreshOnFocus);
    return () => {
      window.removeEventListener("daily-missions:refresh", refresh);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [loadToday]);

  const visibleNormalMissions = useMemo(
    () =>
      today.normalMissions.filter((mission) => mission.status !== "DISMISSED"),
    [today.normalMissions],
  );

  const handleOpen = async (mission: DailyMission) => {
    const id = getMissionId(mission);
    if (!id) return;
    setBusyId(id);
    try {
      // Tracking must happen before navigation.
      const updated = await dailyQuestsApi.markAsOpened(id);
      setToday((current) => ({
        ...current,
        normalMissions: current.normalMissions.map((item) =>
          getMissionId(item) === id ? { ...item, ...updated } : item,
        ),
        hardcoreMission:
          current.hardcoreMission &&
          getMissionId(current.hardcoreMission) === id
            ? { ...current.hardcoreMission, ...updated }
            : current.hardcoreMission,
      }));
      const destination = getMissionDestination(mission);
      if (destination !== window.location.pathname) {
        window.location.assign(destination);
      }
    } catch (err) {
      console.error("Failed to open mission", err);
      setError("Mission could not be opened.");
    } finally {
      setBusyId("");
    }
  };

  const handleDismiss = async (mission: DailyMission) => {
    const id = getMissionId(mission);
    if (!id) return;
    setBusyId(id);
    try {
      await dailyQuestsApi.dismiss(id);
      await loadToday();
    } catch (err) {
      console.error("Failed to dismiss mission", err);
      setError("Only active NORMAL missions can be dismissed.");
    } finally {
      setBusyId("");
    }
  };

  const openHistory = async () => {
    setActiveTab("history");
    if (history.length > 0) return;
    setHistoryLoading(true);
    try {
      setHistory(await dailyQuestsApi.getHistory());
    } catch (err) {
      console.error("Failed to load mission history", err);
      setError("Mission history could not be loaded.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const normalTotal = Math.max(
    today.normalTotal || 4,
    visibleNormalMissions.length,
  );
  const normalCompleted = Math.min(today.normalCompleted, normalTotal);

  return (
    <section className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-sm transition-colors duration-300">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Daily Missions</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Complete activities normally—progress is detected automatically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("today")}
            className={`rounded-lg px-3 py-2 text-xs font-bold ${
              activeTab === "today"
                ? "bg-primary-fixed text-on-primary-fixed"
                : "text-on-surface-variant hover:bg-on-surface/5"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={openHistory}
            className={`rounded-lg px-3 py-2 text-xs font-bold ${
              activeTab === "history"
                ? "bg-primary-fixed text-on-primary-fixed"
                : "text-on-surface-variant hover:bg-on-surface/5"
            }`}
          >
            History
          </button>
          <button
            type="button"
            onClick={() => void loadToday(true)}
            aria-label="Refresh missions"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline/20 text-on-surface-variant hover:text-on-surface"
          >
            <LucideIcon name="refresh" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-error/25 bg-error/10 px-3 py-2 text-xs text-error">
          <LucideIcon name="warning" className="h-4 w-4" />
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-auto">
            ×
          </button>
        </div>
      )}

      {activeTab === "today" ? (
        loading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-sm text-on-surface-variant">
            <LucideIcon name="refresh" className="h-5 w-5 animate-spin" />
            Preparing today's missions…
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Normal missions
                </span>
                <span className="text-xs font-bold text-primary-fixed-dim">
                  {normalCompleted}/{normalTotal} completed
                </span>
              </div>
              <div className="space-y-3">
                {visibleNormalMissions.length > 0 ? (
                  visibleNormalMissions.map((mission) => (
                    <MissionCard
                      key={getMissionId(mission)}
                      mission={mission}
                      busy={busyId === getMissionId(mission)}
                      onOpen={handleOpen}
                      onDismiss={handleDismiss}
                    />
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-outline/30 px-4 py-6 text-center text-sm text-on-surface-variant">
                    No normal missions are available right now.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-secondary-fixed-dim">
                Hardcore mission
              </div>
              {today.hardcoreGenerationStatus === "GENERATING" ? (
                <div className="flex items-center gap-3 rounded-xl border border-secondary-fixed-dim/25 bg-secondary-fixed-dim/5 p-4 text-sm text-on-surface-variant">
                  <LucideIcon
                    name="refresh"
                    className="h-5 w-5 animate-spin text-secondary-fixed-dim"
                  />
                  Generating your Hardcore mission…
                </div>
              ) : today.hardcoreGenerationStatus === "FAILED" ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-error/25 bg-error/5 p-4 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-3">
                    <LucideIcon name="warning" className="h-5 w-5 text-error" />
                    Hardcore generation failed.
                  </span>
                  <button
                    type="button"
                    onClick={() => void loadToday()}
                    className="text-xs font-bold text-primary-fixed-dim"
                  >
                    Retry
                  </button>
                </div>
              ) : today.hardcoreMission ? (
                <MissionCard
                  mission={today.hardcoreMission}
                  hardcore
                  busy={busyId === getMissionId(today.hardcoreMission)}
                  onOpen={handleOpen}
                  onDismiss={handleDismiss}
                />
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-outline/30 p-4 text-sm text-on-surface-variant">
                  <LucideIcon name="lock" className="h-5 w-5" />
                  Complete all {normalTotal} NORMAL missions to unlock Hardcore.
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-outline/15 pt-4 sm:grid-cols-4">
              {[
                [
                  "Completed",
                  summary.completedMissions ?? summary.totalCompleted ?? 0,
                ],
                ["Current streak", summary.currentStreak ?? 0],
                ["Best streak", summary.longestStreak ?? 0],
                ["Mission XP", summary.totalXpEarned ?? 0],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-lg bg-surface-container/40 p-3"
                >
                  <div className="text-lg font-extrabold text-on-surface">
                    {String(value)}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : historyLoading ? (
        <div className="flex justify-center py-12">
          <LucideIcon
            name="refresh"
            className="h-5 w-5 animate-spin text-primary-fixed-dim"
          />
        </div>
      ) : history.length > 0 ? (
        <div className="max-h-[480px] space-y-3 overflow-y-auto pr-1 custom-scrollbar">
          {history.map((day, index) => {
            const missions = day.missions || [];
            const completed =
              day.completedCount ??
              missions.filter((item) => item.status === "COMPLETED").length;
            return (
              <div
                key={String(day._id || day.id || day.localDate || index)}
                className="rounded-xl border border-outline/20 bg-surface-container/35 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-on-surface">
                    {formatDate(day.localDate || day.date)}
                  </span>
                  <span className="text-xs font-bold text-on-surface-variant">
                    {completed}/{day.totalCount ?? missions.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-outline/30 px-4 py-8 text-center text-sm text-on-surface-variant">
          No mission history yet.
        </p>
      )}
    </section>
  );
};

export default MissionPanel;
