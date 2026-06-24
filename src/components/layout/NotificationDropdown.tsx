import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Target,
  Trophy,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  dailyMissionApi,
  type DailyMissionNotification,
  type DailyMissionRedirect,
} from "../../features/daily-missions/api/dailyMission.api";

// ─── Redirect Helper ─────────────────────────────────────────────────────────

function resolveDailyMissionRedirect(
  redirect: DailyMissionRedirect | null,
): { to: string; params?: Record<string, string> } | null {
  if (!redirect) return null;

  switch (redirect.routeType) {
    case "ROADMAP_NODE": {
      // nodeId format: python-basic-medium-c1-n2
      const nodeId = redirect.targetId || "";
      const parts = nodeId.match(/^(.+?)-(easy|medium|hard)-c(\d+)-n(\d+)$/);
      if (parts) {
        const courseSlug = parts[1];
        const mode = parts[2];
        return {
          to: `/roadmap/${courseSlug}/${mode}/nodes/${nodeId}/challenge` as any,
        };
      }
      // Fallback: go to roadmap
      return { to: "/roadmap" };
    }

    case "COURSE":
      return { to: "/course" };

    case "QUIZ":
      return { to: "/course" };

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

// ─── Component ────────────────────────────────────────────────────────────────

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [missionNotif, setMissionNotif] =
    useState<DailyMissionNotification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup retry timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const fetchMissionNotification = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const notif = await dailyMissionApi.getDailyMissionNotification();
      setMissionNotif(notif);

      // Auto-retry if generating
      if (notif.status === "generating") {
        const delay = (notif as { retryAfterMs?: number }).retryAfterMs ?? 2000;
        retryTimeoutRef.current = setTimeout(async () => {
          try {
            const retried = await dailyMissionApi.getDailyMissionNotification();
            setMissionNotif(retried);
          } catch {
            // Keep showing generating state
          }
        }, delay);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchMissionNotification();
    }
  }, [isOpen, fetchMissionNotification]);

  // Also fetch on mount to get unread badge
  useEffect(() => {
    fetchMissionNotification();
  }, [fetchMissionNotification]);

  const handleNotificationClick = async (notif: DailyMissionNotification) => {
    if (notif.status === "generating") return;

    // Mark opened if it's an available mission
    if (notif.status === "available" && notif.missionId) {
      dailyMissionApi.markDailyMissionOpened(notif.missionId);
      // Mark as read locally
      setMissionNotif((prev) =>
        prev && prev.status === "available" ? { ...prev, unread: false } : prev,
      );
    }

    // Resolve redirect
    const target = resolveDailyMissionRedirect(notif.redirect);
    if (target) {
      navigate(target as any);
    }
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    setMissionNotif((prev) =>
      prev && prev.status === "available" ? { ...prev, unread: false } : prev,
    );
  };

  const hasUnread =
    missionNotif?.status === "available" && missionNotif?.unread === true;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center transition-all text-on-surface relative ${
          isOpen ? "bg-on-surface/10" : "hover:bg-on-surface/10"
        }`}
      >
        <Bell className="w-5 h-5" strokeWidth={1.5} />
        {/* Unread Badge */}
        {hasUnread && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#4ade80] text-[10px] flex items-center justify-center text-black font-bold animate-pulse">
            1
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute top-[52px] right-[-80px] w-[340px] bg-surface-container-high/95 backdrop-blur-xl border border-on-surface/10 rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-300 origin-top-right z-50 ${
          isOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-on-surface/10 flex justify-between items-center">
          <h3 className="font-headline-sm text-[18px] font-bold text-on-surface">
            Notifications
          </h3>
          {hasUnread && (
            <button
              onClick={handleMarkAllRead}
              className="text-primary-fixed-dim text-[11px] font-bold tracking-widest uppercase hover:text-primary-fixed transition-colors"
            >
              MARK ALL AS READ
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {/* Loading State */}
          {loading && !missionNotif && (
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-primary-fixed-dim animate-spin" />
              <span className="text-sm text-on-surface-variant">
                Loading your missions…
              </span>
            </div>
          )}

          {/* Error State */}
          {error && !missionNotif && (
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <AlertCircle className="w-6 h-6 text-on-surface-variant/50" />
              <span className="text-sm text-on-surface-variant text-center">
                Couldn't load notifications right now.
              </span>
              <button
                onClick={fetchMissionNotification}
                className="text-xs text-primary-fixed-dim font-bold uppercase tracking-wider hover:text-primary-fixed transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {/* Mission Notification */}
          {missionNotif && !loading && (
            <>
              {/* ── Available Mission ── */}
              {missionNotif.status === "available" && (
                <div
                  onClick={() => handleNotificationClick(missionNotif)}
                  className="bg-on-surface/5 border border-on-surface/10 rounded-2xl p-4 flex gap-4 relative cursor-pointer hover:bg-on-surface/10 transition-colors group"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#4ade80]/15 text-[#4ade80]">
                    <Target className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 pr-4">
                    <span className="text-[15px] font-bold text-on-surface mb-1">
                      {missionNotif.title}
                    </span>
                    <span className="text-[13px] font-['Open_Sans'] italic text-on-surface-variant leading-relaxed">
                      {missionNotif.message}
                    </span>
                    {missionNotif.ctaLabel && (
                      <span className="text-[12px] font-bold text-primary-fixed-dim mt-2 group-hover:text-primary-fixed transition-colors uppercase tracking-wider">
                        {missionNotif.ctaLabel} →
                      </span>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {missionNotif.unread && (
                    <div className="absolute top-[18px] right-[18px] w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse" />
                  )}
                </div>
              )}

              {/* ── Generating State ── */}
              {missionNotif.status === "generating" && (
                <div className="bg-on-surface/5 border border-on-surface/10 rounded-2xl p-4 flex gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#fbbf24]/15 text-[#fbbf24]">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <span className="text-[15px] font-bold text-on-surface mb-1">
                      {missionNotif.title}
                    </span>
                    <span className="text-[13px] font-['Open_Sans'] italic text-on-surface-variant leading-relaxed">
                      {missionNotif.message}
                    </span>
                  </div>
                </div>
              )}

              {/* ── Empty / Praise ── */}
              {missionNotif.status === "empty" && (
                <div
                  onClick={() => handleNotificationClick(missionNotif)}
                  className={`bg-on-surface/5 border border-on-surface/10 rounded-2xl p-4 flex gap-4 ${
                    missionNotif.redirect
                      ? "cursor-pointer hover:bg-on-surface/10 transition-colors group"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#b3a6d9]/20 text-[#b3a6d9]">
                    {missionNotif.redirect ? (
                      <Trophy className="w-6 h-6" />
                    ) : (
                      <Sparkles className="w-6 h-6" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <span className="text-[15px] font-bold text-on-surface mb-1">
                      {missionNotif.title}
                    </span>
                    <span className="text-[13px] font-['Open_Sans'] italic text-on-surface-variant leading-relaxed">
                      {missionNotif.message}
                    </span>
                    {missionNotif.ctaLabel && missionNotif.redirect && (
                      <span className="text-[12px] font-bold text-primary-fixed-dim mt-2 group-hover:text-primary-fixed transition-colors uppercase tracking-wider">
                        {missionNotif.ctaLabel} →
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
