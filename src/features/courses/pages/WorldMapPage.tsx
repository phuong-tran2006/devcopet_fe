import { useEffect, useState, useRef } from "react";
import { useParams } from "@tanstack/react-router";
import { courseApi } from "../api/course.api";
import NodeDetailsModal from "../../../components/ui/NodeDetailsModal";

// ─── Data per difficulty ─────────────────────────────────────────────────────

const EASY_CHAPTERS = [
  {
    _id: "e1",
    title: "Chapter 0: Introduction",
    status: "completed",
    stars: 3,
    lessons: 6,
    xp: 80,
  },
  {
    _id: "e2",
    title: "Chapter 1: Output / Print",
    status: "completed",
    stars: 2,
    lessons: 6,
    xp: 80,
  },
  {
    _id: "e3",
    title: "Chapter 2: Basic Data Types",
    status: "in_progress",
    lessons: 6,
    xp: 100,
  },
  {
    _id: "e4",
    title: "Chapter 3: User Input",
    status: "locked",
    lessons: 6,
    xp: 110,
  },
  {
    _id: "e5",
    title: "Chapter 4: Operators",
    status: "locked",
    lessons: 6,
    xp: 120,
  },
  {
    _id: "e6",
    title: "Chapter 5: Conditions",
    status: "locked",
    lessons: 6,
    xp: 130,
    description: "Master the flow of execution and complex decision making.",
    objectives: [
      "Understand if/else/elif statements",
      "Combine logical operators (and, or, not)",
      "Avoid nested conditionals",
    ],
  },
  {
    _id: "e7",
    title: "Chapter 6: Loops",
    status: "locked",
    lessons: 6,
    xp: 140,
    description: "Repeat actions without repeating code.",
    objectives: [
      "Understand while/for loops",
      "Control loop execution with break/continue",
      "Iterate over sequences efficiently",
    ],
  },
];

const MEDIUM_CHAPTERS = [
  {
    _id: "m1",
    title: "Chapter 0: Functions & Scope",
    status: "completed",
    stars: 3,
    lessons: 8,
    xp: 150,
  },
  {
    _id: "m2",
    title: "Chapter 1: Lists & Tuples",
    status: "in_progress",
    lessons: 7,
    xp: 160,
  },
  {
    _id: "m3",
    title: "Chapter 2: Dictionaries & Sets",
    status: "locked",
    lessons: 8,
    xp: 170,
  },
  {
    _id: "m4",
    title: "Chapter 3: File I/O & Modules",
    status: "locked",
    lessons: 7,
    xp: 180,
  },
  {
    _id: "m5",
    title: "Chapter 4: Error Handling",
    status: "locked",
    lessons: 6,
    xp: 190,
  },
  {
    _id: "m6",
    title: "Chapter 5: Comprehensions",
    status: "locked",
    lessons: 7,
    xp: 200,
  },
  {
    _id: "m7",
    title: "Chapter 6: Iterators & Generators",
    status: "locked",
    lessons: 8,
    xp: 220,
  },
];

const HARD_CHAPTERS = [
  {
    _id: "h1",
    title: "Chapter 0: OOP Fundamentals",
    status: "in_progress",
    lessons: 10,
    xp: 250,
  },
  {
    _id: "h2",
    title: "Chapter 1: Decorators",
    status: "locked",
    lessons: 8,
    xp: 280,
  },
  {
    _id: "h3",
    title: "Chapter 2: Metaclasses",
    status: "locked",
    lessons: 9,
    xp: 300,
  },
  {
    _id: "h4",
    title: "Chapter 3: Async & Concurrency",
    status: "locked",
    lessons: 10,
    xp: 320,
  },
  {
    _id: "h5",
    title: "Chapter 4: C Extensions",
    status: "locked",
    lessons: 8,
    xp: 350,
  },
  {
    _id: "h6",
    title: "Chapter 5: Design Patterns",
    status: "locked",
    lessons: 9,
    xp: 380,
  },
  {
    _id: "h7",
    title: "Chapter 6: System Programming",
    status: "locked",
    lessons: 10,
    xp: 400,
  },
];

// ─── Theme per difficulty ────────────────────────────────────────────────────

const DIFF_CONFIG = {
  easy: {
    label: "Easy",
    accent: "#97CADB",
    accentDim: "#6aafc5",
    glow: "rgba(151,202,219,0.65)",
    glowWeak: "rgba(151,202,219,0.20)",
    pathColor: "#97CADB",
    gradient: "linear-gradient(90deg, #97CADB, #6aafc5)",
    nodeCompleted: "bg-[#97CADB] text-[#001e2e]",
    nodeProgress:
      "bg-gradient-to-tr from-[#97CADB] to-[#6aafc5] text-[#001e2e]",
    pillActive: "bg-[#97CADB] text-[#001e2e]",
    barFrom: "#97CADB",
    barTo: "#6aafc5",
  },
  medium: {
    label: "Medium",
    accent: "#018ABE",
    accentDim: "#016490",
    glow: "rgba(1,138,190,0.65)",
    glowWeak: "rgba(1,138,190,0.20)",
    pathColor: "#018ABE",
    gradient: "linear-gradient(90deg, #018ABE, #016490)",
    nodeCompleted: "bg-[#018ABE] text-[#e0f4ff]",
    nodeProgress:
      "bg-gradient-to-tr from-[#018ABE] to-[#016490] text-[#e0f4ff]",
    pillActive: "bg-[#018ABE] text-[#e0f4ff]",
    barFrom: "#018ABE",
    barTo: "#016490",
  },
  hard: {
    label: "Hard",
    accent: "#02457A",
    accentDim: "#012d52",
    glow: "rgba(2,69,122,0.80)",
    glowWeak: "rgba(2,69,122,0.25)",
    pathColor: "#3a7fc1",
    gradient: "linear-gradient(90deg, #3a7fc1, #02457A, #012d52)",
    nodeCompleted: "bg-[#02457A] text-[#c8e4ff]",
    nodeProgress:
      "bg-gradient-to-tr from-[#3a7fc1] to-[#02457A] text-[#e0f0ff]",
    pillActive: "bg-[#02457A] text-[#c8e4ff]",
    barFrom: "#3a7fc1",
    barTo: "#02457A",
  },
} as const;

type Difficulty = keyof typeof DIFF_CONFIG;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Chapter {
  _id: string;
  title: string;
  status: string;
  stars?: number;
  lessons?: number;
  xp?: number;
  description?: string;
  objectives?: string[];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const StarPips = ({ stars, total = 3 }: { stars: number; total?: number }) => (
  <div className="flex items-center gap-[3px]">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`w-[6px] h-[6px] rounded-full ${
          i < stars
            ? "bg-[#FFE052] shadow-[0_0_4px_rgba(255,224,82,0.8)]"
            : "bg-[#3a4550]"
        }`}
      />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const WorldMapPage = () => {
  const { worldId } = useParams({ strict: false });
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<
    (Chapter & { difficulty?: "easy" | "medium" | "hard" }) | null
  >(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLDivElement>(null);

  const cfg = DIFF_CONFIG[difficulty];

  // pick chapters by difficulty
  const allChapters: Record<Difficulty, Chapter[]> = {
    easy: EASY_CHAPTERS,
    medium: MEDIUM_CHAPTERS,
    hard: HARD_CHAPTERS,
  };

  const [apiChapters, setApiChapters] = useState<
    Record<Difficulty, Chapter[] | null>
  >({
    easy: null,
    medium: null,
    hard: null,
  });

  const chapters = apiChapters[difficulty] ?? allChapters[difficulty];

  useEffect(() => {
    document.title = "Roadmap Path | Devcopet Learn";

    if (worldId) {
      courseApi
        .getCourses()
        .then((courses: any[]) => {
          const found = courses.find(
            (c: any) => c.slug === worldId || c._id === worldId,
          );
          if (found) return courseApi.getChapters(found._id);
          throw new Error("Course not found");
        })
        .then((data) => {
          if (data && data.length > 0) {
            // Map API data into easy chapters (just easy for now — backend doesn't split by diff yet)
            const mapped: Chapter[] = data.map((ch: any, idx: number) => {
              let status = "locked";
              if (idx < 2) status = "completed";
              else if (idx === 2) status = "in_progress";
              return {
                _id: ch._id,
                title: ch.title,
                status,
                stars: idx === 0 ? 3 : idx === 1 ? 2 : undefined,
                lessons: ch.lessons || 6,
                xp: ch.xp || 100,
                description:
                  ch.description ||
                  "Master the flow of execution and complex decision making.",
                objectives: ch.objectives || [
                  "Understand while/for loops",
                  "Master if/else conditions",
                  "Apply logical operators",
                ],
              };
            });
            setApiChapters((prev) => ({ ...prev, easy: mapped }));
          }
        })
        .catch((err) => console.log("Using mock roadmap data:", err.message));
    }
  }, [worldId]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset scroll & active node when switching difficulty
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [difficulty]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToActiveNode = () => {
    activeNodeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Zigzag node positions
  const getNodeCoords = (index: number) => {
    const y = index * 200 + 120;
    const xOptions = [160, 340, 460, 340];
    const x = xOptions[index % 4];
    return { x, y };
  };

  // SVG path
  const generatePath = () => {
    if (chapters.length === 0) return { completedD: "", lockedD: "" };
    let completedD = "";
    let lockedD = "";
    const inProgressIdx = chapters.findIndex((c) => c.status === "in_progress");
    const cutoffIdx =
      inProgressIdx >= 0
        ? inProgressIdx
        : chapters.filter((c) => c.status === "completed").length;

    chapters.forEach((_, idx) => {
      if (idx === 0) {
        const { x, y } = getNodeCoords(0);
        completedD += `M ${x} ${y}`;
      } else {
        const p1 = getNodeCoords(idx - 1);
        const p2 = getNodeCoords(idx);
        const curve = ` C ${p1.x} ${p1.y + 90}, ${p2.x} ${p2.y - 90}, ${p2.x} ${p2.y}`;
        if (idx <= cutoffIdx) {
          if (completedD === "") completedD += `M ${p1.x} ${p1.y}`;
          completedD += curve;
        } else {
          if (lockedD === "") lockedD += `M ${p1.x} ${p1.y}`;
          lockedD += curve;
        }
      }
    });

    return { completedD, lockedD };
  };

  const { completedD, lockedD } = generatePath();
  const mapHeight = chapters.length * 200 + 120;
  const completedCount = chapters.filter(
    (c) => c.status === "completed",
  ).length;
  const completionPct = Math.round((completedCount / chapters.length) * 100);

  // ─── Difficulty badge metadata ───────────────────────────────────────────────
  const diffMeta: Record<
    Difficulty,
    { totalXP: number; chapters: number; badge: string }
  > = {
    easy: { totalXP: 760, chapters: 7, badge: "🌱 Beginner" },
    medium: { totalXP: 1270, chapters: 7, badge: "⚔️ Challenger" },
    hard: { totalXP: 2180, chapters: 7, badge: "☠️ Expert" },
  };

  return (
    <div className="flex w-full h-[calc(100vh-80px)] bg-background overflow-hidden relative">
      {/* =========================================
          LEFT DRAWER
      ========================================= */}
      <aside
        className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
          drawerOpen ? "w-[320px]" : "w-0"
        }`}
      >
        <div
          className={`h-full w-[320px] flex flex-col bg-surface border-r border-on-surface/8 shadow-[8px_0_40px_rgba(0,0,0,0.6)] transition-opacity duration-200 ${
            drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* ── TOP: User Stats ── */}
          <div className="px-5 pt-5 pb-4 border-b border-on-surface/6 flex-shrink-0">
            {/* Profile row */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
                style={{
                  background: `${cfg.glowWeak}`,
                  borderColor: `${cfg.accent}40`,
                  boxShadow: `0 0 15px ${cfg.glowWeak}`,
                }}
              >
                🦖
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[15px] text-on-surface">
                  Level 12
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                  Data Novice
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-surface-container/80 border border-on-surface/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ color: cfg.accent }}
                >
                  monetization_on
                </span>
                <div className="flex flex-col">
                  <span className="text-[9px] text-on-surface-variant/70 font-medium uppercase tracking-wide">
                    XP Earned
                  </span>
                  <span className="text-[13px] font-bold text-on-surface">
                    2,450 XP
                  </span>
                </div>
              </div>
              <div className="bg-surface-container/80 border border-on-surface/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#FFE052]">
                  star
                </span>
                <div className="flex flex-col">
                  <span className="text-[9px] text-on-surface-variant/70 font-medium uppercase tracking-wide">
                    Stars
                  </span>
                  <span className="text-[13px] font-bold text-on-surface">
                    120
                  </span>
                </div>
              </div>
            </div>

            {/* Level progress */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-on-surface-variant">
                <span>LEVEL 12</span>
                <span>72%</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full w-[72%] rounded-full"
                  style={{
                    background: cfg.gradient,
                    boxShadow: `0 0 10px ${cfg.glowWeak}`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Chapter List Header ── */}
          <div className="px-5 pt-4 pb-3 flex items-center gap-2 border-b border-on-surface/5 flex-shrink-0">
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ color: cfg.accent }}
            >
              format_list_bulleted
            </span>
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex-1">
              Chapters
            </span>
            {/* Mini progress */}
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${completionPct}%`,
                    background: cfg.gradient,
                  }}
                />
              </div>
              <span
                className="text-[10px] font-bold"
                style={{ color: cfg.accent }}
              >
                {completionPct}%
              </span>
            </div>
          </div>

          {/* ── Scrollable Chapter List ── */}
          <div
            className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1.5"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#2a3641 transparent",
            }}
          >
            {chapters.map((chapter, idx) => {
              const isCompleted = chapter.status === "completed";
              const isInProgress = chapter.status === "in_progress";
              const isLocked = chapter.status === "locked";

              return (
                <button
                  key={chapter._id}
                  onClick={() => {
                    if (!isLocked) {
                      setSelectedChapter({ ...chapter, difficulty });
                    }
                  }}
                  disabled={isLocked}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-200
                    ${isCompleted ? "border-on-surface/10 hover:border-on-surface/20 bg-on-surface/4 hover:bg-on-surface/8 cursor-pointer" : ""}
                    ${isInProgress ? "ring-1 cursor-pointer" : ""}
                    ${isLocked ? "bg-transparent border-on-surface/5 opacity-35 cursor-not-allowed" : ""}
                  `}
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
                  {/* Status icon */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold
                      ${isCompleted ? cfg.nodeCompleted : ""}
                      ${isLocked ? "bg-surface-container text-on-surface/20 border border-on-surface/10" : ""}
                    `}
                    style={
                      isInProgress
                        ? {
                            background: cfg.gradient,
                            color: "#fff",
                            boxShadow: `0 0 10px ${cfg.glowWeak}`,
                          }
                        : {}
                    }
                  >
                    {isCompleted && (
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        done
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-[11px] font-extrabold">
                        {idx + 1}
                      </span>
                    )}
                    {isLocked && (
                      <span className="material-symbols-outlined text-[13px]">
                        lock
                      </span>
                    )}
                  </div>

                  {/* Chapter info */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span
                      className={`text-[12px] font-semibold truncate leading-snug ${
                        isLocked
                          ? "text-on-surface-variant/40"
                          : "text-on-surface-variant"
                      }`}
                      style={isInProgress ? { color: "#fff" } : {}}
                    >
                      {chapter.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] text-on-surface-variant/50">
                        {chapter.lessons || "?"} lessons
                      </span>
                      {isCompleted && chapter.stars && (
                        <StarPips stars={chapter.stars} />
                      )}
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
                    <span className="material-symbols-outlined text-[15px] text-on-surface/20 flex-shrink-0">
                      chevron_right
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Bottom: Stars + Upgrade ── */}
          <div className="px-4 py-4 border-t border-on-surface/5 flex-shrink-0 flex flex-col gap-2">
            <div
              className="border rounded-xl px-3 py-2.5 flex items-center gap-2.5"
              style={{
                background: "rgba(255,224,82,0.06)",
                borderColor: "rgba(255,224,82,0.2)",
              }}
            >
              <span className="material-symbols-outlined text-[18px] text-[#FFE052]">
                emoji_events
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  Stars Collected
                </span>
                <span className="text-[13px] font-extrabold text-on-surface">
                  12 / 150
                </span>
              </div>
            </div>
            <button
              className="w-full text-on-surface font-extrabold text-[11px] tracking-wider py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase"
              style={{
                background: cfg.gradient,
                boxShadow: `0 4px 20px ${cfg.glowWeak}`,
              }}
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </aside>

      {/* Drawer Toggle Tab */}
      <button
        onClick={() => setDrawerOpen(!drawerOpen)}
        className={`
          hidden lg:flex fixed top-[96px] z-50 h-10 w-10 items-center justify-center
          rounded-full border border-outline/30 bg-surface-container text-on-surface-variant
          shadow-lg transition-all duration-300
          hover:border-primary-fixed-dim hover:text-primary-fixed-dim hover:bg-[#17212d]
          ${drawerOpen ? "left-[335px]" : "left-4"}
        `}
        aria-label={drawerOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <span className="material-symbols-outlined text-[22px]">
          {drawerOpen ? "chevron_left" : "menu"}
        </span>
      </button>

      {/* =========================================
          MAIN MAP AREA
      ========================================= */}
      <main className="flex-1 w-full relative overflow-y-auto custom-scrollbar">
        <section className="flex flex-col items-center justify-start py-10 px-4 z-10 min-h-full">
          <div className="w-full max-w-[680px] flex flex-col">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8 border-b border-on-surface/8 pb-7">
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center border"
                  style={{
                    background: `${cfg.glowWeak}`,
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
                  <h1 className="text-[32px] md:text-[38px] font-extrabold text-on-surface tracking-wide uppercase leading-none">
                    Python World
                  </h1>
                  <span
                    className="text-[11px] font-bold tracking-widest uppercase"
                    style={{ color: cfg.accent }}
                  >
                    {diffMeta[difficulty].badge} ·{" "}
                    {diffMeta[difficulty].chapters} Chapters ·{" "}
                    {diffMeta[difficulty].totalXP} XP
                  </span>
                </div>
              </div>

              {/* Difficulty Pills */}
              <div className="flex bg-surface-container/90 p-1 rounded-xl border border-on-surface/10 text-[12px] font-bold uppercase tracking-wider gap-0.5">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-5 py-2 rounded-lg transition-all duration-200 ${
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

            {/* ── World Progress Bar ── */}
            <div className="flex flex-col gap-2 mb-8 border border-on-surface/10 bg-surface-container/60 rounded-2xl px-5 py-4">
              <div className="flex justify-between items-center text-[13px] font-bold tracking-wider text-on-surface-variant">
                <span>World Completion</span>
                <span className="text-[15px]" style={{ color: cfg.accent }}>
                  {completionPct}%
                </span>
              </div>
              <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${completionPct}%`,
                    background: cfg.gradient,
                    boxShadow: `0 0 14px ${cfg.glow}`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-on-surface-variant/60 font-medium mt-0.5">
                <span>{completedCount} chapters done</span>
                <span>{chapters.length} total</span>
              </div>
            </div>

            {/* ── Difficulty banner for Medium / Hard ── */}
            {difficulty !== "easy" && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border mb-6"
                style={{
                  background: `${cfg.glowWeak}`,
                  borderColor: `${cfg.accent}35`,
                }}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ color: cfg.accent }}
                >
                  {difficulty === "medium" ? "fitness_center" : "skull"}
                </span>
                <div>
                  <p className="text-[12px] font-bold text-on-surface">
                    {difficulty === "medium"
                      ? "Challenger Mode — Unlock after completing Easy"
                      : "Expert Mode — Unlock after completing Medium"}
                  </p>
                  <p className="text-[10px] text-on-surface-variant/70 mt-0.5">
                    {difficulty === "medium"
                      ? "Deeper concepts, more complex exercises. +50% XP multiplier."
                      : "No guardrails. Raw difficulty. +100% XP multiplier."}
                  </p>
                </div>
              </div>
            )}

            {/* ── Interactive Road Map ── */}
            <div
              ref={mapContainerRef}
              className="relative w-full overflow-visible select-none"
              style={{ height: `${mapHeight}px` }}
            >
              <svg
                className="absolute inset-0 pointer-events-none w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id={`glow-${difficulty}`}>
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
                    stroke={cfg.pathColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter={`url(#glow-${difficulty})`}
                  />
                )}
                {lockedD && (
                  <path
                    d={lockedD}
                    fill="none"
                    stroke="var(--color-outline)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="8,10"
                    opacity="0.5"
                  />
                )}
              </svg>

              {/* Chapter Nodes */}
              {chapters.map((chapter, idx) => {
                const { x, y } = getNodeCoords(idx);
                const isCompleted = chapter.status === "completed";
                const isInProgress = chapter.status === "in_progress";
                const isLocked = chapter.status === "locked";
                const isHovered = hoveredNode === chapter._id;

                return (
                  <div
                    key={chapter._id}
                    ref={isInProgress ? activeNodeRef : null}
                    data-chapter-id={chapter._id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10 cursor-pointer"
                    style={{ left: `${x}px`, top: `${y}px` }}
                    onMouseEnter={() => setHoveredNode(chapter._id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => {
                      setSelectedChapter({ ...chapter, difficulty });
                    }}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div
                        className="absolute z-30 pointer-events-none"
                        style={{
                          bottom: "calc(100% + 14px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <div className="bg-surface-container border border-on-surface/15 rounded-xl px-4 py-3 shadow-xl min-w-[180px] text-center">
                          <p className="text-[13px] font-bold text-on-surface whitespace-nowrap mb-1.5">
                            {chapter.title}
                          </p>
                          <div className="flex items-center justify-center gap-3 text-[11px] text-on-surface-variant">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">
                                book
                              </span>
                              {chapter.lessons || "?"} lessons
                            </span>
                            <span className="flex items-center gap-1 text-[#FFE052]">
                              <span className="material-symbols-outlined text-[12px]">
                                bolt
                              </span>
                              {chapter.xp || "?"}xp
                            </span>
                          </div>
                          {isLocked && (
                            <p className="text-[10px] text-on-surface-variant/50 mt-1.5">
                              Complete previous to unlock
                            </p>
                          )}
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent opacity-20"
                            style={{
                              borderTopColor: "var(--color-on-surface)",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* ── Completed Node ── */}
                    {isCompleted && (
                      <div
                        className={`flex flex-col items-center transition-transform duration-300 ${
                          isHovered ? "scale-110" : "scale-100"
                        }`}
                      >
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center font-bold border-2 border-on-surface/20 ${cfg.nodeCompleted}`}
                          style={{ boxShadow: `0 0 24px ${cfg.glow}` }}
                        >
                          <span className="material-symbols-outlined text-[26px] font-extrabold">
                            done
                          </span>
                        </div>
                        {chapter.stars !== undefined && (
                          <div
                            className="mt-1.5 px-2.5 py-1 rounded-full flex items-center gap-1.5 border"
                            style={{
                              background: "var(--color-background)",
                              borderColor: `${cfg.accent}28`,
                            }}
                          >
                            <StarPips stars={chapter.stars} />
                            <span className="text-[9px] font-bold text-[#FFE052]">
                              {chapter.stars}/3
                            </span>
                          </div>
                        )}
                        <span className="mt-1 text-[11px] font-semibold text-on-surface-variant/80 max-w-[120px] text-center leading-tight">
                          {chapter.title}
                        </span>
                      </div>
                    )}

                    {/* ── In Progress Node ── */}
                    {isInProgress && (
                      <div
                        className={`flex flex-col items-center relative transition-transform duration-300 ${
                          isHovered ? "scale-110" : "scale-100"
                        }`}
                      >
                        <div
                          className="absolute rounded-full animate-ping opacity-20 scale-150"
                          style={{
                            inset: 0,
                            background: cfg.accent,
                          }}
                        />
                        <div
                          className="w-16 h-16 rounded-full flex flex-col items-center justify-center font-extrabold text-[18px] border-4 border-background relative z-10"
                          style={{
                            background: cfg.gradient,
                            color: "#fff",
                            boxShadow: `0 0 32px ${cfg.glow}`,
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div
                          className="mt-2 px-3 py-1 rounded-full border"
                          style={{
                            background: `${cfg.glowWeak}`,
                            borderColor: `${cfg.accent}40`,
                          }}
                        >
                          <span
                            className="text-[10px] font-extrabold tracking-wide uppercase"
                            style={{ color: cfg.accent }}
                          >
                            Active
                          </span>
                        </div>
                        <span className="mt-1 text-[12px] font-bold text-on-surface max-w-[130px] text-center leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                          {chapter.title}
                        </span>
                      </div>
                    )}

                    {/* ── Locked Node ── */}
                    {isLocked && (
                      <div
                        className={`flex flex-col items-center transition-transform duration-300 ${
                          isHovered ? "scale-105" : "scale-100"
                        }`}
                      >
                        <div className="w-11 h-11 rounded-full bg-surface-container text-on-surface/20 flex items-center justify-center border border-on-surface/5 shadow-inner">
                          <span className="material-symbols-outlined text-[17px]">
                            lock
                          </span>
                        </div>
                        <span className="mt-1.5 text-[10px] font-medium text-on-surface-variant/40 max-w-[100px] text-center leading-tight">
                          {chapter.title}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FLOATING BUTTONS ── */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
          <button
            onClick={scrollToActiveNode}
            title="Jump to In-Progress Node"
            className="group w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
            style={{
              background: cfg.gradient,
              boxShadow: `0 4px 20px ${cfg.glowWeak}`,
              color: "#fff",
            }}
          >
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform duration-300">
              my_location
            </span>
          </button>

          <div
            className={`transition-all duration-300 ${
              showScrollTop
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <button
              onClick={scrollToTop}
              title="Scroll to Top"
              className="w-12 h-12 rounded-full bg-surface-container/90 backdrop-blur-md border border-on-surface/10 hover:border-on-surface/25 text-on-surface-variant hover:text-on-surface hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-lg"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_upward
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Node Details Modal */}
      <NodeDetailsModal
        isOpen={!!selectedChapter}
        onClose={() => setSelectedChapter(null)}
        chapter={selectedChapter}
      />
    </div>
  );
};

export default WorldMapPage;
