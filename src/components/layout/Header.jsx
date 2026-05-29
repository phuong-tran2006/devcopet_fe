import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Logo from './Logo';
import HeaderMenu from './HeaderMenu';
import Link from '../ui/Link.jsx';
import { mascotAxolotl } from '../../features/users/constants/authImages';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="w-full bg-background-overlay border-b border-border-light"
      style={{
        boxShadow: '0px 4px 20px #00808019',
      }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="flex flex-row justify-between items-center py-6 sm:py-7 md:py-8 gap-4">
          {/* Logo */}
          <Logo className="" onClick={() => {}} />

          {/* Hamburger Menu Icon (Mobile only) */}
          <button
            className="block lg:hidden p-2 text-text-primary hover:text-text-accent focus:outline-none focus:ring-2 focus:ring-primary-teal-light rounded"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:block">
            <HeaderMenu />
          </div>

          {/* Desktop Action Icons */}
          <div
            className="hidden lg:flex flex-row gap-3 items-center justify-center px-1 py-1 bg-background-secondary border border-border-primary rounded-xl"
          >
            <Link href="/notifications" ariaLabel="Notifications" onClick={() => {}} className="p-1">
              <svg className="w-5 h-5 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </Link>
            <Link href="/messages" ariaLabel="Messages" onClick={() => {}} className="p-1">
              <svg className="w-5 h-5 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </Link>
            <Link
              href="/profile"
              ariaLabel="User profile"
              className="flex items-center justify-center border border-border-accent-strong rounded-lg p-1"
              onClick={() => {}}
            >
              <img
                src={mascotAxolotl}
                alt="User profile — Devcopet mascot"
                className="h-[30px] w-[30px] rounded-full object-cover object-top"
              />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={twMerge(
            'lg:hidden transition-all duration-300 ease-in-out overflow-hidden',
            menuOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'
          )}
        >
          <HeaderMenu mobile />
          
          {/* Mobile Action Icons */}
          <div className="flex flex-row gap-4 items-center justify-center mt-6 pt-6 border-t border-border-primary">
            <Link href="/notifications" ariaLabel="Notifications" className="p-2" onClick={() => {}}>
              <svg className="w-6 h-6 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </Link>
            <Link href="/messages" ariaLabel="Messages" className="p-2" onClick={() => {}}>
              <svg className="w-6 h-6 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </Link>
            <Link
              href="/profile"
              ariaLabel="User profile"
              className="flex items-center justify-center border border-border-accent-strong rounded-lg p-2"
              onClick={() => {}}
            >
              <img
                src={mascotAxolotl}
                alt="User profile — Devcopet mascot"
                className="h-8 w-8 rounded-full object-cover object-top"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
