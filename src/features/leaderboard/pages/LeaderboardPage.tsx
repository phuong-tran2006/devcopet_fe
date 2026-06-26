import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../users/store/auth.store";
import { profileApi } from "../../profile/api/profile.api";
import LucideIcon from "../../../components/ui/LucideIcon";

type LeaderboardUser = {
  _id?: string;
  id?: string;
  username?: string;
  name?: string;
  level?: number;
  lifetimeXp?: number;
  currentXp?: number;
  rank?: number;
  avatarUrl?: string;
};

type DisplayUser = {
  rank: number;
  name: string;
  level: string;
  badge: string;
  currentXp: number;
  currentXpFormatted: string;
  avatarUrl?: string;
};

const getDisplayName = (user: LeaderboardUser) =>
  user.name || user.username || "Unknown";

const getBadge = (level = 1) => {
  if (level >= 30) return "CODE NINJA";
  if (level >= 15) return "DATA NOVICE";
  return "NOVICE";
};

const toDisplayUser = (user: LeaderboardUser): DisplayUser => ({
  rank: Number(user.rank || 0),
  name: getDisplayName(user),
  level: `Lvl ${user.level ?? 1}`,
  badge: getBadge(user.level),
  currentXp: Number(user.currentXp ?? 0),
  currentXpFormatted: Number(user.currentXp ?? 0).toLocaleString(),
  avatarUrl: user.avatarUrl,
});

const getPodiumStyle = (rank: number) => {
  if (rank === 1) {
    return {
      order: "order-1 md:order-2",
      width: "md:w-[320px]",
      padding: "p-8",
      offset: "md:-translate-y-4 hover:-translate-y-6",
      border: "border-[#F687B3]/30",
      color: "#F687B3",
      text: "text-[#F687B3]",
      avatarSize: "h-32 w-32 text-3xl",
      badgeSize: "h-9 w-9 text-[18px]",
      title: "text-[24px]",
      pointsLabel: "Available XP",
      icon: "emoji_events",
    };
  }

  if (rank === 2) {
    return {
      order: "order-2 md:order-1",
      width: "md:w-[280px]",
      padding: "p-6",
      offset: "hover:-translate-y-1",
      border: "border-[#4FD1C5]/20",
      color: "#4FD1C5",
      text: "text-[#4FD1C5]",
      avatarSize: "h-24 w-24 text-[24px]",
      badgeSize: "h-7 w-7 text-[13px]",
      title: "text-[18px]",
      pointsLabel: "Available XP",
      icon: null,
    };
  }

  return {
    order: "order-3",
    width: "md:w-[280px]",
    padding: "p-6",
    offset: "hover:-translate-y-1",
    border: "border-[#A0AEC0]/20",
    color: "#A0AEC0",
    text: "text-[#A0AEC0]",
    avatarSize: "h-24 w-24 text-2xl",
    badgeSize: "h-7 w-7 text-[13px]",
    title: "text-[18px]",
    pointsLabel: "Available XP",
    icon: null,
  };
};

const getOrderedPodium = (users: DisplayUser[]) => {
  const topUsers = users.slice(0, 3);
  if (topUsers.length < 3) return topUsers;
  return [topUsers[1], topUsers[0], topUsers[2]];
};

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("Python World");
  const [showAll, setShowAll] = useState(false);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuthStore();

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileApi.getLeaderboard();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.items || [];

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load leaderboard from backend", err);
      setUsers([]);
      setError("Could not load leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const displayUsers = useMemo(() => users.map(toDisplayUser), [users]);
  const podium = useMemo(() => getOrderedPodium(displayUsers), [displayUsers]);
  const rankings = useMemo(() => displayUsers.slice(3), [displayUsers]);

  const currentUserRank = useMemo(() => {
    if (!currentUser) return null;

    const found = users.find(
      (user) =>
        user._id === currentUser.id ||
        user.id === currentUser.id ||
        user.username === currentUser.username,
    );

    if (!found) return null;

    return toDisplayUser({
      ...found,
      username: currentUser.username || found.username,
      name: currentUser.name || found.name,
      avatarUrl: currentUser.avatarUrl || found.avatarUrl,
    });
  }, [users, currentUser]);

  const renderAvatar = (user: Pick<DisplayUser, "avatarUrl" | "name">) =>
    user.avatarUrl ? (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = "none";
          if (event.currentTarget.parentElement) {
            event.currentTarget.parentElement.innerText = user.name
              ? user.name.charAt(0).toUpperCase()
              : "?";
          }
        }}
      />
    ) : (
      <span>{user.name ? user.name.charAt(0).toUpperCase() : "?"}</span>
    );

  return (
    <main className="min-h-[calc(100vh-80px)] w-full bg-background relative overflow-x-hidden font-sans pb-24 text-on-surface">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-primary-fixed-dim/5 rounded-full blur-[100px] top-[-200px] left-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-[1000px] mx-auto pt-10 px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div className="max-w-[500px]">
            <h1 className="text-[36px] md:text-[42px] font-extrabold text-on-surface tracking-tight mb-2">
              Hall of Champions
            </h1>
            <p className="text-[15px] text-on-surface-variant leading-relaxed">
              Battle for supremacy in your chosen domain. Master languages and
              climb the global ranks.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface-container/50 border border-on-surface/10 p-1.5 rounded-xl shadow-sm">
            {["Python World", "Java World", "C++ World"].map((tab) => {
              const isLocked = tab === "Java World" || tab === "C++ World";
              return (
                <button
                  key={tab}
                  onClick={() => !isLocked && setActiveTab(tab)}
                  disabled={isLocked}
                  className={`px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    isLocked
                      ? "opacity-40 cursor-not-allowed text-on-surface-variant/60"
                      : activeTab === tab
                        ? "bg-primary-fixed-dim/20 text-primary border border-primary-fixed-dim/30 shadow-md"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <div className="text-center">
                    {tab.split(" ")[0]}
                    <br className="hidden md:block" />
                    {tab.split(" ")[1]}
                  </div>
                  {isLocked && (
                    <LucideIcon name="lock" className="text-[14px]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-on-surface/10 bg-surface-container/50">
            <div className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-widest text-on-surface-variant">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-fixed-dim/50 border-t-transparent" />
              Loading leaderboard
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-[24px] border border-red-400/20 bg-red-400/10 px-6 py-10 text-center">
            <p className="text-[15px] font-bold text-on-surface">{error}</p>
            <p className="mt-2 text-[13px] text-on-surface-variant">
              Please try again after the backend is available.
            </p>
          </div>
        )}

        {!loading && !error && displayUsers.length === 0 && (
          <div className="rounded-[24px] border border-on-surface/10 bg-surface-container/50 px-6 py-12 text-center">
            <LucideIcon
              name="emoji_events"
              className="mx-auto mb-4 text-[42px] text-on-surface-variant/60"
            />
            <p className="text-[18px] font-extrabold text-on-surface">
              No leaderboard data yet
            </p>
            <p className="mt-2 text-[13px] text-on-surface-variant">
              Real player rankings will appear here after the backend returns
              data.
            </p>
          </div>
        )}

        {!loading && !error && displayUsers.length > 0 && (
          <>
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 lg:gap-8 mb-16 px-2">
              {podium.map((user) => {
                const style = getPodiumStyle(user.rank);
                return (
                  <div
                    key={`${user.rank}-${user.name}`}
                    className={`w-full ${style.width} ${style.order} ${style.padding} ${style.offset} bg-surface-container/50 backdrop-blur-md rounded-3xl border ${style.border} flex flex-col items-center relative transition-transform duration-300`}
                  >
                    {style.icon && (
                      <LucideIcon
                        name={style.icon}
                        className={`${style.text}/30 absolute right-5 top-5 text-[50px]`}
                      />
                    )}
                    <div
                      className={`relative ${style.avatarSize} rounded-full border-[3px] mb-5 p-1 bg-surface-container flex items-center justify-center font-black overflow-hidden`}
                      style={{
                        borderColor: style.color,
                        color: style.color,
                      }}
                    >
                      {renderAvatar(user)}
                      <div
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 ${style.badgeSize} text-surface font-extrabold rounded-full flex items-center justify-center shadow-lg`}
                        style={{ backgroundColor: style.color }}
                      >
                        {user.rank}
                      </div>
                    </div>
                    <h3
                      className={`${style.title} font-extrabold text-on-surface mb-1 tracking-tight`}
                    >
                      {user.name}
                    </h3>
                    <p
                      className={`text-[13px] ${style.text} font-bold tracking-wide mb-6`}
                    >
                      {user.level} Coder
                    </p>
                    <div className="w-full flex flex-col items-center pt-4 border-t border-on-surface/10">
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                        {style.pointsLabel}
                      </span>
                      <span className="text-[20px] font-mono tracking-tight font-extrabold text-on-surface">
                        {user.currentXpFormatted}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-surface-container/50 border border-on-surface/10 rounded-[24px] p-6 lg:p-8 relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-[24px] font-extrabold tracking-tight text-on-surface">
                  Main Rankings
                </h2>
                <div className="relative w-full sm:w-[260px]">
                  <LucideIcon
                    name="search"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none text-[18px]"
                  />
                  <input
                    type="text"
                    placeholder="Find coder..."
                    className="w-full bg-surface border border-on-surface/10 rounded-xl pl-11 pr-4 py-2.5 text-[13px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {rankings.length === 0 && (
                  <div className="rounded-xl border border-on-surface/10 bg-surface/60 px-4 py-6 text-center text-[13px] font-semibold text-on-surface-variant">
                    No additional rankings yet.
                  </div>
                )}

                {rankings
                  .slice(0, showAll ? rankings.length : 5)
                  .map((user) => (
                    <div
                      key={`${user.rank}-${user.name}`}
                      className="flex items-center gap-4 py-4 border-b border-on-surface/5 last:border-0 hover:bg-surface-container/80 px-4 -mx-4 rounded-xl transition-colors group"
                    >
                      <div className="w-8 text-[15px] font-mono font-bold text-on-surface-variant/60 group-hover:text-primary transition-colors">
                        {user.rank < 10 ? `0${user.rank}` : user.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-surface border border-on-surface/10 flex items-center justify-center overflow-hidden shrink-0 text-[14px] font-black text-primary-fixed-dim">
                        {renderAvatar(user)}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[15px] font-bold text-on-surface truncate">
                            {user.name}
                          </span>
                          <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-primary-fixed-dim/10 text-primary-fixed-dim border border-primary-fixed-dim/20 text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap">
                            {user.badge}
                          </span>
                        </div>
                        <span className="text-[12px] text-on-surface-variant">
                          {user.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-8 ml-auto pl-4">
                        <div className="hidden md:flex flex-col items-end">
                          <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                            Available XP
                          </span>
                          <span className="text-[13px] font-mono font-semibold text-on-surface">
                            {user.currentXpFormatted}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {currentUserRank && (
                <div className="mt-8 -mx-4 px-4 py-4 rounded-xl border-2 border-primary-fixed-dim/50 bg-primary-fixed-dim/5 shadow-[0_0_20px_rgba(0,128,128,0.1)] flex items-center gap-4 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary-fixed-dim" />
                  <div className="w-8 text-[15px] font-mono font-extrabold text-primary-fixed-dim transition-colors">
                    {currentUserRank.rank < 10
                      ? `0${currentUserRank.rank}`
                      : currentUserRank.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-surface border-2 border-primary-fixed-dim/40 flex items-center justify-center overflow-hidden shrink-0 text-[14px] font-black text-primary-fixed-dim">
                    {renderAvatar(currentUserRank)}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-extrabold text-on-surface truncate">
                        {currentUserRank.name}
                      </span>
                      <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-[#D8BFD8]/10 text-secondary border border-[#D8BFD8]/30 text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap">
                        {currentUserRank.badge}
                      </span>
                    </div>
                    <span className="text-[12px] text-on-surface-variant font-medium">
                      {currentUserRank.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-8 ml-auto pl-4">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                        Available XP
                      </span>
                      <span className="text-[13px] font-mono font-bold text-on-surface">
                        {currentUserRank.currentXpFormatted}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {rankings.length > 5 && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-[13px] font-bold text-primary-fixed-dim hover:text-primary-fixed hover:underline underline-offset-4 transition-colors flex items-center gap-1"
                  >
                    {showAll ? "Show Less" : "View All Rankings"}
                    <LucideIcon
                      name="expand_more"
                      className={`text-[18px] transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default LeaderboardPage;

