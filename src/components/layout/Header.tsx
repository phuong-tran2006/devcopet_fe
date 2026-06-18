// @ts-nocheck
import React from "react";
import { Link, useNavigate, useMatchRoute } from "@tanstack/react-router";
import { useAuthStore } from "../../features/users/store/auth.store";
import { useTheme } from "../../contexts/ThemeContext";

const NavLink = ({ to, label, exact = false }) => {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to, fuzzy: !exact });

  return (
    <Link
      to={to}
      className={`font-body-md text-body-md transition-colors ${isActive ? "text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1" : "text-on-surface-variant hover:text-on-surface"}`}
    >
      {label}
    </Link>
  );
};

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

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
            className="font-headline-sm text-headline-sm tracking-tighter text-primary-fixed-dim font-bold"
          >
            DevCopet
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <NavLink to="/course" label="Course" />
            <NavLink to="/roadmap" label="Roadmap" />
            <NavLink to="/dashboard" label="Arena" />
            <NavLink to="/leaderboard" label="LeaderBoard" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <button className="w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center hover:bg-on-surface/5 transition-all text-on-surface">
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
              </button>
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center hover:bg-on-surface/5 transition-all text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {theme === "dark" ? "light_mode" : "dark_mode"}
                </span>
              </button>
              <Link
                to="/setting/setting"
                className="w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center hover:bg-on-surface/5 transition-all text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">
                  settings
                </span>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative group cursor-pointer ml-2 z-50">
                <div className="w-9 h-9 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed-dim text-sm font-bold border border-primary-fixed-dim/30 group-hover:border-primary-fixed-dim transition-all duration-300 shadow-[0_0_10px_rgba(0,218,248,0.3)] overflow-hidden">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      {user?.username?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </>
                  )}
                </div>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 w-40 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-surface-container-high/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                    <div className="flex flex-col gap-1 p-2">
                      <Link
                        to="/profile"
                        className="w-full text-left px-3 py-2 text-sm text-on-surface hover:bg-white/5 rounded-lg transition-colors font-medium flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          person
                        </span>
                        Profile
                      </Link>
                      <div className="h-px w-full bg-white/5 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors font-medium flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          logout
                        </span>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-all duration-300 ease-out-cubic active:scale-95"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-fixed-dim text-on-primary-fixed font-bold py-2 px-6 rounded-lg glow-cyan hover:bg-primary-container transition-all duration-300 ease-out-cubic active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
