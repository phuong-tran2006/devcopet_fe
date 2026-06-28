import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import LucideIcon from "../ui/LucideIcon";
import {
  dailyQuestsApi,
  type DailyMission,
  type TodayDailyMissionsResponse,
} from "../../features/profile/api/dailyQuests.api";
import { useTheme } from "../../contexts/ThemeContext";

interface DailyMissionDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const DailyMissionDropdown = ({
  isOpen,
  onToggle,
  onClose,
}: DailyMissionDropdownProps) => {
  const { triggerHaptic } = useTheme();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<TodayDailyMissionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);

  // Fetch missions function
  const fetchMissions = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await dailyQuestsApi.getTodayDailyMissions();
      setData(res);
    } catch (err) {
      console.error("Failed to fetch daily missions:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchMissions();
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const resolveDailyMissionCtaPath = (ctaPath?: string): string => {
    if (!ctaPath) return "/course";

    if (ctaPath.startsWith("/lessons/") || ctaPath.startsWith("/lessons")) {
      return "/course";
    }

    const allowedPrefixes = [
      "/course",
      "/courses",
      "/roadmap",
      "/profile",
      "/arena",
      "/leaderboard",
    ];

    if (
      allowedPrefixes.some(
        (prefix) => ctaPath === prefix || ctaPath.startsWith(prefix + "/"),
      )
    ) {
      return ctaPath;
    }

    return "/course";
  };

  const handleStart = async (id: string, ctaPath?: string) => {
    triggerHaptic(40);
    try {
      await dailyQuestsApi.markDailyMissionOpened(id);
      const safePath = resolveDailyMissionCtaPath(ctaPath);
      navigate({ to: safePath });
      onClose();
    } catch (err) {
      console.error("Failed to start mission:", err);
    }
  };

  const handleContinue = (ctaPath?: string) => {
    triggerHaptic(40);
    const safePath = resolveDailyMissionCtaPath(ctaPath);
    navigate({ to: safePath });
    onClose();
  };

  const completedNormal = data?.progress?.completedNormal ?? 0;
  const totalNormal = data?.progress?.totalNormal ?? 4;
  const missions = data?.missions ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      case "OPENED":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "PENDING":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "DISMISSED":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      case "FAILED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "LOCKED":
        return "bg-slate-800/60 text-slate-500 border-slate-800";
      default:
        return "bg-slate-500/25 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center transition-all text-on-surface relative ${
          isOpen ? "bg-on-surface/10 border-primary-fixed-dim/45 shadow-[0_0_15px_rgba(0,218,248,0.25)]" : "hover:bg-on-surface/10"
        }`}
      >
        <LucideIcon name="assignment" className="text-[20px]" />
        {/* Active/In-Progress Badge */}
        {missions.some((m) => m.status === "OPENED" || m.status === "PENDING") && (
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute top-[52px] right-[-80px] sm:right-[-40px] w-[350px] sm:w-[380px] bg-surface-container-high/95 backdrop-blur-xl border border-on-surface/10 rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300 origin-top-right z-50 ${
          isOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-on-surface/10 flex justify-between items-center bg-on-surface/5">
          <div>
            <h3 className="font-headline-sm text-[17px] font-black text-on-surface tracking-wider">
              DAILY MISSIONS
            </h3>
            <p className="text-[12px] text-on-surface-variant font-semibold mt-0.5">
              {completedNormal} / {totalNormal} Normal Completed
            </p>
          </div>
          <button
            onClick={fetchMissions}
            disabled={loading}
            className="w-8 h-8 rounded-lg border border-outline/10 flex items-center justify-center hover:bg-on-surface/5 text-on-surface-variant transition-colors disabled:opacity-55"
          >
            <LucideIcon name="refresh" className={`text-[16px] ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* List Content */}
        <div className="p-4 flex flex-col gap-3 max-h-[420px] overflow-y-auto custom-scrollbar">
          {loading && !data ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
              <div className="w-8 h-8 border-2 border-primary-fixed-dim border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[13px] font-semibold tracking-wider">Loading daily missions...</span>
            </div>
          ) : error ? (
            <div className="py-10 text-center flex flex-col items-center justify-center gap-4">
              <span className="text-[13px] text-error font-semibold">Could not load daily missions.</span>
              <button
                onClick={fetchMissions}
                className="px-4 py-2 rounded-lg bg-primary-fixed-dim text-on-primary-fixed text-[12px] font-bold tracking-widest hover:bg-primary-container transition-colors"
              >
                RETRY
              </button>
            </div>
          ) : missions.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-on-surface-variant">
              <LucideIcon name="info" className="text-[28px] opacity-45" />
              <span className="text-[14px] font-bold text-on-surface">No daily missions yet.</span>
              <span className="text-[12px] italic">Try again later.</span>
            </div>
          ) : (
            missions.map((mission) => {
              const isHardcore = mission.missionKind === "HARDCORE";
              const isLocked = mission.status === "LOCKED";
              const isExpanded = expandedMissionId === mission.id;

              return (
                <div
                  key={mission.id}
                  className={`bg-on-surface/5 border border-on-surface/10 rounded-2xl p-4 flex flex-col gap-3 relative transition-all ${
                    isHardcore
                      ? "border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent"
                      : ""
                  } ${isLocked ? "opacity-60" : ""}`}
                >
                  {/* Top row: Badges and Title */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${getStatusColor(mission.status)}`}>
                        {mission.status}
                      </span>
                      {isHardcore && (
                        <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded border border-red-500/40 bg-red-500/10 text-red-400">
                          HARDCORE
                        </span>
                      )}
                      {mission.sourceType === "STARTER" && (
                        <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-500/10 text-cyan-400">
                          STARTER
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Message */}
                  <div className="flex flex-col">
                    <span className="text-[14px] font-black text-on-surface leading-snug line-clamp-2 break-words">
                      {mission.title}
                    </span>
                    <span className="text-[12.5px] text-on-surface-variant leading-relaxed mt-1 line-clamp-2 break-words">
                      {mission.message}
                    </span>

                    {/* Expanded Detail Message */}
                    {isExpanded && mission.detailMessage && (
                      <div className="mt-2.5 pt-2.5 border-t border-on-surface/5 text-[11.5px] text-on-surface-variant/80 italic leading-relaxed">
                        {mission.detailMessage}
                      </div>
                    )}
                  </div>

                  {/* Actions / Info Row */}
                  <div className="flex justify-between items-center gap-3 mt-1">
                    {/* Expand/Collapse Toggle */}
                    {mission.detailMessage ? (
                      <button
                        onClick={() => {
                          triggerHaptic(30);
                          setExpandedMissionId(isExpanded ? null : mission.id);
                        }}
                        className="text-[11px] font-bold text-primary-fixed-dim hover:text-primary-fixed uppercase tracking-wider flex items-center gap-1"
                      >
                        {isExpanded ? "Show Less" : "View More"}
                        <LucideIcon name={isExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"} className="text-[12px]" />
                      </button>
                    ) : (
                      <div />
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {mission.status === "PENDING" && (
                        <button
                          onClick={() => handleStart(mission.id, mission.ctaPath)}
                          disabled={!mission.ctaPath}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-[11px] font-black uppercase tracking-wider transition-colors"
                        >
                          {mission.ctaPath ? "Start" : "Route unavailable"}
                        </button>
                      )}
                      {mission.status === "OPENED" && (
                        <button
                          onClick={() => handleContinue(mission.ctaPath)}
                          disabled={!mission.ctaPath}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-[11px] font-black uppercase tracking-wider transition-colors"
                        >
                          {mission.ctaPath ? "Continue" : "Route unavailable"}
                        </button>
                      )}
                      {mission.status === "LOCKED" && (
                        <span className="text-[11px] font-bold text-on-surface-variant/55 italic">
                          Locked
                        </span>
                      )}
                      {mission.status === "COMPLETED" && (
                        <span className="text-[11px] font-bold text-teal-400 flex items-center gap-1">
                          <LucideIcon name="check" className="text-[14px]" />
                          Completed
                        </span>
                      )}
                      {mission.status === "DISMISSED" && (
                        <span className="text-[11px] font-bold text-slate-500 italic">
                          Unavailable
                        </span>
                      )}
                      {mission.status === "FAILED" && (
                        <span className="text-[11px] font-bold text-red-400 italic">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Praise / Footer */}
        {data?.praise && !loading && !error && (
          <div className="px-5 py-3 bg-on-surface/5 border-t border-on-surface/10 text-center">
            <p className="text-[11.5px] italic text-primary-fixed-dim tracking-wide font-medium">
              "{data.praise}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyMissionDropdown;
