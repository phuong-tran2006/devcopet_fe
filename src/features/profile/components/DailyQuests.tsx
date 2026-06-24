import React, { useEffect, useState, useCallback } from "react";
import { Check, Target, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  dailyMissionApi,
  type DailyMissionNotificationItem,
  type DailyMissionRedirect,
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
    default:
      return { to: "/course" };
  }
}

const DailyQuests = () => {
  const [notif, setNotif] = useState<DailyMissionNotificationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [devDebug, setDevDebug] = useState<any>(null);
  const navigate = useNavigate();

  const fetchMission = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      setDevDebug(null);
      const response = await dailyMissionApi.getDailyMissionNotifications(20);

      const debugReason = response.debug?.reason;
      if (
        debugReason === "NO_CANDIDATES_OR_GENERATION_FAILED" ||
        debugReason === "NO_PUBLISHED_COURSE" ||
        debugReason === "PROVIDER_ERRORS_OR_NO_CANDIDATES"
      ) {
        setError(true);
        setNotif(null);
        if (import.meta.env.DEV) {
          console.debug("[DailyQuests] Generation failed:", response.debug);
          setDevDebug(response.debug);
        }
        return;
      }

      const data = response.items[0];
      setNotif(data);

      // Auto-retry if generating
      if (data?.status === "generating") {
        setTimeout(() => fetchMission(), 2000);
      }
    } catch (err) {
      console.error("Failed to load daily mission:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMission();
  }, [fetchMission]);

  const handleQuestClick = () => {
    if (!notif) return;

    if (notif.status === "available" && notif.missionId) {
      dailyMissionApi.markDailyMissionOpened(notif.missionId);
    }

    const target = resolveDailyMissionRedirect(notif.redirect);
    if (target) {
      navigate(target as any);
    }
  };

  return (
    <div className="bg-surface border border-outline/20 rounded-2xl p-6 w-full mb-6 transition-colors duration-300 shadow-sm">
      <h2 className="text-xl font-bold text-on-surface mb-6 transition-colors duration-300">
        Daily Quests
      </h2>
      <div className="space-y-3">
        {error ? (
          <div className="flex flex-col items-center justify-center p-6 gap-3 bg-error-container/20 border border-error/30 rounded-xl">
            <span className="text-sm text-on-surface-variant text-center">
              Daily mission is not available yet.
            </span>
            {devDebug && (
              <div className="text-xs text-error/80 mt-2 bg-error-container/50 p-2 rounded-lg text-left w-full break-words">
                <strong>Dev Error:</strong> {devDebug.reason}
                {devDebug.candidateDiagnostics && (
                  <pre className="mt-1 opacity-70 whitespace-pre-wrap overflow-x-auto text-[10px]">
                    {JSON.stringify(devDebug.candidateDiagnostics, null, 2)}
                  </pre>
                )}
              </div>
            )}
            <button
              onClick={fetchMission}
              className="mt-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-primary-fixed-dim text-on-primary-fixed rounded-lg hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        ) : loading && !notif ? (
          <div className="flex flex-col items-center justify-center p-8 gap-3 bg-surface-container border border-outline/20 rounded-xl">
            <Loader2 className="w-6 h-6 animate-spin text-primary-fixed-dim" />
            <span className="text-sm text-on-surface-variant">
              Loading your quests...
            </span>
          </div>
        ) : notif?.status === "generating" ? (
          <div className="flex items-center justify-between p-4 rounded-xl border bg-surface-container border-outline/20">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#fbbf24]/15 text-[#fbbf24]">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-on-surface font-bold">
                  {notif.title}
                </span>
                <span className="text-xs text-on-surface-variant italic">
                  {notif.message}
                </span>
              </div>
            </div>
          </div>
        ) : notif?.status === "available" ? (
          <div
            onClick={handleQuestClick}
            className="flex items-center justify-between p-4 rounded-xl border bg-surface-container border-outline/20 cursor-pointer hover:bg-on-surface/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-outline bg-transparent group-hover:border-primary-fixed-dim transition-colors">
                <Target
                  size={16}
                  className="text-primary-fixed-dim opacity-50 group-hover:opacity-100"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-on-surface font-bold">
                  {notif.title}
                </span>
                <span className="text-xs text-on-surface-variant italic">
                  {notif.message}
                </span>
              </div>
            </div>
            <span className="text-primary-fixed-dim text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {notif.ctaLabel || "Start →"}
            </span>
          </div>
        ) : notif?.status === "empty" ? (
          <div
            onClick={handleQuestClick}
            className={`flex items-center justify-between p-4 rounded-xl border bg-surface-container-highest border-transparent ${notif.redirect ? "cursor-pointer hover:bg-on-surface/10" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-fixed-dim border border-primary-fixed-dim text-white shadow-[0_0_10px_rgba(0,218,248,0.5)]">
                <Sparkles size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-on-surface-variant line-through opacity-70">
                  {notif.title}
                </span>
                <span className="text-xs text-on-surface-variant italic opacity-80">
                  {notif.message}
                </span>
              </div>
            </div>
            <span className="text-primary-fixed-dim text-xs font-bold opacity-50">
              DONE
            </span>
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-on-surface-variant">
            No active quests right now.
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyQuests;
