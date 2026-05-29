import React from 'react';
import { Link } from '@tanstack/react-router';
import Logo from '../../../../components/layout/Logo';

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

const ChapterPage = () => {
  const navItems = ['Tutorial', 'Roadmap', 'Community', 'About'];

  // Module data
  const modules = [
    {
      id: 1,
      title: 'Module 1: Basics',
      subtitle: 'Learn the fundamentals',
      icon: BookIcon,
      status: 'completed',
      rank: 'Moss Green',
      lessons: [
        { id: 1, title: 'Hello World', description: 'Write your first Python program', duration: '10 min', status: 'completed' },
        { id: 2, title: 'Variables & Data Types', description: 'Store and manipulate data', duration: '15 min', status: 'completed' },
      ],
    },
    {
      id: 2,
      title: 'Module 2: Control Flow',
      subtitle: 'Make decisions in code',
      icon: CodeIcon,
      status: 'active',
      rank: 'Teal',
      lessons: [
        { id: 3, title: 'If Statements', description: 'Conditional execution', duration: '12 min', status: 'completed' },
        { id: 4, title: 'Loops', description: 'Repeat actions with for and while', duration: '18 min', status: 'active' },
        { id: 5, title: 'Break & Continue', description: 'Control loop execution', duration: '10 min', status: 'locked' },
      ],
    },
    {
      id: 3,
      title: 'Module 3: Functions',
      subtitle: 'Organize and reuse code',
      icon: FunctionIcon,
      status: 'locked',
      rank: 'Thistle',
      lessons: [
        { id: 6, title: 'Function Basics', description: 'Define and call functions', duration: '15 min', status: 'locked' },
      ],
    },
  ];

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
                <span className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                  Python
                </span>
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
                Master Python Curriculum
              </h1>

              {/* Description */}
              <p className="text-sm text-[#bdc9c8] max-w-lg" style={{ fontFamily: 'Roboto' }}>
                A comprehensive learning path covering all Python fundamentals from basics to advanced concepts
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
                    3.2k
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#bdc9c8] mb-1" style={{ fontFamily: 'Roboto' }}>
                    Lessons
                  </div>
                  <div className="text-lg font-bold text-[#d4e4f6]" style={{ fontFamily: 'Montserrat' }}>
                    8
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
                    25%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#3e4949] rounded-full overflow-hidden">
                  <div className="h-full bg-[#76d6d5] rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              {/* Rank Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#76d6d520] rounded-full">
                <div className="w-3 h-3 rounded-full bg-[#76d6d5]" />
                <span className="text-sm font-medium text-[#76d6d5]" style={{ fontFamily: 'Roboto' }}>
                  Moss Green Rank
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
              {modules.map((module, moduleIndex) => {
                const ModuleIcon = module.icon;
                return (
                  <div key={module.id} className="relative">
                    {/* Module Card */}
                    <div className="bg-[#0d1d2a] border border-[#3e4949] rounded-xl p-5 ml-4">
                      {/* Module Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {/* Module Icon */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              module.status === 'completed'
                                ? 'bg-[#76d6d520] text-[#76d6d5]'
                                : module.status === 'active'
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
                              {module.title}
                            </h3>
                            <p className="text-xs text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                              {module.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {getStatusBadge(module.status, module.rank)}
                      </div>

                      {/* Lessons */}
                      <div className="space-y-2 ml-14">
                        {module.lessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            to="/lesson"
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
                  Pythonista's Awakening
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
