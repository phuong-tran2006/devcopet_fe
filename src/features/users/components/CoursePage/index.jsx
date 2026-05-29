import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import Logo from '../../../../components/layout/Logo';
import { getCourses } from '../../../../services/api';

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
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

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

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
);

// Loading Skeleton Component
const CourseCardSkeleton = () => (
  <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl overflow-hidden animate-pulse">
    <div className="h-32 bg-[#3e494920]" />
    <div className="p-5">
      <div className="h-6 bg-[#3e494920] rounded w-24 mb-2" />
      <div className="h-4 bg-[#3e494920] rounded w-full mb-4" />
      <div className="h-10 bg-[#3e494920] rounded" />
    </div>
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
      {message || 'Failed to load courses'}
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-[#76d6d5] text-[#041521] rounded-lg font-medium hover:bg-[#76d6d5cc] transition-colors"
    >
      Try Again
    </button>
  </div>
);

const CoursePage = () => {
  const navItems = ['Tutorial', 'Roadmap', 'Community', 'About'];
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  
  // API State
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCourses();
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRetry = () => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCourses();
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  };

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
          <div className="mb-6">
            <h1
              className="text-3xl font-bold text-[#d4e4f6] mb-2"
              style={{ fontFamily: 'Montserrat', textShadow: '0px 0px 20px #76d6d530' }}
            >
              ALL LESSON
            </h1>
            <p className="text-sm text-[#bdc9c8] mb-4" style={{ fontFamily: 'Roboto' }}>
              Choose a programming language to start learning
            </p>

            {/* Sort Dropdown */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>Sort by:</span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d1d2a] border border-[#3e4949] rounded-lg text-sm text-[#d4e4f6] hover:border-[#76d6d5] transition-colors">
                  <span style={{ fontFamily: 'Roboto' }}>Most Popular</span>
                  <ChevronDownIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#bdc9c8]">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for courses..."
              className="w-full pl-12 pr-4 py-3 bg-[#0d1d2a] border border-[#3e4949] rounded-xl text-[#d4e4f6] placeholder-[#bdc9c8] focus:outline-none focus:border-[#76d6d5] transition-colors"
              style={{ fontFamily: 'Roboto' }}
            />
          </div>

          {/* Error State */}
          {error && !loading && (
            <ErrorState message={error} onRetry={handleRetry} />
          )}

          {/* Course Grid (3 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              // Loading skeletons
              <>
                <CourseCardSkeleton />
                <CourseCardSkeleton />
                <CourseCardSkeleton />
              </>
            ) : (
              // Course cards
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl overflow-hidden hover:border-[#76d6d5] transition-all duration-200 group"
                  style={{ boxShadow: '0px 4px 15px #00000025' }}
                >
                  {/* Course Header with Gradient */}
                  <div
                    className="h-32 relative flex items-center justify-center"
                    style={{
                      background: course.progress > 0
                        ? 'linear-gradient(135deg, #76d6d515 0%, #d8bfd810 100%)'
                        : 'linear-gradient(135deg, #3e494915 0%, transparent 100%)',
                    }}
                  >
                    <span className="text-6xl">{course.icon}</span>

                    {/* Progress Indicator */}
                    {course.progress > 0 && (
                      <div className="absolute top-3 right-3">
                        <div className="px-2 py-1 bg-[#04152180] rounded-full">
                          <span className="text-xs text-[#76d6d5] font-medium" style={{ fontFamily: 'Roboto' }}>
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-5">
                    {/* Course Name */}
                    <h3
                      className="text-lg font-semibold text-[#d4e4f6] mb-2"
                      style={{ fontFamily: 'Montserrat' }}
                    >
                      {course.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#bdc9c8] mb-4 line-clamp-2" style={{ fontFamily: 'Roboto' }}>
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                            {course.completed}/{course.lessons} lessons
                          </span>
                          <span className="text-xs text-[#76d6d5]" style={{ fontFamily: 'Roboto' }}>
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#3e4949] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#76d6d5] rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Continue Button - Now uses route params */}
                    <Link
                      to="/chapter/$courseId"
                      params={{ courseId: course.id }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#76d6d5] text-[#041521] rounded-lg font-medium hover:bg-[#76d6d5cc] transition-colors"
                      style={{ fontFamily: 'Roboto' }}
                    >
                      <PlayIcon />
                      {course.progress > 0 ? 'Continue' : 'Start'}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More / Pagination */}
          {!loading && !error && filteredCourses.length > 0 && (
            <div className="flex items-center justify-center">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-[#0d1d2a] border border-[#3e4949] text-[#bdc9c8] rounded-xl hover:border-[#76d6d5] hover:text-[#76d6d5] transition-colors"
                style={{ fontFamily: 'Roboto' }}
              >
                <span>Load More Courses</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
          )}

          {/* No results found */}
          {!loading && !error && filteredCourses.length === 0 && courses.length > 0 && (
            <div className="text-center py-12">
              <p className="text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                No courses found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
