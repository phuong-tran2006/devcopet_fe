import { useCallback, useEffect, useRef, useState } from "react";
import {
  dailyQuestsApi,
  type MissionNotification,
} from "../../features/profile/api/dailyQuests.api";
import LucideIcon from "../ui/LucideIcon";

const getNotificationId = (notification: MissionNotification) =>
  String(notification._id || notification.id || "");

const isUnread = (notification: MissionNotification) => {
  if (typeof notification.read === "boolean") return !notification.read;
  if (typeof notification.isRead === "boolean") return !notification.isRead;
  if (notification.status) return notification.status === "UNREAD";
  if ("readAt" in notification) return !notification.readAt;
  return true;
};

const formatRelativeTime = (value?: string) => {
  if (!value) return "";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "";
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<MissionNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    try {
      setNotifications(await dailyQuestsApi.getNotifications());
    } catch (error) {
      console.error("Failed to load mission notifications", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
    const timer = window.setInterval(() => void loadNotifications(), 60_000);
    return () => window.clearInterval(timer);
  }, [loadNotifications]);

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

  const markRead = async (notification: MissionNotification) => {
    if (!isUnread(notification)) return;
    const id = getNotificationId(notification);
    if (!id) return;
    setNotifications((current) =>
      current.map((item) =>
        getNotificationId(item) === id
          ? { ...item, read: true, isRead: true }
          : item,
      ),
    );
    try {
      await dailyQuestsApi.markNotificationRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      void loadNotifications();
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(isUnread);
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true, isRead: true })),
    );
    await Promise.allSettled(
      unread
        .map(getNotificationId)
        .filter(Boolean)
        .map((id) => dailyQuestsApi.markNotificationRead(id)),
    );
  };

  const hasUnread = notifications.some(isUnread);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
          if (!isOpen) void loadNotifications();
        }}
        aria-label="Mission notifications"
        aria-expanded={isOpen}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 text-on-surface transition-all ${
          isOpen ? "bg-on-surface/10" : "hover:bg-on-surface/10"
        }`}
      >
        <LucideIcon name="notifications" className="h-5 w-5" />
        {hasUnread && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#4ade80]" />
        )}
      </button>

      <div
        className={`absolute right-[-80px] top-[52px] z-50 w-[min(360px,calc(100vw-24px))] origin-top-right overflow-hidden rounded-2xl border border-on-surface/10 bg-surface-container-high/95 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-200 sm:right-0 ${
          isOpen
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-on-surface/10 px-5 py-4">
          <h3 className="text-base font-bold text-on-surface">Notifications</h3>
          {hasUnread && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed-dim hover:text-primary-fixed"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="flex max-h-[400px] flex-col gap-2 overflow-y-auto p-3 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-8">
              <LucideIcon
                name="refresh"
                className="h-5 w-5 animate-spin text-primary-fixed-dim"
              />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-on-surface-variant">
              No mission notifications
            </div>
          ) : (
            notifications.map((notification, index) => {
              const unread = isUnread(notification);
              return (
                <button
                  type="button"
                  key={getNotificationId(notification) || index}
                  onClick={() => void markRead(notification)}
                  className={`relative flex gap-3 rounded-xl border p-3 text-left transition-colors ${
                    unread
                      ? "border-primary-fixed-dim/20 bg-primary-fixed-dim/5"
                      : "border-on-surface/10 bg-on-surface/[0.03] hover:bg-on-surface/[0.06]"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed-dim/15 text-primary-fixed-dim">
                    <LucideIcon name="military_tech" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="pr-3 text-sm font-bold text-on-surface">
                      {notification.title || "Mission update"}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-on-surface-variant">
                      {notification.message || notification.description}
                    </div>
                    <div className="mt-1.5 text-[10px] text-on-surface-variant/60">
                      {formatRelativeTime(notification.createdAt)}
                    </div>
                  </div>
                  {unread && (
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#4ade80]" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
