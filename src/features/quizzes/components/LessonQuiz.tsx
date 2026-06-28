// @ts-nocheck
import LucideIcon from "../../../components/ui/LucideIcon";
import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getQuizByLessonId, submitQuiz } from "../api/quizApi";
import { useAuthStore } from "../../users/store/auth.store";
import { useTheme } from "../../../contexts/ThemeContext";
import { highContrastLight } from "../../../styles/syntaxThemes";

// ─── States ────────────────────────────────────────────────────────────────
// idle | loading | active | submitting | finished | not_found

const LessonQuizInner = ({
  lessonId,
  onQuizPassed,
  onFinishReview,
  onXpAwarded,
}) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [phase, setPhase] = useState("idle");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionIndex: optionId }
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [reviewQuestionIdx, setReviewQuestionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  useEffect(() => {
    setPhase("idle");
    setQuiz(null);
    setAnswers({});
    setResult(null);
    setSubmitError(null);
    setReviewQuestionIdx(0);
    setCurrentQuestionIdx(0);
  }, [lessonId]);

  // ── Start Quiz ─────────────────────────────────────────────────────────
  const handleStart = async () => {
    setPhase("loading");
    try {
      const data = await getQuizByLessonId(lessonId);
      if (!data || !data.questions || data.questions.length === 0) {
        setPhase("not_found");
        return;
      }
      setQuiz(data);
      setAnswers({});
      setResult(null);
      setCurrentQuestionIdx(0);
      setPhase("active");
    } catch (err) {
      if (err?.response?.status === 404) {
        setPhase("not_found");
      } else {
        console.error("Failed to load quiz:", err);
        setPhase("not_found");
      }
    }
  };

  // ── Select Option ──────────────────────────────────────────────────────
  const handleSelect = (questionIndex, optionId) => {
    if (phase !== "active") return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionId }));
  };

  // ── Next Or Submit ─────────────────────────────────────────────────────
  const handleNextOrSubmit = async () => {
    if (!quiz) return;

    // Nếu chưa phải câu cuối -> qua câu tiếp theo
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Câu cuối -> Submit
      setSubmitError(null);
      setPhase("submitting");

      const answersPayload = quiz.questions.map((q, index) => ({
        questionIndex: q.index ?? index,
        selectedOptionIds: answers[q.index ?? index]
          ? [answers[q.index ?? index]]
          : [],
        answerText: "",
      }));

      try {
        const res = await submitQuiz(quiz._id, answersPayload);
        setResult(res);

        const { xpAwarded, userProgress } = res;
        if (xpAwarded && xpAwarded > 0) {
          onXpAwarded?.(xpAwarded);
        }
        if (userProgress) {
          useAuthStore.getState().updateUser({
            exp: userProgress.exp,
            level: userProgress.level,
          });
        }

        if (res?.passed) {
          onQuizPassed?.();
        }
        setReviewQuestionIdx(0);
        setPhase("finished");
      } catch (err) {
        const status = err?.response?.status;
        const message =
          err?.response?.data?.message || err?.message || "Unknown error";
        console.error(
          "[Quiz] submit failed:",
          status,
          message,
          err?.response?.data,
        );
        setSubmitError(
          `Submit failed (${status ?? "network error"}): ${message}`,
        );
        setPhase("active");
      }
    }
  };

  // ── Previous Question ─────────────────────────────────────────────────────
  const handlePrevious = () => {
    if (currentQuestionIdx > 0 && phase === "active") {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  // ── Retake ─────────────────────────────────────────────────────────────
  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    setSubmitError(null);
    setCurrentQuestionIdx(0);
    setReviewQuestionIdx(0);
    setPhase("active");
  };

  const resetToIdle = () => {
    setPhase("idle");
    setQuiz(null);
    setAnswers({});
    setResult(null);
    setSubmitError(null);
    setCurrentQuestionIdx(0);
    setReviewQuestionIdx(0);
  };

  const handleFinishReview = () => {
    const finishedResult = result;
    resetToIdle();
    onFinishReview?.(finishedResult);
  };

  // ── Helpers ────────────────────────────────────────────────────────────
  const getQuestionResult = (questionIndex) =>
    result?.results?.find((r) => r.questionIndex === questionIndex);

  // ══════════════════════════════════════════════════════════════════════
  // RENDER HELPERS
  // ══════════════════════════════════════════════════════════════════════
  const renderQuestionCard = (q, index, isReviewMode) => {
    const questionKey = q.index ?? index;
    const qResult = isReviewMode ? getQuestionResult(questionKey) : null;
    const selectedOptionId = answers[questionKey];

    return (
      <div
        key={q.index}
        className={`bg-surface-container rounded-xl border p-6 shadow-lg transition-colors ${
          isReviewMode && qResult
            ? qResult.isCorrect
              ? "border-[#4ade80]/30"
              : "border-[#f87171]/30"
            : "border-outline/20"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold text-primary-fixed-dim uppercase tracking-widest">
            {isReviewMode ? `Question ${index + 1} • ` : ""}
            {q.points} Points
          </span>
          {q.difficulty && (
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                q.difficulty === "easy"
                  ? "text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/10"
                  : q.difficulty === "medium"
                    ? "text-secondary-fixed-dim border-secondary-fixed-dim/30 bg-secondary-fixed-dim/10"
                    : "text-[#f87171] border-[#f87171]/30 bg-[#f87171]/10"
              }`}
            >
              {q.difficulty}
            </span>
          )}
        </div>

        <h3 className="font-body-md text-on-surface text-[16px] font-semibold mb-5 leading-relaxed">
          {q.question}
        </h3>

        {q.codeSnippet && (
          <div className="mb-5">
            <SyntaxHighlighter
              style={isLight ? highContrastLight : atomDark}
              language="python"
              PreTag="div"
              className={`rounded-xl border border-outline/30 !text-[14px] ${
                isLight ? "!bg-[#eef4f8]" : "!bg-[#0b1118]"
              }`}
            >
              {q.codeSnippet}
            </SyntaxHighlighter>
          </div>
        )}

        {/* Options */}
        <div className="flex flex-col gap-3">
          {(q.options || []).map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrectOption =
              isReviewMode && qResult?.correctOptionIds?.includes(opt.id);
            const isWrongSelected =
              isReviewMode && isSelected && !isCorrectOption;

            let style =
              "border-outline/20 bg-surface/40 hover:bg-on-surface/5 text-on-surface-variant hover:text-on-surface cursor-pointer";

            if (!isReviewMode) {
              if (isSelected) {
                style =
                  "border-primary-fixed-dim/60 bg-primary-fixed-dim/10 text-on-surface cursor-pointer shadow-[0_0_10px_rgba(0,218,248,0.15)]";
              }
            } else {
              if (isCorrectOption) {
                style =
                  "border-[#4ade80]/50 bg-[#4ade80]/15 text-[#4ade80] cursor-default";
              } else if (isWrongSelected) {
                style =
                  "border-[#f87171]/50 bg-[#f87171]/15 text-[#f87171] cursor-default";
              } else {
                style =
                  "border-outline/10 bg-surface/20 text-on-surface-variant/50 cursor-default opacity-60";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(questionKey, opt.id)}
                disabled={isReviewMode || phase === "submitting"}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${style}`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full border text-[12px] font-bold flex items-center justify-center uppercase transition-all ${
                      isReviewMode
                        ? isCorrectOption
                          ? "border-[#4ade80] text-[#4ade80]"
                          : isWrongSelected
                            ? "border-[#f87171] text-[#f87171]"
                            : "border-outline/20 text-on-surface/30"
                        : isSelected
                          ? "border-primary-fixed-dim text-primary-fixed-dim bg-primary-fixed-dim/10"
                          : "border-outline/20 text-on-surface/40"
                    }`}
                  >
                    {opt.id}
                  </span>
                  <span className="font-body-md text-[14px]">{opt.text}</span>
                </div>
                {/* Result icon */}
                {isReviewMode && isCorrectOption && (
                  <LucideIcon
                    name="check_circle"
                    className=" text-[22px] text-[#4ade80] flex-shrink-0"
                  />
                )}
                {isReviewMode && isWrongSelected && (
                  <LucideIcon
                    name="cancel"
                    className=" text-[22px] text-[#f87171] flex-shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation (after check) */}
        {isReviewMode && qResult && (
          <div className="mt-8 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div
              className={`inline-flex items-center gap-2 text-[15px] font-bold ${
                qResult.isCorrect ? "text-[#4ade80]" : "text-[#f87171]"
              }`}
            >
              <LucideIcon
                name={qResult.isCorrect ? "check_circle" : "cancel"}
                className="text-[22px]"
              />
              {qResult.isCorrect ? "Correct!" : "Incorrect"}
              <span className="text-on-surface-variant font-normal text-[13px] ml-1">
                (+{qResult.earnedPoints}/{qResult.points} XP)
              </span>
            </div>

            {qResult.explanation && (
              <div className="p-6 rounded-xl bg-surface-container-low border-l-[6px] border-primary-fixed-dim text-[15px] leading-relaxed text-on-surface shadow-inner">
                <span className="font-bold text-primary-fixed-dim block mb-2 text-[12px] uppercase tracking-widest">
                  Explanation
                </span>
                {qResult.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════
  // PHASE: idle
  // ══════════════════════════════════════════════════════════════════════
  if (phase === "idle") {
    return (
      <div className="bg-surface-container rounded-xl p-8 border border-outline/20 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-headline-sm text-on-surface mb-2">
            Ready to test your knowledge?
          </h3>
          <p className="text-[14px] text-on-surface-variant">
            Complete the quiz to earn XP and progress to the next lesson.
          </p>
        </div>
        <button
          onClick={handleStart}
          className="w-full md:w-auto flex-shrink-0 bg-primary-fixed-dim text-on-primary-fixed font-bold px-8 py-3.5 rounded-xl hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,218,248,0.4)] whitespace-nowrap"
        >
          <LucideIcon name="assignment" className=" text-[20px]" />
          Start Quiz
        </button>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // PHASE: loading
  // ══════════════════════════════════════════════════════════════════════
  if (phase === "loading") {
    return (
      <div className="bg-surface-container rounded-xl p-8 border border-outline/20 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-headline-sm text-on-surface mb-2">
            Ready to test your knowledge?
          </h3>
          <p className="text-[14px] text-on-surface-variant">
            Complete the quiz to earn XP and progress to the next lesson.
          </p>
        </div>
        <button
          disabled
          className="w-full md:w-auto flex-shrink-0 bg-primary-fixed-dim/50 text-on-primary-fixed/70 font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap cursor-not-allowed"
        >
          <div className="w-4 h-4 border-2 border-on-primary-fixed/60 border-t-transparent rounded-full animate-spin" />
          Loading Quiz...
        </button>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // PHASE: not_found
  // ══════════════════════════════════════════════════════════════════════
  if (phase === "not_found") {
    return (
      <div className="bg-surface-container rounded-xl p-6 border border-outline/20 text-center text-on-surface-variant text-[14px]">
        <LucideIcon name="quiz" className=" text-3xl mb-2 block" />
        No quiz is available for this lesson yet.
      </div>
    );
  }

  const questions = quiz?.questions || [];
  const isSubmitting = phase === "submitting";
  // ══════════════════════════════════════════════════════════════════════
  // PHASE: finished
  // ══════════════════════════════════════════════════════════════════════
  if (phase === "finished" && result) {
    const reviewQ = questions[reviewQuestionIdx];

    if (!reviewQ) return null;

    const isFirstReviewQuestion = reviewQuestionIdx === 0;
    const isLastReviewQuestion = reviewQuestionIdx === questions.length - 1;

    return (
      <div className="flex flex-col gap-8">
        <div
          className={`rounded-xl p-8 border flex flex-col md:flex-row items-center gap-6 justify-between shadow-[0_0_30px_rgba(0,0,0,0.5)] ${
            result.passed
              ? "bg-[#4ade80]/10 border-[#4ade80]/40"
              : "bg-[#f87171]/10 border-[#f87171]/40"
          }`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                result.passed ? "bg-[#4ade80]/20" : "bg-[#f87171]/20"
              }`}
            >
              <LucideIcon
                name={result.passed ? "emoji_events" : "replay"}
                className={`text-[36px] ${
                  result.passed ? "text-[#4ade80]" : "text-[#f87171]"
                }`}
              />
            </div>

            <div>
              <h2
                className={`font-headline-sm text-[24px] font-bold mb-1 ${
                  result.passed ? "text-[#4ade80]" : "text-[#f87171]"
                }`}
              >
                {result.passed ? "Quiz Passed!" : "Quiz Failed"}
              </h2>

              <p className="text-on-surface-variant text-[15px]">
                You scored{" "}
                <span className="font-bold text-on-surface">
                  {result.percentage}%
                </span>{" "}
                ({result.correctCount}/{result.totalQuestions} correct)
              </p>

              <p className="text-[13px] text-on-surface-variant mt-1">
                {result.earnedPoints} / {result.totalPoints} XP points earned
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRetake}
            className={`flex-shrink-0 font-bold px-8 py-3.5 rounded-xl transition-all flex items-center gap-2 ${
              result.passed
                ? "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/40 hover:bg-[#4ade80]/20"
                : "bg-primary-fixed-dim text-on-primary-fixed hover:bg-primary-fixed hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,218,248,0.4)]"
            }`}
          >
            <LucideIcon
              name={result.passed ? "replay" : "refresh"}
              className="text-[18px]"
            />
            {result.passed ? "Retake Quiz" : "Try Again"}
          </button>
        </div>

        {/* Review Single Question */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container rounded-xl p-5 border border-outline/20 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-headline-sm text-on-surface text-[20px]">
                  Quiz Review
                </h3>
                <p className="text-[13px] text-on-surface-variant mt-1">
                  Review your answer, the correct answer, and the explanation.
                </p>
              </div>

              <div className="text-[13px] text-on-surface-variant font-bold">
                Question {reviewQuestionIdx + 1} of {questions.length}
              </div>
            </div>

            <div className="w-full h-1.5 bg-[#1b2532] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-fixed-dim transition-all duration-300"
                style={{
                  width: `${((reviewQuestionIdx + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {renderQuestionCard(reviewQ, reviewQuestionIdx, true)}

          <div className="flex items-center justify-between mt-2 gap-4">
            <button
              type="button"
              onClick={() =>
                setReviewQuestionIdx((prev) => Math.max(prev - 1, 0))
              }
              disabled={isFirstReviewQuestion}
              className="border border-outline/30 text-on-surface-variant font-bold px-6 py-3.5 rounded-xl hover:border-primary-fixed-dim hover:text-primary-fixed-dim transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="inline-flex items-center gap-2">
                <LucideIcon name="arrow_back" className=" text-[18px]" />
                Previous
              </span>
            </button>

            {!isLastReviewQuestion ? (
              <button
                type="button"
                onClick={() => setReviewQuestionIdx((prev) => prev + 1)}
                className="bg-primary-fixed-dim text-on-primary-fixed font-bold px-10 py-3.5 rounded-xl hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,218,248,0.4)] flex items-center gap-2"
              >
                Next Review
                <LucideIcon name="arrow_forward" className=" text-[18px]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishReview}
                className="bg-primary-fixed-dim text-on-primary-fixed font-bold px-10 py-3.5 rounded-xl hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,218,248,0.4)] flex items-center gap-2"
              >
                Finish Review
                <LucideIcon name="check_circle" className=" text-[18px]" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // PHASE: active | submitting (Show single question)
  // ══════════════════════════════════════════════════════════════════════
  const currentQ = questions[currentQuestionIdx];
  if (!currentQ) return null;

  const isLastQuestion = currentQuestionIdx === questions.length - 1;
  const currentQuestionKey = currentQ.index ?? currentQuestionIdx;
  const selectedOptionId = answers[currentQuestionKey];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Quiz Header (Progress) ── */}
      <div className="bg-surface-container rounded-xl p-5 border border-outline/20 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="font-headline-sm text-on-surface">
            {quiz.title || "Lesson Quiz"}
          </div>
          <div className="text-[13px] text-on-surface-variant font-bold">
            Question {currentQuestionIdx + 1} of {questions.length}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#1b2532] rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-fixed-dim transition-all duration-300"
            style={{
              width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* ── Single Question Card ── */}
      {renderQuestionCard(currentQ, currentQuestionIdx, false)}

      {/* ── Error Banner ── */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f87171]/10 border border-[#f87171]/30 text-[#f87171] text-[13px]">
          <LucideIcon
            name="error"
            className=" text-[18px] flex-shrink-0 mt-0.5"
          />
          <div>
            <span className="font-bold block mb-0.5">Submission failed</span>
            {submitError}
          </div>
          <button
            onClick={() => setSubmitError(null)}
            className="ml-auto flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <LucideIcon name="close" className=" text-[16px]" />
          </button>
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex items-center justify-between mt-2 gap-4">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestionIdx === 0 || isSubmitting}
          className="border border-outline/30 text-on-surface-variant font-bold px-6 py-3.5 rounded-xl hover:border-primary-fixed-dim hover:text-primary-fixed-dim transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="inline-flex items-center gap-2">
            <LucideIcon name="arrow_back" className=" text-[18px]" />
            Previous
          </span>
        </button>

        <button
          type="button"
          onClick={handleNextOrSubmit}
          disabled={!selectedOptionId || isSubmitting}
          className="bg-primary-fixed-dim text-on-primary-fixed font-bold px-10 py-3.5 rounded-xl hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,218,248,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-on-primary-fixed/60 border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : isLastQuestion ? (
            <>
              <LucideIcon name="done_all" className=" text-[18px]" />
              Submit Quiz
            </>
          ) : (
            <>
              Next Question
              <LucideIcon name="arrow_forward" className=" text-[18px]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const LessonQuiz = (props) => {
  const [xpToast, setXpToast] = useState(null);

  const handleXpAwarded = (xp) => {
    setXpToast(xp);
    setTimeout(() => setXpToast(null), 3500);
  };

  return (
    <>
      <LessonQuizInner {...props} onXpAwarded={handleXpAwarded} />
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
    </>
  );
};

export default LessonQuiz;
