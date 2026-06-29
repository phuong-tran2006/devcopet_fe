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

  const activeItems = items.filter((item) => Number(item.amount) > 0);
  const seenTypes = new Set<string>();
  const uniqueItems: typeof activeItems = [];

  for (const item of activeItems) {
    const normalizedType = item.type.toLowerCase();
    if (!seenTypes.has(normalizedType)) {
      seenTypes.add(normalizedType);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
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

export const formatQuestionNumber = (nodeLabel: string) => {
  const numericPart = nodeLabel.match(/\d+/)?.[0] ?? nodeLabel;
  return numericPart.padStart(2, "0");
};
