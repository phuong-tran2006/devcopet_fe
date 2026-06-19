import { useState, useEffect } from "react";
import MiniPlayerCard from "../components/battle/MiniPlayerCard";
import TimerRing from "../components/battle/TimerRing";
import QuestionBoard from "../components/battle/QuestionBoard";
import OptionButton from "../components/battle/OptionButton";
import RoundResultView from "../components/battle/RoundResultView";
import VictoryView from "../components/battle/VictoryView";

const BattlePage = () => {
  const [phase, setPhase] = useState<"playing" | "result" | "victory">(
    "playing",
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (phase === "result") {
      timeoutId = setTimeout(() => {
        setPhase("victory");
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [phase]);

  return (
    <div className="w-full min-h-full flex flex-col p-8 dark:bg-[#0a1014] bg-surface-container-lowest overflow-y-auto transition-colors duration-300">
      {phase === "playing" ? (
        <>
          {/* Top Header Row */}
          <div className="flex justify-between items-start w-full max-w-6xl mx-auto mt-4 relative">
            {/* Opponent Card (Top Left) */}
            <MiniPlayerCard
              name="Coberpinja_99"
              avatarUrl="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              hpPercentage={60}
              hpColor="#ff8a8a"
              icon="local_fire_department"
              iconColor="#ff8a8a"
            />

            {/* Center Timer (Absolute centered horizontally to not break flex space-between) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-4 z-20">
              <TimerRing timeLeft={15} />
            </div>

            {/* User Card (Top Right) */}
            <MiniPlayerCard
              name="You (DevPro)"
              avatarUrl="/axolotl.png"
              hpPercentage={85}
              hpColor="#4dd0d0"
              icon="star"
              iconColor="#4dd0d0"
              isRightAlign={true}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto mt-12 gap-8 mb-12">
            {/* Question Board */}
            <QuestionBoard />

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <OptionButton
                letter="A"
                text='"undefined"'
                colorHex="#00bfa5"
                bgColorClass="bg-[#00bfa5]"
                textClass="dark:text-[#e2e8f0] text-on-surface"
                onClick={() => setPhase("result")}
              />
              <OptionButton
                letter="B"
                text='"object"'
                colorHex="#9f7aea"
                bgColorClass="bg-[#7a5c88]"
                textClass="dark:text-[#e2e8f0] text-on-surface"
                onClick={() => setPhase("result")}
              />
              <OptionButton
                letter="C"
                text='"null"'
                colorHex="#84cc16"
                bgColorClass="bg-[#5a7638]"
                textClass="dark:text-[#e2e8f0] text-on-surface"
                onClick={() => setPhase("result")}
              />
              <OptionButton
                letter="D"
                text="Throws a TypeError"
                colorHex="#475569"
                bgColorClass="bg-[#334155]"
                textClass="dark:text-[#94a3b8] text-on-surface-variant"
                onClick={() => setPhase("result")}
              />
            </div>
          </div>
        </>
      ) : phase === "result" ? (
        <RoundResultView />
      ) : (
        <VictoryView />
      )}
    </div>
  );
};

export default BattlePage;
