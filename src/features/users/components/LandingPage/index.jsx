import React from 'react';
import { Link } from '@tanstack/react-router';
import Logo from '../../../../components/layout/Logo';
import Footer from '../../../../components/layout/Footer';
import { mascotAxolotl } from '../../constants/authImages';
import { useAuthStore } from '../../store/auth.store';

// Color palette
const colors = {
  bgDark: '#041521',
  cardBg: '#0d1d2a',
  inputBg: '#11212e',
  border: '#3e4949',
  textPrimary: '#d4e4f6',
  textSecondary: '#bdc9c8',
  accentTeal: '#76d6d5',
  accentPurple: '#d8bfd8',
};

// Icon Components
const TutorialIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const RoadmapIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
  </svg>
);

const CommunityIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const AboutIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const PersonalizedIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const GamifiedIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a24.07 24.07 0 00-5.454-1.31A8.967 8.967 0 006 9.75v.7l-.657-.67A4.496 4.496 0 014.5 6.07V4.5a2.25 2.25 0 012.25-2.25h9A2.25 2.25 0 0118 4.5v1.57a4.496 4.496 0 00-1.343 3.02l.657.67v.7a8.967 8.967 0 003.546 7.022l-.01-.01z" />
  </svg>
);

const InteractiveIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
  </svg>
);

const ProjectsIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const CommunitySupportIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

const AIAssistanceIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

const CertificateIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3m9 7.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
  </svg>
);

const CareerPathIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LandingPage = () => {
  const navItems = [
    { label: 'Tutorial', path: '/course' },
    { label: 'Roadmap', path: '/roadmap' },
    'Community',
    'About'
  ];
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="relative min-h-screen w-full bg-[#041521] overflow-y-auto">
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top center, #76d6d510 0%, transparent 50%)',
        }}
      />

      {/* ========== 1. TOP NAVIGATION HEADER ========== */}
      <header
        className="w-full bg-[#041521] border-b border-[#3e49496b] relative"
        style={{
          boxShadow: '0px 4px 20px #00808019',
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="flex flex-row justify-between items-center py-4 sm:py-5 md:py-6 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src={mascotAxolotl}
                alt="Devcopet logo"
                className="h-[60px] w-[60px] rounded-full object-cover object-top"
                loading="eager"
              />
              <div className="flex flex-col">
                <span
                  className="text-xl sm:text-2xl font-bold text-[#d8bfd8]"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  Devcopet
                </span>
                <span
                  className="text-xs sm:text-sm text-[#bdc9c8] hidden sm:block"
                  style={{ fontFamily: 'Roboto' }}
                >
                  Learn Coding with your Pet
                </span>
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex flex-row gap-6 lg:gap-8">
              {navItems.map((item) => {
                const label = typeof item === 'string' ? item : item.label;
                const path = typeof item === 'string' ? `/${item.toLowerCase()}` : item.path;
                return (
                  <Link
                    key={label}
                    to={path}
                    className="text-sm sm:text-base font-medium text-[#bdc9c8] hover:text-[#76d6d5] transition-colors duration-200"
                    style={{ fontFamily: 'Roboto' }}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => window.location.href = '/course'}
                    className="px-4 py-2 text-sm sm:text-base font-medium text-[#041521] bg-[#76d6d5] rounded-lg hover:bg-[#65c5c4] transition-all duration-200"
                    style={{ fontFamily: 'Roboto' }}
                  >
                    Continue Learning
                  </button>

                  <div className="relative group cursor-pointer ml-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#76d6d5] to-[#d8bfd8] flex items-center justify-center text-[#041521] text-sm font-bold border-2 border-transparent group-hover:border-[#76d6d5] transition-all duration-300 shadow-[0_0_15px_rgba(118,214,213,0.3)] hover:shadow-[0_0_20px_rgba(118,214,213,0.5)]">
                      {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    {/* Dropdown Menu */}
                    <div className="absolute top-12 right-0 w-36 bg-[#0d1d2a] border border-[#3e4949] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                      <div className="flex flex-col gap-1 p-2">
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-[#d4e4f6] hover:bg-[#1a2d40] rounded-lg transition-colors font-medium flex items-center gap-2 cursor-default"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-[#ff6b6b] hover:bg-[#ff6b6b15] rounded-lg transition-colors font-medium flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm sm:text-base font-medium text-[#76d6d5] border border-[#76d6d5] rounded-lg hover:bg-[#76d6d510] transition-all duration-200"
                    style={{ fontFamily: 'Roboto' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm sm:text-base font-medium text-[#041521] bg-[#76d6d5] rounded-lg hover:bg-[#65c5c4] transition-all duration-200"
                    style={{
                      fontFamily: 'Roboto',
                      boxShadow: '0px 0px 15px #76d6d540',
                    }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========== 2. HERO SECTION ========== */}
      <section
        className="w-full relative"
        style={{
          minHeight: '600px',
          background: 'linear-gradient(180deg, #041521 0%, #0d1d2a50 100%)',
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left: Mascot */}
            <div className="flex-shrink-0 order-1 lg:order-1">
              <div
                className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[437px] md:h-[437px] rounded-full flex items-center justify-center relative"
                style={{
                  background: 'radial-gradient(circle, #76d6d520 0%, transparent 70%)',
                  boxShadow: '0px 0px 80px #76d6d530, inset 0px 0px 40px #76d6d515',
                }}
              >
                <img
                  src={mascotAxolotl}
                  alt="Devcopet mascot"
                  className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] rounded-full object-cover object-top"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-2 max-w-xl">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#d4e4f6] leading-tight mb-4 sm:mb-6"
                style={{
                  fontFamily: 'Montserrat',
                  textShadow: '0px 0px 20px #76d6d530',
                }}
              >
                Your Coding Adventure
              </h1>
              <p
                className="text-base sm:text-lg md:text-xl text-[#bdc9c8] mb-6 sm:mb-8 max-w-lg"
                style={{ fontFamily: 'Roboto' }}
              >
                Learn programming through play with your personalized Devcopet companion
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => window.location.href = '/course'}
                      className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-[#041521] bg-[#76d6d5] rounded-xl hover:bg-[#65c5c4] transition-all duration-200"
                      style={{
                        fontFamily: 'Montserrat',
                        boxShadow: '0px 4px 20px #76d6d540',
                      }}
                    >
                      Continue Learning
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-[#76d6d5] border-2 border-[#76d6d5] rounded-xl hover:bg-[#76d6d510] transition-all duration-200"
                      style={{ fontFamily: 'Montserrat' }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-[#041521] bg-[#76d6d5] rounded-xl hover:bg-[#65c5c4] transition-all duration-200 text-center"
                      style={{
                        fontFamily: 'Montserrat',
                        boxShadow: '0px 4px 20px #76d6d540',
                      }}
                    >
                      Get Started Free
                    </Link>
                    <button
                      className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-[#76d6d5] border-2 border-[#76d6d5] rounded-xl hover:bg-[#76d6d510] transition-all duration-200"
                      style={{ fontFamily: 'Montserrat' }}
                    >
                      Watch Demo
                    </button>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xl sm:text-2xl font-bold text-[#d8bfd8]"
                    style={{ fontFamily: 'Montserrat' }}
                  >
                    50,000+
                  </span>
                  <span
                    className="text-sm sm:text-base text-[#bdc9c8]"
                    style={{ fontFamily: 'Roboto' }}
                  >
                    learners
                  </span>
                </div>
                <div className="hidden sm:block w-1 h-8 bg-[#3e4949] rounded" />
                <div className="flex items-center gap-2">
                  <span
                    className="text-xl sm:text-2xl font-bold text-[#d8bfd8]"
                    style={{ fontFamily: 'Montserrat' }}
                  >
                    8
                  </span>
                  <span
                    className="text-sm sm:text-base text-[#bdc9c8]"
                    style={{ fontFamily: 'Roboto' }}
                  >
                    Programming Languages
                  </span>
                </div>
                <div className="hidden sm:block w-1 h-8 bg-[#3e4949] rounded" />
                <div className="flex items-center gap-2">
                  <span
                    className="text-xl sm:text-2xl font-bold text-[#d8bfd8]"
                    style={{ fontFamily: 'Montserrat' }}
                  >
                    100%
                  </span>
                  <span
                    className="text-sm sm:text-base text-[#bdc9c8]"
                    style={{ fontFamily: 'Roboto' }}
                  >
                    Free
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 3. ABOUT SECTION ========== */}
      <section
        className="w-full py-16 sm:py-20 md:py-24"
        style={{ minHeight: '762px' }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          {/* Section Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#d4e4f6]"
              style={{
                fontFamily: 'Montserrat',
                textShadow: '0px 0px 15px #76d6d530',
              }}
            >
              Why Devcopet?
            </h2>
          </div>

          {/* Feature Cards */}
          <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-8">
            {/* Card 1: Personalized Learning */}
            <div
              className="w-full lg:w-[432px] h-[240px] bg-[#0d1d2a] border border-[#3e4949] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center hover:border-[#76d6d5] transition-all duration-300"
              style={{
                boxShadow: '0px 4px 20px #00000030',
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-[#76d6d5]"
                style={{
                  background: 'linear-gradient(135deg, #76d6d520 0%, #d8bfd810 100%)',
                }}
              >
                <PersonalizedIcon />
              </div>
              <h3
                className="text-lg sm:text-xl font-semibold text-[#d4e4f6] mb-2"
                style={{ fontFamily: 'Montserrat' }}
              >
                Personalized Learning
              </h3>
              <p
                className="text-sm sm:text-base text-[#bdc9c8] max-w-[360px]"
                style={{ fontFamily: 'Roboto' }}
              >
                Adapts to your skill level and learning pace for the best experience
              </p>
            </div>

            {/* Card 2: Gamified Experience */}
            <div
              className="w-full lg:w-[432px] h-[240px] bg-[#0d1d2a] border border-[#3e4949] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center hover:border-[#76d6d5] transition-all duration-300"
              style={{
                boxShadow: '0px 4px 20px #00000030',
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-[#d8bfd8]"
                style={{
                  background: 'linear-gradient(135deg, #d8bfd820 0%, #76d6d510 100%)',
                }}
              >
                <GamifiedIcon />
              </div>
              <h3
                className="text-lg sm:text-xl font-semibold text-[#d4e4f6] mb-2"
                style={{ fontFamily: 'Montserrat' }}
              >
                Gamified Experience
              </h3>
              <p
                className="text-sm sm:text-base text-[#bdc9c8] max-w-[360px]"
                style={{ fontFamily: 'Roboto' }}
              >
                Earn rewards, badges, and achievements as you progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 4. BENTO GRID SECTION ========== */}
      <section
        className="w-full py-16 sm:py-20 md:py-24 border-t border-[#3e494930]"
        style={{ minHeight: '844px' }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          {/* Section Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#d4e4f6]"
              style={{
                fontFamily: 'Montserrat',
                textShadow: '0px 0px 15px #76d6d530',
              }}
            >
              Everything you need to become a developer
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Row 1: 3 small cards */}
            {/* Card 1: Interactive Learning */}
            <div
              className="bg-[#0d1d2a] border border-[#3e4949] rounded-2xl p-5 sm:p-6 hover:border-[#76d6d5] transition-all duration-300"
              style={{
                boxShadow: '0px 4px 15px #00000025',
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[#76d6d5] flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #76d6d515 0%, transparent 100%)',
                  }}
                >
                  <InteractiveIcon />
                </div>
                <h3
                  className="text-base sm:text-lg font-semibold text-[#d4e4f6]"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  Interactive Learning
                </h3>
              </div>
              <p
                className="text-sm text-[#bdc9c8] mb-4"
                style={{ fontFamily: 'Roboto' }}
              >
                Hands-on exercises with instant feedback
              </p>
              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#3e494950] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#76d6d5] rounded-full transition-all duration-500"
                    style={{ width: '37.5%' }}
                  />
                </div>
                <span
                  className="text-xs text-[#bdc9c8] font-medium"
                  style={{ fontFamily: 'Roboto' }}
                >
                  3/8 lessons
                </span>
              </div>
            </div>

            {/* Card 2: Real-world Projects */}
            <div
              className="bg-[#0d1d2a] border border-[#3e4949] rounded-2xl p-5 sm:p-6 hover:border-[#76d6d5] transition-all duration-300"
              style={{
                boxShadow: '0px 4px 15px #00000025',
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[#d8bfd8] flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #d8bfd815 0%, transparent 100%)',
                  }}
                >
                  <ProjectsIcon />
                </div>
                <h3
                  className="text-base sm:text-lg font-semibold text-[#d4e4f6]"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  Real-world Projects
                </h3>
              </div>
              <p
                className="text-sm text-[#bdc9c8]"
                style={{ fontFamily: 'Roboto' }}
              >
                Build portfolio-worthy applications
              </p>
            </div>

            {/* Card 3: Community Support */}
            <div
              className="bg-[#0d1d2a] border border-[#3e4949] rounded-2xl p-5 sm:p-6 hover:border-[#76d6d5] transition-all duration-300"
              style={{
                boxShadow: '0px 4px 15px #00000025',
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[#76d6d5] flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #76d6d515 0%, transparent 100%)',
                  }}
                >
                  <CommunitySupportIcon />
                </div>
                <h3
                  className="text-base sm:text-lg font-semibold text-[#d4e4f6]"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  Community Support
                </h3>
              </div>
              <p
                className="text-sm text-[#bdc9c8]"
                style={{ fontFamily: 'Roboto' }}
              >
                Join thousands of learners and mentors
              </p>
            </div>

            {/* Row 2: 1 wide + 1 tall */}
            {/* Card 4: AI Assistance */}
            <div
              className="bg-[#0d1d2a] border border-[#3e4949] rounded-2xl p-5 sm:p-6 hover:border-[#76d6d5] transition-all duration-300 md:col-span-1"
              style={{
                boxShadow: '0px 4px 15px #00000025',
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[#d8bfd8] flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #d8bfd815 0%, transparent 100%)',
                  }}
                >
                  <AIAssistanceIcon />
                </div>
                <h3
                  className="text-base sm:text-lg font-semibold text-[#d4e4f6]"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  AI Assistance
                </h3>
              </div>
              <p
                className="text-sm text-[#bdc9c8]"
                style={{ fontFamily: 'Roboto' }}
              >
                Get help from our AI-powered coding assistant
              </p>
            </div>

            {/* Card 5: Certificate */}
            <div
              className="bg-[#0d1d2a] border border-[#3e4949] rounded-2xl p-5 sm:p-6 hover:border-[#76d6d5] transition-all duration-300"
              style={{
                boxShadow: '0px 4px 15px #00000025',
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[#76d6d5] flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #76d6d515 0%, transparent 100%)',
                  }}
                >
                  <CertificateIcon />
                </div>
                <h3
                  className="text-base sm:text-lg font-semibold text-[#d4e4f6]"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  Certificate
                </h3>
              </div>
              <p
                className="text-sm text-[#bdc9c8]"
                style={{ fontFamily: 'Roboto' }}
              >
                Earn verified certificates upon completion
              </p>
            </div>

            {/* Row 3: 1 wide card */}
            {/* Card 6: Career Path */}
            <div
              className="bg-[#0d1d2a] border border-[#3e4949] rounded-2xl p-5 sm:p-6 hover:border-[#76d6d5] transition-all duration-300 md:col-span-2 lg:col-span-3"
              style={{
                boxShadow: '0px 4px 15px #00000025',
              }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-[#d8bfd8] flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #d8bfd815 0%, transparent 100%)',
                  }}
                >
                  <CareerPathIcon />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-lg sm:text-xl font-semibold text-[#d4e4f6] mb-2"
                    style={{ fontFamily: 'Montserrat' }}
                  >
                    Career Path
                  </h3>
                  <p
                    className="text-sm sm:text-base text-[#bdc9c8]"
                    style={{ fontFamily: 'Roboto' }}
                  >
                    Follow structured learning paths from beginner to professional developer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 6. JOIN THE COLONY ========== */}
      <section className="w-full relative py-20 lg:py-32">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-16">
            {/* Left side: Join the Colony */}
            <div className="lg:w-1/2 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat' }}>Join the Colony</h2>
              <p className="text-[#bdc9c8] mb-10 max-w-lg leading-relaxed text-lg" style={{ fontFamily: 'Roboto' }}>
                Learning to code shouldn't be a solo mission. Devcopet is built by a global team of developers, educators, and gamers who believe the best way to learn is together.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2.5 rounded-full border border-[#3e4949] text-white font-medium hover:border-[#76d6d5] hover:text-[#76d6d5] hover:bg-[#76d6d5]/10 transition-all flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg>
                  DISCORD
                </button>
                <button className="px-6 py-2.5 rounded-full border border-[#3e4949] text-white font-medium hover:border-[#d8bfd8] hover:text-[#d8bfd8] hover:bg-[#d8bfd8]/10 transition-all flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  GITHUB
                </button>
                <button className="px-6 py-2.5 rounded-full border border-[#3e4949] text-white font-medium hover:border-[#7FE3DD] hover:text-[#7FE3DD] hover:bg-[#7FE3DD]/10 transition-all flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                  LINKEDIN
                </button>
              </div>
            </div>

            {/* Right side: Core Team */}
            <div className="lg:w-1/2 flex lg:justify-end mt-12 lg:mt-0">
              <div className="w-full max-w-xl bg-[#0d1d2a]/50 backdrop-blur-md border border-[#1a2d40] rounded-[32px] p-8 hover:border-[#3e4949] transition-all duration-300 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat' }}>Our Core Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 mb-8">
                  {/* Team Member 1 */}
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full border border-[#3e4949] bg-gradient-to-br from-[#0d1d2a] to-[#041521] shadow-inner flex items-center justify-center flex-shrink-0 group-hover:border-[#76d6d5] transition-colors">
                      <span className="text-lg font-bold text-[#76d6d5]">N</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base group-hover:text-[#76d6d5] transition-colors whitespace-nowrap">Hoàng Nhân</h4>
                      <p className="text-[10px] text-[#7D8A95] tracking-widest mt-1 uppercase font-semibold">BACKEND</p>
                    </div>
                  </div>
                  {/* Team Member 2 */}
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full border border-[#3e4949] bg-gradient-to-br from-[#0d1d2a] to-[#041521] shadow-inner flex items-center justify-center flex-shrink-0 group-hover:border-[#d8bfd8] transition-colors">
                      <span className="text-lg font-bold text-[#d8bfd8]">Y</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base group-hover:text-[#d8bfd8] transition-colors whitespace-nowrap">Yến Phương</h4>
                      <p className="text-[10px] text-[#7D8A95] tracking-widest mt-1 uppercase font-semibold">FRONTEND</p>
                    </div>
                  </div>
                  {/* Team Member 3 */}
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full border border-[#3e4949] bg-gradient-to-br from-[#0d1d2a] to-[#041521] shadow-inner flex items-center justify-center flex-shrink-0 group-hover:border-[#3b82f6] transition-colors">
                      <span className="text-lg font-bold text-[#3b82f6]">C</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base group-hover:text-[#3b82f6] transition-colors whitespace-nowrap">Chí Thành</h4>
                      <p className="text-[10px] text-[#7D8A95] tracking-widest mt-1 uppercase font-semibold">BACKEND</p>
                    </div>
                  </div>
                  {/* Team Member 4 */}
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full border border-[#3e4949] bg-gradient-to-br from-[#0d1d2a] to-[#041521] shadow-inner flex items-center justify-center flex-shrink-0 group-hover:border-[#22c55e] transition-colors">
                      <span className="text-lg font-bold text-[#22c55e]">T</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base group-hover:text-[#22c55e] transition-colors whitespace-nowrap">Tiến Thành</h4>
                      <p className="text-[10px] text-[#7D8A95] tracking-widest mt-1 uppercase font-semibold">FRONTEND</p>
                    </div>
                  </div>
                  {/* Team Member 5 */}
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full border border-[#3e4949] bg-gradient-to-br from-[#0d1d2a] to-[#041521] shadow-inner flex items-center justify-center flex-shrink-0 group-hover:border-[#f59e0b] transition-colors">
                      <span className="text-lg font-bold text-[#f59e0b]">T</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base group-hover:text-[#f59e0b] transition-colors whitespace-nowrap">Tuấn Kiệt</h4>
                      <p className="text-[10px] text-[#7D8A95] tracking-widest mt-1 uppercase font-semibold">BACKEND</p>
                    </div>
                  </div>
                  {/* Team Member 6 */}
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full border border-[#3e4949] bg-gradient-to-br from-[#0d1d2a] to-[#041521] shadow-inner flex items-center justify-center flex-shrink-0 group-hover:border-[#ec4899] transition-colors">
                      <span className="text-lg font-bold text-[#ec4899]">Đ</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base group-hover:text-[#ec4899] transition-colors whitespace-nowrap">Đức Tường</h4>
                      <p className="text-[10px] text-[#7D8A95] tracking-widest mt-1 uppercase font-semibold">MENTOR</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#7D8A95] italic border-t border-[#1a2d40] pt-6 leading-relaxed">
                  "We're always looking for contributors! Help us build the future of education."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 7. FOOTER ========== */}
      <Footer />
    </div>
  );
};

export default LandingPage;
