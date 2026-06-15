// @ts-nocheck
import React from "react";
import { twMerge } from "tailwind-merge";

const Link = ({
  href = "#",
  children,
  className,
  external = false,
  disabled = false,
  onClick,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) {
      e?.preventDefault();
      return;
    }
    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  const linkClasses = twMerge(
    "inline-flex items-center justify-center transition-all duration-200",
    "hover:opacity-80 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-teal-light focus:ring-offset-2",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className,
  );

  return (
    <a
      href={href}
      className={linkClasses}
      onClick={handleClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
