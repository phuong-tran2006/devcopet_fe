import React from "react";
import LucideIcon from "../../../components/ui/LucideIcon";

const DailyQuests = () => {
  const [mission, setMission] = useState<DailyMission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMission();
  }, []);

  const fetchMission = async () => {
    setLoading(true);
    const data = await dailyQuestsApi.getTodayMission();
    setMission(data);
    setLoading(false);
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
    <div className="bg-surface border border-outline/20 rounded-2xl p-6 w-full mb-6 transition-colors duration-300 shadow-sm">
      <h2 className="text-xl font-bold text-on-surface mb-6 transition-colors duration-300">
        Daily Quests
      </h2>
      <div className="space-y-3">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-colors duration-300 ${
              quest.completed
                ? "bg-surface-container-highest border-transparent"
                : "bg-surface-container border-outline/20"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border transition-colors duration-300 ${
                  quest.completed
                    ? "bg-primary-fixed-dim border-primary-fixed-dim text-white"
                    : "border-outline bg-transparent"
                }`}
              >
                {quest.completed && (
                  <LucideIcon name="check" className="text-[14px] font-bold" />
                )}
              </div>
              <span
                className={`text-sm transition-colors duration-300 ${isCompleted ? "text-on-surface-variant line-through" : "text-on-surface"}`}
              >
                {mission.title || "Daily Mission"}
              </span>
              {mission.message && (
                <span className="text-xs text-on-surface-variant mt-1">
                  {mission.message}
                </span>
              )}
            </div>
          </div>
          <span className="text-primary-fixed-dim text-xs font-bold transition-colors duration-300">
            {mission.estimatedMinutes
              ? `~${mission.estimatedMinutes} min`
              : "XP"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyQuests;
