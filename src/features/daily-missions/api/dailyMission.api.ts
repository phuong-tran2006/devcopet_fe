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

export type MissionKind = "NORMAL" | "HARDCORE";

export type DailyMissionNotificationItem = {
  id: string;
  type: "DAILY_MISSION" | "DAILY_PRAISE" | "HARDCORE_UNLOCK" | "SYSTEM";
  status:
    | "available"
    | "generating"
    | "empty"
    | "opened"
    | "completed"
    | "dismissed"
    | "locked"
    | "failed"
    | "auth_required";
  missionId?: string;
  missionIndex?: number;
  missionKind?: MissionKind;
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

export interface DailyMissionProgress {
  completedNormal: number;
  totalNormal: 4;
  hardcoreUnlocked: boolean;
  hardcoreCompleted: boolean;
}

export type DailyMissionSetStatus =
  | "ACTIVE"
  | "GENERATING"
  | "COMPLETED_MAIN"
  | "COMPLETED_ALL"
  | "EMPTY"
  | "GENERATION_FAILED";

export interface DailyMissionTodayResponse {
  localDate: string;
  status: DailyMissionSetStatus;
  progress: DailyMissionProgress;
  activeMission: DailyMissionNotificationItem | null;
  missions: DailyMissionNotificationItem[];
  praise?: {
    title: string;
    message: string;
    ctaLabel?: string;
  };
  debug?: Record<string, unknown>;
}

export interface DailyMissionNotificationsResponse {
  unreadCount: number;
  items: DailyMissionNotificationItem[];
  history: DailyMissionNotificationItem[];

  debug?: any;
}

export interface MissionStatusUpdateResponse {
  mission: DailyMissionNotificationItem;
  progress: DailyMissionProgress;
  hardcoreJustUnlocked?: boolean;
  praise?: { title: string; message: string };
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const dailyMissionApi = {
  /**
   * Fetch today's mission set (4 normal + optional hardcore).
   */
  getDailyMissionToday: async (): Promise<DailyMissionTodayResponse> => {
    const response = await api.get("/daily-missions/today", {
      _skipAuthRedirect: true,
      validateStatus: (status: number) => status < 500,
    } as any);

    if (response.status === 401 || response.status === 403) {
      return {
        localDate: "",
        status: "EMPTY",
        progress: {
          completedNormal: 0,
          totalNormal: 4,
          hardcoreUnlocked: false,
          hardcoreCompleted: false,
        },
        activeMission: null,
        missions: [],
      };
    }

    if (response.status === 200 || response.status === 202) {
      return response.data as DailyMissionTodayResponse;
    }

    throw new Error(`Failed to load today's missions: ${response.status}`);
  },

  /**
   * Fetch the daily mission notifications (list + history).
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
        history: [],
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
  markDailyMissionOpened: async (
    missionId: string,
  ): Promise<MissionStatusUpdateResponse | null> => {
    try {
      const response = await api.patch(`/daily-missions/${missionId}/opened`);
      return response.data as MissionStatusUpdateResponse;
    } catch (error) {
      console.warn("Failed to mark daily mission as opened:", error);
      return null;
    }
  },

  /**
   * Mark a daily mission as completed.
   */
  markDailyMissionCompleted: async (
    missionId: string,
  ): Promise<MissionStatusUpdateResponse | null> => {
    try {
      const response = await api.patch(
        `/daily-missions/${missionId}/completed`,
      );
      return response.data as MissionStatusUpdateResponse;
    } catch (error) {
      console.warn("Failed to mark daily mission as completed:", error);
      return null;
    }
  },

  /**
   * Mark a daily mission as dismissed.
   */
  markDailyMissionDismissed: async (
    missionId: string,
  ): Promise<MissionStatusUpdateResponse | null> => {
    try {
      const response = await api.patch(
        `/daily-missions/${missionId}/dismissed`,
      );
      return response.data as MissionStatusUpdateResponse;
    } catch (error) {
      console.warn("Failed to mark daily mission as dismissed:", error);
      return null;
    }
  },
};
