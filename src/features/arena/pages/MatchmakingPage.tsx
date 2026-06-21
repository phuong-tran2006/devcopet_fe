import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import PlayerCard from "../components/PlayerCard";
import OpponentCard from "../components/OpponentCard";
import { useAuthStore } from "../../users/store/auth.store";
import { useArenaStore } from "../store/arena.store";
import type { ArenaMode } from "../store/arena.store";

const modes: ArenaMode[] = ["ranked", "casual", "practice"];

const MatchmakingPage = () => {
  const [mode, setMode] = useState<ArenaMode>("ranked");
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
    leaveRoom,
  } = useArenaStore();

  useEffect(() => {
    connectArenaSocket();
  }, [connectArenaSocket]);

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

  const hasMatch = players.length > 0;
  const visualStatus =
    status === "searching" ? "searching" : hasMatch ? "found" : "idle";

  const titles = {
    idle: "ARENA QUEUE",
    searching: "FINDING ROOM",
    found: "MATCH FOUND",
  };

  const subtitles = {
    idle: "Choose a queue and find a fair Arena room.",
    searching: "Waiting for an opponent...",
    found: matchTier
      ? `${matchTier} ranked room is ready.`
      : "Confirm to enter the battle room.",
  };

  const handleStartSearch = () => {
    findMatch({ courseSlug: "python-basic", mode });
  };

  const handleDecline = () => {
    leaveRoom();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-5 dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#13222e] dark:to-[#081015] bg-surface-container-lowest transition-colors duration-300 overflow-hidden">
      <div className="text-center mb-6 animate-fade-in transition-all duration-300">
        <h1
          className={`text-[30px] font-extrabold tracking-[0.08em] dark:drop-shadow-[0_0_15px_rgba(244,236,244,0.3)] mb-2 transition-colors duration-300 ${visualStatus === "found" ? "dark:text-[#ff3b30] text-error" : "dark:text-[#f4ecf4] text-on-surface"}`}
        >
          {titles[visualStatus]}
        </h1>
        <p className="dark:text-gray-400 text-on-surface-variant text-[14px] transition-colors duration-300">
          {subtitles[visualStatus]}
        </p>
      </div>

      <div className="flex rounded-xl dark:bg-[#111a22] bg-surface border dark:border-white/10 border-outline/20 p-1 mb-7">
        {modes.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            disabled={status === "searching" || hasMatch}
            className={`px-4 py-2 rounded-lg text-[12px] font-black capitalize transition-colors disabled:opacity-60 ${mode === item ? "dark:bg-[#29b6f6] bg-primary dark:text-[#081015] text-on-primary" : "dark:text-gray-400 text-on-surface-variant"}`}
          >
            {item}
          </button>
        ))}
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
            avatarUrl={
              me?.avatarUrl ||
              (currentUser?.avatarUrl as string) ||
              "https://i.pravatar.cc/150?u=a04258114e29026702d"
            }
          />
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none">
          <div
            className="w-12 h-12 rounded-full dark:bg-[#1e2e38] bg-surface-container-high border-4 dark:border-[#081015] border-surface shadow-2xl flex items-center justify-center transition-colors duration-300"
            style={
              visualStatus === "found"
                ? {
                    color: "#ff3b30",
                    borderColor: "var(--md-sys-color-error-container)",
                  }
                : { color: "var(--md-sys-color-primary)" }
            }
          >
            <span
              className="material-symbols-outlined text-[26px] dark:text-[#4dd0d0]"
              style={visualStatus === "found" ? { color: "inherit" } : {}}
            >
              bolt
            </span>
          </div>
          <span
            className={`font-black text-[16px] tracking-widest transition-colors duration-300 ${visualStatus === "found" ? "dark:text-[#ff3b30] text-error" : "dark:text-[#4dd0d0] text-primary"}`}
          >
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

        {!hasMatch && status !== "searching" && (
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

        {hasMatch && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDecline}
              className="dark:bg-[#3a4450] bg-surface-container-highest hover:bg-outline/20 dark:text-gray-200 text-on-surface font-black text-[13px] tracking-wider py-3 px-8 rounded-full transition-all"
            >
              DECLINE
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/dashboard/active" })}
              className="dark:bg-[#ff3b30] bg-error dark:hover:bg-[#ff453a] hover:bg-error/90 text-white font-black text-[14px] tracking-wider py-3 px-10 rounded-full dark:shadow-[0_0_20px_rgba(255,59,48,0.35)] shadow-md transition-all transform hover:scale-105"
            >
              ACCEPT MATCH
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchmakingPage;
