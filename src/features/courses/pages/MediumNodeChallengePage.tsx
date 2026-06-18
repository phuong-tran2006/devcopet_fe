import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  courseApi,
  type EasyChallengeOptionId,
  type MediumDragDropChallenge,
  type MediumMultipleChoiceChallenge,
  type MediumNodeChallengeResponse,
  type SubmitMediumNodeChallengeResponse,
} from "../api/course.api";

const OPTION_ORDER: EasyChallengeOptionId[] = ["A", "B", "C", "D"];

const sortOptions = (options: MediumMultipleChoiceChallenge["options"]) =>
  [...options].sort(
    (a, b) => OPTION_ORDER.indexOf(a.id) - OPTION_ORDER.indexOf(b.id),
  );

const extractDropZoneIds = (template: string) => {
  const matches = [
    ...template.matchAll(
      /{{\s*([A-Za-z0-9_-]+)\s*}}|\[\[\s*([A-Za-z0-9_-]+)\s*\]\]|__([A-Za-z0-9_-]+)__/g,
    ),
  ];

  return Array.from(
    new Set(matches.map((match) => match[1] || match[2] || match[3])),
  );
};

const renderTemplateParts = (
  template: string,
  renderDropZone: (zoneId: string) => ReactNode,
) => {
  const regex =
    /{{\s*([A-Za-z0-9_-]+)\s*}}|\[\[\s*([A-Za-z0-9_-]+)\s*\]\]|__([A-Za-z0-9_-]+)__/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      parts.push(template.slice(lastIndex, match.index));
    }

    parts.push(renderDropZone(match[1] || match[2] || match[3]));
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

const MediumNodeChallengePage = () => {
  const { courseSlug, nodeId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [data, setData] = useState<MediumNodeChallengeResponse | null>(null);
  const [selectedOptionId, setSelectedOptionId] =
    useState<EasyChallengeOptionId | null>(null);
  const [dropZoneMap, setDropZoneMap] = useState<Record<string, string>>({});
  const [selectedPoolItemId, setSelectedPoolItemId] = useState<string | null>(
    null,
  );
  const [result, setResult] =
    useState<SubmitMediumNodeChallengeResponse | null>(null);
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

  const options = useMemo(
    () => sortOptions(multipleChoiceChallenge?.options ?? []),
    [multipleChoiceChallenge],
  );

  const dropZoneIds = useMemo(
    () =>
      dragDropChallenge
        ? extractDropZoneIds(dragDropChallenge.template)
        : [],
    [dragDropChallenge],
  );

  const reviewDropZoneMap =
    data?.review && "dropZoneMap" in data.review ? data.review.dropZoneMap : {};
  const correctDropZoneMap =
    result?.correctDropZoneMap ??
    (data?.review && "correctDropZoneMap" in data.review
      ? data.review.correctDropZoneMap
      : undefined);
  const selectedReviewOptionId =
    data?.review && "selectedOptionId" in data.review
      ? data.review.selectedOptionId
      : undefined;
  const correctOptionId =
    result?.correctOptionId ??
    (data?.review && "correctOptionId" in data.review
      ? data.review.correctOptionId
      : undefined);

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
    setResult(null);

    courseApi
      .getMediumNodeChallenge(nodeId)
      .then((response) => {
        if (!alive) return;
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
  }, [nodeId]);

  const goBackToRoadmap = () => {
    navigate({
      to: "/roadmap/$worldId",
      params: { worldId: courseSlug || "python-basic" },
    });
  };

  const submitChallenge = () => {
    if (!nodeId || !challenge || submitting || result || isReviewMode) return;

    setSubmitting(true);
    setSubmitError(null);

    const payload = isMultipleChoice
      ? selectedOptionId
        ? { type: "multiple_choice" as const, selectedOptionId }
        : null
      : { type: "drag_drop" as const, dropZoneMap };

    if (!payload) {
      setSubmitting(false);
      return;
    }

    courseApi
      .submitMediumNodeChallenge(nodeId, payload)
      .then((response) => setResult(response))
      .catch((err) => {
        setSubmitError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to submit this challenge.",
        );
      })
      .finally(() => setSubmitting(false));
  };

  const assignPoolItem = (zoneId: string) => {
    if (!selectedPoolItemId || isReviewMode || result) return;

    setDropZoneMap((prev) => ({
      ...prev,
      [zoneId]: selectedPoolItemId,
    }));
    setSelectedPoolItemId(null);
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
    if (!correctDropZoneMap) return false;
    const selectedMap = isReviewMode ? reviewDropZoneMap : dropZoneMap;
    return (
      !!selectedMap?.[zoneId] && selectedMap[zoneId] !== correctDropZoneMap[zoneId]
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

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#071217] px-5 py-9 text-on-surface md:px-8">
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
        <div className="mx-auto grid w-full max-w-[1080px] gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section>
            <button
              onClick={goBackToRoadmap}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#263b44] bg-[#10191f] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              Back to Roadmap
            </button>

            <div className="mb-7">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#63f1e3]">
                Medium Challenge • {data.node.label}
              </p>
              <h1 className="mt-2 text-[38px] font-extrabold leading-tight">
                {challenge.title}
              </h1>
              <p className="mt-2 text-[15px] text-on-surface-variant">
                {data.node.title} •{" "}
                {challenge.type === "drag_drop" ? "Drag Drop" : "Multiple Choice"}{" "}
                • {challenge.xp} XP • {challenge.estimatedMinutes} min
              </p>
            </div>

            {isLockedMode && (
              <div className="rounded-xl border border-[#263b44] bg-[#111c23] p-8 text-center">
                <span className="material-symbols-outlined text-[34px] text-on-surface-variant">
                  lock
                </span>
                <h2 className="mt-4 text-[24px] font-extrabold">
                  Challenge Locked
                </h2>
              </div>
            )}

            {!isLockedMode && (
              <div className="overflow-hidden rounded-xl border border-[#263b44] bg-[#111c23] shadow-[0_0_28px_rgba(99,241,227,0.08)]">
                <div className="border-b border-[#263b44] px-6 py-7">
                  <p className="text-[24px] font-extrabold leading-tight text-on-surface">
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
                        className={`flex min-h-[68px] items-center justify-between rounded-lg border px-5 text-left transition ${getOptionClass(option.id)}`}
                      >
                        <span className="text-[15px] font-semibold">
                          {option.id}) {option.text}
                        </span>
                        {correctOptionId === option.id && (
                          <span className="material-symbols-outlined text-[18px]">
                            check_circle
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {dragDropChallenge && (
                  <div className="grid gap-5 p-6 lg:grid-cols-[1fr_260px]">
                    <div className="rounded-xl border border-[#263b44] bg-[#0b151b] p-5">
                      <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#63f1e3]">
                        Template
                      </p>
                      <div className="whitespace-pre-wrap font-mono text-[15px] leading-8 text-on-surface">
                        {renderTemplateParts(dragDropChallenge.template, (zoneId) => {
                          const selectedMap = isReviewMode
                            ? reviewDropZoneMap
                            : dropZoneMap;
                          const selectedItemId = selectedMap?.[zoneId];
                          const correct = isDropZoneCorrect(zoneId);
                          const wrong = isDropZoneWrong(zoneId);

                          return (
                            <button
                              key={zoneId}
                              type="button"
                              onClick={() => assignPoolItem(zoneId)}
                              className={`mx-1 inline-flex min-h-[34px] min-w-[104px] items-center justify-center rounded-lg border px-3 py-1 font-sans text-[13px] font-bold ${
                                correct
                                  ? "border-[#63f1e3] bg-[#63f1e3]/15 text-[#63f1e3]"
                                  : wrong
                                    ? "border-[#ef4444] bg-[#ef4444]/12 text-red-100"
                                    : "border-[#63f1e3]/35 bg-[#13282d] text-on-surface"
                              }`}
                            >
                              {selectedItemId
                                ? getPoolItemText(selectedItemId)
                                : zoneId}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#263b44] bg-[#0b151b] p-5">
                      <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#63f1e3]">
                        Pool Items
                      </p>
                      <div className="flex flex-col gap-3">
                        {dragDropChallenge.poolItems.map((item) => {
                          const used = Object.values(dropZoneMap).includes(
                            item.id,
                          );
                          return (
                            <button
                              key={item.id}
                              type="button"
                              disabled={isReviewMode || !!result}
                              onClick={() => setSelectedPoolItemId(item.id)}
                              className={`rounded-lg border px-4 py-3 text-left text-[14px] font-bold transition ${
                                selectedPoolItemId === item.id
                                  ? "border-[#63f1e3] bg-[#63f1e3]/12 text-[#63f1e3]"
                                  : used
                                    ? "border-[#263b44] bg-[#10191f] text-on-surface-variant/55"
                                    : "border-[#263b44] bg-[#10191f] text-on-surface-variant hover:text-on-surface"
                              }`}
                            >
                              {item.text}
                            </button>
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

                {(result || data.review) && (
                  <div className="mx-6 mb-6 rounded-lg border border-[#63f1e3]/25 bg-[#10262c] px-5 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#63f1e3]">
                      Feedback
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-on-surface-variant">
                      {result?.explanation ||
                        data.review?.explanation ||
                        result?.message}
                    </p>
                  </div>
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
              </div>
            )}
          </section>

          <aside className="flex flex-col gap-5 xl:pt-[130px]">
            <div className="rounded-xl border border-[#63f1e3]/70 bg-[#111c23] p-6 shadow-[0_0_24px_rgba(99,241,227,0.08)]">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#63f1e3]">
                Challenge Status
              </p>
              <h2 className="mt-3 text-[24px] font-extrabold">
                {isReviewMode
                  ? "Review Mode"
                  : result
                    ? result.correct
                      ? "Correct"
                      : "Try Again"
                    : "In Progress"}
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-on-surface-variant">
                {result?.message ||
                  data.review?.explanation ||
                  "Complete this Medium checkpoint to continue through the roadmap."}
              </p>
            </div>
            <button
              onClick={goBackToRoadmap}
              className="rounded-xl border border-[#263b44] bg-[#111c23] px-5 py-5 text-[14px] font-bold uppercase tracking-wide text-on-surface-variant transition hover:text-on-surface"
            >
              Back to Roadmap
            </button>
          </aside>
        </div>
      )}
    </main>
  );
};

export default MediumNodeChallengePage;
