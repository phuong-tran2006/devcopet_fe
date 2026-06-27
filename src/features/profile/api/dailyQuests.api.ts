import { api } from "../../../services/axiosClient";

export type MissionStatus =
  | "PENDING"
  | "OPENED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DISMISSED";

export type HardcoreGenerationStatus =
  | "LOCKED"
  | "GENERATING"
  | "READY"
  | "FAILED"
  | null;

export interface DailyMission {
  _id?: string;
  id?: string;
  status: MissionStatus;
  type?: "NORMAL" | "HARDCORE";
  tier?: "NORMAL" | "HARDCORE";
  missionType?: "NORMAL" | "HARDCORE";
  actionType?: string;
  targetType?: string;
  targetId?: string;
  title?: string;
  description?: string;
  message?: string;
  estimatedMinutes?: number;
  rewardXp?: number;
  xpReward?: number;
  progress?: number | { current?: number; target?: number; percent?: number };
  target?: number;
  localDate?: string;
  canDismiss?: boolean;
  deepLink?: string;
  href?: string;
  metadata?: Record<string, unknown>;
}

export interface TodayMissions {
  missions: DailyMission[];
  normalMissions: DailyMission[];
  hardcoreMission: DailyMission | null;
  hardcoreGenerationStatus: HardcoreGenerationStatus;
  normalCompleted: number;
  normalTotal: number;
  localDate?: string;
}

export interface MissionHistoryDay {
  _id?: string;
  id?: string;
  localDate?: string;
  date?: string;
  missions?: DailyMission[];
  completedCount?: number;
  totalCount?: number;
  [key: string]: unknown;
}

export interface MissionSummary {
  completedMissions?: number;
  totalCompleted?: number;
  currentStreak?: number;
  longestStreak?: number;
  totalXpEarned?: number;
  completionRate?: number;
  [key: string]: unknown;
}

export interface MissionNotification {
  _id?: string;
  id?: string;
  title?: string;
  message?: string;
  description?: string;
  type?: string;
  read?: boolean;
  isRead?: boolean;
  readAt?: string | null;
  status?: "READ" | "UNREAD" | string;
  createdAt?: string;
}

const toMissionArray = (value: unknown): DailyMission[] =>
  Array.isArray(value) ? (value as DailyMission[]) : [];

const normalizeToday = (payload: unknown): TodayMissions => {
  const data = (payload || {}) as Record<string, unknown>;
  const nested = (data.data || data) as Record<string, unknown>;
  const rawMissions = toMissionArray(nested.missions);
  const normalMissions = toMissionArray(nested.normalMissions);
  const normalProgress = (nested.normalProgress ||
    nested.progress ||
    nested.summary ||
    {}) as Record<string, unknown>;
  const resolvedNormal =
    normalMissions.length > 0
      ? normalMissions
      : rawMissions.filter(
          (mission) =>
            (mission.type ||
              mission.tier ||
              mission.missionType ||
              "NORMAL") !== "HARDCORE",
        );
  const hardcoreMission =
    (nested.hardcoreMission as DailyMission | null | undefined) ||
    rawMissions.find(
      (mission) =>
        (mission.type || mission.tier || mission.missionType) === "HARDCORE",
    ) ||
    null;

  return {
    missions:
      rawMissions.length > 0
        ? rawMissions
        : [...resolvedNormal, ...(hardcoreMission ? [hardcoreMission] : [])],
    normalMissions: resolvedNormal,
    hardcoreMission,
    hardcoreGenerationStatus:
      (nested.hardcoreGenerationStatus as HardcoreGenerationStatus) ||
      (hardcoreMission ? "READY" : null),
    normalCompleted: Number(
      nested.normalCompleted ??
        nested.completedNormalCount ??
        normalProgress.completed ??
        normalProgress.completedCount ??
        resolvedNormal.filter((mission) => mission.status === "COMPLETED")
          .length,
    ),
    normalTotal: Number(
      nested.normalTotal ??
        nested.normalMissionCount ??
        normalProgress.total ??
        normalProgress.totalCount ??
        4,
    ),
    localDate: nested.localDate as string | undefined,
  };
};

const unwrapMission = (payload: unknown): DailyMission => {
  const data = (payload || {}) as Record<string, unknown>;
  return (data.mission || data.data || data) as unknown as DailyMission;
};

export const getMissionId = (mission: DailyMission) =>
  String(mission._id || mission.id || "");

export const dailyQuestsApi = {
  getTodayMissions: async (): Promise<TodayMissions> => {
    const response = await api.get("/daily-missions/today");
    return normalizeToday(response.data);
  },

  getMyMissions: async (): Promise<DailyMission[]> => {
    const response = await api.get("/missions/me");
    return toMissionArray(response.data?.missions ?? response.data);
  },

  markAsOpened: async (id: string): Promise<DailyMission> => {
    const response = await api.post(`/daily-missions/${id}/opened`);
    return unwrapMission(response.data);
  },

  dismiss: async (id: string, reason?: string): Promise<DailyMission> => {
    const response = await api.post(
      `/daily-missions/${id}/dismiss`,
      reason ? { reason } : {},
    );
    return unwrapMission(response.data);
  },

  getHistory: async (): Promise<MissionHistoryDay[]> => {
    const response = await api.get("/daily-missions/history");
    const payload =
      response.data?.history ?? response.data?.items ?? response.data;
    return Array.isArray(payload) ? payload : [];
  },

  getSummary: async (): Promise<MissionSummary> => {
    const response = await api.get("/daily-missions/summary");
    return response.data?.summary ?? response.data?.data ?? response.data ?? {};
  },

  getNotifications: async (): Promise<MissionNotification[]> => {
    const response = await api.get("/daily-missions/notifications");
    const payload =
      response.data?.notifications ?? response.data?.items ?? response.data;
    return Array.isArray(payload) ? payload : [];
  },

  markNotificationRead: async (id: string): Promise<void> => {
    await api.patch(`/daily-missions/notifications/${id}/read`);
  },
};
