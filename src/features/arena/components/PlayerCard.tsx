interface PlayerCardProps {
  name?: string;
  level?: number;
  rank?: string;
  rating?: number;
  avatarUrl?: string;
  petUrl?: string;
}

const PlayerCard = ({
  name = "CodeNinja",
  level = 1,
  rank = "Beginner",
  rating,
  avatarUrl = "",
  petUrl = "/axolotl.png",
}: PlayerCardProps) => {
  return (
    <div className="relative w-full max-w-[280px] min-h-[210px] py-4 rounded-2xl dark:bg-[#1a252e] bg-surface-container-high border dark:border-white/5 border-outline/10 shadow-xl flex flex-col items-center justify-center overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-[#00ffff]/5 dark:to-transparent bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      <div className="absolute top-3 right-3 dark:bg-[#41697e] bg-primary/20 dark:text-[#b8f5f5] text-primary text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider transition-colors duration-300">
        YOU
      </div>

      <div className="relative mb-3">
        <div className="absolute inset-0 rounded-full border-2 dark:border-[#00ffff] border-primary blur-[4px] animate-pulse" />
        <div className="w-[78px] h-[78px] rounded-full border-2 dark:border-[#00ffff] border-primary overflow-hidden p-0.5 relative z-10 dark:bg-[#0e141a] bg-surface flex items-center justify-center text-xl font-bold dark:text-white text-on-surface">
          {avatarUrl ? (
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
      </div>

      <h3 className="text-[20px] font-extrabold dark:text-white text-on-surface mb-2 transition-colors duration-300 truncate max-w-[210px]">
        {name}
      </h3>
      <div className="flex items-center gap-2 flex-wrap justify-center px-4">
        <div className="dark:bg-[#41697e]/40 bg-primary/10 border dark:border-[#41697e] border-primary/30 dark:text-[#b8f5f5] text-primary text-[11px] font-black px-2.5 py-1 rounded uppercase transition-colors duration-300">
          {rank}
        </div>
        <span className="dark:text-gray-400 text-on-surface-variant text-[12px] font-semibold transition-colors duration-300">
          {rating ? `${rating} RP` : `LVL ${level}`}
        </span>
      </div>
    </div>
  );
};

export default PlayerCard;
