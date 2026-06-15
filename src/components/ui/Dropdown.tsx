// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

const Dropdown = ({
  // Required parameters with defaults
  placeholder = "Select level",
  text_font_size = "16",
  text_font_family = "Nimbus Sans",
  text_font_weight = "400",
  text_line_height = "20px",
  text_text_align = "left",
  text_color = "#879392",
  fill_background_color = "#11212e",
  border_border = "1 solid #3e4949",
  border_border_radius = "8px",

  // Optional parameters (no defaults)
  layout_gap,
  layout_width,
  padding,
  position,

  // Standard React props
  variant,
  size,
  options = [],
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  name,
  id,
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    value || defaultValue || "",
  );
  const dropdownRef = useRef(null);

  // Safe validation for optional parameters
  const hasValidWidth =
    layout_width &&
    typeof layout_width === "string" &&
    layout_width?.trim() !== "";
  const hasValidPadding =
    padding && typeof padding === "string" && padding?.trim() !== "";
  const hasValidPosition =
    position && typeof position === "string" && position?.trim() !== "";
  const hasValidGap =
    layout_gap && typeof layout_gap === "string" && layout_gap?.trim() !== "";

  // Build optional Tailwind classes
  const optionalClasses = [
    hasValidWidth ? `w-[${layout_width}]` : "",
    hasValidPadding ? `p-[${padding}]` : "",
    hasValidPosition ? position : "",
    hasValidGap ? `gap-[${layout_gap}]` : "",
  ]
    ?.filter(Boolean)
    ?.join(" ");

  // Parse border style
  const borderParts = border_border?.split(" ");
  const borderWidth = borderParts?.[0] || "1";
  const borderStyle = borderParts?.[1] || "solid";
  const borderColor = borderParts?.[2] || "#3e4949";

  // Build inline styles for required parameters
  const dropdownStyles = {
    fontSize: text_font_size ? `${text_font_size}px` : "16px",
    fontFamily: text_font_family || "Nimbus Sans",
    fontWeight: text_font_weight || "400",
    lineHeight: text_line_height || "20px",
    textAlign: text_text_align || "left",
    color: text_color || "#879392",
    backgroundColor: fill_background_color || "#11212e",
    border: `${borderWidth}px ${borderStyle} ${borderColor}`,
    borderRadius: border_border_radius || "8px",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event?.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update selected value when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    const newValue = typeof option === "object" ? option?.value : option;
    setSelectedValue(newValue);
    setIsOpen(false);

    if (typeof onChange === "function") {
      const event = {
        target: { name, value: newValue },
        currentTarget: { name, value: newValue },
      };
      onChange(event);
    }
  };

  const getDisplayValue = () => {
    if (!selectedValue) return placeholder;

    const selectedOption = options?.find((opt) =>
      typeof opt === "object"
        ? opt?.value === selectedValue
        : opt === selectedValue,
    );

    return selectedOption
      ? typeof selectedOption === "object"
        ? selectedOption?.label
        : selectedOption
      : placeholder;
  };

  return (
    <div
      className={twMerge(
        "relative flex flex-col",
        hasValidGap ? `gap-[${layout_gap}]` : "gap-2",
      )}
      ref={dropdownRef}
    >
      {label && (
        <label
          htmlFor={id || name}
          className="text-sm font-medium text-text-primary mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        id={id || name}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id || name}-listbox`}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e?.key === "Enter" || e?.key === " ") {
            e?.preventDefault();
            handleToggle();
          }
        }}
        style={dropdownStyles}
        className={twMerge(
          "flex items-center justify-between bg-[#11212e] border border-[#3e4949] px-4 py-3",
          error && "border-red-500 focus:ring-red-500",
          className,
        )}
      >
        <span className={!selectedValue ? "opacity-60" : ""}>
          {getDisplayValue()}
        </span>
        <svg
          className={twMerge(
            "w-5 h-5 transition-transform duration-200",
            isOpen && "transform rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <ul
          id={`${id || name}-listbox`}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-[#11212e] border border-[#3e4949] rounded-lg shadow-lg max-h-60 overflow-auto text-[#879392]"
          style={{
            top: "100%",
            fontFamily: text_font_family,
            fontSize: text_font_size ? `${text_font_size}px` : "16px",
          }}
        >
          {options?.length === 0 ? (
            <li className="px-4 py-2 text-text-secondary">
              No options available
            </li>
          ) : (
            options?.map((option, index) => {
              const optionValue =
                typeof option === "object" ? option?.value : option;
              const optionLabel =
                typeof option === "object" ? option?.label : option;
              const isSelected = optionValue === selectedValue;

              return (
                <li
                  key={index}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  onKeyDown={(e) => {
                    if (e?.key === "Enter" || e?.key === " ") {
                      e?.preventDefault();
                      handleSelect(option);
                    }
                  }}
                  tabIndex={0}
                  className={twMerge(
                    "px-4 py-3 cursor-pointer transition-colors duration-150 text-[#879392]",
                    "hover:bg-[#76d6d520] focus:bg-[#76d6d520] focus:outline-none",
                    isSelected && "bg-[#d8bfd830] text-[#d8bfd8] font-medium",
                  )}
                >
                  {optionLabel}
                </li>
              );
            })
          )}
        </ul>
      )}
      {(helperText || error) && (
        <p
          id={`${id || name}-helper`}
          className={twMerge(
            "text-xs mt-1",
            error ? "text-red-500" : "text-text-secondary",
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Dropdown;
