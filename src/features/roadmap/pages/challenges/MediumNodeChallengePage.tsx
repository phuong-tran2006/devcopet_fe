import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  courseApi,
  type EasyChallengeOptionId,
  type MediumDragDropChallenge,
  type MediumNodeChallenge,
  type MediumMultipleChoiceChallenge,
  type MediumNodeChallengeResponse,
  type SubmitMediumNodeChallengeResponse,
} from "src/features/courses/api/course.api";
import RoadmapAiHelper from "src/features/roadmap/components/RoadmapAiHelper";

import { useAuthStore } from "src/features/users/store/auth.store";
import {
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Lock,
  PawPrint,
  X,
  Star,
  Brain,
} from "lucide-react";

const OPTION_ORDER: EasyChallengeOptionId[] = ["A", "B", "C", "D"];

const sortOptions = (options: MediumMultipleChoiceChallenge["options"]) =>
  [...options].sort(
    (a, b) => OPTION_ORDER.indexOf(a.id) - OPTION_ORDER.indexOf(b.id),
  );

const DROP_ZONE_REGEX =
  /\[([A-Za-z0-9_-]+)\]|{{\s*([A-Za-z0-9_-]+)\s*}}|\[\[\s*([A-Za-z0-9_-]+)\s*\]\]|__([A-Za-z0-9_-]+)__/g;

const getDropZoneKeyFromMatch = (match: RegExpMatchArray | RegExpExecArray) =>
  match[1] || match[2] || match[3] || match[4];

const getDropZoneIdAtPoint = (clientX: number, clientY: number) => {
  const zoneElement = document
    .elementsFromPoint(clientX, clientY)
    .map((element) =>
      element instanceof HTMLElement
        ? element.closest<HTMLElement>("[data-drop-zone-id]")
        : null,
    )
    .find((element): element is HTMLElement => !!element?.dataset.dropZoneId);

  return zoneElement?.dataset.dropZoneId ?? null;
};

const extractDropZoneIds = (template: string) => {
  const matches = [...template.matchAll(DROP_ZONE_REGEX)];

  return Array.from(new Set(matches.map(getDropZoneKeyFromMatch)));
};

const renderTemplateParts = (
  template: string,
  renderDropZone: (zoneId: string) => ReactNode,
) => {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(DROP_ZONE_REGEX);

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      parts.push(template.slice(lastIndex, match.index));
    }

    parts.push(renderDropZone(getDropZoneKeyFromMatch(match)));
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < template.length) {
    parts.push(template.slice(lastIndex));
  }

  return parts;
};

const CodeSnippetCard = ({
  codeSnippet,
}: {
  codeSnippet?: { language: "python"; code: string } | null;
}) => {
  if (!codeSnippet) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-[#263b44] bg-[#071217] shadow-[0_0_22px_rgba(99,241,227,0.08)]">
      <div className="border-b border-[#263b44] bg-[#0a161c] px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-[#63f1e3]">
        {codeSnippet.language}
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[15px] font-semibold leading-7 text-[#d7f7f4]">
        <code>{codeSnippet.code}</code>
      </pre>
    </div>
  );
};

const getChallengeHint = (challenge: MediumNodeChallenge | null) => {
  if (!challenge) return "";

  return (
    challenge.hint ||
    challenge.hints?.find((hint) => hint.text.trim().length > 0)?.text ||
    ""
  );
};

const FeedbackPanel = ({
  state,
  message,
  explanation,
  hint,
}: {
  state: "correct" | "incorrect";
  message: string;
  explanation: string;
  hint: string;
}) => {
  const isCorrect = state === "correct";

  return (
    <div
      className={`mx-6 mb-6 rounded-xl border px-5 py-5 shadow-[0_0_24px_rgba(99,241,227,0.08)] ${
        isCorrect
          ? "border-[#63f1e3]/35 bg-[#10262c]"
          : "border-amber-300/30 bg-[#241b12]"
      }`}
    >
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle size={22} className="mt-0.5 text-[#63f1e3]" />
        ) : (
          <AlertCircle size={22} className="mt-0.5 text-amber-200" />
        )}
        <div className="min-w-0 flex-1">
          <p
            className={`text-[11px] font-bold uppercase tracking-widest ${
              isCorrect ? "text-[#63f1e3]" : "text-amber-200"
            }`}
          >
            {isCorrect ? "Success Feedback" : "Feedback"}
          </p>
          {message && (
            <p className="mt-2 text-[15px] font-semibold leading-relaxed text-on-surface">
              {message}
            </p>
          )}
          {explanation && (
            <div className="mt-4 rounded-lg border border-white/10 bg-black/15 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Explanation
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-on-surface-variant">
                {explanation}
              </p>
            </div>
          )}
          {hint && (
            <div className="mt-3 rounded-lg border border-[#63f1e3]/25 bg-[#63f1e3]/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#63f1e3]">
                Hint
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-on-surface-variant">
                {hint}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MediumNodeChallengePage = () => {
  const { courseSlug, nodeId } = useParams({ strict: false });
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const petName = (currentUser?.petName as string) || "Axo-Script";
  const [data, setData] = useState<MediumNodeChallengeResponse | null>(null);
  const [selectedOptionId, setSelectedOptionId] =
    useState<EasyChallengeOptionId | null>(null);
  const [dropZoneMap, setDropZoneMap] = useState<Record<string, string>>({});
  const [selectedPoolItemId, setSelectedPoolItemId] = useState<string | null>(
    null,
  );
  const [draggingPoolItemId, setDraggingPoolItemId] = useState<string | null>(
    null,
  );
  const [dragOverZoneId, setDragOverZoneId] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<{
    itemId: string;
    x: number;
    y: number;
  } | null>(null);
  const [result, setResult] =
    useState<SubmitMediumNodeChallengeResponse | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nextChallengeLoading, setNextChallengeLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const challenge = data?.challenge ?? null;
  const isReviewMode = data?.node.status === "completed" && !!data.review;
  const isLockedMode = data?.node.status === "locked";
  const isMultipleChoice = challenge?.type === "multiple_choice";
  const isDragDrop = challenge?.type === "drag_drop";
  const multipleChoiceChallenge = isMultipleChoice
    ? (challenge as MediumMultipleChoiceChallenge)
    : null;
  const dragDropChallenge = isDragDrop
    ? (challenge as MediumDragDropChallenge)
    : null;
  const canEditDragDrop = !isLockedMode && !isReviewMode && !result;

  const options = useMemo(
    () => sortOptions(multipleChoiceChallenge?.options ?? []),
    [multipleChoiceChallenge],
  );

  const dropZoneIds = useMemo(
    () =>
      dragDropChallenge ? extractDropZoneIds(dragDropChallenge.template) : [],
    [dragDropChallenge],
  );

  const reviewDropZoneMap =
    data?.review && "dropZoneMap" in data.review ? data.review.dropZoneMap : {};
  const canRevealAnswerDetails = isReviewMode || result?.correct === true;
  const correctDropZoneMap =
    canRevealAnswerDetails && result?.correctDropZoneMap
      ? result.correctDropZoneMap
      : canRevealAnswerDetails &&
          data?.review &&
          "correctDropZoneMap" in data.review
        ? data.review.correctDropZoneMap
        : undefined;
  const selectedReviewOptionId =
    data?.review && "selectedOptionId" in data.review
      ? data.review.selectedOptionId
      : undefined;
  const correctOptionId =
    canRevealAnswerDetails && result?.correctOptionId
      ? result.correctOptionId
      : canRevealAnswerDetails &&
          data?.review &&
          "correctOptionId" in data.review
        ? data.review.correctOptionId
        : undefined;

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
    setDropZoneMap({});
    setSelectedPoolItemId(null);
    setDraggingPoolItemId(null);
    setDragOverZoneId(null);
    setDragPreview(null);
    setResult(null);
    setShowSuccessModal(false);
    setNextChallengeLoading(false);

    Promise.all([
      courseApi.getMediumNodeChallenge(nodeId),
      courseSlug
        ? courseApi.getMediumRoadmap(courseSlug)
        : Promise.resolve(null),
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
          if ("selectedOptionId" in response.review) {
            setSelectedOptionId(response.review.selectedOptionId ?? null);
          }
          if ("dropZoneMap" in response.review) {
            setDropZoneMap(response.review.dropZoneMap ?? {});
          }
        }
        document.title = `${response.node.label} Medium Challenge | Devcopet`;
      })
      .catch((err) => {
        if (!alive) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load this Medium challenge.",
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
    navigate({
      to: "/roadmap/$worldId",
      params: { worldId: courseSlug || "python-basic" },
    });
  };

  const goToNextChallenge = async () => {
    if (!courseSlug || !nodeId || nextChallengeLoading) return;

    setNextChallengeLoading(true);
    try {
      const roadmap = await courseApi.getMediumRoadmap(courseSlug);
      const nodes = [...roadmap.chapters]
        .sort((a, b) => a.order - b.order)
        .flatMap((chapter) =>
          [...chapter.nodes].sort((a, b) => a.order - b.order),
        );
      const currentIndex = nodes.findIndex((node) => node.id === nodeId);
      const nextNode = currentIndex >= 0 ? nodes[currentIndex + 1] : null;

      if (!nextNode) {
        goBackToRoadmap();
        return;
      }

      navigate({
        to: "/roadmap/$courseSlug/medium/nodes/$nodeId/challenge",
        params: {
          courseSlug,
          nodeId: nextNode.id,
        },
      });
    } catch (err) {
      console.error("Unable to open next Medium challenge:", err);
      goBackToRoadmap();
    } finally {
      setNextChallengeLoading(false);
    }
  };

  const submitChallenge = () => {
    if (!nodeId || !challenge || submitting || result || isReviewMode) return;

    setSubmitting(true);
    setSubmitError(null);

    const requiredDropZoneMap = dropZoneIds.reduce<Record<string, string>>(
      (acc, zoneId) => {
        if (dropZoneMap[zoneId]) {
          acc[zoneId] = dropZoneMap[zoneId];
        }
        return acc;
      },
      {},
    );

    const payload = isMultipleChoice
      ? selectedOptionId
        ? { type: "multiple_choice" as const, selectedOptionId }
        : null
      : { type: "drag_drop" as const, dropZoneMap: requiredDropZoneMap };

    if (!payload) {
      setSubmitting(false);
      return;
    }

    courseApi
      .submitMediumNodeChallenge(nodeId, payload)
      .then((response) => {
        setResult(response);
        setShowSuccessModal(response.correct);
      })
      .catch((err) => {
        setSubmitError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to submit this challenge.",
        );
      })
      .finally(() => setSubmitting(false));
  };

  const assignPoolItemToZone = (zoneId: string, itemId: string) => {
    if (!canEditDragDrop) return;

    setDropZoneMap((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(
          ([, mappedItemId]) => mappedItemId !== itemId,
        ),
      );

      return {
        ...next,
        [zoneId]: itemId,
      };
    });
  };

  const assignSelectedPoolItem = (zoneId: string) => {
    if (!selectedPoolItemId) return;

    assignPoolItemToZone(zoneId, selectedPoolItemId);
    setSelectedPoolItemId(null);
  };

  const startPointerPoolItemDrag = (
    event: PointerEvent<HTMLDivElement>,
    itemId: string,
  ) => {
    if (!canEditDragDrop) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingPoolItemId(itemId);
    setSelectedPoolItemId(itemId);
    setDragPreview({ itemId, x: event.clientX, y: event.clientY });
    setDragOverZoneId(getDropZoneIdAtPoint(event.clientX, event.clientY));
  };

  const movePointerPoolItemDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!canEditDragDrop || !draggingPoolItemId) return;

    setDragPreview({
      itemId: draggingPoolItemId,
      x: event.clientX,
      y: event.clientY,
    });
    setDragOverZoneId(getDropZoneIdAtPoint(event.clientX, event.clientY));
  };

  const finishPointerPoolItemDrag = (
    event: PointerEvent<HTMLDivElement>,
    itemId: string,
  ) => {
    if (!canEditDragDrop) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const zoneId = getDropZoneIdAtPoint(event.clientX, event.clientY);

    if (zoneId) {
      assignPoolItemToZone(zoneId, itemId);
      setSelectedPoolItemId(null);
    } else {
      setSelectedPoolItemId(itemId);
    }

    setDraggingPoolItemId(null);
    setDragOverZoneId(null);
    setDragPreview(null);
  };

  const cancelPointerPoolItemDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDraggingPoolItemId(null);
    setDragOverZoneId(null);
    setDragPreview(null);
  };

  const selectPoolItemWithKeyboard = (
    event: KeyboardEvent<HTMLDivElement>,
    itemId: string,
  ) => {
    if (!canEditDragDrop || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    setSelectedPoolItemId(itemId);
  };

  const resetDragDropAnswers = () => {
    if (!canEditDragDrop) return;

    setDropZoneMap({});
    setSelectedPoolItemId(null);
    setDraggingPoolItemId(null);
    setDragOverZoneId(null);
    setDragPreview(null);
    setSubmitError(null);
  };

  const handleTryAgain = () => {
    if (isReviewMode || isLockedMode || !result || result.correct) return;

    setSelectedOptionId(null);
    setSelectedPoolItemId(null);
    setDraggingPoolItemId(null);
    setDragOverZoneId(null);
    setDragPreview(null);
    setDropZoneMap({});
    setResult(null);
    setShowSuccessModal(false);
    setSubmitError(null);
  };

  const getPoolItemText = (itemId?: string) =>
    dragDropChallenge?.poolItems.find((item) => item.id === itemId)?.text ??
    itemId ??
    "";

  const getOptionClass = (optionId: EasyChallengeOptionId) => {
    const isSelected = selectedOptionId === optionId;
    const isCorrect = correctOptionId === optionId;
    const isWrong =
      (result || isReviewMode) &&
      (selectedReviewOptionId ?? selectedOptionId) === optionId &&
      !isCorrect;

    if (isCorrect) {
      return "border-[#63f1e3] bg-[#172d31] text-[#63f1e3]";
    }
    if (isWrong) {
      return "border-[#ef4444] bg-[#2b171a] text-red-100";
    }
    if (isSelected) {
      return "border-[#63f1e3] bg-[#13282d] text-on-surface";
    }
    return "border-[#1c2b33] bg-[#10191f] text-on-surface-variant hover:border-[#63f1e3]/35 hover:text-on-surface";
  };

  const isDropZoneCorrect = (zoneId: string) => {
    if (!correctDropZoneMap) return false;
    const selectedMap = isReviewMode ? reviewDropZoneMap : dropZoneMap;
    return selectedMap?.[zoneId] === correctDropZoneMap[zoneId];
  };

  const isDropZoneWrong = (zoneId: string) => {
    if (result && !result.correct && !isReviewMode) {
      return !!dropZoneMap[zoneId];
    }
    if (!correctDropZoneMap) return false;
    const selectedMap = isReviewMode ? reviewDropZoneMap : dropZoneMap;
    return (
      !!selectedMap?.[zoneId] &&
      selectedMap[zoneId] !== correctDropZoneMap[zoneId]
    );
  };

  const canSubmit =
    !isLockedMode &&
    !isReviewMode &&
    !result &&
    (isMultipleChoice
      ? !!selectedOptionId
      : dropZoneIds.length > 0 &&
        dropZoneIds.every((zoneId) => !!dropZoneMap[zoneId]));
  const feedbackState = result
    ? result.correct
      ? "correct"
      : "incorrect"
    : data?.review
      ? data.review.correct
        ? "correct"
        : "incorrect"
      : null;
  const feedbackMessage =
    result?.message ||
    (data?.review
      ? data.review.correct
        ? "Challenge completed."
        : "Review your previous attempt."
      : "");
  const shouldShowLearningDetails = result?.correct === true || isReviewMode;
  const feedbackExplanation = shouldShowLearningDetails
    ? result?.explanation ||
      data?.review?.explanation ||
      challenge?.explanation ||
      ""
    : "";
  const feedbackHint = shouldShowLearningDetails
    ? getChallengeHint(challenge)
    : "";

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#071217] text-on-surface flex flex-col justify-start items-center py-10 px-4">
      {loading && (
        <div className="flex min-h-[520px] items-center justify-center">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#63f1e3]/45 border-t-transparent" />
        </div>
      )}

      {!loading && error && (
        <div className="mx-auto mt-16 max-w-[560px] rounded-2xl border border-red-400/20 bg-red-400/10 px-6 py-8 text-center">
          <h1 className="text-[24px] font-extrabold">
            Challenge could not load
          </h1>
          <p className="mt-2 text-on-surface-variant">{error}</p>
        </div>
      )}

      {!loading && !error && data && challenge && (
        <div className="w-full max-w-[800px] flex flex-col">
          {/* Back navigation */}
          <div className="flex justify-between items-center mb-6 w-full">
            <button
              onClick={goBackToRoadmap}
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-[13px] font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={16} />
              Back to Roadmap
            </button>

            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#63f1e3]">
              <span>Medium Checkpoint</span>
            </div>
          </div>

          <section className="w-full flex flex-col">
            <div className="mb-6 flex flex-col gap-2">
              <p className="text-[14px] text-on-surface-variant font-medium">
                {data.node.label} • {data.node.title}
              </p>
            </div>

            {isLockedMode && (
              <div className="mx-auto mt-12 w-full rounded-xl border border-[#263b44] bg-[#111c23] p-8 text-center shadow-[0_0_28px_rgba(99,241,227,0.08)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-on-surface/10 bg-on-surface/5 text-on-surface-variant">
                  <Lock size={32} />
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
                  className="mt-7 rounded-xl border border-[#263b44] bg-[#10191f] px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-on-surface-variant transition hover:text-on-surface"
                >
                  Back to Roadmap
                </button>
              </div>
            )}

            {!isLockedMode && (
              <div className="overflow-hidden rounded-xl border border-[#263b44] bg-[#111c23] shadow-[0_0_28px_rgba(99,241,227,0.08)]">
                <div className="border-b border-[#263b44] bg-[#0c171d] px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#63f1e3]">
                        Question 01
                      </p>
                      <h2 className="mt-1 truncate text-[18px] font-extrabold text-on-surface">
                        {challenge.title}
                      </h2>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      <span>
                        {challenge.type === "drag_drop"
                          ? "Drag Drop"
                          : "Multiple Choice"}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#63f1e3]/70" />
                      <span>{challenge.xp} XP</span>
                      <span className="h-1 w-1 rounded-full bg-[#63f1e3]/70" />
                      <span>{challenge.estimatedMinutes} min</span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-[#263b44] px-6 py-7">
                  <p className="text-[26px] font-extrabold leading-tight text-on-surface md:text-[32px]">
                    {challenge.question}
                  </p>
                  <div className="mt-5">
                    <CodeSnippetCard codeSnippet={challenge.codeSnippet} />
                  </div>
                </div>

                {multipleChoiceChallenge && (
                  <div className="flex flex-col gap-3 p-6">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        disabled={isReviewMode || !!result}
                        onClick={() => setSelectedOptionId(option.id)}
                        className={`flex min-h-[68px] items-center justify-between rounded-lg border px-5 text-left transition duration-200 ${getOptionClass(option.id)}`}
                      >
                        <span className="text-[15px] font-semibold">
                          {option.id}) {option.text}
                        </span>
                        {correctOptionId === option.id && (
                          <CheckCircle size={18} />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {dragDropChallenge && (
                  <div className="grid gap-5 p-6 lg:grid-cols-[1fr_260px]">
                    <div className="rounded-xl border border-[#263b44] bg-[#0b151b] p-5">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-[#63f1e3]">
                            Template
                          </p>
                          <p className="mt-1 text-[12px] text-on-surface-variant">
                            Drag a pool item into a drop zone, or click an item
                            then click a drop zone.
                          </p>
                        </div>
                        {canEditDragDrop && (
                          <button
                            type="button"
                            onClick={resetDragDropAnswers}
                            className="rounded-lg border border-[#263b44] px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition hover:border-[#63f1e3]/45 hover:text-[#63f1e3]"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <div className="whitespace-pre-wrap rounded-xl border border-[#1f333c] bg-[#071217] p-4 font-mono text-[15px] leading-10 text-on-surface">
                        {renderTemplateParts(
                          dragDropChallenge.template,
                          (zoneId) => {
                            const selectedMap = isReviewMode
                              ? reviewDropZoneMap
                              : dropZoneMap;
                            const selectedItemId = selectedMap?.[zoneId];
                            const correctItemId = correctDropZoneMap?.[zoneId];
                            const correct = isDropZoneCorrect(zoneId);
                            const wrong = isDropZoneWrong(zoneId);
                            const canAssign =
                              canEditDragDrop &&
                              (!!selectedPoolItemId || !!draggingPoolItemId);
                            const isDragTarget = dragOverZoneId === zoneId;
                            const isDraggingAnyItem =
                              canEditDragDrop && !!draggingPoolItemId;

                            return (
                              <button
                                key={zoneId}
                                data-drop-zone-id={zoneId}
                                type="button"
                                onClick={() => assignSelectedPoolItem(zoneId)}
                                disabled={!canEditDragDrop}
                                className={`mx-1 inline-flex min-h-[46px] w-[156px] items-center justify-center rounded-lg border px-3 py-2 align-middle font-sans text-[13px] font-bold transition disabled:cursor-default ${
                                  correct
                                    ? "border-[#63f1e3] bg-[#63f1e3]/15 text-[#63f1e3]"
                                    : wrong
                                      ? "border-[#ef4444] bg-[#ef4444]/12 text-red-100"
                                      : isDragTarget
                                        ? "border-[#63f1e3] bg-[#63f1e3]/20 text-[#63f1e3] shadow-[0_0_24px_rgba(99,241,227,0.28)]"
                                        : selectedItemId
                                          ? "border-blue-400 bg-blue-500/15 text-blue-100 shadow-[0_0_16px_rgba(59,130,246,0.16)]"
                                          : isDraggingAnyItem
                                            ? "border-[#63f1e3]/75 bg-[#63f1e3]/10 text-[#63f1e3] shadow-[0_0_18px_rgba(99,241,227,0.18)]"
                                            : canAssign
                                              ? "border-gray-400 bg-gray-500/15 text-gray-200 shadow-[0_0_14px_rgba(148,163,184,0.14)]"
                                              : "border-dashed border-gray-500/70 bg-gray-500/10 text-gray-300"
                                }`}
                              >
                                <span className="flex flex-col items-center leading-tight">
                                  <span>
                                    {selectedItemId
                                      ? getPoolItemText(selectedItemId)
                                      : zoneId}
                                  </span>
                                  {wrong && correctItemId && (
                                    <span className="mt-1 text-[10px] font-semibold text-[#63f1e3]">
                                      Correct: {getPoolItemText(correctItemId)}
                                    </span>
                                  )}
                                </span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#263b44] bg-[#0b151b] p-5">
                      <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#63f1e3]">
                        Pool Items
                      </p>
                      {selectedPoolItemId && canEditDragDrop && (
                        <p className="mb-3 rounded-lg border border-[#63f1e3]/25 bg-[#63f1e3]/10 px-3 py-2 text-[12px] font-semibold text-[#63f1e3]">
                          Selected: {getPoolItemText(selectedPoolItemId)}
                        </p>
                      )}
                      <div className="flex flex-col gap-3">
                        {dragDropChallenge.poolItems.map((item) => {
                          const used = Object.values(dropZoneMap).includes(
                            item.id,
                          );
                          return (
                            <div
                              key={item.id}
                              role="button"
                              tabIndex={canEditDragDrop ? 0 : -1}
                              aria-disabled={!canEditDragDrop}
                              onPointerDown={(event) =>
                                startPointerPoolItemDrag(event, item.id)
                              }
                              onPointerMove={movePointerPoolItemDrag}
                              onPointerUp={(event) =>
                                finishPointerPoolItemDrag(event, item.id)
                              }
                              onPointerCancel={cancelPointerPoolItemDrag}
                              onKeyDown={(event) =>
                                selectPoolItemWithKeyboard(event, item.id)
                              }
                              className={`flex min-h-[56px] touch-none select-none items-center rounded-lg border px-4 py-3 text-left text-[14px] font-bold transition ${
                                draggingPoolItemId === item.id
                                  ? "cursor-grabbing border-[#63f1e3] bg-[#63f1e3]/12 text-[#63f1e3] opacity-45"
                                  : selectedPoolItemId === item.id
                                    ? "cursor-grab border-[#63f1e3] bg-[#63f1e3]/12 text-[#63f1e3]"
                                    : used
                                      ? "cursor-grab border-[#263b44] bg-[#10191f] text-on-surface-variant/55"
                                      : "cursor-grab border-[#263b44] bg-[#10191f] text-on-surface-variant hover:text-on-surface"
                              }`}
                            >
                              {item.text}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {submitError && (
                  <p className="mx-6 mb-6 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-[13px] text-red-100/80">
                    {submitError}
                  </p>
                )}

                {result && !result.correct && (
                  <div className="mx-6 mb-6 rounded-lg border border-red-400/25 bg-red-400/10 px-4 py-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-red-300" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-red-100 text-[14px]">
                          {result.message || "Not quite. Try again."}
                        </p>
                        {result.explanation && (
                          <p className="mt-1 text-[13px] leading-relaxed text-red-100/70">
                            {result.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {result &&
                  !result.correct &&
                  !isReviewMode &&
                  !isLockedMode && (
                    <button
                      onClick={handleTryAgain}
                      className="mx-6 mb-6 w-[calc(100%-3rem)] rounded-xl border border-[#63f1e3]/45 bg-[#63f1e3]/10 px-5 py-4 text-[13px] font-extrabold uppercase tracking-widest text-[#63f1e3] transition hover:bg-[#63f1e3]/15"
                    >
                      Try Again
                    </button>
                  )}

                {!isReviewMode && !result && !isLockedMode && (
                  <button
                    onClick={submitChallenge}
                    disabled={!canSubmit || submitting}
                    className="mx-6 mb-6 w-[calc(100%-3rem)] rounded-xl bg-[#63f1e3] px-5 py-4 text-[13px] font-extrabold uppercase tracking-widest text-[#052023] transition hover:bg-[#86fff4] disabled:cursor-not-allowed disabled:bg-on-surface/10 disabled:text-on-surface-variant/45"
                  >
                    {submitting ? "Submitting..." : "Submit Answer"}
                  </button>
                )}

                {/* Inline Explanation and Navigation Section */}
                {(isReviewMode || (result && result.correct)) && (
                  <div className="mx-6 mb-6 border-t border-[#263b44] pt-6 flex flex-col gap-4">
                    {/* Explanation box */}
                    <div className="rounded-xl border border-[#63f1e3]/30 bg-[#10262c] p-6 shadow-[inset_0_0_12px_rgba(99,241,227,0.06)]">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#63f1e3] bg-[#63f1e3]/10 text-[#63f1e3]">
                          <PawPrint size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-[14px] tracking-wide">
                            {petName} Companion Says
                          </p>
                        </div>
                      </div>

                      <p className="text-[14px] leading-relaxed text-on-surface-variant">
                        {isReviewMode && data.review
                          ? data.review.explanation
                          : result?.explanation}
                      </p>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex flex-wrap gap-4 mt-2">
                      <button
                        onClick={goBackToRoadmap}
                        className="flex-1 min-w-[150px] rounded-xl border border-[#263b44] bg-[#1a2b36] px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface hover:bg-[#203442] transition-colors"
                      >
                        Back to Roadmap
                      </button>
                      <button
                        onClick={goToNextChallenge}
                        disabled={nextChallengeLoading}
                        className="flex-1 min-w-[150px] rounded-xl bg-[#63f1e3] px-5 py-4 text-[13px] font-extrabold uppercase tracking-widest text-[#052023] hover:bg-[#86fff4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {nextChallengeLoading ? "Loading..." : "Next Challenge"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {showSuccessModal && result?.correct && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#020815]/78 px-4 backdrop-blur-[6px]">
              <div className="relative w-full max-w-[480px] rounded-3xl bg-[#2a3947] p-5 shadow-[0_0_60px_rgba(0,0,0,0.45)]">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-white/8 hover:text-on-surface"
                  aria-label="Close result"
                >
                  <X size={22} />
                </button>

                <div className="rounded-xl bg-[#0f2630] px-8 pb-7 pt-8 shadow-[inset_0_0_48px_rgba(99,241,227,0.06)]">
                  <div className="mx-auto mb-7 flex h-[88px] w-[88px] items-center justify-center rounded-full border border-[#00c7bd] bg-[#00c7bd]/10 text-[#9afff7] shadow-[0_0_30px_rgba(0,199,189,0.2)]">
                    <Star size={46} />
                  </div>

                  <h2 className="text-center text-[28px] font-light uppercase leading-none tracking-wide text-on-surface">
                    Mission
                    <br />
                    Accomplished
                  </h2>

                  <div className="mt-6 rounded-lg border border-on-surface/10 bg-[#1b3440]/70 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#63f1e3]/25 bg-[#63f1e3]/12 text-[#63f1e3]">
                        <Brain size={24} />
                      </div>
                      <div>
                        <p className="text-[13px] italic leading-relaxed text-on-surface-variant">
                          “{result.message || "Correct. Nice work."}”
                        </p>
                        {result.explanation && (
                          <p className="mt-2 text-[12px] leading-relaxed text-on-surface-variant/80">
                            {result.explanation}
                          </p>
                        )}
                        <p className="mt-2 text-[12px] font-bold uppercase tracking-widest text-[#63f1e3]">
                          {petName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-[#243932] px-4 py-4 text-center">
                      <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">
                        Reward
                      </p>
                      <p className="mt-2 text-[24px] font-extrabold leading-none text-[#63f1e3]">
                        +{challenge.xp}
                      </p>
                      <p className="text-[18px] font-bold text-[#63f1e3]">XP</p>
                    </div>
                    <div className="rounded-lg bg-[#2e3330] px-4 py-4 text-center">
                      <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">
                        Bonus
                      </p>
                      <p className="mt-2 text-[24px] font-extrabold leading-none text-[#f5c6ff]">
                        +10
                      </p>
                      <p className="text-[18px] font-bold text-[#f5c6ff]">
                        Stars
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={goToNextChallenge}
                    disabled={nextChallengeLoading}
                    className="mt-7 w-full rounded-lg bg-[#63f1e3] px-5 py-4 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#052023] shadow-[0_10px_28px_rgba(99,241,227,0.24)] transition hover:bg-[#86fff4] disabled:cursor-wait disabled:opacity-70"
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

          {dragPreview && canEditDragDrop && (
            <div
              className="pointer-events-none fixed z-[140] flex min-h-[56px] w-[220px] -translate-x-1/2 -translate-y-1/2 items-center rounded-lg border border-[#63f1e3] bg-[#123139] px-4 py-3 text-left text-[14px] font-extrabold text-[#bffff9] shadow-[0_0_28px_rgba(99,241,227,0.28)]"
              style={{
                left: dragPreview.x,
                top: dragPreview.y,
              }}
            >
              {getPoolItemText(dragPreview.itemId)}
            </div>
          )}
        </div>
      )}

      {data && (
        <RoadmapAiHelper
          nodeId={nodeId ?? null}
          nodeTitle={data.node.title}
          nodeStatus={data.node.status}
          mode="medium"
          accentColor="#63f1e3"
          accentGradient="linear-gradient(to right, #00a99d, #223746)"
          accentGlowWeak="rgba(99,241,227,0.2)"
        />
      )}
    </main>
  );
};

export default MediumNodeChallengePage;
