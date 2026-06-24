// @ts-nocheck
import React, { useState, useEffect } from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { Check } from "lucide-react";

const checkboxClasses = cva(
  "flex items-center cursor-pointer transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:opacity-80",
        accent: "hover:opacity-90",
      },
      size: {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  },
);

const CheckBox = ({
  // Required parameters with defaults
  text = "I agree to the Protocol Terms and Privacy Policy",
  text_font_size = "16",
  text_font_family = "Open Sans",
  text_font_weight = "400",
  text_line_height = "22px",
  text_text_align = "left",
  text_color = "#bdc9c8",

  // Optional parameters (no defaults)
  layout_gap,
  layout_width,
  margin,
  position,

  // Standard React props
  variant,
  size,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  required = false,
  name,
  id,
  value,
  error,
  className,
  ...props
}: any) => {
  const [isChecked, setIsChecked] = useState(
    checked !== undefined ? checked : defaultChecked,
  );

  // Safe validation for optional parameters
  const hasValidWidth =
    layout_width &&
    typeof layout_width === "string" &&
    layout_width?.trim() !== "";
  const hasValidMargin =
    margin && typeof margin === "string" && margin?.trim() !== "";
  const hasValidPosition =
    position && typeof position === "string" && position?.trim() !== "";
  const hasValidGap =
    layout_gap && typeof layout_gap === "string" && layout_gap?.trim() !== "";

  // Build optional Tailwind classes
  const optionalClasses = [
    hasValidWidth ? `w-[${layout_width}]` : "",
    hasValidMargin ? `m-[${margin}]` : "",
    hasValidPosition ? position : "",
  ]
    ?.filter(Boolean)
    ?.join(" ");

  // Build inline styles for required parameters
  const textStyles = {
    fontSize: text_font_size ? `${text_font_size}px` : "16px",
    fontFamily: text_font_family || "Open Sans",
    fontWeight: text_font_weight || "400",
    lineHeight: text_line_height || "22px",
    textAlign: text_text_align || "left",
    color: text_color || "#bdc9c8",
  };

  // Update internal state when controlled checked prop changes
  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleChange = (e) => {
    const newChecked = e?.target?.checked;

    // Only update internal state if not controlled
    if (checked === undefined) {
      setIsChecked(newChecked);
    }

    if (typeof onChange === "function") {
      onChange(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === " " || e?.key === "Enter") {
      e?.preventDefault();
      if (!disabled) {
        const syntheticEvent = {
          target: { checked: !isChecked, name, value },
          currentTarget: { checked: !isChecked, name, value },
        };
        handleChange(syntheticEvent);
      }
    }
  };

  return (
    <label
      className={twMerge(
        checkboxClasses({ variant, size }),
        hasValidGap ? `gap-[${layout_gap}]` : "gap-3",
        optionalClasses,
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id || name}
          name={name}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="sr-only peer"
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
        <div
          className={twMerge(
            "w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center",
            "peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary",
            isChecked
              ? "bg-white border-primary"
              : "bg-transparent border-outline",
            error && "border-red-500",
            disabled && "cursor-not-allowed",
            className,
          )}
        >
          {isChecked && (
            <Check className="w-3 h-3" stroke="#000000" strokeWidth={3.5} />
          )}
        </div>
      </div>
      <span style={textStyles} className="select-none">
        {text}
      </span>
    </label>
  );
};

export default CheckBox;
