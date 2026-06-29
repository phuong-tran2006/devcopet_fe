import React from "react";
import LucideIcon from "../../../../components/ui/LucideIcon";

const RoundResultView = () => {
  return (
    <div className="w-full flex flex-col items-center animate-fade-in mt-8 transition-colors duration-300">
      {/* Headings */}
      <h2 className="text-[36px] font-extrabold dark:text-[#f4a8b6] text-primary mb-4 tracking-wide dark:drop-shadow-[0_0_10px_rgba(244,168,182,0.3)] transition-colors duration-300">
        Round Complete
      </h2>
      <p className="dark:text-gray-300 text-on-surface-variant text-[16px] max-w-2xl text-center mb-10 leading-relaxed transition-colors duration-300">
        What is the time complexity of a binary search tree lookup in the
        average case?
      </p>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mb-16">
        {/* Option A - Incorrect */}
        <div className="dark:bg-[#12181d] bg-surface-container-high rounded-xl h-[70px] flex items-center justify-between px-6 border dark:border-white/5 border-outline/10 opacity-70 transition-all duration-300 hover:opacity-100">
          <span className="dark:text-gray-500 text-on-surface-variant font-semibold text-[16px] transition-colors duration-300">
            O(1)
          </span>
          <LucideIcon
            name="close"
            className="dark:text-gray-600 text-on-surface-variant transition-colors duration-300"
          />
        </div>

        {/* Option B - Correct (Selected) */}
        <div className="dark:bg-[#183133] bg-tertiary-container rounded-xl h-[70px] flex items-center justify-between px-6 border-2 border-[#4fd1c5] shadow-[0_0_20px_rgba(79,209,197,0.15)] transform scale-[1.02] transition-all duration-300">
          <span className="text-[#4fd1c5] font-bold text-[18px] drop-shadow-[0_0_8px_rgba(79,209,197,0.4)]">
            O(log n)
          </span>
          <LucideIcon name="check_circle" className="text-[#4fd1c5]" />
        </div>

        {/* Option C - Incorrect */}
        <div className="dark:bg-[#12181d] bg-surface-container-high rounded-xl h-[70px] flex items-center justify-between px-6 border dark:border-white/5 border-outline/10 opacity-70 transition-all duration-300 hover:opacity-100">
          <span className="dark:text-gray-500 text-on-surface-variant font-semibold text-[16px] transition-colors duration-300">
            O(n)
          </span>
          <LucideIcon
            name="close"
            className="dark:text-gray-600 text-on-surface-variant transition-colors duration-300"
          />
        </div>

        {/* Option D - Incorrect */}
        <div className="dark:bg-[#12181d] bg-surface-container-high rounded-xl h-[70px] flex items-center justify-between px-6 border dark:border-white/5 border-outline/10 opacity-70 transition-all duration-300 hover:opacity-100">
          <span className="dark:text-gray-500 text-on-surface-variant font-semibold text-[16px] transition-colors duration-300">
            O(n log n)
          </span>
          <LucideIcon
            name="close"
            className="dark:text-gray-600 text-on-surface-variant transition-colors duration-300"
          />
        </div>
      </div>

      {/* Score Panel */}
      <div className="relative flex justify-center items-center w-full max-w-4xl mb-24 mt-4">
        {/* You Card */}
        <div className="dark:bg-[#161f28] bg-surface-container rounded-2xl p-6 w-[340px] h-[160px] flex flex-col items-center justify-center border dark:border-white/5 border-outline/10 shadow-2xl relative z-10 mr-[-30px] transition-colors duration-300">
          <div className="absolute -top-3 px-5 py-1 rounded-full border dark:border-[#4fd1c5]/40 border-primary/30 text-[#4fd1c5] text-[11px] font-bold dark:bg-[#111921] bg-surface tracking-wider transition-colors duration-300">
            You
          </div>
          <div className="text-[54px] font-black dark:text-white text-on-surface leading-none mt-2 tracking-tight transition-colors duration-300">
            2450
          </div>
          <div className="dark:text-gray-400 text-on-surface-variant text-[13px] mt-2 mb-3 tracking-widest uppercase transition-colors duration-300">
            Total Score
          </div>
          <div className="flex gap-2">
            <LucideIcon
              name="local_fire_department"
              className="text-[#84cc16] text-[18px] drop-shadow-[0_0_5px_rgba(132,204,22,0.5)]"
            />
            <LucideIcon
              name="local_fire_department"
              className="text-[#84cc16] text-[18px] drop-shadow-[0_0_5px_rgba(132,204,22,0.5)]"
            />
            <LucideIcon
              name="local_fire_department"
              className="text-[#84cc16] text-[18px] drop-shadow-[0_0_5px_rgba(132,204,22,0.5)]"
            />
          </div>
        </div>

        {/* Middle Avatar */}
        <div className="relative z-20 flex flex-col items-center">
          <div className="w-[120px] h-[120px] rounded-full dark:bg-[#1e293b] bg-surface-container-highest border-[6px] dark:border-[#2d3748] border-outline/20 shadow-2xl flex items-center justify-center p-2 mb-2 relative dark:bg-gradient-to-b dark:from-[#2a3a50] dark:to-[#1a2333] transition-colors duration-300">
            {/* Glow behind avatar */}
            <div className="absolute inset-0 rounded-full dark:shadow-[0_0_30px_rgba(244,168,182,0.2)] shadow-[0_0_30px_rgba(244,168,182,0.5)] transition-shadow duration-300"></div>
            <img
              src="/axolotl.png"
              alt="Axolotl"
              className="w-[90%] h-[90%] object-contain drop-shadow-[0_0_12px_rgba(244,168,182,0.6)] relative z-10"
            />
          </div>
          <div className="dark:bg-[#243347] bg-primary border dark:border-white/10 border-primary/20 px-5 py-2 rounded-full dark:text-white text-on-primary text-[13px] font-semibold absolute -bottom-5 whitespace-nowrap shadow-xl transition-colors duration-300">
            "Perfect logic!"
          </div>
        </div>

        {/* Opponent Card */}
        <div className="dark:bg-[#161f28] bg-surface-container rounded-2xl p-6 w-[340px] h-[160px] flex flex-col items-center justify-center border dark:border-white/5 border-outline/10 shadow-2xl relative z-10 ml-[-30px] transition-colors duration-300">
          <div className="absolute -top-3 px-5 py-1 rounded-full border dark:border-white/10 border-outline/30 dark:text-gray-400 text-on-surface-variant text-[11px] font-bold dark:bg-[#111921] bg-surface tracking-wider transition-colors duration-300">
            Opponent
          </div>
          <div className="text-[54px] font-black dark:text-gray-400 text-on-surface-variant leading-none mt-2 tracking-tight transition-colors duration-300">
            2100
          </div>
          <div className="dark:text-gray-500 text-on-surface-variant/70 text-[13px] mt-2 mb-3 tracking-widest uppercase transition-colors duration-300">
            Total Score
          </div>
          <div className="dark:bg-[#3a2024] bg-error/20 text-[#e06c75] px-3 py-1 rounded text-[11px] font-bold tracking-wider transition-colors duration-300">
            Missed
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm flex flex-col items-center opacity-70 mt-auto">
        <span className="dark:text-gray-400 text-on-surface-variant text-[13px] mb-3 transition-colors duration-300">
          Next question in 3s...
        </span>
        <div className="w-full h-1.5 dark:bg-[#1e293b] bg-outline/20 rounded-full overflow-hidden transition-colors duration-300">
          <div className="h-full dark:bg-gray-500 bg-primary rounded-full w-[60%] transition-all duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default RoundResultView;
