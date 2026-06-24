interface MiniPlayerCardProps {
  name: string;
  avatarUrl: string;
  hpPercentage: number;
  hpColor: string;
  icon: string;
  iconColor: string;
  isRightAlign?: boolean;
  rank?: string;
  score?: number;
  answered?: boolean;
}

const MiniPlayerCard = ({
  name,
  avatarUrl,
  hpPercentage,
  hpColor,
  icon,
  iconColor,
  isRightAlign = false,
  rank,
  score = 0,
  answered = false,
}: MiniPlayerCardProps) => {
  return (
    <div className="flex items-center dark:bg-[#111921] bg-surface-container rounded-xl p-2 shadow-lg border dark:border-white/5 border-outline/10 w-[230px] transition-colors duration-300">
      {!isRightAlign && (
        <div className="w-10 h-10 rounded-full border-2 dark:border-[#e69b9b] border-error overflow-hidden shrink-0 mr-2.5 p-0.5 transition-colors duration-300 flex items-center justify-center text-[13px] font-bold dark:text-white text-on-surface">
          {avatarUrl && !avatarUrl.includes("pravatar.cc") ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerText = name.charAt(0).toUpperCase();
                }
              }}
            />
          ) : (
            <span>{name.charAt(0).toUpperCase()}</span>
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span
            className="text-[12px] font-black dark:text-gray-200 text-on-surface truncate transition-colors duration-300"
            style={isRightAlign ? { textAlign: "right" } : {}}
          >
            {name}
          </span>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${answered ? "dark:bg-[#1e4e50] bg-primary/10 text-primary" : "dark:bg-white/5 bg-outline/10 dark:text-gray-500 text-on-surface-variant"}`}
          >
            {answered ? "LOCKED" : "..."}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] uppercase font-bold dark:text-gray-500 text-on-surface-variant truncate">
            {rank || "Rank"}
          </span>
          <span className="text-[11px] font-black dark:text-[#4dd0d0] text-primary">
            {score}
          </span>
        </div>
        <div className="w-full dark:bg-[#1e262f] bg-surface-container-highest h-2 rounded-full overflow-hidden transition-colors duration-300">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${hpPercentage}%`,
              backgroundColor: hpColor,
              boxShadow: `0 0 8px ${hpColor}`,
            }}
          />
        </div>
      </div>

      {isRightAlign && (
        <div className="w-10 h-10 rounded-full border-2 dark:border-[#81e6d9] border-primary overflow-hidden shrink-0 ml-2.5 p-0.5 transition-colors duration-300 flex items-center justify-center text-[13px] font-bold dark:text-white text-on-surface">
          {avatarUrl && !avatarUrl.includes("pravatar.cc") ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full rounded-full object-contain dark:bg-[#0e141a] bg-surface"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerText = name.charAt(0).toUpperCase();
                }
              }}
            />
          ) : (
            <span>{name.charAt(0).toUpperCase()}</span>
          )}
        </div>
      )}

      <div className="shrink-0 flex items-center justify-center w-7 h-7 ml-2">
        <span
          className="material-symbols-outlined transition-colors duration-300"
          style={{ color: iconColor, fontSize: "18px" }}
        >
          {icon}
        </span>
      </div>
    </div>
  );
};

export default MiniPlayerCard;
