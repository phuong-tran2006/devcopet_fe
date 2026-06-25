import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Target,
  Loader2,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Flame,
  Lock,
  Clock,
} from "lucide-react";
import {
  dailyMissionApi,
  type DailyMissionNotificationItem,
  type DailyMissionNotificationsResponse,
} from "../../features/daily-missions/api/dailyMission.api";

// Helper to resolve routes
const resolveDailyMissionRedirect = (
  redirect: DailyMissionNotificationItem["redirect"] | null,
): { to: string; params?: Record<string, string> } => {
  if (!redirect) return { to: "/" };

  if (redirect.targetType === "LESSON" && redirect.targetId) {
    return {
      to: "/lesson/$lessonId" as any,
      params: { lessonId: redirect.targetId },
    };
  }

  if (redirect.targetType === "NODE" && redirect.targetId) {
    const nodeId = redirect.targetId;
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

  switch (redirect.routeType) {
    case "COURSE": {
      const slug =
        redirect.targetId && redirect.targetId !== "python"
          ? redirect.targetId
          : "python-basic";
      return {
        to: "/courses/$courseId" as any,
        params: { courseId: slug },
      };
    }
    case "ROADMAP_NODE": {
      if (redirect.targetId) {
        const nodeId = redirect.targetId;
        const parts = nodeId.match(/^(.+?)-(easy|medium|hard)-c(\d+)-n(\d+)$/);
        if (parts) {
          const courseSlug = parts[1];
          const mode = parts[2];
          return {
            to: `/roadmap/${courseSlug}/${mode}/nodes/${nodeId}/challenge` as any,
          };
        }
      }
      return { to: "/roadmap" };
    }
    case "QUIZ":
      return {
        to: "/courses/$courseId" as any,
        params: { courseId: "python-basic" },
      };
    case "ARENA":
      return { to: "/arena" };
    case "HARD_LEVEL":
      return { to: "/roadmap" };
    case "LOGIN":
      return { to: "/login" };
    case "DASHBOARD":
      return { to: "/profile" };
    default:
      return { to: "/" };
  }
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<DailyMissionNotificationsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const pollCountRef = useRef(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await dailyMissionApi.getDailyMissionNotifications(20);
      setData(response);

      if (import.meta.env.DEV && response.debug) {
        console.debug("[DailyMissionNotifications]", response.debug);
      }

      // Auto-retry if generating
      const hasGenerating = response.items.some(
        (item) => item.status === "generating",
      );
      if (hasGenerating && pollCountRef.current < 3) {
        pollCountRef.current++;
        setTimeout(() => {
          fetchNotifications();
        }, 2500);
      } else if (!hasGenerating) {
        pollCountRef.current = 0;
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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

  const handleItemClick = async (item: DailyMissionNotificationItem) => {
    if (item.status === "available" && item.missionId) {
      await dailyMissionApi.markDailyMissionOpened(item.missionId);
      // Optimistically update
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          unreadCount: Math.max(0, prev.unreadCount - 1),
          items: prev.items.map((i) =>
            i.id === item.id
              ? { ...i, status: "opened" as const, unread: false }
              : i,
          ),
        };
      });
    }

    if (item.redirect) {
      navigate(resolveDailyMissionRedirect(item.redirect) as any);
      setIsOpen(false);
    }
  };

  const renderIcon = (item: DailyMissionNotificationItem) => {
    if (item.type === "DAILY_PRAISE") {
      return (
        <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400">
          <Sparkles size={18} />
        </div>
      );
    }

    if (item.missionKind === "HARDCORE") {
      return (
        <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] ring-1 ring-[#f59e0b]/20">
          <Flame size={18} />
        </div>
      );
    }

    switch (item.status) {
      case "available":
      case "opened":
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
            <Target size={18} />
          </div>
        );
      case "generating":
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-purple-500/10 text-purple-400">
            <Loader2 size={18} className="animate-spin" />
          </div>
        );
      case "completed":
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
        );
      case "dismissed":
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-zinc-500/10 text-zinc-400">
            <XCircle size={18} />
          </div>
        );
      case "locked":
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-zinc-500/10 text-zinc-500">
            <Lock size={18} />
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-zinc-500/10 text-zinc-400">
            <AlertCircle size={18} />
          </div>
        );
    }
  };

  const todayItems = data?.items || [];
  const historyItems = data?.history || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[8px] h-2 bg-indigo-500 rounded-full" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <h3 className="font-medium text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* Content */}
          <div className="max-h-[480px] overflow-y-auto">
            {loading && todayItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
                <Loader2 size={24} className="animate-spin mb-2" />
                <span className="text-sm">Loading notifications...</span>
              </div>
            ) : todayItems.length === 0 && historyItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
                <Bell size={24} className="mb-2 opacity-50" />
                <span className="text-sm">No notifications yet</span>
              </div>
            ) : (
              <>
                {/* Today Section */}
                {todayItems.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-zinc-800/30">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Today
                      </span>
                    </div>
                    <div className="flex flex-col divide-y divide-zinc-800/50">
                      {todayItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`group relative flex items-start p-3.5 transition-colors cursor-pointer ${
                            item.unread
                              ? "bg-indigo-500/5"
                              : "hover:bg-zinc-800/50"
                          }`}
                        >
                          {item.unread && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500" />
                          )}

                          {renderIcon(item)}

                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {item.missionIndex && (
                                <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                                  {item.missionKind === "HARDCORE"
                                    ? "★"
                                    : `#${item.missionIndex}`}
                                </span>
                              )}
                              <p
                                className={`text-sm font-medium truncate ${
                                  item.unread ? "text-white" : "text-zinc-200"
                                }`}
                              >
                                {item.title}
                              </p>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">
                              {item.message}
                            </p>

                            {(item.status === "available" ||
                              item.status === "opened") &&
                              item.ctaLabel && (
                                <div className="mt-1.5 inline-flex items-center text-xs font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                  {item.ctaLabel}{" "}
                                  <span className="ml-1 group-hover:translate-x-0.5 transition-transform">
                                    →
                                  </span>
                                </div>
                              )}
                            {item.type === "DAILY_PRAISE" && item.ctaLabel && (
                              <div className="mt-1.5 inline-flex items-center text-xs font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                {item.ctaLabel}{" "}
                                <span className="ml-1 group-hover:translate-x-0.5 transition-transform">
                                  →
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* History Section */}
                {historyItems.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-zinc-800/30 border-t border-zinc-800">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                        <Clock size={10} />
                        History
                      </span>
                    </div>
                    <div className="flex flex-col divide-y divide-zinc-800/50">
                      {historyItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className="group relative flex items-start p-3.5 transition-colors cursor-pointer hover:bg-zinc-800/50 opacity-60 hover:opacity-80"
                        >
                          {renderIcon(item)}

                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {item.localDate && (
                                <span className="text-[10px] font-medium text-zinc-600">
                                  {item.localDate}
                                </span>
                              )}
                              <p className="text-sm font-medium truncate text-zinc-300">
                                {item.title}
                              </p>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
