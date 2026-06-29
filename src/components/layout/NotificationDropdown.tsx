import { useState, useRef, useEffect } from "react";
import LucideIcon from "../ui/LucideIcon";
import {
  notificationsApi,
  type NotificationItem,
} from "../../features/profile/api/notifications.api";

interface NotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const NotificationDropdown = ({
  isOpen,
  onToggle,
  onClose,
}: NotificationDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const limit = 5;

  // Fetch unread count on mount
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await notificationsApi.getUnreadNotificationCount();
        setUnreadCount(res.count ?? 0);
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };
    fetchUnreadCount();
  }, []);

  // Fetch notifications
  const fetchNotifications = async (targetPage: number, append = false) => {
    setLoading(true);
    setError(false);
    try {
      const res = await notificationsApi.getMyNotifications({
        limit,
        page: targetPage,
      });
      if (append) {
        setNotifications((prev) => [...prev, ...(res.items || [])]);
      } else {
        setNotifications(res.items || []);
      }
      setHasMore(res.hasMore ?? false);
      setUnreadCount(res.unreadCount ?? 0);
      setPage(targetPage);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1, false);
    }
  }, [isOpen]);

  // Close when clicking outside
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

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleViewMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1, true);
    }
  };

  const getRelativeTime = (dateStr: string) => {
    try {
      const now = new Date();
      const date = new Date(dateStr);
      const diffMs = now.getTime() - date.getTime();
      if (isNaN(diffMs) || diffMs < 0) return "Just now";
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch (e) {
      return "";
    }
  };

  const getIconName = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("level")) return "arrow_upward";
    if (t.includes("lesson")) return "menu_book";
    if (t.includes("quest") || t.includes("mission")) return "military_tech";
    return "notifications";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center transition-all text-on-surface relative ${
          isOpen ? "bg-on-surface/10 border-primary-fixed-dim/45 shadow-[0_0_15px_rgba(0,218,248,0.25)]" : "hover:bg-on-surface/10"
        }`}
      >
        <LucideIcon name="notifications" className="text-[20px]" />
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute top-[52px] right-[-80px] w-[320px] bg-surface-container-high/95 backdrop-blur-xl border border-on-surface/10 rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300 origin-top-right z-50 ${
          isOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-on-surface/10 flex justify-between items-center bg-on-surface/5">
          <div>
            <h3 className="font-headline-sm text-[17px] font-black text-on-surface tracking-wider">
              NOTIFICATIONS
            </h3>
            {unreadCount > 0 && (
              <p className="text-[11px] text-primary-fixed-dim font-bold mt-0.5">
                {unreadCount} Unread
              </p>
            )}
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-primary-fixed-dim text-[11px] font-bold tracking-widest uppercase hover:text-primary-fixed transition-colors"
            >
              MARK ALL AS READ
            </button>
          )}
        </div>

        {/* List */}
        <div className="p-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {loading && notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
              <div className="w-6 h-6 border-2 border-primary-fixed-dim border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[12px] font-semibold tracking-wider">Loading notifications...</span>
            </div>
          ) : error ? (
            <div className="py-10 text-center flex flex-col items-center justify-center gap-4">
              <span className="text-[13px] text-error font-semibold">Could not load notifications.</span>
              <button
                onClick={() => fetchNotifications(1, false)}
                className="px-4 py-2 rounded-lg bg-primary-fixed-dim text-on-primary-fixed text-[12px] font-bold tracking-widest hover:bg-primary-container transition-colors"
              >
                RETRY
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant text-sm font-bold">
              No new notifications
            </div>
          ) : (
            <>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                  className={`bg-on-surface/5 border border-on-surface/10 rounded-2xl p-4 flex gap-4 relative cursor-pointer hover:bg-on-surface/10 transition-colors ${
                    !notif.isRead ? "border-primary-fixed-dim/20 bg-primary-fixed-dim/5" : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.type.toLowerCase().includes("level")
                        ? "bg-[#b3a6d9]/20 text-[#b3a6d9]"
                        : "bg-primary-fixed-dim/20 text-primary-fixed-dim"
                    }`}
                  >
                    <LucideIcon name={getIconName(notif.type)} className="text-[24px]" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 pr-4">
                    <span className="text-[15px] font-bold text-on-surface mb-1">
                      {notif.title}
                    </span>
                    <span className="text-[13px] font-['Open_Sans'] italic text-on-surface-variant leading-relaxed">
                      {notif.message}
                    </span>
                    <span className="text-[11px] text-on-surface-variant/50 mt-2">
                      {getRelativeTime(notif.createdAt)}
                    </span>
                  </div>

                  {/* Unread indicator */}
                  {!notif.isRead && (
                    <div className="absolute top-[18px] right-[18px] w-2 h-2 rounded-full bg-[#4ade80]"></div>
                  )}
                </div>
              ))}

              {/* View More Button */}
              {hasMore && (
                <button
                  onClick={handleViewMore}
                  disabled={loading}
                  className="w-full text-center py-2 text-[12px] font-bold text-primary-fixed-dim hover:text-primary-fixed transition-colors disabled:opacity-50"
                >
                  {loading ? "Loading more..." : "VIEW MORE"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
