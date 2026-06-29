import { api } from "../../../services/axiosClient";

export const profileApi = {
  /** Fetch the current user's full profile including XP, rank, and pet data */
  getMe: () => api.get("/profile/me"),

  /** Feed the user's pet. Costs currentXp. */
  feedPet: () => api.post("/pets/feed"),

  /** Fetch the leaderboard (ranked by currentXp) */
  getLeaderboard: () => api.get("/leaderboard"),
};
