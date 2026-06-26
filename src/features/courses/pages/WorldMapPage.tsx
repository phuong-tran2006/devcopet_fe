// @ts-nocheck
import LucideIcon from "../../../components/ui/LucideIcon";
import { useEffect, useState, useRef, useMemo, lazy, Suspense } from "react";
import { useParams } from "@tanstack/react-router";
import {
  courseApi,
  type EasyRoadmapChapter,
  type EasyRoadmapNode,
  type EasyRoadmapResponse,
  type MediumRoadmapChapter,
  type MediumRoadmapNode,
  type MediumRoadmapResponse,
  type HardRoadmapChapter,
  type HardRoadmapNode,
  type HardRoadmapResponse,
} from "../api/course.api";
import NodeDetailsModal from "../../../components/ui/NodeDetailsModal";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuthStore } from "../../users/store/auth.store";

const DIFF_CONFIG = {
  easy: {
    label: "Easy",
    accent: "#97CADB",
    glow: "rgba(151,202,219,0.65)",
    glowWeak: "rgba(151,202,219,0.20)",
    pathColor: "#97CADB",
    gradient: "linear-gradient(90deg, #97CADB, #6aafc5)",
  },
  medium: {
    label: "Medium",
    accent: "#018ABE",
    glow: "rgba(1,138,190,0.65)",
    glowWeak: "rgba(1,138,190,0.20)",
    pathColor: "#018ABE",
    gradient: "linear-gradient(90deg, #018ABE, #016490)",
  },
  hard: {
    label: "Hard",
    accent: "#3a7fc1",
    glow: "rgba(2,69,122,0.80)",
    glowWeak: "rgba(2,69,122,0.25)",
    pathColor: "#3a7fc1",
    gradient: "linear-gradient(90deg, #3a7fc1, #02457A, #012d52)",
  },
} as const;

type Difficulty = keyof typeof DIFF_CONFIG;
type ChapterStatus = "completed" | "active" | "locked";

const getDiffConfig = (diff: Difficulty, isLight: boolean) => {
  if (isLight) {
    if (diff === "easy") {
      return {
        label: "Easy",
        accent: "#0284c7",
        glow: "rgba(2,132,199,0.65)",
        glowWeak: "rgba(2,132,199,0.20)",
        pathColor: "#0284c7",
        gradient: "linear-gradient(90deg, #0284c7, #0369a1)",
      };
    }
    if (diff === "medium") {
      return {
        label: "Medium",
        accent: "#0369a1",
        glow: "rgba(3,105,161,0.65)",
        glowWeak: "rgba(3,105,161,0.20)",
        pathColor: "#0369a1",
        gradient: "linear-gradient(90deg, #0369a1, #075985)",
      };
    }
    if (diff === "hard") {
      return {
        label: "Hard",
        accent: "#1e3a8a",
        glow: "rgba(30,58,138,0.80)",
        glowWeak: "rgba(30,58,138,0.25)",
        pathColor: "#1e3a8a",
        gradient: "linear-gradient(90deg, #1e3a8a, #1d4ed8)",
      };
    }
  }
  return DIFF_CONFIG[diff];
};

type SelectedRoadmapNode =
  | (EasyRoadmapNode & { difficulty?: "easy" })
  | (MediumRoadmapNode & { difficulty?: "medium" })
  | (HardRoadmapNode & { difficulty?: "hard" });

const statusStyles = {
  completed: {
    node: "",
    icon: "done",
    label: "Completed",
  },
  available: {
    node: "",
    icon: "play_arrow",
    label: "Available",
  },
  locked: {
    node: "bg-surface-container text-on-surface/30 border-on-surface/10",
    icon: "lock",
    label: "Locked",
  },
} as const;

const getChapterStatus = (
  chapter: EasyRoadmapChapter | MediumRoadmapChapter | HardRoadmapChapter,
): ChapterStatus => {
  if (chapter.nodes.length === 0) return "locked";
  if (chapter.nodes.every((node) => node.status === "completed")) {
    return "completed";
  }
  if (chapter.nodes.some((node) => node.status === "available")) {
    return "active";
  }
  return "locked";
};

const getNodeDynamicStyle = (
  nodeStatus: EasyRoadmapNodeStatus,
  difficulty: Difficulty,
  cfg: (typeof DIFF_CONFIG)[Difficulty],
  isLight: boolean,
): React.CSSProperties => {
  if (nodeStatus === "locked") return {};

  const style: React.CSSProperties = {
    boxShadow: `0 0 24px ${cfg.glowWeak}`,
    "--node-accent": cfg.accent,
    "--node-glow": cfg.glow,
    "--node-glow-weak": cfg.glowWeak,
  } as any;

  if (nodeStatus === "completed") {
    style.backgroundColor = cfg.accent;
    style.borderColor = isLight
      ? "#475569"
      : difficulty === "easy"
        ? "#c7f0f7"
        : `${cfg.accent}80`;
    style.color = isLight
      ? "#000000"
      : difficulty === "easy"
        ? "#001e2e"
        : "#ffffff";
  } else if (nodeStatus === "available") {
    style.background = cfg.gradient;
    style.borderColor = "var(--color-background)";
    style.color = isLight
      ? "#000000"
      : difficulty === "easy"
        ? "#001e2e"
        : "#ffffff";
  }

  return style;
};

const normalizeOrder = <T extends { order: number }>(chapters: T[]) =>
  [...chapters].sort((a, b) => a.order - b.order);

const getLessonDisplayTitle = (node: EasyRoadmapNode) => node.title.trim();
const EASY_CHECKPOINT_DURATION = "1 min";
const getMediumTypeLabel = (type: MediumRoadmapNode["type"]) =>
  type === "drag_drop" ? "Drag Drop" : "Multiple Choice";

const WorldMapPage = () => {
  const { theme } = useTheme();
  const currentUser = useAuthStore((state) => state.user);
  const isLight = theme === "light";
  const { worldId } = useParams({ strict: false });
  const courseSlug = worldId;
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [isMediumUnlocked, setIsMediumUnlocked] = useState(false);
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [roadmap, setRoadmap] = useState<EasyRoadmapResponse | null>(null);
  const [mediumRoadmap, setMediumRoadmap] =
    useState<MediumRoadmapResponse | null>(null);
  const [hardRoadmap, setHardRoadmap] = useState<HardRoadmapResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<SelectedRoadmapNode | null>(
    null,
  );
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null,
  );
  const userLevel = currentUser?.level ?? 1;
  const userTitle = userLevel >= 15 ? "Data Adept" : "Data Novice";

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLElement>(null);
  const activeNodeRef = useRef<HTMLDivElement>(null);

  const cfg = getDiffConfig(difficulty, isLight);

  const chapters = useMemo(
    () => normalizeOrder(roadmap?.chapters ?? []),
    [roadmap],
  );
  const mediumChapters = useMemo(
    () => normalizeOrder(mediumRoadmap?.chapters ?? []),
    [mediumRoadmap],
  );
  const hardChapters = useMemo(
    () => normalizeOrder(hardRoadmap?.chapters ?? []),
    [hardRoadmap],
  );

  const sidebarChapters = useMemo(() => {
    return difficulty === "hard"
      ? hardChapters
      : difficulty === "medium"
        ? mediumChapters
        : chapters;
  }, [difficulty, hardChapters, mediumChapters, chapters]);

  const flatNodes = useMemo(() => {
    const sorted = chapters.flatMap((chapter) =>
      [...chapter.nodes]
        .sort((a, b) => a.lessonOrder - b.lessonOrder)
        .map((node) => ({
          ...node,
          chapterTitle: chapter.title,
          chapterOrder: chapter.order,
        })),
    );
    return sorted.map((node, idx) => ({
      ...node,
      label: (idx + 1).toString(),
    }));
  }, [chapters]);

  const mediumFlatNodes = useMemo(() => {
    const sorted = mediumChapters.flatMap((chapter) =>
      [...chapter.nodes]
        .sort((a, b) => a.order - b.order)
        .map((node) => ({
          ...node,
          chapterTitle: chapter.title,
          chapterOrder: chapter.order,
        })),
    );
    return sorted.map((node, idx) => ({
      ...node,
      label: (idx + 1).toString(),
    }));
  }, [mediumChapters]);

  const hardFlatNodes = useMemo(() => {
    const sorted = hardChapters.flatMap((chapter) =>
      [...chapter.nodes]
        .sort((a, b) => a.order - b.order)
        .map((node) => ({
          ...node,
          chapterTitle: chapter.title,
          chapterOrder: chapter.order,
        })),
    );
    return sorted.map((node, idx) => ({
      ...node,
      label: (idx + 1).toString(),
    }));
  }, [hardChapters]);

  const activeFlatNodes =
    difficulty === "hard"
      ? hardFlatNodes
      : difficulty === "medium"
        ? mediumFlatNodes
        : flatNodes;
  const firstAvailableNodeId = useMemo(
    () =>
      activeFlatNodes.find((node) => node.status === "available")?.id ?? null,
    [activeFlatNodes],
  );
  const completedCount = activeFlatNodes.filter(
    (node) => node.status === "completed",
  ).length;
  const currentCourse =
    difficulty === "hard"
      ? hardRoadmap?.course
      : difficulty === "medium"
        ? mediumRoadmap?.course
        : roadmap?.course;
  const totalNodes = currentCourse?.totalNodes ?? activeFlatNodes.length;
  const totalLessons = roadmap?.course.totalLessons ?? flatNodes.length;
  const completionPct =
    totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;
  const totalXp = activeFlatNodes.reduce(
    (sum, node) => sum + (node.xp || 0),
    0,
  );

  useEffect(() => {
    document.title = "Roadmap Path | Devcopet Learn";
  }, []);

  useEffect(() => {
    if (!courseSlug) {
      setLoading(false);
      setError("Course slug is missing.");
      return;
    }

    let alive = true;
    setLoading(true);
    setError(null);
    setSelectedChapterId(null);
    setSelectedNode(null);

    const loadAllRoadmaps = async () => {
      try {
        const easyData = await courseApi.getEasyRoadmap(courseSlug);
        if (!alive) return;
        setRoadmap(easyData);

        let mediumUnlocked = false;
        let hardUnlocked = false;
        let activeChapters = easyData.chapters;

        try {
          const mediumData = await courseApi.getMediumRoadmap(courseSlug);
          if (!alive) return;
          mediumUnlocked = true;
          setMediumRoadmap(mediumData);

          if (difficulty === "medium") {
            activeChapters = mediumData.chapters;
          }
        } catch (err) {
          if (!alive) return;
          setMediumRoadmap(null);
          console.warn("Medium roadmap is not available:", err);
        }

        if (mediumUnlocked) {
          try {
            const hardData = await courseApi.getHardRoadmap(courseSlug);
            if (!alive) return;
            hardUnlocked = true;
            setHardRoadmap(hardData);

            if (difficulty === "hard") {
              activeChapters = hardData.chapters;
            }
          } catch (err) {
            if (!alive) return;
            setHardRoadmap(null);
            console.warn("Hard roadmap is not available:", err);
          }
        } else {
          setHardRoadmap(null);
        }

        setIsMediumUnlocked(mediumUnlocked);
        setIsHardUnlocked(hardUnlocked);

        if (difficulty === "medium" && !mediumUnlocked) {
          setDifficulty("easy");
          activeChapters = easyData.chapters;
        } else if (difficulty === "hard" && !hardUnlocked) {
          setDifficulty("easy");
          activeChapters = easyData.chapters;
        }

        setSelectedChapterId(activeChapters[0]?.id ?? null);
        document.title = `${easyData.course.title} Roadmap | Devcopet Learn`;
      } catch (err: any) {
        if (!alive) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load roadmap path.",
        );
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadAllRoadmaps();

    return () => {
      alive = false;
    };
  }, [courseSlug, difficulty]);

  useEffect(() => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [difficulty]);

  const handleMainScroll = (e) => {
    setShowScrollTop(e.currentTarget.scrollTop > 300);
  };

  const getNodeCoords = (index: number) => {
    const y = index * 150 + 120;
    const xOptions = [150, 340, 520, 340];
    const x = xOptions[index % xOptions.length];
    return { x, y };
  };

  const buildPath = (wantUnlocked: boolean) => {
    if (activeFlatNodes.length < 2) return "";

    return activeFlatNodes
      .slice(1)
      .map((node, idx) => {
        const prev = activeFlatNodes[idx];
        const currentIndex = idx + 1;
        const unlocked = prev.status !== "locked" && node.status !== "locked";

        if (unlocked !== wantUnlocked) return "";

        const p1 = getNodeCoords(currentIndex - 1);
        const p2 = getNodeCoords(currentIndex);
        return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + 70}, ${p2.x} ${p2.y - 70}, ${p2.x} ${p2.y}`;
      })
      .filter(Boolean)
      .join(" ");
  };

  const completedD = buildPath(true);
  const lockedD = buildPath(false);
  const mapHeight = Math.max(activeFlatNodes.length * 150 + 180, 520);

  const scrollToTop = () =>
    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  const scrollToActiveNode = () => {
    activeNodeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  const scrollToChapter = (
    chapter: EasyRoadmapChapter | MediumRoadmapChapter | HardRoadmapChapter,
  ) => {
    setSelectedChapterId(chapter.id);
    const firstNode = chapter.nodes[0];
    if (!firstNode) return;

    mapContainerRef.current
      ?.querySelector(`[data-node-id="${firstNode.id}"]`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
  };

  return (
    <div className="relative flex h-[calc(100vh-80px)] w-full overflow-hidden bg-background">
      <aside
        className={`h-full shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
          drawerOpen ? "w-[320px]" : "w-0"
        }`}
      >
        <div
          className={`flex h-full w-[320px] flex-col border-r border-on-surface/8 bg-surface shadow-[8px_0_40px_rgba(0,0,0,0.6)] transition-opacity duration-200 ${
            drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="shrink-0 border-b border-on-surface/6 px-5 pb-4 pt-5">
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl border text-2xl"
                style={{
                  background: cfg.glowWeak,
                  borderColor: `${cfg.accent}40`,
                  boxShadow: `0 0 15px ${cfg.glowWeak}`,
                }}
              >
                <LucideIcon name="psychology" className="text-[25px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-on-surface">
                  Level {userLevel}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
                  {userTitle}
                </span>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-on-surface/10 bg-surface-container/80 px-3 py-2.5">
                <LucideIcon
                  name="monetization_on"
                  className="text-[16px]"
                  style={{ color: cfg.accent }}
                />
                <div className="flex flex-col">
                  <span className="text-[9px] font-medium uppercase tracking-wide text-on-surface-variant/70">
                    Roadmap XP
                  </span>
                  <span className="text-[13px] font-bold text-on-surface">
                    {totalXp || "--"} XP
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-on-surface/10 bg-surface-container/80 px-3 py-2.5">
                <LucideIcon
                  name="route"
                  className="text-[16px] text-[#FFE052]"
                />
                <div className="flex flex-col">
                  <span className="text-[9px] font-medium uppercase tracking-wide text-on-surface-variant/70">
                    Nodes
                  </span>
                  <span className="text-[13px] font-bold text-on-surface">
                    {totalNodes || "--"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-on-surface-variant">
                <span>{difficulty.toUpperCase()} PROGRESS</span>
                <span>{completionPct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${completionPct}%`,
                    background: cfg.gradient,
                    boxShadow: `0 0 10px ${cfg.glowWeak}`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 border-b border-on-surface/5 px-5 pb-3 pt-4">
            <LucideIcon
              name="format_list_bulleted"
              className="text-[16px]"
              style={{ color: cfg.accent }}
            />
            <span className="flex-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Chapters
            </span>
            <span
              className="text-[10px] font-bold"
              style={{ color: cfg.accent }}
            >
              {sidebarChapters.length || 0}
            </span>
          </div>

          <div
            className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#2a3641 transparent",
            }}
          >
            {sidebarChapters.map((chapter, idx) => {
              const chapterStatus = getChapterStatus(chapter);
              const isCompleted = chapterStatus === "completed";
              const isInProgress = chapterStatus === "active";
              const isLocked = chapterStatus === "locked";

              return (
                <button
                  key={chapter.id}
                  onClick={() => !isLocked && scrollToChapter(chapter)}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 ${
                    isCompleted
                      ? "border-on-surface/10 hover:border-on-surface/20 bg-on-surface/4 hover:bg-on-surface/8 cursor-pointer"
                      : ""
                  } ${isInProgress ? "ring-1 cursor-pointer" : ""} ${
                    isLocked
                      ? "bg-transparent border-on-surface/5 opacity-35 cursor-not-allowed"
                      : ""
                  }`}
                  style={
                    isInProgress
                      ? {
                          background: `${cfg.glowWeak}`,
                          borderColor: `${cfg.accent}50`,
                          boxShadow: `0 0 12px ${cfg.glowWeak}`,
                          ["--tw-ring-color" as string]: cfg.accent,
                        }
                      : {}
                  }
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold ${
                      isLocked
                        ? "bg-surface-container text-on-surface/20 border border-on-surface/10"
                        : ""
                    }`}
                    style={
                      isCompleted
                        ? {
                            backgroundColor: cfg.accent,
                            borderColor:
                              difficulty === "easy"
                                ? "#c7f0f7"
                                : `${cfg.accent}80`,
                            color: isLight
                              ? "#000000"
                              : difficulty === "easy"
                                ? "#001e2e"
                                : "#ffffff",
                            borderWidth: "1px",
                            borderStyle: "solid",
                          }
                        : isInProgress
                          ? {
                              background: cfg.gradient,
                              color: isLight ? "#000000" : "#fff",
                              boxShadow: `0 0 10px ${cfg.glowWeak}`,
                            }
                          : {}
                    }
                  >
                    {isCompleted && (
                      <LucideIcon name="done" className="text-[14px]" />
                    )}
                    {isInProgress && (
                      <span className="text-[11px] font-extrabold">
                        {idx + 1}
                      </span>
                    )}
                    {isLocked && (
                      <LucideIcon name="lock" className="text-[13px]" />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={`truncate text-[12px] font-semibold leading-snug ${
                        isLocked
                          ? "text-on-surface-variant/40"
                          : "text-on-surface-variant"
                      }`}
                      style={
                        isInProgress
                          ? { color: isLight ? "#000000" : "#fff" }
                          : {}
                      }
                    >
                      {chapter.title}
                    </span>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-[9px] text-on-surface-variant/50">
                        {difficulty === "easy"
                          ? `${(chapter as EasyRoadmapChapter).lessonCount || 0} lessons • ${chapter.nodeCount || 0} nodes`
                          : `${chapter.nodeCount || 0} nodes`}
                      </span>
                      {isInProgress && (
                        <span
                          className="text-[9px] font-bold uppercase tracking-wide"
                          style={{ color: cfg.accent }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {!isLocked && (
                    <LucideIcon
                      name="chevron_right"
                      className="text-[15px] text-on-surface/20 flex-shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-on-surface/5 px-4 py-4">
            <div
              className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5"
              style={{
                background: "rgba(255,224,82,0.06)",
                borderColor: "rgba(255,224,82,0.2)",
              }}
            >
              <LucideIcon
                name="emoji_events"
                className="text-[18px] text-[#FFE052]"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  Stars Collected
                </span>
                <span className="text-[13px] font-extrabold text-on-surface">
                  12 / 150
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <button
        onClick={() => setDrawerOpen(!drawerOpen)}
        className={`fixed top-[96px] z-50 hidden h-10 w-10 items-center justify-center rounded-full border border-outline/30 bg-surface-container text-on-surface-variant shadow-lg transition-all duration-300 hover:border-primary-fixed-dim hover:bg-[#17212d] hover:text-primary-fixed-dim lg:flex ${
          drawerOpen ? "left-[335px]" : "left-4"
        }`}
        aria-label={drawerOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <LucideIcon
          name={drawerOpen ? "chevron_left" : "menu"}
          className="text-[22px]"
        />
      </button>

      <main
        ref={mainScrollRef}
        onScroll={handleMainScroll}
        className="custom-scrollbar relative w-full flex-1 overflow-y-auto"
      >
        <section className="z-10 flex min-h-full flex-col items-center justify-start px-4 pb-4 pt-6">
          <div className="flex w-full max-w-[720px] flex-col">
            <div className="mb-8 flex flex-col justify-between gap-5 border-b border-on-surface/8 pb-7 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl border"
                  style={{
                    background: cfg.glowWeak,
                    borderColor: `${cfg.accent}50`,
                    boxShadow: `0 0 20px ${cfg.glowWeak}`,
                  }}
                >
                  <LucideIcon
                    name="terminal"
                    className=" text-[26px]"
                    style={{ color: cfg.accent }}
                  />
                </div>
                <div>
                  <h1 className="text-[32px] font-extrabold uppercase leading-none tracking-wide text-on-surface md:text-[38px]">
                    {currentCourse?.title || "Course Roadmap"}
                  </h1>
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: cfg.accent }}
                  >
                    {difficulty === "easy"
                      ? `${roadmap?.course.totalChapters ?? 0} chapters • ${totalLessons} lessons • ${totalNodes} nodes`
                      : difficulty === "medium"
                        ? `${mediumRoadmap?.course.totalChapters ?? 0} chapters • ${totalNodes} nodes`
                        : `${hardRoadmap?.course.totalChapters ?? 0} chapters • ${totalNodes} nodes`}
                  </span>
                </div>
              </div>

              <div className="flex gap-0.5 rounded-xl border border-on-surface/10 bg-surface-container/90 p-1 text-[12px] font-bold uppercase tracking-wider">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
                  const isLocked =
                    d === "medium"
                      ? !isMediumUnlocked
                      : d === "hard"
                        ? !isHardUnlocked
                        : false;
                  const dCfg = getDiffConfig(d, isLight);

                  return (
                    <button
                      key={d}
                      disabled={isLocked}
                      onClick={() => !isLocked && setDifficulty(d)}
                      className={`rounded-lg px-5 py-2 transition-all duration-200 flex items-center gap-1.5 ${
                        difficulty === d
                          ? "text-[#0d1117] shadow-md font-extrabold"
                          : isLocked
                            ? "text-on-surface-variant/30 cursor-not-allowed opacity-50"
                            : "text-on-surface-variant hover:bg-on-surface/8 hover:text-on-surface"
                      }`}
                      style={
                        difficulty === d
                          ? {
                              background: dCfg.gradient,
                              boxShadow: `0 2px 12px ${dCfg.glowWeak}`,
                            }
                          : {}
                      }
                    >
                      {isLocked && (
                        <LucideIcon name="lock" className=" text-[14px]" />
                      )}
                      {dCfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-8 flex flex-col gap-2 rounded-2xl border border-on-surface/10 bg-surface-container/60 px-5 py-4">
              <div className="flex items-center justify-between text-[13px] font-bold tracking-wider text-on-surface-variant">
                <span>{DIFF_CONFIG[difficulty].label} Completion</span>
                <span className="text-[15px]" style={{ color: cfg.accent }}>
                  {completionPct}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${completionPct}%`,
                    background: cfg.gradient,
                    boxShadow: `0 0 14px ${cfg.glow}`,
                  }}
                />
              </div>
              <div className="mt-0.5 flex justify-between text-[11px] font-medium text-on-surface-variant/60">
                <span>
                  {completedCount} {difficulty === "easy" ? "lesson " : ""}
                  nodes done
                </span>
                <span>{totalNodes} total nodes</span>
              </div>
            </div>

            {loading && (
              <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-on-surface/8 bg-surface-container/40">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="h-11 w-11 animate-spin rounded-full border-4 border-t-transparent"
                    style={{
                      borderColor: `${cfg.accent}55`,
                      borderTopColor: "transparent",
                    }}
                  />
                  <p className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Loading {DIFF_CONFIG[difficulty].label} roadmap
                  </p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-6 py-8 text-center">
                <LucideIcon
                  name="error"
                  className=" mb-3 text-[34px] text-red-200"
                />
                <h2 className="text-[18px] font-extrabold text-on-surface">
                  {DIFF_CONFIG[difficulty].label} roadmap could not load
                </h2>
                <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-relaxed text-on-surface-variant">
                  {error}
                </p>
                <button
                  onClick={() => {
                    if (!courseSlug) return;
                    setLoading(true);
                    setError(null);
                    const request =
                      difficulty === "hard"
                        ? courseApi.getHardRoadmap(courseSlug)
                        : difficulty === "medium"
                          ? courseApi.getMediumRoadmap(courseSlug)
                          : courseApi.getEasyRoadmap(courseSlug);
                    request
                      .then((data) => {
                        if (data.mode === "hard") {
                          setHardRoadmap(data);
                        } else if (data.mode === "medium") {
                          setMediumRoadmap(data);
                        } else {
                          setRoadmap(data);
                        }
                      })
                      .catch((err) =>
                        setError(
                          err?.response?.data?.message ||
                            err?.message ||
                            `Unable to load ${DIFF_CONFIG[difficulty].label} roadmap.`,
                        ),
                      )
                      .finally(() => setLoading(false));
                  }}
                  className="mt-5 rounded-xl bg-[#97CADB] px-5 py-3 text-[12px] font-extrabold uppercase tracking-wider text-[#001e2e] transition hover:bg-[#b7e4ef]"
                >
                  Retry
                </button>
              </div>
            )}

            {difficulty === "easy" &&
              !loading &&
              !error &&
              flatNodes.length === 0 && (
                <div
                  className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-4"
                  style={{
                    background: cfg.glowWeak,
                    borderColor: `${cfg.accent}35`,
                  }}
                >
                  <LucideIcon
                    name="construction"
                    className=" text-[22px]"
                    style={{ color: cfg.accent }}
                  />
                  <div>
                    <p className="text-[13px] font-bold text-on-surface">
                      Coming soon
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-on-surface-variant/70">
                      Easy roadmap data is not implemented yet.
                    </p>
                  </div>
                </div>
              )}

            {difficulty === "easy" &&
              !loading &&
              !error &&
              flatNodes.length > 0 && (
                <div
                  ref={mapContainerRef}
                  className="relative w-full select-none overflow-visible"
                  style={{ height: `${mapHeight}px` }}
                >
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <filter id="glow-easy-roadmap">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {completedD && (
                      <path
                        d={completedD}
                        fill="none"
                        stroke={getDiffConfig("easy", isLight).pathColor}
                        strokeLinecap="round"
                        strokeWidth="6"
                        filter="url(#glow-easy-roadmap)"
                      />
                    )}
                    {lockedD && (
                      <path
                        d={lockedD}
                        fill="none"
                        stroke="var(--color-outline)"
                        strokeDasharray="8,10"
                        strokeLinecap="round"
                        strokeWidth="5"
                        opacity="0.5"
                      />
                    )}
                  </svg>

                  {flatNodes.map((node, idx) => {
                    const { x, y } = getNodeCoords(idx);
                    const styles = statusStyles[node.status];
                    const isHovered = hoveredNode === node.id;
                    const isActive = firstAvailableNodeId === node.id;
                    const isSelected = selectedNode?.id === node.id;
                    const lessonTitle = getLessonDisplayTitle(node);
                    const nodeGlowClass =
                      node.status === "available"
                        ? isActive || isSelected
                          ? "roadmap-node-selected"
                          : "roadmap-node-available"
                        : "";
                    const isFirstInChapter =
                      idx === 0 ||
                      flatNodes[idx - 1].chapterId !== node.chapterId;

                    return (
                      <div
                        key={node.id}
                        ref={isActive ? activeNodeRef : null}
                        data-node-id={node.id}
                        data-chapter-id={node.chapterId}
                        className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1.5"
                        style={{ left: `${x}px`, top: `${y}px` }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => {
                          setSelectedNode({ ...node, difficulty: "easy" });
                        }}
                      >
                        {isFirstInChapter && (
                          <div
                            className="absolute left-1/2 top-[-74px] z-0 -translate-x-1/2 whitespace-nowrap rounded-full border bg-background/95 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant shadow-lg"
                            style={{ borderColor: `${cfg.accent}30` }}
                          >
                            Chapter {node.chapterOrder}
                          </div>
                        )}

                        {isHovered && (
                          <div className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-30 -translate-x-1/2">
                            <div className="min-w-[220px] max-w-[280px] rounded-xl border border-on-surface/15 bg-surface-container px-4 py-3 text-center shadow-xl">
                              <p
                                className="mb-1 text-[11px] font-extrabold uppercase tracking-widest"
                                style={{ color: cfg.accent }}
                              >
                                Lesson {node.label}
                              </p>
                              <p className="text-[13px] font-bold leading-snug text-on-surface">
                                {lessonTitle}
                              </p>
                              <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-on-surface-variant">
                                <span className="flex items-center gap-1">
                                  <LucideIcon
                                    name="bolt"
                                    className=" text-[12px]"
                                  />
                                  {node.xp || 0} XP
                                </span>
                                <span className="flex items-center gap-1">
                                  <LucideIcon
                                    name="schedule"
                                    className=" text-[12px]"
                                  />
                                  {EASY_CHECKPOINT_DURATION}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isActive && (
                          <div
                            className="absolute rounded-full opacity-20 animate-ping"
                            style={{
                              inset: -8,
                              background: cfg.accent,
                            }}
                          />
                        )}

                        <div
                          className={`relative z-10 flex items-center justify-center rounded-full border-4 font-extrabold shadow-lg transition-transform duration-300 ${
                            isActive
                              ? "h-16 w-16 text-[17px]"
                              : "h-14 w-14 text-[15px]"
                          } ${styles.node} ${nodeGlowClass} ${isHovered ? "scale-110" : "scale-100"}`}
                          style={getNodeDynamicStyle(
                            node.status,
                            difficulty,
                            cfg,
                            isLight,
                          )}
                        >
                          {node.status === "locked" ? (
                            <LucideIcon name="lock" className=" text-[18px]" />
                          ) : (
                            node.label
                          )}
                        </div>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            node.status === "locked"
                              ? "border-on-surface/10 bg-surface-container text-on-surface-variant/40"
                              : "bg-background"
                          }`}
                          style={
                            node.status !== "locked"
                              ? {
                                  borderColor: `${cfg.accent}40`,
                                  color: cfg.accent,
                                }
                              : {}
                          }
                        >
                          {styles.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

            {difficulty === "medium" &&
              !loading &&
              !error &&
              mediumFlatNodes.length === 0 && (
                <div
                  className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-4"
                  style={{
                    background: cfg.glowWeak,
                    borderColor: `${cfg.accent}35`,
                  }}
                >
                  <LucideIcon
                    name="construction"
                    className=" text-[22px]"
                    style={{ color: cfg.accent }}
                  />
                  <div>
                    <p className="text-[13px] font-bold text-on-surface">
                      Coming soon
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-on-surface-variant/70">
                      Medium roadmap data is not implemented yet.
                    </p>
                  </div>
                </div>
              )}

            {difficulty === "medium" &&
              !loading &&
              !error &&
              mediumFlatNodes.length > 0 && (
                <div
                  ref={mapContainerRef}
                  className="relative w-full select-none overflow-visible"
                  style={{ height: `${mapHeight}px` }}
                >
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <filter id="glow-medium-roadmap">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {completedD && (
                      <path
                        d={completedD}
                        fill="none"
                        stroke={getDiffConfig("medium", isLight).pathColor}
                        strokeLinecap="round"
                        strokeWidth="6"
                        filter="url(#glow-medium-roadmap)"
                      />
                    )}
                    {lockedD && (
                      <path
                        d={lockedD}
                        fill="none"
                        stroke="var(--color-outline)"
                        strokeDasharray="8,10"
                        strokeLinecap="round"
                        strokeWidth="5"
                        opacity="0.5"
                      />
                    )}
                  </svg>

                  {mediumFlatNodes.map((node, idx) => {
                    const { x, y } = getNodeCoords(idx);
                    const styles = statusStyles[node.status];
                    const isHovered = hoveredNode === node.id;
                    const isActive = firstAvailableNodeId === node.id;
                    const isSelected = selectedNode?.id === node.id;
                    const chapterForNode = mediumChapters.find(
                      (chapter) => chapter.order === node.chapterOrder,
                    );
                    const nodeGlowClass =
                      node.status === "available"
                        ? isActive || isSelected
                          ? "roadmap-node-selected"
                          : "roadmap-node-available"
                        : "";
                    const isFirstInChapter =
                      idx === 0 ||
                      mediumFlatNodes[idx - 1].chapterOrder !==
                        node.chapterOrder;

                    return (
                      <div
                        key={node.id}
                        ref={isActive ? activeNodeRef : null}
                        data-node-id={node.id}
                        data-chapter-id={
                          chapterForNode?.id ??
                          node.chapterId ??
                          node.chapterOrder
                        }
                        className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1.5"
                        style={{ left: `${x}px`, top: `${y}px` }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => {
                          setSelectedNode({ ...node, difficulty: "medium" });
                        }}
                      >
                        {isFirstInChapter && (
                          <div
                            className="absolute left-1/2 top-[-74px] z-0 -translate-x-1/2 whitespace-nowrap rounded-full border bg-background/95 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant shadow-lg"
                            style={{ borderColor: `${cfg.accent}30` }}
                          >
                            Chapter {node.chapterOrder}
                          </div>
                        )}

                        {isHovered && (
                          <div className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-30 -translate-x-1/2">
                            <div className="min-w-[230px] max-w-[300px] rounded-xl border border-on-surface/15 bg-surface-container px-4 py-3 text-center shadow-xl">
                              <p
                                className="mb-1 text-[11px] font-extrabold uppercase tracking-widest"
                                style={{ color: cfg.accent }}
                              >
                                Challenge {node.label}
                              </p>
                              <p className="text-[13px] font-bold leading-snug text-on-surface">
                                {node.title}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-on-surface-variant">
                                <span>{getMediumTypeLabel(node.type)}</span>
                                <span>{node.xp || 0} XP</span>
                                <span>{node.estimatedMinutes || 1} min</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isActive && (
                          <div
                            className="absolute rounded-full opacity-20 animate-ping"
                            style={{
                              inset: -8,
                              background: cfg.accent,
                            }}
                          />
                        )}

                        <div
                          className={`relative z-10 flex items-center justify-center rounded-full border-4 font-extrabold shadow-lg transition-transform duration-300 ${
                            isActive
                              ? "h-16 w-16 text-[15px]"
                              : "h-14 w-14 text-[13px]"
                          } ${styles.node} ${nodeGlowClass} ${isHovered ? "scale-110" : "scale-100"}`}
                          style={getNodeDynamicStyle(
                            node.status,
                            difficulty,
                            cfg,
                            isLight,
                          )}
                        >
                          {node.status === "locked" ? (
                            <LucideIcon name="lock" className=" text-[18px]" />
                          ) : (
                            node.label
                          )}
                        </div>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            node.status === "locked"
                              ? "border-on-surface/10 bg-surface-container text-on-surface-variant/40"
                              : "bg-background"
                          }`}
                          style={
                            node.status !== "locked"
                              ? {
                                  borderColor: `${cfg.accent}40`,
                                  color: cfg.accent,
                                }
                              : {}
                          }
                        >
                          {styles.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            {difficulty === "hard" &&
              !loading &&
              !error &&
              hardFlatNodes.length > 0 && (
                <div
                  ref={mapContainerRef}
                  className="relative w-full select-none overflow-visible"
                  style={{ height: `${mapHeight}px` }}
                >
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <filter id="glow-hard-roadmap">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {completedD && (
                      <path
                        d={completedD}
                        fill="none"
                        stroke={getDiffConfig("hard", isLight).pathColor}
                        strokeLinecap="round"
                        strokeWidth="6"
                        filter="url(#glow-hard-roadmap)"
                      />
                    )}
                    {lockedD && (
                      <path
                        d={lockedD}
                        fill="none"
                        stroke="var(--color-outline)"
                        strokeDasharray="8,10"
                        strokeLinecap="round"
                        strokeWidth="5"
                        opacity="0.5"
                      />
                    )}
                  </svg>

                  {hardFlatNodes.map((node, idx) => {
                    const { x, y } = getNodeCoords(idx);
                    const styles = statusStyles[node.status];
                    const isHovered = hoveredNode === node.id;
                    const isActive = firstAvailableNodeId === node.id;
                    const isSelected = selectedNode?.id === node.id;
                    const chapterForNode = hardChapters.find(
                      (chapter) => chapter.order === node.chapterOrder,
                    );
                    const nodeGlowClass =
                      node.status === "available"
                        ? isActive || isSelected
                          ? "roadmap-node-selected"
                          : "roadmap-node-available"
                        : "";
                    const isFirstInChapter =
                      idx === 0 ||
                      hardFlatNodes[idx - 1].chapterOrder !== node.chapterOrder;

                    return (
                      <div
                        key={node.id}
                        ref={isActive ? activeNodeRef : null}
                        data-node-id={node.id}
                        data-chapter-id={
                          chapterForNode?.id ??
                          node.chapterId ??
                          node.chapterOrder
                        }
                        className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1.5"
                        style={{ left: `${x}px`, top: `${y}px` }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => {
                          setSelectedNode({ ...node, difficulty: "hard" });
                        }}
                      >
                        {isFirstInChapter && (
                          <div
                            className="absolute left-1/2 top-[-74px] z-0 -translate-x-1/2 whitespace-nowrap rounded-full border bg-background/95 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant shadow-lg"
                            style={{ borderColor: `${cfg.accent}30` }}
                          >
                            Chapter {node.chapterOrder}
                          </div>
                        )}

                        {isHovered && (
                          <div className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-30 -translate-x-1/2">
                            <div className="min-w-[230px] max-w-[300px] rounded-xl border border-on-surface/15 bg-surface-container px-4 py-3 text-center shadow-xl">
                              <p
                                className="mb-1 text-[11px] font-extrabold uppercase tracking-widest"
                                style={{ color: cfg.accent }}
                              >
                                Challenge {node.label}
                              </p>
                              <p className="text-[13px] font-bold leading-snug text-on-surface">
                                {node.title}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-on-surface-variant">
                                <span>{node.type.replace(/_/g, " ")}</span>
                                <span>{node.xp || 0} XP</span>
                                <span>{node.estimatedMinutes || 1} min</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isActive && (
                          <div
                            className="absolute rounded-full opacity-20 animate-ping"
                            style={{
                              inset: -8,
                              background: cfg.accent,
                            }}
                          />
                        )}

                        <div
                          className={`relative z-10 flex items-center justify-center rounded-full border-4 font-extrabold shadow-lg transition-transform duration-300 ${
                            isActive
                              ? "h-16 w-16 text-[15px]"
                              : "h-14 w-14 text-[13px]"
                          } ${styles.node} ${nodeGlowClass} ${isHovered ? "scale-110" : "scale-100"}`}
                          style={getNodeDynamicStyle(
                            node.status,
                            difficulty,
                            cfg,
                            isLight,
                          )}
                        >
                          {node.status === "locked" ? (
                            <LucideIcon name="lock" className=" text-[18px]" />
                          ) : (
                            node.label
                          )}
                        </div>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            node.status === "locked"
                              ? "border-on-surface/10 bg-surface-container text-on-surface-variant/40"
                              : "bg-background"
                          }`}
                          style={
                            node.status !== "locked"
                              ? {
                                  borderColor: `${cfg.accent}40`,
                                  color: cfg.accent,
                                }
                              : {}
                          }
                        >
                          {styles.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        </section>

        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
          <button
            onClick={scrollToActiveNode}
            title="Jump to available lesson"
            className="group flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!firstAvailableNodeId}
            style={{
              background: cfg.gradient,
              boxShadow: `0 4px 20px ${cfg.glowWeak}`,
              color: isLight ? "#000000" : "#fff",
            }}
          >
            <LucideIcon
              name="my_location"
              className=" text-[20px] transition-transform duration-300 group-hover:rotate-12"
            />
          </button>

          <div
            className={`transition-all duration-300 ${
              showScrollTop
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-4 opacity-0"
            }`}
          >
            <button
              onClick={scrollToTop}
              title="Scroll to top"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-on-surface/10 bg-surface-container/90 text-on-surface-variant shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-on-surface/25 hover:text-on-surface active:scale-95"
            >
              <LucideIcon name="arrow_upward" className=" text-[20px]" />
            </button>
          </div>
        </div>
      </main>

      <NodeDetailsModal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        courseSlug={courseSlug}
        node={selectedNode}
      />
    </div>
  );
};

export default WorldMapPage;

// trigger HMR
