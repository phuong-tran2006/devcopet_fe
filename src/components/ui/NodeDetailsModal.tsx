import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";

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
  const navigate = useNavigate();

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
    easy: {
      label: "EASY DIFFICULTY",
      icon: "🌱",
      colorText: "text-primary-fixed-dim",
      colorBg: "bg-primary-fixed-dim",
      colorHoverBg: "hover:bg-[#009999]",
      shadow: "shadow-[0_8px_30px_rgba(0,128,128,0.3)]",
      gradientLine: "from-primary-fixed-dim via-primary to-[#003333]",
      btnText: "text-[#002020]",
    },
    medium: {
      label: "MEDIUM DIFFICULTY",
      icon: "⚡",
      colorText: "text-[#D8BFD8]",
      colorBg: "bg-[#D8BFD8]",
      colorHoverBg: "hover:bg-[#e6cce6]",
      shadow: "shadow-[0_8px_30px_rgba(216,191,216,0.3)]",
      gradientLine: "from-[#D8BFD8] via-[#a380a3] to-[#4d334d]",
      btnText: "text-[#3c2a3c]",
    },
    hard: {
      label: "EXPERT DIFFICULTY",
      icon: "☠️",
      colorText: "text-[#22c55e]",
      colorBg: "bg-[#22c55e]",
      colorHoverBg: "hover:bg-[#16a34a]",
      shadow: "shadow-[0_8px_30px_rgba(34,197,94,0.3)]",
      gradientLine: "from-[#22c55e] via-[#15803d] to-[#14532d]",
      btnText: "text-[#052e16]",
    },
  };
  const dCfg = difficultyMap[diff];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-[420px] bg-surface-container-high border border-outline/20 rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col items-center p-8 animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Difficulty Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-outline/30 bg-surface-container mb-6">
          <span className="text-[12px] leading-none">{dCfg.icon}</span>
          <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
            {dCfg.label}
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-[32px] font-extrabold text-on-surface text-center leading-tight mb-3">
          {chapter.title.includes(":")
            ? chapter.title.split(":")[1].trim()
            : chapter.title}
        </h2>
        <p className="text-[14px] text-on-surface-variant text-center max-w-[300px] leading-relaxed mb-8">
          {chapter.description ||
            "Master the flow of execution and complex decision making."}
        </p>

        {/* Learning Objectives */}
        <div className="w-full bg-surface-container border border-outline/10 rounded-2xl p-5 mb-6">
          <h3 className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-4">
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
                <span
                  className={`material-symbols-outlined text-[16px] ${dCfg.colorText} mt-[2px]`}
                >
                  check_circle
                </span>
                <span className="text-[13px] text-on-surface font-medium leading-snug">
                  {obj}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="w-full grid grid-cols-2 gap-3 mb-8">
          <div className="bg-surface-container border border-outline/10 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
              REWARD XP
            </span>
            <span className="text-[14px] font-bold text-secondary-fixed-dim">
              {chapter.xp || 50}
            </span>
          </div>
          <div className="bg-surface-container border border-outline/10 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
              STARS
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`material-symbols-outlined text-[14px] ${dCfg.colorText}`}
              >
                star
              </span>
              <span className={`text-[14px] font-bold ${dCfg.colorText}`}>
                {chapter.stars !== undefined ? chapter.stars * 10 : 100}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            navigate({
              to: "/lesson/$lessonId/quiz",
              params: { lessonId: chapter._id },
            });
          }}
          className={`w-full ${dCfg.colorBg} ${dCfg.btnText} font-extrabold text-[15px] tracking-wider py-4 rounded-xl ${dCfg.colorHoverBg} hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase ${dCfg.shadow}`}
        >
          START LESSON
        </button>

        {/* Bottom decorative gradient line */}
        <div
          className={`absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r ${dCfg.gradientLine}`}
        ></div>
      </div>
    </div>
  );
};

export default NodeDetailsModal;
