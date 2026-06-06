import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getQuizByLessonId, submitQuiz } from '../api/quizApi';

// ─── States ────────────────────────────────────────────────────────────────
// idle | loading | active | submitting | result | not_found

const LessonQuiz = ({ lessonId }) => {
  const [phase, setPhase] = useState('idle');
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionIndex: optionId }
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // ── Start Quiz ─────────────────────────────────────────────────────────
  const handleStart = async () => {
    setPhase('loading');
    try {
      const data = await getQuizByLessonId(lessonId);
      if (!data || !data.questions || data.questions.length === 0) {
        setPhase('not_found');
        return;
      }
      setQuiz(data);
      setAnswers({});
      setResult(null);
      setPhase('active');
    } catch (err) {
      if (err?.response?.status === 404) {
        setPhase('not_found');
      } else {
        console.error('Failed to load quiz:', err);
        setPhase('not_found');
      }
    }
  };

  // ── Select Option ──────────────────────────────────────────────────────
  const handleSelect = (questionIndex, optionId) => {
    if (phase !== 'active') return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionId }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitError(null);
    setPhase('submitting');

    const answersPayload = quiz.questions.map((q) => ({
      questionIndex: q.index,
      selectedOptionIds: answers[q.index] ? [answers[q.index]] : [],
      answerText: '',
    }));

    console.log('[Quiz] submitting to quizId:', quiz._id);
    console.log('[Quiz] payload:', JSON.stringify(answersPayload, null, 2));

    try {
      const res = await submitQuiz(quiz._id, answersPayload);
      console.log('[Quiz] submit response:', res);
      setResult(res);
      setPhase('result');
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.message || 'Unknown error';
      console.error('[Quiz] submit failed:', status, message, err?.response?.data);
      setSubmitError(`Submit failed (${status ?? 'network error'}): ${message}`);
      setPhase('active');
    }
  };

  // ── Retake ─────────────────────────────────────────────────────────────
  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    setSubmitError(null);
    setPhase('active');
  };

  // ── Helpers ────────────────────────────────────────────────────────────
  const getQuestionResult = (questionIndex) =>
    result?.results?.find((r) => r.questionIndex === questionIndex);

  // ══════════════════════════════════════════════════════════════════════
  // PHASE: idle  →  show the existing quiz card
  // ══════════════════════════════════════════════════════════════════════
  if (phase === 'idle') {
    return (
      <div className="bg-[#121c25] rounded-xl p-8 border border-primary-fixed-dim/30 shadow-[0_0_20px_rgba(0,218,248,0.1)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-headline-sm text-white mb-2">Ready to test your knowledge?</h3>
          <p className="text-[14px] text-on-surface-variant">Complete the quiz to earn XP and progress to the next lesson.</p>
        </div>
        <button
          onClick={handleStart}
          className="w-full md:w-auto flex-shrink-0 bg-primary-fixed-dim text-on-primary-fixed font-bold px-8 py-3.5 rounded-xl hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,218,248,0.4)] whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">assignment</span>
          Start Quiz
        </button>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // PHASE: loading
  // ══════════════════════════════════════════════════════════════════════
  if (phase === 'loading') {
    return (
      <div className="bg-[#121c25] rounded-xl p-8 border border-primary-fixed-dim/30 shadow-[0_0_20px_rgba(0,218,248,0.1)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-headline-sm text-white mb-2">Ready to test your knowledge?</h3>
          <p className="text-[14px] text-on-surface-variant">Complete the quiz to earn XP and progress to the next lesson.</p>
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
  if (phase === 'not_found') {
    return (
      <div className="bg-[#121c25] rounded-xl p-6 border border-white/10 text-center text-on-surface-variant text-[14px]">
        <span className="material-symbols-outlined text-3xl mb-2 block">quiz</span>
        No quiz is available for this lesson yet.
      </div>
    );
  }

  const questions = quiz?.questions || [];

  // ══════════════════════════════════════════════════════════════════════
  // PHASE: active | submitting | result
  // ══════════════════════════════════════════════════════════════════════
  const isSubmitting = phase === 'submitting';
  const isResult = phase === 'result';

  return (
    <div className="flex flex-col gap-6">

      {/* ── Quiz Header ─────────────────────────────────────────────────── */}
      <div className="bg-[#121c25] rounded-xl p-6 border border-primary-fixed-dim/30 shadow-[0_0_20px_rgba(0,218,248,0.1)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-primary-fixed-dim/10 text-primary-fixed-dim border border-primary-fixed-dim/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3">
              Quiz
            </div>
            <h2 className="font-headline-sm text-white mb-1">{quiz.title || 'Lesson Quiz'}</h2>
            {quiz.description && (
              <p className="text-[14px] text-on-surface-variant">{quiz.description}</p>
            )}
          </div>

          {/* Score badge (result phase) */}
          {isResult && result && (
            <div
              className={`flex-shrink-0 px-6 py-4 rounded-xl border text-center ${
                result.passed
                  ? 'bg-[#4ade80]/10 border-[#4ade80]/30'
                  : 'bg-[#f87171]/10 border-[#f87171]/30'
              }`}
            >
              <div className="text-[11px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">
                Your Score
              </div>
              <div
                className={`text-[32px] font-bold font-headline-lg leading-none ${
                  result.passed ? 'text-[#4ade80]' : 'text-[#f87171]'
                }`}
              >
                {result.percentage ?? 0}%
              </div>
              <div className="text-[12px] text-on-surface-variant mt-1">
                {result.correctCount ?? 0}/{result.totalQuestions ?? questions.length} correct
              </div>
            </div>
          )}
        </div>

        {/* Passing score info */}
        {quiz.passingScore && !isResult && (
          <p className="text-[12px] text-on-surface-variant mt-3 border-t border-white/5 pt-3">
            Passing score: <span className="text-primary-fixed-dim font-bold">{quiz.passingScore}%</span>
          </p>
        )}
      </div>

      {/* ── Result Summary Banner ────────────────────────────────────────── */}
      {isResult && result && (
        <div
          className={`rounded-xl p-5 border flex items-center gap-4 ${
            result.passed
              ? 'bg-[#4ade80]/5 border-[#4ade80]/30'
              : 'bg-[#f87171]/5 border-[#f87171]/30'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[36px] ${
              result.passed ? 'text-[#4ade80]' : 'text-[#f87171]'
            }`}
          >
            {result.passed ? 'emoji_events' : 'replay'}
          </span>
          <div>
            <p
              className={`font-bold text-[16px] ${
                result.passed ? 'text-[#4ade80]' : 'text-[#f87171]'
              }`}
            >
              {result.passed ? '🎉 You passed!' : 'Not quite — give it another try!'}
            </p>
            <p className="text-[13px] text-on-surface-variant">
              {result.earnedPoints ?? 0} / {result.totalPoints ?? 0} points earned
            </p>
          </div>
        </div>
      )}

      {/* ── Questions ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {questions.map((q, idx) => {
          const qResult = isResult ? getQuestionResult(q.index) : null;
          const selectedOptionId = answers[q.index];

          return (
            <div
              key={q.index}
              className={`bg-[#121c25] rounded-xl border p-6 shadow-lg transition-colors ${
                isResult && qResult
                  ? qResult.isCorrect
                    ? 'border-[#4ade80]/25'
                    : 'border-[#f87171]/25'
                  : 'border-white/5'
              }`}
            >
              {/* Question number + difficulty */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-primary-fixed-dim uppercase tracking-widest">
                  Question {idx + 1}
                </span>
                {q.difficulty && (
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      q.difficulty === 'easy'
                        ? 'text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/10'
                        : q.difficulty === 'medium'
                        ? 'text-secondary-fixed-dim border-secondary-fixed-dim/30 bg-secondary-fixed-dim/10'
                        : 'text-[#f87171] border-[#f87171]/30 bg-[#f87171]/10'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                )}
              </div>

              {/* Question text */}
              <h3 className="font-body-md text-white text-[15px] font-semibold mb-4 leading-snug">
                {q.question}
              </h3>

              {/* Optional code snippet */}
              {q.codeSnippet && (
                <div className="mb-4">
                  <SyntaxHighlighter
                    style={atomDark}
                    language="python"
                    PreTag="div"
                    className="rounded-xl border border-white/10 !bg-[#121c25] !text-[13px]"
                  >
                    {q.codeSnippet}
                  </SyntaxHighlighter>
                </div>
              )}

              {/* Options */}
              <div className="flex flex-col gap-2.5">
                {(q.options || []).map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrectOption = isResult && qResult?.correctOptionIds?.includes(opt.id);
                  const isWrongSelected = isResult && isSelected && !isCorrectOption;

                  let style =
                    'border-white/10 bg-surface/40 hover:bg-white/5 text-on-surface-variant hover:text-white cursor-pointer';

                  if (!isResult) {
                    if (isSelected) {
                      style = 'border-primary-fixed-dim/60 bg-primary-fixed-dim/10 text-white cursor-pointer';
                    }
                  } else {
                    if (isCorrectOption) {
                      style = 'border-[#4ade80]/50 bg-[#4ade80]/10 text-[#4ade80] cursor-default';
                    } else if (isWrongSelected) {
                      style = 'border-[#f87171]/50 bg-[#f87171]/10 text-[#f87171] cursor-default';
                    } else {
                      style = 'border-white/5 bg-surface/20 text-on-surface-variant/50 cursor-default opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(q.index, opt.id)}
                      disabled={isResult || isSubmitting}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between gap-3 ${style}`}
                    >
                      {/* Option label */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex-shrink-0 w-6 h-6 rounded-full border text-[11px] font-bold flex items-center justify-center uppercase transition-all ${
                            isResult
                              ? isCorrectOption
                                ? 'border-[#4ade80] text-[#4ade80]'
                                : isWrongSelected
                                ? 'border-[#f87171] text-[#f87171]'
                                : 'border-white/20 text-white/30'
                              : isSelected
                              ? 'border-primary-fixed-dim text-primary-fixed-dim'
                              : 'border-white/20 text-white/40'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="font-body-md text-[14px]">{opt.text}</span>
                      </div>
                      {/* Result icon */}
                      {isResult && isCorrectOption && (
                        <span className="material-symbols-outlined text-[20px] text-[#4ade80] flex-shrink-0">
                          check_circle
                        </span>
                      )}
                      {isResult && isWrongSelected && (
                        <span className="material-symbols-outlined text-[20px] text-[#f87171] flex-shrink-0">
                          cancel
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (after result) */}
              {isResult && qResult && (
                <div className="mt-4 flex flex-col gap-2">
                  {/* Correct / Incorrect badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 text-[12px] font-bold ${
                      qResult.isCorrect ? 'text-[#4ade80]' : 'text-[#f87171]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {qResult.isCorrect ? 'check_circle' : 'cancel'}
                    </span>
                    {qResult.isCorrect ? 'Correct' : 'Incorrect'}
                    <span className="text-on-surface-variant font-normal ml-1">
                      (+{qResult.earnedPoints}/{qResult.points} pts)
                    </span>
                  </div>

                  {/* Explanation text */}
                  {qResult.explanation && (
                    <div className="p-3.5 rounded-lg bg-surface/40 border-l-4 border-primary-fixed-dim text-[13px] text-on-surface-variant">
                      <span className="font-bold text-white block mb-1">Explanation</span>
                      {qResult.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Submit Error Banner ──────────────────────────────────────────── */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f87171]/10 border border-[#f87171]/30 text-[#f87171] text-[13px]">
          <span className="material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5">error</span>
          <div>
            <span className="font-bold block mb-0.5">Submission failed</span>
            {submitError}
          </div>
          <button
            onClick={() => setSubmitError(null)}
            className="ml-auto flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* ── Action Buttons ───────────────────────────────────────────────── */}
      <div className="flex justify-end gap-3 mt-2 pb-2">
        {/* Submit (active / submitting) */}
        {(phase === 'active' || phase === 'submitting') && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary-fixed-dim text-on-primary-fixed font-bold px-10 py-3.5 rounded-xl hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,218,248,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary-fixed/60 border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">send</span>
                Submit Quiz
              </>
            )}
          </button>
        )}

        {/* Retake (result) */}
        {isResult && (
          <button
            onClick={handleRetake}
            className={`font-bold px-8 py-3.5 rounded-xl transition-all flex items-center gap-2 ${
              result?.passed
                ? 'bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/30 hover:bg-[#4ade80]/20'
                : 'bg-primary-fixed-dim text-on-primary-fixed hover:bg-primary-fixed hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,218,248,0.4)]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {result?.passed ? 'replay' : 'refresh'}
            </span>
            {result?.passed ? 'Retake Quiz' : 'Try Again'}
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonQuiz;
