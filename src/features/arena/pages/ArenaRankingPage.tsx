import { useEffect, useState } from "react";
import { api } from "../../../services/axiosClient";
import { useAuthStore } from "../../users/store/auth.store";

interface LeaderboardItem {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  arenaRating: number;
  arenaRank: string;
  arenaTotalMatches: number;
  arenaWins: number;
  arenaLosses: number;
  arenaDraws: number;
}

const getInitials = (username: string) => username.slice(0, 2).toUpperCase();
const getWinRate = (player: LeaderboardItem) => {
  if (!player.arenaTotalMatches) return "0%";
  return `${Math.round((player.arenaWins / player.arenaTotalMatches) * 100)}%`;
};

const ArenaRankingPage = () => {
  const [rankings, setRankings] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const currentUserId =
    user?.id || user?._id ? String(user?.id || user?._id) : undefined;

  useEffect(() => {
    let mounted = true;

    const loadRankings = async () => {
      try {
        setLoading(true);
        const response = await api.get("/arena/leaderboard?limit=50");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || response.data?.items || [];
        if (mounted) {
          setRankings(data);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load arena leaderboard", err);
        if (mounted) setError("Could not load arena rankings.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRankings();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-8 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-[#13222e] dark:to-[#081015] bg-surface-container-lowest transition-colors duration-300">
      <div className="mb-10 animate-fade-in transition-all duration-300 flex justify-between items-end">
        <div>
          <h1 className="text-[36px] font-extrabold tracking-[0.1em] dark:text-[#f4ecf4] text-on-surface dark:drop-shadow-[0_0_15px_rgba(244,236,244,0.3)] mb-3 transition-colors duration-300">
            GLOBAL RANKINGS
          </h1>
          <p className="dark:text-gray-400 text-on-surface-variant text-[15px] transition-colors duration-300">
            See where you stand among the world's best developers.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-5xl w-full">
        <div className="grid grid-cols-[80px_1fr_120px_120px_110px] items-center px-6 py-2 dark:text-gray-500 text-on-surface-variant text-[12px] font-bold uppercase tracking-wider">
          <div>Rank</div>
          <div>Player</div>
          <div className="text-center">Tier</div>
          <div className="text-center">Win Rate</div>
          <div className="text-right">Points</div>
        </div>

        {loading && (
          <div className="p-6 dark:text-gray-400 text-on-surface-variant font-semibold">
            Loading rankings...
          </div>
        )}
        {error && <div className="p-6 text-error font-semibold">{error}</div>}
        {!loading && !error && rankings.length === 0 && (
          <div className="p-6 dark:text-gray-400 text-on-surface-variant font-semibold">
            No rankings yet.
          </div>
        )}

        {rankings.map((player, index) => {
          const isTop3 = player.rank <= 3;
          const isYou =
            player.userId === currentUserId ||
            player.username === user?.username;

          return (
            <div
              key={player.userId || player.rank}
              className={`grid grid-cols-[80px_1fr_120px_120px_110px] items-center px-6 py-4 rounded-xl transition-all duration-300 animate-fade-in ${isYou ? "dark:bg-[#29b6f6]/10 bg-primary/10 border-2 dark:border-[#29b6f6]/30 border-primary/30" : "dark:bg-[#111a22] bg-surface border border-outline/10"} hover:shadow-lg transform hover:-translate-y-1`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span
                className={`font-black text-[20px] ${player.rank === 1 ? "dark:text-[#ffd700] text-[#d4af37]" : player.rank === 2 ? "dark:text-[#c0c0c0] text-[#a8a9ad]" : player.rank === 3 ? "dark:text-[#cd7f32] text-[#b08d57]" : "dark:text-gray-500 text-on-surface-variant"}`}
              >
                #{player.rank}
              </span>

              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-black overflow-hidden ${isTop3 ? "dark:bg-white/10 bg-surface-container-highest" : "dark:bg-[#1a2632] bg-surface-container-high"}`}
                >
                  {player.avatarUrl ? (
                    <img
                      src={player.avatarUrl}
                      alt={player.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(player.username)
                  )}
                </div>
                <div className="min-w-0">
                  <div
                    className={`font-bold text-[16px] truncate ${isYou ? "dark:text-[#29b6f6] text-primary" : "dark:text-[#f3d9e9] text-on-surface"}`}
                  >
                    {player.username}
                  </div>
                  <div className="text-[12px] dark:text-gray-500 text-on-surface-variant">
                    {player.arenaWins}W / {player.arenaTotalMatches} matches
                  </div>
                </div>
              </div>

              <div className="text-center font-semibold dark:text-gray-300 text-on-surface-variant text-[14px]">
                {player.arenaRank}
              </div>
              <div className="text-center font-semibold dark:text-gray-400 text-on-surface-variant text-[14px]">
                {getWinRate(player)}
              </div>
              <div className="text-right font-black text-[18px] dark:text-[#4dd0d0] text-primary">
                {player.arenaRating}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArenaRankingPage;
