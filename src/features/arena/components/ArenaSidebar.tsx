import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "../../../services/axiosClient";
import { useArenaStore } from "../store/arena.store";

interface ArenaProfile {
  arenaRating: number;
  arenaRank: string;
  arenaTotalMatches: number;
  arenaWins: number;
  arenaLosses: number;
  arenaDraws: number;
  winRate: number;
}

const ArenaSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [profile, setProfile] = useState<ArenaProfile | null>(null);
  const { findMatch } = useArenaStore();

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const response = await api.get("/arena/me");
        if (mounted) setProfile(response.data);
      } catch (err) {
        console.error("Failed to load arena profile", err);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const navItems = [
    { label: "Matchmaking", path: "/dashboard", icon: "swords" },
    { label: "History", path: "/dashboard/history", icon: "history" },
    { label: "Rankings", path: "/dashboard/rankings", icon: "emoji_events" },
  ];

  const handleQuickMatch = () => {
    navigate({ to: "/dashboard" });
    findMatch({ courseSlug: "python-basic", mode: "ranked" });
  };

  return (
    <aside className="w-[280px] h-full dark:bg-[#0b1219] bg-surface-container border-r dark:border-white/5 border-outline/10 flex flex-col py-8 px-6 shrink-0 relative z-10 transition-colors duration-300">
      <div className="flex flex-col items-center mb-10">
        <div className="w-[84px] h-[84px] rounded-[24px] dark:bg-[#0b1219] bg-surface border-2 dark:border-[#e6c1d8] border-primary-fixed-dim flex items-center justify-center p-1 dark:shadow-[0_0_20px_rgba(230,193,216,0.15)] shadow-md mb-4 overflow-hidden transition-colors duration-300">
          <div className="w-full h-full rounded-[20px] dark:bg-gradient-to-b dark:from-[#14232e] dark:to-[#0b1219] bg-surface-container-high flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[42px] dark:text-[#29b6f6] text-primary dark:drop-shadow-[0_0_8px_rgba(41,182,246,0.6)]">
              security
            </span>
          </div>
        </div>
        <h2 className="text-[24px] font-extrabold dark:text-[#f3d9e9] text-on-surface mb-1 tracking-wide transition-colors duration-300">
          {profile?.arenaRank || "Arena Rank"}
        </h2>
        <p className="text-[13px] dark:text-gray-400 text-on-surface-variant font-medium">
          {profile ? `${profile.arenaRating} rating` : "Loading profile..."}
        </p>
        {profile && (
          <div className="grid grid-cols-2 gap-2 w-full mt-5 text-center">
            <div className="rounded-xl dark:bg-[#111a22] bg-surface px-3 py-2 border dark:border-white/5 border-outline/10">
              <div className="text-[18px] font-black dark:text-white text-on-surface">
                {profile.arenaTotalMatches}
              </div>
              <div className="text-[10px] uppercase tracking-wider dark:text-gray-500 text-on-surface-variant">
                Matches
              </div>
            </div>
            <div className="rounded-xl dark:bg-[#111a22] bg-surface px-3 py-2 border dark:border-white/5 border-outline/10">
              <div className="text-[18px] font-black dark:text-[#4dd0d0] text-primary">
                {Math.round(profile.winRate)}%
              </div>
              <div className="text-[10px] uppercase tracking-wider dark:text-gray-500 text-on-surface-variant">
                Win rate
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1.5 flex-1 mt-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-colors duration-200 ${isActive ? "dark:bg-[#5e4655] bg-primary/10 dark:text-[#ecd6e5] text-primary" : "dark:text-gray-400 text-on-surface-variant dark:hover:text-gray-200 hover:text-on-surface dark:hover:bg-white/5 hover:bg-surface-container-high"}`}
            >
              <span className="material-symbols-outlined text-[20px] opacity-90">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          onClick={handleQuickMatch}
          className="w-full dark:bg-[#d3b8cd] bg-primary dark:text-[#392634] text-on-primary font-bold py-3 px-4 rounded-xl dark:shadow-[0_0_15px_rgba(211,184,205,0.2)] shadow-md dark:hover:bg-[#e0c4da] hover:bg-primary/90 transition-colors duration-200"
        >
          Quick Match
        </button>
      </div>
    </aside>
  );
};

export default ArenaSidebar;
