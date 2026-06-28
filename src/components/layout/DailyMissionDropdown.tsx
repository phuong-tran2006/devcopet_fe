import { useState, useRef, useEffect, useCallback } from "react";
import LucideIcon from "../ui/LucideIcon";
import {
  dailyMissionApi,
  type DailyMission,
  type DailyMissionsResponse,
} from "../../services/dailyMission.api";
import { useAuthStore } from "../../features/users/store/auth.store";

interface DailyMissionDropdownProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

const DailyMissionDropdown = ({
  isOpen: controlledOpen,
  onToggle,
  onClose,
}: DailyMissionDropdownProps) => {
  const { isAuthenticated } = useAuthStore();

  // --- UI state ---
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  }, [onClose]);

  const handleToggle = useCallback(() => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((prev) => !prev);
    }
  }, [onToggle]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Data state ---
  const [data, setData] = useState<DailyMissionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // --- Fetch today's missions ---
  const fetchMissions = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(false);
    try {
      const response = await dailyMissionApi.getTodayDailyMissions();
      setData(response);
    } catch (err) {
      console.error("Failed to load daily missions:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // --- Fetch on mount to check initial progress & show notification badge if needed ---
  useEffect(() => {
    if (isAuthenticated) {
      dailyMissionApi
        .getTodayDailyMissions()
        .then(setData)
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // --- Close on click outside ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose]);

  // --- Close on Escape ---
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleClose]);

  // --- Trigger fetch on open ---
  useEffect(() => {
    if (isOpen) {
      setIsExpanded(false); // reset view more state
      fetchMissions();
    }
  }, [isOpen, fetchMissions]);

  // --- Action Handlers ---
  const handleStartMission = async (id: string) => {
    setActionLoadingId(id);
    try {
      await dailyMissionApi.markDailyMissionOpened(id);
      // Refetch
      const response = await dailyMissionApi.getTodayDailyMissions();
      setData(response);
    } catch (err) {
      console.error("Failed to start mission:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCompleteMission = async (id: string) => {
    setActionLoadingId(id);
    try {
      await dailyMissionApi.markDailyMissionCompleted(id);
      // Refetch
      const response = await dailyMissionApi.getTodayDailyMissions();
      setData(response);
    } catch (err) {
      console.error("Failed to complete mission:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDismissMission = async (id: string) => {
    setActionLoadingId(id);
    try {
      await dailyMissionApi.dismissDailyMission(id);
      // Refetch
      const response = await dailyMissionApi.getTodayDailyMissions();
      setData(response);
    } catch (err) {
      console.error("Failed to dismiss mission:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // --- Badge calculations ---
  const completedCount = data?.progress?.completedNormal ?? 0;
  const totalCount = data?.progress?.totalNormal ?? 4;
  const hasIncompleteNormal =
    data?.missions?.some(
      (m) =>
        m.missionKind === "NORMAL" &&
        (m.status === "PENDING" || m.status === "OPENED")
    ) ?? false;

  // Filter missions shown
  const visibleMissions = data?.missions ?? [];
  // Initially show only up to 4 normal missions if not expanded
  const displayedMissions = isExpanded
    ? visibleMissions
    : visibleMissions.slice(0, 4);

  const showViewMore = !isExpanded && visibleMissions.length > 4;

  const getStatusBadge = (status: DailyMission["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="text-[10px] font-semibold text-white/50 bg-white/5 px-2 py-0.5 rounded">
            Pending
          </span>
        );
      case "OPENED":
        return (
          <span className="text-[10px] font-semibold text-[#00daf8] bg-[#00daf8]/10 px-2 py-0.5 rounded border border-[#00daf8]/20 animate-pulse">
            In Progress
          </span>
        );
      case "COMPLETED":
        return (
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Completed
          </span>
        );
      case "DISMISSED":
        return (
          <span className="text-[10px] font-semibold text-white/20 bg-white/5 px-2 py-0.5 rounded">
            Dismissed
          </span>
        );
      case "LOCKED":
        return (
          <span className="text-[10px] font-semibold text-white/30 bg-white/5 px-2 py-0.5 rounded">
            Locked
          </span>
        );
      case "FAILED":
        return (
          <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Daily Mission Button */}
      <button
        onClick={handleToggle}
        className={`w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center transition-all text-on-surface relative ${
          isOpen ? "bg-on-surface/10" : "hover:bg-on-surface/10"
        }`}
        aria-label="Daily Missions"
      >
        <LucideIcon name="list_checks" className="text-[20px]" />

        {/* Unread Badge / Dot */}
        {hasIncompleteNormal && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00daf8] flex items-center justify-center border border-[#0a0e17] shadow-[0_0_8px_rgba(0,218,248,0.6)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0a0e17]" />
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute top-[52px] right-[-50px] w-[380px] bg-[#0d1320]/98 backdrop-blur-xl border border-[#00daf8]/15 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(0,218,248,0.08)] overflow-hidden transition-all duration-300 origin-top-right z-50 ${
          isOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/8 flex justify-between items-center bg-[#0d1320]/50">
          <div className="flex flex-col">
            <h3 className="text-[16px] font-bold text-white tracking-tight">
              Daily Missions
            </h3>
            <span className="text-[11px] font-medium text-white/50">
              Today: {completedCount} / {totalCount} completed
            </span>
          </div>
          {data?.progress?.hardcoreUnlocked && (
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              Hardcore Mode
            </span>
          )}
        </div>

        {/* Content Area */}
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col gap-3 p-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex gap-3 p-3 rounded-xl bg-white/5"
                >
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="py-10 px-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-red-500/10 flex items-center justify-center">
                <LucideIcon
                  name="warning"
                  className="text-[24px] text-red-400"
                />
              </div>
              <p className="text-sm text-white/60 mb-3">
                Could not load daily missions.
              </p>
              <button
                onClick={fetchMissions}
                className="text-[13px] font-semibold text-[#00daf8] hover:text-[#5eecff] transition-colors px-4 py-1.5 rounded-lg border border-[#00daf8]/20 hover:border-[#00daf8]/40"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && visibleMissions.length === 0 && (
            <div className="py-10 px-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center">
                <LucideIcon
                  name="list_checks"
                  className="text-[24px] text-white/30"
                />
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                No daily missions yet.
                <br />
                Try again later.
              </p>
            </div>
          )}

          {/* Mission List */}
          {!loading && !error && visibleMissions.length > 0 && (
            <div className="flex flex-col gap-2 p-3">
              {displayedMissions.map((mission) => {
                const isPending = mission.status === "PENDING";
                const isOpened = mission.status === "OPENED";
                const isCompleted = mission.status === "COMPLETED";
                const isLocked = mission.status === "LOCKED";
                const isFailed = mission.status === "FAILED";
                const isDismissed = mission.status === "DISMISSED";

                const isHardcore = mission.missionKind === "HARDCORE";
                const isLoading = actionLoadingId === mission.id;

                return (
                  <div
                    key={mission.id}
                    className={`flex flex-col p-3.5 rounded-xl border transition-all duration-200 ${
                      isCompleted
                        ? "bg-emerald-500/5 border-emerald-500/10 opacity-70"
                        : isFailed
                          ? "bg-red-500/5 border-red-500/10 opacity-70"
                          : isDismissed
                            ? "bg-white/5 border-white/5 opacity-40"
                            : isLocked
                              ? "bg-[#0d1320]/40 border-white/5 opacity-55"
                              : "bg-[#00daf8]/5 border-[#00daf8]/10"
                    }`}
                  >
                    {/* Top Row: Kind & Status Badge */}
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                          isHardcore
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-[#00daf8]/15 text-[#00daf8]"
                        }`}
                      >
                        {isHardcore ? "HARDCORE" : "NORMAL"}
                      </span>
                      {getStatusBadge(mission.status)}
                    </div>

                    {/* Mission Text */}
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-white mb-0.5">
                        {mission.title}
                      </span>
                      <span className="text-[12px] text-white/60 leading-relaxed">
                        {mission.message}
                      </span>

                      {/* Detail Message if Expanded */}
                      {isExpanded && mission.detailMessage && (
                        <span className="text-[11px] text-white/40 mt-1.5 italic bg-black/20 p-2 rounded border border-white/5">
                          {mission.detailMessage}
                        </span>
                      )}
                    </div>

                    {/* Hardcore Locked Info */}
                    {isHardcore && isLocked && (
                      <div className="mt-3 text-[11px] text-amber-400/70 flex items-center gap-1.5">
                        <LucideIcon name="lock" className="text-[12px]" />
                        <span>
                          Unlock after completing {totalCount} / {totalCount}{" "}
                          normal missions.
                        </span>
                      </div>
                    )}

                    {/* Action Row */}
                    {!isCompleted && !isLocked && !isDismissed && !isFailed && (
                      <div className="mt-3 flex gap-2 justify-end items-center">
                        {/* Dismiss action (only for non-essential status) */}
                        {(isPending || isOpened) && (
                          <button
                            onClick={() => handleDismissMission(mission.id)}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/20 text-white/40 hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Dismiss Mission"
                          >
                            <LucideIcon name="close" className="text-[14px]" />
                          </button>
                        )}

                        {isPending && (
                          <button
                            onClick={() => handleStartMission(mission.id)}
                            disabled={isLoading}
                            className="text-[12px] font-bold text-[#0a0e17] bg-[#00daf8] hover:bg-[#5eecff] transition-all px-4 py-1.5 rounded-lg disabled:opacity-50"
                          >
                            {isLoading ? "Starting..." : "Start"}
                          </button>
                        )}

                        {isOpened && (
                          <button
                            onClick={() => handleCompleteMission(mission.id)}
                            disabled={isLoading}
                            className="text-[12px] font-bold text-[#0a0e17] bg-emerald-400 hover:bg-emerald-300 transition-all px-4 py-1.5 rounded-lg disabled:opacity-50"
                          >
                            {isLoading ? "Verifying..." : "Complete"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer — View More */}
        {!loading && !error && visibleMissions.length > 0 && (
          <div className="px-5 py-3 border-t border-white/8 bg-[#0d1320]/50">
            {showViewMore ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full text-center text-[13px] font-semibold text-[#00daf8] hover:text-[#5eecff] transition-colors py-1.5 rounded-lg hover:bg-[#00daf8]/5"
              >
                View more
              </button>
            ) : (
              <p className="text-center text-[12px] text-white/25 py-1">
                {isExpanded ? "All missions visible" : ""}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyMissionDropdown;
