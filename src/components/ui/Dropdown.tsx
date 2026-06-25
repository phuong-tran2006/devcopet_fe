import { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

const Dropdown = ({
  // Required parameters with defaults
  placeholder = "Select level",
  text_font_size = "16",

  // Optional parameters (no defaults)
  layout_gap,
  layout_width,
  padding,
  position,

  // Standard React props
  options = [],
  value,
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  name,
  id,
  label,
  error,
  helperText,
  className,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    value || defaultValue || "",
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Only fontSize is customizable via inline styles
  const dropdownStyles: React.CSSProperties = {
    fontSize: text_font_size ? `${text_font_size}px` : "16px",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event?.target as Node)
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

  const handleSelect = (option: any) => {
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

    const selectedOption = options?.find((opt: any) =>
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
        optionalClasses,
      )}
      ref={dropdownRef}
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
          "flex items-center justify-between bg-surface/50 border border-on-surface/10 rounded-lg px-4 py-3 text-on-surface cursor-pointer transition-all duration-200 hover:border-primary-fixed-dim/50 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim focus:border-primary-fixed-dim",
          !selectedValue && "text-on-surface/40",
          error && "border-red-500 focus:ring-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <span className={!selectedValue ? "opacity-60" : ""}>
          {getDisplayValue()}
        </span>
        <ChevronDown
          className={twMerge(
            "w-5 h-5 text-on-surface-variant transition-transform duration-200",
            isOpen && "transform rotate-180",
          )}
        />
      </div>
      {isOpen && (
        <ul
          id={`${id || name}-listbox`}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-surface-container border border-on-surface/10 rounded-lg shadow-lg max-h-60 overflow-auto"
          style={{
            top: "100%",
            fontSize: text_font_size ? `${text_font_size}px` : "16px",
          }}
        >
          {options?.length === 0 ? (
            <li className="px-4 py-2 text-on-surface-variant">
              No options available
            </li>
          ) : (
            options?.map((option: any, index: number) => {
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
                  onKeyDown={(e: any) => {
                    if (e?.key === "Enter" || e?.key === " ") {
                      e?.preventDefault();
                      handleSelect(option);
                    }
                  }}
                  tabIndex={0}
                  className={twMerge(
                    "px-4 py-3 cursor-pointer transition-colors duration-150 text-on-surface-variant",
                    "hover:bg-primary-fixed-dim/10 focus:bg-primary-fixed-dim/10 focus:outline-none",
                    isSelected &&
                      "bg-primary-fixed-dim/20 text-primary-fixed-dim font-medium",
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
            error ? "text-red-500" : "text-on-surface-variant",
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Dropdown;
