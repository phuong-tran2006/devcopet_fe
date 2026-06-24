import { api } from "../../../services/axiosClient";

// ─── Types ───────────────────────────────────────────────────────────────────

export type DailyMissionRedirectRouteType =
  | "ROADMAP_NODE"
  | "COURSE"
  | "QUIZ"
  | "ARENA"
  | "HARD_LEVEL"
  | "DASHBOARD"
  | "LOGIN";

export interface DailyMissionRedirect {
  routeType: DailyMissionRedirectRouteType;
  actionType?: string;
  targetType?: string;
  targetId?: string;
}

export type DailyMissionNotificationItem = {
  id: string;
  type: "DAILY_MISSION" | "DAILY_PRAISE" | "SYSTEM";
  status:
    | "available"
    | "generating"
    | "empty"
    | "opened"
    | "completed"
    | "dismissed"
    | "failed"
    | "auth_required";
  missionId?: string;
  title: string;
  message: string;
  ctaLabel?: string;
  unread: boolean;
  localDate?: string;
  generatedAt?: string;
  completedAt?: string;
  dismissedAt?: string;
  openedAt?: string;
  actionType?: string;
  targetType?: string;
  targetId?: string;
  reasonCode?: string;
  estimatedMinutes?: number;
  generationMode?: "AI" | "FALLBACK";
  redirect: DailyMissionRedirect | null;
};

export interface DailyMissionNotificationsResponse {
  unreadCount: number;
  items: DailyMissionNotificationItem[];
  debug?: any;
}

// ─── Legacy Single Notification Type (for fallback) ──────────────────────────

export type DailyMissionNotification =
  | {
      type: "DAILY_MISSION";
      status: "available";
      missionId: string;
      title: string;
      message: string;
      ctaLabel?: string;
      unread?: boolean;
      redirect: DailyMissionRedirect | null;
    }
  | {
      type: "DAILY_MISSION";
      status: "generating";
      title: string;
      message: string;
      retryAfterMs?: number;
      redirect: null;
    }
  | {
      type: "DAILY_PRAISE";
      status: "empty";
      title: string;
      message: string;
      ctaLabel?: string;
      redirect: DailyMissionRedirect | null;
    };

// ─── API ─────────────────────────────────────────────────────────────────────

export const dailyMissionApi = {
  /**
   * Fetch the daily mission notifications (list).
   * Tries /daily-missions/notifications first, falls back to legacy methods if 404.
   */
  getDailyMissionNotifications: async (
    limit: number = 20,
  ): Promise<DailyMissionNotificationsResponse> => {
    const response = await api.get(
      `/daily-missions/notifications?limit=${limit}`,
      {
        _skipAuthRedirect: true,
        validateStatus: (status: number) => status < 500,
      } as any,
    );

    if (response.status === 401 || response.status === 403) {
      return {
        unreadCount: 1,
        items: [
          {
            id: "auth-required",
            type: "SYSTEM",
            status: "auth_required",
            title: "Please sign in again",
            message:
              "Your session expired. Log in again to view daily missions.",
            ctaLabel: "Login",
            unread: true,
            redirect: { routeType: "LOGIN" },
          },
        ],
      };
    }

    if (response.status === 200 && response.data) {
      return response.data as DailyMissionNotificationsResponse;
    }

    throw new Error(`Failed to load notifications: ${response.status}`);
  },

  /**
   * Mark a daily mission as opened.
   */
  markDailyMissionOpened: async (missionId: string): Promise<void> => {
    try {
      await api.patch(`/daily-missions/${missionId}/opened`);
    } catch (error) {
      console.warn("Failed to mark daily mission as opened:", error);
    }
  },

  /**
   * Reset today's mission (DEV ONLY)
   */
  resetTodayMissionDev: async (): Promise<void> => {
    try {
      await api.post("/daily-missions/dev/reset-today");
    } catch (error) {
      console.warn("Failed to reset mission:", error);
    }
  },
};
