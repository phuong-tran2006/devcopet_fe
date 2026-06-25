import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import PlayerCard from "../components/PlayerCard";
import OpponentCard from "../components/OpponentCard";
import { useAuthStore } from "../../users/store/auth.store";
import { useArenaStore } from "../store/arena.store";
import type { ArenaMode } from "../store/arena.store";
import LucideIcon from "../../../components/ui/LucideIcon";

const MatchmakingPage = () => {
  const mode: ArenaMode = "ranked";
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const {
    status,
    players,
    matchTier,
    waitingSeconds,
    errorMessage,
    connectArenaSocket,
    findMatch,
    cancelFindMatch,
    hasAccepted,
    acceptTimeoutSeconds,
    acceptMatch,
    declineMatch,
  } = useArenaStore();

  useEffect(() => {
    connectArenaSocket();
  }, [connectArenaSocket]);

  // Visual countdown timer for match acceptance
  const [modalTimeLeft, setModalTimeLeft] = useState(5);
  useEffect(() => {
    if (status === "accepting") {
      setModalTimeLeft(acceptTimeoutSeconds || 5);
      const interval = setInterval(() => {
        setModalTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, acceptTimeoutSeconds]);

  // Automatically navigate to active battle room when match starts
  useEffect(() => {
    if (status === "countdown" || status === "playing") {
      navigate({ to: "/arena/active" });
    }
  }, [status, navigate]);

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
      players[1] ||
      null
    );
  }, [me, players]);

  const visualStatus =
    status === "searching" || status === "accepting" ? "searching" : "idle";

  const titles = {
    idle: "ARENA QUEUE",
    searching: "FINDING ROOM",
  };

  const subtitles = {
    idle: "Find a fair Arena room and start climbing the ranks.",
    searching: "Waiting for an opponent...",
  };

  const handleStartSearch = () => {
    findMatch({ courseSlug: "python-basic", mode });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-5 dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#13222e] dark:to-[#081015] bg-surface-container-lowest transition-colors duration-300 overflow-hidden relative">
      <div className="text-center mb-10 animate-fade-in transition-all duration-300">
        <h1 className="text-[30px] font-extrabold tracking-[0.08em] dark:drop-shadow-[0_0_15px_rgba(244,236,244,0.3)] mb-2 transition-colors duration-300 dark:text-[#f4ecf4] text-on-surface">
          {titles[visualStatus]}
        </h1>
        <p className="dark:text-gray-400 text-on-surface-variant text-[14px] transition-colors duration-300">
          {subtitles[visualStatus]}
        </p>
      </div>

      <div className="relative flex items-center justify-center gap-4 sm:gap-6 lg:gap-10 w-full max-w-4xl">
        <div className="flex-1 flex justify-end">
          <PlayerCard
            name={
              me?.username ||
              currentUser?.username ||
              currentUser?.name ||
              "You"
            }
            level={Number(currentUser?.level) || 1}
            rank={me?.arenaRank || matchTier || "Beginner"}
            rating={me?.arenaRating}
            avatarUrl={me?.avatarUrl || (currentUser?.avatarUrl as string)}
          />
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none">
          <div
            className="w-12 h-12 rounded-full dark:bg-[#1e2e38] bg-surface-container-high border-4 dark:border-[#081015] border-surface shadow-2xl flex items-center justify-center transition-colors duration-300"
            style={{ color: "var(--md-sys-color-primary)" }}
          >
            <LucideIcon name="bolt" className="text-[26px] dark:text-[#4dd0d0]" />
          </div>
          <span className="font-black text-[16px] tracking-widest transition-colors duration-300 dark:text-[#4dd0d0] text-primary">
            VS
          </span>
        </div>

        <div className="flex-1 flex justify-start">
          <OpponentCard status={visualStatus} opponent={opponent} />
        </div>
      </div>

      <div className="mt-7 min-h-20 flex flex-col items-center gap-3">
        {status === "searching" && (
          <div className="text-[14px] dark:text-gray-300 text-on-surface-variant font-black tabular-nums">
            Waiting {waitingSeconds}s
          </div>
        )}
        {errorMessage && (
          <div className="text-[13px] text-error font-semibold">
            {errorMessage}
          </div>
        )}

        {status === "idle" && (
          <button
            type="button"
            onClick={handleStartSearch}
            className="dark:bg-[#29b6f6] bg-primary dark:hover:bg-[#4fc3f7] hover:bg-primary/90 dark:text-[#081015] text-on-primary font-extrabold text-[16px] tracking-[0.08em] py-3.5 px-10 rounded-full dark:shadow-[0_0_20px_rgba(41,182,246,0.4)] shadow-md transition-all transform hover:scale-105"
          >
            FIND ROOM
          </button>
        )}

        {status === "searching" && (
          <button
            type="button"
            onClick={cancelFindMatch}
            className="dark:bg-[#3a4450] bg-surface-container-highest dark:hover:bg-[#4a5563] hover:bg-outline/20 dark:text-gray-200 text-on-surface font-extrabold text-[14px] tracking-[0.08em] py-3 px-10 rounded-full shadow-inner transition-all"
          >
            CANCEL
          </button>
        )}
      </div>

      {/* MATCH ACCEPTING OVERLAY MODAL */}
      {status === "accepting" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-surface-container border border-outline/10 rounded-2xl p-8 flex flex-col items-center shadow-[0_0_50px_rgba(255,59,48,0.25)] relative transform scale-100 transition-all duration-300">
            <div className="text-center mb-6">
              <h2 className="text-[26px] font-black text-error tracking-wider uppercase mb-2">
                MATCH FOUND
              </h2>
              <p className="text-sm text-on-surface-variant font-bold">
                {matchTier
                  ? `${matchTier} Ranked Room is Ready!`
                  : "Accept the battle room to enter the arena."}
              </p>
            </div>

            {/* Circular Timer Visual */}
            <div className="relative w-20 h-20 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-surface-container-high fill-none"
                  strokeWidth="6"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-error fill-none transition-all duration-1000 ease-linear"
                  strokeWidth="6"
                  strokeDasharray="213.6"
                  strokeDashoffset={
                    213.6 -
                    (213.6 * modalTimeLeft) / (acceptTimeoutSeconds || 5)
                  }
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-2xl font-mono font-black text-on-surface">
                {modalTimeLeft}
              </span>
            </div>

            {/* 2 Player Cards VS Container inside Modal */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-lg mb-8">
              <PlayerCard
                name={me?.username || currentUser?.username || "You"}
                level={Number(currentUser?.level) || 1}
                rank={me?.arenaRank || matchTier || "Beginner"}
                rating={me?.arenaRating}
                avatarUrl={me?.avatarUrl || (currentUser?.avatarUrl as string)}
              />

              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-10 h-10 rounded-full bg-error-container border-2 border-error/30 flex items-center justify-center text-error animate-pulse">
                  <LucideIcon name="bolt" className="text-[20px]" />
                </div>
                <span className="font-black text-xs tracking-widest text-error">
                  VS
                </span>
              </div>

              <OpponentCard status="found" opponent={opponent} />
            </div>

            {/* Action buttons inside Modal */}
            <div className="w-full flex items-center justify-center gap-4 mt-2">
              {!hasAccepted ? (
                <>
                  <button
                    type="button"
                    onClick={declineMatch}
                    className="flex-1 max-w-[200px] border-2 border-outline/20 hover:border-error/40 dark:hover:bg-error/10 hover:bg-error/5 dark:text-gray-300 text-on-surface font-black text-[14px] tracking-wider py-3.5 px-6 rounded-full transition-all duration-200"
                  >
                    DECLINE
                  </button>
                  <button
                    type="button"
                    onClick={acceptMatch}
                    className="flex-1 max-w-[200px] bg-error hover:bg-error/90 text-white font-black text-[14px] tracking-wider py-3.5 px-6 rounded-full shadow-[0_0_20px_rgba(255,59,48,0.4)] transition-all duration-200 transform hover:scale-105"
                  >
                    ACCEPT MATCH
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-primary animate-pulse uppercase tracking-wider">
                    Accepted! Waiting for opponent...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchmakingPage;
