import { api } from "../../../services/axiosClient";

export interface DailyMission {
  id: string;
  _id: string;
  missionIndex?: number;
  missionKind?: "NORMAL" | "HARDCORE";
  status: "PENDING" | "generating" | "OPENED" | "COMPLETED" | "DISMISSED" | "LOCKED" | "FAILED";
  actionType?: string;
  targetType?: string;
  targetId?: string;
  title?: string;
  message?: string;
  detailMessage?: string;
  sourceType?: string;
  localDate?: string;
  estimatedMinutes?: number;
  ctaPath?: string;
}

export interface TodayDailyMissionsResponse {
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

const mapMission = (mission: any): DailyMission => {
  if (!mission) return mission;
  const id = mission.id || mission._id;
  const _id = mission._id || mission.id;
  return {
    ...mission,
    id,
    _id,
  };
};

export const dailyQuestsApi = {
  getTodayMission: async (): Promise<DailyMission | null> => {
    try {
      const response = await api.get("/daily-missions/today");
      if (response.status === 204) return null;
      return mapMission(response.data);
    } catch (error) {
      console.error("Failed to fetch daily mission:", error);
      return null;
    }
  },

  markAsOpened: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/opened`);
    return mapMission(response.data);
  },

  markAsCompleted: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/completed`);
    return mapMission(response.data);
  },

  markAsDismissed: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/dismissed`);
    return mapMission(response.data);
  },

  // New API Methods requested:
  getTodayDailyMissions: async (): Promise<TodayDailyMissionsResponse> => {
    const response = await api.get("/daily-missions/today");
    const data = response.data;
    if (data) {
      if (data.activeMission) {
        data.activeMission = mapMission(data.activeMission);
      }
      if (Array.isArray(data.missions)) {
        data.missions = data.missions.map(mapMission);
      }
    }
    return data;
  },

  markDailyMissionOpened: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/opened`);
    return mapMission(response.data);
  },

  markDailyMissionCompleted: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/completed`);
    return mapMission(response.data);
  },

  dismissDailyMission: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/dismissed`);
    return mapMission(response.data);
  },

  getDailyMissionNotifications: async (limit: number = 10): Promise<any> => {
    const response = await api.get(`/daily-missions/notifications`, {
      params: { limit },
    });
    return response.data;
  },
};
