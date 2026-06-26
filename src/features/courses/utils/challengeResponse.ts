import type { ChallengeNavigation, RewardSummary } from "../api/course.api";

export const getRewardItems = (
  rewardSummary?: RewardSummary,
  fallbackXp = 0,
) => {
  if (!rewardSummary) {
    return fallbackXp > 0
      ? [{ label: "XP", amount: fallbackXp, type: "xp" }]
      : [];
  }

  const items = [
    { label: "XP", amount: rewardSummary.xp || 0, type: "xp" },
    { label: "Stars", amount: rewardSummary.stars || 0, type: "stars" },
    { label: "Coins", amount: rewardSummary.coins || 0, type: "coins" },
    { label: "Pet EXP", amount: rewardSummary.petExp || 0, type: "petExp" },
    ...(rewardSummary.items || []),
  ];

  return items.filter((item) => Number(item.amount) > 0);
};

export const getNavigationForResponse = (
  submitNavigation?: ChallengeNavigation,
  challengeNavigation?: ChallengeNavigation,
) => submitNavigation || challengeNavigation;

export const getSpeakerName = (
  responseSpeakerName?: string,
  challengeSpeakerName?: string,
  fallbackName = "Axo-Script",
) => responseSpeakerName || challengeSpeakerName || fallbackName;
