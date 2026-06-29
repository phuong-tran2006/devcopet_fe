// @ts-nocheck
import LucideIcon from "../../../components/ui/LucideIcon";
import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { courseApi } from "../api/course.api";
import LessonProgressCircle from "./LessonProgressCircle";

const CourseSidebarChapter = ({
  chapter,
  index,
  currentLessonId,
  currentLessonProgress = 0,
  currentLessonCompleted = false,
  refreshKey = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    courseApi
      .getLessons(chapter._id)
      .then((data) => {
        const nextLessons = data || [];
        setLessons(nextLessons);
        // Nếu bài học hiện tại nằm trong chương này, tự động mở Accordion
        if (nextLessons.some((l) => l._id === currentLessonId)) {
          setIsOpen(true);
        }
      })
      .catch(() => setLessons([]))
      .finally(() => setLoading(false));
  }, [chapter._id, currentLessonId, refreshKey]);

  return (
    <div className="border-b border-outline-variant last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-4 hover:bg-surface-container-high transition-colors"
      >
        <div className="flex flex-col items-start pr-4 text-left">
          <h4 className="font-headline-sm text-[14px] font-bold text-slate-800 dark:text-on-surface group-hover:text-teal-600 dark:group-hover:text-primary-fixed transition-colors">
            {index + 1}. {chapter.title}
          </h4>
          <span className="font-label-sm text-[11px] text-slate-500 dark:text-on-surface-variant mt-1 tracking-wider uppercase">
            {lessons.length} Lesson
          </span>
        </div>
        <LucideIcon
          name="expand_more"
          className={`text-[20px] text-on-surface-variant transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Tối ưu render bằng cách ẩn hiện class thay vì unmount */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col bg-surface-container-lowest py-2">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-primary-fixed-dim/60 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : lessons.length > 0 ? (
            lessons.map((lesson, idx) => {
              const isActive = lesson._id === currentLessonId;

              const isCompleted = isActive
                ? currentLessonCompleted || lesson.status === "completed"
                : lesson.status === "completed" ||
                  lesson.quizPassed ||
                  lesson.completed;

              const progress = isActive
                ? isCompleted
                  ? 100
                  : currentLessonProgress
                : lesson.progress || (isCompleted ? 100 : 0);

              const displayProgress = isCompleted
                ? 100
                : Math.min(progress, 95);

              return (
                <Link
                  key={lesson._id}
                  to="/lesson/$lessonId"
                  params={{ lessonId: lesson._id }}
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive
                      ? "bg-teal-500/10 dark:bg-primary-fixed-dim/15 border-l-2 border-teal-600 dark:border-primary-fixed-dim"
                      : "hover:bg-slate-50 dark:hover:bg-surface-container border-l-2 border-transparent"
                  }`}
                >
                  <LessonProgressCircle
                    progress={displayProgress}
                    isActive={isActive}
                    isCompleted={isCompleted}
                  />

                  <div className="flex flex-col flex-1 min-w-0">
                    <h5
                      className={`font-body-md text-[13.5px] truncate ${
                        isActive
                          ? "text-teal-600 dark:text-primary-fixed-dim font-bold"
                          : "text-slate-700 dark:text-on-surface-variant/90"
                      }`}
                    >
                      {index + 1}.{idx + 1} {lesson.title}
                    </h5>
                  </div>

                  {lesson.estimatedMinutes && (
                    <span className="font-mono text-[11px] text-on-surface-variant/50 shrink-0">
                      {lesson.estimatedMinutes}m
                    </span>
                  )}
                </Link>
              );
            })
          ) : (
            <div className="text-on-surface-variant/40 font-body-md text-[13px] py-3 text-center">
              No lessons found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CourseSidebar = ({
  courseId,
  currentLessonId,
  currentLessonProgress = 0,
  currentLessonCompleted = false,
  refreshKey = 0,
  className = "hidden lg:flex w-[380px] shrink-0 bg-white dark:bg-surface-container-low border-r border-slate-100 dark:border-outline-variant h-full flex-col z-20",
}) => {
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);

    // Lấy thông tin khoá học (để lấy tên) và danh sách chương
    Promise.all([
      courseApi.getCourses().then((res) => res.find((c) => c._id === courseId)),
      courseApi.getChapters(courseId),
    ])
      .then(([courseData, chaptersData]) => {
        setCourse(courseData);
        setChapters(chaptersData || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId, refreshKey]);

  const totalLessons =
    chapters.reduce(
      (sum, chapter) => sum + (chapter.progress?.totalLessons || 0),
      0,
    ) ||
    course?.totalLessons ||
    0;
  const completedLessons = Math.min(
    totalLessons,
    chapters.reduce(
      (sum, chapter) => sum + (chapter.progress?.completedLessons || 0),
      0,
    ),
  );
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className={className}>
      {/* Header Info */}
      <div className="p-5 border-b border-slate-100 dark:border-outline-variant bg-white dark:bg-surface">
        {/* <Link to="/course" className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-white font-label-sm tracking-widest uppercase text-[10px] mb-3 transition-colors">
          <LucideIcon name="arrow_back" className="text-[14px]" />
          Trở về khoá học
        </Link> */}
        <h2 className="font-headline-sm text-[18px] font-bold text-slate-800 dark:text-on-surface mb-4 line-clamp-2">
          {course ? course.title : "Đang tải..."}
        </h2>

        <div className="flex items-center justify-between mb-2">
          <span className="font-label-sm text-[11px] tracking-wider text-slate-500 dark:text-on-surface-variant/80 uppercase">
            {completedLessons} / {totalLessons || "--"} lesson
          </span>
          <span className="font-bold text-[12px] text-teal-600 dark:text-primary-fixed-dim">
            {progressPercent}%
          </span>
        </div>
        <div className="h-[4px] bg-slate-100 dark:bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 dark:bg-primary-fixed-dim rounded-full shadow-[0_0_8px_rgba(13,148,136,0.3)] dark:shadow-[0_0_10px_rgba(0,218,248,0.4)] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 custom-scrollbar">
        {/* Chapters Accordion */}
        <div className="mt-2 pb-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary-fixed-dim/50 border-t-primary-fixed-dim rounded-full animate-spin" />
            </div>
          ) : (
            chapters.map((chapter, index) => (
              <CourseSidebarChapter
                key={chapter._id}
                chapter={chapter}
                index={index}
                currentLessonId={currentLessonId}
                currentLessonProgress={currentLessonProgress}
                currentLessonCompleted={currentLessonCompleted}
                refreshKey={refreshKey}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
