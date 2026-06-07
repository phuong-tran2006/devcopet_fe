import React, { useEffect, useRef } from 'react';
import { useLocation } from '@tanstack/react-router';

const Footer = () => {
  const joinColonyRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    if (isHomePage && joinColonyRef.current) {
      joinColonyRef.current.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
      observer.observe(joinColonyRef.current);
    }

    return () => observer.disconnect();
  }, [isHomePage]);

  return (
    <div className="w-full bg-surface-container-lowest border-t border-white/5 mt-auto">
      {isHomePage ? (
        /* Join the Colony - Full version for Homepage */
        <section className="relative py-24 px-margin-desktop z-10 max-w-container-max mx-auto border-b border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Join the Colony</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">Learning to code shouldn't be a solo mission. Devcopet is built by a global team of developers, educators, and gamers who believe the best way to learn is together.</p>
            </div>
            
            <div ref={joinColonyRef} className="bg-surface/40 backdrop-blur-xl border border-outline/20 rounded-xl p-8 spinning-border-card">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-8">Our Core Team</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center text-primary-fixed-dim font-bold">N</div>
                  <div>
                    <div className="text-on-surface font-bold">Hoàng Nhân</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">Backend</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-secondary-container/30 flex items-center justify-center text-secondary-container font-bold">Y</div>
                  <div>
                    <div className="text-on-surface font-bold">Yến Phương</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">Frontend</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center text-primary-fixed-dim font-bold">C</div>
                  <div>
                    <div className="text-on-surface font-bold">Chí Thành</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">Backend</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-secondary-container/30 flex items-center justify-center text-secondary-container font-bold">T</div>
                  <div>
                    <div className="text-on-surface font-bold">Tiến Thành</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">Frontend</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center text-primary-fixed-dim font-bold">T</div>
                  <div>
                    <div className="text-on-surface font-bold">Tuấn Kiệt</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">Backend</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-primary-container/30 flex items-center justify-center text-primary-container font-bold">Đ</div>
                  <div>
                    <div className="text-on-surface font-bold">Đức Tường</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">Mentor</div>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-on-surface-variant italic text-center">"We're always looking for contributors! Help us build the future of education."</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Footer Branding & Links */}
      <footer className="w-full py-12">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="font-code-md text-code-md text-primary-fixed-dim font-bold">Gravity Code Terminal</span>
            <p className="font-label-sm text-label-sm text-on-tertiary-fixed-variant">© 2024 Gravity Code Terminal. All systems operational.</p>
            <div className="flex gap-3 mt-1">
              <a className="w-8 h-8 rounded-full border border-white/10 bg-surface/40 backdrop-blur-md hover:bg-white/5 transition-all text-on-surface flex items-center justify-center" href="#" aria-label="Discord">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 127.14 96.36" xmlns="http://www.w3.org/2000/svg">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.87-.64,1.72-1.32,2.54-2a75.48,75.48,0,0,0,73,0c.83.69,1.68,1.37,2.54,2a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.6-18.83C129,54.65,122.5,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                </svg>
              </a>
              <a className="w-8 h-8 rounded-full border border-white/10 bg-surface/40 backdrop-blur-md hover:bg-white/5 transition-all text-on-surface flex items-center justify-center" href="#" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
              <a className="w-8 h-8 rounded-full border border-white/10 bg-surface/40 backdrop-blur-md hover:bg-white/5 transition-all text-on-surface flex items-center justify-center" href="#" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            <a className="font-label-sm text-label-sm text-on-tertiary-fixed-variant hover:text-primary-fixed transition-colors" href="#">Documentation</a>
            <a className="font-label-sm text-label-sm text-on-tertiary-fixed-variant hover:text-primary-fixed transition-colors" href="#">Changelog</a>
            <a className="font-label-sm text-label-sm text-on-tertiary-fixed-variant hover:text-primary-fixed transition-colors" href="#">Privacy Protocol</a>
            <a className="font-label-sm text-label-sm text-on-tertiary-fixed-variant hover:text-primary-fixed transition-colors" href="#">Security</a>
            <a className="font-label-sm text-label-sm text-on-tertiary-fixed-variant hover:text-primary-fixed transition-colors" href="#">Neural Link</a>
          </div>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-on-surface">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </button>
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-on-surface">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
