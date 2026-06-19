export const ERROR_MESSAGES: Record<
  string,
  { icon: string; title: string; description: string }
> = {
  DAILY_LIMIT_REACHED: {
    icon: "block",
    title: "Daily Limit Reached",
    description: "You've used all your AI helps for today. Come back tomorrow!",
  },
  AI_COOLDOWN: {
    icon: "hourglass_top",
    title: "Cooldown Active",
    description: "Please wait a moment before asking again.",
  },
  AI_REQUEST_IN_PROGRESS: {
    icon: "pending",
    title: "Request In Progress",
    description: "A previous request is still being processed.",
  },
  AI_GLOBAL_LIMIT_REACHED: {
    icon: "cloud_off",
    title: "System Busy",
    description: "AI service is at capacity. Please try again later.",
  },
  SERVICE_UNAVAILABLE: {
    icon: "cloud_off",
    title: "AI is Resting",
    description:
      "The AI service is temporarily down or overloaded. Please try again later.",
  },
  UNAUTHORIZED: {
    icon: "lock",
    title: "Login Required",
    description: "Please log in to chat with the AI Helper.",
  },
  UNKNOWN: {
    icon: "error",
    title: "Something Went Wrong",
    description: "An unexpected error occurred. Please try again.",
  },
};
