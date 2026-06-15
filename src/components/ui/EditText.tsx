// @ts-nocheck
import React, { useState } from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const inputClasses = cva(
  "w-full rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim focus:border-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-surface/50 border border-on-surface/10 text-on-surface placeholder:text-on-surface/40 hover:border-primary-fixed-dim/50",
        filled:
          "bg-surface-container border border-on-surface/10 text-on-surface placeholder:text-on-surface/40",
        outline:
          "bg-transparent border-2 border-on-surface/10 text-on-surface placeholder:text-on-surface/40",
      },
      size: {
        small: "text-sm px-3 py-2",
        medium: "text-base px-4 py-3",
        large: "text-lg px-5 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  },
);

const EditText = ({
  // Required parameters with defaults
  placeholder = "••••••••••••",
  text_font_size = "16",

  // Optional parameters (no defaults)
  layout_gap,
  layout_width,
  padding,
  position,
  margin,

  // Standard React props
  variant,
  size,
  type = "text",
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  id,
  label,
  error,
  helperText,
  className,
  ...props
}: any) => {
  const [isFocused, setIsFocused] = useState(false);

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

  // Only fontSize is customizable via inline styles
  const inputStyles: React.CSSProperties = {
    fontSize: text_font_size ? `${text_font_size}px` : "16px",
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (typeof onFocus === "function") {
      onFocus(e);
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (typeof onBlur === "function") {
      onBlur(e);
    }
  };

  const handleChange = (e) => {
    if (typeof onChange === "function") {
      onChange(e);
    }
  };

  return (
    <div
      className={twMerge(
        "flex flex-col",
        hasValidGap ? `gap-[${layout_gap}]` : "gap-2",
      )}
    >
      {label && (
        <label
          htmlFor={id || name}
          className="text-sm font-normal text-on-surface pl-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id || name}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        style={inputStyles}
        className={twMerge(
          inputClasses({ variant, size }),
          optionalClasses,
          error && "border-red-500 focus:ring-red-500",
          className,
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          helperText || error ? `${id || name}-helper` : undefined
        }
        {...props}
      />
      {(helperText || error) && (
        <p
          id={`${id || name}-helper`}
          className={twMerge(
            "text-xs mt-1",
            error ? "text-red-500" : "text-on-surface-variant",
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default EditText;
