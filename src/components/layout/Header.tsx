// @ts-nocheck
import LucideIcon from "../ui/LucideIcon";
import React from "react";
import {
  Link,
  useNavigate,
  useMatchRoute,
  useLocation,
} from "@tanstack/react-router";
import { useAuthStore } from "../../features/users/store/auth.store";
import { useTheme } from "../../contexts/ThemeContext";
import NotificationDropdown from "./NotificationDropdown";
import DailyMissionDropdown from "./DailyMissionDropdown";

const NavLink = ({ to, label, exact = false, onClick }) => {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to, fuzzy: !exact });

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`font-body-md text-body-md transition-colors ${isActive ? "text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1" : "text-on-surface-variant hover:text-on-surface"}`}
    >
      {label}
    </Link>
  );
};

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme, t, triggerHaptic } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboarding";

  const [activeDropdown, setActiveDropdown] = React.useState<
    "notifications" | "missions" | null
  >(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/10 backdrop-blur-xl border-b border-outline/20 shadow-[0_0_20px_rgba(0,218,248,0.1)] transition-colors duration-300">
      <nav className="flex justify-between items-center px-margin-desktop h-20 w-full">
        <div className="flex items-center gap-12">
          <Link
            to="/"
            onClick={() => triggerHaptic(40)}
            className="font-headline-sm text-headline-sm tracking-tighter text-primary-fixed-dim font-bold"
          >
            DevCopet
          </Link>
          {!isOnboarding && (
            <div className="hidden md:flex gap-8 items-center">
              <NavLink
                to="/course"
                label={t("course")}
                onClick={() => triggerHaptic(40)}
              />
              <NavLink
                to="/roadmap"
                label={t("roadmap")}
                onClick={() => triggerHaptic(40)}
              />

              <NavLink
                to="/arena"
                label={t("arena")}
                onClick={() => triggerHaptic(40)}
              />

              <NavLink
                to="/leaderboard"
                label={t("leaderboard")}
                onClick={() => triggerHaptic(40)}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              {!isOnboarding && (
                <>
                  <NotificationDropdown
                    isOpen={activeDropdown === "notifications"}
                    onToggle={() => {
                      triggerHaptic(40);
                      setActiveDropdown(
                        activeDropdown === "notifications"
                          ? null
                          : "notifications",
                      );
                    }}
                    onClose={() => setActiveDropdown(null)}
                  />
                  <DailyMissionDropdown
                    isOpen={activeDropdown === "missions"}
                    onToggle={() => {
                      triggerHaptic(40);
                      setActiveDropdown(
                        activeDropdown === "missions" ? null : "missions",
                      );
                    }}
                    onClose={() => setActiveDropdown(null)}
                  />
                </>
              )}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center hover:bg-on-surface/5 transition-all text-on-surface"
              >
                <LucideIcon
                  name={theme === "dark" ? "light_mode" : "dark_mode"}
                  className="text-[20px]"
                />
              </button>
              {!isOnboarding ? (
                <>
                  {/* Profile Dropdown */}
                  <div className="relative group cursor-pointer ml-2 z-50">
                    <div className="w-9 h-9 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed-dim text-sm font-bold border border-primary-fixed-dim/30 group-hover:border-primary-fixed-dim transition-all duration-300 shadow-[0_0_10px_rgba(0,218,248,0.3)] overflow-hidden">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user?.name || user?.username || "User"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerText = (
                                user?.name ||
                                user?.username ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase();
                            }
                          }}
                        />
                      ) : (
                        <>
                          {(user?.name || user?.username || user?.email || "U")
                            .charAt(0)
                            ?.toUpperCase()}
                        </>
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full right-0 w-40 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-surface-container-high/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                        <div className="flex flex-col gap-1 p-2">
                          <Link
                            to="/profile"
                            onClick={() => triggerHaptic(40)}
                            className="w-full text-left px-3 py-2 text-sm text-on-surface hover:bg-white/5 rounded-lg transition-colors font-medium flex items-center gap-2"
                          >
                            <LucideIcon name="person" className="text-[16px]" />
                            {t("profile")}
                          </Link>
                          <div className="h-px w-full bg-white/5 my-1"></div>
                          <button
                            onClick={() => {
                              triggerHaptic(50);
                              handleLogout();
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors font-medium flex items-center gap-2"
                          >
                            <LucideIcon name="logout" className="text-[16px]" />
                            {t("logout")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    triggerHaptic(50);
                    handleLogout();
                  }}
                  className="px-4 py-2 border border-outline/20 hover:bg-on-surface/5 rounded-lg text-sm text-on-surface font-medium transition-all"
                >
                  {t("logout")}
                </button>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => triggerHaptic(40)}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-all duration-300 ease-out-cubic active:scale-95"
              >
                {t("login")}
              </Link>
              <Link
                to="/register"
                onClick={() => triggerHaptic(40)}
                className="bg-primary-fixed-dim text-on-primary-fixed font-bold py-2 px-6 rounded-lg glow-cyan hover:bg-primary-container transition-all duration-300 ease-out-cubic active:scale-95"
              >
                {t("signUp")}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
