import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../../users/store/auth.store";
import { useArenaStore } from "../../store/arena.store";
import LucideIcon from "../../../../components/ui/LucideIcon";

const VictoryView = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { matchResult, scoreboard, players, totalQuestions, resetArena } =
    useArenaStore();

  const [meAvatarError, setMeAvatarError] = useState(false);
  const [opponentAvatarError, setOpponentAvatarError] = useState(false);

  const currentUserId = useMemo(() => {
    const rawId = currentUser?.id || currentUser?._id;
    return rawId ? String(rawId) : undefined;
  }, [currentUser]);

  const me = useMemo(() => {
    return (
      players.find(
        (player) => currentUserId && player.userId === currentUserId,
      ) ||
      players.find((player) => !player.isBot) ||
      players[0]
    );
  }, [currentUserId, players]);

  const opponent = useMemo(() => {
    return (
      players.find((player) => me && player.userId !== me.userId) ||
      players.find((player) => player.isBot) ||
      players[1]
    );
  }, [me, players]);

  const finalScores = matchResult?.finalScoreboard || scoreboard;

  const myScore = useMemo(() => {
    return (
      finalScores.find(
        (item) => currentUserId && item.userId === currentUserId,
      ) ||
      finalScores.find((item) => !item.isBot) ||
      finalScores[0]
    );
  }, [finalScores, currentUserId]);

  const opponentScore = useMemo(() => {
    return (
      finalScores.find((item) => myScore && item.userId !== myScore.userId) ||
      finalScores.find((item) => item.isBot) ||
      finalScores[1]
    );
  }, [finalScores, myScore]);

  const myRatingChange = useMemo(() => {
    return matchResult?.ratingChanges?.find(
      (item) => myScore && item.userId === myScore.userId,
    );
  }, [matchResult, myScore]);

  const opponentRatingChange = useMemo(() => {
    return matchResult?.ratingChanges?.find(
      (item) => opponentScore && item.userId === opponentScore.userId,
    );
  }, [matchResult, opponentScore]);

  const myRankUp = useMemo(() => {
    return matchResult?.rankUp?.find(
      (item) => myScore && item.userId === myScore.userId,
    );
  }, [matchResult, myScore]);

  const result = matchResult?.result || "draw";

  // Visual assets configurations based on match result
  const title =
    result === "win" ? "VICTORY" : result === "lose" ? "DEFEAT" : "DRAW";

  const titleColorClass =
    result === "win"
      ? "from-[#b45309] via-[#d97706] to-[#b45309] dark:from-[#ffe082] dark:via-[#ffb300] dark:to-[#ff8f00]"
      : result === "lose"
        ? "from-[#b91c1c] via-[#dc2626] to-[#991b1b] dark:from-[#ff8a80] dark:via-[#ff1744] dark:to-[#c62828]"
        : "from-[#475569] via-[#64748b] to-[#475569] dark:from-[#e2e8f0] dark:via-[#94a3b8] dark:to-[#475569]";

  const headerIcon =
    result === "win"
      ? "emoji_events"
      : result === "lose"
        ? "sentiment_very_dissatisfied"
        : "balance";

  const headerIconColor =
    result === "win"
      ? "text-[#d97706] dark:text-[#ffb300]"
      : result === "lose"
        ? "text-[#dc2626] dark:text-[#ff1744]"
        : "text-[#64748b] dark:text-[#94a3b8]";

  const headerIconContainerClass = useMemo(() => {
    if (result === "win")
      return "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 dark:border-amber-500/30";
    if (result === "lose")
      return "bg-red-500/5 dark:bg-red-500/10 border-red-500/20 dark:border-red-500/30";
    return "bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 dark:border-slate-500/30";
  }, [result]);

  const myUsername = useMemo(() => {
    return myScore?.username || currentUser?.username || "You";
  }, [myScore, currentUser]);

  const myInitial = useMemo(() => {
    return myUsername.charAt(0).toUpperCase();
  }, [myUsername]);

  const opponentUsername = useMemo(() => {
    return opponentScore?.username || opponent?.username || "Opponent";
  }, [opponentScore, opponent]);

  const opponentInitial = useMemo(() => {
    return opponentUsername.charAt(0).toUpperCase();
  }, [opponentUsername]);

  const myAvatarUrl = useMemo(() => {
    const url = me?.avatarUrl || currentUser?.avatarUrl;
    return url && !url.includes("pravatar.cc") ? url : undefined;
  }, [me, currentUser]);

  const opponentAvatarUrl = useMemo(() => {
    const url = opponent?.avatarUrl;
    return url && !url.includes("pravatar.cc") ? url : undefined;
  }, [opponent]);

  const goLobby = () => {
    resetArena();
    navigate({ to: "/arena" });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 dark:bg-[#050b11]/90 backdrop-blur-md p-4 transition-colors duration-300 flex items-center justify-center">
      <div className="min-h-full w-full flex items-center justify-center py-4">
        <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-on-surface/10 dark:border-white/10 bg-surface-container shadow-2xl dark:shadow-black/50 flex flex-col p-4 md:p-5 items-center">
          {/* Dynamic header visual (winner cup or defeat skull in badge container) */}
          <div className="flex flex-col items-center gap-1 mb-3">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-md ${headerIconContainerClass} mb-0.5`}
            >
              <LucideIcon name={headerIcon} className={`text-[24px] ${headerIconColor}`} />
            </div>
            <h1
              className={`text-[24px] md:text-[28px] font-black tracking-[0.2em] bg-gradient-to-r ${titleColorClass} bg-clip-text text-transparent leading-none mt-0.5`}
            >
              {title}
            </h1>
            <span className="text-on-surface-variant dark:text-gray-400 text-[9px] font-black tracking-[0.3em] uppercase opacity-80 mt-0.5">
              Arena Match Summary
            </span>
          </div>

          {/* Dual Cards: Me vs Opponent */}
          <div className="grid grid-cols-2 gap-3 w-full mb-3 relative">
            {/* Your Card */}
            <div
              className={`relative flex flex-col items-center bg-surface-container-high/60 dark:bg-[#131d2b]/60 border rounded-2xl p-3 transition-all ${
                result === "win"
                  ? "border-teal-500/40 dark:border-teal-400/40 shadow-md"
                  : "border-on-surface/10 dark:border-white/10"
              }`}
            >
              {result === "win" && (
                <span className="absolute top-2 right-2 text-[7px] font-black text-white bg-amber-500 dark:bg-amber-600 px-1.5 py-0.5 rounded-full tracking-wider">
                  WINNER
                </span>
              )}

              {/* Avatar Initial fallback - Styled Premium Gradient */}
              <div className="w-13 h-13 rounded-full border-2 border-teal-500/30 dark:border-teal-400/40 flex items-center justify-center text-xl font-black text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 mb-1.5 overflow-hidden shrink-0">
                {myAvatarUrl && !meAvatarError ? (
                  <img
                    src={myAvatarUrl}
                    alt={myUsername}
                    className="w-full h-full object-cover"
                    onError={() => setMeAvatarError(true)}
                  />
                ) : (
                  <span>{myInitial}</span>
                )}
              </div>

              <h3 className="text-sm font-black text-on-surface dark:text-[#f4d8e8] tracking-wide truncate max-w-[100px]">
                {myUsername}
              </h3>
              <span className="text-on-surface-variant dark:text-gray-400 text-[9px] mt-0.5 font-semibold tracking-wider">
                {me?.arenaRank || "Beginner"}
              </span>

              {/* Points change info */}
              {myRatingChange && (
                <div className="mt-1.5 flex flex-col items-center gap-0.5">
                  <span className="text-[8px] text-on-surface-variant dark:text-gray-400 font-bold tracking-widest uppercase">
                    Points Change
                  </span>
                  <div
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black border ${
                      myRatingChange.delta >= 0
                        ? "text-teal-800 dark:text-teal-400 border-teal-300 dark:border-teal-800/80 bg-teal-100/80 dark:bg-teal-950/40"
                        : "text-red-800 dark:text-red-400 border-red-300 dark:border-red-800/80 bg-red-100/80 dark:bg-red-950/40"
                    }`}
                  >
                    <LucideIcon name={myRatingChange.delta >= 0
                        ? "trending_up"
                        : "trending_down"} className="text-[10px]" />
                    <span>
                      {myRatingChange.oldRating} ➔ {myRatingChange.newRating} (
                      {myRatingChange.delta >= 0 ? "+" : ""}
                      {myRatingChange.delta})
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Opponent Card */}
            <div
              className={`relative flex flex-col items-center bg-surface-container-high/60 dark:bg-[#131d2b]/60 border rounded-2xl p-3 transition-all ${
                result === "lose"
                  ? "border-teal-500/40 dark:border-teal-400/40 shadow-md"
                  : "border-on-surface/10 dark:border-white/10"
              }`}
            >
              {result === "lose" && (
                <span className="absolute top-2 right-2 text-[7px] font-black text-white bg-amber-500 dark:bg-amber-600 px-1.5 py-0.5 rounded-full tracking-wider">
                  WINNER
                </span>
              )}

              {/* Avatar Initial fallback - Styled Premium Gradient */}
              <div className="w-13 h-13 rounded-full border-2 border-red-500/30 dark:border-red-400/40 flex items-center justify-center text-xl font-black text-red-700 dark:text-red-300 bg-red-50/80 dark:bg-red-950/40 mb-1.5 overflow-hidden shrink-0">
                {opponentAvatarUrl && !opponentAvatarError ? (
                  <img
                    src={opponentAvatarUrl}
                    alt={opponentUsername}
                    className="w-full h-full object-cover"
                    onError={() => setOpponentAvatarError(true)}
                  />
                ) : (
                  <span>{opponentInitial}</span>
                )}
              </div>

              <h3 className="text-sm font-black text-on-surface dark:text-white tracking-wide truncate max-w-[100px]">
                {opponentUsername}
              </h3>
              <span className="text-on-surface-variant dark:text-gray-400 text-[9px] mt-0.5 font-semibold tracking-wider">
                {opponent?.arenaRank || "Beginner"}
              </span>

              {/* Opponent points change info */}
              {opponentRatingChange && (
                <div className="mt-1.5 flex flex-col items-center gap-0.5">
                  <span className="text-[8px] text-on-surface-variant dark:text-gray-400 font-bold tracking-widest uppercase">
                    Points Change
                  </span>
                  <div
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black border ${
                      opponentRatingChange.delta >= 0
                        ? "text-teal-800 dark:text-teal-400 border-teal-300 dark:border-teal-800/80 bg-teal-100/80 dark:bg-teal-950/40"
                        : "text-red-800 dark:text-red-400 border-red-300 dark:border-red-800/80 bg-red-100/80 dark:bg-red-950/40"
                    }`}
                  >
                    <LucideIcon name={opponentRatingChange.delta >= 0
                        ? "trending_up"
                        : "trending_down"} className="text-[10px]" />
                    <span>
                      {opponentRatingChange.oldRating} ➔{" "}
                      {opponentRatingChange.newRating} (
                      {opponentRatingChange.delta >= 0 ? "+" : ""}
                      {opponentRatingChange.delta})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comparative Stats Duel Grid */}
          <div className="w-full bg-surface-container-high dark:bg-[#0a111a] border border-on-surface/5 dark:border-white/5 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-inner mb-3">
            <h4 className="text-[9px] text-on-surface-variant dark:text-gray-400 font-black tracking-[0.25em] uppercase text-center mb-0.5">
              Match Statistics
            </h4>

            {/* Points Row */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-sm font-black text-teal-600 dark:text-teal-400 w-16 text-left">
                {myScore?.score || 0}
              </span>
              <span className="text-[9px] text-on-surface-variant dark:text-gray-400 font-bold tracking-widest uppercase">
                SCORE
              </span>
              <span className="text-sm font-black text-red-500 dark:text-red-400 w-16 text-right">
                {opponentScore?.score || 0}
              </span>
            </div>
            <div className="w-full h-1 bg-on-surface/10 dark:bg-white/5 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-400 dark:from-teal-600 dark:to-teal-400 h-full transition-all duration-1000"
                style={{
                  width: `${((myScore?.score || 0) / Math.max(1, (myScore?.score || 0) + (opponentScore?.score || 0))) * 100}%`,
                }}
              />
              <div
                className="bg-gradient-to-r from-red-400 to-red-500 dark:from-red-400 dark:to-red-600 h-full transition-all duration-1000"
                style={{
                  width: `${((opponentScore?.score || 0) / Math.max(1, (myScore?.score || 0) + (opponentScore?.score || 0))) * 100}%`,
                }}
              />
            </div>

            {/* Correct Count Row */}
            <div className="flex items-center justify-between text-xs font-semibold mt-0.5">
              <span className="text-xs font-black text-teal-600 dark:text-teal-400 w-16 text-left">
                {myScore?.correctCount || 0}
              </span>
              <span className="text-[9px] text-on-surface-variant dark:text-gray-400 font-bold tracking-widest uppercase">
                CORRECT ANSWERS
              </span>
              <span className="text-xs font-black text-red-500 dark:text-red-400 w-16 text-right">
                {opponentScore?.correctCount || 0}
              </span>
            </div>
            <div className="w-full h-1 bg-on-surface/10 dark:bg-white/5 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-400 dark:from-teal-600 dark:to-teal-400 h-full transition-all duration-1000"
                style={{
                  width: `${((myScore?.correctCount || 0) / Math.max(1, (myScore?.correctCount || 0) + (opponentScore?.correctCount || 0))) * 100}%`,
                }}
              />
              <div
                className="bg-gradient-to-r from-red-400 to-red-500 dark:from-red-400 dark:to-red-600 h-full transition-all duration-1000"
                style={{
                  width: `${((opponentScore?.correctCount || 0) / Math.max(1, (myScore?.correctCount || 0) + (opponentScore?.correctCount || 0))) * 100}%`,
                }}
              />
            </div>

            {/* Highest Streak Row */}
            <div className="flex items-center justify-between text-xs font-semibold mt-0.5">
              <span className="text-xs font-black text-teal-600 dark:text-teal-400 w-16 text-left">
                {myScore?.streak || 0}
              </span>
              <span className="text-[9px] text-on-surface-variant dark:text-gray-400 font-bold tracking-widest uppercase">
                HIGHEST STREAK
              </span>
              <span className="text-xs font-black text-red-500 dark:text-red-400 w-16 text-right">
                {opponentScore?.streak || 0}
              </span>
            </div>
            <div className="w-full h-1 bg-on-surface/10 dark:bg-white/5 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-400 dark:from-teal-600 dark:to-teal-400 h-full transition-all duration-1000"
                style={{
                  width: `${((myScore?.streak || 0) / Math.max(1, (myScore?.streak || 0) + (opponentScore?.streak || 0))) * 100}%`,
                }}
              />
              <div
                className="bg-gradient-to-r from-red-400 to-red-500 dark:from-red-400 dark:to-red-600 h-full transition-all duration-1000"
                style={{
                  width: `${((opponentScore?.streak || 0) / Math.max(1, (myScore?.streak || 0) + (opponentScore?.streak || 0))) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Promotion / Rank Up Card */}
          {myRankUp && (
            <div className="w-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-2.5 flex flex-col items-center gap-0.5 shadow-lg mb-3 animate-pulse">
              <div className="flex items-center gap-1">
                <LucideIcon name="stars" className="text-[14px] text-amber-400" />
                <span className="text-[8px] font-black text-amber-400 tracking-[0.25em] uppercase">
                  RANK PROMOTED!
                </span>
              </div>
              <span className="text-xs font-black text-on-surface dark:text-white">
                {myRankUp.oldRank} ➔{" "}
                <span className="text-amber-400 font-black">
                  {myRankUp.newRank}
                </span>
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
            <button
              className="flex-1 bg-on-surface/5 hover:bg-on-surface/10 text-on-surface border border-on-surface/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/10 font-black text-[12px] tracking-[0.15em] py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              onClick={goLobby}
            >
              <LucideIcon name="dashboard" className="text-[16px]" />
              BACK TO LOBBY
            </button>
            <button
              className="flex-1 bg-primary hover:bg-primary/95 text-on-primary dark:bg-gradient-to-r dark:from-teal-500 dark:to-[#00bfa5] dark:text-[#081015] font-black text-[12px] tracking-[0.15em] py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md transform hover:scale-[1.02]"
              onClick={goLobby}
            >
              <LucideIcon name="sports_esports" className="text-[16px]" />
              PLAY AGAIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryView;
