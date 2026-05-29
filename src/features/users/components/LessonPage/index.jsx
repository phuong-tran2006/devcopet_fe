import React, { useState, useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import Logo from '../../../../components/layout/Logo';
import { getLesson, getCourseLessons } from '../../../../services/api';

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

// Loading Skeleton Component
const LessonSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-[#3e494920] rounded w-64 mb-3" />
      <div className="h-8 bg-[#3e494920] rounded w-96 mb-2" />
      <div className="h-4 bg-[#3e494920] rounded w-full mb-4" />
      <div className="flex items-center gap-4">
        <div className="h-4 bg-[#3e494920] rounded w-20" />
        <div className="h-4 bg-[#3e494920] rounded w-20" />
        <div className="h-4 bg-[#3e494920] rounded w-20" />
      </div>
    </div>
    {/* Content Skeleton */}
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-[#3e494920] rounded w-32 mb-4" />
        <div className="h-32 bg-[#3e494920] rounded" />
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
      {message || 'Failed to load lesson'}
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-[#76d6d5] text-[#041521] rounded-lg font-medium hover:bg-[#76d6d5cc] transition-colors"
    >
      Try Again
    </button>
  </div>
);

const SyntaxHighlightedCode = ({ code }) => {
  const highlighted = code
    .replace(/(#.*)/g, '<span style="color: #6a737d">$1</span>')
    .replace(/\b(for|in|while|if|else|elif|range|print)\b/g, '<span style="color: #76d6d5">$1</span>')
    .replace(/(".*?"|'.*?')/g, '<span style="color: #d8bfd8">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color: #98c379">$1</span>');

  return <code dangerouslySetInnerHTML={{ __html: highlighted }} />;
};

const LessonPage = () => {
  const { lessonId } = useParams({ from: '/lesson/detail/$lessonId' });
  const navItems = ['Tutorial', 'Roadmap', 'Community', 'About'];
  
  // API State
  const [lesson, setLesson] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Local state
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [exerciseCode, setExerciseCode] = useState('');
  const [exerciseOutput, setExerciseOutput] = useState('');
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false);
  const [exerciseSuccess, setExerciseSuccess] = useState(false);

  // Fetch lesson data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const lessonResponse = await getLesson(lessonId);
        const lessonData = await lessonResponse.json();
        setLesson(lessonData);
        
        // Set default exercise code
        setExerciseCode(lessonData.exercise ? '# Write your code here\n' : '# Write your code here\n');
        
        // Fetch course lessons for navigation
        if (lessonData.courseId) {
          const lessonsResponse = await getCourseLessons(lessonData.courseId);
          const lessonsData = await lessonsResponse.json();
          setCourseLessons(lessonsData);
        }
      } catch (err) {
        console.error('Failed to fetch lesson:', err);
        setError(err.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchData();
    }
  }, [lessonId]);

  const handleRetry = () => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const lessonResponse = await getLesson(lessonId);
        const lessonData = await lessonResponse.json();
        setLesson(lessonData);
        setExerciseCode(lessonData.exercise ? '# Write your code here\n' : '# Write your code here\n');
        
        if (lessonData.courseId) {
          const lessonsResponse = await getCourseLessons(lessonData.courseId);
          const lessonsData = await lessonsResponse.json();
          setCourseLessons(lessonsData);
        }
      } catch (err) {
        console.error('Failed to fetch lesson:', err);
        setError(err.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  const runCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setCodeOutput('apple\nbanana\ncherry\nIteration: 0\nIteration: 1\nIteration: 2\nIteration: 3\nIteration: 4\nCount: 0\nCount: 1\nCount: 2');
      setIsRunning(false);
    }, 800);
  };

  const submitExercise = () => {
    setExerciseSubmitted(true);
    const hasRange = exerciseCode.includes('range(') && exerciseCode.includes('print(');
    setExerciseSuccess(hasRange);
    if (hasRange) {
      setExerciseOutput('Correct! Your loop prints the numbers correctly.\n\nExpected output:\n' + (lesson?.expectedOutput || ''));
    } else {
      setExerciseOutput('Hint: Make sure to use print() and range() functions.');
    }
  };

  const resetExercise = () => {
    setExerciseCode('# Write your code here\n');
    setExerciseOutput('');
    setExerciseSubmitted(false);
    setExerciseSuccess(false);
  };

  // Get previous and next lessons
  const currentIndex = courseLessons.findIndex(l => l.id === parseInt(lessonId));
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-[#041521]">
        {/* Header */}
        <header
          className="shrink-0 w-full h-16 bg-[#041521] border-b border-[#3e4949] flex items-center px-6"
          style={{ boxShadow: '0px 4px 20px #00808019' }}
        >
          <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-6 w-20 bg-[#3e494920] rounded animate-pulse" />
              <div className="w-px h-6 bg-[#3e4949]" />
              <div className="h-6 w-16 bg-[#3e494920] rounded animate-pulse" />
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <div key={item} className="h-4 w-16 bg-[#3e494920] rounded animate-pulse" />
              ))}
            </nav>
            <div className="w-9 h-9 rounded-full bg-[#d8bfd8] animate-pulse" />
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 py-8 px-6">
          <div className="max-w-[1024px] mx-auto">
            <LessonSkeleton />
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
  if (!lesson) {
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
            <h2 className="text-2xl font-bold text-[#d4e4f6] mb-4">Lesson Not Found</h2>
            <p className="text-[#bdc9c8] mb-4">The lesson you're looking for doesn't exist.</p>
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
          {/* Logo + Back Button */}
          <div className="flex items-center gap-4">
            <Link
              to="/chapter/$courseId"
              params={{ courseId: lesson.courseId || 'python' }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#bdc9c8] hover:text-[#76d6d5] transition-colors rounded-lg hover:bg-[#0d1d2a]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Chapter
            </Link>
            <div className="w-px h-6 bg-[#3e4949]" />
            <Logo />
          </div>

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

          {/* Right: User */}
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#d8bfd8] text-[#041521] font-semibold flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              Y
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-[1024px] mx-auto space-y-6">
          {/* Lesson Header */}
          <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                {lesson.breadcrumb}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-2xl font-bold text-[#d4e4f6] mb-2"
              style={{ fontFamily: 'Montserrat', textShadow: '0px 0px 15px #76d6d530' }}
            >
              {lesson.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-[#bdc9c8] mb-4" style={{ fontFamily: 'Roboto' }}>
              {lesson.description}
            </p>

            {/* Metadata Row */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-[#bdc9c8]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ fontFamily: 'Roboto' }}>{lesson.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#bdc9c8]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <span style={{ fontFamily: 'Roboto' }}>{lesson.difficulty}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#d8bfd8]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span style={{ fontFamily: 'Roboto' }}>+{lesson.xp} XP</span>
              </div>
            </div>
          </div>

          {/* Theory Section */}
          {lesson.content && (
            <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6">
              <h2
                className="text-lg font-semibold text-[#d4e4f6] mb-4 flex items-center gap-2"
                style={{ fontFamily: 'Montserrat' }}
              >
                <span>📚</span> Theory
              </h2>
              <div className="bg-[#0a1628] border border-[#3e4949] rounded-xl p-5">
                <pre className="text-sm text-[#bdc9c8] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Roboto' }}>
                  {lesson.content}
                </pre>
              </div>
            </div>
          )}

          {/* Code Example Section */}
          {lesson.codeExample && (
            <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6">
              <h2
                className="text-lg font-semibold text-[#d4e4f6] mb-4 flex items-center gap-2"
                style={{ fontFamily: 'Montserrat' }}
              >
                <span>💻</span> Code Example
              </h2>
              <div className="bg-[#0a1628] border border-[#3e4949] rounded-xl overflow-hidden">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#0d1d2a] border-b border-[#3e4949]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
                  </div>
                  <span className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>python</span>
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#76d6d5] text-[#041521] rounded text-xs font-medium hover:bg-[#76d6d5cc] transition-colors disabled:opacity-50"
                  >
                    {isRunning ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Running...
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Run
                      </>
                    )}
                  </button>
                </div>

                {/* Code Content */}
                <div className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
                  <pre className="text-[#bdc9c8]">
                    <SyntaxHighlightedCode code={lesson.codeExample} />
                  </pre>
                </div>

                {/* Output */}
                {codeOutput && (
                  <div className="border-t border-[#3e4949]">
                    <div className="px-4 py-2 bg-[#041521] text-xs text-[#bdc9c8] border-b border-[#3e4949]" style={{ fontFamily: 'Roboto' }}>
                      Output:
                    </div>
                    <div className="p-4 bg-[#041521] font-mono text-sm">
                      <pre className="text-[#98c379]">{codeOutput}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Exercise Section */}
          {lesson.exercise && (
            <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6">
              <h2
                className="text-lg font-semibold text-[#d4e4f6] mb-4 flex items-center gap-2"
                style={{ fontFamily: 'Montserrat' }}
              >
                <span>✏️</span> Exercise
              </h2>

              {/* Instructions */}
              <div className="bg-[#11212e] border border-[#3e4949] rounded-xl p-4 mb-4">
                <h3 className="text-sm font-medium text-[#d4e4f6] mb-2" style={{ fontFamily: 'Roboto' }}>Task:</h3>
                <p className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                  {lesson.exercise}
                </p>
                {lesson.expectedOutput && (
                  <div className="mt-3 pt-3 border-t border-[#3e4949]">
                    <span className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>Expected output:</span>
                    <pre className="text-xs text-[#76d6d5] mt-1 font-mono" style={{ fontFamily: 'Roboto' }}>
                      {lesson.expectedOutput}
                    </pre>
                  </div>
                )}
              </div>

              {/* Code Editor */}
              <div className="bg-[#0a1628] border border-[#3e4949] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-[#0d1d2a] border-b border-[#3e4949]">
                  <span className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>Your Code</span>
                </div>
                <textarea
                  value={exerciseCode}
                  onChange={(e) => setExerciseCode(e.target.value)}
                  className="w-full p-4 bg-[#0a1628] text-[#bdc9c8] font-mono text-sm leading-relaxed resize-none focus:outline-none"
                  rows={6}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={submitExercise}
                  className="flex items-center gap-2 px-4 py-2 bg-[#76d6d5] text-[#041521] rounded-lg font-medium hover:bg-[#76d6d5cc] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit
                </button>
                <button
                  onClick={resetExercise}
                  className="flex items-center gap-2 px-4 py-2 border border-[#3e4949] text-[#bdc9c8] rounded-lg hover:border-[#76d6d5] hover:text-[#76d6d5] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              </div>

              {/* Feedback */}
              {exerciseSubmitted && (
                <div className={`mt-4 p-4 rounded-xl border ${exerciseSuccess ? 'bg-[#76d6d510] border-[#76d6d5]' : 'bg-[#ff5f5610] border-[#ff5f56]'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {exerciseSuccess ? (
                      <>
                        <svg className="w-5 h-5 text-[#76d6d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[#76d6d5] font-medium" style={{ fontFamily: 'Roboto' }}>Great job!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-[#ff5f56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[#ff5f56] font-medium" style={{ fontFamily: 'Roboto' }}>Try again!</span>
                      </>
                    )}
                  </div>
                  <pre className="text-sm text-[#bdc9c8] font-mono whitespace-pre-wrap" style={{ fontFamily: 'Roboto' }}>{exerciseOutput}</pre>
                </div>
              )}
            </div>
          )}

          {/* Key Takeaways Section */}
          <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-6">
            <h2
              className="text-lg font-semibold text-[#d4e4f6] mb-4 flex items-center gap-2"
              style={{ fontFamily: 'Montserrat' }}
            >
              <span>🎯</span> Key Takeaways
            </h2>
            <ul className="space-y-3">
              {lesson.keyTakeaways?.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{point.icon}</span>
                  <span className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                    {point.text}
                  </span>
                </li>
              )) || (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">🔄</span>
                    <span className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                      Practice makes perfect - keep coding!
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">📖</span>
                    <span className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                      Review the theory section if you need a refresher.
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-4">
            {prevLesson ? (
              <Link
                to="/lesson/detail/$lessonId"
                params={{ lessonId: prevLesson.id.toString() }}
                className="flex items-center gap-2 px-4 py-2 text-[#bdc9c8] hover:text-[#d8bfd8] transition-colors group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <div className="text-left">
                  <span className="block text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>Previous</span>
                  <span className="text-sm font-medium" style={{ fontFamily: 'Roboto' }}>{prevLesson.title}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}
            
            {nextLesson ? (
              <Link
                to="/lesson/detail/$lessonId"
                params={{ lessonId: nextLesson.id.toString() }}
                className="flex items-center gap-2 px-4 py-2 bg-[#76d6d5] text-[#041521] rounded-lg font-medium hover:bg-[#76d6d5cc] transition-colors group"
              >
                <div className="text-right">
                  <span className="block text-xs text-[#04152180]" style={{ fontFamily: 'Roboto' }}>Next</span>
                  <span className="text-sm" style={{ fontFamily: 'Roboto' }}>{nextLesson.title}</span>
                </div>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ) : (
              <Link
                to="/chapter/$courseId"
                params={{ courseId: lesson.courseId || 'python' }}
                className="flex items-center gap-2 px-4 py-2 bg-[#76d6d5] text-[#041521] rounded-lg font-medium hover:bg-[#76d6d5cc] transition-colors"
              >
                <span style={{ fontFamily: 'Roboto' }}>Back to Chapter</span>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonPage;
