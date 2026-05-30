import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import Logo from '../../../../components/layout/Logo';
import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';

// Icons
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

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TerminalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M4 6h16v12H4V6z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const PythonLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110" className="w-[100px] h-[100px]">
    <path fill="#387EB8" d="M53.8,11.2c-20.9,0-19.8,9-19.8,9l0,9.3h20.4v2.9H31.1C16.8,32.4,14.6,41,14.6,53.4c0,13.7,2.4,22,17.1,22h8.3v-9.7 c0-11,9.2-20.1,20.4-20.1h19.5V29.5c0,0,1.3-18.3-26.1-18.3M42.2,20.4c2.8,0,5,2.2,5,5s-2.2,5-5,5s-5-2.2-5-5S39.4,20.4,42.2,20.4" />
    <path fill="#FFE052" d="M56.2,98.8c20.9,0,19.8-9,19.8-9l0-9.3H55.6v-2.9h23.3c14.3,0,16.5-8.6,16.5-21c0-13.7-2.4-22-17.1-22h-8.3v9.7 c0,11-9.2,20.1-20.4,20.1H30.1v16.1c0,0-1.3,18.3,26.1,18.3M67.8,89.6c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S70.6,89.6,67.8,89.6" />
  </svg>
);

const CoursePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#081017]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 py-10 px-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 relative">
            {/* Subtle glow effect behind the text */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#7FE3DD] opacity-5 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-[#7FE3DD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <h1
                  className="text-[32px] font-bold tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#7FE3DD] to-[#A8F3FA]"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  ALL LESSON
                </h1>
              </div>
              <p className="text-sm text-[#7D8A95] mt-1" style={{ fontFamily: '"Roboto", sans-serif' }}>
                Select a technology stack to level up your skills and evolve your companion.
              </p>
            </div>

            {/* Badges Section */}
            <div className="flex items-center gap-3 mt-4 md:mt-1">
              {/* XP Badge */}
              <div className="px-4 py-2 bg-[#1A2632] border border-[#233342] rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(127,227,221,0.1)]">
                <span className="text-[#E5E9EC] font-bold text-sm" style={{ fontFamily: 'Montserrat' }}>14,200</span>
                <span className="text-[#7D8A95] text-xs font-semibold" style={{ fontFamily: 'Montserrat' }}>TOTAL XP</span>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-4 mb-10">
            {/* Search */}
            <div className="relative flex-1 max-w-[600px]">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#7D8A95]">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technologies..."
                className="w-full pl-11 pr-4 py-2.5 bg-[#0A1621] border border-[#142331] rounded-lg text-sm text-[#E5E9EC] placeholder-[#576978] focus:outline-none focus:border-[#233342] transition-colors"
                style={{ fontFamily: 'Roboto' }}
              />
            </div>

            {/* Dropdowns */}
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0A1621] border border-[#142331] rounded-lg text-sm text-[#7D8A95] hover:border-[#233342] transition-colors">
              <span style={{ fontFamily: 'Roboto' }}>Difficulty: All</span>
              <ChevronDownIcon />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0A1621] border border-[#142331] rounded-lg text-sm text-[#7D8A95] hover:border-[#233342] transition-colors">
              <span style={{ fontFamily: 'Roboto' }}>Sort: Popular</span>
              <ChevronDownIcon />
            </button>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Python Card */}
            <div
              className="bg-[#0B151F] border border-[#1C2733] rounded-xl overflow-hidden flex flex-col hover:border-[#2B3A4A] transition-colors duration-200"
              style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)' }}
            >
              {/* Image Header */}
              <div className="h-[140px] bg-[#0A2640] relative flex items-center justify-center">
                {/* Popular Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-[#2A6E78] rounded-full border border-[#3E8B96]">
                  <span className="text-[10px] font-bold text-[#A8F3FA] uppercase tracking-wider" style={{ fontFamily: 'Montserrat' }}>
                    Popular
                  </span>
                </div>

                {/* Python Logo */}
                <PythonLogo />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Title Row */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[17px] text-[#A6B5C3] font-medium" style={{ fontFamily: 'Montserrat' }}>
                    Python Basic
                  </h3>
                  <button className="w-7 h-7 rounded bg-[#162330] border border-[#1E2E3E] text-[#697E93] flex items-center justify-center hover:bg-[#1E2E3E] transition-colors">
                    <TerminalIcon />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-[#738495] mb-5 leading-relaxed" style={{ fontFamily: 'Roboto' }}>
                  Master core syntax and automation protocols. From basic scripts to AI.
                </p>

                {/* Stats (Units & Reward) */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-[#121F2D] border border-[#1C2C3C] rounded-lg p-2.5 flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold text-[#647483]" style={{ fontFamily: 'Montserrat' }}>Units</span>
                    <span className="text-sm font-semibold text-[#E5E9EC]" style={{ fontFamily: 'Montserrat' }}>24 Units</span>
                  </div>
                  <div className="bg-[#121F2D] border border-[#1C2C3C] rounded-lg p-2.5 flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold text-[#647483]" style={{ fontFamily: 'Montserrat' }}>Reward</span>
                    <span className="text-sm font-semibold text-[#E5E9EC]" style={{ fontFamily: 'Montserrat' }}>1,200 XP</span>
                  </div>
                </div>

                <div className="mt-auto">
                  {/* Progress Info */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#E5E9EC]" style={{ fontFamily: 'Montserrat' }}>Progress</span>
                    <span className="text-xs font-bold text-[#647483]" style={{ fontFamily: 'Montserrat' }}>Not Started</span>
                  </div>

                  {/* Progress Bar (Empty) */}
                  <div className="w-full h-1.5 bg-[#172533] rounded-full overflow-hidden mb-5">
                    <div className="h-full bg-[#7FE3DD] rounded-full opacity-0" style={{ width: '0%' }} />
                  </div>

                  {/* Start Button */}
                  <button className="w-full py-2.5 bg-[#E4C1D9] hover:bg-[#D8B0CC] text-[#05111A] text-[15px] font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors" style={{ fontFamily: 'Montserrat' }}>
                    Start
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Empty slots to balance the grid if needed */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CoursePage;
