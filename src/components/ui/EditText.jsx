import React, { useState } from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const inputClasses = cva(
  'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-teal-light focus:border-primary-teal-light disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-background-card border-border-primary text-text-secondary hover:border-primary-teal-light',
        filled: 'bg-background-input border-border-primary text-text-primary',
        outline: 'bg-transparent border-2 border-border-primary text-text-primary',
      },
      size: {
        small: 'text-sm px-3 py-2',
        medium: 'text-base px-4 py-3',
        large: 'text-lg px-5 py-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  }
);

const EditText = ({
  // Required parameters with defaults
  placeholder = "••••••••••••",
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
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Safe validation for optional parameters
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width?.trim() !== '';
  const hasValidPadding = padding && typeof padding === 'string' && padding?.trim() !== '';
  const hasValidMargin = margin && typeof margin === 'string' && margin?.trim() !== '';
  const hasValidPosition = position && typeof position === 'string' && position?.trim() !== '';
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap?.trim() !== '';

  // Build optional Tailwind classes
  const optionalClasses = [
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidMargin ? `m-[${margin}]` : '',
    hasValidPosition ? position : '',
    hasValidGap ? `gap-[${layout_gap}]` : '',
  ]?.filter(Boolean)?.join(' ');

  // Parse border style
  const borderParts = border_border?.split(' ');
  const borderWidth = borderParts?.[0] || '1';
  const borderStyle = borderParts?.[1] || 'solid';
  const borderColor = borderParts?.[2] || '#3e4949';

  // Build inline styles for required parameters
  const inputStyles = {
    fontSize: text_font_size ? `${text_font_size}px` : '16px',
    fontFamily: text_font_family || 'Nimbus Sans',
    fontWeight: text_font_weight || '400',
    lineHeight: text_line_height || '20px',
    textAlign: text_text_align || 'left',
    color: text_color || '#879392',
    backgroundColor: fill_background_color || '#11212e',
    border: `${borderWidth}px ${borderStyle} ${borderColor}`,
    borderRadius: border_border_radius || '8px',
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (typeof onFocus === 'function') {
      onFocus(e);
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (typeof onBlur === 'function') {
      onBlur(e);
    }
  };

  const handleChange = (e) => {
    if (typeof onChange === 'function') {
      onChange(e);
    }
  };

  return (
    <div className={twMerge('flex flex-col', hasValidGap ? `gap-[${layout_gap}]` : 'gap-2')}>
      {label && (
        <label
          htmlFor={id || name}
          className="text-sm font-medium text-text-primary mb-1"
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
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={helperText || error ? `${id || name}-helper` : undefined}
        {...props}
      />
      {(helperText || error) && (
        <p
          id={`${id || name}-helper`}
          className={twMerge(
            'text-xs mt-1',
            error ? 'text-red-500' : 'text-text-secondary'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default EditText;