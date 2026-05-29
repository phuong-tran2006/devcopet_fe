import React, { useState, useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import Logo from '../../../../components/layout/Logo';
import { getCourse, getCourseChapters } from '../../../../services/api';

// Color palette
const colors = {
  bgDark: '#041521',
  cardBg: '#0d1d2a',
  border: '#3e4949',
  textPrimary: '#d4e4f6',
  textSecondary: '#bdc9c8',
  accentTeal: '#76d6d5',
  accentPurple: '#d8bfd8',
};

// Icon components
const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const FunctionIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L6.75 2.906" />
  </svg>
);

const DataIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Icon mapping
const getIconComponent = (iconName) => {
  const icons = {
    book: BookIcon,
    code: CodeIcon,
    function: FunctionIcon,
    data: DataIcon,
  };
  return icons[iconName] || BookIcon;
};

// Loading Skeleton Component
const ChapterSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-5 ml-4 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#3e494920] rounded-xl" />
            <div>
              <div className="h-5 bg-[#3e494920] rounded w-32 mb-2" />
              <div className="h-4 bg-[#3e494920] rounded w-24" />
            </div>
          </div>
        </div>
        <div className="space-y-2 ml-14">
          {[1, 2].map((j) => (
            <div key={j} className="flex items-center gap-3 p-3 rounded-lg border bg-[#04152180] border-[#3e4949]">
              <div className="w-8 h-8 bg-[#3e494920] rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-[#3e494920] rounded w-32 mb-1" />
                <div className="h-3 bg-[#3e494920] rounded w-48" />
              </div>
              <div className="w-16 h-6 bg-[#3e494920] rounded" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Error State Component
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 mb-4 rounded-full bg-[#ff5f5620] flex items-center justify-center">
      <svg className="w-8 h-8 text-[#ff5f56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>
    <p className="text-[#bdc9c8] mb-4" style={{ fontFamily: 'Roboto' }}>
      {message || 'Failed to load chapters'}
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-[#76d6d5] text-[#041521] rounded-lg font-medium hover:bg-[#76d6d5cc] transition-colors"
    >
      Try Again
    </button>
  </div>
);

const ChapterPage = () => {
  const { courseId } = useParams({ from: '/chapter/$courseId' });
  const navItems = ['Tutorial', 'Roadmap', 'Community', 'About'];

  // API State
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course and chapters
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseResponse, chaptersResponse] = await Promise.all([
          getCourse(courseId),
          getCourseChapters(courseId),
        ]);
        const courseData = await courseResponse.json();
        const chaptersData = await chaptersResponse.json();
        setCourse(courseData);
        setChapters(chaptersData);
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const handleRetry = () => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseResponse, chaptersResponse] = await Promise.all([
          getCourse(courseId),
          getCourseChapters(courseId),
        ]);
        const courseData = await courseResponse.json();
        const chaptersData = await chaptersResponse.json();
        setCourse(courseData);
        setChapters(chaptersData);
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  const getStatusBadge = (status, rank) => {
    const badgeStyles = {
      completed: 'bg-[#76d6d520] text-[#76d6d5]',
      active: 'bg-[#d8bfd820] text-[#d8bfd8]',
      locked: 'bg-[#3e494920] text-[#bdc9c8]',
    };

    const statusText = {
      completed: `100% Completed • ${rank} Rank`,
      active: `In Progress • ${rank} Rank`,
      locked: `Locked • ${rank} Rank`,
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyles[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  const getLessonIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckIcon />;
      case 'active':
        return <PlayIcon />;
      default:
        return <LockIcon />;
    }
  };

  const getLessonStyles = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-[#76d6d510] border-[#76d6d540]';
      case 'active':
        return 'bg-[#d8bfd810] border-[#d8bfd840]';
      default:
        return 'bg-[#04152180] border-[#3e4949] opacity-60';
    }
  };

  const getLessonLink = (lesson) => {
    // Navigate to lesson detail page
    return `/lesson/detail/${lesson.id}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-[#041521]">
        <header
          className="shrink-0 w-full h-16 bg-[#041521] border-b border-[#3e4949] flex items-center px-6"
          style={{ boxShadow: '0px 4px 20px #00808019' }}
        >
          <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to="/"
                  className="text-sm font-medium text-[#bdc9c8] hover:text-[#76d6d5] transition-colors duration-200"
                  style={{ fontFamily: 'Roboto' }}
                >
                  {item}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-[#d8bfd8] text-[#041521] font-semibold flex items-center justify-center">
                Y
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 py-8 px-6">
          <div className="max-w-[1024px] mx-auto">
            {/* Header Skeleton */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <div className="h-4 bg-[#3e494920] rounded w-24 mb-3" />
                <div className="h-8 bg-[#3e494920] rounded w-64 mb-2" />
                <div className="h-4 bg-[#3e494920] rounded w-96" />
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="h-8 bg-[#3e494920] rounded w-32" />
                <div className="w-40 h-6 bg-[#3e494920] rounded" />
              </div>
            </div>
            <ChapterSkeleton />
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-[#041521]">
        <header
          className="shrink-0 w-full h-16 bg-[#041521] border-b border-[#3e4949] flex items-center px-6"
          style={{ boxShadow: '0px 4px 20px #00808019' }}
        >
          <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to="/"
                  className="text-sm font-medium text-[#bdc9c8] hover:text-[#76d6d5] transition-colors duration-200"
                  style={{ fontFamily: 'Roboto' }}
                >
                  {item}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-[#d8bfd8] text-[#041521] font-semibold flex items-center justify-center">
                Y
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 py-8 px-6">
          <div className="max-w-[1024px] mx-auto">
            <ErrorState message={error} onRetry={handleRetry} />
          </div>
        </main>
      </div>
    );
  }

  // Not found state
  if (!course) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-[#041521]">
        <header
          className="shrink-0 w-full h-16 bg-[#041521] border-b border-[#3e4949] flex items-center px-6"
          style={{ boxShadow: '0px 4px 20px #00808019' }}
        >
          <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
            <Logo />
          </div>
        </header>
        <main className="flex-1 py-8 px-6">
          <div className="max-w-[1024px] mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#d4e4f6] mb-4">Course Not Found</h2>
            <p className="text-[#bdc9c8] mb-4">The course you're looking for doesn't exist.</p>
            <Link
              to="/course"
              className="px-4 py-2 bg-[#76d6d5] text-[#041521] rounded-lg font-medium hover:bg-[#76d6d5cc] transition-colors inline-block"
            >
              Back to Courses
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#041521]">
      {/* Header (64px) */}
      <header
        className="shrink-0 w-full h-16 bg-[#041521] border-b border-[#3e4949] flex items-center px-6"
        style={{ boxShadow: '0px 4px 20px #00808019' }}
      >
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item}
                to="/"
                className="text-sm font-medium text-[#bdc9c8] hover:text-[#76d6d5] transition-colors duration-200"
                style={{ fontFamily: 'Roboto' }}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right: Icons and User */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors">
              <BellIcon />
            </button>
            <button className="p-2 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors">
              <MessageIcon />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#d8bfd8] text-[#041521] font-semibold flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              Y
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-[1024px] mx-auto">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8">
            {/* Left: Breadcrumb, Title, Description */}
            <div className="flex-1">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-3">
                <Link
                  to="/course"
                  className="text-sm text-[#bdc9c8] hover:text-[#76d6d5] transition-colors"
                  style={{ fontFamily: 'Roboto' }}
                >
                  {course.name}
                </Link>
                <span className="text-sm text-[#3e4949]">›</span>
                <span className="text-sm text-[#76d6d5]" style={{ fontFamily: 'Roboto' }}>
                  Chapter
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-3xl font-bold text-[#d4e4f6] mb-2"
                style={{ fontFamily: 'Montserrat', textShadow: '0px 0px 20px #76d6d530' }}
              >
                Master {course.name} Curriculum
              </h1>

              {/* Description */}
              <p className="text-sm text-[#bdc9c8] max-w-lg" style={{ fontFamily: 'Roboto' }}>
                {course.description}
              </p>
            </div>

            {/* Right: Stats Sidebar */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-[#bdc9c8] mb-1" style={{ fontFamily: 'Roboto' }}>
                    Students
                  </div>
                  <div className="text-lg font-bold text-[#d4e4f6]" style={{ fontFamily: 'Montserrat' }}>
                    {course.totalStudents?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#bdc9c8] mb-1" style={{ fontFamily: 'Roboto' }}>
                    Lessons
                  </div>
                  <div className="text-lg font-bold text-[#d4e4f6]" style={{ fontFamily: 'Montserrat' }}>
                    {course.totalLessons || 0}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-40">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                    Progress
                  </span>
                  <span className="text-xs font-medium text-[#76d6d5]" style={{ fontFamily: 'Roboto' }}>
                    {course.progress || 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#3e4949] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#76d6d5] rounded-full"
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Rank Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#76d6d520] rounded-full">
                <div className="w-3 h-3 rounded-full bg-[#76d6d5]" />
                <span className="text-sm font-medium text-[#76d6d5]" style={{ fontFamily: 'Roboto' }}>
                  {course.rank} Rank
                </span>
              </div>
            </div>
          </div>

          {/* Curriculum Timeline */}
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#3e4949]" />

            {/* Modules */}
            <div className="space-y-6">
              {chapters.map((chapter, moduleIndex) => {
                const ModuleIcon = getIconComponent(chapter.icon);
                return (
                  <div key={chapter.id} className="relative">
                    {/* Module Card */}
                    <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-5 ml-4">
                      {/* Module Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {/* Module Icon */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              chapter.status === 'completed'
                                ? 'bg-[#76d6d520] text-[#76d6d5]'
                                : chapter.status === 'active'
                                ? 'bg-[#d8bfd820] text-[#d8bfd8]'
                                : 'bg-[#3e494920] text-[#bdc9c8]'
                            }`}
                          >
                            <ModuleIcon />
                          </div>

                          {/* Module Title & Subtitle */}
                          <div>
                            <h3
                              className="text-base font-semibold text-[#d4e4f6]"
                              style={{ fontFamily: 'Montserrat' }}
                            >
                              {chapter.title}
                            </h3>
                            <p className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                              {chapter.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {getStatusBadge(chapter.status, chapter.rank)}
                      </div>

                      {/* Lessons */}
                      <div className="space-y-2 ml-14">
                        {chapter.lessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            to="/lesson/detail/$lessonId"
                            params={{ lessonId: lesson.id.toString() }}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:border-[#76d6d5] ${getLessonStyles(lesson.status)}`}
                          >
                            {/* Lesson Icon */}
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                lesson.status === 'completed'
                                  ? 'bg-[#76d6d520] text-[#76d6d5]'
                                  : lesson.status === 'active'
                                  ? 'bg-[#d8bfd820] text-[#d8bfd8]'
                                  : 'bg-[#3e494920] text-[#bdc9c8]'
                              }`}
                            >
                              {getLessonIcon(lesson.status)}
                            </div>

                            {/* Lesson Content */}
                            <div className="flex-1">
                              <h4
                                className={`text-sm font-medium ${
                                  lesson.status === 'locked' ? 'text-[#bdc9c8]' : 'text-[#d4e4f6]'
                                }`}
                                style={{ fontFamily: 'Roboto' }}
                              >
                                {lesson.title}
                              </h4>
                              <p className="text-xs text-[#bdc9c8] hidden sm:block" style={{ fontFamily: 'Roboto' }}>
                                {lesson.description}
                              </p>
                            </div>

                            {/* Duration Pill */}
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                lesson.status === 'locked'
                                  ? 'bg-[#3e494920] text-[#bdc9c8]'
                                  : 'bg-[#0d1d2a] text-[#bdc9c8]'
                              }`}
                              style={{ fontFamily: 'Roboto' }}
                            >
                              {lesson.duration}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Achievement Card */}
          <div className="mt-8 bg-gradient-to-r from-[#d8bfd820] to-[#76d6d510] border border-[#d8bfd840] rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#d8bfd820] flex items-center justify-center text-[#d8bfd8]">
                <TrophyIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#d4e4f6]" style={{ fontFamily: 'Montserrat' }}>
                  Featured Achievement
                </h3>
                <p className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                  {course.name}ista's Awakening
                </p>
              </div>
              <div className="flex items-center gap-1">
                <StarIcon />
                <span className="text-sm font-medium text-[#d8bfd8]" style={{ fontFamily: 'Roboto' }}>
                  +50 XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB: Start Next Lesson */}
      <button
        className="fixed bottom-8 right-8 flex items-center gap-2 px-5 py-3 bg-[#76d6d5] text-[#041521] rounded-xl font-semibold shadow-lg hover:bg-[#65c5c4] transition-all duration-200"
        style={{ fontFamily: 'Montserrat', boxShadow: '0px 4px 20px #76d6d540' }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        Start Next Lesson
      </button>
    </div>
  );
};

export default ChapterPage;
