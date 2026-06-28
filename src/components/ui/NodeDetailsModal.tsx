import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "../../contexts/ThemeContext";
import type {
  EasyRoadmapNode,
  MediumRoadmapNode,
  HardRoadmapNode,
} from "../../features/courses/api/course.api";
import LucideIcon from "./LucideIcon";

type RoadmapDetailNode =
  | (EasyRoadmapNode & { difficulty?: "easy" })
  | (MediumRoadmapNode & { difficulty?: "medium" })
  | (HardRoadmapNode & { difficulty?: "hard" });

export interface NodeDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  courseSlug?: string;
  node: RoadmapDetailNode | null;
}

const DIFF_CONFIG = {
  easy: {
    accent: "#97CADB",
    gradient: "linear-gradient(90deg, #97CADB, #6aafc5)",
    glowWeak: "rgba(151,202,219,0.20)",
    buttonHover: "#b7e4ef",
    textOnAccent: "#001e2e",
  },
  medium: {
    accent: "#018ABE",
    gradient: "linear-gradient(90deg, #018ABE, #016490)",
    glowWeak: "rgba(1,138,190,0.20)",
    buttonHover: "#029cd6",
    textOnAccent: "#ffffff",
  },
  hard: {
    accent: "#3a7fc1",
    gradient: "linear-gradient(90deg, #3a7fc1, #02457A)",
    glowWeak: "rgba(2,69,122,0.25)",
    buttonHover: "#4e96db",
    textOnAccent: "#ffffff",
  },
} as const;

const LIGHT_DIFF_CONFIG = {
  ...DIFF_CONFIG,
  easy: {
    accent: "#0f766e",
    gradient: "linear-gradient(90deg, #5eead4, #2dd4bf)",
    glowWeak: "rgba(15,118,110,0.20)",
    buttonHover: "#14b8a6",
    textOnAccent: "#042f2e",
  },
  medium: {
    accent: "#6d28d9",
    gradient: "linear-gradient(90deg, #c4b5fd, #8b5cf6)",
    glowWeak: "rgba(109,40,217,0.20)",
    buttonHover: "#7c3aed",
    textOnAccent: "#2e1065",
  },
} as const;

const statusCopy = {
  completed: {
    label: "Completed",
    icon: "done",
    button: "Review",
    badge: "",
  },
  available: {
    label: "Available",
    icon: "play_arrow",
    button: "Start",
    badge: "",
  },
  locked: {
    label: "Locked",
    icon: "lock",
    button: "Locked",
    badge: "bg-on-surface/5 text-on-surface-variant/60 border-on-surface/10",
  },
} as const;

const getNodeDisplayTitle = (node: RoadmapDetailNode) => node.title.trim();
const EASY_CHECKPOINT_DURATION = "1 min";
const getTypeLabel = (type?: string) =>
  type === "drag_drop" ? "Drag Drop" : "Multiple Choice";

const NodeDetailsModal = ({
  isOpen,
  onClose,
  courseSlug,
  node,
}: NodeDetailsProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !node) return null;

  const copy = statusCopy[node.status];
  const isLocked = node.status === "locked";
  const isActionDisabled = isLocked || !courseSlug;
  const nodeTitle = getNodeDisplayTitle(node);
  const isMediumNode = node.difficulty === "medium";
  const isHardNode = node.difficulty === "hard";
  const duration =
    isMediumNode || isHardNode
      ? `${node.estimatedMinutes || 1} min`
      : EASY_CHECKPOINT_DURATION;

  const cfg = (isLight ? LIGHT_DIFF_CONFIG : DIFF_CONFIG)[
    node.difficulty || "easy"
  ];

  const openChallenge = () => {
    if (isActionDisabled) return;

    onClose();

    if (isMediumNode) {
      navigate({
        to: "/roadmap/$courseSlug/medium/nodes/$nodeId/challenge",
        params: {
          courseSlug,
          nodeId: node.id,
        },
      });
      return;
    }

    if (isHardNode) {
      navigate({
        to: "/roadmap/$courseSlug/hard/nodes/$nodeId/challenge",
        params: {
          courseSlug,
          nodeId: node.id,
        },
      });
      return;
    }

    navigate({
      to: "/roadmap/$courseSlug/easy/nodes/$nodeId/challenge",
      params: {
        courseSlug,
        nodeId: node.id,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-[420px] bg-surface-container-high border border-outline/20 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col p-7 animate-in fade-in zoom-in-95 duration-300"
        style={
          {
            "--accent-color": cfg.accent,
            "--accent-glow": cfg.glowWeak,
            "--accent-text": isLight ? "#000000" : cfg.textOnAccent,
            "--accent-hover": cfg.buttonHover,
          } as React.CSSProperties
        }
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
          aria-label="Close lesson details"
        >
          <LucideIcon name="close" className="text-[20px]" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <span
            className="px-3 py-1 rounded-full border text-[12px] font-extrabold tracking-widest"
            style={{
              borderColor: `${cfg.accent}4d`,
              backgroundColor: `${cfg.accent}1a`,
              color: cfg.accent,
            }}
          >
            {node.label}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${copy.badge}`}
            style={
              node.status !== "locked"
                ? {
                    borderColor: `${cfg.accent}4d`,
                    backgroundColor: `${cfg.accent}1a`,
                    color: cfg.accent,
                  }
                : {}
            }
          >
            <LucideIcon name={copy.icon} className="text-[14px]" />
            {copy.label}
          </span>
          {(isMediumNode || isHardNode) && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest"
              style={{
                borderColor: `${cfg.accent}4d`,
                backgroundColor: `${cfg.accent}1a`,
                color: cfg.accent,
              }}
            >
              <LucideIcon
                name={
                  node.type === "drag_drop" ||
                  node.type === "drag_drop_matching"
                    ? "drag_indicator"
                    : node.type.includes("ordering") ||
                        node.type.includes("ranking")
                      ? "sort"
                      : node.type.includes("code") ||
                          node.type.includes("bug") ||
                          node.type === "fill_missing_line"
                        ? "code"
                        : "quiz"
                }
                className="text-[14px]"
              />
              {isHardNode
                ? node.type.replace(/_/g, " ")
                : getTypeLabel(node.type)}
            </span>
          )}
        </div>

        <h2 className="text-[24px] font-extrabold text-on-surface leading-tight pr-8 mb-3">
          {nodeTitle}
        </h2>
        {"description" in node && node.description && (
          <p className="text-[14px] text-on-surface-variant leading-relaxed mb-6">
            {node.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 mb-7">
          <div className="bg-surface-container border border-outline/10 rounded-xl px-4 py-3">
            <span className="block text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-1">
              Reward XP
            </span>
            <span className="text-[16px] font-extrabold text-black dark:text-[#FFE052]">
              {node.xp || 0}
            </span>
          </div>
          <div className="bg-surface-container border border-outline/10 rounded-xl px-4 py-3">
            <span className="block text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-1">
              Duration
            </span>
            <span className="text-[16px] font-extrabold text-on-surface">
              {duration}
            </span>
          </div>
        </div>

        <button
          onClick={openChallenge}
          disabled={isActionDisabled}
          className={`w-full font-extrabold text-[14px] tracking-wider py-4 rounded-xl transition-all duration-300 uppercase ${
            isActionDisabled
              ? "bg-on-surface/8 text-on-surface-variant/45 cursor-not-allowed"
              : "bg-[var(--accent-color)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)] hover:scale-[1.01] active:scale-[0.98] shadow-[0_8px_30px_var(--accent-glow)]"
          }`}
        >
          {copy.button}
        </button>

        <div
          className="absolute bottom-0 left-0 w-full h-1"
          style={{ background: cfg.gradient }}
        />
      </div>
    </div>
  );
};

export default NodeDetailsModal;
