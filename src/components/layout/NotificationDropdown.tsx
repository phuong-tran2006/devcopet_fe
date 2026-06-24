import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Target,
  Trophy,
  Loader2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  dailyMissionApi,
  type DailyMissionNotificationItem,
} from "../../features/daily-missions/api/dailyMission.api";

// Helper to resolve routes
const resolveDailyMissionRedirect = (
  redirect: DailyMissionNotificationItem["redirect"],
) => {
  if (!redirect) return { to: "/" };
  switch (redirect.routeType) {
    case "COURSE":
      return {
        to: "/courses/$courseId" as const,
        params: { courseId: redirect.targetId || "python" },
      };
    case "ROADMAP_NODE":
      return { to: "/roadmap" }; // adjust if you have node routes
    case "QUIZ":
      return {
        to: "/courses/$courseId" as const,
        params: { courseId: "python" },
      };
    case "ARENA":
      return { to: "/arena" };
    case "HARD_LEVEL":
      return { to: "/roadmap" };
    default:
      return { to: "/" };
  }
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<DailyMissionNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await dailyMissionApi.getDailyMissionNotifications(20);
      setItems(response.items);
      setUnreadCount(response.unreadCount);
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

  const handleDevReset = async () => {
    setResetting(true);
    await dailyMissionApi.resetTodayMissionDev();
    // In dev mode, we might need to hit /today once to trigger generation
    await dailyMissionApi._fallbackFromToday();
    await fetchNotifications();
    setResetting(false);
  };

  const handleItemClick = async (item: DailyMissionNotificationItem) => {
    if (item.status === "available" && item.missionId) {
      await dailyMissionApi.markDailyMissionOpened(item.missionId);
      // Optimistically update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "opened", unread: false } : i,
        ),
      );
    }

    if (item.redirect) {
      navigate(resolveDailyMissionRedirect(item.redirect) as any);
      setIsOpen(false);
    }
  };

  const renderIcon = (item: DailyMissionNotificationItem) => {
    if (item.type === "DAILY_PRAISE") {
      return (
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400">
          <Sparkles size={20} />
        </div>
      );
    }

    switch (item.status) {
      case "available":
      case "opened":
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
            <Target size={20} />
          </div>
        );
      case "generating":
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10 text-purple-400">
            <Loader2 size={20} className="animate-spin" />
          </div>
        );
      case "completed":
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
        );
      case "dismissed":
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-500/10 text-zinc-400">
            <XCircle size={20} />
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-500/10 text-zinc-400">
            <AlertCircle size={20} />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <h3 className="font-medium text-white">Notifications</h3>
            {import.meta.env.DEV && (
              <button
                onClick={handleDevReset}
                disabled={resetting}
                title="Dev Only: Reset Today's Mission"
                className="text-xs flex items-center gap-1.5 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  size={12}
                  className={resetting ? "animate-spin" : ""}
                />
                Reset Mission
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
                <Loader2 size={24} className="animate-spin mb-2" />
                <span className="text-sm">Loading notifications...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
                <Bell size={24} className="mb-2 opacity-50" />
                <span className="text-sm">No notifications yet</span>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-zinc-800/50">
                {items.map((item, index) => {
                  const isTopActive =
                    index === 0 &&
                    (item.status === "available" ||
                      item.status === "opened" ||
                      item.status === "generating" ||
                      item.type === "DAILY_PRAISE");

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`group relative flex items-start p-4 transition-colors cursor-pointer ${
                        item.unread ? "bg-indigo-500/5" : "hover:bg-zinc-800/50"
                      } ${isTopActive ? "bg-zinc-800/20" : ""}`}
                    >
                      {item.unread && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500" />
                      )}

                      {renderIcon(item)}

                      <div className="ml-3 flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            item.unread ? "text-white" : "text-zinc-200"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="text-sm text-zinc-400 mt-0.5 line-clamp-2">
                          {item.message}
                        </p>

                        {(item.status === "available" ||
                          item.status === "opened") &&
                          item.ctaLabel && (
                            <div className="mt-2 inline-flex items-center text-xs font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                              {item.ctaLabel}{" "}
                              <span className="ml-1 group-hover:translate-x-0.5 transition-transform">
                                →
                              </span>
                            </div>
                          )}
                        {item.type === "DAILY_PRAISE" && item.ctaLabel && (
                          <div className="mt-2 inline-flex items-center text-xs font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                            {item.ctaLabel}{" "}
                            <span className="ml-1 group-hover:translate-x-0.5 transition-transform">
                              →
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
