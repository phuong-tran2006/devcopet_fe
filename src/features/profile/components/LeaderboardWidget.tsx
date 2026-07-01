import React, { useEffect, useState } from "react";
import LucideIcon from "../../../components/ui/LucideIcon";
import { profileApi } from "../api/profile.api";
import { useAuthStore } from "../../users/store/auth.store";
import UserAvatar from "../../../components/ui/UserAvatar";

interface LeaderboardEntry {
  _id?: string;
  id?: string;
  username?: string;
  name?: string;
  rank?: number;
  currentXp?: number;
  avatarUrl?: string;
}

const LeaderboardWidget = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    let mounted = true;

    const fetchTop3 = async () => {
      try {
        setLoading(true);
        const response = await profileApi.getLeaderboard();
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || response.data?.items || [];
        if (mounted) setEntries(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch {
        if (mounted) setEntries([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTop3();
    return () => {
      mounted = false;
    };
  }, []);

  const isCurrentUser = (entry: LeaderboardEntry) =>
    currentUser &&
    (entry._id === currentUser.id ||
      entry.id === currentUser.id ||
      entry.username === currentUser.username);

  return (
    <div className="bg-surface border border-outline/20 rounded-2xl p-6 w-full transition-colors duration-300 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-on-surface transition-colors duration-300">
          Leaderboard
        </h2>
        <LucideIcon
          name="workspace_premium"
          className="text-secondary-fixed-dim transition-colors duration-300"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-fixed-dim/50 border-t-transparent" />
        </div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-4">
          No leaderboard data yet.
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const isMe = isCurrentUser(entry);
            const displayName = entry.name || entry.username || "Unknown";
            const rank = Number(entry.rank || 0);
            const xp = Number(entry.currentXp || 0);

            return (
              <div
                key={entry._id || entry.id || rank}
                className={`flex items-center p-3 rounded-xl transition-colors duration-300 ${isMe
                    ? "bg-primary-fixed/30 border border-primary-fixed-dim/30"
                    : "bg-transparent hover:bg-surface-container"
                  }`}
              >
                <span
                  className={`w-6 text-sm font-bold text-center mr-3 transition-colors duration-300 ${isMe ? "text-primary-fixed-dim" : "text-on-surface-variant"}`}
                >
                  {rank || "—"}
                </span>
                <div
                  className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-xs font-bold mr-3 transition-colors duration-300 overflow-hidden ${isMe
                      ? "bg-primary-fixed-dim text-white"
                      : "bg-surface-container text-on-surface-variant"
                    }`}
                >
                  <UserAvatar
                    avatarUrl={entry.avatarUrl}
                    name={displayName}
                    className="w-full h-full bg-transparent text-inherit"
                  />
                </div>
                <span
                  className={`flex-1 text-sm font-semibold transition-colors duration-300 truncate ${isMe ? "text-on-surface" : "text-on-surface-variant"}`}
                >
                  {isMe ? `${displayName} (You)` : displayName}
                </span>
                <span className="text-sm font-bold text-on-surface transition-colors duration-300">
                  {xp.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeaderboardWidget;

