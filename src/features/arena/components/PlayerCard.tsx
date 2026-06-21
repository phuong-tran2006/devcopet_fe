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
  avatarUrl = "https://i.pravatar.cc/150?u=a04258114e29026702d",
  petUrl = "/axolotl.png",
}: PlayerCardProps) => {
  return (
    <div className="relative w-full max-w-[280px] aspect-[4/3] rounded-2xl dark:bg-[#1a252e] bg-surface-container-high border dark:border-white/5 border-outline/10 shadow-xl flex flex-col items-center justify-center overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-[#00ffff]/5 dark:to-transparent bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      <div className="absolute top-3 right-3 dark:bg-[#41697e] bg-primary/20 dark:text-[#b8f5f5] text-primary text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider transition-colors duration-300">
        YOU
      </div>

      <div className="relative mb-3">
        <div className="absolute inset-0 rounded-full border-2 dark:border-[#00ffff] border-primary blur-[4px] animate-pulse" />
        <div className="w-[78px] h-[78px] rounded-full border-2 dark:border-[#00ffff] border-primary overflow-hidden p-0.5 relative z-10 dark:bg-[#0e141a] bg-surface">
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
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

      <div className="absolute bottom-3 left-3 w-9 h-9 dark:bg-black/20 bg-black/5 rounded-xl flex items-center justify-center transition-colors duration-300">
        <img
          src={petUrl}
          alt="Pet"
          className="w-8 h-8 object-contain dark:drop-shadow-[0_0_8px_rgba(255,105,180,0.4)] drop-shadow-md"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.innerHTML = "🦎";
          }}
        />
      </div>
    </div>
  );
};

export default PlayerCard;
