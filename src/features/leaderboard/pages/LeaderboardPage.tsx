import React, { useState } from "react";

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("Python World");
  const [showAll, setShowAll] = useState(false);

  // Mock data based on the design
  const podium = [
    {
      rank: 2,
      name: "PixelWizard",
      levelTitle: "Level 42 Architect",
      stars: "14.2k",
      xp: "89k",
      color: "#4FD1C5", // Teal
      avatarColor: "bg-[#234E52]",
    },
    {
      rank: 1,
      name: "KernelOverlord",
      levelTitle: "Level 50 System God",
      stars: "21.8k",
      xp: "142k",
      color: "#F687B3", // Pink
      avatarColor: "bg-[#702459]",
      isCenter: true,
    },
    {
      rank: 3,
      name: "LogicLassie",
      levelTitle: "Level 38 Engineer",
      stars: "11.5k",
      xp: "67k",
      color: "#A0AEC0", // Gray
      avatarColor: "bg-[#2D3748]",
    },
  ];

  const rankings = [
    {
      rank: "04",
      name: "BinaryBardo",
      level: "Lvl 35",
      badge: "PYTHON EXPERT",
      stars: "9,420",
      progress: 80,
    },
    {
      rank: "05",
      name: "ScriptSiren",
      level: "Lvl 34",
      badge: "CODE NINJA",
      stars: "8,815",
      progress: 75,
    },
    {
      rank: "06",
      name: "BugHunterX",
      level: "Lvl 31",
      badge: "DEBUGGER",
      stars: "7,240",
      progress: 60,
    },
    {
      rank: "07",
      name: "AsyncAbby",
      level: "Lvl 29",
      badge: "DEV OPS",
      stars: "6,920",
      progress: 55,
    },
    {
      rank: "08",
      name: "CyberSamurai",
      level: "Lvl 28",
      badge: "HACKER",
      stars: "6,100",
      progress: 50,
    },
    {
      rank: "09",
      name: "DataDruid",
      level: "Lvl 27",
      badge: "DATA MAGE",
      stars: "5,800",
      progress: 48,
    },
    {
      rank: "10",
      name: "NullPointer",
      level: "Lvl 25",
      badge: "DEBUGGER",
      stars: "5,200",
      progress: 42,
    },
    {
      rank: "11",
      name: "StackOverflowed",
      level: "Lvl 24",
      badge: "OVERFLOW",
      stars: "4,950",
      progress: 40,
    },
    {
      rank: "12",
      name: "CodeMonkey",
      level: "Lvl 22",
      badge: "JUNIOR",
      stars: "4,100",
      progress: 35,
    },
    {
      rank: "13",
      name: "ArrayMaster",
      level: "Lvl 21",
      badge: "ALGO EXPERT",
      stars: "3,800",
      progress: 32,
    },
    {
      rank: "14",
      name: "SyntaxTerror",
      level: "Lvl 20",
      badge: "CHAOS",
      stars: "3,500",
      progress: 30,
    },
    {
      rank: "15",
      name: "GitGud",
      level: "Lvl 19",
      badge: "VERSION CTL",
      stars: "3,100",
      progress: 28,
    },
    {
      rank: "16",
      name: "BooleanBandit",
      level: "Lvl 18",
      badge: "LOGIC",
      stars: "2,800",
      progress: 25,
    },
    {
      rank: "17",
      name: "LoopHole",
      level: "Lvl 17",
      badge: "ITERATOR",
      stars: "2,500",
      progress: 22,
    },
    {
      rank: "18",
      name: "VariableVanguard",
      level: "Lvl 15",
      badge: "STATE MGR",
      stars: "2,100",
      progress: 18,
    },
    {
      rank: "19",
      name: "FunctionFanatic",
      level: "Lvl 14",
      badge: "FUNCTIONAL",
      stars: "1,800",
      progress: 15,
    },
    {
      rank: "20",
      name: "ClassClown",
      level: "Lvl 13",
      badge: "OOP",
      stars: "1,500",
      progress: 12,
    },
  ];

  return (
    <main className="min-h-[calc(100vh-80px)] w-full bg-background relative overflow-x-hidden font-sans pb-24 text-on-surface">
      {/* Background styling for depth */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-primary-fixed-dim/5 rounded-full blur-[100px] top-[-200px] left-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-[1000px] mx-auto pt-10 px-4 md:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div className="max-w-[500px]">
            <h1 className="text-[36px] md:text-[42px] font-extrabold text-on-surface tracking-tight mb-2">
              Hall of Champions
            </h1>
            <p className="text-[15px] text-on-surface-variant leading-relaxed">
              Battle for supremacy in your chosen domain. Master languages and
              climb the global ranks.
            </p>
          </div>

          {/* World Tabs */}
          <div className="flex items-center gap-2 bg-surface-container/50 border border-on-surface/10 p-1.5 rounded-xl shadow-sm">
            {["Python World", "Java World", "C++ World"].map((tab) => {
              const isLocked = tab === "Java World" || tab === "C++ World";
              return (
                <button
                  key={tab}
                  onClick={() => !isLocked && setActiveTab(tab)}
                  disabled={isLocked}
                  className={`px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    isLocked
                      ? "opacity-40 cursor-not-allowed text-on-surface-variant/60"
                      : activeTab === tab
                        ? "bg-primary-fixed-dim/20 text-primary border border-primary-fixed-dim/30 shadow-md"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <div className="text-center">
                    {tab.split(" ")[0]}
                    <br className="hidden md:block" />
                    {tab.split(" ")[1]}
                  </div>
                  {isLocked && (
                    <span className="material-symbols-outlined text-[14px]">
                      lock
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Podium Section */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 lg:gap-8 mb-16 px-2">
          {/* 2nd Place */}
          <div className="w-full md:w-[280px] order-2 md:order-1 bg-surface-container/40 backdrop-blur-md rounded-3xl border border-[#4FD1C5]/20 p-6 flex flex-col items-center relative transition-transform hover:-translate-y-1 duration-300">
            <span className="absolute top-4 right-4 material-symbols-outlined text-[#4FD1C5]/20 text-[40px]">
              military_tech
            </span>
            <div className="relative w-24 h-24 rounded-full border-[3px] border-[#4FD1C5] mb-5 p-1 bg-surface-container">
              <div
                className={`w-full h-full rounded-full ${podium[0].avatarColor} flex items-center justify-center text-3xl overflow-hidden`}
              >
                🐙
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#4FD1C5] text-surface font-extrabold rounded-full flex items-center justify-center text-[13px]">
                {podium[0].rank}
              </div>
            </div>
            <h3 className="text-[18px] font-bold text-on-surface mb-1">
              {podium[0].name}
            </h3>
            <p className="text-[12px] text-on-surface-variant font-medium mb-6">
              {podium[0].levelTitle}
            </p>

            <div className="w-full flex justify-between px-2 pt-4 border-t border-on-surface/10">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Stars
                </span>
                <span className="text-[15px] font-mono tracking-tight font-semibold text-on-surface">
                  {podium[0].stars}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                  XP
                </span>
                <span className="text-[15px] font-mono tracking-tight font-semibold text-on-surface">
                  {podium[0].xp}
                </span>
              </div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="w-full md:w-[320px] order-1 md:order-2 bg-surface-container/60 backdrop-blur-md rounded-[32px] border border-[#F687B3]/30 p-8 flex flex-col items-center relative shadow-[0_0_40px_rgba(246,135,179,0.1)] transition-transform hover:-translate-y-2 duration-300 transform md:-translate-y-4">
            <span className="absolute top-5 right-5 material-symbols-outlined text-[#F687B3]/30 text-[50px]">
              emoji_events
            </span>
            <div className="relative mb-6">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[32px] drop-shadow-md z-10">
                👑
              </span>
              <div className="relative w-32 h-32 rounded-full border-[4px] border-[#F687B3] p-1.5 bg-surface-container shadow-[0_0_20px_rgba(246,135,179,0.3)]">
                <div
                  className={`w-full h-full rounded-full ${podium[1].avatarColor} flex items-center justify-center overflow-hidden`}
                >
                  <img
                    src="/src/assets/images/axolot_smile.png"
                    alt="Axolotl"
                    className="w-[120%] h-[120%] object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.innerHTML = "🐉";
                    }}
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-9 h-9 bg-[#F687B3] text-[#4A1D36] font-extrabold rounded-full flex items-center justify-center text-[18px] shadow-lg">
                  {podium[1].rank}
                </div>
              </div>
            </div>

            <h3 className="text-[24px] font-extrabold text-on-surface mb-1 tracking-tight">
              {podium[1].name}
            </h3>
            <p className="text-[13px] text-[#F687B3] font-bold tracking-wide mb-8">
              {podium[1].levelTitle}
            </p>

            <div className="w-full flex justify-between px-4 pt-5 border-t border-on-surface/10">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Total Stars
                </span>
                <span className="text-[20px] font-mono tracking-tight font-extrabold text-on-surface">
                  {podium[1].stars}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Total XP
                </span>
                <span className="text-[20px] font-mono tracking-tight font-extrabold text-on-surface">
                  {podium[1].xp}
                </span>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="w-full md:w-[280px] order-3 md:order-3 bg-surface-container/40 backdrop-blur-md rounded-3xl border border-[#A0AEC0]/20 p-6 flex flex-col items-center relative transition-transform hover:-translate-y-1 duration-300">
            <span className="absolute top-4 right-4 material-symbols-outlined text-[#A0AEC0]/20 text-[40px]">
              star
            </span>
            <div className="relative w-24 h-24 rounded-full border-[3px] border-[#A0AEC0] mb-5 p-1 bg-surface-container">
              <div
                className={`w-full h-full rounded-full ${podium[2].avatarColor} flex items-center justify-center text-3xl overflow-hidden`}
              >
                🦊
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#A0AEC0] text-surface font-extrabold rounded-full flex items-center justify-center text-[13px]">
                {podium[2].rank}
              </div>
            </div>
            <h3 className="text-[18px] font-bold text-on-surface mb-1">
              {podium[2].name}
            </h3>
            <p className="text-[12px] text-on-surface-variant font-medium mb-6">
              {podium[2].levelTitle}
            </p>

            <div className="w-full flex justify-between px-2 pt-4 border-t border-on-surface/10">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Stars
                </span>
                <span className="text-[15px] font-mono tracking-tight font-semibold text-on-surface">
                  {podium[2].stars}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                  XP
                </span>
                <span className="text-[15px] font-mono tracking-tight font-semibold text-on-surface">
                  {podium[2].xp}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Rankings Section */}
        <div className="bg-surface-container/50 border border-on-surface/10 rounded-[24px] p-6 lg:p-8 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-[24px] font-extrabold tracking-tight text-on-surface">
              Main Rankings
            </h2>
            <div className="relative w-full sm:w-[260px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none material-symbols-outlined text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Find coder..."
                className="w-full bg-surface border border-on-surface/10 rounded-xl pl-11 pr-4 py-2.5 text-[13px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Rankings List */}
          <div className="flex flex-col gap-2">
            {rankings.slice(0, showAll ? rankings.length : 5).map((user) => (
              <div
                key={user.rank}
                className="flex items-center gap-4 py-4 border-b border-on-surface/5 last:border-0 hover:bg-surface-container/80 px-4 -mx-4 rounded-xl transition-colors group"
              >
                <div className="w-8 text-[15px] font-mono font-bold text-on-surface-variant/60 group-hover:text-primary transition-colors">
                  {user.rank}
                </div>
                <div className="w-10 h-10 rounded-full bg-surface border border-on-surface/10 flex items-center justify-center text-[18px]">
                  🤖
                </div>
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-bold text-on-surface truncate">
                      {user.name}
                    </span>
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-primary-fixed-dim/10 text-primary-fixed-dim border border-primary-fixed-dim/20 text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap">
                      {user.badge}
                    </span>
                  </div>
                  <span className="text-[12px] text-on-surface-variant">
                    {user.level}
                  </span>
                </div>

                <div className="flex items-center gap-8 ml-auto pl-4">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Stars
                    </span>
                    <span className="text-[13px] font-mono font-semibold text-on-surface">
                      {user.stars}
                    </span>
                  </div>
                  <div className="w-24 lg:w-32 flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                        Progress
                      </span>
                    </div>
                    <div className="h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-fixed-dim to-[#D8BFD8] rounded-full"
                        style={{ width: `${user.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* User's current rank */}
          <div className="mt-8 -mx-4 px-4 py-4 rounded-xl border-2 border-primary-fixed-dim/50 bg-primary-fixed-dim/5 shadow-[0_0_20px_rgba(0,128,128,0.1)] flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-fixed-dim"></div>
            <div className="w-8 text-[15px] font-mono font-extrabold text-primary-fixed-dim transition-colors">
              142
            </div>
            <div className="w-10 h-10 rounded-full bg-surface border-2 border-primary-fixed-dim/40 flex items-center justify-center text-[18px]">
              🦖
            </div>
            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[15px] font-extrabold text-on-surface truncate">
                  You
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-[#D8BFD8]/10 text-secondary border border-[#D8BFD8]/30 text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap">
                  DATA NOVICE
                </span>
              </div>
              <span className="text-[12px] text-on-surface-variant font-medium">
                Lvl 12
              </span>
            </div>

            <div className="flex items-center gap-8 ml-auto pl-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Stars
                </span>
                <span className="text-[13px] font-mono font-bold text-on-surface">
                  120
                </span>
              </div>
              <div className="w-24 lg:w-32 flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Progress
                  </span>
                </div>
                <div className="h-1.5 bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-fixed-dim to-[#D8BFD8] rounded-full"
                    style={{ width: `8%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[13px] font-bold text-primary-fixed-dim hover:text-primary-fixed hover:underline underline-offset-4 transition-colors flex items-center gap-1"
            >
              {showAll ? "Show Less" : "View All Rankings"}
              <span
                className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
              >
                expand_more
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Fast Climb Mode Button */}
      <button className="fixed bottom-8 right-8 z-50 bg-[#E9D8FD] text-[#44337A] px-6 py-3.5 rounded-full font-extrabold text-[14px] flex items-center gap-2 shadow-[0_8px_24px_rgba(233,216,253,0.4)] hover:-translate-y-1 transition-transform duration-300">
        <span className="material-symbols-outlined text-[20px]">bolt</span>
        Fast Climb Mode
      </button>
    </main>
  );
};

export default LeaderboardPage;
