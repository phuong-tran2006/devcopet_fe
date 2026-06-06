import React, { useState } from 'react';
import { Link, useNavigate, useMatchRoute } from '@tanstack/react-router';
import Logo from './Logo';
import { useAuthStore } from '../../features/users/store/auth.store';
import { Settings, Bell, LogOut, User } from 'lucide-react';

const NavLink = ({ to, label, exact = false }) => {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to, fuzzy: !exact });

  return (
    <div className={`h-full flex items-center border-b-2 transition-all duration-300 ${isActive ? 'border-blue-400' : 'border-transparent hover:border-white/20'}`}>
      <Link
        to={to}
        className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
      >
        {label}
      </Link>
    </div>
  );
};

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <header className="shrink-0 w-full h-[60px] border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center px-6 relative z-50 transition-all duration-300">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <NavLink to="/course" label="Tutorial" />
          <NavLink to="/roadmap" label="Roadmap" />
          <NavLink to="/dashboard" label="Dashboard" />
          <NavLink to="/leaderboard" label="Leaderboard" />
        </nav>

        {/* Right: Auth or Icons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-full border border-transparent hover:border-white/10 hover:bg-white/5">
                <Settings size={18} />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative group cursor-pointer ml-2 z-50">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold border border-white/20 group-hover:border-blue-400 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <>{user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}</>
                  )}
                </div>

                {/* Dropdown Menu */}
                <div className="absolute top-10 right-0 w-40 bg-[#0A0A10]/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                  <div className="flex flex-col gap-1 p-2">
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-white/5 hover:text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <div className="h-px w-full bg-white/5 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm font-medium text-slate-300 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-sm font-medium text-black bg-white rounded-lg hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
