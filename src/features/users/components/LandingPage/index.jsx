import React, { useEffect, useRef } from 'react';

import MouseTrail from '../../../../components/ui/MouseTrail';

const LandingPage = () => {
  const glowCardsRef = useRef([]);

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

    glowCardsRef.current.forEach(card => {
      if (card) {
        card.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !glowCardsRef.current.includes(el)) {
      glowCardsRef.current.push(el);
    }
  };

  return (
    <>
      <MouseTrail />
      <main className="relative">
        {/* Background Grid & Streaks */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-1 h-1 bg-white rounded-full top-[10%] left-[20%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-primary-fixed-dim rounded-full top-[35%] left-[80%] opacity-100"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full top-[60%] left-[15%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-primary-fixed-dim rounded-full top-[85%] left-[45%] opacity-100"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full top-[25%] left-[65%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-primary-fixed-dim rounded-full top-[50%] left-[90%] opacity-100"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full top-[75%] left-[30%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-primary-fixed-dim rounded-full top-[15%] left-[55%] opacity-100"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full top-[45%] left-[10%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-primary-fixed-dim rounded-full top-[95%] left-[75%] opacity-100"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full top-[5%] left-[40%] opacity-100 blur-[0.5px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-primary-fixed-dim rounded-full top-[20%] left-[10%] opacity-100"></div>
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[40%] left-[70%] opacity-100 blur-[1px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[55%] left-[25%] opacity-100"></div>
            <div className="absolute w-1 h-1 bg-primary-fixed-dim rounded-full top-[70%] left-[85%] opacity-100 blur-[0.5px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[90%] left-[50%] opacity-100"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full top-[12%] left-[95%] opacity-100 blur-[0.5px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-primary-fixed-dim rounded-full top-[30%] left-[35%] opacity-100"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full top-[65%] left-[5%] opacity-100 blur-[0.5px]"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full top-[22%] left-[3%] opacity-50 blur-[1px]"></div>
          </div>
          <div className="absolute inset-0 digital-grid opacity-20"></div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-margin-desktop py-24 z-10">
          <div className="max-w-4xl space-y-8">
            <h1 className="font-headline-lg text-headline-lg md:text-[84px] leading-tight font-extrabold tracking-tight text-on-surface">
              Code, Play, <br/>
              <span className="text-secondary">Evolve</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Transform your coding journey into a living ecosystem. Learn syntax, solve logic puzzles, and nurture your personal AI 'Axolotl' mascot through daily quests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button className="bg-primary-fixed-dim text-on-primary-fixed font-bold py-4 px-10 rounded-lg text-[18px] glow-cyan hover:scale-105 transition-all duration-300 ease-out-cubic active:scale-95">
                Get Started 🚀
              </button>
              <button className="border border-outline/20 hover:border-outline/40 backdrop-blur-md text-on-surface font-bold py-4 px-10 rounded-lg text-[18px] transition-all duration-300 ease-out-cubic active:scale-95">
                View Demo
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="relative py-24 px-margin-desktop z-10 max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div ref={addToRefs} style={{ '--glow-color': 'var(--color-primary-fixed-dim)' }} className="group p-8 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(77,182,172,0.1)]">
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-lg bg-primary-fixed-dim/10 text-primary-fixed-dim">
                <span className="material-symbols-outlined text-3xl">psychology</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-4 text-on-surface">Personalized Roadmap</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Our AI system analyzes your skills and suggests an optimized learning path tailored to your learning pace.</p>
            </div>
            
            <div ref={addToRefs} style={{ '--glow-color': 'var(--color-secondary)' }} className="group p-8 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(216,191,216,0.1)]">
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-lg bg-secondary-container/10 text-secondary-container">
                <span className="material-symbols-outlined text-3xl">groups</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-4 text-on-surface">Mentor Community</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Connect directly with experts from leading tech corporations to receive 1:1 personalized feedback.</p>
            </div>
            
            <div ref={addToRefs} style={{ '--glow-color': 'var(--color-tertiary)' }} className="group p-8 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(135,169,107,0.1)]">
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-lg bg-primary-container/10 text-primary-container">
                <span className="material-symbols-outlined text-3xl">code_blocks</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-4 text-on-surface">Real-world Projects</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Learn by building actual products. Solve complex technical problems within a professional terminal environment.</p>
            </div>
          </div>
        </section>

        {/* Trending Courses */}
        <section className="relative py-24 px-margin-desktop z-10 max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg md:text-[48px] text-on-surface mb-4">Everything you need to become a developer</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Card 1: Interactive Learning */}
            <div ref={addToRefs} style={{ '--glow-color': 'var(--color-primary-fixed-dim)' }} className="group p-8 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(77,182,172,0.1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-fixed-dim/10 text-primary-fixed-dim">
                  <span className="material-symbols-outlined text-3xl">extension</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Interactive Learning</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Hands-on exercises with instant feedback</p>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-fixed-dim w-[37.5%]"></div>
                </div>
                <div className="flex justify-end">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">3/8 lessons</span>
                </div>
              </div>
            </div>

            {/* Card 2: Real-world Projects */}
            <div ref={addToRefs} style={{ '--glow-color': 'var(--color-secondary)' }} className="group p-8 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(216,191,216,0.1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary-container/10 text-secondary-container">
                  <span className="material-symbols-outlined text-3xl">work</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Real-world Projects</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Build portfolio-worthy applications</p>
            </div>

            {/* Card 3: Community Support */}
            <div ref={addToRefs} style={{ '--glow-color': 'var(--color-tertiary)' }} className="group p-8 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(135,169,107,0.1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-container/10 text-primary-container">
                  <span className="material-symbols-outlined text-3xl">forum</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Community Support</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Join thousands of learners and mentors</p>
            </div>

            {/* Card 4: AI Assistance */}
            <div ref={addToRefs} style={{ '--glow-color': 'var(--color-primary-fixed-dim)' }} className="group p-8 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(77,182,172,0.1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-fixed-dim/10 text-primary-fixed-dim">
                  <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">AI Assistance</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Get help from our AI-powered coding assistant</p>
            </div>

            {/* Card 5: Certificate */}
            <div ref={addToRefs} style={{ '--glow-color': 'var(--color-secondary)' }} className="group p-8 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(216,191,216,0.1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary-container/10 text-secondary-container">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Certificate</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Earn verified certificates upon completion</p>
            </div>

            {/* Card 6: Career Path (Full Width) */}
            <div ref={addToRefs} style={{ '--glow-color': 'var(--color-tertiary)' }} className="group p-8 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl spinning-border-card md:col-span-3 shadow-[0_0_20px_rgba(135,169,107,0.1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-container/10 text-primary-container">
                  <span className="material-symbols-outlined text-3xl">apartment</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Career Path</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Follow structured learning paths from beginner to professional developer</p>
            </div>
          </div>
        </section>      </main>
    </>
  );
};

export default LandingPage;
