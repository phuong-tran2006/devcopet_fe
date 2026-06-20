import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import {
  courseApi,
  type HardNodeChallengeResponse,
  type SubmitHardNodeChallengeResponse,
  type HardMultipleChoiceChallenge,
  type HardDragDropChallenge,
  type HardOrderingChallenge,
  type HardFillTemplateChallenge,
} from "../api/course.api";
import RoadmapAiHelper from "../components/RoadmapAiHelper";

// ── Template drop-zone helpers (same pattern as MediumNodeChallengePage) ──────
const DROP_ZONE_REGEX =
  /\[(DROP_ZONE_\d+)\]|{{\s*([A-Za-z0-9_-]+)\s*}}|\[\[\s*([A-Za-z0-9_-]+)\s*\]\]|__([A-Za-z0-9_-]+)__/g;

const getDropZoneKeyFromMatch = (match: RegExpMatchArray | RegExpExecArray) =>
  match[1] || match[2] || match[3] || match[4];

const extractDropZoneIds = (template: string): string[] => {
  const matches = [...template.matchAll(DROP_ZONE_REGEX)];
  return Array.from(new Set(matches.map(getDropZoneKeyFromMatch)));
};

const renderTemplateParts = (
  template: string,
  renderDropZone: (zoneId: string) => ReactNode,
): ReactNode[] => {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(DROP_ZONE_REGEX);
  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex)
      parts.push(template.slice(lastIndex, match.index));
    parts.push(renderDropZone(getDropZoneKeyFromMatch(match)));
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < template.length) parts.push(template.slice(lastIndex));
  return parts;
};
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
    <div className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#0a1626] shadow-[0_0_22px_rgba(58,127,193,0.15)]">
      <div className="border-b border-[#1e3a5f] bg-[#0c1a2d] px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-[#66b3ff]">
        {codeSnippet.language}
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[14px] font-semibold leading-7 text-[#dbeafe]">
        <code>{codeSnippet.code}</code>
      </pre>
    </div>
  );
};

const FeedbackPanel = ({
  state,
  message,
  explanation,
  hint,
  timeComplexity,
  spaceComplexity,
  petFeedback,
}: {
  state: "correct" | "incorrect";
  message: string;
  explanation?: string;
  hint?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  petFeedback?: string;
}) => {
  const isCorrect = state === "correct";

  return (
    <div
      className={`mx-6 mb-6 rounded-xl border px-5 py-5 shadow-[0_0_24px_rgba(58,127,193,0.12)] ${
        isCorrect
          ? "border-[#3a7fc1]/50 bg-[#0d1f33]"
          : "border-red-400/30 bg-[#2b1212]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`material-symbols-outlined mt-0.5 text-[22px] ${
            isCorrect ? "text-[#66b3ff]" : "text-red-300"
          }`}
        >
          {isCorrect ? "check_circle" : "error"}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={`text-[11px] font-bold uppercase tracking-widest ${
              isCorrect ? "text-[#66b3ff]" : "text-red-300"
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
            <div className="mt-4 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Explanation
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-on-surface-variant">
                {explanation}
              </p>
            </div>
          )}
          {petFeedback && (
            <div className="mt-3 rounded-lg border border-[#eab308]/25 bg-[#eab308]/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#fde047]">
                Pet Companion Says
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-on-surface-variant">
                {petFeedback}
              </p>
            </div>
          )}
          {(timeComplexity || spaceComplexity) && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {timeComplexity && (
                <div className="rounded-lg border border-[#9ca3af]/20 bg-black/20 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Time Complexity
                  </p>
                  <p className="mt-1 font-mono text-[13px] text-[#e5e7eb] font-semibold">
                    {timeComplexity}
                  </p>
                </div>
              )}
              {spaceComplexity && (
                <div className="rounded-lg border border-[#9ca3af]/20 bg-black/20 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Space Complexity
                  </p>
                  <p className="mt-1 font-mono text-[13px] text-[#e5e7eb] font-semibold">
                    {spaceComplexity}
                  </p>
                </div>
              )}
            </div>
          )}
          {hint && (
            <div className="mt-3 rounded-lg border border-[#66b3ff]/25 bg-[#66b3ff]/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#66b3ff]">
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

const HardNodeChallengePage = () => {
  const { courseSlug, nodeId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [data, setData] = useState<HardNodeChallengeResponse | null>(null);

  // States
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const [matchingMap, setMatchingMap] = useState<Record<string, string>>({});
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  // drag_drop (fill-template) state
  const [dropZoneMap, setDropZoneMap] = useState<Record<string, string>>({});
  const [selectedPoolItemId, setSelectedPoolItemId] = useState<string | null>(null);

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

  const challenge = data?.challenge ?? null;
  const isReviewMode = data?.node.status === "completed" && !!data.review;
  const isLockedMode = data?.node.status === "locked";
  const canEdit = !isLockedMode && !isReviewMode && !result;

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

  const correctOptionId =
    (canRevealAnswerDetails &&
      (result?.correctOptionId || data?.review?.correctOptionId)) ||
    undefined;
  const correctMatchingMap =
    (canRevealAnswerDetails &&
      (result?.correctMatchingMap || data?.review?.correctMatchingMap)) ||
    undefined;
  const correctOrderedIds =
    (canRevealAnswerDetails &&
      (result?.correctOrderedIds || data?.review?.correctOrderedIds)) ||
    undefined;
  const correctDropZoneMap =
    (canRevealAnswerDetails &&
      (result?.correctDropZoneMap || data?.review?.correctDropZoneMap)) ||
    undefined;

  const dropZoneIds = useMemo(
    () => (hardFillChallenge ? extractDropZoneIds(hardFillChallenge.template) : []),
    [hardFillChallenge],
  );

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
              (response.challenge as HardOrderingChallenge).steps.map(
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

  const handleSubmit = async () => {
    if (!challenge || !canEdit) return;
    setSubmitting(true);
    setSubmitError(null);

    let payload: any = {};
    if (isOptionBased) {
      if (!selectedOptionId) {
        setSubmitting(false);
        return;
      }
      payload = { type: challenge.type, selectedOptionId };
    } else if (isDragDropMatching) {
      if (Object.keys(matchingMap).length === 0) {
        setSubmitting(false);
        return;
      }
      payload = { type: challenge.type, matchingMap };
    } else if (isHardDragDrop) {
      const filledMap = dropZoneIds.reduce<Record<string, string>>(
        (acc, zoneId) => {
          if (dropZoneMap[zoneId]) acc[zoneId] = dropZoneMap[zoneId];
          return acc;
        },
        {},
      );
      payload = { type: "drag_drop", dropZoneMap: filledMap };
    } else if (isOrdering) {
      payload = { type: challenge.type, orderedIds };
    }

    try {
      const res = await courseApi.submitHardNodeChallenge(nodeId!, payload);
      setResult(res);
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
    (isHardDragDrop && dropZoneIds.length > 0 && Object.keys(dropZoneMap).length < dropZoneIds.length);

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
    <div className="min-h-screen bg-background text-on-surface pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-on-surface/8 bg-surface/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              navigate({
                to: "/roadmap/$worldId",
                params: { worldId: courseSlug! },
              })
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border border-on-surface/10 bg-on-surface/5 text-on-surface transition-colors hover:bg-on-surface/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#66b3ff]">
              Hard Challenge {data?.node.label}
            </p>
            <h1 className="text-[18px] font-bold">{challenge.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {challenge.xp && (
            <div className="flex items-center gap-1.5 rounded-full border border-[#FFE052]/20 bg-[#FFE052]/10 px-3 py-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#FFE052]">
                bolt
              </span>
              <span className="text-[12px] font-bold text-[#FFE052]">
                {challenge.xp} XP
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-[800px] px-6">
        <div className="mb-8 rounded-2xl border border-on-surface/10 bg-surface-container px-6 py-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3a7fc1]/20 text-[#66b3ff]">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <h2 className="text-[20px] font-extrabold text-on-surface leading-tight">
              {challenge.question}
            </h2>
          </div>

          {challenge.codeSnippet && (
            <div className="mb-8">
              <CodeSnippetCard codeSnippet={challenge.codeSnippet} />
            </div>
          )}

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
                      <span className="material-symbols-outlined text-[#63f1e3]">
                        check_circle
                      </span>
                    )}
                    {isIncorrect && (
                      <span className="material-symbols-outlined text-red-400">
                        cancel
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {isDragDropMatching && dragDropChallenge && (
            <div className="flex flex-col gap-6">
              <p className="text-[13px] text-on-surface-variant font-medium">
                Select an item on the left, then a choice on the right to match
                them.
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
                          setSelectedMatchItem(isSelected ? null : item.id)
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
                    const matchedItemId = Object.keys(activeMatchingMap).find(
                      (k) => activeMatchingMap[k] === choice.id,
                    );
                    const matchedItem = dragDropChallenge.items.find(
                      (i) => i.id === matchedItemId,
                    );
                    const isCorrectMatch =
                      canRevealAnswerDetails &&
                      correctMatchingMap?.[matchedItemId || ""] === choice.id;
                    const isIncorrectMatch =
                      canRevealAnswerDetails &&
                      matchedItemId &&
                      !isCorrectMatch;

                    return (
                      <div key={choice.id} className="flex items-center gap-3">
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
                                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant hover:text-red-400">
                                    close
                                  </span>
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
            <div className="flex flex-col gap-5">
              {/* Template area */}
              <div className="rounded-xl border border-[#1e3a5f] bg-[#0a1626] px-5 py-5 font-mono text-[14px] leading-8 text-[#dbeafe] whitespace-pre-wrap">
                {renderTemplateParts(hardFillChallenge.template, (zoneId) => {
                  const assignedItemId = activeDropZoneMap[zoneId];
                  const assignedItem = hardFillChallenge.poolItems.find(
                    (p) => p.id === assignedItemId,
                  );
                  const correctItemId = correctDropZoneMap?.[zoneId];
                  const correctItem = hardFillChallenge.poolItems.find(
                    (p) => p.id === correctItemId,
                  );
                  const isCorrect = canRevealAnswerDetails && assignedItemId === correctItemId && !!correctItemId;
                  const isIncorrect = canRevealAnswerDetails && !!assignedItemId && assignedItemId !== correctItemId;
                  const isActive = !assignedItemId && selectedPoolItemId !== null;

                  return (
                    <button
                      key={zoneId}
                      onClick={() => {
                        if (!canEdit) return;
                        if (assignedItemId) {
                          // click on filled zone → remove assignment
                          setDropZoneMap((prev) => {
                            const next = { ...prev };
                            delete next[zoneId];
                            return next;
                          });
                        } else if (selectedPoolItemId) {
                          // assign selected pool item to this zone
                          setDropZoneMap((prev) => {
                            // remove previous zone using same item
                            const cleaned = Object.fromEntries(
                              Object.entries(prev).filter(
                                ([, v]) => v !== selectedPoolItemId,
                              ),
                            );
                            return { ...cleaned, [zoneId]: selectedPoolItemId };
                          });
                          setSelectedPoolItemId(null);
                        }
                      }}
                      className={[
                        "inline-flex items-center justify-center rounded-lg border-2 px-3 py-0.5 mx-1 text-[13px] font-bold transition-all duration-150 min-w-[80px]",
                        isCorrect
                          ? "border-[#63f1e3] bg-[#10262c] text-[#63f1e3] shadow-[0_0_10px_rgba(99,241,227,0.3)]"
                          : isIncorrect
                            ? "border-red-400 bg-red-400/10 text-red-300"
                            : assignedItemId
                              ? "border-[#66b3ff] bg-[#1e3a5f] text-[#dbeafe]"
                              : isActive
                                ? "border-dashed border-[#3a7fc1] bg-[#3a7fc1]/10 text-[#66b3ff] animate-pulse"
                                : "border-dashed border-on-surface/20 bg-transparent text-on-surface-variant",
                      ].join(" ")}
                    >
                      {assignedItem ? assignedItem.text : <span className="opacity-40 text-[11px]">drop here</span>}
                      {isCorrect && <span className="ml-1 material-symbols-outlined text-[14px]">check</span>}
                      {isIncorrect && (
                        <span className="ml-1 material-symbols-outlined text-[14px]">close</span>
                      )}
                      {isIncorrect && correctItem && (
                        <span className="ml-1 text-[11px] text-[#63f1e3]">→ {correctItem.text}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pool */}
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Available Items — click an item, then click a drop zone
                </p>
                <div className="flex flex-wrap gap-2">
                  {hardFillChallenge.poolItems.map((item) => {
                    const isUsed = Object.values(activeDropZoneMap).includes(item.id);
                    const isSelected = selectedPoolItemId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (!canEdit) return;
                          setSelectedPoolItemId(isSelected ? null : item.id);
                        }}
                        disabled={!canEdit || isUsed}
                        className={[
                          "rounded-lg border px-4 py-2 text-[13px] font-semibold transition-all duration-150",
                          isUsed
                            ? "opacity-30 cursor-not-allowed border-on-surface/10 bg-surface-container text-on-surface-variant"
                            : isSelected
                              ? "border-[#3a7fc1] bg-[#3a7fc1]/20 text-[#66b3ff] shadow-[0_0_12px_rgba(58,127,193,0.35)] ring-2 ring-[#3a7fc1]/50"
                              : "border-on-surface/15 bg-surface-container hover:border-[#3a7fc1]/50 hover:text-on-surface text-on-surface-variant",
                        ].join(" ")}
                      >
                        {item.text}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset zone button */}
              {canEdit && Object.keys(dropZoneMap).length > 0 && (
                <button
                  onClick={() => {
                    setDropZoneMap({});
                    setSelectedPoolItemId(null);
                  }}
                  className="self-start rounded-lg border border-on-surface/10 bg-transparent px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:border-red-400/30 hover:text-red-300"
                >
                  Reset All
                </button>
              )}
            </div>
          )}

          {isOrdering && orderingChallenge && (
            <div className="flex flex-col gap-3">
              <p className="text-[13px] text-on-surface-variant font-medium mb-2">
                Use the arrows to reorder the steps correctly.
              </p>
              {activeOrderedIds.map((id, index) => {
                const step = orderingChallenge.steps.find((s) => s.id === id);
                if (!step) return null;
                const isCorrect =
                  canRevealAnswerDetails && correctOrderedIds?.[index] === id;
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
                        <span className="material-symbols-outlined text-[18px]">
                          keyboard_arrow_up
                        </span>
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
                        disabled={!canEdit || index === orderedIds.length - 1}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-on-surface/10 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          keyboard_arrow_down
                        </span>
                      </button>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-on-surface/10 flex items-center justify-center text-[11px] font-bold text-on-surface-variant">
                      {index + 1}
                    </div>
                    <span className="text-[14px] font-semibold flex-1">
                      {step.text}
                    </span>
                    {isCorrect && (
                      <span className="material-symbols-outlined text-[#63f1e3]">
                        check_circle
                      </span>
                    )}
                    {isIncorrect && (
                      <span className="material-symbols-outlined text-red-400">
                        cancel
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!isOptionBased && !isDragDropMatching && !isHardDragDrop && !isOrdering && (
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
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-300">
              error
            </span>
            <p className="text-[13px] font-bold text-red-200">{submitError}</p>
          </div>
        )}

        {(result || data?.review) && (
          <FeedbackPanel
            state={
              result?.correct || data?.review?.correct ? "correct" : "incorrect"
            }
            message={
              result?.message ||
              (data?.review?.correct
                ? "You solved this challenge!"
                : "You previously failed this challenge.")
            }
            explanation={result?.explanation || data?.review?.explanation}
            hint={hintText}
            timeComplexity={
              result?.timeComplexity || data?.review?.timeComplexity
            }
            spaceComplexity={
              result?.spaceComplexity || data?.review?.spaceComplexity
            }
            petFeedback={result?.petFeedback || data?.review?.petFeedback}
          />
        )}

        <RoadmapAiHelper
          nodeId={nodeId!}
          nodeTitle={challenge.title}
          nodeStatus={data?.node.status || "available"}
          mode="hard"
          accentColor="#3a7fc1"
          accentGradient="linear-gradient(90deg, #3a7fc1, #02457A)"
          accentGlowWeak="rgba(2,69,122,0.25)"
        />
      </main>

      {/* Footer / Submission */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-on-surface/10 bg-surface-container-low/95 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[800px] items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() =>
                navigate({
                  to: "/roadmap/$worldId",
                  params: { worldId: courseSlug! },
                })
              }
              className="rounded-xl border border-on-surface/10 bg-transparent px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-on-surface transition-colors hover:bg-on-surface/5"
            >
              Back to Roadmap
            </button>
            {result?.correct === false && (
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedOptionId(null);
                  setMatchingMap({});
                  setDropZoneMap({});
                  setSelectedPoolItemId(null);
                  if (orderingChallenge)
                    setOrderedIds(orderingChallenge.steps.map((s) => s.id));
                }}
                className="rounded-xl border border-[#3a7fc1]/30 bg-[#3a7fc1]/10 px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-[#66b3ff] transition-colors hover:bg-[#3a7fc1]/20"
              >
                Try Again
              </button>
            )}
          </div>
          {canEdit && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="flex items-center justify-center min-w-[160px] gap-2 rounded-xl bg-[#3a7fc1] px-8 py-3.5 text-[13px] font-extrabold uppercase tracking-widest text-[#ffffff] shadow-[0_4px_20px_rgba(58,127,193,0.3)] transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting ? "Checking..." : "Submit"}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default HardNodeChallengePage;
