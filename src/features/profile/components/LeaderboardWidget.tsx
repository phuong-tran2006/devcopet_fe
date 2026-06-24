import React from "react";
import { Trophy } from "lucide-react";

const LeaderboardWidget = () => {
  const ranks = [
    { rank: 1, name: "JavaDiva", score: "28.4k", isMe: false, avatar: "JD" },
    { rank: 2, name: "You", score: "26.1k", isMe: true, avatar: "ME" },
    { rank: 3, name: "PyByte", score: "25.8k", isMe: false, avatar: "PB" },
  ];

  return (
    <div className="bg-surface border border-outline/20 rounded-2xl p-6 w-full transition-colors duration-300 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-on-surface transition-colors duration-300">
          Leaderboard
        </h2>
        <Trophy className="text-secondary-fixed-dim" size={20} />
      </div>

      <div className="space-y-2">
        {ranks.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center p-3 rounded-xl transition-colors duration-300 ${
              entry.isMe
                ? "bg-primary-fixed/30 border border-primary-fixed-dim/30"
                : "bg-transparent hover:bg-surface-container"
            }`}
          >
            <span
              className={`w-6 text-sm font-bold text-center mr-3 transition-colors duration-300 ${entry.isMe ? "text-primary-fixed-dim" : "text-on-surface-variant"}`}
            >
              {entry.rank}
            </span>
            <div
              className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-xs font-bold mr-3 transition-colors duration-300 ${
                entry.isMe
                  ? "bg-primary-fixed-dim text-white"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {entry.avatar}
            </div>
            <span
              className={`flex-1 text-sm font-semibold transition-colors duration-300 ${entry.isMe ? "text-on-surface" : "text-on-surface-variant"}`}
            >
              {entry.name}
            </span>
            <span className="text-sm font-bold text-on-surface transition-colors duration-300">
              {entry.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardWidget;
