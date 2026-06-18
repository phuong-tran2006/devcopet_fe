import { useEffect, useRef } from "react";

import MouseTrail from "../../../../components/ui/MouseTrail";
import heroMascotVideo from "../../../../assets/videos/7936438193787.mp4";
import TransparentVideo from "../../../../components/ui/TransparentVideo";

const LandingPage = () => {
  const glowCardsRef = useRef<any[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      });
    }, observerOptions);

    glowCardsRef.current.forEach((card) => {
      if (card) {
        card.classList.add(
          "opacity-0",
          "translate-y-10",
          "transition-all",
          "duration-700",
        );
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: any) => {
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
        <section className="relative min-h-[90vh] flex items-center px-margin-desktop py-16 z-10">
          <div className="w-full max-w-container-max mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left: Text Content */}
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <h1 className="font-headline-lg text-headline-lg md:text-[72px] leading-tight font-extrabold tracking-tight text-on-surface">
                  Explore the Depths of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed-dim via-cyan-300 to-secondary-fixed-dim">
                    Coding
                  </span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  An AI-powered training system with personalized roadmaps,
                  project-based mentoring, and a community of elite developers.
                  Break every technical limit.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <button className="bg-primary-fixed-dim text-on-primary-fixed font-bold py-4 px-10 rounded-lg text-[18px] glow-cyan hover:scale-105 transition-all duration-300 ease-out-cubic active:scale-95">
                    Get Started Now
                  </button>
                  <button className="border border-outline/20 hover:border-outline/40 backdrop-blur-md text-on-surface font-bold py-4 px-10 rounded-lg text-[18px] transition-all duration-300 ease-out-cubic active:scale-95">
                    View Roadmap
                  </button>
                </div>
              </div>

              {/* Right: Video Mascot — green screen removed */}
              <div className="flex-1 flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[560px]">
                  {/* Soft glow behind mascot */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed-dim/15 via-cyan-400/8 to-secondary-fixed-dim/15 blur-3xl scale-110 pointer-events-none rounded-full hidden dark:block" />
                  <TransparentVideo
                    src={heroMascotVideo}
                    className="w-full"
                    keyColor={[0, 200, 0]}
                    tolerance={28}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="relative py-24 px-margin-desktop z-10 max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div
              ref={addToRefs}
              style={{ "--glow-color": "#008080" } as any}
              className="group p-8 bg-on-surface/5 backdrop-blur-xl border border-on-surface/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(0,128,128,0.1)]"
            >
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-lg bg-primary-fixed-dim/10 text-primary-fixed-dim">
                <span className="material-symbols-outlined text-3xl">
                  psychology
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-4 text-on-surface">
                Personalized Roadmap
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Our AI system analyzes your skills and suggests an optimized
                learning path tailored to your learning pace.
              </p>
            </div>

            <div
              ref={addToRefs}
              style={{ "--glow-color": "#D8BFD8" } as any}
              className="group p-8 bg-on-surface/5 backdrop-blur-xl border border-on-surface/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(0,128,128,0.1)]"
            >
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-lg bg-secondary-container/10 text-secondary-container">
                <span className="material-symbols-outlined text-3xl">
                  groups
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-4 text-on-surface">
                Mentor Community
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Connect directly with experts from leading tech corporations to
                receive 1:1 personalized feedback.
              </p>
            </div>

            <div
              ref={addToRefs}
              style={{ "--glow-color": "#87A96B" } as any}
              className="group p-8 bg-on-surface/5 backdrop-blur-xl border border-on-surface/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(0,128,128,0.1)]"
            >
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-lg bg-primary-container/10 text-primary-container">
                <span className="material-symbols-outlined text-3xl">
                  code_blocks
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-4 text-on-surface">
                Real-world Projects
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Learn by building actual products. Solve complex technical
                problems within a professional terminal environment.
              </p>
            </div>
          </div>
        </section>

        {/* Trending Courses */}
        <section className="relative py-24 px-margin-desktop z-10 max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg md:text-[48px] text-on-surface mb-4">
              Everything you need to become a developer
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Card 1: Interactive Learning */}
            <div
              ref={addToRefs}
              className="group p-8 bg-on-surface/5 backdrop-blur-xl border border-on-surface/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(0,128,128,0.1)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-fixed-dim/10 text-primary-fixed-dim">
                  <span className="material-symbols-outlined text-3xl">
                    extension
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Interactive Learning
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Hands-on exercises with instant feedback
              </p>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-on-surface/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-fixed-dim w-[37.5%]"></div>
                </div>
                <div className="flex justify-end">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    3/8 lessons
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Real-world Projects */}
            <div
              ref={addToRefs}
              style={{ "--glow-color": "#D8BFD8" } as any}
              className="group p-8 bg-on-surface/5 backdrop-blur-xl border border-on-surface/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(0,128,128,0.1)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary-container/10 text-secondary-container">
                  <span className="material-symbols-outlined text-3xl">
                    work
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Real-world Projects
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Build portfolio-worthy applications
              </p>
            </div>

            {/* Card 3: Community Support */}
            <div
              ref={addToRefs}
              className="group p-8 bg-on-surface/5 backdrop-blur-xl border border-on-surface/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(0,128,128,0.1)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-container/10 text-primary-container">
                  <span className="material-symbols-outlined text-3xl">
                    forum
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Community Support
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Join thousands of learners and mentors
              </p>
            </div>

            {/* Card 4: AI Assistance */}
            <div
              ref={addToRefs}
              className="group p-8 bg-on-surface/5 backdrop-blur-xl border border-on-surface/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(0,128,128,0.1)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-fixed-dim/10 text-primary-fixed-dim">
                  <span className="material-symbols-outlined text-3xl">
                    auto_awesome
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  AI Assistance
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Get help from our AI-powered coding assistant
              </p>
            </div>

            {/* Card 5: Certificate */}
            <div
              ref={addToRefs}
              style={{ "--glow-color": "#D8BFD8" } as any}
              className="group p-8 bg-on-surface/5 backdrop-blur-xl border border-on-surface/10 rounded-xl spinning-border-card shadow-[0_0_20px_rgba(0,128,128,0.1)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary-container/10 text-secondary-container">
                  <span className="material-symbols-outlined text-3xl">
                    verified
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Certificate
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Earn verified certificates upon completion
              </p>
            </div>

            {/* Card 6: Career Path (Full Width) */}
            <div
              ref={addToRefs}
              className="group p-8 bg-on-surface/5 backdrop-blur-xl border border-on-surface/10 rounded-xl spinning-border-card md:col-span-3 shadow-[0_0_20px_rgba(0,128,128,0.1)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-container/10 text-primary-container">
                  <span className="material-symbols-outlined text-3xl">
                    apartment
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Career Path
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Follow structured learning paths from beginner to professional
                developer
              </p>
            </div>
          </div>
        </section>

        {/* Join the Colony */}
        <section className="relative py-24 px-margin-desktop z-10 max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Join the Colony
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                Learning to code shouldn't be a solo mission. Devcopet is built
                by a global team of developers, educators, and gamers who
                believe the best way to learn is together.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-on-surface/10 bg-on-surface/5 backdrop-blur-md hover:bg-on-surface/10 transition-all text-on-surface hover:text-primary transition-colors"
                  href="https://discord.gg/devcopet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                  </svg>
                  <span className="font-label-sm uppercase tracking-widest text-[12px] font-bold">
                    Discord
                  </span>
                </a>
                <a
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-on-surface/10 bg-on-surface/5 backdrop-blur-md hover:bg-on-surface/10 transition-all text-on-surface hover:text-primary transition-colors"
                  href="https://github.com/phuong-tran2006/devcopet_fe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  <span className="font-label-sm uppercase tracking-widest text-[12px] font-bold">
                    Github
                  </span>
                </a>
                <a
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-on-surface/10 bg-on-surface/5 backdrop-blur-md hover:bg-on-surface/10 transition-all text-on-surface hover:text-primary transition-colors"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span className="font-label-sm uppercase tracking-widest text-[12px] font-bold">
                    Linkedin
                  </span>
                </a>
              </div>
            </div>

            <div
              ref={addToRefs}
              className="bg-on-surface/5 backdrop-blur-xl border border-outline/20 rounded-xl p-8 spinning-border-card"
            >
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-8">
                Our Core Team
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center text-primary-fixed-dim font-bold">
                    N
                  </div>
                  <div>
                    <div className="text-on-surface font-bold">Hoàng Nhân</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">
                      Backend
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-secondary-container/30 flex items-center justify-center text-secondary-container font-bold">
                    Y
                  </div>
                  <div>
                    <div className="text-on-surface font-bold">Yến Phương</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">
                      Frontend
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center text-primary-fixed-dim font-bold">
                    C
                  </div>
                  <div>
                    <div className="text-on-surface font-bold">Chí Thành</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">
                      Backend
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-secondary-container/30 flex items-center justify-center text-secondary-container font-bold">
                    T
                  </div>
                  <div>
                    <div className="text-on-surface font-bold">Tiến Thành</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">
                      Frontend
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center text-primary-fixed-dim font-bold">
                    T
                  </div>
                  <div>
                    <div className="text-on-surface font-bold">Tuấn Kiệt</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">
                      Backend
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-primary-container/30 flex items-center justify-center text-primary-container font-bold">
                    Đ
                  </div>
                  <div>
                    <div className="text-on-surface font-bold">Đức Tường</div>
                    <div className="text-label-sm text-on-surface-variant uppercase tracking-widest">
                      Mentor
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-on-surface/5">
                <p className="text-on-surface-variant italic text-center">
                  "We're always looking for contributors! Help us build the
                  future of education."
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;
