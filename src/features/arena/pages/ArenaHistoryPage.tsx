import { useEffect, useState } from "react";
import { api } from "../../../services/axiosClient";
import { useAuthStore } from "../../users/store/auth.store";
import type { PublicScoreboardItem } from "../store/arena.store";
import LucideIcon from "../../../components/ui/LucideIcon";
import UserAvatar from "../../../components/ui/UserAvatar";

interface HistoryPlayer {
  userId?: string;
  id?: string;
  username?: string;
  avatarUrl?: string;
  isBot?: boolean;
  ratingDelta?: number;
  ratingChange?: number;
}

interface HistoryMatch {
  _id?: string;
  id?: string;
  players?: HistoryPlayer[];
  finalScoreboard?: PublicScoreboardItem[];
  winnerUserId?: string;
  resultType?: string;
  status?: string;
  finishedAt?: string;
  createdAt?: string;
  ratingChanges?: { userId: string; delta: number }[];
}

const getPlayerId = (player?: HistoryPlayer) => player?.userId || player?.id;
const formatDate = (value?: string) => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ArenaHistoryPage = () => {
  const [matches, setMatches] = useState<HistoryMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const currentUserId =
    user?.id || user?._id ? String(user?.id || user?._id) : undefined;

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get("/arena/history?limit=20");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || response.data?.items || [];
        if (mounted) {
          setMatches(data);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load arena history", err);
        if (mounted) setError("Could not load arena history.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadHistory();
    return () => {
      mounted = false;
    };
  }, []);

  const getMatchView = (match: HistoryMatch) => {
    const players = match.players || [];
    const me =
      players.find(
        (player) => currentUserId && getPlayerId(player) === currentUserId,
      ) ||
      players.find((player) => player.username === user?.username) ||
      players.find((player) => !player.isBot) ||
      players[0];
    const meId = getPlayerId(me);
    const opponent =
      players.find((player) => getPlayerId(player) !== meId) ||
      players.find((player) => player.isBot) ||
      players[1];
    const myScore = match.finalScoreboard?.find((item) => item.userId === meId);
    const opponentScore = match.finalScoreboard?.find(
      (item) => item.userId !== meId,
    );
    const isCompletedOrFinished =
      match.status === "finished" ||
      match.status === "completed" ||
      match.status === "disconnected";
    const isCancelled =
      match.status === "cancelled" || match.resultType === "cancelled";
    const isDraw =
      match.resultType === "draw" ||
      (!match.resultType && !match.winnerUserId && isCompletedOrFinished);
    const result = isCancelled
      ? "CANCELLED"
      : isDraw
        ? "DRAW"
        : match.winnerUserId === meId
          ? "WIN"
          : isCompletedOrFinished
            ? "DEFEAT"
            : (match.status || "UNKNOWN").toUpperCase();
    const ratingChange =
      match.ratingChanges?.find((item) => item.userId === meId)?.delta ??
      me?.ratingDelta ??
      me?.ratingChange ??
      0;

    return {
      result,
      opponentName:
        opponent?.username || (opponent?.isBot ? "Arena Bot" : "Opponent"),
      opponentAvatar: opponent?.avatarUrl,
      score: `${myScore?.score ?? 0} - ${opponentScore?.score ?? 0}`,
      date: formatDate(match.finishedAt || match.createdAt),
      ratingChange,
    };
  };

  return (
    <div className="w-full h-full flex flex-col p-8 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-[#13222e] dark:to-[#081015] bg-surface-container-lowest transition-colors duration-300">
      <div className="mb-10 animate-fade-in transition-all duration-300">
        <h1 className="text-[36px] font-extrabold tracking-[0.1em] dark:text-[#f4ecf4] text-on-surface dark:drop-shadow-[0_0_15px_rgba(244,236,244,0.3)] mb-3 transition-colors duration-300">
          BATTLE HISTORY
        </h1>
        <p className="dark:text-gray-400 text-on-surface-variant text-[15px] transition-colors duration-300">
          Review your past matches and analyze your performance.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-5xl w-full">
        {loading && (
          <div className="p-6 dark:text-gray-400 text-on-surface-variant font-semibold">
            Loading history...
          </div>
        )}
        {error && <div className="p-6 text-error font-semibold">{error}</div>}
        {!loading && !error && matches.length === 0 && (
          <div className="p-6 dark:text-gray-400 text-on-surface-variant font-semibold">
            No Arena matches yet.
          </div>
        )}

        {matches.map((match, index) => {
          const view = getMatchView(match);
          const isWin = view.result === "WIN";
          const isLoss = view.result === "LOSS" || view.result === "DEFEAT";
          const isDraw = view.result === "DRAW";

          return (
            <div
              key={match._id || match.id || index}
              className="flex items-center justify-between p-5 rounded-2xl dark:bg-[#111a22] bg-surface border border-outline/10 hover:border-outline/30 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex flex-col gap-1 w-28">
                <span
                  className={`font-black text-[18px] tracking-wider ${isWin ? "dark:text-[#4dd0d0] text-primary" : isLoss ? "dark:text-[#ff3b30] text-error" : "dark:text-gray-400 text-on-surface-variant"}`}
                >
                  {view.result}
                </span>
                <span className="text-[12px] dark:text-gray-500 text-on-surface-variant font-medium">
                  {view.date}
                </span>
              </div>

              <div className="flex items-center gap-6 flex-1 justify-center min-w-0">
                <div className="flex flex-col items-end">
                  <span className="font-bold dark:text-[#f3d9e9] text-on-surface">
                    You
                  </span>
                </div>

                <div className="flex flex-col items-center px-4">
                  <span className="text-[20px] font-black dark:text-white text-on-surface whitespace-nowrap">
                    {view.score}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest dark:text-gray-500 text-on-surface-variant mt-1">
                    Score
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-row-reverse min-w-0">
                  <div className="w-10 h-10 rounded-full dark:bg-[#1a2632] bg-surface-container-high flex items-center justify-center text-[13px] font-black overflow-hidden shrink-0">
                    <UserAvatar
                      avatarUrl={view.opponentAvatar}
                      name={view.opponentName}
                      className="w-full h-full bg-transparent"
                    />
                  </div>
                  <span className="font-bold dark:text-[#f3d9e9] text-on-surface truncate">
                    {view.opponentName}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end w-28">
                <div
                  className={`flex items-center gap-1 font-bold text-[16px] ${view.ratingChange > 0 ? "dark:text-[#4dd0d0] text-primary" : view.ratingChange < 0 ? "dark:text-[#ff3b30] text-error" : "dark:text-gray-400 text-on-surface-variant"}`}
                >
                  <LucideIcon
                    name={
                      view.ratingChange > 0
                        ? "trending_up"
                        : view.ratingChange < 0
                          ? "trending_down"
                          : isDraw
                            ? "remove"
                            : "show_chart"
                    }
                    className="text-[18px]"
                  />
                  {view.ratingChange > 0 ? "+" : ""}
                  {view.ratingChange}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArenaHistoryPage;
