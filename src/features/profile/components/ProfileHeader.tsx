import React from "react";

const ProfileHeader = () => {
  return (
    <div className="w-full mb-8">
      <h3 className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold transition-colors duration-300">
        WELCOME BACK, ARCHITECT
      </h3>
      <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-6 transition-colors duration-300">
        Ready for the next{" "}
        <span className="text-primary-fixed-dim">evolution?</span>
      </h1>
      <button className="flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-lg font-medium text-sm border border-outline/20 hover:bg-primary-container hover:text-on-primary-container transition-colors duration-300">
        <span className="material-symbols-outlined text-[18px]">
          workspace_premium
        </span>
        Global Rank: #2
      </button>
    </div>
  );
};

export default ProfileHeader;
