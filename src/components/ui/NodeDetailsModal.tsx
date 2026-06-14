import { useEffect, useRef } from "react";

export interface NodeDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: {
    _id: string;
    title: string;
    description?: string;
    objectives?: string[];
    xp?: number;
    stars?: number;
    difficulty?: "easy" | "medium" | "hard";
  } | null;
}

const NodeDetailsModal = ({ isOpen, onClose, chapter }: NodeDetailsProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !chapter) return null;

  // Determine difficulty styling
  const diff = chapter.difficulty || "medium";
  const difficultyMap = {
    easy: { label: "EASY DIFFICULTY", icon: "🌱", color: "#97CADB" },
    medium: { label: "MEDIUM DIFFICULTY", icon: "⚡", color: "#b3a6d9" },
    hard: { label: "EXPERT DIFFICULTY", icon: "☠️", color: "#ef4444" },
  };
  const dCfg = difficultyMap[diff];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-[420px] bg-[#222731] dark:bg-surface-container-high rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col items-center p-8 animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Difficulty Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-on-surface/20 bg-on-surface/5 mb-6">
          <span className="text-[12px] leading-none">{dCfg.icon}</span>
          <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
            {dCfg.label}
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-[32px] font-extrabold text-white text-center leading-tight mb-3">
          {chapter.title.includes(":")
            ? chapter.title.split(":")[1].trim()
            : chapter.title}
        </h2>
        <p className="text-[14px] text-on-surface-variant text-center max-w-[300px] leading-relaxed mb-8">
          {chapter.description ||
            "Master the flow of execution and complex decision making."}
        </p>

        {/* Learning Objectives */}
        <div className="w-full bg-[#1b2028] dark:bg-surface-container border border-on-surface/10 rounded-2xl p-5 mb-6">
          <h3 className="text-[10px] font-bold tracking-widest text-[#8a8e94] uppercase mb-4">
            LEARNING OBJECTIVES
          </h3>
          <div className="flex flex-col gap-3">
            {(
              chapter.objectives || [
                "Understand while/for loops",
                "Master if/else conditions",
                "Apply logical operators",
              ]
            ).map((obj, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[16px] text-[#4ade80] mt-[2px]">
                  check_circle
                </span>
                <span className="text-[13px] text-[#d1d5db] font-medium leading-snug">
                  {obj}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="w-full grid grid-cols-2 gap-3 mb-8">
          <div className="bg-[#1b2028] dark:bg-surface-container border border-on-surface/10 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-widest text-[#8a8e94] uppercase">
              REWARD XP
            </span>
            <span className="text-[14px] font-bold text-[#c084fc]">
              {chapter.xp || 50}
            </span>
          </div>
          <div className="bg-[#1b2028] dark:bg-surface-container border border-on-surface/10 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-widest text-[#8a8e94] uppercase">
              STARS
            </span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#4ade80]">
                star
              </span>
              <span className="text-[14px] font-bold text-[#4ade80]">
                {chapter.stars !== undefined ? chapter.stars * 10 : 100}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full text-white font-extrabold text-[15px] tracking-wider py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase shadow-[0_8px_30px_rgba(234,88,12,0.4)]"
          style={{
            background: "linear-gradient(to bottom, #f97316, #ea580c)",
          }}
        >
          START LESSON
        </button>

        {/* Bottom decorative gradient line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#f59e0b] via-[#2dd4bf] to-[#0ea5e9]"></div>
      </div>
    </div>
  );
};

export default NodeDetailsModal;
