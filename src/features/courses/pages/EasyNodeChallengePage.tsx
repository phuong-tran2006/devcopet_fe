import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  courseApi,
  type EasyChallengeOptionId,
  type EasyNodeChallenge,
  type EasyNodeChallengeResponse,
  type EasyNodeChallengeReview,
  type SubmitEasyNodeChallengeResponse,
} from "../api/course.api";
import RoadmapAiHelper from "../components/RoadmapAiHelper";
import { useAuthStore } from "../../users/store/auth.store";
import LucideIcon from "../../../components/ui/LucideIcon";

const OPTION_ORDER: EasyChallengeOptionId[] = ["A", "B", "C", "D"];
const CHECKPOINT_DURATION = "1 min";

const sortOptions = (options: EasyNodeChallenge["options"] = []) =>
  [...options].sort(
    (a, b) => OPTION_ORDER.indexOf(a.id) - OPTION_ORDER.indexOf(b.id),
  );

const formatCodeLanguage = (
  language: NonNullable<EasyNodeChallenge["codeSnippet"]>["language"],
) => (language === "python" ? "Python" : language);

const buildCompletedFallbackReview = (
  response: EasyNodeChallengeResponse,
): EasyNodeChallengeReview | undefined => {
  if (
    response.review ||
    response.node.status !== "completed" ||
    !response.challenge?.options.length
  ) {
    return response.review;
  }

  const options = sortOptions(response.challenge.options);
  const hash = [...`${response.node.id}:${response.challenge.id}`].reduce(
    (total, char) => total + char.charCodeAt(0),
    0,
  );
  const correctIndex = hash % options.length;
  const selectedIndex =
    hash % 2 === 0 || options.length === 1
      ? correctIndex
      : (correctIndex + 1) % options.length;

  return {
    selectedOptionId: options[selectedIndex].id,
    correctOptionId: options[correctIndex].id,
    correct: selectedIndex === correctIndex,
    explanation:
      "Review data is not available from progress yet, so this completed checkpoint is using deterministic temporary review data.",
  };
};

const normalizeChallengeResponse = (
  response: EasyNodeChallengeResponse,
): EasyNodeChallengeResponse => {
  const review = buildCompletedFallbackReview(response);

  return review ? { ...response, review } : response;
};

const EasyNodeChallengePage = () => {
  const { courseSlug, nodeId } = useParams({ strict: false });
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const petName = (currentUser?.petName as string) || "Axo-Script";
  const [data, setData] = useState<EasyNodeChallengeResponse | null>(null);
  const [selectedOptionId, setSelectedOptionId] =
    useState<EasyChallengeOptionId | null>(null);
  const [result, setResult] = useState<SubmitEasyNodeChallengeResponse | null>(
    null,
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nextChallengeLoading, setNextChallengeLoading] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState<{
    optionId: EasyChallengeOptionId;
    message: string;
    correctOptionId?: EasyChallengeOptionId;
    explanation?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [xpToast, setXpToast] = useState<number | null>(null);

  const challenge = data?.challenge ?? null;
  const review = data?.review ?? null;
  const isReviewMode = data?.node.status === "completed" && !!review;
  const isLockedMode = data?.node.status === "locked";
  const canAnswer = data?.node.status === "available" && !!challenge;
  const userLevel = currentUser?.level ?? 1;
  const userExp = currentUser?.exp ?? 0;
  const userStars = currentUser?.coins ?? 0;
  const levelProgress = Math.min(100, Math.max(0, userExp % 1000) / 10);
  const codeSnippet =
    challenge?.promptType === "code_mcq" ? challenge.codeSnippet : undefined;

  const options = useMemo(
    () => sortOptions(challenge?.options ?? []),
    [challenge],
  );

  useEffect(() => {
    if (!nodeId) {
      setLoading(false);
      setError("Challenge node is missing.");
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedOptionId(null);
    setResult(null);
    setShowSuccessModal(false);
    setWrongAttempt(null);
    setSubmitError(null);

    courseApi
      .getEasyNodeChallenge(nodeId)
      .then((response) => {
        setData(normalizeChallengeResponse(response));
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load challenge details.",
        );
      })
      .finally(() => setLoading(false));
  }, [nodeId]);

  const goBackToRoadmap = () => {
    navigate({
      to: "/roadmap/$worldId",
      params: { worldId: courseSlug || "python-basic" },
    });
  };

  const goToNextChallenge = () => {
    if (nextChallengeLoading || !data) return;

    const nextNode = data.nextNode;
    if (!nextNode) {
      goBackToRoadmap();
      return;
    }

    setNextChallengeLoading(true);
    try {
      if (nextNode.status === "locked") {
        goBackToRoadmap();
        return;
      }

      navigate({
        to: "/roadmap/$courseSlug/easy/nodes/$nodeId/challenge",
        params: {
          courseSlug: courseSlug || "python-basic",
          nodeId: nextNode.id,
        },
      });
    } catch (err) {
      console.error("Unable to open next challenge:", err);
      goBackToRoadmap();
    } finally {
      setNextChallengeLoading(false);
    }
  };

  const submitAnswer = () => {
    if (!nodeId || !selectedOptionId || !canAnswer || submitting || result) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setWrongAttempt(null);

    courseApi
      .submitEasyNodeChallenge(nodeId, selectedOptionId)
      .then((response) => {
        const { xpAwarded, userProgress } = response;
        if (xpAwarded && xpAwarded > 0) {
          setXpToast(xpAwarded);
          window.setTimeout(() => setXpToast(null), 3500);
        }
        if (userProgress) {
          useAuthStore.getState().updateUser({
            exp: userProgress.exp,
            level: userProgress.level,
          });
        }

        if (response.correct) {
          setResult(response);
          setShowSuccessModal(true);
          return;
        }

        setWrongAttempt({
          optionId: selectedOptionId,
          message: response.message,
          correctOptionId: response.correctOptionId,
          explanation: response.explanation,
        });
        setSelectedOptionId(null);
      })
      .catch((err) => {
        setSubmitError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to submit your answer.",
        );
      })
      .finally(() => setSubmitting(false));
  };

  const copyCodeSnippet = async () => {
    if (!codeSnippet?.code) return;

    try {
      await navigator.clipboard.writeText(codeSnippet.code);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1400);
    } catch (err) {
      console.error("Unable to copy code snippet:", err);
    }
  };

  const getOptionClass = (optionId: EasyChallengeOptionId) => {
    const selectedReviewOptionId = review?.selectedOptionId;
    const correctOptionId =
      review?.correctOptionId ??
      result?.correctOptionId ??
      wrongAttempt?.correctOptionId;
    const isSelected = selectedOptionId === optionId;
    const isCorrect = correctOptionId === optionId;
    const isWrongSelected =
      wrongAttempt?.optionId === optionId ||
      (!!review && selectedReviewOptionId === optionId && !isCorrect);

    if (isCorrect) {
      return "border-[#63f1e3] bg-[#172d31] text-[#63f1e3] shadow-[0_0_22px_rgba(99,241,227,0.22)]";
    }

    if (isWrongSelected) {
      return "border-[#ef4444] bg-[#2b171a] text-red-100 shadow-[0_0_18px_rgba(239,68,68,0.16)]";
    }

    if (isSelected) {
      return "border-[#63f1e3] bg-[#13282d] text-on-surface shadow-[0_0_18px_rgba(99,241,227,0.18)]";
    }

    if (isReviewMode) {
      return "border-[#263b44] bg-[#10191f] text-on-surface-variant";
    }

    return "border-[#1c2b33] bg-[#10191f] text-on-surface-variant hover:border-[#63f1e3]/35 hover:text-on-surface";
  };

  const isCorrectOption = (optionId: EasyChallengeOptionId) => {
    const correctOptionId =
      review?.correctOptionId ??
      result?.correctOptionId ??
      wrongAttempt?.correctOptionId;
    return correctOptionId === optionId;
  };

  const isSelectedReviewOption = (optionId: EasyChallengeOptionId) =>
    isReviewMode && review?.selectedOptionId === optionId;

  const renderOptionBadges = (optionId: EasyChallengeOptionId) => {
    if (!isReviewMode) {
      return isCorrectOption(optionId) ? (
        <span className="ml-3 rounded-full border border-[#63f1e3]/35 bg-[#63f1e3]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#63f1e3]">
          Correct
        </span>
      ) : null;
    }

    return (
      <span className="ml-3 inline-flex flex-wrap gap-2 align-middle">
        {isSelectedReviewOption(optionId) && (
          <span className="rounded-full border border-[#97CADB]/35 bg-[#97CADB]/12 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#97CADB]">
            Your answer
          </span>
        )}
        {isCorrectOption(optionId) && (
          <span className="rounded-full border border-[#63f1e3]/35 bg-[#63f1e3]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#63f1e3]">
            Correct answer
          </span>
        )}
      </span>
    );
  };

  const retryAfterWrongAnswer = () => {
    setWrongAttempt(null);
    setSelectedOptionId(null);
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#071217] text-on-surface flex flex-col justify-start items-center py-10 px-4">
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

          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#63f1e3]">
            <span>Easy Checkpoint</span>
          </div>
        </div>

        <section className="w-full flex flex-col">
          {loading && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#63f1e3]/45 border-t-transparent" />
            </div>
          )}

          {!loading && error && (
            <div className="mx-auto mt-12 w-full rounded-2xl border border-red-400/20 bg-red-400/10 px-6 py-8 text-center">
              <h1 className="text-[24px] font-extrabold">
                Challenge could not load
              </h1>
              <p className="mt-2 text-on-surface-variant">{error}</p>
            </div>
          )}

          {!loading && !error && data && isLockedMode && (
            <div className="mx-auto mt-12 w-full rounded-xl border border-[#263b44] bg-[#111c23] p-8 text-center shadow-[0_0_28px_rgba(99,241,227,0.08)]">
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
                className="mt-7 rounded-xl border border-[#263b44] bg-[#10191f] px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-on-surface-variant transition hover:text-on-surface"
              >
                Back to Roadmap
              </button>
            </div>
          )}

          {!loading && !error && data && !isLockedMode && challenge && (
            <div className="w-full flex flex-col gap-6">
              <section className="w-full">
                <div className="mb-6 flex flex-col gap-2">
                  <p className="text-[14px] text-on-surface-variant font-medium">
                    {data.node.label} • {data.node.title}
                  </p>
                </div>

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
                        <span>Multiple choice</span>
                        <span className="h-1 w-1 rounded-full bg-[#63f1e3]/70" />
                        <span>{challenge.xp} XP</span>
                        <span className="h-1 w-1 rounded-full bg-[#63f1e3]/70" />
                        <span>{CHECKPOINT_DURATION}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-[#263b44] px-6 py-7">
                    <p className="text-[26px] font-extrabold leading-tight text-on-surface md:text-[32px]">
                      {challenge.question}
                    </p>

                    {codeSnippet && (
                      <div className="mt-5 overflow-hidden rounded-xl border border-[#263b44] bg-[#071217] shadow-[0_0_22px_rgba(99,241,227,0.08)]">
                        <div className="flex items-center justify-between gap-3 border-b border-[#263b44] bg-[#0a161c] px-4 py-3">
                          <div className="flex min-w-0 items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#63f1e3]">
                            <LucideIcon name="code" className="text-[18px]" />
                            <span>
                              {formatCodeLanguage(codeSnippet.language)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={copyCodeSnippet}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#263b44] bg-[#101f25] px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition hover:border-[#63f1e3]/45 hover:text-[#63f1e3]"
                          >
                            <LucideIcon name={copiedCode ? "check" : "content_copy"} className="text-[16px]" />
                            {copiedCode ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto px-5 py-4 font-mono text-[15px] font-semibold leading-7 text-[#d7f7f4] md:text-[16px]">
                          <code>{codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}

                    <p className="mt-5 text-[13px] font-bold uppercase tracking-widest text-[#97CADB]">
                      Select one answer below
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 p-6">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        disabled={
                          !canAnswer || isReviewMode || !!result || submitting
                        }
                        onClick={() => {
                          if (!canAnswer || isReviewMode || result) return;
                          setSelectedOptionId(option.id);
                          setWrongAttempt(null);
                        }}
                        className={`flex min-h-[68px] items-center justify-between rounded-lg border px-5 text-left transition-all duration-200 disabled:cursor-default ${getOptionClass(option.id)}`}
                      >
                        <span className="min-w-0 text-[15px] font-semibold leading-relaxed">
                          {option.id}) {option.text}
                          {renderOptionBadges(option.id)}
                        </span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isCorrectOption(option.id)
                              ? "border-[#63f1e3] bg-[#63f1e3] text-[#052023]"
                              : selectedOptionId === option.id
                                ? "border-[#63f1e3]"
                                : "border-on-surface-variant"
                          }`}
                        >
                          {isCorrectOption(option.id) && (
                            <LucideIcon name="check" className=" text-[15px]" />
                          )}
                        </span>
                      </button>
                    ))}
                  </div>

                  {submitError && (
                    <p className="mx-6 mb-6 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-[13px] text-red-100/80">
                      {submitError}
                    </p>
                  )}

                  {wrongAttempt && (
                    <div className="mx-6 mb-6 rounded-lg border border-red-400/25 bg-red-400/10 px-4 py-3">
                      <div className="flex items-start gap-3">
                        <LucideIcon name="error" className=" text-[20px] text-red-300" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-bold text-red-100">
                            {wrongAttempt.message || "Not quite. Try again."}
                          </p>
                          <p className="mt-1 text-[13px] leading-relaxed text-red-100/70">
                            {wrongAttempt.explanation ||
                              "Pick another answer, then submit again."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {canAnswer && !result && !isReviewMode && (
                    <button
                      onClick={submitAnswer}
                      disabled={!selectedOptionId || submitting}
                      className="mx-6 mb-6 w-[calc(100%-3rem)] rounded-xl bg-[#63f1e3] px-5 py-4 text-[13px] font-extrabold uppercase tracking-widest text-[#052023] transition hover:bg-[#86fff4] disabled:cursor-not-allowed disabled:bg-on-surface/10 disabled:text-on-surface-variant/45"
                    >
                      {submitting ? "Submitting..." : "Submit Answer"}
                    </button>
                  )}

                  {/* Inline Explanation and Navigation Section */}
                  {(isReviewMode || result) && (
                    <div className="mx-6 mb-6 border-t border-[#263b44] pt-6 flex flex-col gap-4">
                      {/* Explanation box */}
                      <div className="rounded-xl border border-[#63f1e3]/30 bg-[#10262c] p-6 shadow-[inset_0_0_12px_rgba(99,241,227,0.06)]">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#63f1e3] bg-[#63f1e3]/10 text-[#63f1e3]">
                            <LucideIcon name="pets" className=" text-[20px]" />
                          </div>
                          <div>
                            <p className="font-bold text-on-surface text-[14px] tracking-wide">
                              {petName} Companion Says
                            </p>
                          </div>
                        </div>

                        <p className="text-[14px] leading-relaxed text-on-surface-variant">
                          {isReviewMode && review
                            ? review.explanation
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
                          {nextChallengeLoading
                            ? "Loading..."
                            : "Next Challenge"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {showSuccessModal && result?.correct && challenge && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#020815]/78 px-4 backdrop-blur-[6px]">
                  <div className="relative w-full max-w-[480px] rounded-3xl bg-[#2a3947] p-5 shadow-[0_0_60px_rgba(0,0,0,0.45)]">
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-white/8 hover:text-on-surface"
                      aria-label="Close result"
                    >
                      <LucideIcon name="close" className=" text-[22px]" />
                    </button>

                    <div className="rounded-xl bg-[#0f2630] px-8 pb-7 pt-8 shadow-[inset_0_0_48px_rgba(99,241,227,0.06)]">
                      <div className="mx-auto mb-7 flex h-[88px] w-[88px] items-center justify-center rounded-full border border-[#00c7bd] bg-[#00c7bd]/10 text-[#9afff7] shadow-[0_0_30px_rgba(0,199,189,0.2)]">
                        <LucideIcon name="star" className=" text-[46px]" />
                      </div>

                      <h2 className="text-center text-[28px] font-light uppercase leading-none tracking-wide text-on-surface">
                        Mission
                        <br />
                        Accomplished
                      </h2>

                      <div className="mt-6 rounded-lg border border-on-surface/10 bg-[#1b3440]/70 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#63f1e3]/25 bg-[#63f1e3]/12 text-[#63f1e3]">
                            <LucideIcon name="pets" className=" text-[24px]" />
                          </div>
                          <div>
                            <p className="text-[13px] italic leading-relaxed text-on-surface-variant">
                              “{result.message}”
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
                          <p className="text-[18px] font-bold text-[#63f1e3]">
                            XP
                          </p>
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
                        className="mt-7 w-full rounded-lg bg-[#63f1e3] px-5 py-4 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#052023] shadow-[0_10px_28px_rgba(99,241,227,0.24)] transition hover:bg-[#86fff4]"
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
            </div>
          )}
        </section>
      </div>

      {data && (
        <RoadmapAiHelper
          nodeId={nodeId ?? null}
          nodeTitle={data.node.title}
          nodeStatus={data.node.status}
          mode="easy"
          accentColor="#63f1e3"
          accentGradient="linear-gradient(to right, #00a99d, #223746)"
          accentGlowWeak="rgba(99,241,227,0.2)"
        />
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
          <div className="animate-xp-toast bg-[#0f2630]/95 backdrop-blur-md border border-[#63f1e3]/40 text-[#63f1e3] font-black px-6 py-3 rounded-full shadow-[0_0_30px_rgba(99,241,227,0.3)] flex items-center gap-2">
            <LucideIcon name="stars" className=" text-[#63f1e3]" />
            <span className="text-[16px] tracking-wider font-extrabold animate-bounce">
              +{xpToast} XP
            </span>
          </div>
        </div>
      )}
    </main>
  );
};

export default EasyNodeChallengePage;
