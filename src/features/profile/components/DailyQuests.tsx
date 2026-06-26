import { useEffect, useState } from "react";
import LucideIcon from "../../../components/ui/LucideIcon";
import { dailyQuestsApi, type DailyMission } from "../api/dailyQuests.api";

const DailyQuests = () => {
  const [mission, setMission] = useState<DailyMission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMission();
  }, []);

  const fetchMission = async () => {
    setLoading(true);
    try {
      const data = await dailyQuestsApi.getTodayMission();
      setMission(data);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!mission || mission.status === "COMPLETED") return;
    const updated = await dailyQuestsApi.markAsCompleted(mission._id);
    setMission(updated);
  };

  if (loading) {
    return (
      <div className="bg-surface border border-outline/20 rounded-2xl p-6 w-full mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-on-surface mb-6">Daily Quests</h2>
        <div className="flex justify-center p-4">
          <span className="material-symbols-outlined animate-spin text-primary">
            refresh
          </span>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="bg-surface border border-outline/20 rounded-2xl p-6 w-full mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-on-surface mb-6">Daily Quests</h2>
        <p className="text-on-surface-variant text-sm">
          No daily quests available right now.
        </p>
      </div>
    );
  }

  if (mission.status === "generating") {
    return (
      <div className="bg-surface border border-outline/20 rounded-2xl p-6 w-full mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-on-surface mb-6">Daily Quests</h2>
        <div className="flex flex-col items-center justify-center p-4 gap-2">
          <span className="material-symbols-outlined animate-spin text-primary">
            autorenew
          </span>
          <p className="text-on-surface-variant text-sm">
            Generating your personalized quest...
          </p>
        </div>
      </div>
    );
  }

  const isCompleted = mission.status === "COMPLETED";

  return (
    <div className="bg-surface border border-outline/20 rounded-2xl p-6 w-full transition-colors duration-300 shadow-sm">
      <h2 className="text-xl font-bold text-on-surface mb-6 transition-colors duration-300">
        Daily Quests
      </h2>
      <div
        className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors duration-300 ${
          isCompleted
            ? "bg-surface-container-highest border-transparent"
            : "bg-surface-container border-outline/20"
        }`}
      >
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleted}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors duration-300 ${
              isCompleted
                ? "bg-primary-fixed-dim border-primary-fixed-dim text-white"
                : "border-outline bg-transparent hover:border-primary"
            }`}
            aria-label={isCompleted ? "Quest completed" : "Complete quest"}
          >
            {isCompleted && (
              <LucideIcon name="check" className="text-[14px] font-bold" />
            )}
          </button>
          <div className="min-w-0">
            <p
              className={`text-sm font-semibold transition-colors duration-300 ${
                isCompleted
                  ? "text-on-surface-variant line-through"
                  : "text-on-surface"
              }`}
            >
              {mission.title || "Daily Mission"}
            </p>
            {mission.message && (
              <p className="mt-1 text-xs text-on-surface-variant">
                {mission.message}
              </p>
            )}
          </div>
        </div>
        <span className="shrink-0 text-primary-fixed-dim text-xs font-bold transition-colors duration-300">
          {mission.estimatedMinutes ? `~${mission.estimatedMinutes} min` : "XP"}
        </span>
      </div>
    </div>
  );
};

export default DailyQuests;
