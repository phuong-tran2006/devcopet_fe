const mockHistory = [
  {
    id: 1,
    opponent: "AlexChen",
    avatar: "👨‍💻",
    result: "WIN",
    ratingChange: "+24",
    date: "2 hours ago",
    score: "100 - 85",
  },
  {
    id: 2,
    opponent: "SarahCodes",
    avatar: "👩‍💻",
    result: "LOSS",
    ratingChange: "-15",
    date: "5 hours ago",
    score: "90 - 100",
  },
  {
    id: 3,
    opponent: "DevNinja",
    avatar: "🥷",
    result: "WIN",
    ratingChange: "+18",
    date: "Yesterday",
    score: "100 - 60",
  },
  {
    id: 4,
    opponent: "BugSquasher",
    avatar: "🐛",
    result: "DRAW",
    ratingChange: "+0",
    date: "Yesterday",
    score: "80 - 80",
  },
  {
    id: 5,
    opponent: "CodeMaster99",
    avatar: "👑",
    result: "LOSS",
    ratingChange: "-20",
    date: "2 days ago",
    score: "70 - 100",
  },
];

const ArenaHistoryPage = () => {
  return (
    <div className="w-full h-full flex flex-col p-8 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-[#13222e] dark:to-[#081015] bg-surface-container-lowest transition-colors duration-300">
      {/* Header */}
      <div className="mb-10 animate-fade-in transition-all duration-300">
        <h1 className="text-[36px] font-extrabold tracking-[0.1em] dark:text-[#f4ecf4] text-on-surface dark:drop-shadow-[0_0_15px_rgba(244,236,244,0.3)] mb-3 transition-colors duration-300">
          BATTLE HISTORY
        </h1>
        <p className="dark:text-gray-400 text-on-surface-variant text-[15px] transition-colors duration-300">
          Review your past matches and analyze your performance.
        </p>
      </div>

      {/* History List */}
      <div className="flex flex-col gap-4 max-w-4xl w-full">
        {mockHistory.map((match, index) => {
          const isWin = match.result === "WIN";
          const isLoss = match.result === "LOSS";
          const isDraw = match.result === "DRAW";

          return (
            <div
              key={match.id}
              className={`flex items-center justify-between p-5 rounded-2xl dark:bg-[#111a22] bg-surface border border-outline/10 hover:border-outline/30 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Left: Result & Date */}
              <div className="flex flex-col gap-1 w-24">
                <span
                  className={`font-black text-[18px] tracking-wider ${
                    isWin
                      ? "dark:text-[#4dd0d0] text-primary"
                      : isLoss
                        ? "dark:text-[#ff3b30] text-error"
                        : "dark:text-gray-400 text-on-surface-variant"
                  }`}
                >
                  {match.result}
                </span>
                <span className="text-[12px] dark:text-gray-500 text-on-surface-variant font-medium">
                  {match.date}
                </span>
              </div>

              {/* Middle: Matchup */}
              <div className="flex items-center gap-6 flex-1 justify-center">
                <div className="flex flex-col items-end">
                  <span className="font-bold dark:text-[#f3d9e9] text-on-surface">
                    You
                  </span>
                </div>

                <div className="flex flex-col items-center px-4">
                  <span className="text-[20px] font-black dark:text-white text-on-surface">
                    {match.score}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest dark:text-gray-500 text-on-surface-variant mt-1">
                    Score
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full dark:bg-[#1a2632] bg-surface-container-high flex items-center justify-center text-[20px]">
                    {match.avatar}
                  </div>
                  <span className="font-bold dark:text-[#f3d9e9] text-on-surface">
                    {match.opponent}
                  </span>
                </div>
              </div>

              {/* Right: Rating Change */}
              <div className="flex items-center justify-end w-24">
                <div
                  className={`flex items-center gap-1 font-bold text-[16px] ${
                    isWin
                      ? "dark:text-[#4dd0d0] text-primary"
                      : isLoss
                        ? "dark:text-[#ff3b30] text-error"
                        : "dark:text-gray-400 text-on-surface-variant"
                  }`}
                >
                  {isWin ? (
                    <span className="material-symbols-outlined text-[18px]">
                      trending_up
                    </span>
                  ) : isLoss ? (
                    <span className="material-symbols-outlined text-[18px]">
                      trending_down
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">
                      remove
                    </span>
                  )}
                  {match.ratingChange}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArenaHistoryPage;
