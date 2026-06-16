import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  courseApi,
  type EasyChallengeOptionId,
  type EasyNodeChallengeResponse,
  type SubmitEasyNodeChallengeResponse,
} from "../api/course.api";

const OPTION_ORDER: EasyChallengeOptionId[] = ["A", "B", "C", "D"];
const CHECKPOINT_DURATION = "1 min";

const sortOptions = (options: EasyNodeChallengeResponse["challenge"]["options"]) =>
  [...options].sort(
    (a, b) => OPTION_ORDER.indexOf(a.id) - OPTION_ORDER.indexOf(b.id),
  );

const EasyNodeChallengePage = () => {
  const { courseSlug, nodeId } = useParams({ strict: false });
  const navigate = useNavigate();
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
    explanation?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const options = useMemo(
    () => sortOptions(data?.challenge.options ?? []),
    [data],
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
    setResult(null);
    setShowSuccessModal(false);
    setWrongAttempt(null);

    courseApi
      .getEasyNodeChallenge(nodeId)
      .then((response) => {
        if (!alive) return;
        setData(response);
        document.title = `${response.node.label} Challenge | Devcopet`;
      })
      .catch((err) => {
        if (!alive) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load this checkpoint.",
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

  const goToNextChallenge = async () => {
    if (!courseSlug || !nodeId || nextChallengeLoading) return;

    setNextChallengeLoading(true);
    try {
      const roadmap = await courseApi.getEasyRoadmap(courseSlug);
      const nodes = [...roadmap.chapters]
        .sort((a, b) => a.order - b.order)
        .flatMap((chapter) =>
          [...chapter.nodes].sort((a, b) => a.lessonOrder - b.lessonOrder),
        );
      const currentIndex = nodes.findIndex((node) => node.id === nodeId);
      const nextNode = currentIndex >= 0 ? nodes[currentIndex + 1] : null;

      if (!nextNode) {
        goBackToRoadmap();
        return;
      }

      navigate({
        to: "/roadmap/$courseSlug/easy/nodes/$nodeId/challenge",
        params: {
          courseSlug,
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
    if (!nodeId || !selectedOptionId || submitting || result) return;

    setSubmitting(true);
    setSubmitError(null);
    setWrongAttempt(null);

    courseApi
      .submitEasyNodeChallenge(nodeId, selectedOptionId)
      .then((response) => {
        if (response.correct) {
          setResult(response);
          setShowSuccessModal(true);
          return;
        }

        setWrongAttempt({
          optionId: selectedOptionId,
          message: response.message,
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

  const getOptionClass = (optionId: EasyChallengeOptionId) => {
    const isSelected = selectedOptionId === optionId;
    const isCorrect = result?.correctOptionId === optionId;
    const isWrongSelected = wrongAttempt?.optionId === optionId;

    if (isCorrect) {
      return "border-[#63f1e3] bg-[#172d31] text-[#63f1e3] shadow-[0_0_22px_rgba(99,241,227,0.22)]";
    }

    if (isWrongSelected) {
      return "border-[#ef4444] bg-[#2b171a] text-red-100 shadow-[0_0_18px_rgba(239,68,68,0.16)]";
    }

    if (isSelected) {
      return "border-[#63f1e3] bg-[#13282d] text-on-surface shadow-[0_0_18px_rgba(99,241,227,0.18)]";
    }

    return "border-[#1c2b33] bg-[#10191f] text-on-surface-variant hover:border-[#63f1e3]/35 hover:text-on-surface";
  };

  const isCorrectOption = (optionId: EasyChallengeOptionId) =>
    result?.correctOptionId === optionId;

  const retryAfterWrongAnswer = () => {
    setWrongAttempt(null);
    setSelectedOptionId(null);
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#071217] text-on-surface">
      <div className="flex min-h-[calc(100vh-80px)]">
        <aside className="hidden w-[246px] shrink-0 flex-col bg-[#0b171e] px-6 py-8 lg:flex">
          <div className="mb-9 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#63f1e3]/20 bg-[#63f1e3]/10 text-[#63f1e3]">
              <span className="material-symbols-outlined text-[22px]">
                pets
              </span>
            </div>
            <div>
              <p className="text-[14px] font-semibold">Level 12</p>
              <p className="text-[11px] text-on-surface-variant">
                Data Novice
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-fit rounded-full border border-[#97CADB]/20 bg-[#97CADB]/10 px-4 py-2 text-[13px] font-bold">
              ✹ 2,450 XP
            </div>
            <div className="w-fit rounded-full border border-[#97CADB]/20 bg-[#97CADB]/10 px-4 py-2 text-[13px] font-bold">
              ★ 120
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-[13px] uppercase tracking-widest text-on-surface-variant">
              Level 12
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-[#263944]">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#97CADB] to-[#d95dff]" />
            </div>
          </div>

          <button className="mt-auto rounded-xl bg-gradient-to-r from-[#00a99d] to-[#223746] px-4 py-3 text-[12px] font-extrabold uppercase tracking-widest text-white">
            Upgrade to Pro
          </button>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col px-5 py-9 md:px-8">
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

          {!loading && !error && data && (
            <div className="mx-auto grid w-full max-w-[1080px] gap-6 xl:grid-cols-[minmax(0,1fr)_282px]">
              <section>
                <div className="mb-9 flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-[40px] font-extrabold leading-none md:text-[48px]">
                      {result ? "Review Mission" : "Roadmap Challenge"}
                    </h1>
                    <p className="mt-3 text-[15px] text-on-surface-variant">
                      {data.node.label} • {data.node.title}
                    </p>
                  </div>

                  {result && (
                    <div className="text-right">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#63f1e3]">
                        Accuracy
                      </p>
                      <p className="mt-2 text-[28px] font-extrabold text-[#63f1e3]">
                        {result.correct ? "100%" : "0%"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-[#263b44] bg-[#111c23] p-6 shadow-[0_0_28px_rgba(99,241,227,0.08)]">
                  <p className="mb-5 text-[16px] font-semibold text-on-surface">
                    {data.challenge.question}
                  </p>

                  <div className="mb-6 rounded-lg border-l-4 border-[#63f1e3] bg-[#303a3f] px-6 py-5">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-[#63f1e3]">
                      Easy Checkpoint
                    </p>
                    <h2 className="mt-3 text-[22px] font-extrabold">
                      {data.challenge.title}
                    </h2>
                    <p className="mt-2 text-[14px] leading-relaxed text-on-surface-variant">
                      {data.challenge.xp} XP • {CHECKPOINT_DURATION}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        disabled={!!result || submitting}
                        onClick={() => {
                          setSelectedOptionId(option.id);
                          setWrongAttempt(null);
                        }}
                        className={`flex min-h-[68px] items-center justify-between rounded-lg border px-5 text-left transition-all duration-200 disabled:cursor-default ${getOptionClass(option.id)}`}
                      >
                        <span className="text-[15px] font-semibold">
                          {option.id}) {option.text}
                          {isCorrectOption(option.id) && (
                            <span className="ml-3 rounded-full border border-[#63f1e3]/35 bg-[#63f1e3]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#63f1e3]">
                              Correct
                            </span>
                          )}
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
                            <span className="material-symbols-outlined text-[15px]">
                              check
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>

                  {submitError && (
                    <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-[13px] text-red-100/80">
                      {submitError}
                    </p>
                  )}

                  {wrongAttempt && (
                    <div className="mt-4 rounded-lg border border-red-400/25 bg-red-400/10 px-4 py-3">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[20px] text-red-300">
                          error
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-bold text-red-100">
                            {wrongAttempt.message || "Not quite. Try again."}
                          </p>
                          <p className="mt-1 text-[13px] leading-relaxed text-red-100/70">
                            {wrongAttempt.explanation ||
                              "Pick another answer, then submit again."}
                          </p>
                        </div>
                        <button
                          onClick={retryAfterWrongAnswer}
                          className="shrink-0 rounded-lg border border-red-300/25 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-red-100 transition hover:bg-red-300/10"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  )}

                  {!result && (
                    <button
                      onClick={submitAnswer}
                      disabled={!selectedOptionId || submitting}
                      className="mt-6 w-full rounded-xl bg-[#63f1e3] px-5 py-4 text-[13px] font-extrabold uppercase tracking-widest text-[#052023] transition hover:bg-[#86fff4] disabled:cursor-not-allowed disabled:bg-on-surface/10 disabled:text-on-surface-variant/45"
                    >
                      {submitting ? "Submitting..." : "Submit Answer"}
                    </button>
                  )}
                </div>
              </section>

              <aside className="flex flex-col gap-5 xl:pt-[104px]">
                {result && (
                  <div className="self-end rounded-lg border border-[#63f1e3] px-4 py-3 text-[11px] font-extrabold uppercase tracking-widest text-[#63f1e3]">
                    {result.correct ? "Mission Accomplished" : "Mission Review"}
                  </div>
                )}

                <div className="rounded-xl border border-[#63f1e3]/70 bg-[#111c23] p-6 shadow-[0_0_24px_rgba(99,241,227,0.08)]">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#63f1e3] bg-[#63f1e3]/10 text-[#63f1e3]">
                      <span className="material-symbols-outlined text-[30px]">
                        pets
                      </span>
                    </div>
                    <p className="font-semibold text-on-surface">
                      Personal Explanation
                    </p>
                  </div>

                  {result ? (
                    <>
                      <p className="text-[15px] font-bold italic leading-relaxed text-[#63f1e3]">
                        “{result.message}”
                      </p>
                      {result.explanation && (
                        <p className="mt-4 text-[14px] leading-relaxed text-on-surface-variant">
                          {result.explanation}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[14px] leading-relaxed text-on-surface-variant">
                      Select one answer, then submit to see your personalized
                      explanation.
                    </p>
                  )}

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-[11px] text-on-surface-variant">
                      <span>Mastery of Checkpoint</span>
                      <span>{result?.correct ? "85%" : "0%"}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#263944]">
                      <div
                        className="h-full rounded-full bg-[#63f1e3]"
                        style={{ width: result?.correct ? "85%" : "0%" }}
                      />
                    </div>
                  </div>
                </div>

                {result && (
                  <>
                    <button
                      onClick={goToNextChallenge}
                      disabled={nextChallengeLoading}
                      className="rounded-xl bg-[#63f1e3] px-5 py-5 text-[14px] font-extrabold uppercase tracking-wide text-[#052023] transition hover:bg-[#86fff4]"
                    >
                      {nextChallengeLoading ? "Loading..." : "Next Challenge"}
                      <span className="ml-2 text-[20px]">→</span>
                    </button>
                    <button
                      onClick={goBackToRoadmap}
                      className="rounded-xl border border-[#263b44] bg-[#111c23] px-5 py-5 text-[14px] font-bold uppercase tracking-wide text-on-surface-variant transition hover:text-on-surface"
                    >
                      Back to Results
                    </button>
                  </>
                )}
              </aside>

              {showSuccessModal && result?.correct && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#020815]/78 px-4 backdrop-blur-[6px]">
                  <div className="relative w-full max-w-[480px] rounded-3xl bg-[#2a3947] p-5 shadow-[0_0_60px_rgba(0,0,0,0.45)]">
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-white/8 hover:text-on-surface"
                      aria-label="Close result"
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        close
                      </span>
                    </button>

                    <div className="rounded-xl bg-[#0f2630] px-8 pb-7 pt-8 shadow-[inset_0_0_48px_rgba(99,241,227,0.06)]">
                      <div className="mx-auto mb-7 flex h-[88px] w-[88px] items-center justify-center rounded-full border border-[#00c7bd] bg-[#00c7bd]/10 text-[#9afff7] shadow-[0_0_30px_rgba(0,199,189,0.2)]">
                        <span className="material-symbols-outlined text-[46px]">
                          star
                        </span>
                      </div>

                      <h2 className="text-center text-[28px] font-light uppercase leading-none tracking-wide text-on-surface">
                        Mission
                        <br />
                        Accomplished
                      </h2>

                      <div className="mt-6 rounded-lg border border-on-surface/10 bg-[#1b3440]/70 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#63f1e3]/25 bg-[#63f1e3]/12 text-[#63f1e3]">
                            <span className="material-symbols-outlined text-[24px]">
                              pets
                            </span>
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
                              Axo-Script
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
                            +{data.challenge.xp}
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
    </main>
  );
};

export default EasyNodeChallengePage;
