import { api } from "./axiosClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DailyMission {
  id: string;
  missionIndex: 1 | 2 | 3 | 4 | 5;
  missionKind: "NORMAL" | "HARDCORE";
  status: "PENDING" | "OPENED" | "COMPLETED" | "DISMISSED" | "LOCKED" | "FAILED";
  actionType: string;
  targetType: string;
  targetId: string;
  title: string;
  message: string;
  detailMessage?: string;
}

export interface DailyMissionsResponse {
  localDate: string;
  status: string;
  progress: {
    completedNormal: number;
    totalNormal: number;
    resolvedNormal: number;
    hardcoreUnlocked: boolean;
    hardcoreCompleted: boolean;
  };
  activeMission: DailyMission | null;
  missions: DailyMission[];
  praise?: string;
  debug?: unknown;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normaliseDailyMission(raw: any): DailyMission {
  if (!raw) {
    throw new Error("Invalid raw daily mission object");
  }
  return {
    id: String(raw.id ?? raw._id ?? ""),
    missionIndex: Number(raw.missionIndex ?? 1) as any,
    missionKind: (raw.missionKind ?? "NORMAL") as any,
    status: (raw.status ?? "PENDING") as any,
    actionType: String(raw.actionType ?? ""),
    targetType: String(raw.targetType ?? ""),
    targetId: String(raw.targetId ?? ""),
    title: String(raw.title ?? ""),
    message: String(raw.message ?? ""),
    detailMessage: raw.detailMessage !== undefined ? String(raw.detailMessage) : undefined,
  };
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export const dailyMissionApi = {
  /**
   * GET /daily-missions/today
   */
  getTodayDailyMissions: async (): Promise<DailyMissionsResponse> => {
    const response = await api.get("/daily-missions/today");
    const data = response.data;

    return {
      localDate: String(data.localDate ?? ""),
      status: String(data.status ?? ""),
      progress: {
        completedNormal: Number(data.progress?.completedNormal ?? 0),
        totalNormal: Number(data.progress?.totalNormal ?? 4),
        resolvedNormal: Number(data.progress?.resolvedNormal ?? 0),
        hardcoreUnlocked: Boolean(data.progress?.hardcoreUnlocked),
        hardcoreCompleted: Boolean(data.progress?.hardcoreCompleted),
      },
      activeMission: data.activeMission ? normaliseDailyMission(data.activeMission) : null,
      missions: Array.isArray(data.missions)
        ? data.missions.map(normaliseDailyMission)
        : [],
      praise: data.praise !== undefined ? String(data.praise) : undefined,
      debug: data.debug,
    };
  },

  /**
   * PATCH /daily-missions/:id/opened
   */
  markDailyMissionOpened: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/opened`);
    return normaliseDailyMission(response.data);
  },

  /**
   * PATCH /daily-missions/:id/completed
   */
  markDailyMissionCompleted: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/completed`);
    return normaliseDailyMission(response.data);
  },

  /**
   * PATCH /daily-missions/:id/dismissed
   */
  dismissDailyMission: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/dismissed`);
    return normaliseDailyMission(response.data);
  },

  /**
   * GET /daily-missions/notifications?limit=20
   */
  getDailyMissionNotifications: async (limit = 20): Promise<any[]> => {
    const response = await api.get("/daily-missions/notifications", {
      params: { limit },
    });
    return response.data;
  },
};
