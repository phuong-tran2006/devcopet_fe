import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../../users/store/auth.store";
import { useArenaStore } from "../../store/arena.store";

const VictoryView = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { matchResult, scoreboard, resetArena } = useArenaStore();

  const currentUserId =
    currentUser?.id || currentUser?._id
      ? String(currentUser?.id || currentUser?._id)
      : undefined;
  const finalScores = matchResult?.finalScoreboard || scoreboard;
  const myScore =
    finalScores.find(
      (item) => currentUserId && item.userId === currentUserId,
    ) ||
    finalScores.find((item) => !item.isBot) ||
    finalScores[0];
  const opponentScore =
    finalScores.find((item) => myScore && item.userId !== myScore.userId) ||
    finalScores.find((item) => item.isBot) ||
    finalScores[1];
  const myRatingChange = matchResult?.ratingChanges?.find(
    (item) => myScore && item.userId === myScore.userId,
  );
  const myRankUp = matchResult?.rankUp?.find(
    (item) => myScore && item.userId === myScore.userId,
  );

  const result = matchResult?.result || "draw";
  const title =
    result === "win" ? "VICTORY" : result === "lose" ? "DEFEAT" : "DRAW";
  const titleStyle =
    result === "win"
      ? "bg-gradient-to-r from-[#ffe066] via-[#f5b041] to-[#f39c12] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(243,156,18,0.7)]"
      : result === "lose"
        ? "bg-gradient-to-r from-[#ff8a8a] via-[#ff4d4d] to-[#d63031] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(214,48,49,0.7)]"
        : "bg-gradient-to-r from-[#e2e8f0] via-[#94a3b8] to-[#64748b] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(148,163,184,0.5)]";
  const avatarUrl =
    (currentUser?.avatarUrl as string) ||
    "https://i.pravatar.cc/150?u=arena-you";

  const goLobby = () => {
    resetArena();
    navigate({ to: "/arena" });
  };

  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in absolute inset-0 z-50 dark:bg-black/60 bg-black/30 backdrop-blur-sm p-4 transition-colors duration-300">
      <div className="dark:bg-gradient-to-b dark:from-[#6b7b8f] dark:to-[#4c5c6d] bg-surface-container rounded-[32px] w-full max-w-md p-10 flex flex-col items-center shadow-2xl relative overflow-hidden border dark:border-white/10 border-outline/20 transition-colors duration-300">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-[#00ffff]/20 blur-[60px] rounded-full pointer-events-none"></div>

        <h1
          className={`text-[54px] font-black tracking-[0.2em] ${titleStyle} leading-none mt-2 transition-colors duration-300`}
        >
          {title}
        </h1>
        <p className="dark:text-white text-on-surface tracking-[0.3em] text-[13px] font-bold mt-4 opacity-90 transition-colors duration-300">
          MATCH COMPLETED
        </p>

        <div className="mt-12 mb-6 relative">
          <div className="w-[140px] h-[140px] rounded-full border border-dashed dark:border-white/50 border-outline/50 p-2 relative z-10 transition-colors duration-300">
            <div className="w-full h-full rounded-full overflow-hidden border-[4px] border-[#d69ba2] shadow-[0_0_20px_rgba(214,155,162,0.4)]">
              <img
                src={avatarUrl}
                alt="Player"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-[#d69ba2]/40 blur-[30px] rounded-full pointer-events-none"></div>
        </div>

        <h2 className="text-[32px] font-black dark:text-[#f4d8e8] text-primary drop-shadow-[0_0_10px_rgba(244,216,232,0.5)] tracking-wide transition-colors duration-300">
          {myScore?.username || currentUser?.username || "Player"}
        </h2>
        <div className="mt-3 dark:bg-[#1e4e50] bg-primary/10 border border-[#0d9488] text-[#4fd1c5] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg transition-colors duration-300">
          <span className="material-symbols-outlined text-[16px]">
            emoji_events
          </span>
          <span className="text-[12px] font-bold tracking-wider">
            {myRatingChange
              ? `${myRatingChange.oldRating} to ${myRatingChange.newRating}`
              : "Arena Result"}
          </span>
        </div>

        {myRankUp && (
          <div className="mt-4 rounded-xl bg-primary/10 border border-primary/20 text-primary px-4 py-2 text-[13px] font-black">
            Rank up: {myRankUp.oldRank} to {myRankUp.newRank}
          </div>
        )}

        <div className="w-full dark:bg-[#11161d] bg-surface-container-highest rounded-2xl mt-10 p-6 flex items-center justify-between relative shadow-inner border dark:border-black/20 border-outline/10 transition-colors duration-300">
          <div className="flex flex-col items-center w-[45%]">
            <span className="dark:text-gray-400 text-on-surface-variant text-[11px] font-bold tracking-[0.2em] mb-1 transition-colors duration-300 truncate max-w-full">
              {(myScore?.username || "YOU").toUpperCase()}
            </span>
            <span className="text-[32px] font-black dark:text-[#f4d8e8] text-primary drop-shadow-[0_0_10px_rgba(244,216,232,0.4)] leading-none transition-colors duration-300">
              {myScore?.score || 0}
            </span>
            {myRatingChange && (
              <span
                className={`mt-2 text-[13px] font-bold ${myRatingChange.delta >= 0 ? "text-primary" : "text-error"}`}
              >
                {myRatingChange.delta >= 0 ? "+" : ""}
                {myRatingChange.delta} rating
              </span>
            )}
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#4fd1c5] flex items-center justify-center z-10 shadow-lg border-[3px] dark:border-[#11161d] border-surface transition-colors duration-300">
              <span className="dark:text-[#11161d] text-on-primary text-[10px] font-black tracking-tighter transition-colors duration-300">
                VS
              </span>
            </div>
            <div className="absolute h-[60px] w-px bg-gradient-to-b from-transparent dark:via-white/20 via-outline/30 to-transparent transition-colors duration-300"></div>
          </div>

          <div className="flex flex-col items-center w-[45%]">
            <span className="dark:text-gray-400 text-on-surface-variant text-[11px] font-bold tracking-[0.2em] mb-1 transition-colors duration-300 truncate max-w-full">
              {(opponentScore?.username || "RIVAL").toUpperCase()}
            </span>
            <span className="text-[32px] font-black dark:text-white text-on-surface leading-none transition-colors duration-300">
              {opponentScore?.score || 0}
            </span>
          </div>
        </div>

        <div className="flex gap-4 w-full mt-10">
          <button
            className="flex-1 dark:bg-[#d6bcce] bg-secondary-container dark:hover:bg-[#e6ccde] hover:bg-secondary-container/80 dark:text-[#4a3544] text-on-secondary-container font-black text-[13px] tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
            onClick={goLobby}
          >
            <span className="material-symbols-outlined text-[18px]">
              replay
            </span>
            REMATCH
          </button>
          <button
            className="flex-1 dark:bg-[#0d9488] bg-primary hover:bg-[#0faba0] dark:text-white text-on-primary font-black text-[13px] tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
            onClick={goLobby}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            LOBBY
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryView;
