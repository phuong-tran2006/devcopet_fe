import { Fragment, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import {
  courseApi,
  type HardNodeChallengeResponse,
  type SubmitHardNodeChallengeResponse,
  type SubmitHardNodeChallengePayload,
  type HardMultipleChoiceChallenge,
  type HardDragDropChallenge,
  type HardOrderingChallenge,
  type HardFillTemplateChallenge,
  type OptionPayload,
  type OrderingPayload,
} from "../api/course.api";
import RoadmapAiHelper from "../components/RoadmapAiHelper";
import { useAuthStore } from "../../users/store/auth.store";
import LucideIcon from "../../../components/ui/LucideIcon";
import {
  getNavigationForResponse,
  getRewardItems,
  getSpeakerName,
} from "../utils/challengeResponse";

// ── Template drop-zone helpers (same pattern as MediumNodeChallengePage) ──────
const DROP_ZONE_REGEX =
  /\[([A-Za-z][A-Za-z0-9_-]*)\]|{{\s*([A-Za-z][A-Za-z0-9_-]*)\s*}}|\[\[\s*([A-Za-z][A-Za-z0-9_-]*)\s*\]\]|__([A-Za-z][A-Za-z0-9_-]*?)__/g;
const CHALLENGE_ROUTES = {
  easy: "/roadmap/$courseSlug/easy/nodes/$nodeId/challenge",
  medium: "/roadmap/$courseSlug/medium/nodes/$nodeId/challenge",
  hard: "/roadmap/$courseSlug/hard/nodes/$nodeId/challenge",
} as const;

const getDropZoneKeyFromMatch = (match: RegExpMatchArray | RegExpExecArray) =>
  match[1] || match[2] || match[3] || match[4];

const renderTemplateParts = (
  template: string,
  renderDropZone: (zoneId: string) => ReactNode,
): ReactNode[] => {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  const matches = [...template.matchAll(DROP_ZONE_REGEX)];

  for (const match of matches) {
    if (match.index === undefined) continue;
    if (match.index > lastIndex) {
      parts.push(template.slice(lastIndex, match.index));
    }
    const zoneId = getDropZoneKeyFromMatch(match);
    parts.push(
      <Fragment key={`drop-zone-${zoneId}-${match.index}`}>
        {renderDropZone(zoneId)}
      </Fragment>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < template.length) {
    parts.push(template.slice(lastIndex));
  }
  return parts;
};

type TemplateRow =
  | {
      kind: "match";
      id: string;
      prompt: string;
      zoneId: string;
    }
  | {
      kind: "text";
      id: string;
      text: string;
    };

const isLikelyDropZoneLabel = (label: string) =>
  label.includes("_") ||
  /^[A-Z0-9_]+$/.test(label) ||
  /^(blank|position|slot|stack|queue|root|leaf|parent|children|right|left)/i.test(
    label,
  );

const buildTemplateRows = (template: string): TemplateRow[] => {
  let anonymousBlankIndex = 1;

  return template
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((rawLine, index) => {
      // 1. First check if it's a direct colon-separated key-value match
      const colonMatch = /^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.+)$/.exec(rawLine);
      if (colonMatch && isLikelyDropZoneLabel(colonMatch[1])) {
        return {
          kind: "match",
          id: `match-${colonMatch[1]}-${index}`,
          prompt: colonMatch[2].replace(/_{3,}/g, "_____").trim(),
          zoneId: colonMatch[1],
        };
      }

      // 2. Perform replacements sequentially to normalize slot drop zones
      let line = rawLine;

      // Replace bare named slot patterns with bracketed drop zones (e.g. blank_1 -> [blank_1])
      line = line.replace(
        /\b((?:blank|position|slot)_[A-Za-z0-9]+)\b/g,
        "[$1]",
      );

      // Replace 3+ underscores with synthetic blank drop zones
      line = line.replace(/_{3,}/g, () => `[blank_${anonymousBlankIndex++}]`);

      // 3. Inspect matches after all normalizations are done
      const matches = [...line.matchAll(DROP_ZONE_REGEX)];
      if (matches.length === 1) {
        const match = matches[0];
        const zoneId = getDropZoneKeyFromMatch(match);
        const prompt = `${line
          .slice(0, match.index)
          .replace(/\s*[-=]*>\s*$/, "")
          .trim()} ${line.slice(match.index + match[0].length).trim()}`.trim();

        if (prompt) {
          return {
            kind: "match",
            id: `match-${zoneId}-${index}`,
            prompt,
            zoneId,
          };
        }
      }

      // Otherwise, return as a text row (which might contain 0 or multiple drop zones)
      return {
        kind: "text",
        id: `text-${index}`,
        text: line,
      };
    });
};

const extractDropZoneIds = (template: string): string[] => {
  const zoneIds = buildTemplateRows(template).flatMap((row) => {
    if (row.kind === "match") return [row.zoneId];
    return [...row.text.matchAll(DROP_ZONE_REGEX)].map(getDropZoneKeyFromMatch);
  });

  return Array.from(new Set(zoneIds));
};

const getOrderingItems = (challenge: HardOrderingChallenge | null) =>
  challenge?.steps ?? challenge?.poolItems ?? [];
// ─────────────────────────────────────────────────────────────────────────────

const CodeSnippetCard = ({
  codeSnippet,
}: {
  codeSnippet?: {
    language: "python" | "javascript" | "java" | "cpp" | string;
    code: string;
  } | null;
}) => {
  if (!codeSnippet) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-[0_18px_36px_rgba(15,23,42,0.14)] dark:border-[#1e3a5f] dark:bg-[#0a1626] dark:shadow-[0_0_22px_rgba(58,127,193,0.15)]">
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-[#66b3ff] dark:border-[#1e3a5f] dark:bg-[#0c1a2d]">
        {codeSnippet.language}
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[14px] font-semibold leading-7 text-[#dbeafe]">
        <code>{codeSnippet.code}</code>
      </pre>
    </div>
  );
};

const HardNodeChallengePage = () => {
  const { courseSlug, nodeId } = useParams({ strict: false });
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const petName = (currentUser?.petName as string) || "Axo-Script";
  const [data, setData] = useState<HardNodeChallengeResponse | null>(null);

  // States
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const [matchingMap, setMatchingMap] = useState<Record<string, string>>({});
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  // drag_drop (fill-template) state
  const [dropZoneMap, setDropZoneMap] = useState<Record<string, string>>({});
  const [selectedPoolItemId, setSelectedPoolItemId] = useState<string | null>(
    null,
  );

  const [selectedMatchItem, setSelectedMatchItem] = useState<string | null>(
    null,
  );

  const [result, setResult] = useState<SubmitHardNodeChallengeResponse | null>(
    null,
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nextChallengeLoading, setNextChallengeLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [xpToast, setXpToast] = useState<number | null>(null);

  const challenge = data?.challenge ?? null;
  const isReviewMode = data?.node.status === "completed" && !!data.review;
  const isLockedMode = data?.node.status === "locked";
  const canEdit = !isLockedMode && !isReviewMode && !result;
  const activeNavigation = getNavigationForResponse(
    result?.navigation,
    data?.navigation,
  );
  const speakerName = getSpeakerName(
    result?.explanationSpeaker?.name,
    data?.explanationSpeaker?.name,
    petName,
  );
  const rewardItems = getRewardItems(result?.rewardSummary, challenge?.xp || 0);

  const isOptionBased = [
    "multiple_choice",
    "code_trace",
    "bug_hunt",
    "choose_better_algorithm",
    "simulation",
    "fill_missing_line",
  ].includes(challenge?.type || "");
  const isDragDropMatching = challenge?.type === "drag_drop_matching";
  const isHardDragDrop = challenge?.type === "drag_drop";
  const isOrdering = ["ordering_steps", "ranking"].includes(
    challenge?.type || "",
  );

  const multipleChoiceChallenge = isOptionBased
    ? (challenge as HardMultipleChoiceChallenge)
    : null;
  const dragDropChallenge = isDragDropMatching
    ? (challenge as HardDragDropChallenge)
    : null;
  const hardFillChallenge = isHardDragDrop
    ? (challenge as HardFillTemplateChallenge)
    : null;
  const orderingChallenge = isOrdering
    ? (challenge as HardOrderingChallenge)
    : null;

  const canRevealAnswerDetails = isReviewMode || result?.correct === true;

  const activeSelectedOptionId =
    canRevealAnswerDetails && data?.review?.selectedOptionId
      ? data.review.selectedOptionId
      : selectedOptionId;
  const activeMatchingMap =
    canRevealAnswerDetails && data?.review?.matchingMap
      ? data.review.matchingMap
      : matchingMap;
  const activeOrderedIds =
    canRevealAnswerDetails && data?.review?.orderedIds
      ? data.review.orderedIds
      : orderedIds;
  const activeDropZoneMap =
    canRevealAnswerDetails && data?.review?.dropZoneMap
      ? data.review.dropZoneMap
      : dropZoneMap;

  const correctOptionId = canRevealAnswerDetails
    ? result?.correctOptionId || data?.review?.correctOptionId
    : undefined;
  const correctMatchingMap = canRevealAnswerDetails
    ? result?.correctMatchingMap || data?.review?.correctMatchingMap
    : undefined;
  const correctOrderedIds = canRevealAnswerDetails
    ? result?.correctOrderedIds || data?.review?.correctOrderedIds
    : undefined;
  const correctDropZoneMap = canRevealAnswerDetails
    ? result?.correctDropZoneMap || data?.review?.correctDropZoneMap
    : undefined;

  const dropZoneIds = useMemo(
    () =>
      hardFillChallenge ? extractDropZoneIds(hardFillChallenge.template) : [],
    [hardFillChallenge],
  );
  const templateRows = useMemo(
    () =>
      hardFillChallenge ? buildTemplateRows(hardFillChallenge.template) : [],
    [hardFillChallenge],
  );
  const orderingItems = useMemo(
    () => getOrderingItems(orderingChallenge),
    [orderingChallenge],
  );

  const getDropPoolItemText = (itemId?: string) =>
    hardFillChallenge?.poolItems.find((item) => item.id === itemId)?.text ??
    itemId ??
    "";

  const clearDropZone = (zoneId: string) => {
    setDropZoneMap((prev) => {
      const next = { ...prev };
      delete next[zoneId];
      return next;
    });
  };

  const assignPoolItemToDropZone = (zoneId: string) => {
    if (!canEdit) return;

    if (selectedPoolItemId) {
      setDropZoneMap((prev) => {
        const cleaned = Object.fromEntries(
          Object.entries(prev).filter(
            ([, value]) => value !== selectedPoolItemId,
          ),
        );
        return { ...cleaned, [zoneId]: selectedPoolItemId };
      });
      setSelectedPoolItemId(null);
    } else if (dropZoneMap[zoneId]) {
      clearDropZone(zoneId);
    }
  };

  const renderHardDropZone = (zoneId: string, compact = false) => {
    if (!hardFillChallenge) return null;

    const assignedItemId = activeDropZoneMap[zoneId];
    const correctItemId = correctDropZoneMap?.[zoneId];
    const isCorrect =
      canRevealAnswerDetails &&
      assignedItemId === correctItemId &&
      !!correctItemId;
    const isIncorrect =
      canRevealAnswerDetails &&
      !!assignedItemId &&
      assignedItemId !== correctItemId;
    const isReadyForSelection =
      canEdit && !assignedItemId && !!selectedPoolItemId;

    return (
      <div
        className={[
          "group flex min-h-[52px] items-center gap-2 rounded-xl border px-3 py-2 transition-all",
          compact ? "inline-flex min-w-[150px] align-middle" : "w-full",
          isCorrect
            ? "border-teal-600 bg-teal-50 text-teal-950 shadow-[0_0_16px_rgba(13,148,136,0.14)] dark:border-[#63f1e3] dark:bg-[#10262c] dark:text-[#63f1e3] dark:shadow-[0_0_16px_rgba(99,241,227,0.18)]"
            : isIncorrect
              ? "border-red-500 bg-red-50 text-red-950 dark:border-red-400/80 dark:bg-red-400/10 dark:text-red-100"
              : assignedItemId
                ? "border-blue-500/70 bg-blue-50 text-blue-950 shadow-[0_0_16px_rgba(37,99,235,0.12)] dark:border-[#66b3ff]/75 dark:bg-[#123052] dark:text-blue-50 dark:shadow-[0_0_16px_rgba(58,127,193,0.16)]"
                : isReadyForSelection
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-[0_0_18px_rgba(37,99,235,0.14)] dark:border-[#66b3ff] dark:bg-[#3a7fc1]/15 dark:text-[#66b3ff] dark:shadow-[0_0_18px_rgba(58,127,193,0.22)]"
                  : "border-dashed border-slate-300 bg-white text-slate-600 dark:border-slate-500/70 dark:bg-[#071321] dark:text-slate-300",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => assignPoolItemToDropZone(zoneId)}
          disabled={!canEdit}
          className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left disabled:cursor-default"
        >
          <span className="min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-widest opacity-60">
              {zoneId.replace(/_/g, " ")}
            </span>
            <span className="mt-0.5 block truncate text-[13px] font-extrabold">
              {assignedItemId
                ? getDropPoolItemText(assignedItemId)
                : selectedPoolItemId
                  ? "Place selected item"
                  : "Choose item"}
            </span>
            {isIncorrect && correctItemId && (
              <span className="mt-1 block truncate text-[11px] font-semibold text-[#63f1e3]">
                Correct: {getDropPoolItemText(correctItemId)}
              </span>
            )}
          </span>
          <LucideIcon
            name={
              isCorrect ? "check_circle" : isIncorrect ? "cancel" : "ads_click"
            }
            className="text-[18px] opacity-80"
          />
        </button>

        {canEdit && assignedItemId && (
          <button
            type="button"
            onClick={() => clearDropZone(zoneId)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-300 transition hover:bg-red-400/15 hover:text-red-200"
            aria-label={`Clear ${zoneId}`}
          >
            <LucideIcon name="close" className="text-[17px]" />
          </button>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!nodeId) {
      setLoading(false);
      setError("Challenge node is missing.");
      return;
    }

    let alive = true;
    setLoading(true);
    setError(null);
    setSubmitError(null);
    setSelectedOptionId(null);
    setMatchingMap({});
    setOrderedIds([]);
    setDropZoneMap({});
    setSelectedPoolItemId(null);
    setResult(null);
    setShowSuccessModal(false);

    Promise.all([
      courseApi.getHardNodeChallenge(nodeId),
      courseSlug ? courseApi.getHardRoadmap(courseSlug) : Promise.resolve(null),
    ])
      .then(([response, roadmap]) => {
        if (!alive) return;
        if (roadmap) {
          const nodes = [...roadmap.chapters]
            .sort((a, b) => a.order - b.order)
            .flatMap((chapter) =>
              [...chapter.nodes].sort((a, b) => a.order - b.order),
            );
          const index = nodes.findIndex((n) => n.id === nodeId);
          if (index >= 0) {
            response.node.label = (index + 1).toString();
          }
        }
        setData(response);
        if (response.review) {
          if (response.review.selectedOptionId)
            setSelectedOptionId(response.review.selectedOptionId);
          if (response.review.matchingMap)
            setMatchingMap(response.review.matchingMap);
          if (response.review.orderedIds)
            setOrderedIds(response.review.orderedIds);
          if (response.review.dropZoneMap)
            setDropZoneMap(response.review.dropZoneMap);
        } else if (response.challenge) {
          if (
            response.challenge.type === "ordering_steps" ||
            response.challenge.type === "ranking"
          ) {
            setOrderedIds(
              getOrderingItems(response.challenge as HardOrderingChallenge).map(
                (s) => s.id,
              ),
            );
          }
        }
        document.title = `${response.node.label} Hard Challenge | Devcopet`;
      })
      .catch((err) => {
        if (!alive) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load challenge details.",
        );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [nodeId, courseSlug]);

  const goBackToRoadmap = () => {
    const target = activeNavigation?.returnToRoadmap;
    navigate({
      to: "/roadmap/$worldId",
      params: { worldId: target?.courseSlug || courseSlug || "python-basic" },
    });
  };

  const goToNextChallenge = () => {
    if (nextChallengeLoading) return;

    const nextChallenge = activeNavigation?.nextChallenge;
    if (!nextChallenge) {
      goBackToRoadmap();
      return;
    }

    setNextChallengeLoading(true);
    try {
      navigate({
        to: CHALLENGE_ROUTES[nextChallenge.mode],
        params: {
          courseSlug: nextChallenge.courseSlug,
          nodeId: nextChallenge.nodeId,
        },
      } as any);
    } catch (err) {
      console.error("Unable to open next Hard challenge:", err);
      goBackToRoadmap();
    } finally {
      setNextChallengeLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitDisabled || !challenge) return;
    setSubmitting(true);
    setSubmitError(null);

    let payload: SubmitHardNodeChallengePayload;
    if (isOptionBased && selectedOptionId) {
      payload = {
        type: challenge.type as OptionPayload["type"],
        selectedOptionId,
      };
    } else if (isDragDropMatching) {
      payload = {
        type: "drag_drop_matching",
        matchingMap,
      };
    } else if (isHardDragDrop) {
      payload = {
        type: "drag_drop",
        dropZoneMap,
      };
    } else if (isOrdering) {
      payload = {
        type: challenge.type as OrderingPayload["type"],
        orderedIds,
      };
    } else {
      setSubmitting(false);
      return;
    }

    try {
      const res = await courseApi.submitHardNodeChallenge(nodeId!, payload);
      setResult(res);

      const { xpAwarded, userProgress, rewardSummary } = res;
      const toastXp = rewardSummary?.xp ?? xpAwarded;
      if (toastXp && toastXp > 0) {
        setXpToast(toastXp);
        window.setTimeout(() => setXpToast(null), 3500);
      }
      if (userProgress) {
        useAuthStore.getState().updateUser({
          exp: userProgress.exp,
          level: userProgress.level,
        });
      }

      if (res.correct) {
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message || err?.message || "Submission failed",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled =
    submitting ||
    !canEdit ||
    (isOptionBased && !selectedOptionId) ||
    (isDragDropMatching && Object.keys(matchingMap).length === 0) ||
    (isHardDragDrop &&
      dropZoneIds.length > 0 &&
      Object.keys(dropZoneMap).length < dropZoneIds.length) ||
    (isOrdering && orderedIds.length < orderingItems.length);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-on-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-[#3a7fc1]/50" />
          <p className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
            Loading Hard Challenge
          </p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-on-surface p-4">
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-6 py-5 text-center">
          <p className="text-[14px] font-semibold text-red-200">
            {error || "Challenge not found"}
          </p>
          <Link
            to="/roadmap/$worldId"
            params={{ worldId: courseSlug! }}
            className="mt-4 block text-[#66b3ff] hover:underline"
          >
            Return to Roadmap
          </Link>
        </div>
      </div>
    );
  }

  const hintText = challenge.hint || challenge.hints?.[0]?.text || "";

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f4f7fb] text-on-surface flex flex-col justify-start items-center py-10 px-4 dark:bg-[#071217]">
      <div className="w-full max-w-[800px] flex flex-col">
        {/* Back navigation */}
        <div className="flex justify-between items-center mb-6 w-full">
          <button
            onClick={goBackToRoadmap}
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-[13px] font-bold uppercase tracking-widest"
          >
            <LucideIcon name="arrow_back" className="text-[16px]" />
            Back to Roadmap
          </button>

          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#66b3ff]">
            <span>Hard Checkpoint</span>
          </div>
        </div>

        <section className="w-full flex flex-col">
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-[14px] text-on-surface-variant font-medium">
              {data?.node.title}
            </p>
          </div>

          {isLockedMode && (
            <div className="mx-auto mt-12 w-full rounded-xl border border-slate-200 bg-white p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-[#1e3a5f] dark:bg-[#081624] dark:shadow-[0_0_28px_rgba(58,127,193,0.08)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-on-surface/10 bg-on-surface/5 text-on-surface-variant">
                <LucideIcon name="lock" className="text-[32px]" />
              </div>
              <h1 className="mt-5 text-[28px] font-extrabold">
                Checkpoint Locked
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-on-surface-variant">
                Complete the previous roadmap checkpoints before opening this
                challenge.
              </p>
              <button
                onClick={goBackToRoadmap}
                className="mt-7 rounded-xl border border-slate-200 bg-white px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-on-surface-variant transition hover:border-blue-500/50 hover:text-on-surface dark:border-[#1e3a5f] dark:bg-[#0c1a2d]"
              >
                Back to Roadmap
              </button>
            </div>
          )}

          {!isLockedMode && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-[#1e3a5f] dark:bg-[#081624] dark:shadow-[0_0_28px_rgba(58,127,193,0.08)]">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-[#1e3a5f] dark:bg-[#0c1a2d]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#66b3ff]">
                      Question 01
                    </p>
                    <h2 className="mt-1 truncate text-[18px] font-extrabold text-on-surface">
                      {challenge.title}
                    </h2>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    <span>{challenge.type.replace("_", " ")}</span>
                    <span className="h-1 w-1 rounded-full bg-[#66b3ff]/70" />
                    <span>{challenge.xp} XP</span>
                    <span className="h-1 w-1 rounded-full bg-[#66b3ff]/70" />
                    <span>{challenge.estimatedMinutes} min</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 px-6 py-7 dark:border-[#1e3a5f]">
                <p className="text-[26px] font-extrabold leading-tight text-on-surface md:text-[32px]">
                  {challenge.question}
                </p>
                {challenge.codeSnippet && (
                  <div className="mt-5">
                    <CodeSnippetCard codeSnippet={challenge.codeSnippet} />
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col gap-6">
                {/* GAME LOGIC */}
                {isOptionBased && multipleChoiceChallenge && (
                  <div className="flex flex-col gap-3">
                    {multipleChoiceChallenge.options.map((opt, i) => {
                      const isSelected = activeSelectedOptionId === opt.id;
                      const isCorrect =
                        canRevealAnswerDetails && correctOptionId === opt.id;
                      const isIncorrect =
                        canRevealAnswerDetails && isSelected && !isCorrect;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => canEdit && setSelectedOptionId(opt.id)}
                          disabled={!canEdit}
                          className={`
                            relative flex items-center w-full px-5 py-4 text-left rounded-xl border-2 transition-all duration-200
                            ${isSelected ? "border-[#3a7fc1] bg-[#1e3a5f]/40" : "border-on-surface/10 bg-surface-container hover:border-on-surface/20"}
                            ${isCorrect ? "border-[#63f1e3] bg-[#10262c] shadow-[0_0_15px_rgba(99,241,227,0.15)]" : ""}
                            ${isIncorrect ? "border-red-400 bg-red-400/10" : ""}
                            ${!canEdit && !isCorrect && !isIncorrect ? "opacity-50" : ""}
                          `}
                        >
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold mr-4
                            ${isSelected ? "border-[#3a7fc1] bg-[#3a7fc1]/20 text-[#66b3ff]" : "border-on-surface/20 text-on-surface-variant"}
                            ${isCorrect ? "border-[#63f1e3] bg-[#63f1e3]/20 text-[#63f1e3]" : ""}
                            ${isIncorrect ? "border-red-400 bg-red-400/20 text-red-300" : ""}
                          `}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="text-[15px] font-semibold flex-1">
                            {opt.text}
                          </span>
                          {isCorrect && (
                            <LucideIcon
                              name="check_circle"
                              className="text-[#63f1e3]"
                            />
                          )}
                          {isIncorrect && (
                            <LucideIcon
                              name="cancel"
                              className="text-red-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {isDragDropMatching && dragDropChallenge && (
                  <div className="flex flex-col gap-6">
                    <p className="text-[13px] text-on-surface-variant font-medium">
                      Select an item on the left, then a choice on the right to
                      match them.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-3">
                        {dragDropChallenge.items.map((item) => {
                          const isSelected = selectedMatchItem === item.id;
                          const hasMatch = !!activeMatchingMap[item.id];
                          return (
                            <button
                              key={item.id}
                              onClick={() =>
                                canEdit &&
                                setSelectedMatchItem(
                                  isSelected ? null : item.id,
                                )
                              }
                              disabled={!canEdit}
                              className={`
                                px-4 py-3 rounded-lg border text-left transition-all text-[14px] font-semibold
                                ${isSelected ? "border-[#3a7fc1] bg-[#3a7fc1]/20 shadow-[0_0_10px_rgba(58,127,193,0.3)] ring-2 ring-[#3a7fc1]/50" : "border-on-surface/15 bg-on-surface/5"}
                                ${hasMatch ? "opacity-60" : ""}
                              `}
                            >
                              {item.text}
                              {hasMatch && (
                                <span className="ml-2 text-[10px] text-on-surface-variant uppercase tracking-widest">
                                  (Matched)
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex flex-col gap-3">
                        {dragDropChallenge.choices.map((choice) => {
                          const matchedItemId = Object.keys(
                            activeMatchingMap,
                          ).find((k) => activeMatchingMap[k] === choice.id);
                          const matchedItem = dragDropChallenge.items.find(
                            (i) => i.id === matchedItemId,
                          );
                          const isCorrectMatch =
                            canRevealAnswerDetails &&
                            correctMatchingMap?.[matchedItemId || ""] ===
                              choice.id;
                          const isIncorrectMatch =
                            canRevealAnswerDetails &&
                            matchedItemId &&
                            !isCorrectMatch;

                          return (
                            <div
                              key={choice.id}
                              className="flex items-center gap-3"
                            >
                              <button
                                onClick={() => {
                                  if (!canEdit) return;
                                  if (matchedItemId) {
                                    const newMap = { ...matchingMap };
                                    delete newMap[matchedItemId];
                                    setMatchingMap(newMap);
                                  } else if (selectedMatchItem) {
                                    setMatchingMap({
                                      ...matchingMap,
                                      [selectedMatchItem]: choice.id,
                                    });
                                    setSelectedMatchItem(null);
                                  }
                                }}
                                disabled={!canEdit}
                                className={`
                                  flex-1 px-4 py-3 rounded-lg border text-left transition-all text-[14px] font-semibold
                                  ${matchedItemId ? "border-[#66b3ff] bg-[#1e3a5f]" : "border-on-surface/15 bg-surface hover:border-on-surface/30"}
                                  ${isCorrectMatch ? "border-[#63f1e3] bg-[#10262c] shadow-[0_0_15px_rgba(99,241,227,0.15)]" : ""}
                                  ${isIncorrectMatch ? "border-red-400 bg-red-400/10" : ""}
                                `}
                              >
                                <div className="flex justify-between items-center">
                                  <span>{choice.text}</span>
                                  {matchedItemId && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] font-bold text-[#66b3ff] bg-[#3a7fc1]/20 px-2 py-0.5 rounded truncate max-w-[100px]">
                                        {matchedItem?.text}
                                      </span>
                                      {canEdit && (
                                        <LucideIcon
                                          name="close"
                                          className="text-[16px] text-on-surface-variant hover:text-red-400"
                                        />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {isHardDragDrop && hardFillChallenge && (
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-[0_18px_36px_rgba(15,23,42,0.08)] sm:p-5 dark:border-[#1e3a5f] dark:bg-[#081624] dark:shadow-[0_0_24px_rgba(58,127,193,0.08)]">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#66b3ff]">
                            Match Board
                          </p>
                          <p className="mt-1 text-[12px] font-medium text-on-surface-variant">
                            Pick an answer, then place it into the matching row.
                          </p>
                        </div>

                        {canEdit && Object.keys(dropZoneMap).length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setDropZoneMap({});
                              setSelectedPoolItemId(null);
                            }}
                            className="rounded-lg border border-on-surface/10 bg-black/10 px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant transition hover:border-red-400/35 hover:text-red-200"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      {selectedPoolItemId && canEdit && (
                        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[#66b3ff]/30 bg-[#3a7fc1]/12 px-4 py-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#66b3ff]">
                              Selected
                            </p>
                            <p className="truncate text-[13px] font-bold text-blue-900 dark:text-blue-50">
                              {getDropPoolItemText(selectedPoolItemId)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedPoolItemId(null)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white"
                            aria-label="Clear selected item"
                          >
                            <LucideIcon name="close" className="text-[18px]" />
                          </button>
                        </div>
                      )}

                      <div className="flex flex-col gap-3">
                        {templateRows.map((row) =>
                          row.kind === "match" ? (
                            <div
                              key={row.id}
                              className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center dark:border-white/8 dark:bg-[#0b1d2f]"
                            >
                              <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/8 dark:bg-black/15">
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                                  Prompt
                                </p>
                                <p className="mt-1 break-words font-mono text-[13px] font-bold leading-6 text-slate-800 dark:text-[#dbeafe]">
                                  {row.prompt}
                                </p>
                              </div>
                              {renderHardDropZone(row.zoneId)}
                            </div>
                          ) : (
                            <div
                              key={row.id}
                              className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-[13px] font-semibold leading-6 text-slate-800 dark:border-white/8 dark:bg-[#0b1d2f] dark:text-[#dbeafe]"
                            >
                              {renderTemplateParts(row.text, (zoneId) =>
                                renderHardDropZone(zoneId, true),
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-24 lg:self-start dark:border-[#1e3a5f] dark:bg-[#081624]">
                      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#66b3ff]">
                        Answers
                      </p>
                      <div className="flex flex-col gap-2">
                        {hardFillChallenge.poolItems.map((item) => {
                          const isUsed = Object.values(
                            activeDropZoneMap,
                          ).includes(item.id);
                          const isSelected = selectedPoolItemId === item.id;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                if (!canEdit || isUsed) return;
                                setSelectedPoolItemId(
                                  isSelected ? null : item.id,
                                );
                              }}
                              disabled={!canEdit || isUsed}
                              className={[
                                "flex min-h-[48px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[13px] font-extrabold transition-all",
                                isUsed
                                  ? "cursor-not-allowed border-white/8 bg-white/5 text-slate-500"
                                  : isSelected
                                    ? "border-[#66b3ff] bg-[#3a7fc1]/20 text-[#66b3ff] shadow-[0_0_18px_rgba(58,127,193,0.28)]"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-[#66b3ff]/60 hover:text-slate-950 dark:border-white/10 dark:bg-[#0d2135] dark:text-slate-200 dark:hover:text-white",
                              ].join(" ")}
                            >
                              <span>{item.text}</span>
                              <LucideIcon
                                name={
                                  isUsed
                                    ? "check"
                                    : isSelected
                                      ? "radio_button_checked"
                                      : "radio_button_unchecked"
                                }
                                className="text-[17px] opacity-70"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </aside>
                  </div>
                )}

                {isOrdering && orderingChallenge && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[13px] text-on-surface-variant font-medium mb-2">
                      Use the arrows to reorder the steps correctly.
                    </p>
                    {activeOrderedIds.map((id, index) => {
                      const step = orderingItems.find((s) => s.id === id);
                      if (!step) return null;
                      const isCorrect =
                        canRevealAnswerDetails &&
                        correctOrderedIds?.[index] === id;
                      const isIncorrect =
                        canRevealAnswerDetails &&
                        correctOrderedIds &&
                        correctOrderedIds[index] !== id;

                      return (
                        <div
                          key={id}
                          className={`
                            flex items-center gap-4 px-4 py-3 rounded-xl border bg-surface-container
                            ${isCorrect ? "border-[#63f1e3] bg-[#10262c]" : "border-on-surface/10"}
                            ${isIncorrect ? "border-red-400 bg-red-400/10" : ""}
                          `}
                        >
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => {
                                if (!canEdit || index === 0) return;
                                const newIds = [...orderedIds];
                                [newIds[index - 1], newIds[index]] = [
                                  newIds[index],
                                  newIds[index - 1],
                                ];
                                setOrderedIds(newIds);
                              }}
                              disabled={!canEdit || index === 0}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-on-surface/10 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <LucideIcon
                                name="keyboard_arrow_up"
                                className="text-[18px]"
                              />
                            </button>
                            <button
                              onClick={() => {
                                if (!canEdit || index === orderedIds.length - 1)
                                  return;
                                const newIds = [...orderedIds];
                                [newIds[index + 1], newIds[index]] = [
                                  newIds[index],
                                  newIds[index + 1],
                                ];
                                setOrderedIds(newIds);
                              }}
                              disabled={
                                !canEdit || index === orderedIds.length - 1
                              }
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-on-surface/10 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <LucideIcon
                                name="keyboard_arrow_down"
                                className="text-[18px]"
                              />
                            </button>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-on-surface/10 flex items-center justify-center text-[11px] font-bold text-on-surface-variant">
                            {index + 1}
                          </div>
                          <span className="text-[14px] font-semibold flex-1">
                            {step.text}
                          </span>
                          {isCorrect && (
                            <LucideIcon
                              name="check_circle"
                              className="text-[#63f1e3]"
                            />
                          )}
                          {isIncorrect && (
                            <LucideIcon
                              name="cancel"
                              className="text-red-400"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isOptionBased &&
                  !isDragDropMatching &&
                  !isHardDragDrop &&
                  !isOrdering && (
                    <div className="rounded-xl border border-on-surface/10 bg-surface-container/60 px-5 py-6 text-center">
                      <p className="font-bold text-on-surface">
                        Unsupported Challenge Type
                      </p>
                      <p className="text-[13px] text-on-surface-variant mt-1">
                        Please return to the roadmap.
                      </p>
                    </div>
                  )}
              </div>

              {submitError && (
                <div className="mx-6 mb-6 mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 flex items-center gap-3">
                  <LucideIcon name="error" className="text-red-300" />
                  <p className="text-[13px] font-bold text-red-200">
                    {submitError}
                  </p>
                </div>
              )}

              {result && !result.correct && (
                <div className="mx-6 mb-6 mt-4 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <LucideIcon
                      name="error"
                      className="text-[20px] text-red-300"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-red-900 text-[14px] dark:text-red-100">
                        {result.message || "Not quite. Try again."}
                      </p>
                      {result.explanation && (
                        <p className="mt-1 text-[13px] leading-relaxed text-red-800/75 dark:text-red-100/70">
                          {result.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {result && !result.correct && !isReviewMode && (
                <button
                  onClick={() => {
                    setResult(null);
                    setSelectedOptionId(null);
                    setMatchingMap({});
                    setDropZoneMap({});
                    setSelectedPoolItemId(null);
                    if (orderingChallenge)
                      setOrderedIds(orderingItems.map((s) => s.id));
                  }}
                  className="mx-6 mb-6 w-[calc(100%-3rem)] rounded-xl border border-[#66b3ff]/45 bg-[#66b3ff]/10 px-5 py-4 text-[13px] font-extrabold uppercase tracking-widest text-[#66b3ff] transition hover:bg-[#66b3ff]/15"
                >
                  Try Again
                </button>
              )}

              {canEdit && (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                  className="mx-6 mb-6 w-[calc(100%-3rem)] rounded-xl bg-hard px-5 py-4 text-[13px] font-extrabold uppercase tracking-widest text-white transition hover:bg-hard/80 disabled:cursor-not-allowed disabled:bg-on-surface/10 disabled:text-on-surface-variant/45"
                >
                  {submitting ? "Checking..." : "Submit Answer"}
                </button>
              )}

              {/* Inline Explanation and Navigation Section */}
              {(isReviewMode || (result && result.correct)) && (
                <div className="mx-6 mb-6 border-t border-slate-200 pt-6 flex flex-col gap-4 dark:border-[#1e3a5f]">
                  {/* Explanation box */}
                  <div className="rounded-xl border border-blue-500/30 bg-blue-50 p-6 shadow-[inset_0_0_12px_rgba(37,99,235,0.05)] dark:border-[#66b3ff]/30 dark:bg-[#0c1a2d] dark:shadow-[inset_0_0_12px_rgba(58,127,193,0.06)]">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#66b3ff] bg-[#66b3ff]/10 text-[#66b3ff]">
                        <LucideIcon name="pets" className="text-[20px]" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-[14px] tracking-wide">
                          {speakerName} Says
                        </p>
                      </div>
                    </div>

                    <p className="text-[14px] leading-relaxed text-slate-700 dark:text-[#dbeafe]">
                      {isReviewMode && data.review
                        ? data.review.explanation
                        : result?.explanation}
                    </p>

                    {/* Complexities */}
                    {(result?.timeComplexity ||
                      data?.review?.timeComplexity ||
                      result?.spaceComplexity ||
                      data?.review?.spaceComplexity) && (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {(result?.timeComplexity ||
                          data?.review?.timeComplexity) && (
                          <div className="rounded-lg border border-[#9ca3af]/20 bg-black/20 px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                              Time Complexity
                            </p>
                            <p className="mt-1 font-mono text-[13px] text-[#e5e7eb] font-semibold">
                              {result?.timeComplexity ||
                                data?.review?.timeComplexity}
                            </p>
                          </div>
                        )}
                        {(result?.spaceComplexity ||
                          data?.review?.spaceComplexity) && (
                          <div className="rounded-lg border border-[#9ca3af]/20 bg-black/20 px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                              Space Complexity
                            </p>
                            <p className="mt-1 font-mono text-[13px] text-[#e5e7eb] font-semibold">
                              {result?.spaceComplexity ||
                                data?.review?.spaceComplexity}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pet feedback */}
                    {(result?.petFeedback || data?.review?.petFeedback) && (
                      <div className="mt-3 rounded-lg border border-[#eab308]/25 bg-[#eab308]/10 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#fde047]">
                          Companion Feedback
                        </p>
                        <p className="mt-2 text-[14px] leading-relaxed text-slate-700 dark:text-[#dbeafe]">
                          {result?.petFeedback || data?.review?.petFeedback}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex flex-wrap gap-4 mt-2">
                    <button
                      onClick={goBackToRoadmap}
                      className="flex-1 min-w-[150px] rounded-xl border border-slate-200 bg-white px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-on-surface-variant hover:border-blue-500/50 hover:text-on-surface transition-colors dark:border-[#1e3a5f] dark:bg-[#0d2135] dark:hover:bg-[#152e46]"
                    >
                      Back to Roadmap
                    </button>
                    <button
                      onClick={goToNextChallenge}
                      disabled={nextChallengeLoading}
                      className="flex-1 min-w-[150px] rounded-xl bg-hard px-5 py-4 text-[13px] font-extrabold uppercase tracking-widest text-white hover:bg-hard/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {nextChallengeLoading ? "Loading..." : "Next Challenge"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <RoadmapAiHelper
        nodeId={nodeId!}
        nodeTitle={challenge.title}
        nodeStatus={data?.node.status || "available"}
        mode="hard"
        accentColor="#3a7fc1"
        accentGradient="linear-gradient(90deg, #3a7fc1, #02457A)"
        accentGlowWeak="rgba(2,69,122,0.25)"
      />

      {showSuccessModal && result?.correct && challenge && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[6px] dark:bg-[#020815]/78">
          <div className="relative w-full max-w-[480px] rounded-3xl bg-white p-5 shadow-[0_0_60px_rgba(15,23,42,0.24)] dark:bg-[#24384b] dark:shadow-[0_0_60px_rgba(0,0,0,0.45)]">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-white/8 hover:text-on-surface"
              aria-label="Close result"
            >
              <LucideIcon name="close" className="text-[22px]" />
            </button>

            <div className="rounded-xl bg-slate-50 px-8 pb-7 pt-8 shadow-[inset_0_0_48px_rgba(37,99,235,0.05)] dark:bg-[#081624] dark:shadow-[inset_0_0_48px_rgba(58,127,193,0.08)]">
              <div className="mx-auto mb-7 flex h-[88px] w-[88px] items-center justify-center rounded-full border border-[#66b3ff] bg-[#3a7fc1]/14 text-[#b8dcff] shadow-[0_0_30px_rgba(58,127,193,0.24)]">
                <LucideIcon name="workspace_premium" className="text-[46px]" />
              </div>

              <h2 className="text-center text-[28px] font-light uppercase leading-none tracking-wide text-on-surface">
                Mission
                <br />
                Accomplished
              </h2>

              <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 dark:border-on-surface/10 dark:bg-[#0d2135]/80">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#66b3ff]/25 bg-[#66b3ff]/12 text-[#66b3ff]">
                    <LucideIcon name="psychology" className="text-[24px]" />
                  </div>
                  <div>
                    <p className="text-[13px] italic leading-relaxed text-on-surface-variant">
                      “{result.message || "Correct. Nice work."}”
                    </p>
                    {result.explanation && (
                      <p className="mt-2 line-clamp-4 text-[12px] leading-relaxed text-on-surface-variant/80">
                        {result.explanation}
                      </p>
                    )}
                    <p className="mt-2 text-[12px] font-bold uppercase tracking-widest text-[#66b3ff]">
                      {speakerName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4">
                {rewardItems.map((item, index) => (
                  <div
                    key={`${item.type}-${item.label}-${index}`}
                    className="rounded-lg bg-blue-50 px-4 py-4 text-center dark:bg-[#102a36]"
                  >
                    <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">
                      {item.label}
                    </p>
                    <p className="mt-2 text-[24px] font-extrabold leading-none text-[#66b3ff]">
                      +{item.amount}
                    </p>
                    <p className="text-[18px] font-bold text-[#66b3ff] uppercase">
                      {item.type}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={goToNextChallenge}
                disabled={nextChallengeLoading}
                className="mt-7 w-full rounded-lg bg-hard px-5 py-4 text-[12px] font-extrabold uppercase tracking-[0.18em] text-white shadow-lg transition hover:bg-hard/80"
              >
                {nextChallengeLoading ? "Loading..." : "Next Challenge"}
                <span className="ml-2">→</span>
              </button>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-4 w-full text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant transition hover:text-on-surface"
              >
                Review Mission
              </button>
            </div>
          </div>
        </div>
      )}

      {xpToast !== null && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none">
          <style>{`
              @keyframes fadeInDown {
                0% { opacity: 0; transform: translate(-50%, -20px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                90% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -20px); }
              }
              .animate-xp-toast {
                animation: fadeInDown 3.5s ease-in-out forwards;
              }
            `}</style>
          <div className="animate-xp-toast bg-white/95 backdrop-blur-md border border-blue-500/40 text-blue-700 font-black px-6 py-3 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.18)] flex items-center gap-2 dark:bg-[#0f2630]/95 dark:border-[#63f1e3]/40 dark:text-[#63f1e3] dark:shadow-[0_0_30px_rgba(99,241,227,0.3)]">
            <LucideIcon name="stars" className="text-[#63f1e3]" />
            <span className="text-[16px] tracking-wider font-extrabold animate-bounce">
              +{xpToast} XP
            </span>
          </div>
        </div>
      )}
    </main>
  );
};

export default HardNodeChallengePage;
