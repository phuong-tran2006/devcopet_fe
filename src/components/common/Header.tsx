// @ts-nocheck
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Bell, Mail, Menu, X } from "lucide-react";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import Link from "../ui/Link";
import { mascotAxolotl } from "../../features/users/constants/authImages";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="w-full bg-background-overlay border-b border-border-light"
      style={{
        boxShadow: "0px 4px 20px #00808019",
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
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:block">
            <HeaderMenu />
          </div>

          {/* Desktop Action Icons */}
          <div className="hidden lg:flex flex-row gap-3 items-center justify-center px-1 py-1 bg-background-secondary border border-border-primary rounded-xl">
            <Link
              href="/notifications"
              ariaLabel="Notifications"
              onClick={() => {}}
              className=""
            >
              <Bell className="w-5 h-5 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors" />
            </Link>
            <Link
              href="/messages"
              ariaLabel="Messages"
              onClick={() => {}}
              className=""
            >
              <Mail className="w-5 h-5 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors" />
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
            "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
            menuOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0",
          )}
        >
          <HeaderMenu mobile />

          {/* Mobile Action Icons */}
          <div className="flex flex-row gap-4 items-center justify-center mt-6 pt-6 border-t border-border-primary">
            <Link
              href="/notifications"
              ariaLabel="Notifications"
              className="p-2"
              onClick={() => {}}
            >
              <Bell className="w-6 h-6 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors" />
            </Link>
            <Link
              href="/messages"
              ariaLabel="Messages"
              className="p-2"
              onClick={() => {}}
            >
              <Mail className="w-6 h-6 text-[#d8bfd8] hover:text-[#76d6d5] transition-colors" />
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
