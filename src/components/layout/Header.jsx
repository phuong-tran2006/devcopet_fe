import React, { useState } from 'react';
import { Link, useNavigate, useMatchRoute } from '@tanstack/react-router';
import Logo from './Logo';
import { useAuthStore } from '../../features/users/store/auth.store';

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const NavLink = ({ to, label, exact = false }) => {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to, fuzzy: !exact });

  return (
    <div className={`h-full flex items-center border-b-2 ${isActive ? 'border-[#E5E9EC]' : 'border-transparent'}`}>
      <Link
        to={to}
        className={`text-sm font-medium transition-colors ${isActive ? 'text-[#E5E9EC]' : 'text-[#7D8A95] hover:text-[#E5E9EC]'}`}
        style={{ fontFamily: 'Roboto' }}
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
    <header className="shrink-0 w-full h-16 bg-[#081017] border-b border-[#1C2A38] flex items-center px-6" style={{ zIndex: 50 }}>
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <NavLink to="/roadmap" label="Roadmap" />
          <NavLink to="/dashboard" label="Dashboard" />
          <NavLink to="/leaderboard" label="Leaderboard" />
        </nav>

        {/* Right: Auth or Icons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button className="p-2 text-[#7D8A95] hover:text-[#E5E9EC] transition-colors rounded-full border border-transparent hover:border-[#1C2A38]">
                <SettingsIcon />
              </button>
              <button className="p-2 text-[#7D8A95] hover:text-[#E5E9EC] transition-colors rounded-full border border-transparent hover:border-[#1C2A38]">
                <BellIcon />
              </button>
              <div className="relative group cursor-pointer ml-2 z-50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#76d6d5] to-[#d8bfd8] flex items-center justify-center text-[#041521] text-sm font-bold border-2 border-transparent group-hover:border-[#76d6d5] transition-all duration-300 shadow-[0_0_15px_rgba(118,214,213,0.3)] hover:shadow-[0_0_20px_rgba(118,214,213,0.5)] overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <>{user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}</>
                  )}
                </div>

                {/* Dropdown Logout */}
                <div className="absolute top-10 right-0 w-36 bg-[#0A1621] border border-[#1C2A38] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                  <div className="flex flex-col gap-1 p-2">
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-[#d4e4f6] hover:bg-[#121F2D] rounded-lg transition-colors font-medium flex items-center gap-2 cursor-default"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-[#ff6b6b] hover:bg-[#ff6b6b15] rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[#7FE3DD] border border-[#7FE3DD] rounded-lg hover:bg-[#7FE3DD15] transition-all"
                style={{ fontFamily: 'Roboto' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-[#05111A] bg-[#7FE3DD] rounded-lg hover:bg-[#7AEAE2] transition-all"
                style={{ fontFamily: 'Roboto', boxShadow: '0px 0px 10px #7FE3DD30' }}
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
