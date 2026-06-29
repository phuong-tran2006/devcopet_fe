import React from "react";
import LucideIcon from "../../../components/ui/LucideIcon";

const MissionPanel = () => {
  return (
    <section className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-sm transition-colors duration-300">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Mission</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Your active objectives will appear here.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary-fixed-dim">
          <LucideIcon name="flag" className="text-[20px]" />
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-outline/30 bg-surface-container/35 px-4 py-6 text-center">
        <p className="text-sm font-semibold text-on-surface">
          No active mission
        </p>
        <p className="mt-1 text-xs text-on-surface-variant">
          Complete lessons or roadmap challenges to unlock mission data.
        </p>
      </div>
    </section>
  );
};

export default MissionPanel;
