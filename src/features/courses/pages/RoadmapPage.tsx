import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { courseApi } from "../api/course.api";
import { useAuthStore } from "../../users/store/auth.store";
import LucideIcon from "../../../components/ui/LucideIcon";

const RoadmapPage = () => {
  const [pythonCompletion, setPythonCompletion] = useState<number>(0);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Select Your Domain | Devcopet Learn";

    if (!isAuthenticated) {
      setPythonCompletion(0);
      return;
    }

    let alive = true;
    const courseSlug = "python-basic";

    Promise.all([
      courseApi.getEasyRoadmap(courseSlug).catch(() => null),
      courseApi.getMediumRoadmap(courseSlug).catch(() => null),
      courseApi.getHardRoadmap(courseSlug).catch(() => null),
    ]).then(([easy, medium, hard]) => {
      if (!alive) return;
      let total = 0;
      let completed = 0;

      const processRoadmap = (roadmap: any) => {
        if (!roadmap) return;
        if (
          typeof roadmap.completedNodes === "number" &&
          typeof roadmap.totalNodes === "number"
        ) {
          completed += roadmap.completedNodes;
          total += roadmap.totalNodes;
        } else if (roadmap.chapters) {
          roadmap.chapters.forEach((chapter: any) => {
            chapter.nodes?.forEach((node: any) => {
              total += 1;
              if (node.status === "completed") {
                completed += 1;
              }
            });
          });
        }
      };

      processRoadmap(easy);
      processRoadmap(medium);
      processRoadmap(hard);

      if (total > 0) {
        setPythonCompletion(Math.round((completed / total) * 100));
      } else {
        setPythonCompletion(0);
      }
    });

    return () => {
      alive = false;
    };
  }, [isAuthenticated]);

  return (
    <main className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-start bg-background overflow-hidden pb-16 px-4 md:px-8 lg:px-16">
      {/* Background Grid & Streaks */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 overflow-hidden">
          {/* Glowing points */}
          <div className="absolute w-1 h-1 bg-white rounded-full top-[15%] left-[10%] opacity-80 blur-[1px]"></div>
          <div className="absolute w-1.5 h-1.5 bg-[#008080] rounded-full top-[25%] left-[85%] opacity-90 blur-[2px]"></div>
          <div className="absolute w-1 h-1 bg-[#D8BFD8] rounded-full top-[70%] left-[15%] opacity-80 blur-[1px]"></div>
          <div className="absolute w-2 h-2 bg-white rounded-full top-[85%] left-[75%] opacity-90 blur-[2px]"></div>

          {/* Cybernetic streaks */}
          <div className="absolute w-[2px] h-[120px] bg-gradient-to-b from-transparent via-[#008080]/30 to-transparent top-[10%] left-[30%] opacity-40 rotate-[35deg]"></div>
          <div className="absolute w-[1px] h-[180px] bg-gradient-to-b from-transparent via-[#D8BFD8]/20 to-transparent top-[45%] left-[80%] opacity-30 rotate-[-25deg]"></div>
        </div>
        <div className="absolute inset-0 digital-grid opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1200px] flex flex-col items-stretch gap-8 mt-8">
        {/* Page Title Header */}
        <section className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="font-headline-lg text-[32px] md:text-[40px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-on-surface via-on-surface to-on-surface-variant tracking-tight">
            Select Your Domain
          </h1>
          <p className="text-sm md:text-base font-normal leading-relaxed text-on-surface-variant max-w-[800px]">
            Embark on a specialized mastery path. Level up your pets while
            mastering high-performance technologies in a gamified command
            center.
          </p>
        </section>

        {/* Map Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-4">
          {/* Card 1: Python */}
          <div className="bg-surface rounded-2xl border border-outline/30 p-6 flex flex-col hover:border-primary-fixed-dim/50 hover:shadow-[0_8px_30px_rgba(0,128,128,0.2)] transition-all duration-500 ease-out-cubic group relative overflow-hidden">
            {/* Logo Wrapper */}
            <div className="h-[100px] w-full bg-primary-fixed-dim/10 border border-primary-fixed-dim/10 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:bg-primary-fixed-dim/20 transition-colors">
              <svg
                viewBox="0 0 110 110"
                className="w-[54px] h-[54px] group-hover:scale-105 transition-transform duration-500 ease-out"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#387EB8"
                  d="M53.79,3.08C25.07,3.08,21.84,15.53,21.84,15.53l0.04,12.78h32.61v4.54H16.14c0,0-15.01-1.74-15.01,23.18  c0,24.91,12.98,24.28,12.98,24.28h7.24v-11.4c0,0-0.12-14.28,14.07-14.28h22.25c0,0,13.62,0.11,13.62-13.25V17.06  C71.3,17.06,73.5,3.08,53.79,3.08z M38.45,9.66c2.61,0,4.72,2.11,4.72,4.72c0,2.61-2.11,4.72-4.72,4.72c-2.61,0-4.72-2.11-4.72-4.72  C33.73,11.78,35.84,9.66,38.45,9.66z"
                />
                <path
                  fill="#FFE052"
                  d="M54.89,106.92c28.72,0,31.95-12.45,31.95-12.45l-0.04-12.78H54.19v-4.54h38.35c0,0,15.01,1.74,15.01-23.18  c0-24.91-12.98-24.28-12.98-24.28h-7.24v11.4c0,0,0.12,14.28-14.07,14.28H50.99c0,0-13.62-0.11-13.62,13.25v24.32  C37.38,92.94,35.18,106.92,54.89,106.92z M70.23,100.34c-2.61,0-4.72-2.11-4.72-4.72c0-2.61,2.11-4.72,4.72-4.72  c2.61,0,4.72,2.11,4.72,4.72C74.95,98.22,72.84,100.34,70.23,100.34z"
                />
              </svg>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="font-headline-sm text-[22px] font-bold text-on-surface tracking-wide group-hover:text-primary transition-colors">
                Python World
              </h2>
              <p className="font-body-sm text-[12.5px] leading-relaxed text-on-surface-variant min-h-[54px] line-clamp-3">
                The realm of Data Science, AI, and rapid prototyping. Master the
                syntax of the gods and automate your destiny.
              </p>
            </div>

            {/* Progress Slider */}
            <div className="flex flex-col gap-1.5 mb-6">
              <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider">
                <span className="text-on-surface-variant">
                  World Completion
                </span>
                <span className="text-primary">{pythonCompletion}%</span>
              </div>
              <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-fixed-dim rounded-full shadow-[0_0_10px_rgba(0,128,128,0.4)]"
                  style={{ width: `${pythonCompletion}%` }}
                ></div>
              </div>
            </div>

            {/* Action Button */}
            <Link
              to="/roadmap/$worldId"
              params={{ worldId: "python-basic" }}
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  navigate({
                    to: "/login",
                    search: { redirect: "/roadmap/python-basic" },
                  });
                }
              }}
              className="mt-auto w-full bg-primary-fixed-dim text-on-primary-fixed font-extrabold text-[12px] py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,128,128,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Enter World{" "}
              <LucideIcon name="arrow_forward" className="text-[15px]" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RoadmapPage;
