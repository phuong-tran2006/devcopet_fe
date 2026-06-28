import { api } from "./axiosClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationsResponse {
  items: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Safely normalise a notification object from the backend.
 * If the backend returns `_id` instead of `id`, map it.
 */
function normaliseNotification(raw: Record<string, unknown>): Notification {
  return {
    id: (raw.id ?? raw._id ?? "") as string,
    type: (raw.type ?? "") as string,
    title: (raw.title ?? "") as string,
    message: (raw.message ?? "") as string,
    isRead: Boolean(raw.isRead),
    metadata: (raw.metadata ?? undefined) as
      | Record<string, unknown>
      | undefined,
    createdAt: (raw.createdAt ?? "") as string,
  };
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export const notificationApi = {
  /**
   * GET /notifications/me?limit=X&page=Y
   */
  getMyNotifications: async (params: {
    limit: number;
    page: number;
  }): Promise<NotificationsResponse> => {
    const response = await api.get("/notifications/me", { params });
    const data = response.data;

    return {
      items: Array.isArray(data.items)
        ? data.items.map(normaliseNotification)
        : [],
      total: Number(data.total ?? 0),
      unreadCount: Number(data.unreadCount ?? 0),
      page: Number(data.page ?? params.page),
      limit: Number(data.limit ?? params.limit),
      hasMore: Boolean(data.hasMore),
    };
  },

  /**
   * GET /notifications/me/unread-count
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get("/notifications/me/unread-count");
    // Backend may return { unreadCount: N } or just a number
    const data = response.data;
    if (typeof data === "number") return data;
    return Number(data?.unreadCount ?? data?.count ?? 0);
  },

  /**
   * PATCH /notifications/:id/read
   */
  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  /**
   * PATCH /notifications/read-all
   */
  markAllAsRead: async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  },
};
