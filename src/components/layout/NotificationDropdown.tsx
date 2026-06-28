import { useState, useRef, useEffect, useCallback } from "react";
import LucideIcon from "../ui/LucideIcon";
import {
  notificationApi,
  type Notification,
} from "../../services/notification.api";
import { useAuthStore } from "../../features/users/store/auth.store";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PAGE_SIZE = 5;

/**
 * Format an ISO date string to a relative time string.
 * E.g. "2m ago", "3h ago", "5d ago"
 */
function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = Date.now();
    const diffMs = now - date.getTime();
    if (diffMs < 0) return "just now";

    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(months / 12);
    return `${years}y ago`;
  } catch {
    return "";
  }
}

/**
 * Pick an icon name based on notification type.
 */
function getIconForType(type: string): string {
  switch (type) {
    case "level_up":
    case "pet_level_up":
      return "arrow_upward";
    case "lesson":
    case "lesson_completed":
      return "menu_book";
    case "quest":
    case "quest_completed":
    case "mission_completed":
      return "military_tech";
    case "xp_gained":
    case "pet_exp":
      return "bolt";
    case "roadmap":
    case "roadmap_completed":
      return "route";
    case "achievement":
      return "emoji_events";
    case "arena":
      return "sports_esports";
    default:
      return "notifications";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface NotificationDropdownProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

const NotificationDropdown = ({ isOpen: controlledOpen, onToggle, onClose }: NotificationDropdownProps) => {
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // --- Fetch unread count on mount (if authenticated) ---
  useEffect(() => {
    if (!isAuthenticated) return;
    notificationApi.getUnreadCount().then(setUnreadCount).catch(() => {});
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

  // --- Fetch notifications when dropdown opens ---
  const fetchNotifications = useCallback(
    async (pageNum: number, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(false);
      }

      try {
        const data = await notificationApi.getMyNotifications({
          limit: PAGE_SIZE,
          page: pageNum,
        });

        if (append) {
          setNotifications((prev) => [...prev, ...data.items]);
        } else {
          setNotifications(data.items);
        }

        setUnreadCount(data.unreadCount);
        setHasMore(data.hasMore);
        setPage(pageNum);
      } catch {
        if (!append) {
          setError(true);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  // --- Trigger fetch on open ---
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      fetchNotifications(1);
    }
  }, [isOpen, fetchNotifications]);

  // --- View more ---
  const handleViewMore = () => {
    const nextPage = page + 1;
    fetchNotifications(nextPage, true);
  };

  // --- Mark single as read ---
  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.isRead) return;

    try {
      await notificationApi.markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silently fail — don't crash the UI
    }
  };

  // --- Mark all as read ---
  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Silently fail
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className={`w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center transition-all text-on-surface relative ${
          isOpen ? "bg-on-surface/10" : "hover:bg-on-surface/10"
        }`}
        aria-label="Notifications"
      >
        <LucideIcon name="notifications" className="text-[20px]" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-[#00daf8] text-[10px] font-bold text-[#0a0e17] px-1 shadow-[0_0_8px_rgba(0,218,248,0.6)]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute top-[52px] right-0 w-[380px] bg-[#0d1320]/98 backdrop-blur-xl border border-[#00daf8]/15 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(0,218,248,0.08)] overflow-hidden transition-all duration-300 origin-top-right z-50 ${
          isOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="text-[16px] font-bold text-white tracking-tight">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-[11px] font-semibold text-[#00daf8] bg-[#00daf8]/10 px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-[#00daf8] text-[11px] font-bold tracking-wider uppercase hover:text-[#5eecff] transition-colors"
            >
              Mark all as read
            </button>
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
                  className="animate-pulse flex gap-3 p-3 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
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
                  name="error"
                  className="text-[24px] text-red-400"
                />
              </div>
              <p className="text-sm text-white/60 mb-3">
                Could not load notifications.
              </p>
              <button
                onClick={() => fetchNotifications(1)}
                className="text-[13px] font-semibold text-[#00daf8] hover:text-[#5eecff] transition-colors px-4 py-1.5 rounded-lg border border-[#00daf8]/20 hover:border-[#00daf8]/40"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && notifications.length === 0 && (
            <div className="py-10 px-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center">
                <LucideIcon
                  name="notifications"
                  className="text-[24px] text-white/30"
                />
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                No notifications yet.
                <br />
                Complete lessons or roadmap challenges to receive updates.
              </p>
            </div>
          )}

          {/* Notification List */}
          {!loading && !error && notifications.length > 0 && (
            <div className="flex flex-col gap-1 p-2">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif)}
                  className={`w-full text-left flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                    notif.isRead
                      ? "hover:bg-white/5 opacity-60 hover:opacity-80"
                      : "bg-[#00daf8]/5 hover:bg-[#00daf8]/10 border border-[#00daf8]/8 hover:border-[#00daf8]/15"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      notif.isRead
                        ? "bg-white/5 text-white/30"
                        : "bg-[#00daf8]/15 text-[#00daf8]"
                    }`}
                  >
                    <LucideIcon
                      name={getIconForType(notif.type)}
                      className="text-[20px]"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 min-w-0 pr-4">
                    <span
                      className={`text-[13px] font-semibold mb-0.5 truncate ${
                        notif.isRead ? "text-white/60" : "text-white"
                      }`}
                    >
                      {notif.title}
                    </span>
                    <span className="text-[12px] text-white/40 leading-relaxed line-clamp-2">
                      {notif.message}
                    </span>
                    <span className="text-[11px] text-white/25 mt-1">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>

                  {/* Unread dot */}
                  {!notif.isRead && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00daf8] shadow-[0_0_6px_rgba(0,218,248,0.6)]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer — View More */}
        {!loading && !error && notifications.length > 0 && (
          <div className="px-5 py-3 border-t border-white/8">
            {hasMore ? (
              <button
                onClick={handleViewMore}
                disabled={loadingMore}
                className="w-full text-center text-[13px] font-semibold text-[#00daf8] hover:text-[#5eecff] transition-colors py-1.5 rounded-lg hover:bg-[#00daf8]/5 disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-[#00daf8]/30 border-t-[#00daf8] rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "View more"
                )}
              </button>
            ) : (
              <p className="text-center text-[12px] text-white/25 py-1">
                No more notifications
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
