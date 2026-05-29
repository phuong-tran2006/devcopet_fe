import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import Logo from '../../../../components/layout/Logo';
import { mascotAxolotl } from '../../constants/authImages';

const navItems = [
  { icon: '🏠', label: 'Home', path: '/' },
  { icon: '📚', label: 'Learning Path', path: '/map', active: true },
  { icon: '📖', label: 'Chapter', path: '/chapter' },
  { icon: '🏆', label: 'Achievements', path: '/achievements' },
  { icon: '👥', label: 'Community', path: '/community' },
  { icon: '💬', label: 'Forum', path: '/forum' },
  { icon: '📊', label: 'Leaderboard', path: '/leaderboard' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

const skillNodes = [
  { id: 1, label: 'Introduction', status: 'completed', x: 50, y: 80 },
  { id: 2, label: 'Variables', status: 'completed', x: 50, y: 180 },
  { id: 3, label: 'Data Types', status: 'active', x: 50, y: 280 },
  { id: 4, label: 'Conditionals', status: 'locked', x: 50, y: 380 },
  { id: 5, label: 'Loops', status: 'locked', x: 180, y: 480 },
  { id: 6, label: 'Functions', status: 'locked', x: 180, y: 580 },
  { id: 7, label: 'OOP', status: 'locked', x: 180, y: 680 },
  { id: 8, label: 'Final Project', status: 'locked', x: 50, y: 780 },
];

const MapPage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Learning Path');
  const [progress, setProgress] = useState({ completed: 2, total: 8 });

  useEffect(() => {
    document.title = 'Learning Path | Devcopet';
  }, []);

  const handleNodeClick = (nodeId, status) => {
    if (status !== 'locked') {
      navigate({ to: '/course' });
    }
  };

  const getNodeStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          border: '2px solid #76d6d5',
          backgroundColor: '#11212e',
          boxShadow: '0px 0px 15px #76d6d540',
        };
      case 'active':
        return {
          border: '2px solid #d8bfd8',
          backgroundColor: '#0d1d2a',
          boxShadow: '0px 0px 25px #d8bfd860, 0px 0px 50px #d8bfd830',
        };
      case 'locked':
      default:
        return {
          border: '2px solid #3e4949',
          backgroundColor: '#11212e',
          opacity: 0.6,
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#76d6d5] rounded-full flex items-center justify-center text-xs text-[#041521]">
            ✓
          </span>
        );
      case 'active':
        return (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#d8bfd8] rounded-full flex items-center justify-center text-xs text-[#041521]">
            ▶
          </span>
        );
      default:
        return (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#3e4949] rounded-full flex items-center justify-center text-xs text-[#041521]">
            🔒
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#041521]">
      {/* Top Header (64px) */}
      <header
        className="w-full h-16 bg-[#041521] border-b border-[#3e4949] flex items-center px-6"
        style={{
          boxShadow: '0px 4px 20px #00808019',
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <Logo />

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {['Tutorial', 'Roadmap', 'Community', 'About'].map((item) => (
              <Link
                key={item}
                to="/"
                className="text-sm font-medium text-[#bdc9c8] hover:text-[#76d6d5] transition-colors duration-200"
                style={{ fontFamily: 'Roboto' }}
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right: Icons and User */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button>
            <button className="p-2 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-[#d8bfd8] text-[#041521] font-semibold flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              Y
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Sidebar (252px) */}
        <aside
          className="w-[252px] min-h-[calc(100vh-64px)] bg-[#0d1d2a] border-r border-[#3e4949] flex flex-col"
        >
          {/* User Profile Section */}
          <div className="p-6 border-b border-[#3e4949]">
            <div className="flex flex-col items-center gap-3">
              {/* Mascot */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: 'linear-gradient(135deg, #76d6d520 0%, #d8bfd810 100%)',
                  boxShadow: '0px 0px 20px #76d6d530',
                }}
              >
                🦎
              </div>
              {/* Username */}
              <div className="flex flex-col items-center gap-1">
                <span
                  className="text-base font-semibold text-[#d4e4f6]"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  YourDevName
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs text-[#76d6d5]"
                    style={{ fontFamily: 'Roboto' }}
                  >
                    Level 5
                  </span>
                  <div
                    className="w-20 h-1.5 bg-[#3e4949] rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-[#76d6d5] rounded-full transition-all duration-500"
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
                  activeNav === item.label
                    ? 'bg-[#76d6d515] border-l-2 border-[#76d6d5]'
                    : 'hover:bg-[#11212e] border-l-2 border-transparent'
                }`}
                onClick={() => setActiveNav(item.label)}
              >
                <span className="text-lg">{item.icon}</span>
                <span
                  className={`text-sm font-medium ${
                    activeNav === item.label ? 'text-[#76d6d5]' : 'text-[#bdc9c8]'
                  }`}
                  style={{ fontFamily: 'Roboto' }}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-[#3e4949]">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#3e4949] text-[#bdc9c8] hover:border-[#76d6d5] hover:text-[#76d6d5] transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              <span className="text-sm font-medium" style={{ fontFamily: 'Roboto' }}>
                Logout
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 flex flex-col min-h-[calc(100vh-64px)]">
          {/* Top Bar with Language and Progress */}
          <div className="h-16 px-8 flex items-center justify-between border-b border-[#3e4949] bg-[#0d1d2a]">
            {/* Language Pill */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐍</span>
              <span
                className="text-lg font-semibold text-[#d4e4f6]"
                style={{ fontFamily: 'Montserrat' }}
              >
                Python
              </span>
            </div>

            {/* World Progress Widget */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                  World Progress
                </span>
                <div
                  className="w-32 h-2 bg-[#3e4949] rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#76d6d5] to-[#d8bfd8] rounded-full transition-all duration-500"
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  />
                </div>
                <span
                  className="text-sm font-medium text-[#76d6d5]"
                  style={{ fontFamily: 'Roboto' }}
                >
                  {progress.completed}/{progress.total}
                </span>
              </div>
            </div>
          </div>

          {/* Map Content */}
          <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-[1024px] mx-auto">
              {/* Map Header */}
              <div className="mb-8">
                <h1
                  className="text-2xl font-bold text-[#d4e4f6] mb-2"
                  style={{
                    fontFamily: 'Montserrat',
                    textShadow: '0px 0px 8px #76d6d544',
                  }}
                >
                  Learning Path
                </h1>
                <p className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                  Complete each node to unlock the next skill in your journey
                </p>
              </div>

              {/* Interactive Map */}
              <div
                className="relative bg-[#0d1d2a] border border-[#3e4949] rounded-2xl p-8 min-h-[900px]"
                style={{
                  boxShadow: '0px 25px 50px #0000003f, 0px 0px 40px #0080800c',
                }}
              >
                {/* Map SVG for connecting lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 0 }}
                >
                  {/* Main vertical line */}
                  <line
                    x1="50%"
                    y1="140"
                    x2="50%"
                    y2="340"
                    stroke="#76d6d5"
                    strokeWidth="2"
                    strokeDasharray="8,4"
                    opacity="0.5"
                  />
                  {/* Branch to Functions */}
                  <path
                    d="M 512 340 Q 512 410, 580 460 Q 640 510, 580 530"
                    stroke="#3e4949"
                    strokeWidth="2"
                    strokeDasharray="8,4"
                    fill="none"
                    opacity="0.5"
                  />
                  {/* Vertical to Functions */}
                  <line
                    x1="580"
                    y1="530"
                    x2="580"
                    y2="730"
                    stroke="#3e4949"
                    strokeWidth="2"
                    strokeDasharray="8,4"
                    opacity="0.5"
                  />
                  {/* Back to center */}
                  <path
                    d="M 580 730 Q 580 780, 512 810 Q 444 840, 512 860"
                    stroke="#3e4949"
                    strokeWidth="2"
                    strokeDasharray="8,4"
                    fill="none"
                    opacity="0.5"
                  />
                </svg>

                {/* Skill Nodes */}
                <div className="relative space-y-16" style={{ zIndex: 1 }}>
                  {skillNodes.map((node, index) => (
                    <div
                      key={node.id}
                      className="relative flex justify-center"
                    >
                      {/* Node Circle */}
                      <div
                        className="relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
                        style={getNodeStyles(node.status)}
                        onClick={() => handleNodeClick(node.id, node.status)}
                      >
                        {/* Node inner */}
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`text-lg font-semibold ${
                              node.status === 'locked' ? 'text-[#3e4949]' : 'text-[#d4e4f6]'
                            }`}
                            style={{ fontFamily: 'Montserrat' }}
                          >
                            {node.label}
                          </span>
                          {node.status === 'completed' && (
                            <span className="text-xs text-[#76d6d5]">✓ Done</span>
                          )}
                          {node.status === 'active' && (
                            <span className="text-xs text-[#d8bfd8]">In Progress</span>
                          )}
                        </div>

                        {/* Status Icon */}
                        {getStatusIcon(node.status)}
                      </div>

                      {/* Connector Line (except for last node) */}
                      {index < skillNodes.length - 1 && (
                        <div className="absolute left-1/2 -bottom-12 w-0.5 h-12 -translate-x-1/2">
                          {node.status === 'completed' ? (
                            <div className="w-full h-full bg-[#76d6d5]" />
                          ) : node.status === 'active' ? (
                            <div className="w-full h-1/2 bg-[#d8bfd8]" />
                          ) : (
                            <div className="w-full h-full bg-[#3e4949]" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Decorative glow for active node */}
                <div
                  className="absolute w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    top: 'calc(30% - 80px)',
                    left: 'calc(50% - 80px)',
                    background: 'radial-gradient(circle, #d8bfd830 0%, transparent 70%)',
                    filter: 'blur(20px)',
                    zIndex: 0,
                  }}
                />
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-[#76d6d5]"
                    style={{ backgroundColor: '#11212e' }}
                  />
                  <span className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                    Completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-[#d8bfd8]"
                    style={{ backgroundColor: '#0d1d2a', boxShadow: '0px 0px 8px #d8bfd860' }}
                  />
                  <span className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                    Current
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-[#3e4949]"
                    style={{ backgroundColor: '#11212e', opacity: 0.6 }}
                  />
                  <span className="text-sm text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
                    Locked
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapPage;
