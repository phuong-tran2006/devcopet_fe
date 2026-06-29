import { api } from "../../../services/axiosClient";

export interface NotificationItem {
  id: string;
  _id?: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationsResponse {
  items: NotificationItem[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

const mapNotification = (item: any): NotificationItem => {
  if (!item) return item;
  return {
    ...item,
    id: item.id || item._id,
  };
};

export const notificationsApi = {
  getMyNotifications: async (params?: { limit?: number; page?: number }): Promise<NotificationsResponse> => {
    const response = await api.get("/notifications/me", { params });
    const data = response.data;
    if (data && Array.isArray(data.items)) {
      data.items = data.items.map(mapNotification);
    }
    return data;
  },

  getUnreadNotificationCount: async (): Promise<{ count: number }> => {
    const response = await api.get("/notifications/me/unread-count");
    return response.data;
  },

  markNotificationAsRead: async (id: string): Promise<NotificationItem> => {
    const response = await api.patch(`/notifications/${id}/read`);
    return mapNotification(response.data);
  },

  markAllNotificationsAsRead: async (): Promise<any> => {
    const response = await api.patch("/notifications/read-all");
    return response.data;
  },
};
