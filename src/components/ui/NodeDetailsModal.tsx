import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import type {
  EasyRoadmapNode,
  MediumRoadmapNode,
} from "../../features/courses/api/course.api";

type RoadmapDetailNode =
  | (EasyRoadmapNode & { difficulty?: "easy" })
  | (MediumRoadmapNode & { difficulty?: "medium" });

export interface NodeDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  courseSlug?: string;
  node: RoadmapDetailNode | null;
}

const statusCopy = {
  completed: {
    label: "Completed",
    icon: "done",
    button: "Review",
    badge: "bg-[#97CADB]/15 text-[#97CADB] border-[#97CADB]/30",
  },
  available: {
    label: "Available",
    icon: "play_arrow",
    button: "Start",
    badge: "bg-[#97CADB]/15 text-[#97CADB] border-[#97CADB]/30",
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
  const duration = isMediumNode
    ? `${node.estimatedMinutes || 1} min`
    : EASY_CHECKPOINT_DURATION;

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
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
          aria-label="Close lesson details"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2 mb-5">
          <span className="px-3 py-1 rounded-full border border-[#97CADB]/30 bg-[#97CADB]/10 text-[#97CADB] text-[12px] font-extrabold tracking-widest">
            {node.label}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${copy.badge}`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {copy.icon}
            </span>
          {copy.label}
          </span>
          {isMediumNode && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#018ABE]/30 bg-[#018ABE]/10 text-[#97CADB] text-[10px] font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-[14px]">
                {node.type === "drag_drop" ? "drag_indicator" : "quiz"}
              </span>
              {getTypeLabel(node.type)}
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
            <span className="text-[16px] font-extrabold text-[#FFE052]">
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
              : "bg-[#97CADB] text-[#001e2e] hover:bg-[#b7e4ef] hover:scale-[1.01] active:scale-[0.98] shadow-[0_8px_30px_rgba(151,202,219,0.22)]"
          }`}
        >
          {copy.button}
        </button>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#97CADB] via-[#6aafc5] to-[#018ABE]" />
      </div>
    </div>
  );
};

export default NodeDetailsModal;
