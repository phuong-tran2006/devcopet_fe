import React, { useEffect, useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { courseApi } from "../api/course.api";

const QuizPage = () => {
  const { lessonId } = useParams({ strict: false });
  const [quizData, setQuizData] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    document.title = "Quiz - Devcopet";
    if (lessonId) {
      Promise.all([
        courseApi.getLessonQuiz(lessonId).catch((err) => ({ questions: [] })),
        courseApi.getLessonDetail(lessonId).catch((err) => null),
      ])
        .then(([quizRes, lessonRes]) => {
          const questions = Array.isArray(quizRes)
            ? quizRes
            : quizRes.questions || [];
          setQuizData({ ...quizRes, questions });
          setLessonData(lessonRes);
        })
        .finally(() => setLoading(false));
    }
  }, [lessonId]);

  const handleOptionSelect = (questionId, optionId) => {
    if (!submitted) {
      setAnswers({
        ...answers,
        [questionId]: optionId,
      });
    }
  };

  const handleSubmit = () => {
    if (!quizData || !quizData.questions) return;

    let correctCount = 0;
    quizData.questions.forEach((q) => {
      // Check answer (assuming standard correctOptionId or isCorrect flag)
      // Here we assume each question object has `correctOptionId`
      if (answers[q._id || q.id] === q.correctOptionId) {
        correctCount++;
      } else {
        // Alternatively, if options have isCorrect flag:
        const selectedOption = q.options?.find(
          (opt) =>
            opt._id === answers[q._id || q.id] ||
            opt.id === answers[q._id || q.id],
        );
        if (selectedOption?.isCorrect) {
          correctCount++;
        }
      }
    });

    setScore(correctCount);
    setSubmitted(true);
    // TODO: Bắn API /submit-quiz để lưu kết quả (đợi BE có API).
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface">
        <div className="w-12 h-12 border-4 border-primary-fixed-dim border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const questions = quizData?.questions || [];

  if (questions.length === 0) {
    return (
      <main className="w-full min-h-screen relative flex items-center justify-center bg-surface px-4">
        <div className="bg-surface-variant/20 rounded-xl border border-outline/20 p-10 text-center max-w-md w-full shadow-2xl">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">
            quiz
          </span>
          <h2 className="font-headline-md text-on-surface mb-2">
            No Quiz Found
          </h2>
          <p className="text-on-surface-variant text-[14px] mb-6">
            There are no questions available for this lesson.
          </p>
          <Link
            to="/lesson/$lessonId"
            params={{ lessonId }}
            className="inline-flex bg-primary-fixed-dim/20 text-primary-fixed-dim px-6 py-2 rounded-lg font-bold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors"
          >
            Go Back
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full relative pb-20 px-4 md:px-10 lg:px-16 bg-surface min-h-screen">
      <div className="max-w-[800px] mx-auto pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <Link
              to="/lesson/$lessonId"
              params={{ lessonId }}
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-[13px] font-bold mb-4 uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              Back to Lesson
            </Link>
            <h1 className="font-headline-lg text-[28px] font-bold text-on-surface">
              Lesson Quiz
            </h1>
            <p className="text-on-surface-variant text-[14px] mt-1">
              Answer {questions.length} questions to complete this lesson.
            </p>
          </div>

          {submitted && (
            <div className="bg-primary-fixed-dim/10 border border-primary-fixed-dim/30 px-6 py-4 rounded-xl text-center">
              <div className="text-[12px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">
                Your Score
              </div>
              <div className="font-headline-lg text-[32px] text-primary-fixed-dim font-bold">
                {score}/{questions.length}
              </div>
            </div>
          )}
        </div>

        {/* Current Lesson Dashboard */}
        {lessonData && (
          <div className="bg-surface-variant/20 border border-outline/20 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-lg">
            <div className="p-4 bg-primary-fixed-dim/10 rounded-xl flex-shrink-0">
              <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">
                play_lesson
              </span>
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-bold text-primary-fixed-dim uppercase tracking-widest mb-1">
                Currently Learning
              </div>
              <h2 className="font-headline-md text-on-surface text-[20px] mb-2">
                {lessonData.title || "Lesson"}
              </h2>
              <p className="text-on-surface-variant text-[14px] line-clamp-2">
                {lessonData.description ||
                  "Review the concepts from this lesson before taking the quiz. Make sure you understand the core logic!"}
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0 w-full md:w-auto">
              <div className="flex items-center gap-2 text-[13px] font-bold text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-[#4ade80]">
                  military_tech
                </span>
                XP Reward: {lessonData.points || 100}
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-[#f87171]">
                  local_fire_department
                </span>
                Difficulty: {lessonData.difficulty || "Normal"}
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="flex flex-col gap-8">
          {questions.map((q, index) => {
            const qId = q._id || q.id || index;
            const hasAnswered = answers[qId] !== undefined;
            // Support both object ID mapping or isCorrect properties
            const getIsCorrect = (opt) =>
              opt._id === q.correctOptionId ||
              opt.id === q.correctOptionId ||
              opt.isCorrect;

            return (
              <div
                key={qId}
                className="bg-surface-variant/20 rounded-xl border border-outline/10 p-6 shadow-lg"
              >
                <h3 className="font-headline-sm text-on-surface text-[16px] mb-4">
                  <span className="text-primary-fixed-dim mr-2">
                    {index + 1}.
                  </span>
                  {q.question || q.text}
                </h3>

                <div className="flex flex-col gap-3 mt-4">
                  {(q.options || []).map((opt) => {
                    const optId = opt._id || opt.id;
                    const isSelected = answers[qId] === optId;
                    const isCorrectOption = getIsCorrect(opt);

                    let optionStyle =
                      "border-outline/20 bg-surface/40 hover:bg-surface/80 text-on-surface-variant hover:text-on-surface";

                    if (isSelected) {
                      optionStyle =
                        "border-primary-fixed-dim/50 bg-primary-fixed-dim/10 text-on-surface";
                    }

                    if (submitted) {
                      if (isCorrectOption) {
                        optionStyle =
                          "border-[#4ade80]/50 bg-[#4ade80]/10 text-[#4ade80]";
                      } else if (isSelected && !isCorrectOption) {
                        optionStyle =
                          "border-[#f87171]/50 bg-[#f87171]/10 text-[#f87171]";
                      } else {
                        optionStyle =
                          "border-outline/10 bg-surface/20 text-on-surface-variant opacity-50";
                      }
                    }

                    return (
                      <button
                        key={optId}
                        onClick={() => handleOptionSelect(qId, optId)}
                        disabled={submitted}
                        className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between group ${optionStyle}`}
                      >
                        <span className="font-body-md text-[15px]">
                          {opt.text || opt.content}
                        </span>
                        {submitted && isCorrectOption && (
                          <span className="material-symbols-outlined text-[20px]">
                            check_circle
                          </span>
                        )}
                        {submitted && isSelected && !isCorrectOption && (
                          <span className="material-symbols-outlined text-[20px]">
                            cancel
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {submitted && q.explanation && (
                  <div className="mt-4 p-4 rounded-lg bg-surface/40 border-l-4 border-primary-fixed-dim text-[14px] text-on-surface-variant">
                    <span className="font-bold text-on-surface block mb-1">
                      Explanation:
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {!submitted && questions.length > 0 && (
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              className="bg-primary-fixed-dim text-on-primary-fixed font-bold px-10 py-3.5 rounded-xl hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,218,248,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
            >
              Submit Answers
            </button>
          </div>
        )}

        {submitted && (
          <div className="mt-10 flex justify-center">
            <Link
              to="/course"
              className="bg-surface-container text-on-surface border border-outline/20 font-bold px-10 py-3.5 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
            >
              Back to Course Map
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default QuizPage;
