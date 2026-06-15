import { useEffect } from "react";
import { Link } from "@tanstack/react-router";

const RoadmapPage = () => {
  useEffect(() => {
    document.title = "Select Your Domain | Devcopet Learn";
  }, []);

  return (
    <main className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-start bg-background overflow-hidden pb-16 px-4 md:px-8 lg:px-16">
      {/* Background Grid & Streaks */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 overflow-hidden">
          {/* Glowing points */}
          <div className="absolute w-1 h-1 bg-white rounded-full top-[15%] left-[10%] opacity-80 blur-[1px]"></div>
          <div className="absolute w-1.5 h-1.5 bg-[#008080] rounded-full top-[25%] left-[85%] opacity-90 blur-[2px]"></div>
          <div className="absolute w-1 h-1 bg-[#D8BFD8] rounded-full top-[70%] left-[15%] opacity-80 blur-[1px]"></div>
          <div className="absolute w-2 h-2 bg-white rounded-full top-[85%] left-[75%] opacity-90 blur-[2px]"></div>

          {/* Cybernetic streaks */}
          <div className="absolute w-[2px] h-[120px] bg-gradient-to-b from-transparent via-[#008080]/30 to-transparent top-[10%] left-[30%] opacity-40 rotate-[35deg]"></div>
          <div className="absolute w-[1px] h-[180px] bg-gradient-to-b from-transparent via-[#D8BFD8]/20 to-transparent top-[45%] left-[80%] opacity-30 rotate-[-25deg]"></div>
        </div>
        <div className="absolute inset-0 digital-grid opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1200px] flex flex-col items-stretch gap-8 mt-8">
        {/* Page Title Header */}
        <section className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="font-headline-lg text-[32px] md:text-[40px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-on-surface via-on-surface to-on-surface-variant tracking-tight">
            Select Your Domain
          </h1>
          <p className="text-sm md:text-base font-normal leading-relaxed text-on-surface-variant max-w-[800px]">
            Embark on a specialized mastery path. Level up your pets while
            mastering high-performance technologies in a gamified command
            center.
          </p>
        </section>

        {/* Map Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-4">
          {/* Card 1: Python */}
          <div className="bg-surface rounded-2xl border border-outline/30 p-6 flex flex-col hover:border-primary-fixed-dim/50 hover:shadow-[0_8px_30px_rgba(0,128,128,0.2)] transition-all duration-500 ease-out-cubic group relative overflow-hidden">
            {/* Header Badge */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] text-primary bg-primary-fixed-dim/10 border border-primary-fixed-dim/30 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                Lvl. 42 Master
              </span>
            </div>

            {/* Logo Wrapper */}
            <div className="h-[100px] w-full bg-primary-fixed-dim/10 border border-primary-fixed-dim/10 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:bg-primary-fixed-dim/20 transition-colors">
              <svg
                viewBox="0 0 110 110"
                className="w-[54px] h-[54px] group-hover:scale-105 transition-transform duration-500 ease-out"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#387EB8"
                  d="M53.79,3.08C25.07,3.08,21.84,15.53,21.84,15.53l0.04,12.78h32.61v4.54H16.14c0,0-15.01-1.74-15.01,23.18  c0,24.91,12.98,24.28,12.98,24.28h7.24v-11.4c0,0-0.12-14.28,14.07-14.28h22.25c0,0,13.62,0.11,13.62-13.25V17.06  C71.3,17.06,73.5,3.08,53.79,3.08z M38.45,9.66c2.61,0,4.72,2.11,4.72,4.72c0,2.61-2.11,4.72-4.72,4.72c-2.61,0-4.72-2.11-4.72-4.72  C33.73,11.78,35.84,9.66,38.45,9.66z"
                />
                <path
                  fill="#FFE052"
                  d="M54.89,106.92c28.72,0,31.95-12.45,31.95-12.45l-0.04-12.78H54.19v-4.54h38.35c0,0,15.01,1.74,15.01-23.18  c0-24.91-12.98-24.28-12.98-24.28h-7.24v11.4c0,0,0.12,14.28-14.07,14.28H50.99c0,0-13.62-0.11-13.62,13.25v24.32  C37.38,92.94,35.18,106.92,54.89,106.92z M70.23,100.34c-2.61,0-4.72-2.11-4.72-4.72c0-2.61,2.11-4.72,4.72-4.72  c2.61,0,4.72,2.11,4.72,4.72C74.95,98.22,72.84,100.34,70.23,100.34z"
                />
              </svg>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="font-headline-sm text-[22px] font-bold text-on-surface tracking-wide group-hover:text-primary transition-colors">
                Python 1: Variables
              </h2>
              <p className="font-body-sm text-[12.5px] leading-relaxed text-on-surface-variant min-h-[54px] line-clamp-3">
                The realm of Data Science, AI, and rapid prototyping. Master the
                syntax of the gods and automate your destiny.
              </p>
            </div>

            {/* Progress Slider */}
            <div className="flex flex-col gap-1.5 mb-6">
              <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider">
                <span className="text-on-surface-variant">
                  World Completion
                </span>
                <span className="text-primary">78%</span>
              </div>
              <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary-fixed-dim w-[78%] rounded-full shadow-[0_0_10px_rgba(0,128,128,0.4)]"></div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-[9px] font-bold text-on-surface-variant bg-on-surface/5 border border-on-surface/10 px-2 py-0.5 rounded uppercase tracking-wider">
                SYSTEM
              </span>
              <span className="text-[9px] font-bold text-on-surface-variant bg-on-surface/5 border border-on-surface/10 px-2 py-0.5 rounded uppercase tracking-wider">
                AI DRIVEN
              </span>
            </div>

            {/* Action Button */}
            <Link
              to="/roadmap/$worldId"
              params={{ worldId: "python-basic" }}
              className="mt-auto w-full bg-primary-fixed-dim text-on-primary-fixed font-extrabold text-[12px] py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,128,128,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Enter World{" "}
              <span className="material-symbols-outlined text-[15px]">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Card 2: Java */}
          <div className="bg-surface rounded-2xl border border-outline/30 p-6 flex flex-col hover:border-water/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.2)] transition-all duration-500 ease-out-cubic group relative overflow-hidden opacity-90 hover:opacity-100">
            {/* Header Badge */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] text-secondary bg-[#D8BFD8]/10 border border-[#D8BFD8]/30 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                Lvl. 12 Initiate
              </span>
            </div>

            {/* Logo Wrapper */}
            <div className="h-[100px] w-full bg-[#D8BFD8]/10 border border-[#D8BFD8]/10 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:bg-[#D8BFD8]/20 transition-colors">
              <svg
                viewBox="0 0 80 80"
                className="w-[52px] h-[52px] group-hover:scale-105 transition-transform duration-500 ease-out"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M33 15C33 15 36 21 32 27"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M40 10C40 10 44 18 39 26"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M47 16C47 16 49 22 46 28"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M22 36C22 36 21 52 38 54C55 56 56 36 56 36H22Z"
                  fill="#1b2532"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M56 40C62 40 64 45 61 49C58 52 56 50 56 50"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M16 60C32 66 48 66 64 60"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="font-headline-sm text-[22px] font-bold text-on-surface tracking-wide group-hover:text-secondary transition-colors">
                Java World
              </h2>
              <p className="font-body-sm text-[12.5px] leading-relaxed text-on-surface-variant min-h-[54px] line-clamp-3">
                The titan of enterprise and Android development. Build robust,
                scalable monoliths that stand the test of time.
              </p>
            </div>

            {/* Progress Slider */}
            <div className="flex flex-col gap-1.5 mb-6">
              <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider">
                <span className="text-on-surface-variant">
                  World Completion
                </span>
                <span className="text-secondary">24%</span>
              </div>
              <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-[#D8BFD8] w-[24%] rounded-full shadow-[0_0_10px_rgba(216,191,216,0.4)]"></div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-[9px] font-bold text-on-surface-variant bg-on-surface/5 border border-on-surface/10 px-2 py-0.5 rounded uppercase tracking-wider">
                ENTERPRISE
              </span>
              <span className="text-[9px] font-bold text-on-surface-variant bg-on-surface/5 border border-on-surface/10 px-2 py-0.5 rounded uppercase tracking-wider">
                ANDROID
              </span>
            </div>

            {/* Action Button */}
            <Link
              to="/roadmap/$worldId"
              params={{ worldId: "java-basic" }}
              className="mt-auto w-full bg-[#D8BFD8] text-[#3c2a3c] font-extrabold text-[12px] py-2.5 rounded-xl hover:bg-[#e6d5e6] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(216,191,216,0.3)] hover:scale-[1.02] active:scale-[0.98] text-center"
            >
              Enter World{" "}
              <span className="material-symbols-outlined text-[15px]">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Card 3: C++ */}
          <div className="bg-surface rounded-2xl border border-outline/20 p-6 flex flex-col relative overflow-hidden select-none opacity-70">
            {/* Header Badge */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] text-on-surface/40 bg-on-surface/5 border border-on-surface/10 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                Lvl. 0 Locked
              </span>
            </div>

            {/* Logo Wrapper */}
            <div className="h-[100px] w-full bg-on-surface/5 border border-on-surface/5 rounded-xl flex items-center justify-center mb-6 opacity-40">
              <svg
                viewBox="0 0 100 100"
                className="w-[54px] h-[54px]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  points="50,5 90,25 90,75 50,95 10,75 10,25"
                  fill="#00599C"
                />
                <polygon
                  points="50,5 90,25 90,75 50,95 50,5"
                  fill="#004482"
                  opacity="0.3"
                />
                <path
                  d="M60,35 A18,18 0 1,0 60,65"
                  stroke="#ffffff"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M68,46 h8 m-4,-4 v8"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M78,54 h8 m-4,-4 v8"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="font-headline-sm text-[22px] font-bold text-on-surface/40 tracking-wide">
                C++ World
              </h2>
              <p className="font-body-sm text-[12.5px] leading-relaxed text-on-surface-variant/40 min-h-[54px] line-clamp-3">
                The foundation of gaming and high-performance systems. Forge
                your skills at the hardware level for ultimate control.
              </p>
            </div>

            {/* Progress Slider */}
            <div className="flex flex-col gap-1.5 mb-6">
              <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider opacity-40">
                <span className="text-on-surface-variant">
                  World Completion
                </span>
                <span>0%</span>
              </div>
              <div className="h-1.5 bg-surface-container/40 rounded-full overflow-hidden">
                <div className="h-full bg-on-surface/10 w-[0%] rounded-full"></div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6 opacity-40">
              <span className="text-[9px] font-bold text-on-surface-variant/60 bg-on-surface/5 border border-on-surface/5 px-2 py-0.5 rounded uppercase tracking-wider">
                HARDWARE
              </span>
              <span className="text-[9px] font-bold text-on-surface-variant/60 bg-on-surface/5 border border-on-surface/5 px-2 py-0.5 rounded uppercase tracking-wider">
                GAMING
              </span>
            </div>

            {/* Action Button */}
            <button
              disabled
              className="mt-auto w-full bg-on-surface/5 text-on-surface/30 font-bold text-[12px] py-2.5 rounded-xl border border-on-surface/10 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[15px]">
                lock
              </span>
              Unlock at Lvl 15
            </button>
          </div>
        </section>

        {/* Bottom Stats Footer Bar */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
          {/* Stat 1: Global Players */}
          <div className="bg-surface-container/60 backdrop-blur-md border border-on-surface/10 rounded-2xl p-5 flex items-center gap-4 hover:border-[#008080]/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#008080]/15 flex items-center justify-center border border-[#008080]/30 shadow-[0_0_15px_rgba(0,128,128,0.15)] text-[#008080]">
              <span className="material-symbols-outlined text-[24px]">
                groups
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-on-surface-variant font-medium tracking-wide">
                Global Players
              </span>
              <span className="text-xl font-extrabold text-on-surface">
                1.2M+
              </span>
            </div>
          </div>

          {/* Stat 2: Active Projects */}
          <div className="bg-surface-container/60 backdrop-blur-md border border-on-surface/10 rounded-2xl p-5 flex items-center gap-4 hover:border-[#D8BFD8]/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#D8BFD8]/10 flex items-center justify-center border border-[#D8BFD8]/30 shadow-[0_0_15px_rgba(216,191,216,0.15)] text-secondary">
              <span className="material-symbols-outlined text-[24px]">
                database
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-on-surface-variant font-medium tracking-wide">
                Active Projects
              </span>
              <span className="text-xl font-extrabold text-on-surface">
                45.8K
              </span>
            </div>
          </div>

          {/* Stat 3: XP Generated */}
          <div className="bg-surface-container/60 backdrop-blur-md border border-on-surface/10 rounded-2xl p-5 flex items-center gap-4 hover:border-[#87A96B]/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#87A96B]/10 flex items-center justify-center border border-[#87A96B]/30 shadow-[0_0_15px_rgba(135,169,107,0.15)] text-[#87A96B]">
              <span className="material-symbols-outlined text-[24px]">
                bolt
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-on-surface-variant font-medium tracking-wide">
                XP Generated
              </span>
              <span className="text-xl font-extrabold text-on-surface">
                900B+
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RoadmapPage;
