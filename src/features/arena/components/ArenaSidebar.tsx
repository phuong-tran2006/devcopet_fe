import { Link, useLocation } from "@tanstack/react-router";

const ArenaSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Matchmaking", path: "/dashboard", icon: "swords" },
    { label: "Active Battle", path: "/dashboard/active", icon: "code" },
    { label: "History", path: "/dashboard/history", icon: "history" },
    { label: "Rankings", path: "/dashboard/rankings", icon: "emoji_events" },
  ];

  return (
    <aside className="w-[280px] h-full dark:bg-[#0b1219] bg-surface-container border-r dark:border-white/5 border-outline/10 flex flex-col py-8 px-6 shrink-0 relative z-10 transition-colors duration-300">
      {/* Rank Display */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-[84px] h-[84px] rounded-[24px] dark:bg-[#0b1219] bg-surface border-2 dark:border-[#e6c1d8] border-primary-fixed-dim flex items-center justify-center p-1 dark:shadow-[0_0_20px_rgba(230,193,216,0.15)] shadow-md mb-4 overflow-hidden transition-colors duration-300">
          {/* Inner dark container for the badge icon */}
          <div className="w-full h-full rounded-[20px] dark:bg-gradient-to-b dark:from-[#14232e] dark:to-[#0b1219] bg-surface-container-high flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[42px] dark:text-[#29b6f6] text-primary dark:drop-shadow-[0_0_8px_rgba(41,182,246,0.6)]">
              security
            </span>
          </div>
        </div>
        <h2 className="text-[24px] font-extrabold dark:text-[#f3d9e9] text-on-surface mb-1 tracking-wide transition-colors duration-300">
          Arena Rank
        </h2>
        <p className="text-[13px] dark:text-gray-400 text-on-surface-variant font-medium">
          Elite Developer
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1 mt-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-colors duration-200 ${
                isActive
                  ? "dark:bg-[#5e4655] bg-primary/10 dark:text-[#ecd6e5] text-primary"
                  : "dark:text-gray-400 text-on-surface-variant dark:hover:text-gray-200 hover:text-on-surface dark:hover:bg-white/5 hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-[20px] opacity-90">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Quick Match Button */}
      <div className="mt-auto">
        <button className="w-full dark:bg-[#d3b8cd] bg-primary dark:text-[#392634] text-on-primary font-bold py-3 px-4 rounded-xl dark:shadow-[0_0_15px_rgba(211,184,205,0.2)] shadow-md dark:hover:bg-[#e0c4da] hover:bg-primary/90 transition-colors duration-200">
          Quick Match
        </button>
      </div>
    </aside>
  );
};

export default ArenaSidebar;
