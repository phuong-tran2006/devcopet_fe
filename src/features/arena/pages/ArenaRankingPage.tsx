const mockRankings = [
  { rank: 1, user: "CodeMaster99", avatar: "👑", rating: 2450, winRate: "85%" },
  { rank: 2, user: "AlexChen", avatar: "👨‍💻", rating: 2380, winRate: "82%" },
  { rank: 3, user: "DevNinja", avatar: "🥷", rating: 2310, winRate: "78%" },
  { rank: 4, user: "SarahCodes", avatar: "👩‍💻", rating: 2250, winRate: "75%" },
  { rank: 5, user: "You", avatar: "😎", rating: 2190, winRate: "72%" },
  { rank: 6, user: "BugSquasher", avatar: "🐛", rating: 2100, winRate: "68%" },
  { rank: 7, user: "TechWizard", avatar: "🧙‍♂️", rating: 2050, winRate: "65%" },
  { rank: 8, user: "CodeNewbie", avatar: "🌱", rating: 1980, winRate: "60%" },
];

const ArenaRankingPage = () => {
  return (
    <div className="w-full h-full flex flex-col p-8 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-[#13222e] dark:to-[#081015] bg-surface-container-lowest transition-colors duration-300">
      {/* Header */}
      <div className="mb-10 animate-fade-in transition-all duration-300 flex justify-between items-end">
        <div>
          <h1 className="text-[36px] font-extrabold tracking-[0.1em] dark:text-[#f4ecf4] text-on-surface dark:drop-shadow-[0_0_15px_rgba(244,236,244,0.3)] mb-3 transition-colors duration-300">
            GLOBAL RANKINGS
          </h1>
          <p className="dark:text-gray-400 text-on-surface-variant text-[15px] transition-colors duration-300">
            See where you stand among the world's best developers.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg dark:bg-[#29b6f6]/20 bg-primary/10 dark:text-[#29b6f6] text-primary font-bold text-[14px]">
            Global
          </button>
          <button className="px-4 py-2 rounded-lg dark:text-gray-400 text-on-surface-variant font-bold text-[14px] hover:bg-surface-container-high transition-colors">
            Friends
          </button>
        </div>
      </div>

      {/* Rankings List */}
      <div className="flex flex-col gap-3 max-w-4xl w-full">
        {/* Table Header */}
        <div className="flex items-center px-6 py-2 dark:text-gray-500 text-on-surface-variant text-[12px] font-bold uppercase tracking-wider">
          <div className="w-16">Rank</div>
          <div className="flex-1">Player</div>
          <div className="w-32 text-center">Win Rate</div>
          <div className="w-24 text-right">Rating</div>
        </div>

        {mockRankings.map((player, index) => {
          const isTop3 = player.rank <= 3;
          const isYou = player.user === "You";

          return (
            <div
              key={player.rank}
              className={`flex items-center px-6 py-4 rounded-xl transition-all duration-300 animate-fade-in ${
                isYou
                  ? "dark:bg-[#29b6f6]/10 bg-primary/10 border-2 dark:border-[#29b6f6]/30 border-primary/30"
                  : "dark:bg-[#111a22] bg-surface border border-outline/10"
              } hover:shadow-lg transform hover:-translate-y-1`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Rank */}
              <div className="w-16 flex items-center justify-start">
                <span
                  className={`font-black text-[20px] ${
                    player.rank === 1
                      ? "dark:text-[#ffd700] text-[#d4af37]"
                      : player.rank === 2
                        ? "dark:text-[#c0c0c0] text-[#a8a9ad]"
                        : player.rank === 3
                          ? "dark:text-[#cd7f32] text-[#b08d57]"
                          : "dark:text-gray-500 text-on-surface-variant"
                  }`}
                >
                  #{player.rank}
                </span>
              </div>

              {/* Player */}
              <div className="flex-1 flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[20px] ${
                    isTop3
                      ? "dark:bg-white/10 bg-surface-container-highest"
                      : "dark:bg-[#1a2632] bg-surface-container-high"
                  }`}
                >
                  {player.avatar}
                </div>
                <span
                  className={`font-bold text-[16px] ${isYou ? "dark:text-[#29b6f6] text-primary" : "dark:text-[#f3d9e9] text-on-surface"}`}
                >
                  {player.user}
                </span>
              </div>

              {/* Win Rate */}
              <div className="w-32 flex justify-center">
                <span className="font-semibold dark:text-gray-400 text-on-surface-variant text-[14px]">
                  {player.winRate}
                </span>
              </div>

              {/* Rating */}
              <div className="w-24 flex justify-end">
                <span className="font-black text-[18px] dark:text-[#4dd0d0] text-primary">
                  {player.rating}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArenaRankingPage;
