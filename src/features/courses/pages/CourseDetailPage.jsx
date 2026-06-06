import React, { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { courseApi } from '../api/course.api';

/* ───────────── Helper: Dot Grid Decoration ───────────── */
const DotGrid = ({ className = '', rows = 5, cols = 5 }) => (
  <div className={`absolute pointer-events-none opacity-20 ${className}`}>
    <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 12px)`, gap: '10px' }}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="w-[3px] h-[3px] rounded-full bg-on-surface-variant" />
      ))}
    </div>
  </div>
);

/* ───────────── Module Icon component ───────────── */
const ModuleIcon = ({ index, isActive }) => {
  const icons = ['play_lesson', 'hub', 'functions', 'data_object', 'terminal', 'code_blocks'];
  const icon = icons[index % icons.length];
  return (
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
      isActive
        ? 'bg-secondary-fixed-dim/20 text-secondary-fixed-dim border border-secondary-fixed-dim/30'
        : 'bg-[#1b2532] text-on-surface-variant/40 border border-[#1e293b]'
    }`}>
      <span className="material-symbols-outlined text-[24px]">{icon}</span>
    </div>
  );
};

/* ───────────── Status Badge ───────────── */
const StatusBadge = ({ status }) => {
  const config = {
    mastered: {
      label: 'MASTERED',
      color: 'text-primary-fixed-dim',
      barColor: 'bg-primary-fixed-dim',
    },
    in_progress: {
      label: 'IN PROGRESS',
      color: 'text-secondary-fixed-dim',
      barColor: 'bg-secondary-fixed-dim',
    },
    unlocked: {
      label: 'UNLOCKED',
      color: 'text-on-surface-variant/60',
      barColor: 'bg-transparent',
    },
    locked: {
      label: 'LOCKED',
      color: 'text-on-surface-variant/30',
      barColor: 'bg-transparent',
    },
  };

  const c = config[status] || config.unlocked;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <span className={`font-label-sm text-[11px] tracking-[0.1em] ${c.color}`}>
        {c.label}
      </span>
      {(status === 'mastered' || status === 'in_progress') && (
        <div className={`h-[3px] w-16 rounded-full ${c.barColor}`} />
      )}
    </div>
  );
};

/* ───────────── Lesson Card ───────────── */
const LessonCard = ({ lesson, lessonIndex, isModuleActive }) => {
  // For demo: first lesson mastered, second in_progress, rest unlocked/locked
  const getStatus = () => {
    if (!isModuleActive) return 'locked';
    if (lessonIndex === 0) return 'mastered';
    if (lessonIndex === 1) return 'in_progress';
    return 'unlocked';
  };

  const status = getStatus();
  const isClickable = status !== 'locked';

  const iconMap = {
    mastered: 'check_circle',
    in_progress: 'play_circle',
    unlocked: 'lock_open',
    locked: 'lock',
  };

  const borderColor = {
    mastered: 'border-primary-fixed-dim/40 hover:border-primary-fixed-dim/70',
    in_progress: 'border-secondary-fixed-dim/40 hover:border-secondary-fixed-dim/70',
    unlocked: 'border-[#1e293b] hover:border-[#2a3a4d]',
    locked: 'border-transparent',
  };

  const iconColor = {
    mastered: 'text-primary-fixed-dim',
    in_progress: 'text-secondary-fixed-dim',
    unlocked: 'text-on-surface-variant/50',
    locked: 'text-on-surface-variant/25',
  };

  const Wrapper = isClickable ? Link : 'div';
  const wrapperProps = isClickable
    ? { to: '/lesson/$lessonId', params: { lessonId: lesson._id } }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`flex items-center justify-between px-6 py-5 rounded-xl border transition-all duration-300 group
        ${borderColor[status]}
        ${isClickable ? 'cursor-pointer bg-[#121c25]/60 hover:bg-[#1b2532]/80' : 'cursor-default bg-transparent opacity-40'}
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
          status === 'mastered' ? 'border-primary-fixed-dim/40 bg-primary-fixed-dim/10' :
          status === 'in_progress' ? 'border-secondary-fixed-dim/40 bg-secondary-fixed-dim/10' :
          'border-[#1e293b] bg-transparent'
        }`}>
          <span className={`material-symbols-outlined text-[20px] ${iconColor[status]}`}>
            {iconMap[status]}
          </span>
        </div>
        <div>
          <h4 className={`font-body-md text-[15px] font-semibold ${isClickable ? 'text-white group-hover:text-primary-fixed' : 'text-on-surface-variant/40'} transition-colors`}>
            {lesson.title}
          </h4>
          {lesson.description && (
            <p className={`font-body-md text-[13px] mt-0.5 ${isClickable ? 'text-on-surface-variant/70' : 'text-on-surface-variant/25'}`}>
              {lesson.description}
            </p>
          )}
        </div>
      </div>
      <StatusBadge status={status} />
    </Wrapper>
  );
};

/* ───────────── Module Section ───────────── */
const ModuleSection = ({ chapter, index, totalModules }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // First module active, rest locked (demo logic)
  const isActive = index === 0;

  useEffect(() => {
    courseApi.getLessons(chapter._id)
      .then(data => setLessons(data || []))
      .catch(() => setLessons([]))
      .finally(() => setLoading(false));
  }, [chapter._id]);

  const getRankLabel = () => {
    const ranks = ['Moss Green Rank', 'Teal Rank', 'Thistle Rank', 'Amber Rank', 'Crimson Rank'];
    return ranks[index % ranks.length];
  };

  return (
    <section className="relative mb-16">
      {/* Dot Grids - decorative */}
      <DotGrid className="-right-4 top-0" rows={4} cols={3} />
      <DotGrid className="-left-4 bottom-4" rows={3} cols={3} />

      {/* Module Header */}
      <div className="flex items-start gap-4 mb-6">
        <ModuleIcon index={index} isActive={isActive} />
        <div>
          <h2 className={`font-headline-sm text-[20px] md:text-[22px] font-bold ${isActive ? 'text-white' : 'text-on-surface-variant/40'}`}>
            Module {index + 1}: {chapter.title}
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            {isActive ? (
              <>
                <span className="font-label-sm text-[11px] text-primary-fixed-dim tracking-[0.08em]">
                  100% Completed
                </span>
                <span className="text-on-surface-variant/40 text-[11px]">•</span>
                <span className="font-label-sm text-[11px] text-secondary-fixed-dim tracking-[0.08em]">
                  {getRankLabel()}
                </span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant/30">lock</span>
                <span className="font-label-sm text-[11px] text-on-surface-variant/30 tracking-[0.08em]">
                  Locked
                </span>
                <span className="text-on-surface-variant/20 text-[11px]">•</span>
                <span className="font-label-sm text-[11px] text-on-surface-variant/30 tracking-[0.08em]">
                  {getRankLabel()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="ml-0 md:ml-[72px] flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-7 h-7 border-2 border-primary-fixed-dim/60 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : lessons.length > 0 ? (
          lessons.map((lesson, idx) => (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              lessonIndex={idx}
              isModuleActive={isActive}
            />
          ))
        ) : (
          <div className="text-on-surface-variant/40 font-body-md text-[14px] py-4 pl-2">
            No lessons available yet.
          </div>
        )}
      </div>

      {/* Separator line */}
      {index < totalModules - 1 && (
        <div className="mt-12 border-t border-[#1e293b]/60" />
      )}
    </section>
  );
};

/* ═══════════════ MAIN PAGE ═══════════════ */
const CourseDetailPage = () => {
  const { courseId } = useParams({ strict: false });
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    courseApi.getCourses()
      .then(courses => {
        const found = courses.find(c => c.slug === courseId || c._id === courseId);
        if (!found) throw new Error('Course not found');
        setCourse(found);
        return courseApi.getChapters(found._id);
      })
      .then(data => setChapters(data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    document.title = course ? `${course.title} - Devcopet` : 'Course - Devcopet';
  }, [course]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-fixed-dim border-t-transparent rounded-full animate-spin" />
          <span className="font-label-sm text-[11px] text-on-surface-variant tracking-[0.15em] uppercase">
            Loading Curriculum...
          </span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4">error</span>
        <h2 className="font-headline-md text-white mb-2">Course Not Found</h2>
        <p className="text-on-surface-variant">The course you're looking for doesn't exist.</p>
        <Link
          to="/course"
          className="mt-6 bg-primary-fixed-dim/20 text-primary-fixed-dim px-6 py-2.5 rounded-lg font-bold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-all"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  // Stats
  const totalLessons = course.totalLessons || chapters.reduce((sum, ch) => sum + (ch.totalLessons || 0), 0);
  const totalModules = chapters.length || course.totalChapters || 0;

  return (
    <main className="w-full relative pb-20 min-h-screen">
      <div className="max-w-[1100px] mx-auto px-4 md:px-10 lg:px-16 pt-8">

        {/* ─── Hero Section ─── */}
        <section className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-16">

          {/* Left: Course Info */}
          <div className="flex-1">
            {/* Back + Badge */}
            <Link
              to="/course"
              className="inline-flex items-center gap-2 text-on-surface-variant/60 hover:text-white transition-colors text-[12px] font-bold mb-6 uppercase tracking-[0.15em]"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              All Courses
            </Link>

            <div className="flex items-center gap-4 mb-5 flex-wrap">
              <span className="inline-block px-3.5 py-1.5 bg-primary-fixed-dim/15 text-primary-fixed-dim border border-primary-fixed-dim/30 rounded font-label-sm text-[10px] tracking-[0.15em] uppercase">
                {course.programmingLanguage ? `MASTER ${course.programmingLanguage.toUpperCase()}` : course.level?.toUpperCase()}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant/60 tracking-[0.08em]">
                • {totalModules} Modules • {totalLessons} Lessons
              </span>
            </div>

            <h1 className="font-headline-lg text-[32px] md:text-[44px] font-bold text-white leading-[1.1] tracking-tight mb-5">
              {course.title} Curriculum
            </h1>

            <p className="font-body-lg text-[16px] text-on-surface-variant leading-relaxed max-w-xl">
              {course.description || 'A gamified, comprehensive journey from zero to production-ready architecture. Level up your pets as you conquer the code.'}
            </p>
          </div>

          {/* Right: Progress Card */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-[#121c25] border border-[#1e293b] rounded-xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              {/* Progress Header */}
              <div className="flex items-center justify-between mb-5">
                <span className="font-label-sm text-[10px] text-on-surface-variant tracking-[0.15em] uppercase">
                  Overall Progress
                </span>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant/40">
                  insert_chart
                </span>
              </div>

              {/* Percentage */}
              <div className="mb-6">
                <span className="font-headline-md text-[36px] font-bold text-primary-fixed-dim">
                  42%
                </span>
                {/* Progress Bar */}
                <div className="h-1 bg-[#1b2532] rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-fixed-dim to-primary-fixed rounded-full shadow-[0_0_12px_rgba(0,218,248,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: '42%' }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1b2532] rounded-lg p-3 text-center border border-[#1e293b]">
                  <div className="font-headline-sm text-[22px] font-bold text-white">18</div>
                  <div className="font-label-sm text-[9px] text-on-surface-variant tracking-[0.12em] uppercase mt-1">
                    Mastered
                  </div>
                </div>
                <div className="bg-[#1b2532] rounded-lg p-3 text-center border border-[#1e293b]">
                  <div className="font-headline-sm text-[22px] font-bold text-white">24</div>
                  <div className="font-label-sm text-[9px] text-on-surface-variant tracking-[0.12em] uppercase mt-1">
                    Unlocked
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Modules List ─── */}
        <div className="relative">
          {chapters.map((chapter, index) => (
            <ModuleSection
              key={chapter._id}
              chapter={chapter}
              index={index}
              totalModules={chapters.length}
            />
          ))}

          {chapters.length === 0 && (
            <div className="bg-[#121c25] rounded-xl border border-[#1e293b] p-16 text-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">inventory_2</span>
              <h3 className="font-headline-sm text-white mb-2">No Modules Found</h3>
              <p className="text-on-surface-variant/60 text-[14px]">
                The curriculum for this course is still being prepared.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CourseDetailPage;
