import React from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonClasses = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-lavender text-text-dark shadow-[0px_0px_15px_#d8bfd866] hover:shadow-[0px_0px_20px_#d8bfd899]",
        secondary:
          "bg-background-card text-text-primary border border-border-primary hover:bg-background-secondary",
        outline:
          "bg-transparent text-text-accent border-2 border-primary-teal-light hover:bg-primary-teal-light hover:bg-opacity-10",
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
  text_font_size = "24",
  text_font_family = "Montserrat",
  text_font_weight = "600",
  text_line_height = "30px",
  text_text_align = "center",
  text_color = "#3c2b3e",
  fill_background_color = "#d8bfd8",
  border_border_radius = "8px",
  effect_box_shadow = "0px 0px 15px #d8bfd866",

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
}) => {
  // Safe validation for optional parameters
  const hasValidWidth =
    layout_width &&
    typeof layout_width === "string" &&
    layout_width?.trim() !== "";
  const hasValidPadding =
    padding && typeof padding === "string" && padding?.trim() !== "";
  const hasValidMargin =
    margin && typeof margin === "string" && margin?.trim() !== "";
  const hasValidPosition =
    position && typeof position === "string" && position?.trim() !== "";
  const hasValidGap =
    layout_gap && typeof layout_gap === "string" && layout_gap?.trim() !== "";

  // Build optional Tailwind classes
  const optionalClasses = [
    hasValidWidth ? `w-[${layout_width}]` : "",
    hasValidPadding ? `p-[${padding}]` : "",
    hasValidMargin ? `m-[${margin}]` : "",
    hasValidPosition ? position : "",
    hasValidGap ? `gap-[${layout_gap}]` : "",
  ]
    ?.filter(Boolean)
    ?.join(" ");

  // Build inline styles for required parameters
  const buttonStyles = {
    fontSize: text_font_size ? `${text_font_size}px` : "24px",
    fontFamily: text_font_family || "Montserrat",
    fontWeight: text_font_weight || "600",
    lineHeight: text_line_height || "30px",
    textAlign: text_text_align || "center",
    color: text_color || "#3c2b3e",
    backgroundColor: fill_background_color || "#d8bfd8",
    borderRadius: border_border_radius || "8px",
    boxShadow: effect_box_shadow || "0px 0px 15px #d8bfd866",
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
