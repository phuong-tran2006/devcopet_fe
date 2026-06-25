// @ts-nocheck
import LucideIcon from "../../components/ui/LucideIcon";
import {
  createFileRoute,
  useParams,
  useNavigate,
} from "@tanstack/react-router";
import LessonQuiz from "../../features/quizzes/components/LessonQuiz";

export const Route = createFileRoute("/lesson/$lessonId/quiz")({
  component: LessonQuizRoutePage,
});

function LessonQuizRoutePage() {
  const { lessonId } = useParams({ from: "/lesson/$lessonId/quiz" });
  const navigate = useNavigate();

  return (
    <main className="w-full relative pb-20 min-h-[calc(100vh-80px)] bg-background flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-[800px]">
        {/* Back Link */}
        <button
          onClick={() =>
            navigate({ to: "/lesson/$lessonId", params: { lessonId } })
          }
          className="inline-flex items-center gap-2 text-on-surface-variant/60 hover:text-on-surface transition-colors text-[12px] font-bold mb-6 uppercase tracking-[0.15em]"
        >
          <LucideIcon name="arrow_back" className="text-[14px]" />
          Back to Lesson
        </button>

        <LessonQuiz
          lessonId={lessonId}
          onFinishReview={() =>
            navigate({ to: "/lesson/$lessonId", params: { lessonId } })
          }
        />
      </div>
    </main>
  );
}
