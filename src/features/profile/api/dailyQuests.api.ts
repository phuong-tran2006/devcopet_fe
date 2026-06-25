import { api } from "../../../services/axiosClient";

export interface DailyMission {
  _id: string;
  status: "PENDING" | "generating" | "OPENED" | "COMPLETED" | "DISMISSED";
  actionType?: string;
  targetType?: string;
  targetId?: string;
  title?: string;
  message?: string;
  estimatedMinutes?: number;
  localDate: string;
}

export const dailyQuestsApi = {
  getTodayMission: async (): Promise<DailyMission | null> => {
    try {
      const response = await api.get("/daily-missions/today");
      if (response.status === 204) return null;
      return response.data;
    } catch (error) {
      console.error("Failed to fetch daily mission:", error);
      return null;
    }
  },

  markAsOpened: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/opened`);
    return response.data;
  },

  markAsCompleted: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/completed`);
    return response.data;
  },

  markAsDismissed: async (id: string): Promise<DailyMission> => {
    const response = await api.patch(`/daily-missions/${id}/dismissed`);
    return response.data;
  },
};
