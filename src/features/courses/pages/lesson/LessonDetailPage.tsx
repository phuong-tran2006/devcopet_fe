// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronLeft,
  Menu,
  ArrowLeft,
  PlayCircle,
  Medal,
  Flame,
  ArrowRight,
  ClipboardList,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import CodeRunnerBlock from "src/components/CodeRunnerBlock";
import CourseSidebar from "src/features/courses/components/CourseSidebar";
import { courseApi } from "src/features/courses/api/course.api";
import LessonQuiz from "src/features/courses/components/lesson/LessonQuiz";

const markdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const language = className ? className.replace("language-", "").trim() : "";

    if (!inline && language) {
      if (language === "python-run") {
        return (
          <CodeRunnerBlock initialCode={String(children).replace(/\n$/, "")} />
        );
      }

      return (
        <SyntaxHighlighter
          {...props}
          children={String(children).replace(/\n$/, "")}
          style={atomDark}
          language={language}
          PreTag="div"
          className="rounded-xl my-6 border border-outline/20 !bg-surface-container-low"
        />
      );
    }

    return (
      <code
        {...props}
        className={`${className} bg-surface-container-highest text-primary px-1.5 py-0.5 rounded font-code-md text-[13px]`}
      >
        {children}
      </code>
    );
  },
};

const LessonDetailPage = () => {
  const { lessonId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentScrollRef = useRef(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const lastScrollRef = useRef({
    scrollTop: 0,

    time: Date.now(),
  });

  useEffect(() => {
    if (lessonId) {
      setLoading(true);
      setLesson(null);
      setReadingProgress(0);
      setQuizPassed(false);

      if (contentScrollRef.current) {
        contentScrollRef.current.scrollTo({
          top: 0,
          behavior: "auto",
        });
      }

      lastScrollRef.current = {
        scrollTop: 0,
        time: Date.now(),
      };

      courseApi
        .getLessonDetail(lessonId)
        .then((data) => {
          setLesson(data);
          setQuizPassed(data.status === "completed");
          if (data.status === "completed") {
            setReadingProgress(100);
          }
          document.title = `${data.title} - Devcopet`;
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [lessonId]);

  useEffect(() => {
    if (!lesson?._id) return;

    setReadingProgress(0);
    setQuizPassed(false);

    requestAnimationFrame(() => {
      if (contentScrollRef.current) {
        contentScrollRef.current.scrollTo({
          top: 0,
          behavior: "auto",
        });
      }
    });

    lastScrollRef.current = {
      scrollTop: 0,
      time: Date.now(),
    };
  }, [lesson?._id]);

  const getOrderedCourseLessons = async (courseId) => {
    const chapters = await courseApi.getChapters(courseId);
    const orderedChapters = [...(chapters || [])].sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    );

    const lessonsByChapter = await Promise.all(
      orderedChapters.map(async (chapter) => {
        const chapterId = chapter._id || chapter.id;
        const lessons = await courseApi.getLessons(chapterId);

        return [...(lessons || [])]
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((item) => ({
            ...item,
            chapterOrder: chapter.order || 0,
          }));
      }),
    );

    return lessonsByChapter.flat();
  };

  const handleQuizPassed = () => {
    setQuizPassed(true);
    setReadingProgress(100);
    setSidebarRefreshKey((prev) => prev + 1);
  };

  const handleFinishReview = async (quizResult) => {
    if (!quizResult?.passed || !lesson?.courseId || !lesson?._id) return;

    try {
      const orderedLessons = await getOrderedCourseLessons(lesson.courseId);
      const currentIndex = orderedLessons.findIndex(
        (item) => String(item._id || item.id) === String(lesson._id),
      );
      const nextLesson =
        currentIndex >= 0 ? orderedLessons[currentIndex + 1] : null;

      if (nextLesson && nextLesson.canAccess !== false) {
        navigate({
          to: "/lesson/$lessonId",
          params: { lessonId: nextLesson._id || nextLesson.id },
        });
        return;
      }

      navigate({
        to: "/courses/$courseId",
        params: { courseId: String(lesson.courseId) },
      });
    } catch (err) {
      console.error("Failed to navigate to next lesson:", err);
      setSidebarRefreshKey((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const el = contentScrollRef.current;
    if (!el || !lesson?._id) return;

    setReadingProgress(0);

    const handleScroll = () => {
      const now = Date.now();
      const currentScrollTop = el.scrollTop;

      const deltaY = Math.abs(
        currentScrollTop - lastScrollRef.current.scrollTop,
      );
      const deltaTime = Math.max(now - lastScrollRef.current.time, 1);
      const speed = deltaY / deltaTime;

      lastScrollRef.current = {
        scrollTop: currentScrollTop,
        time: now,
      };

      // Nếu scroll quá nhanh thì không tính progress
      // Có thể chỉnh 2.2 thấp hơn/cao hơn tuỳ cảm giác
      //if (speed > 2.2) return;

      const maxScroll = el.scrollHeight - el.clientHeight;

      if (maxScroll <= 0) {
        setReadingProgress(100);
        return;
      }

      const nextProgress = Math.round((currentScrollTop / maxScroll) * 100);

      setReadingProgress((prev) => Math.max(prev, nextProgress));
    };

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [lesson?._id]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-fixed-dim border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle size={48} className="text-on-surface-variant mb-4" />
        <h2 className="font-headline-md text-on-surface mb-2">
          Lesson Not Found
        </h2>
        <p className="text-on-surface-variant">
          We couldn't find the lesson you were looking for.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-primary-fixed-dim/20 text-primary-fixed-dim px-6 py-2 rounded-lg font-bold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-80px)] bg-surface overflow-hidden relative">
      {/* Cột trái: Sidebar (Danh sách bài học) */}
      {lesson && lesson.courseId && (
        <aside
          className={`
      shrink-0 overflow-hidden transition-all duration-300 ease-in-out
      ${isSidebarOpen ? "w-[380px]" : "w-0"}
    `}
        >
          <div
            className={`
        h-full transition-opacity duration-200
        ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
          >
            <CourseSidebar
              courseId={lesson.courseId}
              currentLessonId={lesson._id}
              currentLessonProgress={readingProgress}
              currentLessonCompleted={quizPassed}
              refreshKey={sidebarRefreshKey}
            />
          </div>
        </aside>
      )}

      {/* Nút mở/ẩn sidebar nằm giữa mép phải sidebar */}
      {/* Sidebar Toggle Button */}
      {lesson && lesson.courseId && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className={`
      hidden lg:flex fixed top-[96px] z-50 h-10 w-10 items-center justify-center
      rounded-full border border-outline/30 bg-surface-container text-on-surface-variant
      shadow-lg transition-all duration-300
      hover:border-primary-fixed-dim hover:text-primary-fixed-dim hover:bg-surface-container-high
      ${isSidebarOpen ? "left-[415px]" : "left-4"}
    `}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? <ChevronLeft size={22} /> : <Menu size={22} />}
        </button>
      )}
      {/* Cột phải: Nội dung bài học */}
      <main
        ref={contentScrollRef}
        className="flex-1 w-full relative pb-20 px-4 md:px-10 lg:px-16 overflow-y-auto custom-scrollbar"
      >
        {/* Mobile Hamburger menu */}
        <div className="lg:hidden mt-4 mb-6 flex items-center justify-between border-b border-outline-variant pb-4">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <Menu size={20} />
            <span className="font-label-sm tracking-widest text-[11px] uppercase font-bold">
              Danh sách bài học
            </span>
          </button>
          <span className="font-label-sm text-primary-fixed-dim tracking-widest text-[10px] uppercase border border-primary-fixed-dim/30 px-2 py-1 rounded bg-primary-fixed-dim/10">
            Bài 2
          </span>
        </div>

        <div className="max-w-[900px] mx-auto lg:pt-10">
          {/* Back navigation (chỉ hiện trên Mobile, vì Desktop có nút ở Sidebar) */}
          <button
            onClick={() => window.history.back()}
            className="lg:hidden inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-[13px] font-bold mb-8 uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Back to Modules
          </button>

          {/* Current Lesson Dashboard Info */}
          <div className="bg-surface-variant/20 border border-outline/20 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-lg">
            <div className="p-4 bg-primary-fixed-dim/10 rounded-xl flex-shrink-0">
              <PlayCircle
                className="text-4xl text-primary-fixed-dim"
                size={36}
              />
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-bold text-primary-fixed-dim uppercase tracking-widest mb-1">
                Currently Learning
              </div>
              <h2 className="font-headline-sm text-on-surface text-[20px] mb-2 font-bold">
                {lesson.title}
              </h2>
              <p className="text-on-surface-variant text-[14px] line-clamp-2">
                {lesson.description ||
                  "Review the concepts from this lesson before taking the quiz. Make sure you understand the core logic!"}
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0 w-full md:w-auto">
              <div className="flex items-center gap-2 text-[13px] font-bold text-on-surface-variant">
                <Medal size={18} className="text-[#4ade80]" />
                XP Reward: {lesson.points || 100}
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold text-on-surface-variant">
                <Flame size={18} className="text-[#f87171]" />
                Difficulty:{" "}
                <span className="capitalize">
                  {lesson.difficulty || "Normal"}
                </span>
              </div>
            </div>
          </div>

          {/* Lesson Header */}
          <header className="mb-10 pb-8 border-b border-outline/20">
            <div className="inline-block px-3 py-1 bg-primary-fixed-dim/10 text-primary-fixed-dim border border-primary-fixed-dim/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
              Lesson Content
            </div>
            <h1 className="font-headline-lg text-[32px] md:text-[42px] font-bold text-on-surface leading-tight mb-4">
              {lesson.title}
            </h1>
          </header>

          {/* Markdown Content */}
          <article className="markdown-body font-body-md text-on-surface text-[15px] leading-relaxed mb-16">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {lesson.content}
            </ReactMarkdown>
          </article>

          {/* Next Lesson Button */}
          {(lesson.status === "completed" || quizPassed) && (
            <div className="mt-8 flex justify-end gap-4 border-t border-outline/20 pt-6">
              {lesson.nextLessonId ? (
                <button
                  onClick={() => {
                    navigate({
                      to: "/lesson/$lessonId",
                      params: { lessonId: lesson.nextLessonId },
                    });
                  }}
                  className="bg-primary-fixed-dim text-on-primary-fixed font-bold px-8 py-3.5 rounded-xl hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,218,248,0.4)]"
                >
                  Next Lesson
                  <ArrowRight size={20} />
                </button>
              ) : (
                <Link
                  to="/courses/$courseId"
                  params={{ courseId: String(lesson.courseId) }}
                  className="bg-primary-fixed-dim text-on-primary-fixed font-bold px-8 py-3.5 rounded-xl hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,218,248,0.4)]"
                >
                  Back to Course Curriculum
                  <ClipboardList size={20} />
                </Link>
              )}
            </div>
          )}

          {/* Quiz Section */}
          <LessonQuiz
            key={lesson._id}
            lessonId={lesson._id}
            onQuizPassed={handleQuizPassed}
            onFinishReview={handleFinishReview}
          />
        </div>
      </main>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative flex-1 flex flex-col max-w-[320px] w-full bg-surface-container-low h-full shadow-2xl transition-transform duration-300">
            <div className="absolute top-4 right-4 z-50">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline/20 shadow-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 h-full overflow-hidden">
              <CourseSidebar
                courseId={lesson.courseId}
                currentLessonId={lesson._id}
                currentLessonProgress={readingProgress}
                currentLessonCompleted={quizPassed}
                refreshKey={sidebarRefreshKey}
                className="flex w-full h-full flex-col z-20 bg-surface-container-low"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonDetailPage;
