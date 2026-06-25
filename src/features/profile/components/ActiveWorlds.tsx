import React from "react";
import LucideIcon from "../../../components/ui/LucideIcon";

const ActiveWorlds = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-bold text-on-surface transition-colors duration-300">
          Active Worlds
        </h2>
        <button className="text-primary-fixed-dim text-sm font-semibold hover:underline transition-colors duration-300">
          View all
        </button>
      </div>

      <div className="bg-surface border border-outline/20 rounded-2xl overflow-hidden cursor-pointer hover:border-primary-fixed-dim/30 transition-colors duration-300 shadow-sm">
        <div className="h-32 bg-surface-container-highest relative flex items-center justify-center transition-colors duration-300">
          <div className="absolute top-4 left-4 bg-primary-fixed-dim text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider transition-colors duration-300">
            ACTIVE
          </div>
          <LucideIcon
            name="terminal"
            className="text-6xl text-outline-variant transition-colors duration-300"
          />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-on-surface mb-1 transition-colors duration-300">
            Python World
          </h3>
          <p className="text-on-surface-variant text-sm mb-6 transition-colors duration-300">
            Chapter: Loops & Logic
          </p>

          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <div className="flex justify-between text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-wider transition-colors duration-300">
                <span>PROGRESS</span>
                <span>68%</span>
              </div>
              <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden transition-colors duration-300">
                <div className="h-full bg-primary-fixed-dim w-[68%] rounded-full transition-colors duration-300"></div>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary-fixed-dim hover:bg-primary-container hover:text-on-primary-container transition-colors duration-300">
              <LucideIcon name="play_arrow" className="text-[16px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveWorlds;
