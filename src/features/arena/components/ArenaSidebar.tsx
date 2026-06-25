import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "../../../services/axiosClient";
import { useAuthStore } from "../../users/store/auth.store";
import { useArenaStore } from "../store/arena.store";
import LucideIcon from "../../../components/ui/LucideIcon";

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
  const currentPath = location.pathname;
  const [profile, setProfile] = useState<ArenaProfile | null>(null);
  const { user: currentUser } = useAuthStore();
  const status = useArenaStore((state) => state.status);

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

    if (status === "idle" || status === "finished") {
      loadProfile();
    }

    return () => {
      mounted = false;
    };
  }, [status]);

  const navItems = [
    { label: "Matchmaking", path: "/arena", icon: "swords" },
    { label: "History", path: "/arena/history", icon: "history" },
    { label: "Rankings", path: "/arena/rankings", icon: "emoji_events" },
  ];

  return (
    <aside className="w-[280px] h-full dark:bg-[#0b1219] bg-surface-container border-r dark:border-white/5 border-outline/10 flex flex-col py-8 px-6 shrink-0 relative z-10 transition-colors duration-300">
      <div className="flex flex-col items-center mb-10">
        <div className="w-[84px] h-[84px] rounded-[24px] dark:bg-[#0b1219] bg-surface border-2 dark:border-[#e6c1d8] border-primary-fixed-dim flex items-center justify-center p-1 dark:shadow-[0_0_20px_rgba(230,193,216,0.15)] shadow-md mb-4 overflow-hidden transition-colors duration-300">
          <div className="w-full h-full rounded-[20px] dark:bg-gradient-to-b dark:from-[#14232e] dark:to-[#0b1219] bg-surface-container-high flex items-center justify-center shadow-inner overflow-hidden text-xl font-bold dark:text-white text-on-surface">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerText = (
                      currentUser?.username ||
                      currentUser?.name ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase();
                  }
                }}
              />
            ) : (
              <span>
                {(currentUser?.username || currentUser?.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <h2 className="text-[24px] font-extrabold dark:text-[#f3d9e9] text-on-surface mb-1 tracking-wide transition-colors duration-300">
          {profile?.arenaRank || "Arena Rank"}
        </h2>
        <p className="text-[13px] dark:text-gray-400 text-on-surface-variant font-medium">
          {profile ? `${profile.arenaRating} points` : "Loading profile..."}
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
              <LucideIcon name={item.icon} className="text-[20px] opacity-90" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default ArenaSidebar;
