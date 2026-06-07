import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { courseApi } from '../api/course.api';

const CourseSidebarChapter = ({ chapter, index, currentLessonId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi.getLessons(chapter._id)
      .then(data => {
        setLessons(data || []);
        // Nếu bài học hiện tại nằm trong chương này, tự động mở Accordion
        if (data.some(l => l._id === currentLessonId)) {
          setIsOpen(true);
        }
      })
      .catch(() => setLessons([]))
      .finally(() => setLoading(false));
  }, [chapter._id, currentLessonId]);

  return (
    <div className="border-b border-[#1e293b] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-4 hover:bg-[#161B22] transition-colors"
      >
        <div className="flex flex-col items-start pr-4 text-left">
          <h4 className="font-headline-sm text-[14px] font-bold text-white group-hover:text-primary-fixed transition-colors">
            {index + 1}. {chapter.title}
          </h4>
          <span className="font-label-sm text-[11px] text-on-surface-variant mt-1 tracking-wider uppercase">
            {lessons.length} Bài học
          </span>
        </div>
        <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Tối ưu render bằng cách ẩn hiện class thay vì unmount */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col bg-[#0b1118] py-2">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-primary-fixed-dim/60 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : lessons.length > 0 ? (
            lessons.map((lesson, idx) => {
              const isActive = lesson._id === currentLessonId;
              return (
                <Link
                  key={lesson._id}
                  to="/lesson/$lessonId"
                  params={{ lessonId: lesson._id }}
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive ? 'bg-primary-fixed-dim/15 border-l-2 border-primary-fixed-dim' : 'hover:bg-[#121c25] border-l-2 border-transparent'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-primary-fixed-dim/20 text-primary-fixed-dim' : 'bg-transparent text-on-surface-variant/50 border border-on-surface-variant/30'
                  }`}>
                    {isActive ? (
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                    ) : (
                      <span className="material-symbols-outlined text-[14px]">lock_open</span> // Mặc định giả lập unlocked
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h5 className={`font-body-md text-[13.5px] truncate ${isActive ? 'text-primary-fixed-dim font-bold' : 'text-on-surface-variant/90'}`}>
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
              Chưa có bài học nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CourseSidebar = ({ courseId, currentLessonId }) => {
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    
    // Lấy thông tin khoá học (để lấy tên) và danh sách chương
    Promise.all([
      courseApi.getCourses().then(res => res.find(c => c._id === courseId)),
      courseApi.getChapters(courseId)
    ])
    .then(([courseData, chaptersData]) => {
      setCourse(courseData);
      setChapters(chaptersData || []);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [courseId]);

  return (
    <aside className="hidden lg:flex w-[340px] xl:w-[380px] shrink-0 bg-[#121c25] border-r border-[#1e293b] h-full flex-col z-20">
      {/* Header Info */}
      <div className="p-5 border-b border-[#1e293b] bg-surface">
        <Link to="/course" className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-white font-label-sm tracking-widest uppercase text-[10px] mb-3 transition-colors">
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          Trở về khoá học
        </Link>
        <h2 className="font-headline-sm text-[18px] font-bold text-white mb-4 line-clamp-2">
          {course ? course.title : 'Đang tải...'}
        </h2>
        
        {/* Progress Bar (Demo) */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-sm text-[11px] tracking-wider text-on-surface-variant/80 uppercase">
            2 / {course ? course.totalLessons : '--'} bài học
          </span>
          <span className="font-bold text-[12px] text-primary-fixed-dim">
            4%
          </span>
        </div>
        <div className="h-[4px] bg-[#1b2532] rounded-full overflow-hidden">
          <div className="h-full bg-primary-fixed-dim w-[4%] rounded-full shadow-[0_0_10px_rgba(0,218,248,0.4)]" />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 custom-scrollbar">

        {/* Chapters Accordion */}
        <div className="mt-2 pb-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary-fixed-dim/50 border-t-primary-fixed-dim rounded-full animate-spin" />
            </div>
          ) : chapters.map((chapter, index) => (
            <CourseSidebarChapter 
              key={chapter._id} 
              chapter={chapter} 
              index={index} 
              currentLessonId={currentLessonId} 
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CourseSidebar;
