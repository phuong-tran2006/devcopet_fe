import LucideIcon from "../../../components/ui/LucideIcon";
interface OpponentCardProps {
  status: "idle" | "searching" | "found";
  opponent?: {
    username?: string;
    level?: number;
    avatarUrl?: string;
    arenaRank?: string;
    arenaRating?: number;
  } | null;
}

const OpponentCard = ({ status, opponent }: OpponentCardProps) => {
  return (
    <div
      className={`relative w-full max-w-[280px] aspect-[4/3] rounded-2xl dark:bg-[#1e262f] bg-surface-container-high border dark:border-white/5 border-outline/10 shadow-xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${status === "idle" ? "opacity-70" : "opacity-90"}`}
    >
      <div className="absolute top-3 left-3 dark:bg-[#3d2a32] bg-error/20 dark:text-[#d69ba2] text-error text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider transition-colors duration-300">
        RIVAL
      </div>

      {status === "idle" && (
        <>
          <div className="relative mb-4">
            <div className="w-[78px] h-[78px] rounded-full border-2 border-dashed dark:border-gray-600/30 border-outline/30 flex items-center justify-center transition-colors duration-300">
              <LucideIcon
                name="help"
                className="text-[28px] dark:text-gray-600/50 text-on-surface-variant/50"
              />
            </div>
          </div>
          <h3 className="text-[20px] font-extrabold dark:text-gray-400 text-on-surface-variant mb-1 transition-colors duration-300">
            Unknown
          </h3>
          <p className="text-[12px] dark:text-gray-500 text-on-surface-variant/70 transition-colors duration-300">
            Waiting...
          </p>
        </>
      )}

      {status === "searching" && (
        <>
          <div className="relative mb-4">
            <div className="w-[78px] h-[78px] rounded-full border-2 border-dashed dark:border-gray-500/50 border-outline/50 flex items-center justify-center animate-[spin_10s_linear_infinite] transition-colors duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <LucideIcon
                name="person_search"
                className="text-[28px] dark:text-gray-500/80 text-on-surface-variant/80 transition-colors duration-300"
              />
            </div>
          </div>
          <h3 className="text-[20px] font-extrabold dark:text-gray-300 text-on-surface mb-1 transition-colors duration-300">
            Searching
          </h3>
          <div className="flex items-center gap-1 dark:text-gray-500 text-on-surface-variant transition-colors duration-300">
            <span className="w-1.5 h-1.5 rounded-full dark:bg-gray-500/50 bg-outline/50 animate-bounce" />
            <span
              className="w-1.5 h-1.5 rounded-full dark:bg-gray-500/50 bg-outline/50 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full dark:bg-gray-500/50 bg-outline/50 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </>
      )}

      {status === "found" && (
        <>
          <div className="relative mb-3">
            <div className="absolute inset-0 rounded-full border-2 border-[#ff3b30] blur-[4px] animate-pulse" />
            <div className="w-[78px] h-[78px] rounded-full border-2 border-[#ff3b30] overflow-hidden p-0.5 relative z-10 dark:bg-[#0e141a] bg-surface transition-colors duration-300 flex items-center justify-center text-xl font-bold dark:text-white text-on-surface">
              {opponent?.avatarUrl &&
              !opponent.avatarUrl.includes("pravatar.cc") ? (
                <img
                  src={opponent.avatarUrl}
                  alt="Opponent"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerText =
                        opponent?.username?.charAt(0)?.toUpperCase() || "O";
                    }
                  }}
                />
              ) : (
                <span>
                  {opponent?.username?.charAt(0)?.toUpperCase() || "O"}
                </span>
              )}
            </div>
          </div>
          <h3 className="text-[20px] font-extrabold dark:text-white text-on-surface mb-2 transition-colors duration-300 truncate max-w-[210px]">
            {opponent?.username || "Rival"}
          </h3>
          <div className="flex items-center gap-2 flex-wrap justify-center px-4">
            <div className="dark:bg-[#7e4141]/40 bg-error/10 border dark:border-[#7e4141] border-error/30 dark:text-[#f5b8b8] text-error text-[11px] font-black px-2.5 py-1 rounded uppercase transition-colors duration-300">
              {opponent?.arenaRank || "Beginner"}
            </div>
            <span className="dark:text-gray-400 text-on-surface-variant text-[12px] font-semibold transition-colors duration-300">
              {opponent?.arenaRating ? `${opponent.arenaRating} RP` : "Ready"}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default OpponentCard;
