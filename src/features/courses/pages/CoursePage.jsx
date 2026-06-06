import React, { useEffect } from 'react';

const CoursePage = () => {
  useEffect(() => {
    document.title = 'All Lessons - Devcopet';
  }, []);

  return (
    <main className="w-full h-full relative pb-6 px-4 md:px-10 lg:px-16">
      <div className="max-w-[1200px] mx-auto pt-6">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-3">
            <div>
              <h1 className="font-headline-lg text-[24px] md:text-[28px] font-bold text-white tracking-wide uppercase mb-1">
                ALL LESSON
              </h1>
              <p className="font-body-sm text-[13px] text-on-surface-variant">
                Choose a stack to master and evolve your familiar.
              </p>
            </div>
            {/* XP Badge */}
            <div className="bg-[#1b2532] text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/5">
              <span className="font-bold text-[14px]">14,200</span>
              <span className="text-[10px] text-on-surface-variant font-medium tracking-wider">TOTAL XP</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search technologies..." 
                className="w-full bg-[#111a22] border border-[#1e293b] rounded-lg pl-10 pr-4 py-2 text-[13px] text-white placeholder:text-on-surface-variant focus:outline-none focus:border-primary-fixed-dim transition-colors"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select className="bg-[#111a22] border border-[#1e293b] rounded-lg pl-4 pr-10 py-2 text-[13px] text-on-surface-variant focus:outline-none focus:border-primary-fixed-dim appearance-none cursor-pointer hover:bg-[#15202b] transition-colors h-full">
                  <option>Difficulty: All</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Hardcore</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <select className="bg-[#111a22] border border-[#1e293b] rounded-lg pl-4 pr-10 py-2 text-[13px] text-on-surface-variant focus:outline-none focus:border-primary-fixed-dim appearance-none cursor-pointer hover:bg-[#15202b] transition-colors h-full">
                  <option>Sort: Popular</option>
                  <option>Sort: Newest</option>
                  <option>Sort: XP Required</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            
            {/* Python Architect Card */}
            <div className="bg-[#121c25] rounded-xl overflow-hidden border border-[#1e293b] flex flex-col hover:border-primary-fixed-dim/50 transition-colors group relative shadow-[0_0_20px_rgba(0,0,0,0.5)] w-[280px] flex-shrink-0">
              
              {/* Top Banner section */}
              <div className="h-[90px] bg-[#052b4d] relative flex items-center justify-center">
                {/* Popular Badge */}
                <div className="absolute top-2 left-2 bg-primary-fixed-dim/20 border border-primary-fixed-dim/40 text-primary-fixed-dim text-[8px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase backdrop-blur-sm shadow-[0_0_10px_rgba(0,218,248,0.2)]">
                  POPULAR
                </div>
                
                {/* Python SVG Icon */}
                <svg viewBox="0 0 110 110" className="w-[50px] h-[50px] group-hover:scale-105 transition-transform duration-500 ease-out" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#387EB8" d="M53.79,3.08C25.07,3.08,21.84,15.53,21.84,15.53l0.04,12.78h32.61v4.54H16.14c0,0-15.01-1.74-15.01,23.18  c0,24.91,12.98,24.28,12.98,24.28h7.24v-11.4c0,0-0.12-14.28,14.07-14.28h22.25c0,0,13.62,0.11,13.62-13.25V17.06  C71.3,17.06,73.5,3.08,53.79,3.08z M38.45,9.66c2.61,0,4.72,2.11,4.72,4.72c0,2.61-2.11,4.72-4.72,4.72c-2.61,0-4.72-2.11-4.72-4.72  C33.73,11.78,35.84,9.66,38.45,9.66z"/>
                  <path fill="#FFE052" d="M54.89,106.92c28.72,0,31.95-12.45,31.95-12.45l-0.04-12.78H54.19v-4.54h38.35c0,0,15.01,1.74,15.01-23.18  c0-24.91-12.98-24.28-12.98-24.28h-7.24v11.4c0,0,0.12,14.28-14.07,14.28H50.99c0,0-13.62-0.11-13.62,13.25v24.32  C37.38,92.94,35.18,106.92,54.89,106.92z M70.23,100.34c-2.61,0-4.72-2.11-4.72-4.72c0-2.61,2.11-4.72,4.72-4.72  c2.61,0,4.72,2.11,4.72,4.72C74.95,98.22,72.84,100.34,70.23,100.34z"/>
                </svg>
              </div>

              {/* Content section */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-headline-sm text-[16px] text-white">Python Architect</h3>
                  <button className="bg-[#1b2532] text-on-surface-variant p-1.5 rounded-lg hover:bg-[#253243] hover:text-white transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">terminal</span>
                  </button>
                </div>
                
                <p className="font-body-sm text-on-surface-variant text-[11px] leading-relaxed mb-3 line-clamp-2">
                  Master core syntax and automation protocols. From basic scripts to AI.
                </p>

                <div className="flex gap-2 mb-3">
                  <div className="bg-[#1b2532] rounded-lg p-2 flex-1">
                    <div className="font-label-sm text-[8px] text-on-surface-variant tracking-widest mb-0.5 uppercase">UNITS</div>
                    <div className="text-white text-[12px] font-semibold">24 Units</div>
                  </div>
                  <div className="bg-[#1b2532] rounded-lg p-2 flex-1">
                    <div className="font-label-sm text-[8px] text-on-surface-variant tracking-widest mb-0.5 uppercase">REWARD</div>
                    <div className="text-white text-[12px] font-semibold">1,200 XP</div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between text-[10px] font-bold mb-1.5">
                    <span className="text-white">Progress</span>
                    <span className="text-primary-fixed-dim">65%</span>
                  </div>
                  <div className="h-1 bg-[#1b2532] rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-primary-fixed-dim w-[65%] rounded-full shadow-[0_0_10px_rgba(0,218,248,0.5)]"></div>
                  </div>

                  <button className="w-full bg-[#8cecf5] text-on-primary-fixed font-bold text-[12px] py-2 rounded-xl hover:bg-primary-fixed hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(140,236,245,0.3)]">
                    Continue <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
  );
};

export default CoursePage;
