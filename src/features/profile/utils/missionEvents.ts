export const notifyMissionActivity = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("daily-missions:refresh"));
};
