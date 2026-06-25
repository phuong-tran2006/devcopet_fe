import React from "react";
import { Star, Zap, Coins } from "lucide-react";

type RewardSummaryProps = {
  xp?: number;
  stars?: number;
  coins?: number;
  bonusLabel?: string;
};

export const RewardSummary: React.FC<RewardSummaryProps> = ({
  xp,
  stars,
  coins,
  bonusLabel,
}) => {
  const hasRewards = xp || stars || coins || bonusLabel;

  if (!hasRewards) return null;

  return (
    <div className="mt-6 p-4 rounded-xl bg-surface-container-high border border-outline/20">
      <h4 className="text-sm font-bold text-on-surface mb-3 uppercase tracking-widest text-center">
        Rewards Earned
      </h4>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {xp && (
          <div className="flex items-center gap-1.5 bg-primary-fixed-dim/10 text-primary-fixed-dim px-3 py-1.5 rounded-lg border border-primary-fixed-dim/20">
            <Zap size={16} className="text-[#fbbf24]" />
            <span className="font-bold text-sm">+{xp} XP</span>
          </div>
        )}
        {stars && (
          <div className="flex items-center gap-1.5 bg-[#fcd34d]/10 text-[#f59e0b] px-3 py-1.5 rounded-lg border border-[#fcd34d]/20">
            <Star size={16} />
            <span className="font-bold text-sm">+{stars} Stars</span>
          </div>
        )}
        {coins && (
          <div className="flex items-center gap-1.5 bg-[#fde047]/10 text-[#eab308] px-3 py-1.5 rounded-lg border border-[#fde047]/20">
            <Coins size={16} />
            <span className="font-bold text-sm">+{coins} Coins</span>
          </div>
        )}
        {bonusLabel && (
          <div className="flex items-center gap-1.5 bg-secondary-fixed-dim/10 text-secondary-fixed-dim px-3 py-1.5 rounded-lg border border-secondary-fixed-dim/20">
            <span className="font-bold text-sm">{bonusLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
