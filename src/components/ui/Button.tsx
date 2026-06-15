// @ts-nocheck
import React from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonClasses = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-fixed-dim text-on-primary-fixed shadow-[0px_0px_15px_rgba(0,128,128,0.4)] hover:shadow-[0px_0px_20px_rgba(0,128,128,0.6)]",
        secondary:
          "bg-surface-container text-on-surface border border-on-surface/10 hover:bg-surface-container-high",
        outline:
          "bg-transparent text-primary-fixed-dim border-2 border-primary-fixed-dim hover:bg-primary-fixed-dim/10",
      },
      size: {
        small: "text-sm px-4 py-2",
        medium: "text-base px-6 py-3",
        large: "text-lg px-8 py-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  },
);

const Button = ({
  // Required parameters with defaults
  text = "Login",
  text_font_size = "16",

  // Optional parameters (no defaults)
  layout_width,
  padding,
  position,
  layout_gap,
  margin,

  // Standard React props
  variant,
  size,
  disabled = false,
  className,
  children,
  onClick,
  type = "button",
  leftIcon,
  rightIcon,
  ...props
}: any) => {
  // Safe validation for optional parameters
  const hasValidWidth =
    layout_width &&
    typeof layout_width === "string" &&
    layout_width?.trim() !== "" &&
    layout_width !== "full";
  const isFullWidth = layout_width === "full";
  const hasValidPadding =
    padding &&
    typeof padding === "string" &&
    padding?.trim() !== "" &&
    padding !== "default";
  const hasValidMargin =
    margin &&
    typeof margin === "string" &&
    margin?.trim() !== "" &&
    margin !== "none";
  const hasValidPosition =
    position &&
    typeof position === "string" &&
    position?.trim() !== "" &&
    position !== "center";
  const hasValidGap =
    layout_gap &&
    typeof layout_gap === "string" &&
    layout_gap?.trim() !== "" &&
    layout_gap !== "default";

  // Build optional Tailwind classes
  const optionalClasses = [
    isFullWidth ? "w-full" : "",
    hasValidWidth ? `w-[${layout_width}]` : "",
    hasValidPadding ? `p-[${padding}]` : "",
    hasValidMargin ? `m-[${margin}]` : "",
    hasValidPosition ? position : "",
    hasValidGap ? `gap-[${layout_gap}]` : "",
  ]
    ?.filter(Boolean)
    ?.join(" ");

  // Build inline styles — only font-size is customizable
  const buttonStyles: React.CSSProperties = {
    fontSize: text_font_size ? `${text_font_size}px` : "16px",
    borderRadius: "8px",
  };

  // Safe click handler
  const handleClick = (event) => {
    if (disabled) return;
    if (typeof onClick === "function") {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      style={buttonStyles}
      className={twMerge(
        buttonClasses({ variant, size }),
        optionalClasses,
        className,
      )}
      aria-disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children || text}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
