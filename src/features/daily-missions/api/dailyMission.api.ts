import { api } from "../../../services/axiosClient";

// ─── Types ───────────────────────────────────────────────────────────────────

export type DailyMissionRedirectRouteType =
  | "ROADMAP_NODE"
  | "COURSE"
  | "QUIZ"
  | "ARENA"
  | "HARD_LEVEL"
  | "DASHBOARD";

export interface DailyMissionRedirect {
  routeType: DailyMissionRedirectRouteType;
  actionType?: string;
  targetType?: string;
  targetId?: string;
}

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
   * Fetch the daily mission notification.
   * Tries /daily-missions/notification first, falls back to /daily-missions/today.
   */
  getDailyMissionNotification: async (): Promise<DailyMissionNotification> => {
    // Try the dedicated notification endpoint first
    try {
      const response = await api.get("/daily-missions/notification", {
        _skipAuthRedirect: true,
        validateStatus: (status: number) => status < 500,
      } as any);

      if (response.status === 200 && response.data?.type) {
        return response.data as DailyMissionNotification;
      }
      // If 404 or unexpected shape, fall through to fallback
    } catch {
      // Network error or other issue, fall through to fallback
    }

    // Fallback: use /daily-missions/today
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

      // HTTP 202: generating
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

      // HTTP 204 or null body: empty / praise
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

      // HTTP 200 with mission data
      const mission = response.data;

      // If mission is already completed
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
      // If everything fails, return a praise fallback
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
};
