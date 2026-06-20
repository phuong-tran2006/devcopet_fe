import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../../users/store/auth.store";

const VictoryView = () => {
  const navigate = useNavigate();
  const { user: currentUser, checkAuth } = useAuthStore();
  const [opponent, setOpponent] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [xpGained] = useState(150);

  useEffect(() => {
    const saved = sessionStorage.getItem("currentOpponent");
    if (saved) {
      try {
        setOpponent(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (submitted) return;
    const submitBattleResult = async () => {
      setSubmitted(true);
      try {
        const { api } = await import("../../../../services/axiosClient");
        await api.post("/users/battle/submit", { expChange: 150 });
        // Refresh player info (to update level, exp, etc. in global store)
        await checkAuth();
      } catch (err) {
        console.error("Failed to submit battle result", err);
      }
    };
    submitBattleResult();
  }, [submitted, checkAuth]);

  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in absolute inset-0 z-50 dark:bg-black/60 bg-black/30 backdrop-blur-sm p-4 transition-colors duration-300">
      {/* Main Card */}
      <div className="dark:bg-gradient-to-b dark:from-[#6b7b8f] dark:to-[#4c5c6d] bg-surface-container rounded-[32px] w-full max-w-md p-10 flex flex-col items-center shadow-2xl relative overflow-hidden border dark:border-white/10 border-outline/20 transition-colors duration-300">
        {/* Glow effect in background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-[#00ffff]/20 blur-[60px] rounded-full pointer-events-none"></div>

        {/* Victory Header */}
        <h1 className="text-[54px] font-black tracking-[0.2em] text-[#0d9488] drop-shadow-[0_0_15px_rgba(13,148,136,0.8)] leading-none mt-2 transition-colors duration-300">
          VICTORY
        </h1>
        <p className="dark:text-white text-on-surface tracking-[0.3em] text-[13px] font-bold mt-4 opacity-90 transition-colors duration-300">
          MATCH COMPLETED
        </p>

        {/* Avatar Section */}
        <div className="mt-12 mb-6 relative">
          <div className="w-[140px] h-[140px] rounded-full border border-dashed dark:border-white/50 border-outline/50 p-2 relative z-10 transition-colors duration-300">
            <div className="w-full h-full rounded-full overflow-hidden border-[4px] border-[#d69ba2] shadow-[0_0_20px_rgba(214,155,162,0.4)]">
              <img
                src={(currentUser?.avatarUrl as string) || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                alt="Player"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = "🦖";
                }}
              />
            </div>
          </div>
          {/* Subtle pink glow behind avatar */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-[#d69ba2]/40 blur-[30px] rounded-full pointer-events-none"></div>
        </div>

        {/* Player Name & Rank Up */}
        <h2 className="text-[32px] font-black dark:text-[#f4d8e8] text-primary drop-shadow-[0_0_10px_rgba(244,216,232,0.5)] tracking-wide transition-colors duration-300">
          {currentUser?.username || "PlayerOne"}
        </h2>
        <div className="mt-3 dark:bg-[#1e4e50] bg-primary/10 border border-[#0d9488] text-[#4fd1c5] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg transition-colors duration-300">
          <span className="material-symbols-outlined text-[16px]">
            emoji_events
          </span>
          <span className="text-[12px] font-bold tracking-wider">
            LVL {currentUser?.level || 1}
          </span>
        </div>

        {/* Score Board */}
        <div className="w-full dark:bg-[#11161d] bg-surface-container-highest rounded-2xl mt-10 p-6 flex items-center justify-between relative shadow-inner border dark:border-black/20 border-outline/10 transition-colors duration-300">
          {/* Player Score */}
          <div className="flex flex-col items-center w-[45%]">
            <span className="dark:text-gray-400 text-on-surface-variant text-[11px] font-bold tracking-[0.2em] mb-1 transition-colors duration-300 truncate max-w-full">
              {currentUser?.username?.toUpperCase() || "YOU"}
            </span>
            <span className="text-[32px] font-black dark:text-[#f4d8e8] text-primary drop-shadow-[0_0_10px_rgba(244,216,232,0.4)] leading-none transition-colors duration-300">
              +{xpGained} XP
            </span>
          </div>

          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#4fd1c5] flex items-center justify-center z-10 shadow-lg border-[3px] dark:border-[#11161d] border-surface transition-colors duration-300">
              <span className="dark:text-[#11161d] text-on-primary text-[10px] font-black tracking-tighter transition-colors duration-300">
                VS
              </span>
            </div>
            <div className="absolute h-[60px] w-px bg-gradient-to-b from-transparent dark:via-white/20 via-outline/30 to-transparent transition-colors duration-300"></div>
          </div>

          {/* Opponent Score */}
          <div className="flex flex-col items-center w-[45%]">
            <span className="dark:text-gray-400 text-on-surface-variant text-[11px] font-bold tracking-[0.2em] mb-1 transition-colors duration-300 truncate max-w-full">
              {opponent?.username?.toUpperCase() || "RIVAL"}
            </span>
            <span className="text-[32px] font-black dark:text-white text-on-surface leading-none transition-colors duration-300">
              +0 XP
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full mt-10">
          <button
            className="flex-1 dark:bg-[#d6bcce] bg-secondary-container dark:hover:bg-[#e6ccde] hover:bg-secondary-container/80 dark:text-[#4a3544] text-on-secondary-container font-black text-[13px] tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            <span className="material-symbols-outlined text-[18px]">
              replay
            </span>
            REMATCH
          </button>
          <button
            className="flex-1 dark:bg-[#0d9488] bg-primary hover:bg-[#0faba0] dark:text-white text-on-primary font-black text-[13px] tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            BACK TO LOBBY
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryView;
