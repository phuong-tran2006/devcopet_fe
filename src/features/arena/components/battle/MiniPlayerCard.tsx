interface MiniPlayerCardProps {
  name: string;
  avatarUrl: string;
  hpPercentage: number;
  hpColor: string;
  icon: string;
  iconColor: string;
  isRightAlign?: boolean;
}

const MiniPlayerCard = ({
  name,
  avatarUrl,
  hpPercentage,
  hpColor,
  icon,
  iconColor,
  isRightAlign = false,
}: MiniPlayerCardProps) => {
  return (
    <div className="flex items-center dark:bg-[#111921] bg-surface-container rounded-2xl p-2.5 shadow-lg border dark:border-white/5 border-outline/10 w-[280px] transition-colors duration-300">
      {/* Left Avatar (if not right aligned) */}
      {!isRightAlign && (
        <div className="w-12 h-12 rounded-full border-2 dark:border-[#e69b9b] border-error overflow-hidden shrink-0 mr-3 p-0.5 transition-colors duration-300">
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      )}

      {/* Info Column */}
      <div
        className={`flex flex-col flex-1 ${isRightAlign ? "items-start" : "items-start"}`}
      >
        <span
          className="text-[12px] font-bold dark:text-gray-200 text-on-surface mb-1 px-1 truncate w-full transition-colors duration-300"
          style={isRightAlign ? { textAlign: "right" } : {}}
        >
          {name}
        </span>
        <div className="w-full dark:bg-[#1e262f] bg-surface-container-highest h-2.5 rounded-full overflow-hidden transition-colors duration-300">
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

      {/* Right Avatar (if right aligned) */}
      {isRightAlign && (
        <div className="w-12 h-12 rounded-full border-2 dark:border-[#81e6d9] border-primary overflow-hidden shrink-0 ml-3 p-0.5 transition-colors duration-300">
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full rounded-full object-contain dark:bg-[#0e141a] bg-surface"
          />
        </div>
      )}

      {/* Side Icon (always on the far right for both in the screenshot?) */}
      {/* Wait, screenshot shows left card has flame on the right. Right card has star on the right. */}
      <div className={`shrink-0 flex items-center justify-center w-8 h-8 ml-2`}>
        <span
          className="material-symbols-outlined transition-colors duration-300"
          style={{ color: iconColor, fontSize: "20px" }}
        >
          {icon}
        </span>
      </div>
    </div>
  );
};

export default MiniPlayerCard;
