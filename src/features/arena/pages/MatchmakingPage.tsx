import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import PlayerCard from "../components/PlayerCard";
import OpponentCard from "../components/OpponentCard";
import { useAuthStore } from "../../users/store/auth.store";

const MatchmakingPage = () => {
  const [status, setStatus] = useState<"idle" | "searching" | "found">("idle");
  const [opponent, setOpponent] = useState<any>(null);
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const handleStartSearch = async () => {
    setStatus("searching");
    try {
      const { api } = await import("../../../services/axiosClient");
      const response = await api.get("/users/match");
      const opponentData = response.data;
      setOpponent(opponentData);
      sessionStorage.setItem("currentOpponent", JSON.stringify(opponentData));
      // Delay for visual effect
      setTimeout(() => {
        setStatus("found");
      }, 2000);
    } catch (err) {
      console.error("Matchmaking failed", err);
      // Fallback opponent
      const fallbackOpponent = {
        _id: "mock-opponent",
        username: "ByteMaster",
        level: 40,
        exp: 39500,
        avatarUrl: "https://i.pravatar.cc/150?u=byte",
        bio: "Ready to battle!",
      };
      setOpponent(fallbackOpponent);
      sessionStorage.setItem("currentOpponent", JSON.stringify(fallbackOpponent));
      setTimeout(() => {
        setStatus("found");
      }, 2000);
    }
  };

  const handleCancelSearch = () => {
    setStatus("idle");
    setOpponent(null);
    sessionStorage.removeItem("currentOpponent");
  };

  const handleReady = () => {
    navigate({ to: "/dashboard/active" });
  };

  const titles = {
    idle: "ARENA MATCHMAKING",
    searching: "FINDING OPPONENT",
    found: "OPPONENT FOUND!",
  };

  const subtitles = {
    idle: "Find an opponent of your skill level to battle.",
    searching: "Searching global elite developer ranks...",
    found: "Prepare for battle!",
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#13222e] dark:to-[#081015] bg-surface-container-lowest transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-16 animate-fade-in transition-all duration-300">
        <h1
          className={`text-[36px] font-extrabold tracking-[0.1em] dark:drop-shadow-[0_0_15px_rgba(244,236,244,0.3)] mb-3 transition-colors duration-300 ${status === "found" ? "dark:text-[#ff3b30] text-error" : "dark:text-[#f4ecf4] text-on-surface"}`}
        >
          {titles[status]}
        </h1>
        <p className="dark:text-gray-400 text-on-surface-variant text-[15px] transition-colors duration-300">
          {subtitles[status]}
        </p>
      </div>

      {/* VS Container */}
      <div className="relative flex items-center justify-center gap-4 sm:gap-8 lg:gap-16 w-full max-w-5xl">
        {/* Left Card */}
        <div className="flex-1 flex justify-end">
          <PlayerCard
            name={currentUser?.username || "CodeNinja"}
            level={Number(currentUser?.level) || 1}
            rank={(currentUser?.level || 1) >= 15 ? "Elite" : "Novice"}
            avatarUrl={(currentUser?.avatarUrl as string) || "https://i.pravatar.cc/150?u=a04258114e29026702d"}
          />
        </div>

        {/* VS Badge */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-full dark:bg-[#1e2e38] bg-surface-container-high border-4 dark:border-[#081015] border-surface shadow-2xl flex items-center justify-center transition-colors duration-300"
            style={
              status === "found"
                ? {
                    color: "#ff3b30",
                    borderColor: "var(--md-sys-color-error-container)",
                  }
                : { color: "var(--md-sys-color-primary)" }
            }
          >
            <span
              className="material-symbols-outlined text-[32px] dark:text-[#4dd0d0]"
              style={status === "found" ? { color: "inherit" } : {}}
            >
              bolt
            </span>
          </div>
          <span
            className={`font-black text-[20px] tracking-widest transition-colors duration-300 ${status === "found" ? "dark:text-[#ff3b30] text-error dark:drop-shadow-[0_0_8px_rgba(255,59,48,0.5)]" : "dark:text-[#4dd0d0] text-primary dark:drop-shadow-[0_0_8px_rgba(77,208,208,0.5)]"}`}
          >
            VS
          </span>
        </div>

        {/* Right Card */}
        <div className="flex-1 flex justify-start">
          <OpponentCard status={status} opponent={opponent} />
        </div>
      </div>

      {/* Bottom Button */}
      <div className="mt-20 h-16">
        {status === "idle" && (
          <button
            onClick={handleStartSearch}
            className="dark:bg-[#29b6f6] bg-primary dark:hover:bg-[#4fc3f7] hover:bg-primary/90 dark:text-[#081015] text-on-primary font-extrabold text-[18px] tracking-[0.1em] py-4 px-12 rounded-full dark:shadow-[0_0_20px_rgba(41,182,246,0.4)] shadow-md transition-all transform hover:scale-105"
          >
            FIND MATCH
          </button>
        )}

        {status === "searching" && (
          <button
            onClick={handleCancelSearch}
            className="dark:bg-[#3a4450] bg-surface-container-highest dark:hover:bg-[#4a5563] hover:bg-outline/20 dark:text-gray-200 text-on-surface font-extrabold text-[16px] tracking-[0.1em] py-4 px-12 rounded-full shadow-inner transition-all"
          >
            CANCEL
          </button>
        )}

        {status === "found" && (
          <button
            onClick={handleReady}
            className="dark:bg-[#ff3b30] bg-error dark:hover:bg-[#ff453a] hover:bg-error/90 text-white font-extrabold text-[18px] tracking-[0.15em] py-4 px-16 rounded-full dark:shadow-[0_0_20px_rgba(255,59,48,0.4)] shadow-md transition-all transform hover:scale-105 animate-pulse"
          >
            READY
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchmakingPage;
