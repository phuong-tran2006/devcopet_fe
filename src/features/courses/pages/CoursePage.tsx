import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { courseApi } from "../api/course.api";
import { useAuthStore } from "../../users/store/auth.store";
import LucideIcon from "../../../components/ui/LucideIcon";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(Math.max(0, Math.round(value || 0)));

const getCourseKey = (course: any) =>
  String(course?.slug || course?._id || course?.id);

const getCourseStats = (course: any, chapters: any[] = []) => {
  const chapterTotals = chapters.reduce(
    (acc, chapter) => {
      const total = Number(chapter?.progress?.totalLessons || 0);
      const completed = Number(chapter?.progress?.completedLessons || 0);

      return {
        totalLessons: acc.totalLessons + total,
        completedLessons: acc.completedLessons + completed,
      };
    },
    { totalLessons: 0, completedLessons: 0 },
  );

  const totalLessons =
    chapterTotals.totalLessons || Number(course?.totalLessons || 0);
  const completedLessons = Math.min(
    totalLessons,
    chapterTotals.completedLessons,
  );

  return {
    totalLessons,
    completedLessons,
    percent:
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0,
  };
};

const PythonLogo = () => (
  <svg
    viewBox="0 0 110 110"
    className="w-[50px] h-[50px] group-hover:scale-105 transition-transform duration-500 ease-out"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
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
);

const CourseIcon = ({ course }: { course: any }) => {
  if ((course?.programmingLanguage || "").toLowerCase() === "python") {
    return <PythonLogo />;
  }

  return (
    <div className="w-[50px] h-[50px] rounded-xl bg-surface/30 border border-on-surface/10 flex items-center justify-center text-primary-fixed-dim group-hover:scale-105 transition-transform">
      <LucideIcon name="terminal" className="text-[28px]" />
    </div>
  );
};

const CourseCard = ({
  course,
  stats,
  featured,
}: {
  course: any;
  stats: any;
  featured: boolean;
}) => {
  const courseKey = getCourseKey(course);
  const level = course?.level || "beginner";
  const buttonLabel = stats.percent > 0 ? "Continue" : "Start Course";

  return (
    <div className="bg-white dark:bg-surface-container rounded-2xl overflow-hidden border border-slate-200 dark:border-on-surface/10 flex flex-col hover:border-teal-500/50 dark:hover:border-primary-fixed-dim/50 transition-all duration-300 group relative shadow-sm hover:shadow-md dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] w-full flex-shrink-0">
      <div className="h-[100px] bg-gradient-to-br from-cyan-50 via-teal-50 to-sky-100 dark:bg-none dark:bg-primary-container relative flex items-center justify-center border-b border-slate-100 dark:border-none">
        {featured && (
          <div className="absolute top-3 left-3 bg-teal-600/10 dark:bg-primary-fixed-dim/20 border border-teal-600/20 dark:border-primary-fixed-dim/40 text-teal-700 dark:text-primary-fixed-dim text-[8px] font-black px-2.5 py-1 rounded-full tracking-widest uppercase backdrop-blur-sm shadow-sm dark:shadow-[0_0_10px_rgba(0,218,248,0.2)]">
            Popular
          </div>
        )}
        <div className="rounded-2xl bg-white/90 dark:bg-slate-950/40 p-2.5 shadow-sm dark:shadow-none border border-slate-200/40 dark:border-cyan-500/10 transition-all duration-300 group-hover:scale-105">
          <CourseIcon course={course} />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2.5 gap-3">
          <h3 className="font-headline-sm text-[16.5px] font-bold text-slate-900 dark:text-on-surface line-clamp-2 leading-snug">
            {course?.title || "Untitled Course"}
          </h3>
          <div className="bg-slate-50 dark:bg-surface-container border border-slate-100 dark:border-none text-slate-500 dark:text-on-surface-variant p-2 rounded-lg flex items-center justify-center shrink-0">
            <LucideIcon
              name={
                (course?.programmingLanguage || "").toLowerCase() === "python"
                  ? "terminal"
                  : "data_object"
              }
              className="text-[14px]"
            />
          </div>
        </div>

        <p className="font-body-sm text-slate-600 dark:text-on-surface-variant text-[12px] leading-relaxed mb-4 line-clamp-2 min-h-[36px]">
          {course?.description ||
            "Master the fundamentals and unlock each lesson through practice."}
        </p>

        <div className="flex gap-2.5 mb-4">
          <div className="bg-slate-50 dark:bg-surface-container border border-slate-100 dark:border-none rounded-xl p-2.5 flex-1">
            <div className="font-label-sm text-[8px] text-slate-400 dark:text-on-surface-variant tracking-widest mb-0.5 uppercase font-bold">
              Units
            </div>
            <div className="text-slate-800 dark:text-on-surface text-[12.5px] font-bold">
              {stats.totalLessons} Units
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-surface-container border border-slate-100 dark:border-none rounded-xl p-2.5 flex-1">
            <div className="font-label-sm text-[8px] text-slate-400 dark:text-on-surface-variant tracking-widest mb-0.5 uppercase font-bold">
              Level
            </div>
            <div className="text-slate-800 dark:text-on-surface text-[12.5px] font-bold capitalize truncate">
              {level}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between text-[11px] font-black mb-1.5">
            <span className="text-slate-700 dark:text-on-surface">Progress</span>
            <span className="text-teal-600 dark:text-primary-fixed-dim">{stats.percent}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-surface-container rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-teal-600 dark:bg-primary-fixed-dim rounded-full shadow-[0_0_8px_rgba(13,148,136,0.3)] dark:shadow-[0_0_10px_rgba(0,218,248,0.5)] transition-all duration-500"
              style={{ width: `${stats.percent}%` }}
            />
          </div>

          <Link
            to="/courses/$courseId"
            params={{ courseId: courseKey }}
            className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-primary-fixed-dim text-white dark:text-on-primary-fixed font-bold text-[12px] py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(13,148,136,0.15)] dark:shadow-[0_0_15px_rgba(0,128,128,0.3)]"
          >
            {buttonLabel}
            <LucideIcon name="arrow_forward" className="text-[14px]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const CoursePage = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [courses, setCourses] = useState<any[]>([]);
  const [courseStats, setCourseStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    document.title = "All Lessons - Devcopet";
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      setLoading(true);
      setError("");

      try {
        const courseList = await courseApi.getCourses();
        const visibleCourses = Array.isArray(courseList) ? courseList : [];

        const statsEntries = await Promise.all(
          visibleCourses.map(async (course) => {
            const courseKey = getCourseKey(course);

            try {
              const chapters = await courseApi.getChapters(courseKey);
              return [courseKey, getCourseStats(course, chapters || [])];
            } catch (err) {
              console.error("Failed to load course progress:", courseKey, err);
              return [courseKey, getCourseStats(course, [])];
            }
          }),
        );

        if (!isMounted) return;

        setCourses(visibleCourses);
        setCourseStats(Object.fromEntries(statsEntries));
      } catch (err) {
        console.error("Failed to load courses:", err);
        if (isMounted) {
          setError("Could not load courses. Please try again later.");
          setCourses([]);
          setCourseStats({});
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...courses]
      .filter((course) => {
        const matchesSearch =
          !normalizedSearch ||
          [course?.title, course?.description, course?.programmingLanguage]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(normalizedSearch),
            );
        const matchesDifficulty =
          difficulty === "all" || course?.level === difficulty;

        return matchesSearch && matchesDifficulty;
      })
      .sort((a, b) => {
        if (sortBy === "progress") {
          return (
            (courseStats[getCourseKey(b)]?.percent || 0) -
            (courseStats[getCourseKey(a)]?.percent || 0)
          );
        }

        if (sortBy === "newest") {
          return (
            new Date(b?.createdAt || 0).getTime() -
            new Date(a?.createdAt || 0).getTime()
          );
        }

        return Number(a?.order || 0) - Number(b?.order || 0);
      });
  }, [courseStats, courses, difficulty, searchTerm, sortBy]);

  const userXp = Number(currentUser?.lifetimeXp || currentUser?.currentXp || 0);

  return (
    <main className="w-full h-full relative pb-6 px-4 md:px-10 lg:px-16">
      <div className="max-w-[1200px] mx-auto pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-3">
          <div>
            <h1 className="font-headline-lg text-[24px] md:text-[28px] font-bold text-on-surface tracking-wide uppercase mb-1">
              All Lessons
            </h1>
            <p className="font-body-sm text-[13px] text-on-surface-variant">
              Choose a stack to master and evolve your familiar.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              <LucideIcon name="search" className="text-[20px]" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search courses..."
              className="w-full bg-surface-container border border-on-surface/10 rounded-lg pl-10 pr-4 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-fixed-dim transition-colors"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                className="bg-surface-container border border-on-surface/10 rounded-lg pl-4 pr-10 py-2 text-[13px] text-on-surface-variant focus:outline-none focus:border-primary-fixed-dim appearance-none cursor-pointer hover:bg-surface-container-high transition-colors h-full"
              >
                <option value="all">Difficulty: All</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <LucideIcon name="expand_more" className="text-[18px]" />
              </div>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="bg-surface-container border border-on-surface/10 rounded-lg pl-4 pr-10 py-2 text-[13px] text-on-surface-variant focus:outline-none focus:border-primary-fixed-dim appearance-none cursor-pointer hover:bg-surface-container-high transition-colors h-full"
              >
                <option value="popular">Sort: Popular</option>
                <option value="newest">Sort: Newest</option>
                <option value="progress">Sort: Progress</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <LucideIcon name="expand_more" className="text-[18px]" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-[#f87171]/30 bg-[#f87171]/10 text-[#fca5a5] px-4 py-3 text-[13px]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {loading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-[330px] rounded-xl bg-surface-container border border-on-surface/10 overflow-hidden animate-pulse"
              >
                <div className="h-[90px] bg-primary-container/60" />
                <div className="p-4 space-y-4">
                  <div className="h-5 bg-on-surface/10 rounded w-2/3" />
                  <div className="h-10 bg-on-surface/10 rounded" />
                  <div className="flex gap-2">
                    <div className="h-14 bg-on-surface/10 rounded flex-1" />
                    <div className="h-14 bg-on-surface/10 rounded flex-1" />
                  </div>
                  <div className="h-2 bg-on-surface/10 rounded" />
                  <div className="h-10 bg-on-surface/10 rounded-xl" />
                </div>
              </div>
            ))
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => {
              const courseKey = getCourseKey(course);
              return (
                <CourseCard
                  key={courseKey}
                  course={course}
                  stats={courseStats[courseKey] || getCourseStats(course, [])}
                  featured={index === 0}
                />
              );
            })
          ) : (
            <div className="w-full rounded-xl border border-on-surface/10 bg-surface-container px-6 py-12 text-center text-on-surface-variant">
              No courses match your filters.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CoursePage;
