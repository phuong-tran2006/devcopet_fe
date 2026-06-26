import React from "react";
import LucideIcon from "../../../components/ui/LucideIcon";

const DailyQuests = () => {
  const quests = [
    { id: 1, title: "Solve 3 Python Loops", xp: 50, completed: true },
    { id: 2, title: "Feed Flagellate", xp: 20, completed: true },
    {
      id: 3,
      title: "Complete Evolution Phase 2 Stage 1",
      xp: 150,
      completed: false,
    },
    { id: 4, title: "Optimize recursion script", xp: 100, completed: false },
  ];

  return (
    <div className="bg-surface border border-outline/20 rounded-2xl p-6 w-full transition-colors duration-300 shadow-sm">
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
                className={`text-sm transition-colors duration-300 ${quest.completed ? "text-on-surface-variant line-through" : "text-on-surface"}`}
              >
                {quest.title}
              </span>
            </div>
            <span className="text-primary-fixed-dim text-xs font-bold transition-colors duration-300">
              +{quest.xp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyQuests;
