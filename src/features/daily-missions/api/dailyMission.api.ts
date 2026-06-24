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
    try {
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

      if (response.status === 200 && response.data?.items) {
        return response.data as DailyMissionNotificationsResponse;
      }
    } catch {
      // Network error or other issue, fall through to fallback
    }

    // Fallback: build a single item array using the old notification logic
    const singleNotif = await dailyMissionApi.getDailyMissionNotification();

    // Convert to DailyMissionNotificationItem format
    const item: DailyMissionNotificationItem = {
      id:
        singleNotif.status === "available"
          ? singleNotif.missionId || "1"
          : "fallback",
      type: singleNotif.type,
      status: singleNotif.status,
      missionId:
        singleNotif.status === "available" ? singleNotif.missionId : undefined,
      title: singleNotif.title,
      message: singleNotif.message,
      ctaLabel: (singleNotif as any).ctaLabel,
      unread: singleNotif.status === "available" ? !!singleNotif.unread : false,
      redirect: singleNotif.redirect,
    };

    return {
      unreadCount:
        singleNotif.status === "available" && singleNotif.unread ? 1 : 0,
      items: [item],
    };
  },

  /**
   * Fetch a single daily mission notification (Legacy fallback).
   */
  getDailyMissionNotification: async (): Promise<DailyMissionNotification> => {
    try {
      const response = await api.get("/daily-missions/notification", {
        _skipAuthRedirect: true,
        validateStatus: (status: number) => status < 500,
      } as any);

      if (response.status === 200 && response.data?.type) {
        return response.data as DailyMissionNotification;
      }
    } catch {
      // Fallback
    }

    return dailyMissionApi._fallbackFromToday();
  },

  /**
   * Fallback: convert /daily-missions/today response to notification format.
   */
  _fallbackFromToday: async (): Promise<DailyMissionNotification> => {
    try {
      const response = await api.get("/daily-missions/today", {
        validateStatus: (status: number) => status < 500,
      } as any);

      if (response.status === 401 || response.status === 403) {
        return {
          type: "SYSTEM" as any,
          status: "auth_required" as any,
          title: "Please sign in again",
          message: "Your session expired. Log in again to view daily missions.",
          ctaLabel: "Login",
          redirect: { routeType: "LOGIN" },
        };
      }

      if (response.status === 202) {
        return {
          type: "DAILY_MISSION",
          status: "generating",
          title: "Preparing your mission",
          message: "Your pet is building today's mission. Check again shortly.",
          retryAfterMs: response.data?.retryAfterMs ?? 2000,
          redirect: null,
        };
      }

      if (
        response.status === 204 ||
        !response.data ||
        (typeof response.data === "object" &&
          Object.keys(response.data).length === 0)
      ) {
        return {
          type: "DAILY_PRAISE",
          status: "empty",
          title: "You're all caught up!",
          message: "Great work today. Your pet is proud of your consistency.",
          ctaLabel: "View course",
          redirect: {
            routeType: "COURSE",
            targetType: "COURSE",
            targetId: "python",
          },
        };
      }

      const mission = response.data;
      if (mission.status === "COMPLETED" || mission.status === "DISMISSED") {
        return {
          type: "DAILY_PRAISE",
          status: "empty",
          title: "You're all caught up!",
          message: "Great work today. Your pet is proud of your consistency.",
          ctaLabel: "View course",
          redirect: {
            routeType: "COURSE",
            targetType: "COURSE",
            targetId: "python",
          },
        };
      }

      return {
        type: "DAILY_MISSION",
        status: "available",
        missionId: mission._id || mission.id || "",
        title: mission.title || "Daily Mission Ready",
        message:
          mission.description ||
          mission.message ||
          "Continue your learning adventure today.",
        ctaLabel: "Start mission",
        unread: true,
        redirect: mission.redirect || {
          routeType: "COURSE",
          targetType: "COURSE",
          targetId: "python",
        },
      };
    } catch {
      return {
        type: "DAILY_PRAISE",
        status: "empty",
        title: "You're all caught up!",
        message: "Great work today. Your pet is proud of your consistency.",
        redirect: null,
      };
    }
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
