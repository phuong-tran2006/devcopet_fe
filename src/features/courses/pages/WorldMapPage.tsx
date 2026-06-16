import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "@tanstack/react-router";
import {
  courseApi,
  type EasyRoadmapChapter,
  type EasyRoadmapNode,
  type EasyRoadmapResponse,
} from "../api/course.api";
import NodeDetailsModal from "../../../components/ui/NodeDetailsModal";

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

const statusStyles = {
  completed: {
    node: "bg-[#97CADB] text-[#001e2e] border-[#c7f0f7]",
    icon: "done",
    label: "Completed",
  },
  available: {
    node: "bg-gradient-to-tr from-[#97CADB] to-[#6aafc5] text-[#001e2e] border-background",
    icon: "play_arrow",
    label: "Available",
  },
  locked: {
    node: "bg-surface-container text-on-surface/30 border-on-surface/10",
    icon: "lock",
    label: "Locked",
  },
} as const;

const getChapterStatus = (chapter: EasyRoadmapChapter): ChapterStatus => {
  if (chapter.nodes.length === 0) return "locked";
  if (chapter.nodes.every((node) => node.status === "completed")) {
    return "completed";
  }
  if (chapter.nodes.some((node) => node.status === "available")) {
    return "active";
  }
  return "locked";
};

const normalizeOrder = (chapters: EasyRoadmapChapter[]) =>
  [...chapters].sort((a, b) => a.order - b.order);

const WorldMapPage = () => {
  const { worldId } = useParams({ strict: false });
  const courseSlug = worldId;
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [roadmap, setRoadmap] = useState<EasyRoadmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<
    (EasyRoadmapNode & { difficulty?: Difficulty }) | null
  >(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null,
  );

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLElement>(null);
  const activeNodeRef = useRef<HTMLDivElement>(null);

  const cfg = DIFF_CONFIG[difficulty];

  const chapters = useMemo(
    () => normalizeOrder(roadmap?.chapters ?? []),
    [roadmap],
  );

  const flatNodes = useMemo(
    () =>
      chapters.flatMap((chapter) =>
        [...chapter.nodes]
          .sort((a, b) => a.lessonOrder - b.lessonOrder)
          .map((node) => ({
            ...node,
            chapterTitle: chapter.title,
            chapterOrder: chapter.order,
          })),
      ),
    [chapters],
  );

  const firstAvailableNodeId = useMemo(
    () => flatNodes.find((node) => node.status === "available")?.id ?? null,
    [flatNodes],
  );

  const completedCount = flatNodes.filter(
    (node) => node.status === "completed",
  ).length;
  const totalNodes = roadmap?.course.totalNodes ?? flatNodes.length;
  const totalLessons = roadmap?.course.totalLessons ?? flatNodes.length;
  const completionPct =
    totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;
  const totalXp = flatNodes.reduce((sum, node) => sum + (node.xp || 0), 0);

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
    setRoadmap(null);
    setSelectedChapterId(null);

    courseApi
      .getEasyRoadmap(courseSlug)
      .then((data) => {
        if (!alive) return;
        setRoadmap(data);
        setSelectedChapterId(data.chapters[0]?.id ?? null);
        document.title = `${data.course.title} Roadmap | Devcopet Learn`;
      })
      .catch((err) => {
        if (!alive) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load Easy roadmap.",
        );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [courseSlug]);

  useEffect(() => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [difficulty]);

  const getNodeCoords = (index: number) => {
    const y = index * 150 + 120;
    const xOptions = [150, 340, 520, 340];
    const x = xOptions[index % xOptions.length];
    return { x, y };
  };

  const buildPath = (wantUnlocked: boolean) => {
    if (flatNodes.length < 2) return "";

    return flatNodes
      .slice(1)
      .map((node, idx) => {
        const prev = flatNodes[idx];
        const currentIndex = idx + 1;
        const unlocked =
          prev.status !== "locked" && node.status !== "locked";

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
  const mapHeight = Math.max(flatNodes.length * 150 + 180, 520);

  const scrollToTop = () =>
    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  const scrollToActiveNode = () => {
    activeNodeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  const scrollToChapter = (chapter: EasyRoadmapChapter) => {
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

  const handleMainScroll = () => {
    setShowScrollTop((mainScrollRef.current?.scrollTop ?? 0) > 250);
  };

  const renderChapterSidebar = () => {
    if (loading) {
      return (
        <div className="px-3 py-4 text-[12px] text-on-surface-variant">
          Loading chapters...
        </div>
      );
    }

    if (difficulty !== "easy") {
      return (
        <div className="mx-3 my-4 rounded-xl border border-on-surface/10 bg-surface-container/60 px-4 py-5">
          <p className="text-[12px] font-bold text-on-surface">
            Coming soon
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant/70">
            Medium and Hard roadmaps are not available yet.
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mx-3 my-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-5">
          <p className="text-[12px] font-bold text-red-200">Cannot load</p>
          <p className="mt-1 text-[11px] leading-relaxed text-red-100/70">
            {error}
          </p>
        </div>
      );
    }

    return chapters.map((chapter) => {
      const chapterStatus = getChapterStatus(chapter);
      const isSelected = selectedChapterId === chapter.id;

      return (
        <button
          key={chapter.id}
          onClick={() => scrollToChapter(chapter)}
          className={`w-full rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
            isSelected
              ? "bg-[#97CADB]/12 border-[#97CADB]/45 shadow-[0_0_16px_rgba(151,202,219,0.12)]"
              : "bg-on-surface/4 border-on-surface/8 hover:bg-on-surface/7 hover:border-on-surface/18"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] font-extrabold ${
                chapterStatus === "completed"
                  ? "bg-[#97CADB] text-[#001e2e] border-[#c7f0f7]"
                  : chapterStatus === "active"
                    ? "text-[#001e2e] border-background"
                    : "bg-surface-container text-on-surface/30 border-on-surface/10"
              }`}
              style={
                chapterStatus === "active"
                  ? {
                      background: cfg.gradient,
                      boxShadow: `0 0 12px ${cfg.glowWeak}`,
                    }
                  : {}
              }
            >
              {chapterStatus === "completed" ? (
                <span className="material-symbols-outlined text-[16px]">
                  done
                </span>
              ) : chapterStatus === "locked" ? (
                <span className="material-symbols-outlined text-[15px]">
                  lock
                </span>
              ) : (
                chapter.order
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                Chapter {chapter.order}
              </p>
              <p className="mt-0.5 text-[13px] font-semibold leading-snug text-on-surface">
                {chapter.title}
              </p>
              <p className="mt-1 text-[10px] text-on-surface-variant/55">
                {chapter.lessonCount} lessons • {chapter.nodeCount} nodes
              </p>
            </div>
          </div>
        </button>
      );
    });
  };

  return (
    <div className="relative flex h-[calc(100vh-80px)] w-full overflow-hidden bg-background">
      <aside
        className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
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
                <span className="material-symbols-outlined text-[25px]">
                  psychology
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-on-surface">
                  Level 12
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
                  Data Novice
                </span>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-on-surface/10 bg-surface-container/80 px-3 py-2.5">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ color: cfg.accent }}
                >
                  monetization_on
                </span>
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
                <span className="material-symbols-outlined text-[16px] text-[#FFE052]">
                  route
                </span>
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
                <span>EASY PROGRESS</span>
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
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ color: cfg.accent }}
            >
              format_list_bulleted
            </span>
            <span className="flex-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Chapters
            </span>
            <span className="text-[10px] font-bold" style={{ color: cfg.accent }}>
              {chapters.length || 0}
            </span>
          </div>

          <div
            className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#2a3641 transparent",
            }}
          >
            {renderChapterSidebar()}
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
        <span className="material-symbols-outlined text-[22px]">
          {drawerOpen ? "chevron_left" : "menu"}
        </span>
      </button>

      <main
        ref={mainScrollRef}
        onScroll={handleMainScroll}
        className="custom-scrollbar relative w-full flex-1 overflow-y-auto"
      >
        <section className="z-10 flex min-h-full flex-col items-center justify-start px-4 py-10">
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
                  <span
                    className="material-symbols-outlined text-[26px]"
                    style={{ color: cfg.accent }}
                  >
                    terminal
                  </span>
                </div>
                <div>
                  <h1 className="text-[32px] font-extrabold uppercase leading-none tracking-wide text-on-surface md:text-[38px]">
                    {roadmap?.course.title || "Course Roadmap"}
                  </h1>
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: cfg.accent }}
                  >
                    {difficulty === "easy"
                      ? `${roadmap?.course.totalChapters ?? 0} chapters • ${totalLessons} lessons • ${totalNodes} nodes`
                      : "Coming soon"}
                  </span>
                </div>
              </div>

              <div className="flex gap-0.5 rounded-xl border border-on-surface/10 bg-surface-container/90 p-1 text-[12px] font-bold uppercase tracking-wider">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`rounded-lg px-5 py-2 transition-all duration-200 ${
                      difficulty === d
                        ? "text-[#0d1117] shadow-md"
                        : "text-on-surface-variant hover:bg-on-surface/8 hover:text-on-surface"
                    }`}
                    style={
                      difficulty === d
                        ? {
                            background: DIFF_CONFIG[d].gradient,
                            boxShadow: `0 2px 12px ${DIFF_CONFIG[d].glowWeak}`,
                          }
                        : {}
                    }
                  >
                    {DIFF_CONFIG[d].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8 flex flex-col gap-2 rounded-2xl border border-on-surface/10 bg-surface-container/60 px-5 py-4">
              <div className="flex items-center justify-between text-[13px] font-bold tracking-wider text-on-surface-variant">
                <span>Easy Completion</span>
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
                <span>{completedCount} lesson nodes done</span>
                <span>{totalNodes} total nodes</span>
              </div>
            </div>

            {difficulty !== "easy" && (
              <div
                className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-4"
                style={{
                  background: cfg.glowWeak,
                  borderColor: `${cfg.accent}35`,
                }}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ color: cfg.accent }}
                >
                  construction
                </span>
                <div>
                  <p className="text-[13px] font-bold text-on-surface">
                    Coming soon
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-on-surface-variant/70">
                    {DIFF_CONFIG[difficulty].label} roadmap data is not
                    implemented yet.
                  </p>
                </div>
              </div>
            )}

            {difficulty === "easy" && loading && (
              <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-on-surface/8 bg-surface-container/40">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="h-11 w-11 animate-spin rounded-full border-4 border-t-transparent"
                    style={{ borderColor: `${cfg.accent}55`, borderTopColor: "transparent" }}
                  />
                  <p className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Loading Easy roadmap
                  </p>
                </div>
              </div>
            )}

            {difficulty === "easy" && !loading && error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-6 py-8 text-center">
                <span className="material-symbols-outlined mb-3 text-[34px] text-red-200">
                  error
                </span>
                <h2 className="text-[18px] font-extrabold text-on-surface">
                  Easy roadmap could not load
                </h2>
                <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-relaxed text-on-surface-variant">
                  {error}
                </p>
                <button
                  onClick={() => {
                    if (!courseSlug) return;
                    setLoading(true);
                    setError(null);
                    courseApi
                      .getEasyRoadmap(courseSlug)
                      .then(setRoadmap)
                      .catch((err) =>
                        setError(
                          err?.response?.data?.message ||
                            err?.message ||
                            "Unable to load Easy roadmap.",
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
                <div className="rounded-2xl border border-on-surface/10 bg-surface-container/50 px-6 py-8 text-center">
                  <h2 className="text-[18px] font-extrabold text-on-surface">
                    No lesson nodes yet
                  </h2>
                  <p className="mt-2 text-[13px] text-on-surface-variant">
                    The Easy roadmap returned no lessons for this course.
                  </p>
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
                        stroke={DIFF_CONFIG.easy.pathColor}
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
                          setSelectedChapterId(node.chapterId);
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
                              <p className="mb-1 text-[11px] font-extrabold uppercase tracking-widest text-[#97CADB]">
                                {node.label}
                              </p>
                              <p className="text-[13px] font-bold leading-snug text-on-surface">
                                {node.title}
                              </p>
                              <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-on-surface-variant">
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[12px]">
                                    bolt
                                  </span>
                                  {node.xp || 0} XP
                                </span>
                                {node.duration && (
                                  <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">
                                      schedule
                                    </span>
                                    {node.duration} min
                                  </span>
                                )}
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
                            isActive ? "h-16 w-16 text-[17px]" : "h-14 w-14 text-[15px]"
                          } ${styles.node} ${isHovered ? "scale-110" : "scale-100"}`}
                          style={
                            node.status !== "locked"
                              ? { boxShadow: `0 0 24px ${cfg.glowWeak}` }
                              : {}
                          }
                        >
                          {node.status === "locked" ? (
                            <span className="material-symbols-outlined text-[18px]">
                              lock
                            </span>
                          ) : (
                            node.label
                          )}
                        </div>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            node.status === "locked"
                              ? "border-on-surface/10 bg-surface-container text-on-surface-variant/40"
                              : "border-[#97CADB]/25 bg-background text-[#97CADB]"
                          }`}
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
              color: "#fff",
            }}
          >
            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:rotate-12">
              my_location
            </span>
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
              <span className="material-symbols-outlined text-[20px]">
                arrow_upward
              </span>
            </button>
          </div>
        </div>
      </main>

      <NodeDetailsModal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        node={selectedNode}
      />
    </div>
  );
};

export default WorldMapPage;
